<template>
    <q-page padding>
        <BreadCrumb title="User">
            <template #right>
                <div v-if="$q.screen.gt.sm">
                    <q-btn
                        v-if="permission.permission.includes('user:create:create_userss')"
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
            <template v-slot:body-cell-name="props">
                <q-td :props="props">
                    <div class="row items-center no-wrap q-gutter-xs">
                        <q-avatar size="32px">
                            <q-icon name="person" color="primary" />
                        </q-avatar>
                        <div>
                            <div class="text-bold">{{ props.row.first_name }} {{ props.row.last_name }}</div>
                            <div class="text-caption text-grey">{{ props.row.email }}</div>
                        </div>
                    </div>
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
            <template v-slot:body-cell-workplace="props">
                <q-td :props="props">
                    <div class="row items-center no-wrap q-gutter-xs">
                        <q-icon name="location_on" size="xs" color="grey" />
                        <div class="ellipsis">{{ props.row.workplace?.name || '-' }}</div>
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-roles="props">
                <q-td :props="props">
                    <div class="row q-gutter-xs">
                        <q-chip 
                            v-for="role in props.row.roles" 
                            :key="role"
                            size="sm"
                            color="primary"
                            text-color="white"
                            :label="role"
                        />
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-contract_type="props">
                <q-td :props="props">
                    <q-badge 
                        :color="props.value === 'PERMANENT' ? 'positive' : 'warning'"
                        :label="props.value || '-'"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-action="props">
                <q-td :props="props">
                    <div class="row items-center no-wrap justify-end q-gutter-xs">
                        <q-btn
                            flat
                            round
                            dense
                            color="negative"
                            icon="sym_o_delete"
                            @click="onCancel(props.row)"
                        />
                        <q-btn
                            dense
                            round
                            flat
                            color="primary"
                            icon="edit"
                            :disable="!permission.permission.includes('user:update:update_user')"
                            @click="onEdit(props.row)"
                        />
                    </div>
                </q-td>
            </template>
        </q-table>
        <q-dialog v-model="createDialog" persistent full-width>
            <q-card class="my-card">
                <HeaderCardSection :title="editMode ? 'Edit User' : 'Create User'" />
                <q-separator />
                <q-card-section class="no-padding">
                    <CreateUser
                        :edit-mode="editMode"
                        :initial-data="selectedUser"
                        @user-created="handleUserCreated"
                        @user-updated="handleUserUpdated"
                    />
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import BreadCrumb from 'src/components/BreadCrumb.vue';
import CreateUser from './CreateUser.vue';
import FilterBox from 'src/components/FilterBox.vue';
import { date } from 'quasar';
import { useAuthStore } from 'stores/auth';
import { useQuasar } from 'quasar';
import { TenantApi, WorkplaceApi, UserApi } from 'src/api';
import HeaderCardSection from 'src/components/HeaderCardSection.vue';
import { CONTRACT_TYPE, GENDER_OPTIONS } from 'src/config/constant';

const $q = useQuasar();
const authStore = useAuthStore();
const permission = computed(() => authStore.permission);
const visibleColumns = ref([
    'name',
    'tenant',
    'workplace',
    'position',
    'gender',
    'phone',
    'contract_type',
    'roles',
    'expired_date',
    'created_at',
    'action',
]);
const rows = ref([]);
const loading = ref(false);
const createDialog = ref(false);
const editMode = ref(false);
const selectedUser = ref(null);
const tenantOptions = ref([]);
const workplaceOptions = ref([]);

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

// Fetch workplace options for filter
const fetchWorkplaces = async () => {
    try {
        const response = await WorkplaceApi.getWorkplace({
            params: {
                filter: { deleted: { $ne: true } },
                sort: 'name',
                limit: 1000
            }
        });
        workplaceOptions.value = response.data.map(workplace => ({
            label: workplace.name,
            value: workplace._id
        }));
    } catch (error) {
        console.error('Error fetching workplaces:', error);
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
        name: 'name',
        align: 'left',
        label: 'Name',
        field: (row) => `${row.first_name} ${row.last_name}`,
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
        name: 'workplace',
        align: 'left',
        label: 'Workplace',
        field: (row) => row.workplace?.name || '-',
        sortable: false,
    },
    {
        name: 'position',
        align: 'left',
        label: 'Position',
        field: (row) => row.position || '-',
        sortable: false,
    },
    {
        name: 'gender',
        align: 'left',
        label: 'Gender',
        field: (row) => row.gender || '-',
        sortable: false,
    },
    {
        name: 'phone',
        align: 'left',
        label: 'Phone',
        field: (row) => row.phone || '-',
        sortable: false,
    },
    {
        name: 'contract_type',
        align: 'left',
        label: 'Contract Type',
        field: (row) => row.contract_type || '-',
        sortable: false,
    },
    {
        name: 'roles',
        align: 'left',
        label: 'Roles',
        field: (row) => row.roles || [],
        sortable: false,
    },
    {
        name: 'expired_date',
        align: 'left',
        label: 'Expired Date',
        field: (row) => row.expired_date ? date.formatDate(row.expired_date, 'DD MMM YYYY') : '-',
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
    { name: 'first_name', type: 'text', label: 'First Name', operator: 'contains' },
    { name: 'last_name', type: 'text', label: 'Last Name', operator: 'contains' },
    { name: 'email', type: 'text', label: 'Email', operator: 'contains' },
    {
        name: 'tenant',
        type: 'select',
        label: 'Tenant',
        options: tenantOptions,
        emit_value: true,
        map_options: true
    },
    {
        name: 'workplace',
        type: 'select',
        label: 'Workplace',
        options: workplaceOptions,
        emit_value: true,
        map_options: true
    },
    { name: 'position', type: 'text', label: 'Position', operator: 'contains' },
    {
        name: 'gender',
        type: 'select',
        label: 'Gender',
        options: GENDER_OPTIONS,
        emit_value: true,
        map_options: true
    },
    {
        name: 'contract_type',
        type: 'select',
        label: 'Contract Type',
        options: CONTRACT_TYPE,
        emit_value: true,
        map_options: true
    },
    { name: 'phone', type: 'text', label: 'Phone', operator: 'contains' },
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
    console.log(e);
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const getData = async (page, pageSize, sort) => {
    loading.value = true;
    const filter = { ...pagination.value.filter };
    const result = await Promise.all([
        UserApi.getUser({
            params: {
                filter: filter,
                sort: sort,
                skip: (page - 1) * pageSize,
                limit: pageSize,
                dummy: Math.random(),
                populate_string: JSON.stringify([
                    { path: 'tenant', select: 'name logo_icon' },
                    { path: 'workplace', select: 'name code' },
                ]),
            },
        }),
        UserApi.countUser({
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
    selectedUser.value = null;
    createDialog.value = true;
};

const onEdit = (row) => {
    editMode.value = true;
    selectedUser.value = { ...row };
    createDialog.value = true;
};

const handleUserCreated = () => {
    createDialog.value = false;
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const handleUserUpdated = () => {
    createDialog.value = false;
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const onCancel = (row) => {
    const doCancel = async (id) => {
        try {
            $q.loading.show();
            const idx = rows.value.findIndex((f) => f._id === id);
            if (idx < -1) throw new Error('User not found');

            const { data } = await UserApi.delete(id);
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
            message: `Are you sure you want to delete this user: ${row.first_name} ${row.last_name}?`,
            cancel: true,
            persistent: true,
        })
        .onOk(() => {
            return doCancel(row._id);
        });
};

onMounted(() => {
    getData(1, pagination.value.rowsPerPage, '-created_at');
    fetchTenants();
    fetchWorkplaces();
});
</script>

<script>
export default {
    name: 'UserList',
};
</script>
