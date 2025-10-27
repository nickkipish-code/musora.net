import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GoldCard, tokens } from '@museum/ui';

export default function SubscriptionScreen({ navigation }: any) {
  const subscriptionPlans = [
    {
      id: 'daily',
      name: 'Ежедневный',
      price: 500,
      description: '1 вынос мусора каждый день',
      savings: 'Экономия 30%',
    },
    {
      id: 'flexible',
      name: '5 раз в месяц',
      price: 200,
      description: '5 выносов мусора в месяц по расписанию',
      savings: 'Популярный',
    },
    {
      id: 'every3days',
      name: 'Раз в 3 дня',
      price: 350,
      description: 'Регулярный вынос мусора каждые 3 дня',
      savings: 'Экономия 15%',
    },
  ];

  const handleSubscribe = (planId: string) => {
    // TODO: Implement subscription purchase
    console.log('Subscribe to:', planId);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Подписки</Text>
        <Text style={styles.subtitle}>Выберите план для регулярного вывоза мусора</Text>

        <View style={styles.plansContainer}>
          {subscriptionPlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                {plan.savings && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{plan.savings}</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.planPrice}>{plan.price} ₴/мес</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>

              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>✓ Автоматическое расписание</Text>
                <Text style={styles.featureItem}>✓ Приоритетная обработка</Text>
                <Text style={styles.featureItem}>✓ Экономия на каждом заказе</Text>
              </View>

              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => handleSubscribe(plan.id)}
              >
                <Text style={styles.subscribeButtonText}>Оформить подписку</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Как это работает</Text>
          <Text style={styles.infoText}>
            1. Выберите подходящий тариф{'\n'}
            2. Укажите предпочтительное время вывоза{'\n'}
            3. Курьер будет приходить регулярно в назначенное время{'\n'}
            4. Платите один раз в месяц - без скрытых платежей{'\n'}
            5. Можете отменить подписку в любой момент
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Назад</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    color: tokens.colors.muted,
    fontSize: 16,
    marginBottom: 24,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: tokens.colors.divider,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    color: tokens.colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: tokens.colors.bg,
    fontSize: 12,
    fontWeight: '600',
  },
  planPrice: {
    color: tokens.colors.primary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  planDescription: {
    color: tokens.colors.muted,
    fontSize: 16,
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    color: tokens.colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  subscribeButton: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: tokens.colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoTitle: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    color: tokens.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  backButtonText: {
    color: tokens.colors.muted,
    fontSize: 16,
  },
});

