import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import LocationIcon from '../../assets/Location.svg';
import ExactLocationIcon from '../../assets/ExactLocation.svg';

const LocationCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <LocationIcon style={styles.icon} />

                <Text style={styles.title}>
                    Location Base
                </Text>
            </View>

            <TouchableOpacity style={styles.detectBtn}>
                <ExactLocationIcon style={styles.exactLocationIcon} />
                <Text style={styles.detectText}>
                    Auto-Detect Current Location
                </Text>
            </TouchableOpacity>

            <Text style={styles.label}>
                Current Address / Work Area
            </Text>

            <TextInput
                multiline
                placeholder="Enter building, street, and locality..."
                placeholderTextColor="#D8B6A6"
                style={styles.address}
            />
        </View>
    );
};

export default LocationCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 18,
        padding: 16,
        elevation: 3,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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

    detectBtn: {
        flexDirection: 'row',
        height: 52,
        borderWidth: 2,
        borderColor: '#FF5A00',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
    },
    exactLocationIcon: {
        height: 10,
        marginRight: 8,
    },

    detectText: {
        color: '#FF5A00',
        fontWeight: '700',
    },

    label: {
        color: '#9A7564',
        marginBottom: 6,
        marginLeft: 10,
    },

    address: {
        height: 110,
        borderWidth: 1,
        borderColor: '#C89F8D',
        borderRadius: 10,
        padding: 15,
        textAlignVertical: 'top',
    },
});