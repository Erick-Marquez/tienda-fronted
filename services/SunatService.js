import BaseUrl from './api/BaseUrl'

export const SunatService = {

    async getDocumentsToSummary(body){
        return await BaseUrl.post("api/sunat/summary/get-documents", body)
    },
    async getSummaries(body){
        return await BaseUrl.get("api/sunat/summary/index", { params: body })
    },
    
}