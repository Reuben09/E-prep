import BookOpenIcon from '@/components/icons/BookOpenIcon';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const LandingPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 4000)
    })
    return (
        <div>
            {
                isLoading ?
                    (
                        <div className=' h-[100vh] w-full flex items-center justify-center bg-[#3A90EC]'>
                            <div className=' w-fit'>
                                <h1 className=' font-bold text-3xl md:text-7xl text-white'>PrepLab</h1>
                                <div className=' underlineanimation h-[3px] bg-[#D8E9FB]'></div>
                            </div>
                        </div>
                    ) : (
                        <div className='h-[100vh] w-[100vw] bg-[#F9FAFB] overflow-y-scroll text-black'>
                            <div className=' w-[100vw] h-[100vh] flex items-center justify-between px-[2.5%]'>
                                <div className=' w-[45%]'>
                                    <h1 className=' text-[64px]'>Study Smarter. Pass Faster</h1>
                                    <p className=' text-[18px] text-[#637381] mb-[20px]'>Access thousands of past questions, get AI-generated practice tests, and turn your own notes into personalized quizzes all in one platform.</p>
                                    <Link
                                        to={"/auth"}
                                        className=' bg-[#3A90EC] px-[20px] py-[7px] rounded-full text-white'
                                    >
                                        Start Now
                                    </Link>
                                </div>

                                <div className=' w-[529px] h-[525px] hero bg-[#D9D9D9]'></div>
                            </div>
                            <div className=' w-[100vw] h-[60vh]  flex items-center justify-between px-[2.5%]'>
                                <div className=' w-[45%]'>
                                    <h1 className=' text-black text-[32px] font-semibold'>About PrepLab</h1>
                                    <p className=' text-[18px] text-[#637381] text-justify'>
                                        PrepLab is a platform built  to help students study smarter, not harder. Preparing for exams like WAEC, JAMB and NECO can be overwhelming, especially with scattered materials and limited practice options. Our goal is to fix that.
                                        PrepLab combines past questions, AI-generated practice tests, and an innovative note-to-quiz tool that turns any uploaded note into a personalized exam. Whether you’re revising a single topic or preparing for your final exams, we give you everything you need in one place.
                                    </p>
                                </div>

                                <div className=' w-[45%] h-full about'></div>
                            </div>
                            <div className=' w-full px-[2.5%] mb-[10vh]'>
                                <h1 className=' text-[32px] font-semibold'>Our Features</h1>
                                <div className=' w-full flex items-center justify-between'>
                                    <div className=' w-[24%] border border-[#CCCCCC80] h-[34vh] bg-white rounded-xl p-[2%] flex flex-col items-start justify-between'>
                                        <div className=' h-[64px] mb-[10px] w-[64px] bg-[#3A90EC] rounded-full flex items-center justify-center text-white'>
                                            <BookOpenIcon />
                                        </div>
                                        <div>
                                            <h1 className=' text-[18px] text-left font-semibold mb-[10px]'>Past Questions for Any Exam</h1>
                                            <p className=' text-black text-[14px]'>Prepare confidently with well-structured past questions for WAEC, NECO, JAMB Instant access, instant answers</p>
                                        </div>
                                    </div>

                                    <div className=' w-[24%] border border-[#CCCCCC80] h-[34vh] bg-white rounded-xl p-[2%] flex flex-col items-start justify-between'>
                                        <div className=' h-[64px] mb-[10px] w-[64px] bg-[#3A90EC] rounded-full flex items-center justify-center text-white'>
                                            <EmojiEventsIcon />
                                        </div>
                                        <div>
                                            <h1 className=' text-[18px] text-left font-semibold mb-[10px]'>Past Questions for Any Exam</h1>
                                            <p className=' text-black text-[14px]'>Prepare confidently with well-structured past questions for WAEC, NECO, JAMB Instant access, instant answers</p>
                                        </div>
                                    </div>

                                    <div className=' w-[24%] border border-[#CCCCCC80] h-[34vh] bg-white rounded-xl p-[2%] flex flex-col items-start justify-between'>
                                        <div className=' h-[64px] mb-[10px] w-[64px] bg-[#3A90EC] rounded-full flex items-center justify-center text-white'>
                                            <BookOpenIcon />
                                        </div>
                                        <div>
                                            <h1 className=' text-[18px] text-left font-semibold mb-[10px]'>Past Questions for Any Exam</h1>
                                            <p className=' text-black text-[14px]'>Prepare confidently with well-structured past questions for WAEC, NECO, JAMB Instant access, instant answers</p>
                                        </div>
                                    </div>

                                    <div className=' w-[24%] h-[34vh] bg-white rounded-xl p-[2%] flex flex-col items-start justify-between'>
                                        <div className=' h-[64px] mb-[10px] w-[64px] bg-[#3A90EC] rounded-full flex items-center justify-center text-white'>
                                            <InsertChartIcon />
                                        </div>
                                        <div>
                                            <h1 className=' text-[18px] text-left font-semibold mb-[10px]'>Past Questions for Any Exam</h1>
                                            <p className=' text-black text-[14px]'>Prepare confidently with well-structured past questions for WAEC, NECO, JAMB Instant access, instant answers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=' w-full px-[2.5%] mb-[10vh]'>
                                <h1 className=' text-[32px] font-semibold mb-[10px]'>Practice Your Exams</h1>
                                <div className=' w-full flex items-center justify-between'>
                                    <div className=' w-[32%] border border-[#CCCCCC80] h-[45vh] bg-white rounded-xl p-[2%] flex flex-col items-start justify-between'>
                                        <div className=' mb-[10px] flex items-center justify-center text-white'>
                                            <img src="/elements1.png" alt="" />
                                        </div>
                                        <div>
                                            <h1 className=' text-[18px] text-left font-semibold mb-[10px]'>Past Questions for Any Exam</h1>
                                            <p className=' text-[#637381] text-[14px]'>Choose WAEC, JAMB, NECO, or any subject</p>
                                        </div>
                                    </div>

                                    <div className=' w-[32%] border border-[#CCCCCC80] h-[45vh] bg-white rounded-xl p-[2%] flex flex-col items-start justify-between'>
                                        <div className=' mb-[10px] flex items-center justify-center text-white'>
                                            <img src="/e2.png" alt="" />
                                        </div>
                                        <div>
                                            <h1 className=' text-[18px] text-left font-semibold mb-[10px]'>Select Mode</h1>
                                            <p className=' text-[#637381] text-[14px]'>Select from using Past questions, AI questions or note to quiz.</p>
                                        </div>
                                    </div>

                                    <div className=' w-[32%] border border-[#CCCCCC80] h-[45vh] bg-white rounded-xl p-[2%] flex flex-col items-start justify-between'>
                                        <div className=' mb-[10px] flex items-center justify-center text-white'>
                                            <img src="/e3.png" alt="" />
                                        </div>
                                        <div>
                                            <h1 className=' text-[18px] text-left font-semibold mb-[10px]'>Practice & Improve</h1>
                                            <p className=' text-[#637381] text-[14px]'>Get your score, report and analytics immediately after completion of testt</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=' h-[100vh] flex items-center justify-between px-[2.5%]'>
                                <div className=' h-full w-[55%] dash'></div>
                                <div className=' w-[40%]'>
                                    <h1 className=' text-[#161C24] text-[24px] mb-[20px] font-semibold'>Benefits of Using PrepLab</h1>
                                    <ul>
                                        <li className=' flex items-center justify-start'> <img src="/tick.png" alt="" className=' mr-2'/> AI generated questions to help you study faster</li>
                                        <li className=' flex items-center justify-start'> <img src="/tick.png" alt="" className=' mr-2'/> Upload note to generate questions</li>
                                        <li className=' flex items-center justify-start'> <img src="/tick.png" alt="" className=' mr-2'/> Smart analytics to help improve consistently</li>
                                        <li className=' flex items-center justify-start'> <img src="/tick.png" alt="" className=' mr-2'/> Past question library</li>
                                    </ul>
                                </div>
                            </div>
                            <div className=' w-[95%] h-[50vh] bg-[#3A90EC] rounded-xl mx-auto flex items-center justify-between px-[2.5%] mb-[10vh]'>
                                <div className=' w-[40%]'>
                                    <h1 className=' text-white text-[48px] mb-[20px]'>Ready to Level Up Your Exam Preparation?</h1>
                                    <Link
                                        to={"/auth"}
                                        className=' text-[#000] bg-white px-[40px] py-[7px] rounded-full text-white'
                                    >
                                        Get Started
                                    </Link>
                                </div>
                                <img src="/girl.png" alt="" className=' h-full'/>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default LandingPage