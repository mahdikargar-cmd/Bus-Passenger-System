import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import api from "../../../Services/Api";

export const Drivers = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [openModal, setOpenModal] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [driver, setDriver] = useState([]);
    const [driverCount, setDriverCount] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [currentDriver, setCurrentDriver] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await api.get("/driver");
            setDriver(response.data);
        } catch (error) {
            console.error("Error fetching drivers:", error);
            alert("خطا در بارگذاری لیست رانندگان.");
        }
    };


    const onSubmit = async (data) => {
        if (!dateOfBirth) {
            console.error("Date of birth is required.");
            return;
        }


        data.dateOfBirth = new Date(dateOfBirth.unix * 1000).toISOString();

        try {
            if (isEdit && currentDriver) {
                const response = await api.patch(`/driver/updateDriver/${currentDriver._id}`, data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setDriver(driver.map(item => item._id === currentDriver._id ? response.data.data.Driver : item));
            } else {
                const response = await api.post("/driver/registerDriver", data, {
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
            setDateOfBirth(new DateObject({
                date: new Date(driver.dateOfBirth),
                calendar: persian,
                locale: persian_fa
            }));
            setIsEdit(true);
            setCurrentDriver(driver);
        } else {
            reset();
            setIsEdit(false);
            setCurrentDriver(null);
            setDateOfBirth(null);
        }
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setDateOfBirth(null);
    };

    const handleDeleteDriver = async (id) => {
        if (window.confirm("آیا از حذف این راننده اطمینان دارید؟")) {
            try {
                await api.delete(`/driver/deleteDriver/${id}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setDriver(driver.filter(item => item._id !== id));
                setDriverCount(driverCount - 1);
            } catch (error) {
                console.error("Error deleting driver:", error);
            }
        }
    };

    const formatDate = (date) => {
        const dateObj = new DateObject({
            date: new Date(date),
            calendar: persian,
            locale: persian_fa
        });
        return dateObj.format("YYYY/MM/DD");
    };

    const filteredDrivers = driver.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.codeMelli.includes(searchTerm) ||
        d.numberPhone.includes(searchTerm)
    );

    return (
        <>
            <div className="grid grid-cols-12">
                <div className="col-span-12 flex justify-center">
                    <button
                        onClick={() => isOpen(null)}
                        className="text-teal-50 hover:bg-green-700 transition-all duration-300 lg:hover:w-[10%] bg-green-500 lg:w-[20%] content-center rounded p-2 pr-3 pl-3"
                        >
                        افزودن
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-12 sm:grid-cols-4 lg:grid-cols-12 mt-4 gap-4">
                <div className="col-span-12 max-w-md:flex max-w-md:justify-center">
                    {filteredDrivers.length > 0 ? (
                        <ul>
                            {filteredDrivers.map((driver, index) => (
                                <li key={driver._id}
                                    className="lg:flex max-w-md:text-right  justify-between items-center m-2 text-gray-800 hover:bg-adminpanel-bg text-[14px] pt-4 pb-4 ps-1 pl-1 col-span-12 bg-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                                    <div className="col-span-12 lg:col-span-2">
                                        <h3 className="">نام: {driver.name}</h3>
                                    </div>
                                    <div className="col-span-12 lg:col-span-2">
                                        <p>کد ملی: {driver.codeMelli}</p>
                                    </div>
                                    <div className="col-span-12 lg:col-span-2">
                                        <p>موبایل: {driver.numberPhone}</p>
                                    </div>
                                    <div className="col-span-12 lg:col-span-1">
                                        <p>جنسیت: {driver.gender}</p>
                                    </div>
                                    <div className="col-span-12 lg:col-span-2">
                                        <p>تولد: {formatDate(driver.dateOfBirth)}</p>
                                    </div>

                                    <div className="col-span-12  lg:col-span-2 flex gap-3">
                                        <button
                                            onClick={() => isOpen(driver)}
                                            className="bg-white-blue flex justify-evenly items-center hover:bg-hover-blue ml-3 text-white rounded p-2 mr-2">
                                            ویرایش
                                            <BiEdit className={'ms-5'}/>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDriver(driver._id)}
                                            className="bg-red-500 flex items-center text-white rounded p-2">
                                            حذف
                                            <AiFillDelete className={'ms-5'}/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>هیچ راننده‌ای موجود نیست.</p>
                    )}
                </div>
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={closeModal}
                ariaHideApp={false}
                className="bg-admin-modal w-full max-w-[700px] mx-auto flex justify-center text-white p-6 rounded-lg shadow-lg mt-10"
            >
                <div className="w-full">
                    <h1 className="text-center text-xl font-bold mb-6">
                        {isEdit ? "ویرایش مشخصات راننده" : "ثبت راننده جدید"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4">
                        {/* نام و نام خانوادگی */}
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-medium mb-2">نام و نام خانوادگی</label>
                            <input
                                {...register("name", { required: "این فیلد اجباری است" })}
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="نام و نام خانوادگی"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        {/* کد ملی */}
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-medium mb-2">کد ملی</label>
                            <input
                                {...register("codeMelli", { required: "این فیلد اجباری است" })}
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="کد ملی"
                            />
                            {errors.codeMelli && <p className="text-red-500 text-sm mt-1">{errors.codeMelli.message}</p>}
                        </div>

                        {/* شماره موبایل */}
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-medium mb-2">شماره موبایل</label>
                            <div className="flex items-center">

                                {/* ورودی شماره تلفن */}
                                <input
                                    {...register("numberPhone", {
                                        required: "این فیلد اجباری است",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "شماره تلفن باید ۱۰ رقم باشد"
                                        }
                                    })}
                                    className="w-full text-left p-2 rounded-r bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    placeholder="به عنوان مثال : 9126618623"
                                />
                                {/* پیش‌شماره ثابت */}
                                <span className="bg-gray-700 text-white p-2 rounded-l focus:outline-none">98+</span>
                            </div>
                            {errors.numberPhone && <p className="text-red-500 text-sm mt-1">{errors.numberPhone.message}</p>}
                        </div>


                        {/* جنسیت */}
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-medium mb-2">جنسیت</label>
                            <select
                                {...register("gender", { required: "این فیلد اجباری است" })}
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                defaultValue=""
                            >
                                <option value="" disabled>انتخاب کنید</option>
                                <option value="مرد">مرد</option>
                                <option value="زن">زن</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                        </div>


                        {/* تاریخ تولد */}
                        <div className="col-span-12">
                            <label className="block text-sm font-medium mb-2">تاریخ تولد</label>
                            <DatePicker
                                value={dateOfBirth}
                                onChange={setDateOfBirth}
                                calendar={persian}
                                locale={persian_fa}
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="تاریخ تولد"
                            />
                            {!dateOfBirth && <p className="text-red-500 text-sm mt-1">لطفاً تاریخ تولد را انتخاب کنید.</p>}
                        </div>

                        {/* دکمه‌ها */}
                        <div className="col-span-12 flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-red-600 hover:bg-red-700 transition-all text-white px-6 py-2 rounded shadow"
                            >
                                لغو
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 transition-all text-white px-6 py-2 rounded shadow"
                            >
                                {isEdit ? "ذخیره تغییرات" : "ثبت راننده"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>


        </>

    );
};