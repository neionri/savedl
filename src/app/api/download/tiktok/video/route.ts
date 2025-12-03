import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL TikTok diperlukan' },
      { status: 400 }
    )
  }

  try {
    // Validasi URL TikTok - menerima semua format URL video TikTok
    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/(@[a-zA-Z0-9._]+\/video\/\d+|video\/\d+|t\/[a-zA-Z0-9]+|@[a-zA-Z0-9._]+\/?$|[a-zA-Z0-9]+\/?$).*$/
    if (!tiktokRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL TikTok tidak valid. Gunakan format: tiktok.com/@username/video/1234567890 atau vm.tiktok.com/shortlink' },
        { status: 400 }
      )
    }

    // Extract video info dari URL (simulasi)
    const videoId = Math.random().toString(36).substring(7)
    
    // Simulasi proses download TikTok video
    const mockVideoInfo = {
      title: `TikTok Video ${videoId}`,
      description: 'Video keren dari TikTok tanpa watermark',
      thumbnail: 'https://via.placeholder.com/400x800/FF6B6B/FFFFFF?text=TikTok+Video',
      duration: '0:15',
      views: '500K',
      author: '@tiktok_user',
      music: 'Original Sound - Creator',
      downloadLinks: [
        {
          quality: 'HD',
          format: 'MP4',
          url: `https://example.com/download/tiktok_${videoId}_hd.mp4`,
          size: '8.5MB',
          watermark: false
        },
        {
          quality: 'SD',
          format: 'MP4',
          url: `https://example.com/download/tiktok_${videoId}_sd.mp4`,
          size: '3.2MB',
          watermark: false
        }
      ]
    }

    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1800))

    return NextResponse.json({
      success: true,
      data: mockVideoInfo
    })

  } catch (error: any) {
    console.error('TikTok download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses video TikTok. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}