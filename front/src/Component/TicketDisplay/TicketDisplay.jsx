import React from 'react';
import { Header } from "../Main-page/Header/Header";
import { Footer } from "../Main-page/Footer/Footer";

export const Ticket = () => {
    const ticketData = JSON.parse(localStorage.getItem('ticketData'));

    return (
        <div>
            <Header />
            <div className="ticket">
                <h2>بلیط شما</h2>
                <p>نام: {ticketData.firstName} {ticketData.lastName}</p>
                <p>تاریخ تولد: {ticketData.birthDate}</p>
                <p>شماره تلفن: {ticketData.phone}</p>
                <p>کد ملی: {ticketData.nationalCode}</p>
                <p>مبدا: {ticketData.origin}</p>
                <p>مقصد: {ticketData.destination}</p>
                <p>تاریخ حرکت: {ticketData.travelDate}</p>
                <p>زمان حرکت: {ticketData.travelTime}</p>
                <p>نوع اتوبوس: {ticketData.busType}</p>
                <p>شماره صندلی: {ticketData.seatNumber}</p>
                <p>قیمت بلیط: {ticketData.totalPrice} تومان</p>
                <button className="bg-green-600 rounded text-white p-1 mt-10" onClick={() => window.print()}>چاپ بلیط</button>
            </div>
            <Footer />
        </div>
    );
};

export default Ticket;
