import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../Main-page/Footer/Footer';
import { Printer, Ticket, User, MapPin, Calendar, CreditCard } from 'lucide-react';
import moment from "moment-jalaali";

const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="w-5 h-5 text-gray-700" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-1">
        <span className="text-gray-600 text-sm">{label}</span>
        <span className="font-medium text-gray-900">{value || 'نامشخص'}</span>
    </div>
);

const PrintTicket = () => {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTicketData = localStorage.getItem('ticketData');
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
        localStorage.removeItem('ticketData');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-12">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm mb-4">
                        <Ticket className="w-4 h-4" />
                        بلیط شما آماده است
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">چاپ بلیط</h1>
                    <p className="text-gray-600">شماره بلیط: {ticketData.ticketNumber}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <InfoSection title="اطلاعات مسافر" icon={User}>
                        <InfoRow label="نام" value={ticketData.passengerInfo.firstName} />
                        <InfoRow label="نام خانوادگی" value={ticketData.passengerInfo.lastName} />
                        <InfoRow label="شماره تلفن" value={ticketData.passengerInfo.phone} />
                        <InfoRow label="کد ملی" value={ticketData.passengerInfo.nationalCode} />
                        <InfoRow label="تاریخ تولد" value={ticketData.passengerInfo.birthDate} />
                        <InfoRow label="جنسیت" value={ticketData.passengerInfo.gender} />
                        <InfoRow label="شماره صندلی" value={ticketData.seatInfo.seatNumber} />
                    </InfoSection>

                    <InfoSection title="اطلاعات سفر" icon={MapPin}>
                        <InfoRow label="نام شرکت" value={ticketData.serviceInfo.companyName} />
                        <InfoRow label="مبدا" value={ticketData.serviceInfo.origin} />
                        <InfoRow label="مقصد" value={ticketData.serviceInfo.destination} />
                        <InfoRow label="تاریخ حرکت" value={formatDate(ticketData.serviceInfo.movementDate)} />
                    </InfoSection>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">مبلغ</p>
                                <p className="font-semibold text-gray-900">{ticketData.serviceInfo.ticketPrice} تومان</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">تاریخ رزرو</p>
                                <p className="font-semibold text-gray-900">{formatDate(ticketData.bookingDate)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Ticket className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">وضعیت پرداخت</p>
                                <p className="font-semibold text-gray-900">{ticketData.paymentStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center print:hidden">
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                        <Printer className="w-5 h-5" />
                        چاپ بلیط
                    </button>
                </div>
            </div>

            <div className="print:hidden">
                <Footer />
            </div>

            <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            margin: 1cm;
          }
          .print:hidden {
            display: none;
          }
        }
      `}</style>
        </div>
    );
};

export default PrintTicket;