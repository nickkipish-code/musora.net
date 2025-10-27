import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { tokens } from './tokens';

export function Button({ children, onClick, style, ...props }: any) {
  return (
    <TouchableOpacity onPress={onClick} style={[styles.button, style]} {...props}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: tokens.radii.md,
  },
  text: {
    color: tokens.colors.bg,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});


