import { useLayoutEffect, useRef } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import ChatContent from '../components/chat/ChatContent'
import ChatInput from '../components/chat/ChatInput'
import Header from '../components/Header'
import { PreferencesModal } from '../components/PreferencesModal'
import { useGeneration } from '../context/GenerationContext'
import { useHistory } from '../context/HistoryContext'
import { ScrollArea } from '@/components/ui/scroll-area'

const Chat = () => {
	const chatViewportRef = useRef<HTMLDivElement | null>(null)
	const { messages, addUserMessage } = useHistory()
	const { isWaitingForGeneration, isGenerating, startGeneration } =
		useGeneration()

	useLayoutEffect(() => {
		scrollToBottom()
	}, [messages])

	const scrollToBottom = () => {
		if (chatViewportRef.current) {
			requestAnimationFrame(() => {
				if (chatViewportRef.current) {
					chatViewportRef.current.scrollTop =
						chatViewportRef.current.scrollHeight
				}
			})
		}
	}

	const handleSendMessage = async (input: string) => {
		if (!input.trim() || isGenerating || isWaitingForGeneration) return
		addUserMessage(input)
		await startGeneration(input)
	}

	return (
		<div className='h-dvh w-screen flex flex-col items-center bg-background'>
			<Header />
			<PreferencesModal />

			{/* Chat Scroll Area */}
			<ScrollArea className='h-full w-full overflow-y-auto'>
				<div
					ref={chatViewportRef}
					className='w-full h-full flex justify-center px-4 py-4'
				>
					<div className='h-full w-full max-w-3xl max-sm:max-w-[95%]'>
						<ChatContent />
					</div>
				</div>
			</ScrollArea>

			{/* Input */}
			<div
				className='flex mx-auto mb-8 w-full'
				style={{ maxWidth: 'min(95%, 48rem)' }}
			>
				<ChatInput onSubmit={handleSendMessage} />
			</div>
		</div>
	)
}

export default Chat
