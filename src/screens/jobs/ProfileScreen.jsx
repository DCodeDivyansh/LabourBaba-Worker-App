import { StyleSheet,ScrollView, Text, View } from 'react-native'
import React from 'react'
import ProfileContent from '../../components/ProfileContent'
import TopNav from '../../components/TopNav'
import TopAppBar from '../../components/TopAppBar'
import BottomNav from '../../components/BottomNav'

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
        <TopNav/>
        <ScrollView>
                <ProfileContent />
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