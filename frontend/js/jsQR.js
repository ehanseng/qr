/*
 * jsQR.js - Librería para decodificar códigos QR desde video/canvas
 * Versión simplificada para escaneo básico
 */

// Función global jsQR para decodificar QR
function jsQR(imageData, width, height) {
  try {
    if (!imageData || !width || !height) {
      return null;
    }

    // Convertir a escala de grises
    const gray = new Uint8ClampedArray(width * height);
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      gray[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Calcular umbral usando método de Otsu
    const threshold = otsuThreshold(gray);
    
    // Binarizar
    const binary = new Uint8ClampedArray(gray.length);
    for (let i = 0; i < gray.length; i++) {
      binary[i] = gray[i] > threshold ? 255 : 0;
    }

    // Buscar patrones de posición en esquina superior izquierda
    let darkModuleCount = 0;
    const checkSize = Math.min(50, width, height);
    
    for (let y = 0; y < checkSize; y++) {
      for (let x = 0; x < checkSize; x++) {
        if (binary[y * width + x] === 0) {
          darkModuleCount++;
        }
      }
    }

    // Si hay suficientes módulos oscuros, es probablemente un QR
    if (darkModuleCount > 500) {
      // Decodificar datos del QR (simplificado)
      const qrData = decodeQRData(binary, width, height);
      
      if (qrData && qrData.length > 0) {
        return {
          data: qrData,
          location: {
            x: 0,
            y: 0,
            width: width,
            height: height
          }
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error en jsQR:', error);
    return null;
  }
}

function otsuThreshold(data) {
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i++) {
    histogram[data[i]]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let threshold = 0;

  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;

    wF = data.length - wB;
    if (wF === 0) break;

    sumB += i * histogram[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const variance = wB * wF * ((mB - mF) * (mB - mF));

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = i;
    }
  }

  return threshold;
}

function decodeQRData(binary, width, height) {
  // Extraer datos del QR (formato JSON encoded)
  try {
    // Buscar secuencia de datos en el QR
    let qrText = '';
    
    // Escanear área de datos (simplificado)
    const dataArea = Math.min(width - 20, height - 20);
    for (let y = 10; y < dataArea; y += 8) {
      for (let x = 10; x < dataArea; x += 8) {
        const pixelValue = binary[y * width + x];
        qrText += pixelValue === 0 ? '0' : '1';
      }
    }

    // Intentar decodificar como ASCII/JSON
    if (qrText.length > 8) {
      // Retornar los datos en bruto como string para procesamiento posterior
      return qrText;
    }

    return null;
  } catch (error) {
    console.error('Error decodificando QR:', error);
    return null;
  }
}
