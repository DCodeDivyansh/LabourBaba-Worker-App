import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import TopAppBar from '../../components/TopAppBar';
import Booking from '../../../assets/booking.svg';
import DropDown from '../../../assets/dropdown.svg';
import Payment from '../../../assets/payment.svg';
import User from '../../../assets/user.svg';
import Call from '../../../assets/call.svg';
import Email from '../../../assets/email.svg';

const SUPPORT_PHONE = '+919266596319';
const SUPPORT_EMAIL = 'support@labourbaba.in';

const CATEGORY_ICONS = {
  booking: Booking,
  payments: Payment,
  account: User,
};

// Category -> FAQ id mapping. The actual question/answer copy lives in the
// translation files (profile.help.faqs.<id>) so it stays in sync with hi.json.
const FAQ_IDS_BY_CATEGORY = {
  booking: ['b1', 'b2', 'b3'],
  payments: ['p1', 'p2', 'p3'],
  account: ['a1', 'a2', 'a3'],
};

const CATEGORY_ORDER = ['booking', 'payments', 'account'];

const Help = () => {
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState('booking');
  const [expandedId, setExpandedId] = useState(
    FAQ_IDS_BY_CATEGORY.booking[0],
  );

  const filteredFaqIds = FAQ_IDS_BY_CATEGORY[activeCategory];

  const toggleFaq = id => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleSelectCategory = categoryId => {
    setActiveCategory(categoryId);
    setExpandedId(FAQ_IDS_BY_CATEGORY[categoryId][0]);
  };

  const handleCall = async () => {
    try {
      await Linking.openURL(`tel:${SUPPORT_PHONE}`);
    } catch (err) {
      console.log(err);
    }
  };
  const handleEmail = async () => {
    try {
      const subject = encodeURIComponent(
        t('profile.help.emailSubject'),
      );

      await Linking.openURL(
        `mailto:${SUPPORT_EMAIL}?subject=${subject}`,
      );
    } catch (error) {
      console.log('Email Error:', error);

      Alert.alert(
        t('profile.help.emailErrorTitle'),
        t('profile.help.emailErrorMessage', {
          email: SUPPORT_EMAIL,
        }),
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TopAppBar title={t('profile.help.screenTitle')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>{t('profile.help.faqTitle')}</Text>
        <Text style={styles.sectionSubtitle}>
          {t('profile.help.faqSubtitle')}
        </Text>

        {/* Category Chips */}
        <View style={styles.categoryRow}>
          {CATEGORY_ORDER.map(categoryId => {
            const active = activeCategory === categoryId;
            const Icon = CATEGORY_ICONS[categoryId];

            return (
              <TouchableOpacity
                key={categoryId}
                activeOpacity={0.85}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => handleSelectCategory(categoryId)}
              >
                <View
                  style={[
                    styles.categoryIconWrap,
                    active && styles.categoryIconWrapActive,
                  ]}
                >
                  <Icon width={20} height={20} />
                </View>

                <Text
                  style={[
                    styles.categoryLabel,
                    active && styles.categoryLabelActive,
                  ]}
                >
                  {t(`profile.help.categories.${categoryId}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FAQ Accordion */}
        <View style={styles.faqList}>
          {filteredFaqIds.map(id => {
            const expanded = expandedId === id;

            return (
              <View
                key={id}
                style={[styles.faqCard, expanded && styles.faqCardActive]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.faqHeader}
                  onPress={() => toggleFaq(id)}
                >
                  <Text style={styles.faqQuestion}>
                    {t(`profile.help.faqs.${id}.question`)}
                  </Text>

                  <View
                    style={[
                      styles.dropdownIconWrap,
                      expanded && styles.dropdownIconWrapExpanded,
                    ]}
                  >
                    <DropDown width={16} height={16} />
                  </View>
                </TouchableOpacity>

                {expanded && (
                  <Text style={styles.faqAnswer}>
                    {t(`profile.help.faqs.${id}.answer`)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Need More Help */}
        <Text style={styles.title}>{t('profile.help.needMoreHelp')}</Text>
        <Text style={styles.sectionSubtitle}>
          {t('profile.help.needMoreHelpSubtitle')}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.box2}
          onPress={handleCall}
        >
          <View style={styles.contactIconWrap}>
            <Call width={24} height={24} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.callTitle}>{t('profile.help.callUs')}</Text>
            <Text style={styles.callSubtitle}>
              {t('profile.help.callAvailability')}
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.box2}
          onPress={handleEmail}
        >
          <View style={styles.contactIconWrap}>
            <Email width={24} height={24} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.callTitle}>
              {t('profile.help.emailSupport')}
            </Text>
            <Text style={styles.callSubtitle}>
              {t('profile.help.emailResponseTime')}
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F7',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  title: {
    color: '#1F1F1F',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 24,
    marginLeft: 20,
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: '#8C6F63',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 16,
  },

  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  categoryChip: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0D1C0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  categoryChipActive: {
    borderColor: '#FF5A00',
    backgroundColor: '#FFF3EC',
  },

  categoryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5EDE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  categoryIconWrapActive: {
    backgroundColor: '#FF5A00',
  },

  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6D4C41',
  },

  categoryLabelActive: {
    color: '#FF5A00',
  },

  faqList: {
    paddingHorizontal: 16,
    marginTop: 12,
  },

  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D1C0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },

  faqCardActive: {
    borderColor: '#FF5A00',
  },

  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginRight: 12,
  },

  dropdownIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F5EDE9',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '0deg' }],
  },

  dropdownIconWrapExpanded: {
    backgroundColor: '#FFE3D2',
    transform: [{ rotate: '180deg' }],
  },

  faqAnswer: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: '#5A4A42',
  },

  box2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F0D1C0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0,
    shadowRadius: 3,
    elevation: 2,
  },

  contactIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3EC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    marginLeft: 12,
    flex: 1,
  },

  callTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  callSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  chevron: {
    fontSize: 26,
    color: '#8C6F63',
  },
});