import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import logo from "../../Assets/images/safarino-Photoroom.png";
import {FaApple, FaGoogle} from "react-icons/fa";
import {CgArrowLongRight} from "react-icons/cg";

export const SignUp = () => {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/users/register', {
                name: data.firstName,
                family: data.lastName,
                phoneNumber: data.phoneNumber, // Ensure phoneNumber is included
            });
            console.log('Signup successful', response.data);
            navigate('/Login');
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className={'mt-10 dark:bg-dark-blue dark:text-white ml-48 ms-48 shadow-xl bg-white rounded-xl'}>
                <div className={'grid grid-cols-12 m-4 p-2 '}>
                    <div className={'col-span-6 flex items-center'}>
                        <Link to={'/'}
                              className={'p-2 ps-4 pl-4 rounded-full bg-white-blue text-white hover:bg-blue-700 transition duration-500  '}> صفحه
                            اصلی
                        </Link>
                    </div>
                    <div className={'col-span-6 flex justify-end'}>
                        <img src={logo} className={'h-20'} alt=""/>
                    </div>
                </div>
                <div className={'grid grid-cols-12'}>
                    <div className={'col-span-12 flex justify-center items-center text-[30px]'}>
                        <p className={'font-serif hover:font-sans animate-pulse font-bold transition-all 2s  '}> ثبت نام
                            در سفرینو</p>
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
                        <input type="text" className={'w-full placeholder:p-2 placeholder:text-black rounded-full p-1'}
                               placeholder={'نام خود را وارد نمائید'}
                               {...register("firstName", { required: true })}
                        />
                        {errors.firstName && <p className="text-red-500">نام را وارد کنید</p>}
                    </div>
                </div>
                <div className={'grid grid-cols-12 mb-5'}>

                    <div className={'col-span-6 shadow-xl border-2 flex-col  rounded-full ms-20 ml-20   p-1 hover:text-white hover:bg-blue-700 transition 2s duration-500 ease-out animate-bounce'}>
                        <div className={'flex justify-evenly items-center  '}>
                            <button>Sign in Apple Secure ID</button>
                            <FaApple/>
                        </div>
                    </div>
                    <div className={'col-span-6 shadow-xl transition 2s ease-out p-1 ms-20 ml-20    rounded-full'}>
                        <input type="text" className={'w-full placeholder:p-2 placeholder:text-black rounded-full p-1'}
                               placeholder={'نام خانوادگی خود را وارد نمائید'}
                               {...register("lastName",{required:true})}
                        />
                        {errors.lastName && <p className="text-red-500">نام خانوادگی را وارد کنید</p>}
                    </div>
                </div>
                <div className={'grid grid-cols-12 mb-5'}>

                    <div
                        className={'col-span-6 '}>


                    </div>
                    <div className={'col-span-6 shadow-xl transition 2s ease-out p-1 ms-20 ml-20    rounded-full'}>
                        <input type="text" className={'w-full placeholder:p-2 placeholder:text-black rounded-full p-1'}
                               placeholder={'شماره موبایل'}
                               {...register("phoneNumber", {required: true})}
                        />
                        {errors.phoneNumber && <p>شماره موبایل را بطور صحیح وارد نمائید</p>}
                    </div>
                </div>

                <div className={'grid grid-cols-12 '}>

                    <div className={'col-span-6 '}>

                    </div>
                    <div
                        className={'col-span-6 shadow-xl border-2 flex-col  rounded-full ms-20 ml-20 mb-20  p-1 hover:text-white hover:bg-dark-black '}>
                        <div className={'flex justify-evenly items-center font-serif text-[20px]  '}>
                            <CgArrowLongRight className={'text-[30px] hover:animate-pulse'}/>
                            <button type="submit">ثبت نام</button>
                        </div>

                    </div>
                </div>





                <div className={'grid grid-cols-12 pb-32'}>
                    <div className={'col-span-12 flex justify-center items-center'}>
                        <Link to={'/Login'}
                              className={'p-2 ps-20 pl-20 rounded-full bg-white-blue text-white hover:bg-blue-700 transition duration-500'}>ورود</Link>
                    </div>
                </div>
            </div>

        </form>


    );
};

export default SignUp;
