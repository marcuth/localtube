"use server"

import ytdl from "@distube/ytdl-core"

export async function getVideoInfo(url: string) {
    try {
        if (!ytdl.validateURL(url)) {
            throw new Error("URL inválida do YouTube")
        }

        const info = await ytdl.getInfo(url)
        const videoDetails = info.videoDetails

        const formats = info.formats
            .filter((format) => format.hasAudio || format.hasVideo)
            .map((format) => ({
                itag: format.itag,
                quality: format.qualityLabel || format.audioBitrate + "kbps" || "unknown",
                container: format.container,
                hasVideo: format.hasVideo,
                hasAudio: format.hasAudio,
                filesize: format.contentLength ? Number.parseInt(format.contentLength) : undefined,
            }))
            .reduce((acc, curr) => {
                const exists = acc.find(
                    (f: VideoFormat) =>
                        f.quality === curr.quality &&
                        f.container === curr.container &&
                        f.hasAudio === curr.hasAudio &&
                        f.hasVideo === curr.hasVideo,
                )
                if (!exists) acc.push(curr)
                return acc
            }, [] as VideoFormat[])
            .sort((a, b) => {
                if (a.hasVideo && b.hasVideo) {
                    const aQuality = Number.parseInt(a.quality.replace("p", "")) || 0
                    const bQuality = Number.parseInt(b.quality.replace("p", "")) || 0
                    return bQuality - aQuality
                }

                if (!a.hasVideo && !b.hasVideo) {
                    const aBitrate = Number.parseInt(a.quality.replace("kbps", "")) || 0
                    const bBitrate = Number.parseInt(b.quality.replace("kbps", "")) || 0
                    return bBitrate - aBitrate
                }

                return a.hasVideo ? -1 : 1
            })

        return {
            title: videoDetails.title,
            author: videoDetails.author.name,
            lengthSeconds: videoDetails.lengthSeconds,
            viewCount: videoDetails.viewCount,
            thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
            formats,
        }
    } catch (error) {
        console.error("Erro ao obter informações do vídeo:", error)
        throw new Error("Não foi possível obter as informações do vídeo")
    }
}

export async function downloadVideo(url: string, itag: number) {
    try {
        if (!ytdl.validateURL(url)) {
            throw new Error("URL inválida do YouTube")
        }

        const stream = ytdl(url, {
            quality: itag,
            requestOptions: {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
            },
        })

        const chunks: Buffer[] = []

        return new Promise<Buffer>((resolve, reject) => {
            stream.on("data", (chunk) => {
                chunks.push(chunk)
            })

            stream.on("end", () => {
                resolve(Buffer.concat(chunks))
            })

            stream.on("error", (error) => {
                console.error("Erro no stream:", error)
                reject(new Error("Erro ao baixar o vídeo"))
            })
        })
    } catch (error) {
        console.error("Erro ao baixar vídeo:", error)
        throw new Error("Não foi possível baixar o vídeo")
    }
}

export type VideoFormat = {
    itag: number
    quality:
        | "144p"
        | "144p 15fps"
        | "144p60 HDR"
        | "240p"
        | "240p60 HDR"
        | "270p"
        | "360p"
        | "360p60 HDR"
        | "480p"
        | "480p60 HDR"
        | "720p"
        | "720p60"
        | "720p60 HDR"
        | "1080p"
        | "1080p60"
        | "1080p60 HDR"
        | "1440p"
        | "1440p60"
        | "1440p60 HDR"
        | "2160p"
        | "2160p60"
        | "2160p60 HDR"
        | "4320p"
        | "4320p60"
    container: "flv" | "3gp" | "mp4" | "webm" | "ts"
    hasVideo: boolean
    hasAudio: boolean
    filesize: number | undefined
}

export type VideoInfo = {
    title: string
    author: string
    lengthSeconds: string
    viewCount: string
    thumbnail: string
    formats: VideoFormat[]
}
