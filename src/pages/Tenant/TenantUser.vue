<template>
  <q-page padding>
    <BreadCrumb :title="breadcrumbTitle">
      <template #right>
        <div class="q-gutter-sm">
          <!-- Page Mode Button -->
          <q-btn
            color="primary"
            icon="open_in_new"
            label="Add User"
            @click="navigateToCreateUserPage"
          />
        </div>
      </template>
    </BreadCrumb>

    <div class="row q-mb-md">
      <div class="col">
        <FilterBox
          :fields="filterFields"
          @find="handleSearch"
        />
      </div>
    </div>

    <q-table
      :rows="users"
      :columns="columns"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      row-key="_id"
      binary-state-sort
      :rows-per-page-options="[10, 25, 50, 100]"
      flat
      bordered
    >
      <template #body-cell-roles="props">
        <q-td :props="props">
          <q-chip
            v-for="role in props.value"
            :key="role"
            dense
            color="primary"
            text-color="white"
            :label="role"
            class="q-mr-xs"
          />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="edit"
            @click="openEditDialog(props.row)"
          >
            <q-tooltip>Edit User</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            color="red"
            icon="delete"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>Delete User</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Create/Edit User Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editMode ? 'Edit User' : 'Create User' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <CreateUser
            :edit-mode="editMode"
            :initial-data="selectedUser"
            @user-created="handleUserCreated"
            @user-updated="handleUserUpdated"
            @cancel="showDialog = false"
            :action="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Delete</div>
        </q-card-section>
        <q-card-section>
          Are you sure you want to delete user "{{ userToDelete?.first_name }} {{ userToDelete?.last_name }}"?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="deleteDialog = false" />
          <q-btn flat label="Delete" color="negative" @click="deleteUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import BreadCrumb from 'src/components/BreadCrumb.vue';
import FilterBox from 'components/FilterBox.vue';
import CreateUser from '../User/CreateUser.vue';
import { UserApi, TenantApi, WorkplaceApi } from 'src/api';
import { CONTRACT_TYPE, USER_ROLES, GENDER_OPTIONS } from 'src/config/constant';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// Get tenant_id and workplace_id from route params
const tenantId = ref(route.params.tenant_id);
const workplaceId = ref(route.params.workplace_id);
const tenantName = ref('');
const workplaceName = ref('');

// Reactive data
const users = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editMode = ref(false);
const selectedUser = ref(null);
const deleteDialog = ref(false);
const userToDelete = ref(null);

// Pagination
const pagination = ref({
  sortBy: 'first_name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

// Current filter
const currentFilter = ref({});

// Table columns
const columns = [
  {
    name: 'first_name',
    required: true,
    label: 'First Name',
    align: 'left',
    field: 'first_name',
    sortable: true
  },
  {
    name: 'last_name',
    required: true,
    label: 'Last Name',
    align: 'left',
    field: 'last_name',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: 'email',
    sortable: true
  },
  {
    name: 'position',
    label: 'Position',
    align: 'left',
    field: 'position',
    sortable: true
  },
  {
    name: 'contract_type',
    label: 'Contract Type',
    align: 'left',
    field: 'contract_type',
    sortable: true
  },
  {
    name: 'roles',
    label: 'Roles',
    align: 'left',
    field: 'roles',
    sortable: false
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: 'actions',
    sortable: false
  }
];

// Filter fields
const filterFields = computed(() => [
  {
    name: 'first_name',
    type: 'text',
    label: 'First Name',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'last_name',
    type: 'text',
    label: 'Last Name',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'position',
    type: 'text',
    label: 'Position',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'contract_type',
    type: 'select',
    label: 'Contract Type',
    col: 3,
    value: '',
    field_style: 'outlined',
    options: [{ label: 'All', value: '' }, ...CONTRACT_TYPE],
    emit_value: true,
    map_options: true
  },
  {
    name: 'gender',
    type: 'select',
    label: 'Gender',
    col: 3,
    value: '',
    field_style: 'outlined',
    options: [{ label: 'All', value: '' }, ...GENDER_OPTIONS],
    emit_value: true,
    map_options: true
  },
  {
    name: 'roles',
    type: 'select',
    label: 'Roles',
    col: 6,
    value: [],
    field_style: 'outlined',
    options: USER_ROLES,
    emit_value: true,
    map_options: true,
    multiple: true,
    use_chips: true
  }
]);

// Computed property for breadcrumb title
const breadcrumbTitle = computed(() => {
  if (workplaceId.value && workplaceName.value) {
    return `Users - ${tenantName.value} - ${workplaceName.value}`;
  }
  return `Users - ${tenantName.value}`;
});

// Fetch tenant name
const fetchTenantName = async () => {
  try {
    const response = await TenantApi.getTenantById(tenantId.value);
    if (response && response.data) {
      tenantName.value = response.data.name;
    }
  } catch (error) {
    console.error('Error fetching tenant:', error);
  }
};

// Fetch workplace name
const fetchWorkplaceName = async () => {
  if (workplaceId.value) {
    try {
      const response = await WorkplaceApi.getWorkplaceById(workplaceId.value);
      if (response && response.data) {
        workplaceName.value = response.data.name;
      }
    } catch (error) {
      console.error('Error fetching workplace:', error);
    }
  }
};

// Fetch users with tenant filter
const fetchUsers = async (props = {}) => {
    console.log('Fetching users for tenant:', tenantId.value, 'workplace:', workplaceId.value);

  loading.value = true;
  try {
    const { page = 1, rowsPerPage = 10, sortBy, descending } = props.pagination || pagination.value;

    // Build base filter with tenant_id and deleted (always present)
    let baseFilter = {
      tenant: tenantId.value, // Always filter by tenant_id
      deleted: { $ne: true } // Always exclude deleted records
    };

    // Add workplace filter if workplace_id exists
    if (workplaceId.value) {
      baseFilter = {
            ...baseFilter,
            'workplace_delegate._id': workplaceId.value
        };
    }

    // Append additional filters from filterbox
    const filter = {
      ...baseFilter,
      ...currentFilter.value
    };

    // Build sort
    const sort = sortBy ? `${descending ? '-' : ''}${sortBy}` : 'first_name';

    const response = await UserApi.getUser({
      params: {
        filter,
        sort,
        limit: rowsPerPage,
        skip: (page - 1) * rowsPerPage
      }
    });

    if (response && response.data) {
      users.value = response.data;

      // Get total count with same filter
      const { data } = await UserApi.countUser({
        params: { filter }
      });

      pagination.value.rowsNumber = data || 0;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch users'
    });
  } finally {
    loading.value = false;
  }
};

// Handle table request
const onRequest = (props) => {
  fetchUsers(props);
};

// Handle search
const handleSearch = (filterData) => {
  const filter = {};

  // filterData is an object, not an array
  Object.keys(filterData).forEach(fieldName => {
    const fieldValue = filterData[fieldName];
    if (fieldValue !== '' && fieldValue !== null && fieldValue !== undefined) {
      if (Array.isArray(fieldValue) && fieldValue.length > 0) {
        filter[fieldName] = { $in: fieldValue };
      } else if (typeof fieldValue === 'string') {
        filter[fieldName] = { $regex: fieldValue, $options: 'i' };
      } else {
        filter[fieldName] = fieldValue;
      }
    }
  });

  currentFilter.value = filter;
  pagination.value.page = 1;
  fetchUsers();
};

// Navigate to CreateUserPage (page mode)
const navigateToCreateUserPage = () => {
  const query = { tenant_id: tenantId.value };

  // Add workplace_id to query if we're in a workplace context
  if (workplaceId.value) {
    query.workplace_id = workplaceId.value;
  }

  router.push({
    name: 'create-user-page',
    query
  });
};

const openEditDialog = (user) => {
  editMode.value = true;
  selectedUser.value = { ...user };
  showDialog.value = true;
};

const handleUserCreated = () => {
  showDialog.value = false;
  fetchUsers();
  $q.notify({
    type: 'positive',
    message: 'User created successfully!'
  });
};

const handleUserUpdated = () => {
  showDialog.value = false;
  fetchUsers();
  $q.notify({
    type: 'positive',
    message: 'User updated successfully!'
  });
};

// Delete functions
const confirmDelete = (user) => {
  userToDelete.value = user;
  deleteDialog.value = true;
};

const deleteUser = async () => {
  try {
    await UserApi.deleteUser(userToDelete.value._id);
    deleteDialog.value = false;
    fetchUsers();
    $q.notify({
      type: 'positive',
      message: 'User deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to delete user'
    });
  }
};

// Lifecycle
onMounted(async () => {
  await fetchTenantName();
  await fetchWorkplaceName();
  await fetchUsers();
});
</script>
