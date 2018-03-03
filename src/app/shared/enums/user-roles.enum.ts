export enum Role {
    READ_USER_SELF = 'READ_USER_SELF',
    READ_USER_ALL = 'READ_USER_ALL',
    CREATE_USER = 'CREATE_USER'
};

export const UserRoles = Object.keys(Role);