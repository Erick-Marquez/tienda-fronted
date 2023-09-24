import BaseUrl from './api/BaseUrl'

export const DashboardService = {
    async index(){
        return await BaseUrl.get("api/dashboard")
    },
}