import React, {useState, useEffect} from "react";
import {useForm, Controller} from "react-hook-form";
import Modal from "react-modal";
import Select from 'react-select';
import api from "../../../Services/Api";
import "./admin.css";
import moment from 'moment-jalaali';
import {BiEdit} from "react-icons/bi";
import {AiFillDelete} from "react-icons/ai";

export const AdminServices = () => {
    const {register, handleSubmit, reset, control, formState: {errors}} = useForm();
    const [BusManagement, setBusManagement] = useState([]);
    const [coperative, setCoperative] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    const [capacities, setCapacities] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedChairCapacity, setSelectedChairCapacity] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);

    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
        handleBusChange();
        fetchServicesOptions();
        fetchCooperatives();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await api.get("destination");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    };

    const fetchCooperatives = async () => {
        try {
            const response = await api.get("coperative");
            setCoperative(response.data);
        } catch (error) {
            console.error("Error fetching cooperatives", error);
        }
    };

    const fetchServicesOptions = async () => {
        try {
            const response = await api.get("services");
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching Services", error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await api.get("busMovement");
            setRoutes(response.data);
        } catch (error) {
            console.error("Error fetching routes", error);
        }
    };
    const handleBusChange = (selectedOption) => {
        if (!selectedOption) {
            setSelectedBus(null);
            setSelectedChairCapacity(null);
            return;
        }

        setSelectedBus(selectedOption);

        // Find the selected bus from BusManagement array
        const selectedBusData = BusManagement.find(bus => bus._id === selectedOption.value);

        if (selectedBusData) {
            setSelectedChairCapacity(selectedBusData.capacity);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.get("bus"); //BusManagement
            setBusManagement(response.data);
            setCapacities(response.data.map(bus => ({value: bus._id, label: bus.capacity})));
        } catch (error) {
            console.error("Error fetching BusManagement", error);
        }
    };
    const handleEdit = async (serviceId) => {
        try {
            const response = await api.get(`services/${serviceId}`);
            const serviceData = response.data;

            // Set the form data
            reset({
                companyName: { value: serviceData.CompanyName?._id, label: serviceData.CompanyName?.CoperativeName },
                busName: { value: serviceData.busName?._id, label: serviceData.busName?.busName },
                busType: { value: serviceData.BusType?._id, label: serviceData.BusType?.busType },
                route: { value: serviceData.SelectedRoute?._id, label: `${serviceData.SelectedRoute?.origin} به ${serviceData.SelectedRoute?.destination}` },
                moveDate: { value: serviceData.movementDate?._id, label: serviceData.movementDate?.moveDate },
                moveTime: { value: serviceData.movementTime?._id, label: serviceData.movementTime?.moveTime },
                ticketPrice: serviceData.ticketPrice,
                ServicesOption: serviceData.ServicesOption?.map(option => ({
                    value: option._id,
                    label: option.facilities
                })) || []
            });

            setSelectedBus({ value: serviceData.busName?._id, label: serviceData.busName?.busName });
            setSelectedChairCapacity(serviceData.ChairCapacity);
            setEditingServiceId(serviceId);
            openModalHandler();
        } catch (error) {
            console.error('Error fetching service details:', error);
        }
    };

    const handleDelete = async (serviceId) => {
        if (window.confirm('آیا از حذف این سرویس اطمینان دارید؟')) {
            try {
                await api.delete(`services/deleteService/${serviceId}`);
                fetchServicesOptions(); // Refresh the list
            } catch (error) {
                console.error('Error deleting service:', error);
            }
        }
    };
    const openModalHandler = () => {
        setOpenModal(true);
    };
    const closeModalHandler = () => {
        setOpenModal(false);
    };
    const onSubmit = async (data) => {
        try {
            if (!selectedBus || !selectedChairCapacity) {
                console.error("Bus and capacity are required");
                return;
            }
            const newService = {
                CompanyName: data.companyName.value,
                busName: data.busName.value,
                BusType: data.busType.value,
                ChairCapacity: selectedBus.value, // Use the bus ID for ChairCapacity
                SelectedRoute: data.route.value,
                movementDate: data.moveDate.value,
                movementTime: data.moveTime.value,
                ticketPrice: parseFloat(data.ticketPrice),
                ServicesOption: data.ServicesOption.map(option => option.value)
            };

            const response = editingServiceId
                ? await api.patch(`services/updateService/${editingServiceId}`, newService)
                : await api.post("services/registerService", newService);

            if (response.status === 201 || response.status === 200) {
                fetchServicesOptions();
                closeModalHandler();
                reset(); // Reset form after successful submission
            }
        } catch (error) {
            console.error("Error saving service:", error);
            // Add error handling UI feedback here
        }
    };
    return (
        <>
            <div className="container mx-auto px-4">
                {/* Add Button */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 flex justify-center my-4">
                        <button
                            onClick={() => openModalHandler(null)}
                            className="text-teal-50 hover:bg-green-700 transition-all duration-300 bg-green-500 w-full md:w-2/3 lg:w-1/5 rounded p-2"
                        >
                            افزودن
                        </button>
                    </div>
                </div>

                {/* Services List */}
                <div className="space-y-4">
                    {services.map((service, index) => (
                        <div
                            className="flex flex-col p-4 bg-white rounded-lg shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-adminpanel-bg"
                            key={service._id}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">شماره:</span> {index + 1}
                                </div>
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">نام تعاونی:</span>{' '}
                                    {service.CompanyName?.CoperativeName || 'بدون تعاونی'}
                                </div>
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">نام اتوبوس:</span>{' '}
                                    {service.busName?.busName || 'نامشخص'}
                                </div>
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">نوع اتوبوس:</span>{' '}
                                    {service.BusType?.busType || 'نامشخص'}
                                </div>
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">مسیر:</span>{' '}
                                    {service.SelectedRoute
                                        ? `${service.SelectedRoute.origin} به ${service.SelectedRoute.destination}`
                                        : 'نامشخص'}
                                </div>
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">تاریخ حرکت:</span>{' '}
                                    {moment(service.movementDate?.moveDate, 'YYYY/MM/DD').format('jYYYY/jMM/jDD') || 'نامشخص'}
                                </div>
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">ساعت حرکت:</span>{' '}
                                    {moment(service.movementTime?.moveTime, 'HH:mm').format('HH:mm') || 'نامشخص'}
                                </div>
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">ظرفیت صندلی:</span>{' '}
                                    {service.ChairCapacity?.capacity || 'نامشخص'}
                                </div>
                                <div className="text-sm md:text-md font-medium">
                                    <span className="font-bold text-admin-modal ml-1">قیمت بلیط:</span>{' '}
                                    {service.ticketPrice?.toLocaleString() || 'نامشخص'} ریال
                                </div>
                                {/* Service Options */}
                                <div className="text-sm md:text-md font-medium col-span-full">
                                    <span className="font-bold text-admin-modal ml-1">امکانات:</span>{' '}
                                    {service.ServicesOption?.map(option => option.facilities).join(', ') || 'بدون امکانات'}
                                </div>
                                <div className="flex justify-end items-center space-x-2 mt-2 md:mt-0">
                                    <BiEdit
                                        className="cursor-pointer ml-2 hover:text-blue-600 transition-all duration-300"
                                        onClick={() => handleEdit(service._id)}
                                    />
                                    <AiFillDelete
                                        className="cursor-pointer hover:text-red-600 transition-all duration-300"
                                        onClick={() => handleDelete(service._id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Form */}
                <Modal isOpen={openModal} onRequestClose={closeModalHandler}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 lg:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Company Name */}
                            <div className="space-y-2">
                                <label className="block">نام تعاونی</label>
                                <Controller
                                    name="companyName"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={coperative.map(company => ({
                                                value: company._id,
                                                label: company.CoperativeName
                                            }))}
                                            className="text-black w-full"
                                            placeholder="انتخاب تعاونی"
                                        />
                                    )}
                                />
                                {errors.CompanyName && <p className="text-red-600">نام تعاونی الزامی است.</p>}
                            </div>

                            {/* Bus Name */}
                            <div className="space-y-2">
                                <label className="block">نام اتوبوس</label>
                                <Controller
                                    name="busName"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={BusManagement.map(bus => ({ value: bus._id, label: bus.busName }))}
                                            className="text-black w-full"
                                            onChange={option => {
                                                field.onChange(option);
                                                handleBusChange(option);
                                            }}
                                        />
                                    )}
                                />
                                {errors.busName && <p className="text-red-600">نام اتوبوس الزامی است.</p>}
                            </div>

                            {/* Bus Type */}
                            <div className="space-y-2">
                                <label className="block">نوع اتوبوس</label>
                                <Controller
                                    name="busType"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={BusManagement.map(ss => ({
                                                value: ss._id,
                                                label: ss.busType
                                            }))}
                                            className="text-black w-full"
                                        />
                                    )}
                                />
                                {errors.busType && <p className="text-red-600">نوع اتوبوس الزامی است.</p>}
                            </div>

                            {/* Route */}
                            <div className="space-y-2">
                                <label className="block">مسیر</label>
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
                                                return { value: route._id, label: `${origin} به ${destination}` };
                                            })}
                                            className="text-black w-full"
                                        />
                                    )}
                                />
                                {errors.route && <p className="text-red-600">مسیر الزامی است.</p>}
                            </div>

                            {/* Move Date */}
                            <div className="space-y-2">
                                <label className="block">تاریخ حرکت</label>
                                <Controller
                                    name="moveDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={routes.map(moveDate => ({
                                                value: moveDate._id,
                                                label: moment(moveDate.moveDate).format('jYYYY/jMM/jDD')
                                            }))}
                                            className="text-black w-full"
                                            placeholder="انتخاب تاریخ حرکت"
                                        />
                                    )}
                                />
                                {errors.moveDate && <p className="text-red-600">تاریخ حرکت الزامی است.</p>}
                            </div>

                            {/* Move Time */}
                            <div className="space-y-2">
                                <label className="block">ساعت حرکت</label>
                                <Controller
                                    name="moveTime"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={routes.map(hours => ({
                                                value: hours._id,
                                                label: hours.moveTime
                                            }))}
                                            className="text-black w-full"
                                            placeholder="انتخاب زمان حرکت"
                                        />
                                    )}
                                />
                                {errors.moveTime && <p className="text-red-600">ساعت حرکت الزامی است.</p>}
                            </div>

                            {/* Chair Capacity */}
                            <div className="space-y-2">
                                <label className="block">ظرفیت صندلی</label>
                                <input
                                    type="text"
                                    value={selectedChairCapacity}
                                    disabled
                                    className="p-2 border rounded w-full"
                                />
                            </div>

                            {/* Ticket Price */}
                            <div className="space-y-2">
                                <label className="block">قیمت بلیط</label>
                                <Controller
                                    name="ticketPrice"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            className="p-2 border rounded w-full"
                                            placeholder="قیمت بلیط"
                                        />
                                    )}
                                />
                                {errors.ticketPrice && <p className="text-red-600">قیمت بلیط الزامی است.</p>}
                            </div>
                        </div>
                        <div className="flex justify-center space-x-2 mt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded w-1/4"
                            >
                                ذخیره
                            </button>
                            <button
                                type="button"
                                onClick={closeModalHandler}
                                className="bg-red-500 text-white py-2 px-4 rounded w-1/4"
                            >
                                بستن
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    );


    };
