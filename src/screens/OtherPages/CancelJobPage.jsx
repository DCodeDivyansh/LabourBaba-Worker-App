import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const reasons = [
  'Personal Emergency',
  'Location Too Far',
  'Customer Not Responding',
  'Find Somewhere Else',
  'Other Reason',
];

const CancelJobModal = () => {
  const [selectedReason, setSelectedReason] = useState(null);
  const navigation = useNavigation();

  return (
    <Modal
      // visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Cancel Job
            </Text>

            <TouchableOpacity onPress={() => navigation.goBack()} >
              <Text style={styles.close}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Please select the primary reason for
            cancelling this job.
          </Text>

          {/* Options */}
          {reasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() =>
                setSelectedReason(reason)
              }
            >
              <Text style={styles.optionText}>
                {reason}
              </Text>

              <View
                style={[
                  styles.radioOuter,
                  selectedReason === reason &&
                    styles.radioOuterSelected,
                ]}
              >
                {selectedReason === reason && (
                  <View
                    style={styles.radioInner}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Warning: Frequent cancellations
              may impact your worker rating and
              visibility on the platform.
            </Text>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmBtn}
            // onPress={() =>
            //   onConfirm(selectedReason)
            // }
          >
            <Text style={styles.confirmText}>
              Confirm Cancellation
            </Text>
          </TouchableOpacity>

          {/* Go Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 10,
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#D9B8A7',
    alignSelf: 'center',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  close: {
    fontSize: 28,
    color: '#6B4E42',
  },

  description: {
    color: '#FF5A00',
    fontSize: 18,
    lineHeight: 28,
    marginVertical: 20,
  },

  option: {
    height: 58,
    borderWidth: 1,
    borderColor: '#FFD7C2',
    borderRadius: 14,
    marginBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionText: {
    fontSize: 18,
    color: '#333',
  },

  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F2C7B3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterSelected: {
    borderColor: '#FF5A00',
  },

  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF5A00',
  },

  warningBox: {
    backgroundColor: '#FDE3E0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F4B7B1',
    padding: 16,
    marginTop: 24,
  },

  warningText: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 26,
  },

  confirmBtn: {
    backgroundColor: '#C91616',
    height: 58,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  confirmText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  backBtn: {
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFD7C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },

  backText: {
    color: '#FF5A00',
    fontSize: 18,
    fontWeight: '600',
  },
});