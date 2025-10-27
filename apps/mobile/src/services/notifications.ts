// Mock notifications service for Expo Go
// expo-notifications is not supported in Expo Go, so we use console logging instead

export async function registerForPushNotificationsAsync() {
  console.log('📱 [Notifications] Push notification registration requested (mock)');
  return null;
}

// Отправка локального уведомления (mock)
export async function sendNotification(title: string, body: string, data?: any) {
  try {
    console.log('📢 [Notification]', title, '-', body, data || '');
    // In a real app, this would show a notification
    // For now, we just log to console for Expo Go compatibility
  } catch (error) {
    console.log('Failed to send notification:', error);
  }
}

// Уведомление когда курьер принял заказ
export async function notifyOrderAccepted(orderId: string, courierName?: string) {
  await sendNotification(
    '🚚 Курьер принял заказ!',
    `Заказ #${orderId} принят курьером. Он скоро будет у вас!`,
    { orderId, type: 'ORDER_ACCEPTED' }
  );
}

// Уведомление когда курьер в пути
export async function notifyCourierOnWay(orderId: string, courierName?: string) {
  await sendNotification(
    '🚗 Курьер в пути',
    `Курьер по заказу #${orderId} направляется к вам.`,
    { orderId, type: 'COURIER_ON_WAY' }
  );
}

// Уведомление когда курьер на месте
export async function notifyCourierArrived(orderId: string) {
  await sendNotification(
    '📍 Курьер на месте',
    `Курьер прибыл по адресу заказа #${orderId}.`,
    { orderId, type: 'COURIER_ARRIVED' }
  );
}

// Уведомление о завершении заказа
export async function notifyOrderCompleted(orderId: string) {
  await sendNotification(
    '✅ Заказ выполнен',
    `Мусор по заказу #${orderId} успешно вывезен!`,
    { orderId, type: 'ORDER_COMPLETED' }
  );
}


