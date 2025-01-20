import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const ServiceDetail = () => {
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [seatStatuses, setSeatStatuses] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        nationalCode: '',
        birthDate: '',
        gender: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const serviceId = window.location.pathname.split('/').pop();

    useEffect(() => {
        loadInitialData();
    }, [navigate]);

    const loadInitialData = () => {
        try {
            const storedService = localStorage.getItem('selectedService');
            if (!storedService) {
                navigate('/services');
                return;
            }

            const parsedService = JSON.parse(storedService);
            setService(parsedService);

            const totalSeats = parsedService?.ChairCapacity?.capacity || 44;
            initializeSeatStatuses(totalSeats);

            setLoading(false);
        } catch (error) {
            console.error('Error loading initial data:', error);
            navigate('/services');
        }
    };

    const initializeSeatStatuses = (totalSeats) => {
        const initialSeatStatuses = Array(totalSeats).fill().map((_, index) => ({
            seatNumber: index + 1,
            isOccupied: false
        }));
        setSeatStatuses(initialSeatStatuses);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        clearError(name);
    };

    const clearError = (fieldName) => {
        if (formErrors[fieldName]) {
            setFormErrors(prev => ({
                ...prev,
                [fieldName]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = [
            { name: 'firstName', label: 'نام' },
            { name: 'lastName', label: 'نام خانوادگی' },
            { name: 'phone', label: 'شماره تلفن' },
            { name: 'nationalCode', label: 'کد ملی' },
            { name: 'birthDate', label: 'تاریخ تولد' },
            { name: 'gender', label: 'جنسیت' }
        ];

        // Check required fields
        requiredFields.forEach(field => {
            if (!formData[field.name]?.trim()) {
                errors[field.name] = `${field.label} الزامی است`;
            }
        });

        // Validate phone number
        if (formData.phone && !/^09[0-9]{9}$/.test(formData.phone)) {
            errors.phone = 'شماره موبایل معتبر نیست';
        }

        // Validate national code
        if (formData.nationalCode && !/^[0-9]{10}$/.test(formData.nationalCode)) {
            errors.nationalCode = 'کد ملی باید ۱۰ رقم باشد';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('لطفا تمام فیلدها را به درستی پر کنید');
            return;
        }

        if (!selectedSeat) {
            alert('لطفا یک صندلی انتخاب کنید');
            return;
        }

        try {
            const ticketNumber = generateTicketNumber();
            const bookingData = createBookingData(ticketNumber);

            await updateSeatStatus(ticketNumber);
            saveBookingData(bookingData);

            navigate('/confirm');
        } catch (error) {
            console.error('Error during booking:', error);
            alert('خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.');
        }
    };

    const generateTicketNumber = () => {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    const createBookingData = (ticketNumber) => {
        return {
            passengerInfo: {
                ...formData,
                ticketNumber
            },
            seatInfo: {
                seatNumber: selectedSeat,
                isOccupied: true,
                ticketNumber
            },
            serviceInfo: {
                ...service,
                serviceId
            },
            ticketNumber,
            bookingDate: new Date().toISOString(),
            totalPrice: service.ticketPrice || 0,
            status: 'pending' // pending, confirmed, cancelled
        };
    };

    const updateSeatStatus = async (serviceId, seatNumber, isOccupied, ticketNumber) => {
        try {
            const response = await fetch(`http://localhost:5000/seats/${serviceId}/${seatNumber}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isOccupied,
                    ticketNumber,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Seat status updated successfully:", data);
            } else {
                console.error("Failed to update seat status:", await response.json());
            }
        } catch (error) {
            console.error("Error updating seat status:", error);
        }
    };

// فراخوانی تابع با مقادیر تستی
    updateSeatStatus("645cf4ce946dce181d4716ee", 7, true, "TICKET12345");

    const saveBookingData = (bookingData) => {
        // Save current booking data
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Save to booking history
        const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
        bookingHistory.push(bookingData);
        localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
    };

    const getSeatClassName = (seatNumber) => {
        const seatStatus = seatStatuses.find(seat => seat.seatNumber === seatNumber);
        if (seatStatus?.isOccupied) {
            return 'bg-red-500 cursor-not-allowed';
        }
        return selectedSeat === seatNumber
            ? 'bg-green-500 cursor-pointer'
            : 'bg-blue-500 hover:bg-blue-600 cursor-pointer';
    };

    const handleSeatSelection = (seatNumber) => {
        const seatStatus = seatStatuses.find(seat => seat.seatNumber === seatNumber);
        if (!seatStatus?.isOccupied) {
            setSelectedSeat(seatNumber);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    const totalSeats = service?.ChairCapacity?.capacity || 44;

    return (
        <div className="min-h-screen mt-24 bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Passenger Information Form */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">اطلاعات مسافر</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">نام</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="نام"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.firstName && (
                                        <span className="text-red-500 text-sm mt-1">{formErrors.firstName}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">نام خانوادگی</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="نام خانوادگی"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.lastName && (
                                        <span className="text-red-500 text-sm mt-1">{formErrors.lastName}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">شماره موبایل</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.phone && (
                                        <span className="text-red-500 text-sm mt-1">{formErrors.phone}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">کد ملی</label>
                                    <input
                                        type="text"
                                        name="nationalCode"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="کد ملی"
                                        value={formData.nationalCode}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.nationalCode && (
                                        <span className="text-red-500 text-sm mt-1">{formErrors.nationalCode}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">تاریخ تولد</label>
                                    <input
                                        type="text"
                                        name="birthDate"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="۱۳۷۰/۰۱/۰۱"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.birthDate && (
                                        <span className="text-red-500 text-sm mt-1">{formErrors.birthDate}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">جنسیت</label>
                                    <select
                                        name="gender"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">انتخاب کنید</option>
                                        <option value="مرد">مرد</option>
                                        <option value="زن">زن</option>
                                    </select>
                                    {formErrors.gender && (
                                        <span className="text-red-500 text-sm mt-1">{formErrors.gender}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Seat Selection */}
                        {/* Seat Selection */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">انتخاب صندلی</h2>
                            <div className="mb-4">
                                <div className="text-lg font-semibold mb-4">
                                    تعداد صندلی‌های این سرویس: {totalSeats}
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                                        <span className="text-sm">صندلی خالی</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                                        <span className="text-sm">رزرو شده</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                                        <span className="text-sm">انتخاب شده</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    {[...Array(totalSeats)].map((_, index) => (
                                        <div
                                            key={index + 1}
                                            className={`h-12 flex items-center justify-center rounded-lg text-white font-bold transition-colors duration-200 ${getSeatClassName(index + 1)}`}
                                            onClick={() => !seatStatuses.find(seat => seat.seatNumber === index + 1)?.isOccupied && setSelectedSeat(index + 1)}
                                        >
                                            {index + 1}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={`w-full p-3 rounded-lg text-white font-bold ${selectedSeat ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                    type="submit"
                                    disabled={!selectedSeat}
                                >
                                    مرحله بعد
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceDetail;
