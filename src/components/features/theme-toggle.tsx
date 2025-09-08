"use client"

import { LuMoon, LuSun } from "react-icons/lu"
import { useTheme } from "next-themes"

import { FC } from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const ThemeToggle: FC = () => {
    const { theme, setTheme } = useTheme()
    console.log("Tema atual:", theme)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <LuSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <LuMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeToggle
