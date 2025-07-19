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
                    Attendance History
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="q-pa-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="text-center q-py-xl">
                    <q-spinner-dots size="lg" color="primary" />
                    <div class="text-body2 text-grey-6 q-mt-md">Loading attendance history...</div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="q-pa-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="text-center q-py-xl">
                    <q-icon name="error_outline" size="xl" color="negative" />
                    <div class="text-h6 text-negative q-mt-md">Error Loading Data</div>
                    <div class="text-body2 text-grey-6 q-mt-sm">{{ error }}</div>
                    <q-btn
                        flat
                        color="primary"
                        label="Retry"
                        @click="loadAttendanceHistory"
                        class="q-mt-md"
                    />
                </q-card-section>
            </q-card>
        </div>

        <!-- Attendance History List -->
        <div v-else class="q-pa-md">
            <!-- Summary Card -->
            <q-card class="rounded-xl shadow-2 q-mb-md" flat>
                <q-card-section>
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="analytics" class="q-mr-sm" />
                        Summary
                    </div>
                    
                    <div class="row q-col-gutter-md">
                        <div class="col-4">
                            <div class="text-center">
                                <div class="text-h5 text-weight-bold text-positive">{{ validCount }}</div>
                                <div class="text-caption text-grey-6">Valid</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="text-center">
                                <div class="text-h5 text-weight-bold text-warning">{{ pendingCount }}</div>
                                <div class="text-caption text-grey-6">Pending</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="text-center">
                                <div class="text-h5 text-weight-bold text-negative">{{ invalidCount }}</div>
                                <div class="text-caption text-grey-6">Invalid</div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>

            <!-- History List -->
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section>
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="history" class="q-mr-sm" />
                        Recent Attendance (Last 10)
                    </div>
                </q-card-section>

                <!-- Empty State -->
                <div v-if="attendanceHistory.length === 0" class="text-center q-py-xl">
                    <q-icon name="event_busy" size="xl" color="grey-5" />
                    <div class="text-h6 text-grey-5 q-mt-md">No Attendance Records</div>
                    <div class="text-body2 text-grey-6 q-mt-sm">Your attendance history will appear here</div>
                </div>

                <!-- Attendance Items -->
                <q-list v-else separator>
                    <q-item
                        v-for="(attendance, index) in attendanceHistory"
                        :key="attendance._id || index"
                        clickable
                        @click="openAttendanceDetail(attendance)"
                        class="attendance-item"
                    >
                        <q-item-section avatar>
                            <q-avatar size="md" :class="getStatusAvatarClass(attendance.status)">
                                <q-icon :name="getStatusIcon(attendance.status)" color="white" />
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label class="text-weight-medium">
                                {{ formatDate(attendance.checkin_date) }}
                            </q-item-label>
                            <q-item-label caption class="text-grey-6">
                                {{ getWorkplaceName(attendance.workplace_id) }}
                            </q-item-label>
                            <q-item-label caption>
                                <div class="row items-center q-gutter-xs q-mt-xs">
                                    <span v-if="attendance.checkin_date" class="time-badge">
                                        <q-icon name="login" size="xs" />
                                        {{ formatTime(attendance.checkin_date) }}
                                    </span>
                                    <span v-if="attendance.checkout_date" class="time-badge">
                                        <q-icon name="logout" size="xs" />
                                        {{ formatTime(attendance.checkout_date) }}
                                    </span>
                                </div>
                            </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <div class="column items-end">
                                <q-chip
                                    :color="getStatusColor(attendance.status)"
                                    text-color="white"
                                    size="sm"
                                    dense
                                >
                                    {{ getStatusLabel(attendance.status) }}
                                </q-chip>
                                <div class="text-caption text-grey-6 q-mt-xs">
                                    {{ getWorkingHours(attendance) }}
                                </div>
                            </div>
                        </q-item-section>

                        <q-item-section side>
                            <q-icon name="chevron_right" color="grey-4" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card>
        </div>

        <!-- Attendance Detail Dialog -->
        <q-dialog v-model="showDetailDialog" persistent>
            <q-card class="detail-dialog" style="width: 100%; max-width: 500px;">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6 text-weight-bold">Attendance Detail</div>
                    <q-space />
                    <q-btn icon="close" flat round dense @click="showDetailDialog = false" />
                </q-card-section>

                <q-card-section v-if="selectedAttendance">
                    <!-- Status Header -->
                    <div class="text-center q-mb-lg">
                        <q-avatar size="lg" :class="getStatusAvatarClass(selectedAttendance.status)">
                            <q-icon :name="getStatusIcon(selectedAttendance.status)" color="white" size="md" />
                        </q-avatar>
                        <div class="text-h6 text-weight-bold q-mt-sm">
                            {{ formatDate(selectedAttendance.checkin_date) }}
                        </div>
                        <q-chip
                            :color="getStatusColor(selectedAttendance.status)"
                            text-color="white"
                            size="md"
                            class="q-mt-xs"
                        >
                            {{ getStatusLabel(selectedAttendance.status) }}
                        </q-chip>
                    </div>

                    <!-- Details Grid -->
                    <div class="detail-grid">
                        <!-- Workplace -->
                        <div class="detail-item">
                            <q-icon name="business" color="accent" size="sm" />
                            <div class="detail-content">
                                <div class="detail-label">Workplace</div>
                                <div class="detail-value">{{ getWorkplaceName(selectedAttendance.workplace_id) }}</div>
                            </div>
                        </div>

                        <!-- Check In -->
                        <div class="detail-item" v-if="selectedAttendance.checkin_date">
                            <q-icon name="login" color="positive" size="sm" />
                            <div class="detail-content">
                                <div class="detail-label">Check In</div>
                                <div class="detail-value">
                                    {{ formatTime(selectedAttendance.checkin_date) }}
                                    <div class="text-caption text-grey-6">
                                        {{ formatDate(selectedAttendance.checkin_date) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Check Out -->
                        <div class="detail-item" v-if="selectedAttendance.checkout_date">
                            <q-icon name="logout" color="negative" size="sm" />
                            <div class="detail-content">
                                <div class="detail-label">Check Out</div>
                                <div class="detail-value">
                                    {{ formatTime(selectedAttendance.checkout_date) }}
                                    <div class="text-caption text-grey-6">
                                        {{ formatDate(selectedAttendance.checkout_date) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Working Hours -->
                        <div class="detail-item" v-if="selectedAttendance.checkout_date">
                            <q-icon name="schedule" color="info" size="sm" />
                            <div class="detail-content">
                                <div class="detail-label">Working Hours</div>
                                <div class="detail-value">{{ getWorkingHours(selectedAttendance) }}</div>
                            </div>
                        </div>

                        <!-- Location (if available) -->
                        <div class="detail-item" v-if="selectedAttendance.checkin_coordinate">
                            <q-icon name="location_on" color="warning" size="sm" />
                            <div class="detail-content">
                                <div class="detail-label">Check-in Location</div>
                                <div class="detail-value">
                                    {{ formatCoordinates(selectedAttendance.checkin_coordinate) }}
                                </div>
                            </div>
                        </div>

                        <!-- Notes (if available) -->
                        <div class="detail-item" v-if="selectedAttendance.notes">
                            <q-icon name="note" color="grey-6" size="sm" />
                            <div class="detail-content">
                                <div class="detail-label">Notes</div>
                                <div class="detail-value">{{ selectedAttendance.notes }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Message -->
                    <q-banner
                        v-if="getStatusMessage(selectedAttendance.status)"
                        :class="getStatusBannerClass(selectedAttendance.status)"
                        class="q-mt-md rounded-borders"
                    >
                        <template v-slot:avatar>
                            <q-icon :name="getStatusIcon(selectedAttendance.status)" />
                        </template>
                        {{ getStatusMessage(selectedAttendance.status) }}
                    </q-banner>
                </q-card-section>

                <q-card-actions align="right" class="q-pa-md">
                    <q-btn flat label="Close" color="primary" @click="showDetailDialog = false" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { AttendanceApi, WorkplaceApi } from 'src/api';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();

// Get user data
const user = authStore.user;

// Reactive data
const loading = ref(false);
const error = ref('');
const attendanceHistory = ref([]);
const workplaces = ref({});
const showDetailDialog = ref(false);
const selectedAttendance = ref(null);

// Computed properties for summary
const validCount = computed(() => 
    attendanceHistory.value.filter(a => a.status === 'valid').length
);

const pendingCount = computed(() => 
    attendanceHistory.value.filter(a => a.status === 'pending' || !a.status).length
);

const invalidCount = computed(() => 
    attendanceHistory.value.filter(a => a.status === 'invalid').length
);

// Methods
const loadAttendanceHistory = async () => {
    if (!user?._id) {
        error.value = 'User information not available';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        // Load attendance history (last 10 records)
        const response = await AttendanceApi.getAttendanceHistory(user._id, {
            limit: 10,
            sort: { checkin_date: -1 } // Most recent first
        });

        attendanceHistory.value = response.data || [];

        // Load workplace information for each attendance
        await loadWorkplaceInfo();

    } catch (err) {
        console.error('Error loading attendance history:', err);
        error.value = err.response?.data?.message || 'Failed to load attendance history';
    } finally {
        loading.value = false;
    }
};

const loadWorkplaceInfo = async () => {
    try {
        // Get unique workplace IDs
        const workplaceIds = [...new Set(
            attendanceHistory.value
                .map(a => a.workplace_id)
                .filter(id => id)
        )];

        if (workplaceIds.length === 0) return;

        // Load workplace data
        const { data } = await WorkplaceApi.getWorkplace({
            params: {
                filter: { _id: { $in: workplaceIds } },
                select: 'name address'
            }
        });

        // Create workplace lookup object
        const workplaceMap = {};
        (data || []).forEach(workplace => {
            workplaceMap[workplace._id] = workplace;
        });

        workplaces.value = workplaceMap;

    } catch (error) {
        console.error('Error loading workplace info:', error);
        // Don't show error to user, workplace names will just show as IDs
    }
};

const openAttendanceDetail = (attendance) => {
    selectedAttendance.value = attendance;
    showDetailDialog.value = true;
};

// Helper functions
const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return 'Invalid date';
    }
};

const formatTime = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch {
        return 'Invalid time';
    }
};

const formatCoordinates = (coordinate) => {
    if (!coordinate || !Array.isArray(coordinate) || coordinate.length < 2) {
        return 'Not available';
    }
    
    const [lng, lat] = coordinate;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

const getWorkplaceName = (workplaceId) => {
    if (!workplaceId) return 'Unknown Workplace';
    
    const workplace = workplaces.value[workplaceId];
    return workplace?.name || 'Unknown Workplace';
};

const getWorkingHours = (attendance) => {
    if (!attendance.checkin_date || !attendance.checkout_date) {
        return 'Incomplete';
    }
    
    try {
        const checkin = new Date(attendance.checkin_date);
        const checkout = new Date(attendance.checkout_date);
        const diffMs = checkout - checkin;
        const diffHours = diffMs / (1000 * 60 * 60);
        
        const hours = Math.floor(diffHours);
        const minutes = Math.floor((diffHours % 1) * 60);
        
        return `${hours}h ${minutes}m`;
    } catch {
        return 'Invalid';
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'valid': return 'positive';
        case 'invalid': return 'negative';
        case 'pending': return 'warning';
        default: return 'warning'; // Default to pending
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'valid': return 'check_circle';
        case 'invalid': return 'cancel';
        case 'pending': return 'schedule';
        default: return 'schedule';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'valid': return 'Valid';
        case 'invalid': return 'Invalid';
        case 'pending': return 'Pending';
        default: return 'Pending';
    }
};

const getStatusAvatarClass = (status) => {
    switch (status) {
        case 'valid': return 'bg-positive';
        case 'invalid': return 'bg-negative';
        case 'pending': return 'bg-warning';
        default: return 'bg-warning';
    }
};

const getStatusMessage = (status) => {
    switch (status) {
        case 'valid': 
            return 'This attendance record has been validated and approved.';
        case 'invalid': 
            return 'This attendance record has been rejected or marked as invalid.';
        case 'pending': 
            return 'This attendance record is pending review and approval.';
        default: 
            return 'This attendance record is pending review and approval.';
    }
};

const getStatusBannerClass = (status) => {
    switch (status) {
        case 'valid': return 'bg-positive text-white';
        case 'invalid': return 'bg-negative text-white';
        case 'pending': return 'bg-warning text-white';
        default: return 'bg-warning text-white';
    }
};

// Lifecycle
onMounted(() => {
    loadAttendanceHistory();
});
</script>

<style lang="scss" scoped>
// Background gradients
.bg-gradient-to-br {
  background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
}

.from-blue-50 { --gradient-from: #eff6ff; }
.to-indigo-100 { --gradient-to: #e0e7ff; }

// Attendance item styling
.attendance-item {
  border-radius: 8px;
  margin: 8px 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(25, 118, 210, 0.04);
    transform: translateX(4px);
  }
}

// Time badges
.time-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.7);
}

// Detail dialog styling
.detail-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.detail-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  
  .q-icon {
    margin-top: 2px;
    flex-shrink: 0;
  }
}

.detail-content {
  flex: 1;
}

.detail-label {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 2px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

// Card shadows
.shadow-2 {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// Status avatars
.bg-positive {
  background: var(--q-positive) !important;
}

.bg-negative {
  background: var(--q-negative) !important;
}

.bg-warning {
  background: var(--q-warning) !important;
}

// Responsive design
@media (max-width: 480px) {
  .detail-dialog {
    margin: 16px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .attendance-item {
    margin: 4px 0;
  }
}

// Dark mode support
.q-dark {
  .attendance-item {
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  .detail-item {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .detail-label {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .detail-value {
    color: rgba(255, 255, 255, 0.87);
  }
  
  .time-badge {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
