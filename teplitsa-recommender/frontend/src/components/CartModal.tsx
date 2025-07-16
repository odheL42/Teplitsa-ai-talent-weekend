import React from 'react'
import { useCart } from '../context/CartContext'
import { useMenu } from '../context/MenuContext'

interface Props {
	onClose: () => void
}

const CartModal: React.FC<Props> = ({ onClose }) => {
	const { items, removeItem, clearCart } = useCart()
	const { dishById } = useMenu()
	const cartEntries = Object.entries(items)

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'
			onClick={onClose}
		>
			<div
				className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto shadow-lg relative'
				onClick={e => e.stopPropagation()}
			>
				{/* Крестик */}
				<button
					className='absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl'
					onClick={onClose}
				>
					×
				</button>

				<h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
					Корзина
				</h2>

				{cartEntries.length === 0 ? (
					<p className='text-gray-600 dark:text-gray-300'>Пусто</p>
				) : (
					<ul className='space-y-2'>
						{cartEntries.map(([id, amount]) => {
							const dish = dishById?.[id]
							if (!dish) return null
							return (
								<li
									key={id}
									className='flex justify-between items-center'
								>
									<div className='text-gray-800 dark:text-white'>
										{dish.title} — {amount} × {dish.price}₽
									</div>
									<button
										onClick={() => removeItem(id)}
										className='text-red-500 hover:underline'
									>
										Удалить
									</button>
								</li>
							)
						})}
					</ul>
				)}

				{cartEntries.length > 0 && (
					<button
						onClick={clearCart}
						className='mt-4 text-sm text-gray-600 hover:text-red-500 underline'
					>
						Очистить корзину
					</button>
				)}
			</div>
		</div>
	)
}

export default CartModal
