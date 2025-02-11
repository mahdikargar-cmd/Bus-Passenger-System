import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../Main-page/Header/Header";
import api from "../../Services/Api";
import { FaBus } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import moment from "moment-jalaali";
import Search from "../Main-page/Search-section/Search";

export const Services = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const originId = queryParams.get('origin');
    const destinationId = queryParams.get('destination');
    const [buses, setBuses] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiServices, setApiServices] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [busResponse, servicesResponse] = await Promise.all([
                api.get("/bus"),
                originId && destinationId
                    ? api.get(`services?origin=${originId}&destination=${destinationId}`)
                    : Promise.resolve({ data: [] })
            ]);

            setBuses(busResponse.data || []);
            setCooperatives(busResponse.data || []);
            setApiServices(servicesResponse.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("خطا در دریافت اطلاعات. لطفا صفحه را مجددا بارگذاری کنید.");
        } finally {
            setLoading(false);
        }
    }, [originId, destinationId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatDate = (date) => {
        if (!date) return 'نامشخص';
        try {
            return moment(date).format('jYYYY/jMM/jDD');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'نامشخص';
        }
    };

    const formatTime = (time) => {
        if (!time) return 'نامشخص';
        try {
            if (time && typeof time === 'object' && time.moveTime) {
                time = time.moveTime;
            }
            return moment(time, 'HH:mm').format('HH:mm');
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'نامشخص';
        }
    };

    const handleServiceView = (service) => {
        const serviceData = {
            _id: service._id,
            CompanyName: service.CompanyName,
            BusType: service.BusType,
            SelectedRoute: service.SelectedRoute,
            movementDate: service.movementDate,
            movementTime: service.movementTime,
            ChairCapacity: service.ChairCapacity,
            ticketPrice: service.ticketPrice,
            ServicesOption: service.ServicesOption || []
        };

        localStorage.setItem('selectedService', JSON.stringify(serviceData));
        navigate(`/services/se/${service._id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600 text-center p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-24">
            <div className="sticky top-0 z-50">
                <Header />
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <Search />
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white-blue text-white p-3 rounded-lg shadow mb-4">
                            <p className="text-sm md:text-base">
                                تعداد {apiServices.length} سرویس یافت شد
                            </p>
                        </div>

                        {apiServices.length === 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow text-center">
                                <p className="text-gray-600">هیچ سرویسی برای مسیر انتخابی یافت نشد.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {apiServices.map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className="bg-white rounded-lg shadow-lg p-4 transition-transform duration-300 hover:scale-[1.02]"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <FaBus className="text-gray-500" />
                                                <span className="font-medium">نام تعاونی:</span>
                                                <span>
                                                    {typeof item.CompanyName === 'object'
                                                        ? item.CompanyName?.CoperativeName || 'نامشخص'
                                                        : item.CompanyName || 'نامشخص'}
                                                </span>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex items-center gap-2">
                                                    <CiClock2 className="text-gray-500" size={20} />
                                                    <span className="text-sm">
                                                        ساعت حرکت: {formatTime(item.movementTime)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <CiClock2 className="text-gray-500" size={20} />
                                                    <span className="text-sm">
                                                        تاریخ حرکت: {formatDate(item.movementDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">نوع اتوبوس:</span>
                                                <span>
                                                    {typeof item.BusType === 'object'
                                                        ? item.BusType?.busType || 'نامشخص'
                                                        : item.BusType || 'نامشخص'}
                                                </span>
                                            </div>
                                            <div className="text-sm md:text-md font-medium">
                                                <span className="font-bold text-admin-modal ml-1">مسیر:</span>{' '}
                                                {item.SelectedRoute && item.SelectedRoute.origin && item.SelectedRoute.destination ?
                                                    `${item.SelectedRoute.origin.Cities} به ${item.SelectedRoute.destination.Cities}` :
                                                    'نامشخص'
                                                }
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">ظرفیت:</span>
                                                <span>
                                                    {typeof item.ChairCapacity === 'object'
                                                        ? item.ChairCapacity?.capacity || 'نامشخص'
                                                        : item.ChairCapacity || 'نامشخص'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleServiceView(item)}
                                                    className="bg-white-blue p-2 rounded-full text-white pl-4 ps-4"
                                                >
                                                    مشاهده
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;