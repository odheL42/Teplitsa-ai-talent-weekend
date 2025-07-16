import React, { useRef, useState } from 'react'
import { IoArrowUpCircleOutline } from 'react-icons/io5'
import { useGeneration } from '../../context/GenerationContext'

type ChatInputProps = {
	onSubmit: (input: string) => void
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit }) => {
	const [message, setMessage] = useState('')
	const { isWaitingForGeneration, isGenerating } = useGeneration()
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleSubmit = (e: React.KeyboardEvent | React.MouseEvent) => {
		e.preventDefault()
		if (!message.trim() || isWaitingForGeneration || isGenerating) return
		setMessage('')
		onSubmit(message)
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)

		const textarea = textareaRef.current
		if (textarea) {
			textarea.style.height = 'auto'
			textarea.style.height = `${Math.min(
				textarea.scrollHeight,
				6 * 24
			)}px`
		}
	}

	const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			handleSubmit(event)
		}
	}

	return (
		<div className='relative flex h-full w-full items-center rounded-3xl bg-[#f1f1f1] dark:bg-[#2f2f2f] text-[#5b5b5b] dark:text-gray-300'>
			<div className='flex w-full flex-1 rounded-xl border-none bg-transparent py-5'>
				<div className='flex min-h-full w-full flex-col'>
					<textarea
						ref={textareaRef}
						autoFocus
						value={message}
						rows={3}
						style={{ lineHeight: '24px' }}
						className='max-h-[6lh] w-full resize-none overflow-y-auto overflow-x-hidden border-0 bg-transparent px-6 outline-none focus:ring-0 focus-visible:ring-0 text-[18px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent dark:scrollbar-thumb-gray-600'
						onChange={handleChange}
						onKeyDown={handleKeydown}
						placeholder='Спросите что-нибудь...'
					></textarea>
				</div>
			</div>
			<div className='self-end mb-4 mx-4'>
				<button
					disabled={
						isWaitingForGeneration ||
						isGenerating ||
						!message.trim()
					}
					onClick={handleSubmit}
					className='transition-transform hover:scale-105 active:scale-95 disabled:opacity-50'
				>
					<IoArrowUpCircleOutline size={40} />
				</button>
			</div>
		</div>
	)
}

export default ChatInput
