export const Footer = () => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-dark-blue dark:to-dark-blue text-white py-12">
            <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Section 1 */}
                <div className="flex flex-col space-y-4">
                    <p className="text-xl font-semibold">خرید بلیط</p>
                    <p className="text-gray-300 hover:text-white transition duration-300">خرید بلیط</p>
                    <p className="text-gray-300 hover:text-white transition duration-300">استعلام بلیط</p>
                    <p className="text-gray-300 hover:text-white transition duration-300">استرداد بلیط</p>
                </div>

                {/* Section 2 */}
                <div className="flex flex-col space-y-4">
                    <p className="text-xl font-semibold">اطلاعات</p>
                    <p className="text-gray-300 hover:text-white transition duration-300">ورود</p>
                    <p className="text-gray-300 hover:text-white transition duration-300">درباره ما</p>
                    <p className="text-gray-300 hover:text-white transition duration-300">تماس با ما</p>
                </div>

                {/* Section 3 */}
                <div className="flex flex-col space-y-4">
                    <p className="text-xl font-semibold">تماس با ما</p>
                    <p className="text-gray-300 hover:text-white transition duration-300">تلفن پشتیبانی: 3463143-0921</p>
                    <p className="text-gray-300 hover:text-white transition duration-300">
                        دفتر پشتیبانی: تهران - ولی عصر خیابان بیمه چهارم بن بست گلها پلاک 5
                    </p>
                    <div className="mt-4 flex justify-center">
                        <p className="text-xl font-semibold">Logo</p>
                    </div>
                </div>
            </div>

            {/* Social Media Icons (Optional) */}
            <div className="flex justify-center space-x-6 mt-8">
                <a href="#" className="text-2xl text-gray-300 hover:text-white transition duration-300">
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-2xl text-gray-300 hover:text-white transition duration-300">
                    <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-2xl text-gray-300 hover:text-white transition duration-300">
                    <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-2xl text-gray-300 hover:text-white transition duration-300">
                    <i className="fab fa-linkedin"></i>
                </a>
            </div>
        </div>
    );
};
