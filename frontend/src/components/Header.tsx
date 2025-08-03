import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useMenu } from '../context/MenuContext'
import Cart from './Cart'
import CartModal from './CartModal'
import ClearHistoryButton from './ClearHistoryButton'

export default function Header() {
	const { items } = useCart()
	const { dishById } = useMenu()
	const [isOpen, setIsOpen] = useState(false)
	const [highlight, setHighlight] = useState(false)

	useEffect(() => {
		if (Object.keys(items).length === 0) return
		setHighlight(true)
		const timeout = setTimeout(() => setHighlight(false), 300)
		return () => clearTimeout(timeout)
	}, [items])

	const totalAmount = useMemo(() => {
		return Object.entries(items).reduce((sum, [id, amount]) => {
			const dish = dishById?.[id]
			if (!dish) return sum
			return sum + dish.price * amount
		}, 0)
	}, [items, dishById])

	const formattedAmount = useMemo(() => {
		return totalAmount.toLocaleString('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			maximumFractionDigits: 0,
		})
	}, [totalAmount])

	return (
		<header className='w-full max-w-3xl rounded-b-2xl bg-muted px-4 shadow-sm flex flex-row justify-between items-center py-2'>
			{/* Левая кнопка */}
			<ClearHistoryButton />

			<div className='flex flex-col items-center select-none'>
				<h2 className='text-xl font-extrabold text-foreground'>
					Экокафе «Теплица»
				</h2>
				<p className='mt-0.5 text-xs font-normal tracking-wide text-green-500'>
					AI Talent Weekend by «513»
				</p>
			</div>

			<Cart />
			{Object.keys(items).length > 0 && (
				<Button
					variant='ghost'
					size='icon'
					onClick={() => setIsOpen(true)}
					className={cn(
						'mt-1 text-xs font-semibold hover:cursor-pointer',
						highlight && 'animate-[ping_0.3s]'
					)}
				>
					{formattedAmount}
				</Button>
			)}

			{isOpen && <CartModal onClose={() => setIsOpen(false)} />}
		</header>
	)
}
