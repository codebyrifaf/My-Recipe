import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IngredientItemProps {
  ingredient: {
    name: string;
    amount: string;
    isChecked: boolean;
  };
  onToggle: () => void;
}

export const IngredientItem: React.FC<IngredientItemProps> = ({
  ingredient,
  onToggle,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={[styles.checkbox, ingredient.isChecked && styles.checkedBox]}>
        {ingredient.isChecked && (
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        )}
      </View>
      <Text style={[styles.text, ingredient.isChecked && styles.checkedText]}>
        {ingredient.amount} {ingredient.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#FF6B6B',
  },
  text: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
});
