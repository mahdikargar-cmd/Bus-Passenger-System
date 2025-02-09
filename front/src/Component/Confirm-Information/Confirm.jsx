import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-jalaali';
import { ArrowLeftRight, Calendar, CreditCard, MapPin, User, Clock } from 'lucide-react';

const ConfirmationCard = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
        </div>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
);

export const Confirm = () => {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTicketData = localStorage.getItem('bookingData');
        if (storedTicketData) {
            setTicketData(JSON.parse(storedTicketData));
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
            ...ticketData,
            paymentStatus: 'completed',
            paymentDate: new Date().toISOString(),
        };

        try {
            const response = await fetch('https://safarino.onrender.com/tickets/addTicket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTicketData),
            });

            if (response.ok) {
                localStorage.setItem('ticketData', JSON.stringify(updatedTicketData));
                navigate('/print-ticket');
            } else {
                throw new Error('خطا در ذخیره اطلاعات بلیط');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    const { passengerInfo, seatInfo, serviceInfo, totalPrice, bookingDate, ticketNumber } = ticketData;

    return (
        <div className="mt-12 min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">تأیید اطلاعات بلیط</h1>
                    <p className="text-gray-600 dark:text-gray-400">لطفاً اطلاعات زیر را با دقت بررسی کنید</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <ConfirmationCard title="اطلاعات مسافر" icon={User}>
                        <InfoRow label="نام و نام خانوادگی" value={`${passengerInfo.firstName} ${passengerInfo.lastName}`} />
                        <InfoRow label="شماره تلفن" value={passengerInfo.phone} />
                        <InfoRow label="کد ملی" value={passengerInfo.nationalCode} />
                        <InfoRow label="تاریخ تولد" value={passengerInfo.birthDate} />
                        <InfoRow label="جنسیت" value={passengerInfo.gender} />
                    </ConfirmationCard>

                    <ConfirmationCard title="اطلاعات سفر" icon={ArrowLeftRight}>
                        <InfoRow label="شرکت" value={serviceInfo.companyName} />
                        <InfoRow label="مبدا" value={serviceInfo.origin} />
                        <InfoRow label="مقصد" value={serviceInfo.destination} />
                        <InfoRow label="تاریخ حرکت" value={formatDate(serviceInfo.movementDate)} />
                        <InfoRow label="شماره صندلی" value={seatInfo.seatNumber} />
                    </ConfirmationCard>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 dark:bg-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                                <CreditCard className="w-5 h-5 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">مبلغ کل</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{totalPrice} تومان</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">تاریخ رزرو</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(bookingDate)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">شماره بلیط</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{ticketNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleConfirm}
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        تأیید و پرداخت
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirm;