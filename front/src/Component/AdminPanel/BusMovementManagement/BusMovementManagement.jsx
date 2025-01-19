import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import Select from 'react-select';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import api from "../../../Services/Api";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const Dates = [
    { value: 'شنبه', label: 'شنبه' },
    { value: 'یکشنبه', label: 'یکشنبه' },
    { value: 'دوشنبه', label: 'دوشنبه' },
    { value: 'سه‌شنبه', label: 'سه‌شنبه' },
    { value: 'چهارشنبه', label: 'چهارشنبه' },
    { value: 'پنجشنبه', label: 'پنجشنبه' },
    { value: 'جمعه', label: 'جمعه' }
];

export const BusMovementManagement = () => {
    const {  handleSubmit, reset, setValue, control, formState: { errors } } = useForm();
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentRoute, setCurrentRoute] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [moveTime, setMoveTime] = useState("00:00"); // زمان پیش‌فرض
    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await api.get("destination");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await api.get("busMovement");
            console.log(response.data); // بررسی داده‌های بازگشتی
            setRoutes(response.data);
        } catch (error) {
            console.error("Error fetching routes", error);
        }
    };


    const fetchBuses = async () => {
        try {
            const response = await api.get("bus");
            setBuses(response.data);
        } catch (error) {
            console.error("Error fetching buses", error);
        }
    };

    const deleteRoute = async (id) => {
        try {
            await api.delete(`busMovement/deleteBusMovement/${id}`);
            await fetchRoutes();
        } catch (error) {
            console.error("Error deleting route", error);
        }
    };

    const onSubmit = async (data) => {
        if (!dateOfBirth) {
            console.error("تاریخ حرکت الزامی است.");
            return;
        }
        data.moveDate = new Date(dateOfBirth.unix * 1000).toISOString();
        data.moveTime = moveTime;
        data.busName = selectedBus?.value;
        data.origin = selectedOrigin?.value;
        data.destination = selectedDestination?.value;
        data.wedays = data.wedays.map(day => day.value);

        console.log("Data being sent to the server:", data);

        try {
            if (isEdit && currentRoute) {
                await api.patch(`busMovement/updateBusMovement/${currentRoute._id}`, data);
            } else {
                await api.post("busMovement/registerBusMovement", data);
            }
            closeModalHandler();
        } catch (error) {
            console.error("خطا در ذخیره‌سازی اطلاعات:", error.response?.data || error.message);
        }
    };


    const openModalHandler = (route) => {
        if (route) {
            // Edit mode
            const originCity = cities.find(c => c._id === route.origin);
            const destinationCity = cities.find(c => c._id === route.destination);

            setValue("busName", route.busName);
            setSelectedBus({
                value: route.busName,
                label: buses.find(b => b._id === route.busName)?.busName
            });
            setDateOfBirth(new DateObject({
                date: new Date(route.moveDate), // تبدیل به تاریخ جاوااسکریپت
                calendar: persian,
                locale: persian_fa
            }));

            setSelectedOrigin({
                value: route.origin,
                label: originCity?.Cities
            });

            setSelectedDestination({
                value: route.destination,
                label: destinationCity?.Cities
            });

            setValue("wedays", route.wedays?.map(day => ({ value: day, label: day })) || []);

            setIsEdit(true);
            setCurrentRoute(route);
            console.log("dateOfBirth:", route.moveDate);

        }


        else {
            // Add mode
            reset();
            setIsEdit(false);
            setCurrentRoute(null);
            setSelectedBus(null);
            setSelectedOrigin(null);
            setSelectedDestination(null);
        }
        setOpenModal(true);
    };

    const closeModalHandler = () => {
        setOpenModal(false);
    };

    const handleBusChange = (selectedOption) => {
        setSelectedBus(selectedOption);
    };

    const handleOriginChange = (selectedOption) => {
        setSelectedOrigin(selectedOption);
    };

    const handleDestinationChange = (selectedOption) => {
        setSelectedDestination(selectedOption);
    };
    const formatDate = (date) => {
        const dateObj = new DateObject({
            date: new Date(date), // تبدیل تاریخ از فرمت اصلی به فرمت قابل خواندن
            calendar: persian,
            locale: persian_fa
        });
        return dateObj.format("YYYY/MM/DD"); // فرمت تاریخ نهایی
    };

    return (
        <>
            <div className="grid grid-cols-12">
                <div className="col-span-12 flex justify-center mt-4">
                    <button
                        onClick={() => openModalHandler(null)}
                        className="text-teal-50 hover:bg-green-700 transition-all duration-300 hover:w-[50%] lg:hover:w-[10%] bg-green-500 w-[80%] lg:w-[20%] content-center rounded p-2"
                    >
                        افزودن
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 mt-2 gap-4">
                {routes.map((route, index) => {
                    const busName = buses.find(bus => bus._id === route.busName)?.busName || route.busName;
                    const originName = cities.find(city => city._id === route.origin)?.Cities || route.origin;
                    const destinationName = cities.find(city => city._id === route.destination)?.Cities || route.destination;

                    return (
                        <div className="flex flex-col lg:flex-row justify-between m-2 text-gray-800 hover:bg-adminpanel-bg text-[14px] p-2 col-span-12 bg-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]" key={route._id}>
                            <div className="lg:w-1/6 text-md font-medium ps-1">
                                <span className="font-bold text-admin-modal ml-1">شماره:</span> {index + 1}
                            </div>
                            <div className="lg:w-1/6 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">نام اتوبوس:</span> {busName}
                            </div>
                            <div className="lg:w-1/6 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">مبدا:</span> {originName}
                            </div>
                            <div className="lg:w-1/6 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">مقصد:</span> {destinationName}
                            </div>
                            <div className="lg:w-1/6 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">روزهای حرکت:</span> {route.wedays?.join(", ") || ''}
                            </div>
                            <div className="lg:w-1/6 text-md font-medium">
                                <p>تولد: {route.moveDate ? formatDate(route.moveDate) : "تاریخ موجود نیست"}</p>
                            </div>
                            <div className="lg:w-1/6 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">ساعت حرکت:</span> {route.moveTime || "مشخص نشده"}
                            </div>

                            <div className="lg:w-1/6 text-md font-medium">
                                <span className="font-bold text-green-700">ثبت شده در:</span> {new Date(route.createdAt).toLocaleString("fa-IR")}
                            </div>
                            <div className="flex justify-end lg:w-1/6 text-gray-800 font-semibold text-[22px] space-x-2 mt-4 lg:mt-0">
                                <BiEdit
                                    onClick={() => openModalHandler(route)}
                                    className="cursor-pointer ml-2 hover:text-white-blue transition-all duration-300"
                                />
                                <AiFillDelete
                                    onClick={() => deleteRoute(route._id)}
                                    className="cursor-pointer hover:text-red-600 transition-all duration-300"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={closeModalHandler}
                className="bg-slate-500 w-[95%] lg:w-[700px] mx-auto flex justify-center text-white p-4 mt-20 h-auto lg:h-[650px] rounded-lg shadow-xl transition-all duration-500"
            >
                <div className="w-full">
                    <h1 className="mt-4 text-[20px] font-semibold mb-5 text-center">
                        {isEdit ? "ویرایش مسیر" : "ثبت مسیر"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 lg:col-span-6">
                            <label className="block text-sm font-medium mb-2">نام اتوبوس</label>
                            <Controller
                                name="busName"
                                control={control}
                                defaultValue={selectedBus}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={buses.map(bus => ({ value: bus._id, label: bus.busName }))}
                                        value={selectedBus}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleBusChange(e);
                                        }}
                                        className="text-black"
                                        placeholder="انتخاب اتوبوس"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <label className="block text-sm font-medium mb-2">انتخاب مبدا</label>
                            <Controller
                                name="origin"
                                control={control}
                                defaultValue={selectedOrigin}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={cities.map(city => ({ value: city._id, label: city.Cities }))}
                                        value={selectedOrigin}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleOriginChange(e);
                                        }}
                                        className="text-black"
                                        placeholder="انتخاب مبدا"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <label className="block text-sm font-medium mb-2">انتخاب مقصد</label>
                            <Controller
                                name="destination"
                                control={control}
                                defaultValue={selectedDestination}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={cities.map(city => ({ value: city._id, label: city.Cities }))}
                                        value={selectedDestination}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleDestinationChange(e);
                                        }}
                                        className="text-black"
                                        placeholder="انتخاب مقصد"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <label className="block text-sm font-medium mb-2">روزهای حرکت</label>
                            <Controller
                                name="wedays"
                                control={control}
                                defaultValue={[]}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={Dates}
                                        isMulti
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                        className="text-black"
                                        placeholder="انتخاب روزها"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-span-12">
                            <div className={'col-span-6'}>
                                <label className="block text-sm font-medium mb-2">تاریخ حرکت</label>
                                <DatePicker
                                    value={dateOfBirth}
                                    onChange={setDateOfBirth}
                                    calendar={persian}
                                    locale={persian_fa}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="تاریخ حرکت "
                                />
                                {!dateOfBirth && <p className="text-red-500 text-sm mt-1">لطفاً تاریخ تولد را انتخاب کنید.</p>}
                            </div>
                        </div>
                        <div className="col-span-6">
                            <label className="block  text-sm font-medium mb-2">ساعت حرکت</label>
                            <TimePicker
                                onChange={setMoveTime}
                                value={moveTime}
                                disableClock={true} // غیر فعال کردن ساعت گرافیکی
                                className="w-full p-2 rounded bg-white text-black focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-between mt-8 col-span-12">
                            <button
                                type="button"
                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-300"
                                onClick={closeModalHandler}
                            >
                                انصراف
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all duration-300"
                            >
                                {isEdit ? "ذخیره تغییرات" : "ثبت مسیر"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>

    );
};