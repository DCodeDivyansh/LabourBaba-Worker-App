import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import BackIcon from '../../assets/BackIcon.svg';
import Share from '../../assets/share.svg'

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const TopAppBar = ({
    title,
    showBackButton = true,
}) => {
      const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {showBackButton && (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                style={styles.backButton}
                >
                    <BackIcon width={24} height={24} />
                </TouchableOpacity>
            )}

            <Text style={styles.title}>
                {title}
            </Text>

            <View style={styles.spacer} />

            {/* <TouchableOpacity style={styles.shareButton}>
                <Share width={44} height={44} />
            </TouchableOpacity> */}
        </View>
    );
};

export default TopAppBar;

const styles = StyleSheet.create({
    container: {
        top: 0,
        paddingTop: 30,
        height: 94,
        backgroundColor: '#ffffff',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingHorizontal: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
    },

    backButton: {
        padding: 4,
        height: 32,
        width: 32,
    },
    shareButton: {
        padding: 4,
        height: 32,
        width: 32,
        left:-10,
        top:-8,
    },
    spacer: {
        width: 32,
    },

    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        color: '#FF5A00',
        textAlign: 'center',
    },
});