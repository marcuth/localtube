import { LuGithub } from "react-icons/lu"
import { FC } from "react"

const AppFooter: FC = () => {
    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Made with ❤️ by</span>
                        <a
                            href="https://github.com/marcuth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 font-medium text-foreground hover:text-primary transition-colors"
                        >
                            <LuGithub className="h-4 w-4" />
                            <span>Marcuth</span>
                        </a>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Licensed under <span className="font-medium">MIT License</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default AppFooter
