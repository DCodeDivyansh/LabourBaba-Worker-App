import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopAppBar from '../../components/TopNav'
import BottomNav from '../../components/BottomNav'
import MyJobList from '../../components/MyJobsList'

export default function JobsHistory() {
    return (
        <View style={styles.container} >
            <TopAppBar />
            <ScrollView>
                <MyJobList />
            </ScrollView>
            <BottomNav />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F8F7',
    },
})