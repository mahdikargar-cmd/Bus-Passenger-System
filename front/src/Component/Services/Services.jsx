import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../Main-page/Header/Header";
import api from "../../Services/Api";
import {FaBus} from "react-icons/fa";
import {CiClock2} from "react-icons/ci";
import moment from "moment-jalaali";

export const Services = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const originId = queryParams.get('origin');
    const destinationId = queryParams.get('destination');

    const [buses, setBuses] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    const [busMovements, setBusMovements] = useState([]);
    const [apiServices, setApiServices] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (originId && destinationId) {
            fetchFilteredServices();
        }
    }, [originId, destinationId]);
    const formatDate = (date) => {
        return moment(date).format('jYYYY-jMM-jDD');
    };
    const handleServiceClick = (serviceId) => {
        navigate(`/services/se/${serviceId}`);
    };

    const fetchAllData = async () => {
        await Promise.all([
            fetchCities(),
            fetchRoutes(),
            fetchBuses(),
            fetchBusMovements()
        ]);
    };

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
            const response = await api.get("route");
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

    const fetchBusMovements = async () => {
        try {
            const response = await api.get("busMovement");
            setBusMovements(response.data);
        } catch (error) {
            console.error("Error fetching bus movements", error);
        }
    };

    const fetchFilteredServices = async () => {
        try {
            const response = await api.get(`services?origin=${originId}&destination=${destinationId}`);
        const  j=  setApiServices(response.data);
        console.log(j)
        } catch (error) {
            console.error("Error fetching services", error);
        }
    };

    const getCompanyNameById = (id) => {
        const company = cooperatives.find(company => company._id === id);
        return company ? company.companyName : 'Unknown';
    };

    const getRouteNameById = (id) => {
        const route = routes.find(route => route._id === id);
        if (!route) return 'Unknown';
        const originCity = cities.find(c => c._id === route.origin)?.Cities;
        const destinationCity = cities.find(c => c._id === route.destination)?.Cities;
        return originCity && destinationCity ?` ${originCity} به ${destinationCity} `: 'Unknown';
    };

    const getServiceOptionsByIds = (ids) => {
        let facilities = [];
        ids.forEach(id => {
            const bus = buses.find(bus => bus._id === id);
            if (bus && bus.facilities) {
                facilities = facilities.concat(bus.facilities);
            }
        });
        return facilities;
    };

    return (
        <>
            <Header />
            <div className={''}>
                <div className={'grid grid-cols-12 m-2 p-4'}>
                    <div className={'col-span-12  rounded m-2 p-2   '}>
                        {/*
                    <div className={'flex justify-center items-center '}>
                        <div><AiOutlineRight className={'text-[25px]'} /></div>
                        <div className={'flex'}>
                            <div className={'flex flex-col bg-blue-50 p-3 m-2 justify-center rounded'}>
                                <p>دوشنبه</p>
                                <p>14 خرداد</p>
                             </div>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className={'flex flex-col bg-blue-50 p-3 m-2 justify-center rounded'}>
                                    <p>سه شنبه</p>
                                    <p>14 خرداد</p>
                                </div>
                            ))}
                        </div>
                        <div><AiOutlineLeft className={'text-[25px]'} /></div>
                    </div>
*/}
                        <div>
                            <p className={'bg-white-blue text-white p-2 m-1 rounded shadow'}>تعداد {apiServices.length} سرویس یافت شد</p>
                        </div>

                        {apiServices.map((item, index) => (
                            <div key={index} className={'  bg-white font-normal dark:bg-dark-blue dark:text-white mt-5 rounded-2xl shadow-2xl mb-5'}>
                                <div className={'grid grid-cols-12 text-[20px]'}>
                                    <div className={'flex justify-between col-span-12 p-5 '}>
                                        <p className={'mr-7 flex '}><p className={ 'flex gap-2 text-gray-500 font-serif'}> <FaBus/>     نام تعاونی :
                                        </p> {getCompanyNameById(item.CompanyName)}</p>
                                        <p className={'text-[15px] ml-7 flex gap-2 items-center align-baseline'}><CiClock2 size={24}/>
                                            ساعت حرکت : {item.movementTime}</p>
                                        <p className={'text-[15px] ml-7 flex gap-2 items-center align-baseline'}><CiClock2 size={24}/>
                                            تاریخ حرکت : {formatDate(item.movementDate)}</p>

                                    </div>
                                </div>
                                <div className={'grid grid-cols-12'}>
                                    <div className={'col-span-9  p-10 '}>
                                        <div className={'flex justify-between'}>
                                            <p>{getRouteNameById(item.SelectedRoute)}</p>
                                        </div>
                                        <div className={'flex flex-col p-2'}>
                                            <p className={'p-2 text-blue-700 dark:text-white'}>MAN {item.BusType}</p>
{/*
                                            <p className={'p-2'}>امکانات سرویس: {getServiceOptionsByIds(item.ServicesOption)}</p>
*/}
                                        </div>
                                    </div>
                                    <div className={'col-span-3 flex justify-center items-center p-2 flex-col '}>
                                        <p className={'p-2'}>{item.ChairCapacity} صندلی خالی</p>
                                        <p className={'p-2'}>{item.ticketPrice} ریال</p>
                                        <button
                                            className={'p-3 m-3 border-blue-500 border-2 rounded-full hover:bg-blue-500 hover:text-white transition-all ease-out '}
                                            onClick={() => handleServiceClick(item._id)}>
                                            مشاهده و خرید
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
};

export default Services;