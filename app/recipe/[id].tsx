import { useDatabaseContext } from '@/database/DatabaseContext';
import { Recipe } from '@/database/database';
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
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      if (!id) return;
      const recipeData = await getRecipeById(Number(id));
      if (recipeData) {
        setRecipe(recipeData);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <View style={styles.recipeMetaContainer}>
            <Text style={styles.recipeMeta}>{recipe.category}</Text>
            <Text style={styles.recipeMeta}>{recipe.difficulty} • {recipe.cookTime} min • {recipe.servings} servings</Text>
          </View>
        </View>

        {recipe.description && (
          <View style={styles.section}>
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <TouchableOpacity
              key={index}
              style={styles.ingredientItem}
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
                ingredient.isChecked && styles.checkedText
              ]}>
                {ingredient.amount} {ingredient.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
              </View>
              <Text style={styles.stepText}>{step.instruction}</Text>
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

          <TouchableOpacity style={styles.editButton} onPress={handleEditRecipe}>
            <Text style={styles.editButtonText}>Edit Recipe</Text>
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
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#9E9E9E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 18,
    color: '#9E9E9E',
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
    color: '#333',
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
    color: '#666',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ingredientItem: {
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
  ingredientText: {
    fontSize: 16,
    color: '#333',
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
    color: '#333',
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  editButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});
