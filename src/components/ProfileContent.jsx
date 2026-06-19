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

const SettingItem = ({
    icon,
    title,
    subtitle,
    showDivider = true,
}) => {
    return (
        <>
            <TouchableOpacity style={styles.settingRow}>
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

export default function ProfileContent() {
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
                            VY
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
                    Vikram Yadav
                </Text>

                <Text style={styles.phone}>
                    📞 +91 98765 43210
                </Text>
            </View>

            {/* Heading */}

            <Text style={styles.heading}>
                Settings
            </Text>

            <Text style={styles.description}>
                Manage your account preferences and
                app settings.
            </Text>

            {/* Settings Card 1 */}

            <View style={styles.settingsCard}>
                <SettingItem
                    icon={<LanguageIcon width={22} height={22} />}
                    title="Language Selection"
                    subtitle="English (US)"
                />
                <SettingItem
                    icon={<NotificationIcon width={22} height={22}/>}
                    title="Notification Settings"
                    showDivider={false}
                />
            </View>

            {/* Settings Card 2 */}

            <View style={styles.settingsCard}>
                <SettingItem
                    icon={<HelpAndSupportIcon width={22} height={22}/>}
                    title="Help & Support"
                />

                <SettingItem
                    icon={<PrivacyPolicyIcon width={22} height={22}/>}
                    title="Privacy Policy"
                    showDivider={false}
                />
            </View>

            {/* Logout */}

            <TouchableOpacity
                style={styles.logoutButton}
            >   
                <Text style={styles.logoutText}>
                <LogoutIcon/>  Logout
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

        justifyContent: 'center',
        alignItems: 'center',
    },

    logoutText: {
        color: '#93000A',
        fontSize: 17,
        fontWeight: '600',
    },
});