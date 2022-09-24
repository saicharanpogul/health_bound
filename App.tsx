import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {colors, fontFamily} from './src/theme';
import {navigationRef} from './src/components/RootNavigation';
import {Welcome} from './src/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const StackScreens = () => {
    return (
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Welcome" component={Welcome} />
      </Stack.Navigator>
    );
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaView style={styles.backgroundTopStyle} />
      <SafeAreaView style={styles.backgroundBottomStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <StackScreens />
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  test: {
    fontFamily: fontFamily.normal.light,
  },
  backgroundTopStyle: {
    flex: 0,
    backgroundColor: colors.background.main,
  },
  backgroundBottomStyle: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
});

export default App;
