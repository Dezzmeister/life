import type React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { ScreenWidth, Text } from "@rneui/base";
import { useQuestStore } from "../utils/quest";
import { useColorPalette } from "../utils/useColorPalette";
import { Loader } from "./Loader";

type XpBarProps = Record<string, never>;

const colors = [
    "#FF5733",
    "#33FF57",
    "#5733FF",
    "#FF33A1",
    "#33FFF5",
    "#F5A623",
    "#23F5A6",
    "#A623F5",
    "#F523A6",
    "#A6F523",
    "#57FF33",
    "#FF3357",
    "#33A1FF",
    "#A1FF33",
    "#FF5733",
    "#33FFAA",
    "#AA33FF",
    "#FFAA33",
    "#33FF77",
    "#77FF33",
    "#FF3377",
    "#7733FF",
    "#FF7733",
    "#33AAFF",
    "#AAFF33",
    "#FF33AA",
    "#33FFA1",
    "#A1FFAA",
    "#FFA133",
    "#33FFA6",
    "#A6FF33",
    "#FF573A",
    "#33F5A1",
    "#A1F533",
    "#573AFF",
    "#FF573A",
    "#33F5AA",
    "#A6FF57",
    "#5733A6",
    "#FF773A",
    "#33FFA1",
    "#A1FF77",
    "#7733A6",
    "#FF5733",
    "#33AA77",
    "#AAFF77",
    "#FF337A",
    "#33FFA7",
    "#A7FF33",
    "#FF573A"
];

export const XpBar: React.FC<XpBarProps> = _ => {
    const questStore = useQuestStore();
    const { highlight, textPrimary, textSecondary, background } = useColorPalette();

    if (questStore.loading) {
        // TODO: Loading view
        return <Loader size="small" />;
    }

    const { level, xpUntilNextLevel, levelXpRequirement } = questStore;
    const progress = (100 * (levelXpRequirement - xpUntilNextLevel)) / levelXpRequirement;

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <Text h2 style={{ color: textPrimary }}>
                Level {level}
            </Text>
            <View style={styles.barContainer}>
                <View style={[styles.unfilledBar, { backgroundColor: highlight }]} />
                <View
                    style={[
                        styles.filledBar,
                        { backgroundColor: colors[level % colors.length], width: `${progress}%` }
                    ]}
                />
            </View>
            <Text h4 style={{ color: textSecondary }}>
                {xpUntilNextLevel} XP to Level {level + 1}
            </Text>
        </View>
    );
};

const barPadding = 40;
const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
        width: "100%",
        alignItems: "center"
    },
    barContainer: {
        width: "100%",
        paddingHorizontal: barPadding,
        marginBottom: 5
    },
    unfilledBar: {
        height: 20,
        width: "100%",
        backgroundColor: "#eee",
        borderRadius: 10,
        zIndex: 0
    },
    filledBar: {
        position: "absolute",
        height: 20,
        left: barPadding,
        borderRadius: 10,
        zIndex: 1
    }
});
