import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useTranslation } from 'react-i18next';
import { generateReport } from '../database/queries';
import { Dimensions } from 'react-native';

export default function ReportsScreen() {
  const { t } = useTranslation();
  const [report, setReport] = useState<{ period: string; totalSales: number; totalExpenses: number; netProfit: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (period: 'daily' | 'weekly' | 'monthly') => {
    setLoading(true);
    try {
      const data = await generateReport(period);
      setReport(data);
    } catch (err) {
      console.error('❌ Error fetching report', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = report ? {
    labels: [t(`reports.${report.period}`)],
    datasets: [
      { data: [report.totalSales], color: () => '#008080', strokeWidth: 2 },
      { data: [report.totalExpenses], color: () => '#d32f2f', strokeWidth: 2 },
      { data: [report.netProfit], color: () => '#4caf50', strokeWidth: 2 },
    ],
  } : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>{t('reports.title')}</Title>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => fetchReport('daily')}
          style={styles.reportButton}
          labelStyle={styles.buttonLabel}
          disabled={loading}
        >
          {t('reports.daily')}
        </Button>
        <Button
          mode="contained"
          onPress={() => fetchReport('weekly')}
          style={styles.reportButton}
          labelStyle={styles.buttonLabel}
          disabled={loading}
        >
          {t('reports.weekly')}
        </Button>
        <Button
          mode="contained"
          onPress={() => fetchReport('monthly')}
          style={styles.reportButton}
          labelStyle={styles.buttonLabel}
          disabled={loading}
        >
          {t('reports.monthly')}
        </Button>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>{t('reports.loading')}</Text>
      ) : report ? (
        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>{t(`reports.${report.period}`)} {t('reports.summary')}</Text>
          <Text style={styles.reportDetail}>{t('reports.totalSales')}: KES {report.totalSales.toFixed(2)}</Text>
          <Text style={styles.reportDetail}>{t('reports.totalExpenses')}: KES {report.totalExpenses.toFixed(2)}</Text>
          <Text style={styles.reportDetail}>{t('reports.netProfit')}: KES {report.netProfit.toFixed(2)}</Text>
          {chartData && (
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '6', strokeWidth: '2', stroke: '#008080' },
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>
      ) : (
        <Text style={styles.noReportText}>{t('reports.selectPeriod')}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#008080',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  reportButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#006666',
  },
  buttonLabel: {
    fontSize: 14,
  },
  reportContainer: {
    padding: 16,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  reportDetail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  noReportText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
});