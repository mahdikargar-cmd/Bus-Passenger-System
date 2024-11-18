import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker2";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import api from "../../../Services/Api";
import moment from "moment-jalaali";

export const Drivers = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [openModal, setOpenModal] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [driver, setDriver] = useState([]);
    const [driverCount, setDriverCount] = useState(0); // تعداد راننده‌ها
    const [isEdit, setIsEdit] = useState(false);
    const [currentDriver, setCurrentDriver] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await api.get("driver");
                setDriver(response.data);
                setDriverCount(response.data.length);
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        };

        fetchDrivers();
    }, []);

    const onSubmit = async (data) => {
        if (!dateOfBirth) {
            console.error("Date of birth is required.");
            return;
        }
        // تبدیل dateOfBirth به فرمت جاوااسکریپت
        data.dateOfBirth = dateOfBirth.toDate();

        try {
            if (isEdit && currentDriver) {
                const response = await api.patch(`driver/updateDriver/${currentDriver._id}`, data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setDriver(driver.map(item => item._id === currentDriver._id ? response.data.data.Driver : item));
            } else {
                const response = await api.post("driver/registerDriver", data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setDriver([...driver, response.data.data.Driver]);
                setDriverCount(driverCount + 1);
            }
            closeModal();
        } catch (error) {
            console.error("Error adding or updating driver:", error);
            console.log("Request Data:", data);
        }
    };

    const isOpen = (driver) => {
        if (driver) {
            setValue("name", driver.name);
            setValue("codeMelli", driver.codeMelli);
            setValue("numberPhone", driver.numberPhone);
            setValue("gender", driver.gender);
            setValue("age", driver.age);
            setDateOfBirth(driver.dateOfBirth ? moment(driver.dateOfBirth) : null);
            setIsEdit(true);
            setCurrentDriver(driver);
        } else {
            reset();
            setIsEdit(false);
            setCurrentDriver(null);
        }
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setDateOfBirth(null);
    };

    const handleDeleteDriver = async (id) => {
        try {
            await api.delete(`driver/deleteDriver/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            setDriver(driver.filter(item => item._id !== id));
            setDriverCount(driverCount - 1);
        } catch (error) {
            console.error("Error deleting driver:", error);
        }
    };

    const formatDate = (date) => {
        return moment(date).format('jYYYY/jMM/jDD');
    };

    return (
        <>
            <div className="grid grid-cols-12 mb-3">
                <div className="col-span-6 pr-3 pl-3 pt-2 rounded flex justify-between bg-green-300 ml-7">
                    <p className="text-fuchsia-900">مدیریت رانندگان</p>
                    <button onClick={() => isOpen(null)} className="text-fuchsia-900 p-1">افزودن</button>
                </div>
                <div className="flex justify-between col-span-6 bg-green-300 p-2 rounded">
                    <p className="text-white">جستجو</p>
                    <input type="search" className="rounded w-[400px]" />
                </div>
            </div>
            <div className="grid grid-cols-12 bg-slate-300 ">
                {driver.length > 0 ? driver.map((driver, index) => (
                    <div key={index} className="flex flex-nowrap  m-2 p-2 col-span-12">
                        <div className="col-span-1 ml-10   ">شماره {index + 1}</div>
                        <div className="col-span-1 ml-10  ">نام ونام خانوادگی : {driver.name}</div>
                        <div className="col-span-2 ml-10  ">کدملی : {driver.codeMelli}</div>
                        <div className="col-span-3 ml-10  ">شماره همراه : {driver.numberPhone}</div>
                        <div className="col-span-2 ml-10  ">جنسیت : {driver.gender}</div>
                        <div className="col-span-1 ml-10 ">سن : {driver.age}</div>
                        <div className="col-span-1 ml-10 ">تاریخ تولد : {formatDate(driver.dateOfBirth)}</div>
                        <div className="col-span-1 ml-14  font-semibold text-[22px]" onClick={() => isOpen(driver)}><BiEdit /></div>
                        <div className="col-span-1 ml-14  font-semibold text-[22px]" onClick={() => handleDeleteDriver(driver._id)}><AiFillDelete /></div>
                    </div>
                )) : (<p>هیچ راننده ای وجود ندارد</p>)}
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={closeModal}
                className="bg-slate-500 w-[700px] flex justify-center text-white p-2 mt-20 mr-[30%] h-[500px] rounded"
            >
                <div>
                    <h1 className="mt-4 text-[20px] font-semibold mb-5">
                        {isEdit ? "ویرایش مشخصات راننده" : "ثبت راننده جدید"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12">
                            <div className="col-span-6">
                                <label className="ml-5 mr-7">نام و نام خانوادگی</label>
                                <input
                                    className="p-2 rounded mr-7 text-black mt-2"
                                    type="text"
                                    placeholder="نام و نام خانوادگی"
                                    {...register("name", { required: "این فیلد ضروری است" })}
                                />
                                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                            </div>
                            <div className="col-span-6 flex items-center flex-col">
                                <label>کدملی</label>
                                <input
                                    className="p-2 mr-2 rounded text-black mt-2"
                                    type="text"
                                    placeholder="کدملی"
                                    {...register("codeMelli", { required: "این فیلد ضروری است" })}
                                />
                                {errors.codeMelli && <p className="text-red-500">{errors.codeMelli.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-12 mt-2">
                            <div className="col-span-6 mr-2 flex-col mt-52 flex">
                                <label>تاریخ تولد</label>
                                <DatePicker
                                    timePicker={false}
                                    value={dateOfBirth}
                                    onChange={date => setDateOfBirth(date)}
                                    isGregorian={false}
                                    className="p-2 mr-2 rounded text-black mt-2"
                                />
                            </div>
                            <div className="col-span-6">
                                <div className="flex flex-col items-center">
                                    <label>شماره همراه</label>
                                    <input
                                        className="p-2 mr-2 rounded text-black mt-2"
                                        type="tel"
                                        placeholder="شماره همراه"
                                        {...register("numberPhone", { required: "این فیلد ضروری است" })}
                                    />
                                    {errors.numberPhone && <p className="text-red-500">{errors.numberPhone.message}</p>}
                                    <label>جنسیت</label>
                                    <select
                                        className="pr-20 pl-20 pt-2 pb-2 mr-2 rounded text-black mt-2"
                                        {...register("gender", { required: "این فیلد ضروری است" })}
                                    >
                                        <option value="مرد">مرد</option>
                                        <option value="زن">زن</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                                    <label>سن</label>
                                    <input
                                        className="p-2 mr-2 rounded text-black mt-2"
                                        type="number"
                                        placeholder="سن"
                                        {...register("age", { required: "این فیلد ضروری است" })}
                                    />
                                    {errors.age && <p className="text-red-500">{errors.age.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="mt-7 flex justify-center">
                            <button className="bg-green-300 text-fuchsia-900 p-2 rounded">
                                {isEdit ? "ذخیره تغییرات" : "ذخیره"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};
