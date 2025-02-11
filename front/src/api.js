import axios from "axios";

// تنظیم آدرس اصلی API
const axiosInstance = axios.create({
    baseURL: "https://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
/*    baseURL: "https://safarino.onrender.com", // آدرس بک‌اند*/
