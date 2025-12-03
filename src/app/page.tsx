'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Download, Youtube, Instagram, Music, Video, Image, FileAudio, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

interface DownloadResult {
  success: boolean
  data?: {
    title: string
    thumbnail?: string
    duration?: string
    author?: string
    formats?: Array<{
      quality: string
      size: string
      url: string
      type: string
    }>
  }
  error?: string
}

export default function DownloaderPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DownloadResult | null>(null)
  const [activeTab, setActiveTab] = useState('youtube')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)

  const detectPlatform = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com') || url.includes('m.youtube.com')) return 'youtube'
    if (url.includes('tiktok.com') || url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com') || url.includes('m.tiktok.com')) return 'tiktok'
    if (url.includes('instagram.com') || url.includes('instagr.am')) return 'instagram'
    return 'unknown'
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />
      case 'tiktok':
        return <Music className="h-5 w-5 text-pink-600" />
      case 'instagram':
        return <Instagram className="h-5 w-5 text-purple-600" />
      default:
        return <Video className="h-5 w-5" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'bg-red-50 border-red-200 text-red-700'
      case 'tiktok':
        return 'bg-pink-50 border-pink-200 text-pink-700'
      case 'instagram':
        return 'bg-purple-50 border-purple-200 text-purple-700'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error('Silakan masukkan URL video')
      return
    }

    const platform = detectPlatform(url)
    if (platform === 'unknown') {
      toast.error('URL tidak didukung. Gunakan URL dari YouTube, TikTok, atau Instagram')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/download/${platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        toast.success('Video berhasil diproses!')
      } else {
        setResult({ success: false, error: data.error || 'Terjadi kesalahan' })
        toast.error(data.error || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Download error:', error)
      setResult({ success: false, error: 'Gagal menghubungi server' })
      toast.error('Gagal menghubungi server')
    } finally {
      setLoading(false)
    }
  }

  const handleFileDownload = async (downloadUrl: string, filename: string) => {
    try {
      setDownloadingFile(filename)
      setDownloadProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 10
        })
      }, 300)

      // For demo purposes, we'll simulate the download
      // In a real implementation, you would fetch the actual file
      await new Promise(resolve => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setDownloadProgress(100)

      // Create a demo file for download
      const demoContent = `This is a demo download from Media Downloader Pro\n\nOriginal URL: ${downloadUrl}\nFilename: ${filename}\nDownloaded at: ${new Date().toLocaleString()}\n\nNote: This is a demonstration. In a real implementation, this would be the actual media file.`
      
      const blob = new Blob([demoContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `demo-${filename.replace(/\.[^/.]+$/, ".txt")}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Demo file untuk ${filename} berhasil diunduh!`)
      
      // Reset progress after a short delay
      setTimeout(() => {
        setDownloadProgress(0)
        setDownloadingFile(null)
      }, 2000)

    } catch (error) {
      console.error('Download error:', error)
      toast.error(`Gagal mengunduh ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setDownloadProgress(0)
      setDownloadingFile(null)
    }
  }

  const getFormatIcon = (type: string) => {
    if (type.includes('audio')) return <FileAudio className="h-4 w-4" />
    // eslint-disable-next-line jsx-a11y/alt-text
    if (type.includes('image')) return <Image className="h-4 w-4" />
    return <Video className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 p-3 rounded-xl">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Media Downloader Pro
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Download video, audio, dan foto dari YouTube, TikTok, dan Instagram dengan mudah dan cepat
          </p>
        </div>

        {/* Supported Platforms */}
        <div className="flex justify-center gap-4 mb-6">
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Youtube className="h-4 w-4 text-red-600" />
            YouTube
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Music className="h-4 w-4 text-pink-600" />
            TikTok
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Instagram className="h-4 w-4 text-purple-600" />
            Instagram
          </Badge>
        </div>

        {/* Demo Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Demo Mode:</strong> Website ini adalah demonstrasi. Download akan menghasilkan file demo text yang menampilkan informasi metadata.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
              <CardTitle className="text-2xl text-center">Download Media</CardTitle>
              <CardDescription className="text-center">
                Paste URL dari platform yang didukung
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Input Section */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="YouTube: youtube.com/watch?v=... | TikTok: tiktok.com/@user/video/... | Instagram: instagram.com/p/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
                  />
                  <Button 
                    onClick={handleDownload} 
                    disabled={loading || !url.trim()}
                    className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>

                {/* Platform Detection */}
                {url && detectPlatform(url) !== 'unknown' && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Platform terdeteksi: <span className="font-semibold">{detectPlatform(url)}</span>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Results Section */}
              {result && (
                <div className="space-y-4">
                  {result.success && result.data ? (
                    <div className="space-y-4">
                      {/* Video Info */}
                      <Card className="border-2 border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {result.data.thumbnail && (
                              <img 
                                src={result.data.thumbnail} 
                                alt={result.data.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                {result.data.title}
                              </h3>
                              {result.data.author && (
                                <p className="text-sm text-gray-600 mb-1">
                                  Oleh: {result.data.author}
                                </p>
                              )}
                              {result.data.duration && (
                                <p className="text-sm text-gray-600">
                                  Durasi: {result.data.duration}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Download Progress */}
                      {downloadingFile && (
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Mengunduh: {downloadingFile}</span>
                                <span className="text-sm text-blue-600">{Math.round(downloadProgress)}%</span>
                              </div>
                              <Progress value={downloadProgress} className="w-full" />
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Download Options */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg mb-2">Pilih Format:</h4>
                        {result.data.formats?.map((format, index) => (
                          <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {getFormatIcon(format.type)}
                                  <div>
                                    <p className="font-medium">{format.quality}</p>
                                    <p className="text-sm text-gray-600">{format.type}</p>
                                  </div>
                                  {format.size && (
                                    <Badge variant="secondary">{format.size}</Badge>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleFileDownload(
                                    format.url, 
                                    `${result.data?.title || 'media'}.${format.type.split('/')[1] || 'mp4'}`
                                  )}
                                  className="bg-green-500 hover:bg-green-600"
                                  disabled={downloadingFile !== null}
                                >
                                  {downloadingFile === `${result.data?.title || 'media'}.${format.type.split('/')[1] || 'mp4'}` ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  ) : (
                                    <Download className="h-4 w-4 mr-1" />
                                  )}
                                  Download
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {result.error || 'Terjadi kesalahan yang tidak diketahui'}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Instructions */}
              {!result && (
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Cara Penggunaan:</h3>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="youtube" className="flex items-center gap-2">
                        <Youtube className="h-4 w-4" />
                        YouTube
                      </TabsTrigger>
                      <TabsTrigger value="tiktok" className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        TikTok
                      </TabsTrigger>
                      <TabsTrigger value="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="youtube" className="space-y-3">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">YouTube Downloader</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Download video dalam berbagai kualitas (360p, 720p, 1080p)</li>
                            <li>• Extract audio MP3 dari video</li>
                            <li>• Support video dan playlist</li>
                            <li>• Download thumbnail</li>
                          </ul>
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-2">Format URL yang didukung:</p>
                            <div className="text-xs text-gray-500 space-y-1 font-mono">
                              <div>• youtube.com/watch?v=VIDEO_ID</div>
                              <div>• youtu.be/VIDEO_ID</div>
                              <div>• youtube.com/embed/VIDEO_ID</div>
                              <div>• youtube.com/v/VIDEO_ID</div>
                              <div>• youtube.com/shorts/VIDEO_ID</div>
                              <div>• youtube.com/live/VIDEO_ID</div>
                              <div>• music.youtube.com/watch?v=VIDEO_ID</div>
                              <div>• m.youtube.com/watch?v=VIDEO_ID</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="tiktok" className="space-y-3">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">TikTok Downloader</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Download video tanpa watermark</li>
                            <li>• Download audio MP3</li>
                            <li>• Download foto profil</li>
                            <li>• Support video tunggal dan slideshow</li>
                          </ul>
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-2">Format URL yang didukung:</p>
                            <div className="text-xs text-gray-500 space-y-1 font-mono">
                              <div>• tiktok.com/@username/video/1234567890</div>
                              <div>• tiktok.com/@username</div>
                              <div>• vm.tiktok.com/XYZ123</div>
                              <div>• vt.tiktok.com/XYZ123</div>
                              <div>• tiktok.com/t/XYZ123</div>
                              <div>• tiktok.com/v/XYZ123</div>
                              <div>• m.tiktok.com/@username/video/1234567890</div>
                              <div>• m.tiktok.com/@username</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="instagram" className="space-y-3">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Instagram Downloader</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Download postingan foto/video</li>
                            <li>• Download Instagram Stories</li>
                            <li>• Download Instagram Reels</li>
                            <li>• Download foto profil</li>
                            <li>• Download IGTV</li>
                          </ul>
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-2">Format URL yang didukung:</p>
                            <div className="text-xs text-gray-500 space-y-1 font-mono">
                              <div>• instagram.com/p/ABC123</div>
                              <div>• instagram.com/reel/ABC123</div>
                              <div>• instagram.com/tv/ABC123</div>
                              <div>• instagram.com/stories/username</div>
                              <div>• instagram.com/s/ABC123</div>
                              <div>• instagram.com/username</div>
                              <div>• instagram.com/username/profile</div>
                              <div>• instagr.am/p/ABC123</div>
                              <div>• instagr.am/username</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Cepat & Mudah</h3>
                <p className="text-sm text-gray-600">Download dengan satu klik tanpa registrasi</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Kualitas Terbaik</h3>
                <p className="text-sm text-gray-600">Pilih kualitas video sesuai kebutuhan</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ExternalLink className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Multi Platform</h3>
                <p className="text-sm text-gray-600">Support YouTube, TikTok, dan Instagram</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}