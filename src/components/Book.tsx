import { useEffect, useState } from 'react'
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

    // Book dimensions
    const BOOK_WIDTH = 400
    const BOOK_HEIGHT = 550

    // Load the PDF document once at the beginning
    useEffect(() => {
        const loadPdf = async () => {
            const loadingTask = pdfjsLib.getDocument({ data: pdfData })
            const loadedPdf = await loadingTask.promise
            setPdf(loadedPdf)
            setTotalPages(loadedPdf.numPages)
        }
        loadPdf()
    }, [pdfData])

    if (!pdf) return <p>Loading document...</p>

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '20px' }}>

            {/* FlipBook component */}
            <HTMLFlipBook
                width={BOOK_WIDTH}  // Use the constant
                height={BOOK_HEIGHT} // Use the constant
                showCover={true}
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
                        width={BOOK_WIDTH} // Use the constant
                    />
                ))}
            </HTMLFlipBook>

        </div>
    )
}