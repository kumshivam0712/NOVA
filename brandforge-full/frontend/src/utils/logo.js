export function generateLogo(brandName, niche) {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 240;
  const ctx = canvas.getContext('2d');

  const name = (brandName || 'My Brand').trim().slice(0, 18).replace(/&/g, 'and');
  const initials = name.split(/\s+/).map(word => word[0] || '').join('').slice(0, 2).toUpperCase() || 'BF';
  const accent = ['#FF6B35', '#9B6BFF', '#00D4A8'][name.length % 3];

  // background
  const gradient = ctx.createLinearGradient(0, 0, 480, 240);
  gradient.addColorStop(0, '#13131A');
  gradient.addColorStop(1, accent);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 480, 240);

  // decorative blobs
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.beginPath();
  ctx.arc(120, 120, 72, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.arc(360, 72, 42, 0, Math.PI * 2);
  ctx.fill();

  // badge
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, 58, 58, 124, 124, 28);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.font = '700 42px Arial';
  ctx.fillText(initials, 120, 138);

  ctx.textAlign = 'left';
  ctx.font = '700 26px Arial';
  ctx.fillText(name, 220, 95);
  ctx.font = '400 14px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(niche || 'Creative Brand', 220, 130);
  ctx.font = '400 16px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillText('BrandForge • Logo Ready', 220, 166);

  return canvas.toDataURL('image/png');
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
