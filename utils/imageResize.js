export async function resizeImageFile(file, opts = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    mimeType = "image/jpeg",
  } = opts;

  try {
    if (!file || !file.type || !file.type.startsWith("image/")) return file;
    // Skip small files
    if (file.size <= 1024 * 1024) return file; // <= 1MB

    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = URL.createObjectURL(file);
    });

    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;
    if (!srcW || !srcH) return file;

    const scale = Math.min(maxWidth / srcW, maxHeight / srcH, 1);
    const dstW = Math.max(1, Math.round(srcW * scale));
    const dstH = Math.max(1, Math.round(srcH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = dstW;
    canvas.height = dstH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    // Draw without cropping (contain behavior)
    ctx.drawImage(img, 0, 0, dstW, dstH);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        (b) => resolve(b),
        mimeType,
        typeof quality === "number" ? quality : 0.82
      );
    });

    if (!blob) return file;
    const newName = file.name?.replace(/\.\w+$/, "") || "image";
    return new File([blob], `${newName}.jpg`, { type: mimeType });
  } catch (e) {
    return file;
  }
}


