import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function TrackingScreen({ route, navigation }: any) {
  const { bookingId } = route.params || {};
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    
    const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    
    const fetchBooking = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}`);
        const data = await res.json();
        if (data.success) {
          setBooking(data.booking);
          // If COMPLETED, navigate to Rating immediately
          if (data.booking.status === 'COMPLETED') {
             navigation.replace('Rating', { 
               serviceName: data.booking.service.name, 
               total: data.booking.totalAmount, 
               paymentMethod: data.booking.paymentMethod 
             });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
    // Poll every 5 seconds for live tracking and status updates
    const interval = setInterval(fetchBooking, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleShare = async () => {
    try {
      // Family Dashboard Deep Link
      const url = `nursego://family/${bookingId}`;
      await Share.share({
        message: `Track my NurseGo visit live and view reports here: ${url}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={{marginTop: 12, color: '#64748b'}}>Loading Live Tracking...</Text>
      </View>
    );
  }

  const isPending = !booking || booking.status === 'PENDING';
  const nurse = booking?.nurse;

  return (
    <View style={styles.container}>
      {/* Map Background */}
      {Platform.OS === 'web' ? (
        <iframe 
          src="https://www.openstreetmap.org/export/embed.html?bbox=77.10%2C28.50%2C77.30%2C28.70&layer=mapnik"
          style={{ position: 'absolute', width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        <Image 
          source={{ uri: 'https://cdn.pixabay.com/photo/2019/09/22/16/20/location-4496459_1280.png' }} 
          style={StyleSheet.absoluteFill} 
          resizeMode="cover"
        />
      )}

      {/* Back Button Overlay */}
      <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('PatientDashboard')}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        
        {!isPending && (
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>ETA: 14 mins</Text>
          </View>
        )}
      </SafeAreaView>

      {/* Bottom Information Sheet */}
      <View style={styles.bottomSheet}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          style={styles.gradientTop}
        />
        
        <View style={styles.sheetContent}>
          <View style={styles.handleBar} />
          
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {isPending ? 'Looking for a Nurse...' : 'Nurse En Route'}
            </Text>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Ionicons name="share-social" size={20} color="#1d4ed8" />
              <Text style={styles.shareText}>Share to Family</Text>
            </TouchableOpacity>
          </View>

          {isPending ? (
            <View style={styles.pendingContainer}>
              <ActivityIndicator size="large" color="#1d4ed8" />
              <Text style={styles.pendingText}>Alerting nearby certified nurses for your {booking?.service?.name || 'service'}...</Text>
            </View>
          ) : (
            <View style={styles.nurseInfoCard}>
              <Image 
                source={{uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200'}} 
                style={styles.avatar} 
              />
              <View style={styles.nurseDetails}>
                <Text style={styles.nurseName}>{nurse?.name || 'Asha Johnson'}</Text>
                <Text style={styles.nurseRole}>{nurse?.skills || 'Certified IV Specialist'} • {nurse?.experience || 5} yrs exp</Text>
                
                <View style={styles.badgesRow}>
                  <View style={styles.badge}>
                    <Ionicons name="checkmark-circle" size={12} color="#059669" />
                    <Text style={styles.badgeText}>INC Verified</Text>
                  </View>
                  <View style={styles.badge}>
                    <Ionicons name="shield-checkmark" size={12} color="#059669" />
                    <Text style={styles.badgeText}>BG Checked</Text>
                  </View>
                </View>
                
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.ratingText}>{(nurse?.rating || 4.9).toFixed(1)} Rating</Text>
                </View>
              </View>
            </View>
          )}

          {!isPending && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="chatbubble" size={24} color="#1d4ed8" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="call" size={24} color="#1d4ed8" />
              </TouchableOpacity>

              <View style={styles.waitingBtn}>
                 <Text style={styles.waitingText}>Waiting for Nurse to arrive</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e2e8f0' },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  backButton: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  etaBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    justifyContent: 'center',
  },
  etaText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', zIndex: 20 },
  gradientTop: { height: 40, width: '100%' },
  sheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 20,
  },
  handleBar: { width: 40, height: 5, backgroundColor: '#e2e8f0', borderRadius: 3, alignSelf: 'center', marginBottom: 24 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  shareText: { color: '#1d4ed8', fontWeight: '700', fontSize: 13, marginLeft: 6 },
  pendingContainer: { alignItems: 'center', paddingVertical: 20 },
  pendingText: { color: '#64748b', fontSize: 15, marginTop: 16, textAlign: 'center' },
  nurseInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  nurseDetails: { flex: 1 },
  nurseName: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  nurseRole: { fontSize: 13, color: '#64748b', fontWeight: '500', marginBottom: 8 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#059669', marginLeft: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, color: '#475569', fontWeight: '600', marginLeft: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  waitingBtn: { flex: 1, backgroundColor: '#e2e8f0', height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  waitingText: { color: '#64748b', fontSize: 14, fontWeight: '700' },
});
