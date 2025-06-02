import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, borderRadius, spacing, typography } from '../../config/theme';

const { width, height } = Dimensions.get('window');

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background} />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Automated Attendance</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="qr-code" size={24} color={colors.text.inverse} />
              </View>
              <Text style={styles.featureText}>Quick QR code scanning</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="time" size={24} color={colors.text.inverse} />
              </View>
              <Text style={styles.featureText}>Real-time attendance tracking</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="stats-chart" size={24} color={colors.text.inverse} />
              </View>
              <Text style={styles.featureText}>Detailed attendance reports</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.text.inverse} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -height * 0.05,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    ...shadows.medium,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.xl,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.small,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  buttonIcon: {
    marginLeft: spacing.sm,
  },
});

export default Welcome; 