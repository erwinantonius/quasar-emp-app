<template>
    <component :is="component"></component>
</template>

<script>
import { defineComponent, computed } from 'vue';
import DashboardDesktop from './DashboardDesktop.vue';
import DashboardMobile from './DashboardMobile.vue';
import { useQuasar } from 'quasar';
export default defineComponent({
    name: 'IndexPage',
    components: {
        DashboardDesktop,
        DashboardMobile,
    },
    setup() {
        const $q = useQuasar();
        const component = computed(() => {
            if ($q.screen.lt.sm) {
                return DashboardMobile;
            }
            return DashboardDesktop;
        });

        return { component };
    },
});
</script>
