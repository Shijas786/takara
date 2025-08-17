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
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [columnPositions, setColumnPositions] = useState<Map<number, number[]>>(new Map())
  const [isActive, setIsActive] = useState(true)
  const [drawingMode, setDrawingMode] = useState<'color' | 'lines' | 'threshold'>('threshold')
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Matrix characters for rain effect
  const matrixChars = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=<>?'

  // Configuration for Matrix rain
  const config = {
    FONT_SIZE: 12,
    THRESHOLD: 25,
    ISOLATE_COLOR: [255, 255, 255], // White
    IMG_SCALE: 0.8,
    FADE_RATE: 15,
    FADE_ADJUSTMENT: 6,
    STARTING_ALPHA: 60,
    ALPHA_LIMIT: 170
  }

  // List of images from your project folder
  const projectImages = [
    '/images/tZKyyd-O_400x400.jpg',
    '/images/FuGKtynagAEYQ8l.jpeg',
    '/images/QoG0ZVgH_400x400.jpg',
    '/images/1500x500.jpeg',
    '/images/GY2mV2ybwAAmyXk.jpeg',
    '/images/XQ37CkqQ_400x400.jpg',
    '/images/d5cUIuYo_400x400.png',
    '/images/n-Yfbalt_400x400.jpg',
    '/images/GyKzxx5WkAEtjqg.jpeg',
    '/images/GyQw2aqbUAAS7zf.png',
    '/images/rnk6ixxH_400x400.jpg',
    '/takara-logo.png',
    '/favicon.png'
  ]

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  // Load random image from project folder
  useEffect(() => {
    try {
      if (projectImages.length === 0) return
      
      // Select random image
      const randomImage = projectImages[Math.floor(Math.random() * projectImages.length)]
      setCurrentImage(randomImage)
      
      // Change image every 5 seconds
      const imageInterval = setInterval(() => {
        const newRandomImage = projectImages[Math.floor(Math.random() * projectImages.length)]
        setCurrentImage(newRandomImage)
      }, 5000)

      return () => clearInterval(imageInterval)
    } catch (err) {
      setError('Failed to load images')
      console.error('Matrix Rain: Image loading error:', err)
    }
  }, [])

  // Load and process image
  useEffect(() => {
    try {
      if (!currentImage) return

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        try {
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
          
          // Process image for Matrix rain
          processImageData(data)
        } catch (err) {
          setError('Failed to process image')
          console.error('Matrix Rain: Image processing error:', err)
        }
      }
      img.onerror = () => {
        try {
          // Try next image if current fails
          const currentIndex = projectImages.indexOf(currentImage)
          const nextImage = projectImages[(currentIndex + 1) % projectImages.length]
          setCurrentImage(nextImage)
        } catch (err) {
          setError('Failed to load next image')
          console.error('Matrix Rain: Next image error:', err)
        }
      }
      img.src = currentImage
    } catch (err) {
      setError('Failed to load image')
      console.error('Matrix Rain: Image loading error:', err)
    }
  }, [currentImage])

  const processImageData = (data: ImageData) => {
    try {
      const processed = new Uint8ClampedArray(data.data.length)
      
      if (drawingMode === 'color') {
        // Isolate single color from image
        for (let i = 0; i < data.data.length; i += 4) {
          const r = data.data[i]
          const g = data.data[i + 1]
          const b = data.data[i + 2]
          
          // Check if pixel matches target color (with tolerance)
          const tolerance = 50
          if (Math.abs(r - config.ISOLATE_COLOR[0]) < tolerance &&
              Math.abs(g - config.ISOLATE_COLOR[1]) < tolerance &&
              Math.abs(b - config.ISOLATE_COLOR[2]) < tolerance) {
            processed[i] = 255     // R
            processed[i + 1] = 255 // G
            processed[i + 2] = 255 // B
            processed[i + 3] = 255 // A
          }
        }
      } else if (drawingMode === 'lines') {
        // Isolate lines from image using edge detection
        for (let i = 0; i < data.data.length; i += 4) {
          const r = data.data[i]
          const g = data.data[i + 1]
          const b = data.data[i + 2]
          
          // Simple edge detection based on brightness variation
          const brightness = (r + g + b) / 3
          if (brightness < 100 || brightness > 200) {
            processed[i] = 255
            processed[i + 1] = 255
            processed[i + 2] = 255
            processed[i + 3] = 255
          }
        }
      } else {
        // Threshold mode (default)
        for (let i = 0; i < data.data.length; i += 4) {
          const r = data.data[i]
          const g = data.data[i + 1]
          const b = data.data[i + 2]
          
          // Check if pixel is bright enough
          const brightness = (r + g + b) / 3
          if (brightness > 180) {
            processed[i] = 255     // R
            processed[i + 1] = 255 // G
            processed[i + 2] = 255 // B
            processed[i + 3] = 255 // A
          }
        }
      }
      
      // Calculate threshold positions with centering
      calculateThresholdPositions(processed, data.width, data.height, dimensions.width, dimensions.height)
    } catch (err) {
      setError('Failed to process image data')
      console.error('Matrix Rain: Image data processing error:', err)
    }
  }

  const calculateThresholdPositions = (data: Uint8ClampedArray, width: number, height: number, screenWidth: number, screenHeight: number) => {
    try {
      const positions = new Map<number, number[]>()
      
      // Calculate centering offsets
      const offsetX = Math.floor((screenWidth - width) / 2)
      const offsetY = Math.floor((screenHeight - height) / 2)
      
      // Break image into blocks
      const blockSize = config.FONT_SIZE
      const blocksX = Math.floor(width / blockSize)
      const blocksY = Math.floor(height / blockSize)
      
      for (let x = 0; x < blocksX; x++) {
        const yPositions: number[] = []
        
        for (let y = 0; y < blocksY; y++) {
          let whitePixels = 0
          let totalPixels = 0
          
          // Count white pixels in this block
          for (let by = 0; by < blockSize; by++) {
            for (let bx = 0; bx < blockSize; bx++) {
              const pixelX = x * blockSize + bx
              const pixelY = y * blockSize + by
              
              if (pixelX < width && pixelY < height) {
                const idx = (pixelY * width + pixelX) * 4
                if (data[idx + 3] > 0) {
                  whitePixels++
                }
                totalPixels++
              }
            }
          }
          
          // Check threshold
          const percentage = (whitePixels / totalPixels) * 100
          if (percentage >= config.THRESHOLD) {
            yPositions.push(y * blockSize + offsetY)
          }
        }
        
        if (yPositions.length > 0) {
          yPositions.sort((a, b) => b - a) // Reverse sort
          positions.set(x * blockSize + offsetX, yPositions)
        }
      }
      
      setColumnPositions(positions)
    } catch (err) {
      setError('Failed to calculate positions')
      console.error('Matrix Rain: Position calculation error:', err)
    }
  }

  useEffect(() => {
    try {
      if (!canvasRef.current) return
      
      const width = dimensions.width || window.innerWidth || 800
      const height = dimensions.height || window.innerHeight || 600
      
      if (width === 0 || height === 0) {
        return
      }

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = width
      canvas.height = height

      // Create matrix columns
      const columns: MatrixColumn[] = []
      const columnWidth = config.FONT_SIZE
      
      for (let x = 0; x < dimensions.width; x += columnWidth) {
        const positions = columnPositions.get(x) || []
        columns.push({
          x,
          y: Math.random() * dimensions.height,
          positions,
          symbols: []
        })
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

          // Update alpha
          if (currentTime % config.FADE_RATE === 0 && currentAlpha < config.ALPHA_LIMIT) {
            currentAlpha += config.FADE_ADJUSTMENT
          }

          // Draw matrix rain and symbols
          columns.forEach((column) => {
            // Draw falling matrix characters
            column.y += 1.2
            if (column.y > dimensions.height) {
              column.y = -200
            }
            
            // Place symbols when they reach positions
            if (column.positions.length > 0 && column.y >= column.positions[0]) {
              const symbol: MatrixSymbol = {
                x: column.x,
                y: column.positions[0],
                alpha: 255,
                color: 'green'
              }
              column.symbols.push(symbol)
              column.positions.shift()
            }

            // Draw all symbols in this column
            column.symbols.forEach((symbol) => {
              ctx.font = `${config.FONT_SIZE}px monospace`
              
              // Matrix green with variation
              const greenVariation = Math.random() > 0.7 ? 255 : Math.random() > 0.4 ? 180 : 100
              ctx.fillStyle = `rgba(0, ${greenVariation}, 0, ${(symbol.alpha / 255) * 0.4})`
              ctx.textAlign = 'center'
              
              // Use matrix characters
              const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
              ctx.fillText(char, symbol.x + config.FONT_SIZE/2, symbol.y + config.FONT_SIZE)
            })
            
            // Draw falling Matrix rain characters
            if (Math.random() > 0.6) {
              const fallChar = matrixChars[Math.floor(Math.random() * matrixChars.length)]
              const greenIntensity = Math.random() > 0.6 ? 255 : 150
              ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, 0.6)`
              ctx.font = `${config.FONT_SIZE}px monospace`
              ctx.textAlign = 'center'
              ctx.fillText(fallChar, column.x + config.FONT_SIZE/2, column.y + config.FONT_SIZE)
            }
            
            // Add extra rain characters
            if (Math.random() > 0.7) {
              const extraChar = matrixChars[Math.floor(Math.random() * matrixChars.length)]
              const extraGreen = Math.random() > 0.5 ? 200 : 100
              ctx.fillStyle = `rgba(0, ${extraGreen}, 0, 0.4)`
              ctx.font = `${config.FONT_SIZE}px monospace`
              ctx.textAlign = 'center'
              ctx.fillText(extraChar, column.x + config.FONT_SIZE/2, column.y + config.FONT_SIZE * 2)
            }
          })

          // Add new falling characters
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

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
        style={{ background: 'transparent' }}
      />
    </>
  )
}

export default TakaraMatrixRain 