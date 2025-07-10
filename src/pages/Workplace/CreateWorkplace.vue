<template>
  <q-page padding>
    <Breadcrumb :title="isEditMode ? 'Edit Workplace' : 'Create Workplace'">

    </Breadcrumb>

    <GenericForm
      :fields="formFields"
      :title="isEditMode ? 'Edit Workplace Information' : 'Workplace Information'"
      :actions="true"
      bordered
      @fire="onSubmit"
      @cancel="onCancel"
    />
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import Breadcrumb from 'components/Breadcrumb.vue';
import GenericForm from 'components/GenericForm.vue';
import { TenantApi, WorkplaceApi } from 'src/api';
import { WORKPLACE_TYPE } from 'src/config/constant';

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

const emit = defineEmits(['workplace-created', 'workplace-updated']);

const router = useRouter();
const $q = useQuasar();

const isEditMode = computed(() => props.editMode);

const tenantOptions = ref([]);

// Fetch tenant options
const fetchTenants = async () => {
  try {
    const response = await TenantApi.getTenant({
      params: {
        filter: { is_deleted: { $ne: true } },
        sort: 'name',
        limit: 1000
      }
    });
    tenantOptions.value = response.data.map(tenant => ({
      label: tenant.name,
      value: tenant._id
    }));
  } catch (error) {
    console.error('Error fetching tenants:', error);
  }
};

const formFields = ref([
  {
    name: 'name',
    type: 'text',
    label: 'Workplace Name *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter workplace name'
  },
  {
    name: 'tenant',
    type: 'select',
    label: 'Tenant *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    options: tenantOptions,
    emit_value: true,
    map_options: true,
    error_message: 'Please select tenant'
  },
  {
    name: 'code',
    type: 'text',
    label: 'Workplace Code *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter workplace code'
  },
  {
    name: 'type',
    type: 'select',
    label: 'Workplace Type *',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    options: WORKPLACE_TYPE,
    emit_value: true,
    map_options: true,
    error_message: 'Please select workplace type'
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
    name: 'coordinate',
    type: 'text',
    label: 'Coordinates [lat, lng]',
    required: false,
    col: 6,
    value: '',
    field_style: 'filled',
    placeholder: 'e.g., [-6.2088, 106.8456]',
    hint: 'Enter latitude and longitude separated by comma'
  }
]);

// Function to populate form fields with data
const populateFormFields = (data) => {
  formFields.value.forEach(field => {
    if (field.name === 'coordinate' && data.coordinate && Array.isArray(data.coordinate)) {
      field.value = data.coordinate.join(', ');
    } else if (data[field.name] !== undefined) {
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

// Fetch tenants on mount and update tenant field options
onMounted(async () => {
  await fetchTenants();
  // Update tenant field options
  const tenantField = formFields.value.find(field => field.name === 'tenant');
  if (tenantField) {
    tenantField.options = tenantOptions;
  }
});

const onSubmit = async (formData) => {
  try {
    $q.loading.show();

    // Convert form data to the expected format
    const workplaceData = {};
    formData.forEach(field => {
      if (field.name === 'coordinate' && field.value) {
        // Parse coordinates
        const coords = field.value.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && !coords.some(isNaN)) {
          workplaceData[field.name] = coords;
        }
      } else {
        workplaceData[field.name] = field.value;
      }
    });

    if (isEditMode.value) {
      // Update existing workplace
      const updateId = props.initialData?._id;
      await WorkplaceApi.updateWorkplace(updateId, workplaceData);
      $q.notify({
        type: 'positive',
        message: 'Workplace updated successfully!'
      });
      emit('workplace-updated');
    } else {
      // Create new workplace
      await WorkplaceApi.createWorkplace(workplaceData);
      $q.notify({
        type: 'positive',
        message: 'Workplace created successfully!'
      });
      emit('workplace-created');
    }

    // Navigate back to workplace list if not in dialog mode
    if (!props.editMode && !props.initialData) {
      router.push({ name: 'workplace-list' });
    }

  } catch (error) {
    console.error('Error saving workplace:', error);
    $q.notify({
      type: 'negative',
      message: error?.response?.data?.message || 'Failed to save workplace'
    });
  } finally {
    $q.loading.hide();
  }
};

const onCancel = () => {
  if (props.editMode || props.initialData) {
    emit('workplace-updated'); // Close dialog
  } else {
    router.push({ name: 'workplace-list' });
  }
};
</script>
