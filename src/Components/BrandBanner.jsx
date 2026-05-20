import fontimg from '../assets/images/fontimg.webp';

const BrandBanner = () => {
    return (
        <section className="py-6 md:py-16 w-full overflow-hidden">
            <div className="relative w-full">
                <img
                    src={fontimg}
                    alt="Brand Banner"
                    className="w-full h-auto block"
                    loading="lazy"
                />
            </div>
        </section>
    );
};

export default BrandBanner;
