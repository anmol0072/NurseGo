import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const PAST_BOOKINGS = [
  {
    id: 'TRP-10492',
    date: '12 May, 2026',
    time: '10:30 AM',
    service: 'IV Drip Administration',
    nurseName: 'Asha Johnson',
    nurseRating: '4.9',
    amount: 850,
    status: 'Completed',
    location: '12, Safdarjung Enclave, New Delhi'
  },
  {
    id: 'TRP-09821',
    date: '02 Apr, 2026',
    time: '04:15 PM',
    service: 'Wound Dressing',
    nurseName: 'Ravi Kumar',
    nurseRating: '4.8',
    amount: 600,
    status: 'Completed',
    location: 'B-45, Vasant Vihar, New Delhi'
  },
  {
    id: 'TRP-08211',
    date: '14 Feb, 2026',
    time: '09:00 AM',
    service: 'Physiotherapy Session',
    nurseName: 'Priya Sharma',
    nurseRating: '5.0',
    amount: 1200,
    status: 'Completed',
    location: '12, Safdarjung Enclave, New Delhi'
  }
];

export default function BookingHistoryScreen({ navigation }: any) {
  const [rebookModalVisible, setRebookModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [rebookForm, setRebookForm] = useState({ date: '15 May, 2026', time: '10:00 AM' });
  const [userRole, setUserRole] = useState('PATIENT');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await AsyncStorage.getItem('user');
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed.role) setUserRole(parsed.role);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const isNurse = userRole === 'NURSE';
  
  // Theme colors based on role
  const primaryColor = isNurse ? '#14b8a6' : '#1d4ed8'; // Green for Nurse, Blue for Patient
  const secondaryColor = isNurse ? '#0f766e' : '#2563eb';
  const avatarBg = isNurse ? '#0d9488' : '#3b82f6';

  const openRebookModal = (service: string) => {
    setSelectedService(service);
    setRebookModalVisible(true);
  };

  const confirmRebook = () => {
    setRebookModalVisible(false);
    navigation.navigate('PatientDashboard', { preselectService: selectedService, date: rebookForm.date, time: rebookForm.time });
  };

  const handleDownloadReceipt = async (item: any) => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 28px; font-weight: bold; color: ${primaryColor}; margin: 0; }
              .subtitle { font-size: 16px; color: #666; margin-top: 5px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f9f9f9; padding-bottom: 10px; }
              .label { font-weight: bold; color: #555; }
              .value { color: #111; }
              .total { font-size: 22px; font-weight: bold; color: ${primaryColor}; text-align: right; margin-top: 30px; }
              .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #aaa; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="title">NurseGo Receipt</h1>
              <p class="subtitle">Transaction ID: ${item.id}</p>
            </div>
            <div class="row"><span class="label">Date:</span><span class="value">${item.date}</span></div>
            <div class="row"><span class="label">Time:</span><span class="value">${item.time}</span></div>
            <div class="row"><span class="label">Service:</span><span class="value">${item.service}</span></div>
            <div class="row"><span class="label">Nurse:</span><span class="value">${item.nurseName}</span></div>
            <div class="row"><span class="label">Status:</span><span class="value" style="color: green;">${item.status}</span></div>
            
            <div class="total">Total Paid: ₹${item.amount}</div>
            
            <div class="footer">Thank you for choosing NurseGo. For support, contact support@nursego.in</div>
          </body>
        </html>
      `;

      if (Platform.OS === 'web') {
        // Use browser print dialog to save as PDF on web
        await Print.printAsync({ html: htmlContent });
      } else {
        // Generate PDF and share/save on mobile
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Success', 'Receipt PDF generated, but sharing is not available on this device.');
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate receipt PDF.');
    }
  };

  const renderBooking = ({ item }: { item: typeof PAST_BOOKINGS[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.dateText}>{item.date} at {item.time}</Text>
          <Text style={styles.serviceText}>{item.service}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: primaryColor }]}>₹{item.amount}</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.nurseInfo}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{item.nurseName.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.nurseLabel}>Nurse:</Text>
          <Text style={styles.nurseName}>{item.nurseName}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.viewReceiptBtn} onPress={() => handleDownloadReceipt(item)}>
          <Ionicons name="download-outline" size={16} color={secondaryColor} />
          <Text style={[styles.viewReceiptText, { color: secondaryColor }]}>Download PDF Receipt</Text>
        </TouchableOpacity>
        {!isNurse && (
          <TouchableOpacity style={styles.rebookBtn} onPress={() => openRebookModal(item.service)}>
            <Text style={styles.rebookText}>Rebook</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(50, 20), backgroundColor: primaryColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={PAST_BOOKINGS}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Rebook Modal */}
      <Modal visible={rebookModalVisible} animationType="fade" transparent={true} onRequestClose={() => setRebookModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rebook Service</Text>
              <TouchableOpacity onPress={() => setRebookModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSub, { color: primaryColor }]}>{selectedService}</Text>

            <Text style={styles.inputLabel}>Select Date</Text>
            <TextInput style={styles.input} value={rebookForm.date} onChangeText={(text) => setRebookForm({...rebookForm, date: text})} placeholder="DD MMM, YYYY" />

            <Text style={styles.inputLabel}>Select Time</Text>
            <TextInput style={styles.input} value={rebookForm.time} onChangeText={(text) => setRebookForm({...rebookForm, time: text})} placeholder="HH:MM AM/PM" />

            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: primaryColor }]} onPress={confirmRebook}>
              <Text style={styles.confirmBtnText}>Confirm Rebooking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  listContent: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  dateText: { fontSize: 13, color: '#64748b', fontWeight: '600', marginBottom: 4 },
  serviceText: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  priceContainer: { alignItems: 'flex-end' },
  priceText: { fontSize: 18, fontWeight: '800' },
  statusText: { fontSize: 12, color: '#10b981', fontWeight: '700', marginTop: 2, backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  nurseInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  nurseLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  nurseName: { fontSize: 14, fontWeight: '700', color: '#334155' },
  viewReceiptBtn: { flexDirection: 'row', alignItems: 'center' },
  viewReceiptText: { fontWeight: '700', fontSize: 14, marginLeft: 6 },
  rebookBtn: { backgroundColor: '#0f172a', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  rebookText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  modalSub: { fontSize: 16, fontWeight: '700', marginBottom: 24 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#f8fafc', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 15, fontWeight: '500', color: '#0f172a' },
  confirmBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 24 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
