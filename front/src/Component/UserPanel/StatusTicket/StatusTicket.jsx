import React, { useEffect, useState } from 'react';
import api from "../../../Services/Api";

export const StatusTicket = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await api.get('destination');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await api.get('Route');
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching routes', error);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.get('bus');
            setBuses(response.data);
        } catch (error) {
            console.error('Error fetching buses', error);
        }
    };

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

    const handlePrint = () => {
        window.print();
    };

    const getCompanyNameById = (id) => {
        const company = buses.find((company) => company._id === id);
        return company ? company.companyName : 'Unknown';
    };

    const getBusNameById = (id) => {
        const bus = buses.find((bus) => bus._id === id);
        return bus ? bus.busName : 'Unknown';
    };

    const getRouteNameById = (id) => {
        const route = routes.find((route) => route._id === id);
        const origin = cities.find((c) => c._id === route.origin)?.Cities;
        const destination = cities.find((c) => c._id === route.destination)?.Cities;
        return route ? `${origin} به ${destination}` : 'Unknown';
    };

    const getServiceOptionsByIds = (ids) => {
        return ids.map((id) => {
            const service = buses.find((service) => service._id === id);
            return service ? service.facilities : 'Unknown';
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* بخش جستجو */}
            <div className="bg-white-blue dark:bg-dark-blue dark:text-white rounded-3xl shadow-lg p-6 max-w-3xl mx-auto">
                <h1 className="text-center text-2xl font-semibold bg-orange-500 text-white rounded-md py-2 mb-6">
                    استعلام با شماره بلیط
                </h1>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <input
                        type="text"
                        className="w-full sm:w-auto flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                    <p className="mt-4 text-center text-red-500">{message}</p>
                )}
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                    لطفاً شماره بلیط 12 کاراکتری (شامل رقم، حروف و خط تیره) خود را وارد نمایید.
                </p>
            </div>

            {/* نمایش بلیط‌ها */}
            {tickets.length > 0 && (
                <div className="mt-8 space-y-8">
                    {tickets.map(ticket => (
                        <div key={ticket._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* ستون سمت چپ */}
                                <div className="space-y-2">
                                    <p><span className="font-medium">شماره بلیط:</span> {ticket.ticketNumber}</p>
                                    <p><span className="font-medium">نام:</span> {ticket.firstName}</p>
                                    <p><span className="font-medium">نام خانوادگی:</span> {ticket.lastName}</p>
                                    <p><span className="font-medium">شماره تلفن:</span> {ticket.phone}</p>
                                    <p><span className="font-medium">کدملی:</span> {ticket.nationalCode}</p>
                                    <p><span className="font-medium">تاریخ تولد:</span> {ticket.birthDate}</p>
                                    <p><span className="font-medium">جنسیت:</span> {ticket.gender}</p>
                                    <p><span className="font-medium">شماره صندلی:</span> {ticket.seatNumber}</p>
                                    <h2 className="font-semibold mt-4">جزئیات سرویس</h2>
                                    <p>
                                        <span className="font-medium">نام شرکت:</span>{' '}
                                        {getCompanyNameById(ticket.serviceDetails.CompanyName)}
                                    </p>
                                </div>
                                {/* ستون سمت راست */}
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-medium">نام اتوبوس:</span>{' '}
                                        {getBusNameById(ticket.serviceDetails.busName)}
                                    </p>
                                    <p>
                                        <span className="font-medium">نوع اتوبوس:</span>{' '}
                                        {ticket.serviceDetails.BusType}
                                    </p>
                                    <p>
                                        <span className="font-medium">مسیر انتخاب شده:</span>{' '}
                                        {getRouteNameById(ticket.serviceDetails.SelectedRoute)}
                                    </p>
                                    <p>
                                        <span className="font-medium">تاریخ حرکت:</span>{' '}
                                        {ticket.serviceDetails.movementDate}
                                    </p>
                                    <p>
                                        <span className="font-medium">زمان حرکت:</span>{' '}
                                        {ticket.serviceDetails.movementTime}
                                    </p>
                                    <p>
                                        <span className="font-medium">ظرفیت صندلی‌ها:</span>{' '}
                                        {ticket.serviceDetails.ChairCapacity}
                                    </p>
                                    <p>
                                        <span className="font-medium">قیمت بلیط:</span>{' '}
                                        {ticket.serviceDetails.ticketPrice}
                                    </p>
                                    <p>
                                        <span className="font-medium">گزینه‌های سرویس:</span>{' '}
                                        {getServiceOptionsByIds(ticket.serviceDetails.ServicesOption)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center mt-6">
                                <button
                                    className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded transition-colors"
                                    onClick={handlePrint}
                                >
                                    چاپ بلیط
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatusTicket;
