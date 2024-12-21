import { getPlaiceholder } from 'plaiceholder';
import sharp from 'sharp';
import React from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'jpeg';
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

/**
 * Optimiza una imagen para su uso en la web
 */
export async function optimizeImage(
  input: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<Buffer> {
  const {
    quality = 80,
    width,
    height,
    format = 'webp',
  } = options;

  let pipeline = sharp(input);

  // Redimensionar si se especifica
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'cover',
      position: 'center',
    });
  }

  // Convertir al formato especificado
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
  }

  return pipeline.toBuffer();
}

/**
 * Genera un placeholder para carga progresiva
 */
export async function generatePlaceholder(imageUrl: string) {
  try {
    // Primero obtenemos el buffer de la imagen
    const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer());
    
    // Convertimos el ArrayBuffer a Buffer
    const buffer = Buffer.from(imageBuffer);
    
    // Generamos el placeholder usando el buffer
    const { base64, css } = await getPlaiceholder(buffer, {
      size: 10,
    });

    return {
      base64,
      css,
    };
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return {
      base64: '',
      css: {},
    };
  }
}

/**
 * Componente de imagen optimizada con carga progresiva
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: OptimizedImageProps): React.ReactElement {
  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet={`${src}?format=avif&w=${width}`}
      />
      <source
        type="image/webp"
        srcSet={`${src}?format=webp&w=${width}`}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  );
}

/**
 * Hook para precargar imágenes críticas
 */
export function usePrefetchImages(urls: string[]): void {
  React.useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
}

/**
 * Obtiene metadatos de una imagen
 */
export async function getImageMetadata(imagePath: string): Promise<ImageMetadata> {
  try {
    const metadata = await sharp(imagePath).metadata();
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: metadata.size || 0,
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    throw error;
  }
}

/**
 * Genera una URL de datos para el efecto de desenfoque
 */
export async function generateBlurDataURL(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(40, 40, { fit: 'inside' })
    .blur()
    .toBuffer();
  
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

/**
 * Optimiza un archivo de imagen
 */
export async function optimizeImageFile(
  imagePath: string,
  options: { width?: number; quality?: number } = {}
): Promise<Buffer> {
  try {
    const { width = 800, quality = 80 } = options;
    
    return await sharp(imagePath)
      .resize(width, null, { fit: 'inside' })
      .webp({ quality })
      .toBuffer();
  } catch (error) {
    console.error('Error optimizing image file:', error);
    throw error;
  }
}
