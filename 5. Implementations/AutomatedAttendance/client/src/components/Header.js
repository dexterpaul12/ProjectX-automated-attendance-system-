import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, borderRadius } from '../config/theme';

const Header = ({
  title = 'Welcome, Admin',
  subtitle = 'Manage accounts',
  onLogout,
  showBackButton = false,
  onBackPress,
  showLogout = false,
}) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitleText}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showLogout && onLogout && (
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          testID="logoutButton"
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.medium,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.full,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
  },
  logoutText: {
    color: colors.text.inverse,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Header; 