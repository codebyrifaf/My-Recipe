import { useSettings } from '@/contexts/SettingsContext';
import { useDatabaseContext } from '@/database/DatabaseContext';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddRecipeScreen() {
  const { addRecipe } = useDatabaseContext();
  const { defaultServings, darkTheme } = useSettings();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [difficulty, setDifficulty] = useState('Easy');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', isChecked: false }]);
  const [steps, setSteps] = useState([{ stepNumber: 1, instruction: '', duration: null }]);

  // Set default servings when component mounts
  useEffect(() => {
    setServings(defaultServings.toString());
  }, [defaultServings]);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', isChecked: false }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updated = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: '', duration: null }]);
  };

  const removeStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    const renumbered = updated.map((step, i) => ({ ...step, stepNumber: i + 1 }));
    setSteps(renumbered);
  };

  const updateStep = (index: number, instruction: string) => {
    const updated = steps.map((step, i) => {
      if (i === index) {
        return { ...step, instruction };
      }
      return step;
    });
    setSteps(updated);
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a recipe title');
      return false;
    }
    if (!prepTime.trim() || isNaN(Number(prepTime))) {
      Alert.alert('Error', 'Please enter a valid prep time');
      return false;
    }
    if (!cookTime.trim() || isNaN(Number(cookTime))) {
      Alert.alert('Error', 'Please enter a valid cook time');
      return false;
    }
    if (!servings.trim() || isNaN(Number(servings))) {
      Alert.alert('Error', 'Please enter a valid number of servings');
      return false;
    }
    if (ingredients.some(ing => !ing.name.trim() || !ing.amount.trim())) {
      Alert.alert('Error', 'Please fill in all ingredient fields');
      return false;
    }
    if (steps.some(step => !step.instruction.trim())) {
      Alert.alert('Error', 'Please fill in all cooking steps');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const recipe = {
        title: title.trim(),
        category,
        difficulty,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        description: description.trim(),
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };

      await addRecipe(recipe);
      Alert.alert('Success', 'Recipe added successfully!', [
        { text: 'OK', onPress: () => router.push('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={getStyles(darkTheme).container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={getStyles(darkTheme).header}
      >
        <Text style={getStyles(darkTheme).headerTitle}>Add Recipe</Text>
      </LinearGradient>

      <ScrollView style={getStyles(darkTheme).content} showsVerticalScrollIndicator={false}>
        <View style={getStyles(darkTheme).section}>
          <Text style={getStyles(darkTheme).sectionTitle}>RECIPE TITLE</Text>
          <TextInput
            style={getStyles(darkTheme).input}
            placeholder="Enter recipe name"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={getStyles(darkTheme).row}>
          <View style={getStyles(darkTheme).halfWidth}>
            <Text style={getStyles(darkTheme).sectionTitle}>CATEGORY</Text>
            <View style={getStyles(darkTheme).pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={getStyles(darkTheme).picker}
                mode="dropdown"
                dropdownIconColor="#9E9E9E"
                itemStyle={{
                  fontSize: 16,
                  height: 50,
                  color: darkTheme ? '#FFFFFF' : '#333',
                  textAlign: 'center',
                }}
              >
                {categories.map((cat) => (
                  <Picker.Item 
                    key={cat} 
                    label={cat} 
                    value={cat}
                    color={darkTheme ? '#FFFFFF' : '#333'}
                    style={getStyles(darkTheme).pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={getStyles(darkTheme).halfWidth}>
            <Text style={getStyles(darkTheme).sectionTitle}>DIFFICULTY</Text>
            <View style={getStyles(darkTheme).pickerContainer}>
              <Picker
                selectedValue={difficulty}
                onValueChange={setDifficulty}
                style={getStyles(darkTheme).picker}
                mode="dropdown"
                dropdownIconColor="#9E9E9E"
                itemStyle={{
                  fontSize: 16,
                  height: 50,
                  color: darkTheme ? '#FFFFFF' : '#333',
                  textAlign: 'center',
                }}
              >
                {difficulties.map((diff) => (
                  <Picker.Item 
                    key={diff} 
                    label={diff} 
                    value={diff}
                    color={darkTheme ? '#FFFFFF' : '#333'}
                    style={getStyles(darkTheme).pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={getStyles(darkTheme).row}>
          <View style={getStyles(darkTheme).halfWidth}>
            <Text style={getStyles(darkTheme).sectionTitle}>PREP TIME</Text>
            <TextInput
              style={getStyles(darkTheme).input}
              placeholder="Minutes"
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <View style={getStyles(darkTheme).halfWidth}>
            <Text style={getStyles(darkTheme).sectionTitle}>COOK TIME</Text>
            <TextInput
              style={getStyles(darkTheme).input}
              placeholder="Minutes"
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="numeric"
              placeholderTextColor="#9E9E9E"
            />
          </View>
        </View>

        <View style={getStyles(darkTheme).section}>
          <Text style={getStyles(darkTheme).sectionTitle}>SERVINGS</Text>
          <TextInput
            style={getStyles(darkTheme).input}
            placeholder="Number of servings"
            value={servings}
            onChangeText={setServings}
            keyboardType="numeric"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={getStyles(darkTheme).section}>
          <Text style={getStyles(darkTheme).sectionTitle}>DESCRIPTION</Text>
          <TextInput
            style={[getStyles(darkTheme).input, getStyles(darkTheme).textArea]}
            placeholder="Brief description..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={getStyles(darkTheme).section}>
          <View style={getStyles(darkTheme).sectionHeader}>
            <Text style={getStyles(darkTheme).sectionTitle}>INGREDIENTS</Text>
            <TouchableOpacity onPress={addIngredient} style={getStyles(darkTheme).addButton}>
              <Ionicons name="add" size={20} color="#4ECDC4" />
            </TouchableOpacity>
          </View>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={getStyles(darkTheme).ingredientRow}>
              <TextInput
                style={[getStyles(darkTheme).input, getStyles(darkTheme).ingredientInput]}
                placeholder="Ingredient name"
                value={ingredient.name}
                onChangeText={(value) => updateIngredient(index, 'name', value)}
                placeholderTextColor="#9E9E9E"
              />
              <TextInput
                style={[getStyles(darkTheme).input, getStyles(darkTheme).amountInput]}
                placeholder="Amount"
                value={ingredient.amount}
                onChangeText={(value) => updateIngredient(index, 'amount', value)}
                placeholderTextColor="#9E9E9E"
              />
              {ingredients.length > 1 && (
                <TouchableOpacity onPress={() => removeIngredient(index)} style={getStyles(darkTheme).removeButton}>
                  <Ionicons name="trash" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={getStyles(darkTheme).section}>
          <View style={getStyles(darkTheme).sectionHeader}>
            <Text style={getStyles(darkTheme).sectionTitle}>COOKING STEPS</Text>
            <TouchableOpacity onPress={addStep} style={getStyles(darkTheme).addButton}>
              <Ionicons name="add" size={20} color="#4ECDC4" />
            </TouchableOpacity>
          </View>
          {steps.map((step, index) => (
            <View key={index} style={getStyles(darkTheme).stepRow}>
              <Text style={getStyles(darkTheme).stepNumber}>{step.stepNumber}</Text>
              <TextInput
                style={[getStyles(darkTheme).input, getStyles(darkTheme).stepInput]}
                placeholder="Cooking instruction..."
                value={step.instruction}
                onChangeText={(value) => updateStep(index, value)}
                multiline
                placeholderTextColor="#9E9E9E"
              />
              {steps.length > 1 && (
                <TouchableOpacity onPress={() => removeStep(index)} style={getStyles(darkTheme).removeButton}>
                  <Ionicons name="trash" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={getStyles(darkTheme).submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={getStyles(darkTheme).submitGradient}
          >
            <Text style={getStyles(darkTheme).submitText}>Add Recipe</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={getStyles(darkTheme).bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDark ? '#CCCCCC' : '#9E9E9E',
    marginBottom: 8,
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#333',
    borderWidth: 1,
    borderColor: isDark ? '#333' : '#E0E0E0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? '#333' : '#E0E0E0',
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  picker: {
    height: 55,
    color: isDark ? '#FFFFFF' : '#333',
    fontSize: 16,
    width: '100%',
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#333',
    fontWeight: '500',
    height: 50,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientInput: {
    flex: 2,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    marginRight: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4ECDC4',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 6,
  },
  stepInput: {
    flex: 1,
    marginRight: 10,
    minHeight: 45,
  },
  addButton: {
    padding: 5,
  },
  removeButton: {
    padding: 5,
  },
  submitButton: {
    marginTop: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9E9E9E',
    marginBottom: 8,
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  picker: {
    height: 55,
    color: '#333',
    fontSize: 16,
    width: '100%',
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    height: 50,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientInput: {
    flex: 2,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    marginRight: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4ECDC4',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 6,
  },
  stepInput: {
    flex: 1,
    marginRight: 10,
    minHeight: 45,
  },
  addButton: {
    padding: 5,
  },
  removeButton: {
    padding: 5,
  },
  submitButton: {
    marginTop: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
});
