# Electron PDF FlipBook Viewer

A modern desktop application for viewing PDF files with a realistic "page-turning" effect (Flipbook), built with **Electron**, **React**, **TypeScript**, and **Vite**.

The application stands out for solving complex technical challenges such as text selection on animated surfaces and window management for an aesthetic loading experience.

## Main Features

* **Local PDF Reading:** Loads PDF files directly from the user's file system.
* **Realistic Flipbook Effect:** Smooth page-turning animation using `react-pageflip`.
* **Hybrid Text Selection:**
  * Allows selecting, copying, and highlighting text just like a native viewer.
  * Maintains the ability to drag pages from the margins or corners.
* **Custom "Frameless" UI:**
  * Hidden native titlebar.
  * Window controls (Close/Minimize) integrated into the design.
  * Custom drag region.
* **Professional Splash Screen:**
  * "Logitech" style initial loading screen (Logo -> Loader -> App).
  * Asynchronous main window loading to avoid "White flash".

## Tech Stack

* **Core:** [Electron](https://www.electronjs.org/) + [Vite](https://vitejs.dev/)
* **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **PDF Engine:** [PDF.js (pdfjs-dist)](https://mozilla.github.io/pdf.js/)
* **Book Animation:** [react-pageflip](https://github.com/Nodlik/react-pageflip)

## Installation and Usage

Ensure you have **Node.js** installed.

1. **Clone the repository:**
```bash
git clone https://github.com/Alexis-Lozada/book-viewer.git
cd book-viewer
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run in development mode:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

*(The executable will be generated in the `dist` or `release` folder depending on your configuration).*

## Technical Solutions (Deep Dive)

This project implements several advanced solutions for common Electron and Canvas issues.

### 1. The Text Selection vs. Dragging Problem

**Challenge:** `react-pageflip` intercepts clicks to move the page, preventing text selection on the PDF rendered on the Canvas.
**Solution:** Implemented "Selective Layers" technique in `Page.tsx`.

* A text layer (`.textLayer`) is rendered over the Canvas.
* `pointer-events: none` is applied to the parent container (so clicks on empty spaces pass to the book and allow dragging).
* `pointer-events: auto` is applied to individual text `<span>` elements (to allow selection).
* A `useEffect` with native events (`stopPropagation`) is used to prevent text selection from triggering page turns.

### 2. Splash Screen and Silent Loading

**Challenge:** Displaying a nice loading screen while React loads, avoiding the initial white screen.
**Solution:** Dual window architecture in `main.ts`.

1. A lightweight window (`splash.html`) with pure HTML/CSS is opened immediately.
2. The main window (`BrowserWindow`) is created with `show: false`.
3. The `ready-to-show` event of the main window is listened to.
4. After an aesthetic delay (to show the animation), the Splash is closed and the Main is shown.

## Project Structure

```
├── electron/
│   ├── main.ts          # Main Process (Windows, Splash, IPC)
│   └── preload.mts      # Secure bridge (ContextBridge)
├── src/
│   ├── components/
│   │   ├── Book.tsx     # Book logic and state management
│   │   └── Page.tsx     # Individual PDF rendering and text layer
│   ├── App.tsx          # Main UI, Drag Region, and file loading
│   └── main.tsx         # React entry point
├── public/
│   ├── splash.html      # Loading screen (Pure HTML/CSS)
│   └── ...
└── index.html
```

## Contribution

Contributions are welcome. Please open an issue to discuss major changes before creating a pull request.

## License

[MIT](https://www.google.com/search?q=LICENSE)