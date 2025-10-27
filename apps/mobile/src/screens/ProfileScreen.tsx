import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GoldCard, tokens } from '@museum/ui';
import { ordersStorage } from '../storage/ordersStorage';

export default function ProfileScreen({ navigation }: any) {
  const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    loadStats();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadStats();
    });

    return unsubscribe;
  }, [navigation]);

  const loadStats = () => {
    const orders = ordersStorage.getAllOrders();
    const userOrders = orders.filter(o => o.userId === 'demo-user-1');
    
    setStats({
      total: userOrders.length,
      completed: userOrders.filter(o => o.status === 'COMPLETED').length,
      cancelled: userOrders.filter(o => o.status === 'CANCELLED').length,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ПН</Text>
        </View>
        <Text style={styles.name}>Пользователь</Text>
        <Text style={styles.phone}>+380 (50) 123-4567</Text>
      </View>

      <GoldCard title="Статистика заказов" subtitle="Активность за все время">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Всего заказов</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Выполнено</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.cancelled}</Text>
            <Text style={styles.statLabel}>Отменено</Text>
          </View>
        </View>
      </GoldCard>

      <GoldCard title="Мои данные" subtitle="Личная информация">
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Имя</Text>
          <Text style={styles.dataValue}>Пользователь</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Телефон</Text>
          <Text style={styles.dataValue}>+380 50 123-4567</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Email</Text>
          <Text style={styles.dataValue}>client@musora.net</Text>
        </View>
      </GoldCard>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Настройки</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('OrdersHistory')}>
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuText}>История заказов</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Уведомления</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>💳</Text>
          <Text style={styles.menuText}>Способы оплаты</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Помощь</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Выйти</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  header: {
    padding: 24,
  },
  title: {
    color: tokens.colors.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: tokens.colors.bg,
    fontSize: 36,
    fontWeight: '700',
  },
  name: {
    color: tokens.colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  phone: {
    color: tokens.colors.muted,
    fontSize: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dataLabel: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  dataValue: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.divider,
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: tokens.colors.divider,
  },
  statValue: {
    color: tokens.colors.primary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: tokens.colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  menuContainer: {
    padding: 24,
  },
  sectionTitle: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    color: tokens.colors.text,
    fontSize: 16,
  },
  menuArrow: {
    color: tokens.colors.muted,
    fontSize: 24,
  },
});

