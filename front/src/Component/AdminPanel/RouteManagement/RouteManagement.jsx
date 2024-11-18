import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Modal from "react-modal";
import Select from 'react-select';
import api from "../../../Services/Api";

export const RouteManagement = () => {
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
    const Dates = [
        { value: 'شنبه', label: 'شنبه' },
        { value: 'یکشنبه', label: 'یکشنبه' },
        { value: 'دوشنبه', label: 'دوشنبه' },
        { value: 'سه شنبه', label: 'سه شنبه' },
        { value: 'چهار شنبه', label: 'چهار شنبه' },
        { value: 'پنج شنبه', label: 'پنج شنبه' },
        { value: 'جمعه', label: 'جمعه' }
    ];

    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
    }, []);

    const fetchRoutes = async () => {
        try {
            const response = await api.get("/Route");
            setRoutes(response.data);
        } catch (error) {
            console.error("Error fetching routes", error);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.get("/bus");
            setBuses(response.data);
        } catch (error) {
            console.error("Error fetching buses", error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await api.get("/destination");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    };

    const deleteRoute = async (id) => {
        try {
            await api.delete(`/Route/deleteRoute/${id}`);
            await fetchRoutes();
        } catch (error) {
            console.error("Error deleting route", error);
        }
    };

    const onSubmit = async (data) => {
        data.busName = selectedBus?.value;
        data.origin = selectedOrigin?.value;
        data.destination = selectedDestination?.value;
        data.wedays = data.wedays.map(day => day.value);
        try {
            if (isEdit && currentRoute) {
                await api.patch(`/Route/updateRoute/${currentRoute._id}`, data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setRoutes(routes.map(item => item._id === currentRoute._id ? { ...item, ...data } : item));
            } else {
                const response = await api.post("/Route/registerRoute", data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setRoutes([...routes, response.data]);
            }
            closeModalHandler();
        } catch (error) {
            console.error("Error adding route", error);
        }
    };

    const openModalHandler = (route) => {
        if (route) {
            setValue("busName", route.busName);
            setValue("origin", route.origin);
            setValue("destination", route.destination);
            setValue("wedays", Dates.filter(day => route.wedays.includes(day.value)));
            setIsEdit(true);
            setCurrentRoute(route);
            setSelectedBus({ value: route.busName, label: buses.find(b => b._id === route.busName)?.name });
            setSelectedOrigin({ value: route.origin, label: cities.find(c => c._id === route.origin)?.name });
            setSelectedDestination({
                value: route.destination,
                label: cities.find(c => c._id === route.destination)?.name
            });
        } else {
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
            <div className="grid grid-cols-12 mb-3">
                <div className="col-span-6 pr-3 pl-3 pt-2 rounded flex justify-between bg-green-300 ml-7">
                    <p className="text-fuchsia-900"> مدیریت مسیرها </p>
                    <button className="text-fuchsia-900 p-1" onClick={() => openModalHandler(null)}>افزودن</button>
                </div>
                <div className="flex justify-between col-span-6 bg-green-300 p-2 rounded">
                    <p className="text-white">جستجو</p>
                    <input type="search" className="rounded w-[400px]" />
                </div>
            </div>

            <div className="grid grid-cols-12 mt-2 bg-slate-400">
                {routes.map((route, index) => {
                    // پیدا کردن نام اتوبوس براساس شناسه
                    const busName = buses.find(bus => bus._id === route.busName)?.busName || route.busName;

                    const originName = cities.find(city => city._id === route.origin)?.Cities || route.origin;
                    const destinationName = cities.find(city => city._id === route.destination)?.Cities || route.destination;

                    return (
                        <div className="flex justify-between m-2 p-2 col-span-12" key={route._id}>
                            <div className="col-span-1 ml-10 text-white mr-1"> شماره: {index + 1} </div>
                            <div className="col-span-1 ml-10 text-white"> نام اتوبوس: {busName} </div>
                            <div className="col-span-1 ml-10 text-white"> مبدا: {originName} </div>
                            <div className="col-span-1 ml-10 text-white"> مقصد: {destinationName} </div>
                            <div className="col-span-1 ml-10 text-white"> روزهای حرکت: {route.wedays?.join(", ") || ''} </div>
                            <div className="col-span-2 ml-10 text-white"> ثبت شده
                                در: {new Date(route.createdAt).toLocaleString("fa-IR")} </div>
                            <div className="col-span-1 ml-14 text-white font-semibold text-[22px]">
                                <BiEdit onClick={() => openModalHandler(route)} />
                            </div>
                            <div className="col-span-1 ml-14 text-white font-semibold text-[22px]"
                                 onClick={() => deleteRoute(route._id)}>
                                <AiFillDelete />
                            </div>
                        </div>

                    )
                })}
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={closeModalHandler}
                className="bg-slate-500 w-[700px] flex justify-center text-white p-2 mt-20 mr-[30%] h-[500px] rounded"
            >
                <div>
                    <h1 className="mt-4 text-[20px] text-black font-semibold mb-5">
                        {isEdit ? "ویرایش مسیر" : "ثبت مسیر"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12">
                            <div className="flex justify-between items-center col-span-12">
                                <div className="col-span-6">
                                    <label>نام اتوبوس</label>
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
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-span-6 mr-6">
                                    <label> انتخاب مبدا </label>
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
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center col-span-12">
                                <div className="col-span-6">
                                    <label> انتخاب مقصد</label>
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
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-span-6 mr-6 flex justify-between mt-1 ">
                                    <label className={'ml-7'}>روزهای حرکت :</label>
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
                                                className="text-black pr-4 pl-4 rounded pt-1 pb-1"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 mt-10">
                            <div
                                className="col-span-6 flex justify-center bg-red-600 p-2 ml-2 rounded hover:bg-red-700 transition-all ease-out">
                                <button type="button" onClick={closeModalHandler}>لغو</button>
                            </div>
                            <div
                                className="col-span-6 flex justify-center bg-green-600 hover:bg-green-700 transition-all ease-out mr-2 p-2 rounded">
                                <button type="submit">تایید</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};
