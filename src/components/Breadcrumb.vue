<template>
    <q-card flat :bordered="bordered" :class="['my-card rounded-md q-mb-lg', { 'bg-blue-grey-1': !$q.dark.isActive }]">
        <q-card-section class="">
            <div class="row items-center justify-between">
                <div>
                    <div
                        :class="[
                            'text-weight-medium q-mb-xs',
                            { 'text-h5 ': $q.screen.gt.sm },
                            { 'text-h6 ': !$q.screen.gt.sm },
                        ]"
                    >
                        {{ title }}
                    </div>
                    <q-breadcrumbs>
                        <template v-slot:separator>
                            <q-icon size="1.5em" name="chevron_right" color="primary" />
                        </template>
                        <q-breadcrumbs-el to="/" label="Home" />
                        <q-breadcrumbs-el
                            v-for="(route, i) in breadcrumbRoutes"
                            :key="i"
                            :label="route.label"
                            :to="route.to"
                            class="text-capitalize"
                        />
                    </q-breadcrumbs>
                </div>
                <div>
                    <slot name="right"></slot>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineProps({
    title: {
        type: String,
        default: 'Title Here',
    },
    bordered: {
        type: Boolean,
        default: false,
    },
});

const route = useRoute();

// Computed property to build correct breadcrumb paths
const breadcrumbRoutes = computed(() => {
    const matchedRoutes = route.matched.filter((f) => f.name);
    const breadcrumbs = [];
    
    for (let i = 0; i < matchedRoutes.length; i++) {
        const matchedRoute = matchedRoutes[i];
        let routeName = matchedRoute.name;
        
        // For nested routes, we need to build the parameters progressively
        if (routeName === 'tenant' || routeName === 'tenant-list') {
            // No parameters needed for tenant list
            breadcrumbs.push({
                label: matchedRoute.meta?.title || matchedRoute.name?.replace(/-/g, ' '),
                to: { name: 'tenant-list' }
            });
        } else if (routeName === 'tenant-detail') {
            breadcrumbs.push({
                label: matchedRoute.meta?.title || matchedRoute.name?.replace(/-/g, ' '),
                to: { name: 'tenant-detail', params: { tenant_id: route.params.tenant_id } }
            });
        } else if (routeName === 'tenant-users') {
            breadcrumbs.push({
                label: matchedRoute.meta?.title || matchedRoute.name?.replace(/-/g, ' '),
                to: { name: 'tenant-users', params: { tenant_id: route.params.tenant_id } }
            });
        } else if (routeName === 'tenant-workplaces') {
            breadcrumbs.push({
                label: matchedRoute.meta?.title || matchedRoute.name?.replace(/-/g, ' '),
                to: { name: 'tenant-workplaces', params: { tenant_id: route.params.tenant_id } }
            });
        } else if (routeName === 'tenant-workplace') {
            breadcrumbs.push({
                label: matchedRoute.meta?.title || matchedRoute.name?.replace(/-/g, ' '),
                to: { name: 'tenant-workplace', params: { 
                    tenant_id: route.params.tenant_id,
                    workplace_id: route.params.workplace_id 
                }}
            });
        } else {
            // For other routes, use current params
            breadcrumbs.push({
                label: matchedRoute.meta?.title || matchedRoute.name?.replace(/-/g, ' '),
                to: { name: routeName, params: route.params }
            });
        }
    }
    
    return breadcrumbs;
});
</script>
