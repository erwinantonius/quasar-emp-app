<template>
    <q-page class="bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Back Button Header -->
        <div class="q-px-md q-pt-md q-pb-none">
            <div class="row items-center q-mb-xs">
                <q-btn 
                    flat 
                    round 
                    icon="arrow_back" 
                    color="grey-8" 
                    size="md"
                    @click="goBack"
                    class="q-mr-sm"
                >
                    <q-tooltip>Go Back</q-tooltip>
                </q-btn>
                <div class="text-h6 text-weight-bold text-grey-8">Profile</div>
            </div>
        </div>

        <!-- Header Profile Section -->
        <div class="q-px-md">
            <q-card class="profile-card rounded-xl shadow-4 overflow-hidden" flat>
                <!-- Background gradient -->
                <div class="profile-header bg-gradient-to-r from-primary to-secondary q-pa-lg text-white">
                    <div class="row items-center q-col-gutter-md">
                        <div class="col-auto">
                            <q-avatar size="64px" color="white" text-color="primary" class="shadow-3">
                                <q-img :src="avatarUrl" :alt="profile?.fullname || 'User Avatar'" />
                            </q-avatar>
                        </div>
                        <div class="col">
                            <div class="text-h6 text-weight-bold q-mb-xs">{{ profile?.fullname || profile?.first_name || 'User' }} {{ profile?.last_name || '' }}</div>
                            <div class="text-body2 opacity-80">{{ profile?.email || user?.email }}</div>
                            <div class="row items-center q-mt-xs">
                                <q-icon name="work" size="16px" class="q-mr-xs" />
                                <span class="text-body2">{{ profile?.position || 'No Position' }}</span>
                            </div>
                            <div class="row items-center q-mt-xs" v-if="profile?.workplace_delegate?.length">
                                <q-icon name="business" size="16px" class="q-mr-xs" />
                                <span class="text-body2">{{ profile.workplace_delegate[0]?.name || 'No Workplace' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Stats Cards -->
                <div class="q-pa-md bg-white">
                    <div class="row q-col-gutter-sm">
                        <div class="col-4">
                            <div class="stat-card text-center q-pa-sm rounded-lg bg-green-50">
                                <q-icon name="business" color="positive" size="md" />
                                <div class="text-h6 text-weight-bold text-positive q-mt-xs">{{ profile?.workplace_delegate?.length || 0 }}</div>
                                <div class="text-caption text-grey-7">Workplaces</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="stat-card text-center q-pa-sm rounded-lg bg-blue-50">
                                <q-icon name="schedule" color="info" size="md" />
                                <div class="text-h6 text-weight-bold text-info q-mt-xs">{{ userStats.todayAttendance || 0 }}</div>
                                <div class="text-caption text-grey-7">Attendance</div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="stat-card text-center q-pa-sm rounded-lg bg-orange-50">
                                <q-icon name="admin_panel_settings" color="warning" size="md" />
                                <div class="text-h6 text-weight-bold text-warning q-mt-xs">{{ profile?.roles?.length || 0 }}</div>
                                <div class="text-caption text-grey-7">Roles</div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card>
        </div>

        <!-- Profile Details -->
        <div class="q-px-md q-pb-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="q-pb-none">
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="account_box" class="q-mr-sm" />
                        Profile Information
                    </div>
                </q-card-section>
                
                <q-card-section class="q-pt-none">
                    <div class="row q-col-gutter-md">
                        <!-- Personal Info -->
                        <div class="col-12">
                            <div class="profile-info-grid">
                                <div class="profile-info-item">
                                    <q-icon name="person" color="primary" class="q-mr-sm" />
                                    <div>
                                        <div class="text-caption text-grey-6">Full Name</div>
                                        <div class="text-body2 text-weight-medium">{{ profile?.fullname || 'Not specified' }}</div>
                                    </div>
                                </div>
                                
                                <div class="profile-info-item">
                                    <q-icon name="work" color="secondary" class="q-mr-sm" />
                                    <div>
                                        <div class="text-caption text-grey-6">Position</div>
                                        <div class="text-body2 text-weight-medium">{{ profile?.position || 'Not specified' }}</div>
                                    </div>
                                </div>
                                
                                <div class="profile-info-item">
                                    <q-icon name="badge" color="info" class="q-mr-sm" />
                                    <div>
                                        <div class="text-caption text-grey-6">Contract Type</div>
                                        <div class="text-body2 text-weight-medium">{{ profile?.contract_type || 'Not specified' }}</div>
                                    </div>
                                </div>
                                
                                <div class="profile-info-item">
                                    <q-icon name="phone" color="positive" class="q-mr-sm" />
                                    <div>
                                        <div class="text-caption text-grey-6">Phone</div>
                                        <div class="text-body2 text-weight-medium">{{ profile?.phone || 'Not specified' }}</div>
                                    </div>
                                </div>
                                
                                <div class="profile-info-item" v-if="profile?.expired_date">
                                    <q-icon name="event" color="warning" class="q-mr-sm" />
                                    <div>
                                        <div class="text-caption text-grey-6">Contract Expires</div>
                                        <div class="text-body2 text-weight-medium">{{ formatDate(profile.expired_date) }}</div>
                                    </div>
                                </div>
                                
                                <div class="profile-info-item" v-if="profile?.roles?.length">
                                    <q-icon name="admin_panel_settings" color="purple" class="q-mr-sm" />
                                    <div>
                                        <div class="text-caption text-grey-6">Roles</div>
                                        <div class="text-body2 text-weight-medium">
                                            <q-chip 
                                                v-for="role in profile.roles" 
                                                :key="role" 
                                                size="sm" 
                                                color="primary" 
                                                text-color="white"
                                                class="q-mr-xs q-mb-xs"
                                            >
                                                {{ titleCase(role) }}
                                            </q-chip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Account Settings -->
        <div class="q-px-md q-pb-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="q-pb-none">
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="settings" class="q-mr-sm" />
                        Account Settings
                    </div>
                </q-card-section>
                
                <q-card-section class="q-pt-none">
                    <div class="row q-col-gutter-md">
                        <div class="col-6">
                            <q-card
                                class="setting-card rounded-lg shadow-1 overflow-hidden cursor-pointer"
                                flat
                                v-ripple
                                clickable
                                @click="editProfile"
                            >
                                <div class="q-pa-md text-center">
                                    <q-icon name="edit" color="primary" size="lg" class="q-mb-sm" />
                                    <div class="text-body1 text-weight-bold">Edit Profile</div>
                                    <div class="text-caption text-grey-6">Update personal information</div>
                                </div>
                            </q-card>
                        </div>
                        
                        <div class="col-6">
                            <q-card
                                class="setting-card rounded-lg shadow-1 overflow-hidden cursor-pointer"
                                flat
                                v-ripple
                                clickable
                                @click="changePassword"
                            >
                                <div class="q-pa-md text-center">
                                    <q-icon name="lock" color="secondary" size="lg" class="q-mb-sm" />
                                    <div class="text-body1 text-weight-bold">Change Password</div>
                                    <div class="text-caption text-grey-6">Update security credentials</div>
                                </div>
                            </q-card>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Additional Information -->
        <div class="q-px-md q-pb-xl">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="q-pb-none">
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="info" class="q-mr-sm" />
                        Additional Information
                    </div>
                </q-card-section>
                
                <q-card-section class="q-pt-none">
                    <div class="profile-info-grid">
                        <div class="profile-info-item">
                            <q-icon name="male" color="info" class="q-mr-sm" />
                            <div>
                                <div class="text-caption text-grey-6">Gender</div>
                                <div class="text-body2 text-weight-medium">{{ profile?.gender || 'Not specified' }}</div>
                            </div>
                        </div>
                        
                        <div class="profile-info-item">
                            <q-icon name="calendar_today" color="warning" class="q-mr-sm" />
                            <div>
                                <div class="text-caption text-grey-6">Created Date</div>
                                <div class="text-body2 text-weight-medium">{{ formatDate(profile?.created_at) }}</div>
                            </div>
                        </div>
                        
                        <div class="profile-info-item">
                            <q-icon name="update" color="positive" class="q-mr-sm" />
                            <div>
                                <div class="text-caption text-grey-6">Last Updated</div>
                                <div class="text-body2 text-weight-medium">{{ formatDate(profile?.updated_at) }}</div>
                            </div>
                        </div>
                        
                        <div class="profile-info-item" v-if="profile?.fcm_token">
                            <q-icon name="notifications" color="purple" class="q-mr-sm" />
                            <div>
                                <div class="text-caption text-grey-6">Notifications</div>
                                <div class="text-body2 text-weight-medium">Enabled</div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from 'stores/user';
import { useAuthStore } from 'stores/auth';
import { titleCase } from 'src/helpers';

const router = useRouter();
const $q = useQuasar();
const userStore = useUserStore();
const authStore = useAuthStore();

// Computed properties
const profile = computed(() => userStore.profile);
const user = computed(() => authStore.user);

// Reactive data
const userStats = ref({
    activeWorkplaces: 0,
    todayAttendance: 0,
    teamMembers: 0
});

// Methods
const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return 'Invalid date';
    }
};

const editProfile = () => {
    $q.notify({
        type: 'info',
        message: 'Edit profile feature coming soon...',
        timeout: 2000
    });
};

const changePassword = () => {
    $q.notify({
        type: 'info',
        message: 'Change password feature coming soon...',
        timeout: 2000
    });
};

const goBack = () => {
    router.back();
};

const fetchUserStats = async () => {
    try {
        // Use real data from profile where available
        const workplaceCount = profile.value?.workplace_delegate?.length || 0;
        const roleCount = profile.value?.roles?.length || 0;
        
        userStats.value = {
            activeWorkplaces: workplaceCount,
            todayAttendance: Math.floor(Math.random() * 8) + 1, // Still simulated
            teamMembers: roleCount
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
    }
};

const initializeProfile = async () => {
    $q.loading.show();
    try {
        await fetchUserStats();
    } catch (error) {
        console.error('Error initializing profile:', error);
        $q.notify({
            type: 'negative',
            message: 'Failed to load profile data'
        });
    } finally {
        $q.loading.hide();
    }
};

// Computed avatar URL using Dicebear API
const avatarUrl = computed(() => {
  if (profile.value) {
    const fullName = `${profile.value.first_name || ''} ${profile.value.last_name || ''}`.trim();
    const seed = encodeURIComponent(fullName || profile.value.email || 'default');
    return profile.value.photo || `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}&size=200`;
  }
  return '';
});

// Lifecycle
onMounted(() => {
    initializeProfile();
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

// Profile card styling
.profile-card {
  overflow: hidden;
  border-radius: 16px !important;
}

.profile-header {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: white;
    border-radius: 20px 20px 0 0;
  }
}

// Stat cards
.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

// Setting cards
.setting-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

// Profile info styling
.profile-info-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

.profile-info-item {
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

// Responsive adjustments
@media (max-width: 480px) {
  .profile-header {
    .q-avatar {
      width: 48px !important;
      height: 48px !important;
    }
    
    .text-h6 {
      font-size: 1.1rem;
    }
  }
  
  .stat-card {
    padding: 8px !important;
    
    .q-icon {
      font-size: 1.2rem !important;
    }
    
    .text-h6 {
      font-size: 1rem;
    }
  }
  
  .profile-info-item {
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
}

// Dark mode support
.q-dark {
  .profile-card {
    background: var(--q-dark-page);
  }
  
  .stat-card {
    background: var(--q-dark-page) !important;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .setting-card {
    background: var(--q-dark-page) !important;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .profile-info-item {
    background: rgba(255, 255, 255, 0.05) !important;
    
    &:hover {
      background: rgba(255, 255, 255, 0.08) !important;
    }
  }
}

// Card shadows
.shadow-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.shadow-2 {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shadow-3 {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shadow-4 {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
</style>
