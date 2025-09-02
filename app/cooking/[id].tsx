import { useDatabaseContext } from '@/database/DatabaseContext';
import { Recipe } from '@/database/database';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CookingModeScreen() {
  const { id } = useLocalSearchParams();
  const { getRecipeById } = useDatabaseContext();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadRecipe();
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [id]);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            Alert.alert('Timer', 'Step completed!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isTimerRunning]);

  const loadRecipe = async () => {
    try {
      if (!id) return;
      const recipeData = await getRecipeById(Number(id));
      if (recipeData) {
        setRecipe(recipeData);
        const parsedSteps = JSON.parse(recipeData.steps || '[]');
        setSteps(parsedSteps);
        // Set initial timer if first step has duration
        if (parsedSteps[0]?.duration) {
          setTimer(parsedSteps[0].duration * 60); // Convert minutes to seconds
        }
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      setIsTimerRunning(false);
      
      // Set timer for next step if it has duration
      const nextStep = steps[nextStepIndex];
      if (nextStep?.duration) {
        setTimer(nextStep.duration * 60);
      } else {
        setTimer(0);
      }
    } else {
      Alert.alert(
        'Cooking Complete!',
        'You have finished cooking this recipe. Enjoy your meal!',
        [
          { text: 'Back to Recipe', onPress: () => router.back() },
          { text: 'Home', onPress: () => router.push('/(tabs)') }
        ]
      );
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      setIsTimerRunning(false);
      
      // Set timer for previous step if it has duration
      const prevStep = steps[prevStepIndex];
      if (prevStep?.duration) {
        setTimer(prevStep.duration * 60);
      } else {
        setTimer(0);
      }
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Cooking Mode',
      'Are you sure you want to exit cooking mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => router.back() }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Loading cooking mode...</Text>
      </View>
    );
  }

  if (!recipe || steps.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No cooking steps available</Text>
      </View>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cooking Mode</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.stepProgress}>Step {currentStep + 1} of {steps.length}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>{currentStepData.stepNumber}</Text>
          </View>
          <Text style={styles.stepInstruction}>{currentStepData.instruction}</Text>
        </View>

        {timer > 0 && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
            <View style={styles.timerControls}>
              <TouchableOpacity
                style={[styles.timerButton, styles.pauseButton]}
                onPress={handlePauseTimer}
              >
                <Ionicons 
                  name={isTimerRunning ? 'pause' : 'play'} 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.timerButtonText}>
                  {isTimerRunning ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timerButton, styles.stopButton]}
                onPress={handleStopTimer}
              >
                <Ionicons name="stop" size={20} color="#FFFFFF" />
                <Text style={styles.timerButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
            onPress={handlePreviousStep}
            disabled={currentStep === 0}
          >
            <Ionicons name="chevron-back" size={24} color={currentStep === 0 ? '#BDBDBD' : '#9E9E9E'} />
            <Text style={[styles.navButtonText, currentStep === 0 && styles.disabledText]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    marginBottom: 20,
  },
  exitButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 34,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  stepProgress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  stepContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepNumberContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepInstruction: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 20,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 15,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  pauseButton: {
    backgroundColor: '#4ECDC4',
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
  },
  timerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 50,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  disabledText: {
    color: '#BDBDBD',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
