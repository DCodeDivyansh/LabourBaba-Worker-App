import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import PersonalDetailsCard from '../../components/PersonalDetailsCard'
import TopAppBar from '../../components/TopAppBar'
import LocationCard from '../../components/LocationCard'
import TradeExperienceCard from '../../components/TradeExperienceCard'
import VerifyIdentityCard from '../../components/VerifyIdentityCard'
import AnimatedButton from '../../components/AnimatedButton'
import { WorkerData } from "../../types/worker";
import { registerWorker } from '../../services/worker'
import PasswordCard from '../../components/Password'


export default function CreateProfileScreen({ navigation }: any) {
    // navigation.reset({
    //     index: 0,
    //     routes: [{ name: 'MainTabs' }],
    // });
    const handleSubmit = async () => {
        try {
            const response = await registerWorker(workerData);

            console.log(response);

            navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
            });
        } catch (error: any) {
            console.log(error.response?.data);
            console.log(error.message);
        }
    };
    const [workerData, setWorkerData] = useState<WorkerData>({
        skill_category_id: "",
        phone: "",
        password: "",
        skill_type: "",
        aadhaar_last4: "9696",
        device_token: "String",
    });
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
                <PersonalDetailsCard
                    workerData={workerData}
                    setWorkerData={setWorkerData}
                />
                {/* <LocationCard /> */}
                <TradeExperienceCard
                    workerData={workerData}
                    setWorkerData={setWorkerData}
                />

                <PasswordCard
                    workerData={workerData}
                    setWorkerData={setWorkerData}
                />
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