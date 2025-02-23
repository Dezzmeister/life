import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text } from "@rneui/base";
import { useColorPalette } from "../utils/useColorPalette";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

type SimpleHeaderProps = {
    title: string;
    backButton?: boolean;
};

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({ title, backButton }) => {
    const { textPrimary, primary } = useColorPalette();
    const navigation = useNavigation();

    const goBack = React.useCallback(() => {
        navigation.goBack();
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text h2 style={{ color: textPrimary }}>
                {title}
            </Text>
            {backButton && (
                <View style={styles.backButton}>
                    {/* TODO: Cross-platform */}
                    <Icon name="arrow-back-ios" onPress={goBack} color={primary} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        marginBottom: 5,
        width: "100%",
        alignItems: "center"
    },
    backButton: {
        position: "absolute",
        top: 7,
        left: 15
    }
});
