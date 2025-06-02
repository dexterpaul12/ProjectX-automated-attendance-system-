import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InstructorTabBar from '../../components/InstructorTabBar';
import Header from '../../components/Header';
import TrendChart from '../../components/TrendChart';
import InstructorCourses from './InstructorCourses';
import QRCodeGenerator from './QRCode';
import { API_URL } from '../../config/api';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import { colors, shadows, borderRadius, spacing } from '../../config/theme';

const { width } = Dimensions.get('window');

const InstructorDashboard = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalCourses: 0,
    activeClasses: 0,
    attendanceRate: 0,
  });
  const [trendData, setTrendData] = useState({
    labels: [],
    datasets: [
      {
        data: [0],
      },
    ],
  });
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'success',
    message: '',
    showConfirmButton: false,
    onConfirm: null
  });

  useEffect(() => {
    fetchStatistics();
    fetchTrendData();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      if (!user || !user.idNumber) {
        console.error('User ID not available in AuthContext:', user);
        return;
      }

      console.log('Fetching statistics for instructor:', user.idNumber);

      // Fetch instructor courses
      const coursesResponse = await fetch(`${API_URL}/api/courses/instructor/${user.idNumber}`);
      if (!coursesResponse.ok) {
        console.error('Failed to fetch courses:', await coursesResponse.text());
        throw new Error('Failed to fetch courses');
      }
      
      const coursesData = await coursesResponse.json();
      console.log('Courses data received:', coursesData);
      
      // Calculate total students across all courses
      let totalStudentsCount = 0;
      coursesData.forEach(course => {
        totalStudentsCount += course.totalStudents || 0;
      });
      
      // For now, set active classes to the total number of courses
      // This can be refined later based on actual scheduling data
      const activeCourses = coursesData.length;
      
      // Attendance rate would need to come from attendance records
      // For now, we'll leave it at 0 until we implement that API
      
      setStatistics({
        totalStudents: totalStudentsCount,
        totalCourses: coursesData.length,
        activeClasses: activeCourses,
        attendanceRate: 0, // Will be updated when attendance API is implemented
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendData = async () => {
    try {
      // Get last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      // Format dates for labels
      const labels = last7Days.map(date => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
      });

      // Initialize with zeros until we implement the attendance history API
      const attendanceData = new Array(7).fill(0);

      setTrendData({
        labels,
        datasets: [
          {
            data: attendanceData,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching trend data:', error);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      // Use custom alert for web
      setAlertConfig({
        visible: true,
        type: 'confirm',
        message: 'Are you sure you want to log out?',
        showConfirmButton: true,
        onConfirm: async () => {
          try {
            await logout();
            navigation.replace('Login');
          } catch (error) {
            console.error('Logout error:', error);
            navigation.replace('Login');
          }
        }
      });
    } else {
      // Use native Alert for mobile
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes, Logout",
            onPress: async () => {
              try {
                await logout();
                navigation.replace('Login');
              } catch (error) {
                console.error('Logout error:', error);
                navigation.replace('Login');
              }
            }
          }
        ]
      );
    }
  };

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ScrollView style={styles.dashboardContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading dashboard data...</Text>
              </View>
            ) : (
              <>
                <View style={styles.chartSection}>
                  <TrendChart
                    data={trendData}
                    title="Attendance Rate (Last 7 Days)"
                  />
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                      <View style={[styles.iconCircle, {backgroundColor: colors.primary}]}>
                        <Ionicons name="people" size={22} color="#fff" />
                      </View>
                      <Text style={styles.statValue}>{statistics.totalStudents}</Text>
                      <Text style={styles.statLabel}>Total Students</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={[styles.iconCircle, {backgroundColor: colors.secondary}]}>
                        <Ionicons name="library" size={22} color="#fff" />
                      </View>
                      <Text style={styles.statValue}>{statistics.totalCourses}</Text>
                      <Text style={styles.statLabel}>Total Courses</Text>
                    </View>
                  </View>
                  <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                      <View style={[styles.iconCircle, {backgroundColor: colors.primary}]}>
                        <Ionicons name="school" size={22} color="#fff" />
                      </View>
                      <Text style={styles.statValue}>{statistics.activeClasses}</Text>
                      <Text style={styles.statLabel}>Active Classes</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={[styles.iconCircle, {backgroundColor: colors.secondary}]}>
                        <Ionicons name="analytics" size={22} color="#fff" />
                      </View>
                      <Text style={styles.statValue}>{statistics.attendanceRate}%</Text>
                      <Text style={styles.statLabel}>Attendance Rate</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        );
      case 'courses':
        return <InstructorCourses />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Instructor Dashboard"
        showLogout
        onLogout={handleLogout}
      />
      
      <View style={styles.content}>
        {renderContent()}
      </View>

      <InstructorTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
      
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        showConfirmButton={alertConfig.showConfirmButton}
        onConfirm={alertConfig.onConfirm}
        confirmText="Yes, Logout"
        cancelText="Cancel"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  dashboardContent: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text.secondary,
  },
  tabContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartSection: {
    alignItems: 'flex-end',
    paddingRight: 0,
    marginBottom: 20,
    marginRight: -2,
  },
  statsContainer: {
    padding: 16,
    gap: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: borderRadius.lg,
    minHeight: 130,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadows.medium,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});

export default InstructorDashboard; 