import { useModal } from '../context/ModalContext'
import { usePreferences } from '../context/PreferencesContext'
import type { Preferences } from '../types/preferences'
import IntroductionChip from './chat/IntroductionChip'

export const PreferencesModal = () => {
	const { isOpen, close } = useModal()
	const { preferences, togglePreference } = usePreferences()

	if (!isOpen) return null

	return (
		<div
			onClick={close}
			className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
		>
			<div
				onClick={e => e.stopPropagation()}
				className='bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-lg'
			>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
						Предпочтения
					</h2>
					<button
						aria-label='Закрыть'
						onClick={close}
						className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
					>
						&#10005;
					</button>
				</div>

				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
					{(Object.keys(preferences) as (keyof Preferences)[]).map(
						key => (
							<IntroductionChip
								text={key}
								initialSelected={preferences[key]}
								onToggle={() => togglePreference(key)}
							/>
						)
					)}
				</div>
			</div>
		</div>
	)
}
