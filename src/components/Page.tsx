import { forwardRef, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocumentProxy } from 'pdfjs-dist'

interface PageProps {
    number: number
    pdf: PDFDocumentProxy
    width?: number
}

export const Page = forwardRef<HTMLDivElement, PageProps>(({ number, pdf, width = 400 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const textLayerRef = useRef<HTMLDivElement>(null)

    // Render PDF
    useEffect(() => {
        let renderTask: any = null

        const renderPage = async () => {
            const page = await pdf.getPage(number)

            // 1. Scale calculations
            const originalViewport = page.getViewport({ scale: 1 })
            const desiredScale = width / originalViewport.width
            const viewport = page.getViewport({ scale: desiredScale })

            // 2. Prepare Canvas
            const canvas = canvasRef.current
            if (!canvas) return

            const context = canvas.getContext('2d')
            if (!context) return

            canvas.height = viewport.height
            canvas.width = viewport.width

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            }

            renderTask = page.render(renderContext)

            try {
                await renderTask.promise
            } catch (error: any) {
                if (error.name === 'RenderingCancelledException') {
                    return
                }
                console.error('Error renderizando página PDF:', error)
            }

            // 3. Render Text Layer
            const textLayerDiv = textLayerRef.current
            if (textLayerDiv) {
                textLayerDiv.innerHTML = ''
                textLayerDiv.style.height = `${viewport.height}px`
                textLayerDiv.style.width = `${viewport.width}px`
                textLayerDiv.style.setProperty('--scale-factor', `${desiredScale}`)

                const textContent = await page.getTextContent()

                pdfjsLib.renderTextLayer({
                    textContentSource: textContent,
                    container: textLayerDiv,
                    viewport: viewport,
                    textDivs: []
                })
            }
        }

        renderPage()

        return () => {
            if (renderTask) {
                renderTask.cancel()
            }
        }
    }, [pdf, number, width])


    // Prevent event bubbling to the book
    useEffect(() => {
        const textLayerElement = textLayerRef.current
        if (!textLayerElement) return

        const stopBubbling = (e: Event) => {
            // Prevent page flip
            e.stopPropagation()
        }

        // Native events for performance
        textLayerElement.addEventListener('mousedown', stopBubbling)
        textLayerElement.addEventListener('touchstart', stopBubbling)
        textLayerElement.addEventListener('pointerdown', stopBubbling)

        return () => {
            textLayerElement.removeEventListener('mousedown', stopBubbling)
            textLayerElement.removeEventListener('touchstart', stopBubbling)
            textLayerElement.removeEventListener('pointerdown', stopBubbling)
        }
    }, [])


    return (
        <div ref={ref} className="page" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
            <div className="page-content" style={{ position: 'relative' }}>

                {/* Page number */}
                <p style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', color: '#333', zIndex: 10 }}>
                    {number}
                </p>

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: 'auto'
                    }}
                />

                {/* Text Layer */}
                <div
                    ref={textLayerRef}
                    className="textLayer"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        mixBlendMode: 'multiply',
                        zIndex: 5,
                        opacity: 1,
                        pointerEvents: 'none',
                        cursor: 'text',
                        userSelect: 'text',
                        WebkitUserSelect: 'text'
                    }}
                />
            </div>
        </div>
    )
})

Page.displayName = 'Page'