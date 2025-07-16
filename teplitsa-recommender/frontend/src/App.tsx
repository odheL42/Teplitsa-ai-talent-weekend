import React from 'react'
import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Cart from './components/Cart'
import { CartProvider } from './context/CartContext'
import { GenerationProvider } from './context/GenerationContext'
import { HistoryProvider, useHistory } from './context/HistoryContext'
import { MenuProvider } from './context/MenuContext'
import Chat from './pages/Chat'

const Layout = () => {
	return (
		<div className='flex flex-col h-full w-full'>
			<ToastContainer position='top-right' autoClose={3000} />

			<header>
				<Cart />
			</header>
			<main className='flex-1 overflow-auto'>
				<Outlet /> {}
			</main>
		</div>
	)
}

const GenerationWithHistory = ({ children }: { children: React.ReactNode }) => {
	const { updateAssistantMessage } = useHistory()

	return (
		<GenerationProvider onData={updateAssistantMessage}>
			{children}
		</GenerationProvider>
	)
}

const App = () => {
	return (
		<React.StrictMode>
			<MenuProvider>
				<CartProvider>
					<HistoryProvider>
						<GenerationWithHistory>
							<Router>
								<Routes>
									<Route path='/' element={<Layout />}>
										<Route index element={<Chat />} />
										<Route path='chat' element={<Chat />} />
									</Route>
								</Routes>
							</Router>
						</GenerationWithHistory>
					</HistoryProvider>
				</CartProvider>
			</MenuProvider>
		</React.StrictMode>
	)
}

export default App
