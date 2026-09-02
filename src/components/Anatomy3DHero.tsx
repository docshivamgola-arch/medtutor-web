import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCcw, Layers, Flame, ChevronRight, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Anatomy3DHeroProps {
  onEnterSystem: (systemId: string) => void;
  onClose?: () => void;
}

interface OrganPin {
  id: string;
  name: string;
  organName: string;
  systemId: string;
  position: [number, number, number]; // 3D coordinates
  status: 'active' | 'in-production' | 'planned';
  cutsCount: number;
  highYieldYieldRate: string;
  badgeColor: string;
  screenPos?: { x: number; y: number; visible: boolean };
}

const SYSTEM_PINS: OrganPin[] = [
  {
    id: 'pin-cns',
    name: 'Central Nervous System',
    organName: 'Brain & Cerebrovascular',
    systemId: 'cns',
    position: [0, 2.2, 0],
    status: 'planned',
    cutsCount: 24,
    highYieldYieldRate: '12% Exam Weight',
    badgeColor: '#a855f7'
  },
  {
    id: 'pin-endocrine',
    name: 'Endocrine System',
    organName: 'The Thyroid & Parathyroids',
    systemId: 'endocrine',
    position: [0, 1.35, 0.15],
    status: 'active',
    cutsCount: 20,
    highYieldYieldRate: '18% Exam Weight',
    badgeColor: '#2563eb'
  },
  {
    id: 'pin-cvs',
    name: 'Cardiovascular System',
    organName: 'Heart & Great Vessels',
    systemId: 'cardiovascular',
    position: [-0.18, 0.75, 0.25],
    status: 'planned',
    cutsCount: 28,
    highYieldYieldRate: '16% Exam Weight',
    badgeColor: '#ef4444'
  },
  {
    id: 'pin-hepa',
    name: 'Hepatobiliary System',
    organName: 'Liver, Biliary Tree & Jaundice',
    systemId: 'hepatobiliary',
    position: [0.35, 0.25, 0.2],
    status: 'in-production',
    cutsCount: 22,
    highYieldYieldRate: '15% Exam Weight',
    badgeColor: '#f59e0b'
  },
  {
    id: 'pin-renal',
    name: 'Renal & Urinary System',
    organName: 'Kidneys & Glomerulopathies',
    systemId: 'renal',
    position: [-0.35, -0.35, -0.1],
    status: 'planned',
    cutsCount: 18,
    highYieldYieldRate: '11% Exam Weight',
    badgeColor: '#06b6d4'
  }
];

export const Anatomy3DHero: React.FC<Anatomy3DHeroProps> = ({ onEnterSystem, onClose }) => {
  const { isDark } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);
  const [pins, setPins] = useState<OrganPin[]>(SYSTEM_PINS);
  const [hoveredPin, setHoveredPin] = useState<OrganPin | null>(null);
  const [selectedPin, setSelectedPin] = useState<OrganPin | null>(SYSTEM_PINS[1]); // Thyroid default
  const [layer, setLayer] = useState<'visceral' | 'muscular' | 'skeletal' | 'vascular'>('visceral');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [isZooming, setIsZooming] = useState<boolean>(false);

  // References for Three.js animation and controls
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const organMeshesRef = useRef<Record<string, THREE.Mesh>>({});
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.8, 5.2));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.6, 0));

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene & Camera Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Architecture
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 2.5);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const bottomLight = new THREE.PointLight(0x2563eb, 1.2, 10);
    bottomLight.position.set(0, -2, 2);
    scene.add(bottomLight);

    // 3. Procedural Anatomical 3D Mesh Geometry
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Anatomical Torso Silhouette (Subtle translucent glass material)
    const torsoGeo = new THREE.CylinderGeometry(0.7, 0.55, 2.4, 24, 16);
    const torsoMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x18181b : 0xe2e8f0,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.3,
      wireframe: layer === 'skeletal'
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.5;
    bodyGroup.add(torso);

    // Anatomical Head Silhouette
    const headGeo = new THREE.SphereGeometry(0.5, 24, 24);
    const head = new THREE.Mesh(headGeo, torsoMat);
    head.position.y = 2.15;
    head.scale.set(0.85, 1.05, 0.95);
    bodyGroup.add(head);

    // Anatomical Neck
    const neckGeo = new THREE.CylinderGeometry(0.3, 0.38, 0.55, 20);
    const neck = new THREE.Mesh(neckGeo, torsoMat);
    neck.position.y = 1.45;
    bodyGroup.add(neck);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(8, 20, isDark ? 0x27272a : 0xcbd5e1, isDark ? 0x18181b : 0xe2e8f0);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // 4. Glowing Anatomical Organ Nodes
    const organMeshes: Record<string, THREE.Mesh> = {};

    SYSTEM_PINS.forEach(pin => {
      let organGeo: THREE.BufferGeometry;
      if (pin.id === 'pin-endocrine') {
        // Butterfly-shaped thyroid geometry
        organGeo = new THREE.TorusGeometry(0.18, 0.08, 16, 24, Math.PI * 1.4);
      } else if (pin.id === 'pin-cvs') {
        // Heart geometry
        organGeo = new THREE.SphereGeometry(0.24, 20, 20);
      } else if (pin.id === 'pin-hepa') {
        // Liver wedge geometry
        organGeo = new THREE.ConeGeometry(0.36, 0.45, 16);
      } else if (pin.id === 'pin-cns') {
        // Brain dual hemisphere
        organGeo = new THREE.SphereGeometry(0.32, 20, 20);
      } else {
        // Kidney bean
        organGeo = new THREE.CapsuleGeometry(0.14, 0.22, 12, 16);
      }

      const organMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(pin.badgeColor),
        emissive: new THREE.Color(pin.badgeColor),
        emissiveIntensity: pin.id === 'endocrine' ? 0.8 : 0.4,
        roughness: 0.3,
        metalness: 0.2
      });

      const organMesh = new THREE.Mesh(organGeo, organMat);
      organMesh.position.set(...pin.position);
      if (pin.id === 'pin-endocrine') organMesh.rotation.z = Math.PI * 0.8;
      if (pin.id === 'pin-hepa') organMesh.rotation.z = -Math.PI * 0.35;
      
      bodyGroup.add(organMesh);
      organMeshes[pin.id] = organMesh;
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

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 6. Animation Loop & Screen Projection of 3D Pins
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const currentLookAt = new THREE.Vector3(0, 0.6, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle ambient floating rotation when idle
      if (!isDragging && !isZooming) {
        bodyGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;
        bodyGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.05;
      }

      // Smooth camera interpolation (lerping)
      camera.position.lerp(targetCameraPos.current, 0.05);
      currentLookAt.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt);

      // Pulse organ glow
      Object.keys(organMeshes).forEach(key => {
        const mesh = organMeshes[key];
        const isTarget = selectedPin?.id === key || hoveredPin?.id === key;
        const baseIntensity = isTarget ? 1.2 : 0.4;
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 
          baseIntensity + Math.sin(elapsedTime * 3) * 0.15;
      });

      // Project 3D organ positions to 2D screen coordinates for floating HUD pins
      if (mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        const updatedPins = SYSTEM_PINS.map(pin => {
          const mesh = organMeshes[pin.id];
          if (!mesh) return pin;

          const worldPos = new THREE.Vector3();
          mesh.getWorldPosition(worldPos);
          worldPos.project(camera);

          const isVisible = worldPos.z < 1;
          const x = (worldPos.x * 0.5 + 0.5) * rect.width;
          const y = (-(worldPos.y * 0.5) + 0.5) * rect.height;

          return {
            ...pin,
            screenPos: { x, y, visible: isVisible }
          };
        });

        setPins(updatedPins);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Window Resize Handler
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
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark, layer]);

  // Handle Zoom Transition into Specific System
  const handleSelectSystem = (pin: OrganPin) => {
    setSelectedPin(pin);
    setIsZooming(true);

    // Zoom camera directly towards organ
    targetCameraPos.current.set(pin.position[0], pin.position[1] + 0.2, pin.position[2] + 1.8);
    targetLookAt.current.set(pin.position[0], pin.position[1], pin.position[2]);

    // Crossfade into 4-room dashboard after cinematic zoom
    setTimeout(() => {
      onEnterSystem(pin.systemId);
    }, 600);
  };

  const handleResetCamera = () => {
    setIsZooming(false);
    targetCameraPos.current.set(0, 0.8, 5.2);
    targetLookAt.current.set(0, 0.6, 0);
  };

  return (
    <div className="relative w-full h-[calc(100vh-57px)] overflow-hidden select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={mountRef} 
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-colors duration-300 ${
          isDark ? 'bg-zinc-950' : 'bg-slate-100'
        }`}
      />

      {/* Top Left Title & Stats Header */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5 max-w-sm pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className={`text-[11px] font-mono uppercase font-bold tracking-widest ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            Interactive 3D Curriculum Portal
          </span>
        </div>
        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          Explore the Human Body
        </h1>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Rotate in 3D space. Click any anatomical system pin to enter its synchronized 19-subject video cinema, wiki matrix, and active recall question bank.
        </p>
      </div>

      {/* Top Right Close / Workspace Switcher */}
      {onClose && (
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 z-20 p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            isDark 
              ? 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-800' 
              : 'bg-white/90 hover:bg-zinc-100 text-zinc-800 border-zinc-300 shadow-sm'
          }`}
        >
          <X className="w-4 h-4" />
          <span>Exit to Dashboard</span>
        </button>
      )}

      {/* Left Control Toolbar (Layer Peeling & Heatmap Toggle) */}
      <div className={`absolute bottom-8 left-6 z-20 flex flex-col gap-2 p-2 rounded-2xl border backdrop-blur-md ${
        isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-200' : 'bg-white/90 border-zinc-200 text-zinc-800 shadow-lg'
      }`}>
        <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 pt-1 text-zinc-400">
          Anatomical Layers
        </span>
        {(['visceral', 'skeletal', 'muscular'] as const).map(l => (
          <button
            key={l}
            onClick={() => setLayer(l)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              layer === l 
                ? 'bg-blue-600 text-white shadow-sm' 
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{l} Layer</span>
          </button>
        ))}

        <div className={`border-t my-1 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`} />

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showHeatmap 
              ? 'bg-amber-500 text-zinc-950 font-black shadow-sm' 
              : isDark ? 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800' : 'text-zinc-600 hover:text-amber-600 hover:bg-zinc-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>NEET-PG Heatmap</span>
        </button>

        <button
          onClick={handleResetCamera}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
          title="Reset 3D Orbit Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Floating 2D/3D HUD Interactive Pins (Anchored to 3D Coordinates) */}
      {pins.map(pin => {
        if (!pin.screenPos || !pin.screenPos.visible) return null;

        const isHovered = hoveredPin?.id === pin.id;
        const isSelected = selectedPin?.id === pin.id;
        const isThyroidLive = pin.status === 'active';

        return (
          <div
            key={pin.id}
            style={{
              left: `${pin.screenPos.x}px`,
              top: `${pin.screenPos.y}px`
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
          >
            {/* Glowing Hotspot Anchor Point */}
            <div 
              onClick={() => handleSelectSystem(pin)}
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
              className="relative cursor-pointer flex items-center justify-center"
            >
              <div 
                className="w-6 h-6 rounded-full border-2 border-white animate-ping absolute inset-0 opacity-60"
                style={{ backgroundColor: pin.badgeColor }}
              />
              <div 
                className="w-5 h-5 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-[9px] font-black text-white relative z-10 transition-transform group-hover:scale-125"
                style={{ backgroundColor: pin.badgeColor }}
              >
                {isThyroidLive ? '✓' : '•'}
              </div>
            </div>

            {/* Connecting Callout HUD Card */}
            <div 
              onClick={() => handleSelectSystem(pin)}
              className={`absolute left-6 top-1/2 -translate-y-1/2 w-64 p-3 rounded-xl border backdrop-blur-md shadow-2xl cursor-pointer transition-all duration-200 ${
                isHovered || isSelected
                  ? isDark 
                    ? 'bg-zinc-900/95 border-blue-500 scale-105 shadow-blue-500/10' 
                    : 'bg-white/95 border-blue-500 scale-105 shadow-lg'
                  : isDark 
                    ? 'bg-zinc-900/80 border-zinc-800 opacity-80 hover:opacity-100' 
                    : 'bg-white/85 border-zinc-200 opacity-90 hover:opacity-100 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span 
                  className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded border"
                  style={{ 
                    color: pin.badgeColor,
                    backgroundColor: `${pin.badgeColor}15`,
                    borderColor: `${pin.badgeColor}30`
                  }}
                >
                  {pin.status === 'active' ? 'Live System' : pin.status === 'in-production' ? 'In Production' : 'Scheduled'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {pin.highYieldYieldRate}
                </span>
              </div>

              <h4 className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {pin.name}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {pin.organName}
              </p>

              <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-bold ${
                isDark ? 'border-zinc-800 text-blue-400' : 'border-zinc-200 text-blue-600'
              }`}>
                <span>{pin.cutsCount} Modular Video Beats</span>
                <span className="flex items-center gap-0.5">
                  Enter <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Center Quick Selection Dock */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-md shadow-2xl max-w-2xl overflow-x-auto ${
        isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
      }`}>
        {pins.map(pin => (
          <button
            key={pin.id}
            onClick={() => handleSelectSystem(pin)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedPin?.id === pin.id 
                ? 'bg-blue-600 text-white shadow-sm' 
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <span 
              className="w-2 h-2 rounded-full shrink-0" 
              style={{ backgroundColor: pin.badgeColor }}
            />
            <span>{pin.name.split(' ')[0]}</span>
            {pin.status === 'active' && (
              <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded font-mono">Live</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
