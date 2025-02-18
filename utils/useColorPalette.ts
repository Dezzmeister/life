import React from "react";
import { useColorScheme } from "react-native";

type ColorPalette = {
    // Primary actions (buttons, links)
    primary: string;
    // Accents or secondary actions
    secondary: string;
    background: string;
    // Cards, modals, etc.
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    highlight: string;
    error: string;
    warning: string;
    success: string;
};

const lightTheme: ColorPalette = {
    primary: "#3B82F6", // Soft blue
    secondary: "#10B981", // Light green
    background: "#FFFFFF", // White
    surface: "#F3F4F6", // Light gray
    textPrimary: "#1F2937", // Dark gray
    textSecondary: "#6B7280", // Medium gray
    border: "#E5E7EB", // Light gray
    highlight: "#F59E0B", // Amber
    error: "#EF4444", // Red
    warning: "#FBBF24", // Amber-yellow
    success: "#22C55E" // Green
};

const darkTheme: ColorPalette = {
    primary: "#3B82F6", // Soft blue
    secondary: "#10B981", // Light green
    background: "#111827", // Dark slate-gray
    surface: "#1F2937", // Slightly lighter dark gray
    textPrimary: "#F9FAFB", // Very light gray
    textSecondary: "#9CA3AF", // Medium gray
    border: "#374151", // Darker gray
    highlight: "#F59E0B", // Amber
    error: "#EF4444", // Red
    warning: "#FBBF24", // Amber-yellow
    success: "#22C55E" // Green
};

export function useColorPalette(): ColorPalette {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    if (isDarkMode) {
        return darkTheme;
    }

    return lightTheme;
}
