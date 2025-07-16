import React from 'react'

export const ChatIntroduction: React.FC = () => {
	return (
		<div className='mt-32 mx-auto flex h-full max-w-3xl flex-col gap-6 px-5 pt-6'>
			<div className='my-auto grid gap-8'>
				<div>
					<h1 className='text-5xl font-semibold text-[#323232] dark:text-[#f9f9f9] mb-4'>
						Чат кафе Теплица
					</h1>
					<p className='text-base text-[#323232] dark:text-[#f9f9f9] max-w-[400px]'>
						Помогу вам с заказом!
					</p>
				</div>
				{/* <div className='flex items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-600 p-4 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out max-w-[400px]'>
					<span className='text-sm text-gray-700 dark:text-gray-100'>
						<strong>ПКМ:</strong> Используйте быстрые промпты для
						работы с выделенным текстом
					</span>
				</div> */}
			</div>
		</div>
	)
}
