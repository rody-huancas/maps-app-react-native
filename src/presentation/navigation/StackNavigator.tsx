import {createStackNavigator} from '@react-navigation/stack';
import {LoadingScreen} from '../screens/loading/LoadingScreen';
import {PermissionsScreen} from '../screens/permissions/PermissionsScreen';
import {MapScreen} from '../screens/maps/MapScreen';

export type RootStackParms = {
  LoadingScren: undefined;
  PermissionsScreen: undefined;
  MapScreen: undefined;
};

const Stack = createStackNavigator<RootStackParms>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoadingScren"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen name="LoadingScren" component={LoadingScreen} />
      <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
};
