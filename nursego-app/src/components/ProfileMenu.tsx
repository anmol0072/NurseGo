import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
  user: any;
}

export default function ProfileMenu({ visible, onClose, navigation, user }: ProfileMenuProps) {
  const insets = useSafeAreaInsets();
  
  const handleLogout = async () => {
    onClose();
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('Auth');
  };

  const handleNavigate = (route: string) => {
    onClose();
    navigation.navigate(route);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.menuContainer, { top: Math.max(insets.top, 20) + 60 }]}>
              
              <View style={styles.header}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user?.name?.substring(0, 2).toUpperCase() || 'U'}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user?.name || 'User'}</Text>
                  <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Profile')}>
                <Ionicons name="person-outline" size={20} color="#64748b" style={styles.icon} />
                <Text style={styles.menuText}>View Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('History')}>
                <Ionicons name="time-outline" size={20} color="#64748b" style={styles.icon} />
                <Text style={styles.menuText}>Booking History</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Settings')}>
                <Ionicons name="settings-outline" size={20} color="#64748b" style={styles.icon} />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#ef4444" style={styles.icon} />
                <Text style={[styles.menuText, { color: '#ef4444' }]}>Log Out</Text>
              </TouchableOpacity>
              
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuContainer: {
    position: 'absolute',
    right: 20,
    width: 250,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
  }
});
