import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const contacts = [
  { id: '1', name: 'National Emergency Number', number: '112', icon: 'call' },
  { id: '2', name: 'Ambulance', number: '102', icon: 'medical' },
  { id: '3', name: 'NurseGo Support Helpline', number: '+919876543210', icon: 'headset' },
];

export default function EmergencyContactsScreen({ navigation }: any) {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={24} color="#ef4444" />
        </View>
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactNumber}>{item.number}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.number)}>
        <Ionicons name="call" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
      </View>
      <FlatList
        data={contacts}
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  contactNumber: { fontSize: 14, color: '#64748b' },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
});
