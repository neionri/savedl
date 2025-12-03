import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate Instagram URL - Support all Instagram URL formats
    const instagramRegex = /^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel|tv|stories|s)\/[\w.-]+|instagram\.com\/[\w.-]+\/(stories|profile)\/?|instagram\.com\/[\w.-]+\/?|instagr\.am\/[\w.-]+|www\.instagr\.am\/[\w.-]+)/
    if (!instagramRegex.test(url)) {
      return NextResponse.json({ error: 'Invalid Instagram URL' }, { status: 400 })
    }

    const zai = await ZAI.create()

    // Determine content type from URL - Support all Instagram URL formats
    let contentType = 'post'
    let username = ''
    let contentId = ''

    if (url.includes('/p/')) {
      contentType = 'post'
      const match = url.match(/instagram\.com\/p\/([\w.-]+)/)
      contentId = match ? match[1] : ''
    } else if (url.includes('/reel/')) {
      contentType = 'reel'
      const match = url.match(/instagram\.com\/reel\/([\w.-]+)/)
      contentId = match ? match[1] : ''
    } else if (url.includes('/tv/')) {
      contentType = 'igtv'
      const match = url.match(/instagram\.com\/tv\/([\w.-]+)/)
      contentId = match ? match[1] : ''
    } else if (url.includes('/stories/')) {
      contentType = 'story'
      const match = url.match(/instagram\.com\/stories\/([\w.-]+)/)
      username = match ? match[1] : ''
    } else if (url.includes('/s/')) {
      contentType = 'story'
      const match = url.match(/instagram\.com\/s\/([\w.-]+)/)
      contentId = match ? match[1] : ''
    } else if (url.includes('/profile/')) {
      contentType = 'profile'
      const match = url.match(/instagram\.com\/([\w.-]+)\/profile/)
      username = match ? match[1] : ''
    } else if (url.includes('instagr.am/')) {
      // Short URL format: instagr.am/p/ABC123
      if (url.includes('/p/')) {
        contentType = 'post'
        const match = url.match(/instagr\.am\/p\/([\w.-]+)/)
        contentId = match ? match[1] : ''
      } else {
        contentType = 'profile'
        const match = url.match(/instagr\.am\/([\w.-]+)/)
        username = match ? match[1] : ''
      }
    } else if (url.match(/instagram\.com\/[\w.-]+\/?$/)) {
      // Profile URL: instagram.com/username
      contentType = 'profile'
      const match = url.match(/instagram\.com\/([\w.-]+)/)
      username = match ? match[1] : ''
    }

    // Mock Instagram data based on content type (demo implementation)
    let mockData = {}

    switch (contentType) {
      case 'post':
        mockData = {
          title: `Instagram Post by @${username || 'user'}`,
          author: username || 'Instagram User',
          thumbnail: 'https://instagram.flhr4-1.fna.fbcdn.net/v/t51.2885-15/123456789_123456789012345_1234567890123456789_n.jpg',
          duration: 'Photo',
          formats: [
            {
              quality: 'Original Photo (HD)',
              size: '~2 MB',
              url: `https://demo-instagram-download.example.com/post/${contentId}/hd`,
              type: 'image/jpeg'
            },
            {
              quality: 'Compressed Photo',
              size: '~800 KB',
              url: `https://demo-instagram-download.example.com/post/${contentId}/compressed`,
              type: 'image/jpeg'
            }
          ]
        }
        break

      case 'reel':
        mockData = {
          title: `Instagram Reel by @${username || 'user'}`,
          author: username || 'Instagram User',
          thumbnail: 'https://instagram.flhr4-1.fna.fbcdn.net/v/t50.2886-16/1234567890123456789_1234567890123456789_n.mp4',
          duration: '0:30',
          formats: [
            {
              quality: 'HD Reel (1080p)',
              size: '~15 MB',
              url: `https://demo-instagram-download.example.com/reel/${contentId}/hd`,
              type: 'video/mp4'
            },
            {
              quality: 'SD Reel (720p)',
              size: '~8 MB',
              url: `https://demo-instagram-download.example.com/reel/${contentId}/sd`,
              type: 'video/mp4'
            },
            {
              quality: 'Audio Only',
              size: '~2 MB',
              url: `https://demo-instagram-download.example.com/reel/${contentId}/audio`,
              type: 'audio/mpeg'
            }
          ]
        }
        break

      case 'story':
        mockData = {
          title: `Instagram Story by @${username || 'user'}`,
          author: username || 'Instagram User',
          thumbnail: 'https://instagram.flhr4-1.fna.fbcdn.net/v/t51.2885-15/e35/123456789_123456789012345_1234567890123456789_n.jpg',
          duration: '0:15',
          formats: [
            {
              quality: 'Story Photo/Video (HD)',
              size: '~5 MB',
              url: `https://demo-instagram-download.example.com/story/${username}/hd`,
              type: 'image/jpeg'
            }
          ]
        }
        break

      case 'profile':
        mockData = {
          title: `Instagram Profile: @${username || 'user'}`,
          author: username || 'Instagram User',
          thumbnail: 'https://instagram.flhr4-1.fna.fbcdn.net/v/t51.2885-19/s150x150/123456789_123456789012345_1234567890123456789_n.jpg',
          duration: 'Profile Picture',
          formats: [
            {
              quality: 'Profile Picture HD',
              size: '~500 KB',
              url: `https://demo-instagram-download.example.com/profile/${username}/hd`,
              type: 'image/jpeg'
            },
            {
              quality: 'Profile Picture SD',
              size: '~200 KB',
              url: `https://demo-instagram-download.example.com/profile/${username}/sd`,
              type: 'image/jpeg'
            }
          ]
        }
        break

      default:
        mockData = {
          title: 'Instagram Content',
          author: 'Instagram User',
          thumbnail: '',
          duration: 'Unknown',
          formats: []
        }
    }

    // Use AI to enhance the data extraction
    try {
      const aiResponse = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an Instagram content metadata extractor. Extract information from Instagram URLs and provide realistic content details.'
          },
          {
            role: 'user',
            content: `Extract metadata from this Instagram URL: ${url}. This appears to be a ${contentType}. Provide title, author, duration, and available download formats.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      console.log('AI Enhancement:', aiResponse.choices[0]?.message?.content)
    } catch (aiError) {
      console.log('AI enhancement failed, using mock data')
    }

    return NextResponse.json({
      success: true,
      data: mockData
    })

  } catch (error) {
    console.error('Instagram download error:', error)
    return NextResponse.json(
      { error: 'Failed to process Instagram content' },
      { status: 500 }
    )
  }
}