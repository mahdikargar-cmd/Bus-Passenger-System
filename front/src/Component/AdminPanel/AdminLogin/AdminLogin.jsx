import axios from "axios";
import { useState } from "react";
import {  useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export const AdminLogin = () => {
    const Navigate=useNavigate();
    const [errorMessage,setErrorMessage]=useState("");
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/admin/loginAdmin", {
                user:data.user,
                password:data.password,
            });
            console.log("Login successfully", response.data);
            Navigate('/adminPanel')
        } catch (error) {
            if(error.response){
                setErrorMessage(error.response.data.message || 'Login failed')
            }else if(error.request){
                setErrorMessage('no response from server ')
            }else{
                setErrorMessage('Error setting up Request')
            }
            console.error('Error',error)
        }

    };

    return (
        <>
            <div className={"lg:mt-28  lg:mr-[33%] grid grid-cols-12 "}>
                <div
                    className={
                        "col-span-12  lg:mt-0 rounded bg-white-blue h-[100vh] lg:h-[500px] lg:col-span-7 p-4 lg:p-16 flex flex-col items-center"
                    }
                >
                    <h1 className={"text-white font-semibold text-[20px] mb-10"}>صفحه ورود به پنل </h1>
                    <form action="" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="" className={"text-white "}>
                                نام کاربری
                            </label>
                            <input
                                type="phoneNumber"
                                placeholder={" نام  کاربری"}
                                name="phoneNumber"
                                className={"flex placeholder:pr-2 p-1 mt-2 rounded-sm"}
                                {...register("user",{required:true})}
                            />
                            {
                                errors.phoneNumber && <p>ایمیل را به طور صحیح وارد کنید</p>
                            }
                        </div>
                        <div className={'mt-5 mb-3'}>
                            <label htmlFor="" className={"text-white "}>
                               رمز عبور
                            </label>
                            <input
                                type="phoneNumber"
                                placeholder={" رمز  عبور"}
                                name="phoneNumber"
                                className={"flex placeholder:pr-2 p-1 rounded-sm"}
                                {...register("password",{required:true})}
                            />
                            {
                                errors.phoneNumber && <p>ایمیل را به طور صحیح وارد کنید</p>
                            }
                        </div>

                        <button className={"bg-orange-500 w-full mt-3 pt-1 pb-1 rounded"}>
                            تایید
                        </button>
                    </form>
                    <div
                        className={
                            "col-span-12 flex gap-3 mt-9 justify-center items-center"
                        }
                    >

                    </div>
                </div>
            </div>
        </>
    );
};
