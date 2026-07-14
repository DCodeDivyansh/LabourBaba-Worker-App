import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import TopAppBar from '../../components/TopAppBar';
import { useTranslation } from 'react-i18next';
import i18n from '../../translations/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing } from '../../theme/theme';

const languages = [
  {
    code: 'en',
    name: 'English (US)',
    subtitle: 'Default System Language',
    icon: '🌐',
  },
  {
    code: 'hi',
    name: 'Hindi (हिन्दी)',
    icon: '文A',
  },
];


const LanguageSelectionScreen = () => {
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] =
    useState(i18n.language);

  const changeLanguage = async language => {
    try {
      await i18n.changeLanguage(language);

      await AsyncStorage.setItem(
        'language',
        language,
      );

      setSelectedLanguage(language);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    const loadLanguage = async () => {
      const language =
        await AsyncStorage.getItem('language');

      if (language) {
        await i18n.changeLanguage(language);
        setSelectedLanguage(language);
      }
    };

    loadLanguage();
  }, []);

  return (
    <View style={styles.container}>
      <TopAppBar
        title={t('profile.language.screenTitle')}
      />

      <Text style={styles.title}>
        {t('profile.language.chooseLanguage')}
      </Text>

      <Text style={styles.subtitle}>
        {t('profile.language.subtitle')}
      </Text>

      <View style={styles.listContainer}>
        {languages.map(item => (
          <TouchableOpacity
            key={item.code}
            activeOpacity={0.8}
            onPress={() => changeLanguage(item.code)}
            style={[
              styles.languageCard,
              selectedLanguage === item.code &&
              styles.selectedLanguageCard,
            ]}
          >
            <View style={styles.leftSection}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>
                  {item.icon}
                </Text>
              </View>

              <View>
                <Text style={styles.languageName}>
                  {item.code === 'en'
                    ? t('profile.language.options.english.name')
                    : t('profile.language.options.hindi.name')}
                </Text>

                {item.code === 'en' && (
                  <Text style={styles.languageSubtitle}>
                    {t(
                      'profile.language.options.english.subtitle',
                    )}
                  </Text>
                )}
              </View>
            </View>

            <View
              style={[
                styles.radioOuter,
                selectedLanguage === item.code &&
                styles.radioOuterSelected,
              ]}
            >
              {selectedLanguage === item.code && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LanguageSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.ink,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },

  subtitle: {
    fontSize: 15,
    color: colors.inkMuted,
    marginTop: spacing.sm,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },


  listContainer: {
    marginTop: spacing.xxl + spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  languageCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg + 2,
    paddingVertical: spacing.xl + 2,
    marginBottom: spacing.lg + 2,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedLanguageCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md + 2,
  },

  iconText: {
    fontSize: 22,
  },

  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
  },

  languageSubtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.inkSoft,
  },

  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterSelected: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
});