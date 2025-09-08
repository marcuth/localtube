"use client"

import {
    LuClock,
    LuDownload,
    LuEye,
    LuLink,
    LuLoader,
    LuMusic,
    LuSend,
    LuVideo,
    LuVolume2,
    LuVolumeX,
} from "react-icons/lu"
import { FC, useState } from "react"

import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { getVideoInfo, downloadVideo, VideoInfo } from "@/app/actions/youtube"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"

const HomePage: FC = () => {
    const [url, setUrl] = useState("")
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState<number | null>(null)

    const handleGetInfo = async () => {
        if (!url.trim()) {
            toast.error("Por favor, insira uma URL válida do YouTube")
            return
        }

        setLoading(true)
        setVideoInfo(null)

        try {
            const info = await getVideoInfo(url)
            setVideoInfo(info)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao obter informações do vídeo. Verifique se a URL está correta.")
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async (itag: number, format: any) => {
        setDownloading(itag)

        try {
            const response = await downloadVideo(url, itag)

            const blob = new Blob([new Uint8Array(response)], {
                type: format.container === "mp4" ? "video/mp4" : "audio/mpeg",
            })

            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = downloadUrl

            const extension = format.hasVideo ? "mp4" : "mp3"
            const filename = `${videoInfo?.title?.replace(/[^a-zA-Z0-9]/g, "_") || "video"}.${extension}`
            link.download = filename

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao baixar o arquivo. Tente novamente.")
        } finally {
            setDownloading(null)
        }
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "N/A"
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
    }

    const formatDuration = (seconds: string) => {
        const mins = Math.floor(Number.parseInt(seconds) / 60)
        const secs = Number.parseInt(seconds) % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const formatViewCount = (count: string) => {
        const num = Number.parseInt(count)
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M"
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K"
        }
        return num.toString()
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 pb-6">
            <Card className="space-y-6">
                <CardHeader>
                    <h1 className="text-4xl font-bold text-balance mb-4 text-center w-full">
                        <span className="text-red-600 dark:text-red-500">Local</span>
                        <span className="text-foreground">Tube</span>
                    </h1>
                    <p className="text-xs text-foreground text-center">
                        Baixe vídeos, áudios e músicas do YouTube de graça usando um serviço local.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex gap-1 items-center text-sm">
                            <LuLink />
                            <p>Cole ou digite sua URL</p>
                        </div>
                        <div className="flex">
                            <Input
                                className="rounded-r-none"
                                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGetInfo()}
                                disabled={loading}
                            />
                            <Button
                                className="rounded-l-none"
                                variant="secondary"
                                type="submit"
                                onClick={handleGetInfo}
                                disabled={loading}
                            >
                                {loading ? <LuLoader className="h-4 w-4 animate-spin" /> : <LuSend />}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {videoInfo && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-balance">{videoInfo.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                            <span>{videoInfo.author}</span>
                            <span className="flex items-center gap-1">
                                <LuClock className="h-4 w-4" />
                                {formatDuration(videoInfo.lengthSeconds)}
                            </span>
                            <span className="flex items-center gap-1">
                                <LuEye className="h-4 w-4" />
                                {formatViewCount(videoInfo.viewCount)} visualizações
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <img
                            src={videoInfo.thumbnail || "/placeholder.svg"}
                            alt={videoInfo.title}
                            className="rounded-lg"
                        />
                        <h3 className="font-semibold mb-2">Formatos Disponíveis</h3>
                        <div className="grid grid-cols-2 max-xl:grid-cols-1 gap-4">
                            <div className="max-h-[400px] overflow-y-auto px-2">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                    <LuVideo className="h-4 w-4" />
                                    Vídeo (MP4)
                                </h4>
                                <div className="grid gap-2">
                                    {videoInfo.formats
                                        .filter((format) => format.hasVideo)
                                        .map((format) => (
                                            <div
                                                key={format.itag}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="secondary">{format.quality}</Badge>
                                                    <Badge variant={format.hasAudio ? "default" : "secondary"}>
                                                        {format.hasAudio ? (
                                                            <LuVolume2 title="Com áudio" />
                                                        ) : (
                                                            <LuVolumeX title="Sem áudio" />
                                                        )}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {formatFileSize(format.filesize)}
                                                    </span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleDownload(format.itag, format)}
                                                    disabled={downloading === format.itag}
                                                >
                                                    {downloading === format.itag ? (
                                                        <LuLoader className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <LuDownload className="h-4 w-4 mr-2" />
                                                            Baixar
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto px-2">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                    <LuMusic className="h-4 w-4" />
                                    Áudio (MP3)
                                </h4>
                                <div className="grid gap-2">
                                    {videoInfo.formats
                                        .filter((format) => format.hasAudio && !format.hasVideo)
                                        .map((format) => (
                                            <div
                                                key={format.itag}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline">{format.quality}</Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {formatFileSize(format.filesize)}
                                                    </span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDownload(format.itag, format)}
                                                    disabled={downloading === format.itag}
                                                >
                                                    {downloading === format.itag ? (
                                                        <LuLoader className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <LuDownload className="h-4 w-4 mr-2" />
                                                            Baixar
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default HomePage
