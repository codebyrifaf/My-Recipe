# My Recipe App

A beautiful and functional recipe management app built with React Native and Expo, featuring SQLite database integration.

## Features

### 🍳 Recipe Management
- **Browse Recipes**: View all recipes in a beautiful card-based layout
- **Category Filtering**: Filter recipes by category (Breakfast, Lunch, Dinner, Dessert)
- **Search Functionality**: Search recipes by title or description
- **Recipe Details**: View detailed recipe information including ingredients and cooking steps

### ❤️ Favorites System
- **Add to Favorites**: Mark recipes as favorites with a heart icon
- **Favorites Screen**: Dedicated screen to view all favorite recipes
- **Quick Toggle**: Easily add/remove favorites from any recipe view

### ➕ Add New Recipes
- **Complete Recipe Form**: Add title, category, difficulty, prep/cook time, servings
- **Ingredients Management**: Add multiple ingredients with amounts
- **Step-by-Step Instructions**: Add detailed cooking instructions
- **Form Validation**: Ensures all required fields are properly filled

### 👨‍🍳 Cooking Mode
- **Step-by-Step Guidance**: Navigate through cooking steps one by one
- **Built-in Timer**: Automatic timer for steps that require specific timing
- **Timer Controls**: Start, pause, and stop timer functionality
- **Progress Tracking**: Shows current step and total progress

### 📱 User Experience
- **Beautiful UI**: Modern gradient designs matching the provided mockups
- **Responsive Design**: Works perfectly on different screen sizes
- **Smooth Navigation**: Intuitive navigation between screens
- **Loading States**: Proper loading indicators for better UX

### 🗄️ Data Management
- **SQLite Database**: Local database for storing all recipe data
- **CRUD Operations**: Create, Read, Update, Delete recipes
- **Data Persistence**: All data is saved locally on the device
- **Sample Data**: Comes with pre-loaded sample recipes

### 👤 Profile Management
- **User Profile**: Displays cooking statistics and preferences
- **Settings**: Theme toggle, notifications, measurement units
- **Data Export/Import**: Options for backing up recipe data
- **Statistics**: Shows total recipes and favorites count

## Technical Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **SQLite**: Local database storage
- **Expo Router**: File-based routing system
- **React Context**: State management
- **Linear Gradient**: Beautiful gradient backgrounds
- **Vector Icons**: Comprehensive icon library

## Database Schema

### Recipes Table
- `id`: Primary key
- `title`: Recipe name
- `category`: Recipe category (Breakfast, Lunch, Dinner, Dessert)
- `difficulty`: Difficulty level (Easy, Medium, Hard)
- `prepTime`: Preparation time in minutes
- `cookTime`: Cooking time in minutes
- `servings`: Number of servings
- `description`: Recipe description
- `ingredients`: JSON string of ingredients array
- `steps`: JSON string of cooking steps array
- `isFavorite`: Boolean for favorite status
- `createdAt`: Timestamp of creation

## Project Structure

```
app/
├── (tabs)/                 # Tab navigation screens
│   ├── index.tsx          # Main recipes list
│   ├── add.tsx            # Add new recipe
│   ├── favorites.tsx      # Favorites list
│   └── profile.tsx        # User profile
├── recipe/[id].tsx        # Recipe details
├── cooking/[id].tsx       # Cooking mode
└── _layout.tsx           # Root layout

database/
├── database.ts           # SQLite database setup and operations
└── DatabaseContext.tsx  # React context for database operations

components/
├── IngredientItem.tsx    # Ingredient list item component
└── TimerComponent.tsx    # Timer component for cooking mode
```

## Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on device/simulator**
   - Scan QR code with Expo Go app (Android/iOS)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

## Usage

### Adding a New Recipe
1. Navigate to the "Add" tab
2. Fill in all required fields:
   - Recipe title
   - Category and difficulty
   - Prep and cook times
   - Number of servings
   - Description
   - Ingredients with amounts
   - Cooking steps
3. Tap "Add Recipe" to save

### Cooking Mode
1. Open any recipe from the list
2. Tap "Start Cooking"
3. Follow step-by-step instructions
4. Use the timer for timed steps
5. Navigate between steps using Previous/Next buttons

### Managing Favorites
- Tap the heart icon on any recipe to add/remove from favorites
- View all favorites in the "Favorites" tab
- Search through favorites using the search bar

## Features Matching Design Requirements

✅ **Add Recipe Screen**: Complete form with all fields from mockup
✅ **Recipe Details**: Matches the detailed view with ingredients and actions
✅ **Favorites Screen**: Heart icons and favorite recipe display
✅ **My Recipes**: Grid layout with category filtering
✅ **Cooking Mode**: Step-by-step with timer functionality
✅ **Profile Screen**: Statistics and settings options
✅ **Navigation**: Bottom tab navigation with proper icons
✅ **Color Scheme**: Matching gradients and color palette
✅ **SQLite Integration**: Full database functionality
✅ **Search Functionality**: Search across all recipes

## Database Operations

The app includes full CRUD operations:
- **Create**: Add new recipes
- **Read**: View recipes, search, filter
- **Update**: Toggle favorites, edit recipes
- **Delete**: Remove recipes with confirmation

All data is stored locally using SQLite and persists between app sessions.

## Screenshots

The app closely follows the provided design mockups with:
- Beautiful gradient headers
- Card-based recipe layouts
- Heart icons for favorites
- Step-by-step cooking mode
- Modern profile interface
- Comprehensive add recipe form

## Future Enhancements

- Recipe sharing functionality
- Photo upload for recipes
- Nutrition information
- Meal planning features
- Shopping list generation
- Recipe ratings and reviews
