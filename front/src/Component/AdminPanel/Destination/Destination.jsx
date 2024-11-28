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
        <div>
            <div className="col-span-12 flex justify-center">
                <button
                    onClick={() => isOpen(null)}
                    className="text-teal-50  bg-green-500 w-[20%] content-center rounded p-2 pr-3 pl-3"
                >
                    افزودن
                </button>
            </div>

            <div className={'grid grid-cols-12 p-2 '}>
                {destinations && destinations.length > 0 ? destinations.map((destination, index) => (
                    <div key={index}
                         className="flex justify-between m-2 text-gray-800 hover:bg-adminpanel-bg text-[18px] font-serif  font-bold pt-4 pb-4 ps-4 pl-1 col-span-2 bg-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                        <p className={'hover:text-red-500'}>{destination?.Cities}</p>
                        <div className={'flex'}>
                            <div className={'ml-2 text-[24px] hover:text-white-blue transition-all'}
                                 onClick={() => isOpen(destination)}><CiEdit/></div>
                            <div className={'text-[24px] hover:text-red-500 transition-all'}
                                 onClick={() => handleDelete(destination._id)}><MdDelete/></div>
                        </div>
                    </div>
                )) : <p>هیچ مقصدی یافت نشد</p>}
            </div>


            <Modal
                isOpen={openModal}
                onRequestClose={closeModal}
                className="bg-slate-500 w-[300px] xl:w-[700px] flex justify-center  text-white p-4 mr-20 mt-20 md:mr-[30%] md:h-[500px] rounded"
            >
                <div>
                    <h1 className="mt-4 text-[20px] font-semibold mb-5">
                        {isEdit ? "ویرایش مسیر" : "ثبت مسیر"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>نام شهر</label>
                            <input
                                className="p-2 mr-2 rounded text-black mt-2"
                                type="text"
                                placeholder="نام شهر را وارد کنید"
                                {...register("cityName", {required: "نام شهر الزامی است"})} // Register input for react-hook-form
                            />
                            {errors.cityName && <p className="text-red-500">{errors.cityName.message}</p>}
                        </div>
                        <div className="grid grid-cols-12 mt-10">
                            <div
                                className="col-span-6 flex justify-center bg-red-600 p-2 ml-2 rounded hover:bg-red-700 transition-all ease-out">
                                <button type="button" onClick={closeModal}>لغو</button>
                            </div>
                            <div
                                className="col-span-6 flex justify-center bg-green-600 hover:bg-green-700 transition-all ease-out mr-2 p-2 rounded">
                                <button type="submit">{isEdit ? "ذخیره" : "تایید"}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

        </div>
    );
}
