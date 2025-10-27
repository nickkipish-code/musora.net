import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { tokens } from '@museum/ui';
import { ordersStorage } from '../storage/ordersStorage';
import { notifyOrderAccepted, notifyCourierOnWay, notifyCourierArrived, notifyOrderCompleted } from '../services/notifications';

export default function CourierModeScreen({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(false);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ completed: 0, earnings: 0, todayEarnings: 0 });
  const watchRef = useRef<any>(null);

  useEffect(() => {
    loadOrders();
    
    const unsubscribe = navigation?.addListener('focus', () => {
      loadOrders();
    });

    return () => {
      if (watchRef.current) Location.stopLocationUpdatesAsync(watchRef.current);
      unsubscribe?.();
    };
  }, [navigation]);

  const loadOrders = async () => {
    const savedOrders = ordersStorage.getAllOrders();
    const myActive = savedOrders.filter(o => ['ACCEPTED', 'EN_ROUTE', 'ARRIVED'].includes(o.status));
    const available = savedOrders.filter(o => o.status === 'CREATED');
    const completed = savedOrders.filter(o => o.status === 'COMPLETED');
    
    setMyOrders(myActive);
    setAvailableOrders(available);
    
    const totalEarnings = completed.reduce((sum, order) => sum + (order.price || 0), 0);
    const today = completed.filter(o => {
      const createdDate = new Date(o.createdAt || o.updatedAt);
      const today = new Date();
      return createdDate.toDateString() === today.toDateString();
    });
    const todayEarnings = today.reduce((sum, order) => sum + (order.price || 0), 0);
    
    setStats({
      completed: completed.length,
      earnings: totalEarnings,
      todayEarnings,
    });
  };

  const toggleStatus = async () => {
    if (!isOnline) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Разрешение не предоставлено', 'Необходимо разрешение на геолокацию');
        return;
      }
      
      setIsOnline(true);
      watchRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
        (loc) => {
          // Отправляем локацию на сервер
          // fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/couriers/location`, {...})
        }
      );
    } else {
      setIsOnline(false);
      if (watchRef.current) watchRef.current.remove();
    }
  };

  const acceptOrder = async (orderId: string) => {
    const order = availableOrders.find(o => o.id === orderId);
    if (!order) return;

    Alert.alert(
      'Принять заказ?',
      `Заказ #${orderId}\n${order.address}\n${order.price} ₴`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Принять',
          onPress: async () => {
            ordersStorage.updateOrderStatus(orderId, 'ACCEPTED');
            
            // Отправляем уведомление клиенту
            notifyOrderAccepted(orderId).catch(err => console.log('Notification error:', err));
            
            Alert.alert('✅ Заказ принят!', 'Начните выполнение заказа');
            loadOrders();
          },
        },
      ]
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    ordersStorage.updateOrderStatus(orderId, newStatus);
    
    // Отправляем уведомления клиенту в зависимости от статуса
    (async () => {
      try {
        switch (newStatus) {
          case 'EN_ROUTE':
            await notifyCourierOnWay(orderId);
            break;
          case 'ARRIVED':
            await notifyCourierArrived(orderId);
            break;
          case 'COMPLETED':
            await notifyOrderCompleted(orderId);
            Alert.alert('🎉 Заказ завершен!', 'Заработок добавлен к балансу');
            break;
        }
      } catch (error) {
        console.log('Notification error:', error);
      }
    })();
    
    loadOrders();
  };

  const getStatusActions = (order: any) => {
    switch (order.status) {
      case 'ACCEPTED':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => updateOrderStatus(order.id, 'EN_ROUTE')}
          >
            <Text style={styles.actionButtonText}>🚗 В пути</Text>
          </TouchableOpacity>
        );
      case 'EN_ROUTE':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonWarning]}
            onPress={() => updateOrderStatus(order.id, 'ARRIVED')}
          >
            <Text style={styles.actionButtonText}>📍 На месте</Text>
          </TouchableOpacity>
        );
      case 'ARRIVED':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSuccess]}
            onPress={() => updateOrderStatus(order.id, 'COMPLETED')}
          >
            <Text style={styles.actionButtonText}>✅ Забрал мусор</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      STANDARD: { label: 'Обычный', icon: '📦', color: '#4CAF50' },
      RECYCLABLE: { label: 'Переработка', icon: '♻️', color: '#2196F3' },
      BULKY: { label: 'Крупный', icon: '📦📦', color: '#FF9800' },
    };
    return types[type as keyof typeof types] || types.STANDARD;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🚚 Курьер</Text>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDotBig, isOnline && styles.statusDotBigActive]} />
              <Text style={[styles.statusText, isOnline && styles.statusTextActive]}>
                {isOnline ? 'Онлайн' : 'Офлайн'}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Выполнено</Text>
          </View>
          <View style={[styles.statCard, styles.statCardHighlight]}>
            <Text style={styles.statValue}>{stats.todayEarnings} ₴</Text>
            <Text style={styles.statLabel}>Сегодня</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.earnings} ₴</Text>
            <Text style={styles.statLabel}>Всего</Text>
          </View>
        </View>

        {/* My Active Orders */}
        {myOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Мои заказы ({myOrders.length})</Text>
            
            {myOrders.map((order) => {
              const typeInfo = getTypeLabel(order.type);
              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: typeInfo.color }]}>
                      <Text style={styles.typeIcon}>{typeInfo.icon}</Text>
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>#{order.id}</Text>
                      <Text style={styles.orderAddress}>📍 {order.address}</Text>
                    </View>
                    <Text style={styles.orderPrice}>{order.price} ₴</Text>
                  </View>

                  <View style={styles.orderDetails}>
                    {order.floor && (
                      <Text style={styles.orderDetail}>
                        🏢 Этаж {order.floor} {order.accessType === 'STAIRS' && '🚶'}
                      </Text>
                    )}
                    {order.bagsCount && (
                      <Text style={styles.orderDetail}>📦 {order.bagsCount} {order.bagsCount === 1 ? 'пакет' : 'пакета'}</Text>
                    )}
                    {order.comment && (
                      <Text style={styles.orderComment}>💬 {order.comment}</Text>
                    )}
                  </View>

                  <View style={styles.statusBar}>
                    <View style={[styles.statusDot, { backgroundColor: '#9C27B0' }]} />
                    <Text style={styles.statusBarText}>В работе</Text>
                  </View>

                  {getStatusActions(order)}
                </View>
              );
            })}
          </View>
        )}

        {/* Available Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Доступные заказы ({availableOrders.length})</Text>
          
          {availableOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Нет доступных заказов</Text>
              <Text style={styles.emptySubtext}>
                Новые заказы будут появляться здесь автоматически
              </Text>
            </View>
          ) : (
            availableOrders.map((order) => {
              const typeInfo = getTypeLabel(order.type);
              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: typeInfo.color }]}>
                      <Text style={styles.typeIcon}>{typeInfo.icon}</Text>
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>#{order.id}</Text>
                      <Text style={styles.orderAddress}>📍 {order.address}</Text>
                    </View>
                    <Text style={styles.orderPrice}>{order.price} ₴</Text>
                  </View>

                  <View style={styles.orderDetails}>
                    {order.floor && (
                      <Text style={styles.orderDetail}>
                        🏢 Этаж {order.floor} {order.accessType === 'STAIRS' && '🚶'}
                      </Text>
                    )}
                    {order.bagsCount && (
                      <Text style={styles.orderDetail}>📦 {order.bagsCount} {order.bagsCount === 1 ? 'пакет' : 'пакета'}</Text>
                    )}
                    {order.comment && (
                      <Text style={styles.orderComment}>💬 {order.comment}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => acceptOrder(order.id)}
                    disabled={!isOnline}
                  >
                    <Text style={styles.acceptButtonText}>
                      {isOnline ? '✓ Принять заказ' : '⚠️ Включите онлайн'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, isOnline && styles.fabActive]}
        onPress={toggleStatus}
      >
        <Text style={[styles.fabIcon, isOnline && styles.fabIconActive]}>
          {isOnline ? '✓' : '▶'}
        </Text>
        <Text style={[styles.fabText, isOnline && styles.fabTextActive]}>
          {isOnline ? 'Онлайн' : 'Войти в систему'}
        </Text>
      </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 100, // Отступ для FAB
  },
  header: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: tokens.colors.primary,
    fontSize: 32,
    fontWeight: '700',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  statusDotBig: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.muted,
    marginRight: 8,
  },
  statusDotBigActive: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: tokens.colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  statCardHighlight: {
    backgroundColor: tokens.colors.card,
    borderColor: tokens.colors.primary,
    borderWidth: 2,
  },
  statValue: {
    color: tokens.colors.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: tokens.colors.muted,
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeIcon: {
    fontSize: 24,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderAddress: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  orderPrice: {
    color: tokens.colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderDetail: {
    color: tokens.colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  orderComment: {
    color: tokens.colors.muted,
    fontSize: 13,
    fontStyle: 'italic',
    backgroundColor: tokens.colors.card,
    padding: 8,
    borderRadius: 8,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusBarText: {
    color: tokens.colors.muted,
    fontSize: 12,
  },
  actionButton: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: tokens.colors.primary,
  },
  actionButtonWarning: {
    backgroundColor: '#FF9800',
  },
  actionButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
  acceptButton: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    opacity: 0.8,
  },
  acceptButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: tokens.colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    left: 24,
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabActive: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  fabIcon: {
    fontSize: 24,
    marginRight: 12,
    color: tokens.colors.text,
  },
  fabIconActive: {
    color: tokens.colors.bg,
  },
  fabText: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  fabTextActive: {
    color: tokens.colors.bg,
  },
});
