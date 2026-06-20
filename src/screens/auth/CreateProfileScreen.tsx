import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PersonalDetailsCard from '../../components/PersonalDetailsCard'
import TopAppBar from '../../components/TopAppBar'
import LocationCard from '../../components/LocationCard'
import TradeExperienceCard from '../../components/TradeExperienceCard'
import VerifyIdentityCard from '../../components/VerifyIdentityCard'
import AnimatedButton from '../../components/AnimatedButton'

export default function CreateProfileScreen({ navigation }: any) {
    const handleSubmit = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };
    return (
        <View>
            <TopAppBar title="Create Profile" />

            <ScrollView

                style={{ backgroundColor: '#F9F8F7', height: '100%' }}
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 100,
                }}
            >
                <VerifyIdentityCard />
                <PersonalDetailsCard />
                <LocationCard />
                <TradeExperienceCard />
                <View style={{ marginTop: 24, marginBottom: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedButton
                        title="Complete Registration"
                        width="90%"
                        height={56}
                        onPress={handleSubmit}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
})