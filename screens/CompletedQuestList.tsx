import type React from "react";
import { useQuestStore } from "../utils/quest";
import { Loader } from "../components/Loader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { useColorPalette } from "../utils/useColorPalette";
import { SimpleHeader } from "../components/SimpleHeader";
import { FlatList } from "react-native-gesture-handler";
import { CompletedQuestRow, InactiveQuestRow } from "../components/QuestRow";
import { Text } from "@rneui/base";

type CompletedQuestListProps = Record<string, never>;

export const CompletedQuestList: React.FC<CompletedQuestListProps> = _ => {
    const insets = useSafeAreaInsets();
    const questStore = useQuestStore();
    const { background, textSecondary } = useColorPalette();

    if (questStore.loading) {
        return <Loader size="large" />;
    }

    const { completedQuests, unclaimQuest, deleteCompletedQuest } = questStore;
    const hasCompletedQuests = completedQuests.length > 0;

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                backgroundColor: background
            }}
        >
            <View style={[styles.container, hasCompletedQuests ? {} : { alignItems: "center" }]}>
                <SimpleHeader title="Completed Quests" backButton />
                {hasCompletedQuests ? (
                    <FlatList
                        data={completedQuests}
                        keyExtractor={quest => `${quest.id}`}
                        renderItem={item => (
                            <CompletedQuestRow
                                quest={item.item}
                                onUnclaim={() => unclaimQuest(item.item.id)}
                                onDelete={() => deleteCompletedQuest(item.item.id)}
                            />
                        )}
                    />
                ) : (
                    <View style={styles.hintContainer}>
                        <Text h4 style={{ color: textSecondary }}>
                            Complete some quests to see them here
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        height: "100%",
        paddingHorizontal: 5
    },
    hintContainer: {
        position: "absolute",
        top: "50%"
    },
    createQuestButton: {
        position: "absolute",
        top: 10,
        right: 15,
        zIndex: 5
    }
});
