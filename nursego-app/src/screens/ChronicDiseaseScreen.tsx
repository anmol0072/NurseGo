import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChronicDiseaseScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('Diabetes');

  const conditions = [
    { id: 'Diabetes', icon: 'water', color: '#3b82f6' },
    { id: 'Hypertension', icon: 'heart', color: '#ef4444' },
    { id: 'Asthma', icon: 'cloud', color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chronic Care Hub</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {conditions.map((cond) => (
            <TouchableOpacity 
              key={cond.id} 
              style={[styles.tab, activeTab === cond.id && styles.activeTab]}
              onPress={() => setActiveTab(cond.id)}
            >
              <Ionicons name={cond.icon as any} size={16} color={activeTab === cond.id ? '#fff' : cond.color} style={{ marginRight: 6 }} />
              <Text style={[styles.tabText, activeTab === cond.id && styles.activeTabText]}>{cond.id}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Metric Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
             <Text style={styles.metricTitle}>Latest Reading</Text>
             <Text style={styles.metricDate}>Today, 08:30 AM</Text>
          </View>
          <View style={styles.metricValueContainer}>
             <Text style={styles.metricValue}>
               {activeTab === 'Diabetes' ? '112' : activeTab === 'Hypertension' ? '128/82' : '96%'}
             </Text>
             <Text style={styles.metricUnit}>
               {activeTab === 'Diabetes' ? 'mg/dL' : activeTab === 'Hypertension' ? 'mmHg' : 'SpO2'}
             </Text>
          </View>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
            <Text style={styles.statusText}>In Control Range</Text>
          </View>
        </View>

        {/* Management Plan */}
        <Text style={styles.sectionTitle}>Your Management Plan</Text>
        
        <View style={styles.planCard}>
           <View style={styles.planIconBox}>
             <Ionicons name="medical" size={24} color="#1d4ed8" />
           </View>
           <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Weekly Nurse Check-in</Text>
              <Text style={styles.planDesc}>A certified nurse visits every Sunday to check vitals and adjust medication.</Text>
           </View>
           <TouchableOpacity 
             style={styles.actionBtn}
             onPress={() => navigation.navigate('FindingNurse', { serviceName: 'Weekly Nurse Check-in', basePrice: 400, distance: 2.5 })}
           >
             <Text style={styles.actionBtnText}>Book</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.planCard}>
           <View style={styles.planIconBox}>
             <Ionicons name="nutrition" size={24} color="#10b981" />
           </View>
           <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Dietary Consultation</Text>
              <Text style={styles.planDesc}>Review your {activeTab.toLowerCase()} diet plan with our nutritionist.</Text>
           </View>
           <TouchableOpacity 
             style={styles.actionBtn}
             onPress={() => navigation.navigate('FindingNurse', { serviceName: 'Dietary Consultation', basePrice: 600, distance: 4.2 })}
           >
             <Text style={styles.actionBtnText}>Book</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.planCard}>
           <View style={styles.planIconBox}>
             <Ionicons name="document-text" size={24} color="#8b5cf6" />
           </View>
           <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Monthly Report PDF</Text>
              <Text style={styles.planDesc}>Share this 30-day trend report with your primary doctor.</Text>
           </View>
           <TouchableOpacity 
             style={styles.actionBtn}
             onPress={() => navigation.navigate('HealthRecords')}
           >
             <Text style={styles.actionBtnText}>View</Text>
           </TouchableOpacity>
        </View>

        {/* Doctor Banner */}
        <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.doctorBanner}>
           <View style={{ flex: 1 }}>
             <Text style={styles.bannerTitle}>Consult Specialist</Text>
             <Text style={styles.bannerDesc}>Not feeling well? Speak to a senior doctor via video call instantly.</Text>
             <TouchableOpacity style={styles.bannerBtn} onPress={() => navigation.navigate('VideoConsult')}>
                <Text style={styles.bannerBtnText}>Connect Now</Text>
             </TouchableOpacity>
           </View>
           <Ionicons name="videocam" size={48} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: 20, bottom: 20 }} />
        </LinearGradient>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  tabsContainer: { backgroundColor: '#fff', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 12 },
  activeTab: { backgroundColor: '#1d4ed8' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  metricCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metricTitle: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  metricDate: { fontSize: 13, color: '#94a3b8' },
  metricValueContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  metricValue: { fontSize: 40, fontWeight: '900', color: '#0f172a' },
  metricUnit: { fontSize: 16, fontWeight: '600', color: '#64748b', marginLeft: 8 },
  statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#059669', fontSize: 13, fontWeight: '700', marginLeft: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  planCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  planIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  planInfo: { flex: 1 },
  planTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  planDesc: { fontSize: 12, color: '#64748b', lineHeight: 18 },
  actionBtn: { backgroundColor: '#eff6ff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginLeft: 12 },
  actionBtnText: { color: '#1d4ed8', fontSize: 13, fontWeight: '700' },
  doctorBanner: { marginTop: 12, padding: 24, borderRadius: 20, overflow: 'hidden' },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  bannerDesc: { color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  bannerBtn: { alignSelf: 'flex-start', backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  bannerBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' }
});
