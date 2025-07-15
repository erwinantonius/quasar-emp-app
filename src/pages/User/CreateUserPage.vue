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

    <q-card class="col-12 q-mb-md">
        <!-- Header Section -->
        <q-card-section class="bg-gradient-to-r from-primary to-secondary text-white">
            <div class="row items-center q-col-gutter-md">
            <!-- Icon -->
            <div class="col-auto">
                <q-avatar size="64px" color="white" text-color="primary">
                <q-icon name="account_circle" size="40px" />
                </q-avatar>
            </div>
            
            <!-- Tenant & Workplace Info -->
            <div class="col">
                <div class="text-subtitle1">Creating User For</div>
                <div class="text-h6 text-weight-bold">
                {{ tenantInfo?.name || 'Tenant Name' }}
                </div>
                <div class="text-body2" v-if="tenantInfo?.description">
                {{ tenantInfo.description }}
                </div>
                
                <div v-if="workplaceInfo" class="q-mt-sm">
                <q-icon name="location_on" size="16px" class="q-mr-xs" />
                <span class="text-body2 text-white text-weight-medium">
                    {{ workplaceInfo.name }} — 
                    <span class="text-orange-2">{{ workplaceInfo.address }}</span>
                </span>
                </div>
            </div>

            <!-- Codes -->
            <div class="col-auto flex column items-end">
                <q-chip v-if="tenantInfo?.code" color="white" text-color="primary" size="md" class="text-weight-bold shadow-2 q-mb-xs">
                {{ tenantInfo.code }}
                </q-chip>
                <q-chip v-if="workplaceInfo?.code" color="white" text-color="secondary" size="md" class="text-weight-bold shadow-2">
                {{ workplaceInfo.code }}
                </q-chip>
            </div>
            </div>
        </q-card-section>

        <!-- Instruction Section -->
        <q-card-section class="bg-grey-1 text-dark">
            <div class="row items-center q-col-gutter-sm">
            <div class="col-auto">
                <q-icon name="info" size="20px" class="text-primary" />
            </div>
            <div class="col text-body2">
                Fill in the form below to create a new user for this tenant 
                <span v-if="workplaceInfo"> and assign to the specified workplace</span>.
            </div>
            </div>
        </q-card-section>
    </q-card>

    <GenericForm
      :fields="formFields"
      :title="'User Information'"
      :actions="true"
      :cancel-button="false"
      :bordered="false"
      @fire="onSubmit"
      @cancel="cancelAndGoBack"
    />

    <!-- Action Buttons -->
    <div class="row q-mt-md q-gutter-sm justify-start">
      <q-btn
        icon="arrow_back"
        label="back"
        @click="cancelAndGoBack"
        flat
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import GenericForm from 'src/components/GenericForm.vue';
import { TenantApi, WorkplaceApi, UserApi } from 'src/api';
import { CONTRACT_TYPE, USER_ROLES, GENDER_OPTIONS, USER_POSITION } from 'src/config/constant';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const tenantInfo = ref(null);
const workplaceInfo = ref(null);

// Function to fetch tenant options from API
const fetchTenantOptions = async () => {
  try {
    const response = await TenantApi.getTenant({
      params: {
        filter: { is_deleted: { $ne: true } },
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
    
    // Force reactivity update
    formFields.value = [...formFields.value];
      
  } catch (error) {
    console.error('Error fetching tenants:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load tenant options'
    });
  }
};

// Function to fetch workplace options from API based on tenant
const fetchWorkplaceOptions = async (tenantId = null) => {
  try {
    
    const filter = { is_deleted: { $ne: true } };
    if (tenantId) {
      filter.tenant = tenantId;
    }
    
    const response = await WorkplaceApi.getWorkplace({
      params: {
        filter: filter,
        sort: 'name',
        limit: 1000
      }
    });
    
    if (response && response.data) {
      const workplaceOptions = response.data.map(workplace => ({
        label: workplace.name,
        value: workplace._id
      }));
      
      const workplaceField = formFields.value.find(field => field.name === 'workplace');
      if (workplaceField) {
        workplaceField.options = workplaceOptions;
        
        // Clear workplace value if it doesn't exist in new options
        if (workplaceField.value && !workplaceOptions.find(opt => opt.value === workplaceField.value)) {
          workplaceField.value = '';
        }
        
        // Force reactivity update
        formFields.value = [...formFields.value];
      }
    }
  } catch (error) {
    console.error('Error fetching workplaces:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load workplace options'
    });
  }
};

const formFields = ref([
  {
    name: 'first_name',
    type: 'text',
    label: 'First Name',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter first name'
  },
  {
    name: 'last_name',
    type: 'text',
    label: 'Last Name',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter last name'
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter a valid email address'
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    error_message: 'Please enter password'
  },
  {
    name: 'gender',
    type: 'select',
    label: 'Gender',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    options: GENDER_OPTIONS,
    emit_value: true,
    map_options: true,
    error_message: 'Please select gender'
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Phone',
    required: false,
    col: 6,
    value: '',
    field_style: 'outlined',
    placeholder: 'e.g., +62-812-3456-7890'
  },
  {
    name: 'position',
    type: 'select',
    label: 'Position',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    options: USER_POSITION,
    emit_value: true,
    map_options: true,
    error_message: 'Please select position'
  },
  {
    name: 'contract_type',
    type: 'select',
    label: 'Contract Type',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    options: CONTRACT_TYPE,
    emit_value: true,
    map_options: true,
    error_message: 'Please select contract type'
  },
  {
    name: 'expired_date',
    type: 'date',
    label: 'Expired Date',
    required: false,
    col: 6,
    value: '',
    field_style: 'outlined'
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
    name: 'workplace',
    type: 'select',
    label: 'Workplace',
    required: true,
    col: 6,
    value: '',
    field_style: 'outlined',
    options: [],
    emit_value: true,
    map_options: true,
    error_message: 'Please select workplace'
  },
  {
    name: 'roles',
    type: 'select',
    label: 'Roles',
    required: true,
    col: 12,
    value: [],
    field_style: 'outlined',
    options: USER_ROLES,
    emit_value: true,
    map_options: true,
    multiple: true,
    use_chips: true,
    error_message: 'Please select at least one role'
  }
]);

// Initialize form with data from query parameters
const initializeForm = () => {
  // Pre-fill tenant if provided in query
  if (route.query.tenant_id) {
    const tenantField = formFields.value.find(f => f.name === 'tenant');
    if (tenantField) {
      tenantField.value = route.query.tenant_id;
      tenantField.disabled = true; // Disable tenant field when pre-filled
    }
  }
  
  // Pre-fill workplace if provided in query
  if (route.query.workplace_id) {
    const workplaceField = formFields.value.find(f => f.name === 'workplace');
    if (workplaceField) {
      workplaceField.value = route.query.workplace_id;
      workplaceField.disabled = true; // Disable workplace field when pre-filled
    }
  }
  
  // Force reactivity update
  formFields.value = [...formFields.value];
};

// Watch for tenant changes to update workplace options
watch(() => {
  const tenantField = formFields.value.find(field => field.name === 'tenant');
  return tenantField?.value;
}, (newTenantId) => {
  console.log('Tenant changed to:', newTenantId);
  if (newTenantId) {
    fetchWorkplaceOptions(newTenantId);
  } else {
    // Clear workplace options if no tenant selected
    const workplaceField = formFields.value.find(field => field.name === 'workplace');
    if (workplaceField) {
      workplaceField.options = [];
      workplaceField.value = '';
      formFields.value = [...formFields.value];
    }
  }
});

const onSubmit = async (formData) => {
  try {
    $q.loading.show();

    // Convert form data to the expected format
    const userData = {};
    formData.forEach(field => {
      userData[field.name] = field.value;
    });

    // Create new user
    await UserApi.createUser(userData);
    $q.notify({
      type: 'positive',
      message: 'User created successfully!'
    });

    // Navigate back to tenant users if came from tenant context
    if (route.query.tenant_id) {
      const routeName = 'tenant-users';
      const params = { tenant_id: route.query.tenant_id };
      if (route.query.workplace_id) {
        params.workplace_id = route.query.workplace_id;
      }
      
      router.push({ 
        name: routeName,
        params 
      });
    } else {
      router.push({ name: 'user-list' });
    }

  } catch (error) {
    console.error('Error saving user:', error);
    $q.notify({
      type: 'negative',
      message: error?.response?.data?.message || 'Failed to save user'
    });
  } finally {
    $q.loading.hide();
  }
};

// Cancel and go back
// Cancel and go back
const cancelAndGoBack = () => {
  $q.dialog({
    title: 'Cancel Creation',
    message: 'Are you sure you want to cancel? All unsaved data will be lost.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Navigate back to appropriate list
    if (route.query.tenant_id) {
      const routeName = 'tenant-users';
      const params = { tenant_id: route.query.tenant_id };
      if (route.query.workplace_id) {
        params.workplace_id = route.query.workplace_id;
      }
      
      router.push({ 
        name: routeName,
        params 
      });
    } else {
      router.push({ name: 'user-list' });
    }
  });
};

// Fetch tenant information to display
const fetchTenantInfo = async () => {
  if (route.query.tenant_id) {
    try {
      const response = await TenantApi.getTenantById(route.query.tenant_id);
      if (response && response.data) {
        tenantInfo.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching tenant info:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to load tenant information'
      });
    }
  }
};

// Fetch workplace information to display
const fetchWorkplaceInfo = async () => {
  if (route.query.workplace_id) {
    try {
      const response = await WorkplaceApi.getWorkplaceById(route.query.workplace_id);
      if (response && response.data) {
        workplaceInfo.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching workplace info:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to load workplace information'
      });
    }
  }
};

onMounted(async () => {
  await fetchTenantInfo();
  await fetchWorkplaceInfo();
  await fetchTenantOptions();
  initializeForm();
  
  // Load workplace options if tenant is pre-selected
  if (route.query.tenant_id) {
    await fetchWorkplaceOptions(route.query.tenant_id);
  }
});
</script>

<style lang="scss" scoped>

.bg-gradient-to-r {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

.from-primary {
  --gradient-from: var(--q-primary);
}

.to-secondary {
  --gradient-to: var(--q-secondary);
}

.from-secondary {
  --gradient-from: var(--q-secondary);
}

.to-accent {
  --gradient-to: var(--q-accent);
}

// Custom responsive adjustments
@media (max-width: 768px) {
  .tenant-info-card,
  .workplace-info-card {
    .q-avatar {
      display: none;
    }
    
    .text-h5 {
      font-size: 1.25rem;
    }
  }
}
</style>
