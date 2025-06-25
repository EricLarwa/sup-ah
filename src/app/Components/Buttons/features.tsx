"use client"

// Features Dropdown
// UI Component -- Dropdown menu displaying web features 

import Link from "next/link";
import { Dispatch, SetStateAction, useState } from 'react';

import { useRouter } from "next/navigation";

type TabType = 'track' | 'log' | 'stats';

interface FeaturesProps {
    setActiveTab: Dispatch<SetStateAction<TabType>>;
}

const Features = ({ setActiveTab }: FeaturesProps) => {
    const [dropDown, setDropDown] = useState(false);
    const features = [
        { name: 'Logging', description: 'Description of Logging', tab: 'log' },
        { name: 'Tracking', description: 'Description of Tracking', tab: 'track' },
        { name: 'Stats', description: 'Description of Stats', tab: 'stats' }
    ];

    const router = useRouter();

    const toggleDropDown = () => {
        setDropDown(prev => {
            const next = !prev;
            document.body.style.overflow = next ? 'hidden' : '';
            return next;
        });
        // Only push if opening the dropdown
        if (!dropDown) {
            router.push('/dashboard?tab=track');
        }
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
                            <li
                                key={idx}
                                className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setActiveTab(feature.tab as TabType);
                                    setDropDown(false);
                                    document.body.style.overflow = '';
                                }}
                            >
                                <div className="font-bold text-black">{feature.name}</div>
                                <div className="text-sm text-gray-600">{feature.description}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Features;
