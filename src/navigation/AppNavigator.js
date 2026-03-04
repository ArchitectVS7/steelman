import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

const linking = {
  prefixes: [],
  config: {
    screens: {
      Steelman: {
        screens: {
          Home: '',
          Results: 'results',
        },
      },
      'ITT Game': 'itt',
      Settings: 'settings',
    },
  },
};

import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ITTScreen from '../screens/ITTScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.background,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTintColor: COLORS.text,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 17,
  },
};

function SteelmanStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          title: 'Steelman Result',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, focused }) {
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {emoji}
    </Text>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer linking={Platform.OS === 'web' ? linking : undefined} documentTitle={{ formatter: () => 'Steelman' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Steelman"
          component={SteelmanStack}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🛡️" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="ITT Game"
          component={ITTScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🧪" focused={focused} />,
            ...screenOptions,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
            ...screenOptions,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 85,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
