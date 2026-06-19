import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VerifyIdentityCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Verify Your Identity</Text>
      <Text style={styles.subtitle}>
        Join the network of trusted{'\n'}
        professionals.
      </Text>
    </View>
  );
};

export default VerifyIdentityCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FF6200',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    margin: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
});