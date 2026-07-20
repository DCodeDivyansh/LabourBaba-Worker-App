import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Linking, // ⬅ NEW
} from 'react-native';
import LanguageIcon from '../../assets/LanguageIcon.svg'
import NotificationIcon from '../../assets/NotificationIcon3.svg'
import PrivacyPolicyIcon from '../../assets/PrivacyPolicyIcon.svg'
import HelpAndSupportIcon from '../../assets/HelpAndSupportIcon.svg'
import LogoutIcon from '../../assets/LogOut.svg'
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // ⬅ CHANGED
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../translations/i18n';
import { getWorkerBookings } from '../services/booking';
import { onJobCompleted } from '../services/events'; // ⬅ NEW
import { hasNotificationPermission } from '../services/firebase'; // ⬅ NEW
import { colors, radius, shadow } from '../theme/theme';

const isCompleted = (status) => {
    if (!status) return false;
    const s = status.toLowerCase();
    return s === 'completed' || s === 'done';
};

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const SettingItem = ({ icon, title, subtitle, showDivider = true, onPress }) => {
    return (
        <>
            <TouchableOpacity style={styles.settingRow} onPress={onPress}>
                <View style={styles.leftSection}>
                    <View style={styles.iconCircle}>{icon}</View>
                    <View>
                        <Text style={styles.settingTitle}>{title}</Text>
                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                </View>
                <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            {showDivider && <View style={styles.divider} />}
        </>
    );
};

export default function ProfileContent({ name = 'Worker', imageUrl, phone }) {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [statsLoading, setStatsLoading] = useState(true);
    const [completedCount, setCompletedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [notificationsEnabled, setNotificationsEnabled] = useState(null); // ⬅ NEW

    const fetchStats = useCallback(async () => {
        try {
            const response = await getWorkerBookings();
            const list = response?.data || [];
            setCompletedCount(list.filter(b => isCompleted(b.status)).length);
            setTotalCount(list.length);
        } catch (err) {
            console.log('[ProfileContent] Failed to load job stats:', err?.message);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // ⬅ CHANGED: was a one-time useEffect — now refetches whenever the
    // profile tab regains focus.
    useFocusEffect(
        useCallback(() => {
            fetchStats();
            // ⬅ NEW: re-checks every time the worker comes back to this
            // screen — including right after returning from the OS
            // notification settings page, so the status shown is never stale.
            hasNotificationPermission()
                .then(setNotificationsEnabled)
                .catch(() => setNotificationsEnabled(null));
        }, [fetchStats])
    );

    // ⬅ NEW: instant bump to the completed count if this screen happens to
    // already be mounted when a job is completed elsewhere.
    React.useEffect(() => {
        const unsubscribe = onJobCompleted(() => {
            setCompletedCount((c) => c + 1);
            setTotalCount((count) => count); // total unchanged, kept for clarity
        });
        return unsubscribe;
    }, []);

    const handleLogout = () => {
        Alert.alert(
            t('profile.content.logoutConfirmTitle'),
            t('profile.content.logoutConfirmMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('profile.content.logout'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("token");
                            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]
        );
    };

    const MoveToHelpPage = () => navigation.navigate('Help');
    const MoveToLanguagePage = () => navigation.navigate('Language');
    const MoveToPrivacyPolicy = () => navigation.navigate('PrivacyPolicy');
    // ⬅ FIXED: 'JobsHistory' isn't a registered route — the jobs list lives at
    // the 'Jobs' tab inside 'MainTabs' (see MainTabs.jsx).
    const MoveToJobHistory = () => navigation.navigate('MainTabs', { screen: 'Jobs' });

    // ⬅ NEW: this row previously had no onPress at all. There's no API to
    // re-trigger the OS permission dialog once it's been denied — the only
    // way back in is the app's own notification settings page, which
    // Linking.openSettings() opens directly (works on both platforms).
    const handleNotificationSettingsPress = () => {
        Linking.openSettings();
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.profileCard}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitials(name)}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editText}>✎</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.name}>{name}</Text>
                <Text style={styles.phone}>📞 +91 {phone}</Text>

                <View style={styles.statsDivider} />

                {statsLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} style={styles.statsLoader} />
                ) : (
                    <TouchableOpacity style={styles.statsRow} onPress={MoveToJobHistory} activeOpacity={0.7}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>{completedCount}</Text>
                            <Text style={styles.statLabel}>
                                {t('profile.content.jobsCompleted', 'Jobs Completed')}
                            </Text>
                        </View>
                        <View style={styles.statSeparator} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>{totalCount}</Text>
                            <Text style={styles.statLabel}>
                                {t('profile.content.totalJobs', 'Total Jobs')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.heading}>{t('profile.content.settingsHeading')}</Text>
            <Text style={styles.description}>{t('profile.content.settingsDescription')}</Text>

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
                    subtitle={
                        notificationsEnabled === null
                            ? undefined
                            : notificationsEnabled
                                ? t('profile.content.notificationsEnabled', 'Enabled')
                                : t('profile.content.notificationsDisabled', 'Off — tap to enable')
                    }
                    onPress={handleNotificationSettingsPress}
                    showDivider={false}
                />
            </View>

            <View style={styles.settingsCard}>
                <SettingItem
                    icon={<HelpAndSupportIcon width={22} height={22} />}
                    title={t('profile.content.helpSupport')}
                    onPress={MoveToHelpPage}
                />
                <SettingItem
                    icon={<PrivacyPolicyIcon width={22} height={22} />}
                    title={t('profile.content.privacyPolicy')}
                    onPress={MoveToPrivacyPolicy}
                    showDivider={false}
                />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogoutIcon />
                <Text style={styles.logoutText}>{t('profile.content.logout')}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
    profileCard: {
        marginTop: 24, backgroundColor: colors.surface, borderRadius: radius.lg,
        borderWidth: 1, borderColor: colors.border, alignItems: 'center',
        paddingVertical: 28, paddingHorizontal: 16,
        ...shadow.card,
    },
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 3 },
    avatarText: { color: colors.surface, fontSize: 34, fontWeight: '600' },
    editButton: {
        position: 'absolute', right: -4, bottom: 4, width: 30, height: 30, borderRadius: 15,
        backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: colors.surface,
    },
    editText: { color: colors.surface, fontSize: 12 },
    name: { fontSize: 20, fontWeight: '700', color: colors.ink },
    phone: { marginTop: 6, fontSize: 16, color: colors.inkMuted },
    statsDivider: { height: 1, backgroundColor: colors.border, alignSelf: 'stretch', marginTop: 20, marginBottom: 16 },
    statsLoader: { marginTop: 4 },
    statsRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' },
    statItem: { alignItems: 'center', paddingHorizontal: 24 },
    statSeparator: { width: 1, height: 32, backgroundColor: colors.border },
    statNum: { fontSize: 22, fontWeight: '800', color: colors.primary },
    statLabel: { fontSize: 12, color: colors.inkSoft, fontWeight: '600', marginTop: 3 },
    heading: { marginTop: 28, fontSize: 22, fontWeight: '700', color: colors.ink },
    description: { marginTop: 6, fontSize: 16, lineHeight: 26, color: colors.inkMuted, marginBottom: 20 },
    settingsCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: 18, overflow: 'hidden' },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 18 },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    settingTitle: { fontSize: 18, fontWeight: '600', color: colors.ink },
    subtitle: { marginTop: 2, fontSize: 13, color: colors.inkSoft },
    arrow: { fontSize: 28, color: colors.inkSoft },
    divider: { height: 1, backgroundColor: colors.border, marginLeft: 72 },
    logoutButton: {
        marginTop: 8, marginBottom: 30, backgroundColor: colors.dangerBg, height: 56, borderRadius: 14,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    logoutText: { color: colors.danger, fontSize: 17, fontWeight: '600' },
});