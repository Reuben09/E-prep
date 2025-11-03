import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Sidebar = ({ screen }) => {
    const { user, signOut } = useAuth(); // Get user and signOut from AuthContext

    const handleLogout = async () => {
        await signOut(); // Call signOut from context
        // No need to navigate here, the PrivateRoute will handle redirection if user becomes null
    };
    return (
        <div className=' w-[15vw] h-[100vh] fixed z-[100] bg-white py-[10px] border-r border-r-slate-300 flex-col items-center justify-between flex'>
            <div className=' w-full'>
                <div className=' flex items-center justify-center text-3xl font-bold text-black border-b-slate-300 border-b py-2 w-full mb-[10px]'><SchoolIcon fontSize='large' className=' text-[#0099FF] mr-[15px]' /> Eprep</div>

                <div className=' w-full px-[2.5%]'>
                    <Link
                        to={""}
                        className=' mb-[10px] block'
                    >
                        <div className={`${screen === "dashboard" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><HomeRoundedIcon className=' mr-[5px]'/>Dashboard</div>
                    </Link>

                    <Link
                        to={""}
                        className=' mb-[10px] block'
                    >
                        <div className={`${screen === "quiz" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><QuizRoundedIcon className=' mr-[5px]'/>Quizzes</div>
                    </Link>

                    <Link
                        to={""}
                        className=' mb-[10px] block'
                    >
                        <div className={`${screen === "progress" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><BarChartRoundedIcon className=' mr-[5px]'/>Progress</div>
                    </Link>

                    <Link
                        to={""}
                        className=' mb-[10px] block'
                    >
                        <div className={`${screen === "progress" ? " bg-[#0099FF]/20 text-[#0099FF]" : " text-slate-500 hover:bg-[#0099FF]/20 hover:text-[#0099FF] transition-all duration-500"} font-semibold h-fit w-full flex items-center justify-start px-[5%] py-[10px] rounded-md`}><AutoAwesomeIcon className=' mr-[5px]'/>AI Tutor</div>
                    </Link>
                </div>
            </div>
            <button onClick={handleLogout} className=' flex items-center justify-start text-slate-400 px-[10px] text-md text-black border-t-slate-300 border-t py-2 w-full'><LogoutIcon fontSize='small' className=' text-slate-400 mr-[5px]' /> Logout</button>
        </div>
    )
}

export default Sidebar