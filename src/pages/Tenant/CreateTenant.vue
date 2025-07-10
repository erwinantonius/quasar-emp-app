<template>
  <q-page padding>
    <Breadcrumb :title="isEditMode ? 'Edit Tenant' : 'Create Tenant'">

    </Breadcrumb>

    <GenericForm
      :fields="formFields"
      :title="isEditMode ? 'Edit Tenant Information' : 'Tenant Information'"
      :actions="true"
      bordered
      @fire="onSubmit"
      @cancel="onCancel"
    />
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import Breadcrumb from 'components/Breadcrumb.vue';
import GenericForm from 'components/GenericForm.vue';
import { TenantApi } from 'src/api';
import { PAYMENT_METHOD } from 'src/config/constant';

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['tenant-created', 'tenant-updated']);

const router = useRouter();
const $q = useQuasar();

const isEditMode = computed(() => props.editMode);

const formFields = ref([
  {
    name: 'name',
    type: 'text',
    label: 'Tenant Name *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter tenant name'
  },
  {
    name: 'address',
    type: 'textarea',
    label: 'Address *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    rows: 3,
    error_message: 'Please enter address'
  },
  {
    name: 'payment_method',
    type: 'select',
    label: 'Payment Method *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    options: PAYMENT_METHOD,
    emit_value: true,
    map_options: true,
    error_message: 'Please select payment method'
  },
  {
    name: 'contact_name',
    type: 'text',
    label: 'Contact Name *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter contact name'
  },
  {
    name: 'contact_phone',
    type: 'text',
    label: 'Contact Phone *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter contact phone'
  },
  {
    name: 'contact_email',
    type: 'email',
    label: 'Contact Email *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter a valid email address'
  },
  {
    name: 'logo_icon',
    type: 'text',
    label: 'Logo URL',
    required: false,
    col: 6,
    value: '',
    field_style: 'filled',
    placeholder: 'e.g., https://example.com/logo.png',
    hint: 'URL of the tenant logo image'
  },
  {
    name: 'user_seat',
    type: 'number',
    label: 'User Seats *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter number of user seats'
  },
  {
    name: 'charge_amount',
    type: 'number',
    label: 'Charge Amount per Seat (IDR) *',
    required: true,
    col: 6,
    value: 100000,
    field_style: 'filled',
    error_message: 'Please enter charge amount per seat'
  },
  {
    name: 'last_billing_date',
    type: 'date',
    label: 'Last Billing Date',
    required: false,
    col: 6,
    value: '',
    field_style: 'filled'
  },
  {
    name: 'next_billing_date',
    type: 'date',
    label: 'Next Billing Date',
    required: false,
    col: 6,
    value: '',
    field_style: 'filled'
  },
  {
    name: 'last_payment_amount',
    type: 'number',
    label: 'Last Payment Amount (IDR)',
    required: false,
    col: 6,
    value: '',
    field_style: 'filled'
  }
]);

// Function to populate form fields with data
const populateFormFields = (data) => {
  formFields.value.forEach(field => {
    if (data[field.name] !== undefined) {
      field.value = data[field.name];
    }
  });
};

// Watch for initial data changes to populate form (for dialog mode)
watch(() => props.initialData, (newData) => {
  if (newData && props.editMode) {
    populateFormFields(newData);
  }
}, { immediate: true });

const onSubmit = async (formData) => {
  try {
    $q.loading.show();

    // Convert form data to the expected format
    const tenantData = {};
    formData.forEach(field => {
      tenantData[field.name] = field.value;
    });

    if (isEditMode.value) {
      // Update existing tenant
      const updateId = props.initialData?._id;
      await TenantApi.updateTenant(updateId, tenantData);
      $q.notify({
        type: 'positive',
        message: 'Tenant updated successfully!'
      });
      emit('tenant-updated');
    } else {
      // Create new tenant
      await TenantApi.createTenant(tenantData);
      $q.notify({
        type: 'positive',
        message: 'Tenant created successfully!'
      });
      emit('tenant-created');
    }

    // Navigate back to tenant list if not in dialog mode
    if (!props.editMode && !props.initialData) {
      router.push({ name: 'tenant-list' });
    }

  } catch (error) {
    console.error('Error saving tenant:', error);
    $q.notify({
      type: 'negative',
      message: error?.response?.data?.message || 'Failed to save tenant'
    });
  } finally {
    $q.loading.hide();
  }
};

const onCancel = () => {
  if (props.editMode || props.initialData) {
    emit('tenant-updated'); // Close dialog
  } else {
    router.push({ name: 'tenant-list' });
  }
};
</script>
