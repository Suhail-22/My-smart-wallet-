// هذا مجرد ملف لإنشاء أيقونة بسيطة base64
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

iconSizes.forEach(size => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // خلفية
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(0, 0, size, size);
  
  // دائرة
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
  ctx.fill();
  
  // حرف و
  ctx.fillStyle = '#0ea5e9';
  ctx.font = `bold ${size/3}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('و', size/2, size/2);
  
  const dataURL = canvas.toDataURL('image/png');
  console.log(`icon-${size}x${size}.png: ${dataURL.substring(0, 50)}...`);
});