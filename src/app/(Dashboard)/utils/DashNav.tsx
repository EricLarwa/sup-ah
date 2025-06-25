import Features from '@/app/Components/Buttons/features';
import Setting from '@/app/Components/Buttons/setting';
import Account from '@/app/Components/Buttons/account';

interface DashNavProps {
    activeTab: 'track' | 'log' | 'stats';
    setActiveTab: React.Dispatch<React.SetStateAction<'track' | 'log' | 'stats'>>;
}

const DashNav: React.FC<DashNavProps> = ({setActiveTab}) => {
    return (
        <nav className="w-full bg-white  p-4 shadow-md border-2 b border-black stroke-200 ">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-lg text-black font-semibold">glucoTrack</span>
                </div>
                <div className="flex flex-row space-x-6">
                    <Features setActiveTab={setActiveTab} />
                    <Setting />
                    <Account />
                </div>                
            </div>
        </nav>
    )
}

export default DashNav;