export async function fileToDataURL(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
    }
  });
}

type ResizeOptions = {
  maxWidth?: number;
  targetWidth?: number;
  targetHeight?: number;
  /** aspect ratio as width/height (e.g. 16/6) */
  targetAspect?: number;
  /** background fill when letterboxing (unused for now) */
  background?: string;
};

export async function convertImageFileToWebpDataUrl(
  file: File,
  quality: number = 0.9,
  opts?: ResizeOptions,
): Promise<string> {
  try {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = url;
      });

      const srcW = img.naturalWidth || img.width;
      const srcH = img.naturalHeight || img.height;

      // Determine crop region if target aspect is provided
      let cropX = 0,
        cropY = 0,
        cropW = srcW,
        cropH = srcH;
      if (opts?.targetAspect && opts.targetAspect > 0) {
        const srcAspect = srcW / srcH;
        const targetAspect = opts.targetAspect;
        if (srcAspect > targetAspect) {
          // too wide: crop width
          cropH = srcH;
          cropW = Math.round(cropH * targetAspect);
          cropX = Math.round((srcW - cropW) / 2);
          cropY = 0;
        } else if (srcAspect < targetAspect) {
          // too tall: crop height
          cropW = srcW;
          cropH = Math.round(cropW / targetAspect);
          cropX = 0;
          cropY = Math.round((srcH - cropH) / 2);
        }
      }

      // Determine output size
      let outW = cropW;
      let outH = cropH;
      if (opts?.targetWidth) {
        outW = Math.min(opts.targetWidth, cropW);
        outH = Math.round(outW / (opts?.targetAspect ? opts.targetAspect : cropW / cropH));
      } else if (opts?.targetHeight) {
        outH = Math.min(opts.targetHeight, cropH);
        outW = Math.round(outH * (opts?.targetAspect ? opts.targetAspect : cropW / cropH));
      } else if (opts?.maxWidth) {
        if (cropW > opts.maxWidth) {
          outW = opts.maxWidth;
          outH = Math.round(outW * (cropH / cropW));
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(outW));
      canvas.height = Math.max(1, Math.floor(outH));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not available");
      if (opts?.background) {
        ctx.fillStyle = opts.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw cropped source scaled into output canvas
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropW,
        cropH,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const webp = canvas.toDataURL(
        "image/webp",
        Math.min(1, Math.max(0.5, quality)),
      );
      if (typeof webp === "string" && webp.startsWith("data:image/webp")) {
        return webp;
      }
      // Fallback to original data URL if WebP is not supported
      return await fileToDataURL(file);
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    // Final fallback
    return await fileToDataURL(file);
  }
}
