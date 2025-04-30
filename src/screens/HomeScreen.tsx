import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  DrawerLayoutAndroid,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Text, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Inventory: undefined;
  Sales: undefined;
  Expenses: undefined;
  Reports: undefined;
  Settings: undefined;
};

export default function HomeScreen() {
  const drawer = useRef<DrawerLayoutAndroid>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const drawerContent = () => (
    <View style={styles.drawerContainer}>
      <Title style={styles.drawerTitle}>{t('home.menu')}</Title>

      {[
        { label: t('home.inventory'), screen: 'Inventory' },
        { label: t('home.sales'), screen: 'Sales' },
        { label: t('home.expenses'), screen: 'Expenses' },
        { label: t('home.reports'), screen: 'Reports' },
        { label: t('home.settings'), screen: 'Settings' },
      ].map((item) => (
        <TouchableOpacity
          key={item.screen}
          onPress={() => {
            drawer.current?.closeDrawer();
            navigation.navigate(item.screen as keyof RootStackParamList);
          }}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={drawerContent}
    >
      <ImageBackground
        source={require('../../assets/BizPro.png')} // Replace with your background image
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Hamburger Icon */}
          <TouchableOpacity onPress={() => drawer.current?.openDrawer()} style={styles.menuButton}>
            <Icon name="menu" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.container}>
            <Title style={styles.headerTitle}>{t('home.title')}</Title>
            <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

           

            <Text style={styles.welcome}>{t('home.welcomeMessage')}</Text>

            {/* Offline Indicator */}
            <View style={styles.offlineIndicator}>
              <Icon name="cloud-off" size={20} color="#fff" />
              <Text style={styles.offlineText}>{t('home.offline')}</Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#008080aa',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginTop: 8,
    textAlign: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginVertical: 24,
  },
  welcome: {
    fontSize: 18,
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  offlineText: {
    fontSize: 14,
    color: '#eee',
    marginLeft: 8,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#008080',
  },
  drawerItem: {
    paddingVertical: 12,
  },
  drawerText: {
    fontSize: 16,
    color: '#333',
  },
});
