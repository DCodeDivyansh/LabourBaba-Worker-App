import { StyleSheet,ScrollView, Text, View } from 'react-native'
import React from 'react'
import TopNav from '../../components/TopNav'
import WelcomeHeader from '../../components/WelcomeHeader'
import LocationLine from '../../components/LocationLine'
import AvailabilityCard from '../../components/AvailabilityCard'
import ActiveJobCard from '../../components/ActiveJobCard'
import PromotionalBannerSlider from '../../components/PromotionalBannerSlider'
import SafetyBanner from '../../components/SafetyBanner'
import BottomNav from '../../components/BottomNav'

export default function WorkerDashboardScreen() {
  return (
    <View>
      <TopNav />
      <ScrollView>
        <WelcomeHeader />
        <LocationLine />
        <AvailabilityCard />
        <ActiveJobCard />
        <PromotionalBannerSlider />
        <SafetyBanner />
      </ScrollView>
      <BottomNav />


    </View>
  )
}

const styles = StyleSheet.create({})