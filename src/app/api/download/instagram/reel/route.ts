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
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(reel|p)\/.+/
    if (!instagramRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL Instagram tidak valid' },
        { status: 400 }
      )
    }

    // Extract post/reel ID dari URL
    const postId = Math.random().toString(36).substring(7)
    
    // Simulasi proses download Instagram Reel
    const mockReelInfo = {
      title: `Instagram Reel ${postId}`,
      description: 'Reel keren dari Instagram dengan kualitas HD',
      thumbnail: 'https://via.placeholder.com/400x700/E4405F/FFFFFF?text=Instagram+Reel',
      duration: '0:30',
      views: '2.1M',
      likes: '156K',
      comments: '2,341',
      author: 'instagram_user',
      downloadLinks: [
        {
          quality: '1080p',
          format: 'MP4',
          url: `https://example.com/download/instagram_reel_${postId}_1080p.mp4`,
          size: '15.2MB'
        },
        {
          quality: '720p',
          format: 'MP4',
          url: `https://example.com/download/instagram_reel_${postId}_720p.mp4`,
          size: '8.7MB'
        },
        {
          quality: '480p',
          format: 'MP4',
          url: `https://example.com/download/instagram_reel_${postId}_480p.mp4`,
          size: '4.3MB'
        }
      ]
    }

    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      data: mockReelInfo
    })

  } catch (error: any) {
    console.error('Instagram reel download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses Instagram Reel. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}