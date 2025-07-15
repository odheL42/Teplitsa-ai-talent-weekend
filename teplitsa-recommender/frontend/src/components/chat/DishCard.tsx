import { FC } from 'react'

type Props = {
	title: string
	description?: string
	price: string
	weight?: string
	onAdd?: () => void
}

const DishCard: FC<Props> = ({ title, description, price, weight, onAdd }) => {
	return (
		<div className='rounded-2xl p-4 shadow-sm mb-2 bg-[#f1f1f1] dark:bg-[#141414] max-w-xs'>
			<h3 className='font-semibold text-base text-black dark:text-[#f9f9f9]'>
				{title}
			</h3>
			{description && (
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					{description}
				</p>
			)}
			<div className='flex justify-between items-center mt-2'>
				<span className='text-sm font-medium text-black dark:text-[#f9f9f9]'>
					{price}
					{weight ? ` • ${weight}` : ''}
				</span>
				<button
					onClick={onAdd}
					className='text-sm bg-[#3cbd3e] dark:text-[#f9f9f9] px-3 py-1 rounded-xl hover:bg-green-600 transition'
				>
					Добавить
				</button>
			</div>
		</div>
	)
}

export default DishCard
