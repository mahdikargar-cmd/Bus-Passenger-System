import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import {useForm} from "react-hook-form";
import axios from "axios";
import api from "../../../api";

export default function Cooperative() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentCooperative, setCurrentCooperative] = useState(null);
    const [cooperatives, setCooperatives] = useState([]);
    const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm();

    useEffect(() => {
        const fetchCooperatives = async () => {
            try {
                const response = await api.get('/coperative');
                setCooperatives(response.data);
            } catch (error) {
                console.error("Error fetching cooperatives", error);
            }
        };
        fetchCooperatives();
    }, []);

    const openModal = (cooperative = null) => {
        if (cooperative) {
            setValue("CoperativeName", cooperative.CoperativeName);
            setValue("CoperativeManagement", cooperative.CoperativeManagement);
            setIsEdit(true);
            setCurrentCooperative(cooperative);
        } else {
            reset();
            setIsEdit(false);
            setCurrentCooperative(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSubmit = async (data) => {
        try {
            if (isEdit && currentCooperative) {
                await axios.patch(`http://localhost:5000/coperative/updatecoperative/${currentCooperative.CoperativeName}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setCooperatives(cooperatives.map(coop =>
                    coop.CoperativeName === currentCooperative.CoperativeName ? {...coop, ...data} : coop
                ));
            } else {
                const response = await axios.post('http://localhost:5000/coperative/registercoperative', {
                    CoperativeName: data.CoperativeName,
                    CoperativeManagement: data.CoperativeManagement
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setCooperatives([...cooperatives, response.data.data.Coperative]);
            }
            closeModal();
        } catch (error) {
            console.error("Error submitting form", error);
            console.log("Request Data:", data);
        }
    };

    const handleDelete = async (cooperativeName) => {
        try {
            await axios.delete(`http://localhost:5000/coperative/deletecoperative/${cooperativeName}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setCooperatives(cooperatives.filter(coop => coop.CoperativeName !== cooperativeName));
        } catch (error) {
            console.error("Error deleting cooperative", error);
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                {/* دکمه افزودن */}
                <div className="col-span-12 flex justify-center">
                    <button
                        onClick={() => openModal()}
                        className="text-teal-50 hover:bg-green-700 transition-all duration-300 hover:w-[30%] md:hover:w-[20%] bg-green-500 w-[50%] md:w-[20%] content-center rounded p-2"
                    >
                        افزودن
                    </button>
                </div>
            </div>

            {/* لیست تعاونی‌ها */}
            <div className="grid grid-cols-12 mt-4">
                <div className="col-span-12">
                    {cooperatives.length > 0 ? (
                        <ul>
                            {cooperatives.map((cooperative) => (
                                <li
                                    key={cooperative._id}
                                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 m-2 text-gray-800 hover:bg-adminpanel-bg text-[14px] p-4 bg-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                >
                                    {/* اطلاعات تعاونی */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-[16px] font-bold">
                                        <h3>
                                            <span className="font-bold text-admin-modal ml-1">نام تعاونی:</span>
                                            {cooperative.CoperativeName}
                                        </h3>
                                        <p>
                                            <span className="font-bold text-admin-modal ml-1">مدیر تعاونی:</span>
                                            {cooperative.CoperativeManagement}
                                        </p>
                                    </div>

                                    {/* دکمه‌های عملیات */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => openModal(cooperative)}
                                            className="bg-white-blue hover:bg-hover-blue text-white rounded p-2"
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cooperative.CoperativeName)}
                                            className="bg-red-500 hover:bg-red-600 text-white rounded p-2"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center">هیچ تعاونی‌ای موجود نیست.</p>
                    )}
                </div>
            </div>

            {/* مودال ثبت/ویرایش */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                className="bg-admin-modal w-[90%] md:w-[700px] flex justify-center text-white p-6 mt-20 mx-auto rounded-lg shadow-xl"
            >
                <div className="w-full">
                    <h1 className="mt-4 mb-6 text-center text-[20px] font-semibold">
                        {isEdit ? "ویرایش تعاونی" : "ثبت تعاونی"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">نام تعاونی</label>
                            <input
                                {...register("CoperativeName", { required: "این فیلد اجباری است" })}
                                className="w-full p-2 rounded text-black"
                                type="text"
                                placeholder="نام تعاونی"
                            />
                            {errors.CoperativeName && <p className="text-red-500 mt-1">{errors.CoperativeName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">نام مسئول</label>
                            <input
                                {...register("CoperativeManagement", { required: "این فیلد اجباری است" })}
                                className="w-full p-2 rounded text-black"
                                type="text"
                                placeholder="نام مسئول تعاونی"
                            />
                            {errors.CoperativeManagement && (
                                <p className="text-red-500 mt-1">{errors.CoperativeManagement.message}</p>
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
        </>

    );
}
