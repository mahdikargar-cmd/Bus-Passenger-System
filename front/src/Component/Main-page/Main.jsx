import { InfoSection } from "./Info-section/InfoSection";
import { AcardeonMenu } from "./Acardeon-menu/AcardeonMenu";
import { Footer } from "./Footer/Footer";
import bg_blue from '../../Assets/images/Decore.svg';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Main = () => {
    return (
        <div className="bg-[#f6f6f9] dark:bg-dark-black min-h-screen font-sans">
            {/* Hero Section */}
            <div
                className="relative grid grid-cols-12 items-center justify-center h-[500px] bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${bg_blue})`, backgroundPosition: 'right', backgroundSize: '50%' }}
            >
                <div className="col-span-6"></div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-6 p-10 text-center md:text-left"
                >
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        سفر کنید، لذت ببرید <br /> و یک زندگی جدید داشته باشید
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
                        با بهترین خدمات ما، بلیط‌های ارزان و راحت را رزرو کنید.
                    </p>
                    <motion.div
                        className="mt-8"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to={'/services'} className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition-all">
                            خرید بلیط
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Services Section */}
            <div className="py-16 bg-white dark:bg-gray-800 text-center">
                <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
                    بهترین خدمات ما برای شما
                </h2>
                <InfoSection />
            </div>

            {/* Accordion Menu */}
            <div className="bg-white dark:bg-gray-800 py-16">
                <AcardeonMenu />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};
