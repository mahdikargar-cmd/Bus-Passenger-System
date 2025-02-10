import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {BiEdit} from "react-icons/bi";
import {AiFillDelete} from "react-icons/ai";
import Modal from "react-modal";
import {FaPrint} from "react-icons/fa";
import {CgArrowsExchangeAlt} from "react-icons/cg";

export const Tickets = () => {

    const [openModal, setOpenModal] = useState(false);
    const isOpen = () => {
        setOpenModal(true)
    }
    const closeModal = () => {
        setOpenModal(false)
    }
    const info = [
        {
            title: "شماره"
        },
        {
            title: "نام"
        },
        {
            title: "نام خانوادگی"
        },
        {
            title: "کد ملی"
        },
        {
            title: "شماره همراه"
        },
        {
            title: "جنسیت"
        },
        {
            title: "مبدا"
        },
        {
            title: "مقصد"
        },
        {
            title: ""
        }
    ]
    return (
        <>
            <div className={'grid grid-cols-12 mb-3 '}>
                <div className={'col-span-6  pr-3 pl-3 pt-2 rounded flex justify-between  bg-green-300 ml-7'}>
                    <p className={'text-fuchsia-900'}> مدیریت بلیط ها
                    </p>
                    <button onClick={isOpen} className={'text-fuchsia-900 p-1'}>افزودن</button>
                </div>
                <div className={'flex justify-between col-span-6 bg-green-300 p-2 rounded '}>
                    <p className={'text-white'}>جستجو</p>
                    <input type="search" className={'rounded w-[400px]'}/>
                </div>

            </div>
            <div className={'grid grid-cols-12   bg-yellow-500 '}>
                <div className={'flex flex-nowrap m-2 p-2 col-span-12'}>


                    {info.map((item) => (
                        <div className={'col-span-1 ml-10  text-white'}>
                            {item.title}
                        </div>
                    ))}


                </div>
            </div>

            <div className={'grid grid-cols-12 mt-2  bg-slate-400'}>
                <div className={'flex flex-nowrap m-2 p-2 col-span-12 '}>
                    <div className={'col-span-1 ml-10 text-white mr-1 '}>1</div>
                    <div className={'col-span-1 ml-10  text-white'}>
                        مصطفی
                    </div>
                    <div className={'col-span-1 ml-10  text-white'}>
                        روستا
                    </div>
                    <div className={'col-span-1 ml-10  text-white'}>
                        6170145791
                    </div>
                    <div className={'col-span-1 ml-10  text-white'}>
                        099266186223
                    </div>
                    <div className={'col-span-1 ml-10   text-white'}>
                        مرد
                    </div>
                    <div className={'col-span-1 ml-10  text-white'}>
                        اراک
                    </div>
                    <div className={'col-span-1 ml-10  text-white'}>
                        تبریز
                    </div>


                    <div className={'col-span-1 ml-14  text-white font-semibold text-[22px]'}><BiEdit/></div>
                    <div className={'col-span-1 ml-14  text-white font-semibold text-[22px]'}><AiFillDelete/></div>
                    <div className={'col-span-1 ml-14  text-white font-semibold text-[22px]'}><FaPrint/></div>

                </div>
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={closeModal}
                className="bg-slate-500 w-[700px] flex justify-center text-white p-2 mt-20 mr-[30%] h-[500px] rounded"
            >
                <div>
                    <h1 className="mt-4 text-[20px] font-semibold mb-5">
                        ثبت بلیط جدید
                    </h1>
                    <form action="">
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12 md:col-span-4 flex justify-center">
                                <input
                                    type="search"
                                    placeholder="مبدا را انتخاب کنید"
                                    className="placeholder:p-2 p-2 rounded text-black"
                                />


                            </div>
                            <div className="col-span-12 md:col-span-4 flex justify-center">
                                <button><CgArrowsExchangeAlt className="m-0 rounded" size={30}/></button>
                            </div>
                            <div className="col-span-12 md:col-span-4 flex justify-center">
                                <input
                                    type="search"
                                    placeholder="مقصد را انتخاب کنید"
                                    className="placeholder:p-2 p-2 rounded text-black"
                                />
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-6 flex justify-center">
                            <button className="bg-orange-500 mt-8 pr-12 pl-12 pt-1 pb-1 rounded">جستجو</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}