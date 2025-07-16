import { v4 as uuidv4 } from 'uuid'
import { type ClientChatMessage } from '../../types/chat'

interface ChatMessageProps {
	dbmessage: ClientChatMessage
}

const UserMessage = ({ dbmessage }: ChatMessageProps) => {
	return (
		<div
			className='ml-auto max-w-[80%] w-fit rounded-2xl bg-[#e5e5ea] dark:bg-[#2f2f2f]
	px-5 py-3.5 text-[16px] leading-relaxed text-gray-800 dark:text-gray-200
	break-words whitespace-pre-wrap font-sans shadow-sm'
			data-message-id={uuidv4()}
			data-message-type='user'
			role='presentation'
		>
			{dbmessage.message.content.trim()}
		</div>
	)
}

export default UserMessage
