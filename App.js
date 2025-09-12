import React from 'react';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider, Box } from 'native-base';
import AppNavigator from './components/navigation/AppNavigator';

// Silenciar warnings específicos
LogBox.ignoreLogs([
  'SSRProvider is not necessary',
  'In React 18, SSRProvider is not necessary'
]);

const App = () => {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <AppNavigator />
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};

export default App;

// import React from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NativeBaseProvider } from 'native-base';
// import AppNavigator from './components/navigation/AppNavigator';

// const App = () => {
//   return (
//     <SafeAreaProvider>
//       <NativeBaseProvider>
//         <AppNavigator />
//       </NativeBaseProvider>
//     </SafeAreaProvider>
//   );
// };

// export default App;