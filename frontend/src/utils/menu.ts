import type { DBDish, DishByIdMap, MenuStructure } from '../types/menu'

export function toMenuData(dishes: DBDish[]): {
	menuStructure: MenuStructure
	dishById: DishByIdMap
} {
	const menuStructure = {} as MenuStructure
	const dishById: DishByIdMap = {}

	for (const dish of dishes) {
		const { index, context, category } = dish

		// Add dish to map
		dishById[index] = dish

		// Initialize context if needed
		if (!menuStructure[context]) {
			menuStructure[context] = {}
		}

		// Initialize category if needed
		if (!menuStructure[context][category]) {
			menuStructure[context][category] = []
		}

		menuStructure[context][category]!.push(dish)
	}

	return { menuStructure, dishById }
}

export function extractDishIdsFromMessage(message: string): {
	cleanedMessage: string
	dishIds: string[]
} {
	const dishIds: string[] = []
	const cleanedMessage = message.replace(/<R>(.*?)<\/R>/g, (_, id) => {
		dishIds.push(id)
		return ''
	})

	return {
		cleanedMessage: cleanedMessage.trim(),
		dishIds,
	}
}
