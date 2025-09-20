import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { AppProvider, useApp } from './components/context/AppContext';
import { withResponsive } from './components/hoc/withResponsive';
import AppNavigator from './components/navigation/AppNavigator'; // tu stack

const Stack = createNativeStackNavigator();

// Lista de pantallas (sin tocar los archivos originales)
const screens = [
  { name: 'Dashboard', component: require('./components/screens/DashboardScreen').default },
  { name: 'CreateProject', component: require('./components/screens/CreateProject').default },
  { name: 'CreateMaintenance', component: require('./components/screens/CreateMaintenance').default },
  { name: 'ViewOnMap', component: require('./components/screens/ViewOnMap').default },
  { name: 'Tools', component: require('./components/screens/Tools').default },
  { name: 'Settings', component: require('./components/screens/Settings').default },
  { name: 'UserProfile', component: require('./components/screens/UserProfile').default },
  { name: 'ScanQr', component: require('./components/screens/ScanQr').default },
  { name: 'ConnectivityDevices', component: require('./components/screens/ConnectivityDevices').default },
  { name: 'NetworkMap', component: require('./components/screens/NetworkMap').default },
  { name: 'Login', component: require('./components/screens/LoginScreen').default },
  // NetworkMap
  // añade más aquí
];

// Envolvemos cada componente
const wrappedScreens = screens.map((s) => ({
  ...s,
  component: withResponsive(s.component),
}));

export default function App() {

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {wrappedScreens.map((s) => (
                <Stack.Screen key={s.name} name={s.name} component={s.component} />
              ))}
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}