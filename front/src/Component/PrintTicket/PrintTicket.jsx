import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Main-page/Header/Header';
import { Footer } from '../Main-page/Footer/Footer';
import moment from "moment-jalaali";

const PrintTicket = () => {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTicketData = localStorage.getItem('ticketData'); // تغییر کلید به ticketData
        if (storedTicketData) {
            setTicketData(JSON.parse(storedTicketData));
            setLoading(false);
        } else {
            navigate('/services');
        }
    }, [navigate]);

    const formatDate = (date) => {
        if (!date) return 'نامشخص';
        return moment(date).format('jYYYY-jMM-jDD');
    };

    const handlePrint = () => {
        window.print();
        // Clear localStorage after successful print
        localStorage.removeItem('ticketData'); // حذف داده‌ها پس از چاپ
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="mt-24 print-ticket-container bg-white m-8 rounded dark:bg-dark-blue">
                <div className="flex justify-center mt-5 pt-5">
                    <h1 className="flex justify-center bg-green-300 w-[100px] rounded p-1">
                        چاپ بلیط
                    </h1>
                </div>
                <div className="ticket-info font-serif text-[20px] grid grid-cols-12 p-5 dark:text-white">
                    <div className="col-span-6">
                        <p>شماره بلیط: {ticketData.ticketNumber}</p>
                        <p>نام: {ticketData.passengerInfo.firstName}</p>
                        <p>نام خانوادگی: {ticketData.passengerInfo.lastName}</p>
                        <p>شماره تلفن: {ticketData.passengerInfo.phone}</p>
                        <p>کدملی: {ticketData.passengerInfo.nationalCode}</p>
                        <p>تاریخ تولد: {ticketData.passengerInfo.birthDate}</p>
                        <p>جنسیت: {ticketData.passengerInfo.gender}</p>
                        <p>شماره صندلی: {ticketData.seatInfo.seatNumber}</p>
                        <h2>جزئیات سرویس</h2>
                        <p>نام شرکت: {ticketData.serviceInfo.CompanyName?.CoperativeName || 'نامشخص'}</p>
                    </div>
                    <div className="col-span-6">
                        <p>مبدا: {ticketData.serviceInfo.SelectedRoute?.origin?.Cities}</p>
                        <p>مقصد: {ticketData.serviceInfo.SelectedRoute?.destination?.Cities}</p>
                        <p>تاریخ حرکت: {formatDate(ticketData.serviceInfo.movementDate?.moveDate)}</p>
                        <p>مبلغ: {ticketData.serviceInfo.ticketPrice}</p>
                        <p>تاریخ رزرو: {formatDate(ticketData.bookingDate)}</p>
                        <p>وضعیت پرداخت: {ticketData.paymentStatus}</p>
                    </div>
                </div>
                <div className="flex justify-center mt-5">
                    <button
                        onClick={handlePrint}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                        چاپ بلیط
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrintTicket;
