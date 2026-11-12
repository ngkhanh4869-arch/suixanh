import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Wind, CheckCircle2, FlaskConical, Droplets, ShieldCheck, AlertCircle, Volume2, VolumeX, Star, Quote, RefreshCw, X } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  opacity: number;
  color: string;
  glow: boolean;
}

interface ScentRing {
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

interface OdorWisp {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  pulseOffset: number;
  label: 'H₂S' | 'NH₃';
}

interface CustomerReview {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  role: string;
  product: string;
  rating: number;
  timeAgo: string;
  comment: string;
}

const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Lê Minh Anh',
    initials: 'MA',
    avatarBg: 'bg-emerald-600',
    role: 'Sinh viên Năm 1, FTU (Ký túc xá Chùa Láng)',
    product: 'Combo Khởi Động 3 Viên (19.000đ)',
    rating: 5,
    timeAgo: 'Đã mua 2 ngày trước',
    comment: 'Phòng trọ cũ mùi hôi cống bốc lên nồng nặc, dùng thử 1 viên sủi vỏ cam mùi thơm thoang thoảng dịu nhẹ cả ngày. Không bị sặc mùi clo hay hóa chất tẩy độc hại như nước tẩy thường!',
  },
  {
    id: 'rev-2',
    name: 'Nguyễn Phương Thảo',
    initials: 'PT',
    avatarBg: 'bg-amber-600',
    role: 'Sinh viên Học viện Ngoại giao DAV (Thuê trọ ngõ 59)',
    product: 'Hộp Refill 6 Viên (36.000đ)',
    rating: 5,
    timeAgo: 'Đã mua 4 ngày trước',
    comment: 'Giá chỉ 6k - 7k một viên mà xả nước bọt sủi xè xè thích mắt cực kỳ. Bồn cầu trắng sạch không bám vệt ố vàng, quan trọng nhất là bảo vệ được hệ vi sinh hầm tự hoại.',
  },
  {
    id: 'rev-3',
    name: 'Trần Vân Anh',
    initials: 'VA',
    avatarBg: 'bg-teal-600',
    role: 'Căn hộ EcoGreen, Q. Cầu Giấy',
    product: 'Combo Tiết Kiệm 12 Viên (69.000đ)',
    rating: 5,
    timeAgo: 'Đã mua 1 tuần trước',
    comment: 'Nhà có con nhỏ nên rất sợ dùng hóa chất axit độc hại. Chuyển sang Sủi Xanh từ vỏ cam tái chế thấy an tâm hẳn, bồn cầu lúc nào cũng thơm thoang thoảng mùi vỏ cam tự nhiên.',
  },
  {
    id: 'rev-4',
    name: 'Phạm Hải Nam',
    initials: 'HN',
    avatarBg: 'bg-orange-600',
    role: 'Sinh viên Năm 2, ĐH Ngoại Thương',
    product: 'Gói Trải Nghiệm Dùng Thử (7.000đ)',
    rating: 5,
    timeAgo: 'Đã mua hôm qua',
    comment: 'Bất ngờ vì viên nén tan rất chậm, xả cả tuần mà vẫn sủi bọt ngát hương cam. Giá 7k sinh viên nào cũng mua được, cực kỳ ủng hộ dự án tái chế rác hữu cơ vì môi trường!',
  },
  {
    id: 'rev-5',
    name: 'Đỗ Thị Phương Lam',
    initials: 'PL',
    avatarBg: 'bg-emerald-700',
    role: 'Chung cư mini Phố Chùa Láng',
    product: 'Combo Khởi Động 3 Viên (19.000đ)',
    rating: 5,
    timeAgo: 'Đã mua 3 ngày trước',
    comment: 'Mỗi lần gạt xả nước là bọt cam nổi lên cuốn sạch phân tử mùi hôi H₂S và NH₃, vào nhà vệ sinh không còn cảm giác bí bách khó chịu nữa. Rất recommend các bạn sinh viên dùng thử!',
  },
  {
    id: 'rev-6',
    name: 'Bùi Mai Trang',
    initials: 'MT',
    avatarBg: 'bg-amber-700',
    role: 'Học viện Thanh thiếu niên VYA',
    product: 'Hộp Refill 6 Viên (36.000đ)',
    rating: 5,
    timeAgo: 'Đã mua 5 ngày trước',
    comment: 'Mùi tinh dầu cam D-Limonene thật 100%, không phải hương liệu tổng hợp nhân tạo. Vừa khử mùi hôi cống nhanh vừa bảo vệ sức khỏe đường hô hấp.',
  },
];

export const InteractiveFizzLab: React.FC = () => {
  const [isFizzing, setIsFizzing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [odorLevel, setOdorLevel] = useState(100);
  const [aromaLevel, setAromaLevel] = useState(0);
  const [flushCount, setFlushCount] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeReview, setActiveReview] = useState<CustomerReview | null>(null);
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const hasChimedRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const scentRingsRef = useRef<ScentRing[]>([]);
  const odorWispsRef = useRef<OdorWisp[]>([]);
  const odorLevelRef = useRef(100);

  // Web Audio Context refs for realistic procedural bubbling
  const audioCtxRef = useRef<AudioContext | null>(null);
  const fizzNoiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const fizzGainNodeRef = useRef<GainNode | null>(null);
  const fizzModOscRef = useRef<OscillatorNode | null>(null);
  // Persistent reference to all active audio graph nodes to prevent V8 GC from collecting them
  const audioGraphNodesRef = useRef<any[]>([]);

  // Sync odorLevelRef for canvas 60fps loop
  useEffect(() => {
    odorLevelRef.current = odorLevel;
  }, [odorLevel]);

  // Audio helper: Initialize or resume AudioContext
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  // Start realistic Vitamin C effervescent "xè xè" sizzle sound (runs steadily throughout the whole fizz cycle)
  const startFizzAudio = async () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Ignore
      }
    }

    try {
      // Clean up previous nodes first
      stopFizzAudio(true);

      // 1. Generate 6 seconds of seamless high-definition granulated fizz buffer
      const bufferDuration = 6;
      const bufferSize = ctx.sampleRate * bufferDuration;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Granular crackle spikes mimicking rapid effervescent CO2 micro-bubbles
        const crackle = Math.random() > 0.88 ? (Math.random() * 2.0 - 1.0) : 0;
        const raw = white * 0.72 + crackle * 0.28;
        output[i] = raw - lastOut * 0.38; // Emphasize crisp high-frequency sizzle
        lastOut = raw;
      }

      // Smooth crossfade loop boundaries (first and last 1500 samples) to ensure zero pop/cutout
      const fadeSamples = Math.min(1500, Math.floor(bufferSize * 0.05));
      for (let i = 0; i < fadeSamples; i++) {
        const factor = i / fadeSamples;
        output[i] = output[i] * factor;
        output[bufferSize - 1 - i] = output[bufferSize - 1 - i] * factor;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      noiseSource.loopStart = 0;
      noiseSource.loopEnd = bufferDuration;

      // 2. High-pass filter to eliminate dull hum and keep only crisp fizz
      const highPass = ctx.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.setValueAtTime(1200, ctx.currentTime);

      // 3. Resonant Band-pass filter tuned to Vitamin C effervescence (3600Hz, Q = 2.2, +9dB)
      const fizzBand = ctx.createBiquadFilter();
      fizzBand.type = 'peaking';
      fizzBand.frequency.setValueAtTime(3600, ctx.currentTime);
      fizzBand.gain.setValueAtTime(8, ctx.currentTime);
      fizzBand.Q.setValueAtTime(2.2, ctx.currentTime);

      // 4. Air hiss filter for the fine micro-bubbles (7200Hz, +6dB)
      const airHiss = ctx.createBiquadFilter();
      airHiss.type = 'peaking';
      airHiss.frequency.setValueAtTime(7200, ctx.currentTime);
      airHiss.gain.setValueAtTime(6, ctx.currentTime);
      airHiss.Q.setValueAtTime(1.5, ctx.currentTime);

      // 5. Hardware-level Tremolo/Flutter Modulator for natural "xè xè xè" effervescent texture (36Hz)
      const tremoloOsc = ctx.createOscillator();
      tremoloOsc.type = 'sine';
      tremoloOsc.frequency.setValueAtTime(36, ctx.currentTime);

      const tremoloDepth = ctx.createGain();
      tremoloDepth.gain.setValueAtTime(0.08, ctx.currentTime);

      const tremoloNode = ctx.createGain();
      tremoloNode.gain.setValueAtTime(0.92, ctx.currentTime);

      tremoloOsc.connect(tremoloDepth);
      tremoloDepth.connect(tremoloNode.gain);
      tremoloOsc.start();

      // 6. Master Gain Envelope: Solid, steady volume running throughout the cycle
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.14, ctx.currentTime);

      // Audio Graph Connection:
      // Noise -> HighPass -> FizzBand -> AirHiss -> TremoloNode -> MasterGain -> Destination
      noiseSource.connect(highPass);
      highPass.connect(fizzBand);
      fizzBand.connect(airHiss);
      airHiss.connect(tremoloNode);
      tremoloNode.connect(masterGain);
      masterGain.connect(ctx.destination);

      noiseSource.start();

      // Store in refs AND in audioGraphNodesRef array to prevent GC from breaking connections
      fizzNoiseNodeRef.current = noiseSource;
      fizzGainNodeRef.current = masterGain;
      fizzModOscRef.current = tremoloOsc;
      audioGraphNodesRef.current = [
        noiseSource,
        highPass,
        fizzBand,
        airHiss,
        tremoloNode,
        tremoloDepth,
        tremoloOsc,
        masterGain,
      ];
    } catch {
      // Ignore
    }
  };

  // Stop fizz audio smoothly without pops or sudden cutouts
  const stopFizzAudio = (immediate = false) => {
    const nodes = audioGraphNodesRef.current;
    if (fizzGainNodeRef.current && audioCtxRef.current) {
      try {
        const now = audioCtxRef.current.currentTime;
        if (immediate) {
          fizzGainNodeRef.current.gain.setValueAtTime(0.0001, now);
        } else {
          fizzGainNodeRef.current.gain.setTargetAtTime(0.0001, now, 0.08);
        }
      } catch {
        // Ignore
      }
    }

    const cleanup = () => {
      try {
        if (fizzNoiseNodeRef.current) {
          try { fizzNoiseNodeRef.current.stop(); } catch {}
          try { fizzNoiseNodeRef.current.disconnect(); } catch {}
          fizzNoiseNodeRef.current = null;
        }
        if (fizzModOscRef.current) {
          try { fizzModOscRef.current.stop(); } catch {}
          try { fizzModOscRef.current.disconnect(); } catch {}
          fizzModOscRef.current = null;
        }
        if (fizzGainNodeRef.current) {
          try { fizzGainNodeRef.current.disconnect(); } catch {}
          fizzGainNodeRef.current = null;
        }
        nodes.forEach((n) => {
          try {
            if (n && typeof n.disconnect === 'function') n.disconnect();
          } catch {
            // Ignore
          }
        });
        audioGraphNodesRef.current = [];
      } catch {
        // Ignore
      }
    };

    if (immediate) {
      cleanup();
    } else {
      setTimeout(cleanup, 220);
    }
  };

  // Play gentle clean chime when odor is 100% neutralized
  const playCleanChime = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + idx * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.045, noteTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.5);
      });
    } catch {
      // Ignore
    }
  };

  // Audio synchronization with isFizzing, isPaused, and isMuted states
  useEffect(() => {
    if (isFizzing && !isPaused && !isMuted) {
      if (!fizzGainNodeRef.current || !fizzNoiseNodeRef.current) {
        startFizzAudio();
      } else if (audioCtxRef.current) {
        try {
          if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume().catch(() => {});
          }
          fizzGainNodeRef.current.gain.setTargetAtTime(0.14, audioCtxRef.current.currentTime, 0.04);
        } catch {
          // Ignore
        }
      }
    } else {
      stopFizzAudio(false);
    }
  }, [isFizzing, isPaused, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopFizzAudio(true);
    };
  }, []);

  // Simulation timer: Continuous effervescence by default
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFizzing && !isPaused) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Once 100% odor neutralization is achieved, sound chime once and continue bubbling & scenting
            if (!hasChimedRef.current) {
              hasChimedRef.current = true;
              playCleanChime();
            }
            setOdorLevel(0);
            setAromaLevel(100);
            return 100;
          }
          // Steady, smooth progression lasting ~16-18 seconds so user can fully experience the fizz reaction
          const next = Math.min(100, prev + 0.65);
          setOdorLevel(Math.max(0, Math.round(100 - next * 1.05)));
          setAromaLevel(Math.min(100, Math.round(next * 0.95)));
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isFizzing, isPaused]);

  // HTML5 Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 360;
      }
    };
    window.addEventListener('resize', handleResize);

    const tabletX = width / 2;
    const tabletY = height - 95;

    // Seed distinct odor wisps and molecules (H2S, NH3)
    if (odorWispsRef.current.length === 0) {
      for (let i = 0; i < 18; i++) {
        odorWispsRef.current.push({
          x: Math.random() * (width - 60) + 30,
          y: Math.random() * 80 + 16,
          radius: Math.random() * 7 + 10,
          speedX: (Math.random() - 0.5) * 0.35,
          speedY: (Math.random() - 0.5) * 0.25,
          pulseOffset: Math.random() * Math.PI * 2,
          label: i % 2 === 0 ? 'H₂S' : 'NH₃',
        });
      }
    }

    let ringTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentOdor = odorLevelRef.current; // 100 -> 0

      // 1. Crystal Clean Water Background (Aesthetic & Fresh, never murky)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const citrusIntensity = Math.min(0.4, (aromaLevel / 100) * 0.35);

      gradient.addColorStop(0, 'rgba(240, 249, 255, 0.7)'); // clear porcelain sky
      gradient.addColorStop(0.5, `rgba(254, 243, 199, ${0.35 + citrusIntensity})`); // gentle champagne
      gradient.addColorStop(1, `rgba(254, 215, 170, ${0.4 + citrusIntensity * 1.2})`); // warm fresh citrus
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated water surface line
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 38);
      for (let x = 0; x <= width; x += 15) {
        const waveAmp = isFizzing ? 3.5 : 1.2;
        const wave = Math.sin(Date.now() * 0.003 + x * 0.04) * waveAmp;
        ctx.lineTo(x, 38 + wave);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Clear Visual Odor Smoke Wisps & Labeled Molecules (H₂S, NH₃)
      if (currentOdor > 0) {
        const odorRatio = currentOdor / 100;

        // Animated wavy smoke trails across the top zone
        ctx.save();
        ctx.lineWidth = 2.5;
        for (let s = 0; s < 3; s++) {
          const smokeY = 22 + s * 24;
          const offset = Date.now() * 0.0015 + s * 1.5;
          ctx.strokeStyle = `rgba(147, 51, 234, ${0.35 * odorRatio})`;
          ctx.beginPath();
          ctx.moveTo(15, smokeY);
          for (let sx = 15; sx < width - 15; sx += 30) {
            const sy = smokeY + Math.sin(offset + sx * 0.03) * 6;
            ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
        ctx.restore();

        // Distinct floating Odor Molecule clusters with chemical badges
        for (let i = 0; i < odorWispsRef.current.length; i++) {
          const mol = odorWispsRef.current[i];
          mol.x += mol.speedX;
          mol.y += mol.speedY;

          if (mol.x < 25 || mol.x > width - 25) mol.speedX *= -1;
          if (mol.y < 12 || mol.y > 100) mol.speedY *= -1;

          const pulse = Math.sin(Date.now() * 0.003 + mol.pulseOffset) * 2;
          const currentRadius = Math.max(2, (mol.radius + pulse) * odorRatio);

          ctx.save();
          const radGrad = ctx.createRadialGradient(mol.x, mol.y, 1, mol.x, mol.y, currentRadius * 1.5);
          radGrad.addColorStop(0, `rgba(168, 85, 247, ${0.45 * odorRatio})`);
          radGrad.addColorStop(0.7, `rgba(192, 132, 252, ${0.2 * odorRatio})`);
          radGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');

          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(mol.x, mol.y, currentRadius * 1.5, 0, Math.PI * 2);
          ctx.fill();

          if (currentRadius > 6 && odorRatio > 0.25) {
            ctx.fillStyle = `rgba(126, 34, 206, ${0.85 * odorRatio})`;
            ctx.beginPath();
            ctx.arc(mol.x, mol.y, currentRadius * 0.75, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * odorRatio})`;
            ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(mol.label, mol.x, mol.y);
          }
          ctx.restore();
        }
      }

      // 4. Spawning Orange & Citrus Bubbles (Light, buoyant, numerous)
      if (isFizzing) {
        const count = Math.floor(Math.random() * 5 + 8);
        for (let i = 0; i < count; i++) {
          const offsetX = (Math.random() - 0.5) * 60;
          const offsetY = (Math.random() - 0.5) * 22;

          const colorRoll = Math.random();
          let bubbleColor = '249, 115, 22';
          if (colorRoll > 0.65) {
            bubbleColor = '251, 191, 36';
          } else if (colorRoll > 0.4) {
            bubbleColor = '234, 88, 12';
          } else if (colorRoll > 0.25) {
            bubbleColor = '253, 186, 116';
          } else {
            bubbleColor = '255, 255, 255';
          }

          particlesRef.current.push({
            x: tabletX + offsetX,
            y: tabletY + offsetY,
            radius: Math.random() * 5.0 + 1.8,
            speedY: Math.random() * 2.6 + 1.4,
            speedX: (Math.random() - 0.5) * 1.4,
            wobbleSpeed: Math.random() * 0.08 + 0.04,
            wobbleOffset: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.4 + 0.6,
            color: bubbleColor,
            glow: Math.random() > 0.6,
          });
        }

        // Pulse scent aroma rings outward
        ringTimer++;
        if (ringTimer % 28 === 0) {
          scentRingsRef.current.push({
            radius: 18,
            maxRadius: 190,
            opacity: 0.7,
            color: '249, 115, 22',
          });
        }
      }

      // 5. Draw & update expanding aroma rings
      for (let i = scentRingsRef.current.length - 1; i >= 0; i--) {
        const ring = scentRingsRef.current[i];
        ring.radius += 2.0;
        ring.opacity -= 0.009;

        if (ring.opacity <= 0 || ring.radius >= ring.maxRadius) {
          scentRingsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(${ring.color}, ${ring.opacity})`;
        ctx.lineWidth = 2.0;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(tabletX, tabletY, ring.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 6. Draw & update floating bubbles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.y -= p.speedY;
        p.x += Math.sin(Date.now() * p.wobbleSpeed + p.wobbleOffset) * 0.9 + p.speedX;

        if (p.y <= 40) {
          p.radius *= 0.92;
          p.opacity -= 0.06;
          if (p.opacity <= 0 || p.radius < 0.6) {
            particlesRef.current.splice(i, 1);
            continue;
          }
        }

        ctx.save();
        if (p.glow) {
          ctx.shadowColor = `rgba(${p.color}, 0.6)`;
          ctx.shadowBlur = 8;
        }

        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 7. Dispenser Basket & Tablet with warm citrus aura
      ctx.save();
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(tabletX, 0);
      ctx.lineTo(tabletX, tabletY - 24);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
      ctx.strokeStyle = isFizzing ? '#f97316' : 'rgba(168, 162, 158, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(tabletX - 36, tabletY - 24, 72, 48, 14);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(214, 211, 209, 0.9)';
      ctx.lineWidth = 1.5;
      for (let sx = -22; sx <= 22; sx += 11) {
        ctx.beginPath();
        ctx.moveTo(tabletX + sx, tabletY - 14);
        ctx.lineTo(tabletX + sx, tabletY + 14);
        ctx.stroke();
      }

      const scale = isFizzing ? Math.max(0.75, 1 - (progress / 100) * 0.12) : 1;
      const tabW = 46 * scale;
      const tabH = 22 * scale;

      if (isFizzing) {
        ctx.shadowColor = 'rgba(249, 115, 22, 0.85)';
        ctx.shadowBlur = 22;
      }

      const tabletGrad = ctx.createLinearGradient(tabletX - tabW / 2, tabletY, tabletX + tabW / 2, tabletY);
      tabletGrad.addColorStop(0, '#f97316');
      tabletGrad.addColorStop(0.5, '#fbbf24');
      tabletGrad.addColorStop(1, '#ea580c');

      ctx.fillStyle = tabletGrad;
      ctx.beginPath();
      ctx.roundRect(tabletX - tabW / 2, tabletY - tabH / 2, tabW, tabH, 6);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SỦI XANH', tabletX, tabletY);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isFizzing, aromaLevel, progress]);

  const handleStartFlush = () => {
    // Resume/initialize audio on user gesture
    getAudioContext();
    setIsPaused(false);
    setProgress(0);
    setOdorLevel(100);
    setAromaLevel(0);
    hasChimedRef.current = false;
    particlesRef.current = [];
    scentRingsRef.current = [];
    setIsFizzing(true);
    setFlushCount((prev) => prev + 1);

    // Pick a random customer review to increase trust and interactivity
    const availableReviews = activeReview
      ? CUSTOMER_REVIEWS.filter((r) => r.id !== activeReview.id)
      : CUSTOMER_REVIEWS;
    const randomReview = availableReviews[Math.floor(Math.random() * availableReviews.length)];
    setActiveReview(randomReview);
    setIsReviewVisible(true);
  };

  const handleShuffleReview = () => {
    const availableReviews = activeReview
      ? CUSTOMER_REVIEWS.filter((r) => r.id !== activeReview.id)
      : CUSTOMER_REVIEWS;
    const randomReview = availableReviews[Math.floor(Math.random() * availableReviews.length)];
    setActiveReview(randomReview);
    setIsReviewVisible(true);
  };

  const handleReset = () => {
    setIsFizzing(false);
    setIsPaused(false);
    setProgress(0);
    setOdorLevel(100);
    setAromaLevel(0);
    hasChimedRef.current = false;
    particlesRef.current = [];
    scentRingsRef.current = [];
    setIsReviewVisible(false);
    stopFizzAudio(true);
  };

  return (
    <section id="fizz-lab-section" className="py-16 bg-gradient-to-b from-[#f0f6f2] via-[#faf7f0] to-[#FBFBF7] border-t border-b border-emerald-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/10 border border-emerald-800/20 text-emerald-950 font-semibold text-[12px] mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Trung tâm thí nghiệm sủi bọt tương tác</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight text-balance">
            Xem Cơ Chế Sủi Bọt Cam &amp; Bẻ Gãy Phân Tử Mùi Hôi
          </h2>
          <p className="text-[13px] text-stone-600 mt-2">
            Trực quan sinh học: Các phân tử khí hôi <strong>H₂S</strong> và <strong>NH₃</strong> lơ lửng phía trên bồn cầu.
            Khi gạt cần xả nước, hàng triệu <strong>bong bóng màu cam</strong> nhẹ nhàng nổi lên kèm âm thanh sủi bọt chân thực,
            bẻ gãy phân tử mùi hôi và thay thế bằng hương thơm tinh dầu cam D-Limonene tươi mát.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Main Simulation Reactor - Visually Prominent Star Element */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-lg shadow-emerald-950/5 flex flex-col justify-between">
            {/* Simulation Header Status & Audio Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-stone-800 tracking-wide">
                  {isFizzing
                    ? isPaused
                      ? 'Đang tạm dừng thí nghiệm...'
                      : progress >= 100
                      ? 'Đã triệt tiêu 100% mùi hôi - Đang sủi bọt lưu hương liên tục...'
                      : 'Bọt khí cam đang sủi bọt & triệt tiêu mùi hôi...'
                    : progress === 100
                    ? 'Đã triệt tiêu 100% mùi hôi - Bồn cầu ngát hương cam'
                    : 'Trạng thái ban đầu: Có phân tử mùi hôi H₂S & NH₃'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 px-2.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                    isMuted
                      ? 'bg-stone-100 text-stone-400 border-stone-200'
                      : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100'
                  }`}
                  title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-orange-600" />
                  )}
                  <span>{isMuted ? 'Tắt âm' : 'Âm sủi bọt'}</span>
                </button>

                <span className="text-[11px] font-mono text-orange-900 bg-orange-50 border border-orange-200/60 px-2.5 py-1 rounded-md">
                  Lần xả: #{flushCount}
                </span>
              </div>
            </div>

            {/* Canvas Vessel Container with dynamic Odor / Citrus Visual Indicator */}
            <div className="relative rounded-2xl border-2 border-orange-100 overflow-hidden shadow-inner">
              <canvas ref={canvasRef} className="w-full block" />

              {/* Dynamic Odor Cloud Tag inside Canvas */}
              <div className="absolute top-2.5 left-3 flex items-center gap-2">
                {odorLevel > 0 ? (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all duration-300 shadow-xs border bg-purple-50/95 text-purple-900 border-purple-200"
                    style={{
                      opacity: Math.max(0.4, odorLevel / 100),
                    }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
                    <span>
                      {odorLevel > 70
                        ? `Phân tử khí hôi bồn cầu (H₂S, NH₃): ${odorLevel}%`
                        : `Bọt cam đang bẻ gãy phân tử H₂S & NH₃: còn ${odorLevel}%`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-orange-50/95 text-orange-950 border border-orange-300 shadow-xs animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                    <span>Đã triệt tiêu 100% phân tử mùi - Ngát hương cam!</span>
                  </div>
                )}
              </div>

              {/* Realtime Overlays at bottom */}
              <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2 text-[11px]">
                {/* Odor Status Box */}
                <div
                  className={`p-2.5 rounded-lg border shadow-xs flex items-center justify-between transition-colors ${
                    odorLevel > 50
                      ? 'bg-purple-50/95 border-purple-200 text-purple-900'
                      : odorLevel > 0
                      ? 'bg-amber-50/95 border-amber-200 text-amber-900'
                      : 'bg-emerald-50/95 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Droplets
                      className={`w-3.5 h-3.5 ${
                        odorLevel > 50
                          ? 'text-purple-600'
                          : odorLevel > 0
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    />
                    <span>{odorLevel === 0 ? 'Mùi hôi đã hết:' : 'Mùi hôi bồn cầu:'}</span>
                  </span>
                  <strong className="font-extrabold tabular-nums font-mono text-[12px]">
                    {odorLevel}%
                  </strong>
                </div>

                {/* Aroma Citrus Box */}
                <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-lg border border-orange-200 shadow-xs flex items-center justify-between text-orange-950">
                  <span className="flex items-center gap-1.5 font-medium text-stone-600">
                    <Wind className="w-3.5 h-3.5 text-orange-600" />
                    <span>Hương cam lưu lại:</span>
                  </span>
                  <strong className="text-orange-700 font-extrabold tabular-nums font-mono text-[12px]">
                    {aromaLevel}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Reaction Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                <span>Tiến trình sủi bọt cam &amp; khử phân tử mùi:</span>
                <span className="text-orange-800 font-mono font-bold">
                  {progress >= 100 ? '100% (Đang sủi lưu hương liên tục)' : `${Math.round(progress)}%`}
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/70">
                <div
                  className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 h-full rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Action Buttons - Visually Louder Primary Lever */}
            <div className="mt-5 flex items-center gap-3">
              {isFizzing ? (
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex-1 py-3.5 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[13px] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 fill-current text-white" />
                      <span>Tiếp Tục Thí Nghiệm</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 fill-current text-white" />
                      <span>Tạm Dừng Thí Nghiệm</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartFlush}
                  className="flex-1 py-3.5 px-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 active:scale-[0.99]"
                >
                  <Play className="w-4 h-4 fill-current text-amber-200" />
                  <span>
                    {progress === 100
                      ? 'Gạt Cần Thử Nghiệm Tiếp Theo'
                      : 'Gạt Cần Bắt Đầu Thí Nghiệm'}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-[13px] transition-colors flex items-center gap-1.5"
                title="Đặt lại mô phỏng"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Đặt lại</span>
              </button>
            </div>

            {/* Dynamic Verified Customer Review Showcase after hitting the flush lever */}
            {isReviewVisible && activeReview && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#f8f5ee] via-[#faf7f2] to-white border border-[#dfd2be] shadow-2xs animate-fade-in transition-all">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#ebdcc7]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-[12px] font-bold text-[#3B2B1E]">
                      Đánh Giá Khách Hàng Thực Tế
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded-full">
                      Đã mua &amp; kiểm chứng
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleShuffleReview}
                      className="px-2 py-1 text-emerald-900 hover:bg-emerald-100/70 rounded-md transition-colors flex items-center gap-1 text-[11px] font-medium"
                      title="Xem đánh giá của khách hàng khác"
                    >
                      <RefreshCw className="w-3 h-3 text-emerald-700" />
                      <span className="hidden sm:inline">Xem đánh giá khác</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsReviewVisible(false)}
                      className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-md transition-colors"
                      title="Đóng đánh giá"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${activeReview.avatarBg} text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs`}>
                      {activeReview.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-stone-900 text-[12px]">
                          {activeReview.name}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(activeReview.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                        <span>{activeReview.role}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-orange-900 font-medium">{activeReview.product}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-stone-400 font-mono text-[10px]">{activeReview.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-3 text-[12px] text-stone-700 leading-relaxed italic bg-white/95 p-2.5 rounded-lg border border-amber-200/70">
                    <Quote className="w-3 h-3 text-orange-500/50 absolute top-1.5 left-1" />
                    "{activeReview.comment}"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scientific Telemetry Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Cơ Chế Phá Vỡ Mùi Hôi Bằng D-Limonene</span>
              </h3>

              <div className="space-y-3 text-[12px] text-stone-600">
                {/* Step 1 */}
                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/60 space-y-1">
                  <div className="font-semibold text-purple-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span>Gốc rễ phân tử mùi hôi ban đầu:</span>
                  </div>
                  <p className="text-[11px] text-purple-950 leading-relaxed">
                    Khí H₂S (mùi trứng thối từ cặn hữu cơ) và NH₃ (amoniac) bốc lên từ thành bồn cầu
                    và đường ống cống tạo nên các luồng khí hôi khó chịu.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 space-y-1">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Cơ chế sủi bọt &amp; bẻ gãy phân tử:</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Bọt khí CO₂ nano mang theo các phân tử D-Limonene siêu nhẹ nổi lên, tiếp xúc và bẻ gãy
                    liên kết hóa học của H₂S, NH₃, khiến các phân tử mùi tan biến hoàn toàn.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60 space-y-1">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Lưu hương cam tươi lâu dài:</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Màng tinh dầu cam tự nhiên phủ đều lên bề mặt men sứ, tạo lớp ngăn cản vi khuẩn bám dính
                    và tỏa hương thơm sảng khoái suốt nhiều giờ sau khi xả.
                  </p>
                </div>

                {/* Formula */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 font-mono text-[11px] text-stone-700 leading-relaxed">
                  <strong>Phản ứng sủi bọt sinh học:</strong>
                  <br />
                  3 NaHCO₃ + C₆H₈O₇ → Na₃C₆H₅O₇ + 3 CO₂↑ + 3 H₂O
                </div>
              </div>
            </div>

            {/* Environmental Safety Notice */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-[12px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Không đè mùi bằng hóa chất độc hại</span>
              </div>
              <p className="text-[12px] text-stone-200 leading-relaxed">
                Khác với sáp thơm nhân tạo chỉ "lấn át" mùi hôi tạm thời bằng hương liệu tổng hợp,
                Sủi Xanh triệt tiêu tận gốc nguồn phân tử gây mùi, bảo vệ đường hô hấp và an toàn cho hầm tự hoại.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
