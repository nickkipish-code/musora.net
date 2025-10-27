import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { tokens } from '@museum/ui';

export default function RateOrderScreen({ navigation, route }: any) {
  const { orderId } = route.params || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите оценку');
      return;
    }

    Alert.alert(
      'Спасибо!',
      'Ваша оценка сохранена. Это помогает нам улучшать сервис!',
      [
        {
          text: 'OK',
          onPress: () => {
            // TODO: Save rating to backend
            // Here would be API call to save rating
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Оцените заказ #{orderId}</Text>
        <Text style={styles.subtitle}>Поделитесь вашими впечатлениями о сервисе</Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Ваша оценка</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Text style={[styles.star, star <= rating && styles.starFilled]}>
                  {star <= rating ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 5 && 'Отлично! 🎉'}
              {rating === 4 && 'Хорошо 👍'}
              {rating === 3 && 'Нормально'}
              {rating === 2 && 'Плохо'}
              {rating === 1 && 'Ужасно 👎'}
            </Text>
          )}
        </View>

        <View style={styles.commentContainer}>
          <Text style={styles.label}>Комментарий (необязательно)</Text>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder="Расскажите подробнее о вашем опыте..."
            placeholderTextColor={tokens.colors.muted}
          />
        </View>

        <View style={styles.hintContainer}>
          <Text style={styles.hintTitle}>💡 Ваши отзывы помогают</Text>
          <Text style={styles.hintText}>
            • Улучшать качество сервиса{'\n'}
            • Мотивировать курьеров{'\n'}
            • Делать приложение лучше
          </Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Отправить оценку</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.skipButtonText}>Пропустить</Text>
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
    marginBottom: 32,
  },
  ratingContainer: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  label: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 48,
    color: tokens.colors.muted,
  },
  starFilled: {
    color: tokens.colors.primary,
  },
  ratingText: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  commentContainer: {
    marginBottom: 24,
  },
  commentInput: {
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.text,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginTop: 8,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  hintContainer: {
    backgroundColor: tokens.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  hintTitle: {
    color: tokens.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  hintText: {
    color: tokens.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: tokens.colors.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: tokens.colors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
  skipButton: {
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  skipButtonText: {
    color: tokens.colors.muted,
    fontSize: 16,
  },
});

