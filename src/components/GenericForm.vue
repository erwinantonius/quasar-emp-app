<template>
    <q-card flat :bordered="bordered">
        <q-card-section v-if="title">
            <div class="text-subtitle2">{{ title }}</div>
        </q-card-section>
        <q-form ref="myForm" @submit.prevent="handleFire" @reset="reset">
            <q-card-section>
                <div :class="`row ${gutter}`">
                    <div
                        v-for="(item, i) in intProps.filter((f) => !f.hidden)"
                        :key="i"
                        :class="[
                            { [`col-${item.col}`]: item.col && !item.hidden && $q.screen.gt.sm },
                            { 'col-12': $q.screen.lt.sm },
                        ]"
                    >
                        <q-input
                            v-if="item.type === 'text'"
                            v-show="!item.hidden"
                            v-model="item.value"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            type="text"
                            :disable="item.disabled"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :mask="item.mask"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val && val.length > 0) ||
                                    item.error_message ||
                                    'Please type something',
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-input
                            v-if="item.type === 'number'"
                            v-show="!item.hidden"
                            v-model="item.value"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            type="number"
                            :disable="item.disabled"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :mask="item.mask"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val && val.length > 0) ||
                                    item.error_message ||
                                    'Please type something',
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-input
                            v-if="item.type === 'textarea'"
                            v-show="!item.hidden"
                            v-model="item.value"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            type="textarea"
                            :disable="item.disabled"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            autogrow
                            :input-style="{ minHeight: '20px' }"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val && val.length > 0) ||
                                    item.error_message ||
                                    'Please type something',
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-input
                            v-if="item.type === 'tel'"
                            v-model="item.value"
                            v-show="!item.hidden"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            type="text"
                            :maxlength="item.size"
                            :disable="item.disabled"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :mask="item.mask"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val && val.length > 0) ||
                                    item.error_message ||
                                    'Please type something',
                                (val) => /^[0-9]*$/.test(val),
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-input
                            v-if="item.type === 'password'"
                            v-model="item.value"
                            v-show="!item.hidden"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            type="password"
                            :disable="item.disabled"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val && val.length > 0) ||
                                    item.error_message ||
                                    'Please type something',
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-input
                            v-if="item.type === 'email'"
                            v-model="item.value"
                            v-show="!item.hidden"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            type="email"
                            :disable="item.disabled"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :mask="item.mask"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val && val.length > 0) ||
                                    item.error_message ||
                                    'Please type something',
                                (val) => validateEmail(val) || 'Must be a valid email.',
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-input
                            v-if="item.type === 'date'"
                            v-model="item.value"
                            :dense="inputDense"
                            v-show="!item.hidden"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            type="text"
                            :disable="item.disabled"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            mask="####-##-##"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val && val.length > 0) ||
                                    item.error_message ||
                                    'Please type something',
                                (val) => regexDate.test(val),
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        >
                            <template #append>
                                <q-icon
                                    v-if="item.value != ''"
                                    name="close"
                                    @click="item.value = ''"
                                    class="cursor-pointer"
                                />
                                <q-icon name="date_range" class="cursor-pointer">
                                    <q-popup-proxy :ref="`itemDate`" transition-show="scale" transition-hide="scale">
                                        <q-date
                                            :mask="'YYYY-MM-DD'"
                                            v-model="item.value"
                                            @input="() => $refs[`itemDate`][0].hide()"
                                        >
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                        <q-date
                            :disable="item.disabled"
                            v-if="item.type === 'datepicker'"
                            v-model="item.value"
                            v-show="!item.hidden"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val && val.length > 0) ||
                                    item.error_message ||
                                    'Please type something',
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-select
                            v-if="item.type === 'select'"
                            :use-chips="item.use_chips ? true : false"
                            :multiple="item.multiple || false"
                            v-model="item.value"
                            v-show="!item.hidden"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            :use-input="item.use_input"
                            :disable="item.disabled"
                            :option-value="item.option_value"
                            :option-label="item.option_label"
                            :options="item.options"
                            :emit-value="item.emit_value"
                            :map-options="item.map_options"
                            :label="item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            @update:model-value="
                                (val) => $emit('on-emit-field', { emit_name: item.emit_event, value: val })
                            "
                            :rules="[
                                (val) => !item.required || !!val || item.error_message || 'Please select something',
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-checkbox
                            v-if="item.type === 'checkbox'"
                            keep-color
                            v-model="item.value"
                            :label="item.label"
                            @update:model-value="
                                (val) => $emit('on-emit-field', { emit_name: item.emit_event, value: val })
                            "
                            color="primary"
                        />
                    </div>
                </div>
            </q-card-section>
            <q-separator v-if="bottom_border" />
            <q-card-section v-if="actions">
                <div class="row justify-end q-gutter-sm">
                    <q-btn v-if="cancelButton" color="primary" label="Cancel" @click="$emit('cancel')" />
                    <q-space />
                    <q-btn type="reset" color="secondary" label="Reset" />
                    <q-btn type="submit" color="primary" label="Save" :disabled="fields.every((e) => !e.value)" />
                </div>
            </q-card-section>
        </q-form>
    </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
const emit = defineEmits(['fire', 'on-emit-field']);
const myForm = ref(null);
const $q = useQuasar();
const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const props = defineProps({
    fields: {
        type: Array,
        required: true,
        default() {
            return [];
        },
    },
    inputDense: {
        type: Boolean,
        default: false,
    },
    actions: {
        type: Boolean,
        default: true,
    },
    cancelButton: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: null,
    },
    gutter: {
        type: String,
        default: 'q-col-gutter-md',
    },
    bottom_border: {
        type: Boolean,
        default: true,
    },
    field_style: {
        type: String,
        default: 'filled',
    },
    bordered: { type: Boolean, default: false },
});

let intProps = ref(props.fields);

const handleFire = () => {
    myForm.value.validate().then((success) => {
        if (success) {
            emit('fire', intProps.value);
        } else {
            $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: 'There is something missing, please check the input form',
            });
        }
    });
};

const reset = () => {
    intProps.value = intProps.value.map((m) => {
        return {
            ...m,
            value: null,
        };
    });
    myForm.value.resetValidation();
};

const validateEmail = (email) => {
    return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
};
</script>
<script>
export default {
    name: 'GenericForm',
};
</script>
