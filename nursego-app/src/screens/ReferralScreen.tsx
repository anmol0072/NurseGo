import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReferralScreen({ navigation }: any) {
  const referralCode = 'NURSEGO500';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use my code ${referralCode} to sign up on NurseGo and get ₹500 off your first booking!`,
      });
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer a Friend</Text>
      </View>
      <View style={styles.content}>
        <Ionicons name="gift-outline" size={80} color="#14b8a6" style={styles.icon} />
        <Text style={styles.title}>Invite Friends, Get Rewarded!</Text>
        <Text style={styles.subtitle}>
          Share your referral code with friends and family. They get ₹500 off their first booking, and you get ₹500 in your wallet when their booking is complete.
        </Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
          <Text style={styles.codeText}>{referralCode}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.shareButtonText}>Share Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  content: { flex: 1, alignItems: 'center', padding: 24, justifyContent: 'center' },
  icon: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  codeBox: { backgroundColor: '#f8fafc', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', width: '100%', alignItems: 'center', marginBottom: 32 },
  codeLabel: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 8, letterSpacing: 1 },
  codeText: { fontSize: 28, fontWeight: 'bold', color: '#14b8a6', letterSpacing: 2 },
  shareButton: { backgroundColor: '#14b8a6', flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, width: '100%', justifyContent: 'center' },
  shareButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
