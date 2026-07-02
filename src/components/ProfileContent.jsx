import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import LanguageIcon from '../../assets/LanguageIcon.svg'
import NotificationIcon from '../../assets/NotificationIcon3.svg'
import PrivacyPolicyIcon from '../../assets/PrivacyPolicyIcon.svg'
import HelpAndSupportIcon from '../../assets/HelpAndSupportIcon.svg'
import LogoutIcon from '../../assets/LogOut.svg'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../translations/i18n'; // adjust path if needed

const SettingItem = ({
    icon,
    title,
    subtitle,
    showDivider = true,
    onPress,
}) => {
    return (
        <>
            <TouchableOpacity style={styles.settingRow}
                onPress={onPress}
            >
                <View style={styles.leftSection}>
                    <View style={styles.iconCircle}>
                        {icon}
                    </View>

                    <View>
                        <Text style={styles.settingTitle}>
                            {title}
                        </Text>

                        {subtitle && (
                            <Text style={styles.subtitle}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>

                <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {showDivider && (
                <View style={styles.divider} />
            )}
        </>
    );
};

export default function ProfileContent({ name = 'Worker',
    imageUrl, phone }) {

    const { t } = useTranslation();

    const handleLogout = () => {
        Alert.alert(
            t('profile.content.logoutConfirmTitle'),
            t('profile.content.logoutConfirmMessage'),
            [
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('profile.content.logout'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log("Step 1");

                            await AsyncStorage.removeItem("token");

                            console.log("Step 2");

                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Login" }],
                            });

                            console.log("Step 3");
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]
        );
    };
    const navigation = useNavigation();
    const MoveToHelpPage = () => {
        navigation.navigate('Help');
    };
    const MoveToLanguagePage = () => {
        navigation.navigate('Language');
    };
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Profile Card */}

            <View style={styles.profileCard}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {name?.split(' ').map(n => n[0]).join('')}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.editButton}
                    >
                        <Text style={styles.editText}>
                            ✎
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.name}>
                    {name}
                </Text>

                <Text style={styles.phone}>
                    📞 +91 {phone}
                </Text>
            </View>

            {/* Heading */}

            <Text style={styles.heading}>
                {t('profile.content.settingsHeading')}
            </Text>

            <Text style={styles.description}>
                {t('profile.content.settingsDescription')}
            </Text>

            {/* Settings Card 1 */}

            <View style={styles.settingsCard}>
                <SettingItem
                    icon={<LanguageIcon width={22} height={22} />}
                    title={t('profile.content.languageSelection')}
                    subtitle={
                        i18n.language === 'hi'
                            ? t('profile.language.options.hindi.name')
                            : t('profile.language.options.english.name')
                    }
                    onPress={MoveToLanguagePage}
                />
                <SettingItem
                    icon={<NotificationIcon width={22} height={22} />}
                    title={t('profile.content.notificationSettings')}
                    showDivider={false}
                />
            </View>

            {/* Settings Card 2 */}

            <View style={styles.settingsCard}>
                <SettingItem
                    icon={<HelpAndSupportIcon width={22} height={22} />}
                    title={t('profile.content.helpSupport')}
                    onPress={MoveToHelpPage}
                />

                <SettingItem
                    icon={<PrivacyPolicyIcon width={22} height={22} />}
                    title={t('profile.content.privacyPolicy')}
                    showDivider={false}
                />
            </View>

            {/* Logout */}

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <LogoutIcon />

                <Text style={styles.logoutText}>
                    {t('profile.content.logout')}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 16,
    },

    profileCard: {
        marginTop: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3C8B6',
        alignItems: 'center',
        paddingVertical: 28,
    },

    avatarWrapper: {
        position: 'relative',
        marginBottom: 16,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FF6200',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },

    avatarText: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: '600',
    },

    editButton: {
        position: 'absolute',
        right: -4,
        bottom: 4,

        width: 30,
        height: 30,
        borderRadius: 15,

        backgroundColor: '#FF6200',
        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    editText: {
        color: '#FFFFFF',
        fontSize: 12,
    },

    name: {
        fontSize: 20,
        fontWeight: '700',
        color: '#202020',
    },

    phone: {
        marginTop: 6,
        fontSize: 16,
        color: '#6B4E3D',
    },

    heading: {
        marginTop: 28,
        fontSize: 22,
        fontWeight: '700',
        color: '#202020',
    },

    description: {
        marginTop: 6,
        fontSize: 16,
        lineHeight: 26,
        color: '#6B4E3D',
        marginBottom: 20,
    },

    settingsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3C8B6',
        marginBottom: 18,
        overflow: 'hidden',
    },

    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: 16,
        paddingVertical: 18,
    },

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F1F1F1',

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 14,
    },

    icon: {
        fontSize: 18,
    },

    settingTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#202020',
    },

    subtitle: {
        marginTop: 2,
        fontSize: 13,
        color: '#7A6A61',
    },

    arrow: {
        fontSize: 28,
        color: '#8C6F63',
    },

    divider: {
        height: 1,
        backgroundColor: '#ECECEC',
        marginLeft: 72,
    },

    logoutButton: {
        marginTop: 8,
        marginBottom: 30,

        backgroundColor: '#FCE0DB',
        height: 56,

        borderRadius: 14,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        gap: 8,
    },

    logoutText: {
        color: '#93000A',
        fontSize: 17,
        fontWeight: '600',
    },
});