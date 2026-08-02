import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NurseDocumentScreen({ navigation }: any) {
  const [docs, setDocs] = useState({
    aadhar: false,
    incDiploma: false,
    degree: false,
  });

  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    ifsc: ''
  });

  const handleUpload = (docType: keyof typeof docs) => {
    Alert.alert('Upload Document', `Simulating file picker for ${docType}...`, [
      { text: 'Select File', onPress: () => setDocs(prev => ({ ...prev, [docType]: true })) }
    ]);
  };

  const handleSubmit = () => {
    if (!docs.aadhar || !docs.incDiploma) {
      Alert.alert('Incomplete', 'Aadhar and INC Diploma are mandatory.');
      return;
    }
    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.ifsc) {
      Alert.alert('Incomplete', 'Please provide complete bank details to receive your earnings.');
      return;
    }
    Alert.alert('Success', 'Verification documents and receiving details submitted!', [
      { text: 'Done', onPress: () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace('Nurse');
        }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.title}>Verification & Receiving</Text>
          <Text style={styles.subtitle}>Upload your documents and add your bank details to start earning.</Text>
        </View>

        <Text style={styles.sectionHeading}>KYC Documents</Text>
        <View style={styles.card}>
          
          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>Aadhar Card <Text style={styles.mandatory}>*</Text></Text>
              <Text style={styles.docStatus}>{docs.aadhar ? '✅ Uploaded' : 'Pending'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, docs.aadhar && styles.uploadedBtn]} 
              onPress={() => handleUpload('aadhar')}
            >
              <Text style={styles.uploadBtnText}>{docs.aadhar ? 'Replace' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>INC Diploma <Text style={styles.mandatory}>*</Text></Text>
              <Text style={styles.docStatus}>{docs.incDiploma ? '✅ Uploaded' : 'Pending'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, docs.incDiploma && styles.uploadedBtn]} 
              onPress={() => handleUpload('incDiploma')}
            >
              <Text style={styles.uploadBtnText}>{docs.incDiploma ? 'Replace' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>Nursing Degree</Text>
              <Text style={styles.docStatus}>{docs.degree ? '✅ Uploaded' : 'Optional'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, docs.degree && styles.uploadedBtn]} 
              onPress={() => handleUpload('degree')}
            >
              <Text style={styles.uploadBtnText}>{docs.degree ? 'Replace' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>

        </View>

        <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Bank Details (Receiving)</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Account Holder Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="As per bank records"
              placeholderTextColor="#94a3b8"
              value={bankDetails.accountName}
              onChangeText={(text) => setBankDetails(prev => ({ ...prev, accountName: text }))}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 123456789012"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={bankDetails.accountNumber}
              onChangeText={(text) => setBankDetails(prev => ({ ...prev, accountNumber: text }))}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>IFSC Code</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. HDFC0001234"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
              value={bankDetails.ifsc}
              onChangeText={(text) => setBankDetails(prev => ({ ...prev, ifsc: text }))}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Submit Details</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 60,
  },
  headerContainer: {
    marginBottom: 24,
    marginTop: 10,
  },
  backBtn: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
    lineHeight: 22,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  mandatory: {
    color: '#ef4444',
  },
  docStatus: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '600',
  },
  uploadBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  uploadedBtn: {
    backgroundColor: '#ccfbf1',
  },
  uploadBtnText: {
    color: '#0f766e',
    fontWeight: '700',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#0f766e',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
  },
});
