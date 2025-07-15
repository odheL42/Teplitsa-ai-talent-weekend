import { v4 as uuidv4 } from 'uuid'
import { type ClientChatMessage } from '../../types/chat'

interface ChatMessageProps {
	dbmessage: ClientChatMessage
}

const UserMessage = ({ dbmessage }: ChatMessageProps) => {
	return (
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
	)
}

export default UserMessage
