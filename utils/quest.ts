import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export type Quest = {
    id: number;
    title: string;
    desc: string;
    xp: number;
};

export type QuestArgs = Omit<Quest, "id">;

type LoadedQuestStore = {
    readonly loading: false;
    readonly activeQuests: readonly Readonly<Quest>[];
    readonly completedQuests: readonly Readonly<Quest>[];
    // Total XP
    readonly xp: number;
    // Current level
    readonly level: number;
    // XP required to get from current xp to next level
    readonly xpUntilNextLevel: number;
    // XP required to get from start of current level to next level
    readonly levelXpRequirement: number;

    createQuest(questArgs: Omit<Quest, "id">): void;
    cancelQuest(id: number): void;
    claimQuest(id: number): void;
    unclaimQuest(id: number): void;
    deleteCompletedQuest(id: number): void;
};

type LoadingQuestStore = {
    loading: true;
};

type QuestStore = LoadedQuestStore | LoadingQuestStore;

type InternalQuestStore = QuestStore & {
    register(update: (i: number) => void): number;
    unregister(id: number): void;
};

const { getCurrentLevel, getTotalXpRequirement } = (() => {
    const f = 1.05; // Progression factor
    const x0 = 100; // XP required for first level

    const baseDenom = Math.log(f);
    const log = (x: number) => Math.log(x) / baseDenom;

    function getCurrentLevel(xp: number): number {
        return Math.floor(log(1 - (1 - f) * (xp / x0)));
    }

    function adjust(xpRequirement: number): number {
        const n0 = getCurrentLevel(xpRequirement);
        const n1 = getCurrentLevel(xpRequirement + 1);
        const n2 = getCurrentLevel(xpRequirement + 2);

        if (n1 !== n0) {
            return xpRequirement + 1;
        } else if (n2 !== n0) {
            return xpRequirement + 2;
        }

        return xpRequirement;
    }

    function getTotalXpRequirement(currentLevel: number): number {
        const xp = Math.ceil(x0 * ((1 - f ** currentLevel) / (1 - f)));

        return adjust(xp);
    }

    return {
        getCurrentLevel,
        getTotalXpRequirement
    };
})();

const questStore = ((): InternalQuestStore => {
    type SerializedQuestStore = {
        activeQuests: Quest[];
        completedQuests: Quest[];
    };

    const questStoreKey = "quest-store";
    const _listeners: Record<number, (i: number) => void> = {};
    let _nextListenerId = 1;
    let _updateId = 1;
    const _activeQuests: Quest[] = [];
    const _completedQuests: Quest[] = [];
    let _loading = true;
    let _currId = 0;
    let _xp = 0;
    let _level = 0;
    let _totalXpNeeded = 0;
    let _xpUntilNextLevel = 0;
    let _levelXpRequirement = 0;

    function _updateDependentVars(): void {
        _xp = _completedQuests.reduce((a, x) => a + x.xp, 0);
        _level = getCurrentLevel(_xp);
        _totalXpNeeded = getTotalXpRequirement(_level + 1);
        _xpUntilNextLevel = _totalXpNeeded - _xp;
        _levelXpRequirement = _totalXpNeeded - getTotalXpRequirement(_level);
    }

    function _updateListeners(): void {
        for (const id in _listeners) {
            _listeners[id](_updateId);
        }
        _updateId = Math.max(1, (_updateId + 1) % ~(1 << 31));
    }

    function _getNextId(): number {
        _currId = (_currId + 1) % (1 << 31);

        return _currId;
    }

    async function _writeQuestStore(): Promise<void> {
        try {
            const store: SerializedQuestStore = {
                activeQuests: _activeQuests,
                completedQuests: _completedQuests
            };

            await AsyncStorage.setItem(questStoreKey, JSON.stringify(store));
        } catch (err) {
            console.error("Failed to write to quest store: ", err);
        }
    }

    void (async () => {
        try {
            const questStoreAsStr = await AsyncStorage.getItem(questStoreKey);
            if (!questStoreAsStr) {
                console.log("Failed to read from quest store: Quest store was empty");
                _currId = 0;
                _loading = false;
                _updateDependentVars();
                _updateListeners();
                return;
            }

            const value: SerializedQuestStore = JSON.parse(questStoreAsStr);

            for (const quest of value.activeQuests) {
                _activeQuests.push(quest);
            }

            for (const quest of value.completedQuests) {
                _completedQuests.push(quest);
            }
        } catch (err) {
            console.error("Failed to read from quest store: ", err);
            _activeQuests.splice(0, _activeQuests.length);
            _completedQuests.splice(0, _completedQuests.length);
        } finally {
            _currId = [..._activeQuests, ..._completedQuests].reduce(
                (a, x) => Math.max(a, x.id),
                0
            );
            _loading = false;
            _updateDependentVars();
            _updateListeners();
        }
    })();

    return {
        get loading() {
            return _loading;
        },
        get activeQuests() {
            return _activeQuests;
        },
        get completedQuests() {
            return _completedQuests;
        },
        get xp() {
            return _xp;
        },
        get level() {
            return _level;
        },
        get xpUntilNextLevel() {
            return _xpUntilNextLevel;
        },
        get levelXpRequirement() {
            return _levelXpRequirement;
        },
        createQuest(questArgs) {
            const quest = { ...questArgs, id: _getNextId() };

            _activeQuests.push(quest);
            _updateListeners();
            void _writeQuestStore();
        },
        claimQuest(id) {
            const questIndex = _activeQuests.findIndex(q => q.id === id);

            if (questIndex === -1) {
                return;
            }

            const [quest] = _activeQuests.splice(questIndex, 1);
            _completedQuests.push(quest);
            _updateDependentVars();
            _updateListeners();
            void _writeQuestStore();
        },
        cancelQuest(id) {
            const questIndex = _activeQuests.findIndex(q => q.id === id);

            if (questIndex === -1) {
                return;
            }

            _activeQuests.splice(questIndex, 1);
            _updateListeners();
            void _writeQuestStore();
        },
        unclaimQuest(id) {
            const questIndex = _completedQuests.findIndex(q => q.id === id);

            if (questIndex === -1) {
                return;
            }

            const [quest] = _completedQuests.splice(questIndex, 1);
            _activeQuests.push(quest);
            _updateDependentVars();
            _updateListeners();
            void _writeQuestStore();
        },
        deleteCompletedQuest(id) {
            const questIndex = _completedQuests.findIndex(q => q.id === id);

            if (questIndex === -1) {
                return;
            }

            _completedQuests.splice(questIndex, 1);
            _updateDependentVars();
            _updateListeners();
            void _writeQuestStore();
        },
        register(update) {
            const id = _nextListenerId;
            _nextListenerId = (_nextListenerId + 1) % ~(1 << 31);

            _listeners[id] = update;

            return id;
        },
        unregister(id) {
            if (id in _listeners) {
                delete _listeners[id];
            }
        }
    };
})();

export function useQuestStore(): QuestStore {
    const [_, update] = React.useState(0);

    React.useEffect(() => {
        const listenerId = questStore.register(update);

        return () => {
            questStore.unregister(listenerId);
        };
    }, []);

    return questStore;
}
