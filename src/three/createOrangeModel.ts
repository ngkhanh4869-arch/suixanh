import * as THREE from 'three';
import { OrangeTextureSet } from './orangeTextures';

export type HotspotId = 'peel' | 'mist' | 'leaf';

export interface OrangeHotspotAnchor {
  id: HotspotId;
  anchor: THREE.Object3D;
}

export interface OrangeModelHandle {
  root: THREE.Group;
  leaves: THREE.Mesh[];
  anchors: OrangeHotspotAnchor[];
  dispose: () => void;
}

export interface CitrusMistHandle {
  points: THREE.Points;
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

function createCitrusLeafGeometry(length: number, width: number): THREE.BufferGeometry {
  const segX = 14;
  const segY = 22;
  const geom = new THREE.PlaneGeometry(width, length, segX, segY);
  geom.translate(0, length * 0.5, 0);

  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const t = THREE.MathUtils.clamp(y / length, 0, 1);
    const uNorm = x / (width * 0.5);

    const profile =
      Math.pow(Math.sin(t * Math.PI), 0.78) * (1 - 0.18 * t) + 0.04 * (1 - t);
    const shapedX = uNorm * (width * 0.5) * profile;

    const archZ = -Math.pow(t, 1.65) * length * 0.24 + Math.sin(t * Math.PI) * 0.08;
    const midribV = Math.abs(uNorm) * 0.065 * Math.sin(t * Math.PI);
    const ripple = Math.sin(t * 9.0) * 0.012 * Math.abs(uNorm);

    pos.setXYZ(i, shapedX, y, archZ + midribV + ripple);
  }

  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

export function createOrangeModel(
  textures: OrangeTextureSet,
  castShadow: boolean
): OrangeModelHandle {
  const root = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  // 1. Primary Silhouette: Sculpted Oblate Valencia Orange Body
  const bodyGeom = new THREE.SphereGeometry(1.18, 96, 72);
  geometries.push(bodyGeom);

  const pos = bodyGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const ny = y / len;
    const angle = Math.atan2(z, x);

    y *= 0.93;

    const radialWeight = Math.pow(Math.max(0, 1 - ny * ny), 0.75);
    const rib = 1 + 0.014 * Math.sin(angle * 9.0 + 0.4) * radialWeight;
    const asym = 1 + 0.022 * Math.sin(angle * 2.0 + ny * 1.4);
    x *= rib * asym;
    z *= rib * asym;

    if (ny > 0.78) {
      const poleT = (ny - 0.78) / 0.22;
      const cup = Math.sin(poleT * Math.PI * 0.5);
      y -= cup * cup * 0.075;
    }

    if (ny < -0.84) {
      const botT = (-ny - 0.84) / 0.16;
      y += botT * botT * 0.045;
    }

    pos.setXYZ(i, x, y, z);
  }
  pos.needsUpdate = true;
  bodyGeom.computeVertexNormals();
  if (bodyGeom.attributes.uv && bodyGeom.index) {
    bodyGeom.computeTangents();
  }

  const peelMat = new THREE.MeshPhysicalMaterial({
    map: textures.albedoMap,
    normalMap: textures.normalMap,
    normalScale: new THREE.Vector2(0.95, 0.95),
    roughnessMap: textures.roughnessMap,
    roughness: 0.78,
    metalness: 0.0,
    clearcoat: 0.34,
    clearcoatRoughness: 0.26,
    sheen: 0.14,
    sheenRoughness: 0.7,
    sheenColor: new THREE.Color(0xffcfa0),
    envMapIntensity: 0.9,
  });
  materials.push(peelMat);

  const orangeBody = new THREE.Mesh(bodyGeom, peelMat);
  orangeBody.castShadow = castShadow;
  orangeBody.receiveShadow = true;
  root.add(orangeBody);

  // 2. Secondary Read: 5-Point Botanical Calyx Star Cap
  const calyxMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x4f6d31),
    roughness: 0.76,
    metalness: 0.0,
  });
  materials.push(calyxMat);

  const calyxGroup = new THREE.Group();
  calyxGroup.position.set(0, 1.03, 0);

  const calyxRingGeom = new THREE.CylinderGeometry(0.11, 0.14, 0.055, 16);
  geometries.push(calyxRingGeom);
  const calyxRing = new THREE.Mesh(calyxRingGeom, calyxMat);
  calyxRing.castShadow = castShadow;
  calyxGroup.add(calyxRing);

  const sepalShape = new THREE.Shape();
  sepalShape.moveTo(0, 0);
  sepalShape.quadraticCurveTo(0.055, 0.07, 0.015, 0.18);
  sepalShape.lineTo(0, 0.21);
  sepalShape.lineTo(-0.015, 0.18);
  sepalShape.quadraticCurveTo(-0.055, 0.07, 0, 0);

  const sepalGeom = new THREE.ExtrudeGeometry(sepalShape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.006,
    bevelSegments: 2,
  });
  geometries.push(sepalGeom);

  for (let s = 0; s < 5; s++) {
    const sepal = new THREE.Mesh(sepalGeom, calyxMat);
    const theta = (s / 5) * Math.PI * 2 + 0.25;
    sepal.rotation.y = theta;
    sepal.rotation.x = Math.PI * 0.44;
    sepal.position.set(Math.sin(theta) * 0.07, 0.01, Math.cos(theta) * 0.07);
    sepal.castShadow = castShadow;
    calyxGroup.add(sepal);
  }
  root.add(calyxGroup);

  // 3. Woody Curved Stem Pedicel
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.03, 0),
    new THREE.Vector3(0.02, 1.18, 0.01),
    new THREE.Vector3(0.07, 1.32, -0.02),
    new THREE.Vector3(0.13, 1.41, -0.05),
  ]);
  const stemGeom = new THREE.TubeGeometry(stemCurve, 14, 0.042, 10, false);
  geometries.push(stemGeom);

  const stemMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x5c4427),
    roughness: 0.88,
    metalness: 0.0,
  });
  materials.push(stemMat);

  const stemMesh = new THREE.Mesh(stemGeom, stemMat);
  stemMesh.castShadow = castShadow;
  root.add(stemMesh);

  const capGeom = new THREE.CircleGeometry(0.041, 10);
  geometries.push(capGeom);
  const capMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xb6a173),
    roughness: 0.72,
  });
  materials.push(capMat);
  const capMesh = new THREE.Mesh(capGeom, capMat);
  capMesh.position.set(0.13, 1.41, -0.05);
  capMesh.lookAt(0.24, 1.56, -0.1);
  root.add(capMesh);

  // 4. Dual Botanical Citrus Leaves
  const leafMat = new THREE.MeshPhysicalMaterial({
    map: textures.leafAlbedoMap,
    normalMap: textures.leafNormalMap,
    normalScale: new THREE.Vector2(0.75, 0.75),
    roughness: 0.28,
    metalness: 0.0,
    clearcoat: 0.42,
    clearcoatRoughness: 0.22,
    side: THREE.DoubleSide,
    envMapIntensity: 0.95,
  });
  materials.push(leafMat);

  const leaves: THREE.Mesh[] = [];

  const mainLeafGeom = createCitrusLeafGeometry(1.18, 0.56);
  geometries.push(mainLeafGeom);
  const mainLeaf = new THREE.Mesh(mainLeafGeom, leafMat);
  mainLeaf.position.set(0.05, 1.24, -0.01);
  mainLeaf.rotation.set(1.18, 0.42, -0.78);
  mainLeaf.castShadow = castShadow;
  mainLeaf.receiveShadow = true;
  root.add(mainLeaf);
  leaves.push(mainLeaf);

  const secondaryLeafGeom = createCitrusLeafGeometry(0.78, 0.38);
  geometries.push(secondaryLeafGeom);
  const secondaryLeaf = new THREE.Mesh(secondaryLeafGeom, leafMat);
  secondaryLeaf.position.set(0.03, 1.21, 0.01);
  secondaryLeaf.rotation.set(1.06, -0.55, 0.85);
  secondaryLeaf.castShadow = castShadow;
  secondaryLeaf.receiveShadow = true;
  root.add(secondaryLeaf);
  leaves.push(secondaryLeaf);

  // 5. Accent Detail: Surface Essential Oil / Dew Micro-Droplets
  const dropGeom = new THREE.SphereGeometry(0.022, 10, 8);
  geometries.push(dropGeom);
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xfff6e5),
    roughness: 0.06,
    metalness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.82,
    envMapIntensity: 1.4,
  });
  materials.push(dropMat);

  const dropCount = 26;
  const droplets = new THREE.InstancedMesh(dropGeom, dropMat, dropCount);
  const dummy = new THREE.Object3D();

  for (let d = 0; d < dropCount; d++) {
    const phi = ((d * 137.5) % 360) * (Math.PI / 180);
    const theta = 0.36 + ((d * 29) % 52) * 0.011;
    const r = 1.185;
    const dx = Math.sin(theta) * Math.cos(phi) * r;
    const dy = Math.cos(theta) * r * 0.93;
    const dz = Math.sin(theta) * Math.sin(phi) * r;

    dummy.position.set(dx, dy, dz);
    dummy.lookAt(dx * 2, dy * 2, dz * 2);
    const s = 0.55 + ((d * 17) % 10) * 0.08;
    dummy.scale.set(s, s, s * 0.62);
    dummy.updateMatrix();
    droplets.setMatrixAt(d, dummy.matrix);
  }
  droplets.instanceMatrix.needsUpdate = true;
  droplets.computeBoundingSphere();
  root.add(droplets);

  // 6. 3D-Anchored Callout Targets
  const peelAnchor = new THREE.Object3D();
  peelAnchor.position.set(-0.92, -0.22, 0.82);
  root.add(peelAnchor);

  const mistAnchor = new THREE.Object3D();
  mistAnchor.position.set(0.95, 0.65, 0.55);
  root.add(mistAnchor);

  const leafAnchor = new THREE.Object3D();
  leafAnchor.position.set(0.45, 1.38, -0.15);
  root.add(leafAnchor);

  return {
    root,
    leaves,
    anchors: [
      { id: 'peel', anchor: peelAnchor },
      { id: 'mist', anchor: mistAnchor },
      { id: 'leaf', anchor: leafAnchor },
    ],
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}

export function createCitrusMistSystem(
  mistSpriteMap: THREE.Texture,
  count = 175
): CitrusMistHandle {
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const baseAngles = new Float32Array(count);
  const baseRadii = new Float32Array(count);
  const speeds = new Float32Array(count);
  const phases = new Float32Array(count);
  const heights = new Float32Array(count);

  const cAmber = new THREE.Color(0xff9f1c);
  const cGold = new THREE.Color(0xffd166);
  const cBotanical = new THREE.Color(0x52b788);
  const tmpColor = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.65 + Math.random() * 1.35;
    const y = -0.9 + Math.random() * 3.1;

    baseAngles[i] = angle;
    baseRadii[i] = radius;
    heights[i] = y;
    speeds[i] = 0.22 + Math.random() * 0.34;
    phases[i] = Math.random() * Math.PI * 2;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const palettePick = Math.random();
    if (palettePick < 0.56) {
      tmpColor.copy(cAmber).lerp(cGold, Math.random() * 0.6);
    } else if (palettePick < 0.85) {
      tmpColor.copy(cGold);
    } else {
      tmpColor.copy(cBotanical);
    }

    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.16,
    map: mistSpriteMap,
    vertexColors: true,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.NormalBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geom, mat);

  const update = (delta: number, elapsed: number) => {
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      heights[i] += speeds[i] * dt;
      if (heights[i] > 2.25) {
        heights[i] = -0.95 + (heights[i] - 2.25) * 0.15;
      }

      const normH = (heights[i] + 0.95) / 3.2;
      const swirlAngle = baseAngles[i] + elapsed * 0.18 + Math.sin(elapsed * 0.5 + phases[i]) * 0.25;
      const spreadRadius = baseRadii[i] * (0.85 + normH * 0.42) + Math.sin(elapsed * 0.8 + phases[i]) * 0.08;

      arr[i * 3] = Math.cos(swirlAngle) * spreadRadius;
      arr[i * 3 + 1] = heights[i];
      arr[i * 3 + 2] = Math.sin(swirlAngle) * spreadRadius;
    }

    posAttr.needsUpdate = true;
  };

  return {
    points,
    update,
    dispose: () => {
      geom.dispose();
      mat.dispose();
    },
  };
}
