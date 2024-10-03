export const api_url = import.meta.env.VITE_BACKEND_PATH_URL

export const api_endpoint = {
    register:"/api/register",
    email:"/api/email",
    password:"/api/password",
    user:"api/userdetails",
    updateUser:"/api/userUpdatedetails",
    searchuser:"/api/searchuser",
    logout:"/api/logout",
    forgotemail:"/api/forgotgmail",
    forgotpassword:"/api/forgotpassword",
    
}
// console.log(api_url+api_endpoint.register);