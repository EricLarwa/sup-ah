"use client";

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

import DashNav from "@/app/(Dashboard)/utils/DashNav";
import { createClient } from '@/lib/client';

const supabase = createClient();

interface UserProfile {
  id: string; 
  name: string;
  email: string;
  age: number;
  diabetesType: '1' | '2' | 'gestational' | 'other';
  diagnosisDate: string;
  medications: string[];
  doctor: string;
  emergencyContact: string;
}

function Profile() {
    const [profile, setProfile] = useState<UserProfile>({
        id: '', // Initialize id
        name: '',
        email: '',
        age: 0,
        diabetesType: '1',
        diagnosisDate: '',
        medications: [],
        doctor: '',
        emergencyContact: ''
    });

    // Fetch profile from Supabase on mount
    useEffect(() => {
        async function fetchProfile() {
            // Always get the current user from Supabase Auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setProfile(prev => ({ ...prev, id: '' }));
                return;
            }

            // Fetch profile data using the user's id
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile({
                    ...data,
                    id: user.id,
                    medications: Array.isArray(data.medications) ? data.medications : [],
                } as UserProfile);
            } else {
                setProfile(prev => ({ ...prev, id: user.id }));
            }
        }
        fetchProfile();
    }, []);
        
    const [activeTab, setActiveTab] = useState<'track' | 'log' | 'stats'>('track');
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileChange = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            alert('User not authenticated');
            return;
        }
        
        // Always use the authenticated user's ID
        const profileToSave = {
            ...profile,
            id: user.id 
        }
            ;
        
        const { error } = await supabase
            .from('profiles')
            .upsert(profileToSave, { onConflict: 'id' })
            .single();
            
        if (error) {
            console.error('Error updating profile:', error);
        } else {
            setIsEditing(false);
            alert('Profile saved successfully!');
        }
    };

    return (
        <>
            <DashNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className=" mx-auto p-5 bg-[#f5eddf] min-h-screen">
                <div className="bg-black text-white p-5 mb-8 border-4 border-black shadow-[8px_8px_0px_#333]">
                    <h1 className="text-4xl font-black uppercase tracking-wider">ACCOUNT</h1>
                </div>

                <div className="space-y-8 text-black">
                {/* Profile Information */}
                <div className="bg-[#A6FAFF] border-4 border-black p-8 shadow-[8px_8px_0px_black]">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-wide flex items-center">
                        <User className="mr-3" size={24} />
                        PROFILE INFORMATION
                    </h2>
                    <button
                        onClick={async () => {
                            if (isEditing) {
                                await handleSaveProfile();
                                setIsEditing(false);
                            } else {
                                setIsEditing(true);
                            }
                        }}
                        className={`
                        border-4 border-black px-6 py-3 font-mono font-bold uppercase
                        shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black]
                        transition-all duration-100
                        ${isEditing ? 'bg-[#B8FF9F]' : 'bg-[#FFB8B8]'}
                        `}
                    >
                        {isEditing ? 'SAVE' : 'EDIT'}
                    </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                        FULL NAME
                        </label>
                        <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-4 border-3 border-black font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                        />
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                        EMAIL
                        </label>
                        <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-4 border-3 border-black font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                        />
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                        AGE
                        </label>
                        <input
                        type="number"
                        value={profile.age}
                        onChange={(e) => handleProfileChange('age', parseInt(e.target.value))}
                        disabled={!isEditing}
                        className={`w-full p-4 border-3 border-black font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                        />
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                        DIABETES TYPE
                        </label>
                        <select
                        value={profile.diabetesType}
                        onChange={(e) => handleProfileChange('diabetesType', e.target.value as UserProfile['diabetesType'])}
                        disabled={!isEditing}
                        className={`w-full p-4 border-3 border-black font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                        >
                        <option value="1">TYPE 1</option>
                        <option value="2">TYPE 2</option>
                        <option value="gestational">GESTATIONAL</option>
                        <option value="other">OTHER</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                        DIAGNOSIS DATE
                        </label>
                        <input
                        type="date"
                        value={profile.diagnosisDate}
                        onChange={(e) => handleProfileChange('diagnosisDate', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-4 border-3 border-black font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                        />
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                        EMERGENCY CONTACT
                        </label>
                        <input
                        type="tel"
                        value={profile.emergencyContact}
                        onChange={(e) => handleProfileChange('emergencyContact', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-4 border-3 border-black font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                        />
                    </div>
                    </div>
                </div>

                {/* Medical Information */}
                <div className="bg-[#B8FF9F] border-4 border-black p-8 shadow-[8px_8px_0px_black]">
                    <h2 className="text-2xl font-black uppercase mb-6 tracking-wide">
                    MEDICAL INFORMATION
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                        PRIMARY DOCTOR
                        </label>
                        <input
                        type="text"
                        value={profile.doctor}
                        onChange={(e) => handleProfileChange('doctor', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-4 border-3 border-black font-mono text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_black] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                        />
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm tracking-wide">
                        CURRENT MEDICATIONS
                        </label>
                        <div className="space-y-2">
                        {profile.medications.map((med, index) => (
                            <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={med}
                                onChange={(e) => {
                                const newMeds = [...profile.medications];
                                newMeds[index] = e.target.value;
                                handleProfileChange('medications', newMeds);
                                }}
                                disabled={!isEditing}
                                className={`flex-1 p-3 border-3 border-black font-mono font-bold focus:outline-none focus:shadow-[4px_4px_0px_black] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                            />
                            {isEditing && (
                                <button
                                onClick={() => {
                                    const newMeds = profile.medications.filter((_, i) => i !== index);
                                    handleProfileChange('medications', newMeds);
                                }}
                                className="bg-[#FFB8B8] border-3 border-black px-3 py-3 font-mono font-bold shadow-[3px_3px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100"
                                >
                                ✕
                                </button>
                            )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                            onClick={() => handleProfileChange('medications', [...profile.medications, ''])}
                            className="bg-[#A6FAFF] border-3 border-black px-4 py-2 font-mono font-bold shadow-[3px_3px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100"
                            >
                            + ADD MEDICATION
                            </button>
                        )}
                        </div>
                    </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="bg-[#FFB8B8] border-4 border-black p-8 shadow-[8px_8px_0px_black]">
                    <h2 className="text-2xl font-black uppercase mb-6 tracking-wide">
                    ACCOUNT ACTIONS
                    </h2>

                    <div className="flex gap-4 flex-wrap">
                    <button className="bg-white border-4 border-black px-6 py-4 font-mono font-bold uppercase shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100">
                        CHANGE PASSWORD
                    </button>
                    <button className="bg-[#A6FAFF] border-4 border-black px-6 py-4 font-mono font-bold uppercase shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_black] transition-all duration-100">
                        DOWNLOAD DATA
                    </button>
                    <button className="bg-black text-white border-4 border-black px-6 py-4 font-mono font-bold uppercase shadow-[4px_4px_0px_#333] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#333] transition-all duration-100">
                        DELETE ACCOUNT
                    </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Profile;