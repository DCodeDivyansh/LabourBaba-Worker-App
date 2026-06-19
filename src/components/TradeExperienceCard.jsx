import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import TradeIcon from '../../assets/TradeIcon.svg';

const TradeExperienceCard = () => {
    const [selected, setSelected] = useState([]);

    const skills = [
        // 'Electrician',
        // 'Plumber',
        'Mason',
        // 'Carpenter',
        // 'Painter',
        'Labour',
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
                <TradeIcon style={styles.icon} />

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
                <TextInput
                    style={styles.dropdownText}
                    keyboardType="numeric"
                    placeholder="Select experience..."
                />
            </TouchableOpacity>

            <Text style={styles.label}>
                Expected Daily Wage (₹)
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput
                    placeholder="Min ₹"
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1 }]}
                />

                <TextInput
                    placeholder="Max ₹"
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1 }]}
                />
            </View>
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
        marginBottom: 30,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    icon: {
        height: 20,
        width: 20,
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