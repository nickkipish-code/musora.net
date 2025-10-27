import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { GoldCard, tokens } from '@museum/ui';
import { ordersStorage } from '../storage/ordersStorage';

export default function OrderDetailScreen({ navigation, route }: any) {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const loadedOrder = ordersStorage.getOrderById(orderId);
    setOrder(loadedOrder);
    
    // Обновляем заказ при фокусе экрана
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () => {
        const updatedOrder = ordersStorage.getOrderById(orderId);
        setOrder(updatedOrder);
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [orderId, navigation]);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Заказ не найден</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED':
        return tokens.colors.primary;
      case 'ACCEPTED':
        return '#FFA500';
      case 'COMPLETED':
        return tokens.colors.success;
      case 'CANCELLED':
        return tokens.colors.danger;
      default:
        return tokens.colors.muted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CREATED':
        return 'Создан';
      case 'ACCEPTED':
        return 'Курьер принял заказ';
      case 'EN_ROUTE':
        return 'Курьер в пути';
      case 'ARRIVED':
        return 'Курьер на месте';
      case 'COMPLETED':
        return 'Мусор забран';
      case 'CANCELLED':
        return 'Отменен';
      default:
        return status;
    }
  };

  const getAccessTypeName = (type?: string) => {
    if (!type) return 'Не указано';
    switch (type) {
      case 'ELEVATOR': return 'С лифтом';
      case 'STAIRS': return 'Без лифта';
      case 'PRIVATE_HOUSE': return 'Частный дом';
      default: return type;
    }
  };

  const handleRateOrder = () => {
    navigation.navigate('RateOrder', { orderId: order.id });
  };

  const handleContactCourier = () => {
    // In a real app, this would open a phone call or chat
    Alert.alert(
      'Связаться с курьером',
      'Вы хотите позвонить или написать курьеру?',
      [
        { text: 'Позвонить', onPress: () => Linking.openURL('tel:+380001234567') },
        { text: 'Написать', onPress: () => Alert.alert('Чат', 'Открыть чат с курьером') },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'STANDARD':
        return 'Обычный';
      case 'RECYCLABLE':
        return 'Переработка';
      case 'BULKY':
        return 'Крупногабаритный';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Отменить заказ?',
      'Вы уверены, что хотите отменить этот заказ?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, отменить',
          style: 'destructive',
          onPress: () => {
            ordersStorage.updateOrderStatus(orderId, 'CANCELLED');
            Alert.alert('Заказ отменен', 'Ваш заказ был отменен.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  const canCancel = order.status === 'CREATED' || order.status === 'ACCEPTED';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.title}>Заказ #{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
        </View>

        {/* Информация о заказе */}
        <GoldCard title="Информация о заказе" subtitle={formatDate(order.createdAt)}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Дата создания:</Text>
            <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Время:</Text>
            <Text style={styles.infoValue}>{formatTime(order.createdAt)}</Text>
          </View>
          {order.updatedAt && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Обновлено:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(order.updatedAt)} в {formatTime(order.updatedAt)}
                </Text>
              </View>
            </>
          )}
        </GoldCard>

        {/* Адрес */}
        {order.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Адрес доставки</Text>
            <Text style={styles.sectionText}>{order.address}</Text>
          </View>
        )}

        {/* Детали */}
        <GoldCard title="Детали заказа">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Тип мусора:</Text>
            <Text style={styles.infoValue}>{getTypeText(order.type)}</Text>
          </View>
          <View style={styles.divider} />
          {order.floor && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Этаж:</Text>
                <Text style={styles.infoValue}>{order.floor}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Цена:</Text>
            <Text style={[styles.infoValue, styles.priceText]}>{order.price} ₴</Text>
          </View>
          {order.bagsCount && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Количество пакетов:</Text>
                <Text style={styles.infoValue}>{order.bagsCount}</Text>
              </View>
            </>
          )}
          {order.accessType && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Тип доступа:</Text>
                <Text style={styles.infoValue}>{getAccessTypeName(order.accessType)}</Text>
              </View>
            </>
          )}
          {order.doorCode && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Код домофона:</Text>
                <Text style={styles.infoValue}>{order.doorCode}</Text>
              </View>
            </>
          )}
        </GoldCard>

        {/* Кнопка связаться с курьером */}
        {(order.status === 'ACCEPTED' || order.status === 'EN_ROUTE' || order.status === 'ARRIVED') && (
          <TouchableOpacity style={styles.contactButton} onPress={handleContactCourier}>
            <Text style={styles.contactButtonText}>📞 Связаться с курьером</Text>
          </TouchableOpacity>
        )}

        {/* Комментарий */}
        {order.comment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💬 Комментарий</Text>
            <Text style={styles.commentText}>{order.comment}</Text>
          </View>
        )}

        {/* Кнопки действий */}
        {canCancel && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancelOrder}>
              <Text style={styles.cancelButtonText}>Отменить заказ</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {order.status === 'COMPLETED' && (
          <TouchableOpacity style={styles.rateButton} onPress={handleRateOrder}>
            <Text style={styles.rateButtonText}>⭐ Оценить заказ</Text>
          </TouchableOpacity>
        )}
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: tokens.colors.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: tokens.colors.bg,
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    color: tokens.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  commentText: {
    color: tokens.colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  infoValue: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  priceText: {
    color: tokens.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.divider,
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: tokens.colors.danger,
    marginBottom: 24,
  },
  cancelButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  contactButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
  rateButton: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  rateButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: tokens.colors.danger,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});

