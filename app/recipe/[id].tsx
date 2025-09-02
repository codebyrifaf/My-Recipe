import { useSettings } from '@/contexts/SettingsContext';
import { Recipe } from '@/database/database';
import { useDatabaseContext } from '@/database/DatabaseContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getRecipeById, toggleFavorite, deleteRecipe } = useDatabaseContext();
  const { scaleIngredients, defaultServings, darkTheme } = useSettings();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentServings, setCurrentServings] = useState(defaultServings);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      if (!id) return;
      const recipeData = await getRecipeById(Number(id));
      if (recipeData) {
        setRecipe(recipeData);
        setCurrentServings(recipeData.servings);
        setIngredients(JSON.parse(recipeData.ingredients || '[]'));
        setSteps(JSON.parse(recipeData.steps || '[]'));
      } else {
        Alert.alert('Error', 'Recipe not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      Alert.alert('Error', 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    await toggleFavorite(recipe.id!);
    setRecipe({ ...recipe, isFavorite: !recipe.isFavorite });
  };

  const handleToggleIngredient = (index: number) => {
    const updated = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, isChecked: !ingredient.isChecked };
      }
      return ingredient;
    });
    setIngredients(updated);
  };

  const handleServingChange = (newServings: number) => {
    if (!recipe) return;
    
    setCurrentServings(newServings);
    const originalIngredients = JSON.parse(recipe.ingredients || '[]');
    const scaledIngredients = scaleIngredients(originalIngredients, recipe.servings, newServings);
    setIngredients(scaledIngredients);
  };

  const incrementServings = () => {
    handleServingChange(currentServings + 1);
  };

  const decrementServings = () => {
    if (currentServings > 1) {
      handleServingChange(currentServings - 1);
    }
  };

  const handleStartCooking = () => {
    router.push(`/cooking/${recipe?.id}`);
  };

  const handleEditRecipe = () => {
    Alert.alert('Edit Recipe', 'Edit functionality would be implemented here.');
  };

  const getRecipeImage = (category: string) => {
    const images = {
      Breakfast: '🥞',
      Dinner: '🍝',
      Dessert: '🍰',
      Lunch: '🥗',
    };
    return (images as any)[category] || '🍽️';
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: darkTheme ? '#1a1a1a' : '#F5F5F5' }]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={[styles.loadingText, { color: darkTheme ? '#CCCCCC' : '#9E9E9E' }]}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: darkTheme ? '#1a1a1a' : '#F5F5F5' }]}>
        <Text style={[styles.errorText, { color: darkTheme ? '#CCCCCC' : '#9E9E9E' }]}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkTheme ? '#1a1a1a' : '#F5F5F5' }]} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.recipeImageContainer}>
          <Text style={styles.recipeEmoji}>{getRecipeImage(recipe.category)}</Text>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
            <Ionicons
              name={recipe.isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={recipe.isFavorite ? '#FF6B6B' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.recipeHeader}>
          <Text style={[styles.recipeTitle, { color: darkTheme ? '#FFFFFF' : '#333' }]}>{recipe.title}</Text>
          <View style={styles.recipeMetaContainer}>
            <Text style={styles.recipeMeta}>{recipe.category}</Text>
            <Text style={styles.recipeMeta}>{recipe.difficulty} • {recipe.cookTime} min • {recipe.servings} servings</Text>
          </View>
        </View>

        {recipe.description && (
          <View style={styles.section}>
            <Text style={[styles.recipeDescription, { color: darkTheme ? '#CCCCCC' : '#666' }]}>{recipe.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: darkTheme ? '#FFFFFF' : '#333' }]}>Ingredients</Text>
          <View style={[styles.servingAdjuster, { backgroundColor: darkTheme ? '#2a2a2a' : '#F8F9FA' }]}>
            <Text style={[styles.servingLabel, { color: darkTheme ? '#FFFFFF' : '#333' }]}>Servings:</Text>
            <View style={styles.servingControls}>
              <TouchableOpacity 
                style={[styles.servingButton, { backgroundColor: darkTheme ? '#3a3a3a' : '#FFFFFF', borderColor: darkTheme ? '#555' : '#E0E0E0' }]} 
                onPress={decrementServings}
                disabled={currentServings <= 1}
              >
                <Ionicons name="remove" size={20} color={currentServings <= 1 ? "#CCC" : "#FF6B6B"} />
              </TouchableOpacity>
              <Text style={[styles.servingCount, { color: darkTheme ? '#FFFFFF' : '#333' }]}>{currentServings}</Text>
              <TouchableOpacity style={[styles.servingButton, { backgroundColor: darkTheme ? '#3a3a3a' : '#FFFFFF', borderColor: darkTheme ? '#555' : '#E0E0E0' }]} onPress={incrementServings}>
                <Ionicons name="add" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
          {ingredients.map((ingredient, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.ingredientItem, { borderBottomColor: darkTheme ? '#3a3a3a' : '#F0F0F0' }]}
              onPress={() => handleToggleIngredient(index)}
            >
              <View style={[
                styles.checkbox,
                ingredient.isChecked && styles.checkedBox
              ]}>
                {ingredient.isChecked && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={[
                styles.ingredientText,
                { color: darkTheme ? '#FFFFFF' : '#333' },
                ingredient.isChecked && styles.checkedText
              ]}>
                {ingredient.amount} {ingredient.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: darkTheme ? '#FFFFFF' : '#333' }]}>Instructions</Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
              </View>
              <Text style={[styles.stepText, { color: darkTheme ? '#CCCCCC' : '#333' }]}>{step.instruction}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startCookingButton} onPress={handleStartCooking}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Start Cooking</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.editButton, { backgroundColor: darkTheme ? '#3a3a3a' : '#FFFFFF', borderColor: darkTheme ? '#555' : '#E0E0E0' }]} onPress={handleEditRecipe}>
            <Text style={[styles.editButtonText, { color: darkTheme ? '#FFFFFF' : '#333' }]}>Edit Recipe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  recipeImageContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  recipeEmoji: {
    fontSize: 80,
  },
  favoriteButton: {
    position: 'absolute',
    top: -10,
    right: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recipeHeader: {
    marginTop: 20,
    marginBottom: 20,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeMetaContainer: {
    gap: 5,
  },
  recipeMeta: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  recipeDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
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
  ingredientText: {
    fontSize: 16,
    flex: 1,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  startCookingButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
  servingAdjuster: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  servingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  servingCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
});
