import React, {PropsWithChildren, useEffect} from 'react';
import {AppState} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {RootStackParms} from '../navigation/StackNavigator';
import {usePermissionStore} from '../store/permisions/usePermissionStore';

export const PermissionsChecker = ({children}: PropsWithChildren) => {
  const {locationStatus, checkLocationPermission} = usePermissionStore();
  const navigation = useNavigation<NavigationProp<RootStackParms>>();

  useEffect(() => {
    if (locationStatus === 'granted') {
      navigation.reset({
        routes: [{name: 'MapScreen'}],
      });
    } else if (locationStatus !== 'undetermined') {
      navigation.reset({
        routes: [{name: 'PermissionsScreen'}],
      });
    }
  }, [locationStatus]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
};
