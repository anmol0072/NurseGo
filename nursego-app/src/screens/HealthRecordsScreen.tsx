import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

export default function HealthRecordsScreen({ navigation }: any) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token;

      const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      
      const res = await fetch(`${BASE_URL}/api/bookings/patient`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      let combinedRecords: any[] = [];
      
      if (data.success) {
        // Filter bookings that have a treatment report or prescription
        const withRecords = data.bookings.filter((b: any) => b.treatmentReport || b.prescriptionUrl);
        combinedRecords = [...withRecords];
      }

      // Fetch manually uploaded documents
      const docsRes = await fetch(`${BASE_URL}/api/documents/${user.id}`);
      const docsData = await docsRes.json();
      if (docsData.success) {
        const manualDocs = docsData.data.map((d: any) => ({
          ...d,
          isManualDoc: true,
          createdAt: d.createdAt || new Date().toISOString()
        }));
        combinedRecords = [...combinedRecords, ...manualDocs];
      }

      // Sort by date descending
      combinedRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecords(combinedRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.canceled || !result.assets[0]) return;

      setLoading(true);
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

      const formData = new FormData();
      formData.append('prescription', {
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: result.assets[0].mimeType || 'application/pdf'
      } as any);

      const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' } // Fetch automatically sets multipart boundaries
      });
      const uploadData = await uploadRes.json();

      if (uploadData.success) {
        // Save to DB
        await fetch(`${BASE_URL}/api/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            type: 'Lab Report',
            url: uploadData.url
          })
        });
        Alert.alert('Success', 'Lab Report uploaded successfully');
        fetchRecords();
      } else {
        Alert.alert('Error', 'Failed to upload document');
        setLoading(false);
      }
    } catch (err) {
      console.error('Upload Error:', err);
      Alert.alert('Error', 'An error occurred during upload');
      setLoading(false);
    }
  };

  const generatePDF = async (booking: any) => {
    const report = booking.treatmentReport;
    if (!report) return;

    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #1d4ed8; }
            .title { font-size: 20px; color: #64748b; margin-top: 5px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .label { font-weight: bold; color: #475569; width: 150px; }
            .value { flex: 1; }
            .section { margin-top: 30px; margin-bottom: 15px; font-size: 18px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">NurseGo</div>
            <div class="title">Digital Treatment Report</div>
          </div>
          
          <div class="row"><div class="label">Patient Name:</div><div class="value">${booking.patient?.name || 'N/A'}</div></div>
          <div class="row"><div class="label">Date:</div><div class="value">${new Date(report.createdAt).toLocaleDateString()}</div></div>
          <div class="row"><div class="label">Service:</div><div class="value">${booking.service?.name}</div></div>
          <div class="row"><div class="label">Attending Nurse:</div><div class="value">${booking.nurse?.name} (${booking.nurse?.incRegistrationNumber || 'INC Verified'})</div></div>
          
          <div class="section">Vital Signs</div>
          <div class="row"><div class="label">Blood Pressure:</div><div class="value">${report.bp || 'N/A'} mmHg</div></div>
          <div class="row"><div class="label">Pulse:</div><div class="value">${report.pulse || 'N/A'} bpm</div></div>
          <div class="row"><div class="label">Temperature:</div><div class="value">${report.temperature || 'N/A'} &deg;F</div></div>
          
          <div class="section">Treatment Details</div>
          <div class="row"><div class="label">Procedure:</div><div class="value">${report.procedureDone || 'N/A'}</div></div>
          <div class="row"><div class="label">Medicines:</div><div class="value">${report.medicinesGiven || 'N/A'}</div></div>
          <div class="row"><div class="label">Nurse Notes:</div><div class="value">${report.notes || 'None'}</div></div>
          
          <div class="footer">
            Generated securely by NurseGo App.<br/>
            ABDM Health Record Ready.
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      
      if (Platform.OS === 'web') {
        window.open(uri);
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('PDF Generated', 'File saved: ' + uri);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.isManualDoc) {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
              <Text style={[styles.badgeText, { color: '#059669' }]}>{item.type}</Text>
            </View>
          </View>
          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>Manually Uploaded Record</Text>
            <TouchableOpacity style={styles.outlineBtn} onPress={() => {
              if (Platform.OS === 'web') window.open(item.url);
              else Linking.openURL(item.url);
            }}>
              <Ionicons name="eye" size={18} color="#1d4ed8" />
              <Text style={styles.outlineBtnText}>View Document</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.service?.name}</Text>
          </View>
        </View>

        {item.treatmentReport ? (
          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>Nurse: {item.nurse?.name}</Text>
            <View style={styles.vitalsRow}>
              <Text style={styles.vitalText}>BP: {item.treatmentReport.bp}</Text>
              <Text style={styles.vitalText}>Pulse: {item.treatmentReport.pulse}</Text>
              <Text style={styles.vitalText}>Temp: {item.treatmentReport.temperature}</Text>
            </View>
            <TouchableOpacity style={styles.pdfBtn} onPress={() => generatePDF(item)}>
              <Ionicons name="document-text" size={18} color="#fff" />
              <Text style={styles.pdfBtnText}>Download PDF Report</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportSection}>
             <Text style={styles.reportTitle}>Prescription Uploaded</Text>
             <TouchableOpacity style={styles.outlineBtn}>
                <Ionicons name="eye" size={18} color="#1d4ed8" />
                <Text style={styles.outlineBtnText}>View Prescription</Text>
             </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1d4ed8" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Health Records</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.uploadBanner}>
            <Ionicons name="cloud-upload-outline" size={32} color="#1d4ed8" style={{ marginBottom: 12 }} />
            <Text style={styles.uploadTitle}>Not linked with ABHA?</Text>
            <Text style={styles.uploadSub}>You can manually upload your lab reports and prescriptions here.</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadDocument}>
              <Text style={styles.uploadBtnText}>Upload Lab Report</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No health records found.</Text>
            <Text style={styles.emptySub}>Your digital treatment reports and prescriptions will appear here securely.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  listContent: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  date: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  badge: { backgroundColor: '#e0e7ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '800', color: '#4338ca' },
  reportSection: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  reportTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  vitalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  vitalText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1d4ed8', height: 44, borderRadius: 12 },
  pdfBtnText: { color: '#fff', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#1d4ed8', height: 44, borderRadius: 12 },
  outlineBtnText: { color: '#1d4ed8', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '800', color: '#475569', marginTop: 16, marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 22 },
  uploadBanner: { backgroundColor: '#e0e7ff', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  uploadTitle: { fontSize: 16, fontWeight: '800', color: '#1e3a8a', marginBottom: 4 },
  uploadSub: { fontSize: 13, color: '#3b82f6', textAlign: 'center', marginBottom: 16 },
  uploadBtn: { backgroundColor: '#1d4ed8', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  uploadBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
