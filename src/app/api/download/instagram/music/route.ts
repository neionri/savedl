import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL Instagram diperlukan' },
      { status: 400 }
    )
  }

  try {
    // Validasi URL Instagram
    const instagramRegex = /^(https?:\/\/)?(www\.)?(instagram\.com)\/.+/
    if (!instagramRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL Instagram tidak valid' },
        { status: 400 }
      )
    }

    // Extract info dari URL
    const musicId = Math.random().toString(36).substring(7)
    
    // Simulasi proses download Instagram Music
    const mockMusicInfo = {
      title: `Instagram Music ${musicId}`,
      description: 'Musik populer dari Instagram Reels',
      thumbnail: 'https://via.placeholder.com/400/400/833AB4/FFFFFF?text=Instagram+Music',
      duration: '2:45',
      artist: 'Artist Name',
      trackName: 'Popular Song Title',
      usedIn: '1.2M reels',
      downloadLinks: [
        {
          quality: '128kbps',
          format: 'MP3',
          url: `https://example.com/download/instagram_music_${musicId}_128.mp3`,
          size: '2.8MB'
        },
        {
          quality: '320kbps',
          format: 'MP3',
          url: `https://example.com/download/instagram_music_${musicId}_320.mp3`,
          size: '6.4MB'
        },
        {
          quality: 'High',
          format: 'M4A',
          url: `https://example.com/download/instagram_music_${musicId}.m4a`,
          size: '4.1MB'
        }
      ]
    }

    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1600))

    return NextResponse.json({
      success: true,
      data: mockMusicInfo
    })

  } catch (error: any) {
    console.error('Instagram music download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses Instagram Music. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}