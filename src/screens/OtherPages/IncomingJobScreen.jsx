import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIncomingJob } from '../../context/IncomingJobContext';

export default function IncomingJobScreen() {
  const { currentJob, secondsRemaining, accept, reject } = useIncomingJob();
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentJob) {
      cardAnim.setValue(0);
      Animated.spring(cardAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 60,
      }).start();
    }
  }, [currentJob, cardAnim]);

  if (!currentJob) {
    return null; // navigation should pop this screen once currentJob clears
  }

  const translateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pulseWrap}>
        <Text style={styles.headline}>New Job Request</Text>
        <Text style={styles.countdown}>{secondsRemaining}s</Text>
      </View>

      <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
        <Text style={styles.title}>{currentJob.title}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value}>{currentJob.customerName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{currentJob.location}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rate</Text>
          <Text style={styles.rate}>₹{currentJob.ratePerDay}/day</Text>
        </View>

        {!!currentJob.body && <Text style={styles.body}>{currentJob.body}</Text>}

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={reject}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={accept}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1720',
    justifyContent: 'flex-end',
  },
  pulseWrap: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  countdown: {
    color: '#4ADE80',
    fontSize: 48,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#6B7280',
    fontSize: 14,
  },
  value: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  rate: {
    color: '#16A34A',
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    color: '#374151',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#FEE2E2',
  },
  acceptButton: {
    backgroundColor: '#16A34A',
  },
  rejectText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 16,
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});