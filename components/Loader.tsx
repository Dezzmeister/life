import type React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useColorPalette } from "../utils/useColorPalette";

type LoaderProps = {
    size: "small" | "large";
};

export const Loader: React.FC<LoaderProps> = ({ size }) => {
    const { highlight } = useColorPalette();

    return <ActivityIndicator size={size} color={highlight} style={styles.spinner} />;
};

const styles = StyleSheet.create({
    spinner: {
        width: "100%",
        height: "100%"
    }
});
