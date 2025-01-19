import React, {useEffect, useState} from 'react';
import {CiEdit} from "react-icons/ci";
import {MdDelete} from "react-icons/md";
import Modal from "react-modal";
import {useForm} from "react-hook-form";
import api from "../../../Services/Api";

Modal.setAppElement('#root');

export default function Destination() {
    const [destinations, setDestinations] = useState([]);
    const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm();
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentDestination, setCurrentDestination] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await api.get("destination");
                console.log(response.data);
                setDestinations(response.data);
            } catch (error) {
                console.error("Error fetching destinations:", error);
            }
        };

        fetchDestinations();
    }, []);

    const onSubmit = async (data) => {
        try {
            console.log("Data submitted:", data);
            console.log("Is Edit:", isEdit);
            console.log("Current Destination:", currentDestination);

            if (isEdit && currentDestination) {
                await api.patch(`destination/updateDestination/${currentDestination._id}`, {cityName: data.cityName}, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setDestinations(destinations.map(item => item._id === currentDestination._id ? {
                    ...item,
                    Cities: data.cityName
                } : item));
            } else {
                const response = await api.post("destination/registerDestination", {
                    Cities: data.cityName
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setDestinations([...destinations, response.data.data.destination]);
            }
            closeModal();
        } catch (error) {
            console.error("Error submitting form", error);
            console.log("Request Data:", data);
        }
    };

    const isOpen = (destination) => {
        if (destination) {
            setValue("cityName", destination.Cities);
            setIsEdit(true);
            setCurrentDestination(destination);
        } else {
            reset();
            setIsEdit(false);
            setCurrentDestination(null);
        }
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`destination/deleteDestination/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setDestinations(destinations.filter(item => item._id !== id));
        } catch (e) {
            console.error("Error deleting destination", e);
        }
    };

    return (
        <div className="p-4">
            {/* دکمه افزودن */}
            <div className="col-span-12 flex justify-center">
                <button
                    onClick={() => isOpen(null)}
                    className="text-teal-50 bg-green-500 w-[50%] sm:w-[30%] lg:w-[20%] content-center rounded p-2 transition-all hover:bg-green-600"
                >
                    افزودن
                </button>
            </div>

            {/* لیست مقاصد */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {destinations && destinations.length > 0 ? (
                    destinations.map((destination, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center p-4 text-gray-800 hover:bg-gray-100 text-[16px] sm:text-[18px] font-serif font-bold bg-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            {/* نام مقصد */}
                            <p className="hover:text-red-500">{destination?.Cities}</p>

                            {/* دکمه‌های عملیات */}
                            <div className="flex gap-4">
                                <div
                                    className="text-[24px] hover:text-blue-500 transition-all cursor-pointer"
                                    onClick={() => isOpen(destination)}
                                >
                                    <CiEdit />
                                </div>
                                <div
                                    className="text-[24px] hover:text-red-500 transition-all cursor-pointer"
                                    onClick={() => handleDelete(destination._id)}
                                >
                                    <MdDelete />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-12">هیچ مقصدی یافت نشد</p>
                )}
            </div>

            {/* مودال ثبت/ویرایش */}
            <Modal
                isOpen={openModal}
                onRequestClose={closeModal}
                className="bg-slate-500 w-[90%] md:w-[700px] flex justify-center text-white p-6 mx-auto mt-20 rounded-lg shadow-xl"
            >
                <div className="w-full">
                    <h1 className="mt-4 text-[20px] font-semibold mb-5 text-center">
                        {isEdit ? "ویرایش مسیر" : "ثبت مسیر"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">نام شهر</label>
                            <input
                                className="w-full p-2 rounded text-black border border-gray-300"
                                type="text"
                                placeholder="نام شهر را وارد کنید"
                                {...register("cityName", { required: "نام شهر الزامی است" })}
                            />
                            {errors.cityName && (
                                <p className="text-red-500 mt-1">{errors.cityName.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all"
                            >
                                لغو
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all"
                            >
                                {isEdit ? "ذخیره" : "تایید"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>

    );
}
