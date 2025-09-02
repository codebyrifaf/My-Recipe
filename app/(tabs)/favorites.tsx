import { useDatabaseContext } from '@/database/DatabaseContext';
import { Recipe } from '@/database/database';
import { useSettings } from '@/contexts/SettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const { favoriteRecipes, loading, toggleFavorite } = useDatabaseContext();
  const { darkTheme } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = favoriteRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites(favoriteRecipes);
    }
  }, [searchQuery, favoriteRecipes]);

  const handleToggleFavorite = async (id: number) => {
    await toggleFavorite(id);
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

  const renderFavoriteCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={getStyles(darkTheme).favoriteCard}
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
            name="heart"
            size={24}
            color="#FF6B6B"
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
            <Text style={getStyles(darkTheme).recipeDetailText}>{item.prepTime} min</Text>
          </View>
          <View style={getStyles(darkTheme).recipeDetail}>
            <Ionicons name="people-outline" size={16} color="#9E9E9E" />
            <Text style={getStyles(darkTheme).recipeDetailText}>{item.servings} servings</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={getStyles(darkTheme).loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={getStyles(darkTheme).loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={getStyles(darkTheme).container}>
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4']}
        style={getStyles(darkTheme).header}
      >
        <Text style={getStyles(darkTheme).headerTitle}>My Favorites</Text>
        <View style={getStyles(darkTheme).searchContainer}>
          <Ionicons name="search" size={20} color="#9E9E9E" style={getStyles(darkTheme).searchIcon} />
          <TextInput
            style={getStyles(darkTheme).searchInput}
            placeholder="Search favorites..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9E9E9E"
          />
        </View>
      </LinearGradient>

      <View style={getStyles(darkTheme).content}>
        <FlatList
          data={filteredFavorites}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item.id!.toString()}
          contentContainerStyle={getStyles(darkTheme).favoritesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={getStyles(darkTheme).emptyContainer}>
              <Ionicons name="heart-outline" size={80} color="#E0E0E0" />
              <Text style={getStyles(darkTheme).emptyText}>No favorites yet</Text>
              <Text style={getStyles(darkTheme).emptySubtext}>
                {searchQuery.trim() 
                  ? 'No favorites match your search' 
                  : 'Start adding recipes to your favorites by tapping the heart icon'}
              </Text>
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
    paddingHorizontal: 20,
  },
  favoritesList: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  favoriteCard: {
    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  recipeImageContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  recipeEmoji: {
    fontSize: 50,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  recipeInfo: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333',
    marginBottom: 10,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recipeMeta: {
    fontSize: 14,
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
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#9E9E9E',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#CCCCCC' : '#9E9E9E',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: isDark ? '#999999' : '#BDBDBD',
    textAlign: 'center',
    lineHeight: 24,
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
    paddingHorizontal: 20,
  },
  favoritesList: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  recipeImageContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  recipeEmoji: {
    fontSize: 50,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  recipeInfo: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recipeMeta: {
    fontSize: 14,
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
    fontSize: 14,
    color: '#9E9E9E',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9E9E9E',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center',
    lineHeight: 24,
  },
});
