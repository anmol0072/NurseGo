import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function TermsModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkTerms = async () => {
      try {
        const hasAccepted = await AsyncStorage.getItem('hasAcceptedTerms');
        if (!hasAccepted) {
          setVisible(true);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkTerms();
  }, []);

  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem('hasAcceptedTerms', 'true');
      setVisible(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Terms and Conditions</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.effectiveDate}>Please read and accept to continue using NurseGo.</Text>

          <Text style={styles.paragraph}>
            These Terms and Conditions ("Terms") govern the use of the NurseGo mobile application, website, and related services ("Platform"). By registering, booking any healthcare service, ordering medicines, or availing laboratory services through NurseGo, you agree to these Terms.
          </Text>

          <Text style={styles.sectionTitle}>1. Definitions</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Platform</Text> means the NurseGo mobile application and website.{'\n\n'}
            <Text style={styles.bold}>Patient</Text> means any individual registering or booking services through NurseGo.{'\n\n'}
            <Text style={styles.bold}>Healthcare Professional</Text> means a registered nurse or other healthcare professional authorized to provide services within the scope of applicable law.{'\n\n'}
            <Text style={styles.bold}>Partner Laboratory</Text> means a diagnostic laboratory engaged by NurseGo for sample collection and testing.{'\n\n'}
            <Text style={styles.bold}>Partner Pharmacy/Chemist</Text> means a licensed retail pharmacy supplying medicines through the Platform.
          </Text>

          <Text style={styles.sectionTitle}>2. Nature of Services</Text>
          <Text style={styles.paragraph}>
            NurseGo is a technology-enabled healthcare platform that facilitates access to home healthcare services, laboratory investigations, and medicine delivery through licensed partners.{'\n\n'}
            NurseGo is not a hospital, emergency medical service, ambulance operator, pharmaceutical manufacturer, or diagnostic laboratory.{'\n\n'}
            Healthcare services are provided by qualified professionals acting within their legal scope of practice.
          </Text>

          <Text style={styles.sectionTitle}>3. Eligibility</Text>
          <Text style={styles.paragraph}>
            Users must:{'\n'}
            - Be at least 18 years of age, or{'\n'}
            - Be represented by a parent or legal guardian.{'\n'}
            - Provide true and accurate information.{'\n'}
            - Maintain confidentiality of login credentials.{'\n\n'}
            Providing false information may result in suspension or termination of the account.
          </Text>

          <Text style={styles.sectionTitle}>4. Services Available</Text>
          <Text style={styles.paragraph}>
            Depending on availability and clinical suitability, NurseGo may facilitate:{'\n'}
            - Home nursing care{'\n'}
            - IV injections{'\n'}
            - IM injections{'\n'}
            - Intravenous fluid administration{'\n'}
            - Wound dressing{'\n'}
            - Catheterization{'\n'}
            - Ryle's tube insertion and care (where legally permitted){'\n'}
            - Feeding tube care{'\n'}
            - Suture and staple removal{'\n'}
            - Vital signs monitoring{'\n'}
            - Blood sugar monitoring{'\n'}
            - Nebulization{'\n'}
            - Sample collection{'\n'}
            - Laboratory investigations{'\n'}
            - Medicine ordering through licensed partner pharmacies{'\n'}
            - Other nursing procedures legally permitted under applicable laws.
          </Text>

          <Text style={styles.sectionTitle}>5. Prescription Requirement</Text>
          <Text style={styles.paragraph}>
            Certain medicines, injections, procedures, and laboratory investigations require a valid prescription issued by a Registered Medical Practitioner.{'\n\n'}
            The Patient agrees:{'\n'}
            - to upload or produce a valid prescription whenever legally required;{'\n'}
            - not to request administration of prescription medicines without a valid prescription; and{'\n'}
            - that NurseGo, its healthcare professionals, partner laboratories, or partner pharmacies may refuse service where required documentation is unavailable or appears invalid.
          </Text>

          <Text style={styles.sectionTitle}>6. Scope of Nursing Practice</Text>
          <Text style={styles.paragraph}>
            Nurses shall perform only those procedures that are legally permitted under applicable laws, professional standards, institutional protocols, and their training.{'\n\n'}
            NurseGo shall not compel any nurse to perform a procedure beyond their lawful scope of practice.
          </Text>

          <Text style={styles.sectionTitle}>7. Medical Information</Text>
          <Text style={styles.paragraph}>
            The Patient shall provide complete and accurate information regarding:{'\n'}
            - current illnesses;{'\n'}
            - previous medical history;{'\n'}
            - allergies;{'\n'}
            - medications;{'\n'}
            - pregnancy;{'\n'}
            - infectious diseases;{'\n'}
            - surgeries; and{'\n'}
            - any other information relevant to treatment.{'\n\n'}
            Failure to disclose relevant information may adversely affect treatment and patient safety.
          </Text>

          <Text style={styles.sectionTitle}>8. Home Visit Conditions</Text>
          <Text style={styles.paragraph}>
            The Patient shall:{'\n'}
            - provide a safe environment;{'\n'}
            - maintain cleanliness suitable for healthcare procedures;{'\n'}
            - ensure adequate lighting;{'\n'}
            - secure aggressive pets;{'\n'}
            - ensure respectful behaviour toward healthcare professionals.{'\n\n'}
            Healthcare professionals may discontinue services where their safety is threatened.
          </Text>

          <Text style={styles.sectionTitle}>9. Emergency Conditions</Text>
          <Text style={styles.paragraph}>
            NurseGo is not an emergency response service.{'\n\n'}
            Patients experiencing chest pain, stroke symptoms, severe breathing difficulty, uncontrolled bleeding, seizures, loss of consciousness, or any life-threatening condition should immediately contact emergency services or proceed to the nearest hospital.
          </Text>

          <Text style={styles.sectionTitle}>10. Laboratory Services</Text>
          <Text style={styles.paragraph}>
            Laboratory investigations are conducted by licensed partner diagnostic laboratories.{'\n\n'}
            The Patient understands that:{'\n'}
            - reports are prepared solely by the laboratory;{'\n'}
            - NurseGo does not modify laboratory reports;{'\n'}
            - sample rejection may occur due to quality concerns;{'\n'}
            - interpretation of reports should be obtained from a qualified doctor.
          </Text>

          <Text style={styles.sectionTitle}>11. Medicine Orders</Text>
          <Text style={styles.paragraph}>
            Medicine delivery is fulfilled through licensed partner pharmacies.{'\n\n'}
            The Patient agrees that:{'\n'}
            - prescription medicines shall only be supplied upon receipt and verification of a valid prescription where required by law;{'\n'}
            - availability of medicines cannot be guaranteed;{'\n'}
            - substitutions shall only be made with Patient consent and in accordance with applicable law;{'\n'}
            - medicines once supplied may not be returnable except where permitted under applicable law.
          </Text>

          <Text style={styles.sectionTitle}>12. Appointment Scheduling</Text>
          <Text style={styles.paragraph}>
            Appointments remain subject to:{'\n'}
            - healthcare professional availability;{'\n'}
            - geographical coverage;{'\n'}
            - weather;{'\n'}
            - public emergencies;{'\n'}
            - clinical suitability.{'\n\n'}
            NurseGo may reschedule appointments where necessary.
          </Text>

          <Text style={styles.sectionTitle}>13. Payments</Text>
          <Text style={styles.paragraph}>
            Payments shall be made using approved payment methods available on the Platform.{'\n\n'}
            Applicable taxes shall be charged in accordance with law.{'\n\n'}
            Additional procedures requested during the visit may attract additional charges after obtaining Patient consent.
          </Text>

          <Text style={styles.sectionTitle}>14. Cancellation and Refund</Text>
          <Text style={styles.paragraph}>
            Cancellation and refunds shall be governed by NurseGo's Refund Policy.{'\n\n'}
            No refund may be available where:{'\n'}
            - the healthcare professional has reached the Patient's location;{'\n'}
            - consumables have been opened or used;{'\n'}
            - medicines have already been dispensed;{'\n'}
            - laboratory samples have already been collected.
          </Text>

          <Text style={styles.sectionTitle}>15. Patient Responsibilities</Text>
          <Text style={styles.paragraph}>
            The Patient agrees to:{'\n'}
            - follow medical advice;{'\n'}
            - cooperate during treatment;{'\n'}
            - verify medicines before administration;{'\n'}
            - immediately report adverse reactions;{'\n'}
            - refrain from requesting illegal or unethical procedures.
          </Text>

          <Text style={styles.sectionTitle}>16. Right to Refuse Service</Text>
          <Text style={styles.paragraph}>
            NurseGo or its service partners may refuse or discontinue services where:{'\n'}
            - the requested service is unsafe;{'\n'}
            - no valid prescription exists;{'\n'}
            - the Patient requires hospitalisation;{'\n'}
            - there is abusive conduct;{'\n'}
            - fraudulent documents are submitted;{'\n'}
            - the Patient requests illegal activities.
          </Text>

          <Text style={styles.sectionTitle}>17. Privacy</Text>
          <Text style={styles.paragraph}>
            Patient information shall be collected, processed, stored, and shared only as permitted under applicable Indian law and NurseGo's Privacy Policy.{'\n\n'}
            Medical information may be shared with:{'\n'}
            - treating healthcare professionals;{'\n'}
            - partner laboratories;{'\n'}
            - licensed pharmacies;{'\n'}
            - payment providers;{'\n'}
            - insurance providers where authorised;{'\n'}
            - government authorities where legally required.
          </Text>

          <Text style={styles.sectionTitle}>18. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            NurseGo exercises reasonable care while onboarding healthcare professionals and service partners.{'\n\n'}
            However:{'\n'}
            - treatment outcomes cannot be guaranteed;{'\n'}
            - medical complications may occur despite reasonable care;{'\n'}
            - NurseGo shall not be responsible for complications arising from incorrect medical history, failure to follow medical advice, delayed treatment, or undisclosed allergies.{'\n\n'}
            Nothing in these Terms limits liability where such limitation is prohibited by law.
          </Text>

          <Text style={styles.sectionTitle}>19. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All trademarks, logos, content, software, graphics, and intellectual property associated with NurseGo remain the exclusive property of NurseGo.
          </Text>

          <Text style={styles.sectionTitle}>20. Suspension of Accounts</Text>
          <Text style={styles.paragraph}>
            NurseGo reserves the right to suspend or permanently terminate accounts involved in:{'\n'}
            - fraud;{'\n'}
            - misuse of prescriptions;{'\n'}
            - abusive behaviour;{'\n'}
            - harassment of healthcare professionals;{'\n'}
            - repeated fake bookings;{'\n'}
            - illegal activities;{'\n'}
            - non-payment.
          </Text>

          <Text style={styles.sectionTitle}>21. Governing Laws</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by the laws of India, including, where applicable:{'\n'}
            - Information Technology Act, 2000 and rules made thereunder;{'\n'}
            - Consumer Protection Act, 2019;{'\n'}
            - Drugs and Cosmetics Act, 1940 and applicable Rules;{'\n'}
            - Pharmacy Act, 1948;{'\n'}
            - Indian Nursing Council Act, 1947 and applicable State Nursing Council regulations;{'\n'}
            - Clinical Establishments laws, where applicable to the services or partner establishments;{'\n'}
            - Digital Personal Data Protection Act, 2023, as applicable.{'\n\n'}
            Services shall comply with applicable regulations in the States of Punjab and Haryana and the Union Territory of Chandigarh, including directions issued by the respective Health Departments and competent authorities.
          </Text>

          <Text style={styles.sectionTitle}>22. Jurisdiction</Text>
          <Text style={styles.paragraph}>
            Any dispute arising from these Terms shall be subject to the exclusive jurisdiction of the competent courts having jurisdiction over NurseGo's registered office, unless applicable law provides otherwise.
          </Text>

          <Text style={styles.sectionTitle}>23. Amendments</Text>
          <Text style={styles.paragraph}>
            NurseGo may revise these Terms at any time. Updated Terms shall become effective upon publication on the Platform.
          </Text>

          <Text style={styles.sectionTitle}>24. Contact</Text>
          <Text style={styles.paragraph}>
            NurseGo Healthcare{'\n'}
            Email: nursegohealthcarecompany@gmail.com{'\n'}
            Phone: +91 78140 12460
          </Text>

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By creating an account, booking a service, ordering medicines, or using the Platform, you confirm that you have read, understood, and agreed to these Terms and Conditions.
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={handleAccept}>
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              style={styles.acceptButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.acceptButtonText}>I Accept</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 24,
  },
  effectiveDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'android' ? 30 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  acceptButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
