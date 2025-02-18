import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import Swipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { Icon, Text } from "@rneui/base";
import { useColorPalette } from "../utils/useColorPalette";
import type { Quest, QuestArgs } from "../utils/quest";

type ActiveQuestRowProps = {
    quest: Quest;
    onDelete: () => void;
    onClaim: () => void;
};

type CompletedQuestRowProps = {
    quest: Quest;
    onUnclaim: () => void;
    onDelete: () => void;
};

type InactiveQuestRowProps = {
    quest: QuestArgs;
};

// TODO: Consolidate these three components

export const ActiveQuestRow: React.FC<ActiveQuestRowProps> = ({ quest, onDelete, onClaim }) => {
    const { title, desc, xp } = quest;
    const { surface, textPrimary, textSecondary, error, success } = useColorPalette();
    const row = React.useRef<SwipeableMethods>(null);

    const confirmDelete = React.useCallback(() => {
        Alert.alert("Delete Quest", `Are you sure you want to delete ${title}?`, [
            {
                text: "Cancel",
                onPress: () => row.current?.close(),
                style: "cancel"
            },
            {
                text: "Confirm",
                onPress: onDelete
            }
        ]);
    }, [title, onDelete]);

    return (
        <View style={styles.outerContainer}>
            <Swipeable
                ref={row}
                renderLeftActions={(progress, drag, swipeable) => (
                    <View style={[styles.leftActionContainer, { backgroundColor: success }]}>
                        <Icon name="attach-money" color="white" />
                        <Text h4 style={styles.leftActionText}>
                            Claim
                        </Text>
                    </View>
                )}
                renderRightActions={(progress, drag, swipeable) => (
                    <View style={[styles.rightActionContainer, { backgroundColor: error }]}>
                        <Icon name="delete" color="white" />
                        <Text h4 style={styles.rightActionText}>
                            Delete
                        </Text>
                    </View>
                )}
                onSwipeableWillOpen={dir => (dir === "left" ? onClaim() : confirmDelete())}
                containerStyle={styles.container}
                rightThreshold={150}
                leftThreshold={120}
            >
                <View style={[styles.innerContainer, { backgroundColor: surface }]}>
                    <Text h4 style={[styles.title, { color: textPrimary }]}>
                        {title}
                    </Text>
                    <Text style={[styles.xp, { color: textSecondary }]}>{xp} XP</Text>
                    <Text style={[styles.desc, { color: textPrimary }]}>{desc}</Text>
                </View>
            </Swipeable>
        </View>
    );
};

export const CompletedQuestRow: React.FC<CompletedQuestRowProps> = ({
    quest,
    onUnclaim,
    onDelete
}) => {
    const { title, desc, xp } = quest;
    const { surface, textPrimary, textSecondary, error, warning } = useColorPalette();
    const row = React.useRef<SwipeableMethods>(null);

    const confirmDelete = React.useCallback(() => {
        Alert.alert(
            "Delete Quest",
            `Are you sure you want to delete ${title}? You will lose ${xp} XP!`,
            [
                {
                    text: "Cancel",
                    onPress: () => row.current?.close(),
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: onDelete
                }
            ]
        );
    }, [title, xp, onDelete]);

    return (
        <View style={styles.outerContainer}>
            <Swipeable
                ref={row}
                renderLeftActions={(progress, drag, swipeable) => (
                    <View style={[styles.leftActionContainer, { backgroundColor: warning }]}>
                        <Icon name="money-off" color="white" />
                        <Text h4 style={styles.leftActionText}>
                            Unclaim
                        </Text>
                    </View>
                )}
                renderRightActions={(progress, drag, swipeable) => (
                    <View style={[styles.rightActionContainer, { backgroundColor: error }]}>
                        <Icon name="delete" color="white" />
                        <Text h4 style={styles.rightActionText}>
                            Delete
                        </Text>
                    </View>
                )}
                onSwipeableWillOpen={dir => (dir === "left" ? onUnclaim() : confirmDelete())}
                containerStyle={styles.container}
                rightThreshold={150}
                leftThreshold={120}
            >
                <View style={[styles.innerContainer, { backgroundColor: surface }]}>
                    <Text h4 style={[styles.title, { color: textPrimary }]}>
                        {title}
                    </Text>
                    <Text style={[styles.xp, { color: textSecondary }]}>{xp} XP</Text>
                    <Text style={[styles.desc, { color: textPrimary }]}>{desc}</Text>
                </View>
            </Swipeable>
        </View>
    );
};

export const InactiveQuestRow: React.FC<InactiveQuestRowProps> = ({ quest }) => {
    const { surface, textPrimary, textSecondary } = useColorPalette();
    const { title, xp, desc } = quest;

    return (
        <View style={[styles.outerContainer, styles.container]}>
            <View style={[styles.innerContainer, { backgroundColor: surface }]}>
                <Text h4 style={[styles.title, { color: textPrimary }]}>
                    {title}
                </Text>
                <Text style={[styles.xp, { color: textSecondary }]}>{xp} XP</Text>
                <Text style={[styles.desc, { color: textPrimary }]}>{desc}</Text>
            </View>
        </View>
    );
};

const containerHeight = 90;
const styles = StyleSheet.create({
    outerContainer: {
        width: "100%",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowColor: "#000",
        shadowRadius: 3,
        elevation: 2
    },
    container: {
        marginVertical: 5
    },
    innerContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 10,
        borderRadius: 8,
        height: containerHeight
    },
    leftActionContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        height: containerHeight,
        width: "98%",
        marginBottom: 5,
        paddingLeft: 10,
        marginHorizontal: 1
    },
    leftActionText: {
        color: "white"
    },
    rightActionContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        borderRadius: 8,
        height: containerHeight,
        width: "98%",
        marginBottom: 5,
        paddingRight: 10,
        marginHorizontal: 1
    },
    rightActionText: {
        color: "white"
    },
    title: {
        marginBottom: 0
    },
    desc: {
        flex: 1,
        fontSize: 16,
        flexWrap: "wrap",
        overflow: "hidden"
    },
    xp: {
        fontSize: 12,
        marginBottom: 3
    }
});
