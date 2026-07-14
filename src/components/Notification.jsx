import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../translations/i18n';
import { colors, radius, spacing, shadow } from '../theme/theme';

const alerts = [
  {
    id: 1,
    type: 'job',
    title: 'New Job Request: Plumbing',
    message:
      'Rajesh Kumar has requested emergency pipe repair in Sector...',
    time: '2m ago',
  },
  {
    id: 2,
    type: 'success',
    title: 'Offer Accepted',
    message:
      "Your bid for 'Electrical Wiring Setup' was accepted by Sunita S....",
    time: '1h ago',
  },
  {
    id: 3,
    type: 'danger',
    title: 'Cancellation Update',
    message:
      'The painting job scheduled for this afternoon has been cancelled by...',
    time: '3h ago',
  },
  {
    id: 4,
    type: 'system',
    title: 'System Maintenance',
    message:
      'LabourBaba platform will undergo scheduled maintenance tonight...',
    time: 'Yesterday',
  },
];

const AlertCard = ({ item }) => {
  
  const getStyles = () => {
    switch (item.type) {
      case 'job':
        return {
          bg: colors.surface,
          border: colors.primary,
          iconBg: colors.primary,
          icon: '🛠',
          timeColor: colors.primary,
        };

      case 'success':
        return {
          bg: colors.surface,
          border: colors.surface,
          iconBg: colors.success,
          icon: '✓',
          timeColor: colors.inkSoft,
        };

      case 'danger':
        return {
          bg: colors.dangerBg,
          border: colors.danger,
          iconBg: colors.danger,
          icon: '✕',
          timeColor: colors.danger,
        };

      default:
        return {
          bg: colors.surface,
          border: colors.surface,
          iconBg: colors.inkSoft,
          icon: '📢',
          timeColor: colors.inkSoft,
        };
    }
  };

  const config = getStyles();
  

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          backgroundColor: config.bg,
          borderLeftColor: config.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: config.iconBg,
          },
        ]}
      >
        <Text style={styles.icon}>{config.icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>

          <Text
            style={[
              styles.time,
              { color: config.timeColor },
            ]}
          >
            {item.time}
          </Text>
        </View>

        <Text style={styles.message}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function RecentAlerts() {
  const { t } = useTranslation();
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <Text style={styles.heading}>
          {t('alerts.heading')}
        </Text>

        <TouchableOpacity>
          <Text style={styles.markRead}>
            {t('alerts.markAllRead')}
          </Text>
        </TouchableOpacity>
      </View>

      {alerts.map(item => (
        <AlertCard
          key={item.id}
          item={item}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
  },

  markRead: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    ...shadow.card,
  },

  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,

    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 20,
    color: colors.surface,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    marginLeft: spacing.md,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    marginRight: 10,
  },

  time: {
    fontSize: 13,
    fontWeight: '600',
  },

  message: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 22,
    color: colors.inkMuted,
  },
});