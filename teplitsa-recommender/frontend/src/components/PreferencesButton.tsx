import { useModal } from '../context/ModalContext'
import { SlidersVertical } from 'lucide-react'

export const PreferencesButton = () => {
	const { open } = useModal()

	return (
		<button onClick={open} aria-label='Открыть настройки предпочтений'>
			<SlidersVertical className='hover:bg-gray-200 dark:hover:bg-gray-700 h-6 w-6' />
		</button>
	)
}
