import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import api from "../../Services/Api";
import { MapPin, Calendar, CreditCard, User, Clock } from "lucide-react";

const ServiceDetail = () => {
    const navigate = useNavigate();
    const BASE_URL = "https://safarino.onrender.com";
    const serviceId = window.location.pathname.split('/').pop();

    // Consolidated state management
    const [state, setState] = useState({
        service: null,
        seatStatuses: [],
        selectedSeat: null,
        loading: true,
        formData: {
            firstName: '',
            lastName: '',
            phone: '',
            nationalCode: '',
            birthDate: '',
            gender: ''
        },
        formErrors: {}
    });
    const SeatGrid = ({ seatStatuses, selectedSeat, onSeatSelect }) => {
        return (
            <div className="grid grid-cols-4 gap-3 md:grid-cols-5 lg:grid-cols-6">
                {seatStatuses.map((seat) => (
                    <button
                        key={seat.seatNumber}
                        onClick={() => !seat.isOccupied && onSeatSelect(seat.seatNumber)}
                        disabled={seat.isOccupied}
                        className={`
                            relative
                            p-4
                            rounded-xl
                            text-center
                            font-medium
                            transition-all
                            duration-300
                            transform
                            hover:scale-105
                            ${seat.isOccupied
                            ? 'bg-red-100 text-red-500 border-2 border-red-200'
                            : selectedSeat === seat.seatNumber
                                ? 'bg-green-100 text-green-600 border-2 border-green-300 shadow-lg'
                                : 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100'
                        }
                        `}
                    >
                        <span className="text-lg">{seat.seatNumber}</span>
                    </button>
                ))}
            </div>
        );
    };    // Memoized fetch functions
    const fetchReservedSeats = useCallback(async () => {
        try {
            // دریافت همزمان اطلاعات از هر دو API
            const [axiosResponse, apiResponse] = await Promise.all([
                api.get(`/tickets/reserved-seats/${serviceId}`),
                api.get(`/tickets/reserved-seats/${serviceId}`)
            ]);

            // تغییر نحوه استخراج شماره صندلی‌های رزرو شده
            const reservedSeats = new Set([
                ...axiosResponse.data.map(ticket => ticket.seatInfo.seatNumber),
                ...apiResponse.data.map(ticket => ticket.seatInfo.seatNumber)
            ]);

            // آپدیت وضعیت صندلی‌ها
            setState(prev => ({
                ...prev,
                seatStatuses: Array.from({length: prev.service?.ChairCapacity?.capacity || 44},
                    (_, index) => ({
                        seatNumber: index + 1,
                        isOccupied: reservedSeats.has(index + 1)
                    })
                )
            }));
        } catch (error) {
            console.error('خطا در دریافت اطلاعات صندلی‌های رزرو شده:', error);
        }
    }, [serviceId]);    const loadInitialData = useCallback(() => {
        try {
            const storedService = localStorage.getItem('selectedService');
            if (!storedService) {
                navigate('/services');
                return;
            }

            const parsedService = JSON.parse(storedService);
            const totalSeats = parsedService?.ChairCapacity?.capacity || 44;
            const initialSeatStatuses = Array.from({length: totalSeats},
                (_, index) => ({
                    seatNumber: index + 1,
                    isOccupied: false
                })
            );

            setState(prev => ({
                ...prev,
                service: parsedService,
                seatStatuses: initialSeatStatuses,
                loading: false
            }));
        } catch (error) {
            console.error('Error loading initial data:', error);
            navigate('/services');
        }
    }, [navigate]);

    // Effects
    useEffect(() => {
        loadInitialData();
        fetchReservedSeats();

        const pollInterval = setInterval(fetchReservedSeats, 10000);
        return () => clearInterval(pollInterval);
    }, [loadInitialData, fetchReservedSeats]);

    // Event handlers
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setState(prev => ({
            ...prev,
            formData: {...prev.formData, [name]: value},
            formErrors: {...prev.formErrors, [name]: ''}
        }));
    };

    const handleSeatSelection = useCallback((seatNumber) => {
        setState(prev => {
            // بررسی وضعیت صندلی
            const seat = prev.seatStatuses.find(s => s.seatNumber === seatNumber);

            // اگر صندلی رزرو شده باشد، هیچ تغییری ایجاد نکن
            if (seat?.isOccupied) {
                return prev;
            }

            return {
                ...prev,
                selectedSeat: seatNumber
            };
        });
    }, []);


    const validateForm = () => {
        const errors = {};
        const {formData} = state;

        // Required field validation
        const requiredFields = [
            {name: 'firstName', label: 'نام'},
            {name: 'lastName', label: 'نام خانوادگی'},
            {name: 'phone', label: 'شماره تلفن'},
            {name: 'nationalCode', label: 'کد ملی'},
            {name: 'birthDate', label: 'تاریخ تولد'},
            {name: 'gender', label: 'جنسیت'}
        ];

        requiredFields.forEach(field => {
            if (!formData[field.name]?.trim()) {
                errors[field.name] = `${field.label} الزامی است`;
            }
        });

        // Format validation
        if (formData.phone && !/^09[0-9]{9}$/.test(formData.phone)) {
            errors.phone = 'شماره موبایل معتبر نیست';
        }

        if (formData.nationalCode && !/^[0-9]{10}$/.test(formData.nationalCode)) {
            errors.nationalCode = 'کد ملی باید ۱۰ رقم باشد';
        }

        setState(prev => ({...prev, formErrors: errors}));
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('لطفا تمام فیلدها را به درستی پر کنید');
            return;
        }

        if (!state.selectedSeat) {
            alert('لطفا یک صندلی انتخاب کنید');
            return;
        }

        try {
            // Check seat availability
            const {data: reservedSeats} = await api.get(
                `/tickets/reserved-seats/${serviceId}`
            );

            if (reservedSeats.some(seat => seat.seatNumber === state.selectedSeat)) {
                alert('این صندلی قبلاً رزرو شده است. لطفاً صندلی دیگری انتخاب کنید.');
                await fetchReservedSeats();
                setState(prev => ({...prev, selectedSeat: null}));
                return;
            }

            const ticketNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
            const bookingData = {
                passengerInfo: {...state.formData},
                seatInfo: {
                    seatNumber: state.selectedSeat,
                    isOccupied: true,
                    ticketNumber,
                },
                serviceInfo: {
                    serviceId,
                    companyName: state.service.CompanyName.CoperativeName,
                    origin: state.service.SelectedRoute.origin.Cities,
                    destination: state.service.SelectedRoute.destination.Cities,
                    movementDate: state.service.movementDate.moveDate,
                    chairCapacity: state.service.ChairCapacity.capacity,
                    ticketPrice: state.service.ticketPrice,
                },
                ticketNumber,
                bookingDate: new Date().toISOString(),
                totalPrice: state.service.ticketPrice || 0,
                paymentStatus: 'pending',
            };

            // Update seat status and create ticket
            await Promise.all([
                api.patch(`/seats/${serviceId}/${state.selectedSeat}`, {
                    isOccupied: true,
                    ticketNumber,
                }),
                api.post(`/tickets/addTicket`, bookingData)
            ]);

            // Save booking data and navigate
            localStorage.setItem('bookingData', JSON.stringify(bookingData));
            const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
            bookingHistory.push(bookingData);
            localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));

            navigate('/confirm');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.');
        }
    };

    if (state.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"/>
            </div>
        );
    }
    const ServiceHeader = ({ service }) => (
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6" />
                    <div>
                        <p className="text-sm opacity-75">مسیر</p>
                        <p className="font-bold">{service?.SelectedRoute?.origin?.Cities} به {service?.SelectedRoute?.destination?.Cities}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6" />
                    <div>
                        <p className="text-sm opacity-75">تاریخ حرکت</p>
                        <p className="font-bold">{service?.movementDate?.moveDate}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6" />
                    <div>
                        <p className="text-sm opacity-75">قیمت بلیط</p>
                        <p className="font-bold">{service?.ticketPrice?.toLocaleString()} تومان</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {state.service && <ServiceHeader service={state.service} />}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Passenger Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <User className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-800">اطلاعات مسافر</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(state.formData).map(([field, value]) => (
                                <div key={field} className="space-y-2">
                                    <label className="block text-gray-700 font-medium">
                                        {field === 'firstName' ? 'نام' :
                                            field === 'lastName' ? 'نام خانوادگی' :
                                                field === 'phone' ? 'شماره موبایل' :
                                                    field === 'nationalCode' ? 'کد ملی' :
                                                        field === 'birthDate' ? 'تاریخ تولد' :
                                                            'جنسیت'}
                                    </label>
                                    {field === 'gender' ? (
                                        <select
                                            name={field}
                                            value={value}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        >
                                            <option value="">انتخاب کنید</option>
                                            <option value="مرد">مرد</option>
                                            <option value="زن">زن</option>
                                        </select>
                                    ) : (
                                        <input
                                            type={field === 'phone' ? 'tel' : 'text'}
                                            name={field}
                                            value={value}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder={field === 'phone' ? '۰۹۱۲۳۴۵۶۷۸۹' : ''}
                                        />
                                    )}
                                    {state.formErrors[field] && (
                                        <p className="text-red-500 text-sm mt-1">{state.formErrors[field]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seat Selection */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <Clock className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-800">انتخاب صندلی</h2>
                        </div>

                        <div className="flex justify-center space-x-6 mb-8">
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full bg-blue-50 border-2 border-blue-200 mr-2"></div>
                                <span className="text-sm text-gray-600">صندلی خالی</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-200 mr-2"></div>
                                <span className="text-sm text-gray-600">رزرو شده</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-300 mr-2"></div>
                                <span className="text-sm text-gray-600">انتخاب شده</span>
                            </div>
                        </div>

                        <SeatGrid
                            seatStatuses={state.seatStatuses}
                            selectedSeat={state.selectedSeat}
                            onSeatSelect={handleSeatSelection}
                        />

                        {state.selectedSeat && (
                            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <h3 className="font-bold text-lg text-blue-800 mb-2">صندلی انتخاب شده</h3>
                                <p className="text-blue-600">شماره صندلی: {state.selectedSeat}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!state.selectedSeat}
                            className={`
                                w-full
                                mt-6
                                p-4
                                rounded-xl
                                font-bold
                                text-white
                                transition-all
                                duration-300
                                transform
                                hover:scale-105
                                ${state.selectedSeat
                                ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg'
                                : 'bg-gray-300 cursor-not-allowed'
                            }
                            `}
                        >
                            تایید و ادامه
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;