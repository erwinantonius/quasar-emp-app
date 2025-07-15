<template>
    <q-page padding>
        <BreadCrumb title="Workplace">
            <template #right>
                <div v-if="$q.screen.gt.sm">
                    <q-btn
                        v-if="permission.permission.includes('workplace:create:create_workplacess')"
                        color="primary"
                        icon="add"
                        label="Create"
                        @click="openCreateDialog()"
                    />
                </div>
            </template>
        </BreadCrumb>
        <FilterBox :fields="filterBox" @find="findFilter" bordered :initial="initialFilter" />
        <q-table
            flat
            bordered
            class="rounded-md q-mb-lg"
            table-header-class="text-subtitle1"
            :rows="rows"
            :columns="columns"
            row-key="_id"
            :visible-columns="visibleColumns"
            v-model:pagination="pagination"
            :loading="loading"
            @request="onRequest"
        >
            <template v-slot:body-cell-code="props">
                <q-td :props="props">
                    <span class="text-bold">{{ props.value }}</span>
                </q-td>
            </template>
            <template v-slot:body-cell-tenant="props">
                <q-td :props="props">
                    <div class="row items-center no-wrap q-gutter-xs">
                        <div class="flex-shrink-0">
                            <q-img
                                v-if="props.row.tenant?.logo_icon"
                                :src="props.row.tenant.logo_icon"
                                style="height: 24px; width: 24px; min-width: 24px"
                                class="rounded-borders"
                                fit="cover"
                            >
                                <template v-slot:error>
                                    <q-icon name="business" size="xs" color="grey" />
                                </template>
                            </q-img>
                            <q-icon v-else name="business" size="xs" color="grey" />
                        </div>
                        <div class="ellipsis">{{ props.row.tenant?.name || '-' }}</div>
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-address="props">
                <q-td :props="props">
                    <span
                        v-if="props.value && props.value.length > 20"
                        class="cursor-pointer"
                    >
                        {{ props.value.substring(0, 20) }}...
                        <q-tooltip>
                            {{ props.value }}
                        </q-tooltip>
                    </span>
                    <span v-else>{{ props.value || '-' }}</span>
                </q-td>
            </template>
            <template v-slot:body-cell-action="props">
                <q-td :props="props">
                    <div class="row items-center no-wrap justify-end q-gutter-xs">
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
                            dense
                            round
                            flat
                            color="primary"
                            icon="edit"
                            :disable="!permission.permission.includes('workplace:update:update_workplace')"
                            @click="onEdit(props.row)"
                        >
                            <q-tooltip>Edit Workplace</q-tooltip>
                        </q-btn>
                        <q-btn
                            flat
                            round
                            dense
                            color="negative"
                            icon="sym_o_delete"
                            @click="onCancel(props.row)"
                        >
                            <q-tooltip>Delete Workplace</q-tooltip>
                        </q-btn>
                    </div>
                </q-td>
            </template>
        </q-table>
        <q-dialog v-model="createDialog" persistent full-width>
            <q-card class="my-card">
                <HeaderCardSection :title="editMode ? 'Edit Workplace' : 'Create Workplace'" />
                <q-separator />
                <q-card-section class="no-padding">
                    <CreateWorkplace
                        :edit-mode="editMode"
                        :initial-data="selectedWorkplace"
                        @workplace-created="handleWorkplaceCreated"
                        @workplace-updated="handleWorkplaceUpdated"
                        :action="true"
                    />
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BreadCrumb from 'src/components/BreadCrumb.vue';
import CreateWorkplace from './CreateWorkplace.vue';
import FilterBox from 'src/components/FilterBox.vue';
import { date } from 'quasar';
import { useAuthStore } from 'stores/auth';
import { useQuasar } from 'quasar';
import { TenantApi, WorkplaceApi } from 'src/api';
import HeaderCardSection from 'src/components/HeaderCardSection.vue';
import { WORKPLACE_TYPE } from 'src/config/constant';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const permission = computed(() => authStore.permission);
const visibleColumns = ref([
    'code',
    'name',
    'tenant',
    'address',
    'type',
    'contact_name',
    'contact_phone',
    'created_at',
    'action',
]);
const rows = ref([]);
const loading = ref(false);
const createDialog = ref(false);
const editMode = ref(false);
const selectedWorkplace = ref(null);
const tenantOptions = ref([]);

// Fetch tenant options for filter
const fetchTenants = async () => {
  try {
    const response = await TenantApi.getTenant({
      params: {
        filter: { deleted: { $ne: true } },
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
const pagination = ref({
    filter: {
        deleted: {
            $ne: true,
        },
    },
    sortBy: '-created_at',
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 10,
});

const columns = [
    {
        name: 'code',
        align: 'left',
        label: 'Code',
        field: 'code',
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: 'Name',
        field: (row) => row.name || '-',
        sortable: false,
    },
    {
        name: 'tenant',
        align: 'left',
        label: 'Tenant',
        field: (row) => row.tenant?.name || '-',
        sortable: false,
    },
    {
        name: 'address',
        align: 'left',
        label: 'Address',
        field: (row) => row.address || '-',
        sortable: false,
    },
    {
        name: 'type',
        align: 'left',
        label: 'Type',
        field: (row) => row.type || '-',
        sortable: false,
    },
    {
        name: 'contact_name',
        align: 'left',
        label: 'Contact Name',
        field: (row) => row.contact_name || '-',
        sortable: false,
    },
    {
        name: 'contact_phone',
        align: 'left',
        label: 'Contact Phone',
        field: (row) => row.contact_phone || '-',
        sortable: false,
    },
    {
        name: 'contact_email',
        align: 'left',
        label: 'Contact Email',
        field: (row) => row.contact_email || '-',
        sortable: false,
    },
    {
        name: 'created_at',
        align: 'left',
        label: 'Created At',
        field: (row) => date.formatDate(row.created_at, 'ddd, DD MMM YYYY'),
        sortable: false,
    },
    {
        name: 'action',
        align: 'right',
        label: 'Action',
        field: 'action',
        sortable: false,
    },
];

const filterBox = [
    { name: 'code', type: 'text', label: 'Code', operator: 'contains' },
    { name: 'name', type: 'text', label: 'Name', operator: 'contains' },
    {
        name: 'tenant',
        type: 'select',
        label: 'Tenant',
        options: tenantOptions,
        emit_value: true,
        map_options: true
    },
    { name: 'address', type: 'text', label: 'Address', operator: 'contains' },
    {
        name: 'type',
        type: 'select',
        label: 'Type',
        options: WORKPLACE_TYPE,
        emit_value: true,
        map_options: true
    },
    { name: 'contact_name', type: 'text', label: 'Contact Name', operator: 'contains' },
    { name: 'contact_phone', type: 'text', label: 'Contact Phone', operator: 'contains' },
    { name: 'contact_email', type: 'text', label: 'Contact Email', operator: 'contains' },
];
const initialFilter = reactive({
        deleted: {
            $ne: true,
        },
    });

const onRequest = (props) => {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    const sort = descending ? `-${sortBy}` : sortBy;
    getData(page, rowsPerPage, sort);
};

const findFilter = (e) => {
    pagination.value.filter = e;
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const getData = async (page, pageSize, sort) => {
    loading.value = true;
    const filter = { ...pagination.value.filter };
    const result = await Promise.all([
        WorkplaceApi.getWorkplace({
            params: {
                filter: filter,
                sort: sort,
                skip: (page - 1) * pageSize,
                limit: pageSize,
                dummy: Math.random(),
                populate_string: JSON.stringify([
                    { path: 'tenant', select: 'name logo_icon' },
                ]),
            },
        }),
        WorkplaceApi.countWorkplace({
            params: { filter: filter },
        }),
    ]);
    loading.value = false;

    rows.value = result[0].data.map((m) => {
        return m;
    });
    pagination.value.rowsNumber = result[1].data;
    pagination.value.page = page;
    pagination.value.rowsPerPage = pageSize;
    pagination.value.sortBy = sort.replace('-', '');
    pagination.value.descending = sort.indexOf('-') > -1 ? true : false;
};

const openCreateDialog = () => {
    editMode.value = false;
    selectedWorkplace.value = null;
    createDialog.value = true;
};

const onEdit = (row) => {
    // Navigate to edit workplace page
    router.push({
        name: 'edit-workplace-page',
        params: { id: row._id }
    });
};

const handleWorkplaceCreated = () => {
    createDialog.value = false;
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const handleWorkplaceUpdated = () => {
    createDialog.value = false;
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const onCancel = (row) => {
    const doCancel = async (id) => {
        try {
            $q.loading.show();
            const idx = rows.value.findIndex((f) => f._id === id);
            if (idx < -1) throw new Error('Workplace not found');

            const { data } = await WorkplaceApi.delete(id);
            console.log(data);
            rows.value.splice(idx, 1);
        } catch (error) {
            $q.notify({ type: 'negative', message: error?.response?.data?.message ?? error.message });
        } finally {
            $q.loading.hide();
        }
    };

    return $q
        .dialog({
            title: 'Confirm',
            message: `Are you sure you want to delete this workplace: ${row.code}?`,
            cancel: true,
            persistent: true,
        })
        .onOk(() => {
            return doCancel(row._id);
        });
};

// Navigation function
const navigateToWorkplaceUsers = (workplace) => {
    console.log('Navigating to workplace users:', workplace);
    router.push({ 
        name: 'tenant-users', 
        params: { 
            tenant_id: workplace.tenant._id,
            workplace_id: workplace._id
        } 
    });
};

onMounted(async () => {
    getData(1, pagination.value.rowsPerPage, '-created_at');
    fetchTenants();
});
</script>
<script>
export default {
    name: 'WorkplaceList',
};
</script>
