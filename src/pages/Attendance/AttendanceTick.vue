<template>
    <q-page class="bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Header with Back Button -->
        <div class="q-pa-md">
            <div class="row items-center q-mb-md">
                <q-btn
                    flat
                    round
                    icon="arrow_back"
                    color="primary"
                    @click="$router.go(-1)"
                    class="q-mr-md"
                >
                    <q-tooltip>Back</q-tooltip>
                </q-btn>
                <div class="text-h6 text-weight-bold text-grey-8">
                    Attendance Check
                </div>
            </div>
            
            <!-- Simple Elegant Time Display Card -->
            <q-card class="time-display-card rounded-xl shadow-3 overflow-hidden" flat>
                <div class="time-display-content q-pa-lg text-center">
                    <!-- Current time with clean typography -->
                    <div class="time-display q-mb-xs">
                        <span class="time-text">{{ currentTime }}</span>
                    </div>
                    
                    <!-- Date with subtle styling -->
                    <div class="date-display">
                        <span class="date-text">{{ currentDate }}</span>
                    </div>
                </div>
            </q-card>
        </div>

        <!-- Location & Map Section -->
        <div class="q-px-md q-pb-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="q-pb-none">
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="location_on" class="q-mr-sm" />
                        Location Information
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
                            
                            <!-- Workplace Proximity Status -->
                            <div class="location-item" v-if="workplaceProximityStatus.length > 0">
                                <q-icon name="business" color="accent" class="q-mr-sm" />
                                <div class="full-width">
                                    <div class="text-caption text-grey-6">Workplace Proximity</div>
                                    <div v-for="(status, index) in workplaceProximityStatus" :key="index" class="q-mt-xs">
                                        <div class="row items-center justify-between">
                                            <div class="text-body2 text-weight-medium">
                                                {{ status.name || `Workplace ${index + 1}` }}
                                            </div>
                                            <q-chip 
                                                :color="status.isWithinRadius ? 'positive' : 'warning'" 
                                                text-color="white" 
                                                size="sm"
                                                dense
                                            >
                                                {{ status.isWithinRadius ? 'In Range' : 'Outside' }}
                                            </q-chip>
                                        </div>
                                        <div class="text-caption text-grey-6">
                                            Distance: {{ Math.round(status.distance) }}m / {{ status.radius }}m
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <!-- Map Container -->
                    <div class="map-container rounded-lg overflow-hidden" v-if="userLocation.lat && userLocation.lng">
                        <!-- Recenter Button -->
                        <q-btn
                            fab
                            color="primary"
                            icon="my_location"
                            class="map-recenter-btn"
                            size="sm"
                            @click="recenterMap"
                            :loading="locationLoading"
                        >
                            <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                :offset="[0, 10]"
                            >
                                Center map on my location
                            </q-tooltip>
                        </q-btn>
                        
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
            <!-- History Button -->
            <q-btn
                outline
                color="grey-6"
                size="md"
                class="full-width q-mb-md history-btn"
                no-caps
                @click="$router.push('/attendance/history')"
            >
                <q-icon name="history" class="q-mr-sm" />
                View Attendance History
            </q-btn>

            <!-- Main Action Button -->
            <q-btn
                :disable="locationLoading || !!locationError || attendanceStatus.checkedOut"
                :loading="checkingIn || checkingOut"
                @click="handleAttendanceAction"
                :color="getButtonColor()"
                size="lg"
                class="full-width action-btn"
                no-caps
            >
                <q-icon :name="getButtonIcon()" class="q-mr-sm" />
                {{ getButtonText() }}
            </q-btn>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { AttendanceApi, WorkplaceApi } from 'src/api';
import { useAuthStore } from 'stores/auth';

const $q = useQuasar();
const authStore = useAuthStore();

// Get user data
const user = authStore.user;

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
const loadingAttendance = ref(false);
const workplaceProximityStatus = ref([]);

let map = null;

const loadWorkplace = async (ids) => {
    try {
        if (!ids || ids.length === 0) {
            console.log('No workplace IDs provided');
            return [];
        }
        
        
        const { data } = await WorkplaceApi.getWorkplace({
            params: {
                filter: { _id: { $in: ids } },
                limit: 1000,
                select: 'name coordinate radius'
            }
        });
        
        return data || [];
    } catch (error) {
        console.error('Error loading workplace data:', error);
        throw error;
    }
}
// Load today's attendance data
const loadTodayAttendance = async () => {
    // Get the first workplace delegate or fallback
    const workplace = user?.workplace_delegate?.[0] || user?.workplace;
    
    if (!user?._id || !workplace?._id) {
        console.log('User or workplace data not available');
        $q.notify({
            type: 'warning',
            message: 'User or workplace data not available'
        });
        return;
    }

    loadingAttendance.value = true;
    
    try {
        const response = await AttendanceApi.getTodayAttendance(user._id);
        const todayAttendance = response.data;
        
        if (todayAttendance) {
            // Update attendance status based on API data
            attendanceStatus.value.checkedIn = !!todayAttendance.checkin_date;
            attendanceStatus.value.checkedOut = !!todayAttendance.checkout_date;
            
            if (todayAttendance.checkin_date) {
                const checkinTime = new Date(todayAttendance.checkin_date);
                attendanceStatus.value.checkInTime = checkinTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
            
            if (todayAttendance.checkout_date) {
                const checkoutTime = new Date(todayAttendance.checkout_date);
                attendanceStatus.value.checkOutTime = checkoutTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
        }
    } catch (error) {
        console.log('Failed to load today attendance:', error);
        // If no attendance found for today, that's normal - keep default values
        if (error.response?.status !== 404) {
            $q.notify({
                type: 'warning',
                message: 'Failed to load attendance data'
            });
        }
    } finally {
        loadingAttendance.value = false;
    }
};

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

            console.log('User location obtained:', userLocation.value);

            // Get address from coordinates (reverse geocoding)
            await getAddressFromCoordinates();
            
            // Calculate workplace proximity
            calculateWorkplaceProximity();
            
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
        // Using Nominatim (OpenStreetMap) reverse geocoding - free and no API key required
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.value.lat}&lon=${userLocation.value.lng}&addressdetails=1&zoom=18`
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
                userLocation.value.address = data.display_name;
            } else {
                userLocation.value.address = 'Address not available';
            }
        } else {
            userLocation.value.address = 'Address not available';
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

    // Add user location marker with custom icon
    const userMarker = window.L.marker([userLocation.value.lat, userLocation.value.lng], {
        icon: window.L.divIcon({
            className: 'user-location-marker',
            html: '<div style="background: #1976d2; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);
    

    const allMarkers = [userMarker];

    // Add workplace delegate markers and radius circles
    if (user?.workplace_delegate && user.workplace_delegate.length > 0) {
        let userIsWithinAnyRadius = false; // Track if user is within any workplace radius
        
        user.workplace_delegate.forEach((workplace, index) => {
            if (workplace.coordinate && workplace.coordinate.length == 2) {
                const [lng, lat] = workplace.coordinate;
                const radius = workplace.radius || 100; // Default 100 meters if no radius specified
                const workplaceName = workplace.name || `Workplace ${index + 1}`;
                
                console.log(`Adding workplace ${index + 1}:`, { name: workplaceName, lat, lng, radius });
                
                // Calculate distance from user to workplace
                const userLatLng = window.L.latLng(userLocation.value.lat, userLocation.value.lng);
                const workplaceLatLng = window.L.latLng(lat, lng);
                const distance = userLatLng.distanceTo(workplaceLatLng);
                const isWithinRadius = distance <= radius;
                
                // Update global radius check
                if (isWithinRadius) {
                    userIsWithinAnyRadius = true;
                }
                
                // Create workplace marker with enhanced styling
                const workplaceMarker = window.L.marker([lat, lng], {
                    icon: window.L.divIcon({
                        className: 'workplace-marker',
                        html: `<div style="
                            background: radial-gradient(circle,rgba(255, 89, 0, 1) 34%, rgba(237, 221, 83, 1) 100%);
                            width: 20px; 
                            height: 20px; 
                            border-radius: 50%; 
                            border: 2px solid #000; 
                            box-shadow: 0 3px 10px rgba(0,0,0,0.5); 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            color: white; 
                            font-size: 10px; 
                            font-weight: bold;
                            position: relative;
                        ">${index + 1}</div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    })
                }).addTo(map);
                
                allMarkers.push(workplaceMarker);
                
                // Create radius circle with dynamic styling
                const circle = window.L.circle([lat, lng], {
                    color: '#000',
                    fillColor: '#2196f3',
                    fillOpacity: 0.3,
                    radius: radius,
                    weight: 1,
                }).addTo(map);
                
                // Enhanced popup with more information
                const popupContent = `
                    <div style="text-align: center; min-width: 200px;">
                        <strong>🏢 ${workplaceName}</strong><br>
                        <div style="margin: 8px 0; padding: 4px 8px; background: ${isWithinRadius ? '#e3f2fd' : '#f3e5f5'}; border-radius: 4px;">
                            <small style="color: ${isWithinRadius ? '#1976d2' : '#7b1fa2'};">
                                ${isWithinRadius ? '✅ You are in check-in range!' : '⚠️ Outside check-in range'}
                            </small>
                        </div>
                        <small><strong>Check-in radius:</strong> ${radius}m</small><br>
                        <small><strong>Your distance:</strong> ${Math.round(distance)}m</small><br>
                        <small><strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</small>
                    </div>
                `;
                
                workplaceMarker.bindPopup(popupContent);
                
                // Add click event to highlight the workplace
                workplaceMarker.on('click', () => {
                    // Temporarily highlight the circle
                    const originalStyle = {
                        color: circle.options.color,
                        fillColor: circle.options.fillColor,
                        fillOpacity: circle.options.fillOpacity,
                        weight: circle.options.weight
                    };
                    
                    circle.setStyle({
                        color: '#ff9800',
                        fillColor: '#ff9800',
                        fillOpacity: 0.3,
                        weight: 4
                    });
                    
                    setTimeout(() => {
                        circle.setStyle(originalStyle);
                    }, 2000);
                });
            } else {
                console.warn(`Workplace ${index + 1} has invalid coordinates:`, workplace);
            }
        });

        // Auto-fit map to show all markers with proper padding
        if (allMarkers.length > 1) {
            const group = new window.L.featureGroup(allMarkers);
            map.fitBounds(group.getBounds().pad(0.15)); // 15% padding
            
            // Set zoom based on user's proximity to workplace
            if (userIsWithinAnyRadius) {
                // User is within radius - set zoom to 15 for better detail
                map.setZoom(15);
                console.log('User is within workplace radius - setting zoom to 15');
            } else {
                // Ensure minimum zoom level for readability when outside radius
                if (map.getZoom() > 18) {
                    map.setZoom(18);
                }
            }
        } else {
            // Single marker or no workplace - center on user with appropriate zoom
            const zoomLevel = userIsWithinAnyRadius ? 15 : 16;
            map.setView([userLocation.value.lat, userLocation.value.lng], zoomLevel);
        }
    } else {
        console.log('No workplace delegates found for user');
        // If no workplaces, just center on user location with default zoom
        map.setView([userLocation.value.lat, userLocation.value.lng], 16);
    }
};

// Helper functions for single attendance button
const getButtonColor = () => {
    if (attendanceStatus.value.checkedOut) {
        return 'grey'; // Already completed for the day
    }
    return attendanceStatus.value.checkedIn ? 'negative' : 'positive';
};

const getButtonIcon = () => {
    if (attendanceStatus.value.checkedOut) {
        return 'check_circle'; // Already completed
    }
    return attendanceStatus.value.checkedIn ? 'logout' : 'login';
};

const getButtonText = () => {
    if (attendanceStatus.value.checkedOut) {
        return 'Attendance Complete';
    }
    return attendanceStatus.value.checkedIn ? 'Check Out' : 'Check In';
};

// Recenter map to user location
const recenterMap = () => {
    if (!map || !userLocation.value.lat || !userLocation.value.lng) {
        $q.notify({
            type: 'warning',
            message: 'Unable to center map - location not available'
        });
        return;
    }

    // Animate to user location
    map.flyTo([userLocation.value.lat, userLocation.value.lng], 16, {
        animate: true,
        duration: 1.5 // 1.5 seconds animation
    });

    // Show notification
    $q.notify({
        type: 'positive',
        message: 'Map centered on your location',
        timeout: 2000
    });
};

// Check if user is within workplace radius and get details
const checkUserProximity = () => {
    if (!user?.workplace_delegate || user.workplace_delegate.length === 0 || 
        !userLocation.value.lat || !userLocation.value.lng) {
        return {
            isWithinRadius: false,
            nearestWorkplace: null,
            minDistance: Infinity,
            error: 'Location or workplace data not available'
        };
    }

    const userLatLng = { lat: userLocation.value.lat, lng: userLocation.value.lng };
    let isWithinRadius = false;
    let nearestWorkplace = null;
    let minDistance = Infinity;

    user.workplace_delegate.forEach((workplace) => {
        if (workplace.coordinate && workplace.coordinate.length >= 2) {
            const [lng, lat] = workplace.coordinate;
            const radius = workplace.radius || 100;
            
            const distance = calculateDistance(userLatLng.lat, userLatLng.lng, lat, lng);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestWorkplace = workplace;
            }
            
            if (distance <= radius) {
                isWithinRadius = true;
            }
        }
    });

    return {
        isWithinRadius,
        nearestWorkplace,
        minDistance,
        error: null
    };
};

// Show confirmation dialog for outside radius attendance
const showOutsideRadiusConfirmation = (action, distance, workplaceName) => {
    return new Promise((resolve) => {
        $q.dialog({
            title: 'Location Outside Workplace Radius',
            message: `You are currently ${Math.round(distance)}m away from ${workplaceName || 'the workplace'}. 
                     
Your ${action} will be recorded but will require supervisor approval to be considered valid.

Do you want to proceed?`,
            cancel: true,
            persistent: true,
            ok: {
                label: `Proceed with ${action}`,
                color: 'primary',
                'no-caps': true
            }
        }).onOk(() => {
            resolve(true);
        }).onCancel(() => {
            resolve(false);
        });
    });
};

const handleAttendanceAction = async () => {
    if (attendanceStatus.value.checkedOut) {
        // Already checked out, no action needed - button should be disabled
        return;
    }
    
    if (attendanceStatus.value.checkedIn) {
        // User is checked in, so perform check out
        await handleCheckOut();
    } else {
        // User is not checked in, so perform check in
        await handleCheckIn();
    }
};

const handleCheckIn = async () => {
    if (!userLocation.value.lat || !userLocation.value.lng) {
        $q.notify({
            type: 'negative',
            message: 'Location is required for check-in'
        });
        return;
    }

    // Check if user has workplace delegates
    if (!user?.workplace_delegate || user.workplace_delegate.length === 0) {
        $q.notify({
            type: 'negative',
            message: 'No workplace information available'
        });
        return;
    }

    // Check user proximity to workplace
    const proximityResult = checkUserProximity();
    
    if (proximityResult.error) {
        $q.notify({
            type: 'negative',
            message: proximityResult.error
        });
        return;
    }

    if (!proximityResult.nearestWorkplace) {
        $q.notify({
            type: 'negative',
            message: 'Workplace location data not available'
        });
        return;
    }

    // If user is outside radius, show confirmation dialog
    if (!proximityResult.isWithinRadius) {
        const confirmed = await showOutsideRadiusConfirmation(
            'check-in',
            proximityResult.minDistance,
            proximityResult.nearestWorkplace.name
        );
        
        if (!confirmed) {
            return; // User cancelled
        }
    }

    checkingIn.value = true;

    try {
        // Determine message based on location
        let checkInMessage = '';
        if (proximityResult.isWithinRadius) {
            checkInMessage = 'Successfully checked in within workplace radius!';
        } else {
            checkInMessage = `Checked in outside radius (${Math.round(proximityResult.minDistance)}m away). Pending approval.`;
        }

        // Use real API call with nearest workplace
        await AttendanceApi.quickCheckIn(user._id, proximityResult.nearestWorkplace._id, {
            coords: {
                longitude: userLocation.value.lng,
                latitude: userLocation.value.lat
            }
        });

        // Update local state
        attendanceStatus.value.checkedIn = true;
        attendanceStatus.value.checkInTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        $q.notify({
            type: proximityResult.isWithinRadius ? 'positive' : 'warning',
            message: checkInMessage,
            timeout: 4000
        });

    } catch (error) {
        console.error('Check-in failed:', error);
        $q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Check-in failed. Please try again.'
        });
    } finally {
        checkingIn.value = false;
    }
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
};

// Calculate workplace proximity status
const calculateWorkplaceProximity = () => {
    if (!user?.workplace_delegate || user.workplace_delegate.length === 0 || 
        !userLocation.value.lat || !userLocation.value.lng) {
        workplaceProximityStatus.value = [];
        return;
    }

    const proximityData = [];
    
    user.workplace_delegate.forEach((workplace) => {
        if (workplace.coordinate && workplace.coordinate.length == 2) {
            const [lng, lat] = workplace.coordinate;
            const radius = workplace.radius || 100;
            
            const distance = calculateDistance(
                userLocation.value.lat, 
                userLocation.value.lng, 
                lat, 
                lng
            );
            
            proximityData.push({
                name: workplace.name,
                distance: distance,
                radius: radius,
                isWithinRadius: distance <= radius,
                workplace: workplace
            });
        }
    });
    
    // Sort by distance (nearest first)
    proximityData.sort((a, b) => a.distance - b.distance);
    
    workplaceProximityStatus.value = proximityData;
};

const handleCheckOut = async () => {
    if (!userLocation.value.lat || !userLocation.value.lng) {
        $q.notify({
            type: 'negative',
            message: 'Location is required for check-out'
        });
        return;
    }

    // Check if user has workplace delegates
    if (!user?.workplace_delegate || user.workplace_delegate.length === 0) {
        $q.notify({
            type: 'negative',
            message: 'No workplace information available'
        });
        return;
    }

    // Check user proximity to workplace
    const proximityResult = checkUserProximity();
    
    if (proximityResult.error) {
        $q.notify({
            type: 'negative',
            message: proximityResult.error
        });
        return;
    }

    if (!proximityResult.nearestWorkplace) {
        $q.notify({
            type: 'negative',
            message: 'Workplace location data not available'
        });
        return;
    }

    // If user is outside radius, show confirmation dialog
    if (!proximityResult.isWithinRadius) {
        const confirmed = await showOutsideRadiusConfirmation(
            'check-out',
            proximityResult.minDistance,
            proximityResult.nearestWorkplace.name
        );
        
        if (!confirmed) {
            return; // User cancelled
        }
    }

    checkingOut.value = true;

    try {
        // Determine message based on location
        let checkOutMessage = '';
        if (proximityResult.isWithinRadius) {
            checkOutMessage = 'Successfully checked out within workplace radius!';
        } else {
            checkOutMessage = `Checked out outside radius (${Math.round(proximityResult.minDistance)}m away). Pending approval.`;
        }

        // Use real API call with nearest workplace
        await AttendanceApi.quickCheckOut(user._id, {
            coords: {
                longitude: userLocation.value.lng,
                latitude: userLocation.value.lat
            }
        });

        // Update local state
        attendanceStatus.value.checkedOut = true;
        attendanceStatus.value.checkOutTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        $q.notify({
            type: proximityResult.isWithinRadius ? 'positive' : 'warning',
            message: checkOutMessage,
            timeout: 4000
        });

    } catch (error) {
        console.error('Check-out failed:', error);
        $q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Check-out failed. Please try again.'
        });
    } finally {
        checkingOut.value = false;
    }
};

// Lifecycle
onMounted(async () => {
    // Start time updates
    updateTime();
    timeInterval.value = setInterval(updateTime, 1000);

    // Load workplace data first
    try {
        const workplaceIds = user?.workplace_delegate?.map(w => w._id) || [];
        if (workplaceIds.length > 0) {
            const workplaceData = await loadWorkplace(workplaceIds);
            // Update user.workplace_delegate with complete data including name, coordinate, radius
            user.workplace_delegate = workplaceData;
            console.log('Loaded workplace data:', workplaceData);
        }
    } catch (error) {
        console.error('Failed to load workplace data:', error);
        $q.notify({
            type: 'warning',
            message: 'Failed to load workplace information'
        });
    }
    
    // Get user location
    getCurrentLocation();
    
    // Load today's attendance data
    await loadTodayAttendance();
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

// Simple Elegant Time Display
.time-display-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
}

.time-display-content {
  color: white;
}

.time-text {
  font-size: 3rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.date-text {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.9;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
}

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
  height: 320px; // Increased to accommodate header
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.map-info-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(25, 118, 210, 0.9) !important;
}

.map-recenter-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
  }
  
  // Animation for the icon
  .q-icon {
    transition: transform 0.3s ease;
  }
  
  &:active .q-icon {
    transform: scale(0.95);
  }
}

.map-element {
  height: 100%;
  width: 100%;
}

// Custom map marker styles
:deep(.user-location-marker) {
  z-index: 1000 !important;
}

:deep(.workplace-marker) {
  z-index: 999 !important;
  
  div {
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
    }
  }
}

// Leaflet popup customization
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

:deep(.leaflet-popup-content) {
  margin: 12px 16px;
  font-family: inherit;
}

:deep(.leaflet-popup-tip) {
  border-top-color: white;
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
.history-btn {
  height: 45px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
  
  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.24);
    transform: translateY(-1px);
  }
}

.action-btn {
  height: 60px;
  border-radius: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  // Special styling for completed state
  &.q-btn--disabled {
    opacity: 0.7 !important;
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .map-container {
    height: 250px;
  }
  
  .map-recenter-btn {
    bottom: 12px !important;
    right: 12px !important;
    
    .q-btn__wrapper {
      min-width: 40px !important;
      min-height: 40px !important;
    }
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
  
  .history-btn {
    height: 40px;
  }
  
  // Responsive time display
  .time-text {
    font-size: 2.5rem !important;
  }
  
  .date-text {
    font-size: 0.9rem !important;
  }
}

@media (max-width: 360px) {
  .time-text {
    font-size: 2.2rem !important;
  }
  
  .date-text {
    font-size: 0.85rem !important;
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
  
  .history-btn {
    border-color: rgba(255, 255, 255, 0.24);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.4);
    }
  }
  
  // Simple dark mode time display
  .time-display-card {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    
    &:hover {
      box-shadow: 0 8px 25px rgba(44, 62, 80, 0.4);
    }
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