import { useMemo } from 'react'
import { useModal } from '../../context/ModalContext'
import { useMenuMode } from '../../context/MenuModeContext' // путь поправь под свой проект
import { Switch } from '@headlessui/react'

const greetingsPool = [
	'Привет! Я — чат-ассистент кафе Теплица. Помогу сделать заказ быстро и просто.',
	'Добро пожаловать в кафе Теплица! Здесь вы легко выберете и закажете любимые блюда.',
	'Здравствуйте! Это прототип для AI Talent Weekend — задавайте вопросы про меню и делайте заказ.',
	'Рад видеть вас в кафе Теплица! Спрашивайте про блюда, рекомендации и заказы.',
]

const tipsPool = [
	{
		title: 'Аллергии и предпочтения',
		description:
			'Сообщите мне о своих ограничениях — подберу подходящие блюда',
	},
]

export const ChatIntroduction = () => {
	const { open } = useModal()
	const { isCatering, toggleIsCatering } = useMenuMode()

	const greeting = useMemo(() => {
		const index = Math.floor(Math.random() * greetingsPool.length)
		return greetingsPool[index]
	}, [])

	return (
		<div className='w-full mx-auto flex flex-col gap-3 px-2 pt-2'>
			<div className='w-full grid gap-2 justify-center'>
				<p className='w-full text-[16px] text-[#323232] dark:text-[#f9f9f9]'>
					{greeting}
				</p>

				<div className='w-full flex items-center gap-2 justify-between bg-gray-100 dark:bg-[#2f2f2f] px-4 py-2 rounded-md'>
					<span className='text-sm text-gray-800 dark:text-gray-200 w-full'>
						{isCatering
							? 'Режим: Кейтеринг'
							: 'Режим: Основное меню'}
					</span>
					<Switch
						checked={isCatering}
						onChange={toggleIsCatering}
						className={`${
							isCatering ? 'bg-green-600' : 'bg-gray-400'
						} relative inline-flex h-6 w-11 items-center rounded-full transition hover:cursor-pointer`}
					>
						<span
							className={`${
								isCatering ? 'translate-x-5' : 'translate-x-1'
							} inline-block h-4 w-4 transform rounded-full bg-white transition`}
						/>
					</Switch>
				</div>

				<div className='flex flex-col w-full'>
					{tipsPool.map(({ title, description }, idx) => (
						<button
							key={idx}
							onClick={open}
							aria-label='Открыть настройки предпочтений'
							className='flex flex-col mb-2 rounded-lg bg-gray-200 dark:bg-[#2f2f2f] p-3 shadow-sm hover:shadow-md transition-shadow text-left'
						>
							<strong className='text-[16px] text-gray-700 dark:text-gray-200'>
								{title}
							</strong>
							<span className='text-[14px] text-gray-600 dark:text-gray-300'>
								{description}
							</span>
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
