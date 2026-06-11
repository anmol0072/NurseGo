import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TreatmentReportForm({ route, navigation }: any) {
  const { bookingId } = route.params || {};

  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [temperature, setTemperature] = useState('');
  const [procedureDone, setProcedureDone] = useState('');
  const [medicinesGiven, setMedicinesGiven] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!bp || !pulse || !temperature || !procedureDone) {
      Alert.alert('Incomplete', 'Please fill all vital signs and procedure details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token;

      const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      
      const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bp,
          pulse,
          temperature,
          procedureDone,
          medicinesGiven,
          notes,
          woundImageUrls: '[]', // Placeholder for actual image uploads
          patientSignatureUrl: 'verified_digitally' // Placeholder
        })
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'Digital Treatment Report generated and saved!');
        navigation.navigate('NurseDashboard');
      } else {
        Alert.alert('Error', data.message || 'Failed to submit report');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network Error', 'Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Treatment Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Vital Signs</Text>
        
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Pressure (mmHg)</Text>
            <TextInput style={styles.input} placeholder="120/80" value={bp} onChangeText={setBp} />
          </View>
          <View style={{width: 16}} />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pulse (bpm)</Text>
            <TextInput style={styles.input} placeholder="72" value={pulse} onChangeText={setPulse} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Temperature (°F)</Text>
          <TextInput style={styles.input} placeholder="98.6" value={temperature} onChangeText={setTemperature} keyboardType="numeric" />
        </View>

        <Text style={styles.sectionTitle}>Treatment Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Procedure Performed</Text>
          <TextInput style={styles.textArea} placeholder="e.g. Administered IV fluids, cleaned wound..." value={procedureDone} onChangeText={setProcedureDone} multiline />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medicines Administered</Text>
          <TextInput style={styles.textArea} placeholder="e.g. Paracetamol 500mg" value={medicinesGiven} onChangeText={setMedicinesGiven} multiline />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nurse Notes (Optional)</Text>
          <TextInput style={styles.textArea} placeholder="Patient responded well to treatment..." value={notes} onChangeText={setNotes} multiline />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} 
          onPress={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Generate & Submit Report</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16, marginTop: 8 },
  row: { flexDirection: 'row', width: '100%' },
  inputGroup: { flex: 1, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15, color: '#0f172a' },
  textArea: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, minHeight: 100, fontSize: 15, color: '#0f172a', textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#1d4ed8', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 40 },
  submitBtnDisabled: { backgroundColor: '#93c5fd' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
