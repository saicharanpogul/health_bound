import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Home, Profile, Wallet} from '../screens';
import {
  HomeIcon,
  ProfileIcon,
  HomeActiveIcon,
  ProfileActiveIcon,
  WalletActiveIcon,
  WalletIcon,
} from '../assets/icons';
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import {colors} from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();

const BottomTabs = ({}: BottomTabBarButtonProps) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.text.dark,
          height: 56,
          borderTopColor: colors.text.dark,
        },
        activeTintColor: colors.primary.main,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                style={styles.icons}
                source={focused ? HomeActiveIcon : HomeIcon}
              />
            );
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                style={styles.icons}
                source={focused ? ProfileActiveIcon : ProfileIcon}
              />
            );
          },
        })}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => {
            return (
              <Image
                style={styles.icons}
                source={focused ? WalletActiveIcon : WalletIcon}
              />
            );
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  icons: {
    width: 30,
    height: 30,
  },
});
