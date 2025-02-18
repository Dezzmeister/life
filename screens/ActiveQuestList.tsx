import React from "react";
import { View, StyleSheet } from "react-native";
import { ActiveQuestRow } from "../components/QuestRow";
import { useQuestStore } from "../utils/quest";
import { XpBar } from "../components/XpBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Text } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { useColorPalette } from "../utils/useColorPalette";
import { Loader } from "../components/Loader";
import { FlatList } from "react-native-gesture-handler";

type ActiveQuestListProps = Record<string, never>;

export const ActiveQuestList: React.FC<ActiveQuestListProps> = _ => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const questStore = useQuestStore();
    const { primary, background, textSecondary } = useColorPalette();

    const createQuest = React.useCallback(() => {
        navigation.navigate("CreateQuest");
    }, [navigation]);

    const goToCompletedQuests = React.useCallback(() => {
        navigation.navigate("CompletedQuestList");
    }, [navigation]);

    if (questStore.loading) {
        // TODO: Loading view
        return <Loader size="large" />;
    }

    const { activeQuests, completedQuests, cancelQuest, claimQuest } = questStore;
    const hasAnyQuests = activeQuests.length + completedQuests.length > 0;

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
            <View style={[styles.container, hasAnyQuests ? {} : { alignItems: "center" }]}>
                <View style={styles.completedQuestsButton}>
                    <Icon name="menu" onPress={goToCompletedQuests} color={primary} />
                </View>
                <View style={styles.createQuestButton}>
                    <Icon name="add" onPress={createQuest} color={primary} />
                </View>
                <XpBar />
                {hasAnyQuests ? (
                    <FlatList
                        data={activeQuests}
                        keyExtractor={quest => `${quest.id}`}
                        renderItem={item => (
                            <ActiveQuestRow
                                quest={item.item}
                                onClaim={() => claimQuest(item.item.id)}
                                onDelete={() => cancelQuest(item.item.id)}
                            />
                        )}
                    />
                ) : (
                    <View style={styles.hintContainer}>
                        <Text h4 style={{ color: textSecondary }}>
                            {/* TODO: Replace with a button */}
                            Press the '+' button to create a quest
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
    },
    completedQuestsButton: {
        position: "absolute",
        top: 10,
        left: 15,
        zIndex: 5
    }
});
