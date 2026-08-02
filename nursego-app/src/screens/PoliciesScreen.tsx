import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const POLICIES = [
  {
    id: 'refund',
    title: 'Refund & Cancellation Policy',
    content: `Effective Date: [Insert Date]\nLast Updated: [Insert Date]\n\n1. Purpose\nThis Refund & Cancellation Policy governs cancellations, rescheduling, refunds, and related matters for all services booked through the NurseGo Platform, including home nursing services, laboratory investigations, and medicine orders.\nBy booking any service through NurseGo, you agree to this Policy.\n\n2. Scope\nThis Policy applies to:\n- Home nursing services\n- IV and IM injections\n- Wound dressing\n- Catheterization\n- Ryle's tube care\n- Suture or staple removal\n- Other nursing procedures\n- Home sample collection and laboratory investigations\n- Medicine orders through partner pharmacies\n\n3. Cancellation by the Patient\nA. Home Nursing Services\nMore than 2 hours before the scheduled appointment\n- Full refund of the service fee, after deduction of any non-refundable payment gateway charges (if applicable).\n\nWithin 2 hours before the scheduled appointment\n- A cancellation fee may be deducted because a healthcare professional has been assigned and operational costs have been incurred.\n\nAfter the healthcare professional has reached the service location\n- No refund of the visit charge.\n- Charges for consumables used, if any, will also apply.\n\nB. Laboratory Investigations\nIf the sample has not been collected:\n- The booking may be cancelled and a refund processed, subject to applicable deductions.\n\nIf the sample has already been collected:\n- No refund will be available, as the testing process has commenced.\n\nC. Medicine Orders\nBefore the pharmacy confirms and processes the order:\n- The order may be cancelled and refunded.\n\nAfter the order has been packed, dispatched, or delivered:\n- Cancellation may not be possible.\n\nPrescription medicines are generally non-returnable and non-refundable, except where required by law or where the incorrect, damaged, expired, or defective medicine was supplied.\n\n4. Rescheduling\nPatients may request to reschedule an appointment, subject to:\n- Availability of healthcare professionals.\n- Availability of laboratory personnel.\n- Service area coverage.\n\nNurseGo reserves the right to decline rescheduling where operationally impracticable.\n\n5. Cancellation by NurseGo\nNurseGo may cancel or reschedule bookings due to:\n- Unavailability of healthcare professionals.\n- Severe weather.\n- Public emergencies.\n- Safety concerns.\n- Technical failures.\n- Incorrect booking information.\n- Circumstances beyond reasonable control.\n\nWhere NurseGo cancels a booking before service commencement, the Patient will ordinarily receive a full refund of the amount paid for that booking.\n\n6. Situations Where Refunds May Not Be Available\nRefunds may not be granted where:\n- The healthcare professional has already arrived at the Patient's location.\n- The requested healthcare service has been fully or substantially provided.\n- Medical consumables have been opened or used.\n- Laboratory samples have been collected.\n- Medicines have been dispensed or delivered, except where permitted by law.\n- Incorrect information provided by the Patient results in failed service delivery.\n- The Patient refuses treatment after the healthcare professional arrives, without a valid reason attributable to NurseGo.\n\n7. Failed Visits\nIf a healthcare professional is unable to provide the booked service because:\n- the Patient is unavailable,\n- the address provided is incorrect,\n- access to the premises is denied,\n- required documents or prescriptions are not produced, or\n- the environment is unsafe,\nNurseGo may treat the booking as a completed visit for the purpose of applicable charges.\n\n8. Service Quality Concerns\nIf you believe that a service was not provided as expected, you may submit a complaint with supporting information within 48 hours of the service.\nNurseGo will review the matter and, where appropriate, may provide one or more of the following:\n- re-performance of the service (where feasible),\n- partial refund,\n- full refund, or\n- another suitable resolution.\n\nThe outcome will depend on the facts of each case.\n\n9. Refund Process\nApproved refunds will ordinarily be processed to the original payment method used for the booking.\nProcessing times depend on the payment service provider and financial institution and may vary.\n\n10. Fraudulent or Abusive Claims\nNurseGo reserves the right to reject refund requests where there is evidence of:\n- fraud,\n- misuse of the Platform,\n- false complaints,\n- repeated abuse of the refund process, or\n- submission of forged prescriptions or documents.\nAppropriate action, including suspension or termination of the user account, may be taken.\n\n11. Force Majeure\nNurseGo shall not be liable for delays, cancellations, or inability to provide services due to events beyond its reasonable control, including natural disasters, epidemics, government restrictions, strikes, civil disturbances, or widespread technical failures.\n\n12. Compliance with Applicable Law\nThis Policy shall be interpreted in accordance with applicable laws of India, including:\n- Consumer Protection Act, 2019.\n- Information Technology Act, 2000.\n- Digital Personal Data Protection Act, 2023 (where applicable).\n- Drugs and Cosmetics Act, 1940.\n- Other applicable healthcare and consumer protection laws.\n\nNothing in this Policy limits any rights available to consumers under applicable law.\n\n13. Contact for Refunds and Cancellations\nFor assistance regarding cancellations or refunds:\nNurseGo Healthcare\nEmail: nursegohealthcarecompany@gmail.com\nPhone: +91 78140 12460\n\nAcceptance\nBy booking any service through the NurseGo Platform, you acknowledge that you have read, understood, and agreed to this Refund & Cancellation Policy.`
  }
];

export default function PoliciesScreen({ navigation }: any) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0f766e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal & Policies</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageDescription}>
          Please read our policies carefully. Tap on any policy to view its full details.
        </Text>

        {POLICIES.map((policy) => {
          const isExpanded = expandedId === policy.id;
          return (
            <View key={policy.id} style={styles.accordionContainer}>
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={[styles.accordionHeader, isExpanded && styles.accordionHeaderExpanded]}
                onPress={() => toggleExpand(policy.id)}
              >
                <View style={styles.headerContent}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#0f766e" />
                  <Text style={styles.accordionTitle}>{policy.title}</Text>
                </View>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={styles.accordionBody}>
                  <Text style={styles.policyText}>{policy.content}</Text>
                </View>
              )}
            </View>
          );
        })}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f766e',
  },
  scrollContent: {
    padding: 20,
  },
  pageDescription: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 22,
  },
  accordionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  accordionHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 12,
    flex: 1,
  },
  accordionBody: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  policyText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 40,
  }
});
