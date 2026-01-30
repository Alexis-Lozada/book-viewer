import { useState } from 'react'
import { Book } from './components/Book'
import './App.css'

function App(): JSX.Element {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null)

  const handleOpenFile = async () => {
    const data = await window.electronAPI.openFile()
    if (data) setPdfData(data)
  }

  return (
    <>
      {/* Invisible drag region for window movement */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '30px',
          zIndex: 9999,
          // @ts-ignore: React sometimes complains about this non-standard property, but it works
          WebkitAppRegion: 'drag'
        }}
      />

      <div className="container" style={{ padding: '40px 20px 20px 20px', textAlign: 'center' }}>

        <h1>PDF Viewer</h1>

        {!pdfData && (
          <div className="card">
            <button onClick={handleOpenFile}>
              📂 Select Local PDF
            </button>
          </div>
        )}

        {pdfData && (
          <div>
            <button onClick={() => setPdfData(null)} style={{ marginBottom: '10px' }}>
              ❌ Close Book
            </button>
            <Book pdfData={pdfData} />
          </div>
        )}
      </div>
    </>
  )
}

export default App