import Cart from './Cart'
import ClearHistoryButton from './ClearHistoryButton'

const Header = () => {
	return (
		<header className='w-full bg-[#fafafa] dark:bg-[#222222] px-4 py-3 flex items-center justify-between'>
			<ClearHistoryButton />

			<div className='flex flex-col items-center select-none'>
				<h1 className='text-2xl font-extrabold dark:text-white leading-tight text-gray-900'>
					Кафе Теплица
				</h1>

				<span className='text-xs text-green-400 font-normal tracking-wide mt-0.5'>
					AI Talent Weekend
				</span>
			</div>

			<Cart />
		</header>
	)
}

export default Header
