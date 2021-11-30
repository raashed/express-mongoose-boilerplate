const {PermissionModel} = require("../models/permission.model");

setTimeout(async () => {
    const arr = [
        { name: 'dashboard_index', displayName: 'Dashboard View', group: 'Dashboard' },

        { name: 'departments_index', displayName: 'Departments View', group: 'User Management - Departments' },
        { name: 'departments_create', displayName: 'Departments Create', group: 'User Management - Departments' },
        { name: 'departments_update', displayName: 'Departments Update', group: 'User Management - Departments' },
        { name: 'departments_delete', displayName: 'Departments Delete', group: 'User Management - Departments' },

        { name: 'roles_index', displayName: 'Roles View', group: 'User Management - Roles' },
        { name: 'roles_create', displayName: 'Roles Create', group: 'User Management - Roles' },
        { name: 'roles_update', displayName: 'Roles Update', group: 'User Management - Roles' },
        { name: 'roles_delete', displayName: 'Roles Delete', group: 'User Management - Roles' },

        { name: 'roles_permissions_index', displayName: 'Roles Permissions View', group: 'User Management - Roles Permissions' },
        { name: 'roles_permissions_update', displayName: 'Roles Permissions Update', group: 'User Management - Roles Permissions' },

        { name: 'users_index', displayName: 'Users View', group: 'User Management - Users' },
        { name: 'users_create', displayName: 'Users Create', group: 'User Management - Users' },
        { name: 'users_update', displayName: 'Users Update', group: 'User Management - Users' },
        { name: 'users_delete', displayName: 'Users Delete', group: 'User Management - Users' },
    ];

    await PermissionModel.deleteMany({}, (error, docs) => {
        if (error)
            console.log(error)
    });

    await PermissionModel.insertMany(arr, (error, docs) => {
        if (error)
            console.log(error)
    });
}, 1100);
