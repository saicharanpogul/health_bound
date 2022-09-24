import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {colors, fontFamily} from './src/theme';
import {navigationRef} from './src/components/RootNavigation';
import {
  BackupMnemonicInfo,
  ExportMnemonicOrPrivateKey,
  Home,
  ImportWallet,
  MnemonicVerification,
  NewWallet,
  SecurityTips,
  Welcome,
} from './src/screens';
import {useAppSelector} from './src/hooks/useRedux';
import {getIsPasscodeSet} from './src/redux/reducers/wallet';
import {BottomTabs} from './src/components';

const Stack = createNativeStackNavigator<RootStackParamList>();
const NativeStack = createNativeStackNavigator();

const App = () => {
  const isPasscodeSet = useAppSelector(getIsPasscodeSet);
  useEffect(() => {}, [isPasscodeSet]);
  const StackScreens = () => {
    const NativeStackScreens = () => {
      return (
        <NativeStack.Navigator screenOptions={{headerShown: false}}>
          <NativeStack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen name="SecurityTips" component={SecurityTips} />
          <Stack.Screen
            name="ExportMnemonicOrPrivateKey"
            component={ExportMnemonicOrPrivateKey}
          />
        </NativeStack.Navigator>
      );
    };
    return (
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{headerShown: false}}>
        {isPasscodeSet ? (
          <Stack.Group>
            <Stack.Screen
              name="Root"
              component={NativeStackScreens}
              options={{gestureEnabled: false}}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="NewWallet" component={NewWallet} />
            <Stack.Screen
              name="BackupMnemonicInfo"
              component={BackupMnemonicInfo}
            />
            <Stack.Screen
              name="MnemonicVerification"
              component={MnemonicVerification}
            />
            <Stack.Screen name="ImportWallet" component={ImportWallet} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    );
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaView style={styles.backgroundTopStyle} />
      <SafeAreaView style={styles.backgroundBottomStyle}>
        <StatusBar barStyle={'light-content'} />
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
    backgroundColor: colors.background.dark,
  },
});

export default App;
