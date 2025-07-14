<template>
    <q-page padding>
        <BreadCrumb title="Tenant">
            <template #right>
                <div v-if="$q.screen.gt.sm">
                    <q-btn
                        v-if="permission.permission.includes('tenant:create:create_tenant')"
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
                    <span class="text-bold">{{ props.value }}</span>
                </q-td>
            </template>
            <template v-slot:body-cell-logo_icon="props">
                <q-td :props="props">
                    <q-img
                        v-if="props.value"
                        :src="props.value"
                        style="height: 32px; width: 32px"
                        class="rounded-borders"
                        fit="cover"
                    >
                        <template v-slot:error>
                            <q-icon name="business" size="sm" color="grey" />
                        </template>
                    </q-img>
                    <q-icon v-else name="business" size="sm" color="grey" />
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
                            @click="navigateToTenantUsers(props.row._id)"
                        >
                            <q-tooltip>View Users</q-tooltip>
                        </q-btn>
                        <q-btn
                            flat
                            round
                            dense
                            color="primary"
                            icon="business"
                            @click="navigateToTenantWorkplaces(props.row._id)"
                        >
                            <q-tooltip>View Workplaces</q-tooltip>
                        </q-btn>
                        <q-btn
                            dense
                            round
                            flat
                            color="primary"
                            icon="edit"
                            :disable="!permission.permission.includes('tenant:update:update_tenant')"
                            @click="onEdit(props.row)"
                        >
                            <q-tooltip>Edit Tenant</q-tooltip>
                        </q-btn>
                        <q-btn
                            flat
                            round
                            dense
                            color="negative"
                            icon="sym_o_delete"
                            @click="onCancel(props.row)"
                        >
                            <q-tooltip>Delete Tenant</q-tooltip>
                        </q-btn>
                    </div>
                </q-td>
            </template>
        </q-table>
        <q-dialog v-model="createDialog" persistent full-width>
            <q-card class="my-card">
                <HeaderCardSection :title="editMode ? 'Edit Tenant' : 'Create Tenant'" />
                <q-separator />
                <q-card-section class="no-padding">
                    <CreateTenant
                        :edit-mode="editMode"
                        :initial-data="selectedTenant"
                        @tenant-created="handleTenantCreated"
                        @tenant-updated="handleTenantUpdated"
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
import CreateTenant from './CreateTenant.vue';
import FilterBox from 'src/components/FilterBox.vue';
import { date } from 'quasar';
import { useAuthStore } from 'stores/auth';
import { useQuasar } from 'quasar';
import { TenantApi } from 'src/api';
import HeaderCardSection from 'src/components/HeaderCardSection.vue';
import { PAYMENT_METHOD } from 'src/config/constant';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const permission = computed(() => authStore.permission);
const visibleColumns = ref([
    'name',
    'logo_icon',
    'user_seat',
    'last_billing_date',
    'next_billing_date',
    'last_payment_amount',
    'payment_method',
    'contact_name',
    'contact_phone',
    'created_at',
    'action',
]);
const rows = ref([]);
const loading = ref(false);
const createDialog = ref(false);
const editMode = ref(false);
const selectedTenant = ref(null);
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
        name: 'logo_icon',
        align: 'center',
        label: 'Logo',
        field: (row) => row.logo_icon || '',
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: 'Name',
        field: 'name',
        sortable: false,
    },
    {
        name: 'user_seat',
        align: 'center',
        label: 'User Seats',
        field: (row) => row.user_seat || '-',
        sortable: false,
    },
    {
        name: 'last_billing_date',
        align: 'left',
        label: 'Last Billing',
        field: (row) => row.last_billing_date ? date.formatDate(row.last_billing_date, 'DD MMM YYYY') : '-',
        sortable: false,
    },
    {
        name: 'next_billing_date',
        align: 'left',
        label: 'Next Billing',
        field: (row) => row.next_billing_date ? date.formatDate(row.next_billing_date, 'DD MMM YYYY') : '-',
        sortable: false,
    },
    {
        name: 'last_payment_amount',
        align: 'right',
        label: 'Last Payment (IDR)',
        field: (row) => row.last_payment_amount ? new Intl.NumberFormat('id-ID').format(row.last_payment_amount) : '-',
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
        name: 'payment_method',
        align: 'left',
        label: 'Payment Method',
        field: (row) => row.payment_method || '-',
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
    { name: 'name', type: 'text', label: 'Name', operator: 'contains' },
    { name: 'user_seat', type: 'number', label: 'User Seats' },
    { name: 'address', type: 'text', label: 'Address', operator: 'contains' },
    {
        name: 'payment_method',
        type: 'select',
        label: 'Payment Method',
        options: PAYMENT_METHOD,
        emitValue: true,
        mapOptions: true
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
    console.log(e);
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const getData = async (page, pageSize, sort) => {
    loading.value = true;
    const filter = { ...pagination.value.filter };
    const result = await Promise.all([
        TenantApi.getTenant({
            params: {
                filter: filter,
                sort: sort,
                skip: (page - 1) * pageSize,
                limit: pageSize,
                dummy: Math.random(),
            },
        }),
        TenantApi.countTenant({
            params: { filter: filter },
        }),
    ]);
    loading.value = false;

    rows.value = result[0].data.map((m) => {
        return m;
    });
    pagination.value.rowsNumber = result[1].data?.count || result[1].data || 0;
    pagination.value.page = page;
    pagination.value.rowsPerPage = pageSize;
    pagination.value.sortBy = sort.replace('-', '');
    pagination.value.descending = sort.indexOf('-') > -1 ? true : false;
};

const openCreateDialog = () => {
    editMode.value = false;
    selectedTenant.value = null;
    createDialog.value = true;
};

const onEdit = (row) => {
    editMode.value = true;
    selectedTenant.value = { ...row };
    createDialog.value = true;
};

const handleTenantCreated = () => {
    createDialog.value = false;
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const handleTenantUpdated = () => {
    createDialog.value = false;
    getData(1, pagination.value.rowsPerPage, '-created_at');
};

const onCancel = (row) => {
    const doCancel = async (id) => {
        try {
            $q.loading.show();
            const idx = rows.value.findIndex((f) => f._id === id);
            if (idx < -1) throw new Error('Tenant not found');

            const { data } = await TenantApi.delete(id);
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
            message: `Are you sure you want to delete this tenant: ${row.name}?`,
            cancel: true,
            persistent: true,
        })
        .onOk(() => {
            return doCancel(row._id);
        });
};

// Navigation functions
const navigateToTenantUsers = (tenantId) => {
    router.push({ name: 'tenant-users', params: { tenant_id: tenantId } });
};

const navigateToTenantWorkplaces = (tenantId) => {
    router.push({ name: 'tenant-workplaces', params: { tenant_id: tenantId } });
};

onMounted(() => {
    getData(1, pagination.value.rowsPerPage, '-created_at');
});
</script>
<script>
export default {
    name: 'TenantList',
};
</script>
