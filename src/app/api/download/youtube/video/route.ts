import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL YouTube diperlukan' },
      { status: 400 }
    )
  }

  try {
    // Validasi URL YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
    if (!youtubeRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL YouTube tidak valid' },
        { status: 400 }
      )
    }

    // Extract video ID dari URL
    let videoId = ''
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/watch')) {
      videoId = new URL(url).searchParams.get('v') || ''
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || ''
    }

    if (!videoId) {
      return NextResponse.json(
        { error: 'Tidak dapat mengextract video ID dari URL' },
        { status: 400 }
      )
    }

    // Simulasi proses download (dalam implementasi nyata, gunakan library seperti ytdl-core)
    // Ini adalah simulasi untuk demo purposes
    const mockVideoInfo = {
      title: `Video YouTube ${videoId}`,
      description: 'Ini adalah video yang diproses dari YouTube',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: '3:45',
      views: '1.2M',
      author: 'Channel Name',
      downloadLinks: [
        {
          quality: '720p',
          format: 'MP4',
          url: `https://example.com/download/${videoId}_720p.mp4`,
          size: '25MB'
        },
        {
          quality: '1080p',
          format: 'MP4',
          url: `https://example.com/download/${videoId}_1080p.mp4`,
          size: '45MB'
        },
        {
          quality: '480p',
          format: 'MP4',
          url: `https://example.com/download/${videoId}_480p.mp4`,
          size: '15MB'
        }
      ]
    }

    // Simulasi delay untuk membuatnya terlihat real
    await new Promise(resolve => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      data: mockVideoInfo
    })

  } catch (error: any) {
    console.error('YouTube download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses video YouTube. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}