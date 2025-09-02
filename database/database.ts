import * as SQLite from 'expo-sqlite';

export interface Recipe {
  id?: number;
  title: string;
  category: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  description: string;
  ingredients: string;
  steps: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface Ingredient {
  id?: number;
  recipeId: number;
  name: string;
  amount: string;
  isChecked: boolean;
}

export interface CookingStep {
  id?: number;
  recipeId: number;
  stepNumber: number;
  instruction: string;
  duration?: number;
}

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('recipes.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        prepTime INTEGER NOT NULL,
        cookTime INTEGER NOT NULL,
        servings INTEGER NOT NULL,
        description TEXT,
        ingredients TEXT,
        steps TEXT,
        isFavorite BOOLEAN DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId INTEGER NOT NULL,
        name TEXT NOT NULL,
        amount TEXT NOT NULL,
        isChecked BOOLEAN DEFAULT 0,
        FOREIGN KEY (recipeId) REFERENCES recipes (id) ON DELETE CASCADE
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS cooking_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId INTEGER NOT NULL,
        stepNumber INTEGER NOT NULL,
        instruction TEXT NOT NULL,
        duration INTEGER,
        FOREIGN KEY (recipeId) REFERENCES recipes (id) ON DELETE CASCADE
      );
    `);

    // Insert sample data if tables are empty
    await this.insertSampleData();
  }

  private async insertSampleData() {
    if (!this.db) return;

    const recipes = await this.db.getAllAsync('SELECT COUNT(*) as count FROM recipes');
    const count = (recipes[0] as any)?.count || 0;

    if (count === 0) {
      // Insert sample recipes
      await this.insertRecipe({
        title: 'Spaghetti Carbonara',
        category: 'Dinner',
        difficulty: 'Medium',
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
        ingredients: JSON.stringify([
          { name: '400g Spaghetti pasta', amount: '400g', isChecked: false },
          { name: '200g Pancetta or bacon', amount: '200g', isChecked: false },
          { name: '3 large eggs', amount: '3', isChecked: false },
          { name: '100g Parmesan cheese', amount: '100g', isChecked: false },
          { name: '2 garlic cloves', amount: '2', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'Bring a large pot of salted water to boil. Cook spaghetti according to package directions.', duration: null },
          { stepNumber: 2, instruction: 'Heat a large pan over medium heat. Add the chopped pancetta and cook until crispy and golden, about 4-5 minutes.', duration: 5 },
          { stepNumber: 3, instruction: 'In a bowl, whisk together eggs, grated Parmesan, and black pepper.', duration: null },
          { stepNumber: 4, instruction: 'Drain pasta, reserving 1 cup pasta water. Add pasta to pan with pancetta.', duration: null },
          { stepNumber: 5, instruction: 'Remove from heat. Quickly stir in egg mixture, adding pasta water gradually until creamy.', duration: null },
          { stepNumber: 6, instruction: 'Serve immediately with extra Parmesan and black pepper.', duration: null }
        ]),
        isFavorite: false,
        createdAt: new Date().toISOString()
      });

      await this.insertRecipe({
        title: 'Fluffy Pancakes',
        category: 'Breakfast',
        difficulty: 'Easy',
        prepTime: 10,
        cookTime: 15,
        servings: 2,
        description: 'Light and fluffy pancakes perfect for breakfast',
        ingredients: JSON.stringify([
          { name: '2 cups all-purpose flour', amount: '2 cups', isChecked: false },
          { name: '2 tbsp sugar', amount: '2 tbsp', isChecked: false },
          { name: '2 tsp baking powder', amount: '2 tsp', isChecked: false },
          { name: '1 tsp salt', amount: '1 tsp', isChecked: false },
          { name: '2 eggs', amount: '2', isChecked: false },
          { name: '1½ cups milk', amount: '1½ cups', isChecked: false },
          { name: '3 tbsp melted butter', amount: '3 tbsp', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'In a large bowl, whisk together flour, sugar, baking powder, and salt.', duration: null },
          { stepNumber: 2, instruction: 'In another bowl, beat eggs and then whisk in milk and melted butter.', duration: null },
          { stepNumber: 3, instruction: 'Pour wet ingredients into dry ingredients and stir until just combined. Don\'t overmix.', duration: null },
          { stepNumber: 4, instruction: 'Heat a lightly oiled griddle or non-stick pan over medium-high heat.', duration: null },
          { stepNumber: 5, instruction: 'Pour ¼ cup batter for each pancake. Cook until bubbles form on surface, then flip.', duration: 3 },
          { stepNumber: 6, instruction: 'Cook until golden brown on the other side. Serve hot with syrup.', duration: 2 }
        ]),
        isFavorite: true,
        createdAt: new Date().toISOString()
      });
    }
  }

  async insertRecipe(recipe: Omit<Recipe, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO recipes (title, category, difficulty, prepTime, cookTime, servings, description, ingredients, steps, isFavorite, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe.title,
        recipe.category,
        recipe.difficulty,
        recipe.prepTime,
        recipe.cookTime,
        recipe.servings,
        recipe.description,
        recipe.ingredients,
        recipe.steps,
        recipe.isFavorite ? 1 : 0,
        recipe.createdAt
      ]
    );

    return result.lastInsertRowId;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    if (!this.db) throw new Error('Database not initialized');

    const recipes = await this.db.getAllAsync('SELECT * FROM recipes ORDER BY createdAt DESC');
    return recipes.map(recipe => ({
      ...(recipe as any),
      isFavorite: Boolean((recipe as any).isFavorite)
    }));
  }

  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    if (!this.db) throw new Error('Database not initialized');

    const recipes = await this.db.getAllAsync(
      'SELECT * FROM recipes WHERE category = ? ORDER BY createdAt DESC',
      [category]
    );
    return recipes.map(recipe => ({
      ...(recipe as any),
      isFavorite: Boolean((recipe as any).isFavorite)
    }));
  }

  async getFavoriteRecipes(): Promise<Recipe[]> {
    if (!this.db) throw new Error('Database not initialized');

    const recipes = await this.db.getAllAsync(
      'SELECT * FROM recipes WHERE isFavorite = 1 ORDER BY createdAt DESC'
    );
    return recipes.map(recipe => ({
      ...(recipe as any),
      isFavorite: Boolean((recipe as any).isFavorite)
    }));
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    if (!this.db) throw new Error('Database not initialized');

    const recipe = await this.db.getFirstAsync('SELECT * FROM recipes WHERE id = ?', [id]);
    if (!recipe) return null;

    return {
      ...(recipe as any),
      isFavorite: Boolean((recipe as any).isFavorite)
    };
  }

  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(recipe).filter(key => key !== 'id');
    const values = fields.map(key => (recipe as any)[key]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    if (fields.length === 0) return;

    await this.db.runAsync(
      `UPDATE recipes SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
  }

  async toggleFavorite(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE recipes SET isFavorite = NOT isFavorite WHERE id = ?',
      [id]
    );
  }

  async deleteRecipe(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    if (!this.db) throw new Error('Database not initialized');

    const recipes = await this.db.getAllAsync(
      'SELECT * FROM recipes WHERE title LIKE ? OR description LIKE ? ORDER BY createdAt DESC',
      [`%${query}%`, `%${query}%`]
    );
    return recipes.map(recipe => ({
      ...(recipe as any),
      isFavorite: Boolean((recipe as any).isFavorite)
    }));
  }
}

export const database = new DatabaseManager();
