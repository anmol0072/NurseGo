import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const offers = [
  { id: '1', title: 'First Visit Discount', description: 'Get 20% off on your first home nursing visit.', code: 'WELCOME20' },
  { id: '2', title: 'Senior Care Package', description: 'Book 5 visits and get the 6th visit absolutely free.', code: 'SENIORCARE' },
  { id: '3', title: 'Referral Bonus', description: 'Refer a friend and get ₹500 in your wallet.', code: 'REFER500' },
];

export default function OffersScreen({ navigation }: any) {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="pricetag-outline" size={24} color="#14b8a6" />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <Text style={styles.cardDesc}>{item.description}</Text>
      <View style={styles.codeContainer}>
        <Text style={styles.codeText}>Code: {item.code}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers & Promos</Text>
      </View>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginLeft: 8 },
  cardDesc: { fontSize: 14, color: '#64748b', marginBottom: 12, lineHeight: 20 },
  codeContainer: { backgroundColor: '#f0fdfa', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  codeText: { fontSize: 14, fontWeight: 'bold', color: '#14b8a6' },
});
