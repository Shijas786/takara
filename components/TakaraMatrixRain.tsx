"use client"

import React, { useEffect, useRef, useState } from 'react'

interface MatrixSymbol {
  x: number
  y: number
  alpha: number
  color: string
}

interface MatrixColumn {
  x: number
  y: number
  positions: number[]
  symbols: MatrixSymbol[]
}

const TakaraMatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [columnPositions, setColumnPositions] = useState<Map<number, number[]>>(new Map())
  const [isActive, setIsActive] = useState(true)
  const [drawingMode, setDrawingMode] = useState<'color' | 'lines' | 'threshold'>('threshold')
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [testClick, setTestClick] = useState(0)

  // Matrix characters for rain effect
  const matrixChars = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=<>?'

  // Configuration for Matrix rain - EXACTLY like Python version (Black & White theme)
  const config = {
    FONT_SIZE: 10, // Same as Python
    THRESHOLD: 30, // Same as Python (30%)
    ISOLATE_COLOR: [255, 255, 255], // White - same as Python (for image formation)
    IMG_SCALE: 0.8, // Same as Python
    FADE_RATE: 15, // Same as Python
    FADE_ADJUSTMENT: 6, // Same as Python
    STARTING_ALPHA: 60, // Same as Python
    ALPHA_LIMIT: 170 // Same as Python
  }

  // Simple, working image management
  const [projectImages, setProjectImages] = useState<string[]>([])
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Debug: Monitor columnPositions changes
  useEffect(() => {
    console.log('MatrixRain: columnPositions changed!', {
      size: columnPositions.size,
      hasData: columnPositions.size > 0
    })
  }, [columnPositions])

  // Debug: Monitor currentImage changes
  useEffect(() => {
    console.log('MatrixRain: currentImage changed!', {
      currentImage,
      hasImage: !!currentImage
    })
  }, [currentImage])

  // Fetch available images from API
  useEffect(() => {
    if (!isMounted) return

    const fetchImages = async () => {
      try {
        console.log('MatrixRain: Fetching images from API...')
        // Force fresh fetch with cache busting
        const response = await fetch('/api/images?t=' + Date.now(), {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log('MatrixRain: Successfully fetched', data.images.length, 'images:', data.images)
          setProjectImages(data.images)
        } else {
          console.error('MatrixRain: Failed to fetch images')
        }
      } catch (error) {
        console.error('MatrixRain: Error fetching images, using fallback:', error)
      }
    }

    fetchImages()

    // Auto-refresh images every 30 seconds to detect new uploads
    const refreshInterval = setInterval(fetchImages, 30000)

    return () => clearInterval(refreshInterval)
  }, [isMounted])

  // Manual image change function
  const changeImageManually = () => {
    if (projectImages.length === 0) {
      console.log('MatrixRain: No images available')
      return
    }
    
    console.log('MatrixRain: Manual change triggered. Current:', currentImage)
    console.log('MatrixRain: Available images:', projectImages)
    
    // Simple image change
    const currentIndex = projectImages.indexOf(currentImage || '')
    console.log('MatrixRain: Current index:', currentIndex)
    
    const nextIndex = (currentIndex + 1) % projectImages.length
    const nextImage = projectImages[nextIndex]
    console.log('MatrixRain: Manual image change to:', nextImage, '(index:', nextIndex, ')')
    
    setCurrentImage(nextImage)
  }

  useEffect(() => {
    if (!isMounted) return // Don't run until mounted

    try {
      const updateDimensions = () => {
        const newDimensions = {
          width: window.innerWidth,
          height: window.innerHeight
        }
        setDimensions(newDimensions)
      }

      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    } catch (err) {
      setError('Failed to set dimensions')
      console.error('Matrix Rain: Dimension error:', err)
    }
  }, [isMounted])

  // Load first image and set up rotation - SIMPLE like Python
  useEffect(() => {
    console.log('MatrixRain: Image rotation useEffect triggered!', {
      projectImagesLength: projectImages.length,
      currentImage,
      isMounted
    })
    
    if (projectImages.length === 0) {
      console.log('MatrixRain: No project images yet, waiting...')
      return
    }
    
    console.log('MatrixRain: Setting up image rotation with', projectImages.length, 'images')
    
    // Set first image if none selected
    if (!currentImage) {
      console.log('MatrixRain: Setting first image:', projectImages[0])
      setCurrentImage(projectImages[0])
    }
    
    // Set up image rotation interval - EXACTLY like Python version
    const imageRotationInterval = setInterval(() => {
      if (projectImages.length > 1) {
        const currentIndex = projectImages.indexOf(currentImage || '')
        const nextIndex = (currentIndex + 1) % projectImages.length
        const nextImage = projectImages[nextIndex]
        console.log('MatrixRain: Rotating to next image:', nextImage, '(index:', nextIndex, ')')
        setCurrentImage(nextImage)
      }
    }, 15000) // 15 seconds like Python
    
    return () => clearInterval(imageRotationInterval)
  }, [projectImages, currentImage]) // Depend on both to track changes properly

  // Load and process image
  useEffect(() => {
    console.log('MatrixRain: Image processing useEffect triggered!', {
      currentImage,
      projectImagesLength: projectImages.length,
      hasCurrentImage: !!currentImage
    })
    
    try {
      if (!currentImage) {
        console.log('MatrixRain: No current image, skipping processing')
        return
      }
      console.log('MatrixRain: Loading image:', currentImage)
      
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        try {
          console.log('MatrixRain: Image loaded successfully:', img.width, 'x', img.height)

          

          
          const tempCanvas = document.createElement('canvas')
          const tempCtx = tempCanvas.getContext('2d')
          if (!tempCtx) return

          // Scale image
          const scaledWidth = Math.floor(img.width * config.IMG_SCALE)
          const scaledHeight = Math.floor(img.height * config.IMG_SCALE)
          
          tempCanvas.width = scaledWidth
          tempCanvas.height = scaledHeight
          tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight)
          
          const data = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight)
          setImageData(data)
          console.log('MatrixRain: Image data processed:', scaledWidth, 'x', scaledHeight)

          
          // EXACTLY like Python version - process image for Matrix rain
          processImageData(data, scaledWidth, scaledHeight)
          
          // Image processed successfully - rotation will be handled by interval
        } catch (err) {
          setError('Failed to process image')
          console.error('Matrix Rain: Image processing error:', err)
        }
      }
      img.onerror = () => {
        console.error('MatrixRain: Image failed to load:', currentImage)
        // Try next image if current fails
        const currentIndex = projectImages.indexOf(currentImage || '')
        const nextIndex = (currentIndex + 1) % projectImages.length
        const nextImage = projectImages[nextIndex]
        setCurrentImage(nextImage)
      }
      img.src = currentImage
    } catch (err) {
      setError('Failed to load image')
      console.error('Matrix Rain: Image loading error:', err)
    }
  }, [currentImage, projectImages]) // Need both dependencies to trigger when images are fetched!

  const processImageData = (data: ImageData, width: number, height: number) => {
    console.log('MatrixRain: processImageData called!', {
      dataWidth: data.width,
      dataHeight: data.height,
      dataLength: data.data.length
    })
    
    try {
      // EXACTLY like Python version - isolate white pixels
      const processed = new Uint8ClampedArray(data.data.length)
      
      // SINGLE_COLOR_SELECTION mode - same as Python
      for (let i = 0; i < data.data.length; i += 4) {
        const r = data.data[i]
        const g = data.data[i + 1]
        const b = data.data[i + 2]
        
        // Check if pixel matches ISOLATE_COLOR (white) - same logic as Python
        const tolerance = 30 // Same tolerance as Python
        if (Math.abs(r - config.ISOLATE_COLOR[0]) < tolerance &&
            Math.abs(g - config.ISOLATE_COLOR[1]) < tolerance &&
            Math.abs(b - config.ISOLATE_COLOR[2]) < tolerance) {
          processed[i] = 255     // R
          processed[i + 1] = 255 // G
          processed[i + 2] = 255 // B
          processed[i + 3] = 255 // A
        }
      }
      
      // Calculate threshold positions with centering - EXACTLY like Python
      calculateThresholdPositions(processed, width, height, dimensions.width, dimensions.height)
    } catch (err) {
      setError('Failed to process image data')
      console.error('Matrix Rain: Image data processing error:', err)
    }
  }

  const calculateThresholdPositions = (data: Uint8ClampedArray, width: number, height: number, screenWidth: number, screenHeight: number) => {
    console.log('MatrixRain: calculateThresholdPositions called!', {
      dataLength: data.length,
      width,
      height,
      screenWidth,
      screenHeight
    })
    
    try {
      console.log('MatrixRain: Calculating positions for image:', width, 'x', height, 'screen:', screenWidth, 'x', screenHeight)
      
      const positions = new Map<number, number[]>()
      
      // EXACTLY like Python version - center image on screen
      const screenCenterX = Math.floor(screenWidth / 2)
      const screenCenterY = Math.floor(screenHeight / 2)
      const imageCenterX = Math.floor(width / 2)
      const imageCenterY = Math.floor(height / 2)
      
      // Calculate centering offsets - same as Python translate_points_by_vector
      const offsetX = screenCenterX - imageCenterX
      const offsetY = screenCenterY - imageCenterY
      
      // Break image into blocks - EXACTLY like Python blockwise_view approach
      const blockSize = config.FONT_SIZE
      const blocksX = Math.floor(width / blockSize)
      const blocksY = Math.floor(height / blockSize)
      
      console.log('MatrixRain: Processing blocks:', blocksX, 'x', blocksY, 'block size:', blockSize)

      
      for (let x = 0; x < blocksX; x++) {
        const yPositions: number[] = []
        
        for (let y = 0; y < blocksY; y++) {
          let whitePixels = 0
          let totalPixels = 0
          
          // Count white pixels in this block - same as Python
          for (let by = 0; by < blockSize; by++) {
            for (let bx = 0; bx < blockSize; bx++) {
              const pixelX = x * blockSize + bx
              const pixelY = y * blockSize + by
              
              if (pixelX < width && pixelY < height) {
                const idx = (pixelY * width + pixelX) * 4
                // EXACTLY like Python: check for white pixels using ISOLATE_COLOR
                const r = data[idx]
                const g = data[idx + 1]
                const b = data[idx + 2]
                // Check if pixel matches ISOLATE_COLOR (white) with tolerance - same as Python
                const tolerance = 30 // Same tolerance as Python
                if (Math.abs(r - config.ISOLATE_COLOR[0]) < tolerance &&
                    Math.abs(g - config.ISOLATE_COLOR[1]) < tolerance &&
                    Math.abs(b - config.ISOLATE_COLOR[2]) < tolerance) {
                  whitePixels++
                }
                totalPixels++
              }
            }
          }
          
          // Check threshold - EXACTLY like Python (30%)
          const percentage = (whitePixels / totalPixels) * 100
          if (percentage >= config.THRESHOLD) {
            yPositions.push(y * blockSize + offsetY)
          }
        }
        
        if (yPositions.length > 0) {
          yPositions.sort((a, b) => b - a) // Reverse sort like Python
          positions.set(x * blockSize + offsetX, yPositions)
        }
      }
      
      console.log('MatrixRain: Found positions:', positions.size, 'columns')
      console.log('MatrixRain: Setting columnPositions with', positions.size, 'columns')
      setColumnPositions(positions)
    } catch (err) {
      setError('Failed to calculate positions')
      console.error('Matrix Rain: Position calculation error:', err)
    }
  }

  useEffect(() => {
    console.log('MatrixRain: Canvas useEffect triggered!', {
      dimensions,
      columnPositionsSize: columnPositions.size,
      hasCanvasRef: !!canvasRef.current
    })
    
    try {
      if (!canvasRef.current) {
        console.log('MatrixRain: Canvas ref not available')
        return
      }
      
      const width = dimensions.width || window.innerWidth || 800
      const height = dimensions.height || window.innerHeight || 600
      
      if (width === 0 || height === 0) {
        console.log('MatrixRain: Invalid dimensions:', { width, height })
        return
      }

      console.log('MatrixRain: Setting up canvas with dimensions:', dimensions)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('MatrixRain: Failed to get canvas context')
        return
      }

      canvas.width = width
      canvas.height = height
      console.log('MatrixRain: Canvas size set to:', width, 'x', height)

      // Create matrix columns based on actual image positions - EXACTLY like Python version
      const columns: MatrixColumn[] = []
      
      // Only create columns where we have actual image data
      if (columnPositions.size > 0) {
        columnPositions.forEach((yPositions, x) => {
          columns.push({
            x,
            y: Math.random() * dimensions.height,
            positions: yPositions,
            symbols: []
          })
        })
        console.log('MatrixRain: Created', columns.length, 'columns from image data')
      } else {
        // Fallback: create some basic columns if no image data
        console.log('MatrixRain: No image data, creating fallback columns')
        for (let x = 0; x < dimensions.width; x += config.FONT_SIZE * 2) {
          columns.push({
            x,
            y: Math.random() * dimensions.height,
            positions: [],
            symbols: []
          })
        }
        console.log('MatrixRain: Created', columns.length, 'fallback columns')
      }

      // Animation variables
      let animationId: number
      let lastTime = 0
      let currentAlpha = config.STARTING_ALPHA
      const targetFPS = 60
      const frameInterval = 1000 / targetFPS

      const animate = (currentTime: number) => {
        try {
          if (!ctx || !canvas) return

          if (currentTime - lastTime < frameInterval) {
            animationId = requestAnimationFrame(animate)
            return
          }

          lastTime = currentTime

          // Clear canvas with fade effect
          ctx.fillStyle = `rgba(0, 0, 0, ${(currentAlpha / 255) * 0.2})`
          ctx.fillRect(0, 0, dimensions.width, dimensions.height)

          // Test: Draw a simple background to verify canvas is working
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
          ctx.fillRect(0, 0, dimensions.width, dimensions.height)

          // Always draw some basic matrix rain to verify it's working
          for (let i = 0; i < 20; i++) {
            const x = (i * 40) % dimensions.width
            const y = (currentTime / 20 + i * 50) % (dimensions.height + 50)
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
            ctx.fillStyle = `rgba(255, 255, 255, 0.6)`
            ctx.font = `${config.FONT_SIZE}px monospace`
            ctx.textAlign = 'center'
            ctx.fillText(char, x, y)
          }

          // Update alpha
          if (currentTime % config.FADE_RATE === 0 && currentAlpha < config.ALPHA_LIMIT) {
            currentAlpha += config.FADE_ADJUSTMENT
          }

          // Draw matrix rain and symbols from image processing
          columns.forEach((column) => {
            // Draw falling matrix characters
            column.y += 1.2
            if (column.y > dimensions.height) {
              column.y = -200
            }
            
            // Place symbols when they reach positions
            if (column.positions.length > 0 && column.y >= column.positions[0]) {
              console.log('MatrixRain: Placing symbol at position:', column.positions[0])
              const symbol: MatrixSymbol = {
                x: column.x,
                y: column.positions[0],
                alpha: 255,
                color: 'white' // Use white color to match Python repository image formation
              }
              column.symbols.push(symbol)
              column.positions.shift()
            }

            // Draw all symbols in this column
            column.symbols.forEach((symbol) => {
              ctx.font = `${config.FONT_SIZE}px monospace`
              
              // Use white color for image-formed symbols to match Python repository
              const whiteIntensity = Math.random() > 0.7 ? 255 : Math.random() > 0.4 ? 200 : 150
              ctx.fillStyle = `rgba(${whiteIntensity}, ${whiteIntensity}, ${whiteIntensity}, ${(symbol.alpha / 255) * 0.9})`
              ctx.textAlign = 'center'
              
              // Use matrix characters
              const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
              ctx.fillText(char, symbol.x + config.FONT_SIZE/2, symbol.y + config.FONT_SIZE)
            })

            // Draw falling Matrix rain characters
            if (Math.random() > 0.6) {
              const fallChar = matrixChars[Math.floor(Math.random() * matrixChars.length)]
              const whiteIntensity = Math.random() > 0.6 ? 255 : 150
              ctx.fillStyle = `rgba(${whiteIntensity}, ${whiteIntensity}, ${whiteIntensity}, 0.6)`
              ctx.font = `${config.FONT_SIZE}px monospace`
              ctx.textAlign = 'center'
              ctx.fillText(fallChar, column.x + config.FONT_SIZE/2, column.y + config.FONT_SIZE)
            }
            

          })

          // Add new falling characters across the ENTIRE screen width
          if (Math.random() < 0.08) {
            const randomColumn = columns[Math.floor(Math.random() * columns.length)]
            if (randomColumn) {
              randomColumn.y = -100
            }
          }
          


          animationId = requestAnimationFrame(animate)
        } catch (err) {
          setError('Animation error')
          console.error('Matrix Rain: Animation error:', err)
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
        }
      }

      animate(0)

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      }
    } catch (err) {
      setError('Failed to initialize canvas')
      console.error('Matrix Rain: Canvas initialization error:', err)
    }
  }, [dimensions, columnPositions, drawingMode])

  // If there's an error, show a fallback
  if (error) {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-10 flex items-center justify-center">
        <div className="bg-black border border-red-500 text-red-400 px-4 py-2 rounded">
          Matrix Rain Error: {error}
        </div>
      </div>
    )
  }

  if (!isActive) return null

  // Debug info
  console.log('MatrixRain: Rendering component', {
    isActive,
    error,
    dimensions,
    projectImages: projectImages.length,
    currentImage,
    columnPositions: columnPositions.size
  })

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-auto z-10 cursor-pointer"
        style={{ 
          background: 'transparent',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        }}
        onClick={() => {
          console.log('MatrixRain: Canvas clicked!')
          changeImageManually()
        }}
      />
      

    </>
  )
}

export default TakaraMatrixRain 