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
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: `Effective Date: [Insert Date]\nLast Updated: [Insert Date]\n\n1. Introduction\nWelcome to NurseGo Healthcare ("NurseGo", "we", "our", or "us").\n\nYour privacy is important to us. This Privacy Policy explains how NurseGo collects, uses, stores, shares, and protects your personal and health information when you use our mobile application, website, or related services.\n\nBy registering on NurseGo or using our services, you consent to the collection and processing of your information as described in this Privacy Policy.\n\n2. Who We Are\nNurseGo is a technology platform that enables users to book home healthcare services, nursing procedures, laboratory investigations, and medicine delivery through qualified healthcare professionals and licensed partner laboratories and pharmacies.\n\n3. Information We Collect\nDepending on the services you use, we may collect:\n\nA. Personal Information\n- Full name\n- Date of birth\n- Gender\n- Mobile number\n- Email address\n- Residential address\n- Emergency contact details\n- Government-issued identity details where required for verification\n\nB. Health Information\n- Medical history\n- Current illnesses\n- Allergies\n- Prescriptions\n- Diagnostic reports\n- Laboratory results\n- Medication details\n- Vital signs\n- Nursing assessment records\n- Treatment notes\n\nC. Payment Information\n- Billing details\n- Payment transaction information\n- Refund details\n\nNurseGo does not store complete debit or credit card details. Payments are processed through secure payment service providers.\n\nD. Device Information\n- Device model\n- Operating system\n- IP address\n- Device identifiers\n- App version\n- Crash reports\n- Browser information\n\nE. Location Information\nWith your permission, NurseGo may collect your location to:\n- Identify your address for home visits\n- Assign nearby healthcare professionals\n- Track service visits where applicable\n\n4. How We Use Your Information\nWe use your information to:\n- Create and manage your account.\n- Schedule home healthcare visits.\n- Connect you with healthcare professionals.\n- Arrange laboratory investigations.\n- Facilitate medicine orders through partner pharmacies.\n- Process payments and refunds.\n- Maintain medical records.\n- Improve our services.\n- Provide customer support.\n- Send appointment reminders and important service updates.\n- Detect fraud and misuse.\n- Comply with legal and regulatory obligations.\n\n5. Sharing of Information\nWe may share your information only where necessary with:\n- Healthcare professionals providing your care.\n- Partner diagnostic laboratories.\n- Licensed pharmacies.\n- Secure payment gateways.\n- Technology service providers acting on our behalf.\n- Government authorities or law enforcement where required by law.\n- Courts or regulatory authorities when legally obligated.\n\nWe do not sell your personal information to third parties.\n\n6. Medicine Orders\nWhere you order medicines through NurseGo:\n- Prescription medicines will only be processed after verification of a valid prescription where required by law.\n- Medicine supply is fulfilled by licensed partner pharmacies.\n- Necessary order details may be shared with the dispensing pharmacy solely for order fulfilment.\n\n7. Laboratory Services\nWhen booking laboratory investigations:\n- Relevant patient information may be shared with the selected partner laboratory.\n- Laboratory reports are generated by the laboratory and may be made available through the NurseGo Platform for your convenience.\n\n8. Data Security\nNurseGo implements reasonable technical and organizational safeguards to protect your information, including:\n- Encryption during transmission where applicable.\n- Secure authentication controls.\n- Restricted access to medical records.\n- Role-based access permissions.\n- Activity logging.\n- Regular security monitoring.\n\nDespite reasonable safeguards, no electronic system can guarantee absolute security.\n\n9. Data Retention\nWe retain personal and medical information only for as long as reasonably necessary to:\n- Provide healthcare services.\n- Meet legal and regulatory requirements.\n- Resolve disputes.\n- Maintain business records.\n- Prevent fraud.\n\nWhen information is no longer required, it will be securely deleted or anonymized, subject to applicable legal obligations.\n\n10. Your Rights\nSubject to applicable law, you may have the right to:\n- Access your personal information.\n- Request correction of inaccurate information.\n- Update your profile.\n- Request deletion of information where legally permissible.\n- Withdraw consent for certain processing activities.\n- Raise concerns regarding your privacy.\n\nRequests may be subject to legal, clinical, or regulatory limitations.\n\n11. Cookies and Similar Technologies\nOur website and application may use cookies or similar technologies to:\n- Maintain user sessions.\n- Improve functionality.\n- Remember user preferences.\n- Analyse platform performance.\n\nYou may control certain cookie settings through your browser where applicable.\n\n12. Children's Privacy\nNurseGo services may be used for minors only by or under the supervision of a parent or legal guardian. We do not knowingly collect personal information directly from children without appropriate authorization.\n\n13. Third-Party Services\nOur Platform may integrate with third-party services such as payment gateways, mapping services, communication providers, laboratories, and pharmacies. Their use of information is governed by their own privacy policies.\n\n14. Changes to this Privacy Policy\nNurseGo may revise this Privacy Policy from time to time. Updated versions will be published on the Platform with the revised effective date.\n\nContinued use of the Platform after publication constitutes acceptance of the updated Privacy Policy.\n\n15. Applicable Law\nThis Privacy Policy shall be governed by the laws of India, including applicable provisions of:\n- The Digital Personal Data Protection Act, 2023.\n- The Information Technology Act, 2000 and applicable rules.\n- The Consumer Protection Act, 2019.\n- Other applicable healthcare, pharmacy, and data protection laws and regulations.\n\n16. Grievance Redressal\nIf you have questions, concerns, or complaints regarding this Privacy Policy or the handling of your personal information, you may contact:\n\nPrivacy Officer / Grievance Officer\nNurseGo Healthcare\nEmail: nursegohealthcarecompany@gmail.com\nPhone: +91 78140 12460\n\nNurseGo will make reasonable efforts to acknowledge and address privacy-related complaints in accordance with applicable law.\n\n17. Contact Us\nNurseGo Healthcare\nEmail: nursegohealthcarecompany@gmail.com\nPhone: +91 78140 12460\n\nDeclaration\nBy creating an account, booking a healthcare service, ordering medicines, scheduling laboratory investigations, or otherwise using the NurseGo Platform, you acknowledge that you have read, understood, and agreed to this Privacy Policy.`
  },
  {
    id: 'rights',
    title: 'Patient Rights & Responsibilities',
    content: `Effective Date: [Insert Date]\nLast Updated: [Insert Date]\n\n1. Purpose\nAt NurseGo Healthcare ("NurseGo"), we are committed to delivering safe, respectful, ethical, and patient-centered healthcare services. This Patient Rights and Responsibilities Policy outlines the rights of every patient using the NurseGo Platform and the responsibilities expected from patients to ensure safe and effective care.\n\nThis Policy applies to all users booking home nursing services, laboratory investigations, and medicine delivery through the NurseGo Platform.\n\n2. Patient Rights\n\n2.1 Right to Respect and Dignity\nEvery patient has the right to:\n- Be treated with courtesy, compassion, dignity, and respect.\n- Receive healthcare services without discrimination based on religion, caste, gender, age, disability, language, marital status, economic status, or any other protected characteristic.\n- Be free from harassment, abuse, intimidation, or humiliation.\n\n2.2 Right to Safe Healthcare\nPatients have the right to receive services:\n- From qualified and appropriately trained healthcare professionals.\n- Using hygienic and safe clinical practices.\n- With appropriate infection prevention measures.\n- In accordance with accepted professional standards.\n\n2.3 Right to Privacy and Confidentiality\nPatients have the right to expect that:\n- Personal information will remain confidential.\n- Medical records will be protected.\n- Information will only be shared with authorized persons or where required by law.\n- Healthcare professionals will respect privacy during examinations and procedures.\n\n2.4 Right to Information\nPatients have the right to receive clear information regarding:\n- The proposed nursing procedure.\n- Expected benefits.\n- Possible risks and complications.\n- Alternative options where applicable.\n- Charges applicable to the service.\n\nInformation should be provided in language reasonably understandable to the patient.\n\n2.5 Right to Informed Consent\nPatients have the right to:\n- Give voluntary consent before procedures are performed.\n- Refuse any non-emergency nursing procedure.\n- Withdraw consent before commencement of a procedure, subject to applicable charges and legal requirements.\n\n2.6 Right to Qualified Care\nPatients have the right to expect that healthcare professionals:\n- Act within their professional scope of practice.\n- Follow accepted clinical standards.\n- Maintain professional conduct.\n- Respect patient dignity and privacy.\n\n2.7 Right to Access Medical Records\nSubject to applicable law, patients may request access to records maintained by NurseGo relating to services provided through the Platform.\n\n2.8 Right to Transparent Pricing\nPatients have the right to:\n- Know the estimated charges before booking.\n- Receive payment confirmation.\n- Understand applicable cancellation and refund terms.\n\n2.9 Right to Raise Complaints\nPatients may submit complaints regarding:\n- Service quality.\n- Behaviour of healthcare professionals.\n- Billing issues.\n- Delays.\n- Privacy concerns.\n- Technical issues.\n\nComplaints will be reviewed fairly and without retaliation.\n\n2.10 Right to Emergency Advice\nPatients have the right to be informed when their medical condition requires urgent hospital care instead of home healthcare services.\n\n3. Patient Responsibilities\n\n3.1 Provide Accurate Information\nPatients are responsible for providing complete and truthful information regarding:\n- Medical history.\n- Allergies.\n- Current medications.\n- Existing illnesses.\n- Previous surgeries.\n- Pregnancy.\n- Infectious diseases.\n- Prescriptions.\n\nFailure to provide accurate information may affect patient safety and the suitability of services.\n\n3.2 Follow Medical Advice\nPatients should:\n- Follow instructions provided by healthcare professionals.\n- Take prescribed medicines as directed by their treating doctor.\n- Inform NurseGo promptly of any adverse reactions or changes in condition.\n\n3.3 Provide a Safe Environment\nPatients shall:\n- Maintain a reasonably clean and safe environment for home visits.\n- Ensure sufficient lighting and access.\n- Keep pets under control.\n- Avoid exposing healthcare professionals to unsafe conditions.\n\n3.4 Respect Healthcare Professionals\nPatients shall:\n- Treat healthcare professionals with courtesy and respect.\n- Refrain from abusive, threatening, discriminatory, or violent behaviour.\n- Avoid harassment, including verbal, physical, or sexual harassment.\n\nNurseGo reserves the right to suspend or terminate services in cases of misconduct.\n\n3.5 Provide Valid Prescriptions\nWhere required by law, patients must provide a valid prescription issued by a Registered Medical Practitioner before requesting:\n- Prescription medicines.\n- Prescription injections.\n- Certain laboratory investigations.\n- Other regulated healthcare services.\n\nHealthcare professionals may decline services if legally required documentation is not provided.\n\n3.6 Verify Medicines\nPatients should verify:\n- Medicine name.\n- Dosage.\n- Expiry date.\n- Prescription details.\n\nAny discrepancy should be reported immediately before administration or consumption.\n\n3.7 Attend Scheduled Appointments\nPatients should:\n- Be available at the scheduled appointment time.\n- Ensure access to the service location.\n- Inform NurseGo promptly if rescheduling or cancellation is required.\n\n3.8 Payment Responsibility\nPatients agree to:\n- Pay applicable charges.\n- Complete payment using approved payment methods.\n- Review invoices and report discrepancies promptly.\n\n3.9 Appropriate Use of Services\nPatients shall not:\n- Request illegal procedures.\n- Seek administration of medicines without lawful prescriptions where required.\n- Submit forged prescriptions or false medical records.\n- Misuse the Platform for fraudulent purposes.\n\n4. Refusal of Service\nNurseGo or its healthcare professionals may decline or discontinue services where:\n- The requested procedure is outside the professional scope of practice.\n- The patient's condition requires hospital-based treatment.\n- A valid prescription is unavailable where required.\n- The environment is unsafe.\n- The patient or accompanying persons engage in abusive or threatening behaviour.\n- There is suspected fraud or misuse of the Platform.\n\n5. Privacy\nPatients are expected to respect the privacy of healthcare professionals. Audio or video recording of healthcare professionals without their knowledge or where prohibited by law should be avoided, except where permitted for legitimate purposes.\n\n6. Complaints and Feedback\nPatients are encouraged to provide feedback regarding services received.\n\nComplaints may be submitted through the NurseGo application or by contacting:\nNurseGo Healthcare\nEmail: nursegohealthcarecompany@gmail.com\nPhone: +91 78140 12460\n\nNurseGo will review complaints in a fair, impartial, and timely manner.\n\n7. Compliance with Applicable Laws\nThis Policy is intended to support compliance with applicable Indian laws and regulations, including those relating to consumer protection, data protection, healthcare, pharmacy, and professional conduct. It should be read together with the NurseGo Terms & Conditions, Privacy Policy, and other applicable policies.\n\n8. Changes to this Policy\nNurseGo may amend this Policy from time to time. Updated versions will be made available on the Platform and will take effect upon publication.\n\nDeclaration\nBy registering on the NurseGo Platform or availing any service, the Patient acknowledges that they have read, understood, and agree to comply with this Patient Rights and Responsibilities Policy.`
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
