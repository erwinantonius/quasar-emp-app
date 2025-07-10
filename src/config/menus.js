const menus = [
    {
        title: 'Dashboard',
        icon: 'sym_o_space_dashboard',
        path: '/',
        roles: [],
    },
    {
        title: 'Inbound',
        icon: 'trolley',
        path: '/inbound',
        roles: ['superadmin', 'inbound_team', 'multitask_worker', 'warehouse_manager', 'supervisor'],
    },
    {
        title: 'Orders',
        icon: 'sym_o_shopping_bag',
        path: '/orders',
        roles: ['superadmin', 'order_processor', 'warehouse_manager', 'supervisor', 'management'],
        children: [
            {
                title: 'Create Wave B2C',
                path: '/orders/create',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'order_processor', 'management'],
            },
            {
                title: 'Wave B2C Dashboard',
                path: '/orders/dashboard',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'order_processor', 'management'],
            },
            {
                title: 'Troubleshoot Oos',
                path: '/orders/troubleshoot-oos',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'order_processor', 'management'],
            },
            {
                title: 'Orders B2B Dashboard',
                path: '/orders/b2b',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'order_processor', 'management'],
            },
        ],
    },
    {
        title: 'Outbound',
        icon: 'sym_o_local_shipping',
        path: '/outbound',
        roles: ['superadmin', 'multitask_worker', 'packer', 'warehouse_manager', 'supervisor', 'outbound_team'],
        children: [
            {
                title: 'Packing B2C',
                path: '/outbound/packing',
                roles: ['superadmin', 'multitask_worker', 'packer', 'warehouse_manager', 'supervisor'],
            },
            {
                title: 'Packing B2B',
                path: '/outbound/packing/b2b',
                roles: ['superadmin', 'multitask_worker', 'packer', 'warehouse_manager', 'supervisor'],
            },
            {
                title: 'Handover B2C',
                path: '/outbound/handover',
                roles: ['superadmin', 'multitask_worker', 'warehouse_manager', 'supervisor', 'outbound_team'],
            },
            {
                title: 'Handover B2B',
                path: '/outbound/handover/b2b',
                roles: ['superadmin', 'multitask_worker', 'warehouse_manager', 'supervisor', 'outbound_team'],
            },
            {
                title: 'Print Label',
                path: '/outbound/print',
                roles: ['superadmin', 'multitask_worker', 'warehouse_manager', 'supervisor', 'outbound_team'],
            },
            {
                title: 'Troubleshoot AWB',
                path: '/outbound/troubleshoot',
                roles: ['superadmin', 'warehouse_manager', 'supervisor'],
            },
        ],
    },
    {
        title: 'Cycle Count',
        icon: 'sym_o_recycling',
        roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
        path: '/cycle-count',
        children: [
            {
                title: 'SKU',
                path: '/cycle-count/sku',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
            {
                title: 'Location',
                path: '/cycle-count/location',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
        ],
    },
    {
        title: 'Putaway Movement',
        icon: 'sym_o_flex_direction',
        path: '/putaway/moving/tracking',
        roles: ['superadmin', 'inbound_team', 'multitask_worker', 'warehouse_manager', 'supervisor'],
    },
    {
        title: 'Reports & analytics',
        icon: 'sym_o_leaderboard',
        roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
        path: '/reports',
        children: [
            {
                title: 'Shipped B2C',
                path: '/reports/shipped/b2c',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
            {
                title: 'Shipped B2B',
                path: '/reports/shipped/b2b',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
            {
                title: 'Order Summary',
                path: '/reports/order/summary',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
            {
                title: 'Picker Productivity B2C',
                path: '/reports/productivity/picker/b2c',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
            {
                title: 'Picker Productivity B2B',
                path: '/reports/productivity/picker/b2b',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
            {
                title: 'Packer Productivity B2C',
                path: '/reports/productivity/packer/b2c',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
            {
                title: 'Handover Summary B2C',
                path: '/reports/handover/summary/b2c',
                roles: ['superadmin', 'warehouse_manager', 'supervisor', 'stock_control', 'management'],
            },
        ],
    },
    {
        title: 'Stock Inventories',
        icon: 'sym_o_category',
        path: '/inventories',
        roles: [
            'superadmin',
            'internal_administrator',
            'warehouse_manager',
            'supervisor',
            'management',
            'stock_control',
        ],
        children: [
            {
                title: 'Inventories',
                path: '/inventories',
                roles: [
                    'superadmin',
                    'internal_administrator',
                    'warehouse_manager',
                    'supervisor',
                    'management',
                    'stock_control',
                ],
            },
            {
                title: 'Stock Log',
                path: '/inventories/log',
                roles: [
                    'superadmin',
                    'internal_administrator',
                    'warehouse_manager',
                    'supervisor',
                    'management',
                    'stock_control',
                ],
            },
        ],
    },
    {
        title: 'Master Data',
        icon: 'sym_o_storage',
        roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
        children: [
            {
                title: 'Users',
                path: '/master/user',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Warehouse & Location',
                path: '/master/warehouses',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Products',
                path: '/master/products',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Brands',
                path: '/master/brands',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Categories',
                path: '/master/categories',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Variants',
                path: '/master/variants',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Outbound Rules',
                path: '/master/outbound-rules',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Product at Jubelio',
                path: '/master/products/jubelio',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Packaging Box',
                path: '/master/packaging-box',
                roles: ['superadmin', 'warehouse_manager', 'internal_administrator', 'supervisor'],
            },
            {
                title: 'Carrier',
                path: '/master/carrier',
                roles: ['superadmin', 'warehouse_manager'],
            },
        ],
    },
    {
        title: 'Preferences',
        icon: 'sym_o_settings',
        path: '/setting',
        roles: ['superadmin', 'internal_administrator', 'warehouse_manager'],
        children: [
            {
                title: 'App',
                path: '/setting/app',
                roles: ['superadmin', 'internal_administrator', 'warehouse_manager'],
            },
        ],
    },
];

const menu_mobile = [
    {
        title: 'Inbound Putaway',
        icon: 'sym_o_move_to_inbox',
        path: '/inbound/task',
        roles: ['superadmin', 'multitask_worker', 'putaway_team', 'supervisor'],
        group: 'putaway',
    },
    {
        title: 'Putaway Moving',
        icon: 'sym_o_move_up',
        path: '/putaway/moving',
        roles: ['superadmin', 'multitask_worker', 'putaway_team', 'supervisor'],
        group: 'putaway',
    },
    {
        title: 'Cycle Count SKU',
        icon: 'sym_o_recycling',
        path: '/cycle-count/sku/task',
        roles: ['superadmin', 'multitask_worker', 'cycle_count_team', 'supervisor'],
        group: 'cycle_count',
    },
    {
        title: 'Cycle Count Loc',
        icon: 'sym_o_recycling',
        path: '/cycle-count/location/task',
        roles: ['superadmin', 'multitask_worker', 'cycle_count_team', 'supervisor'],
        group: 'cycle_count',
    },
    {
        title: 'Order Picking B2C',
        icon: 'shopping_basket',
        path: '/orders/picking/b2c',
        roles: ['superadmin', 'multitask_worker', 'picker', 'supervisor'],
        group: 'picking',
    },
    {
        title: 'Order Picking B2B',
        icon: 'shopping_cart_checkout',
        path: '/orders/picking/b2b',
        roles: ['superadmin', 'multitask_worker', 'picker', 'supervisor'],
        group: 'picking',
    },
];

export { menus, menu_mobile };
