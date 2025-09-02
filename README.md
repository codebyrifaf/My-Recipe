# 🍽️ My Recipe App

A beautiful and feature-rich recipe management mobile application built with React Native, Expo, and SQLite. This app provides a complete solution for managing, cooking, and sharing your favorite recipes with an intuitive and modern interface.

## ✨ Features

### 📱 Core Functionality
- **📚 Recipe Management**: Browse, search, and organize your recipe collection
- **❤️ Favorites System**: Mark and manage your favorite recipes
- **➕ Add Recipes**: Create new recipes with detailed ingredients and instructions
- **👨‍🍳 Cooking Mode**: Step-by-step cooking guidance with built-in timer
- **📊 Profile & Settings**: User statistics, preferences, and data export
- **🌙 Dark Mode**: Complete dark theme support across all screens
- **📄 PDF Export**: Export recipes as beautifully formatted PDF documents

### 🎨 User Experience
- **Modern UI Design**: Clean, gradient-based interface with intuitive navigation
- **Responsive Layout**: Optimized for various screen sizes and orientations
- **Tab Navigation**: Easy access to all main features via bottom tab bar
- **Search & Filter**: Find recipes quickly by title, category, or description
- **Loading States**: Smooth loading indicators and transitions

### 🗄️ Data Management
- **SQLite Database**: Local storage for all recipe data with full CRUD operations
- **Data Persistence**: All recipes and settings saved locally on device
- **Export Functionality**: Generate shareable PDF documents with formatted recipes
- **Sample Data**: Pre-loaded recipes for immediate app exploration

## 🛠️ Technology Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript for type safety
- **Database**: SQLite with expo-sqlite
- **Navigation**: Expo Router with file-based routing
- **State Management**: React Context API
- **Styling**: React Native StyleSheet with dynamic theming
- **Icons**: Expo Vector Icons (@expo/vector-icons)
- **Gradients**: expo-linear-gradient for beautiful backgrounds
- **File Operations**: expo-file-system, expo-sharing, expo-print

## 📁 Project Structure

```
My-Recipe/
├── app/                          # Application screens
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Recipe list & search
│   │   ├── add.tsx              # Add new recipe form
│   │   ├── favorites.tsx        # Favorite recipes
│   │   └── profile.tsx          # User profile & settings
│   ├── recipe/[id].tsx          # Recipe details view
│   ├── cooking/[id].tsx         # Cooking mode with timer
│   ├── _layout.tsx              # Root layout with theme provider
│   └── +not-found.tsx          # 404 error page
├── components/                   # Reusable components
│   ├── IngredientItem.tsx       # Ingredient display component
│   ├── TimerComponent.tsx       # Cooking timer component
│   └── ui/                      # UI components
├── contexts/                     # React contexts
│   └── SettingsContext.tsx     # App settings & theme management
├── database/                     # Database layer
│   ├── database.ts              # SQLite setup & operations
│   └── DatabaseContext.tsx     # Database context provider
├── constants/                    # App constants
│   └── Colors.ts                # Theme colors
└── assets/                       # Static assets
    ├── images/                  # App images and icons
    └── fonts/                   # Custom fonts
```

## 🗃️ Database Schema

### Recipes Table
```sql
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  prepTime INTEGER NOT NULL,
  cookTime INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,  -- JSON array of ingredients
  steps TEXT NOT NULL,        -- JSON array of cooking steps
  isFavorite INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/codebyrifaf/My-Recipe.git
   cd My-Recipe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run the app**
   - **Mobile**: Scan the QR code with Expo Go app
   - **Android Emulator**: Press `a` in terminal
   - **iOS Simulator**: Press `i` in terminal (macOS only)
   - **Web**: Press `w` in terminal

## 📖 Usage Guide

### Adding a Recipe
1. Navigate to the **Add** tab
2. Fill in recipe details:
   - Title, category, and difficulty
   - Preparation and cooking times
   - Number of servings
   - Description
3. Add ingredients with amounts
4. Add step-by-step cooking instructions
5. Tap **Add Recipe** to save

### Cooking Mode
1. Open any recipe from the main list
2. Tap **Start Cooking** button
3. Follow the step-by-step instructions
4. Use the built-in timer for timed steps
5. Navigate between steps using Previous/Next buttons

### Managing Favorites
- Tap the ❤️ icon on any recipe to toggle favorite status
- View all favorites in the **Favorites** tab
- Search through favorites using the search bar

### Dark Mode
- Toggle dark mode in the **Profile** tab
- All screens automatically adapt to the selected theme
- Setting is persistent across app sessions

### Exporting Recipes
- Go to **Profile** tab
- Tap **Export Recipes** button
- Share or save the generated PDF document

## 🎯 Key Features Implementation

| Feature | Status | Description |
|---------|--------|-------------|
| ✅ Recipe CRUD | Complete | Create, read, update, delete recipes |
| ✅ SQLite Integration | Complete | Local database with full functionality |
| ✅ Search & Filter | Complete | Search by title and filter by category |
| ✅ Favorites System | Complete | Heart-based favorite marking |
| ✅ Cooking Mode | Complete | Step-by-step with timer |
| ✅ Dark Theme | Complete | App-wide dark mode support |
| ✅ PDF Export | Complete | Formatted recipe PDF generation |
| ✅ Tab Navigation | Complete | Bottom tab navigation |
| ✅ Responsive Design | Complete | Adapts to different screen sizes |

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful color gradients throughout the app
- **Card-based Layout**: Modern card design for recipe display
- **Consistent Theming**: Unified color scheme with dark mode support
- **Intuitive Icons**: Clear iconography for all actions
- **Smooth Animations**: Subtle transitions and feedback

## 🔧 Development

### Available Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript**: Full type safety throughout the codebase
- **ESLint**: Code linting with Expo configuration
- **Component Architecture**: Modular, reusable components
- **Context Pattern**: Efficient state management with React Context

## 📱 Screenshots & Demo

The app closely follows modern mobile design principles with:
- Clean, intuitive interface
- Smooth navigation and transitions
- Professional color scheme
- Responsive layout design
- Accessibility considerations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the SWE 4637 Web and Mobile Application Development course. All rights reserved.

## 📞 Contact

**Developer**: codebyrifaf  
**Course**: SWE 4637 Web and Mobile Application Development  
**Project**: Lab 6 - Recipe Management App

---

*Built with ❤️ using React Native and Expo*
