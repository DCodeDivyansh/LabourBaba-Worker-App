import { StyleSheet,ScrollView, Text, View } from 'react-native'
import React from 'react'
import TopAppBar from '../../components/TopNav'
import BottomNav from '../../components/BottomNav'
import Notification from '../../components/Notification'

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
        <TopAppBar/>
        <ScrollView>
                <Notification />
            </ScrollView>
        <BottomNav/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F8F7',
    },
})