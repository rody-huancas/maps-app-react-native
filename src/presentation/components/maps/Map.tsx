import React, {useEffect, useRef, useState} from 'react';
import {Platform, PermissionsAndroid, ActivityIndicator} from 'react-native';
import MapView, {Polyline, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {Location} from '../../../infrastructure/interfaces/location';
import {FAB} from '../ui/FAB';
import {useLocationStore} from '../../store/location/useLocationStore';

interface Props {
  showsUserLocation?: boolean;
  initialLocation: Location;
}

const customMapStyle = [
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'all',
    stylers: [{visibility: 'on'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'all',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'all',
    stylers: [{visibility: 'off'}],
  },
];

export const Map = ({showsUserLocation = true, initialLocation}: Props) => {
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isShowingPolyline, setIsShowingPolyline] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const {
    getLocation,
    lastKnowLocation,
    watchLocation,
    clearWatchLocation,
    userLocationList,
  } = useLocationStore();

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message: 'La aplicación necesita acceso a tu ubicación',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const initialRegion: Region = {
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const moveCamaraToLocation = async (location: Location) => {
    if (!mapRef.current) return;

    const region: Region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    mapRef.current.animateToRegion(region, 1000);
  };

  const moveToCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log('No hay permisos de ubicación');
        return;
      }

      const location = await getLocation();
      if (location) {
        moveCamaraToLocation(location);
        cameraLocation.current = location;
        setIsFollowingUser(true);
      } else {
        moveCamaraToLocation(initialLocation);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      moveCamaraToLocation(initialLocation);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          console.log('No hay permisos de ubicación');
          return;
        }

        const location = await getLocation();
        if (location) {
          cameraLocation.current = location;
          moveCamaraToLocation(location);
        }
      } catch (error) {
        console.error('Error initializing location:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    initializeLocation();
  }, []);

  useEffect(() => {
    watchLocation();

    return () => {
      clearWatchLocation();
    };
  }, []);

  useEffect(() => {
    if (lastKnowLocation && isFollowingUser) {
      moveCamaraToLocation(lastKnowLocation);
      cameraLocation.current = lastKnowLocation;
    }
  }, [lastKnowLocation, isFollowingUser]);

  return (
    <>
      <MapView
        ref={map => (mapRef.current = map!)}
        showsUserLocation={true}
        customMapStyle={customMapStyle}
        showsMyLocationButton={false}
        showsCompass={true}
        rotateEnabled={true}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        style={{flex: 1}}
        onTouchStart={() => setIsFollowingUser(false)}
        initialRegion={initialRegion}
        minZoomLevel={15}
        maxZoomLevel={20}
        followsUserLocation={isFollowingUser}
        showsPointsOfInterest={false}
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
        userLocationFastestInterval={5000}>
        {isShowingPolyline && (
          <Polyline
            coordinates={userLocationList}
            strokeColor="black"
            strokeWidth={5}
          />
        )}
      </MapView>

      {isLoadingLocation && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{position: 'absolute', top: '50%', alignSelf: 'center'}}
        />
      )}

      <FAB
        iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => setIsShowingPolyline(!isShowingPolyline)}
        style={{
          bottom: 140,
          right: 20,
        }}
      />

      <FAB
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
        onPress={() => setIsFollowingUser(!isFollowingUser)}
        style={{
          bottom: 80,
          right: 20,
        }}
      />

      <FAB
        iconName="compass-outline"
        onPress={moveToCurrentLocation}
        style={{
          bottom: 20,
          right: 20,
        }}
      />
    </>
  );
};