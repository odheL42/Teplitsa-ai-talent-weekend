import { SlidersVertical } from 'lucide-react'
import { useModal } from '../context/ModalContext'

export const PreferencesButton = () => {
	const { open } = useModal()

	return (
		<button onClick={open} aria-label='Открыть настройки предпочтений'>
			<SlidersVertical className=' h-6 w-6 transition-transform hover:scale-110 active:scale-95 disabled:opacity-60 hover:cursor-pointer' />
		</button>
	)
}
