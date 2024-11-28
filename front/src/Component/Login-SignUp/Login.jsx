import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../../Assets/images/safarino-Photoroom.png";
import { FaApple, FaGoogle } from "react-icons/fa";
import { CgArrowLongRight } from "react-icons/cg";

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/users/login", {
                phoneNumber: data.phoneNumber,
            });
            console.log("Login successfully", response.data);
            login(response.data);
            navigate("/");
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Login failed");
            } else if (error.request) {
                setErrorMessage("No response from server");
            } else {
                setErrorMessage("Error setting up request");
            }
            console.error("Error", error);
        }
    };

    return (
        <form className="max-w-5xl mx-auto px-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-10 dark:bg-dark-blue dark:text-white bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    <Link
                        to="/"
                        className="p-2 transition-all md:flex justify-center ease-out duration-[2000ms] md:w-[10%] sm:w-[20%] md:hover:w-[30%] rounded-full bg-white-blue text-white hover:bg-blue-700 ">
                        صفحه اصلی
                    </Link>
                    <img src={logo} className="h-16 md:h-20" alt="Logo" />
                </div>
                <div>
                    <div
                        className="text-center text-xl md:text-2xl font-bold font-serif hover:font-sans animate-pulse mb-6">
                        ورود به حساب شما
                    </div>
                </div>
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8">
                    {/* Form Section */}
                    <div>
                        <div className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-full border placeholder:text-gray-400"
                                    placeholder="شماره موبایل"
                                    {...register("phoneNumber", { required: true })}
                                />
                                {errors.phoneNumber &&
                                    <p className="text-red-500 text-sm mt-1">شماره موبایل را بطور صحیح وارد نمائید</p>}
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-dark-black text-white
                                    hover:w-[90%] w-[50%] md:w-[40%] transition-all duration-[2000ms] ease-in-out">
                                    <CgArrowLongRight className="text-xl animate-pulse" />
                                    ورود به حساب
                                </button>
                            </div>
                        </div>
                        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                    </div>

                    {/* Social Login Section */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="p-4 border rounded-lg hover:bg-blue-700 hover:text-white animate-bounce transition duration-500">
                            <div className="flex items-center gap-8 justify-around ">
                                <button className="flex-1 text-left  ">Sign in with Gmail Account</button>
                                <FaGoogle />
                            </div>
                        </div>
                        <div
                            className="p-4 border rounded-lg hover:bg-blue-700 animate-bounce hover:text-white transition duration-500">
                            <div className="flex items-center gap-8 justify-around">
                                <button className="flex-1 text-left ">Sign in Apple Secure ID</button>
                                <FaApple />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signup Link */}
                <div className="text-center py-6 flex justify-center">
                    <Link
                        to="/SignUp"
                        className="px-6 py-2 flex md:flex justify-center md:hover:justify-center w-[30%] hover:w-[50%] md:hover:w-[60%] transition-all ease-out duration-[2000ms] rounded-full bg-white-blue text-white hover:bg-blue-700">
                        ثبت نام
                    </Link>
                </div>
            </div>
        </form>
    );
};

export default Login;
