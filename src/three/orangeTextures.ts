import * as THREE from 'three';

export interface OrangeTextureSet {
  albedoMap: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  leafAlbedoMap: THREE.CanvasTexture;
  leafNormalMap: THREE.DataTexture;
  mistSpriteMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

// Fast deterministic 2D hash & smooth value noise for organic citrus texture
function hash2(x: number, y: number, seed = 1337): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise2D(x: number, y: number, seed = 1337): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);

  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

function fbm2D(x: number, y: number, octaves = 4, seed = 1337): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * valueNoise2D(x * freq, y * freq, seed + i * 19);
    freq *= 2.02;
    amp *= 0.5;
  }
  return val;
}

function buildNormalFromHeight(
  heightField: Float32Array,
  size: number,
  strength: number
): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    const yUp = (y - 1 + size) % size;
    const yDn = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xLt = (x - 1 + size) % size;
      const xRt = (x + 1) % size;

      // Sobel gradient with horizontal wrap
      const tl = heightField[yUp * size + xLt];
      const t = heightField[yUp * size + x];
      const tr = heightField[yUp * size + xRt];
      const l = heightField[y * size + xLt];
      const r = heightField[y * size + xRt];
      const bl = heightField[yDn * size + xLt];
      const b = heightField[yDn * size + x];
      const br = heightField[yDn * size + xRt];

      const dx = (tr + 2 * r + br - (tl + 2 * l + bl)) * strength;
      const dy = (bl + 2 * b + br - (tl + 2 * t + tr)) * strength;

      let nx = -dx;
      let ny = -dy;
      let nz = 1.0;
      const invLen = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx *= invLen;
      ny *= invLen;
      nz *= invLen;

      const idx = (y * size + x) * 4;
      data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createOrangeTextures(maxAnisotropy: number): OrangeTextureSet {
  const peelSize = 512;

  // 1. Generate Citrus Peel Heightfield (oil gland pores + macro rind undulation)
  const peelHeight = new Float32Array(peelSize * peelSize);

  for (let y = 0; y < peelSize; y++) {
    const v = y / peelSize;
    const latSin = Math.max(0.28, Math.sin(v * Math.PI));
    for (let x = 0; x < peelSize; x++) {
      const u = x / peelSize;
      const ang = u * Math.PI * 2;
      const cx = Math.cos(ang) * 3.5 * latSin;
      const cz = Math.sin(ang) * 3.5 * latSin;
      const macro = fbm2D(cx + 12.4, v * 7.0 + cz * 0.35, 3, 211);
      const micro = fbm2D(cx * 5.2 + 4.1, v * 28.0 + cz * 2.1, 2, 577);
      peelHeight[y * peelSize + x] = 0.65 + macro * 0.22 + micro * 0.13;
    }
  }

  // Stamp citrus oil-gland dimples (jittered grid)
  const gridX = 56;
  const gridY = 34;
  for (let gy = 1; gy < gridY - 1; gy++) {
    const vCenter = (gy + 0.5) / gridY;
    const latFactor = Math.max(0.25, Math.sin(vCenter * Math.PI));
    const colsInRow = Math.max(10, Math.round(gridX * latFactor));

    for (let gx = 0; gx < colsInRow; gx++) {
      const jx = (hash2(gx, gy, 901) - 0.5) * 0.65;
      const jy = (hash2(gx, gy, 902) - 0.5) * 0.65;
      const pu = ((gx + 0.5 + jx) / colsInRow + 1) % 1;
      const pv = (gy + 0.5 + jy) / gridY;

      const px = Math.floor(pu * peelSize);
      const py = Math.floor(pv * peelSize);
      const radiusX = Math.max(2, Math.round((2.6 + hash2(gx, gy, 903) * 1.4) / latFactor));
      const radiusY = Math.max(2, Math.round(2.5 + hash2(gx, gy, 904) * 1.3));
      const depth = 0.24 + hash2(gx, gy, 905) * 0.2;

      for (let dy = -radiusY - 1; dy <= radiusY + 1; dy++) {
        const yy = py + dy;
        if (yy < 0 || yy >= peelSize) continue;
        const ny = dy / radiusY;
        for (let dx = -radiusX - 1; dx <= radiusX + 1; dx++) {
          const xx = (px + dx + peelSize) % peelSize;
          const nx = dx / radiusX;
          const r2 = nx * nx + ny * ny;
          if (r2 < 1.35) {
            const dist = Math.sqrt(r2);
            if (dist < 0.88) {
              const pit = Math.cos((dist / 0.88) * (Math.PI * 0.5));
              peelHeight[yy * peelSize + xx] -= depth * pit * pit;
            } else {
              const lip = Math.sin(((dist - 0.88) / 0.47) * Math.PI);
              peelHeight[yy * peelSize + xx] += depth * 0.14 * lip;
            }
          }
        }
      }
    }
  }

  // 2. Paint Albedo & Roughness canvases using the same heightfield
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = peelSize;
  albedoCanvas.height = peelSize;
  const albedoCtx = albedoCanvas.getContext('2d')!;
  const albedoImg = albedoCtx.createImageData(peelSize, peelSize);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = peelSize;
  roughCanvas.height = peelSize;
  const roughCtx = roughCanvas.getContext('2d')!;
  const roughImg = roughCtx.createImageData(peelSize, peelSize);

  for (let y = 0; y < peelSize; y++) {
    const v = y / peelSize;
    const stemBlush = Math.max(0, 1 - v * 9.5);
    const navelWarmth = Math.max(0, (v - 0.85) / 0.15);

    for (let x = 0; x < peelSize; x++) {
      const idx = y * peelSize + x;
      const pIdx = idx * 4;
      const h = peelHeight[idx];

      const u = x / peelSize;
      const ang = u * Math.PI * 2;
      const sunBlush = 0.5 + 0.5 * Math.sin(ang + 0.8);
      const mottling = fbm2D(Math.cos(ang) * 2.2 + 7, v * 5.0 + Math.sin(ang) * 2.2, 3, 409);

      // Vibrant Valencia orange RGB
      let r = 242 + sunBlush * 11 + mottling * 10;
      let g = 114 + sunBlush * 26 + mottling * 18;
      let b = 8 + mottling * 10;

      if (stemBlush > 0) {
        r = r * (1 - stemBlush * 0.32) + 128 * (stemBlush * 0.32);
        g = g * (1 - stemBlush * 0.12) + 158 * (stemBlush * 0.12);
        b = b * (1 - stemBlush * 0.25) + 34 * (stemBlush * 0.25);
      }

      if (navelWarmth > 0) {
        r -= navelWarmth * 12;
        g -= navelWarmth * 16;
      }

      const poreFactor = THREE.MathUtils.clamp((0.68 - h) / 0.35, 0, 1);
      r -= poreFactor * 26;
      g -= poreFactor * 34;
      b -= poreFactor * 4;

      albedoImg.data[pIdx] = THREE.MathUtils.clamp(Math.round(r), 0, 255);
      albedoImg.data[pIdx + 1] = THREE.MathUtils.clamp(Math.round(g), 0, 255);
      albedoImg.data[pIdx + 2] = THREE.MathUtils.clamp(Math.round(b), 0, 255);
      albedoImg.data[pIdx + 3] = 255;

      const roughVal = THREE.MathUtils.clamp(0.32 + poreFactor * 0.42 + (1 - mottling) * 0.08, 0.22, 0.82);
      const roughByte = Math.round(roughVal * 255);
      roughImg.data[pIdx] = roughByte;
      roughImg.data[pIdx + 1] = roughByte;
      roughImg.data[pIdx + 2] = roughByte;
      roughImg.data[pIdx + 3] = 255;
    }
  }

  albedoCtx.putImageData(albedoImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);

  const albedoMap = new THREE.CanvasTexture(albedoCanvas);
  albedoMap.colorSpace = THREE.SRGBColorSpace;
  albedoMap.wrapS = THREE.RepeatWrapping;
  albedoMap.wrapT = THREE.ClampToEdgeWrapping;
  albedoMap.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
  roughnessMap.anisotropy = maxAnisotropy;

  const normalMap = buildNormalFromHeight(peelHeight, peelSize, 2.8);
  normalMap.anisotropy = maxAnisotropy;

  // 3. Citrus Leaf Albedo + Vein Normal Map (256x256)
  const leafSize = 256;
  const leafHeight = new Float32Array(leafSize * leafSize);
  const leafCanvas = document.createElement('canvas');
  leafCanvas.width = leafSize;
  leafCanvas.height = leafSize;
  const leafCtx = leafCanvas.getContext('2d')!;
  const leafImg = leafCtx.createImageData(leafSize, leafSize);

  for (let y = 0; y < leafSize; y++) {
    const v = y / leafSize;
    for (let x = 0; x < leafSize; x++) {
      const u = x / leafSize;
      const distCenter = Math.abs(u - 0.5);
      const noise = fbm2D(u * 10, v * 10, 3, 701);

      const midrib = Math.exp(-Math.pow(distCenter / (0.025 * (1 - v * 0.55) + 0.008), 2));
      const veinCoord = (v - distCenter * 0.85) * 18.0;
      const veinWave = Math.pow(Math.max(0, Math.cos(veinCoord * Math.PI)), 10) * Math.max(0, 1 - distCenter * 2.1);
      const h = 0.5 + midrib * 0.35 + veinWave * 0.16 + noise * 0.04;
      leafHeight[y * leafSize + x] = h;

      let lr = 28 + noise * 18 + midrib * 48 + veinWave * 28;
      let lg = 92 + noise * 28 + midrib * 56 + veinWave * 34;
      let lb = 42 + noise * 12 + midrib * 18 + veinWave * 10;

      lr += v * 14;
      lg += v * 18;

      const idx = (y * leafSize + x) * 4;
      leafImg.data[idx] = THREE.MathUtils.clamp(Math.round(lr), 0, 255);
      leafImg.data[idx + 1] = THREE.MathUtils.clamp(Math.round(lg), 0, 255);
      leafImg.data[idx + 2] = THREE.MathUtils.clamp(Math.round(lb), 0, 255);
      leafImg.data[idx + 3] = 255;
    }
  }
  leafCtx.putImageData(leafImg, 0, 0);

  const leafAlbedoMap = new THREE.CanvasTexture(leafCanvas);
  leafAlbedoMap.colorSpace = THREE.SRGBColorSpace;
  leafAlbedoMap.anisotropy = maxAnisotropy;

  const leafNormalMap = buildNormalFromHeight(leafHeight, leafSize, 2.4);
  leafNormalMap.wrapT = THREE.ClampToEdgeWrapping;
  leafNormalMap.wrapS = THREE.ClampToEdgeWrapping;

  // 4. Rising Citrus Mist Particle Glow Sprite
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = 128;
  spriteCanvas.height = 128;
  const sCtx = spriteCanvas.getContext('2d')!;
  const sGrad = sCtx.createRadialGradient(64, 64, 2, 64, 64, 62);
  sGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  sGrad.addColorStop(0.28, 'rgba(255, 240, 200, 0.85)');
  sGrad.addColorStop(0.62, 'rgba(255, 200, 110, 0.25)');
  sGrad.addColorStop(1, 'rgba(255, 180, 70, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 128, 128);

  const mistSpriteMap = new THREE.CanvasTexture(spriteCanvas);
  mistSpriteMap.colorSpace = THREE.SRGBColorSpace;

  // 5. Soft Radial Contact Shadow Plane Map
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const shCtx = shadowCanvas.getContext('2d')!;
  const shGrad = shCtx.createRadialGradient(128, 128, 10, 128, 128, 122);
  shGrad.addColorStop(0, 'rgba(28, 38, 28, 0.44)');
  shGrad.addColorStop(0.45, 'rgba(42, 46, 36, 0.2)');
  shGrad.addColorStop(0.8, 'rgba(60, 58, 48, 0.05)');
  shGrad.addColorStop(1, 'rgba(60, 58, 48, 0)');
  shCtx.fillStyle = shGrad;
  shCtx.fillRect(0, 0, 256, 256);

  const contactShadowMap = new THREE.CanvasTexture(shadowCanvas);
  contactShadowMap.colorSpace = THREE.SRGBColorSpace;

  return {
    albedoMap,
    normalMap,
    roughnessMap,
    leafAlbedoMap,
    leafNormalMap,
    mistSpriteMap,
    contactShadowMap,
    dispose: () => {
      albedoMap.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
      leafAlbedoMap.dispose();
      leafNormalMap.dispose();
      mistSpriteMap.dispose();
      contactShadowMap.dispose();
    },
  };
}
