import {Pressable, Text, View} from 'react-native';
import {globalStyles} from '../../../config/theme/styles';
import { usePermissionStore } from '../../store/permisions/usePermissionStore';

export const PermissionsScreen = () => {
  
  const { locationStatus, requestLocationPermission } = usePermissionStore();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Habilitar Ubicación</Text>

      <Pressable style={globalStyles.btnPrimary} onPress={requestLocationPermission}>
        <Text style={{color: 'white'}}>Habilitar Localización</Text>
      </Pressable>

      <Text>Estado Actual: {locationStatus}</Text>
    </View>
  );
};
