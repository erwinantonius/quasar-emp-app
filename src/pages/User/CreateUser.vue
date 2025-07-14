<template>
  <div>
    <!-- Show breadcrumb only when not in dialog mode -->
    <BreadCrumb v-if="!props.initialData" :title="isEditMode ? 'Edit User' : 'Create User'">
    </BreadCrumb>

    <GenericForm
      :fields="formFields"
      :title="'User Information'"
      :actions="true"
      :bordered="!props.initialData"
      @fire="onSubmit"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import BreadCrumb from 'src/components/BreadCrumb.vue';
import GenericForm from 'components/GenericForm.vue';
import { UserApi, TenantApi, WorkplaceApi } from 'src/api';
import { CONTRACT_TYPE, USER_ROLES, GENDER_OPTIONS, USER_POSITION } from 'src/config/constant';

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

const emit = defineEmits(['user-created', 'user-updated', 'cancel']);

const router = useRouter();
const $q = useQuasar();

const isEditMode = computed(() => props.editMode);
const shouldDisableTenant = computed(() => {
  return isEditMode.value || (props.initialData?.tenant && !isEditMode.value);
});
const shouldDisableWorkplace = computed(() => {
  return isEditMode.value || (props.initialData?.workplace && !isEditMode.value);
});

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
    field_style: 'filled',
    error_message: 'Please enter first name'
  },
  {
    name: 'last_name',
    type: 'text',
    label: 'Last Name',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter last name'
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter a valid email address'
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
    error_message: 'Please enter password',
    hint: 'Leave blank to keep existing password (edit mode)'
  },
  {
    name: 'gender',
    type: 'select',
    label: 'Gender',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
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
    field_style: 'filled',
    placeholder: 'e.g., +62-812-3456-7890'
  },
  {
    name: 'position',
    type: 'select',
    label: 'Position',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
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
    field_style: 'filled',
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
    field_style: 'filled'
  },
  {
    name: 'tenant',
    type: 'select',
    label: 'Tenant',
    required: true,
    col: 6,
    value: '',
    field_style: 'filled',
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
    field_style: 'filled',
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
    field_style: 'filled',
    options: USER_ROLES,
    emit_value: true,
    map_options: true,
    multiple: true,
    use_chips: true,
    error_message: 'Please select at least one role'
  }
]);

// Function to populate form fields with data
const populateFormFields = async (data) => {
  formFields.value.forEach(field => {
    if (field.name === 'tenant') {
      // Handle tenant field specially - it might be an object or just an ID
      if (data.tenant) {
        field.value = typeof data.tenant === 'object' ? data.tenant._id : data.tenant;
      }
    } else if (field.name === 'workplace') {
      // Handle workplace field specially - it might be an object or just an ID
      if (data.workplace) {
        field.value = typeof data.workplace === 'object' ? data.workplace._id : data.workplace;
      }
    } else if (data[field.name] !== undefined) {
      field.value = data[field.name];
    }
  });
  
  // Load workplace options for the selected tenant in edit mode
  if (data.tenant) {
    const tenantId = typeof data.tenant === 'object' ? data.tenant._id : data.tenant;
    await fetchWorkplaceOptions(tenantId);
  }
  
  // Handle special cases for edit mode
  if (isEditMode.value) {
    // Make password optional in edit mode
    const passwordField = formFields.value.find(f => f.name === 'password');
    if (passwordField) {
      passwordField.required = false;
      passwordField.hint = 'Leave blank to keep existing password';
    }
  }
};

// Watch for initial data changes to populate form (for dialog mode)
watch(() => props.initialData, async (newData) => {
  if (newData) {
    await populateFormFields(newData);
  }
}, { immediate: true });

// Watch for edit mode or initialData changes to update field disabled states
watch([isEditMode, () => props.initialData], () => {
  const tenantField = formFields.value.find(f => f.name === 'tenant');
  if (tenantField) {
    tenantField.disabled = shouldDisableTenant.value;
  }
  
  const workplaceField = formFields.value.find(f => f.name === 'workplace');
  if (workplaceField) {
    workplaceField.disabled = shouldDisableWorkplace.value;
  }
  
  formFields.value = [...formFields.value]; // Force reactivity
}, { immediate: true });

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
      if (field.name === 'password' && isEditMode.value && !field.value) {
        // Skip password field if empty in edit mode
        return;
      }
      userData[field.name] = field.value;
    });

    if (isEditMode.value) {
      // Update existing user
      const updateId = props.initialData?._id;
      await UserApi.updateUser(updateId, userData);
      $q.notify({
        type: 'positive',
        message: 'User updated successfully!'
      });
      emit('user-updated');
    } else {
      // Create new user
      await UserApi.createUser(userData);
      $q.notify({
        type: 'positive',
        message: 'User created successfully!'
      });
      emit('user-created');
    }

    // Navigate back to user list if not in dialog mode
    if (!props.editMode && !props.initialData) {
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

const onCancel = () => {
  if (props.editMode || props.initialData) {
    emit('cancel'); // Close dialog
  } else {
    router.push({ name: 'user-list' });
  }
};

onMounted(async () => {
  await fetchTenantOptions();
  // Don't load workplace options here - they will be loaded when tenant is selected
});
</script>
