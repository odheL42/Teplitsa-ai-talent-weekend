import { FC } from 'react'
import { useCart } from '../../context/CartContext'
import { DBDish } from '../../types/menu'

type Props = {
	dish: DBDish
}

function capitalizeFirstLetter(str: string): string {
	if (!str) return str
	return str[0].toUpperCase() + str.slice(1)
}

const DishCard: FC<Props> = ({ dish }) => {
	const { addItem } = useCart()

	const handleAdd = () => {
		addItem(dish.id)
	}

	return (
		<div className='rounded-2xl p-4 shadow-sm mb-2 bg-[#f1f1f1] dark:bg-[#141414] max-w-xs'>
			<h3 className='font-semibold text-base text-black dark:text-[#f9f9f9]'>
				{capitalizeFirstLetter(dish.title)}
			</h3>
			{dish.composition && (
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					{dish.composition}
				</p>
			)}
			<div className='flex justify-between items-center mt-2'>
				<span className='text-sm font-medium text-black dark:text-[#f9f9f9]'>
					{dish.price}
					{dish.quantity ? ` • ${dish.quantity}` : ''}
				</span>
				<button
					onClick={handleAdd}
					className='text-sm bg-[#3cbd3e] dark:text-[#f9f9f9] px-3 py-1 rounded-xl hover:bg-green-600 transition'
				>
					Добавить
				</button>
			</div>
		</div>
	)
}

export default DishCard
