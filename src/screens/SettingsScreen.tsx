import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>{t('settings.title')}</Title>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{t('settings.language')}</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => changeLanguage('en')}
            style={styles.languageButton}
            labelStyle={styles.buttonLabel}
          >
            {t('settings.english')}
          </Button>
          <Button
            mode="contained"
            onPress={() => changeLanguage('sw')}
            style={styles.languageButton}
            labelStyle={styles.buttonLabel}
          >
            {t('settings.swahili')}
          </Button>
        </View>
      </View>
    </View>
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
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  languageButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#006666',
  },
  buttonLabel: {
    fontSize: 14,
  },
});