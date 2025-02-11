import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, AlertCircle, TicketX } from 'lucide-react';
import api from "../../../Services/Api";

export const TicketInquiry = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [ticketData, setTicketData] = useState(null);
    const [buses, setBuses] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    useEffect(() => {
        fetchRoutes();
        fetchBuses();
        fetchCities();
    }, []);
    const fetchCities = async () => {
        try {
            const response = await api.get('/destination');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };
    const fetchRoutes = async () => {
        try {
            const response = await api.get('/Route');
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching routes', error);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.get('/bus');
            setBuses(response.data);
            setCooperatives(response.data);
        } catch (error) {
            console.error('Error fetching buses', error);
        }
    };
    useEffect(() => {
        const data = localStorage.getItem('ticketData');
        if (data) {
            setTicketData(JSON.parse(data));
        }
    }, []);
    const getCompanyNameById = (id) => {
        const company = buses.find((company) => company._id === id);
        return company ? company.companyName : 'Unknown';
    };
    const handleFetchTickets = async () => {
        if (!ticketNumber.trim()) {
            setMessage('لطفاً شماره بلیط را وارد کنید');
            return;
        }
        setLoading(true);
        try {
            const response = await api.get(`/tickets/number/${ticketNumber}`);
            setTickets(Array.isArray(response.data) ? response.data : [response.data]);
            setMessage('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'خطا در دریافت اطلاعات بلیط');
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };
    const getBusNameById = (id) => {
        const bus = buses.find((bus) => bus._id === id);
        return bus ? bus.busName : 'Unknown';
    };

    const getRouteNameById = (id) => {
        const route = routes.find((route) => route._id === id);
        const origin = cities.find((c) => c._id === route.origin)?.Cities;
        const destination = cities.find((c) => c._id === route.destination)?.Cities;
        return route ? `${origin} به ${destination} ` : 'Unknown';
    };

    const handleCancel = async () => {
        if (!window.confirm('آیا از استرداد این بلیط اطمینان دارید؟')) {
            return;
        }
        setCancelling(true);
        try {
            const response = await api.delete(`/tickets/number/${ticketNumber}`);
            setMessage('بلیط با موفقیت لغو شد');
            setTickets([]);
        } catch (error) {
            setMessage(error.response?.data?.message || 'خطا در لغو بلیط');
        } finally {
            setCancelling(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Search Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                            استرداد بلیط
                        </h1>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                            <div className="relative w-full md:w-2/3">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                                             bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                             transition-all duration-200"
                                    value={ticketNumber}
                                    onChange={(e) => setTicketNumber(e.target.value)}
                                    placeholder="شماره بلیط را وارد کنید"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                            <button
                                onClick={handleFetchTickets}
                                disabled={loading}
                                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700
                                         text-white rounded-lg transition-colors duration-200
                                         flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <><RefreshCw className="animate-spin" size={20} /> در حال جستجو...</>
                                ) : (
                                    <><Search size={20} /> جستجوی بلیط</>
                                )}
                            </button>
                        </div>

                        {message && (
                            <div className={`flex items-center justify-center gap-2 text-sm mt-4 ${
                                message.includes('موفقیت') ? 'text-green-500' : 'text-red-500'
                            }`}>
                                <AlertCircle size={16} />
                                {message}
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Details */}
                {tickets.map(ticket => (
                    <div key={ticket._id} className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Passenger Information */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                        اطلاعات مسافر
                                    </h2>
                                    <div className="space-y-3">
                                        <InfoItem label="شماره بلیط" value={ticket.ticketNumber} />
                                        <InfoItem label="نام" value={ticket.firstName} />
                                        <InfoItem label="نام خانوادگی" value={ticket.lastName} />
                                        <InfoItem label="شماره تلفن" value={ticket.phone} />
                                        <InfoItem label="کد ملی" value={ticket.nationalCode} />
                                        <InfoItem label="تاریخ تولد" value={ticket.birthDate} />
                                        <InfoItem label="جنسیت" value={ticket.gender} />
                                        <InfoItem label="شماره صندلی" value={ticket.seatNumber} />
                                    </div>
                                </div>

                                {/* Service Details */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                        جزئیات سرویس
                                    </h2>
                                    <div className="space-y-3">
                                        <InfoItem
                                            label="نام شرکت"
                                            value={getCompanyNameById(ticket.serviceDetails.CompanyName)}
                                        />
                                        <InfoItem
                                            label="نام اتوبوس"
                                            value={getBusNameById(ticket.serviceDetails.busName)}
                                        />
                                        <InfoItem
                                            label="مسیر"
                                            value={getRouteNameById(ticket.serviceDetails.SelectedRoute)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cancel Button */}
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700
                                             text-white rounded-lg transition-colors duration-200
                                             disabled:opacity-50"
                                >
                                    {cancelling ? (
                                        <><RefreshCw className="animate-spin" size={20} /> در حال لغو بلیط...</>
                                    ) : (
                                        <><TicketX size={20} /> استرداد بلیط</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper component for displaying information items
const InfoItem = ({ label, value }) => (
    <div className="flex flex-col space-y-1">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-gray-800 dark:text-white">{value || '—'}</span>
    </div>
);

export default TicketInquiry;
