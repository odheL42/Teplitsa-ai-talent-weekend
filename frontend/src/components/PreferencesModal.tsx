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
			</div>
		</div>
	)
}
