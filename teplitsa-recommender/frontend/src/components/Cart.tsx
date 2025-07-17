import { ShoppingCart } from 'lucide-react'
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

	return (
		<div>
			<div
				onClick={() => setIsOpen(true)}
				className={`flex flex=cp hover:cursor-pointer ${
					highlight ? 'animate-[ping_0.3s]' : ''
				}`}
			>
				<button
					className='relative transition transform hover:scale-110 active:scale-95 hover:cursor-pointer'
					aria-label='Корзина'
					onClick={() => console.log('Открыть корзину')}
				>
					<ShoppingCart className='w-6 h-6 text-gray-900 dark:text-neutral-400 hover:text-green-500' />
				</button>
			</div>

			{isOpen && <CartModal onClose={() => setIsOpen(false)} />}
		</div>
	)
}

export default Cart
