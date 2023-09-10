import BaseUrl from './api/BaseUrl'

export const SaleService = {

    async create(body){
        return await BaseUrl.post("api/sales", body)
    },
    
}