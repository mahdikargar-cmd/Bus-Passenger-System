import { InfoSection } from "./Info-section/InfoSection";
import { AcardeonMenu } from "./Acardeon-menu/AcardeonMenu";
import { Footer } from "./Footer/Footer";
import bg_blue from '../../Assets/images/Decore.svg';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Main = () => {
    return (
        <div className="bg-[#f6f6f9] dark:bg-dark-black min-h-screen font-sans " dir={'rtl'}>
            {/* Hero Section */}
            <div
                className="relative grid grid-cols-12 items-center justify-center h-[400px] md:h-[500px] lg:h-[600px] bg-no-repeat bg-cover px-6 sm:px-10"
                style={{ backgroundImage: `url(${bg_blue})`, backgroundPosition: 'right', backgroundSize: '50%' }}
            >
                <div className="hidden md:block col-span-6"></div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-6 text-center md:text-right"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        سفر کنید، لذت ببرید <br /> و یک زندگی جدید داشته باشید
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 text-base sm:text-lg md:text-xl">
                        با بهترین خدمات ما، بلیط‌های ارزان و راحت را رزرو کنید.
                    </p>
                    <motion.div
                        className="mt-6 sm:mt-8"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to={'/services'} className="bg-blue-600 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-blue-700 transition-all">
                            خرید بلیط
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Services Section */}
            <div className=" py-12 sm:py-16 bg-white dark:bg-gray-800 text-center px-4 sm:px-8">
                <h2 className="text-3xl  flex justify-center text-center sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">
                    بهترین خدمات ما برای شما
                </h2>
                <div className="flex mt-20 justify-center">
                    <InfoSection />
                </div>
            </div>


            {/* Accordion Menu */}
            <div className="bg-white dark:bg-gray-800 py-12 sm:py-16 px-4 sm:px-8">
                <AcardeonMenu />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};
