import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext'; // وارد کردن AuthContext

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
            const response = await axios.post("http://localhost:5000/admin/loginAdmin", {
                user: data.user,
                password: data.password,
            });
            console.log("Login successfully", response.data);
            login(response.data); // ذخیره‌سازی اطلاعات ادمین
            Navigate('/adminPanel');
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
        <>
            <div className={"lg:mt-28 lg:mr-[33%] grid grid-cols-12 "}>
                <div
                    className={
                        "col-span-12 lg:mt-0 rounded bg-white-blue h-[100vh] lg:h-[500px] lg:col-span-7 p-4 lg:p-16 flex flex-col items-center"
                    }
                >
                    <h1 className={"text-white font-semibold text-[20px] mb-10"}>صفحه ورود به پنل </h1>
                    <form action="" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="" className={"text-white "}>
                                نام کاربری
                            </label>
                            <input
                                type="text"
                                placeholder={" نام  کاربری"}
                                name="user"
                                className={"flex placeholder:pr-2 p-1 mt-2 rounded-sm"}
                                {...register("user", { required: true })}
                            />
                            {errors.user && <p>نام کاربری را وارد کنید</p>}
                        </div>
                        <div className={'mt-5 mb-3'}>
                            <label htmlFor="" className={"text-white "}>
                                رمز عبور
                            </label>
                            <input
                                type="password"
                                placeholder={" رمز  عبور"}
                                name="password"
                                className={"flex placeholder:pr-2 p-1 rounded-sm"}
                                {...register("password", { required: true })}
                            />
                            {errors.password && <p>رمز عبور را وارد کنید</p>}
                        </div>

                        <button className={"bg-orange-500 w-full mt-3 pt-1 pb-1 rounded"}>
                            تایید
                        </button>
                    </form>
                    {errorMessage && <p>{errorMessage}</p>}
                </div>
            </div>
        </>
    );
};
