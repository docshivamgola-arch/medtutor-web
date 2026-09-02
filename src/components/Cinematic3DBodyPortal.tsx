import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  RotateCcw, Layers, Flame, ChevronRight, X, 
  Stethoscope, ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Cinematic3DBodyPortalProps {
  onEnterSystemOrgan: (systemId: string, organId: string) => void;
  onClose?: () => void;
}

interface OrganDescriptor {
  id: string;
  name: string;
  systemId: string;
  systemName: string;
  position: [number, number, number]; // 3D coordinates
  cameraTargetPos: [number, number, number]; // Zoom target camera pos
  cameraLookAt: [number, number, number];
  status: 'active' | 'in-production' | 'planned';
  color: string;
  videoCuts: number;
  runtime: string;
  highYieldBuzzwords: string[];
  examWeightage: string;
}

const ORGANS_CATALOG: Record<string, OrganDescriptor[]> = {
  endocrine: [
    {
      id: 'thyroid',
      name: 'Thyroid & Parathyroid Glands',
      systemId: 'endocrine',
      systemName: 'Endocrine System',
      position: [0, 1.35, 0.15],
      cameraTargetPos: [0, 1.4, 1.4],
      cameraLookAt: [0, 1.35, 0.15],
      status: 'active',
      color: '#2563eb', // Royal Cobalt
      videoCuts: 20,
      runtime: '16.5 min',
      highYieldBuzzwords: ['STA vs ITA Ligation', 'Bethesda Cytology', 'Orphan Annie Eyes', 'Thyroid Storm Protocol'],
      examWeightage: '18% Exam Weight'
    }
  ],
  digestive: [
    {
      id: 'stomach',
      name: 'Stomach & Gastric Pathologies',
      systemId: 'digestive',
      systemName: 'Digestive & GI System',
      position: [-0.08, 0.45, 0.22],
      cameraTargetPos: [-0.08, 0.5, 1.5],
      cameraLookAt: [-0.08, 0.45, 0.22],
      status: 'active',
      color: '#f59e0b', // Amber
      videoCuts: 18,
      runtime: '15.0 min',
      highYieldBuzzwords: ['H. Pylori Quadruple Therapy', 'Zollinger-Ellison (Gastrinoma)', 'Krukenberg Tumor', 'Gastric Ulcers'],
      examWeightage: '14% Exam Weight'
    },
    {
      id: 'liver',
      name: 'Liver, Biliary Tree & Jaundice',
      systemId: 'digestive',
      systemName: 'Hepatobiliary System',
      position: [0.36, 0.35, 0.18],
      cameraTargetPos: [0.36, 0.4, 1.5],
      cameraLookAt: [0.36, 0.35, 0.18],
      status: 'in-production',
      color: '#ea580c', // Orange
      videoCuts: 22,
      runtime: '18.2 min',
      highYieldBuzzwords: ['Bilirubin Conjugation', 'Gilbert vs Crigler-Najjar', 'SAAG Score', 'Kasai Portoenterostomy'],
      examWeightage: '16% Exam Weight'
    }
  ],
  cardiovascular: [
    {
      id: 'heart',
      name: 'Heart & Great Vessels',
      systemId: 'cardiovascular',
      systemName: 'Cardiovascular System',
      position: [-0.15, 0.85, 0.25],
      cameraTargetPos: [-0.15, 0.9, 1.5],
      cameraLookAt: [-0.15, 0.85, 0.25],
      status: 'planned',
      color: '#ef4444', // Crimson Red
      videoCuts: 26,
      runtime: '21.0 min',
      highYieldBuzzwords: ['Wiggers Diagram', 'Infective Endocarditis Duke Criteria', 'Aortic Dissection (Stanford)', 'ECG STEMI Localization'],
      examWeightage: '19% Exam Weight'
    }
  ],
  cns: [
    {
      id: 'brain',
      name: 'Brain, Cerebrovascular & Stroke',
      systemId: 'cns',
      systemName: 'Central Nervous System',
      position: [0, 2.2, 0],
      cameraTargetPos: [0, 2.2, 1.3],
      cameraLookAt: [0, 2.2, 0],
      status: 'planned',
      color: '#a855f7', // Purple
      videoCuts: 24,
      runtime: '20.0 min',
      highYieldBuzzwords: ['Circle of Willis Aneurysms', 'Rule of 4 Brainstem', 'Brown-Séquard Syndrome', 'Parkinsonism Triad'],
      examWeightage: '15% Exam Weight'
    }
  ],
  renal: [
    {
      id: 'kidneys',
      name: 'Kidneys & Glomerulopathies',
      systemId: 'renal',
      systemName: 'Renal & Urinary System',
      position: [-0.32, -0.2, 0.05],
      cameraTargetPos: [-0.32, -0.15, 1.5],
      cameraLookAt: [-0.32, -0.2, 0.05],
      status: 'planned',
      color: '#06b6d4', // Cyan
      videoCuts: 16,
      runtime: '14.0 min',
      highYieldBuzzwords: ['Nephritic vs Nephrotic Syndromes', 'RAAS Activation', 'Renal Tubular Acidosis (RTA 1-4)', 'AKI KDIGO Staging'],
      examWeightage: '13% Exam Weight'
    }
  ]
};

const SYSTEMS_LIST = [
  { id: 'endocrine', name: 'Endocrine System', icon: '🦋', color: '#2563eb', status: 'Live (Thyroid)' },
  { id: 'digestive', name: 'Digestive & GI System', icon: '🫁', color: '#f59e0b', status: 'In Production (Liver)' },
  { id: 'cardiovascular', name: 'Cardiovascular System', icon: '❤️', color: '#ef4444', status: 'Scheduled' },
  { id: 'cns', name: 'Central Nervous System', icon: '🧠', color: '#a855f7', status: 'Scheduled' },
  { id: 'renal', name: 'Renal & Urinary System', icon: '💧', color: '#06b6d4', status: 'Scheduled' }
];

export const Cinematic3DBodyPortal: React.FC<Cinematic3DBodyPortalProps> = ({
  onEnterSystemOrgan,
  onClose
}) => {
  const { isDark } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);

  // Sequence Phases: 'splash' -> 'body-idle' -> 'system-xray' -> 'organ-zooming'
  const [phase, setPhase] = useState<'splash' | 'body-idle' | 'system-xray' | 'organ-zooming'>('splash');
  const [activeSystemId, setActiveSystemId] = useState<string>('endocrine');
  const [hoveredOrgan, setHoveredOrgan] = useState<OrganDescriptor | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<OrganDescriptor>(ORGANS_CATALOG.endocrine[0]);
  const [layer, setLayer] = useState<'visceral' | 'muscular' | 'skeletal'>('visceral');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [projectedPins, setProjectedPins] = useState<Array<OrganDescriptor & { screenX: number; screenY: number; visible: boolean }>>([]);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const organMeshesRef = useRef<Record<string, THREE.Mesh>>({});
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.8, 5.0));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.6, 0));

  // Phase 1: Brand Splash Timer (0.75s) with Instant Skip Option
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('body-idle');
    }, 750);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        setPhase('body-idle');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Three.js 3D Anatomical Living Body Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 5.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Architecture
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 3.0);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x2563eb, 1.5, 12);
    bottomGlow.position.set(0, -2, 2);
    scene.add(bottomGlow);

    // 3. Load Real 3D Human Anatomy Model (.glb)
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    const loader = new GLTFLoader();
    loader.load(
      '/models/human_body.glb',
      (gltf) => {
        const model = gltf.scene;
        // Center and scale the anatomical model
        model.scale.set(1.4, 1.4, 1.4);
        model.position.set(0, -0.8, 0);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Apply high-end clinical physical material with subtle X-Ray transmission
            mesh.material = new THREE.MeshPhysicalMaterial({
              color: isDark ? 0x27272a : 0x94a3b8,
              roughness: 0.35,
              metalness: 0.15,
              clearcoat: 0.4,
              clearcoatRoughness: 0.2,
              transparent: true,
              opacity: isDark ? 0.85 : 0.9,
              wireframe: layer === 'skeletal'
            });
          }
        });

        bodyGroup.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading human_body.glb:', error);
      }
    );

    // Grid Floor
    const gridHelper = new THREE.GridHelper(8, 20, isDark ? 0x27272a : 0xcbd5e1, isDark ? 0x18181b : 0xe2e8f0);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // 4. Glowing Anatomical Organ Nodes (Anchored to real anatomical coordinates)
    const organMeshes: Record<string, THREE.Mesh> = {};

    Object.values(ORGANS_CATALOG).flat().forEach(organ => {
      let geo: THREE.BufferGeometry;
      if (organ.id === 'thyroid') {
        geo = new THREE.TorusGeometry(0.18, 0.08, 16, 24, Math.PI * 1.4);
      } else if (organ.id === 'stomach') {
        geo = new THREE.TorusGeometry(0.24, 0.12, 16, 24, Math.PI * 1.2);
      } else if (organ.id === 'liver') {
        geo = new THREE.ConeGeometry(0.38, 0.48, 16);
      } else if (organ.id === 'heart') {
        geo = new THREE.SphereGeometry(0.26, 20, 20);
      } else if (organ.id === 'brain') {
        geo = new THREE.SphereGeometry(0.34, 20, 20);
      } else {
        geo = new THREE.CapsuleGeometry(0.15, 0.24, 12, 16);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(organ.color),
        emissive: new THREE.Color(organ.color),
        emissiveIntensity: organ.id === selectedOrgan.id ? 1.2 : 0.4,
        roughness: 0.3,
        metalness: 0.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...organ.position);
      if (organ.id === 'thyroid') mesh.rotation.z = Math.PI * 0.8;
      if (organ.id === 'stomach') mesh.rotation.z = Math.PI * 0.2;
      if (organ.id === 'liver') mesh.rotation.z = -Math.PI * 0.35;

      bodyGroup.add(mesh);
      organMeshes[organ.id] = mesh;
    });

    organMeshesRef.current = organMeshes;

    // 5. Mouse Orbit Interaction
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mountRef.current) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      bodyGroup.rotation.y += deltaX * 0.007;
      bodyGroup.rotation.x = Math.max(-0.3, Math.min(0.3, bodyGroup.rotation.x + deltaY * 0.005));

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 6. Animation Loop & Screen Projection of 3D Organ Pins
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const currentLookAt = new THREE.Vector3(0, 0.6, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Ambient idle breathing oscillation
      if (!isDragging && phase !== 'organ-zooming') {
        bodyGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.15;
        bodyGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.04;
      }

      // Smooth camera interpolation (lerping)
      camera.position.lerp(targetCameraPos.current, 0.06);
      currentLookAt.lerp(targetLookAt.current, 0.06);
      camera.lookAt(currentLookAt);

      // Dynamic organ glow animation
      const currentOrgans = ORGANS_CATALOG[activeSystemId] || [];
      Object.keys(organMeshes).forEach(key => {
        const mesh = organMeshes[key];
        const isBelongToActiveSystem = currentOrgans.some(o => o.id === key);
        const isSelectedOrHovered = selectedOrgan.id === key || hoveredOrgan?.id === key;

        let baseIntensity = 0.15;
        if (isBelongToActiveSystem) baseIntensity = 0.6;
        if (isSelectedOrHovered) baseIntensity = 1.4;

        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 
          baseIntensity + Math.sin(elapsedTime * 3.5) * 0.15;
      });

      // Project 3D Organ coordinates to 2D screen positions for floating HUD callouts
      if (mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        const activeOrgans = ORGANS_CATALOG[activeSystemId] || [];

        const projected = activeOrgans.map(organ => {
          const mesh = organMeshes[organ.id];
          if (!mesh) return { ...organ, screenX: 0, screenY: 0, visible: false };

          const worldPos = new THREE.Vector3();
          mesh.getWorldPosition(worldPos);
          worldPos.project(camera);

          const isVisible = worldPos.z < 1;
          const screenX = (worldPos.x * 0.5 + 0.5) * rect.width;
          const screenY = (-(worldPos.y * 0.5) + 0.5) * rect.height;

          return {
            ...organ,
            screenX,
            screenY,
            visible: isVisible
          };
        });

        setProjectedPins(projected);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark, layer, activeSystemId, phase]);

  // Phase 3: Regional X-Ray Activation on System Click
  const handleSelectSystem = (systemId: string) => {
    setActiveSystemId(systemId);
    setPhase('system-xray');
    const firstOrgan = ORGANS_CATALOG[systemId]?.[0];
    if (firstOrgan) {
      setSelectedOrgan(firstOrgan);
      // Gentle camera framing to center that region
      targetCameraPos.current.set(0, firstOrgan.position[1] + 0.2, 4.2);
      targetLookAt.current.set(0, firstOrgan.position[1], 0);
    }
  };

  // Phase 4: Organ Glow & Cinematic Camera Launch
  const handleLaunchOrgan = (organ: OrganDescriptor) => {
    setSelectedOrgan(organ);
    setPhase('organ-zooming');

    // Smooth Dolly-In Zoom directly towards the 3D organ coordinates
    targetCameraPos.current.set(...organ.cameraTargetPos);
    targetLookAt.current.set(...organ.cameraLookAt);

    // Seamless Cross-Fade into 4-Room Dashboard after 550ms
    setTimeout(() => {
      onEnterSystemOrgan(organ.systemId, organ.id);
    }, 550);
  };

  const handleResetCamera = () => {
    setPhase('body-idle');
    targetCameraPos.current.set(0, 0.8, 5.0);
    targetLookAt.current.set(0, 0.6, 0);
  };

  return (
    <div className={`relative w-full h-[calc(100vh-57px)] overflow-hidden select-none transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-100 text-zinc-900'
    }`}>
      {/* ── PHASE 1: BRAND SPLASH SCREEN (0.75s with Z-Axis Pushback) ── */}
      {phase === 'splash' && (
        <div 
          onClick={() => setPhase('body-idle')}
          className="fixed inset-0 z-50 bg-[#09090b] flex flex-col items-center justify-center p-6 text-center cursor-pointer animate-out fade-out duration-700 pointer-events-auto"
          style={{ perspective: 1000 }}
        >
          <div className="flex flex-col items-center gap-4 transition-all duration-700 ease-out transform translate-z-0 hover:scale-105">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-blue-400/30">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                MedTutor
              </h1>
              <p className="text-xs uppercase tracking-widest font-mono text-zinc-400 mt-1">
                19-Subject Medical Cinema & Active Recall
              </p>
            </div>
          </div>
          <span className="absolute bottom-10 text-[10px] font-mono text-zinc-500">
            Press Space or Click to Skip Intro
          </span>
        </div>
      )}

      {/* ── PHASE 2 & 3: THREE.JS 3D LIVING BODY VIEWPORT ── */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Left Title & Clinical Breadcrumb */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5 max-w-md pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className={`text-[11px] font-mono uppercase font-bold tracking-widest ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            Interactive Spatial Portal
          </span>
        </div>
        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          Explore Human Anatomy
        </h1>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Select a system on the left drawer. Observe regional X-Ray transparency, then click an organ to launch its 19-subject integrated dashboard.
        </p>
      </div>

      {/* Top Right Close / Exit to Dashboard */}
      {onClose && (
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 z-20 p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            isDark 
              ? 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-800' 
              : 'bg-white/90 hover:bg-zinc-100 text-zinc-800 border-zinc-300 shadow-sm'
          }`}
        >
          <X className="w-4 h-4" />
          <span>Direct Dashboard</span>
        </button>
      )}

      {/* ── LEFT SYSTEMS NAVIGATION DRAWER (The X-Ray Switcher) ── */}
      <div className={`absolute top-36 left-6 z-20 flex flex-col gap-2 p-3 rounded-2xl border backdrop-blur-md shadow-2xl w-60 sm:w-64 transition-all duration-200 ${
        isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200 shadow-lg'
      }`}>
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800/40">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
            Systems Navigator
          </span>
          <span className="text-[10px] font-mono text-blue-500 font-bold">
            {SYSTEMS_LIST.length} Systems
          </span>
        </div>

        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
          {SYSTEMS_LIST.map(sys => {
            const isActive = activeSystemId === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => handleSelectSystem(sys.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm scale-[1.02]' 
                    : isDark 
                      ? 'bg-zinc-950/60 hover:bg-zinc-800 text-zinc-300 border-zinc-800' 
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-sm shrink-0">{sys.icon}</span>
                  <span className="truncate">{sys.name}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FLOATING 2D/3D PROJECTED HUD CALLOUT PINS (Phase 3 & 4) ── */}
      {projectedPins.map(organ => {
        if (!organ.visible) return null;
        const isSelected = selectedOrgan.id === organ.id;
        const isHovered = hoveredOrgan?.id === organ.id;

        return (
          <div
            key={organ.id}
            style={{
              left: `${organ.screenX}px`,
              top: `${organ.screenY}px`
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
          >
            {/* Glowing Hotspot Anchor Point */}
            <div 
              onClick={() => handleLaunchOrgan(organ)}
              onMouseEnter={() => setHoveredOrgan(organ)}
              onMouseLeave={() => setHoveredOrgan(null)}
              className="relative cursor-pointer flex items-center justify-center"
            >
              <div 
                className="w-7 h-7 rounded-full border-2 border-white animate-ping absolute inset-0 opacity-60"
                style={{ backgroundColor: organ.color }}
              />
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-[10px] font-black text-white relative z-10 transition-transform group-hover:scale-125"
                style={{ backgroundColor: organ.color }}
              >
                {organ.status === 'active' ? '✓' : '•'}
              </div>
            </div>

            {/* Connecting Callout HUD Card with High-Yield Preview */}
            <div 
              onClick={() => handleLaunchOrgan(organ)}
              className={`absolute left-8 top-1/2 -translate-y-1/2 w-72 p-3.5 rounded-2xl border backdrop-blur-md shadow-2xl cursor-pointer transition-all duration-200 ${
                isSelected || isHovered
                  ? isDark 
                    ? 'bg-zinc-900/95 border-blue-500 scale-105 shadow-blue-500/20' 
                    : 'bg-white/95 border-blue-500 scale-105 shadow-xl'
                  : isDark 
                    ? 'bg-zinc-900/85 border-zinc-800 opacity-85 hover:opacity-100' 
                    : 'bg-white/85 border-zinc-200 opacity-90 hover:opacity-100 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span 
                  className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border"
                  style={{ 
                    color: organ.color,
                    backgroundColor: `${organ.color}15`,
                    borderColor: `${organ.color}30`
                  }}
                >
                  {organ.status === 'active' ? 'Live Node' : organ.status === 'in-production' ? 'In Production' : 'Scheduled'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {organ.examWeightage}
                </span>
              </div>

              <h4 className={`text-xs font-black leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {organ.name}
              </h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                {organ.videoCuts} Modular Cuts • {organ.runtime} total
              </p>

              {/* High Yield Buzzwords Preview */}
              <div className="flex flex-wrap gap-1 my-2">
                {organ.highYieldBuzzwords.slice(0, 2).map((bw, idx) => (
                  <span 
                    key={idx}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      isDark ? 'bg-zinc-950 text-zinc-300 border border-zinc-800' : 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                    }`}
                  >
                    ⚡ {bw}
                  </span>
                ))}
              </div>

              <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-bold ${
                isDark ? 'border-zinc-800 text-blue-400' : 'border-zinc-200 text-blue-600'
              }`}>
                <span>Launch 19-Subject Hub</span>
                <span className="flex items-center gap-1">
                  Enter <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── BOTTOM CONTROL TOOLBAR (Layer Peeling & Heatmap) ── */}
      <div className={`absolute bottom-6 left-6 z-20 flex items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-md shadow-2xl ${
        isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
      }`}>
        {(['visceral', 'muscular', 'skeletal'] as const).map(l => (
          <button
            key={l}
            onClick={() => setLayer(l)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              layer === l 
                ? 'bg-blue-600 text-white shadow-sm' 
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{l}</span>
          </button>
        ))}

        <div className={`w-px h-5 mx-1 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showHeatmap 
              ? 'bg-amber-500 text-zinc-950 font-black shadow-sm' 
              : isDark ? 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800' : 'text-zinc-600 hover:text-amber-600 hover:bg-zinc-100'
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>NEET-PG Heatmap</span>
        </button>

        <button
          onClick={handleResetCamera}
          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
          title="Reset Orbit Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── BOTTOM CENTER SYSTEM QUICK LAUNCH DOCK ── */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-md shadow-2xl max-w-xl overflow-x-auto ${
        isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
      }`}>
        {SYSTEMS_LIST.map(sys => {
          const isActive = activeSystemId === sys.id;
          return (
            <button
              key={sys.id}
              onClick={() => handleSelectSystem(sys.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <span>{sys.icon}</span>
              <span>{sys.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
