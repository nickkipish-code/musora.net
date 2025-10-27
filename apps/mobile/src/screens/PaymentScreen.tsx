import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GoldCard, tokens } from '@museum/ui';

export default function PaymentScreen({ route, navigation }: any) {
  const { orderId, amount, address, wasteType, bagsCount, pickupTime } = route.params || { amount: 0 };

  const getWasteTypeName = (type: string) => {
    switch (type) {
      case 'STANDARD': return 'Обычный';
      case 'RECYCLABLE': return 'Переработка';
      case 'BULKY': return 'Крупногабаритный';
      default: return type;
    }
  };

  const getPickupTimeName = (time: string) => {
    switch (time) {
      case 'IMMEDIATE': return 'Сейчас (30-60 минут)';
      case 'AFTERNOON': return 'Сегодня после обеда';
      case 'EVENING': return 'Сегодня вечером';
      case 'TOMORROW_MORNING': return 'Завтра утром';
      default: return time;
    }
  };

  const pay = async () => {
    // Оплата
    try {
      // Имитация процесса оплаты
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Оплата успешна! ✅',
        `Заказ #${orderId} успешно оплачен на сумму ${amount} ₴!\n\nСпасибо за использование мусора.нет!`,
        [
          {
            text: 'Отлично!',
            onPress: () => {
              // Возвращаемся на главный экран
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Ошибка', 'Ошибка при оплате. Попробуйте еще раз.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Оплата заказа</Text>
        
        <GoldCard title="Сумма к оплате" subtitle={`Заказ #${orderId}`}>
          <View style={styles.amountBox}>
            <Text style={styles.amountValue}>{amount} ₴</Text>
          </View>
        </GoldCard>

        {address && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📍 Адрес доставки</Text>
            <Text style={styles.infoText}>{address}</Text>
          </View>
        )}

        {wasteType && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📦 Тип мусора</Text>
            <Text style={styles.infoText}>{getWasteTypeName(wasteType)}</Text>
          </View>
        )}

        {bagsCount && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📦 Количество пакетов</Text>
            <Text style={styles.infoText}>{bagsCount} {bagsCount === '1' ? 'пакет' : 'пакета'}</Text>
          </View>
        )}

        {pickupTime && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🕐 Время вывоза</Text>
            <Text style={styles.infoText}>{getPickupTimeName(pickupTime)}</Text>
          </View>
        )}

        <View style={styles.methodsContainer}>
          <Text style={styles.sectionTitle}>Способ оплаты</Text>
          
          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.methodIcon}>
              <Text style={styles.methodIconText}>💳</Text>
            </View>
            <Text style={styles.methodText}>Банковская карта</Text>
            <Text style={styles.check}>✓</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Важная информация</Text>
          <Text style={styles.infoText}>
            • Оплата производится после подтверждения заказа{'\n'}
            • Вы получите уведомление о статусе заказа{'\n'}
            • Ожидаемое время доставки: 30-60 минут
          </Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={pay}>
          <Text style={styles.payButtonText}>Оплатить заказ</Text>
        </TouchableOpacity>
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
  title: {
    color: tokens.colors.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  amountBox: {
    marginTop: 12,
    alignItems: 'center',
  },
  amountValue: {
    color: tokens.colors.primary,
    fontSize: 48,
    fontWeight: '700',
  },
  methodsContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: tokens.colors.primary,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodIconText: {
    fontSize: 24,
  },
  methodText: {
    flex: 1,
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  check: {
    color: tokens.colors.primary,
    fontSize: 24,
  },
  infoBox: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
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
  payButton: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  payButtonText: {
    color: tokens.colors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});


