import React from 'react'
import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { CartProvider } from './context/CartContext'
import { GenerationProvider } from './context/GenerationContext'
import { HistoryProvider, useHistory } from './context/HistoryContext'
import { MenuProvider } from './context/MenuContext'
import { MenuModeProvider } from './context/MenuModeContext'
import { ModalProvider } from './context/ModalContext'
import { PreferencesProvider } from './context/PreferencesContext'
import Chat from './pages/Chat'

const Layout = () => {
	return (
		<div className='h-dvh w-full'>
			<ToastContainer position='top-right' autoClose={2000} />
			<main>
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
						<PreferencesProvider>
							<MenuModeProvider>
								<GenerationWithHistory>
									<ModalProvider>
										<Router>
											<Routes>
												<Route
													path='/'
													element={<Layout />}
												>
													<Route
														index
														element={<Chat />}
													/>
													<Route
														path='chat'
														element={<Chat />}
													/>
												</Route>
											</Routes>
										</Router>
									</ModalProvider>
								</GenerationWithHistory>
							</MenuModeProvider>
						</PreferencesProvider>
					</HistoryProvider>
				</CartProvider>
			</MenuProvider>
		</React.StrictMode>
	)
}

export default App
