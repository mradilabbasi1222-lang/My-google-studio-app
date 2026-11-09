import React, { useState, useRef, useEffect } from 'react';
import { Download, Image as ImageIcon, Maximize2, Minimize2, Copy, Check, Sparkles, Eye, FileCode } from 'lucide-react';

interface DiagramRendererProps {
  svgContent: string;
  title?: string;
  className?: string;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({
  svgContent,
  title = 'Academic Diagram',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'image' | 'vector'>('image');
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean SVG string
  const cleanSvg = svgContent
    .replace(/^```(?:xml|svg)?/gi, '')
    .replace(/```$/g, '')
    .trim();

  // Automatically convert SVG to PNG Image Data URL whenever cleanSvg changes
  useEffect(() => {
    let isCancelled = false;

    const convertToPng = () => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanSvg, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');

        if (!svgEl) return;

        // Extract viewBox or default dimensions
        const viewBoxAttr = svgEl.getAttribute('viewBox');
        let width = 800;
        let height = 600;

        if (viewBoxAttr) {
          const parts = viewBoxAttr.split(/\s+|,/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            width = parts[2];
            height = parts[3];
          }
        } else {
          width = parseInt(svgEl.getAttribute('width') || '800', 10);
          height = parseInt(svgEl.getAttribute('height') || '600', 10);
        }

        // 2x Retina scale for crisp image
        const scale = 2;
        const targetWidth = width * scale;
        const targetHeight = height * scale;

        svgEl.setAttribute('width', `${targetWidth}`);
        svgEl.setAttribute('height', `${targetHeight}`);
        if (!svgEl.getAttribute('xmlns')) {
          svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }

        const serialized = new XMLSerializer().serializeToString(svgEl);
        const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
        const URLObj = window.URL || window.webkitURL || window;
        const blobUrl = URLObj.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          if (isCancelled) {
            URLObj.revokeObjectURL(blobUrl);
            return;
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Draw background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            try {
              const dataUrl = canvas.toDataURL('image/png');
              if (!isCancelled) {
                setPngDataUrl(dataUrl);
              }
            } catch (canvasErr) {
              console.warn('Canvas toDataURL warning:', canvasErr);
            }
          }
          URLObj.revokeObjectURL(blobUrl);
        };

        img.onerror = () => {
          URLObj.revokeObjectURL(blobUrl);
        };

        img.src = blobUrl;
      } catch (err) {
        console.warn('SVG conversion error:', err);
      }
    };

    // Run after tiny delay to allow fonts/styles to parse
    const timer = setTimeout(convertToPng, 100);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [cleanSvg]);

  // Convert SVG to PNG Image and trigger direct download
  const handleDownloadAsImage = () => {
    if (pngDataUrl) {
      const a = document.createElement('a');
      const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      a.download = `${sanitizedTitle}_diagram.png`;
      a.href = pngDataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    setDownloadingImage(true);
    try {
      const svgElement = containerRef.current?.querySelector('svg');
      if (!svgElement) {
        handleDownloadAsSvg();
        setDownloadingImage(false);
        return;
      }

      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      const bbox = svgElement.getBoundingClientRect();
      const width = Math.max(800, bbox.width || 800) * 2;
      const height = Math.max(600, bbox.height || 600) * 2;

      clonedSvg.setAttribute('width', `${width}`);
      clonedSvg.setAttribute('height', `${height}`);
      if (!clonedSvg.getAttribute('xmlns')) {
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URLObj = window.URL || window.webkitURL || window;
      const blobURL = URLObj.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);

          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const pngUrl = URLObj.createObjectURL(pngBlob);
              const downloadLink = document.createElement('a');
              const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
              downloadLink.download = `${sanitizedTitle}_diagram.png`;
              downloadLink.href = pngUrl;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              URLObj.revokeObjectURL(pngUrl);
            }
            setDownloadingImage(false);
          }, 'image/png');
        } else {
          setDownloadingImage(false);
        }
        URLObj.revokeObjectURL(blobURL);
      };

      image.onerror = () => {
        handleDownloadAsSvg();
        setDownloadingImage(false);
      };

      image.src = blobURL;
    } catch (err) {
      console.error('Failed to convert SVG to PNG:', err);
      handleDownloadAsSvg();
      setDownloadingImage(false);
    }
  };

  // Download directly as vector SVG
  const handleDownloadAsSvg = () => {
    const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    a.href = url;
    a.download = `${sanitizedTitle}_diagram.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySvg = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cleanSvg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`my-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''
      } ${className}`}
    >
      {/* Diagram Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
            {title}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[10px] font-bold">
            <ImageIcon className="w-3 h-3" />
            Image Form
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Mode Switch: View Image vs Vector */}
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-medium mr-1">
            <button
              onClick={() => setViewMode('image')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'image'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="View as Rasterized Image (PNG)"
            >
              <Eye className="w-3 h-3" />
              <span>Image View</span>
            </button>
            <button
              onClick={() => setViewMode('vector')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'vector'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="View as Scalable Vector (SVG)"
            >
              <FileCode className="w-3 h-3" />
              <span>Vector</span>
            </button>
          </div>

          {/* Download as Image PNG Button */}
          <button
            onClick={handleDownloadAsImage}
            disabled={downloadingImage}
            className="flex items-center gap-1.5 px-3 py-1 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors text-[11px] shadow-sm"
            title="Download this diagram as an image file (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingImage ? 'Saving...' : 'Download Image (PNG)'}</span>
          </button>

          {/* Download SVG */}
          <button
            onClick={handleDownloadAsSvg}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-[11px]"
            title="Download SVG vector"
          >
            <Download className="w-3 h-3" />
            <span>SVG</span>
          </button>

          {/* Copy code */}
          <button
            onClick={handleCopySvg}
            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Copy SVG markup"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Expand diagram'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas / Image Display Area */}
      <div
        ref={containerRef}
        className={`p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/70 overflow-auto ${
          isFullscreen ? 'flex-1' : 'min-h-[320px] max-h-[600px]'
        }`}
      >
        {viewMode === 'image' && pngDataUrl ? (
          <div className="w-full max-w-3xl flex flex-col items-center">
            <img
              src={pngDataUrl}
              alt={title}
              className="w-full h-auto max-h-[520px] object-contain rounded-xl shadow-lg border border-slate-200 dark:border-slate-800"
            />
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
              🖼️ High-Resolution PNG Image Rendered. Right click to copy or click "Download Image (PNG)".
            </p>
          </div>
        ) : (
          <div
            className="w-full max-w-3xl flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[520px] [&>svg]:drop-shadow-lg"
            dangerouslySetInnerHTML={{ __html: cleanSvg }}
          />
        )}
      </div>

      {/* Diagram Footer */}
      <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Scientific paper diagram · Fully labeled for board &amp; university exams</span>
        </span>
        <button
          onClick={handleDownloadAsImage}
          className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Save PNG to device</span>
          <Download className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// Helper to extract and separate text vs SVG blocks from AI message
export function parseMessageContent(text: string): {
  parts: Array<{ type: 'text' | 'svg'; content: string; title?: string }>;
} {
  const parts: Array<{ type: 'text' | 'svg'; content: string; title?: string }> = [];

  // Match ```xml <svg ...</svg> ``` or ```svg ... ```
  const svgRegex = /```(?:xml|svg)?\s*(<svg[\s\S]*?<\/svg>)\s*```/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = svgRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = text.slice(lastIndex, match.index).trim();
      if (textChunk) {
        parts.push({ type: 'text', content: textChunk });
      }
    }

    const svgContent = match[1];
    parts.push({
      type: 'svg',
      content: svgContent,
      title: 'Scientific Academic Diagram',
    });

    lastIndex = svgRegex.lastIndex;
  }

  // Trailing text
  if (lastIndex < text.length) {
    const textChunk = text.slice(lastIndex).trim();
    if (textChunk) {
      parts.push({ type: 'text', content: textChunk });
    }
  }

  // If no SVG blocks found via code fence, check for direct inline <svg>...</svg>
  if (parts.length === 0) {
    const rawSvgRegex = /(<svg[\s\S]*?<\/svg>)/gi;
    const rawMatch = rawSvgRegex.exec(text);
    if (rawMatch) {
      const preText = text.slice(0, rawMatch.index).trim();
      if (preText) parts.push({ type: 'text', content: preText });
      parts.push({ type: 'svg', content: rawMatch[1], title: 'Scientific Academic Diagram' });
      const postText = text.slice(rawMatch.index + rawMatch[0].length).trim();
      if (postText) parts.push({ type: 'text', content: postText });
    } else {
      parts.push({ type: 'text', content: text });
    }
  }

  return { parts };
}
