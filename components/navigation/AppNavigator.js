import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UserProfile from '../screens/UserProfile';
import Tools from '../screens/Tools';
import Settings from '../screens/Settings';
import CreateProject from '../screens/CreateProject';
import ScanQr from '../screens/ScanQr';
import ViewOnMap from '../screens/ViewOnMap';
import CreateMaintenance from '../screens/CreateMaintenance';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#ffffff' }
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfile}
        />
        <Stack.Screen 
          name="Tools" 
          component={Tools}
        />
        <Stack.Screen 
          name="Settings" 
          component={Settings}
        />
        <Stack.Screen 
          name="CreateProject" 
          component={CreateProject}
        />
        <Stack.Screen 
          name="ScanQr" 
          component={ScanQr}
        />
        <Stack.Screen 
          name="ViewOnMap" 
          component={ViewOnMap}
        />
        <Stack.Screen 
          name="CreateMaintenance" 
          component={CreateMaintenance}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;