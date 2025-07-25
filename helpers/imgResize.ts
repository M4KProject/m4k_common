import { toArray } from "./cast";
import { clamp } from "./nbr";
import { toErr } from "./err";

export const imgFromBase64 = (base64: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const formats = ['jpeg', 'png'];
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (err?: any) => {
      const f = formats.pop();
      if (f) image.src = `data:image/${f};base64,${base64}`;
      else reject(err);
    };
    image.src = base64;
  });
}

export const imgResize = async (
  base64: string | HTMLImageElement, 
  min: number | [number, number], 
  max: number | [number, number], 
  quality: number = 0.9
) => {
  try {
    const image = typeof base64 === 'string' ? await imgFromBase64(base64) : base64;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('no ctx');
    
    // Convertir en tableaux [width, height]
    const minSize = toArray(min) as [number, number];
    const maxSize = toArray(max) as [number, number];
    
    // Calculer le ratio pour respecter les contraintes min/max
    let w = image.width;
    let h = image.height;
    let scale = 1;
    
    // D'abord, vérifier si l'image est plus petite que la taille minimale
    if (w < minSize[0] || h < minSize[1]) {
      const scaleW = minSize[0] / w;
      const scaleH = minSize[1] / h;
      scale = Math.max(scaleW, scaleH);
    }
    
    // Ensuite, vérifier si l'image est plus grande que la taille maximale
    if (w * scale > maxSize[0] || h * scale > maxSize[1]) {
      const scaleW = maxSize[0] / (w * scale);
      const scaleH = maxSize[1] / (h * scale);
      scale *= Math.min(scaleW, scaleH);
    }
    
    // Appliquer le scale final
    w = Math.round(w * scale);
    h = Math.round(h * scale);
    
    // S'assurer que les dimensions finales respectent les contraintes
    w = clamp(w, minSize[0], maxSize[0]);
    h = clamp(h, minSize[1], maxSize[1]);
    
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(image, 0, 0, w, h);
    
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
    });
    
    if (!blob) throw toErr('no resize');
    
    return blob;
  } catch (err) {
    console.error('imgResize', err);
    throw err;
  }
}