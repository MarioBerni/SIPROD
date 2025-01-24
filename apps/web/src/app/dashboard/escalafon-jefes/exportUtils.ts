
interface ExportOptions {
  month: number;
  year: number;
}

export const exportToImage = async (elementId: string, options: ExportOptions) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento no encontrado');
    }

    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(element, {
      scale: 2, // Mayor calidad
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Crear el nombre del archivo con el mes y año
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const fileName = `escalafon_${monthNames[options.month]}_${options.year}.png`;

    // Convertir a blob y descargar
    canvas.toBlob((blob) => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('Error al exportar:', error);
    throw error;
  }
};
