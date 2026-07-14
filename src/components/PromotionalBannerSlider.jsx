import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/theme';

const { width } = Dimensions.get('window');

const PromotionalBannerSlider = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0); // ⬅ NEW

    const banners = [
        {
            id: '1',
            tag: t('dashboard.banners.offer.tag'),
            title: t('dashboard.banners.offer.title'),
            subtitle: t('dashboard.banners.offer.subtitle'),
            // ⬅ NEW: placeholder stock photo — replace with your own branded imagery
            image: 'https://picsum.photos/seed/labourbaba-offer/900/500',
        },
        {
            id: '2',
            tag: t('dashboard.banners.safety.tag'),
            title: t('dashboard.banners.safety.title'),
            subtitle: t('dashboard.banners.safety.subtitle'),
            image: 'https://picsum.photos/seed/labourbaba-safety/900/500',
        },
        {
            id: '3',
            tag: t('dashboard.banners.bonus.tag'),
            title: t('dashboard.banners.bonus.title'),
            subtitle: t('dashboard.banners.bonus.subtitle'),
            image: 'https://picsum.photos/seed/labourbaba-bonus/900/500',
        },
    ];

    return (
        <View style={styles.container}>
            <Carousel
                loop
                autoPlay
                autoPlayInterval={3500}
                scrollAnimationDuration={800}
                width={width}
                height={140}
                data={banners}
                onSnapToItem={setActiveIndex} // ⬅ NEW
                renderItem={({ item }) => (
                    <View style={styles.bannerWrap}>
                        <ImageBackground
                            source={{ uri: item.image }}
                            style={styles.banner}
                            imageStyle={styles.bannerImage}
                        >
                            <View style={styles.scrim} />

                            <View style={styles.tagContainer}>
                                <Text style={styles.tag}>{item.tag}</Text>
                            </View>

                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                        </ImageBackground>
                    </View>
                )}
            />

            {/* ⬅ NEW: pagination dots */}
            <View style={styles.dotsRow}>
                {banners.map((banner, index) => (
                    <View
                        key={banner.id}
                        style={[styles.dot, index === activeIndex && styles.dotActive]}
                    />
                ))}
            </View>
        </View>
    );
};

export default PromotionalBannerSlider;

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },

    bannerWrap: {
        width,
        alignItems: 'center',
    },

    banner: {
        width: width - 32,
        height: 130,
        borderRadius: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    bannerImage: {
        borderRadius: 20,
    },

    scrim: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 15, 20, 0.42)',
    },

    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.22)',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 10,
    },

    tag: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },

    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },

    subtitle: {
        color: '#FFF',
        fontSize: 13,
        marginTop: 5,
        opacity: 0.92,
    },

    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        gap: 6,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E0DAD4',
    },

    dotActive: {
        width: 16,
        backgroundColor: colors.primary,
    },
});