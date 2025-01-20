import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

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
        if (serviceId) {
            Promise.all([
                fetchServiceDetails(),
                fetchSeatStatuses()
            ]).catch(console.error);
        }
    }, [serviceId]);

    const fetchServiceDetails = async () => {
        try {
            const url = `/api/services/${serviceId}`;
            console.log("Fetching Service Details URL:", url);  // نمایش URL برای بررسی
            const response = await fetch(url);
            if (!response.ok) throw new Error('Service fetch failed');
            const data = await response.json();
            console.log("Service Data:", data);  // نمایش دیتا دریافتی
            setService(data);
        } catch (error) {
            console.error("Error fetching service details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSeatStatuses = async () => {
        try {
            const response = await fetch(`seats/${serviceId}`);
            if (!response.ok) throw new Error('Seat status fetch failed');
            const data = await response.json();
            console.log("Seat Statuses:", data);  // نمایش وضعیت صندلی‌ها
            setSeatStatuses(data);
        } catch (error) {
            console.error("Error fetching seat statuses:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = ['firstName', 'lastName', 'phone', 'nationalCode', 'birthDate', 'gender'];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = 'این فیلد الزامی است';
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !selectedSeat) return;

        const ticketNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
        const ticketData = {
            ...formData,
            seatNumber: selectedSeat,
            serviceDetails: {
                CompanyName: service.CompanyName?._id,
                busName: service.busName?._id,
                BusType: service.BusType?.busType,
                SelectedRoute: service.SelectedRoute?._id,
                movementDate: service.movementDate?.moveDate,
                movementTime: service.movementTime?.moveTime,
                ChairCapacity: service.ChairCapacity?.capacity,
                ticketPrice: service.ticketPrice,
                ServicesOption: service.ServicesOption || [],
                serviceId
            },
            ticketNumber
        };


        try {
            // Update seat status
            const response = await fetch(`seats/${serviceId}/${selectedSeat}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isOccupied: true,
                    ticketNumber
                })
            });

            if (!response.ok) throw new Error('Failed to update seat status');

            // Save to localStorage and navigate
            localStorage.setItem('ticketData', JSON.stringify(ticketData));
            navigate('/confirm');
        } catch (error) {
            console.error('Error updating seat status:', error);
            alert('خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.');
        }
    };

    const getSeatClassName = (seatNumber) => {
        const seatStatus = seatStatuses.find(seat => seat.seatNumber === seatNumber);
        if (seatStatus?.isOccupied) {
            return 'bg-red-500 cursor-not-allowed';
        }
        return selectedSeat === seatNumber ? 'bg-green-500 cursor-pointer' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer';
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="نام"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.firstName && (
                                        <span className="text-red-500 text-sm">{formErrors.firstName}</span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="نام خانوادگی"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.lastName && (
                                        <span className="text-red-500 text-sm">{formErrors.lastName}</span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="شماره تلفن"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.phone && (
                                        <span className="text-red-500 text-sm">{formErrors.phone}</span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="nationalCode"
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="کدملی"
                                        value={formData.nationalCode}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.nationalCode && (
                                        <span className="text-red-500 text-sm">{formErrors.nationalCode}</span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="birthDate"
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="تاریخ تولد"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.birthDate && (
                                        <span className="text-red-500 text-sm">{formErrors.birthDate}</span>
                                    )}
                                </div>
                                <div>
                                    <select
                                        name="gender"
                                        className="w-full p-3 border rounded-lg"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">جنسیت</option>
                                        <option value="مرد">مرد</option>
                                        <option value="زن">زن</option>
                                    </select>
                                    {formErrors.gender && (
                                        <span className="text-red-500 text-sm">{formErrors.gender}</span>
                                    )}
                                </div>
                            </div>
                        </div>

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

                                <Link to={'/confirm'}
                                    className={`w-full p-3 rounded-lg text-white font-bold ${selectedSeat ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                    type="submit"

                                >
                                    مرحله بعد
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceDetail;