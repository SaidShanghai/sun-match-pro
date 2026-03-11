/**
 * Compress an image file to a target max dimension and quality.
 * Returns a base64 data URL ready for OCR.
 * PDFs are returned as-is (no compression possible client-side).
 */
export async function compressImageToBase64(
  file: File,
  maxDim = 1600,
  quality = 0.8
): Promise<{ base64: string; mimeType: string }> {
  // PDFs can't be compressed client-side
  if (file.type === "application/pdf") {
    const base64 = await fileToBase64(file);
    return { base64, mimeType: file.type };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if needed
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));

      ctx.drawImage(img, 0, 0, width, height);

      // Always output as JPEG for smaller size
      const base64 = canvas.toDataURL("image/jpeg", quality);
      resolve({ base64, mimeType: "image/jpeg" });
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
