import { Header } from "./Header/Header";
import { InfoSection } from "./Info-section/InfoSection";
import { AcardeonMenu } from "./Acardeon-menu/AcardeonMenu";
import { Footer } from "./Footer/Footer";
import bg_blue from '../../Assets/images/Decore.svg';

export const Main = () => {
    return (
        <>
            <div className="bg-[#f6f6f9] dark:bg-dark-black min-h-screen">
                {/* Header */}
                <Header />

                {/* Hero Section */}
                <div
                    className="relative grid grid-cols-12 items-center justify-center h-[500px] bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url(${bg_blue})`, backgroundPosition: 'right', backgroundSize: '50%' }}
                >
                    <div className={'col-span-6'}></div>
                    <div className="col-span-12 md:col-span-6 p-10 text-center md:text-left ">
                        <h1 className="text-4xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            سفر کنید، لذت ببرید و یک زندگی جدید و کامل داشته باشید
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                            با بهترین خدمات ما، اتوبوس ها و بلیط های ارزان را رزرو کنید.
                        </p>
                        <button className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition">
                            خرید بلیط
                        </button>
                    </div>
                </div>

                {/* Services Section */}
                <div className="py-10 bg-white dark:bg-gray-800 text-center">
                    <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">
                        ما بهترین خدمات را ارائه می دهیم
                    </h2>
                    <InfoSection />
                </div>



                {/* Accordion Menu */}
                <div className="bg-white dark:bg-gray-800 py-10">
                    <AcardeonMenu />
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};
