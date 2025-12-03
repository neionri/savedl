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
    // Validasi URL TikTok - menerima semua format URL TikTok
    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/(@[a-zA-Z0-9._]+\/video\/\d+|video\/\d+|t\/[a-zA-Z0-9]+|@[a-zA-Z0-9._]+\/?$|[a-zA-Z0-9]+\/?$).*$/
    if (!tiktokRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL TikTok tidak valid. Gunakan format: tiktok.com/@username atau vm.tiktok.com/@username' },
        { status: 400 }
      )
    }

    // Extract username dari URL
    let username = ''
    if (url.includes('@')) {
      username = url.split('@')[1]?.split('/')[0] || ''
    } else {
      // Handle format lain seperti vm.tiktok.com/username
      const pathParts = url.split('/')
      const lastPart = pathParts[pathParts.length - 1]
      if (lastPart && !lastPart.includes('video') && !lastPart.includes('t/')) {
        username = lastPart
      }
    }

    if (!username) {
      return NextResponse.json(
        { error: 'Tidak dapat mengextract username dari URL' },
        { status: 400 }
      )
    }

    // Simulasi proses download foto profil TikTok
    const mockProfileInfo = {
      title: `Foto Profil @${username}`,
      description: `Foto profil HD dari TikTok user @${username}`,
      thumbnail: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Profile+Picture',
      username: `@${username}`,
      followers: '1.2M',
      following: '234',
      likes: '45.6M',
      verified: true,
      downloadLinks: [
        {
          quality: 'Original',
          format: 'JPG',
          url: `https://example.com/download/tiktok_profile_${username}_original.jpg`,
          size: '2.5MB'
        },
        {
          quality: 'HD',
          format: 'PNG',
          url: `https://example.com/download/tiktok_profile_${username}_hd.png`,
          size: '4.1MB'
        }
      ]
    }

    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    return NextResponse.json({
      success: true,
      data: mockProfileInfo
    })

  } catch (error: any) {
    console.error('TikTok profile download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses foto profil TikTok. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}