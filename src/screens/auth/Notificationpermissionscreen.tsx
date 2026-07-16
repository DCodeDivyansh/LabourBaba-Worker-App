import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import NotificationIcon from '../../../assets/NotificationIcon3.svg';
import AnimatedButton from '../../components/AnimatedButton';
import {
  requestNotificationPermission,
  getFCMToken,
  openNotificationSettings,
} from '../../services/firebase';
import { updateDeviceToken } from '../../services/worker';
import { colors, spacing, radius, typography } from '../../theme/theme';

// Shown once, right after auth (fresh signup or first login on a device)
// and only if permission isn't already granted. Never re-shown after the
// worker has made a choice — see PROMPT_SHOWN_KEY below and the routing
// logic in App.tsx.
export const NOTIFICATION_PROMPT_SHOWN_KEY = 'notificationPromptShown';

type Props = {
  navigation: any;
  route: { params?: { nextRoute?: string } };
};

export default function NotificationPermissionScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const [requesting, setRequesting] = useState(false);
  const nextRoute = route?.params?.nextRoute ?? 'MainTabs';

  const goNext = () => {
    navigation.reset({ index: 0, routes: [{ name: nextRoute }] });
  };

  const markShownAndContinue = async () => {
    await AsyncStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');
    goNext();
  };

  const handleEnable = async () => {
    if (requesting) return;
    setRequesting(true);
    try {
      const status = await requestNotificationPermission();

      if (status === 'granted') {
        const token = await getFCMToken();
        const authToken = await AsyncStorage.getItem('token');
        if (token && authToken) {
          try {
            await updateDeviceToken(token);
          } catch (e) {
            console.log('[NotificationPermission] Failed to register token:', e);
          }
        }
      } else if (status === 'blocked') {
        // The OS dialog can't be shown again — offer a direct path to
        // Settings instead of silently doing nothing.
        Alert.alert(
          t('notificationPermission.blockedTitle', 'Notifications are off'),
          t(
            'notificationPermission.blockedMessage',
            'You can still turn them on anytime from your phone Settings.',
          ),
          [
            { text: t('common.cancel', 'Cancel'), style: 'cancel' },
            { text: t('common.openSettings', 'Open Settings'), onPress: openNotificationSettings },
          ],
        );
      }

      await markShownAndContinue();
    } catch (e) {
      console.log('[NotificationPermission] Request error:', e);
      await markShownAndContinue();
    } finally {
      setRequesting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <NotificationIcon width={40} height={40} />
        </View>

        <Text style={styles.title}>
          {t('notificationPermission.title', 'Never miss a job')}
        </Text>
        <Text style={styles.subtitle}>
          {t(
            'notificationPermission.subtitle',
            'Turn on notifications so we can alert you the moment a nearby job comes in.',
          )}
        </Text>

        <View style={styles.benefitList}>
          <BenefitRow text={t('notificationPermission.benefitJobs', 'Instant job alerts near you')} />
          <BenefitRow text={t('notificationPermission.benefitBookings', 'Booking and schedule updates')} />
          <BenefitRow text={t('notificationPermission.benefitPayments', 'Payment confirmations')} />
        </View>
      </View>

      <View style={styles.footer}>
        <AnimatedButton
          title={
            requesting
              ? t('common.pleaseWait', 'Please wait...')
              : t('notificationPermission.enableCta', 'Enable Notifications')
          }
          width="100%"
          height={56}
          onPress={handleEnable}
          disabled={requesting}
        />
        <Text style={styles.skip} onPress={requesting ? undefined : markShownAndContinue}>
          {t('notificationPermission.skipCta', 'Maybe later')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

function BenefitRow({ text }: { text: string }) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.bullet} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  benefitList: {
    width: '100%',
    gap: spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  benefitText: {
    ...typography.body,
    color: colors.ink,
    flexShrink: 1,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  skip: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontWeight: '600',
  },
});