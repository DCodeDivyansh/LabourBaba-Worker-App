import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNav from '../../components/TopNav';
import MyJobList from '../../components/MyJobsList';

export default function JobsHistory() {
  return (
    <View style={styles.container}>
      <TopNav />
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <MyJobList />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F7',
  },
  flex: {
    flex: 1,
  },
});