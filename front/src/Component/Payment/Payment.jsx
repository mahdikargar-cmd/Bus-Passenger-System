import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Payment = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handlePaymentSuccess = async () => {
/*
            const ticketData = JSON.parse(localStorage.getItem('ticketData'));
*/

       /*     if (!ticketData) {
                console.error('No ticket data found in localStorage');
                return;
            }*/

            // اضافه کردن userId به ticketData
/*
            ticketData.userId = '60b8d6b4f1e8c64b5cfae1b1'; // این مقدار باید از داده‌های لاگین شده کاربر دریافت شود
*/
        /*    navigate('/print-ticket');*/
      /*      try {
                const response = await api.post('/tickets/addTicket', ticketData);
                console.log('Ticket saved:', response.data);

            } catch (error) {
                console.error('Error saving ticket', error);
            }*/
        };

        handlePaymentSuccess();
    }, [navigate]);

    const handleBack = () => {
        navigate('/print-ticket');
    };

    return (
        <div className={'flex justify-center'}>
            <div className={'mt-52 w-2/4 grid grid-cols-12 bg-white-blue h-80 rounded text-white'}>
                <div className={'col-span-12 flex justify-center items-center'}>
                    <p>پرداخت تکمیل شد</p>
                </div>
                <div className={'col-span-12 flex justify-center items-center'}>
                    <button className={'bg-green-600 p-2 rounded'} onClick={handleBack}>
                        بازگشت به صفحه اصلی
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
