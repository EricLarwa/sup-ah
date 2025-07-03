"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from "next/navigation";

import { calculateStats, getGlucoseCategory } from '../utils/DashUtils';
import DashNav from '../utils/DashNav'

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line as ChartLine, Bar } from 'react-chartjs-2';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/client';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function displayGlucose(value: number, unit: 'mg/dL' | 'mmol/L') {
    return unit === 'mmol/L'
        ? (value / 18).toFixed(1) // 1 mmol/L = 18 mg/dL
        : value;
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get("tab") as 'track' | 'log' | 'stats') || 'track';
    const [activeTab, setActiveTab] = useState<'track' | 'log' | 'stats'>(initialTab);
    const [readings, setReadings] = useState<Reading[]>([]);
    const [glucoseInput, setGlucoseInput] = useState<string>('');
    const [notesInput, setNotesInput] = useState<string>('');
    const [timeSelect, setTimeSelect] = useState<string>('FASTING')

    const [userId, setUserId] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<Settings | null>(null);

    const router = useRouter();

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) {
                router.push('/auth');
            } else {
                setUserId(data.session.user.id);
            }
        }
        checkAuth();
    }, [router]);

    // Fetch readings from Supabase for this user
    useEffect(() => {
        if (!userId) return;
        const fetchReadings = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('readings')
                .select('*')
                .eq('user_id', userId)
                .order('timestamp', { ascending: false });
            if (!error && data) {
                setReadings(data.map((r: Reading) => ({
                    ...r,
                    timestamp: new Date(r.timestamp),
                    category: getGlucoseCategory(r.glucose)
                })));
            }
        };
        fetchReadings();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const fetchPreferences = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', userId)
                .single();
            if (data) setPreferences(data);
        };
        fetchPreferences();
    }, [userId]);

    const stats = calculateStats(readings);

    const handleQuickAdd = (value: number) => {
        setGlucoseInput(value.toString());
    }

    const handleAddReading = async () => {
        const glucose = parseInt(glucoseInput);

        if(!glucose || isNaN(glucose)) {
            alert('Please enter a valid glucose value.');
            return;
        }

        if(glucose < 40 || glucose > 300) {
            alert('Please contact your doctor if you are experiencing glucose levels outside of the recommended range.');
        }

        if (!userId) return;

        const newReading = {
            glucose,
            time: timeSelect,
            notes: notesInput,
            timestamp: new Date().toISOString(),
            user_id: userId
        };

        const supabase = createClient();
        const { data, error } = await supabase
            .from('readings')
            .insert([newReading])
            .select()
            .single();

        if (!error && data) {
            setReadings(prev => [{
                ...data,
                timestamp: new Date(data.timestamp),
                category: getGlucoseCategory(data.glucose)
            }, ...prev]);
            setGlucoseInput('');
            setNotesInput('');
        } else {
            alert('Failed to add reading.');
        }
    }

    const handleDeleteReading = (id: number) => {
        setReadings(prev => prev.filter(reading => reading.id !== id));
    }

    const chartData = readings.slice(0, 10).reverse().map(reading => ({
        date: reading.timestamp.toLocaleDateString(),
        glucose: reading.glucose,
    }))

    const trendsData = [
        { name: 'Low (<70)', value: readings.filter(r => r.category === 'low').length, fill: '#A6FAFF' },
        { name: 'Normal (70-140)', value: readings.filter(r => r.category === 'normal').length, fill: '#B8FF9F' },
        { name: 'High (>140)', value: readings.filter(r => r.category === 'high').length, fill: '#FFB8B8' }
    ];

    return (
        <>
            <DashNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="max-w-full mx-auto p-5 bg-[#f5eddf] min-h-screen">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    
                    {/* Logging Section */}
                    {activeTab === 'log' && (
                        <div className="flex-1">
                            <div className="w-full bg-black text-white p-5 mb-8 border-4 border-black shadow-[8px_8px_0px_#333]">
                                <h1 className="text-4xl font-black uppercase tracking-wider">LOGGING</h1>
                            </div>
                            <div className="bg-[#B8FF9F] border-4 border-black p-8 mb-8 md:mb-0 shadow-[8px_8px_0px_black] w-full">
                                <h2 className="text-2xl font-bold mb-4 text-black">Log Your Blood Sugar</h2>

                                <div className="flex flex-col gap-4  mb-5">
                                    <div className='flex-1 min-w-[150px]'>
                                        <label className="block text-black font-bold mb-2">Glucose Level</label>
                                        <input
                                            type="number"
                                            value={glucoseInput}
                                            onChange={(e) => setGlucoseInput(e.target.value)}
                                            className="w-full p-2 border-2 font-bold bg-white border-black text-black rounded-md"
                                            placeholder="Enter glucose level"
                                        />
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <label className="block font-bold uppercase text-black mb-2 text-sm tracking-wide">
                                    TIME
                                    </label>
                                    <select
                                    value={timeSelect}
                                    onChange={(e) => setTimeSelect(e.target.value)}
                                    className="w-full p-4 border-3 border-black text-black bg-white font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black]"
                                    >
                                    <option>FASTING</option>
                                    <option>BEFORE MEAL</option>
                                    <option>AFTER MEAL</option>
                                    <option>BEDTIME</option>
                                    <option>RANDOM</option>
                                    </select>
                                </div>
                                
                                <div className="flex-1 mt-2 min-w-[150px]">
                                    <label className="block font-bold text-black uppercase mb-2 text-sm tracking-wide">
                                    NOTES
                                    </label>
                                    <input
                                    type="text"
                                    value={notesInput}
                                    onChange={(e) => setNotesInput(e.target.value)}
                                    placeholder="Optional notes"
                                    className="w-full p-4 border-3 border-black text-black bg-white text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black]"
                                    />
                                </div>

                                <button 
                                    onClick={handleAddReading}
                                    className="bg-[#FFB8B8] border-2 border-black text-black font-bold py-2 px-4 rounded-md mt-4 hover:bg-[#FF7D7D] active:bg-[#FF4C4C] shadow-[4px_4px_0px_black] cursor-pointer transition-all"
                                >
                                    Add Reading
                                </button>

                                <div className="flex gap-2 mt-5 flex-wrap">
                                    <div className="mb-2 font-bold uppercase text-black">Quick Add:</div>
                                    {[70, 100, 120, 150, 180].map(value => (
                                        <button
                                            key={value}
                                            onClick={() => handleQuickAdd(value)}
                                            className="bg-[#B8FF9F] border-2 border-black text-black font-bold py-1 px-2 rounded-md hover:bg-[#A6FAFF] active:bg-[#8EDBFF] shadow-[4px_4px_0px_black] hover:shadow-none hover:scale-105 cursor-pointer transition-all"
                                        >
                                            {value}
                                        </button>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Section (sidebar) */}
                    <div className="md:w-1/3 w-full">
                        <div className="grid grid-cols-1 mt-30 text-black gap-5">
                            <div className="bg-[#B8FF9F] border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                                <div className="text-4xl font-black mb-1">
                                    {stats.latestReading !== null
                                        ? displayGlucose(stats.latestReading, preferences?.glucoseUnit || 'mg/dL')
                                        : '--'}
                                </div>
                                <div className="text-sm font-bold text-black uppercase tracking-wide">
                                    LATEST READING ({preferences?.glucoseUnit || 'mg/dL'})
                                </div>
                            </div>
                            <div className="bg-[#A6FAFF] border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                                <div className="text-4xl font-black mb-1">
                                    {stats.avgReading || '--'}
                                </div>
                                <div className="text-sm font-bold text-black uppercase tracking-wide">
                                    7-DAY AVERAGE
                                </div>
                            </div>
                            <div className="bg-[#FFB8B8] border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                                <div className="text-4xl font-black mb-1">
                                    {stats.readingsCount}
                                </div>
                                <div className="text-sm font-bold text-black uppercase tracking-wide">
                                    TOTAL READINGS
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Track Tab */}
                    {activeTab === 'track' && (
                        <div className="w-full flex flex-col items-center md:justify-center md:items-start">
                            <div className="w-full flex justify-center">
                                <div className="max-w-3xl w-full">
                                    <div className="bg-black text-white p-5 mb-8 border-4 border-black shadow-[8px_8px_0px_#333]">
                                        <h1 className="text-4xl font-black uppercase tracking-wider">TRACKING</h1>
                                    </div>
                                    <div className="bg-white border-4 border-black p-8 mb-8 shadow-[8px_8px_0px_black] w-full">
                                        <div className="h-64">
                                            <ChartLine
                                                data={{
                                                    labels: chartData.map(d => d.date),
                                                    datasets: [{
                                                        label: 'Glucose',
                                                        data: chartData.map(d => d.glucose),
                                                        borderColor: '#000',
                                                        backgroundColor: 'rgba(166, 250, 255, 0.3)',
                                                        borderWidth: 3,
                                                        pointBackgroundColor: '#FFB8B8',
                                                        pointBorderColor: '#000',
                                                        pointBorderWidth: 2,
                                                        pointRadius: 6
                                                    }]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            labels: {
                                                                font: {
                                                                    family: 'monospace',
                                                                    weight: 'bold'
                                                                }
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: false,
                                                            min: 50,
                                                            max: 300,
                                                            ticks: {
                                                                font: {
                                                                    family: 'monospace',
                                                                    weight: 'bold'
                                                                }
                                                            }
                                                        },
                                                        x: {
                                                            ticks: {
                                                                font: {
                                                                    family: 'monospace',
                                                                    weight: 'bold'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Log Entries */}
                                    <div className="space-y-4 w-full">
                                        {readings.map((reading) => (
                                            <div
                                                key={reading.id}
                                                className={`
                                                    bg-white border-3 text-black border-black p-5 shadow-[4px_4px_0px_black]
                                                    flex justify-between items-center flex-wrap gap-4
                                                    ${reading.category === 'high' ? 'border-l-8 border-l-[#FFB8B8]' : ''}
                                                    ${reading.category === 'normal' ? 'border-l-8 border-l-[#B8FF9F]' : ''}
                                                    ${reading.category === 'low' ? 'border-l-8 border-l-[#A6FAFF]' : ''}
                                                `}
                                            >
                                                <div>
                                                    <div className="text-2xl font-black mb-1">
                                                        {displayGlucose(reading.glucose, preferences?.glucoseUnit || 'mg/dL')} {preferences?.glucoseUnit || 'mg/dL'}
                                                    </div>
                                                    <div className="text-sm font-bold">
                                                        {reading.time} | {reading.timestamp.toLocaleDateString()} {reading.timestamp.toLocaleTimeString()}
                                                        {reading.notes && ` | ${reading.notes}`}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteReading(reading.id)}
                                                    className="bg-[#FFB8B8] border-2 border-black px-3 py-2 font-mono text-xs font-bold shadow-[2px_2px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_black] transition-all duration-100 cursor-pointer"
                                                >
                                                    DELETE
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && (
                        <div className="w-full flex justify-center">
                            <div className="max-w-4xl w-full">
                                <div className="bg-black text-white p-5 mb-8 border-4 border-black shadow-[8px_8px_0px_#333]">
                                    <h1 className="text-4xl font-black uppercase tracking-wider">STATISTICS</h1>
                                </div>
                                {/* Trends Chart */}
                                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_black]">
                                    <h2 className="text-xl font-black text-black uppercase mb-5">GLUCOSE TRENDS</h2>
                                    <div className="h-64">
                                    <Bar
                                        data={{
                                        labels: trendsData.map(d => d.name),
                                        datasets: [{
                                            label: 'Readings Count',
                                            data: trendsData.map(d => d.value),
                                            backgroundColor: trendsData.map(d => d.fill),
                                            borderColor: '#000',
                                            borderWidth: 3
                                        }]
                                        }}
                                        options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                            labels: {
                                                font: {
                                                family: 'monospace',
                                                weight: 'bold'
                                                }
                                            }
                                            }
                                        },
                                        scales: {
                                            y: {
                                            beginAtZero: true,
                                            ticks: {
                                                font: {
                                                family: 'monospace',
                                                weight: 'bold'
                                                }
                                            }
                                            },
                                            x: {
                                            ticks: {
                                                font: {
                                                family: 'monospace',
                                                weight: 'bold'
                                                }
                                            }
                                            }
                                        }
                                        }}
                                    />
                                    </div>
                                </div>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 text-black">
                                    <div className="bg-[#ba9fff] border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                                    <div className="text-4xl font-black mb-1">
                                        {stats.normalPercent}%
                                    </div>
                                    <div className="text-sm font-bold uppercase tracking-wide flex items-center">
                                        <span className="inline-block w-3 h-3 bg-[#ba9fff] border-2 border-black mr-2"></span>
                                        IN RANGE %
                                    </div>
                                    </div>
                                    
                                    <div className="bg-[#FFB8B8] border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                                    <div className="text-4xl font-black mb-1">
                                        {stats.highPercent}%
                                    </div>
                                    <div className="text-sm font-bold uppercase tracking-wide flex items-center">
                                        <span className="inline-block w-3 h-3 bg-[#FFB8B8] border-2 border-black mr-2"></span>
                                        HIGH %
                                    </div>
                                    </div>
                                    
                                    <div className="bg-[#A6FAFF] border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                                    <div className="text-4xl font-black mb-1">
                                        {stats.lowPercent}%
                                    </div>
                                    <div className="text-sm font-bold uppercase tracking-wide flex items-center">
                                        <span className="inline-block w-3 h-3 bg-[#A6FAFF] border-2 border-black mr-2"></span>
                                        LOW %
                                    </div>
                                    </div>
                                    
                                    <div className="bg-[#B8FF9F] border-4 border-black p-6 shadow-[6px_6px_0px_black]">
                                    <div className="text-4xl font-black mb-1">
                                        {stats.avgGlucose}
                                    </div>
                                    <div className="text-sm font-bold uppercase tracking-wide">
                                        AVERAGE GLUCOSE
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Main component with Suspense wrapping the component that uses useSearchParams
export default function Dashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}