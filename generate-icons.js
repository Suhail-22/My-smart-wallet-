// generate-icons.js
const fs = require('fs');
const { createCanvas } = require('canvas');

// إنشاء أيقونة بدائية (في الإنتاج، استخدم أيقونات مصممة)
function createIcon(size, name) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // خلفية
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(0, 0, size, size);
  
  // دائرة في المنتصف
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
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/${name}`, buffer);
  console.log(`Created: ${name}`);
}

// إنشاء الأيقونات المطلوبة
createIcon(72, 'icon-72x72.png');
createIcon(96, 'icon-96x96.png');
createIcon(128, 'icon-128x128.png');
createIcon(144, 'icon-144x144.png');
createIcon(152, 'icon-152x152.png');
createIcon(192, 'icon-192x192.png');
createIcon(384, 'icon-384x384.png');
createIcon(512, 'icon-512x512.png');
createIcon(32, 'favicon-32x32.png');
createIcon(16, 'favicon-16x16.png');