<template>
    <q-page class="bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Header -->
        <div class="q-pa-md">
            <q-card class="rounded-xl shadow-4 overflow-hidden" flat>
                <div class="bg-gradient-to-r from-primary to-secondary q-pa-lg text-white text-center">
                    <q-icon name="access_time" size="lg" class="q-mb-md" />
                    <div class="text-h4 text-weight-bold">{{ currentTime }}</div>
                    <div class="text-body1">{{ currentDate }}</div>
                </div>
            </q-card>
        </div>

        <!-- Location & Map Section -->
        <div class="q-px-md q-pb-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="q-pb-none">
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="location_on" class="q-mr-sm" />
                        Current Location
                    </div>
                </q-card-section>
                
                <q-card-section class="q-pt-none">
                    <!-- Location Info -->
                    <div class="location-info q-mb-md">
                        <div v-if="locationLoading" class="text-center q-py-md">
                            <q-spinner-dots size="lg" color="primary" />
                            <div class="text-body2 text-grey-6 q-mt-sm">Getting your location...</div>
                        </div>
                        
                        <div v-else-if="locationError" class="text-center q-py-md">
                            <q-icon name="location_off" size="lg" color="negative" />
                            <div class="text-body2 text-negative q-mt-sm">{{ locationError }}</div>
                            <q-btn 
                                flat 
                                color="primary" 
                                label="Retry" 
                                @click="getCurrentLocation"
                                class="q-mt-md"
                            />
                        </div>
                        
                        <div v-else class="location-details">
                            <div class="location-item" v-if="userLocation.lat && userLocation.lng">
                                <q-icon name="my_location" color="primary" class="q-mr-sm" />
                                <div>
                                    <div class="text-caption text-grey-6">Coordinates</div>
                                    <div class="text-body2 text-weight-medium">
                                        {{ userLocation.lat.toFixed(6) }}, {{ userLocation.lng.toFixed(6) }}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="location-item" v-if="userLocation.address">
                                <q-icon name="place" color="secondary" class="q-mr-sm" />
                                <div>
                                    <div class="text-caption text-grey-6">Address</div>
                                    <div class="text-body2 text-weight-medium">{{ userLocation.address }}</div>
                                </div>
                            </div>
                            
                            <div class="location-item">
                                <q-icon name="schedule" color="info" class="q-mr-sm" />
                                <div>
                                    <div class="text-caption text-grey-6">Last Updated</div>
                                    <div class="text-body2 text-weight-medium">{{ lastLocationUpdate }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Map Container -->
                    <div class="map-container rounded-lg overflow-hidden" v-if="userLocation.lat && userLocation.lng">
                        <div id="attendance-map" class="map-element"></div>
                    </div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Attendance Status -->
        <div class="q-px-md q-pb-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section>
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="fact_check" class="q-mr-sm" />
                        Today's Attendance
                    </div>
                    
                    <div class="row q-col-gutter-md">
                        <!-- Check In Status -->
                        <div class="col-6">
                            <div class="status-card q-pa-md rounded-lg" :class="attendanceStatus.checkedIn ? 'bg-green-50 border-left-positive' : 'bg-grey-50'">
                                <div class="row items-center">
                                    <q-icon 
                                        :name="attendanceStatus.checkedIn ? 'login' : 'schedule'" 
                                        :color="attendanceStatus.checkedIn ? 'positive' : 'grey'" 
                                        size="sm" 
                                        class="q-mr-sm" 
                                    />
                                    <div>
                                        <div class="text-body2 text-weight-medium">Check In</div>
                                        <div class="text-caption" :class="attendanceStatus.checkedIn ? 'text-positive' : 'text-grey-6'">
                                            {{ attendanceStatus.checkInTime || 'Not checked in' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Check Out Status -->
                        <div class="col-6">
                            <div class="status-card q-pa-md rounded-lg" :class="attendanceStatus.checkedOut ? 'bg-red-50 border-left-negative' : 'bg-grey-50'">
                                <div class="row items-center">
                                    <q-icon 
                                        :name="attendanceStatus.checkedOut ? 'logout' : 'schedule'" 
                                        :color="attendanceStatus.checkedOut ? 'negative' : 'grey'" 
                                        size="sm" 
                                        class="q-mr-sm" 
                                    />
                                    <div>
                                        <div class="text-body2 text-weight-medium">Check Out</div>
                                        <div class="text-caption" :class="attendanceStatus.checkedOut ? 'text-negative' : 'text-grey-6'">
                                            {{ attendanceStatus.checkOutTime || 'Not checked out' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Action Buttons -->
        <div class="q-px-md q-pb-xl">
            <div class="row q-col-gutter-md">
                <div class="col-6">
                    <q-btn
                        :disable="attendanceStatus.checkedIn || locationLoading || !!locationError"
                        :loading="checkingIn"
                        @click="handleCheckIn"
                        color="positive"
                        size="lg"
                        class="full-width action-btn"
                        no-caps
                    >
                        <q-icon name="login" class="q-mr-sm" />
                        Check In
                    </q-btn>
                </div>
                
                <div class="col-6">
                    <q-btn
                        :disable="!attendanceStatus.checkedIn || attendanceStatus.checkedOut || locationLoading || !!locationError"
                        :loading="checkingOut"
                        @click="handleCheckOut"
                        color="negative"
                        size="lg"
                        class="full-width action-btn"
                        no-caps
                    >
                        <q-icon name="logout" class="q-mr-sm" />
                        Check Out
                    </q-btn>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Reactive data
const currentTime = ref('');
const currentDate = ref('');
const timeInterval = ref(null);

const userLocation = ref({
    lat: null,
    lng: null,
    address: ''
});

const locationLoading = ref(false);
const locationError = ref('');
const lastLocationUpdate = ref('');

const attendanceStatus = ref({
    checkedIn: false,
    checkedOut: false,
    checkInTime: null,
    checkOutTime: null
});

const checkingIn = ref(false);
const checkingOut = ref(false);

let map = null;

// Methods
const updateTime = () => {
    const now = new Date();
    
    currentTime.value = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    currentDate.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getCurrentLocation = () => {
    locationLoading.value = true;
    locationError.value = '';

    if (!navigator.geolocation) {
        locationError.value = 'Geolocation is not supported by this browser';
        locationLoading.value = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            userLocation.value.lat = position.coords.latitude;
            userLocation.value.lng = position.coords.longitude;
            
            lastLocationUpdate.value = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // Get address from coordinates (reverse geocoding)
            await getAddressFromCoordinates();
            
            // Initialize or update map
            await initializeMap();
            
            locationLoading.value = false;
        },
        (error) => {
            locationLoading.value = false;
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    locationError.value = 'Location access denied by user';
                    break;
                case error.POSITION_UNAVAILABLE:
                    locationError.value = 'Location information is unavailable';
                    break;
                case error.TIMEOUT:
                    locationError.value = 'Location request timed out';
                    break;
                default:
                    locationError.value = 'An unknown error occurred';
                    break;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        }
    );
};

const getAddressFromCoordinates = async () => {
    try {
        const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${userLocation.value.lat}+${userLocation.value.lng}&key=YOUR_API_KEY`
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                userLocation.value.address = data.results[0].formatted;
            }
        }
    } catch (error) {
        console.log('Reverse geocoding failed:', error);
        userLocation.value.address = 'Address not available';
    }
};

const initializeMap = async () => {
    // Simple map implementation using OpenStreetMap
    if (!window.L) {
        // Load Leaflet CSS and JS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => createMap();
        document.head.appendChild(script);
    } else {
        createMap();
    }
};

const createMap = () => {
    if (map) {
        map.remove();
    }

    map = window.L.map('attendance-map').setView([userLocation.value.lat, userLocation.value.lng], 16);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    window.L.marker([userLocation.value.lat, userLocation.value.lng])
        .addTo(map)
        .bindPopup('Your Current Location')
        .openPopup();
};

const handleCheckIn = async () => {
    if (!userLocation.value.lat || !userLocation.value.lng) {
        $q.notify({
            type: 'negative',
            message: 'Location is required for check-in'
        });
        return;
    }

    checkingIn.value = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        attendanceStatus.value.checkedIn = true;
        attendanceStatus.value.checkInTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        $q.notify({
            type: 'positive',
            message: 'Successfully checked in!',
            timeout: 3000
        });

    } catch (error) {
        console.error('Check-in failed:', error);
        $q.notify({
            type: 'negative',
            message: 'Check-in failed. Please try again.'
        });
    } finally {
        checkingIn.value = false;
    }
};

const handleCheckOut = async () => {
    if (!userLocation.value.lat || !userLocation.value.lng) {
        $q.notify({
            type: 'negative',
            message: 'Location is required for check-out'
        });
        return;
    }

    checkingOut.value = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        attendanceStatus.value.checkedOut = true;
        attendanceStatus.value.checkOutTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        $q.notify({
            type: 'positive',
            message: 'Successfully checked out!',
            timeout: 3000
        });

    } catch (error) {
        console.error('Check-out failed:', error);
        $q.notify({
            type: 'negative',
            message: 'Check-out failed. Please try again.'
        });
    } finally {
        checkingOut.value = false;
    }
};

// Lifecycle
onMounted(() => {
    // Start time updates
    updateTime();
    timeInterval.value = setInterval(updateTime, 1000);

    // Get user location
    getCurrentLocation();
});

onUnmounted(() => {
    if (timeInterval.value) {
        clearInterval(timeInterval.value);
    }
    
    if (map) {
        map.remove();
    }
});
</script>

<style lang="scss" scoped>
// Background gradients
.bg-gradient-to-br {
  background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
}

.from-blue-50 { --gradient-from: #eff6ff; }
.to-indigo-100 { --gradient-to: #e0e7ff; }

.bg-gradient-to-r {
  background: linear-gradient(90deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
}

.from-primary { --gradient-from: var(--q-primary); }
.to-secondary { --gradient-to: var(--q-secondary); }

// Location info styling
.location-details {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

.location-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
    transform: translateX(2px);
  }
  
  .q-icon {
    margin-top: 2px;
    flex-shrink: 0;
  }
}

// Map styling
.map-container {
  height: 300px;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.map-element {
  height: 100%;
  width: 100%;
}

// Status cards
.status-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  
  &.border-left-positive {
    border-left-color: var(--q-positive);
  }
  
  &.border-left-negative {
    border-left-color: var(--q-negative);
  }
}

// Action buttons
.action-btn {
  height: 60px;
  border-radius: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .map-container {
    height: 250px;
  }
  
  .location-item {
    padding: 8px !important;
    
    .q-icon {
      font-size: 1.1rem !important;
    }
    
    .text-body2 {
      font-size: 0.85rem;
    }
    
    .text-caption {
      font-size: 0.75rem;
    }
  }
  
  .action-btn {
    height: 50px;
  }
}

// Dark mode support
.q-dark {
  .location-item {
    background: rgba(255, 255, 255, 0.05) !important;
    
    &:hover {
      background: rgba(255, 255, 255, 0.08) !important;
    }
  }
  
  .status-card {
    background: var(--q-dark-page) !important;
  }
}

// Card shadows
.shadow-2 {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shadow-4 {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
</style>