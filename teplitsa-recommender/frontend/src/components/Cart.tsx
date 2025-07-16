import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import CartModal from './CartModal'

const Cart: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [highlight, setHighlight] = useState(false)
	const { items } = useCart()

	useEffect(() => {
		if (Object.keys(items).length === 0) return
		setHighlight(true)
		const timeout = setTimeout(() => setHighlight(false), 300)
		return () => clearTimeout(timeout)
	}, [items])

	const totalAmount = () => {
		return Object.values(items).reduce((sum, amount) => sum + amount, 0)
	}

	return (
		<div className='fixed top-5 right-5 z-50'>
			<div
				onClick={() => setIsOpen(true)}
				className={`relative hover:cursor-pointer ${
					highlight ? 'animate-[ping_0.3s]' : ''
				}`}
			>
				<svg
					className='w-[40px] h-[40px] text-gray-800 dark:text-white'
					aria-hidden='true'
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					fill='none'
					viewBox='0 0 24 24'
				>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='1.4'
						d='M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312'
					/>
				</svg>

				{Object.keys(items).length > 0 && (
					<div className='absolute top-0 right-0 w-[18px] h-[18px] text-[12px] text-white bg-red-600 rounded-full flex items-center justify-center shadow'>
						{totalAmount()}
					</div>
				)}
			</div>

			{isOpen && <CartModal onClose={() => setIsOpen(false)} />}
		</div>
	)
}

export default Cart
