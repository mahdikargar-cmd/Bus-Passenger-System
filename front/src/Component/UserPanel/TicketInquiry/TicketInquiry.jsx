import React, { useEffect, useState } from 'react';
import api from "../../../Services/Api";
import moment from "moment-jalaali";

export const TicketInquiry = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const [ticketData, setTicketData] = useState(null);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
    }, []);

    // دریافت شهرها
    const fetchCities = async () => {
        try {
            const response = await api.get('destination');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };

    // قالب‌بندی تاریخ به فرمت جلالی
    const formatDate = (date) => {
        return moment(date).format('jYYYY-jMM-jDD');
    };

    // دریافت مسیرها
    const fetchRoutes = async () => {
        try {
            const response = await api.get('Route');
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching routes', error);
        }
    };

    // دریافت اتوبوس‌ها (و اطلاعات شرکت)
    const fetchBuses = async () => {
        try {
            const response = await api.get('bus');
            setBuses(response.data);
        } catch (error) {
            console.error('Error fetching buses', error);
        }
    };

    // دریافت اطلاعات بلیط از localStorage (در صورت وجود)
    useEffect(() => {
        const data = localStorage.getItem('ticketData');
        if (data) {
            setTicketData(JSON.parse(data));
        }
    }, []);

    // گرفتن نام شرکت بر اساس شناسه
    const getCompanyNameById = (id) => {
        const company = buses.find((company) => company._id === id);
        return company ? company.companyName : 'نامشخص';
    };

    // جستجوی بلیط‌ها بر اساس شماره بلیط
    const handleFetchTickets = async () => {
        try {
            console.log(`Fetching tickets for ticket number: ${ticketNumber}`);
            const response = await api.get(`/tickets/number/${ticketNumber}`);
            console.log('Fetched tickets:', response.data);
            setTickets(Array.isArray(response.data) ? response.data : [response.data]);
            setMessage('');
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setMessage(error.response ? error.response.data.message : 'Error fetching tickets');
            setTickets([]);
        }
    };

    // دریافت نام اتوبوس بر اساس شناسه
    const getBusNameById = (id) => {
        const bus = buses.find((bus) => bus._id === id);
        return bus ? bus.busName : 'نامشخص';
    };

    // دریافت نام مسیر بر اساس شناسه (با استفاده از اطلاعات شهرها)
    const getRouteNameById = (id) => {
        const route = routes.find((route) => route._id === id);
        if (route) {
            const origin = cities.find((c) => c._id === route.origin)?.Cities;
            const destination = cities.find((c) => c._id === route.destination)?.Cities;
            return `${origin} به ${destination}`;
        }
        return 'نامشخص';
    };

    // دریافت گزینه‌های سرویس (در صورت نیاز)
    const getServiceOptionsByIds = (ids) => {
        return ids.map((id) => {
            const service = buses.find((service) => service._id === id);
            return service ? service.facilities : 'نامشخص';
        });
    };

    // لغو بلیط‌ها بر اساس شماره بلیط
    const handleCancel = async () => {
        try {
            console.log(`Cancelling all tickets with ticket number: ${ticketNumber}`);
            const response = await api.delete(`/tickets/number/${ticketNumber}`);
            console.log('Cancellation response:', response.data);
            setMessage(response.data.message);
            setTickets([]);
        } catch (error) {
            console.error('Error cancelling tickets:', error);
            setMessage(error.response ? error.response.data.message : 'Error cancelling tickets');
        }
    };

    return (
        <div className="w-full p-4 flex justify-center bg-gray-100 dark:bg-gray-800">
            <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold text-center mb-6 dark:text-white">
                    استرداد بلیط
                </h1>
                {/* بخش جستجو */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <input
                        className="w-full sm:w-auto flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value)}
                        placeholder="شماره بلیط را وارد کنید"
                    />
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                        onClick={handleFetchTickets}
                    >
                        جستجو
                    </button>
                </div>
                {message && (
                    <div className="mb-4 text-center text-red-600">
                        {message}
                    </div>
                )}
                {/* نمایش بلیط‌ها */}
                {tickets.length > 0 ? (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div key={ticket._id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="text-sm">
                                        <span className="font-medium">شماره بلیط:</span> {ticket.ticketNumber || ticketData?.ticketNumber}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">نام:</span> {ticketData?.firstName}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">نام خانوادگی:</span> {ticketData?.lastName}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">شماره تلفن:</span> {ticketData?.phone}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">کدملی:</span> {ticketData?.nationalCode}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">تاریخ تولد:</span> {ticketData?.birthDate}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">جنسیت:</span> {ticketData?.gender}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">شماره صندلی:</span> {ticketData?.seatNumber}
                                    </div>
                                    <div className="text-sm col-span-1 sm:col-span-2 mt-4">
                                        <span className="font-medium">جزئیات سرویس:</span>
                                    </div>
                                    <div className="text-sm col-span-1 sm:col-span-2">
                                        <span className="font-medium">نام شرکت:</span> {getCompanyNameById(ticketData?.serviceDetails?.CompanyName)}
                                    </div>
                                    {/* در صورت نیاز می‌توانید اطلاعات بیشتری را اضافه کنید */}
                                </div>
                            </div>
                        ))}
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                            onClick={handleCancel}
                        >
                            استرداد بلیط
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        بلیطی یافت نشد.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketInquiry;
