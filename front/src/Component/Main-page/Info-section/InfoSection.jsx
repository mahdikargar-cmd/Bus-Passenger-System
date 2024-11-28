
import {FaRoad} from "react-icons/fa";
import {IoIosBus} from "react-icons/io";
import {MdBusinessCenter} from "react-icons/md";
import {FcBusinessman} from "react-icons/fc";

export const InfoSection = () => {
    return (
        <>

            <div className={'flex justify-center'}>
                <div className={'grid grid-cols-12 m-8  gap-3 w-[1000px] dark:bg-dark-black  '}>

                    <div
                        className={'col-span-3 flex  flex-col space-y-8 border-2 rounded border-zinc-100 pt-20 pb-20 shadow-2xl'}>
                        <div className={'flex justify-center'}><FcBusinessman   size={40}/></div>
                        <p className={'text-zinc-600 dark:text-white'}>ابتدا در سفرینو ثبت نام کنید تا اطلاعات شما ثبت شود </p>
                    </div>
                    <div
                        className={'col-span-3 flex  flex-col space-y-8 border-2 rounded border-zinc-100 pt-20 pb-20 shadow-2xl'}>
                        <div className={'flex justify-center'}><FaRoad className={'text-red-500'} size={40}/></div>
                        <p className={'text-zinc-600 dark:text-white'}>مبدا و مقصد مورد نظر خودرا انتخاب کنید </p>
                    </div>
                    <div
                        className={'col-span-3 flex  flex-col space-y-8 border-2 rounded border-zinc-100 pt-20 pb-20 shadow-2xl'}>
                        <div className={'flex justify-center'}><IoIosBus className={'text-yellow-600'}  size={40}/></div>
                        <p className={'text-zinc-600 dark:text-white'}>اتوبوس مورد نظر خود را براساس vip و معمولی بودن اتوبوس انتخاب کنید</p>
                    </div>
                    <div
                        className={'col-span-3 flex  flex-col space-y-8 border-2 rounded border-zinc-100 pt-20 pb-20 shadow-2xl'}>
                        <div className={'flex justify-center'}><MdBusinessCenter className={'text-amber-500'} size={40}/></div>
                        <p className={'text-zinc-600 dark:text-white'}>خرید خود را نهایی و آماده یک سفر جذاب شوید </p>
                    </div>
                </div>
            </div>
        </>
    )
}