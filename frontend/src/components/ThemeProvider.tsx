import type { ThemeProviderProps } from 'next-themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='dark'
			enableSystem
			{...props}
		>
			{children}
		</NextThemesProvider>
	)
}
