import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, borderRadius } from '../config/theme';

const CustomAlert = ({ 
  visible, 
  type = 'success', 
  message, 
  onClose,
  showConfirmButton = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm
}) => {
  const getTypeStyles = () => {
    switch(type) {
      case 'success':
        return {
          backgroundColor: colors.success,
          icon: 'checkmark-circle',
          title: 'Success!'
        };
      case 'error':
        return {
          backgroundColor: colors.error,
          icon: 'alert-circle',
          title: 'Error!'
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          icon: 'warning',
          title: 'Warning!'
        };
      case 'confirm':
        return {
          backgroundColor: colors.primary,
          icon: 'help-circle',
          title: 'Confirm'
        };
      default:
        return {
          backgroundColor: colors.success,
          icon: 'checkmark-circle',
          title: 'Success!'
        };
    }
  };

  const typeStyles = getTypeStyles();
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={[styles.iconContainer, { backgroundColor: typeStyles.backgroundColor }]}>
            <Ionicons 
              name={typeStyles.icon}
              size={40} 
              color="white" 
            />
          </View>
          
          <Text style={styles.title}>
            {typeStyles.title}
          </Text>
          
          <Text style={styles.message}>
            {message}
          </Text>
          
          <View style={styles.buttonContainer}>
            {showConfirmButton ? (
              <>
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: colors.primary }]} 
                  onPress={onConfirm}
                >
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: typeStyles.backgroundColor }]} 
                onPress={onClose}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 320,
    ...shadows.large,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text.primary,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '600',
  }
});

export default CustomAlert; 