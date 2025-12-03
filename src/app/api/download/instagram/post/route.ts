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
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/p\/.+/
    if (!instagramRegex.test(url)) {
      return NextResponse.json(
        { error: 'URL Instagram tidak valid' },
        { status: 400 }
      )
    }

    // Extract post ID dari URL
    const postId = Math.random().toString(36).substring(7)
    
    // Simulasi proses download Instagram Post
    const mockPostInfo = {
      title: `Instagram Post ${postId}`,
      description: 'Post foto dari Instagram dengan kualitas tinggi',
      thumbnail: 'https://via.placeholder.com/600/800/405DE6/FFFFFF?text=Instagram+Post',
      likes: '89K',
      comments: '1,234',
      author: 'instagram_user',
      type: 'carousel', // single, carousel, video
      mediaCount: 3, // untuk carousel
      downloadLinks: [
        {
          quality: 'Original',
          format: 'JPG',
          url: `https://example.com/download/instagram_post_${postId}_1.jpg`,
          size: '2.8MB'
        },
        {
          quality: 'HD',
          format: 'JPG',
          url: `https://example.com/download/instagram_post_${postId}_1_hd.jpg`,
          size: '4.1MB'
        }
      ]
    }

    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      data: mockPostInfo
    })

  } catch (error: any) {
    console.error('Instagram post download error:', error)
    return NextResponse.json(
      { error: 'Gagal memproses Instagram Post. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}