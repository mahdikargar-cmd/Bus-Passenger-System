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
                        className="text-teal-50 bg-green-500 w-[20%] content-center rounded p-2 pr-3 pl-3"
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
                                    className="bg-slate-300 p-4 rounded mb-2 shadow flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            نام تعاونی: {cooperative.CoperativeName}
                                        </h3>
                                        <p>مدیر تعاونی: {cooperative.CoperativeManagement}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => openModal(cooperative)}
                                            className="bg-yellow-500 ml-3 text-white rounded p-2 mr-2"
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
                className="bg-slate-500 w-[700px] flex justify-center text-white p-2 mt-20 mr-[30%] h-[500px] rounded"
            >
                <div>
                    <h1 className="mt-4 text-[20px] font-semibold">
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
