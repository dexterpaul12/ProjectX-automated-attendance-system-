import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, borderRadius } from '../config/theme';

const TabBar = ({
  activeTab = 'dashboard',
  onTabPress,
  tabs
}) => {
  const defaultTabs = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'grid-outline',
      activeIcon: 'grid',
    },
    {
      key: 'users',
      label: 'Users',
      icon: 'people-outline',
      activeIcon: 'people',
    },
    {
      key: 'courses',
      label: 'Courses',
      icon: 'book-outline',
      activeIcon: 'book',
    }
  ];

  const tabsToRender = tabs || defaultTabs;

  return (
    <View style={styles.container}>
      {tabsToRender.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
          >
            <View style={[
              styles.iconContainer,
              isActive && styles.activeIconContainer
            ]}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? colors.text.inverse : colors.text.secondary}
              />
            </View>
            <Text style={[
              styles.tabLabel,
              isActive && styles.activeTabLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 70,
    paddingBottom: 10,
    ...shadows.medium,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default TabBar; 