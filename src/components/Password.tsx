import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PasswordIcon from '../../assets/passwordIcon.svg';

type Props = {
  workerData: {
    password: string;
  };
  setWorkerData: React.Dispatch<React.SetStateAction<any>>;
};

const PasswordCard = ({
  workerData,
  setWorkerData,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <PasswordIcon style={styles.icon} />
        <Text style={styles.title}>Password</Text>
      </View>

      <Text style={styles.label}>
        Create a secure password
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={workerData.password}
          onChangeText={(text) =>
            setWorkerData((prev: any) => ({
              ...prev,
              password: text,
            }))
          }
          secureTextEntry={!showPassword}
          placeholder="Enter password"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.toggle}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.helperText}>
        Use at least 6 characters for a stronger password.
      </Text>
    </View>
  );
};

export default PasswordCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
    marginBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  label: {
    color: '#9A7564',
    marginBottom: 8,
    marginLeft: 8,
  },

  inputContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: '#C89F8D',
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  toggle: {
    color: '#FF5A00',
    fontWeight: '600',
    marginLeft: 12,
  },

  helperText: {
    marginTop: 8,
    marginLeft: 8,
    fontSize: 12,
    color: '#9A7564',
  },
});