import {useState} from "react";

 export const Acardeon = ({title,content}) => {
    const [acardeon, setAcardeon] = useState(false);
    const AcardeonMenu=()=>{
        setAcardeon(!acardeon);
    }
    return (
        <>
            <div className="transition ease-in-out duration-300 " onClick={AcardeonMenu}>
                <div className=" flex p-2 justify-between">
                    <div>{title}</div>
                    <div>{acardeon ? '-' : '+'}</div>
                </div>
                {acardeon && <div className="p-2">{content}</div>}
            </div>

        </>
    )
}
export default Acardeon;