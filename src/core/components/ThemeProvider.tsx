'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { THEMES, FONTS, FONT_SIZES, applyTheme, applyFont, Theme } from '../lib/themes';
import { applyBackground, BackgroundConfig } from '../lib/backgrounds';
import { User } from '../types';

interface ThemeContextType {
    // Theme
    currentTheme: string;
    setTheme: (theme: string) => void;

    // Custom colors
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;

    // Font
    fontFamily: string;
    setFontFamily: (font: string) => void;
    fontSize: string;
    setFontSize: (size: string) => void;

    // Background
    backgroundType: 'gradient' | 'solid' | 'image' | 'pattern';
    setBackgroundType: (type: 'gradient' | 'solid' | 'image' | 'pattern') => void;
    backgroundValue: string;
    setBackgroundValue: (value: string) => void;
    backgroundBlur: number;
    setBackgroundBlur: (blur: number) => void;

    // User info for personalization
    userId: number | null;

    // Actions
    loadUserSettings: (user: User) => void;
    saveSettings: () => Promise<void>;
    resetToDefaults: () => void;
}

const defaultContext: ThemeContextType = {
    currentTheme: 'midnight',
    setTheme: () => { },
    primaryColor: '#818cf8',
    setPrimaryColor: () => { },
    accentColor: '#6366f1',
    setAccentColor: () => { },
    backgroundColor: '#0B0E17',
    setBackgroundColor: () => { },
    fontFamily: 'inter',
    setFontFamily: () => { },
    fontSize: 'medium',
    setFontSize: () => { },
    backgroundType: 'gradient',
    setBackgroundType: () => { },
    backgroundValue: 'midnight',
    setBackgroundValue: () => { },
    backgroundBlur: 0,
    setBackgroundBlur: () => { },
    userId: null,
    loadUserSettings: () => { },
    saveSettings: async () => { },
    resetToDefaults: () => { },
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function useTheme() {
    return useContext(ThemeContext);
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    // Theme state
    const [currentTheme, setCurrentTheme] = useState('midnight');
    const [primaryColor, setPrimaryColor] = useState('#818cf8');
    const [accentColor, setAccentColor] = useState('#6366f1');
    const [backgroundColor, setBackgroundColor] = useState('#0B0E17');

    // Font state
    const [fontFamily, setFontFamily] = useState('inter');
    const [fontSize, setFontSize] = useState('medium');

    // Background state
    const [backgroundType, setBackgroundType] = useState<'gradient' | 'solid' | 'image' | 'pattern'>('gradient');
    const [backgroundValue, setBackgroundValue] = useState('midnight');
    const [backgroundBlur, setBackgroundBlur] = useState(0);

    // User
    const [userId, setUserId] = useState<number | null>(null);

    // Apply theme when values change
    useEffect(() => {
        const theme = THEMES[currentTheme] || THEMES.midnight;
        applyTheme(theme, {
            primary: primaryColor !== theme.primary ? primaryColor : undefined,
            accent: accentColor !== theme.accent ? accentColor : undefined,
            background: backgroundColor !== theme.background ? backgroundColor : undefined,
        });
    }, [currentTheme, primaryColor, accentColor, backgroundColor]);

    // Apply font when values change
    useEffect(() => {
        applyFont(fontFamily, fontSize);
    }, [fontFamily, fontSize]);

    // Apply background when values change
    useEffect(() => {
        const config: BackgroundConfig = {
            type: backgroundType,
            value: backgroundValue,
            blur: backgroundBlur,
        };
        applyBackground(config);
    }, [backgroundType, backgroundValue, backgroundBlur]);

    // Load settings from user object
    const loadUserSettings = useCallback((user: User) => {
        setUserId(user.id);

        // Set all values (use defaults if not provided)
        const newTheme = user.theme || 'midnight';
        const newPrimary = user.primary_color || '#818cf8';
        const newAccent = user.accent_color || '#6366f1';
        const newBackground = user.background_color || '#0B0E17';
        const newFontFamily = user.font_family || 'inter';
        const newFontSize = user.font_size || 'medium';
        const newBgType = (user.background_type as 'gradient' | 'solid' | 'image' | 'pattern') || 'gradient';
        const newBgValue = user.background_value || 'midnight';
        const newBgBlur = user.background_blur ?? 0;

        setCurrentTheme(newTheme);
        setPrimaryColor(newPrimary);
        setAccentColor(newAccent);
        setBackgroundColor(newBackground);
        setFontFamily(newFontFamily);
        setFontSize(newFontSize);
        setBackgroundType(newBgType);
        setBackgroundValue(newBgValue);
        setBackgroundBlur(newBgBlur);

        // Immediately apply to DOM (don't wait for useEffect)
        const themeObj = THEMES[newTheme] || THEMES.midnight;
        applyTheme(themeObj, {
            primary: newPrimary !== themeObj.primary ? newPrimary : undefined,
            accent: newAccent !== themeObj.accent ? newAccent : undefined,
            background: newBackground !== themeObj.background ? newBackground : undefined,
        });
        applyFont(newFontFamily, newFontSize);
        applyBackground({
            type: newBgType,
            value: newBgValue,
            blur: newBgBlur,
        });
    }, []);

    // Save settings to server
    const saveSettings = useCallback(async () => {
        if (!userId) return;

        try {
            await fetch('/api/settings/personalization', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: currentTheme,
                    primaryColor,
                    accentColor,
                    backgroundColor,
                    fontFamily,
                    fontSize,
                    backgroundType,
                    backgroundValue,
                    backgroundBlur,
                }),
            });
        } catch (error) {
            console.error('Failed to save theme settings:', error);
        }
    }, [userId, currentTheme, primaryColor, accentColor, backgroundColor, fontFamily, fontSize, backgroundType, backgroundValue, backgroundBlur]);

    // Reset to defaults
    const resetToDefaults = useCallback(() => {
        setCurrentTheme('midnight');
        setPrimaryColor('#818cf8');
        setAccentColor('#6366f1');
        setBackgroundColor('#0B0E17');
        setFontFamily('inter');
        setFontSize('medium');
        setBackgroundType('gradient');
        setBackgroundValue('midnight');
        setBackgroundBlur(0);
    }, []);

    // Wrapper setters that also update theme base colors when theme changes
    const handleSetTheme = useCallback((theme: string) => {
        setCurrentTheme(theme);
        const themeObj = THEMES[theme];
        if (themeObj) {
            setPrimaryColor(themeObj.primary);
            setAccentColor(themeObj.accent);
            setBackgroundColor(themeObj.background);
        }
    }, []);

    const value = React.useMemo<ThemeContextType>(() => ({
        currentTheme,
        setTheme: handleSetTheme,
        primaryColor,
        setPrimaryColor,
        accentColor,
        setAccentColor,
        backgroundColor,
        setBackgroundColor,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        backgroundType,
        setBackgroundType,
        backgroundValue,
        setBackgroundValue,
        backgroundBlur,
        setBackgroundBlur,
        userId,
        loadUserSettings,
        saveSettings,
        resetToDefaults,
    }), [
        currentTheme, handleSetTheme,
        primaryColor, accentColor, backgroundColor,
        fontFamily, fontSize,
        backgroundType, backgroundValue, backgroundBlur,
        userId, loadUserSettings, saveSettings, resetToDefaults
    ]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;
