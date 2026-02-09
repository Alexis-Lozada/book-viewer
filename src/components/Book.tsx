import { useEffect, useState, useCallback, useRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocumentProxy } from 'pdfjs-dist'
import { Page } from './Page'

// Worker configuration
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

interface BookProps {
    pdfData: Uint8Array
}

export const Book = ({ pdfData }: BookProps) => {
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const flipBookRef = useRef<any>(null)

    // Book dimensions
    const BOOK_WIDTH = 400
    const BOOK_HEIGHT = 550

    // Load the PDF document
    useEffect(() => {
        const loadPdf = async () => {
            const loadingTask = pdfjsLib.getDocument({ data: pdfData })
            const loadedPdf = await loadingTask.promise
            setPdf(loadedPdf)
            setTotalPages(loadedPdf.numPages)
        }
        loadPdf()
    }, [pdfData])

    // Handler to update the state when a page is flipped
    const onPage = useCallback((e: any) => {
        setCurrentPage(e.data)
    }, [])

    if (!pdf) return <p>Loading document...</p>

    // Center the cover page by offsetting the container
    const bookContainerStyle: React.CSSProperties = {
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: currentPage === 0 ? `translateX(-${BOOK_WIDTH / 2}px)` : 'translateX(0px)',
        display: 'inline-block'
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            padding: '40px',
        }}>

            {/* Book container */}
            <div style={bookContainerStyle}>

                {/* FlipBook component */}
                <HTMLFlipBook
                    ref={flipBookRef}
                    width={BOOK_WIDTH}
                    height={BOOK_HEIGHT}
                    showCover={true}
                    onFlip={onPage}
                    className="demo-book"
                    style={{}}
                    startPage={0}
                    size="fixed"
                    minWidth={300}
                    maxWidth={1000}
                    minHeight={400}
                    maxHeight={1533}
                    drawShadow={true}
                    flippingTime={1000}
                    usePortrait={false}
                    startZIndex={0}
                    autoSize={true}
                    maxShadowOpacity={0.5}
                    mobileScrollSupport={true}
                    clickEventForward={true}
                    useMouseEvents={true}
                    swipeDistance={30}
                    showPageCorners={true}
                    disableFlipByClick={false}
                >
                    {/* Generate pages */}
                    {Array.from(new Array(totalPages), (_, index) => (
                        <Page
                            key={index}
                            number={index + 1}
                            pdf={pdf}
                            width={BOOK_WIDTH}
                        />
                    ))}
                </HTMLFlipBook>
            </div>
        </div>
    )
}