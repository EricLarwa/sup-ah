"use client";

import DashNav from "@/app/(Dashboard)/utils/DashNav";
import { createClient } from '@/lib/client'; // already in your workspace

import React, { useEffect, useState } from "react";
import { Bell, Download, Target} from "lucide-react";

interface Settings {
    glucoseUnit: 'mg/dL' | 'mmol/L';
    lowThreshold: number;
    highThreshold: number;
    reminderEnabled: boolean;
    reminderTime: string[];
    themeColor: string;
    notificationEnabled: boolean;
    biometricLogin: boolean;
    autoBackupEnabled: boolean;
    dataRetention: '1year' | '2years' | '5years' | 'indefinite';
}

const SettingsPage = () => {
    const [settings, setSettings] = useState<Settings>({
        glucoseUnit: 'mg/dL',
        lowThreshold: 70,
        highThreshold: 180,
        reminderEnabled: false,
        reminderTime: [],
        themeColor: 'light',
        notificationEnabled: true,
        biometricLogin: false,
        autoBackupEnabled: true,
        dataRetention: '1year',
    });

    const [activeTab, setActiveTab] = useState<'track' | 'log' | 'stats'>('track');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const savePreferences = async (newSettings: Settings) => {
        setSaving(true);
        setSaveSuccess(false);
        setSaveError(null);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setSaveError("No user found. Cannot save preferences.");
            setSaving(false);
            return;
        }
        const userId = user.id;
        const { error } = await supabase
            .from('user_preferences')
            .upsert([{ user_id: userId, ...newSettings }], { onConflict: 'user_id' });

        setSaving(false);

        if (error) {
            setSaveError(`Failed to save preferences`);
            setSaveSuccess(false);
        } else {
            setSaveSuccess(true);
        }
    };

    const handleSettingChange = (key: keyof Settings, value: any) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: value
        }));
    };

    const addReminderTime = () => {
        const newTime = '09:00';
        setSettings(prevSettings => ({
            ...prevSettings,
            reminderTime: [...prevSettings.reminderTime, newTime],
        }));
    }

    const removeReminderTime = (index: number) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            reminderTime: prevSettings.reminderTime.filter((_, i) => i !== index),
        }));
    };

    const updateReminderTime = (index: number, newTime: string) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            reminderTime: prevSettings.reminderTime.map((t, i) => (i === index ? newTime : t)),
        }));
    }

    useEffect(() => {
        const fetchPreferences = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data, error } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single();
            if (data) {
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    reminderTime: Array.isArray(data.reminderTime) ? data.reminderTime : [],
                }));
            }
        };
        fetchPreferences();
    }, []);

    return (
        <>
        <DashNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="max-w-full mx-auto p-5 bg-[#f5eddf] text-black min-h-screen">
                <div className="bg-black text-white p-5 mb-8 border-4 border-black shadow-[8px_8px_0px_#333]">
                    <h1 className="text-4xl font-black uppercase tracking-wider">SETTINGS</h1>
                </div>

                <div className="space-y-8">
                    <div className="bg-[#B8FF9F] border-4 border-black p-5 shadow-[8px_8px_0px_black]">
                        <h2 className="text-2xl font-black uppercase mb-6 tracking-wide flex items-center">
                            <Target className="mr-3" size={24} />
                            GLUCOSE PREFERENCES
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                                    UNITS
                                </label>
                                <select
                                    value={settings.glucoseUnit}
                                    onChange={(e) => handleSettingChange('glucoseUnit', e.target.value as 'mg/dL' | 'mmol/L')}
                                    className="w-full p-4 border-3 border-black bg-white font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black]"
                                >
                                    <option value="mg/dL">mg/dL</option>
                                    <option value="mmol/L">mmol/L</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                                LOW THRESHOLD
                                </label>
                                <input
                                type="number"
                                value={settings.lowThreshold}
                                onChange={(e) => handleSettingChange('lowThreshold', parseInt(e.target.value))}
                                className="w-full p-4 border-3 border-black bg-white font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black]"
                                />
                            </div>

                            <div>
                                <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                                    HIGH THRESHOLD
                                </label>
                                <input
                                    type="number"
                                    value={settings.highThreshold}
                                    onChange={(e) => handleSettingChange('highThreshold', parseInt(e.target.value))}
                                    className="w-full p-4 border-3 border-black bg-white font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#A6FAFF] border-4 border-black p-5 shadow-[8px_8px_0px_black]">
                        <h2 className="text-2xl font-black uppercase mb-6 tracking-wide">
                            <Bell className="mr-3" size={24} />
                            REMINDERS & NOTIFICATIONS
                        </h2>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <span className="font-bold uppercase text-lg">ENABLE REMINDERS</span>
                                <button
                                onClick={() => handleSettingChange('reminderEnabled', !settings.reminderEnabled)}
                                className={`
                                    w-16 h-8 border-3 border-black font-bold text-sm
                                    ${settings.reminderEnabled ? 'bg-[#B8FF9F]' : 'bg-[#FFB8B8]'}
                                    shadow-[3px_3px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black]
                                    transition-all duration-100
                                `}
                                >
                                {settings.reminderEnabled ? 'ON' : 'OFF'}
                                </button>
                            </div>

                            {settings.reminderEnabled && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold uppercase text-sm">REMINDER TIMES</span>
                                    <button
                                    onClick={addReminderTime}
                                    className="bg-[#B8FF9F] border-3 border-black px-4 py-2 font-mono font-bold shadow-[3px_3px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100"
                                    >
                                    + ADD TIME
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {settings.reminderTime.map((time, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => updateReminderTime(index, e.target.value)}
                                        className="flex-1 p-3 border-3 border-black bg-white font-mono font-bold focus:outline-none focus:shadow-[4px_4px_0px_black]"
                                        />
                                        <button
                                        onClick={() => removeReminderTime(index)}
                                        className="bg-[#FFB8B8] border-3 border-black px-3 py-3 font-mono font-bold shadow-[3px_3px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100"
                                        >
                                        ✕
                                        </button>
                                    </div>
                                    ))}
                                </div>
                            </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="font-bold uppercase text-lg">PUSH NOTIFICATIONS</span>
                                <button onClick={(() => handleSettingChange('notificationEnabled', !settings.notificationEnabled))}
                                    className={`
                                    w-16 h-8 border-3 border-black font-bold text-sm
                                    ${settings.notificationEnabled ? 'bg-[#B8FF9F]' : 'bg-[#FFB8B8]'}
                                    shadow-[3px_3px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black]
                                    transition-all duration-100
                                `}
                                >
                                    {settings.notificationEnabled ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                            DATA RETENTION
                        </label>
                        <select
                            value={settings.dataRetention}
                            onChange={(e) => handleSettingChange('dataRetention', e.target.value as '1year' | '2years' | '5years' | 'indefinite')}
                            className="w-full p-4 border-3 border-black bg-white font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black]"
                        >
                            <option value="1year">1 Year</option>
                            <option value="2years">2 Years</option>
                            <option value="5years">5 Years</option>
                            <option value="indefinite">Indefinite</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_black]">
                <h2 className="text-2xl font-black uppercase mb-6 tracking-wide flex items-center">
                <Download className="mr-3" size={24} />
                DATA EXPORT
                </h2>
                
                <div className="flex gap-4 flex-wrap">
                <button className="bg-[#A6FAFF] border-4 border-black px-6 py-4 font-mono font-bold uppercase shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100">
                    EXPORT CSV
                </button>
                <button className="bg-[#B8FF9F] border-4 border-black px-6 py-4 font-mono font-bold uppercase shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100">
                    EXPORT PDF
                </button>
                <button className="bg-[#FFB8B8] border-4 border-black px-6 py-4 font-mono font-bold uppercase shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100">
                    EMAIL REPORT
                </button>
                </div>
            </div>

            {/* Add Save Preferences button below your settings sections */}
            <div className="flex justify-end mt-8">
                <button
                    onClick={() => savePreferences(settings)}
                    disabled={saving}
                    className="bg-black text-white px-6 py-3 rounded-md font-bold border-2 border-black shadow-[4px_4px_0px_black] hover:bg-gray-800 transition-all"
                >
                    {saving ? "Saving..." : "Save Preferences"}
                </button>
                {saveError && (
                    <span className="ml-4 text-red-600 font-bold">{saveError}</span>
                )}
                {saveSuccess && (
                    <span className="ml-4 text-green-600 font-bold">Preferences saved!</span>
                )}
            </div>
        </div>
    </>

    );
};

export default SettingsPage;