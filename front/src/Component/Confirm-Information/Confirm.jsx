import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../Main-page/Header/Header";
import { Footer } from "../Main-page/Footer/Footer";
import moment from "moment-jalaali";

export const Confirm = () => {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTicketData = localStorage.getItem('bookingData');
        if (storedTicketData) {
            const parsedData = JSON.parse(storedTicketData);
            console.log('Stored Ticket Data:', parsedData); // بررسی داده‌ها
            setTicketData(parsedData);
            setLoading(false);
        } else {
            navigate('/services');
        }
    }, [navigate]);

    const formatDate = (date) => {
        if (!date) return 'نامشخص';
        return moment(date).format('jYYYY/jMM/jDD');
    };

    const handleConfirm = async () => {
        const updatedTicketData = {
            passengerInfo: ticketData.passengerInfo,
            seatInfo: ticketData.seatInfo,
            serviceInfo: ticketData.serviceInfo,
            ticketNumber: ticketData.ticketNumber,
            bookingDate: ticketData.bookingDate,
            totalPrice: ticketData.totalPrice,
            paymentStatus: 'completed',
            paymentDate: new Date().toISOString(),
        };

        try {
            const response = await fetch('http://localhost:5000/tickets/addTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTicketData),
            });

            if (response.ok) {
                localStorage.setItem('ticketData', JSON.stringify(updatedTicketData)); // ذخیره داده‌ها با کلید ticketData
                navigate('/print-ticket');
            } else {
                const errorData = await response.json();
                console.error('Error saving ticket:', errorData.message);
                alert('خطا در ذخیره اطلاعات بلیط');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('خطا در ارتباط با سرور');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const {
        passengerInfo,
        seatInfo,
        serviceInfo,
        totalPrice,
        bookingDate,
        ticketNumber,
    } = ticketData;

    return (
        <div>
            <Header />
            <div className="confirm-container bg-white m-8 rounded dark:bg-dark-blue">
                <div className="flex justify-center mt-5 pt-5">
                    <h1 className="flex justify-center bg-green-300 w-[150px] rounded text-center text-xl font-bold">
                        تایید اطلاعات
                    </h1>
                </div>
                <div className="ticket-info font-serif text-[18px] grid grid-cols-12 p-5 dark:text-white gap-4">
                    {/* Passenger Information */}
                    <div className="col-span-6 bg-gray-100 p-4 rounded">
                        <h2 className="text-lg font-bold mb-4">اطلاعات مسافر</h2>
                        <p>نام: {passengerInfo.firstName}</p>
                        <p>نام خانوادگی: {passengerInfo.lastName}</p>
                        <p>شماره تلفن: {passengerInfo.phone}</p>
                        <p>کد ملی: {passengerInfo.nationalCode}</p>
                        <p>تاریخ تولد: {passengerInfo.birthDate}</p>
                        <p>جنسیت: {passengerInfo.gender}</p>
                    </div>

                    {/* Service Information */}
                    <div className="col-span-6 bg-gray-100 p-4 rounded">
                        <h2 className="text-lg font-bold mb-4">اطلاعات سرویس</h2>
                        <p>نام سرویس: {serviceInfo.CompanyName?.CoperativeName || 'نامشخص'}</p>
                        <p>مبدا: {serviceInfo.SelectedRoute?.origin?.Cities || 'نامشخص'}</p>
                        <p>مقصد: {serviceInfo.SelectedRoute?.destination?.Cities || 'نامشخص'}</p>
                        <p>تاریخ حرکت: {formatDate(serviceInfo.movementDate?.moveDate)}</p>
                        <p>ظرفیت کل صندلی‌ها: {serviceInfo.ChairCapacity?.capacity || 'نامشخص'}</p>
                        <p>قیمت بلیط: {serviceInfo.ticketPrice} تومان</p>
                    </div>

                    {/* Seat Information */}
                    <div className="col-span-12 bg-gray-100 p-4 rounded">
                        <h2 className="text-lg font-bold mb-4">اطلاعات صندلی</h2>
                        <p>شماره صندلی: {seatInfo.seatNumber}</p>
                    </div>

                    {/* Booking and Payment Details */}
                    <div className="col-span-12 bg-gray-100 p-4 rounded">
                        <h2 className="text-lg font-bold mb-4">اطلاعات رزرو</h2>
                        <p>شماره بلیط: {ticketNumber}</p>
                        <p>تاریخ رزرو: {formatDate(bookingDate)}</p>
                        <p>مبلغ کل: {totalPrice} تومان</p>
                        <p>وضعیت پرداخت: {ticketData.paymentStatus || 'در انتظار پرداخت'}</p>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleConfirm}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg">
                        تایید و پرداخت
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};
