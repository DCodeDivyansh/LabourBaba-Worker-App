import React, { useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

const OtpVerifyModal = ({ visible, onClose, onSubmit, loading }) => {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleChange = (text, index) => {
        const next = [...digits];
        next[index] = text.replace(/[^0-9]/g, '').slice(-1);
        setDigits(next);
        if (text && index < 5) inputRefs.current[index + 1]?.focus();
        if (!text && index > 0) inputRefs.current[index - 1]?.focus();
    };

    const otp = digits.join('');

    const handleSubmit = () => {
        if (otp.length !== 6) return;
        onSubmit(otp);
    };

    const handleClose = () => {
        setDigits(['', '', '', '', '', '']);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <Text style={styles.title}>Enter Start OTP</Text>
                    <Text style={styles.subtitle}>Ask the customer for the 6-digit code to start this job.</Text>

                    <View style={styles.otpRow}>
                        {digits.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={styles.otpBox}
                                value={digit}
                                maxLength={1}
                                keyboardType="number-pad"
                                textAlign="center"
                                onChangeText={(text) => handleChange(text, index)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, otp.length !== 6 && styles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={loading || otp.length !== 6}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Start Job</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleClose} disabled={loading} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default OtpVerifyModal;

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(15,15,20,0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
    card: { width: '100%', backgroundColor: '#FFF', borderRadius: 20, padding: 24, alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '700', color: '#1E1E1E' },
    subtitle: { fontSize: 13, color: '#8A7A72', textAlign: 'center', marginTop: 6, marginBottom: 20 },
    otpRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    otpBox: {
        width: 44, height: 52, borderWidth: 1.5, borderColor: '#EDE7E2', borderRadius: 12,
        fontSize: 20, fontWeight: '700', color: '#1E1E1E', backgroundColor: '#FAFAFA',
    },
    submitBtn: { width: '100%', height: 50, borderRadius: 25, backgroundColor: '#FF5A00', justifyContent: 'center', alignItems: 'center' },
    submitBtnDisabled: { backgroundColor: '#FFC9A0' },
    submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    cancelBtn: { marginTop: 14 },
    cancelText: { color: '#8A7A72', fontSize: 14, fontWeight: '600' },
});