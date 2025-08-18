import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join, relative } from 'path'

// Recursively collect image paths from public/
async function collectImages(dir: string, publicDir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const paths: string[] = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      paths.push(...await collectImages(fullPath, publicDir))
    } else {
      const lower = entry.name.toLowerCase()
      const isAllowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => lower.endsWith(ext))
      const isBlocked = lower.endsWith('.html') || lower.endsWith('.js') || lower.endsWith('.md') || lower.endsWith('.ico') || lower.includes('.ds_store')
      if (isAllowed && !isBlocked) {
        // Convert filesystem path under public/ to URL path
        const rel = relative(publicDir, fullPath).split('\\').join('/')
        paths.push(`/${rel}`)
      }
    }
  }
  return paths
}

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public')

    const images = await collectImages(publicDir, publicDir)
    // Sort for stable order (optional)
    images.sort()

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error scanning images directory:', error)
    return NextResponse.json({ images: [] }, { status: 500 })
  }
} 