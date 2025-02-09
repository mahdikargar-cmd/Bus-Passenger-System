import Acardeon from "./Acardeon";
import acardeon from "../../../Utils/Acardeon";

export const AcardeonMenu = () => {
    return (
        <div className="bg-gray-100 dark:bg-dark-gray py-12">
            {/* Title Section */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
                    سوالات متداول
                </h1>
            </div>

            {/* Accordion List */}
            <div className="max-w-5xl mx-auto bg-white dark:bg-dark-black p-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                {acardeon.map((item, index) => (
                    <Acardeon
                        key={index}
                        title={item.title}
                        content={item.content}
                    />
                ))}
            </div>
        </div>
    );
};
