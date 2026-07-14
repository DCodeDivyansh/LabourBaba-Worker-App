import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { colors, radius, spacing, typography, shadow } from '../theme/theme';

interface LoginFormProps {
  onLogin: (
    phone: string,
    password: string,
  ) => Promise<void>;
}

// ⬅ CHANGED: every dimension in this file used to be derived from raw
// `Dimensions.get('window').width`. That scales fine on a single reference
// phone, but blows up on tablets (huge, cartoonish inputs) and gets cramped
// on small phones. Fixed dp values pulled from the shared theme render the
// same proportions on every device, matching how the rest of the app (see
// theme.ts, BottomNav, etc.) already does it.
const LoginForm = ({
  onLogin,
}: LoginFormProps) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Mobile Number</Text>

      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryText}>+91</Text>
        </View>

        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter your 10-digit number"
          placeholderTextColor={colors.inkSoft}
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
        />
      </View>

      <Text style={[styles.label, styles.labelSpaced]}>Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor={colors.inkSoft}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.showText}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => onLogin(mobile, password)}
        activeOpacity={0.85}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    width: '90%',
    alignSelf: 'center',
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },

  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.sm,
  },

  labelSpaced: {
    marginTop: spacing.lg,
  },

  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
    height: 52,
  },

  countryCode: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.background,
  },

  countryText: {
    fontSize: typography.body.fontSize,
    color: colors.ink,
    fontWeight: '600',
  },

  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body.fontSize,
    color: colors.ink,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 52,
    paddingHorizontal: spacing.lg,
  },

  passwordInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.ink,
  },

  showText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: typography.caption.fontSize,
  },

  loginButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  loginText: {
    color: colors.surface,
    fontSize: typography.h3.fontSize,
    fontWeight: '700',
  },
});
