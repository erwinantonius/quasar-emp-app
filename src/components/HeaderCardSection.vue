<template>
    <q-card-section :class="[{ 'sticky-top border-bottom': props.sticky }, { 'no-padding': props.noPadding }]">
        <slot name="default">
            <div class="row items-center">
                <div class="text-subtitle1 text-weight-bold text-capitalize">{{ props.title }}</div>
                <q-space />
                <q-btn flat round size="sm" color="secondary" icon="close" v-close-popup />
            </div>
        </slot>
    </q-card-section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Title'
  },
  sticky: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  }
})
</script>
