import { useDatabaseContext } from '@/database/DatabaseContext';
import { Recipe } from '@/database/database';
import { useSettings } from '@/contexts/SettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function RecipesScreen() {
  const { recipes, loading, toggleFavorite, deleteRecipe, searchRecipes } = useDatabaseContext();
  const { darkTheme } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Breakfast', 'Dinner', 'Dessert', 'Lunch'];

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      filterByCategory();
    }
  }, [searchQuery, selectedCategory, recipes]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchRecipes(searchQuery);
      setFilteredRecipes(results);
    } else {
      filterByCategory();
    }
  };

  const filterByCategory = () => {
    if (selectedCategory === 'All') {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(recipes.filter(recipe => recipe.category === selectedCategory));
    }
  };

  const handleToggleFavorite = async (id: number) => {
    await toggleFavorite(id);
  };

  const handleDeleteRecipe = (id: number) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRecipe(id) },
      ]
    );
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

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={getStyles(darkTheme).recipeCard}
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <LinearGradient
        colors={['#FF8A80', '#81C784']}
        style={getStyles(darkTheme).recipeImageContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={getStyles(darkTheme).recipeEmoji}>{getRecipeImage(item.category)}</Text>
        <TouchableOpacity
          style={getStyles(darkTheme).favoriteButton}
          onPress={() => handleToggleFavorite(item.id!)}
        >
          <Ionicons
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={item.isFavorite ? '#FF6B6B' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </LinearGradient>
      
      <View style={getStyles(darkTheme).recipeInfo}>
        <Text style={getStyles(darkTheme).recipeTitle}>{item.title}</Text>
        <View style={getStyles(darkTheme).recipeMetaContainer}>
          <Text style={getStyles(darkTheme).recipeMeta}>{item.category}</Text>
          <Text style={getStyles(darkTheme).recipeMeta}>{item.difficulty}</Text>
        </View>
        <View style={getStyles(darkTheme).recipeDetailsContainer}>
          <View style={getStyles(darkTheme).recipeDetail}>
            <Ionicons name="time-outline" size={16} color="#9E9E9E" />
            <Text style={getStyles(darkTheme).recipeDetailText}>{item.cookTime} min</Text>
          </View>
          <View style={getStyles(darkTheme).recipeDetail}>
            <Ionicons name="people-outline" size={16} color="#9E9E9E" />
            <Text style={getStyles(darkTheme).recipeDetailText}>{item.servings} servings</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        getStyles(darkTheme).categoryButton,
        selectedCategory === item && getStyles(darkTheme).selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <View style={getStyles(darkTheme).categoryTextContainer}>
        <Text
          style={[
            getStyles(darkTheme).categoryButtonText,
            selectedCategory === item && getStyles(darkTheme).selectedCategoryButtonText,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={false}
          allowFontScaling={false}
        >
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={getStyles(darkTheme).loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={getStyles(darkTheme).loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <View style={getStyles(darkTheme).container}>
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4']}
        style={getStyles(darkTheme).header}
      >
        <Text style={getStyles(darkTheme).headerTitle}>My Recipes</Text>
        <View style={getStyles(darkTheme).searchContainer}>
          <Ionicons name="search" size={20} color="#9E9E9E" style={getStyles(darkTheme).searchIcon} />
          <TextInput
            style={getStyles(darkTheme).searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9E9E9E"
          />
        </View>
      </LinearGradient>

      <View style={getStyles(darkTheme).content}>
        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={getStyles(darkTheme).categoryList}
          contentContainerStyle={getStyles(darkTheme).categoryListContent}
        />

        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id!.toString()}
          numColumns={2}
          columnWrapperStyle={getStyles(darkTheme).recipeRow}
          contentContainerStyle={getStyles(darkTheme).recipeList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={getStyles(darkTheme).emptyContainer}>
              <Text style={getStyles(darkTheme).emptyText}>No recipes found</Text>
              <Text style={getStyles(darkTheme).emptySubtext}>Try searching for something else</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#9E9E9E',
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
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  categoryList: {
    marginVertical: 20,
    maxHeight: 60,
  },
  categoryListContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 12,
    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: isDark ? '#333' : '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 80,
    maxWidth: 120,
  },
  categoryTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  selectedCategoryButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryButtonText: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#9E9E9E',
    fontWeight: '600',
    textAlign: 'center',
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center',
        fontFamily: 'System',
      },
      ios: {
        fontFamily: 'System',
      },
    }),
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  recipeList: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  recipeRow: {
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: (width - 50) / 2,
    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recipeImageContainer: {
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  recipeEmoji: {
    fontSize: 40,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 5,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333',
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipeMeta: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  recipeDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeDetailText: {
    fontSize: 12,
    color: isDark ? '#CCCCCC' : '#9E9E9E',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#CCCCCC' : '#9E9E9E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#999999' : '#9E9E9E',
  },
});

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
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  categoryList: {
    marginVertical: 20,
    maxHeight: 60,
  },
  categoryListContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 80,
    maxWidth: 120,
    
  },
  categoryTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  selectedCategoryButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontWeight: '600',
    textAlign: 'center',
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center',
        fontFamily: 'System',
      },
      ios: {
        fontFamily: 'System',
      },
    }),
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  recipeList: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  recipeRow: {
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: (width - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recipeImageContainer: {
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  recipeEmoji: {
    fontSize: 40,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 5,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipeMeta: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  recipeDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeDetailText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9E9E9E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
  },
});
