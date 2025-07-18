import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useMenu } from '../context/MenuContext'
import Cart from './Cart'
import CartModal from './CartModal'
import ClearHistoryButton from './ClearHistoryButton'

const Header = () => {
	const { items } = useCart()
	const { dishById } = useMenu()
	const [isOpen, setIsOpen] = useState(false)
	const [highlight, setHighlight] = useState(false)

	useEffect(() => {
		if (Object.keys(items).length === 0) return
		setHighlight(true)
		const timeout = setTimeout(() => setHighlight(false), 300)
		return () => clearTimeout(timeout)
	}, [items])

	const totalAmount = useMemo(() => {
		return Object.entries(items).reduce((sum, [id, amount]) => {
			const dish = dishById?.[id]
			if (!dish) return sum
			return sum + dish.price * amount
		}, 0)
	}, [items, dishById])

	const formattedAmount = useMemo(() => {
		return totalAmount.toLocaleString('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			maximumFractionDigits: 0,
		})
	}, [totalAmount])
	return (
		<header className='max-w-3xl w-full bg-[#f1f1f1] dark:bg-[#2f2f2f] px-4 py-3 rounded-b-2xl shadow-sm relative'>
			<div className='absolute top-5 left-6'>
				<ClearHistoryButton />
			</div>

			<div className='flex flex-col items-center select-none'>
				<h1 className='text-2xl font-extrabold dark:text-white leading-tight text-gray-900'>
					<a
						href='https://www.teplitsamenu.ru/'
						target='_blank'
						rel='noopener noreferrer'
						className='hover:underline'
					>
						Экокафе «Теплица»
					</a>
				</h1>

				<span className='text-xs text-green-500 font-normal tracking-wide mt-0.5'>
					AI Talent Weekend by «513»
				</span>
			</div>

			<div className=''></div>

			<div className='absolute top-5 right-6 flex flex-col items-center'>
				<Cart />
				{Object.keys(items).length > 0 && (
					<button
						onClick={() => setIsOpen(true)}
						className={`mt-1 text-green-600 text-xs font-semibold whitespace-nowrap transition hover:text-green-700 ${
							highlight ? 'animate-[ping_0.3s]' : ''
						}`}
					>
						{formattedAmount}
					</button>
				)}
			</div>

			{isOpen && <CartModal onClose={() => setIsOpen(false)} />}
		</header>
	)
}

export default Header
