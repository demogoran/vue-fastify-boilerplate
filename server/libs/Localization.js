const localesList = {
    USER_MISSED_DATA: { 'en': 'Login or password missed' },
    USER_NOT_EXISTS: { 'en': 'User not exists' },
    USER_ALREADY_EXISTS: { 'en': 'User already exists' },
    USER_INVALID_PASSWORD: { 'en': 'Invalid password' },

    MISSED_DATA: { 'en': 'Missed required fields'},

    UNAUTHORIZED: { 'en': 'Unauthorized' },
}

export default new Proxy(localesList, {
    get: (obj, prop) => obj[prop][process.env.CURRENT_LOCALE]
});