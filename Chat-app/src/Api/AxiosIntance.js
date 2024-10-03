import axios from "axios"
import { api_url } from "./ApiHandler"


let AxiosIntance = axios.create({
    baseURL:api_url,
    headers: {
        'Content-Type': 'application/json', // Ensure correct Content-Type
      }
})

AxiosIntance.interceptors.request.use(
    async function(config) {
     let token = sessionStorage.getItem("authToken")
     
     if(token){
        config.headers["x-access-token"]=token
     }
     return config
    },

    function(err){
        return Promise.reject(err)
    }
)

export default AxiosIntance