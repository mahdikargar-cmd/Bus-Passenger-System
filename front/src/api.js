import axios from "axios";

// تنظیم آدرس اصلی API
const axiosInstance = axios.create({
    baseURL: "https://safarino.onrender.com", // آدرس بک‌اند
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
