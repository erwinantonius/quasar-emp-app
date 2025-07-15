<template>
    <q-card flat :bordered="bordered">
        <q-card-section v-if="title">
            <div class="text-subtitle2">{{ title }}</div>
        </q-card-section>
        <q-form ref="myForm" @submit.prevent="handleFire" @reset="reset">
            <q-card-section>
                <div :class="`row ${gutter}`">
                    <div
                        v-for="(item, i) in intProps"
                        :key="i"
                        v-show="!item.hidden"
                        :class="[
                            { [`col-${item.col}`]: item.col && !item.hidden && $q.screen.gt.sm },
                            { 'col-12': $q.screen.lt.md },
                        ]"
                    >
                        <!-- Silence Mode: Display as labels -->
                        <div v-if="silence" class="q-field q-field--filled q-field--readonly">
                            <div class="q-field__inner relative-position col self-stretch">
                                <div class="q-field__control relative-position row no-wrap">
                                    <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip">
                                        <div class="q-field__native row">
                                            <div class="col">
                                                <div class="text-caption text-grey-6 q-mb-xs">{{ item.label }}</div>
                                                <div class="text-body1" :class="{ 'text-grey-5': !item.value && item.value !== 0 }">
                                                    {{ formatFieldValue(item) }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Normal Mode: Display as input fields -->
                        <template v-else>
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
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :mask="item.mask"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val !== null && val !== undefined && val !== '') ||
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
                            v-model.number="item.value"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            type="number"
                            :disable="item.disabled"
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :mask="item.mask"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val !== null && val !== undefined && val !== '' && !isNaN(val)) ||
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
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            autogrow
                            :input-style="{ minHeight: '20px' }"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val !== null && val !== undefined && val !== '') ||
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
                            :prefix="item.prefix"
                            v-show="!item.hidden"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :dense="inputDense"
                            type="number"
                            :maxlength="item.size"
                            :disable="item.disabled"
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :mask="item.mask"
                            :hint="item.hint"
                            @update:model-value="(val)=>{
                                item.value = val.replace(/^0/, '');
                            }"
                            :rules="[
                                (val) =>
                                    !item.required || (val !== null && val !== undefined && val !== '') || item.error_message || 'Please type something',
                                (val) => /^[0-9]*$/.test(val) || 'Number Only',
                                (val) => {
                                    if (!val || !item.provider_list) return true;
                                    const cleaned = val.startsWith('0') ? val : '0' + val;
                                    const prefix = cleaned.slice(0, 4);
                                    return item.provider_list.includes(prefix) || 'Nomor tidak valid untuk provider Indonesia';
                                },
                                (val) => {
                                if (!val) return true;
                                const cleaned = val.startsWith('0') ? val : '0' + val;
                                const len = cleaned.length;
                                return (len >= 10 && len <= 13) || 'Panjang nomor HP harus 10–13 digit';
                            }
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
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val !== null && val !== undefined && val !== '') ||
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
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :mask="item.mask"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val !== null && val !== undefined && val !== '') ||
                                    item.error_message ||
                                    'Please type something',
                                val => {
                                    if (!val || !item.required) return true;
                                    return validateEmail(val) || 'Must be a valid email.';
                                },
                                val => {
                                    if (!val || !item.domain_allowed) return true;
                                    return validateDomain(val, item.domain_allowed) || 'Company is invalid.';
                                }
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <q-file
                        v-if="item.type === 'file'"
                            v-model="item.value"
                            :dense="inputDense"
                            v-show="!item.hidden"
                            :filled="item.field_style === 'filled'"
                            :borderless="item.field_style === 'borderless'"
                            :outlined="item.field_style === 'outlined'"
                            :standout="item.field_style === 'standout'"
                            :disable="item.disabled"
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    !!item.value ||
                                    item.error_message ||
                                    'Please type something',
                                 () => !item.value || item.value.size <= 6_000_000 || 'Ukuran maksimal 6MB',
                                 () => !item.value || ['image/jpeg', 'image/png'].includes(item.value.type) || 'Hanya JPG/PNG yang diperbolehkan'
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]">
                            <template v-slot:prepend>
                            <q-icon name="attach_file" />
                            </template>
                        </q-file>
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
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            mask="####-##-##"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val !== null && val !== undefined && val !== '') ||
                                    item.error_message ||
                                    'Please type something',
                                (val) => !val || regexDate.test(val) || 'Invalid date format (YYYY-MM-DD)',
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
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            :rules="[
                                (val) =>
                                    !item.required ||
                                    (val !== null && val !== undefined && val !== '') ||
                                    item.error_message ||
                                    'Please type something',
                            ]"
                            :class="[
                                ' rounded-md',
                                { 'bg-white': !$q.dark.isActive },
                                { 'bg-dark-page': $q.dark.isActive },
                            ]"
                        />
                        <div v-if="item.type === 'radio'">
                            <label class="text-subtitle1 q-pa-sm">{{ item.label }} <span v-if="item.required">*</span></label>
                            <q-option-group
                                v-model="item.value"
                                :option-value="item.option_value"
                                :option-label="item.option_label"
                                :options="item.options"
                                :emit-value="item.emit_value"
                                :map-options="item.map_options"
                                :label="item.required ? `${item.label} *` : item.label"
                            />
                        </div>
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
                            :label="item.required ? `${item.label} *` : item.label"
                            :placeholder="item.placeholder"
                            :hint="item.hint"
                            :clearable="item.filter && item.use_input"
                            @input-value="(val) => {
                                if (item.filter && item.use_input) getFilterHandler(item,val)
                            }"
                            @update:model-value="
                                (val) => $emit('on-emit-field', { emit_name: item.emit_event, value: val, all_fields: intProps })
                            "
                            :rules="[
                                (val) => !item.required || (val !== null && val !== undefined && val !== '') || item.error_message || 'Please select something',
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
                            :label="item.required ? `${item.label} *` : item.label"
                            @update:model-value="
                                (val) => $emit('on-emit-field', { emit_name: item.emit_event, value: val, all_fields: intProps })
                            "
                            color="primary"
                        />
                        <q-toggle
                            v-if="item.type === 'toggle'"
                            checked-icon="check"
                            v-model="item.value"
                            :label="item.required ? `${item.label} *` : item.label"
                            @update:model-value="
                                (val) => $emit('on-emit-field', { emit_name: item.emit_event, value: val, all_fields: intProps })
                            "
                            color="primary"
                            :rules="[
                                (val) => {
                                if (!item.required) return true;
                                if (typeof item.expect_value !== 'undefined') {
                                    return val === item.expect_value || item.error_message || 'Anda harus menyetujui sebelum melanjutkan';
                                }
                                return !!val || item.error_message || 'Anda harus menyetujui sebelum melanjutkan';
                                }
                            ]"
                        />
                        </template>
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-if="actions && !silence">
                <div v-if="use_captcha" class="row justify-center q-mb-xl">
                    <div ref="recaptchaEl" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
                </div>
                <div class="row justify-end q-gutter-sm">
                    <q-btn v-if="cancelButton" color="primary" label="Cancel" @click="$emit('cancel')" />
                    <q-btn class="col-xs-12 col-md-2" type="reset"
                    outline color="grey" label="Reset" />
                    <q-btn icon="save" class="col-xs-12 col-md-2"
                    type="submit" color="primary" label="Save"
                    :disabled="!isFormValid"/>
                </div>
            </q-card-section>
        </q-form>
    </q-card>
</template>

<script setup>
/* global grecaptcha */
import { onMounted, ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar';

const emit = defineEmits(['fire', 'on-emit-field', 'on-data-field-change']);
const myForm = ref(null);
const $q = useQuasar();
const regexDate = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
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
    use_captcha: { type: Boolean, default: false },
    use_multipart: { type: Boolean, default: false },
    silence: { type: Boolean, default: false },
});

let intProps = ref([]);

// Preprocessing data untuk memformat value date
const preprocessFields = (fields) => {
    return fields.map(field => {
        if (field.type === 'date' && field.value) {
            // Convert ISO date string to YYYY-MM-DD format
            if (field.value.includes('T')) {
                field.value = field.value.split('T')[0];
            }
        }
        return field;
    });
};

watch(
  () => props.fields,
  (newVal) => {
    intProps.value = preprocessFields(JSON.parse(JSON.stringify(newVal))); // deep copy untuk reactive form 
  },
  { immediate: true }
);

watch(() => intProps.value,
   (newVal) => { 
    emit('on-data-field-change', newVal);
   },
   { immediate: false, deep: true }
 );

// Computed untuk mengecek apakah form valid
const isFormValid = computed(() => {
    // Cek apakah semua field mandatory terisi
    const mandatoryFieldsFilled = intProps.value
        .filter(field => field.required && !field.hidden)
        .every(field => {
            if (field.type === 'checkbox') {
                return field.value === true;
            } else if (field.type === 'toggle') {
                if (typeof field.expect_value !== 'undefined') {
                    return field.value === field.expect_value;
                }
                return !!field.value;
            } else if (field.type === 'file') {
                return field.value instanceof File;
            } else if (field.type === 'select' && field.multiple) {
                return field.value && field.value.length > 0;
            } else if (field.type === 'number') {
                return field.value !== null && field.value !== undefined && field.value !== '' && !isNaN(field.value);
            } else {
                return field.value !== null && field.value !== undefined && field.value !== '';
            }
        });
    
    // Cek captcha jika menggunakan captcha
    const captchaValid = !props.use_captcha || recaptchaToken.value !== null;
    
    return mandatoryFieldsFilled && captchaValid;
});

const getFilterHandler = (item, val) =>{
    if(!item.filter || !item.use_input) return;
    intProps.value = intProps.value.map(m=>{
        if(m.name === item.name) {
            const original_options = props.fields.find(f => f.name === item.name).options;
            m.options = original_options;
            const needle = val.toLowerCase();
            m.options = m.options.filter(f=> f.value.toLowerCase().indexOf(needle)>-1)
            return m;
        }
        return m
    });
}

const handleFire = async () => {
    return myForm.value.validate().then((success) => {
        if (success) {
            const formData = new FormData();
            intProps.value.forEach((item) => {
                if (item.type === 'file' && item.value instanceof File) {
                    formData.append(item.name, item.value);
                } else {
                    formData.append(item.name, item.value);
                }
            });
            if (props.use_multipart)
                { emit('fire', formData); return formData; }
            else
                { emit('fire', intProps.value); return intProps.value; }
        } else {
            $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: 'There is something missing, please check the input form',
            });
            return null;
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

const recaptchaEl = ref(null);
const recaptchaToken = ref(null);
let recaptchaSiteKey = null;
const renderRecaptcha = (G_KEY) => {
  recaptchaSiteKey = G_KEY;
  if (typeof grecaptcha !== 'undefined') {
    grecaptcha.render(recaptchaEl.value, {
      sitekey: recaptchaSiteKey,
      callback: (token) => {
        recaptchaToken.value = token;
      }
    });
  } else {
    // Retry kalau grecaptcha belum tersedia
    setTimeout(() => renderRecaptcha(G_KEY), 500);
  }
};

const validateEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email);
};

const validateDomain = (email, domains_allowed) => {
    const domain = email.split('@')[1];
    return domains_allowed.includes(domain);
};

// Helper function to format field value for display in silence mode
const formatFieldValue = (item) => {
    if (!item.value && item.value !== 0) return '-';
    
    if (item.type === 'select') {
        if (item.multiple && Array.isArray(item.value)) {
            // Handle multiple select
            const labels = item.value.map(val => {
                const option = item.options?.find(opt => opt.value === val);
                return option ? option.label : val;
            });
            return labels.length > 0 ? labels.join(', ') : '-';
        } else {
            // Handle single select
            const option = item.options?.find(opt => opt.value === item.value);
            return option ? option.label : item.value;
        }
    } else if (item.type === 'checkbox') {
        return item.value ? 'Yes' : 'No';
    } else if (item.type === 'toggle') {
        return item.value ? 'Enabled' : 'Disabled';
    } else if (item.type === 'file') {
        return item.value?.name || '-';
    } else if (item.type === 'password') {
        return item.value ? '••••••••' : '-';
    } else {
        return item.value.toString();
    }
};

// expose ke parent
defineExpose({
  handleFire,
  fields: intProps,
})

onMounted(async () => {
    if(props.use_captcha)
    {
        const { G_KEY } = await import('src/config/app.js');
        renderRecaptcha(G_KEY);
    }
});
</script>