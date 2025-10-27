import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from './tokens';

interface GoldCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: any;
}

export function GoldCard({ title, subtitle, children, style }: GoldCardProps) {
  return (
    <LinearGradient
      colors={['#7A5E10', '#D4AF37', '#F4E2B9', '#D4AF37', '#7A5E10']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 20,
    padding: 2,
    marginVertical: 8,
  },
  content: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 18,
    padding: 16,
  },
  title: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: tokens.colors.muted,
    marginTop: 6,
    fontSize: 14,
  },
});
