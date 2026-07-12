import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import InitialsAvatar from './InitialsAvatar'; // ⬅ NEW

const WelcomeHeader = ({ name }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.textWrap}>
        <Text style={styles.greeting}>
          {t('dashboard.welcome.greeting', {
            name: name || t('dashboard.welcome.defaultName'),
          })}
        </Text>
        <Text style={styles.subtitle}>{t('dashboard.welcome.subtitle')}</Text>
      </View>

      <InitialsAvatar name={name} size={52} borderColor="#FFFFFF" /> {/* ⬅ NEW */}
    </View>
  );
};

export default WelcomeHeader;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: 10,
    marginLeft: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textWrap: {
    flex: 1,
    marginRight: 12,
  },

  greeting: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1E1E1E',
    lineHeight: 36,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: '#6D4C41',
    fontWeight: '500',
  },
});