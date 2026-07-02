import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');


const PromotionalBannerSlider = () => {
    const { t } = useTranslation();

    const banners = [
        {
            id: '1',
            tag: t('dashboard.banners.offer.tag'),
            title: t('dashboard.banners.offer.title'),
            subtitle: t('dashboard.banners.offer.subtitle'),
            color: '#FF6B00',
        },
        {
            id: '2',
            tag: t('dashboard.banners.safety.tag'),
            title: t('dashboard.banners.safety.title'),
            subtitle: t('dashboard.banners.safety.subtitle'),
            color: '#007A99',
        },
        {
            id: '3',
            tag: t('dashboard.banners.bonus.tag'),
            title: t('dashboard.banners.bonus.title'),
            subtitle: t('dashboard.banners.bonus.subtitle'),
            color: '#2E7D32',
        },
    ];

    return (
        <View style={styles.container}>
            <Carousel
                loop
                autoPlay
                autoPlayInterval={3000}
                scrollAnimationDuration={1000}
                width={width}
                height={130}
                data={banners}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.banner,
                            { backgroundColor: item.color },
                        ]}
                    >
                        <View style={styles.tagContainer}>
                            <Text style={styles.tag}>
                                {item.tag}
                            </Text>
                        </View>

                        <Text style={styles.title}>
                            {item.title}
                        </Text>

                        <Text style={styles.subtitle}>
                            {item.subtitle}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

export default PromotionalBannerSlider;

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },

    banner: {
        width: width - 32,
        height: 120,
        alignSelf: 'center',

        borderRadius: 18,

        paddingHorizontal: 18,
        paddingVertical: 14,

        justifyContent: 'center',
    },

    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 10,
    },

    tag: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1,
    },

    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },

    subtitle: {
        color: '#FFF',
        fontSize: 14,
        marginTop: 6,
    },
});