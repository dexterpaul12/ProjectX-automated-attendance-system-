export const colors = {
  primary: '#00796B',      // Teal primary color
  secondary: '#26A69A',    // Lighter teal for secondary elements
  accent: '#FF6E40',       // Orange accent for important actions
  success: '#66BB6A',      // Green for success states
  warning: '#FFCA28',      // Amber for warnings
  error: '#EF5350',        // Red for errors
  background: '#F5F7F9',   // Light gray-blue background
  surface: '#FFFFFF',      // White surface
  text: {
    primary: '#263238',    // Dark blue-gray for primary text
    secondary: '#455A64',  // Medium blue-gray for secondary text
    disabled: '#90A4AE',   // Light blue-gray for disabled text
    inverse: '#FFFFFF',    // White text for dark backgrounds
  },
  border: '#E0E0E0',       // Light gray border
  gradients: {
    primary: ['#004D40', '#00796B'],  // Dark to medium teal gradient
    secondary: ['#00796B', '#26A69A'], // Medium to light teal gradient
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  }
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
}; 