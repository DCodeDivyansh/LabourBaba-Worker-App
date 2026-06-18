import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

const TradeExperienceCard = () => {
  const [selected, setSelected] = useState([
    'Electrician',
    'Carpenter',
  ]);

  const skills = [
    'Electrician',
    'Plumber',
    'Mason',
    'Carpenter',
    'Painter',
    'General Labour',
  ];

  const toggleSkill = skill => {
    if (selected.includes(skill)) {
      setSelected(
        selected.filter(item => item !== skill),
      );
    } else if (selected.length < 3) {
      setSelected([...selected, skill]);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>🛠</Text>

        <Text style={styles.title}>
          Trade & Experience
        </Text>
      </View>

      <Text style={styles.skillLabel}>
        Select your primary skills (Max 3)
      </Text>

      <View style={styles.skillContainer}>
        {skills.map(skill => {
          const active =
            selected.includes(skill);

          return (
            <TouchableOpacity
              key={skill}
              onPress={() =>
                toggleSkill(skill)
              }
              style={[
                styles.skillChip,
                active &&
                  styles.activeChip,
              ]}>
              <Text
                style={[
                  styles.skillText,
                  active &&
                    styles.activeText,
                ]}>
                {active ? '✓ ' : ''}
                {skill}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>
        Years of Experience
      </Text>

      <TouchableOpacity style={styles.dropdown}>
        <Text style={styles.dropdownText}>
          Select experience...
        </Text>

        <Text>⌄</Text>
      </TouchableOpacity>

      <Text style={styles.label}>
        Expected Daily Wage (₹)
      </Text>

      <TextInput
        placeholder="e.g. 800"
        placeholderTextColor="#D8B6A6"
        keyboardType="numeric"
        style={styles.input}
      />
    </View>
  );
};

export default TradeExperienceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  icon: {
    fontSize: 20,
    marginRight: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  skillLabel: {
    color: '#6D4C41',
    marginBottom: 14,
  },

  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  skillChip: {
    borderWidth: 1,
    borderColor: '#D8B6A6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 10,
  },

  activeChip: {
    backgroundColor: '#FF5A00',
    borderColor: '#FF5A00',
  },

  skillText: {
    color: '#6D4C41',
    fontWeight: '600',
  },

  activeText: {
    color: '#FFF',
  },

  label: {
    color: '#9A7564',
    marginBottom: 6,
    marginLeft: 10,
  },

  dropdown: {
    height: 56,
    borderWidth: 1,
    borderColor: '#C89F8D',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownText: {
    fontSize: 16,
    color: '#333',
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#C89F8D',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});