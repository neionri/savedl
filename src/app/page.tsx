'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Download, Youtube, Instagram, Music, Video, Image, FileAudio, PlayCircle, CheckCircle, AlertCircle, FileText, Clock, User, Eye, Heart, MessageCircle, ChevronDown } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ThemeToggle } from '@/components/theme-toggle'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DownloadLink {
  quality: string
  format: string
  url: string
  size: string
  watermark?: boolean
}

interface DownloadData {
  title: string
  description: string
  thumbnail: string
  duration?: string
  views?: string
  author?: string
  likes?: string
  comments?: string
  music?: string
  followers?: string
  following?: string
  verified?: boolean
  type?: string
  mediaCount?: number
  expiresIn?: string
  fullName?: string
  bio?: string
  posts?: string
  business?: boolean
  private?: boolean
  downloadLinks: DownloadLink[]
}

interface DownloadOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  placeholder: string
  apiEndpoint: string
  color: string
  formats: string[]
}

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [downloadResult, setDownloadResult] = useState<{ success: boolean; data: DownloadData } | null>(null)
  const [selectedLink, setSelectedLink] = useState<DownloadLink | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  
  // New states for download type selection
  const [youtubeDownloadType, setYoutubeDownloadType] = useState<string>('')
  const [tiktokDownloadType, setTiktokDownloadType] = useState<string>('')
  const [instagramDownloadType, setInstagramDownloadType] = useState<string>('')

  const youtubeOptions: DownloadOption[] = [
    {
      id: 'video',
      label: 'Video',
      description: 'Download video dalam berbagai kualitas',
      icon: <Video className="w-4 h-4" />,
      placeholder: 'https://www.youtube.com/watch?v=... atau https://youtu.be/...',
      apiEndpoint: 'youtube/video',
      color: 'from-red-600 to-pink-600',
      formats: ['MP4', '480p', '720p', '1080p']
    },
    {
      id: 'audio',
      label: 'Audio',
      description: 'Download audio/Musik dalam kualitas tinggi',
      icon: <FileAudio className="w-4 h-4" />,
      placeholder: 'https://www.youtube.com/watch?v=... atau https://youtu.be/...',
      apiEndpoint: 'youtube/audio',
      color: 'from-purple-600 to-indigo-600',
      formats: ['MP3', 'M4A', '128kbps', '320kbps']
    }
  ]

  const tiktokOptions: DownloadOption[] = [
    {
      id: 'video',
      label: 'Video',
      description: 'Download video tanpa watermark',
      icon: <PlayCircle className="w-4 h-4" />,
      placeholder: 'tiktok.com/@username/video/... • vm.tiktok.com/... • vt.tiktok.com/...',
      apiEndpoint: 'tiktok/video',
      color: 'from-black to-gray-800',
      formats: ['MP4', 'HD', 'SD', 'No Watermark']
    },
    {
      id: 'profile',
      label: 'Foto Profil',
      description: 'Download foto profil user',
      icon: <Image className="w-4 h-4" />,
      placeholder: 'tiktok.com/@username • vm.tiktok.com/@username • vt.tiktok.com/@username',
      apiEndpoint: 'tiktok/profile',
      color: 'from-gray-600 to-gray-800',
      formats: ['JPG', 'PNG', 'HD']
    }
  ]

  const instagramOptions: DownloadOption[] = [
    {
      id: 'reel',
      label: 'Reels',
      description: 'Download Instagram Reels',
      icon: <Video className="w-4 h-4" />,
      placeholder: 'https://www.instagram.com/reel/...',
      apiEndpoint: 'instagram/reel',
      color: 'from-purple-600 to-pink-600',
      formats: ['MP4', '480p', '720p', '1080p']
    },
    {
      id: 'post',
      label: 'Post',
      description: 'Download foto/video post',
      icon: <Image className="w-4 h-4" />,
      placeholder: 'https://www.instagram.com/p/...',
      apiEndpoint: 'instagram/post',
      color: 'from-blue-600 to-purple-600',
      formats: ['JPG', 'PNG', 'Carousel']
    },
    {
      id: 'story',
      label: 'Story',
      description: 'Download Instagram Story',
      icon: <PlayCircle className="w-4 h-4" />,
      placeholder: 'https://www.instagram.com/username/',
      apiEndpoint: 'instagram/story',
      color: 'from-pink-600 to-red-600',
      formats: ['MP4', 'JPG', 'Expires in 24h']
    },
    {
      id: 'music',
      label: 'Musik',
      description: 'Download musik dari Reels',
      icon: <FileAudio className="w-4 h-4" />,
      placeholder: 'https://www.instagram.com/reel/...',
      apiEndpoint: 'instagram/music',
      color: 'from-green-600 to-teal-600',
      formats: ['MP3', 'M4A', 'Original Audio']
    },
    {
      id: 'profile',
      label: 'Profil',
      description: 'Download foto profil',
      icon: <Image className="w-4 h-4" />,
      placeholder: 'https://www.instagram.com/username/',
      apiEndpoint: 'instagram/profile',
      color: 'from-indigo-600 to-purple-600',
      formats: ['JPG', 'PNG', 'HD', 'Bio Info']
    }
  ]

  const handleDownload = async (option: DownloadOption, url: string) => {
    if (!url.trim()) {
      toast({
        title: "URL diperlukan",
        description: `Silakan masukkan URL ${option.label} yang valid`,
        variant: "destructive"
      })
      return
    }

    setLoading(option.apiEndpoint)
    setDownloadResult(null)

    try {
      const response = await fetch(`/api/download/${option.apiEndpoint}?url=${encodeURIComponent(url)}`)
      const data = await response.json()

      if (response.ok) {
        setDownloadResult(data)
        toast({
          title: "Berhasil!",
          description: `${option.label} berhasil diproses. Pilih kualitas untuk download.`,
        })
      } else {
        throw new Error(data.error || 'Terjadi kesalahan')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Gagal memproses URL',
        variant: "destructive"
      })
    } finally {
      setLoading(null)
    }
  }

  const handleConfirmDownload = (link: DownloadLink) => {
    setSelectedLink(link)
    setShowConfirmDialog(true)
  }

  const executeDownload = () => {
    if (selectedLink) {
      // Create temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = selectedLink.url
      link.download = `${downloadResult?.data.title || 'download'}.${selectedLink.format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Dimulai!",
        description: `File ${selectedLink.quality} ${selectedLink.format} sedang diunduh...`,
      })

      setShowConfirmDialog(false)
      setSelectedLink(null)
    }
  }

  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'mp4':
      case 'mov':
        return <Video className="w-4 h-4" />
      case 'mp3':
      case 'm4a':
      case 'wav':
        return <FileAudio className="w-4 h-4" />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getSelectedOption = (platform: string): DownloadOption | undefined => {
    switch (platform) {
      case 'youtube':
        return youtubeOptions.find(opt => opt.id === youtubeDownloadType)
      case 'tiktok':
        return tiktokOptions.find(opt => opt.id === tiktokDownloadType)
      case 'instagram':
        return instagramOptions.find(opt => opt.id === instagramDownloadType)
      default:
        return undefined
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl overflow-hidden">
                <img
                  src="/download-icon.png"
                  alt="Download Icon"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Universal Media Downloader
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Download video, audio, dan foto dari YouTube, TikTok, dan Instagram dengan mudah dan cepat
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Gratis
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              No Watermark
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              High Quality
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="youtube" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                YouTube
              </TabsTrigger>
              <TabsTrigger value="tiktok" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                TikTok
              </TabsTrigger>
              <TabsTrigger value="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </TabsTrigger>
            </TabsList>

            {/* YouTube Tab */}
            <TabsContent value="youtube">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                      <Youtube className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">YouTube Downloader</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pilih jenis download terlebih dahulu</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Download Type Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Apa yang ingin Anda download?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {youtubeOptions.map((option) => (
                        <Card 
                          key={option.id}
                          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            youtubeDownloadType === option.id 
                              ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                          onClick={() => setYoutubeDownloadType(option.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center text-white`}>
                              {option.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {option.description}
                              </div>
                            </div>
                            {youtubeDownloadType === option.id && (
                              <CheckCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* URL Input */}
                  {youtubeDownloadType && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">URL YouTube</label>
                        <Input
                          placeholder={getSelectedOption('youtube')?.placeholder}
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      
                      <Button
                        onClick={() => {
                          const option = getSelectedOption('youtube')
                          if (option) handleDownload(option, youtubeUrl)
                        }}
                        disabled={loading === getSelectedOption('youtube')?.apiEndpoint || !youtubeUrl.trim()}
                        className={`h-12 w-full bg-gradient-to-r ${getSelectedOption('youtube')?.color} hover:opacity-90`}
                      >
                        {loading === getSelectedOption('youtube')?.apiEndpoint ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          getSelectedOption('youtube')?.icon
                        )}
                        Download {getSelectedOption('youtube')?.label}
                      </Button>

                      <div className="flex flex-wrap gap-2">
                        {getSelectedOption('youtube')?.formats.map((format) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TikTok Tab */}
            <TabsContent value="tiktok">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                      <Music className="w-6 h-6 text-white dark:text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">TikTok Downloader</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pilih jenis download terlebih dahulu</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Download Type Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Apa yang ingin Anda download?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tiktokOptions.map((option) => (
                        <Card 
                          key={option.id}
                          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            tiktokDownloadType === option.id 
                              ? 'ring-2 ring-black bg-gray-100 dark:bg-gray-800' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                          onClick={() => setTiktokDownloadType(option.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center text-white`}>
                              {option.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {option.description}
                              </div>
                            </div>
                            {tiktokDownloadType === option.id && (
                              <CheckCircle className="w-5 h-5 text-black" />
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* URL Input */}
                  {tiktokDownloadType && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">URL TikTok</label>
                        <Input
                          placeholder={getSelectedOption('tiktok')?.placeholder}
                          value={tiktokUrl}
                          onChange={(e) => setTiktokUrl(e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      
                      <Button
                        onClick={() => {
                          const option = getSelectedOption('tiktok')
                          if (option) handleDownload(option, tiktokUrl)
                        }}
                        disabled={loading === getSelectedOption('tiktok')?.apiEndpoint || !tiktokUrl.trim()}
                        className={`h-12 w-full bg-gradient-to-r ${getSelectedOption('tiktok')?.color} hover:opacity-90 text-white`}
                      >
                        {loading === getSelectedOption('tiktok')?.apiEndpoint ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          getSelectedOption('tiktok')?.icon
                        )}
                        Download {getSelectedOption('tiktok')?.label}
                      </Button>

                      <div className="flex flex-wrap gap-2">
                        {getSelectedOption('tiktok')?.formats.map((format) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Instagram Tab */}
            <TabsContent value="instagram">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Instagram Downloader</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pilih jenis download terlebih dahulu</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Download Type Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Apa yang ingin Anda download?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {instagramOptions.map((option) => (
                        <Card 
                          key={option.id}
                          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            instagramDownloadType === option.id 
                              ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                          onClick={() => setInstagramDownloadType(option.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center text-white`}>
                              {option.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {option.description}
                              </div>
                            </div>
                            {instagramDownloadType === option.id && (
                              <CheckCircle className="w-5 h-5 text-purple-500" />
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* URL Input */}
                  {instagramDownloadType && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">URL Instagram</label>
                        <Input
                          placeholder={getSelectedOption('instagram')?.placeholder}
                          value={instagramUrl}
                          onChange={(e) => setInstagramUrl(e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      
                      <Button
                        onClick={() => {
                          const option = getSelectedOption('instagram')
                          if (option) handleDownload(option, instagramUrl)
                        }}
                        disabled={loading === getSelectedOption('instagram')?.apiEndpoint || !instagramUrl.trim()}
                        className={`h-12 w-full bg-gradient-to-r ${getSelectedOption('instagram')?.color} hover:opacity-90`}
                      >
                        {loading === getSelectedOption('instagram')?.apiEndpoint ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          getSelectedOption('instagram')?.icon
                        )}
                        Download {getSelectedOption('instagram')?.label}
                      </Button>

                      <div className="flex flex-wrap gap-2">
                        {getSelectedOption('instagram')?.formats.map((format) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Download Result */}
          {downloadResult && (
            <Card className="mt-8 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Media Berhasil Diproses!
                </CardTitle>
                <CardDescription>
                  Pilih kualitas dan format yang Anda inginkan untuk melanjutkan download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Thumbnail Preview */}
                  {downloadResult.data.thumbnail && (
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={downloadResult.data.thumbnail} 
                          alt="Thumbnail" 
                          className="w-full md:w-48 h-48 md:h-48 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                      
                      {/* Media Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="font-semibold text-lg">{downloadResult.data.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {downloadResult.data.description}
                          </p>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {downloadResult.data.author && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {downloadResult.data.author}
                                {downloadResult.data.verified && (
                                  <CheckCircle className="w-3 h-3 text-blue-500 ml-1 inline" />
                                )}
                              </span>
                            </div>
                          )}
                          
                          {downloadResult.data.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {downloadResult.data.duration}
                              </span>
                            </div>
                          )}
                          
                          {downloadResult.data.views && (
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {downloadResult.data.views}
                              </span>
                            </div>
                          )}
                          
                          {downloadResult.data.likes && (
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {downloadResult.data.likes}
                              </span>
                            </div>
                          )}
                          
                          {downloadResult.data.comments && (
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {downloadResult.data.comments}
                              </span>
                            </div>
                          )}
                          
                          {downloadResult.data.followers && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {downloadResult.data.followers}
                              </span>
                            </div>
                          )}
                          
                          {downloadResult.data.following && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {downloadResult.data.following} following
                              </span>
                            </div>
                          )}
                          
                          {downloadResult.data.expiresIn && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {downloadResult.data.expiresIn}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Additional Info */}
                        {downloadResult.data.music && (
                          <div className="text-sm">
                            <span className="font-medium">Musik: </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {downloadResult.data.music}
                            </span>
                          </div>
                        )}
                        
                        {downloadResult.data.bio && (
                          <div className="text-sm">
                            <span className="font-medium">Bio: </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {downloadResult.data.bio}
                            </span>
                          </div>
                        )}
                        
                        {downloadResult.data.type && (
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {downloadResult.data.type}
                            </Badge>
                            {downloadResult.data.mediaCount && (
                              <Badge variant="outline">
                                {downloadResult.data.mediaCount} media
                              </Badge>
                            )}
                            {downloadResult.data.watermark === false && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                No Watermark
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Download Options */}
                  <div className="space-y-3">
                    <h5 className="font-medium">Pilih Kualitas Download:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {downloadResult.data.downloadLinks.map((link: DownloadLink, index: number) => (
                        <Card key={index} className="p-4 border hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                {getFileIcon(link.format)}
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {link.quality}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {link.format} • {link.size}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleConfirmDownload(link)}
                              className="ml-2"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Konfirmasi Download
              </DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin mendownload file ini?
              </DialogDescription>
            </DialogHeader>
            
            {selectedLink && (
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {getFileIcon(selectedLink.format)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {downloadResult?.data.title || 'File'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedLink.quality} • {selectedLink.format} • {selectedLink.size}
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>• File akan diunduh dalam kualitas {selectedLink.quality}</p>
                  <p>• Format file: {selectedLink.format}</p>
                  <p>• Ukuran file: {selectedLink.size}</p>
                  {selectedLink.watermark === false && (
                    <p>• ✓ Tanpa watermark</p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Batal
              </Button>
              <Button onClick={executeDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download Sekarang
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Disclaimer: Gunakan dengan bijak. Hormati hak cipta dan privasi pengguna.
          </p>
        </div>
      </div>
    </div>
  )
}