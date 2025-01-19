import React, { useEffect, useState, useCallback } from "react";
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
    const [apiServices, setApiServices] = useState([]);

    // Use useCallback to memoize functions
    const fetchCities = useCallback(async () => {
        try {
            const response = await api.get("destination");
            setCities(response.data || []);
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    }, []);

    const fetchRoutes = useCallback(async () => {
        try {
            const response = await api.get("busMovement");
            setRoutes(response.data || []);
        } catch (error) {
            console.error("Error fetching routes", error);
        }
    }, []);

    const fetchBuses = useCallback(async () => {
        try {
            const response = await api.get("bus");
            const busData = response.data || [];
            setBuses(busData);
            setCooperatives(busData);
        } catch (error) {
            console.error("Error fetching buses", error);
        }
    }, []);

    const fetchFilteredServices = useCallback(async () => {
        if (originId && destinationId) {
            try {
                const response = await api.get(`services?origin=${originId}&destination=${destinationId}`);
                setApiServices(response.data || []);
            } catch (error) {
                console.error("Error fetching services", error);
                setApiServices([]);
            }
        }
    }, [originId, destinationId]);

    const fetchAllData = useCallback(async () => {
        try {
            await Promise.all([
                fetchCities(),
                fetchRoutes(),
                fetchBuses()
            ]);
        } catch (error) {
            console.error("Error fetching initial data", error);
        }
    }, [fetchCities, fetchRoutes, fetchBuses]);

    // Use useEffect with proper dependencies
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        fetchFilteredServices();
    }, [fetchFilteredServices]);

    const formatDate = (date) => {
        return date ? moment(date).format('jYYYY-jMM-jDD') : 'نامشخص';
    };

    const handleServiceClick = (serviceId) => {
        navigate(`/services/se/${serviceId}`);
    };

    const getCompanyNameById = (id) => {
        const company = cooperatives.find(company => company._id === id);
        return company ? company.companyName : 'نامشخص';
    };

    const getRouteNameById = (id) => {
        // If no routes or id, return default
        if (!id || routes.length === 0) return 'نامشخص';

        const route = routes.find(route => route._id === id);
        if (!route) return 'نامشخص';

        // Safety checks for origin and destination
        const originCity = cities.find(c => c._id === route.origin);
        const destinationCity = cities.find(c => c._id === route.destination);

        // If either origin or destination is not found, return default
        if (!originCity || !destinationCity) return 'نامشخص';

        return `${originCity.Cities || 'نامشخص'} به ${destinationCity.Cities || 'نامشخص'}`;
    };

    // Added a comment to suppress eslint warning if you want to use this in the future
    // eslint-disable-next-line no-unused-vars
    const getServiceOptionsByIds = (ids) => {
        if (!ids || !Array.isArray(ids)) return [];

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
            <div>
                <div className="grid grid-cols-12 m-2 p-4">
                    <div className="col-span-12 rounded m-2 p-2">
                        <div>
                            <p className="bg-white-blue text-white p-2 m-1 rounded shadow">
                                تعداد {apiServices.length} سرویس یافت شد
                            </p>
                        </div>

                        {apiServices.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="bg-white font-normal dark:bg-dark-blue dark:text-white mt-5 rounded-2xl shadow-2xl mb-5"
                            >
                                {/* Rest of the rendering logic remains the same */}
                                <div className={'grid grid-cols-12 text-[20px]'}>
                                    <div className={'flex justify-between col-span-12 p-5 '}>
                                        <p className={'mr-7 flex '}>
                                            <p className={ 'flex gap-2 text-gray-500 font-serif'}>
                                                <FaBus/> نام تعاونی :
                                            </p>
                                            {getCompanyNameById(item.CompanyName)}
                                        </p>
                                        <p className={'text-[15px] ml-7 flex gap-2 items-center align-baseline'}>
                                            <CiClock2 size={24}/>
                                            ساعت حرکت : {item.movementTime}
                                        </p>
                                        <p className={'text-[15px] ml-7 flex gap-2 items-center align-baseline'}>
                                            <CiClock2 size={24}/>
                                            تاریخ حرکت : {formatDate(item.movementDate)}
                                        </p>
                                    </div>
                                </div>
                                {/* Rest of the component remains the same */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services;