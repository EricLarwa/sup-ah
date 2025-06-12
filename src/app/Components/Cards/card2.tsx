
type cardProps = {
    title: string;
    description: string;
}

const Card2 = ({ title, description }: cardProps) => {
    return (
        <div className="bg-[#68369B] border-3 border-black rounded-sm p-6 mt-5 w-full hover:-translate-y-1 hover:bg-[#7550A6] max-w-sm">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-white mb-4">{description}</p>
        </div>
    );
}

export default Card2;