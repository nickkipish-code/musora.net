import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { tokens, Button as UiButton } from '@museum/ui';
import { ordersStorage } from '../storage/ordersStorage';

export default function CreateOrderScreen({ navigation, route }: any) {
  const { address, wasteType } = route.params || {};
  const [floor, setFloor] = useState('1');
  const [type, setType] = useState(wasteType || 'STANDARD');
  const [bagsCount, setBagsCount] = useState('1');
  const [pickupTime, setPickupTime] = useState('IMMEDIATE');
  const [accessType, setAccessType] = useState('ELEVATOR');
  const [doorCode, setDoorCode] = useState('');
  const [comment, setComment] = useState('');

  // Расчет предварительной стоимости
  const calculatePrice = () => {
    const prices: { [key: string]: number } = {
      STANDARD: 50,
      RECYCLABLE: 75,
      BULKY: 100,
    };
    const baseAmount = prices[type] || 50;
    const floorBonus = accessType === 'STAIRS' ? parseInt(floor) * 10 : 0;
    const bagsCost = parseInt(bagsCount) > 1 ? (parseInt(bagsCount) - 1) * 20 : 0;
    return baseAmount + floorBonus + bagsCost;
  };

  const estimatedPrice = calculatePrice();

  const handleSubmit = () => {
    const orderId = `MUS${Date.now().toString().slice(-6)}`;
    const amount = calculatePrice();
    
    const order = {
      id: orderId,
      type: type,
      price: amount,
      floor: floor,
      bagsCount: parseInt(bagsCount),
      pickupTime: pickupTime,
      accessType: accessType,
      doorCode: doorCode || undefined,
      status: 'CREATED',
      address: address?.description || 'Адрес не указан',
      comment: comment || undefined,
      createdAt: new Date().toISOString(),
    };
    ordersStorage.saveOrder(order);
    
    navigation.navigate('Payment', { 
      orderId, 
      amount,
      address: address?.description,
      wasteType: type,
      bagsCount: parseInt(bagsCount),
      pickupTime: pickupTime,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📝 Создать заказ</Text>
          <Text style={styles.subtitle}>Заполните информацию для курьера</Text>
        </View>

        {/* Адрес */}
        {address && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Адрес</Text>
                <Text style={styles.sectionSubtitle}>Где забрать мусор?</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardText}>{address.description}</Text>
            </View>
          </View>
        )}

        {/* Шаг 1: Тип мусора */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>🗑️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Что вывозим?</Text>
              <Text style={styles.sectionSubtitle}>Выберите тип мусора</Text>
            </View>
          </View>
          
          <View style={styles.choiceGrid}>
            {[
              { value: 'STANDARD', label: 'Обычный', icon: '📦', color: '#4CAF50' },
              { value: 'RECYCLABLE', label: 'Переработка', icon: '♻️', color: '#2196F3' },
              { value: 'BULKY', label: 'Крупный', icon: '📦📦', color: '#FF9800' },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.choiceCard,
                  type === item.value && styles.choiceCardSelected
                ]}
                onPress={() => setType(item.value)}
              >
                <Text style={styles.choiceIcon}>{item.icon}</Text>
                <Text style={[
                  styles.choiceLabel,
                  type === item.value && styles.choiceLabelSelected
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Шаг 2: Количество */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>📦</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Сколько пакетов?</Text>
              <Text style={styles.sectionSubtitle}>Количество мешков для выноса</Text>
            </View>
          </View>
          
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setBagsCount(Math.max(1, parseInt(bagsCount) - 1).toString())}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>
            
            <View style={styles.counterValue}>
              <Text style={styles.counterNumber}>{bagsCount}</Text>
              <Text style={styles.counterLabel}>
                {bagsCount === '1' ? 'пакет' : 'пакета'}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setBagsCount((parseInt(bagsCount) + 1).toString())}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Шаг 3: Этаж и доступ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>🏢</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Этаж и доступ</Text>
              <Text style={styles.sectionSubtitle}>Помогите курьеру найти вас</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.label}>Этаж</Text>
              <TextInput 
                value={floor} 
                onChangeText={setFloor} 
                style={styles.input}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Как добраться?</Text>
              <View style={styles.accessButtons}>
                <TouchableOpacity
                  style={[
                    styles.accessButton,
                    accessType === 'ELEVATOR' && styles.accessButtonSelected
                  ]}
                  onPress={() => setAccessType('ELEVATOR')}
                >
                  <Text style={[
                    styles.accessButtonText,
                    accessType === 'ELEVATOR' && styles.accessButtonTextSelected
                  ]}>
                    🛗 Лифт
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.accessButton,
                    accessType === 'STAIRS' && styles.accessButtonSelected
                  ]}
                  onPress={() => setAccessType('STAIRS')}
                >
                  <Text style={[
                    styles.accessButtonText,
                    accessType === 'STAIRS' && styles.accessButtonTextSelected
                  ]}>
                    🚶 Лестница
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {accessType === 'ELEVATOR' && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Код домофона (если есть)</Text>
              <TextInput 
                value={doorCode} 
                onChangeText={setDoorCode} 
                style={styles.input}
                placeholder="1234"
                placeholderTextColor={tokens.colors.muted}
              />
            </View>
          )}
        </View>

        {/* Шаг 4: Когда */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>⏰</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Когда забрать?</Text>
              <Text style={styles.sectionSubtitle}>Выберите удобное время</Text>
            </View>
          </View>

          <View style={styles.timeOptions}>
            {[
              { value: 'IMMEDIATE', label: 'Сейчас', subtitle: '30-60 минут', icon: '⚡' },
              { value: 'AFTERNOON', label: 'После обеда', subtitle: '14:00-17:00', icon: '🌤️' },
              { value: 'EVENING', label: 'Вечером', subtitle: '18:00-21:00', icon: '🌙' },
              { value: 'TOMORROW_MORNING', label: 'Завтра утром', subtitle: '8:00-12:00', icon: '☀️' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.timeOption,
                  pickupTime === option.value && styles.timeOptionSelected
                ]}
                onPress={() => setPickupTime(option.value)}
              >
                <Text style={styles.timeIcon}>{option.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.timeLabel,
                    pickupTime === option.value && styles.timeLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.timeSubtitle,
                    pickupTime === option.value && styles.timeSubtitleSelected
                  ]}>
                    {option.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Дополнительно */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>💬</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Комментарий (необязательно)</Text>
              <Text style={styles.sectionSubtitle}>Дополнительные инструкции</Text>
            </View>
          </View>
          <TextInput 
            value={comment} 
            onChangeText={setComment} 
            style={[styles.input, styles.commentInput]} 
            multiline 
            placeholder="Например: 'мешок у двери', 'звонить за 5 мин'"
            placeholderTextColor={tokens.colors.muted}
          />
        </View>

        {/* Предварительная стоимость */}
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Примерная стоимость:</Text>
          <Text style={styles.priceValue}>{estimatedPrice} ₴</Text>
          <Text style={styles.priceNote}>Точная стоимость будет рассчитана после подтверждения</Text>
        </View>

        {/* Кнопка отправки */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>✅ Создать заказ и оплатить</Text>
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
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: tokens.colors.primary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: tokens.colors.muted,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  infoCardText: {
    color: tokens.colors.text,
    fontSize: 16,
  },
  choiceGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  choiceCard: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceCardSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.card,
  },
  choiceIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  choiceLabel: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  choiceLabelSelected: {
    color: tokens.colors.primary,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  counterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.primary,
  },
  counterButtonText: {
    color: tokens.colors.primary,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 36,
  },
  counterValue: {
    minWidth: 80,
    alignItems: 'center',
  },
  counterNumber: {
    color: tokens.colors.text,
    fontSize: 36,
    fontWeight: '700',
  },
  counterLabel: {
    color: tokens.colors.muted,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  accessButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  accessButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  accessButtonSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.card,
  },
  accessButtonText: {
    color: tokens.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  accessButtonTextSelected: {
    color: tokens.colors.primary,
  },
  timeOptions: {
    gap: 10,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeOptionSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.card,
  },
  timeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  timeLabel: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeLabelSelected: {
    color: tokens.colors.primary,
  },
  timeSubtitle: {
    color: tokens.colors.muted,
    fontSize: 13,
  },
  timeSubtitleSelected: {
    color: tokens.colors.muted,
  },
  label: {
    color: tokens.colors.muted,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.text,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  commentInput: {
    height: 100,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  priceCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: tokens.colors.primary,
    alignItems: 'center',
  },
  priceLabel: {
    color: tokens.colors.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  priceValue: {
    color: tokens.colors.primary,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceNote: {
    color: tokens.colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: tokens.colors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
