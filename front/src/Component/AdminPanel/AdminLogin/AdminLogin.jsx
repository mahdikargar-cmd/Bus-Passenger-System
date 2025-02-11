import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext/AuthContext';
import api from "../../../api"; // وارد کردن AuthContext

export const AdminLogin = () => {
    const Navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const { login } = useAuth(); // دسترسی به متد login برای ذخیره اطلاعات در context
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post("/admin/loginAdmin", {
                user: data.user,
                password: data.password,
            });
            console.log("Login successfully", response.data);
            login(response.data); // ذخیره‌سازی اطلاعات ادمین
            Navigate('/cooperativeManagement');
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || 'Login failed');
            } else if (error.request) {
                setErrorMessage('No response from server');
            } else {
                setErrorMessage('Error setting up request');
            }
            console.error('Error', error);
        }
    };

    return (
        <div className={'flex justify-center'}>
            <div className="lg:mt-28 lg:w-[600px]  flex justify-center items-center h-screen lg:h-auto">
                <div
                    className={
                        "w-full max-w-md lg:max-w-4xl rounded bg-admin-modal    h-auto lg:h-[500px] p-6 lg:p-16 flex flex-col items-center"
                    }
                >
                    <h1 className="text-white font-semibold text-[20px] mb-10 text-center">
                        صفحه ورود به پنل
                    </h1>
                    <form action="" onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <div className="mb-5">
                            <label htmlFor="" className="text-white block mb-2">
                                نام کاربری
                            </label>
                            <input
                                type="text"
                                placeholder={"نام کاربری"}
                                name="user"
                                className="w-full p-2 mt-2 rounded-sm placeholder:pr-2"
                                {...register("user", { required: true })}
                            />
                            {errors.user && <p className="text-red-500 text-sm mt-1">نام کاربری را وارد کنید</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="" className="text-white block mb-2">
                                رمز عبور
                            </label>
                            <input
                                type="password"
                                placeholder={"رمز عبور"}
                                name="password"
                                className="w-full p-2 mt-2 rounded-sm placeholder:pr-2"
                                {...register("password", { required: true })}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">رمز عبور را وارد کنید</p>}
                        </div>
                        <button
                            className="bg-orange-500 w-full py-2 mt-3 rounded text-white font-semibold hover:bg-orange-600 transition-all"
                        >
                            تایید
                        </button>
                    </form>
                    {errorMessage && <p className="text-red-500 text-sm mt-3">{errorMessage}</p>}
                </div>
            </div>
        </div>

    );
};
