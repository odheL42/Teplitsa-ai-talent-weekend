import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

import { DishByIdMap, MenuStructure } from '../types/menu'

import { apiGetMenu } from '../api/api'

import { toMenuData } from '../utils/menu'

type MenuContextValue = {
	menuStructure: MenuStructure | null
	dishById: DishByIdMap | null
	loading: boolean
}

const MenuContext = createContext<MenuContextValue | null>(null)

export function MenuProvider({ children }: { children: ReactNode }) {
	const [menuStructure, setMenuStructure] = useState<MenuStructure | null>(
		null,
	)
	const [dishById, setDishById] = useState<DishByIdMap | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchMenu() {
			const rawMenu = await apiGetMenu()
			console.log('MENU', rawMenu)
			const { menuStructure, dishById } = toMenuData(rawMenu)
			setMenuStructure(menuStructure)
			setDishById(dishById)
			setLoading(false)
		}

		fetchMenu()
	}, [])

	return (
		<MenuContext.Provider value={{ menuStructure, dishById, loading }}>
			{children}
		</MenuContext.Provider>
	)
}

export const useMenu = () => {
	const ctx = useContext(MenuContext)
	if (!ctx) throw new Error('useMenu must be used within <MenuProvider>')
	return ctx
}
