import Cart from './Cart'
import ClearHistoryButton from './ClearHistoryButton'

const Header = () => {
	return (
		<header className='w-full bg-[#f1f1f1] dark:bg-[#2f2f2f] px-4 py-3 flex items-center justify-between rounded-b-2xl shadow-sm'>
			<ClearHistoryButton />

			<div className='flex flex-col items-center select-none'>
				<h1 className='text-2xl font-extrabold dark:text-white leading-tight text-gray-900 sha'>
					Кафе Теплица
				</h1>

				<span className='text-xs text-green-500 font-normal tracking-wide mt-0.5'>
					AI Talent Weekend
				</span>
			</div>

			<Cart />
		</header>
	)
}

export default Header
