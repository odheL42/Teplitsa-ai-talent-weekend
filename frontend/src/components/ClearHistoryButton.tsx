import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { apiClearHistory } from '../api/api'
import { useHistory } from '../context/HistoryContext'
import ClearHistoryModal from './ClearHistoryModal'

const ClearHistoryButton: React.FC = () => {
	const { clearHistory } = useHistory()
	const [isModalOpen, setModalOpen] = useState(false)
	const [isLoading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const openModal = () => {
		setError(null)
		setModalOpen(true)
	}

	const closeModal = () => {
		if (!isLoading) {
			setModalOpen(false)
		}
	}

	const handleConfirm = async () => {
		setLoading(true)
		setError(null)
		try {
			await apiClearHistory()
			clearHistory()
			setModalOpen(false)
		} catch (e) {
			setError('Ошибка при очистке истории. Попробуйте ещё раз.')
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<button
				className='dark:text-neutral-400 text-gray-900 hover:text-red-500 transition transform hover:scale-110 active:scale-95 cursor-pointer'
				aria-label='Удалить чат'
				onClick={openModal}
			>
				<Trash2 className='w-6 h-6' />
			</button>

			<ClearHistoryModal
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={handleConfirm}
				loading={isLoading}
				error={error}
			/>
		</>
	)
}

export default ClearHistoryButton
