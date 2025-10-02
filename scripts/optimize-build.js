import { promises as fs } from 'fs';
import { join } from 'path';

const distDir = './dist';

async function cleanupUnnecessaryFiles() {
  try {
    // Leer el contenido del directorio dist
    const files = await fs.readdir(distDir, { recursive: true });
    
    // Encontrar archivos JS que no son esenciales (como chunks de desarrollo)
    const jsFiles = files.filter(file => 
      file.endsWith('.js') && 
      (file.includes('astro') || file.includes('content') || file.includes('sharp'))
    );
    
    console.log('📁 Archivos JS encontrados para limpieza:');
    jsFiles.forEach(file => console.log(`  - ${file}`));
    
    // Eliminar archivos JS innecesarios (cuidado: solo para sitios 100% estáticos)
    for (const file of jsFiles) {
      const filePath = join(distDir, file);
      try {
        await fs.unlink(filePath);
        console.log(`🗑️  Eliminado: ${file}`);
      } catch (error) {
        console.log(`⚠️  No se pudo eliminar: ${file}`);
      }
    }
    
    // Minificar HTML adicional
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    for (const htmlFile of htmlFiles) {
      const filePath = join(distDir, htmlFile);
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Minificación adicional de HTML
      content = content
        .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
        .replace(/>\s+</g, '><') // Espacios entre tags
        .replace(/\s+>/g, '>') // Espacios antes de cierre de tag
        .replace(/<\s+/g, '<') // Espacios después de apertura de tag
        .replace(/\s+\/>/g, '/>') // Espacios antes de self-closing tags
        .trim();
      
      await fs.writeFile(filePath, content);
      console.log(`🗜️  Minificado: ${htmlFile}`);
    }
    
    console.log('✅ Optimización completada');
    
  } catch (error) {
    console.error('❌ Error durante la optimización:', error);
  }
}

cleanupUnnecessaryFiles();