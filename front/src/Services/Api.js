import axios from "axios";

const api=axios.create({
    baseURL: "http://localhost:5000",
})
export default api;
/* baseURL:"https://safarino.onrender.com"*/
