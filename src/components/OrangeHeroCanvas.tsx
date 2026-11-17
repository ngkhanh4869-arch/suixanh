import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createOrangeTextures } from '../three/orangeTextures';
import { createOrangeModel, createCitrusMistSystem, HotspotId } from '../three/createOrangeModel';
import { Sparkles, Leaf, Droplets, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface HotspotMeta {
  id: HotspotId;
  label: string;
  metric: string;
  detail: string;
  icon: 'peel' | 'mist' | 'leaf';
}

const HOTSPOTS: HotspotMeta[] = [
  {
    id: 'peel',
    label: 'Vỏ cam tái chế',
    metric: '500g vỏ tươi / viên',
    detail: 'Thu gom từ các quán nước ép, ép lạnh giữ nguyên cấu trúc tinh dầu tự nhiên.',
    icon: 'peel',
  },
  {
    id: 'mist',
    label: 'Tinh dầu D-Limonene',
    metric: 'Khử mùi H₂S & NH₃',
    detail: 'Các phân tử sương cam khuếch tán khi xả nước giúp trung hòa mùi hôi tức thì.',
    icon: 'mist',
  },
  {
    id: 'leaf',
    label: 'Sinh học pH 6.8',
    metric: 'An toàn men sứ',
    detail: 'Không axit ăn mòn, giữ nguyên hệ vi sinh có lợi trong hầm tự hoại gia đình.',
    icon: 'leaf',
  },
];

// Module-scope reusable scratch vector (zero per-frame allocations)
const _projVec = new THREE.Vector3();
const _worldPos = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _homeCamPosDesktop = new THREE.Vector3(0.4, 1.15, 5.2);
const _homeTargetDesktop = new THREE.Vector3(-1.35, 0.08, 0);
const _homeCamPosMobile = new THREE.Vector3(0.15, 1.25, 8.2);
const _homeTargetMobile = new THREE.Vector3(0, 0.72, 0);

interface OrangeHeroCanvasProps {
  showLabels: boolean;
  onToggleLabels: () => void;
  resetCounter: number;
  onResetView: () => void;
}

export const OrangeHeroCanvas: React.FC<OrangeHeroCanvasProps> = ({
  showLabels,
  onToggleLabels,
  resetCounter,
  onResetView,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const hotspotRefs = useRef<Record<HotspotId, HTMLButtonElement | null>>({
    peel: null,
    mist: null,
    leaf: null,
  });

  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeHotspotRef = useRef<HotspotId | null>(null);
  const showLabelsRef = useRef<boolean>(showLabels);
  const resetTriggerRef = useRef<boolean>(false);

  useEffect(() => {
    activeHotspotRef.current = activeHotspot;
  }, [activeHotspot]);

  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);

  useEffect(() => {
    if (resetCounter > 0) {
      resetTriggerRef.current = true;
    }
  }, [resetCounter]);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq) {
      setReducedMotion(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // Software WebGL probe (never inspect user agent)
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.touchAction = 'pan-y';
    container.appendChild(canvas);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initWidth = Math.max(container.clientWidth, 320);
    const initHeight = Math.max(container.clientHeight, 320);
    renderer.setSize(initWidth, initHeight, false);

    const scene = new THREE.Scene();

    // Studio environment reflection for realistic citrus cuticle & glossy leaves
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const isDesktopLayout = () => (container.clientWidth || window.innerWidth) >= 1024;

    const camera = new THREE.PerspectiveCamera(38, initWidth / initHeight, 0.1, 40);
    const initialCamPos = isDesktopLayout() ? _homeCamPosDesktop : _homeCamPosMobile;
    const initialTarget = isDesktopLayout() ? _homeTargetDesktop : _homeTargetMobile;
    camera.position.copy(initialCamPos);

    // 3-Point Botanical Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff9f0, 0xd8f3dc, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.35);
    keyLight.position.set(4.5, 6.2, 4.8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    const d = 2.8;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe6f4ea, 0.9);
    fillLight.position.set(-5.0, 2.0, 3.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffb703, 1.35);
    rimLight.position.set(-1.5, 4.5, -5.5);
    scene.add(rimLight);

    // Procedural textures, composite 3D orange assembly, mist & contact shadow
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const textures = createOrangeTextures(maxAnisotropy);
    const orange = createOrangeModel(textures, !isSoftwareGl);
    const mist = createCitrusMistSystem(textures.mistSpriteMap, 175);

    const showcaseGroup = new THREE.Group();
    showcaseGroup.add(orange.root);
    showcaseGroup.add(mist.points);
    scene.add(showcaseGroup);

    // Soft grounded radial contact shadow beneath the orange
    const shadowPlaneGeom = new THREE.PlaneGeometry(3.4, 3.4);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: textures.contactShadowMap,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowPlaneGeom, shadowPlaneMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -1.48;
    scene.add(contactShadow);

    // Pre-warm shaders on GPU devices
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // OrbitControls: Drag to rotate 360°, keep page vertical scroll unlocked
    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(initialTarget);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.72;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.update();

    let userInteracting = false;
    let lastInteractionTime = -10;
    let isResetting = false;
    let currentSpinSpeed = prefersReduced ? 0 : 0.26;
    let contextLost = false;
    let frameId = 0;
    let disposed = false;

    const handleControlStart = () => {
      userInteracting = true;
      isResetting = false;
      setIsDragging(true);
    };

    const handleControlEnd = () => {
      userInteracting = false;
      lastInteractionTime = clock.getElapsedTime();
      setIsDragging(false);
    };

    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('end', handleControlEnd);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      setWebglFailed(true);
    };
    const handleContextRestored = () => {
      contextLost = false;
      setWebglFailed(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    const handleResize = () => {
      if (!container || disposed) return;
      const w = Math.max(container.clientWidth, 300);
      const h = Math.max(container.clientHeight, 300);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      if (!userInteracting && !isResetting) {
        const nextTarget = isDesktopLayout() ? _homeTargetDesktop : _homeTargetMobile;
        controls.target.copy(nextTarget);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Software WebGL frame pacing helper (per threejs skill)
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const clock = new THREE.Clock();

    const updateHotspotDomPositions = () => {
      if (!showLabelsRef.current || !container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      _camDir.subVectors(camera.position, orange.root.position).normalize();

      for (const item of orange.anchors) {
        const el = hotspotRefs.current[item.id];
        if (!el) continue;

        item.anchor.getWorldPosition(_worldPos);
        _projVec.copy(_worldPos).project(camera);

        // Determine whether anchor faces camera or is slightly behind
        const relX = _worldPos.x - orange.root.position.x;
        const relY = _worldPos.y - orange.root.position.y;
        const relZ = _worldPos.z - orange.root.position.z;
        const facingDot = relX * _camDir.x + relY * _camDir.y + relZ * _camDir.z;

        const screenX = (_projVec.x * 0.5 + 0.5) * w;
        const screenY = (-_projVec.y * 0.5 + 0.5) * h;

        // Clamp inside safe visual margin so callouts stay clear of the left headline
        const minX = isDesktopLayout() ? Math.max(w * 0.42, 460) : 72;
        const minY = isDesktopLayout() ? 52 : Math.round(h * 0.44);
        const clampedX = THREE.MathUtils.clamp(screenX, minX, w - 90);
        const clampedY = THREE.MathUtils.clamp(screenY, minY, h - 76);

        const isActive = activeHotspotRef.current === item.id;
        const opacity = isActive ? 1 : facingDot > -0.35 ? 1 : 0.48;
        const scale = isActive ? 1.04 : facingDot > -0.35 ? 1 : 0.92;

        el.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(2)})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = isActive ? '30' : facingDot > 0 ? '22' : '15';
      }
    };

    const tick = () => {
      if (disposed || contextLost) return;

      const delta = Math.min(clock.getDelta(), 0.08);
      const elapsed = clock.getElapsedTime();

      // Trigger smooth damped camera return on reset request
      if (resetTriggerRef.current) {
        resetTriggerRef.current = false;
        isResetting = true;
      }

      if (isResetting) {
        const goalCam = isDesktopLayout() ? _homeCamPosDesktop : _homeCamPosMobile;
        const goalTarget = isDesktopLayout() ? _homeTargetDesktop : _homeTargetMobile;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, goalCam.x, 6, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, goalCam.y, 6, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, goalCam.z, 6, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, goalTarget.x, 6, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, goalTarget.y, 6, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, goalTarget.z, 6, delta);

        if (
          camera.position.distanceTo(goalCam) < 0.02 &&
          controls.target.distanceTo(goalTarget) < 0.02
        ) {
          camera.position.copy(goalCam);
          controls.target.copy(goalTarget);
          isResetting = false;
        }
      }

      // Smooth idle spin (pauses gently while dragging or inspecting a label)
      const shouldPauseSpin =
        prefersReduced ||
        userInteracting ||
        activeHotspotRef.current !== null ||
        elapsed - lastInteractionTime < 1.8;
      const targetSpin = shouldPauseSpin ? 0 : 0.26;
      currentSpinSpeed = THREE.MathUtils.damp(currentSpinSpeed, targetSpin, 4.5, delta);
      orange.root.rotation.y += currentSpinSpeed * delta;

      // Subtle botanical buoyancy & leaf breathing
      if (!prefersReduced) {
        const floatY = Math.sin(elapsed * 1.35) * 0.045;
        orange.root.position.y = floatY;
        orange.root.rotation.z = Math.sin(elapsed * 0.9) * 0.022;

        if (orange.leaves[0]) {
          orange.leaves[0].rotation.x = 1.18 + Math.sin(elapsed * 1.9) * 0.035;
        }
        if (orange.leaves[1]) {
          orange.leaves[1].rotation.x = 1.06 + Math.cos(elapsed * 1.7 + 0.8) * 0.03;
        }

        // Breathe contact shadow gently with vertical float
        const shadowScale = 1 - floatY * 0.35;
        contactShadow.scale.set(shadowScale, shadowScale, 1);
        shadowPlaneMat.opacity = 0.55 - floatY * 0.6;

        // Rising citrus mist particles
        mist.update(delta, elapsed);
      }

      controls.update();
      renderer.render(scene, camera);
      updateHotspotDomPositions();

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('end', handleControlEnd);
      controls.dispose();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      orange.dispose();
      mist.dispose();
      textures.dispose();
      shadowPlaneGeom.dispose();
      shadowPlaneMat.dispose();
      envTarget.dispose();
      renderer.dispose();

      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Isolated WebGL canvas mount */}
      {!webglFailed ? (
        <div
          ref={mountRef}
          className="w-full h-full"
          aria-label="Mô hình 3D tương tác quả cam tươi Sủi Xanh"
        />
      ) : (
        /* Graceful fallback if WebGL is unavailable */
        <div className="w-full h-full flex items-center justify-end pr-12 pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-700 shadow-2xl border-4 border-amber-200/40 flex flex-col items-center justify-center text-white text-center p-6">
            <Sparkles className="w-10 h-10 mb-2 text-amber-100" />
            <span className="font-bold text-base">Tinh Chất Vỏ Cam Sủi Xanh</span>
            <span className="text-[12px] text-amber-100 mt-1">
              {reducedMotion ? 'Chế độ giảm chuyển động' : 'Xem trước trực quan'}
            </span>
          </div>
        </div>
      )}

      {/* 3D-Projected Interactive Hover Callout Labels */}
      {!webglFailed && showLabels && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {HOTSPOTS.map((spot) => {
            const isOpen = activeHotspot === spot.id;
            return (
              <button
                key={spot.id}
                ref={(el) => {
                  hotspotRefs.current[spot.id] = el;
                }}
                type="button"
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot((prev) => (prev === spot.id ? null : prev))}
                onFocus={() => setActiveHotspot(spot.id)}
                onBlur={() => setActiveHotspot((prev) => (prev === spot.id ? null : prev))}
                onClick={() => setActiveHotspot((prev) => (prev === spot.id ? null : spot.id))}
                className="pointer-events-auto absolute top-0 left-0 text-left transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-xl"
                style={{ willChange: 'transform, opacity' }}
              >
                <div
                  className={`rounded-xl border transition-all duration-200 shadow-md ${
                    isOpen
                      ? 'bg-stone-900/95 text-white border-amber-400/70 px-3.5 py-2.5 max-w-[235px]'
                      : 'bg-white/95 hover:bg-white text-stone-900 border-stone-200/90 hover:border-orange-500 px-3 py-1.5'
                  }`}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isOpen
                          ? 'bg-orange-500 text-white'
                          : 'bg-emerald-900/10 text-emerald-900'
                      }`}
                    >
                      {spot.icon === 'peel' ? (
                        <Sparkles className="w-3.5 h-3.5" />
                      ) : spot.icon === 'mist' ? (
                        <Droplets className="w-3.5 h-3.5" />
                      ) : (
                        <Leaf className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <div className="leading-tight">
                      <div className="text-[12px] font-bold">{spot.label}</div>
                      <div
                        className={`text-[10px] font-medium tabular-nums ${
                          isOpen ? 'text-amber-300' : 'text-stone-500'
                        }`}
                      >
                        {spot.metric}
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <p className="mt-2 pt-2 border-t border-white/15 text-[11px] text-stone-200 leading-relaxed whitespace-normal">
                      {spot.detail}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Subtle Bottom Viewport Control Bar (Zero Central Occlusion, No backdrop-blur) */}
      <div className="absolute bottom-4 right-4 sm:right-6 lg:right-8 z-20 pointer-events-auto flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-white/92 border border-stone-200/90 text-[11px] font-medium text-stone-700 shadow-xs">
          Kéo 360° để xoay · Rê chuột lên nhãn để xem chi tiết
        </span>

        <button
          type="button"
          onClick={onToggleLabels}
          className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-stone-50 border border-stone-200 text-[11px] font-semibold text-stone-800 shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          title={showLabels ? 'Ẩn chú thích nổi' : 'Hiện chú thích nổi'}
        >
          {showLabels ? <EyeOff className="w-3.5 h-3.5 text-stone-600" /> : <Eye className="w-3.5 h-3.5 text-emerald-700" />}
          <span>{showLabels ? 'Ẩn chú thích' : 'Hiện chú thích'}</span>
        </button>

        <button
          type="button"
          onClick={onResetView}
          className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-stone-50 border border-stone-200 text-[11px] font-semibold text-stone-800 shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          title="Đặt lại góc nhìn 3D"
        >
          <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">Đặt lại góc nhìn</span>
        </button>
      </div>
    </div>
  );
};
