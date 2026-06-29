import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import TopAppBar from '../../components/TopAppBar';

const languages = [
  {
    id: 1,
    name: 'English (US)',
    subtitle: 'Default System Language',
    icon: '🌐',
  },
  {
    id: 2,
    name: 'Hindi (हिन्दी)',
    icon: '文A',
  },
];

const LanguageSelectionScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(1);

  return (
    <View style={styles.container}>
        <TopAppBar title="Language"/>

      <Text style={styles.title}>Choose Language</Text>

      <Text style={styles.subtitle}>
        Select your preferred language to continue
        using LabourBaba.
      </Text>

      <View style={styles.listContainer}>
        {languages.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => setSelectedLanguage(item.id)}
            style={[
              styles.languageCard,
              selectedLanguage === item.id &&
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
                  {item.name}
                </Text>

                {item.subtitle && (
                  <Text style={styles.languageSubtitle}>
                    {item.subtitle}
                  </Text>
                )}
              </View>
            </View>

            <View
              style={[
                styles.radioOuter,
                selectedLanguage === item.id &&
                  styles.radioOuterSelected,
              ]}
            >
              {selectedLanguage === item.id && (
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