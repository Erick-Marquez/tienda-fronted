import BaseUrl from './api/BaseUrl'

export const AuthService = {

    async getCsrfCookie(){
        return await BaseUrl.get("sanctum/csrf-cookie")
    },

    async login(body) {
        return await BaseUrl.post('/login', body)
    },

    async logout() {
        return await BaseUrl.post('/logout')
    },

    async user() {
        return await BaseUrl.get('/api/user')
    }
}