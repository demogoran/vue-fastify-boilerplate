export const USERROLES = {
    ANONYMOUS: 0,
    DEFAULT: 1,
    ADMIN: 2,
}

export const USERROLESKEY = {};
Object.keys(USERROLES).forEach(key=>USERROLESKEY[USERROLES[key]]=key);