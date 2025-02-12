import React from 'react';


export const UserTicket = () => {
    // داده‌های تستی (برای نمونه)
    const tickets = [
        {
            id: 1,
            ticketNumber: "123456789012",
            travelDate: "2025-02-12",
            route: "تهران به مشهد",
        },
        {
            id: 2,
            ticketNumber: "987654321098",
            travelDate: "2025-03-01",
            route: "مشهد به شیراز",
        },
        // می‌توانید بلیط‌های بیشتری اضافه کنید...
    ];

    return (
        <div className="min-h-screen  dark:bg-dark-blue text-white">

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl text-black font-bold text-center mb-6">
                    بلیط های خریداری شده من
                </h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700">
                            <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                شماره بلیط
                            </th>
                            <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                تاریخ حرکت
                            </th>
                            <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                مسیر
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-3 px-5 text-sm text-gray-800 dark:text-gray-100">
                                    {ticket.ticketNumber}
                                </td>
                                <td className="py-3 px-5 text-sm text-gray-800 dark:text-gray-100">
                                    {ticket.travelDate}
                                </td>
                                <td className="py-3 px-5 text-sm text-gray-800 dark:text-gray-100">
                                    {ticket.route}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default UserTicket;
