import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion } from "framer-motion";
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
// import Logo from "../assets/Eprep.png"

const Sidebar = ({ screen }) => {
    const { user, signOut } = useAuth(); // Get user and signOut from AuthContext

    const handleLogout = async () => {
        await signOut(); // Call signOut from context
        // No need to navigate here, the PrivateRoute will handle redirection if user becomes null
    };

    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className=' max-sm:hidden w-[15vw] h-[100vh] fixed z-[100] bg-white py-[10px] border-r border-r-slate-300 flex-col items-center justify-between flex'>
                <div className=' w-full'>
                    <div className=' flex items-center justify-center text-3xl font-bold text-black border-b-slate-300 border-b py-2 w-full mb-[10px]'>
                        <img src="../assets/Eprep.png" alt=""  className='h-[80px]'/>
                        </div>

                    <div className=' w-full px-[2.5%]'>
                        <Link
                            to={"/"}
                            className=' mb-[10px] block'
                        >
                            <div className={`${screen === "dashboard" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><HomeRoundedIcon className=' mr-[5px]' />Dashboard</div>
                        </Link>

                        <Link
                            to={"/quiz"}
                            className=' mb-[10px] block'
                        >
                            <div className={`${screen === "quiz" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><QuizRoundedIcon className=' mr-[5px]' />Quizzes</div>
                        </Link>

                        <Link
                            to={"/settings"}
                            className=' mb-[10px] block'
                        >
                            <div className={`${screen === "settings" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><SettingsIcon className=' mr-[5px]' />Settings</div>
                        </Link>

                        {/* <Link
                            to={""}
                            className=' mb-[10px] block'
                        >
                            <div className={`${screen === "progress" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><BarChartRoundedIcon className=' mr-[5px]' />Progress</div>
                        </Link> */}

                        <a
                            href={"/chatbot/index.html"}
                            className=' mb-[10px] block'
                        >
                            <div className={`${screen === "chatbot" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><AutoAwesomeIcon className=' mr-[5px]' />AI Tutor</div>
                        </a>
                    </div>
                </div>
                <button onClick={handleLogout} className=' flex items-center justify-start text-slate-400 px-[10px] text-md text-black border-t-slate-300 border-t py-2 w-full'><LogoutIcon fontSize='small' className=' text-slate-400 mr-[5px]' /> Logout</button>
            </div>

            <div className=' lg:hidden fixed z-[48] w-screen h-[80px] text-[#000033] bg-white backdrop-blur-xl flex items-center justify-between'>
                <div className=' flex items-center justify-center text-3xl font-bold text-black py-2 w-fit'>
                <img src="../assets/Eprep.png" alt=""  className='h-[80px]'/></div>

                <div>
                    <button
                        aria-label="Open menu"
                        className="relative w-12 h-12 flex items-center justify-center cursor-pointer lg:hidden"
                        onClick={toggleSidebar}
                    >
                        {/* Top Line */}
                        <div
                            className={`absolute w-6 h-0.5 bg-current transition-transform duration-300 ${isOpen ? "rotate-45" : "-translate-y-1.5"
                                }`}
                        ></div>

                        {/* Bottom Line */}
                        <div
                            className={`absolute w-6 h-0.5 bg-current transition-transform duration-300 ${isOpen ? "-rotate-45" : "translate-y-1.5"
                                }`}
                        ></div>
                    </button>

                    <motion.div
                        initial={{ width: 0 }} // Initial width of sidebar when closed
                        animate={{ width: isOpen ? "100vw" : 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            duration: 0.5,
                        }} // Smooth transition
                        style={{
                            height: "100vh",
                            backgroundColor: "",
                            color: "white",
                            overflow: "hidden",
                            position: "fixed",
                            top: 0,
                            left: 0,
                        }}
                        className=' shadow-md shadow-black bg-white navbar-bg text-white'
                    >
                        {/* Sidebar content */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isOpen ? 1 : 0 }}
                            transition={{ delay: 0.2 }}
                            style={{ padding: "20px" }}
                        >
                            <div  >
                                <div className=' flex w-full items-center justify-between mb-8 text-white'>
                                    <button
                                        aria-label="Open menu"
                                        className="relative w-12 h-12 flex items-center justify-center cursor-pointer lg:hidden text-[#0099FF]"
                                        onClick={toggleSidebar}
                                    >
                                        {/* Top Line */}
                                        <div
                                            className={`absolute w-6 h-0.5 bg-[#0099FF] text-[#0099FF] transition-transform duration-300 ${isOpen ? "rotate-45" : "-translate-y-1.5"
                                                }`}
                                        ></div>

                                        {/* Bottom Line */}
                                        <div
                                            className={`absolute w-6 h-0.5 bg-[#0099FF] text-[#0099FF] transition-transform duration-300 ${isOpen ? "-rotate-45" : "translate-y-1.5"
                                                }`}
                                        ></div>
                                    </button>
                                </div>
                            </div>

                            <div  >
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    <Link
                                        to="/"
                                        className="relative group text-[#0099FF] hover:text-[#0099FF]/40 duration-500 block w-fit mb-4 text-3xl"
                                        onClick={toggleSidebar}
                                    >
                                        <HomeRoundedIcon className=' mr-[5px]' />Dashboard
                                        {/* <span className="absolute left-1/2 bottom-0 w-0 h-[1px] bg-[#0099FF] transition-all duration-300 group-hover:w-full group-hover:left-0"></span> */}
                                    </Link>
                                    <Link
                                        to="/quiz"
                                        className="relative group text-[#0099FF] hover:text-[#0099FF]/40 duration-500 block w-fit mb-4 text-3xl"
                                        onClick={toggleSidebar}
                                    >
                                        <QuizRoundedIcon className=' mr-[5px]' />Quizzes
                                        {/* <span className="absolute left-1/2 bottom-0 w-0 h-[1px] bg-[#0099FF] transition-all duration-300 group-hover:w-full group-hover:left-0"></span> */}
                                    </Link>
                                    {/* <Link
                                        to="/#services"
                                        className="relative group text-[#0099FF] hover:text-[#0099FF]/40 duration-500 block w-fit mb-4 text-3xl"
                                        onClick={toggleSidebar}
                                    >
                                        <BarChartRoundedIcon className=' mr-[5px]' />Progress
                                        
                                    </Link> */}
                                    <a
                                        href="/chatbot/index.html"
                                        className="relative group text-[#0099FF] hover:text-[#0099FF]/40 duration-500 block w-fit mb-4 text-3xl"
                                        onClick={toggleSidebar}
                                    >
                                        <AutoAwesomeIcon className=' mr-[5px]' />AI Tutor
                                        {/* <span className="absolute left-1/2 bottom-0 w-0 h-[1px] bg-[#0099FF] transition-all duration-300 group-hover:w-full group-hover:left-0"></span> */}
                                    </a>
                                </ul>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default Sidebar