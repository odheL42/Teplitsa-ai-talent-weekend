import { useEffect, useState } from 'react'
import { apiGetNotes, apiSaveNotes } from '../api/api'
import { useMenuMode } from '../context/MenuModeContext'
import { useModal } from '../context/ModalContext'
import { usePreferences } from '../context/PreferencesContext'
import type { RequestNotes } from '../types/notes'
import type { Preferences } from '../types/preferences'
import IntroductionChip from './chat/IntroductionChip'

export const PreferencesModal = () => {
	const { isOpen, close } = useModal()
	const { preferences, togglePreference } = usePreferences()
	const { isCatering } = useMenuMode()
	const [notes, setNotes] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [, setSaving] = useState<boolean>(false)

	useEffect(() => {
		if (!isOpen) return
		setLoading(true)
		apiGetNotes(isCatering)
			.then(data => {
				setNotes(data)
			})
			.finally(() => setLoading(false))
	}, [isOpen])

	const handleNotesChange = async (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		const value = e.target.value
		setNotes(value)
		setSaving(true)
		const request: RequestNotes = { notes: value, isCatering: isCatering }

		try {
			await apiSaveNotes(request)
		} finally {
			setSaving(false)
		}
	}

	if (!isOpen) return null

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 50,
			}}
			onClick={close}
		>
			<div
				style={{
					backgroundColor: '#2f2f2f',
					padding: '1.5rem',
					borderRadius: '0.5rem',
					width: '100%',
					maxWidth: '30rem',
					maxHeight: '80vh',
					overflowY: 'auto',
					boxShadow:
						'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
					position: 'relative',
				}}
				onClick={e => e.stopPropagation()}
			>
				<button
					style={{
						position: 'absolute',
						top: '0.75rem',
						right: '1rem',
						color: '#FFFFFF',
						fontSize: '1.25rem',
						cursor: 'pointer',
					}}
					onClick={close}
					aria-label='Закрыть'
				>
					×
				</button>
				<h2
					style={{
						fontSize: '1.25rem',
						fontWeight: '600',
						marginBottom: '1rem',
						color: '#FFFFFF',
					}}
				>
					Предпочтения
				</h2>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns:
							'repeat(auto-fill, minmax(100px, 1fr))',
						gap: '0.5rem',
						marginBottom: '1rem',
					}}
				>
					{(Object.keys(preferences) as (keyof Preferences)[]).map(
						key => (
							<IntroductionChip
								key={key}
								text={key}
								initialSelected={preferences[key]}
								onToggle={() => togglePreference(key)}
							/>
						),
					)}
				</div>
				<div>
					<label
						htmlFor='notes'
						style={{
							color: '#fff',
							display: 'block',
							marginBottom: '0.5rem',
						}}
					>
						Заметки
					</label>
					<textarea
						id='notes'
						value={notes}
						onChange={handleNotesChange}
						style={{
							width: '100%',
							minHeight: '200px',
							backgroundColor: '#1f1f1f',
							color: '#fff',
							border: '1px solid #444',
							borderRadius: '4px',
							padding: '0.5rem',
							resize: 'vertical',
						}}
						placeholder='Например, "Я люблю острые блюда и не ем мясо..."'
					/>
					{loading && (
						<p style={{ color: '#aaa' }}>Загрузка заметок...</p>
					)}
				</div>
			</div>
		</div>
	)
}
