import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import Select from 'react-select';
import moment from 'moment-jalaali';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import api from "../../../Services/Api";
import DatePicker, {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// Define days of the week for the multi-select
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
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentRoute, setCurrentRoute] = useState(null);

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
            const response = await api.get("Route");
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
            await api.delete(`Route/deleteRoute/${id}`);
            await fetchRoutes();
        } catch (error) {
            console.error("Error deleting route", error);
        }
    };

    const onSubmit = async (data) => {
        // Prepare route data
        data.busName = selectedBus?.value;
        data.origin = selectedOrigin?.value;
        data.destination = selectedDestination?.value;
        data.wedays = data.wedays.map(day => day.value);

        try {
            if (isEdit && currentRoute) {
                // Update existing route
                await api.patch(`Route/updateRoute/${currentRoute._id}`, data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                // Update routes in state
                setRoutes(routes.map(item =>
                    item._id === currentRoute._id ? { ...item, ...data } : item
                ));
            } else {
                // Create new route
                const response = await api.post("Route/registerRoute", data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setRoutes([...routes, response.data]);
            }
            closeModalHandler();
        } catch (error) {
            console.error("Error adding/updating route", error);
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
        } else {
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

    return (
        <>
            <div className="grid grid-cols-12">
                <div className="col-span-12 flex justify-center">
                    <button
                        onClick={() => openModalHandler(null)}
                        className="text-teal-50 hover:bg-green-700 transition-all duration-300 hover:w-[10%] bg-green-500 w-[20%] content-center rounded p-2 pr-3 pl-3"
                    >
                        افزودن
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 mt-2">
                {routes.map((route, index) => {
                    const busName = buses.find(bus => bus._id === route.busName)?.busName || route.busName;
                    const originName = cities.find(city => city._id === route.origin)?.Cities || route.origin;
                    const destinationName = cities.find(city => city._id === route.destination)?.Cities || route.destination;

                    return (
                        <div
                            className="flex justify-between m-2 text-gray-800 hover:bg-adminpanel-bg text-[14px] pt-4 pb-4 ps-1 pl-1 col-span-12 bg-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            key={route._id}
                        >
                            <div className="col-span-2 text-md font-medium ps-1">
                                <span className="font-bold text-admin-modal ml-1">شماره:</span> {index + 1}
                            </div>
                            <div className="col-span-1 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">نام اتوبوس:</span> {busName}
                            </div>
                            <div className="col-span-1 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">مبدا:</span> {originName}
                            </div>
                            <div className="col-span-1 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">مقصد:</span> {destinationName}
                            </div>
                            <div className="col-span-1 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">روزهای حرکت:</span> {route.wedays?.join(", ") || ''}
                            </div>
                            <div className="col-span-2 text-md font-medium">
                                <span className="font-bold text-green-700">ثبت شده در:</span> {new Date(route.createdAt).toLocaleString("fa-IR")}
                            </div>
                            <div className="col-span-1 text-gray-800 font-semibold text-[22px] flex items-center space-x-2">
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
                    )
                })}
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={closeModalHandler}
                className="bg-slate-500 w-[700px] flex justify-center text-white p-2 mt-20 mr-[30%] h-[650px] rounded-lg shadow-xl transition-all duration-500"
            >
                <div>
                    <h1 className="mt-4 text-[20px] font-semibold mb-5 text-center">
                        {isEdit ? "ویرایش مسیر" : "ثبت مسیر"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
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
                        <div className="col-span-6">
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
                        <div className="col-span-6">
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
                        <div className="col-span-6">
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