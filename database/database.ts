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

    // Clear existing data to ensure fresh sample data
    await this.db.runAsync('DELETE FROM recipes');
    
    // Reset the auto-increment counter
    await this.db.runAsync('DELETE FROM sqlite_sequence WHERE name="recipes"');

    // Always insert sample data after clearing
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

      await this.insertRecipe({
        title: 'Caesar Salad',
        category: 'Lunch',
        difficulty: 'Easy',
        prepTime: 15,
        cookTime: 0,
        servings: 4,
        description: 'Fresh and crispy Caesar salad with homemade dressing',
        ingredients: JSON.stringify([
          { name: '2 heads romaine lettuce', amount: '2 heads', isChecked: false },
          { name: '½ cup parmesan cheese', amount: '½ cup', isChecked: false },
          { name: '1 cup croutons', amount: '1 cup', isChecked: false },
          { name: '3 tbsp mayonnaise', amount: '3 tbsp', isChecked: false },
          { name: '2 tbsp lemon juice', amount: '2 tbsp', isChecked: false },
          { name: '2 garlic cloves', amount: '2', isChecked: false },
          { name: '1 tsp anchovy paste', amount: '1 tsp', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'Wash and chop romaine lettuce into bite-sized pieces.', duration: null },
          { stepNumber: 2, instruction: 'Make dressing by mixing mayonnaise, lemon juice, minced garlic, and anchovy paste.', duration: null },
          { stepNumber: 3, instruction: 'Toss lettuce with dressing in a large bowl.', duration: null },
          { stepNumber: 4, instruction: 'Top with grated parmesan cheese and croutons.', duration: null },
          { stepNumber: 5, instruction: 'Serve immediately for best crispness.', duration: null }
        ]),
        isFavorite: false,
        createdAt: new Date().toISOString()
      });

      await this.insertRecipe({
        title: 'Chocolate Chip Cookies',
        category: 'Dessert',
        difficulty: 'Easy',
        prepTime: 15,
        cookTime: 12,
        servings: 24,
        description: 'Classic chewy chocolate chip cookies that everyone loves',
        ingredients: JSON.stringify([
          { name: '2¼ cups all-purpose flour', amount: '2¼ cups', isChecked: false },
          { name: '1 tsp baking soda', amount: '1 tsp', isChecked: false },
          { name: '1 tsp salt', amount: '1 tsp', isChecked: false },
          { name: '1 cup butter, softened', amount: '1 cup', isChecked: false },
          { name: '¾ cup granulated sugar', amount: '¾ cup', isChecked: false },
          { name: '¾ cup brown sugar', amount: '¾ cup', isChecked: false },
          { name: '2 large eggs', amount: '2', isChecked: false },
          { name: '2 tsp vanilla extract', amount: '2 tsp', isChecked: false },
          { name: '2 cups chocolate chips', amount: '2 cups', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'Preheat oven to 375°F (190°C).', duration: null },
          { stepNumber: 2, instruction: 'Mix flour, baking soda, and salt in a bowl.', duration: null },
          { stepNumber: 3, instruction: 'Beat butter and sugars until creamy. Add eggs and vanilla.', duration: 3 },
          { stepNumber: 4, instruction: 'Gradually mix in flour mixture, then stir in chocolate chips.', duration: null },
          { stepNumber: 5, instruction: 'Drop rounded tablespoons of dough onto ungreased baking sheets.', duration: null },
          { stepNumber: 6, instruction: 'Bake for 9-11 minutes until golden brown. Cool on baking sheet for 2 minutes.', duration: 10 }
        ]),
        isFavorite: true,
        createdAt: new Date().toISOString()
      });

      await this.insertRecipe({
        title: 'Grilled Chicken Breast',
        category: 'Dinner',
        difficulty: 'Medium',
        prepTime: 20,
        cookTime: 15,
        servings: 4,
        description: 'Juicy grilled chicken breast with herbs and spices',
        ingredients: JSON.stringify([
          { name: '4 chicken breasts', amount: '4', isChecked: false },
          { name: '2 tbsp olive oil', amount: '2 tbsp', isChecked: false },
          { name: '1 tsp garlic powder', amount: '1 tsp', isChecked: false },
          { name: '1 tsp paprika', amount: '1 tsp', isChecked: false },
          { name: '1 tsp dried thyme', amount: '1 tsp', isChecked: false },
          { name: '1 tsp salt', amount: '1 tsp', isChecked: false },
          { name: '½ tsp black pepper', amount: '½ tsp', isChecked: false },
          { name: '2 tbsp lemon juice', amount: '2 tbsp', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'Pound chicken breasts to even thickness (about ¾ inch).', duration: null },
          { stepNumber: 2, instruction: 'Mix olive oil, garlic powder, paprika, thyme, salt, pepper, and lemon juice.', duration: null },
          { stepNumber: 3, instruction: 'Marinate chicken in the mixture for at least 15 minutes.', duration: 15 },
          { stepNumber: 4, instruction: 'Preheat grill to medium-high heat.', duration: null },
          { stepNumber: 5, instruction: 'Grill chicken for 6-7 minutes per side until internal temp reaches 165°F.', duration: 14 },
          { stepNumber: 6, instruction: 'Let rest for 5 minutes before slicing and serving.', duration: 5 }
        ]),
        isFavorite: false,
        createdAt: new Date().toISOString()
      });

      await this.insertRecipe({
        title: 'Avocado Toast',
        category: 'Breakfast',
        difficulty: 'Easy',
        prepTime: 5,
        cookTime: 5,
        servings: 2,
        description: 'Simple and nutritious avocado toast with a perfect poached egg',
        ingredients: JSON.stringify([
          { name: '2 slices whole grain bread', amount: '2 slices', isChecked: false },
          { name: '1 ripe avocado', amount: '1', isChecked: false },
          { name: '2 eggs', amount: '2', isChecked: false },
          { name: '1 tbsp lime juice', amount: '1 tbsp', isChecked: false },
          { name: 'Salt to taste', amount: 'to taste', isChecked: false },
          { name: 'Black pepper to taste', amount: 'to taste', isChecked: false },
          { name: 'Red pepper flakes', amount: 'pinch', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'Toast bread slices until golden brown.', duration: 3 },
          { stepNumber: 2, instruction: 'Mash avocado with lime juice, salt, and pepper in a bowl.', duration: null },
          { stepNumber: 3, instruction: 'Bring water to boil, create whirlpool, and poach eggs for 3-4 minutes.', duration: 4 },
          { stepNumber: 4, instruction: 'Spread mashed avocado evenly on toast.', duration: null },
          { stepNumber: 5, instruction: 'Top each toast with a poached egg and sprinkle with red pepper flakes.', duration: null }
        ]),
        isFavorite: true,
        createdAt: new Date().toISOString()
      });

      await this.insertRecipe({
        title: 'Classic Cheeseburger',
        category: 'Lunch',
        difficulty: 'Medium',
        prepTime: 15,
        cookTime: 10,
        servings: 4,
        description: 'Juicy homemade cheeseburger with all the fixings',
        ingredients: JSON.stringify([
          { name: '1 lb ground beef (80/20)', amount: '1 lb', isChecked: false },
          { name: '4 hamburger buns', amount: '4', isChecked: false },
          { name: '4 slices cheese', amount: '4 slices', isChecked: false },
          { name: '1 large onion, sliced', amount: '1', isChecked: false },
          { name: '2 tomatoes, sliced', amount: '2', isChecked: false },
          { name: 'Lettuce leaves', amount: '4-6 leaves', isChecked: false },
          { name: 'Pickles', amount: 'to taste', isChecked: false },
          { name: 'Ketchup and mustard', amount: 'to taste', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'Form ground beef into 4 equal patties, slightly larger than buns.', duration: null },
          { stepNumber: 2, instruction: 'Season patties with salt and pepper on both sides.', duration: null },
          { stepNumber: 3, instruction: 'Heat grill or skillet over medium-high heat.', duration: null },
          { stepNumber: 4, instruction: 'Cook patties for 3-4 minutes per side for medium doneness.', duration: 8 },
          { stepNumber: 5, instruction: 'Add cheese to patties in last minute of cooking.', duration: 1 },
          { stepNumber: 6, instruction: 'Toast buns lightly, then assemble burgers with desired toppings.', duration: 2 }
        ]),
        isFavorite: false,
        createdAt: new Date().toISOString()
      });

      await this.insertRecipe({
        title: 'Chocolate Lava Cake',
        category: 'Dessert',
        difficulty: 'Hard',
        prepTime: 20,
        cookTime: 12,
        servings: 4,
        description: 'Decadent individual chocolate cakes with molten centers',
        ingredients: JSON.stringify([
          { name: '4 oz dark chocolate', amount: '4 oz', isChecked: false },
          { name: '4 tbsp butter', amount: '4 tbsp', isChecked: false },
          { name: '2 large eggs', amount: '2', isChecked: false },
          { name: '2 large egg yolks', amount: '2', isChecked: false },
          { name: '¼ cup granulated sugar', amount: '¼ cup', isChecked: false },
          { name: '2 tbsp all-purpose flour', amount: '2 tbsp', isChecked: false },
          { name: 'Butter for ramekins', amount: 'for greasing', isChecked: false },
          { name: 'Cocoa powder for dusting', amount: 'for dusting', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'Preheat oven to 425°F (220°C). Butter and dust 4 ramekins with cocoa powder.', duration: null },
          { stepNumber: 2, instruction: 'Melt chocolate and butter in double boiler until smooth.', duration: 3 },
          { stepNumber: 3, instruction: 'Whisk eggs, egg yolks, and sugar until thick and pale.', duration: 2 },
          { stepNumber: 4, instruction: 'Fold melted chocolate mixture into egg mixture, then add flour.', duration: null },
          { stepNumber: 5, instruction: 'Divide batter among ramekins and bake for 10-12 minutes.', duration: 11 },
          { stepNumber: 6, instruction: 'Let cool for 1 minute, then invert onto plates and serve immediately.', duration: 1 }
        ]),
        isFavorite: true,
        createdAt: new Date().toISOString()
      });

      await this.insertRecipe({
        title: 'Greek Quinoa Salad',
        category: 'Lunch',
        difficulty: 'Easy',
        prepTime: 20,
        cookTime: 15,
        servings: 6,
        description: 'Healthy and refreshing Mediterranean quinoa salad',
        ingredients: JSON.stringify([
          { name: '1 cup quinoa', amount: '1 cup', isChecked: false },
          { name: '2 cups water', amount: '2 cups', isChecked: false },
          { name: '1 cucumber, diced', amount: '1', isChecked: false },
          { name: '2 tomatoes, diced', amount: '2', isChecked: false },
          { name: '½ red onion, diced', amount: '½', isChecked: false },
          { name: '½ cup kalamata olives', amount: '½ cup', isChecked: false },
          { name: '½ cup feta cheese', amount: '½ cup', isChecked: false },
          { name: '¼ cup olive oil', amount: '¼ cup', isChecked: false },
          { name: '2 tbsp lemon juice', amount: '2 tbsp', isChecked: false },
          { name: '1 tsp dried oregano', amount: '1 tsp', isChecked: false }
        ]),
        steps: JSON.stringify([
          { stepNumber: 1, instruction: 'Rinse quinoa and cook with water until tender, about 15 minutes.', duration: 15 },
          { stepNumber: 2, instruction: 'Let quinoa cool completely and fluff with a fork.', duration: null },
          { stepNumber: 3, instruction: 'Dice cucumber, tomatoes, and red onion.', duration: null },
          { stepNumber: 4, instruction: 'Mix olive oil, lemon juice, and oregano for dressing.', duration: null },
          { stepNumber: 5, instruction: 'Combine quinoa, vegetables, olives, and feta in a large bowl.', duration: null },
          { stepNumber: 6, instruction: 'Toss with dressing and refrigerate for 30 minutes before serving.', duration: null }
        ]),
        isFavorite: false,
        createdAt: new Date().toISOString()
      });
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
