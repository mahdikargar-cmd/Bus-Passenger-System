// Login.js
import React, {useState} from 'react';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import logo from '../../Assets/images/safarino-Photoroom.png'
import {FaApple, FaGoogle} from "react-icons/fa";
import {CgArrowLongRight} from "react-icons/cg";
import axiosInstance from "../../api";

export const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const {register, handleSubmit, formState: {errors}} = useForm();
    const API_URL = process.env.REACT_APP_API_URL;

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/users/login`, {
                phoneNumber: data.phoneNumber,
            });
            console.log("Login successfully", response.data);
            login(response.data);
            navigate('/');
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


        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className={'mt-10 ml-48 ms-48 shadow-xl dark:bg-dark-blue dark:text-white bg-white rounded-xl'}>
                <div className={'grid grid-cols-12 m-4 p-2 '}>
                    <div className={'col-span-6 flex items-center'}>
                        <Link to={'/'}
                              className={'p-2 ps-4 pl-4 rounded-full bg-white-blue text-white hover:bg-blue-700 transition duration-500  '}> صفحه
                            اصلی
                        </Link>
                        {/*ugiugfu*/}
                    </div>
                    <div className={'col-span-6 flex justify-end'}>
                        <img src={logo} className={'h-20'} alt=""/>
                    </div>
                </div>
                <div className={'grid grid-cols-12'}>
                    <div className={'col-span-12 flex justify-center items-center text-[30px]'}>
                        <p className={'font-serif hover:font-sans animate-pulse font-bold transition-all 2s  '}> ورود
                            به حساب شما</p>
                    </div>
                </div>
                <div className={'grid grid-cols-12 mt-24 mb-5'}>

                    <div
                        className={'col-span-6 shadow-xl border-2 flex-col  rounded-full ms-20 ml-20   p-1 hover:text-white hover:bg-blue-700 transition 2s duration-500 ease-out animate-bounce'}>
                        <div className={'flex justify-evenly items-center  '}>
                            <button>Sign in with Gmail Account</button>
                            <FaGoogle/>
                        </div>

                    </div>
                    <div className={'col-span-6 shadow-xl transition 2s ease-out p-1 ms-20 ml-20    rounded-full'}>
                        <input type="text" className={'w-full rounded-full p-1 placeholder:p-2 placeholder:text-black '}
                               placeholder={'شماره موبایل'}
                               {...register("phoneNumber", {required: true})}
                        />
                        {errors.phoneNumber && <p>شماره موبایل را بطور صحیح وارد نمائید</p>}
                    </div>
                </div>
                <div className={'grid grid-cols-12 '}>

                    <div
                        className={'col-span-6 shadow-xl border-2 flex-col  rounded-full ms-20 ml-20 mb-20   p-1 hover:text-white hover:bg-blue-700 transition-all duration-500 ease-out animate-bounce'}>
                        <div className={'flex justify-evenly items-center  '}>
                            <button>Sign in Apple Secure ID</button>
                            <FaApple/>

                        </div>

                    </div>
                    <div
                        className={'col-span-6 shadow-xl border-2 flex-col  rounded-full ms-20 ml-20 mb-20  p-1 hover:text-white hover:bg-dark-black '}>
                        <div className={'flex justify-evenly items-center font-serif text-[20px]  '}>
                            <CgArrowLongRight className={'text-[30px] hover:animate-pulse'}/>
                            <button  type="submit">لاگین به حساب</button>


                        </div>

                    </div>
                </div>
                <div className={'grid grid-cols-12 pb-32'}>
                    <div className={'col-span-12 flex justify-center items-center'}>
                        <Link to={'/SignUp'}
                              className={'p-2 ps-20 pl-20 rounded-full bg-white-blue text-white hover:bg-blue-700 transition duration-500'}>ثبت
                            نام</Link>
                    </div>
                </div>
            </div>

        </form>
    );
};
