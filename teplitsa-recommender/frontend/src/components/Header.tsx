import { useMemo } from 'react'
import { useCart } from '../context/CartContext'
import { useMenu } from '../context/MenuContext'
import Cart from './Cart'
import ClearHistoryButton from './ClearHistoryButton'
const Header = () => {
	const { items } = useCart()
	const { dishById } = useMenu()

	const totalAmount = useMemo(() => {
		return Object.entries(items).reduce((sum, [id, amount]) => {
			const dish = dishById?.[id]
			if (!dish) return sum // skip if null/undefined
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
				<h1 className='text-2xl font-extrabold dark:text-white leading-tight text-gray-900 sha'>
					Экокафе «Теплица»
				</h1>

				<span className='text-xs text-green-500 font-normal tracking-wide mt-0.5'>
					AI Talent Weekend by «513»
				</span>
			</div>

			<div className=''></div>

			<div className='absolute top-5 right-6 flex flex-col items-center'>
				<Cart />
				{Object.keys(items).length > 0 && (
					<span className='mt-1 text-green-600 text-xs font-semibold whitespace-nowrap'>
						{formattedAmount}
					</span>
				)}
			</div>
		</header>
	)
}

export default Header
