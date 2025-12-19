export default {
    login: 'auth/login',
    register: '/auth/register',
    getGroupsById: (groupId) => `/groups/${groupId}`,
    group: '/groups',
    expense: '/expenses',
    getExpensesByGroup: (groupId) => `/expenses/${groupId}`
}