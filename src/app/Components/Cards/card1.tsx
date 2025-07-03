type CardProps = {
    img: string;
    title: string;
    description: string;
    link?: string;
    features: string[];

}

const Card = ({ img, title, description, link, features}: CardProps) => {
    return (
          <div className="w-80 h-full border-black border-3 rounded-md hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white">
            <a href={link} className="block cursor-pointer">
                <article className="w-full h-full">
                    <figure className="w-full h-1/2 border-black border-b-3">
                        <img 
                        src={img}
                        alt="thumbnail"
                        className="w-300 h-60 object-cover rounded-t-md"
                        />
                    </figure>
                    <div className="px-6 py-5 text-left h-full text-black">
                        <h1 className="text-[32px] mb-4">{title}</h1>
                        <p className="text-md mb-4 line-clamp-4">{description}</p>
                        <ul className="flex flex-col gap-2 mb-4">
                            {features.map((feature, idx) => (
                                <li key={idx} className="text-md font-semibold border-b-2 border-black">
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            </a>
            </div>
    )
}

export default Card;