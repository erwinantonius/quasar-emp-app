<template>
  <div>
    <!-- Show breadcrumb only when not in dialog mode -->
    <BreadCrumb v-if="!props.initialData" :title="isEditMode ? 'Edit Workplace' : 'Create Workplace'">
    </BreadCrumb>

    <GenericForm
      :fields="formFields"
      :title="'Workplace Information'"
      :actions="props.action"
      :field_style="'outlined'"
      @fire="onSubmit"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import GenericForm from 'components/GenericForm.vue';
import { TenantApi, WorkplaceApi } from 'src/api';
import { WORKPLACE_TYPE } from 'src/config/constant';
import BreadCrumb from 'src/components/BreadCrumb.vue';

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: null
  },
  externalCoordinates: {
    type: Array,
    default: null
  },
  externalRadius: {
    type: Number,
    default: null
  },
  action:{
    type: Boolean,
    default: false // 'create' or 'edit'
  }
});

const emit = defineEmits(['workplace-created', 'workplace-updated', 'cancel']);

const router = useRouter();
const $q = useQuasar();

const isEditMode = computed(() => props.editMode);
const shouldDisableTenant = computed(() => {
  return isEditMode.value || (props.initialData?.tenant && !isEditMode.value);
});

// Function to fetch tenant options from API
const fetchTenantOptions = async () => {
  try {
    const response = await TenantApi.getTenant({
      params: {
        filter: { deleted: { $ne: true } },
        sort: 'name',
        limit: 1000
      }
    });
    const tenantOptions = response.data.map(tenant => ({
      label: tenant.name,
      value: tenant._id
    }));
    const tenantField = formFields.value.find(field => field.name === 'tenant');
    tenantField.options = tenantOptions;
    formFields.value = [...formFields.value];
  } catch (error) {
    console.error('Error fetching tenants:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load tenant options'
    });
  }
};

const formFields = ref([
  {
    name: 'name',
    type: 'text',
    label: 'Workplace Name',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter workplace name'
  },
  {
    name: 'tenant',
    type: 'select',
    label: 'Tenant',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    options: [],
    emit_value: true,
    map_options: true,
    disabled: false,
    error_message: 'Please select tenant'
  },
  {
    name: 'code',
    type: 'text',
    label: 'Workplace Code',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter workplace code'
  },
  {
    name: 'type',
    type: 'select',
    label: 'Workplace Type',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    options: WORKPLACE_TYPE,
    emit_value: true,
    map_options: true,
    error_message: 'Please select workplace type'
  },
  {
    name: 'address',
    type: 'textarea',
    label: 'Address',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    rows: 3,
    error_message: 'Please enter address'
  },
  {
    name: 'contact_name',
    type: 'text',
    label: 'Contact Name',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter contact name'
  },
  {
    name: 'contact_phone',
    type: 'text',
    label: 'Contact Phone',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter contact phone'
  },
  {
    name: 'contact_email',
    type: 'email',
    label: 'Contact Email',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter a valid email address'
  },
  {
    name: 'coordinate',
    type: 'text',
    label: 'Coordinates [lat, lng]',
    required: false,
    col: 6,
    value: '',
    field_style: 'outlined',
    placeholder: 'e.g., [-6.2088, 106.8456]',
    hint: 'Enter latitude and longitude separated by comma'
  },
  {
    name: 'attendance_radius',
    type: 'number',
    label: 'Attendance Radius (meters)',
    required: false,
    col: 6,
    value: 100,
    field_style: 'outlined',
    min: 1,
    max: 10000,
    hint: 'Radius for attendance validation'
  }
]);

// Function to populate form fields with data
const populateFormFields = (data) => {
  formFields.value.forEach(field => {
    if (field.name === 'coordinate' && data.coordinate && Array.isArray(data.coordinate)) {
      field.value = data.coordinate.join(', ');
    } else if (field.name === 'tenant') {
      // Handle tenant field specially - it might be an object or just an ID
      if (data.tenant) {
        field.value = typeof data.tenant === 'object' ? data.tenant._id : data.tenant;
      }
    } else if (data[field.name] !== undefined) {
      field.value = data[field.name];
    }
  });
};

// Watch for initial data changes to populate form (for dialog mode)
watch(() => props.initialData, (newData) => {
  if (newData) {
    populateFormFields(newData);
  }
}, { immediate: true });

// Watch for edit mode or initialData changes to update tenant field disabled state
watch([isEditMode, () => props.initialData], () => {
  const tenantField = formFields.value.find(f => f.name === 'tenant');
  if (tenantField) {
    tenantField.disabled = shouldDisableTenant.value;
    formFields.value = [...formFields.value]; // Force reactivity
  }
}, { immediate: true });

// Watch for external coordinates and radius changes to update form fields
watch([() => props.externalCoordinates, () => props.externalRadius], ([newCoordinates, newRadius]) => {
  let fieldsUpdated = false;

  // Update coordinate field if external coordinates provided
  if (newCoordinates && Array.isArray(newCoordinates) && newCoordinates.length >= 2) {
    const coordinateField = formFields.value.find(f => f.name === 'coordinate');
    if (coordinateField) {
      coordinateField.value = newCoordinates.join(', ');
      fieldsUpdated = true;
    }
  }

  // Update radius field if external radius provided
  if (newRadius !== null && newRadius !== undefined && newRadius > 0) {
    const radiusField = formFields.value.find(f => f.name === 'attendance_radius');
    if (radiusField) {
      radiusField.value = newRadius;
      fieldsUpdated = true;
    }
  }

  // Force reactivity only if fields were updated
  if (fieldsUpdated) {
    formFields.value = [...formFields.value];
  }
}, { immediate: true, deep: true });

// Load tenant options when component mounts
onMounted(async () => {
  await fetchTenantOptions();
  console.log(props.action)
});

const onSubmit = async (formData) => {
  try {
    $q.loading.show();

    // Convert form data to the expected format
    const workplaceData = {};
    formData.forEach(field => {
      if (field.name === 'coordinate' && field.value) {
        // Parse coordinates from text input (for dialog mode)
        const coords = field.value.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && !coords.some(isNaN)) {
          workplaceData[field.name] = coords;
        }
      } else {
        workplaceData[field.name] = field.value;
      }
    });

    // Use external coordinates if provided (for page mode with map)
    if (props.externalCoordinates && Array.isArray(props.externalCoordinates)) {
      workplaceData.coordinate = props.externalCoordinates;
    }

    // Use external radius if provided (for page mode with map)
    if (props.externalRadius !== null && props.externalRadius !== undefined) {
      workplaceData.attendance_radius = props.externalRadius;
    }

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
    emit('cancel'); // Close dialog
  } else {
    router.push({ name: 'workplace-list' });
  }
};
</script>
