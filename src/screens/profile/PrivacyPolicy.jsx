import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import TopAppBar from '../../components/TopAppBar';
import { colors, radius, shadow } from '../../theme/theme';

// SVG Icons
import ShieldIcon from '../../../assets/Shield.svg';
import UserIcon from '../../../assets/user.svg';
import LocationIcon from '../../../assets/Location.svg';
import NotificationIcon from '../../../assets/NotificationIcon3.svg';
import DropDownIcon from '../../../assets/dropdown.svg';
import EmailIcon from '../../../assets/email.svg';

const SUPPORT_EMAIL = 'privacy@labourbaba.in';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState('personalData');

  const toggleSection = (sectionKey) => {
    setExpandedSection(prev => (prev === sectionKey ? null : sectionKey));
  };

  const handleEmail = async () => {
    try {
      const subject = encodeURIComponent('LabourBaba Privacy Query');
      await Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}`);
    } catch (error) {
      console.log('Email Error:', error);
      Alert.alert(
        t('profile.help.emailErrorTitle', 'Unable to open email'),
        t('profile.help.emailErrorMessage', { email: SUPPORT_EMAIL }) || `Please email us at ${SUPPORT_EMAIL}`
      );
    }
  };

  // Sections config
  const sections = [
    {
      key: 'personalData',
      icon: <UserIcon width={22} height={22} fill={colors.primary} />,
      titleKey: 'profile.privacy.sections.personalData.title',
      contentKey: 'profile.privacy.sections.personalData.content',
    },
    {
      key: 'location',
      icon: <LocationIcon width={22} height={22} fill={colors.primary} />,
      titleKey: 'profile.privacy.sections.location.title',
      contentKey: 'profile.privacy.sections.location.content',
      highlight: true, // Highlights background tracking for worker awareness
    },
    {
      key: 'notifications',
      icon: <NotificationIcon width={22} height={22} fill={colors.primary} />,
      titleKey: 'profile.privacy.sections.notifications.title',
      contentKey: 'profile.privacy.sections.notifications.content',
    },
    {
      key: 'usage',
      icon: <ShieldIcon width={22} height={22} fill={colors.primary} />,
      titleKey: 'profile.privacy.sections.usage.title',
      contentKey: 'profile.privacy.sections.usage.content',
    },
    {
      key: 'security',
      icon: <ShieldIcon width={22} height={22} fill={colors.primary} />,
      titleKey: 'profile.privacy.sections.security.title',
      contentKey: 'profile.privacy.sections.security.content',
    },
    {
      key: 'contact',
      icon: <EmailIcon width={22} height={22} fill={colors.primary} />,
      titleKey: 'profile.privacy.sections.contact.title',
      contentKey: 'profile.privacy.sections.contact.content',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TopAppBar title={t('profile.privacy.screenTitle', 'Privacy Policy')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Hero Area */}
        <LinearGradient
          colors={[colors.primaryLight, '#F9F8F7']}
          style={styles.heroCard}
        >
          <View style={styles.iconCircle}>
            <ShieldIcon width={36} height={42} fill={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>
            {t('profile.privacy.introTitle', 'Your Privacy Matters')}
          </Text>
          <Text style={styles.heroSubtitle}>
            {t('profile.privacy.introDesc', 'At LabourBaba, we value your trust. This Privacy Policy explains how we collect, use, and protect your information when you use the LabourBaba Worker application.')}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {t('profile.privacy.lastUpdated', 'Last Updated: July 2026')}
            </Text>
          </View>
        </LinearGradient>

        {/* Expandable Policy Sections */}
        <View style={styles.sectionList}>
          {sections.map((sec) => {
            const isExpanded = expandedSection === sec.key;
            return (
              <View
                key={sec.key}
                style={[
                  styles.card,
                  isExpanded && styles.cardActive,
                  sec.highlight && styles.cardHighlight,
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.cardHeader}
                  onPress={() => toggleSection(sec.key)}
                >
                  <View style={styles.titleWrap}>
                    <View style={[styles.iconWrap, sec.highlight && styles.iconWrapHighlight]}>
                      {sec.icon}
                    </View>
                    <Text style={[styles.cardTitle, sec.highlight && styles.cardTitleHighlight]}>
                      {t(sec.titleKey)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.dropdownIconWrap,
                      isExpanded && styles.dropdownIconWrapExpanded,
                    ]}
                  >
                    <DropDownIcon width={14} height={14} fill={colors.inkMuted} />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.cardContent}>
                    <View style={styles.divider} />
                    <Text style={styles.cardText}>
                      {t(sec.contentKey)}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Footer Support Card */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerHeading}>
            {t('profile.help.needMoreHelp', 'Need More Help?')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.contactBox}
            onPress={handleEmail}
          >
            <View style={styles.contactIconWrap}>
              <EmailIcon width={24} height={24} fill={colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactTitle}>
                {t('profile.privacy.sections.contact.title', 'Contact Our Privacy Officer')}
              </Text>
              <Text style={styles.contactSubtitle}>
                {SUPPORT_EMAIL}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...shadow.card,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkMuted,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#F0D1C0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionList: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardActive: {
    borderColor: colors.primary,
  },
  cardHighlight: {
    backgroundColor: '#FFFBF9',
    borderColor: '#FFD4C0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5EDE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconWrapHighlight: {
    backgroundColor: '#FFE3D2',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    flex: 1,
  },
  cardTitleHighlight: {
    fontWeight: '700',
  },
  dropdownIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5EDE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIconWrapExpanded: {
    backgroundColor: '#FFE3D2',
    transform: [{ rotate: '180deg' }],
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 14,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5A4A42',
  },
  footerContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  footerHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#F0D1C0',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
    ...shadow.card,
  },
  contactIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  contactSubtitle: {
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 26,
    color: '#8C6F63',
  },
});
