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
                          $q.screen.gt.sm && item.col ? `col-${item.col}` : 'col-12'
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
                            :rules="getValidationRules(item)"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-input
                            v-if="item.type === 'number'"
                            v-show="!item.hidden"
                            v-model.number="item.value"
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
                            :rules="getValidationRules(item)"
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
                            :rules="getValidationRules(item)"
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
                            :rules="getValidationRules(item)"
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
                            :rules="getValidationRules(item)"
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
                            :rules="getValidationRules(item)"
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
                            :rules="getValidationRules(item)"
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
                            :rules="getValidationRules(item)"
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
                            :rules="getValidationRules(item)"
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
                    <q-btn type="reset" outline color="primary" label="Reset" />
                    <q-btn type="submit" color="primary" label="Save" :disabled="isFormEmpty" />
                </div>
            </q-card-section>
        </q-form>
    </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
const emit = defineEmits(['fire', 'on-emit-field', 'cancel']);
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

// Function untuk normalisasi format date
const normalizeDateValue = (value) => {
    if (!value) return value;

    // Jika sudah dalam format YYYY-MM-DD, return as is
    if (typeof value === 'string' && regexDate.test(value)) {
        return value;
    }

    // Jika dalam format ISO (dengan T dan Z), ekstrak tanggal saja
    if (typeof value === 'string' && value.includes('T')) {
        return value.split('T')[0];
    }

    // Jika Date object, konversi ke YYYY-MM-DD
    if (value instanceof Date) {
        return value.toISOString().split('T')[0];
    }

    return value;
};

let intProps = ref(props.fields.map(field => {
    // Normalisasi nilai date pada inisialisasi
    if (field.type === 'date' && field.value) {
        return {
            ...field,
            value: normalizeDateValue(field.value)
        };
    }
    return field;
}));

// Computed property untuk mengecek apakah form kosong
const isFormEmpty = computed(() => {
    return intProps.value.filter(field => field.required).every(field => {
        if (field.type === 'number') {
            return field.value === null || field.value === undefined || field.value === '';
        }
        return !field.value;
    });
});

// Function untuk mendapatkan validation rules berdasarkan tipe field
const getValidationRules = (item) => {
    const rules = [];

    // Base required validation
    if (item.required) {
        if (item.type === 'number') {
            rules.push(
                (val) => val !== null && val !== undefined && val !== '' ||
                item.error_message || 'Please enter a number'
            );
        } else if (item.type === 'select') {
            rules.push(
                (val) => !!val || item.error_message || 'Please select something'
            );
        } else if (item.type === 'date') {
            rules.push(
                (val) => {
                    const normalizedVal = normalizeDateValue(val);
                    return (normalizedVal && normalizedVal.length > 0) ||
                    item.error_message || 'Please select a date';
                }
            );
        } else {
            rules.push(
                (val) => (val && val.length > 0) ||
                item.error_message || 'Please type something'
            );
        }
    }

    // Specific validation based on type
    switch (item.type) {
        case 'tel':
            rules.push((val) => !val || /^[0-9]*$/.test(val) || 'Only numbers allowed');
            break;
        case 'email':
            rules.push((val) => !val || validateEmail(val) || 'Must be a valid email.');
            break;
        case 'date':
            rules.push((val) => {
                if (!val) return true;
                const normalizedVal = normalizeDateValue(val);
                return regexDate.test(normalizedVal) || 'Invalid date format';
            });
            break;
        case 'number':
            rules.push((val) => !val || !isNaN(val) || 'Must be a valid number');
            break;
    }

    return rules;
};

const handleFire = () => {
    myForm.value.validate().then((success) => {
        if (success) {
            // Convert date strings to proper format before emitting
            const processedData = intProps.value.map(item => {
                if (item.type === 'date' && item.value) {
                    // If it's already a proper date string, keep it as is
                    if (typeof item.value === 'string' && item.value.includes('T')) {
                        return item;
                    }
                    // Otherwise, convert to ISO format
                    return {
                        ...item,
                        value: item.value + 'T00:00:00.000Z'
                    };
                }
                return item;
            });

            emit('fire', processedData);
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
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email);
};
</script>
