import React, {useRef} from 'react';
import {Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Location} from '../../../infrastructure/interfaces/location';
import {FAB} from '../ui/FAB';
import {useLocationStore} from '../../store/location/useLocationStore';

interface Props {
  showsUserLocation?: boolean;
  initialLocation: Location;
}

export const Map = ({showsUserLocation = true, initialLocation}: Props) => {
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);

  const {getLocation, lastKnowLocation} = useLocationStore();

  const moveCamaraToLocation = (location: Location) => {
    if (!mapRef.current) return;

    mapRef.current.animateCamera({
      center: location,
    });
  };

  const moveToCurrentLocation = async () => {
    if (!lastKnowLocation) {
      moveCamaraToLocation(initialLocation);
    }

    const location = await getLocation();
    if (!location) return;
    moveCamaraToLocation(location);
  };

  return (
    <>
      <MapView
        ref={map => (mapRef.current = map!)}
        showsUserLocation={showsUserLocation}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        style={{flex: 1}}
        region={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.latitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {/* <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title='Título del marcardor'
          description='Cuerpo del marcador'
          image={require("../../../assets/marker.png")}
        /> */}
      </MapView>

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
