import React from 'react';
import { StyleSheet, View } from 'react-native';
import TopNav from '../../components/TopNav';
import MyJobList from '../../components/MyJobsList';

export default function JobsHistory() {
  return (
    <View style={styles.container}>
      <TopNav />
      <MyJobList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F7',
  },
});