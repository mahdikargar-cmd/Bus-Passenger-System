
import Acardeon from "./Acardeon";
import acardeon from "../../../Utils/Acardeon";
export const AcardeonMenu = () => {

    return (
        <>
            <div className={'grid grid-cols-12   m-8'}>
                <div className={'col-span-12 dark:text-white flex justify-center m-8 text-[20px] font-semibold'}>
                    <h1>سوالات متداول</h1>
                </div>

                <div className="col-span-6 dark:bg-dark-black dark:text-white col-start-4 bg-white p-2 transition ease-in-out   hover:scale-105 duration-300">
                    {acardeon.map(({title, content}) => (
                        <Acardeon title={title} content={content}/>
                    ))}
                </div>
            </div>

        </>
    )
}