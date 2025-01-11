import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { navigationRef } from '../utils/NavigationUtils';
import JoinMeetScreen from '../screens/JoinMeetScreen';
import PrepareMeetScreen from '../screens/PrepareMeetScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import LiveMeetScreen from '../screens/LiveMeetScreen';
import { WSProvider } from '../service/api/WSProvider';


const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <WSProvider>

    <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen}/>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="JoinMeetScreen" component={JoinMeetScreen}/>
            <Stack.Screen name="PrepareMeetScreen" component={PrepareMeetScreen}/>
            <Stack.Screen name="LiveMeetScreen" component={LiveMeetScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
    </WSProvider>
  );
};

export default Navigation;