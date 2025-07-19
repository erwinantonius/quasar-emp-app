<template>
    <q-page class="bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Profile Summary Header -->
        <div class="q-pa-md">
            <q-card class="profile-summary rounded-xl shadow-2 overflow-hidden" flat>
                <div class="profile-header bg-gradient-to-r from-primary to-secondary q-pa-md text-white">
                    <div class="row items-center justify-between">
                        <div class="row items-center">
                            <q-avatar 
                                size="48px" 
                                color="white" 
                                text-color="primary" 
                                class="q-mr-md cursor-pointer avatar-clickable"
                                @click="goToProfile"
                                v-ripple
                            >
                                <q-img :src="avatarUrl" :alt="profile?.fullname || 'User Avatar'" />
                                <q-tooltip>View Profile</q-tooltip>
                            </q-avatar>
                            <div>
                                <div class="text-h6 text-weight-bold">Howdy, {{ profile?.first_name || 'User' }}!</div>
                                <div class="text-body2 opacity-80">Position: {{ profile?.position || 'Position' }}</div>
                                <div class="text-caption opacity-70" v-if="tenantInfo">
                                    <q-icon name="business" size="xs" class="q-mr-xs" />
                                    {{ tenantInfo.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card>
        </div>

        <!-- Today's Summary -->
        <div class="q-px-md q-pb-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="q-pb-none">
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="today" class="q-mr-sm" />
                        Today's Summary
                    </div>
                </q-card-section>
                
                <q-card-section class="q-pt-none">
                    <div class="row q-col-gutter-md">
                        <!-- Check-in Status -->
                        <div class="col-6">
                            <div class="summary-item q-pa-md rounded-lg" :class="todaySummary.checkedIn ? 'bg-green-50 border-left-positive' : 'bg-grey-50 border-left-grey'">
                                <div class="row items-center">
                                    <q-icon :name="todaySummary.checkedIn ? 'login' : 'schedule'" 
                                            :color="todaySummary.checkedIn ? 'positive' : 'grey'" 
                                            size="sm" class="q-mr-sm" />
                                    <div>
                                        <div class="text-body2 text-weight-medium">Check-in</div>
                                        <div class="text-caption" :class="todaySummary.checkedIn ? 'text-positive' : 'text-grey-6'">
                                            {{ todaySummary.checkInTime || 'Not checked in' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Working Hours -->
                        <div class="col-6">
                            <div class="summary-item q-pa-md rounded-lg bg-blue-50 border-left-info">
                                <div class="row items-center">
                                    <q-icon name="schedule" color="info" size="sm" class="q-mr-sm" />
                                    <div>
                                        <div class="text-body2 text-weight-medium">Hours</div>
                                        <div class="text-caption text-grey-6">{{ todaySummary.workingHours || '0h 0m' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Quick Actions Menu -->
        <div class="q-px-md q-pb-md">
            <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                <q-icon name="flash_on" class="q-mr-sm" />
                Quick Actions
            </div>
            
            <div v-if="myMenu.length">
                <div v-for="(menu, i) in myMenu" :key="i" class="q-mb-lg">
                    <div class="text-subtitle1 text-weight-medium text-grey-7 q-mb-md q-ml-sm">
                        {{ titleCase(menu.key) }}
                    </div>
                    <div class="row q-col-gutter-md">
                        <div class="col-6" v-for="(item, j) in menu.value" :key="j">
                            <q-card
                                class="action-card rounded-xl shadow-2 overflow-hidden"
                                style="height: 120px"
                                flat
                                v-ripple
                                clickable
                                @click="navigateToAction(item)"
                            >
                                <div class="action-gradient q-pa-md text-white" :class="getCardGradient(j)">
                                    <div class="row items-center justify-between full-height">
                                        <div>
                                            <q-icon :name="item.icon" size="md" class="q-mb-sm" />
                                            <div class="text-body1 text-weight-bold">{{ item.title }}</div>
                                        </div>
                                    </div>
                                </div>
                            </q-card>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center q-py-xl">
                <q-icon name="desktop_windows" size="xl" color="grey-4" />
                <div class="text-h6 text-grey-5 q-mt-md">Desktop Only</div>
                <div class="text-body2 text-grey-5">Please use desktop version for full access</div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="q-px-md q-pb-xl">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section>
                    <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">
                        <q-icon name="history" class="q-mr-sm" />
                        Recent Activity
                    </div>
                    
                    <div v-if="recentActivities.length" class="q-gutter-sm">
                        <div v-for="(activity, index) in recentActivities" :key="index" 
                             class="activity-item q-pa-sm rounded-lg bg-grey-50">
                            <div class="row items-center">
                                <q-icon :name="activity.icon" :color="activity.color" class="q-mr-md" />
                                <div class="col">
                                    <div class="text-body2">{{ activity.title }}</div>
                                    <div class="text-caption text-grey-6">{{ activity.time }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center q-py-md">
                        <q-icon name="inbox" size="lg" color="grey-4" />
                        <div class="text-body2 text-grey-5 q-mt-sm">No recent activity</div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from 'stores/user';
import { useAuthStore } from 'stores/auth';
import { menu_mobile } from 'src/config/menus.js';
import { groupArray, titleCase } from 'src/helpers';
import { TenantApi, AttendanceApi } from 'src/api';

const router = useRouter();
const $q = useQuasar();
const userStore = useUserStore();
const authStore = useAuthStore();
// Computed properties
const profile = computed(() => userStore.profile);
const user = computed(() => authStore.user);

// Reactive data
const tenantInfo = ref(null);
const userStats = ref({
    activeWorkplaces: 0,
    todayAttendance: 0,
    teamMembers: 0
});

const todaySummary = ref({
    checkedIn: false,
    checkInTime: null,
    workingHours: '0h 0m'
});

const attendanceRefreshInterval = ref(null);

const recentActivities = ref([
    {
        icon: 'login',
        color: 'positive',
        title: 'Profile updated successfully',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    },
    {
        icon: 'admin_panel_settings',
        color: 'info',
        title: `Role: ${profile.value?.roles?.[0] || 'superadmin'} access granted`,
        time: 'Today'
    },
    {
        icon: 'business',
        color: 'warning',
        title: `Workplace: ${profile.value?.workplace_delegate?.[0]?.name || 'Head Office'}`,
        time: 'Active'
    }
]);



const myMenu = computed(() =>
    groupArray(
        menu_mobile
            .map((m) => {
                user.value?.roles?.map((n) => {
                    if (m.roles && m.roles.includes(n)) m.allow = true;
                });
                //if roles empty
                if (!(m.roles ?? []).length || !m.roles) m.allow = true;
                //if roles all
                if (m.roles && m.roles.includes('all')) m.allow = true;

                //if have children
                if (m?.children?.length) {
                    m.children = (m.children ?? [])
                        .map((c) => {
                            user.value?.roles?.map((n) => {
                                if (c.roles && c.roles.includes(n)) c.allow = true;
                            });
                            //if roles empty
                            if (!(c.roles ?? []).length || !c.roles) c.allow = true;
                            //if roles all
                            if (c.roles && c.roles.includes('all')) c.allow = true;
                            return c;
                        })
                        .filter((f) => f.allow);
                }
                return m;
            })
            .filter((f) => f.allow),
        'group',
    ),
);

// Methods
const getCardGradient = (index) => {
    const gradients = [
        'bg-gradient-to-br from-blue-500 to-blue-600',
        'bg-gradient-to-br from-green-500 to-green-600',
        'bg-gradient-to-br from-purple-500 to-purple-600',
        'bg-gradient-to-br from-orange-500 to-orange-600',
        'bg-gradient-to-br from-red-500 to-red-600',
        'bg-gradient-to-br from-indigo-500 to-indigo-600'
    ];
    return gradients[index % gradients.length];
};

const navigateToAction = (item) => {
    $q.notify({
        type: 'positive',
        message: `Opening ${item.title}...`,
        timeout: 1000
    });
    
    if (item.path) {
        router.push({ path: item.path });
    }
};

const goToProfile = () => {
    router.push('/profile');
};

const fetchTenantInfo = async () => {
    console.log('Fetching tenant info...');
    console.log(profile.value);
    try {
        if (profile.value?.tenant) {
            const { data } = await TenantApi.getTenantById(profile.value.tenant);
            if (data) {
                tenantInfo.value = data;
                return;
            }
        }
    } catch (error) {
        console.error('Error fetching tenant info:', error);
    }
};

const fetchTodayAttendance = async () => {
    try {
        // Get the first workplace delegate or fallback
        const workplace = user.value?.workplace_delegate?.[0] || user.value?.workplace;
        
        if (!user.value?._id || !workplace?._id) {
            console.log('User or workplace data not available for attendance fetch');
            return;
        }

        const response = await AttendanceApi.getTodayAttendance(user.value._id, workplace._id);
        const todayAttendance = response.data;
        
        if (todayAttendance) {
            let workingHours = '0h 0m';
            
            // Calculate working hours if both check-in and check-out exist
            if (todayAttendance.checkin_date && todayAttendance.checkout_date) {
                const checkinTime = new Date(todayAttendance.checkin_date);
                const checkoutTime = new Date(todayAttendance.checkout_date);
                const diffMs = checkoutTime - checkinTime;
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                workingHours = `${hours}h ${minutes}m`;
            } else if (todayAttendance.checkin_date) {
                // Calculate current working hours if only checked in
                const checkinTime = new Date(todayAttendance.checkin_date);
                const now = new Date();
                const diffMs = now - checkinTime;
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                workingHours = `${hours}h ${minutes}m`;
            }
            
            todaySummary.value = {
                checkedIn: !!todayAttendance.checkin_date,
                checkInTime: todayAttendance.checkin_date ? 
                    new Date(todayAttendance.checkin_date).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                    }) : null,
                workingHours: workingHours
            };
        } else {
            // No attendance record for today
            todaySummary.value = {
                checkedIn: false,
                checkInTime: null,
                workingHours: '0h 0m'
            };
        }
    } catch (error) {
        console.log('Failed to fetch today attendance:', error);
        // If API fails, keep default values
        todaySummary.value = {
            checkedIn: false,
            checkInTime: null,
            workingHours: '0h 0m'
        };
    }
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

        // Fetch real attendance data
        await fetchTodayAttendance();

        // Update recent activities with profile and attendance data
        const recentActivitiesData = [
            {
                icon: 'person',
                color: 'positive',
                title: `Welcome ${profile.value?.first_name || 'User'}!`,
                time: 'Just now'
            },
            {
                icon: 'admin_panel_settings',
                color: 'info',
                title: `${titleCase(profile.value?.roles?.[0] || 'user')} privileges active`,
                time: 'Today'
            }
        ];

        // Add attendance activity if user has checked in today
        if (todaySummary.value.checkedIn) {
            recentActivitiesData.unshift({
                icon: 'login',
                color: 'positive',
                title: `Checked in at ${todaySummary.value.checkInTime}`,
                time: 'Today'
            });
        }

        // Add workplace info
        if (profile.value?.workplace_delegate?.[0]?.name) {
            recentActivitiesData.push({
                icon: 'business',
                color: 'warning',
                title: profile.value.workplace_delegate[0].name,
                time: 'Active workplace'
            });
        }

        // Add tenant info
        if (tenantInfo.value?.name) {
            recentActivitiesData.push({
                icon: 'apartment',
                color: 'info',
                title: `Organization: ${tenantInfo.value.name}`,
                time: 'Current'
            });
        }

        recentActivities.value = recentActivitiesData;
    } catch (error) {
        console.error('Error fetching user stats:', error);
    }
};

const initializeDashboard = async () => {
    $q.loading.show();
    try {
        await userStore.whoAmI();
        await Promise.all([
            fetchTenantInfo(),
            fetchUserStats()
        ]);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        $q.notify({
            type: 'negative',
            message: 'Failed to load dashboard data'
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
    initializeDashboard();
    
    // Set up auto-refresh for attendance data every 5 minutes
    attendanceRefreshInterval.value = setInterval(() => {
        fetchTodayAttendance();
    }, 5 * 60 * 1000); // 5 minutes
});

onUnmounted(() => {
    if (attendanceRefreshInterval.value) {
        clearInterval(attendanceRefreshInterval.value);
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

// Profile summary styling
.profile-summary {
  overflow: hidden;
  border-radius: 16px !important;
}

.profile-header {
  position: relative;
}

// Avatar clickable styling
.avatar-clickable {
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: scale(0.98);
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

// Summary items
.summary-item {
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  
  &.border-left-positive {
    border-left-color: var(--q-positive);
  }
  
  &.border-left-negative {
    border-left-color: var(--q-negative);
  }
  
  &.border-left-info {
    border-left-color: var(--q-info);
  }
  
  &.border-left-grey {
    border-left-color: var(--q-grey-5);
  }
}

// Action cards
.action-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(-2px);
  }
}

.action-gradient {
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: rotate(45deg);
  }
}

// Gradient backgrounds for action cards
.bg-gradient-to-br.from-blue-500 {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.bg-gradient-to-br.from-green-500 {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bg-gradient-to-br.from-purple-500 {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.bg-gradient-to-br.from-orange-500 {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.bg-gradient-to-br.from-red-500 {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.bg-gradient-to-br.from-indigo-500 {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

// Activity items
.activity-item {
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc !important;
    transform: translateX(4px);
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .profile-header {
    .q-avatar {
      width: 40px !important;
      height: 40px !important;
    }
    
    .text-h6 {
      font-size: 1rem;
    }
  }
  
  .action-card {
    height: 100px !important;
  }
}

// Dark mode support
.q-dark {
  .profile-summary {
    background: var(--q-dark-page);
  }
  
  .activity-item {
    background: var(--q-dark-page) !important;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05) !important;
    }
  }
}

// Animation classes
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Card shadows
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
