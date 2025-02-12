import React, {useState, useEffect} from "react";
import {useForm, Controller} from "react-hook-form";
import {BiEdit} from "react-icons/bi";
import {AiFillDelete} from "react-icons/ai";
import Modal from "react-modal";
import Select from 'react-select';
import api from "../../../Services/Api";

export const ManagementOfBuses = () => {
    const {register, handleSubmit, reset, setValue, control, formState: {errors}} = useForm();
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [facilities, setFacilities] = useState([""]);
    const [isEdit, setIsEdit] = useState(false);
    const [currentBus, setCurrentBus] = useState(null);

    // Bus type options
    const busTypeOptions = [
        {value: 'معمولی', label: 'معمولی'},
        {value: 'VIP', label: 'VIP'}
    ];

    useEffect(() => {
        fetchBuses();
        fetchDrivers();
        fetchCooperatives();
        fetchDestinations();
    }, []);

    const fetchBuses = async () => {
        try {
            const response = await api.get("bus");
            setBuses(response.data);
        } catch (error) {
            console.error("Error fetching buses", error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await api.get("driver");
            setDrivers(response.data);
        } catch (error) {
            console.error("Error fetching drivers", error);
        }
    };

    const fetchCooperatives = async () => {
        try {
            const response = await api.get("coperative");
            setCooperatives(response.data);
        } catch (error) {
            console.error("Error fetching cooperatives", error);
        }
    };

    const fetchDestinations = async () => {
        try {
            const response = await api.get("destination");
            setDestinations(response.data);
        } catch (error) {
            console.error("Error fetching destinations", error);
        }
    };

    const onSubmit = async (data) => {
        try {
            data.facilities = facilities.filter(facility => facility.trim() !== "");
            data.driverIds = data.driverIds
                ? data.driverIds.map(driver => driver.value)
                : [];
            const selectedCooperative = cooperatives.find(coop => coop.CoperativeName === data.companyName.value);
            if (selectedCooperative) {
                data.companyName = selectedCooperative._id;
            } else {
                throw new Error("Invalid cooperative selected.");
            }
            data.routes = data.routes.map(route => {
                const selectedDestination = destinations.find(dest => dest.Cities === route.value);
                if (selectedDestination) {
                    return selectedDestination._id;
                }
                throw new Error("Invalid route selected.");
            });

            data.busType = data.busType.value;

            if (isEdit && currentBus) {
                // Edit existing bus
                await api.patch(`bus/updateBus/${currentBus._id}`, data, {
                    headers: {'Content-Type': 'application/json'}
                });
                setBuses(buses.map(item => item._id === currentBus._id ? {...item, ...data} : item));
            } else {
                // Add new bus
                const response = await api.post("bus/registerBus", data, {
                    headers: {'Content-Type': 'application/json'}
                });
                setBuses([...buses, response.data]);
            }
            closeModalHandler();
        } catch (error) {
            console.error("Error adding/updating bus:", error.response?.data || error.message);
            alert("مشکلی در ثبت/به‌روزرسانی اتوبوس رخ داده است.");
        }
    };


    const openModalHandler = (bus) => {
        if (bus) {
            // Prefill form for editing
            setValue("busName", bus.busName);
            setValue("companyName", {
                value: bus.companyName,
                label: bus.companyName
            });
            setValue("routes", bus.routes.map(route => ({
                value: route,
                label: route
            })));
            setValue("busType", {
                value: bus.busType,
                label: bus.busType
            });
            setValue("facilities", bus.facilities);
            setValue("capacity", bus.capacity);

            // Prepare driver IDs for multi-select
            if (bus.driverIds && bus.driverIds.length > 0) {
                setValue("driverIds",
                    bus.driverIds.map(driverId => ({
                        value: driverId,
                        label: drivers.find(driver => driver._id === driverId)?.name
                    }))
                );
            }

            setFacilities(bus.facilities);
            setIsEdit(true);
            setCurrentBus(bus);
        } else {
            // Reset form for new bus
            reset();
            setFacilities([""]);
            setIsEdit(false);
            setCurrentBus(null);
        }
        setOpenModal(true);
    };

    const closeModalHandler = () => {
        setOpenModal(false);
    };

    const addFacility = () => {
        setFacilities([...facilities, ""]);
    };

    const handleFacilityChange = (index, event) => {
        const newFacilities = [...facilities];
        newFacilities[index] = event.target.value;
        setFacilities(newFacilities);
    };

    const removeFacility = (index) => {
        const newFacilities = facilities.filter((_, i) => i !== index);
        setFacilities(newFacilities);
    };
    const deleteBus = async (id) => {
        // Add a confirmation dialog before deletion
        const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این اتوبوس را حذف کنید؟");

        if (confirmDelete) {
            try {
                // Delete bus from backend
                await api.delete(`bus/deleteBus/${id}`);

                // Update local state by removing the deleted bus
                setBuses(buses.filter(bus => bus._id !== id));
            } catch (error) {
                console.error("Error deleting bus", error);

                // Optional: show an error message to the user
                alert("مشکلی در حذف اتوبوس رخ داده است");
            }
        }
    };
    return (
        <>

            <div className="grid grid-cols-12">
                <div className="col-span-12 flex justify-center">
                    <button
                        onClick={() => openModalHandler(null)}
                        className="text-teal-50 hover:bg-green-700 transition-all duration-300 bg-green-500 w-full sm:w-[80%] md:w-[60%] lg:w-[30%] xl:w-[20%] content-center rounded p-2 pr-3 pl-3"
                    >
                        افزودن
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 mt-2">
                    {buses.map((bus, index) => (
                        <div
                            className="flex max-md:flex-col justify-between m-2 text-gray-800 hover:bg-adminpanel-bg text-[14px] pt-4 pb-4 ps-1 pl-1 col-span-12 bg-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            key={bus._id}
                        >
                            <div className="col-span-2 text-md font-medium ps-1">
                                <span className="font-bold text-admin-modal ">شماره:</span> {index + 1}
                            </div>
                            <div className="col-span-1 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">نام اتوبوس:</span> {bus.busName}
                            </div>
                            <div className="col-span-1 text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">نام تعاونی:</span>
                                {Array.isArray(bus.companyName) && bus.companyName.length > 0
                                    ? bus.companyName.map(companyName =>
                                        cooperatives.find(cooperative => cooperative._id === companyName)?.CoperativeName
                                    ).join(", ")
                                    : bus.companyName || "بدون تعاونی"}
                            </div>
                            <div className="col-span-1 flex justify-between text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">مسیرها:</span>
                                {Array.isArray(bus.routes) && bus.routes.length > 0
                                    ? bus.routes.map(destination =>
                                        destinations.find(route => route._id === destination)?.Cities
                                    ).join(", ")
                                    :  "بدون شهر"}
                            </div>
                            <div className="col-span-1 flex justify-between text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">نوع اتوبوس:</span> {bus.busType}
                            </div>
                            <div className="col-span-1 flex justify-between text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">امکانات:</span> {bus.facilities.join(", ")}
                            </div>
                            <div className="col-span-1 flex justify-between text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">ظرفیت صندلی:</span> {bus.capacity}
                            </div>
                            <div className="col-span-1 flex justify-between text-md font-medium">
                                <span className="font-bold text-admin-modal ml-1">رانندگان:</span>
                                {bus.driverIds && bus.driverIds.length > 0
                                    ? bus.driverIds.map(driverId =>
                                        drivers.find(driver => driver._id === driverId)?.name
                                    ).join(", ")
                                    : "بدون راننده"}
                            </div>
                            <div className="col-span-2 flex justify-between text-md font-medium">
                                <span className="font-bold text-green-700">ثبت شده در:</span> {new Date(bus.createdAt).toLocaleString("fa-IR")}
                            </div>
                            <div className="col-span-1  text-gray-800 font-semibold text-[22px] flex items-center space-x-2">
                                <BiEdit
                                    onClick={() => openModalHandler(bus)}
                                    className="cursor-pointer ml-2 hover:text-green-600 transition-all duration-300"
                                />
                                <AiFillDelete
                                    onClick={() => deleteBus(bus._id)}
                                    className="cursor-pointer hover:text-red-600 transition-all duration-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>


            {/* Modal for adding/editing bus */}
            <Modal
                isOpen={openModal}
                onRequestClose={closeModalHandler}
                className="bg-slate-500 w-[700px] flex justify-center text-white p-2 mt-20 mr-[30%] h-[650px] rounded-lg shadow-xl transition-all duration-500"
            >
                <div>
                    <h1 className="mt-4 text-[20px] font-semibold mb-5 text-center">
                        {isEdit ? "ویرایش مشخصات اتوبوس" : "ثبت اتوبوس جدید"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <label className="block text-sm font-medium mb-2">نام اتوبوس</label>
                            <input
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                type="text"
                                placeholder="نام اتوبوس"
                                {...register("busName", {required: true})}
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-sm font-medium mb-2">نام تعاونی</label>
                            <Controller
                                name="companyName"
                                control={control}
                                rules={{required: true}}
                                render={({field}) => (
                                    <Select
                                        {...field}
                                        options={cooperatives.map(coop => ({
                                            value: coop.CoperativeName,
                                            label: coop.CoperativeName
                                        }))}
                                        className="text-black"
                                        placeholder="انتخاب تعاونی"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-sm font-medium mb-2">مسیرها</label>
                            <Controller
                                name="routes"
                                control={control}
                                rules={{required: true}}
                                render={({field}) => (
                                    <Select
                                        {...field}
                                        isMulti
                                        options={destinations.map(dest => ({
                                            value: dest.Cities,
                                            label: dest.Cities
                                        }))}
                                        className="text-black"
                                        placeholder="انتخاب مسیرها"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-sm font-medium mb-2">نوع اتوبوس</label>
                            <Controller
                                name="busType"
                                control={control}
                                rules={{required: true}}
                                render={({field}) => (
                                    <Select
                                        {...field}
                                        options={busTypeOptions}
                                        className="text-black"
                                        placeholder="انتخاب نوع اتوبوس"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-sm font-medium mb-2">امکانات</label>
                            <button
                                type="button"
                                onClick={addFacility}
                                className="bg-green-700 text-white p-2 rounded mt-2 transition-all duration-300 hover:bg-green-800"
                            >
                                افزودن
                            </button>
                        </div>
                        <div className="col-span-12 mt-4">
                            {facilities.map((facility, index) => (
                                <div key={index} className="flex justify-between items-center mb-2">
                                    <input
                                        className="p-2 rounded bg-gray-700 text-white w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        value={facility}
                                        onChange={(event) => handleFacilityChange(index, event)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFacility(index)}
                                        className="bg-red-500 text-white p-2 ml-2 rounded hover:bg-red-600 transition-all duration-300"
                                    >
                                        حذف
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="col-span-6">
                            <label className="block text-sm font-medium mb-2">ظرفیت صندلی</label>
                            <input
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                type="number"
                                placeholder="ظرفیت صندلی"
                                {...register("capacity", {required: true})}
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-sm font-medium mb-2">رانندگان</label>
                            <Controller
                                name="driverIds"
                                control={control}
                                render={({field}) => (
                                    <Select
                                        {...field}
                                        isMulti
                                        options={drivers.map(driver => ({
                                            value: driver._id,
                                            label: driver.name
                                        }))}
                                        className="text-black"
                                        placeholder="انتخاب رانندگان"
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
                                {isEdit ? "ذخیره تغییرات" : "ثبت اتوبوس"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};