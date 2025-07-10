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
                            v-for="(route, i) in $route.matched.filter((f) => f.name)"
                            :key="i"
                            :label="route.name?.replace(/-/g, ' ')"
                            :to="route.path"
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

<script>
export default {
    name: 'BreadcrumnComponent',
    props: {
        title: {
            type: String,
            default: 'Title Here',
        },
        bordered: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
