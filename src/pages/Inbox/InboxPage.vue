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
                    Inbox
                </div>
                <q-space />
                <!-- Mark All as Read Button -->
                <q-btn
                    v-if="unreadCount > 0"
                    flat
                    color="primary"
                    icon="mark_email_read"
                    @click="markAllAsRead"
                    :loading="markingAsRead"
                >
                    <q-tooltip>Mark all as read</q-tooltip>
                </q-btn>
            </div>
        </div>

        <!-- Filter Tabs -->
        <div class="q-px-md q-pb-md">
            <q-tabs
                v-model="activeFilter"
                dense
                class="text-grey-7"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
            >
                <q-tab name="all" label="All" />
                <q-tab name="unread" label="Unread" :badge="unreadCount > 0 ? unreadCount : ''" />
                <q-tab name="approval" label="Approvals" />
                <q-tab name="notification" label="Notifications" />
            </q-tabs>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="q-pa-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="text-center q-py-xl">
                    <q-spinner-dots size="lg" color="primary" />
                    <div class="text-body2 text-grey-6 q-mt-md">Loading inbox...</div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="q-pa-md">
            <q-card class="rounded-xl shadow-2" flat>
                <q-card-section class="text-center q-py-xl">
                    <q-icon name="error_outline" size="xl" color="negative" />
                    <div class="text-h6 text-negative q-mt-md">Error Loading Inbox</div>
                    <div class="text-body2 text-grey-6 q-mt-sm">{{ error }}</div>
                    <q-btn
                        flat
                        color="primary"
                        label="Retry"
                        @click="loadInboxData"
                        class="q-mt-md"
                    />
                </q-card-section>
            </q-card>
        </div>

        <!-- Inbox List -->
        <div v-else class="q-px-md q-pb-xl">
            <!-- Summary Cards -->
            <div class="row q-col-gutter-md q-mb-md">
                <div class="col-3">
                    <q-card class="summary-card text-center q-pa-md rounded-lg" flat>
                        <div class="text-h6 text-weight-bold text-primary">{{ totalCount }}</div>
                        <div class="text-caption text-grey-6">Total</div>
                    </q-card>
                </div>
                <div class="col-3">
                    <q-card class="summary-card text-center q-pa-md rounded-lg" flat>
                        <div class="text-h6 text-weight-bold text-negative">{{ unreadCount }}</div>
                        <div class="text-caption text-grey-6">Unread</div>
                    </q-card>
                </div>
                <div class="col-3">
                    <q-card class="summary-card text-center q-pa-md rounded-lg" flat>
                        <div class="text-h6 text-weight-bold text-warning">{{ approvalCount }}</div>
                        <div class="text-caption text-grey-6">Approvals</div>
                    </q-card>
                </div>
                <div class="col-3">
                    <q-card class="summary-card text-center q-pa-md rounded-lg" flat>
                        <div class="text-h6 text-weight-bold text-positive">{{ urgentCount }}</div>
                        <div class="text-caption text-grey-6">Urgent</div>
                    </q-card>
                </div>
            </div>

            <!-- Inbox Items -->
            <q-card class="rounded-xl shadow-2" flat>
                <!-- Empty State -->
                <div v-if="filteredInboxItems.length === 0" class="text-center q-py-xl">
                    <q-icon name="inbox" size="xl" color="grey-5" />
                    <div class="text-h6 text-grey-5 q-mt-md">No Messages</div>
                    <div class="text-body2 text-grey-6 q-mt-sm">
                        {{ activeFilter === 'all' ? 'Your inbox is empty' : `No ${activeFilter} messages` }}
                    </div>
                </div>

                <!-- Message List -->
                <q-list v-else separator>
                    <q-item
                        v-for="(item, index) in filteredInboxItems"
                        :key="item._id || index"
                        clickable
                        @click="openInboxDetail(item)"
                        class="inbox-item"
                        :class="{ 'unread-item': item.status === 'unread' }"
                    >
                        <q-item-section avatar>
                            <q-avatar 
                                size="md" 
                                :class="getTypeAvatarClass(item.type)"
                                :style="item.status === 'unread' ? 'border: 2px solid var(--q-primary)' : ''"
                            >
                                <q-icon :name="getTypeIcon(item.type)" color="white" />
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label class="text-weight-medium" :class="item.status === 'unread' ? 'text-weight-bold' : ''">
                                {{ item.title }}
                            </q-item-label>
                            <q-item-label caption class="text-grey-6 q-mt-xs">
                                {{ truncateMessage(item.message) }}
                            </q-item-label>
                            <q-item-label caption>
                                <div class="row items-center q-gutter-xs q-mt-xs">
                                    <q-chip
                                        :color="getPriorityColor(item.priority)"
                                        text-color="white"
                                        size="xs"
                                        dense
                                    >
                                        {{ getPriorityLabel(item.priority) }}
                                    </q-chip>
                                    <span class="text-caption text-grey-6">
                                        {{ formatDate(item.sent_date) }}
                                    </span>
                                </div>
                            </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <div class="column items-end">
                                <q-chip
                                    :color="getStatusColor(item.status)"
                                    :text-color="item.status === 'unread' ? 'white' : 'grey-7'"
                                    size="sm"
                                    :outline="item.status !== 'unread'"
                                    dense
                                >
                                    {{ getStatusLabel(item.status) }}
                                </q-chip>
                                <div class="text-caption text-grey-6 q-mt-xs">
                                    {{ formatTime(item.sent_date) }}
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

        <!-- Inbox Detail Dialog -->
        <q-dialog v-model="showDetailDialog" persistent>
            <q-card class="detail-dialog" style="width: 100%; max-width: 600px;">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6 text-weight-bold">Message Details</div>
                    <q-space />
                    <q-btn icon="close" flat round dense @click="showDetailDialog = false" />
                </q-card-section>

                <q-card-section v-if="selectedInboxItem">
                    <!-- Message Header -->
                    <div class="message-header q-mb-lg">
                        <div class="row items-center q-mb-md">
                            <q-avatar size="lg" :class="getTypeAvatarClass(selectedInboxItem.type)">
                                <q-icon :name="getTypeIcon(selectedInboxItem.type)" color="white" size="md" />
                            </q-avatar>
                            <div class="q-ml-md">
                                <div class="text-h6 text-weight-bold">{{ selectedInboxItem.title }}</div>
                                <div class="text-caption text-grey-6">
                                    From: {{ selectedInboxItem.sender?.first_name || 'System' }} {{ selectedInboxItem.sender?.last_name || '' }}
                                </div>
                            </div>
                        </div>
                        
                        <div class="row items-center q-gutter-sm">
                            <q-chip
                                :color="getTypeColor(selectedInboxItem.type)"
                                text-color="white"
                                size="sm"
                            >
                                {{ getTypeLabel(selectedInboxItem.type) }}
                            </q-chip>
                            <q-chip
                                :color="getPriorityColor(selectedInboxItem.priority)"
                                text-color="white"
                                size="sm"
                            >
                                {{ getPriorityLabel(selectedInboxItem.priority) }}
                            </q-chip>
                            <q-chip
                                :color="getStatusColor(selectedInboxItem.status)"
                                :text-color="selectedInboxItem.status === 'unread' ? 'white' : 'grey-7'"
                                size="sm"
                                :outline="selectedInboxItem.status !== 'unread'"
                            >
                                {{ getStatusLabel(selectedInboxItem.status) }}
                            </q-chip>
                        </div>
                    </div>

                    <!-- Message Content -->
                    <div class="message-content q-mb-lg">
                        <div class="text-body1" v-html="selectedInboxItem.message"></div>
                    </div>

                    <!-- Message Details -->
                    <div class="message-details">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <q-icon name="schedule" color="info" size="sm" />
                                <div class="detail-content">
                                    <div class="detail-label">Sent Date</div>
                                    <div class="detail-value">{{ formatDateTime(selectedInboxItem.sent_date) }}</div>
                                </div>
                            </div>

                            <div class="detail-item" v-if="selectedInboxItem.read_date">
                                <q-icon name="visibility" color="positive" size="sm" />
                                <div class="detail-content">
                                    <div class="detail-label">Read Date</div>
                                    <div class="detail-value">{{ formatDateTime(selectedInboxItem.read_date) }}</div>
                                </div>
                            </div>

                            <div class="detail-item" v-if="selectedInboxItem.category">
                                <q-icon name="category" color="warning" size="sm" />
                                <div class="detail-content">
                                    <div class="detail-label">Category</div>
                                    <div class="detail-value">{{ selectedInboxItem.category }}</div>
                                </div>
                            </div>

                            <div class="detail-item" v-if="selectedInboxItem.expires_at">
                                <q-icon name="timer" color="negative" size="sm" />
                                <div class="detail-content">
                                    <div class="detail-label">Expires At</div>
                                    <div class="detail-value">{{ formatDateTime(selectedInboxItem.expires_at) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="q-pa-md">
                    <q-btn
                        v-if="selectedInboxItem?.action_url"
                        color="primary"
                        label="Take Action"
                        @click="handleAction(selectedInboxItem)"
                        class="q-mr-sm"
                    />
                    <q-btn
                        v-if="selectedInboxItem?.status === 'unread'"
                        outline
                        color="primary"
                        label="Mark as Read"
                        @click="markAsRead(selectedInboxItem)"
                        :loading="markingAsRead"
                        class="q-mr-sm"
                    />
                    <q-btn flat label="Close" color="primary" @click="showDetailDialog = false" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { InboxApi } from 'src/api';
import { useAuthStore } from 'stores/auth';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

// Get user data
const user = authStore.user;

// Reactive data
const loading = ref(false);
const error = ref('');
const inboxItems = ref([]);
const showDetailDialog = ref(false);
const selectedInboxItem = ref(null);
const activeFilter = ref('all');
const markingAsRead = ref(false);

// Computed properties
const totalCount = computed(() => inboxItems.value.length);

const unreadCount = computed(() => 
    inboxItems.value.filter(item => item.status === 'unread').length
);

const approvalCount = computed(() => 
    inboxItems.value.filter(item => item.type === 'approval').length
);

const urgentCount = computed(() => 
    inboxItems.value.filter(item => item.priority === 'urgent').length
);

const filteredInboxItems = computed(() => {
    let filtered = inboxItems.value;
    
    switch (activeFilter.value) {
        case 'unread':
            filtered = filtered.filter(item => item.status === 'unread');
            break;
        case 'approval':
            filtered = filtered.filter(item => item.type === 'approval');
            break;
        case 'notification':
            filtered = filtered.filter(item => item.type === 'notification');
            break;
        default:
            // 'all' - no filtering
            break;
    }
    
    return filtered.sort((a, b) => new Date(b.sent_date) - new Date(a.sent_date));
});

// Methods
const loadInboxData = async () => {
    if (!user?._id) {
        error.value = 'User information not available';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        const response = await InboxApi.getInbox({
            limit: 50,
            sort: { sent_date: -1 }
        });

        inboxItems.value = response.data || [];
    } catch (err) {
        console.error('Error loading inbox data:', err);
        error.value = err.response?.data?.message || 'Failed to load inbox data';
    } finally {
        loading.value = false;
    }
};

const openInboxDetail = async (item) => {
    selectedInboxItem.value = item;
    showDetailDialog.value = true;
    
    // Mark as read when opened
    if (item.status === 'unread') {
        await markAsRead(item, false); // Don't show notification
    }
};

const markAsRead = async (item, showNotification = true) => {
    markingAsRead.value = true;
    
    try {
        await InboxApi.markAsRead(item._id);
        
        // Update local state
        const index = inboxItems.value.findIndex(i => i._id === item._id);
        if (index !== -1) {
            inboxItems.value[index].status = 'read';
            inboxItems.value[index].read_date = new Date();
        }
        
        // Update selected item if it's the same
        if (selectedInboxItem.value?._id === item._id) {
            selectedInboxItem.value.status = 'read';
            selectedInboxItem.value.read_date = new Date();
        }
        
        if (showNotification) {
            $q.notify({
                type: 'positive',
                message: 'Message marked as read',
                timeout: 2000
            });
        }
    } catch (error) {
        console.error('Error marking as read:', error);
        $q.notify({
            type: 'negative',
            message: 'Failed to mark as read'
        });
    } finally {
        markingAsRead.value = false;
    }
};

const markAllAsRead = async () => {
    markingAsRead.value = true;
    
    try {
        // Get all unread messages and mark them one by one
        const unreadItems = inboxItems.value.filter(item => item.status === 'unread');
        
        for (const item of unreadItems) {
            await InboxApi.markAsRead(item._id);
            // Update local state
            item.status = 'read';
            item.read_date = new Date();
        }
        
        $q.notify({
            type: 'positive',
            message: 'All messages marked as read',
            timeout: 2000
        });
    } catch (error) {
        console.error('Error marking all as read:', error);
        $q.notify({
            type: 'negative',
            message: 'Failed to mark all as read'
        });
    } finally {
        markingAsRead.value = false;
    }
};

const handleAction = (item) => {
    if (item.action_url) {
        router.push(item.action_url);
        showDetailDialog.value = false;
    }
};

// Helper functions
const truncateMessage = (message, maxLength = 100) => {
    if (!message) return '';
    
    // Remove HTML tags for preview
    const cleanMessage = message.replace(/<[^>]*>/g, '');
    
    if (cleanMessage.length <= maxLength) return cleanMessage;
    return cleanMessage.substring(0, maxLength) + '...';
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const formatDateTime = (dateString) => {
    if (!dateString) return 'Not available';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

// Type-related helpers
const getTypeIcon = (type) => {
    switch (type) {
        case 'approval': return 'approval';
        case 'notification': return 'notifications';
        case 'reminder': return 'alarm';
        case 'system': return 'settings';
        case 'announcement': return 'campaign';
        default: return 'email';
    }
};

const getTypeColor = (type) => {
    switch (type) {
        case 'approval': return 'warning';
        case 'notification': return 'info';
        case 'reminder': return 'orange';
        case 'system': return 'purple';
        case 'announcement': return 'green';
        default: return 'primary';
    }
};

const getTypeLabel = (type) => {
    switch (type) {
        case 'approval': return 'Approval';
        case 'notification': return 'Notification';
        case 'reminder': return 'Reminder';
        case 'system': return 'System';
        case 'announcement': return 'Announcement';
        default: return 'Message';
    }
};

const getTypeAvatarClass = (type) => {
    return `bg-${getTypeColor(type)}`;
};

// Priority-related helpers
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'urgent': return 'negative';
        case 'high': return 'warning';
        case 'normal': return 'info';
        case 'low': return 'positive';
        default: return 'grey';
    }
};

const getPriorityLabel = (priority) => {
    switch (priority) {
        case 'urgent': return 'Urgent';
        case 'high': return 'High';
        case 'normal': return 'Normal';
        case 'low': return 'Low';
        default: return 'Normal';
    }
};

// Status-related helpers
const getStatusColor = (status) => {
    switch (status) {
        case 'unread': return 'negative';
        case 'read': return 'positive';
        case 'processed': return 'info';
        case 'archived': return 'grey';
        default: return 'grey';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'unread': return 'Unread';
        case 'read': return 'Read';
        case 'processed': return 'Processed';
        case 'archived': return 'Archived';
        default: return 'Unknown';
    }
};

// Lifecycle
onMounted(() => {
    loadInboxData();
});
</script>

<style lang="scss" scoped>
// Background gradients
.bg-gradient-to-br {
  background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
}

.from-blue-50 { --gradient-from: #eff6ff; }
.to-indigo-100 { --gradient-to: #e0e7ff; }

// Summary cards
.summary-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

// Inbox item styling
.inbox-item {
  border-radius: 8px;
  margin: 8px 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(25, 118, 210, 0.04);
    transform: translateX(4px);
  }
  
  &.unread-item {
    background: rgba(25, 118, 210, 0.02);
    border-left: 4px solid var(--q-primary);
  }
}

// Message header styling
.message-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 16px;
}

// Message content styling
.message-content {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 16px;
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

// Type background colors
.bg-warning { background: var(--q-warning) !important; }
.bg-info { background: var(--q-info) !important; }
.bg-orange { background: #ff9800 !important; }
.bg-purple { background: #9c27b0 !important; }
.bg-green { background: var(--q-positive) !important; }
.bg-primary { background: var(--q-primary) !important; }

// Responsive design
@media (max-width: 480px) {
  .detail-dialog {
    margin: 16px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .inbox-item {
    margin: 4px 0;
  }
  
  .summary-card {
    .text-h6 {
      font-size: 1.2rem;
    }
  }
}

// Dark mode support
.q-dark {
  .inbox-item {
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    &.unread-item {
      background: rgba(255, 255, 255, 0.02);
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
  
  .message-header,
  .message-content {
    border-bottom-color: rgba(255, 255, 255, 0.1);
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
</style>
