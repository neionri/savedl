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
    // Validasi URL Instagram (story biasanya dari username)
    const instagramRegex = /^(https?:\/\/)?(www\.)?(instagram\.com)\/.+/
    if (!instagramRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL Instagram tidak valid' },
        { status: 400 }
      )
    }

    // Extract username dari URL
    let username = ''
    if (url.includes('instagram.com/')) {
      const parts = url.split('instagram.com/')[1]?.split('/')[0]
      username = parts?.replace('@', '') || ''
    }

    if (!username) {
      return NextResponse.json(
        { error: 'Tidak dapat mengextract username dari URL' },
        { status: 400 }
      )
    }

    // Simulasi proses download Instagram Story
    const storyId = Math.random().toString(36).substring(7)
    
    const mockStoryInfo = {
      title: `Instagram Story @${username}`,
      description: `Story dari Instagram user @${username}`,
      thumbnail: 'https://via.placeholder.com/400/700/FD1D1D/FFFFFF?text=Instagram+Story',
      duration: '0:15',
      views: '5.2K',
      author: `@${username}`,
      type: 'video', // image, video
      expiresIn: '20 jam',
      downloadLinks: [
        {
          quality: 'HD',
          format: 'MP4',
          url: `https://example.com/download/instagram_story_${storyId}.mp4`,
          size: '6.8MB'
        }
      ]
    }

    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1800))

    return NextResponse.json({
      success: true,
      data: mockStoryInfo
    })

  } catch (error: any) {
    console.error('Instagram story download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses Instagram Story. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}