import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { createStreamChatCompletions, getHistory } from '../../api/api'
import { ClientChatMessage, DBChatMessage, Role } from '../../types/chat'
import IconLoading from '../icons/IconLoading'
import ChatInput from './ChatInput'
import { ChatIntroduction } from './ChatIntroduction'
import ChatMessage from './ChatMessage'

const Chat = () => {
	const chatContainerRef = useRef<HTMLDivElement | null>(null)
	const [messages, setMessages] = useState<ClientChatMessage[]>([])
	const [input, setInput] = useState<string>('')
	const [isLoading, setIsLoading] = useState(false)

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			requestAnimationFrame(() => {
				if (chatContainerRef.current) {
					chatContainerRef.current.scrollTop =
						chatContainerRef.current.scrollHeight
				}
			})
		}
	}

	useLayoutEffect(() => {
		scrollToBottom()
	}, [messages])

	const toClientMessages = async (m: DBChatMessage[]) => {
		return m.map(msg => ({
			id: msg.id ?? uuidv4(),
			message: msg.message,
		}))
	}

	useEffect(() => {
		const loadMessages = async () => {
			try {
				const history = await getHistory()
				setMessages(await toClientMessages(history))
			} catch (error) {
				console.error('Error loading chat messages', error)
			}
		}

		loadMessages()
	}, [])

	const onStart = () => {
		setMessages(prev => [...prev, makeMessage('', 'assistant')])
	}

	const updateMessage = (data: string) => {
		setMessages(prev => {
			const last = prev[prev.length - 1]
			const updated = {
				...last,
				message: {
					...last.message,
					content: last.message.content + data,
				},
			}
			return [...prev.slice(0, -1), updated]
		})
	}

	const onData = (data: string) => {
		setIsLoading(false)
		updateMessage(data)
	}

	const onDone = () => {
		setIsLoading(false)
	}

	const onError = () => {
		setIsLoading(false)
	}

	const makeMessage = (input: string, role: Role): ClientChatMessage => {
		return {
			id: uuidv4(),
			message: {
				role: role,
				content: input,
			},
		}
	}

	const handleSendMessage = async () => {
		setMessages(prev => [...prev, makeMessage(input, 'user')])
		setInput('')

		setIsLoading(true)

		await createStreamChatCompletions(
			input,
			onData,
			onStart,
			onDone,
			onError
		)
	}

	return (
		<div className='flex flex-col h-screen'>
			<div
				ref={chatContainerRef}
				className='flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-500
  dark:[&::-webkit-scrollbar-track]:bg-transparent
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'
			>
				<div className='mx-auto flex h-full max-w-3xl flex-col px-5 pt-6 xl:max-w-4xl xl:pt-10'>
					<div className='flex h-max flex-col pb-32'>
						{messages.length > 0 ? (
							<>
								{messages.map((msg, index) => (
									<ChatMessage key={msg.id} dbmessage={msg} />
								))}
								{isLoading && (
									<IconLoading classNames='loading inline ml-2 first:ml-0' />
								)}
							</>
						) : (
							<ChatIntroduction />
						)}
					</div>
				</div>
			</div>
			<div className='w-full flex-col items-center justify-center pb-8 px-4'>
				<ChatInput
					disabled={isLoading}
					onChange={setInput}
					onSubmit={() => {
						handleSendMessage()
					}}
				/>
			</div>
		</div>
	)
}

export default Chat
