import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Chat from '../components/chat/ChatWindow'

const Home = () => {
	return (
		<div className='flex dark:bg-[#222222] '>
			<ToastContainer position='top-right' autoClose={3000} />
			<div className='w-full h-screen '>
				<Chat />
			</div>
		</div>
	)
}

export default Home
