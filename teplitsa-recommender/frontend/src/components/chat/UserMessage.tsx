import { v4 as uuidv4 } from 'uuid'
import { type ClientChatMessage } from '../../types/chat'

interface ChatMessageProps {
	dbmessage: ClientChatMessage
}

const UserMessage = ({ dbmessage }: ChatMessageProps) => {
	return (
		<div
			className='ml-auto max-w-[70%] w-fit rounded-xl bg-[#e5e5ea] dark:bg-[#2f2f2f] px-5 py-3.5 text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap'
			data-message-id={uuidv4()}
			data-message-type='user'
			role='presentation'
		>
			{dbmessage.message.content.trim()}
		</div>
	)
}

export default UserMessage
