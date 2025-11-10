import Sidebar from '@/components/Sidebar'
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';
import { FadeInFromBottom } from '@/components/FadeInFromBottom';

const SettingsPage = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    // const loadStats = async () => {
    //     if (!user) return;

    //     // Load quiz statistics
    //     const { data: quizzes } = await supabase
    //       .from('quizzes')
    //       .select('score, completed')
    //       .eq('user_id', user.id)
    //       .eq('completed', true);

    //     if (quizzes && quizzes.length > 0) {
    //       const totalScore = quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
    //       setStats(prev => ({
    //         ...prev,
    //         totalQuizzes: quizzes.length,
    //         averageScore: Math.round(totalScore / quizzes.length)
    //       }));
    //     }
    //   };

    const handleLogout = async () => {
        await signOut(); // Call signOut from context
        // No need to navigate here, the PrivateRoute will handle redirection if user becomes null
    };

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        loadProfile();
        // loadStats();
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (data) {
            setProfile(data);
            //   setStats(prev => ({
            //     ...prev,
            //     streak: data.streak_days || 0,
            //     badges: Array.isArray(data.badges) ? data.badges : []
            //   }));
        }
    };
    return (
        <div className=' w-[100dvw] min-h-[100vh] bg-slate-100'>
            <Sidebar screen={"settings"} />
            <div className="max-sm:pt-[90px] bg-slate-100 mx-auto lg:px-4 py-10 space-y-8 lg:pl-[15vw] flex items-center justify-center">
                <div className=' w-[80%]'>
                    <FadeInFromBottom>
                        <div className=' w-[100%]'>
                            <h1 className=' font-extrabold text-black text-4xl mb-[20px]'>Your Profile</h1>

                            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                                <div className="flex flex-col items-center text-center pb-8 border-b border-slate-200 ">
                                    <div className="relative mb-4">
                                        <img alt="User avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1Tx8Qt1LA-1QYYP09-gGRjtwh0YeVNCugVpTnm2gWylRp8XX00gVaOw6DarT5JGTdI5K7JU3M_9b3EGH4Uoe5Dpz17p76g0PlaGUl0Ca-QqmIXGONxI1JbD2e0hY_bMC15dF3pwJH0eFa1vhKlSdEwSCAmTbD3TXzLH-Wwx8XFhXzHJ-cpOSsWDizIBV0xCd1FevfgMiG-fbcjm9Fh_5MoSnXA_2Yuop1cxXkT_aSJJ9w4NOdmsqin0sWMTJZQZHQbNHLWK_o9e8" />
                                        <button className="absolute bottom-1 right-1 bg-blue-400 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm">
                                            <CreateIcon />
                                        </button>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{profile?.full_name}</h3>
                                    <p className="text-slate-500">10th Grade</p>
                                    <p className="text-slate-500">{profile?.email}</p>
                                </div>
                                <div className="pt-8 space-y-4">
                                    {/* <div className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-500">dark_mode</span>
                                    <span className="text-slate-700 font-medium">Dark Mode</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input className="sr-only peer" type="checkbox" value="" />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                </label>
                            </div> */}
                                    <a className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors mb-[10px]" href="#">
                                        <div className="flex items-center gap-4 text-black">
                                            <LockOutlineIcon />
                                            <span className="text-slate-700 font-medium">Change Password</span>
                                        </div>
                                        <ChevronRightIcon className=' text-slate-500' />
                                    </a>
                                    <a className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors mb-[10px]" href="#">
                                        <div className="flex items-center gap-4 text-black">
                                            <HelpOutlineIcon className='text-black' />
                                            <span className="text-slate-700 font-medium">Help &amp; Support</span>
                                        </div>
                                        <ChevronRightIcon className=' text-slate-500' />
                                    </a>
                                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors mb-[10px]">
                                        <div className=' flex items-center justify-start px-[10px] text-md text-black text-red-500 py-2 w-full'><LogoutIcon fontSize='small' className=' text-red-500 mr-[5px]' /> Logout</div>

                                    </button>
                                    {/* <a className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors" href="#">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-500">language</span>
                                    <span className="text-slate-700 font-medium">Language</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500">English</span>
                                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                </div>
                            </a> */}
                                    {/* <a className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors" href="#" />
                            <div className="flex items-center gap-4">
                                <HelpOutlineIcon className='text-black' />
                                <span className="text-slate-700 font-medium">Help &amp; Support</span>
                            </div> */}
                                </div>
                            </div>
                        </div>
                    </FadeInFromBottom>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage