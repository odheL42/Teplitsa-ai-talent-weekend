import { createContext, ReactNode, useContext, useState } from 'react'
import { createStreamChatCompletions } from '../api/api'

interface GenerationContextValue {
	isGenerating: boolean
	isWaitingForGeneration: boolean
	startGeneration: (query: string) => Promise<void>
}

const GenerationContext = createContext<GenerationContextValue | null>(null)

export const GenerationProvider = ({
	children,
	onData,
	onDone,
	onError,
}: {
	children: ReactNode
	onData: (data: string) => void
	onDone?: () => void
	onError?: () => void
}) => {
	const [isGenerating, setIsGenerating] = useState(false)
	const [isWaitingForGeneration, setIsWaiting] = useState(false)

	const startGeneration = async (query: string) => {
		if (isGenerating || isWaitingForGeneration) return

		setIsWaiting(true)
		console.debug('INITIAL:WAITING', isWaitingForGeneration)
		console.debug('INITIAL:GENERATION', isGenerating)

		await createStreamChatCompletions(
			query,
			(data: string) => {
				if (isWaitingForGeneration) setIsWaiting(false)
				if (!isGenerating) setIsGenerating(true)
				console.debug('DATA:WAITING', isWaitingForGeneration)
				console.debug('DATA:GENERATION', isGenerating)
				onData(data)
			},
			() => {
				setIsGenerating(false)
				setIsWaiting(false)
				console.debug('DONE:WAITING', isWaitingForGeneration)
				console.debug('DONE:GENERATION', isGenerating)
				onDone?.()
			},
			() => {
				setIsGenerating(false)
				setIsWaiting(false)
				console.debug('ERROR:WAITING', isWaitingForGeneration)
				console.debug('ERROR:GENERATION', isGenerating)
				onError?.()
			}
		)
	}

	return (
		<GenerationContext.Provider
			value={{ isGenerating, isWaitingForGeneration, startGeneration }}
		>
			{children}
		</GenerationContext.Provider>
	)
}

export const useGeneration = () => {
	const ctx = useContext(GenerationContext)
	if (!ctx) {
		throw new Error(
			'useGeneration must be used within <GenerationProvider>'
		)
	}
	return ctx
}
