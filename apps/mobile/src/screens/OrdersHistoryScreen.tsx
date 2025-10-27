import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { GoldCard, tokens } from '@museum/ui';
import { ordersStorage } from '../storage/ordersStorage';

export default function OrdersHistoryScreen({ navigation, route }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'CREATED' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
    
    // Обновляем список при возврате на экран
    const unsubscribe = navigation.addListener('focus', () => {
      loadOrders();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
    setTimeout(() => setRefreshing(false), 500);
  };

  const loadOrders = () => {
    const allOrders = ordersStorage.getAllOrders();
    let filtered = allOrders;

    // Фильтр по статусу
    if (filter !== 'all') {
      filtered = allOrders.filter(order => order.status === filter);
    }

    // Поиск по адресу, ID или типу мусора
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id?.toLowerCase().includes(query) ||
        order.address?.toLowerCase().includes(query) ||
        order.type?.toLowerCase().includes(query)
      );
    }

    // Сортируем по дате создания (новые сверху)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    setOrders(filtered);
  };

  useEffect(() => {
    loadOrders();
  }, [filter, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED':
        return tokens.colors.primary;
      case 'ACCEPTED':
        return '#FFA500'; // Оранжевый
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
        return 'Принят курьером';
      case 'COMPLETED':
        return 'Выполнен';
      case 'CANCELLED':
        return 'Отменен';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
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

  const filterButtons = [
    { key: 'all', label: 'Все' },
    { key: 'CREATED', label: 'Созданные' },
    { key: 'ACCEPTED', label: 'В работе' },
    { key: 'COMPLETED', label: 'Завершенные' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>История заказов</Text>
        <Text style={styles.subtitle}>{orders.length} заказов</Text>
      </View>

      {/* Поиск */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по адресу, ID или типу..."
          placeholderTextColor={tokens.colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Фильтры */}
      <View style={styles.filtersContainer}>
        {filterButtons.map((btn) => (
          <TouchableOpacity
            key={btn.key}
            style={[styles.filterButton, filter === btn.key && styles.filterButtonActive]}
            onPress={() => setFilter(btn.key as any)}
          >
            <Text style={[styles.filterButtonText, filter === btn.key && styles.filterButtonTextActive]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdContainer}>
                <Text style={styles.orderIdText}>#{item.id}</Text>
                <Text style={styles.orderDate}>{formatDate(item.createdAt || '')}</Text>
                <Text style={styles.orderTime}>{formatTime(item.createdAt || '')}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
              </View>
            </View>

            <View style={styles.orderContent}>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>📍 Адрес</Text>
                <Text style={styles.orderAddress} numberOfLines={2}>
                  {item.address || 'Адрес не указан'}
                </Text>
              </View>

              <View style={styles.orderDivider} />

              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>📦 Тип мусора</Text>
                <Text style={styles.orderTypeText}>{getTypeText(item.type || 'STANDARD')}</Text>
              </View>

              {item.floor && (
                <>
                  <View style={styles.orderDivider} />
                  <View style={styles.orderRow}>
                    <Text style={styles.orderLabel}>🏢 Этаж</Text>
                    <Text style={styles.orderFloorText}>{item.floor}</Text>
                  </View>
                </>
              )}

              {item.comment && (
                <>
                  <View style={styles.orderDivider} />
                  <Text style={styles.orderComment} numberOfLines={2}>
                    💬 {item.comment}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.orderPrice}>{item.price || 0} ₴</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {searchQuery.trim() ? (
              <>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>Ничего не найдено</Text>
                <Text style={styles.emptySubtext}>
                  Попробуйте изменить запрос поиска или очистить фильтры
                </Text>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                >
                  <Text style={styles.clearButtonText}>Очистить поиск</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyText}>Нет заказов</Text>
                <Text style={styles.emptySubtext}>
                  Создайте свой первый заказ на главном экране
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.divider,
  },
  title: {
    color: tokens.colors.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: tokens.colors.muted,
    marginTop: 4,
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: tokens.colors.text,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  filterButtonActive: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  filterButtonText: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: tokens.colors.bg,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: tokens.colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderIdText: {
    color: tokens.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderDate: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  orderTime: {
    color: tokens.colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  orderContent: {
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderLabel: {
    color: tokens.colors.muted,
    fontSize: 14,
    fontWeight: '500',
    flex: 0.4,
  },
  orderDivider: {
    height: 1,
    backgroundColor: tokens.colors.divider,
    marginVertical: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: tokens.colors.bg,
    fontSize: 12,
    fontWeight: '700',
  },
  orderAddress: {
    color: tokens.colors.text,
    fontSize: 15,
    flex: 0.6,
    textAlign: 'right',
  },
  orderTypeText: {
    color: tokens.colors.text,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
    flex: 0.6,
  },
  orderFloorText: {
    color: tokens.colors.text,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
  },
  orderComment: {
    color: tokens.colors.text,
    fontSize: 14,
    fontStyle: 'italic',
    backgroundColor: tokens.colors.card,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
    lineHeight: 20,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.divider,
    paddingTop: 12,
  },
  orderPrice: {
    color: tokens.colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: tokens.colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: tokens.colors.muted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  clearButton: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '600',
  },
});

