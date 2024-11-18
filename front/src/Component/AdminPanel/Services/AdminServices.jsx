import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "react-modal";
import Select from 'react-select';
import api from "../../../Services/Api";
import "./admin.css";
import moment from "moment-jalaali";

export const AdminServices = () => {
    const { register, handleSubmit,reset , control, formState: { errors } } = useForm();
    const [buses, setBuses] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    const [busMovements, setBusMovements] = useState([]);
    const [capacities, setCapacities] = useState([]);
    const [servicesOptions, setServicesOptions] = useState([]);
    const [moveDates, setMoveDates] = useState([]);
    const [moveTimes, setMoveTimes] = useState([]);
    const [services, setServices] = useState([]);

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedCooperative, setSelectedCooperative] = useState(null);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [moveTime, setMoveTime] = useState(null);
    const [editingServiceId, setEditingServiceId] = useState(null);


    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
        fetchBusMovements();
        fetchServicesOptions();
    }, []);

    useEffect(() => {
        if (selectedBus) {
            const bus = buses.find(bus => bus._id === selectedBus.value);
            if (bus) {
                setCapacities([{ value: bus.capacity, label: bus.capacity.toString() }]);
                setServicesOptions(bus.facilities.map(facility => ({ value: facility._id, label: facility })));
            }
        }
    }, [selectedBus]);

    useEffect(() => {
        if (busMovements.length > 0) {
            const dates = busMovements.map(movement => ({ value: movement.moveDate, label: moment(movement.moveDate).format('jYYYY-jMM-jDD') }));
            const times = busMovements.map(movement => ({ value: movement.moveTime, label: movement.moveTime }));
            setMoveDates(dates);
            setMoveTimes(times);
        }
    }, [busMovements]);

    const fetchCities = async () => {
        try {
            const response = await api.get("destination");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities", error);
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
            setCooperatives(response.data);
        } catch (error) {
            console.error("Error fetching buses", error);
        }
    };
    const fetchCoperative = async () => {
        try {
            const response = await api.get("Coperative");
            setBuses(response.data);
            setCooperatives(response.data);
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

    const openModalHandler = () => {
        setOpenModal(true);
    };

    const closeModalHandler = () => {
        setOpenModal(false);
    };
    const handleEdit = (service) => {
        setEditingServiceId(service._id);
        setSelectedCooperative({ value: service.CompanyName, label: getCompanyNameById(service.CompanyName) });
        setSelectedBus({ value: service.busName, label: getBusNameById(service.busName) });
        setSelectedRoute({ value: service.SelectedRoute, label: getRouteNameById(service.SelectedRoute) });
        setMoveTime({ value: service.moveTime, label: service.moveTime });
        setSelectedServices(service.ServicesOption.map(option => ({
            value: option,
            label: getServiceOptionsByIds([option])
        })));
        reset({
            CompanyName: { value: service.CompanyName, label: getCompanyNameById(service.CompanyName) },
            busName: { value: service.busName, label: getBusNameById(service.busName) },
            busType: service.BusType,
            route: { value: service.SelectedRoute, label: getRouteNameById(service.SelectedRoute) },
            moveDate: { value: service.movementDate, label: formatDate(service.movementDate) },
            moveTime: { value: service.moveTime, label: service.moveTime },
            ChairCapacity: service.ChairCapacity,
            ticketPrice: service.ticketPrice,
            ServicesOption: service.ServicesOption
        });
        openModalHandler();
    };

    const handleDelete = async (serviceId) => {
        try {
            await api.delete(`services/deleteService/${serviceId}`);
            fetchBusMovements();
        } catch (error) {
            console.error("Error deleting service", error);
        }
    };
    const onSubmit = async (data) => {
        const transformedData = {
            CompanyName: data.CompanyName.value,
            busName: data.busName.value,
            BusType: data.busType.value,
            SelectedRoute: data.route.value,
            movementDate: new Date(data.moveDate.value),
            movementTime: data.moveTime.value,
            ChairCapacity: parseInt(data.ChairCapacity.value, 10),
            ticketPrice: data.ticketPrice,
            ServicesOption: data.ServicesOption.value
        };

        try {
            const response = await api.post(
                "services/registerService",
                transformedData,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            console.log(response.data);
            closeModalHandler();
            fetchBusMovements();
        } catch (error) {
            console.error("Error adding service", error);
        }
    };

    const getCompanyNameById = (id) => {
        const company = buses.find(company => company._id === id);
        return company ? company.companyName : 'Unknown';
    };

    const getBusNameById = (id) => {
        const bus = buses.find(bus => bus._id === id);
        return bus ? bus.busName : 'Unknown';
    };

    const getRouteNameById = (id) => {
        const route = routes.find(route => route._id === id);
        const origin = cities.find(c => c._id === route.origin)?.Cities;
        const destination = cities.find(c => c._id === route.destination)?.Cities;
        return route ? `${origin} به ${destination} ` : 'Unknown';
    };

    const getServiceOptionsByIds = (ids) => {
        return ids.map(id => {
            const service = buses.find(service => service._id === id);  
            return service ? service.facilities : 'Unknown';
        }).join(', ');
    };

    const formatDate = (date) => {
        return moment(date).format('jYYYY-jMM-jDD');
    };

    return (
        <>
            <div className="grid grid-cols-12 mb-3">
                <div className="col-span-6 pr-3 pl-3 pt-2 rounded flex justify-between bg-green-300">
                    <p className="text-fuchsia-900">مدیریت سرویس‌ها</p>
                    <button className="text-fuchsia-900 bg-green-200 p-2 rounded" onClick={openModalHandler}>افزودن سرویس جدید</button>
                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th>نام تعاونی</th>
                    <th>نام اتوبوس</th>
                    <th>نوع اتوبوس</th>
                    <th>مسیر</th>
                    <th>تاریخ حرکت</th>
                    <th>ساعت حرکت</th>
                    <th>ظرفیت صندلی</th>
                    <th>قیمت بلیط</th>
                    <th>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {services.map((service, index) => (
                    <tr key={index}>
                        <td>{getCompanyNameById(service.CompanyName)}</td>
                        <td>{getBusNameById(service.busName)}</td>
                        <td>{service.BusType}</td>
                        <td>{getRouteNameById(service.SelectedRoute)}</td>
                        <td>{formatDate(service.movementDate)}</td>
                        <td>{service.movementTime}</td>
                        <td>{service.ChairCapacity}</td>
                        <td>{service.ticketPrice}</td>
                        <td>
                            <button onClick={() => handleEdit(service)}>ویرایش</button>
                            <button onClick={() => handleDelete(service._id)}>حذف</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Modal isOpen={openModal} onRequestClose={closeModalHandler}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 p-10">
                        <div className="flex justify-between items-center col-span-12 mb-5">
                            <div className="col-span-4">
                                <label>نام تعاونی</label>
                                <Controller
                                    name="CompanyName"
                                    control={control}
                                    defaultValue={selectedCooperative}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={cooperatives.map(item => ({ value: item._id, label: item.companyName }))}
                                            value={selectedCooperative}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSelectedCooperative(e);
                                            }}
                                            className="text-black"
                                        />
                                    )}
                                />
                                {errors.CompanyName && <p className="text-red-600">نام تعاونی الزامی است.</p>}
                            </div>
                            <div className="col-span-4">
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
                                                setSelectedBus(e);
                                            }}
                                            className="text-black"
                                        />
                                    )}
                                />
                                {errors.busName && <p className="text-red-600">نام اتوبوس الزامی است.</p>}
                            </div>
                            <div className="col-span-4">
                                <label>نوع اتوبوس</label>
                                <Controller
                                    name="busType"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={[
                                                { value: "VIP", label: "VIP" },
                                                { value: "معمولی", label: "معمولی" }
                                            ]}
                                            className="text-black"
                                        />
                                    )}
                                />
                                {errors.busType && <p className="text-red-600">نوع اتوبوس الزامی است.</p>}
                            </div>
                        </div>
                        <div className="flex justify-between items-center col-span-12 mb-5">
                            <div className="col-span-4">
                                <label>مسیر</label>
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
                                            value={selectedRoute}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSelectedRoute(e);
                                            }}
                                            className="text-black"
                                        />
                                    )}
                                />
                                {errors.route && <p className="text-red-600">مسیر الزامی است.</p>}
                            </div>
                            <div className="col-span-4">
                                <label>تاریخ حرکت</label>
                                <Controller
                                    name="moveDate"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={moveDates}
                                            className="text-black"
                                        />
                                    )}
                                />
                                {errors.moveDate && <p className="text-red-600">تاریخ حرکت الزامی است.</p>}
                            </div>
                            <div className="col-span-4">
                                <label>ساعت حرکت</label>
                                <Controller
                                    name="moveTime"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={moveTimes}
                                            className="text-black"
                                        />
                                    )}
                                />
                                {errors.moveTime && <p className="text-red-600">ساعت حرکت الزامی است.</p>}
                            </div>
                        </div>
                        <div className="flex justify-between items-center col-span-12 mb-5">
                            <div className="col-span-4">
                                <label>ظرفیت صندلی</label>
                                <Controller
                                    name="ChairCapacity"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={capacities}
                                            className="text-black"
                                        />
                                    )}
                                />
                                {errors.ChairCapacity && <p className="text-red-600">ظرفیت صندلی الزامی است.</p>}
                            </div>
                            <div className="col-span-4">
                                <label>قیمت بلیط</label>
                                <input
                                    type="number"
                                    {...register("ticketPrice", { required: true })}
                                    className="p-2 border rounded"
                                />
                                {errors.ticketPrice && <p className="text-red-600">قیمت بلیط الزامی است.</p>}
                            </div>
                            <div className="col-span-4">
                                <label>امکانات سرویس</label>
                                <Controller
                                    name="ServicesOption"
                                    control={control}
                                    defaultValue={selectedServices}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            isMulti
                                            options={servicesOptions}
                                            value={selectedServices}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSelectedServices(e);
                                            }}
                                            className="text-black"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <button type="submit">{editingServiceId ? 'ویرایش سرویس' : 'افزودن سرویس'}</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};
