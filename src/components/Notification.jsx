import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

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
          bg: '#FFFFFF',
          border: '#FF6200',
          iconBg: '#9EA7FF',
          icon: '🛠',
          timeColor: '#FF6200',
        };

      case 'success':
        return {
          bg: '#FFFFFF',
          border: '#FFFFFF',
          iconBg: '#4CAF50',
          icon: '✓',
          timeColor: '#8B6B5B',
        };

      case 'danger':
        return {
          bg: '#FCE8E3',
          border: '#E53935',
          iconBg: '#B71C1C',
          icon: '✕',
          timeColor: '#D32F2F',
        };

      default:
        return {
          bg: '#FFFFFF',
          border: '#FFFFFF',
          iconBg: '#E0E0E0',
          icon: '📢',
          timeColor: '#8B6B5B',
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
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <Text style={styles.heading}>
          Recent Alerts
        </Text>

        <TouchableOpacity>
          <Text style={styles.markRead}>
            Mark all read
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
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1F1F1F',
  },

  markRead: {
    color: '#FF6200',
    fontSize: 14,
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,

    borderLeftWidth: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#FFFFFF',
    fontWeight: '700',
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    marginRight: 10,
  },

  time: {
    fontSize: 13,
    fontWeight: '600',
  },

  message: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 24,
    color: '#6E5246',
  },
});