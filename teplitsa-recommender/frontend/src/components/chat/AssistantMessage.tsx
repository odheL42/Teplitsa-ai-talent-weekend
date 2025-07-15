import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { v4 as uuidv4 } from 'uuid'
import { ClientDish, type ClientChatMessage } from '../../types/chat'

interface ChatMessageProps {
	dbmessage: ClientChatMessage
}

const AssistantMessage = ({ dbmessage }: ChatMessageProps) => {
	const [dishes, setDishes] = useState<ClientDish[] | null>(null)
	const parse_dish_ids = (m: ClientChatMessage) => {
		if (m.message.role == 'user') return true
		return false
	}

	return (
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
	)
}

export default AssistantMessage
