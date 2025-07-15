<template>
  <div class="location-map-picker">
    <div class="q-mb-sm text-subtitle2">{{ label }}</div>
    
    <!-- Search Box -->
    <div class="q-mb-sm">
      <q-input
        v-model="searchQuery"
        label="Search for a location"
        dense
        outlined
        clearable
        @keyup.enter="searchLocation"
        :loading="searching"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-btn
            flat
            dense
            icon="search"
            @click="searchLocation"
            :loading="searching"
          >
            <q-tooltip>Search Location</q-tooltip>
          </q-btn>
        </template>
      </q-input>
      
      <!-- Search Results Dropdown -->
      <q-list v-if="searchResults.length > 0" bordered class="q-mt-xs" style="max-height: 200px; overflow-y: auto;">
        <q-item
          v-for="(result, index) in searchResults"
          :key="index"
          clickable
          @click="selectSearchResult(result)"
          class="q-py-sm"
        >
          <q-item-section>
            <q-item-label>{{ result.display_name }}</q-item-label>
            <q-item-label caption>{{ result.type }} - {{ result.addresstype }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    
    <div 
      ref="mapContainer" 
      class="map-container"
      :style="{ height: height + 'px' }"
    ></div>
    <div class="q-mt-sm row items-center q-gutter-sm" v-if="showField">
      <q-input
        v-model="coordinates.lat"
        label="Latitude"
        dense
        outlined
        type="number"
        step="any"
        class="col"
        @update:model-value="updateMarkerFromInput"
      />
      <q-input
        v-model="coordinates.lng"
        label="Longitude"
        dense
        outlined
        type="number"
        step="any"
        class="col"
        @update:model-value="updateMarkerFromInput"
      />
      <q-input
        v-model="attendanceRadius"
        label="Radius (m)"
        dense
        outlined
        type="number"
        min="1"
        max="10000"
        class="col-3"
        @update:model-value="updateRadiusFromInput"
      />
      <q-btn
        icon="my_location"
        color="primary"
        round
        dense
        @click="getCurrentLocation"
        :loading="gettingLocation"
      >
        <q-tooltip>Get Current Location</q-tooltip>
      </q-btn>
    </div>
    <div class="q-mt-xs">
      <q-toggle
        v-model="radiusMode"
        label="Set Attendance Radius"
        color="primary"
        @update:model-value="toggleRadiusMode"
      />
    </div>
    <div class="q-mt-xs text-caption text-grey-6">
      <div v-if="!radiusMode">
        Click on the map to select a location or enter coordinates manually
      </div>
      <div v-else>
        <div class="text-weight-medium text-orange-8">Radius Mode Active:</div>
        <div>1. Click on map to set center point</div>
        <div>2. Move mouse to see radius circle</div>
        <div>3. Click again to set attendance radius</div>
        <div v-if="currentRadius > 0" class="text-positive q-mt-xs">
          Current radius: {{ Math.round(currentRadius) }} meters
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lat: -6.2088, lng: 106.8456 }) // Default to Jakarta
  },
  radius: {
    type: Number,
    default: 100 // Default attendance radius in meters
  },
  label: {
    type: String,
    default: 'Select Location'
  },
  height: {
    type: Number,
    default: 300
  },
  zoom: {
    type: Number,
    default: 13
  },
  showField: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'update:radius']);

const $q = useQuasar();
const mapContainer = ref(null);
const coordinates = ref({ ...props.modelValue });
const attendanceRadius = ref(props.radius);
const gettingLocation = ref(false);
const radiusMode = ref(false);
const currentRadius = ref(0);

// Search functionality
const searchQuery = ref('');
const searchResults = ref([]);
const searching = ref(false);

let map = null;
let marker = null;
let radiusCircle = null;
let tempCircle = null;
let isSettingRadius = false;
let centerPoint = null;

// Search for location using Nominatim API
const searchLocation = async () => {
  if (!searchQuery.value.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Please enter a location to search'
    });
    return;
  }
  
  searching.value = true;
  searchResults.value = [];
  
  try {
    const query = encodeURIComponent(searchQuery.value.trim());
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1&countrycodes=id`
    );
    
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      $q.notify({
        type: 'info',
        message: 'No locations found for your search'
      });
    } else {
      searchResults.value = data;
    }
  } catch (error) {
    console.error('Search error:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to search location. Please try again.'
    });
  } finally {
    searching.value = false;
  }
};

// Select a search result
const selectSearchResult = (result) => {
  const lat = parseFloat(result.lat);
  const lng = parseFloat(result.lon);
  
  if (!isNaN(lat) && !isNaN(lng)) {
    updateLocation(lat, lng);
    
    // Zoom to the selected location
    if (map) {
      map.setView([lat, lng], 17);
    }
    
    // Clear search results
    searchResults.value = [];
    searchQuery.value = result.display_name;
    
    $q.notify({
      type: 'positive',
      message: `Location set to: ${result.display_name}`
    });
  }
};

// Initialize map
const initMap = async () => {
  try {
    // Dynamically import Leaflet
    const L = await import('leaflet');
    
    // Initialize map
    map = L.map(mapContainer.value).setView([coordinates.value.lat, coordinates.value.lng], props.zoom);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker
    marker = L.marker([coordinates.value.lat, coordinates.value.lng], {
      draggable: !radiusMode.value
    }).addTo(map);
    
    // Add initial radius circle if radius is set
    if (attendanceRadius.value > 0) {
      radiusCircle = L.circle([coordinates.value.lat, coordinates.value.lng], {
        radius: attendanceRadius.value,
        color: '#1976d2',
        fillColor: '#1976d2',
        fillOpacity: 0.2,
        weight: 2
      }).addTo(map);
      currentRadius.value = attendanceRadius.value;
    }
    
    // Handle map click
    map.on('click', (e) => {
      clearSearchResults(); // Clear search results when clicking on map
      
      if (radiusMode.value) {
        handleRadiusClick(e, L);
      } else {
        const { lat, lng } = e.latlng;
        updateLocation(lat, lng);
      }
    });
    
    // Handle mouse move for radius preview
    map.on('mousemove', (e) => {
      if (radiusMode.value && isSettingRadius && centerPoint) {
        showRadiusPreview(e, L);
      }
    });
    
    // Handle marker drag (only when not in radius mode)
    marker.on('dragend', (e) => {
      if (!radiusMode.value) {
        const { lat, lng } = e.target.getLatLng();
        updateLocation(lat, lng);
      }
    });
    
  } catch (error) {
    console.error('Error initializing map:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load map. Please refresh the page.'
    });
  }
};

// Update location and emit change
const updateLocation = (lat, lng) => {
  coordinates.value = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
  
  if (marker && map) {
    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng]);
    
    // Update radius circle position if it exists
    if (radiusCircle) {
      radiusCircle.setLatLng([lat, lng]);
    }
  }
  
  emit('update:modelValue', coordinates.value);
};

// Handle radius click functionality
const handleRadiusClick = async (e, L) => {
  if (!isSettingRadius) {
    // First click - set center point
    centerPoint = e.latlng;
    isSettingRadius = true;
    updateLocation(centerPoint.lat, centerPoint.lng);
    
    // Remove existing radius circle
    if (radiusCircle) {
      map.removeLayer(radiusCircle);
      radiusCircle = null;
    }
    
    $q.notify({
      type: 'info',
      message: 'Center point set. Move mouse to see radius, then click to confirm.'
    });
  } else {
    // Second click - set radius
    const distance = centerPoint.distanceTo(e.latlng);
    attendanceRadius.value = Math.round(distance);
    currentRadius.value = attendanceRadius.value;
    
    // Remove temp circle
    if (tempCircle) {
      map.removeLayer(tempCircle);
      tempCircle = null;
    }
    
    // Create final radius circle
    radiusCircle = L.circle([centerPoint.lat, centerPoint.lng], {
      radius: attendanceRadius.value,
      color: '#1976d2',
      fillColor: '#1976d2',
      fillOpacity: 0.2,
      weight: 2
    }).addTo(map);
    
    // Reset radius mode
    isSettingRadius = false;
    centerPoint = null;
    
    emit('update:radius', attendanceRadius.value);
    
    $q.notify({
      type: 'positive',
      message: `Attendance radius set to ${attendanceRadius.value} meters`
    });
  }
};

// Show radius preview while moving mouse
const showRadiusPreview = (e, L) => {
  if (!centerPoint) return;
  
  const distance = centerPoint.distanceTo(e.latlng);
  currentRadius.value = Math.round(distance);
  
  // Remove previous temp circle
  if (tempCircle) {
    map.removeLayer(tempCircle);
  }
  
  // Create new temp circle
  tempCircle = L.circle([centerPoint.lat, centerPoint.lng], {
    radius: distance,
    color: '#ff9800',
    fillColor: '#ff9800',
    fillOpacity: 0.5,
    weight: 2,
    dashArray: '5, 10'
  }).addTo(map);
};

// Toggle radius mode
const toggleRadiusMode = () => {
  if (marker) {
    marker.options.draggable = !radiusMode.value;
  }
  
  // Reset radius setting state when toggling
  isSettingRadius = false;
  centerPoint = null;
  currentRadius.value = attendanceRadius.value;
  
  // Remove temp circle
  if (tempCircle) {
    map.removeLayer(tempCircle);
    tempCircle = null;
  }
  
  if (!radiusMode.value) {
    $q.notify({
      type: 'info',
      message: 'Radius mode disabled. You can now drag the marker normally.'
    });
  } else {
    $q.notify({
      type: 'info',
      message: 'Radius mode enabled. Click on map to set attendance radius.'
    });
  }
};

// Update marker position from input fields
const updateMarkerFromInput = () => {
  const lat = parseFloat(coordinates.value.lat);
  const lng = parseFloat(coordinates.value.lng);
  
  if (!isNaN(lat) && !isNaN(lng)) {
    updateLocation(lat, lng);
  }
};

// Update radius from input field
const updateRadiusFromInput = async () => {
  const radius = parseInt(attendanceRadius.value);
  
  if (!isNaN(radius) && radius > 0) {
    const L = await import('leaflet');
    
    // Remove existing radius circle
    if (radiusCircle) {
      map.removeLayer(radiusCircle);
    }
    
    // Create new radius circle
    radiusCircle = L.circle([coordinates.value.lat, coordinates.value.lng], {
      radius: radius,
      color: '#1976d2',
      fillColor: '#1976d2',
      fillOpacity: 0.1,
      weight: 2
    }).addTo(map);
    
    currentRadius.value = radius;
    emit('update:radius', radius);
  }
};

// Get current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    $q.notify({
      type: 'negative',
      message: 'Geolocation is not supported by this browser'
    });
    return;
  }
  
  gettingLocation.value = true;
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      updateLocation(latitude, longitude);
      gettingLocation.value = false;
      
      $q.notify({
        type: 'positive',
        message: 'Location updated to your current position'
      });
    },
    (error) => {
      console.error('Error getting location:', error);
      gettingLocation.value = false;
      
      let message = 'Failed to get current location';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location access denied. Please enable location permission.';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out.';
          break;
      }
      
      $q.notify({
        type: 'negative',
        message
      });
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue && (newValue.lat !== coordinates.value.lat || newValue.lng !== coordinates.value.lng)) {
    coordinates.value = { ...newValue };
    if (marker && map) {
      marker.setLatLng([newValue.lat, newValue.lng]);
      map.panTo([newValue.lat, newValue.lng]);
      
      // Update radius circle position
      if (radiusCircle) {
        radiusCircle.setLatLng([newValue.lat, newValue.lng]);
      }
    }
  }
}, { deep: true });

// Watch for external changes to radius
watch(() => props.radius, (newRadius) => {
  if (newRadius !== attendanceRadius.value) {
    attendanceRadius.value = newRadius;
    updateRadiusFromInput();
  }
});

// Clear search results when user modifies search query
watch(searchQuery, (newQuery, oldQuery) => {
  // Only clear if user is typing (not when we set it programmatically)
  if (newQuery !== oldQuery && searchResults.value.length > 0) {
    // Use a small delay to avoid clearing when selecting from results
    setTimeout(() => {
      if (searchQuery.value !== oldQuery) {
        searchResults.value = [];
      }
    }, 100);
  }
});

// Clear search results when clicking on map
const clearSearchResults = () => {
  if (searchResults.value.length > 0) {
    searchResults.value = [];
  }
};

onMounted(async () => {
  await nextTick();
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
.location-map-picker {
  width: 100%;
}

.map-container {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

/* Search results styling */
:deep(.q-list) {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.q-item) {
  transition: background-color 0.2s ease;
}

:deep(.q-item:hover) {
  background-color: #f5f5f5;
}

/* Fix for Leaflet default marker images */
:deep(.leaflet-default-icon-path) {
  background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png');
}
</style>
