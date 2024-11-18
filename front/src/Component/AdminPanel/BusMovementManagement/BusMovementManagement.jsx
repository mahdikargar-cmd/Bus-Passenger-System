import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import Select from 'react-select';
import moment from 'moment-jalaali';
import api from "../../../Services/Api";
import DatePicker from "react-datepicker2";

export const BusMovementManagement = () => {
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    const [busMovements, setBusMovements] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentBusMovement, setCurrentBusMovement] = useState(null);
    const [moveDate, setMoveDate] = useState(null);
    const [moveTime, setMoveTime] = useState(null);

    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
        fetchBusMovements();
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

    const fetchBusMovements = async () => {
        try {
            const response = await api.get("busMovement");
            setBusMovements(response.data);
        } catch (error) {
            console.error("Error fetching bus movements", error);
        }
    };

    const deleteBusMovement = async (id) => {
        try {
            await api.delete(`busMovement/deleteBusMovement/${id}`);
            await fetchBusMovements();
        } catch (error) {
            console.error("Error deleting bus movement", error);
        }
    };

    const onSubmit = async (data) => {
        data.busName = selectedBus?.value;
        const selectedRouteData = routes.find(route => route._id === selectedRoute?.value);
        data.origin = selectedRouteData?.origin;
        data.destination = selectedRouteData?.destination;
        data.moveDate = moment(moveDate).format('YYYY-MM-DD');
        data.moveTime = moveTime;

        console.log("Submitting data:", data);

        try {
            if (isEdit && currentBusMovement) {
                await api.patch(`busMovement/updateBusMovement/${currentBusMovement._id}`, data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setBusMovements(busMovements.map(item => item._id === currentBusMovement._id ? { ...item, ...data } : item));
            } else {
                const response = await api.post("busMovement/registerBusMovement", data, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setBusMovements([...busMovements, response.data]);
            }
            closeModalHandler();
        } catch (error) {
            console.error("Error adding bus movement", error);
        }
    };

    const openModalHandler = (busMovement) => {
        if (busMovement) {
            const route = routes.find(r => r._id === busMovement.route);
            const originCity = cities.find(c => c._id === route?.origin)?.Cities;
            const destinationCity = cities.find(c => c._id === route?.destination)?.Cities;
            setValue("busName", busMovement.busName);
            setValue("route", `${originCity} - ${destinationCity}`);
            setMoveDate(moment(busMovement.moveDate).toDate());
            setMoveTime(busMovement.moveTime);
            setIsEdit(true);
            setCurrentBusMovement(busMovement);
            setSelectedBus({
                value: busMovement.busName,
                label: buses.find(b => b._id === busMovement.busName)?.busName
            });
            setSelectedRoute(route ? { value: route._id, label: `${originCity} - ${destinationCity}` } : null);
        } else {
            reset();
            setIsEdit(false);
            setCurrentBusMovement(null);
            setSelectedBus(null);
            setSelectedRoute(null);
            setMoveDate(null);
            setMoveTime(null);
        }
        setOpenModal(true);
    };

    const closeModalHandler = () => {
        setOpenModal(false);
    };

    const handleBusChange = (selectedOption) => {
        setSelectedBus(selectedOption);
    };

    return (
        <>
            <div className="grid grid-cols-12 mb-3">
                <div className="col-span-6 pr-3 pl-3 pt-2 rounded flex justify-between bg-green-300 ">
                    <p className="text-fuchsia-900"> مدیریت حرکت اتوبوس‌ها </p>
                    <button className="text-fuchsia-900 bg-green-200 p-2 rounded"
                            onClick={() => openModalHandler()}>افزودن حرکت اتوبوس
                    </button>
                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th>نام اتوبوس</th>
                    <th>مسیر</th>
                    <th>تاریخ حرکت</th>
                    <th>ساعت حرکت</th>
                    <th>عملیات</th>
                </tr>
                </thead>
                <tbody className={''}>
                {busMovements.map(busMovement => (
                    <tr key={busMovement._id}>
                        <td>{buses.find(b => b._id === busMovement.busName)?.busName}</td>
                        <td>{`${cities.find(c => c._id === busMovement.origin)?.Cities} - ${cities.find(c => c._id === busMovement.destination)?.Cities}`}</td>
                        <td>{moment(busMovement.moveDate).format('jYYYY/jMM/jDD')}</td>
                        <td>{busMovement.moveTime}</td>
                        <td>
                            <button onClick={() => openModalHandler(busMovement)}>ویرایش</button>
                            <button onClick={() => deleteBusMovement(busMovement._id)}>حذف</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Modal isOpen={openModal} onRequestClose={closeModalHandler}>
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
                                <label> انتخاب مسیر </label>
                                <Controller
                                    name="route"
                                    control={control}
                                    defaultValue={selectedRoute}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={routes.map(route => {
                                                const origin = cities.find(c => c._id === route.origin)?.Cities;
                                                const destination = cities.find(c => c._id === route.destination)?.Cities;
                                                return { value: route._id, label: `${origin} - ${destination}` };
                                            })}
                                            value={selectedRoute}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSelectedRoute(e);
                                            }}
                                            className="text-black"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center col-span-12">
                            <div className="col-span-6">
                                <label>تاریخ حرکت</label>
                                <Controller
                                    name="moveDate"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            timePicker={false}
                                            value={moveDate}
                                            onChange={(date) => {
                                                field.onChange(date);
                                                setMoveDate(date);
                                            }}                                            isGregorian={false}
                                            className="p-2 mr-2 rounded text-black mt-2"
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-span-6 mr-6">
                                <label>ساعت حرکت</label>
                                <Controller
                                    name="moveTime"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <input
                                            type="time"
                                            {...field}
                                            value={moveTime}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setMoveTime(e.target.value);
                                            }}
                                            className="text-black"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 flex justify-center items-center mt-3">
                        <button type="submit" className="bg-green-500 p-2 rounded text-white"> ثبت</button>
                        <button type="button" className="bg-red-500 p-2 rounded text-white" onClick={closeModalHandler}>لغو</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};
