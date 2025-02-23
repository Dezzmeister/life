import React from "react";
import { type QuestArgs, useQuestStore } from "../utils/quest";
import { KeyboardAvoidingView, Platform, StyleSheet, type TextInput, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SimpleHeader } from "../components/SimpleHeader";
import { useColorPalette } from "../utils/useColorPalette";
import { useNavigation } from "@react-navigation/native";
import { InactiveQuestRow } from "../components/QuestRow";
import { Loader } from "../components/Loader";
import * as Haptics from "expo-haptics";

type CreateQuestProps = Record<string, never>;

export const CreateQuest: React.FC<CreateQuestProps> = _ => {
    const navigator = useNavigation();
    const questStore = useQuestStore();
    const insets = useSafeAreaInsets();
    const { primary, background, textPrimary, textSecondary, highlight } = useColorPalette();
    const questTitleInput = React.useRef<typeof Input & TextInput>(null);
    const questXpInput = React.useRef<typeof Input & TextInput>(null);
    const questDescInput = React.useRef<typeof Input & TextInput>(null);
    const [questTitle, setQuestTitle] = React.useState("");
    const [questXp, setQuestXp] = React.useState("");
    const [questDesc, setQuestDesc] = React.useState("");
    const canSubmit = questTitle && questXp && typeof +questXp === "number";
    const questArgs: QuestArgs = {
        title: questTitle || "Placeholder Title",
        xp: +questXp,
        desc: questDesc || "Placeholder description"
    };

    const submit = React.useCallback(() => {
        if (questStore.loading) {
            return;
        }

        const questArgs = {
            title: questTitle,
            xp: +questXp,
            desc: questDesc
        };
        questStore.createQuest(questArgs);
        navigator.goBack();
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, [navigator, questStore, questTitle, questXp, questDesc]);

    if (questStore.loading) {
        return <Loader size="large" />;
    }

    return (
        <View
            style={[
                {
                    flex: 1,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                    backgroundColor: background
                },
                styles.container
            ]}
        >
            <SimpleHeader title="New Quest" backButton />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.formContainer}
            >
                <InactiveQuestRow quest={questArgs} />
                <View style={styles.inputGroup}>
                    <Input
                        ref={questTitleInput}
                        onChangeText={setQuestTitle}
                        value={questTitle}
                        placeholder="Title"
                        placeholderTextColor={textSecondary}
                        selectionColor={highlight}
                        inputContainerStyle={{ borderColor: textSecondary }}
                        style={{ color: textPrimary }}
                    />
                    <Input
                        ref={questXpInput}
                        onChangeText={setQuestXp}
                        value={questXp}
                        inputMode="numeric"
                        placeholder="XP"
                        placeholderTextColor={textSecondary}
                        selectionColor={highlight}
                        containerStyle={styles.xpInput}
                        inputContainerStyle={{ borderColor: textSecondary }}
                        style={{ color: textPrimary }}
                    />
                    <Input
                        ref={questDescInput}
                        onChangeText={setQuestDesc}
                        value={questDesc}
                        multiline
                        placeholder="Description"
                        placeholderTextColor={textSecondary}
                        selectionColor={highlight}
                        inputContainerStyle={{ borderColor: textSecondary }}
                        style={{ color: textPrimary }}
                    />
                </View>
                <Button
                    color={primary}
                    titleStyle={{ color: textPrimary }}
                    radius={8}
                    disabled={!canSubmit}
                    onPress={submit}
                >
                    Create
                </Button>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    },
    formContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        padding: 10
    },
    inputGroup: {
        width: "100%",
        alignItems: "flex-start"
    },
    xpInput: {
        width: 100
    }
});
