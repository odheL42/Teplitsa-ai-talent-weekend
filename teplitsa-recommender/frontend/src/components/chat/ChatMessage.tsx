import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { v4 as uuidv4 } from 'uuid'
import { type ClientChatMessage } from '../../types/chat'

interface ChatMessageProps {
	dbmessage: ClientChatMessage
}

const ChatMessage = ({ dbmessage }: ChatMessageProps) => {
	const is_user = (m: ClientChatMessage) => {
		if (m.message.role == 'user') return true
		return false
	}

	return (
		<>
			{is_user(dbmessage) ? (
				<div
					className='relative mx-auto mr-0 rounded-xl items-start justify-start dark:bg-[#2f2f2f] max-w-md mb-2 mt-20'
					data-message-id={uuidv4()}
					data-message-type='user'
					role='presentation'
				>
					<div className='flex w-full flex-col'>
						<div className='flex w-full flex-row flex-nowrap'>
							<div className='disabled w-full appearance-none whitespace-break-spaces text-wrap break-words bg-inherit px-5 py-3.5 text-gray-700 dark:text-gray-300 '>
								{dbmessage.message.content.trim()}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div
					className='relative flex items-start justify-start'
					data-message-id={uuidv4()}
					data-message-role='assistant'
					role='presentation'
				>
					<div className='relative min-w-[60px] break-words text-gray-600 prose-pre:my-2  dark:text-gray-300'>
						<div className='text-md prose max-w-none dark:prose-invert max-sm:prose-sm prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900'>
							<div className='markdown-container'>
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									children={String(dbmessage.message.content)}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default ChatMessage
