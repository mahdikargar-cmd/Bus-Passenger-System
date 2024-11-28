import React, {useState} from "react";
import Avatar from "../../Assets/images/me.jpg";
import {AiFillCaretDown} from "react-icons/ai";
import Cooperative from "./CooperativeManagement/Cooperative";
import Destination from "./Destination/Destination";
import {Drivers} from "./Drivers/Drivers";
import {Tickets} from "./Tickets/Tickets";
import {ManagementOfBuses} from "./ManagementOfBuses/ManagementOfBuses";
import {AdminServices} from "./Services/AdminServices";
import {RouteManagement} from "./RouteManagement/RouteManagement";
import {BusMovementManagement} from "./BusMovementManagement/BusMovementManagement";
import Amanat from "./Amanat/Amanat";
import {DriverReport} from "./DriverReport/DriverReport";
import ComplaintsManagement from "./ComplaintsManagement/ComplaintsManagement";
import {useNavigate} from "react-router-dom";

const AdminPanel = () => {
    const [activeComponent, setActiveComponent] = useState("Cooperative");
    const [showMenu, setShowMenu] = useState(false); // نمایش منوی کشویی
    const navigate = useNavigate(); // استفاده از navigate برای هدایت به صفحه اصلی

    const info = [
        {
            text: "مدیریت تعاونی",
            id: 1,
            link: "/cooperativeManagement",
            component: "Cooperative",
        },
        {
            text: "مدیریت مقصد",
            id: 2,
            link: "tewrwe",
            component: "Destination",
        },
        {
            text: "مدیریت رانندگان",
            id: 3,
            link: "/adminp",
            component: "Drivers",
        },
        /*{
            text: "مدیریت سرویس ها",
            id: 3,
            link: "/services",
            component: "Services",

        },*/
        /*  {
              text: "احرازهویت مسافران (حضوری)",
              id: 4,
              link: "tewrwe",
              component: "Tickets",
          },*/
        {
            text: "مدیریت وسایل نقلیه",
            id: 5,
            link: "tewrwe",
            component: "ManagementOfBuses",
        },

        {
            text: "مدیریت زمان حرکت اتوبوس",
            id: 11,
            link: "tewrwe",
            component: "BusMovementManagement",
        },
        {
            text: "مدیریت مسیراتوبوس ",
            id: 12,
            link: "tewrwe",
            component: "RouteManagement",
        },
        /*  {
              text: "مدیریت قیمت گذاری ",
              id: 6,
              link: "tewrwe",
              component: "PricingManagement",
          },
          {
              text: "مدیریت امانات",
              id: 7,
              link: "tewrwe",
              component: "Amanat",
          },*/
        {
            text: "مدیریت انتقادات وشکایات",
            id: 8,
            link: "/ComplaintsManagement",
            component: "ComplaintsManagement",
        },
        /*    {
                text: "مدیریت باربری",
                id: 9,
                link: "tewrwe",
                component: "FreightManagement",
            },
            {
                text: "گزارش رانندگان ",
                id: 9,
                link: "tewrwe",
                component: "DriverReport",
            }*/
    ];
    const exit = () => {

    }
    const renderComponent = () => {
        switch (activeComponent) {
            case "Cooperative":
                return <Cooperative/>;
            case "Destination":
                return <Destination/>;
            case "Drivers" :
                return <Drivers/>
            case "Tickets":
                return <Tickets/>
            case "ManagementOfBuses":
                return <ManagementOfBuses/>
            case "Services":
                return <AdminServices/>
            case "RouteManagement":
                return <RouteManagement/>
            case "BusMovementManagement":
                return <BusMovementManagement/>
            case "Amanat":
                return <Amanat/>
            case "DriverReport":
                return <DriverReport/>
            case "ComplaintsManagement":
                return <ComplaintsManagement/>
            default:
                return null;
        }
    };
    const handleLogout = () => {
        // به صفحه اصلی هدایت می‌کند
        navigate("/");
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    return (
        <div>
            <div className={"bg-adminpanel-bg max-h-[100vh] overflow-y-auto pb-9"}>
                {/* start search box */}
                <div className={"grid grid-cols-12  bg-adminpanel-ui p-4"}>
                    <div className={"col-span-5 flex items-center"}>
                        <img src={Avatar} alt={'عکس'} className="h-10 w-10 ml-6 rounded-full"/>
                        <h1 className="ml-3">admin</h1>
                        <AiFillCaretDown onClick={toggleMenu} /> {/* کلیک روی آیکون */}
                    </div>
                    <div className="col-span-7 flex justify-end ml-4 items-center">
                        <label htmlFor="Search" className="ml-3 ">
                            جستجو
                        </label>
                        <input
                            type="search"
                            className="p-2 rounded bg-adminpanel-bg  w-[1000px]"
                            id="Search"
                        />
                    </div>
                </div>
                {/*end search */}

                {/*start menu */}
                <div className="mt-6 grid grid-cols-12 p-2 max-h-[80vh] overflow-y-auto">
                    <div
                        className="col-span-2 rounded bg-adminpanel-ui p-2 pb-4 max-h-[100vh] overflow-y-auto    flex flex-col">
                        {info.map((ti) => (
                            <button
                                key={ti.id}
                                onClick={() => setActiveComponent(ti.component)}
                                className="mb-3 mt-2 hover:bg-[#cedef4] hover:text-[#2F80ED] rounded p-2"
                            >
                                {ti.text}
                            </button>
                        ))}
                    </div>
                    <div className="col-span-10 rounded bg-adminpanel-ui p-2 mr-3 flex flex-col">
                        {renderComponent()}
                    </div>
                </div>

                {/*end menu */}
                {/* نمایش منوی کشویی برای دکمه خروج */}
                {showMenu && (
                    <div className="absolute hover:bg-red-500 flex justify-center hover:text-white  top-16 right-16 bg-white shadow-lg rounded mt-2  w-28">
                        <ul>
                            <li>
                                <button
                                    className="w-full text-left p-2 "
                                    onClick={handleLogout}>
                                    خروج
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
