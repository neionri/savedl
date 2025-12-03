import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate YouTube URL - Support all YouTube video URL formats
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/|music\.youtube\.com\/(watch\?v=|playlist\?list=)|m\.youtube\.com\/watch\?v=)/
    if (!youtubeRegex.test(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    const zai = await ZAI.create()

    // Extract video ID from URL - Support all YouTube video URL formats
    let videoId = ''
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/v/')) {
      videoId = url.split('v/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/live/')) {
      videoId = url.split('live/')[1]?.split('?')[0] || ''
    } else if (url.includes('music.youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    } else if (url.includes('m.youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    }

    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract video ID from URL' }, { status: 400 })
    }

    // Get video info using oembed API (public endpoint)
    const oembedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )

    let videoInfo = null
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

    if (oembedResponse.ok) {
      const oembedData = await oembedResponse.json()
      videoInfo = {
        title: oembedData.title,
        author: oembedData.author_name,
        thumbnail: thumbnailUrl
      }
    } else {
      // Fallback to basic info
      videoInfo = {
        title: `YouTube Video ${videoId}`,
        author: 'YouTube User',
        thumbnail: thumbnailUrl
      }
    }

    // Generate demo download options
    const formats = [
      {
        quality: '1080p (Full HD)',
        size: '~50 MB',
        url: `https://demo-youtube-download.example.com/video/${videoId}/1080p`,
        type: 'video/mp4'
      },
      {
        quality: '720p (HD)',
        size: '~25 MB',
        url: `https://demo-youtube-download.example.com/video/${videoId}/720p`,
        type: 'video/mp4'
      },
      {
        quality: '480p (SD)',
        size: '~15 MB',
        url: `https://demo-youtube-download.example.com/video/${videoId}/480p`,
        type: 'video/mp4'
      },
      {
        quality: '360p (SD)',
        size: '~8 MB',
        url: `https://demo-youtube-download.example.com/video/${videoId}/360p`,
        type: 'video/mp4'
      },
      {
        quality: 'MP3 Audio',
        size: '~5 MB',
        url: `https://demo-youtube-download.example.com/audio/${videoId}/mp3`,
        type: 'audio/mpeg'
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        ...videoInfo,
        duration: 'Unknown',
        formats: formats
      }
    })

  } catch (error) {
    console.error('YouTube download error:', error)
    return NextResponse.json(
      { error: 'Failed to process YouTube video' },
      { status: 500 }
    )
  }
}