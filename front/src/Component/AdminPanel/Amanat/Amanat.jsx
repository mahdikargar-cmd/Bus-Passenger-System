import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import {useForm} from "react-hook-form";
import axios from "axios";

export default function Amanat() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentCooperative, setCurrentCooperative] = useState(null);
    const [cooperatives, setCooperatives] = useState([]);
    const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm();

    useEffect(() => {
        const fetchCooperatives = async () => {
            try {
                const response = await axios.get('http://localhost:5000/amanat');
                setCooperatives(response.data);
            } catch (error) {
                console.error("Error fetching cooperatives", error);
            }
        };
        fetchCooperatives();
    }, []);

    const openModal = (cooperative = null) => {
        if (cooperative) {
            setValue("user", cooperative.user);
            setValue("weight", cooperative.weight);
            setValue("phoneNumber", cooperative.phoneNumber);

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
                await axios.patch(`http://localhost:5000/amanat/updateAmanat/${currentCooperative.user}`, {
                    user: data.user,
                    weight: data.weight,
                    phoneNumber: data.phoneNumber
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setCooperatives(cooperatives.map(coop =>
                    coop.user === currentCooperative.user ? {...coop, ...data} : coop
                ));
            } else {
                const response = await axios.post('http://localhost:5000/amanat/registerAmanat', {
                    user: data.user,
                    weight: data.weight,
                    phoneNumber: data.phoneNumber
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setCooperatives([...cooperatives, response.data.data.Amanat]);
            }
            closeModal();
        } catch (error) {
            console.error("Error submitting form", error);
            console.log("Request Data:", data);
        }
    };

    const handleDelete = async (user) => {
        try {
            await axios.delete(`http://localhost:5000/amanat/deleteAmanat/${user}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setCooperatives(cooperatives.filter(coop => coop.user !== user));
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
                            {cooperatives.map((item) => (
                                <li key={item._id}
                                    className="bg-slate-300 p-4 rounded mb-2 shadow flex justify-between items-center">
                                    <div className={'flex gap-8'}>
                                        <p className="text-lg font-semibold">
                                            نام مالک امانت: {item.user}
                                        </p>
                                        <p> وزن امانتی (برحسب kg): {item.weight}
                                        </p>
                                        <p>
                                            شماره مالک: {item.phoneNumber}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => openModal(item)}
                                            className="bg-yellow-500 ml-3 text-white rounded p-2 mr-2"
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.user)}
                                            className="bg-red-500 text-white rounded p-2"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>هیچ امانتی موجود نیست.</p>
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
                        {isEdit ? "ویرایش اطلاعات" : "ثبت امانتی"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>نام مالک امانتی</label>
                            <input
                                {...register("user", {required: "این فیلد اجباری است"})}
                                className="p-2 mr-2 rounded text-black mt-2"
                                type="text"
                                placeholder="نام و نام خانوادگی مالک"
                            />
                            {errors.user && <p className="text-red-500">{errors.user.message}</p>}
                        </div>
                        <div>
                            <label>وزن امانتی برحسب (kg) </label>
                            <input
                                {...register("weight", {required: "این فیلد اجباری است"})}
                                className="p-2 mr-1 text-black rounded mt-6"
                                type="text"
                                placeholder="وزن امانتی (kg)"
                            />
                            {errors.weight &&
                                <p className="text-red-500">{errors.weight.message}</p>}
                        </div>
                        <div>
                            <label>شماره همراه مالک امانتی</label>
                            <input
                                {...register("phoneNumber", {required: "این فیلد اجباری است"})}
                                className="p-2 mr-1 text-black rounded mt-6"
                                type="text"
                                placeholder="شماره موبایل"
                            />
                            {errors.phoneNumber &&
                                <p className="text-red-500">{errors.phoneNumber.message}</p>}
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
