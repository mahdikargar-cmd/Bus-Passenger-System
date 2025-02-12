import React from 'react';
import { Header } from "../Main-page/Header/Header";
import { Footer } from "../Main-page/Footer/Footer";

export const Ticket = () => {
    // دریافت اطلاعات بلیط از localStorage
    const ticketData = JSON.parse(localStorage.getItem('ticketData'));

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <Header />
            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                        بلیط شما
                    </h2>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <p>
                            <span className="font-medium">نام:</span> {ticketData.firstName} {ticketData.lastName}
                        </p>
                        <p>
                            <span className="font-medium">تاریخ تولد:</span> {ticketData.birthDate}
                        </p>
                        <p>
                            <span className="font-medium">شماره تلفن:</span> {ticketData.phone}
                        </p>
                        <p>
                            <span className="font-medium">کد ملی:</span> {ticketData.nationalCode}
                        </p>
                        <p>
                            <span className="font-medium">مبدا:</span> {ticketData.origin}
                        </p>
                        <p>
                            <span className="font-medium">مقصد:</span> {ticketData.destination}
                        </p>
                        <p>
                            <span className="font-medium">تاریخ حرکت:</span> {ticketData.travelDate}
                        </p>
                        <p>
                            <span className="font-medium">زمان حرکت:</span> {ticketData.travelTime}
                        </p>
                        <p>
                            <span className="font-medium">نوع اتوبوس:</span> {ticketData.busType}
                        </p>
                        <p>
                            <span className="font-medium">شماره صندلی:</span> {ticketData.seatNumber}
                        </p>
                        <p>
                            <span className="font-medium">قیمت بلیط:</span> {ticketData.totalPrice} تومان
                        </p>
                    </div>
                    <div className="flex justify-center mt-8">
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                            onClick={() => window.print()}
                        >
                            چاپ بلیط
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Ticket;
