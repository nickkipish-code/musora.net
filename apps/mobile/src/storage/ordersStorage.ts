// Простое хранилище заказов
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@musora_orders';

let orders: any[] = [];
let orderIdCounter = 1;
let isInitialized = false;

export const ordersStorage = {
  // Инициализация - загрузка из AsyncStorage
  init: async () => {
    if (isInitialized) return;
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        orders = JSON.parse(stored);
        // Находим максимальный ID
        orderIdCounter = orders.length > 0 ? 
          Math.max(...orders.map((o: any) => parseInt(o.id?.replace('MUS', '') || '0'))) + 1 : 1;
      }
      isInitialized = true;
      console.log('OrdersStorage initialized with', orders.length, 'orders');
    } catch (error) {
      console.error('Failed to load orders from storage:', error);
      orders = [];
      isInitialized = true;
    }
  },

  // Сохранение в AsyncStorage
  save: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      console.log('Orders saved to storage');
    } catch (error) {
      console.error('Failed to save orders to storage:', error);
    }
  },

  // Сохранить заказ
  saveOrder: (order: any) => {
    const newOrder = {
      ...order,
      id: order.id || `MUS${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'CREATED',
      userId: order.userId || 'demo-user-1',
    };
    orders.push(newOrder);
    console.log('Order saved:', newOrder);
    // Сохраняем в AsyncStorage асинхронно
    ordersStorage.save();
    return newOrder;
  },

  // Получить все заказы
  getAllOrders: () => {
    return [...orders]; // Возвращаем копию для избежания прямых изменений
  },

  // Получить заказы пользователя
  getUserOrders: (userId: string) => {
    return orders.filter(o => o.userId === userId);
  },

  // Получить заказ по ID
  getOrderById: (id: string) => {
    return orders.find(o => o.id === id);
  },

  // Обновить статус заказа
  updateOrderStatus: (id: string, status: string) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      // Сохраняем в AsyncStorage асинхронно
      ordersStorage.save();
    }
    return order;
  },

  // Удалить заказ
  deleteOrder: (id: string) => {
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders.splice(index, 1);
      ordersStorage.save();
      return true;
    }
    return false;
  },

  // Очистить все заказы
  clearAllOrders: () => {
    orders = [];
    ordersStorage.save();
  },
};

