export const Footer = () => {
    return (
        <>
            <div className={'bg-white-blue dark:bg-dark-blue text-white font-semibold grid grid-cols-12 p-6'}>
                <div className={'col-span-3 '}>
                    <p className={'p-2'}>خرید بلیط</p>
                    <p className={'p-2'}>استعلام بلیط</p>
                    <p className={'p-2'}>استرداد بلیط</p>
                </div>
                <div className={'col-span-3'}>
                    <p className={'p-2'}>ورود</p>
                    <p className={'p-2'}>درباره ما</p>
                    <p className={'p-2'}>تماس با ما</p>
                </div>

                <div className={'col-span-6'}>
                    <p className={'p-2'}>logo</p>
                    <p className={'p-2'}>
                        تلفن پشتیبانی : 3463143-0921
                    </p>
                    <p className={'p-2'}> دفتر پشتیبانی : تهران - ولی عصر خیابان بیمه چهارم بن بست گلها پلاک 5
                    </p>
                </div>
            </div>

        </>
    )
}