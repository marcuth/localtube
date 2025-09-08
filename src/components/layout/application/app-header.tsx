import { FC } from "react"

import ThemeToggle from "@/components/features/theme-toggle"

const AppHeader: FC = () => {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">
                        <span className="text-zinc-500">Local</span>
                        <span>Tube</span>
                    </h1>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}

export default AppHeader
