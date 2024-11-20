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
            const response = await api.get("driver");
            setDriver(response.data);
            setDriverCount(response.data.length);
        } catch (error) {
            console.error("Error fetching drivers:", error);
        }
    };

    const onSubmit = async (data) => {
        if (!dateOfBirth) {
            console.error("Date of birth is required.");
            return;
        }

        // Convert date to ISO format
        data.dateOfBirth = new Date(dateOfBirth.unix * 1000).toISOString();

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
                await api.delete(`driver/deleteDriver/${id}`, {
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
            <div className="grid grid-cols-12 mb-3">
                <div className="col-span-6 pr-3 pl-3 pt-2 rounded flex justify-between bg-green-300 ml-7">
                    <p className="text-fuchsia-900">مدیریت رانندگان</p>
                    <button
                        onClick={() => isOpen(null)}
                        className="text-fuchsia-900 bg-white px-4 py-1 rounded hover:bg-green-200 transition-colors"
                    >
                        افزودن
                    </button>
                </div>
                <div className="flex justify-between col-span-6 bg-green-300 p-2 rounded">
                    <p className="text-white">جستجو</p>
                    <input
                        type="search"
                        className="rounded w-[400px] px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="جستجو بر اساس نام، کد ملی یا شماره تماس..."
                    />
                </div>
            </div>

            <div className="bg-slate-300 rounded-lg overflow-hidden">
                {filteredDrivers.length > 0 ? (
                    filteredDrivers.map((driver, index) => (
                        <div key={index} className="flex items-center m-2 p-3 bg-white bg-opacity-50 rounded">
                            <div className="w-12 text-center">{index + 1}</div>
                            <div className="flex-1">نام: {driver.name}</div>
                            <div className="flex-1">کدملی: {driver.codeMelli}</div>
                            <div className="flex-1">تلفن: {driver.numberPhone}</div>
                            <div className="flex-1">جنسیت: {driver.gender}</div>
                            <div className="w-20">سن: {driver.age}</div>
                            <div className="w-32">تولد: {formatDate(driver.dateOfBirth)}</div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => isOpen(driver)}
                                    className="p-1 text-blue-600 hover:text-blue-800"
                                >
                                    <BiEdit size={20} />
                                </button>
                                <button
                                    onClick={() => handleDeleteDriver(driver._id)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                >
                                    <AiFillDelete size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-4">هیچ راننده‌ای یافت نشد</p>
                )}
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={closeModal}
                className="bg-white w-[700px] rounded-lg shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">
                        {isEdit ? "ویرایش مشخصات راننده" : "ثبت راننده جدید"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 mb-2">نام و نام خانوادگی</label>
                                <input
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    type="text"
                                    placeholder="نام و نام خانوادگی"
                                    {...register("name", { required: "این فیلد ضروری است" })}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">کد ملی</label>
                                <input
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    type="text"
                                    placeholder="کد ملی"
                                    {...register("codeMelli", {
                                        required: "این فیلد ضروری است",
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: "کد ملی باید ۱۰ رقم باشد"
                                        }
                                    })}
                                />
                                {errors.codeMelli && <p className="text-red-500 text-sm mt-1">{errors.codeMelli.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 mb-2">تاریخ تولد</label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={dateOfBirth}
                                    onChange={setDateOfBirth}
                                    format="YYYY/MM/DD"
                                    inputClass="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    calendarPosition="bottom-right"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">شماره تماس</label>
                                <input
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    type="tel"
                                    placeholder="شماره تماس"
                                    {...register("numberPhone", {
                                        required: "این فیلد ضروری است",
                                        pattern: {
                                            value: /^09\d{9}$/,
                                            message: "فرمت شماره تماس صحیح نیست"
                                        }
                                    })}
                                />
                                {errors.numberPhone && <p className="text-red-500 text-sm mt-1">{errors.numberPhone.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 mb-2">جنسیت</label>
                                <select
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    {...register("gender", { required: "این فیلد ضروری است" })}
                                >
                                    <option value="">انتخاب کنید</option>
                                    <option value="مرد">مرد</option>
                                    <option value="زن">زن</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">سن</label>
                                <input
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    type="number"
                                    placeholder="سن"
                                    {...register("age", {
                                        required: "این فیلد ضروری است",
                                        min: {
                                            value: 18,
                                            message: "حداقل سن ۱۸ سال است"
                                        },
                                        max: {
                                            value: 70,
                                            message: "حداکثر سن ۷۰ سال است"
                                        }
                                    })}
                                />
                                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                            >
                                انصراف
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                            >
                                {isEdit ? "ذخیره تغییرات" : "ثبت"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};