import {create} from 'zustand';
import {Location} from '../../../infrastructure/interfaces/location';
import {getCurrentLocation} from '../../../actions/location/location';

interface LocationState {
  lastKnowLocation: Location | null;

  getLocation: () => Promise<Location | null>;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  lastKnowLocation: null,
  getLocation: async () => {
    const location = await getCurrentLocation();
    set({lastKnowLocation: location});
    return location;
  },
}));
