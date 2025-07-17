import { useLayoutEffect, useRef } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import ChatContent from '../components/chat/ChatContent'
import ChatInput from '../components/chat/ChatInput'
import { useGeneration } from '../context/GenerationContext'
import { useHistory } from '../context/HistoryContext'
import Header from '../components/Header'
import { PreferencesModal } from '../components/PreferencesModal'

const Chat = () => {
	const chatContainerRef = useRef<HTMLDivElement | null>(null)
	const { messages, addUserMessage } = useHistory()
	const { isWaitingForGeneration, isGenerating, startGeneration } =
		useGeneration()

	useLayoutEffect(() => {
		scrollToBottom()
	}, [messages])

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

	const handleSendMessage = async (input: string) => {
		if (!input.trim() || isGenerating || isWaitingForGeneration) return
		addUserMessage(input)

		await startGeneration(input)
	}

	return (
		<div className='h-dvh flex-1 w-full flex flex-col justify-center items-center'>
            <Header />
            <PreferencesModal />
			<div
				ref={chatContainerRef}
				className='flex-1 overflow-y-scroll flex justify-center w-full'
			>
				<div className='w-full max-w-3xl max-sm:max-w-[95%]'>
					<ChatContent />
				</div>
			</div>

			<div className='flex mx-auto mb-8 w-full' style={{ maxWidth: 'min(95%, 48rem)' }}>
				<ChatInput onSubmit={handleSendMessage} />
			</div>
		</div>
	)
}

export default Chat
