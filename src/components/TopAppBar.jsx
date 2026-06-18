import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import BackIcon from '../../assets/BackIcon.svg';

import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';

const TopAppBar = ({
    title,
    showBackButton = true,
}) => {
    //   const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {showBackButton && (
                <TouchableOpacity
                //   onPress={() => navigation.goBack()}
                >
                    <BackIcon style={styles.backButton} />
                </TouchableOpacity>
            )}

            <Text style={styles.title}>
                {title}
            </Text>
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
        height: 24,
        width: 24,
    },

    title: {
        marginLeft: 30,
        fontSize: 24,
        fontWeight: '700',
        color: '#FF5A00',
    },
});