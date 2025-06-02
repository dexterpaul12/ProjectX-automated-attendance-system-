import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, shadows, borderRadius } from '../config/theme';

const TrendChart = ({ data, title, width: customWidth, height: customHeight }) => {
  // Ensure data values are numbers
  const chartData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.map(value => Number(value) || 0)
    }))
  };

  const chartWidth = customWidth || Dimensions.get('window').width - 32;
  const chartHeight = customHeight || 220;

  return (
    <View style={[styles.container, { width: chartWidth }]}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={chartWidth - 30}  // Account for container padding
        height={chartHeight}
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: colors.primary,
          backgroundGradientFrom: colors.gradients.primary[0],
          backgroundGradientTo: colors.gradients.primary[1],
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: borderRadius.lg,
          },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: colors.accent,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 20,
    marginBottom: 25,
    ...shadows.medium,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: borderRadius.lg,
  },
});

export default TrendChart; 