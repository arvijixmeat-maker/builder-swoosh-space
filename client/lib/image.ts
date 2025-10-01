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

export async function convertImageFileToWebpDataUrl(
  file: File,
  quality: number = 0.9,
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

      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not available");
      ctx.drawImage(img, 0, 0, width, height);

      const webp = canvas.toDataURL("image/webp", Math.min(1, Math.max(0.5, quality)));
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
