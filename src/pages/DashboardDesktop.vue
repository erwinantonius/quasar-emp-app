<template>
  <q-page padding class="dashboard-page">
    <!-- Welcome Header -->
    <div class="welcome-header q-mb-lg">
      <div class="row items-center">
        <div class="col">
          <h4 class="welcome-title q-ma-none">
            Welcome back, {{ userProfile?.first_name || 'User' }}! 👋
          </h4>
          <p class="welcome-subtitle text-white q-mb-none">
            Here's what's happening with your account today
          </p>
        </div>
        <div class="col-auto">
          <q-btn 
            round 
            color="primary" 
            icon="refresh" 
            @click="initializeDashboard"
            :loading="Object.values(loading).some(l => l)"
          >
            <q-tooltip>Refresh Dashboard</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- User Profile Card -->
      <div class="col-12">
        <q-card class="gradient-card user-card">
          <q-card-section class="card-header gradient-primary text-white">
            <div class="row items-center">
              <q-icon name="person" size="24px" class="q-mr-sm" />
              <div class="text-h6">User Profile</div>
            </div>
          </q-card-section>
          <q-card-section class="card-content">
            <div v-if="loading.profile" class="loading-state">
              <q-spinner-orbit color="primary" size="3em" />
              <div class="text-center q-mt-md text-grey-6">Loading profile...</div>
            </div>
            <div v-else-if="userProfile" class="profile-content">
              <div class="profile-header">
                <q-avatar size="60px" class="profile-avatar">
                  <q-img
                    :src="avatarUrl"
                    class="avatar-image"
                    fit="cover"
                    loading="lazy"
                  >
                    <template v-slot:loading>
                      <div class="avatar-gradient">
                        <q-spinner color="white" size="2em" />
                      </div>
                    </template>
                    <template v-slot:error>
                      <div class="avatar-gradient">
                        <span class="avatar-text">
                          {{ userProfile.first_name?.[0] }}{{ userProfile.last_name?.[0] }}
                        </span>
                      </div>
                    </template>
                  </q-img>
                </q-avatar>
                <div class="profile-info">
                  <div class="profile-name">{{ userProfile.first_name }} {{ userProfile.last_name }}</div>
                  <div class="profile-email">{{ userProfile.email }}</div>
                </div>
              </div>
              
              <q-separator class="elegant-separator" />
              
              <div class="profile-details">
                <div class="detail-grid">
                  <div class="detail-item">
                    <q-icon name="work" class="detail-icon" />
                    <div>
                      <div class="detail-label">Position</div>
                      <div class="detail-value">{{ userProfile.position || 'Not specified' }}</div>
                    </div>
                  </div>
                  <div class="detail-item">
                    <q-icon name="assignment" class="detail-icon" />
                    <div>
                      <div class="detail-label">Contract Type</div>
                      <div class="detail-value">{{ userProfile.contract_type || 'Not specified' }}</div>
                    </div>
                  </div>
                  <div class="detail-item">
                    <q-icon name="phone" class="detail-icon" />
                    <div>
                      <div class="detail-label">Phone</div>
                      <div class="detail-value">{{ userProfile.phone || 'Not provided' }}</div>
                    </div>
                  </div>
                  <div class="detail-item">
                    <q-icon name="person_outline" class="detail-icon" />
                    <div>
                      <div class="detail-label">Gender</div>
                      <div class="detail-value">{{ userProfile.gender || 'Not specified' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <q-separator class="elegant-separator" />
              
              <div class="roles-section">
                <div class="roles-label">
                  <q-icon name="security" class="q-mr-xs" />
                  Roles & Permissions
                </div>
                <div class="roles-chips">
                  <q-chip 
                    v-for="role in userProfile.roles" 
                    :key="role" 
                    :label="role"
                    color="primary"
                    text-color="white"
                    class="role-chip"
                    icon="verified_user"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tenant Info Card -->
      <div class="col-12">
        <q-card class="gradient-card tenant-card">
          <q-card-section class="card-header gradient-secondary text-white">
            <div class="row items-center">
              <q-icon name="business" size="24px" class="q-mr-sm" />
              <div class="text-h6">Tenant Information</div>
            </div>
          </q-card-section>
          <q-card-section class="card-content">
            <div v-if="loading.tenant" class="loading-state">
              <q-spinner-orbit color="secondary" size="3em" />
              <div class="text-center q-mt-md text-grey-6">Loading tenant info...</div>
            </div>
            <div v-else-if="tenantInfo" class="tenant-content">
              <div class="tenant-header">
                <div class="tenant-logo">
                  <q-img
                    v-if="tenantInfo.logo_icon"
                    :src="tenantInfo.logo_icon"
                    class="logo-image"
                    fit="cover"
                  >
                    <template v-slot:error>
                      <div class="logo-fallback">
                        <q-icon name="business" size="40px" />
                      </div>
                    </template>
                  </q-img>
                  <div v-else class="logo-fallback">
                    <q-icon name="business" size="40px" />
                  </div>
                </div>
                <div class="tenant-info">
                  <div class="tenant-name">{{ tenantInfo.name }}</div>
                  <div class="tenant-email">{{ tenantInfo.contact_email || 'No contact email' }}</div>
                </div>
              </div>
              
              <q-separator class="elegant-separator" />
              
              <div class="tenant-details">
                <div class="detail-grid">
                  <div class="detail-item">
                    <q-icon name="people" class="detail-icon" />
                    <div>
                      <div class="detail-label">User Seats</div>
                      <div class="detail-value">{{ tenantInfo.user_seat || 'Unlimited' }}</div>
                    </div>
                  </div>
                  <div class="detail-item">
                    <q-icon name="payment" class="detail-icon" />
                    <div>
                      <div class="detail-label">Payment Method</div>
                      <div class="detail-value">{{ tenantInfo.payment_method || 'Not specified' }}</div>
                    </div>
                  </div>
                  <div class="detail-item full-width">
                    <q-icon name="location_on" class="detail-icon" />
                    <div>
                      <div class="detail-label">Address</div>
                      <div class="detail-value">{{ tenantInfo.address || 'No address provided' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Current Workplace Card -->
      <div class="col-12">
        <q-card class="gradient-card workplace-card">
          <q-card-section class="card-header gradient-info text-white">
            <div class="row items-center">
              <q-icon name="work" size="24px" class="q-mr-sm" />
              <div class="text-h6">Current Workplace</div>
            </div>
          </q-card-section>
          <q-card-section class="card-content">
            <div v-if="loading.workplace" class="loading-state">
              <q-spinner-orbit color="info" size="3em" />
              <div class="text-center q-mt-md text-grey-6">Loading workplace...</div>
            </div>
            <div v-else-if="currentWorkplace" class="workplace-content">
              <div class="workplace-header">
                <div class="workplace-name">{{ currentWorkplace.name }}</div>
                <div class="workplace-code">{{ currentWorkplace.code }}</div>
              </div>
              
              <q-separator class="elegant-separator" />
              
              <div class="workplace-details">
                <div class="detail-grid">
                  <div class="detail-item">
                    <q-icon name="category" class="detail-icon" />
                    <div>
                      <div class="detail-label">Type</div>
                      <div class="detail-value">{{ currentWorkplace.type || 'Not specified' }}</div>
                    </div>
                  </div>
                  <div class="detail-item">
                    <q-icon name="contact_phone" class="detail-icon" />
                    <div>
                      <div class="detail-label">Contact</div>
                      <div class="detail-value">{{ currentWorkplace.contact_name || 'No contact' }}</div>
                    </div>
                  </div>
                  <div class="detail-item full-width">
                    <q-icon name="location_on" class="detail-icon" />
                    <div>
                      <div class="detail-label">Address</div>
                      <div class="detail-value">{{ currentWorkplace.address || 'No address' }}</div>
                    </div>
                  </div>
                  <div class="detail-item full-width">
                    <q-icon name="phone" class="detail-icon" />
                    <div>
                      <div class="detail-label">Phone</div>
                      <div class="detail-value">{{ currentWorkplace.contact_phone || 'No phone' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <div class="empty-icon">
                <q-icon name="business_center" size="4em" />
              </div>
              <div class="empty-title">No Current Workplace</div>
              <div class="empty-subtitle">You haven't been assigned to any workplace yet</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Workplace Delegates Card -->
      <div class="col-12">
        <q-card class="gradient-card delegates-card">
          <q-card-section class="card-header gradient-warning text-white">
            <div class="row items-center">
              <q-icon name="supervisor_account" size="24px" class="q-mr-sm" />
              <div class="text-h6">Workplace Delegates</div>
            </div>
          </q-card-section>
          <q-card-section class="card-content">
            <div v-if="loading.delegates" class="loading-state">
              <q-spinner-orbit color="warning" size="3em" />
              <div class="text-center q-mt-md text-grey-6">Loading delegates...</div>
            </div>
            <div v-else-if="workplaceDelegates.length > 0" class="delegates-content">
              <div class="delegates-list">
                <div 
                  v-for="(workplace, index) in workplaceDelegates" 
                  :key="workplace._id"
                  class="delegate-item"
                  :class="{ 'with-separator': index < workplaceDelegates.length - 1 }"
                >
                  <div class="delegate-info">
                    <div class="delegate-icon">
                      <q-icon name="business" />
                    </div>
                    <div class="delegate-details">
                      <div class="delegate-name">{{ workplace.name }}</div>
                      <div class="delegate-code">{{ workplace.code }}</div>
                    </div>
                  </div>
                  <div class="delegate-type">
                    <q-chip 
                      dense 
                      :color="workplace.type === 'head_office' ? 'primary' : 'secondary'"
                      text-color="white"
                      :label="workplace.type?.replace('_', ' ') || 'branch'"
                      class="type-chip"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <div class="empty-icon">
                <q-icon name="work_off" size="4em" />
              </div>
              <div class="empty-title">No Delegate Access</div>
              <div class="empty-subtitle">You don't have delegate access to any workplaces</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Summary Stats -->
      <div class="col-12">
        <q-card class="gradient-card stats-card">
          <q-card-section class="card-header gradient-dark text-white">
            <div class="row items-center">
              <q-icon name="analytics" size="24px" class="q-mr-sm" />
              <div class="text-h6">Dashboard Summary</div>
            </div>
          </q-card-section>
          <q-card-section class="card-content">
            <div class="stats-grid">
              <div class="stat-item stat-blue">
                <div class="stat-icon">
                  <q-icon name="business" size="2.5em" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ stats.totalWorkplaces }}</div>
                  <div class="stat-label">Total Workplaces</div>
                </div>
              </div>
              <div class="stat-item stat-orange">
                <div class="stat-icon">
                  <q-icon name="admin_panel_settings" size="2.5em" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ userProfile?.roles?.length || 0 }}</div>
                  <div class="stat-label">Active Roles</div>
                </div>
              </div>
              <div class="stat-item stat-purple">
                <div class="stat-icon">
                  <q-icon name="verified_user" size="2.5em" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">Active</div>
                  <div class="stat-label">Account Status</div>
                </div>
              </div>
              <div class="stat-item stat-green">
                <div class="stat-icon">
                  <q-icon name="schedule" size="2.5em" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ new Date().toLocaleDateString() }}</div>
                  <div class="stat-label">Last Login</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from 'stores/auth';
import { UserApi, TenantApi, WorkplaceApi } from 'src/api';

const authStore = useAuthStore();

// Reactive data
const userProfile = ref(null);
const tenantInfo = ref(null);
const currentWorkplace = ref(null);
const workplaceDelegates = ref([]);

// Loading states
const loading = ref({
  profile: false,
  tenant: false,
  workplace: false,
  delegates: false
});

// Computed stats
const stats = computed(() => ({
  totalWorkplaces: workplaceDelegates.value.length,
  currentWorkplace: currentWorkplace.value ? 1 : 0,
  activeRoles: userProfile.value?.roles?.length || 0
}));

// Computed avatar URL using Dicebear API
const avatarUrl = computed(() => {
  if (userProfile.value) {
    const fullName = `${userProfile.value.first_name || ''} ${userProfile.value.last_name || ''}`.trim();
    const seed = encodeURIComponent(fullName || userProfile.value.email || 'default');
    return userProfile.value.photo || `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}&size=200`;
  }
  return '';
});

// Fetch user profile
const fetchUserProfile = async () => {
  loading.value.profile = true;
  try {
    const userId = authStore.user?._id;
    if (userId) {
      const response = await UserApi.getById(userId);
      if (response && response.data) {
        userProfile.value = response.data;
      }
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  } finally {
    loading.value.profile = false;
  }
};

// Fetch tenant information
const fetchTenantInfo = async () => {
  loading.value.tenant = true;
  try {
    const tenant = authStore.user?.tenant;
    if (tenant) {
      const response = await TenantApi.getTenantById(tenant._id);
      if (response && response.data) {
        tenantInfo.value = response.data;
      }
    }
  } catch (error) {
    console.error('Error fetching tenant info:', error);
  } finally {
    loading.value.tenant = false;
  }
};

// Fetch current workplace
const fetchCurrentWorkplace = async () => {
  loading.value.workplace = true;
  try {
    const workplace = authStore.user?.workplace;
    if (workplace) {
      const response = await WorkplaceApi.getWorkplaceById(workplace._id);
      if (response && response.data) {
        currentWorkplace.value = response.data;
      }
    }
  } catch (error) {
    console.error('Error fetching current workplace:', error);
  } finally {
    loading.value.workplace = false;
  }
};

// Fetch workplace delegates
const fetchWorkplaceDelegates = async () => {
  loading.value.delegates = true;
  try {
    const workplace_delegate = authStore.user?.workplace_delegate;
    if (workplace_delegate && workplace_delegate.length > 0) {
      // Get workplaces where user is a delegate
      const response = await WorkplaceApi.getWorkplace({
        params: {
          filter: {
            _id: { $in: workplace_delegate.flatMap(m=>m._id) },
            deleted: { $ne: true }
          },
          sort: 'name'
        }
      });
      if (response && response.data) {
        workplaceDelegates.value = response.data;
      }
    }
  } catch (error) {
    console.error('Error fetching workplace delegates:', error);
  } finally {
    loading.value.delegates = false;
  }
};

// Initialize dashboard
const initializeDashboard = async () => {
  await Promise.all([
    fetchUserProfile(),
    fetchTenantInfo(),
    fetchCurrentWorkplace(),
    fetchWorkplaceDelegates()
  ]);
};

onMounted(() => {
  initializeDashboard();
});
</script>

<style scoped>
/* Dashboard Page Styling */
.dashboard-page {
  /* background: linear-gradient(135deg, #f1faee 0%, #a8dadc 100%); */
  min-height: 100vh;
}

/* Welcome Header */
.welcome-header {
  background: linear-gradient(135deg, #1d3557 0%, #457b9d 100%);
  border-radius: 12px;
  padding: 16px 20px;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 6px 24px rgba(29, 53, 87, 0.3);
}

.welcome-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.welcome-subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

/* Gradient Cards */
.gradient-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border: none;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

/* Card Headers */
.card-header {
  padding: 16px 20px;
  font-weight: 600;
}

.gradient-primary {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

.gradient-info {
  background: linear-gradient(135deg, #457b9d 0%, #a8dadc 100%);
}

.gradient-warning {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

.gradient-dark {
  background: linear-gradient(135deg, #1d3557 0%, #457b9d 100%);
}

/* Card Content */
.card-content {
  padding: 16px 20px;
}

/* Loading States */
.loading-state {
  text-align: center;
  padding: 24px 16px;
}

/* User Profile */
.profile-content {
  animation: slideInLeft 0.5s ease-out;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.profile-avatar {
  margin-right: 16px;
  box-shadow: 0 6px 16px rgba(230, 57, 70, 0.3);
  border: 2px solid white;
  background: white;
}

.avatar-image {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}

.avatar-gradient {
  background: linear-gradient(135deg, #e63946 0%, #457b9d 100%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.avatar-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1d3557;
  margin-bottom: 2px;
}

.profile-email {
  color: #457b9d;
  font-size: 0.9rem;
}

/* Detail Grid */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, #f1faee 0%, #a8dadc 100%);
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.detail-item:hover {
  transform: translateX(4px);
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-icon {
  color: #e63946;
  margin-right: 10px;
  font-size: 1.1rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #457b9d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 0.9rem;
  color: #1d3557;
  font-weight: 500;
}

/* Elegant Separator */
.elegant-separator {
  margin: 16px 0;
  background: linear-gradient(90deg, transparent, #a8dadc, transparent);
  height: 1px;
  border: none;
}

/* Roles Section */
.roles-section {
  margin-top: 12px;
}

.roles-label {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #457b9d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.roles-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.role-chip {
  background: linear-gradient(135deg, #e63946 0%, #457b9d 100%);
  animation: bounceIn 0.5s ease-out;
}

/* Tenant Card */
.tenant-content {
  animation: slideInRight 0.5s ease-out;
}

.tenant-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.tenant-logo {
  margin-right: 16px;
}

.logo-image,
.logo-fallback {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.logo-fallback {
  background: linear-gradient(135deg, #e63946 0%, #457b9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.tenant-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1d3557;
  margin-bottom: 2px;
}

.tenant-email {
  color: #457b9d;
  font-size: 0.85rem;
}

/* Workplace Content */
.workplace-content {
  animation: slideInUp 0.5s ease-out;
}

.workplace-header {
  text-align: center;
  margin-bottom: 16px;
}

.workplace-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1d3557;
  margin-bottom: 6px;
}

.workplace-code {
  background: linear-gradient(135deg, #457b9d 0%, #a8dadc 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

/* Delegates List */
.delegates-content {
  animation: slideInDown 0.5s ease-out;
}

.delegate-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: linear-gradient(135deg, #f1faee 0%, #a8dadc 100%);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.delegate-item:hover {
  transform: translateX(4px);
  background: linear-gradient(135deg, #a8dadc 0%, #457b9d 100%);
}

.delegate-info {
  display: flex;
  align-items: center;
}

.delegate-icon {
  color: #e63946;
  margin-right: 10px;
  font-size: 1.1rem;
}

.delegate-name {
  font-weight: 600;
  color: #1d3557;
  margin-bottom: 2px;
}

.delegate-code {
  color: #457b9d;
  font-size: 0.8rem;
}

.type-chip {
  text-transform: capitalize;
  font-weight: 600;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 24px 16px;
  color: #457b9d;
}

.empty-icon {
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1d3557;
}

.empty-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--stat-color);
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-blue {
  --stat-color: linear-gradient(135deg, #e63946 0%, #457b9d 100%);
}

.stat-orange {
  --stat-color: linear-gradient(135deg, #457b9d 0%, #a8dadc 100%);
}

.stat-purple {
  --stat-color: linear-gradient(135deg, #a8dadc 0%, #1d3557 100%);
}

.stat-green {
  --stat-color: linear-gradient(135deg, #e63946 0%, #1d3557 100%);
}

.stat-icon {
  margin-bottom: 12px;
  color: #e63946;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1d3557;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.8rem;
  color: #457b9d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.3rem;
  }
  
  .profile-header,
  .tenant-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar,
  .tenant-logo {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .stat-item {
    padding: 12px;
  }
  
  .stat-number {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .welcome-header {
    padding: 12px 16px;
  }
  
  .card-content {
    padding: 12px 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
