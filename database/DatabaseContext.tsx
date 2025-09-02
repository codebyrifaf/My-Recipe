import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { database, Recipe } from './database';

interface DatabaseContextType {
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  loading: boolean;
  refreshRecipes: () => Promise<void>;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
  updateRecipe: (id: number, recipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  getRecipesByCategory: (category: string) => Promise<Recipe[]>;
  searchRecipes: (query: string) => Promise<Recipe[]>;
  getRecipeById: (id: number) => Promise<Recipe | null>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await database.initialize();
      await refreshRecipes();
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecipes = async () => {
    try {
      const allRecipes = await database.getAllRecipes();
      const favorites = await database.getFavoriteRecipes();
      setRecipes(allRecipes);
      setFavoriteRecipes(favorites);
    } catch (error) {
      console.error('Error refreshing recipes:', error);
    }
  };

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    try {
      await database.insertRecipe(recipe);
      await refreshRecipes();
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const updateRecipe = async (id: number, recipe: Partial<Recipe>) => {
    try {
      await database.updateRecipe(id, recipe);
      await refreshRecipes();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const deleteRecipe = async (id: number) => {
    try {
      await database.deleteRecipe(id);
      await refreshRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const toggleFavorite = async (id: number) => {
    try {
      await database.toggleFavorite(id);
      await refreshRecipes();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getRecipesByCategory = async (category: string) => {
    try {
      return await database.getRecipesByCategory(category);
    } catch (error) {
      console.error('Error getting recipes by category:', error);
      return [];
    }
  };

  const searchRecipes = async (query: string) => {
    try {
      return await database.searchRecipes(query);
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  };

  const getRecipeById = async (id: number) => {
    try {
      return await database.getRecipeById(id);
    } catch (error) {
      console.error('Error getting recipe by ID:', error);
      return null;
    }
  };

  const value: DatabaseContextType = {
    recipes,
    favoriteRecipes,
    loading,
    refreshRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    getRecipesByCategory,
    searchRecipes,
    getRecipeById,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
