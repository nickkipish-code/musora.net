import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { tokens } from '@museum/ui';
import { ordersStorage } from '../storage/ordersStorage';
import { reverseGeocode } from '../utils/nominatim';

export default function HomeScreen({ navigation, route }: any) {
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  useEffect(() => {
    if (route.params?.address) {
      // Если получен адрес из AddressSearch, сразу переходим к созданию заказа
      setTimeout(() => {
        navigation.navigate('CreateOrder', { 
          address: route.params.address,
          wasteType: null 
        });
      }, 100);
    }
    
    // Подсчитываем активные заказы
    const orders = ordersStorage.getAllOrders();
    const active = orders.filter(o => 
      o.status === 'CREATED' || 
      o.status === 'ACCEPTED' || 
      o.status === 'EN_ROUTE' || 
      o.status === 'ARRIVED'
    );
    setActiveOrdersCount(active.length);
  }, [route.params?.address, navigation]);

  const createOrderQuick = () => {
    navigation.navigate('AddressSearch');
  };

  const viewOrdersHistory = () => {
    navigation.navigate('OrdersHistory');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.title}>мусора.нет</Text>
          <Text style={styles.subtitle}>Вывоз мусора с доставкой</Text>
        </View>

        {/* Быстрое действие - создать заказ */}
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={createOrderQuick}
        >
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionIcon}>🗑️</Text>
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>Вынести мусор</Text>
              <Text style={styles.quickActionSubtitle}>Создать новый заказ</Text>
            </View>
          </View>
          <Text style={styles.quickActionArrow}>→</Text>
        </TouchableOpacity>

        {/* Активные заказы */}
        {activeOrdersCount > 0 && (
          <TouchableOpacity 
            style={styles.activeOrdersCard}
            onPress={viewOrdersHistory}
          >
            <View style={styles.activeOrdersHeader}>
              <Text style={styles.activeOrdersIcon}>🚚</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.activeOrdersTitle}>
                  У вас {activeOrdersCount} активных заказ{activeOrdersCount === 1 ? '' : 'а'}
                </Text>
                <Text style={styles.activeOrdersSubtitle}>Отслеживать →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Быстрые ссылки */}
        <View style={styles.quickLinksSection}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          
          <View style={styles.quickLinksGrid}>
            <TouchableOpacity 
              style={styles.quickLink}
              onPress={viewOrdersHistory}
            >
              <Text style={styles.quickLinkIcon}>📋</Text>
              <Text style={styles.quickLinkText}>История заказов</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickLink}
              onPress={createOrderQuick}
            >
              <Text style={styles.quickLinkIcon}>📍</Text>
              <Text style={styles.quickLinkText}>Выбрать адрес</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickLinksGrid}>
            <TouchableOpacity 
              style={styles.quickLink}
              onPress={() => Alert.alert('Поддержка', 'Свяжитесь с нами по телефону')}
            >
              <Text style={styles.quickLinkIcon}>💬</Text>
              <Text style={styles.quickLinkText}>Поддержка</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Информация о сервисе */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Как это работает?</Text>
            <Text style={styles.infoText}>
              1. Выберите адрес на карте{'\n'}
              2. Укажите детали заказа{'\n'}
              3. Оплатите и отслеживайте{'\n'}
              4. Получите вывоз мусора
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  title: {
    color: tokens.colors.primary,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: tokens.colors.muted,
    fontSize: 16,
  },
  quickAction: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: tokens.colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    color: tokens.colors.bg,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    color: tokens.colors.bg,
    fontSize: 14,
    opacity: 0.9,
  },
  quickActionArrow: {
    color: tokens.colors.bg,
    fontSize: 28,
    fontWeight: '700',
  },
  activeOrdersCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#FF980020',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  activeOrdersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeOrdersIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  activeOrdersTitle: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activeOrdersSubtitle: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  quickLinksSection: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickLinksGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickLink: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  quickLinkIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickLinkText: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: tokens.colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  infoTitle: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: tokens.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  debugButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: tokens.colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.divider,
  },
  debugButtonText: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
