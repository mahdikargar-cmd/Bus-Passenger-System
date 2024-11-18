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
    const [openModal, setOpenModal] = useState(false);
    const [facilities, setFacilities] = useState([""]);
    const [isEdit, setIsEdit] = useState(false);
    const [currentBus, setCurrentBus] = useState(null);

    useEffect(() => {
        fetchBuses();
        fetchDrivers();
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

    const onSubmit = async (data) => {
        data.routes = data.routes.split(",");
        data.facilities = facilities;
        data.driverIds = data.driverIds.map(driver => driver.value); // Extract driver IDs

        try {
            if (isEdit && currentBus) {
                await api.patch(`bus/updateBus/${currentBus._id}`, data, {
                    headers: {'Content-Type': 'application/json'}
                });
                setBuses(buses.map(item => item._id === currentBus._id ? {...item, ...data} : item));
            } else {
                const response = await api.post("bus/registerBus", data, {
                    headers: {'Content-Type': 'application/json'}
                });
                setBuses([...buses, response.data]);
            }
            closeModalHandler();
        } catch (error) {
            console.error("Error adding bus", error);
        }
    };

    const deleteBus = async (id) => {
        try {
            await api.delete(`bus/deleteBus/${id}`);
            await fetchBuses();
        } catch (error) {
            console.error("Error deleting bus", error);
        }
    };

    const openModalHandler = (bus) => {
        if (bus) {
            setValue("busName", bus.busName);
            setValue("companyName", bus.companyName);
            setValue("routes", bus.routes.join(", "));
            setValue("busType", bus.busType);
            setValue("facilities", bus.facilities);
            setValue("capacity", bus.capacity);
            setValue("driverIds", bus.driverIds.map(driver => ({
                value: driver,
                label: drivers.find(d => d._id === driver)?.name
            }))); // Set driver IDs
            setFacilities(bus.facilities);
            setIsEdit(true);
            setCurrentBus(bus);
        } else {
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

    return (
        <>
            <div className="grid grid-cols-12 mb-3">
                <div className="col-span-6 pr-3 pl-3 pt-2 rounded flex justify-between bg-green-300 ml-7">
                    <p className="text-fuchsia-900"> مدیریت اتوبوس ها </p>
                    <button onClick={() => openModalHandler(null)} className="text-fuchsia-900 p-1">افزودن</button>
                </div>
                <div className="flex justify-between col-span-6 bg-green-300 p-2 rounded">
                    <p className="text-white">جستجو</p>
                    <input type="search" className="rounded w-[400px]"/>
                </div>
            </div>

            <div className="grid grid-cols-12 mt-2 bg-slate-300">
                {buses.map((bus, index) => (
                    <div className="flex justify-between m-2 p-2 col-span-12" key={bus._id}>
                        <div className="col-span-1 ml-10  mr-1"> شماره: {index + 1} </div>
                        <div className="col-span-1 ml-10 "> نام اتوبوس: {bus.busName} </div>
                        <div className="col-span-1 ml-10 "> نام تعاونی: {bus.companyName} </div>
                        <div className="col-span-2 ml-10 "> مسیرها: {bus.routes.join(", ")} </div>
                        <div className="col-span-2 ml-10 "> نوع اتوبوس: {bus.busType} </div>
                        <div className="col-span-2 ml-10 "> امکانات: {bus.facilities.join(", ")} </div>
                        <div className="col-span-2 ml-10 "> ظرفیت صندلی: {bus.capacity} </div>
                        <div className="col-span-2 ml-10 "> رانندگان: {bus.driverIds.map(driverId => drivers.find(driver => driver._id === driverId)?.name).join(", ") || "نامشخص"} </div>
                        <div className="col-span-2 ml-10 "> ثبت شده
                            در: {new Date(bus.createdAt).toLocaleString("fa-IR")} </div>
                        <div className="col-span-1 ml-14 text-white font-semibold text-[22px]">
                            <BiEdit onClick={() => openModalHandler(bus)}/>
                        </div>
                        <div className="col-span-1 ml-14 text-white font-semibold text-[22px]"
                             onClick={() => deleteBus(bus._id)}>
                            <AiFillDelete/>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={closeModalHandler}
                className="bg-slate-500 w-[700px] flex justify-center text-white p-2 mt-20 mr-[30%] h-[500px] rounded"
            >
                <div>
                    <h1 className="mt-4 text-[20px] font-semibold mb-5">
                        {isEdit ? "ویرایش مشخصات اتوبوس" : "ثبت اتوبوس جدید"}
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12">
                            <div className="flex justify-between items-center col-span-12">
                                <div className="col-span-6">
                                    <label>نام اتوبوس</label>
                                    <input
                                        className="p-2 mr-2 rounded text-black mt-2"
                                        type="text"
                                        placeholder="نام اتوبوس"
                                        {...register("busName", {required: true})}
                                    />
                                </div>
                                <div className="col-span-6 mr-6">
                                    <label>نام تعاونی</label>
                                    <input
                                        className="p-2 mr-2 rounded text-black mt-2"
                                        type="text"
                                        placeholder="نام تعاونی"
                                        {...register("companyName", {required: true})}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center col-span-12">
                                <div className="col-span-6">
                                    <label>مسیرها</label>
                                    <input
                                        className="p-2 mr-2 rounded text-black mt-2"
                                        type="text"
                                        placeholder="مسیرها رو با ، از هم جدا کنید"
                                        {...register("routes", {required: true})}
                                    />
                                </div>
                                <div className="col-span-6 mr-6 flex justify-between mt-1 ">
                                    <label className={'ml-7'}>امکانات</label>
                                    <button
                                        className="bg-green-700 text-white p-2 ml-1 rounded"
                                        type="button"
                                        onClick={addFacility}
                                    >
                                        افزودن
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col col-span-12 mr-6">
                                {facilities.map((facility, index) => (
                                    <div key={index} className="flex justify-between">
                                        <input
                                            className="p-2 mr-2 rounded text-black mt-2 flex-grow"
                                            type="text"
                                            placeholder="امکانات"
                                            value={facility}
                                            onChange={(event) => handleFacilityChange(index, event)}
                                        />
                                        <button
                                            className="bg-red-500 text-white p-2 ml-2 rounded"
                                            type="button"
                                            onClick={() => removeFacility(index)}
                                        >
                                            حذف
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center col-span-12">
                                <div className="col-span-6">
                                    <label>ظرفیت صندلی</label>
                                    <input
                                        className="p-2 mr-2 rounded text-black mt-2"
                                        type="number"
                                        placeholder="ظرفیت صندلی"
                                        {...register("capacity", {required: true})}
                                    />
                                </div>
                                <div className="col-span-6 mr-6">
                                    <label>نوع اتوبوس</label>
                                    <input
                                        className="p-2 mr-2 rounded text-black mt-2"
                                        type="text"
                                        placeholder="نوع اتوبوس"
                                        {...register("busType", {required: true})}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center col-span-12 mt-4">
                                <div className="col-span-6">
                                    <label>رانندگان</label>
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
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-10">
                            <button
                                type="button"
                                className="bg-red-500 text-white p-2 rounded"
                                onClick={closeModalHandler}
                            >
                                انصراف
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white p-2 rounded"
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
