import { ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import CartModal from './CartModal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Cart: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [highlight, setHighlight] = useState(false)
	const { items } = useCart()

	useEffect(() => {
		if (Object.keys(items).length === 0) return
		setHighlight(true)
		const timeout = setTimeout(() => setHighlight(false), 300)
		return () => clearTimeout(timeout)
	}, [items])

	return (
		<div>
			<Button
				variant='ghost'
				size='icon'
				onClick={() => setIsOpen(true)}
				className={cn(
					'transition hover:text-primary text-muted-foreground hover:cursor-pointer ',
					highlight && 'animate-[ping_0.3s]'
				)}
				aria-label='Корзина'
			>
				<ShoppingCart className='size-5' />
			</Button>

			{isOpen && <CartModal onClose={() => setIsOpen(false)} />}
		</div>
	)
}

export default Cart
