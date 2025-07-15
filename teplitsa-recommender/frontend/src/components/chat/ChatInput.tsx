import React, { useState } from 'react'

type ChatInputProps = {
	disabled: boolean
	onSubmit: () => void
	onChange: (message: string) => void
}

const ChatInput: React.FC<ChatInputProps> = ({ disabled, onSubmit, onChange }) => {
   	const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setMessage('')
		onSubmit()
	}

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)
		onChange(e.target.value)
	}

    const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey && message.trim() !== '') {
			handleSubmit(event)
		}
	}

	return (
		<div className='w-full max-w-5xl'>
			<form
				aria-label={undefined}
				onSubmit={handleSubmit}
				className='relative flex w-full items-center rounded-3xl bg-[#f1f1f1] dark:bg-[#2f2f2f] text-[#5b5b5b] dark:text-gray-300'
			>
				<div className='flex w-full flex-1 rounded-xl border-none bg-transparent'>
				<div className='flex min-h-full w-full flex-col'> 
					<textarea
					autoFocus
					disabled={disabled}
					value={message}
					rows={2}
					className='max-h-[4lh] w-full resize-none overflow-y-auto overflow-x-hidden border-0 bg-transparent px-6 py-5 outline-none focus:ring-0 focus-visible:ring-0 text-[18px]'
					onChange={handleChange}
					onKeyDown={handleKeydown}
					placeholder='Спросите что-нибудь...'
					></textarea>
				</div>
				</div>
			</form>
		</div>
	)
}

export default ChatInput
