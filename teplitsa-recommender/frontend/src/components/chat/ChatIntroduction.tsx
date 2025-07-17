import React, { useMemo } from 'react'

const greetingsPool = [
	'Привет! Я — чат-ассистент кафе Теплица. Помогу сделать заказ быстро и просто.',
	'Добро пожаловать в кафе Теплица! Здесь вы легко выберете и закажете любимые блюда.',
	'Здравствуйте! Это прототип для AI Talent Weekend — задавайте вопросы про меню и делайте заказ.',
	'Рад видеть вас в кафе Теплица! Спрашивайте про блюда, рекомендации и заказы.',
]

const tipsPool = [
	{
		title: 'Быстрые промпты',
		description:
			'Используйте правый клик (ПКМ) на выделенном тексте для быстрых действий',
	},
	{
		title: 'Аллергии и предпочтения',
		description:
			'Сообщите мне о своих ограничениях — подберу подходящие блюда',
	},
	{
		title: 'Специальные предложения',
		description:
			'Не пропускайте акции и скидки, которые мы регулярно обновляем',
	},
]

export const ChatIntroduction: React.FC = () => {
	const greeting = useMemo(() => {
		const index = Math.floor(Math.random() * greetingsPool.length)
		return greetingsPool[index]
	}, [])

	return (
		<div className='w-full  mx-auto flex max-w-3xl flex-col gap-6 px-5 pt-6'>
			<div className='w-full my-auto grid gap-8 justify-center'>
				<div>
					<p className='text-[17px] text-[#323232] dark:text-[#f9f9f9] max-w-[400px]'>
						{greeting}
					</p>
				</div>

				<div className='flex flex-col w-full max-w-[400px]'>
					{tipsPool.map(({ title, description }, idx) => (
						<div
							key={idx}
							className='flex flex-col mb-6 rounded-xl bg-gray-200 dark:bg-[#2f2f2f] p-4 shadow-md'
						>
							<strong className='mb-1 text-[17px] text-gray-700 dark:text-gray-200'>
								{title}
							</strong>
							<span className='text-[15px] text-gray-600 dark:text-gray-300'>
								{description}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
