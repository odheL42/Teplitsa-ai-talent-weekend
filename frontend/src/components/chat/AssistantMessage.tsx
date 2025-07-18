import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { v4 as uuidv4 } from 'uuid'
import { useMenu } from '../../context/MenuContext'
import { type ClientChatMessage } from '../../types/chat'
import { extractDishIdsFromMessage } from '../../utils/menu'
import DishCard from './DishCard'

interface ChatMessageProps {
	dbmessage: ClientChatMessage
}

const AssistantMessage = ({ dbmessage }: ChatMessageProps) => {
	const { dishById } = useMenu()

	const { cleanedMessage, dishIds } = extractDishIdsFromMessage(
		String(dbmessage.message.content),
	)
	console.log('DISHES', dishIds)

	return (
		<div
			className='flex flex-col items-start justify-start max-w-[95%]'
			data-message-id={uuidv4()}
			data-message-role='assistant'
			role='presentation'
		>
			<div className='w-full text-gray-800 dark:text-gray-200 break-words font-sans'>
				<div className='prose prose-p:leading-relaxed prose-p:text-[17px] dark:prose-invert prose-pre:bg-[#141414] prose-headings:font-semibold'>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{cleanedMessage}
					</ReactMarkdown>
				</div>
			</div>

			{dishIds.length > 0 && (
				<div className='flex-col w-full mt-8'>
					{dishIds.map(id => {
						const dish = dishById?.[id]
						if (!dish) return null
						return <DishCard key={id} dish={dish} />
					})}
				</div>
			)}
		</div>
	)
}

export default AssistantMessage
