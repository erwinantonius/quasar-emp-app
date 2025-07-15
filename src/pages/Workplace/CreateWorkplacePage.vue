<template>
  <q-page padding>
    <!-- Top Navigation Bar -->
    <div class="row items-center justify-between q-mb-md">
      <q-btn
        icon="arrow_back"
        label="Back"
        @click="cancelAndGoBack"
        flat
        class="q-px-lg"
      />
    </div>

    <!-- Tenant Information Card -->
    <q-card v-if="tenantInfo" class="q-mb-md tenant-info-card" elevated>
      <q-card-section class="bg-gradient-to-r from-primary to-secondary text-white">
        <div class="row items-center">
          <div class="col-auto">
            <q-avatar size="56px" color="white" text-color="primary" class="q-mr-md">
              <q-icon name="business" size="32px" />
            </q-avatar>
          </div>
          <div class="col">
            <div class="text-subtitle1 text-weight-medium q-mb-xs">
              {{ isEditMode ? 'Editing Workplace for Tenant' : 'Creating Workplace for Tenant' }}
            </div>
            <div class="text-h6 text-weight-bold q-mb-xs">
              {{ tenantInfo.name }}
            </div>
            <div class="text-body2 text-blue-1" v-if="tenantInfo.description">
              {{ tenantInfo.description }}
            </div>
          </div>
          <div class="col-auto" v-if="tenantInfo.code">
            <q-chip 
              color="white" 
              text-color="primary"
              :label="tenantInfo.code"
              size="lg"
              class="text-weight-bold shadow-2"
            />
          </div>
        </div>
      </q-card-section>
      
      <!-- Additional Info Section -->
      <q-card-section class="bg-grey-1 text-dark">
            <div class="row items-center q-col-gutter-sm">
            <div class="col-auto">
                <q-icon name="info" size="20px" class="text-primary" />
            </div>
            <div class="col text-body2">
                {{ isEditMode ? 'Update the form below and adjust the workplace location on the map as needed.' : 'Complete the form below and select the workplace location on the map to create a new workplace for this tenant.' }}
            </div>
            </div>
        </q-card-section>
    </q-card>

    <GenericForm
      :key="formKey"
      :fields="formFields"
      :title="isEditMode ? 'Edit Workplace Information' : 'Workplace Information'"
      :actions="false"
      :bordered="false"
      ref="genericFormRef"
    />

    <!-- Location Map Picker -->
    <q-card class="q-mt-md" flat>
      <q-card-section>
        <LocationMapPicker
          v-model="locationCoordinates"
          v-model:radius="attendanceRadius"
          label="Select Workplace Location & Attendance Radius"
          :height="350"
          :show-field="false"
        />
      </q-card-section>
    </q-card>

    <!-- Action Buttons -->
    <div class="row q-mt-md q-gutter-sm justify-between">
      <div>
        <q-btn
          icon="arrow_back"
          label="Back"
          @click="cancelAndGoBack"
          flat
        />
      </div>
      <div class="q-gutter-sm">
        <q-btn
          color="grey-6"
          icon="refresh"
          label="Reset"
          @click="resetForm"
          outline
        />
        <q-btn
          color="primary"
          icon="save"
          :label="isEditMode ? 'Update' : 'Save'"
          @click="onSubmit"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import GenericForm from 'src/components/GenericForm.vue';
import LocationMapPicker from 'src/components/LocationMapPicker.vue';
import { TenantApi, WorkplaceApi,  } from 'src/api';
import { WORKPLACE_TYPE } from 'src/config/constant';

const route = useRoute();
const router = useRouter();
const genericFormRef = ref(null);
const $q = useQuasar();

// Check if this is edit mode
const isEditMode = computed(() => !!route.params.id);
const workplaceId = computed(() => route.params.id);

const tenantInfo = ref(null);
const workplaceData = ref(null);
const locationCoordinates = ref({ lat: -6.2088, lng: 106.8456 }); // Default to Jakarta
const attendanceRadius = ref(100); // Default attendance radius in meters
const formKey = ref(0); // Key untuk force re-render GenericForm

// Store original values for reset functionality
const originalCoordinates = { lat: -6.2088, lng: 106.8456 };
const originalRadius = 100;

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
    name: 'radius',
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

// Watch for map coordinates and radius changes to update form fields
watch([() => locationCoordinates.value, () => attendanceRadius.value], ([newCoordinates, newRadius]) => {
  // Skip if we're currently loading data (prevent overriding loaded data)
  if ($q.loading.isActive) return;
  
  let fieldsUpdated = false;
  
  // Update coordinate field if coordinates provided
  if (newCoordinates && newCoordinates.lat && newCoordinates.lng) {
    const coordinateField = formFields.value.find(f => f.name === 'coordinate');
    if (coordinateField) {
      const newValue = `${newCoordinates.lat}, ${newCoordinates.lng}`;
      // Only update if value is different to prevent infinite loops
      if (coordinateField.value !== newValue) {
        coordinateField.value = newValue;
        fieldsUpdated = true;
      }
    }
  }
  
  // Update radius field if radius provided
  if (newRadius !== null && newRadius !== undefined && newRadius > 0) {
    const radiusField = formFields.value.find(f => f.name === 'radius');
    if (radiusField) {
      // Only update if value is different
      if (radiusField.value !== newRadius) {
        radiusField.value = newRadius;
        fieldsUpdated = true;
      }
    }
  }
  
  // Force reactivity only if fields were updated
  if (fieldsUpdated) {
    formFields.value = [...formFields.value];
  }
}, { immediate: false, deep: true });

// Load workplace data for edit mode
const loadWorkplaceData = async () => {
  if (!isEditMode.value) return;
  
  try {
    $q.loading.show();
    const response = await WorkplaceApi.getWorkplaceById(workplaceId.value);
    if (response && response.data) {
      workplaceData.value = response.data;
      console.log('Loaded workplace data:', workplaceData.value); // Debug log
      
      // Create new array with updated values instead of mutating existing
      const updatedFields = formFields.value.map(field => {
        const fieldCopy = { ...field };
        
        console.log(`Processing field: ${fieldCopy.name}, value from API:`, workplaceData.value[fieldCopy.name]); // Debug log
        
        if (fieldCopy.name === 'coordinate' && workplaceData.value.coordinate) {
          fieldCopy.value = `${workplaceData.value.coordinate[0]}, ${workplaceData.value.coordinate[1]}`;
          // Update map coordinates
          locationCoordinates.value = {
            lat: workplaceData.value.coordinate[0],
            lng: workplaceData.value.coordinate[1]
          };
        } else if (fieldCopy.name === 'radius' && workplaceData.value.radius) {
          fieldCopy.value = workplaceData.value.radius;
          attendanceRadius.value = workplaceData.value.radius;
        } else if (fieldCopy.name === 'radius' && workplaceData.value.attendance_radius) {
          // Try alternative field name
          fieldCopy.value = workplaceData.value.attendance_radius;
          attendanceRadius.value = workplaceData.value.attendance_radius;
        } else if (fieldCopy.name === 'tenant' && workplaceData.value.tenant) {
          // Handle tenant field - could be object or string
          const tenantId = typeof workplaceData.value.tenant === 'object' 
            ? workplaceData.value.tenant._id 
            : workplaceData.value.tenant;
          fieldCopy.value = tenantId;
        } else if (workplaceData.value[fieldCopy.name] !== undefined && workplaceData.value[fieldCopy.name] !== null) {
          fieldCopy.value = workplaceData.value[fieldCopy.name];
        }
        
        console.log(`Field ${fieldCopy.name} updated to:`, fieldCopy.value); // Debug log
        return fieldCopy;
      });
      
      // Update formFields with new array
      formFields.value = updatedFields;
      
      console.log('Updated form fields:', formFields.value); // Debug log
      
      // Load tenant info if not already loaded
      const tenantId = typeof workplaceData.value.tenant === 'object' 
        ? workplaceData.value.tenant._id 
        : workplaceData.value.tenant;
        
      if (tenantId && !tenantInfo.value) {
        await loadTenantInfo(tenantId);
      }
      
      // If tenant info is an object in the response, use it directly
      if (typeof workplaceData.value.tenant === 'object' && workplaceData.value.tenant.name) {
        tenantInfo.value = workplaceData.value.tenant;
      }
      
      // Force GenericForm re-render
      formKey.value += 1;
      
      console.log('After formKey increment, form fields:', formFields.value); // Debug log
    }
  } catch (error) {
    console.error('Error loading workplace data:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load workplace data'
    });
    // Navigate back on error
    router.push({ name: 'workplace-list' });
  } finally {
    $q.loading.hide();
  }
};

// Helper function to load tenant info
const loadTenantInfo = async (tenantId) => {
  try {
    const response = await TenantApi.getTenantById(tenantId);
    if (response && response.data) {
      tenantInfo.value = response.data;
    }
  } catch (error) {
    console.error('Error loading tenant info:', error);
  }
};



const onSubmit = async () => {
  try {
    $q.loading.show();
    const formData = await genericFormRef.value.handleFire();
    if (!formData) {
      $q.notify({
        type: 'negative',
        message: 'Please fill all required fields correctly.'
      });
      return;
    }   
    // Convert form data to the expected format
    const workplaceDataToSave = {};
    formData.forEach(field => {
      if (field.name === 'coordinate' && field.value) {
        // Parse coordinates from text input
        const coords = field.value.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && !coords.some(isNaN)) {
          workplaceDataToSave[field.name] = coords;
        }
      } else {
        workplaceDataToSave[field.name] = field.value;
      }
    });

    // Use map coordinates if available (priority over text input)
    if (locationCoordinates.value.lat && locationCoordinates.value.lng) {
      workplaceDataToSave.coordinate = [locationCoordinates.value.lat, locationCoordinates.value.lng];
    }
    
    // Use map radius if available
    if (attendanceRadius.value) {
      workplaceDataToSave.radius = attendanceRadius.value;
    }

    // Create or update workplace
    if (isEditMode.value) {
      await WorkplaceApi.updateWorkplace(workplaceId.value, workplaceDataToSave);
      $q.notify({
        type: 'positive',
        message: 'Workplace updated successfully!'
      });
    } else {
      await WorkplaceApi.createWorkplace(workplaceDataToSave);
      $q.notify({
        type: 'positive',
        message: 'Workplace created successfully!'
      });
    }

    // Navigate back to appropriate list
    if (route.query.tenant_id) {
      router.push({ 
        name: 'tenant-workplaces', 
        params: { tenant_id: route.query.tenant_id } 
      });
    } else {
      router.push({ name: 'workplace-list' });
    }

  } catch (error) {
    console.error('Error saving workplace:', error);
    $q.notify({
      type: 'negative',
      message: error?.response?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'save'} workplace`
    });
  } finally {
    $q.loading.hide();
  }
};



// Cancel and go back
const cancelAndGoBack = () => {
  $q.dialog({
    title: isEditMode.value ? 'Cancel Edit' : 'Cancel Creation',
    message: isEditMode.value ? 'Are you sure you want to cancel editing? All unsaved changes will be lost.' : 'Are you sure you want to cancel? All unsaved data will be lost.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Navigate back to appropriate list
    if (route.query.tenant_id) {
      router.push({ 
        name: 'tenant-workplaces', 
        params: { tenant_id: route.query.tenant_id } 
      });
    } else {
      router.push({ name: 'workplace-list' });
    }
  });
};

// Reset form and map data
const resetForm = () => {
  $q.dialog({
    title: 'Reset Form',
    message: isEditMode.value ? 'Are you sure you want to reset all changes back to original values?' : 'Are you sure you want to reset all form data and map selection?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    if (isEditMode.value) {
      // Reset to original workplace data
      loadWorkplaceData();
    } else {
      // Reset coordinates and radius to defaults
      locationCoordinates.value = { ...originalCoordinates };
      attendanceRadius.value = originalRadius;
      
      // Reset form fields
      formFields.value.forEach(field => {
        if (field.name === 'radius') {
          field.value = originalRadius;
        } else if (field.name === 'coordinate') {
          field.value = '';
        } else if (field.multiple) {
          field.value = [];
        } else {
          field.value = '';
        }
      });
      
      // Re-initialize with query params if any
      if (route.query.tenant_id) {
        const tenantField = formFields.value.find(f => f.name === 'tenant');
        if (tenantField) {
          tenantField.value = route.query.tenant_id;
          tenantField.disabled = true;
        }
      }
      
      formFields.value = [...formFields.value];
    }
    
    $q.notify({
      type: 'positive',
      message: 'Form has been reset'
    });
  });
};

onMounted(async () => {
  // Fetch tenant options for dropdown first
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
    if (tenantField) {
      tenantField.options = tenantOptions;
    }
  } catch (error) {
    console.error('Error fetching tenants:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load tenant options'
    });
  }

  // Load workplace data first if in edit mode
  if (isEditMode.value) {
    await loadWorkplaceData();
  }
  
  // Fetch tenant information if tenant_id is provided in query (for create mode)
  if (route.query.tenant_id && !tenantInfo.value) {
    await loadTenantInfo(route.query.tenant_id);
    
    // Pre-fill and disable tenant field
    const tenantField = formFields.value.find(f => f.name === 'tenant');
    if (tenantField) {
      tenantField.value = route.query.tenant_id;
      tenantField.disabled = true;
    }
  }

  // Force reactivity update
  formFields.value = [...formFields.value];
  formKey.value += 1; // Force GenericForm re-render
  
  console.log('Initial form fields:', formFields.value); // Debug log   
});
</script>

<style lang="scss" scoped>
.tenant-info-card {
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.bg-gradient-to-r {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

.from-primary {
  --gradient-from: var(--q-primary);
}

.to-secondary {
  --gradient-to: var(--q-secondary);
}

// Custom responsive adjustments
@media (max-width: 768px) {
  .tenant-info-card {
    .q-avatar {
      display: none;
    }
    
    .text-h5 {
      font-size: 1.25rem;
    }
  }
}
</style>
