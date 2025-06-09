"use client"

{/* Features Dropdown*/}
{/* UI Component -- Dropdown menu displaying web features */}

import { useState } from 'react';


const Features = () => {
    const [dropDown, setDropDown] = useState(false);
    const [features] = useState([
        { name: 'Logging', description: 'Description of Logging' },
        { name: 'Feature 2', description: 'Description of Feature 2' },
        { name: 'Feature 3', description: 'Description of Feature 3' }
    ]);
    
    const toggleDropDown = () => {
        setDropDown(prev => {
            const next = !prev;
            document.body.style.overflow = next ? 'hidden' : '';
            if (next) {
                features.forEach(feature => {
                    console.log(`Feature: ${feature.name}, Description: ${feature.description}`);
                });
            }
            return next;
        });
    };

    return (
        <div className="relative inline-block">
            <button
                className="flex items-center justify-center border-black border-2 rounded-md bg-[#FFB8B8] hover:bg-[#FF7D7D] active:bg-[#FF4C4C] w-20 h-10 hover:shadow-[4px_4px_0px_0px_rgba(0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-black font-semibold cursor-pointer"
                onClick={toggleDropDown}
            >
                Features
            </button>
            {dropDown && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-black rounded-md shadow-lg z-10">
                    <ul>
                        {features.map((feature, idx) => (
                            <li key={idx} className="px-4 py-2 hover:bg-gray-100">
                                <div className="font-bold">{feature.name}</div>
                                <div className="text-sm text-gray-600">{feature.description}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )

}

export default Features;