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
    backgroundColor: '#F9F8F7',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    paddingHorizontal: 16,
  },

  subtitle: {
    fontSize: 16,
    color: '#5C4033',
    marginTop: 8,
    lineHeight: 24,
    paddingHorizontal: 16,
  },


  listContainer: {
    marginTop: 30,
    paddingHorizontal: 16,
  },

  languageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 22,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedLanguageCard: {
    borderWidth: 2,
    borderColor: '#FF6B00',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  iconText: {
    fontSize: 22,
  },

  languageName: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
  },

  languageSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },

  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D8B4A6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterSelected: {
    borderColor: '#FF6B00',
  },

  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF6B00',
  },
});