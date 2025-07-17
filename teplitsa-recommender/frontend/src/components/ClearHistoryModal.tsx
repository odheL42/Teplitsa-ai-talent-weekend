import React from 'react'

type ClearHistoryModalProps = {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => Promise<void>
	loading: boolean
	error: string | null
}

const ClearHistoryModal: React.FC<ClearHistoryModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
	error,
}) => {
	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			onClick={onClose}
		>
			<div
				className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg'
				onClick={e => e.stopPropagation()}
			>
				<h2 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
					Подтверждение
				</h2>
				<p className='mb-6 text-gray-700 dark:text-gray-300'>
					Вы действительно хотите очистить историю чата?
				</p>
				{error && <p className='mb-4 text-sm text-red-500'>{error}</p>}
				<div className='flex justify-end gap-3'>
					<button
						onClick={onClose}
						disabled={loading}
						className='px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 transition hover:cursor-pointer'
					>
						Отмена
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className='px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 hover:cursor-pointer'
					>
						Очистить
					</button>
				</div>
			</div>
		</div>
	)
}

export default ClearHistoryModal
