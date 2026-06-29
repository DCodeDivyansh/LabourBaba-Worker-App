import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const reasons = [
  'Personal Emergency',
  'Location Too Far',
  'Customer Not Responding',
  'Found Somewhere Else',
  'Other Reason',
];

const CancelJobModal = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] =
    useState(null);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>
              Cancel Job
            </Text>

            <TouchableOpacity
              onPress={onClose}
            >
              <Text style={styles.close}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Please select the primary reason
            for cancelling this job.
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >
            {reasons.map(reason => (
              <TouchableOpacity
                key={reason}
                style={styles.option}
                onPress={() =>
                  setSelectedReason(reason)
                }
              >
                <Text
                  style={styles.optionText}
                >
                  {reason}
                </Text>

                <View
                  style={[
                    styles.radioOuter,
                    selectedReason ===
                      reason &&
                      styles.radioOuterSelected,
                  ]}
                >
                  {selectedReason ===
                    reason && (
                    <View
                      style={
                        styles.radioInner
                      }
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Frequent cancellations
              may affect your worker
              rating and visibility.
            </Text>
          </View>

          <TouchableOpacity
            disabled={!selectedReason}
            style={[
              styles.confirmBtn,
              !selectedReason && {
                opacity: 0.5,
              },
            ]}
            onPress={() =>
              onConfirm(selectedReason)
            }
          >
            <Text style={styles.confirmText}>
              Confirm Cancellation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={onClose}
          >
            <Text style={styles.backText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CancelJobModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '85%',
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  close: {
    fontSize: 28,
    color: '#666',
  },

  description: {
    color: '#FF5A00',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },

  option: {
    height: 58,
    borderWidth: 1,
    borderColor: '#FFD7C2',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 12,

    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  optionText: {
    fontSize: 16,
    color: '#333',
  },

  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFD7C2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterSelected: {
    borderColor: '#FF5A00',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5A00',
  },

  warningBox: {
    backgroundColor: '#FDE3E0',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },

  warningText: {
    color: '#C62828',
    fontSize: 14,
    fontWeight: '600',
  },

  confirmBtn: {
    height: 56,
    backgroundColor: '#C91616',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  confirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backBtn: {
    height: 56,
    borderWidth: 1,
    borderColor: '#FFD7C2',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  backText: {
    color: '#FF5A00',
    fontSize: 16,
    fontWeight: '700',
  },
});