import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import PersonalDetailsIcon from '../../assets/PersonalDetailsIcon.svg';
import CameraIcon from '../../assets/Camera.svg';
import UploadIcon from '../../assets/UploadIcon.svg';

const PersonalDetailsCard = ({
  workerData,
  setWorkerData,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <PersonalDetailsIcon style={styles.headerIcon} />
        <Text style={styles.headerText}>
          Personal Details
        </Text>
      </View>

      <View style={styles.photoSection}>
        <View style={styles.photoCircle}>
          <CameraIcon style={styles.camera} />
        </View>

        <TouchableOpacity style={styles.uploadBtn}>
          <UploadIcon />
        </TouchableOpacity>

        <Text style={styles.uploadLabel}>
          Upload clear face photo
        </Text>
      </View>

      <Text style={styles.label}>
        Full Name (As per Aadhaar)
      </Text>

      <TextInput
        style={styles.input}
        value={workerData.name}
        onChangeText={(text) =>
          setWorkerData({
            ...workerData,
            name: text,
          })
        }
        placeholder="Enter Your Name"
      />

      <Text style={styles.label}>
        Mobile Number
      </Text>

      <View style={styles.mobileContainer}>
        <TextInput
          style={styles.mobileInput}
          value={workerData.phone}
          onChangeText={(text) =>
            setWorkerData({
              ...workerData,
              phone: text,
            })
          }
          maxLength={10}
          keyboardType="number-pad"
          placeholder="Enter mobile number"
        />

        <Text style={styles.verify}>✔</Text>
      </View>

      <Text style={styles.label}>
        Aadhaar Number
      </Text>

      <TextInput
        placeholder="XXXX XXXX XXXX"
        maxLength={12}
        keyboardType="number-pad"
        placeholderTextColor="#D8B6A6"
        style={styles.input}
      />
    </View>
  );
};

export default PersonalDetailsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  headerIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
  },

  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  photoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#A98273',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },

  camera: {
    height: 32,
    width: 38,
    textAlign: 'center',
    lineHeight: 32,
    color: '#A98273',
  },

  uploadBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 105,
    bottom: 20,
  },

  uploadLabel: {
    marginTop: 10,
    color: '#6D4C41',
  },

  label: {
    color: '#9A7564',
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 10,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#C89F8D',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
  },

  mobileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },

  mobileInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },

  verify: {
    fontSize: 18,
    color: 'green',
    marginLeft: 10,
  },

  mobileText: {
    fontSize: 16,
    color: '#6D4C41',
  },

  verify: {
    color: 'green',
    fontSize: 22,
  },
});