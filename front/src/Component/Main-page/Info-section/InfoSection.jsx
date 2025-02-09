import { FaRoad } from "react-icons/fa";
import { IoIosBus } from "react-icons/io";
import { MdBusinessCenter } from "react-icons/md";
import { FcBusinessman } from "react-icons/fc";

export const InfoSection = () => {
    return (
        <div className="py-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 dark:from-dark-black dark:to-dark-black">
            <div className="container mx-auto px-6 md:px-12">
                <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-12">
                    مراحل ساده سفر با سفرینو
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
                        <div className="flex items-center justify-center mb-6">
                            <FcBusinessman size={50} />
                        </div>
                        <p className="text-center text-xl font-semibold text-gray-700 dark:text-white">
                            ابتدا در سفرینو ثبت نام کنید
                        </p>
                        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
                            اطلاعات خود را وارد کرده تا سفری راحت داشته باشید.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
                        <div className="flex items-center justify-center mb-6">
                            <FaRoad className="text-red-500" size={50} />
                        </div>
                        <p className="text-center text-xl font-semibold text-gray-700 dark:text-white">
                            انتخاب مبدا و مقصد
                        </p>
                        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
                            مقصد و مبدأ خود را به سادگی انتخاب کنید.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
                        <div className="flex items-center justify-center mb-6">
                            <IoIosBus className="text-yellow-600" size={50} />
                        </div>
                        <p className="text-center text-xl font-semibold text-gray-700 dark:text-white">
                            انتخاب اتوبوس
                        </p>
                        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
                            اتوبوس VIP یا معمولی را مطابق با نیاز خود انتخاب کنید.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
                        <div className="flex items-center justify-center mb-6">
                            <MdBusinessCenter className="text-amber-500" size={50} />
                        </div>
                        <p className="text-center text-xl font-semibold text-gray-700 dark:text-white">
                            خرید نهایی
                        </p>
                        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
                            سفر خود را نهایی کنید و از تجربه‌ای فراموش‌نشدنی لذت ببرید.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
