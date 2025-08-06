import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import your MonsterArenaScreen component
import MonsterArenaScreen from './screens/MonsterArenaScreen';

const Stack = createStackNavigator();

// Your home screen component
function HomeScreen({ navigation }) {
  const showComingSoon = (section) => {
    Alert.alert('Coming Soon!', `${section} section will be available soon.`);
  };

  const navigateToMonsterArena = () => {
    navigation.navigate('MonsterArena');
  };

  const CategoryCard = ({ title, count, total, iconName, onPress }) => (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <View style={styles.cardContent}>
        <Ionicons name={iconName} size={32} color={colors.gold} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardProgress}>{count}/{total}</Text>
      </View>
    </TouchableOpacity>
  );

  const ProgressBar = ({ progress, max }) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${(progress / max) * 100}%` }
          ]} 
        />
      </View>
    </View>
  );

  const completedItems = 156;
  const totalItems = 485;
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBlue} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="star" size={80} color={colors.gold} />
          </View>
          <Text style={styles.title}>FFX Completionist</Text>
          <Text style={styles.subtitle}>Track your journey through Spira</Text>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <ProgressBar progress={completedItems} max={totalItems} />
          <Text style={styles.progressText}>
            {overallProgress}% Complete ({completedItems}/{totalItems} items)
          </Text>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoryRow}>
            <CategoryCard
              title="Items"
              count={45}
              total={68}
              iconName="bag-outline"
              onPress={() => showComingSoon('Items')}
            />
            <CategoryCard
              title="Weapons"
              count={23}
              total={45}
              iconName="sword-outline"
              onPress={() => showComingSoon('Weapons')}
            />
          </View>

          <View style={styles.categoryRow}>
            <CategoryCard
              title="Monster Arena"
              count={87}
              total={142}
              iconName="paw-outline"
              onPress={navigateToMonsterArena}
            />
            <CategoryCard
              title="Celestial"
              count={2}
              total={7}
              iconName="flash-outline"
              onPress={() => showComingSoon('Celestial Weapons')}
            />
          </View>

          <View style={styles.categoryRow}>
            <CategoryCard
              title="Blitzball"
              count={12}
              total={32}
              iconName="football-outline"
              onPress={() => showComingSoon('Blitzball')}
            />
            <CategoryCard
              title="Al Bhed"
              count={18}
              total={26}
              iconName="book-outline"
              onPress={() => showComingSoon('Al Bhed Primers')}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => showComingSoon('Backup Data')}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Backup Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => showComingSoon('Settings')}
            >
              <Ionicons name="settings-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.darkBlue }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MonsterArena" component={MonsterArenaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const colors = {
  darkBlue: '#1a237e',
  gold: '#ffd700',
  lightBlue: '#64b5f6',
  cardBackground: '#283593',
  accent: '#3949ab',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 8,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightBlue,
    fontStyle: 'italic',
  },
  progressCard: {
    backgroundColor: colors.cardBackground,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.darkBlue,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.lightBlue,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryCard: {
    flex: 1,
    height: 120,
    backgroundColor: colors.cardBackground,
    marginHorizontal: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginTop: 8,
    marginBottom: 4,
  },
  cardProgress: {
    fontSize: 12,
    color: colors.lightBlue,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});