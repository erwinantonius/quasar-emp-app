<template>
    <q-expansion-item
        v-if="children"
        v-model="expanded"
        :label="title"
        :icon="icon"
        :class="[{ 'text-white': !$q.dark.isActive }, { 'text-white': $q.dark.isActive }]"
        active-class="rounded-md"
        :header-class="['left-menu rounded-md', { 'text-white': parentPath.path === path }]"
        :active="path == path"
        expand-icon-class="text-white"
        group="somegroup"
    >
        <MenuTree v-for="link in children" :key="link.title" v-bind="link" />
    </q-expansion-item>
    <q-item
        v-else
        clickable
        tag="a"
        :to="path"
        :class="[
            'left-menu rounded-md q-my-xs',
            { 'q-mx-xs': miniState },
            { 'child-menu': children },
            { 'bg-secondary text-primary text-weight-medium': currentPath.path === path && !$q.dark.isActive },
            { 'bg-indigo text-white text-weight-medium': currentPath.path === path && $q.dark.isActive },
            { 'text-white': currentPath.path !== path && !$q.dark.isActive },
            { 'text-white': currentPath.path !== path && $q.dark.isActive },
        ]"
        active-class="text-primary rounded-md"
        :active="currentPath.path === path"
    >
        <q-item-section avatar class="text-center">
            <q-icon v-if="icon" :name="icon" />
            <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="14px"
                height="14px"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="12" cy="12" r="4"></circle>
            </svg>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingStore } from 'stores/setting';

export default defineComponent({
    name: 'MenuTree',
    props: {
        title: {
            type: String,
            required: true,
        },

        path: {
            type: String,
            default: null,
        },

        icon: {
            type: String,
            default: null,
        },
        children: {
            type: Array,
            default() {
                return null;
            },
        },
    },

    setup(props) {
        const route = useRoute();
        const parentPath = computed(() => route.matched[0]);
        const currentPath = computed(() => route);

        const settingStore = useSettingStore();
        const miniState = computed(() => settingStore.miniState);

        const expanded = ref(false);
        const activeExpand = ref(false);

        if (parentPath.value.path === props.path) {
            expanded.value = true;
            activeExpand.value = true;
        }

        return { expanded, activeExpand, parentPath, currentPath, miniState };
    },
});
</script>

<style>
/* .left-menu:hover {
    color: var(--q-primary) !important;
} */

.child-menu {
    background: #eee;
}
</style>
