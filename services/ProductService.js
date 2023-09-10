import BaseUrl from './api/BaseUrl'

export const ProductService = {
    async getAll(){
        return await BaseUrl.get("api/products")
    },
}