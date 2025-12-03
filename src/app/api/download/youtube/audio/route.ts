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

    // Simulasi proses download audio (dalam implementasi nyata, gunakan library seperti ytdl-core)
    const mockAudioInfo = {
      title: `Audio YouTube ${videoId}`,
      description: 'Ini adalah audio yang diekstrak dari YouTube',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: '3:45',
      views: '1.2M',
      author: 'Channel Name',
      downloadLinks: [
        {
          quality: '128kbps',
          format: 'MP3',
          url: `https://example.com/download/${videoId}_128.mp3`,
          size: '3.5MB'
        },
        {
          quality: '192kbps',
          format: 'MP3',
          url: `https://example.com/download/${videoId}_192.mp3`,
          size: '5.2MB'
        },
        {
          quality: '320kbps',
          format: 'MP3',
          url: `https://example.com/download/${videoId}_320.mp3`,
          size: '8.7MB'
        },
        {
          quality: 'High',
          format: 'M4A',
          url: `https://example.com/download/${videoId}.m4a`,
          size: '6.1MB'
        }
      ]
    }

    // Simulasi delay untuk membuatnya terlihat real
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      data: mockAudioInfo
    })

  } catch (error: any) {
    console.error('YouTube audio download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses audio YouTube. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}