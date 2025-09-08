import { ThemeProvider } from "next-themes"
import { FC, ReactNode } from "react"

type Props = {
    children: ReactNode
}

const Providers: FC<Props> = async ({ children }) => {
    return (
        <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system" themes={["light", "dark"]}>
            <main className="w-full py-6 px-4 min-h-screen">{children}</main>
        </ThemeProvider>
    )
}

export default Providers
