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

    // Simulasi proses download foto profil Instagram
    const mockProfileInfo = {
      title: `Foto Profil Instagram @${username}`,
      description: `Foto profil HD dari Instagram user @${username}`,
      thumbnail: 'https://via.placeholder.com/400/400/E4405F/FFFFFF?text=Instagram+Profile',
      username: `@${username}`,
      fullName: 'User Full Name',
      bio: 'This is a user bio on Instagram',
      followers: '125K',
      following: '892',
      posts: '342',
      verified: true,
      business: false,
      private: false,
      downloadLinks: [
        {
          quality: 'Original',
          format: 'JPG',
          url: `https://example.com/download/instagram_profile_${username}_original.jpg`,
          size: '3.2MB'
        },
        {
          quality: 'HD',
          format: 'PNG',
          url: `https://example.com/download/instagram_profile_${username}_hd.png`,
          size: '5.8MB'
        }
      ]
    }

    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1400))

    return NextResponse.json({
      success: true,
      data: mockProfileInfo
    })

  } catch (error: any) {
    console.error('Instagram profile download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses foto profil Instagram. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}