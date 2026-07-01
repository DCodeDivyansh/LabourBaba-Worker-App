import { StyleSheet, ScrollView, Text, View } from 'react-native'
import React from 'react'
import ProfileContent from '../../components/ProfileContent'
import TopNav from '../../components/TopNav'
import TopAppBar from '../../components/TopAppBar'
import BottomNav from '../../components/BottomNav'
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
    const [worker, setWorker] = useState(null);

    useEffect(() => {
        loadWorker();
    }, []);

    const loadWorker = async () => {
        try {
            const cached = await AsyncStorage.getItem("worker");

            if (cached) {
                const parsedWorker = JSON.parse(cached);
                setWorker(parsedWorker);
                console.log(parsedWorker);
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <View style={styles.container}>
            <TopNav />
            <ScrollView>
                <ProfileContent
                    name={worker?.name}
                    phone={worker?.phone}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F8F7',
    },
})