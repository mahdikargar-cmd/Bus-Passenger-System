import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import {useForm} from "react-hook-form";
import axios from "axios";

export default function Cooperative() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentCooperative, setCurrentCooperative] = useState(null);
    const [cooperatives, setCooperatives] = useState([]);
    const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm();

    useEffect(() => {
        const fetchCooperatives = async () => {
            try {
                const response = await axios.get('http://localhost:5000/coperative');
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
            <div className="grid grid-cols-12">
                <div className="col-span-12 flex justify-center">
                    <button
                        onClick={() => openModal()}
                        className="text-teal-50 hover:bg-green-700 transition-all duration-300 hover:w-[10%]  bg-green-500 w-[20%] content-center rounded p-2 pr-3 pl-3"
                    >
                        افزودن
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-12 mt-4">
                <div className="col-span-12">
                    {cooperatives.length > 0 ? (
                        <ul>
                            {cooperatives.map((cooperative) => (
                                <li key={cooperative._id}
                                    className="flex justify-between m-2 text-gray-800 hover:bg-adminpanel-bg text-[14px] pt-2 pb-2 ps-1 pl-1 col-span-12 bg-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                                    <div className={'flex items-center  gap-8 font-bold text-[16px] ps-4'}>
                                        <h3 className=" font-semibold">
                                            <span className="font-bold text-admin-modal ml-1">نام تعاونی:
                                            </span>   {cooperative.CoperativeName}
                                        </h3>
                                        <p>
                                            <span className="font-bold text-admin-modal ml-1">مدیر تعاونی:</span>
                                            {cooperative.CoperativeManagement}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => openModal(cooperative)}
                                            className="bg-white-blue hover:bg-hover-blue  ml-3 text-white rounded p-2 mr-2"
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cooperative.CoperativeName)}
                                            className="bg-red-500 text-white rounded p-2"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>هیچ تعاونی‌ای موجود نیست.</p>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                className="bg-admin-modal w-[700px] flex justify-center text-white p-2 mt-20 mr-[30%] h-[500px] rounded"
            >
                <div>
                    <h1 className="mt-8 mb-10 flex justify-center text-[20px] font-semibold">
                        {isEdit ? "ویرایش تعاونی" : "ثبت تعاونی"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>نام تعاونی</label>
                            <input
                                {...register("CoperativeName", {required: "این فیلد اجباری است"})}
                                className="p-2 mr-2 rounded text-black mt-2"
                                type="text"
                                placeholder="نام تعاونی"
                            />
                            {errors.CoperativeName && <p className="text-red-500">{errors.CoperativeName.message}</p>}
                        </div>
                        <div>
                            <label>نام مسئول</label>
                            <input
                                {...register("CoperativeManagement", {required: "این فیلد اجباری است"})}
                                className="p-2 mr-1 text-black rounded mt-6"
                                type="text"
                                placeholder="نام مسئول تعاونی"
                            />
                            {errors.CoperativeManagement &&
                                <p className="text-red-500">{errors.CoperativeManagement.message}</p>}
                        </div>
                        <div className="grid grid-cols-12 mt-10">
                            <div
                                className="col-span-6 flex justify-center bg-red-600 p-2 ml-2 rounded hover:bg-red-700 transition-all ease-out"
                            >
                                <button type="button" onClick={closeModal}>لغو</button>
                            </div>
                            <div
                                className="col-span-6 flex justify-center bg-green-600 hover:bg-green-700 transition-all ease-out mr-2 p-2 rounded"
                            >
                                <button type="submit">{isEdit ? "ذخیره" : "تایید"}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
