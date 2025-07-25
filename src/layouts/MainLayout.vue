<template>
    <q-layout view="lHh LpR lFf" :class="[{ 'bg-body': !$q.dark.isActive }]">
        <q-header
            v-if="$q.screen.gt.xs"
            :bordered="$q.screen.gt.xs"
            :class="[
                { 'bg-white text-dark': $q.screen.gt.xs && !$q.dark.isActive },
                { 'bg-dark-opacity-07 text-dark': $q.dark.isActive },
                { 'bg-white-opacity-07': $q.screen.lt.sm && $route.name === 'home' && !topOfPage && !$q.dark.isActive },
                { 'bg-transparent': $q.screen.lt.sm && $route.name === 'home' && topOfPage },
            ]"
        >
            <q-toolbar>
                <q-btn
                    v-if="$q.screen.gt.xs"
                    flat
                    dense
                    round
                    icon="menu"
                    color="primary"
                    aria-label="Menu"
                    @click="toggleLeftDrawer"
                />
                <q-space />
                <div class="q-gutter-md">
                    <q-btn
                        v-if="$q.screen.gt.sm"
                        round
                        flat
                        dense
                        :color="$q.dark.isActive ? 'yellow' : 'dark'"
                        :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
                        @click="changeTheme"
                        title="light/dark"
                    />

                    <!-- Notification Bell -->
                    <q-btn
                        round
                        flat
                        dense
                        icon="notifications"
                        color="primary"
                        @click="goToInbox"
                        title="Inbox"
                    >
                        <q-badge
                            v-if="unreadInboxCount > 0"
                            color="negative"
                            floating
                            rounded
                        >
                            {{ unreadInboxCount > 99 ? '99+' : unreadInboxCount }}
                        </q-badge>
                        <q-tooltip>Inbox ({{ unreadInboxCount }} unread)</q-tooltip>
                    </q-btn>

                    <q-btn round dense>
                        <q-avatar v-if="profile" size="30px" @click="goToProfile()">
                            <img :src="avatarUrl" :title="profile.fullname" />
                        </q-avatar>
                        <q-popup-proxy
                            v-if="$q.screen.gt.sm && user"
                            transition-show="jump-down"
                            transition-hide="jump-up"
                            :offset="[0, 15]"
                        >
                            <q-banner :style="$q.screen.lt.sm ? 'width: 95vw' : ''">
                                <div
                                    :class="[
                                        'column q-py-md',
                                        { 'q-px-lg': $q.screen.gt.sm },
                                        { 'q-px-md': !$q.screen.gt.sm },
                                    ]"
                                >
                                    <div class="text-h6 q-mb-md text-weight-medium">User Profile</div>
                                    <div class="row items-center">
                                        <q-avatar v-if="$q.screen.gt.sm" size="72px" class="q-mr-md">
                                            <img :src="`https://ui-avatars.com/api/?name=${user.fullname}`" :title="user.fullname" />
                                        </q-avatar>
                                        <div class="col">
                                            <div class="text-subtitle1 text-weight-bold">
                                                {{ user.fullname }}
                                            </div>
                                            <div class="row items-center text-grey">
                                                <q-icon name="o_email" class="q-mr-sm" />
                                                <span>{{ user.email }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <q-list>
                                    <q-item
                                        clickable
                                        v-ripple
                                        :class="[
                                            'row items-center ',
                                            { 'q-px-lg': $q.screen.gt.sm },
                                            { 'q-px-md': !$q.screen.gt.sm },
                                        ]"
                                        @click="$router.push({ name: 'profile' })"
                                    >
                                        <div class="q-mr-md">
                                            <q-icon size="lg" color="primary" name="o_person" />
                                        </div>
                                        <div>
                                            <div class="text-subtitle1 text-bold">My Profile</div>
                                            <div class="text-subtitle2 text-grey">Account Settings</div>
                                        </div>
                                    </q-item>
                                </q-list>

                                <div :class="[{ 'q-pa-lg': $q.screen.gt.sm }, { 'q-pa-md': !$q.screen.gt.sm }]">
                                    <q-btn class="full-width" color="primary" label="Logout" @click="logout" />
                                </div>
                            </q-banner>
                        </q-popup-proxy>
                    </q-btn>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-if="$q.screen.gt.xs"
            v-model="leftDrawerOpen"
            show-if-above
            side="left"
            bordered
            :mini="miniState"
            @click.capture="drawerClick"
            :width="299"
            :breakpoint="600"
            :class="[{ 'bg-primary': !$q.dark.isActive }]"
        >
            <div :class="['q-px-lg q-py-sm']">
                <div
                    :class="[
                        'row items-center cursor-pointer',
                        { 'justify-between': !miniState },
                        { 'justify-center': miniState },
                    ]"
                >
                    <div v-if="!miniState" class="row items-center q-gutter-md">
                        <div class="text-h6 text-white">Employee Hub</div>
                    </div>
                    <q-btn
                        v-if="$q.screen.gt.xs"
                        flat
                        round
                        :color="$q.dark.isActive ? 'primary' : 'white'"
                        icon="double_arrow"
                        :class="{ 'rotate-180': !miniState }"
                        @click="setMiniState()"
                    />
                </div>
            </div>
            <q-list :class="[{ 'q-px-lg': !miniState }]">
                <MenuTree v-for="link in myMenu" :key="link.group_title" v-bind="link" />
            </q-list>

            <div :class="['fixed-bottom ', { 'bg-primary': !$q.dark.isActive }, { 'bg-dark': $q.dark.isActive }]">
                <q-separator inset />
                <div class="text-white text-center text-weight-medium q-py-sm">
                    <span v-show="!miniState">Version</span> {{ currentAppVersion }}
                </div>
            </div>
        </q-drawer>

        <q-page-container>
            <router-view v-slot="{ Component }">
                <!-- <transition
                    appear
                    enter-active-class="animated slideInLeft"
                    leave-active-class="animated slideOutRight"
                > -->
                <component :is="Component" />
                <!-- </transition> -->
            </router-view>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, onBeforeMount, computed, onMounted } from 'vue';
import MenuTree from 'src/components/MenuTree.vue';
import { useAuthStore } from 'stores/auth';
import { useUserStore } from 'stores/user';
import { useSettingStore } from 'stores/setting';
import { menus } from 'src/config/menus.js';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getMessaging, getToken } from 'firebase/messaging';
import { FIREBASE_CONFIG } from 'src/config/firebase';
import { UserApi } from 'src/api';
import { InboxApi } from 'src/api/inbox';

import { messaging } from 'boot/firebase';
import { onMessage } from 'firebase/messaging';
import { APP_VERSION } from 'src/config/app';

const authStore = useAuthStore();
const userStore = useUserStore();
const settingStore = useSettingStore();
const router = useRouter();
const $q = useQuasar();

const leftDrawerOpen = ref(false);
const user = computed(() => authStore.user);
const profile = computed(() => userStore.profile);
const myMenu = computed(() =>
    menus
        .map((m) => {
            user.value?.roles?.map((n) => {
                if (m.roles && m.roles.includes(n)) m.allow = true;
            });
            //if roles empty
            if (!(m.roles ?? []).length || !m.roles) m.allow = true;
            //if roles all
            if (m.roles.includes('all')) m.allow = true;

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
                        if (m.roles.includes('all')) m.allow = true;
                        return c;
                    })
                    .filter((f) => f.allow);
            }
            return m;
        })
        .filter((f) => f.allow),
);
const topOfPage = computed(() => settingStore.topOfPage);
const miniState = computed(() => settingStore.miniState);
const currentAppVersion = computed(() => settingStore.appVersion);
// const notifications = ref([]);
const app_version = ref(APP_VERSION);
const unreadInboxCount = ref(0);

// Fetch unread inbox count
const fetchUnreadInboxCount = async () => {
    try {
        const response = await InboxApi.getUnreadCount();
        if (response.data && typeof response.data.count === 'number') {
            unreadInboxCount.value = response.data.count;
        }
    } catch (error) {
        console.error('Error fetching unread inbox count:', error);
        unreadInboxCount.value = 0;
    }
};

// Navigate to inbox page
const goToInbox = () => {
    router.push({ name: 'inbox' });
};

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.

const logout = () => {
    authStore.logout();
};

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value;
};

const drawerClick = (e) => {
    if (miniState.value) {
        settingStore.setMiniState();
        e.stopPropagation();
    }
};

const goToProfile = () => {
    if ($q.screen.lt.sm) {
        return router.push({ name: 'profile' });
    }
};

const setMiniState = () => {
    settingStore.setMiniState();
};

//check build version of app
const checkVersion = () => {
    if (!currentAppVersion.value) {
        return settingStore.setVersion(app_version.value);
    }
    if (currentAppVersion.value !== app_version.value) {
        return logout();
    }
    console.log(`App version ${app_version.value}`);
};

// const getNotif = async () => {
//     const result = await NotificationApi.get({
//         params: {
//             filter: {
//                 receiver: user.value._id,
//             },
//             limit: 5,
//         },
//     });
//     notifications.value = result.data;
// };

// const onClickNotif = async (notif) => {
//     await NotificationApi.patch(notif._id, {
//         status: 'read',
//     });
//     await getNotif();
// };

const handleScroll = () => {
    if (window.pageYOffset > 0) {
        if (topOfPage.value) settingStore.setTopOfPage(false);
    } else {
        if (!topOfPage.value) settingStore.setTopOfPage(true);
    }
};

const changeTheme = () => {
    settingStore.changeTheme();
    $q.dark.set(settingStore.darkTheme);
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

onBeforeMount(async () => {
    window.addEventListener('scroll', handleScroll);
    await Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            const msg = getMessaging();
            await getToken(msg, { vapidKey: FIREBASE_CONFIG.vapId })
                .then(async (currentToken) => {
                    if (currentToken) {
                        await UserApi.updateUser(user.value._id, { fcm_token: currentToken });
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                })
                .catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                });
        }
    });

    onMessage(messaging, (payload) => {
        console.log('Message received. ');
        const { title, body } = payload.notification;
        console.log(title);
        console.log(body);
        // getNotif();
        $q.notify({
            color: 'yellow-5',
            textColor: 'black',
            icon: 'announcement',
            message: `${title} ${body}`,
            classes: 'glossy',
        });
    });
    
    
    
});

onMounted(async () => {
    await userStore.whoAmI();
    $q.dark.set(settingStore.darkTheme);
    checkVersion();
    // Fetch initial unread count
    await fetchUnreadInboxCount();
    
});
</script>
