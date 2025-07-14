<template>
  <q-page padding>
    <BreadCrumb :title="`Workplaces - ${tenantName}`">
      <template #right>
        <q-btn
          color="primary"
          icon="add"
          label="Add Workplace"
          @click="openCreateDialog"
        />
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
      :rows="workplaces"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      row-key="_id"
      binary-state-sort
      :rows-per-page-options="[10, 25, 50, 100]"
      flat
      bordered
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="group"
            @click="navigateToWorkplaceUsers(props.row)"
          >
            <q-tooltip>View Users</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="edit"
            @click="openEditDialog(props.row)"
          >
            <q-tooltip>Edit Workplace</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            color="red"
            icon="delete"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>Delete Workplace</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Create/Edit Workplace Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editMode ? 'Edit Workplace' : 'Create Workplace' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <CreateWorkplace
            :edit-mode="editMode"
            :initial-data="selectedWorkplace"
            @workplace-created="handleWorkplaceCreated"
            @workplace-updated="handleWorkplaceUpdated"
            @cancel="showDialog = false"
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
          Are you sure you want to delete workplace "{{ workplaceToDelete?.name }}"?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="deleteDialog = false" />
          <q-btn flat label="Delete" color="negative" @click="deleteWorkplace" />
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
import CreateWorkplace from '../Workplace/CreateWorkplace.vue';
import { WorkplaceApi, TenantApi } from 'src/api';
import { WORKPLACE_TYPE } from 'src/config/constant';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// Get tenant_id from route params
const tenantId = ref(route.params.tenant_id);
const tenantName = ref('');

// Reactive data
const workplaces = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editMode = ref(false);
const selectedWorkplace = ref(null);
const deleteDialog = ref(false);
const workplaceToDelete = ref(null);

// Pagination
const pagination = ref({
  sortBy: 'name',
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
    name: 'name',
    required: true,
    label: 'Workplace Name',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'code',
    label: 'Code',
    align: 'left',
    field: 'code',
    sortable: true
  },
  {
    name: 'type',
    label: 'Type',
    align: 'left',
    field: 'type',
    sortable: true
  },
  {
    name: 'address',
    label: 'Address',
    align: 'left',
    field: 'address',
    sortable: true
  },
  {
    name: 'contact_name',
    label: 'Contact Name',
    align: 'left',
    field: 'contact_name',
    sortable: true
  },
  {
    name: 'contact_phone',
    label: 'Contact Phone',
    align: 'left',
    field: 'contact_phone',
    sortable: true
  },
  {
    name: 'contact_email',
    label: 'Contact Email',
    align: 'left',
    field: 'contact_email',
    sortable: true
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
    name: 'name',
    type: 'text',
    label: 'Workplace Name',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'code',
    type: 'text',
    label: 'Code',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'type',
    type: 'select',
    label: 'Type',
    col: 3,
    value: '',
    field_style: 'outlined',
    options: [{ label: 'All', value: '' }, ...WORKPLACE_TYPE],
    emit_value: true,
    map_options: true
  },
  {
    name: 'address',
    type: 'text',
    label: 'Address',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'contact_name',
    type: 'text',
    label: 'Contact Name',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'contact_phone',
    type: 'text',
    label: 'Contact Phone',
    col: 3,
    value: '',
    field_style: 'outlined'
  },
  {
    name: 'contact_email',
    type: 'text',
    label: 'Contact Email',
    col: 6,
    value: '',
    field_style: 'outlined'
  }
]);

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

// Fetch workplaces with tenant filter
const fetchWorkplaces = async (props = {}) => {
  loading.value = true;
  try {
    const { page = 1, rowsPerPage = 10, sortBy, descending } = props.pagination || pagination.value;
    
    // Build base filter with tenant_id and deleted (always present)
    const baseFilter = { 
      tenant: tenantId.value, // Always filter by tenant_id
      deleted: { $ne: true } // Always exclude deleted records
    };

    // Append additional filters from filterbox
    const filter = {
      ...baseFilter,
      ...currentFilter.value 
    };

    // Build sort
    const sort = sortBy ? `${descending ? '-' : ''}${sortBy}` : 'name';

    console.log('Final filter being sent to API:', filter);

    const response = await WorkplaceApi.getWorkplace({
      params: {
        filter,
        sort,
        limit: rowsPerPage,
        skip: (page - 1) * rowsPerPage
      }
    });

    if (response && response.data) {
      workplaces.value = response.data;
      
      // Get total count
      const countResponse = await WorkplaceApi.countWorkplace({
        params: { filter }
      });
      
      pagination.value.rowsNumber = countResponse?.data?.count || 0;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
    }
  } catch (error) {
    console.error('Error fetching workplaces:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch workplaces'
    });
  } finally {
    loading.value = false;
  }
};

// Handle table request
const onRequest = (props) => {
  fetchWorkplaces(props);
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
  fetchWorkplaces();
};

// Dialog functions
const openCreateDialog = () => {
  editMode.value = false;
  selectedWorkplace.value = { tenant: tenantId.value }; // Pre-fill tenant
  showDialog.value = true;
};

const openEditDialog = (workplace) => {
  editMode.value = true;
  selectedWorkplace.value = { ...workplace };
  showDialog.value = true;
};

const handleWorkplaceCreated = () => {
  showDialog.value = false;
  fetchWorkplaces();
  $q.notify({
    type: 'positive',
    message: 'Workplace created successfully!'
  });
};

const handleWorkplaceUpdated = () => {
  showDialog.value = false;
  fetchWorkplaces();
  $q.notify({
    type: 'positive',
    message: 'Workplace updated successfully!'
  });
};

// Delete functions
const confirmDelete = (workplace) => {
  workplaceToDelete.value = workplace;
  deleteDialog.value = true;
};

const deleteWorkplace = async () => {
  try {
    await WorkplaceApi.deleteWorkplace(workplaceToDelete.value._id);
    deleteDialog.value = false;
    fetchWorkplaces();
    $q.notify({
      type: 'positive',
      message: 'Workplace deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting workplace:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to delete workplace'
    });
  }
};

// Navigation function
const navigateToWorkplaceUsers = (workplace) => {
  router.push({ 
    name: 'tenant-users-workplace', 
    params: { 
      tenant_id: tenantId.value,
      workplace_id: workplace._id
    } 
  });
};

// Lifecycle
onMounted(async () => {
  await fetchTenantName();
  await fetchWorkplaces();
});
</script>
