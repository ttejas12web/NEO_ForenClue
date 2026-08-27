import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Box, Cylinder, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function createStereoBrandTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Dark slate blue matte badge
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle metallic mesh grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < canvas.width; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 12) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
    }

    // Outer amber gold chamfered border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner cyan thread border
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

    // Forensic Icons
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('🔬   ✦   STEREOSCOPIC 3D   ✦   🔎', canvas.width / 2, 105);

    // Main FORENCLUE Header
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.font = '900 80px "Montserrat", "Arial Black", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('FORENCLUE', canvas.width / 2, 215);

    ctx.shadowBlur = 0;
    // Sub-title
    ctx.font = '700 30px "Montserrat", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('FORENSIC STEREO ZOOM MICROSCOPE', canvas.width / 2, 310);

    ctx.font = '600 22px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CONTINUOUS ZOOM OPTICS • MODEL FSM-850', canvas.width / 2, 385);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

interface StereoMicroscope3DProps {
    focus?: number;
    zoom?: number;
    lightIntensity?: number;
    lightingMode?: 'incident' | 'transmitted' | 'both';
    stageX?: number;
    stageY?: number;
    sampleColor?: string;
    sampleName?: string;
    sampleUrl?: string;
}

export function StereoMicroscope3D({
    focus = 50,
    zoom = 1,
    lightIntensity = 75,
    lightingMode = 'incident',
    stageX = 50,
    stageY = 50,
    sampleColor = '#f59e0b',
    sampleName = 'Human Hair Shaft',
    sampleUrl
}: StereoMicroscope3DProps) {
    const podRef = useRef<THREE.Group>(null);
    const focusKnobLeftRef = useRef<THREE.Group>(null);
    const focusKnobRightRef = useRef<THREE.Group>(null);
    const zoomKnobRef = useRef<THREE.Group>(null);
    const mechanicalStageGroupRef = useRef<THREE.Group>(null);
    const stageXKnobRef = useRef<THREE.Group>(null);
    const stageYKnobRef = useRef<THREE.Group>(null);

    const brandTexture = useMemo(() => createStereoBrandTexture(), []);

    // Create slide label texture dynamically
    const slideLabelTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 6;
        ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FORENCLUE', canvas.width / 2, 45);

        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('TRACE LAB', canvas.width / 2, 80);

        ctx.fillStyle = '#334155';
        ctx.font = 'bold 16px sans-serif';
        const words = sampleName.split(' ');
        if (words.length > 2) {
            ctx.fillText(words.slice(0, 2).join(' '), canvas.width / 2, 130);
            ctx.fillText(words.slice(2).join(' '), canvas.width / 2, 160);
        } else {
            ctx.fillText(sampleName, canvas.width / 2, 140);
        }

        ctx.fillStyle = '#64748b';
        ctx.font = '13px monospace';
        ctx.fillText('SPECIMEN SLIDE', canvas.width / 2, 210);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }, [sampleName]);

    // Slide specimen texture if available
    const specimenTexture = useMemo(() => {
        if (!sampleUrl) return null;
        const loader = new THREE.TextureLoader();
        try {
            const tex = loader.load(sampleUrl);
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            return tex;
        } catch {
            return null;
        }
    }, [sampleUrl]);

    useFrame(() => {
        // Vertical translation of optical pod along pillar based on focus (0 - 100)
        if (podRef.current) {
            // Target height along vertical post: 2.8 to 4.3
            const targetY = 2.8 + (focus / 100) * 1.5;
            podRef.current.position.y = THREE.MathUtils.lerp(podRef.current.position.y, targetY, 0.15);
        }

        // Rotate focus knobs with user focus adjustments
        if (focusKnobLeftRef.current) {
            focusKnobLeftRef.current.rotation.x = focus * 0.08;
        }
        if (focusKnobRightRef.current) {
            focusKnobRightRef.current.rotation.x = focus * 0.08;
        }

        // Rotate zoom knob
        if (zoomKnobRef.current) {
            zoomKnobRef.current.rotation.z = (zoom - 1) * 0.8;
        }

        // Mechanical Stage Translation X & Y
        if (mechanicalStageGroupRef.current) {
            // Map stageX (0..100) and stageY (0..100) to physical offset coordinates on the stage disc
            // stage center is at x = 0, z = 0.6
            const targetX = ((stageX - 50) / 50) * 0.9; // -0.9 to +0.9
            const targetZ = 0.6 + ((stageY - 50) / 50) * 0.9; // -0.3 to +1.5
            
            mechanicalStageGroupRef.current.position.x = THREE.MathUtils.lerp(
                mechanicalStageGroupRef.current.position.x,
                targetX,
                0.25
            );
            mechanicalStageGroupRef.current.position.z = THREE.MathUtils.lerp(
                mechanicalStageGroupRef.current.position.z,
                targetZ,
                0.25
            );
        }

        // Rotate stage knobs as stage translations move
        if (stageXKnobRef.current) {
            stageXKnobRef.current.rotation.y = (stageX - 50) * 0.15;
        }
        if (stageYKnobRef.current) {
            stageYKnobRef.current.rotation.y = (stageY - 50) * 0.15;
        }
    });

    const whiteEnamelProps = {
        color: "#f8fafc",
        roughness: 0.15,
        metalness: 0.1,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
    };

    const chromePillarProps = {
        color: "#e2e8f0",
        roughness: 0.05,
        metalness: 0.98,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
    };

    const darkMetalProps = {
        color: "#1e293b",
        roughness: 0.4,
        metalness: 0.85,
        clearcoat: 0.2,
    };

    const stageSteelProps = {
        color: "#0f172a",
        roughness: 0.35,
        metalness: 0.9,
    };

    const blackKnobProps = {
        color: "#090d16",
        roughness: 0.5,
        metalness: 0.4,
    };

    const coatedLensProps = {
        color: "#6366f1",
        transmission: 0.85,
        opacity: 0.95,
        metalness: 0.2,
        roughness: 0.02,
        ior: 1.6,
        specularIntensity: 1.0,
    };

    const isIncidentOn = lightingMode === 'incident' || lightingMode === 'both';
    const isTransmittedOn = lightingMode === 'transmitted' || lightingMode === 'both';

    return (
        <group position={[0, -2.8, 0]}>
            {/* 1. BROAD FLAT STAGE BASE */}
            <group position={[0, 0, 0]}>
                {/* Main Curved Rounded Base Plate */}
                <RoundedBox args={[4.6, 0.45, 5.6]} position={[0, 0.22, 0.4]} radius={0.3} smoothness={6}>
                    <meshPhysicalMaterial {...whiteEnamelProps} />
                </RoundedBox>

                {/* Sub-stage Bevel Foot */}
                <RoundedBox args={[4.8, 0.12, 5.8]} position={[0, 0.06, 0.4]} radius={0.25} smoothness={4}>
                    <meshPhysicalMaterial color="#cbd5e1" roughness={0.6} metalness={0.2} />
                </RoundedBox>

                {/* Rubber Support Feet */}
                {([[-2.0, -2.0], [2.0, -2.0], [-2.0, 2.8], [2.0, 2.8]] as [number, number][]).map(([fx, fz], idx) => (
                    <Cylinder key={idx} args={[0.26, 0.26, 0.1, 16]} position={[fx, 0.05, fz]}>
                        <meshStandardMaterial color="#09090b" roughness={0.9} />
                    </Cylinder>
                ))}

                {/* Circular Stage Well & Contrast Plate Insert */}
                <group position={[0, 0.45, 0.6]}>
                    {/* Metal recessed stage ring */}
                    <Cylinder args={[1.52, 1.55, 0.04, 64]} position={[0, 0.01, 0]}>
                        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
                    </Cylinder>
                    {/* Stage Plate Disc - Non-glaring frosted translucent glass */}
                    <Cylinder args={[1.42, 1.42, 0.05, 64]} position={[0, 0.02, 0]}>
                        <meshPhysicalMaterial
                            color="#f1f5f9"
                            roughness={0.4}
                            metalness={0.05}
                            emissive={isTransmittedOn ? "#fef08a" : "#000000"}
                            emissiveIntensity={isTransmittedOn ? (lightIntensity / 100) * 0.45 : 0}
                        />
                    </Cylinder>
                </group>

                {/* Fixed Mechanical Stage Rail Guides & Bracket on Base */}
                <group position={[1.5, 0.48, 0.6]}>
                    {/* Right side bracket mount */}
                    <RoundedBox args={[0.3, 0.16, 2.2]} position={[0, 0.06, 0]} radius={0.03}>
                        <meshStandardMaterial {...stageSteelProps} />
                    </RoundedBox>
                    {/* Vernier scale silver strip */}
                    <Box args={[0.02, 0.08, 1.6]} position={[-0.14, 0.08, 0]}>
                        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
                    </Box>

                    {/* Dual Coaxial X-Y Mechanical Translation Knobs */}
                    <group position={[0.35, -0.15, 0]}>
                        {/* Vertical shaft */}
                        <Cylinder args={[0.06, 0.06, 0.7, 16]} position={[0, 0.05, 0]}>
                            <meshStandardMaterial {...chromePillarProps} />
                        </Cylinder>
                        {/* Upper Y-axis translation knob */}
                        <group ref={stageYKnobRef} position={[0, 0.25, 0]}>
                            <Cylinder args={[0.22, 0.22, 0.22, 24]}>
                                <meshStandardMaterial {...blackKnobProps} />
                            </Cylinder>
                            <Cylinder args={[0.23, 0.23, 0.04, 24]} position={[0, 0, 0]}>
                                <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
                            </Cylinder>
                        </group>
                        {/* Lower X-axis translation knob */}
                        <group ref={stageXKnobRef} position={[0, -0.08, 0]}>
                            <Cylinder args={[0.18, 0.18, 0.22, 24]}>
                                <meshStandardMaterial {...blackKnobProps} />
                            </Cylinder>
                            <Cylinder args={[0.19, 0.19, 0.04, 24]} position={[0, 0, 0]}>
                                <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.8} />
                            </Cylinder>
                        </group>
                    </group>
                </group>

                {/* MOVING MECHANICAL STAGE & SPECIMEN SLIDE ASSEMBLY */}
                {/* Position translated dynamically by useFrame via stageX and stageY */}
                <group ref={mechanicalStageGroupRef} position={[0, 0.50, 0.6]}>
                    
                    {/* Mechanical Caliper Frame Carrier */}
                    <group position={[0, 0, 0]}>
                        {/* Back Cross-bar */}
                        <RoundedBox args={[2.8, 0.05, 0.18]} position={[0, 0.02, -0.85]} radius={0.02}>
                            <meshStandardMaterial {...stageSteelProps} />
                        </RoundedBox>
                        {/* Right Caliper Arm */}
                        <RoundedBox args={[0.18, 0.05, 1.7]} position={[1.35, 0.02, 0]} radius={0.02}>
                            <meshStandardMaterial {...stageSteelProps} />
                        </RoundedBox>

                        {/* Spring Loaded Slide Clamp Clip (Holding slide firmly) */}
                        <group position={[-1.15, 0.04, -0.45]}>
                            <Cylinder args={[0.08, 0.08, 0.08, 16]} position={[0, 0.03, 0]}>
                                <meshStandardMaterial {...darkMetalProps} />
                            </Cylinder>
                            {/* Curved tension finger touching slide edge */}
                            <Box args={[0.06, 0.03, 0.9]} position={[0.2, 0.04, 0.35]} rotation={[0.05, 0.25, 0]}>
                                <meshStandardMaterial {...chromePillarProps} />
                            </Box>
                        </group>
                        
                        {/* Left Stage Clip */}
                        <group position={[1.15, 0.04, -0.45]}>
                            <Cylinder args={[0.08, 0.08, 0.08, 16]} position={[0, 0.03, 0]}>
                                <meshStandardMaterial {...darkMetalProps} />
                            </Cylinder>
                            <Box args={[0.06, 0.03, 0.9]} position={[-0.2, 0.04, 0.35]} rotation={[0.05, -0.25, 0]}>
                                <meshStandardMaterial {...chromePillarProps} />
                            </Box>
                        </group>
                    </group>

                    {/* HIGH-PRECISION FORENSIC GLASS SPECIMEN SLIDE */}
                    <group position={[0, 0.03, 0]}>
                        {/* 1. Main High-Index Optical Glass Slide Body (75mm x 25mm ratio) */}
                        <Box args={[2.4, 0.05, 0.85]} position={[0, 0.025, 0]}>
                            <meshPhysicalMaterial
                                color="#e2e8f0"
                                transmission={0.92}
                                opacity={0.95}
                                roughness={0.08}
                                metalness={0.1}
                                ior={1.52}
                                transparent
                                clearcoat={1.0}
                                clearcoatRoughness={0.05}
                            />
                        </Box>

                        {/* 2. Frosted White Ground Label Area on Left */}
                        <Box args={[0.6, 0.056, 0.83]} position={[-0.88, 0.027, 0]}>
                            <meshStandardMaterial
                                map={slideLabelTexture || undefined}
                                color="#f8fafc"
                                roughness={0.7}
                            />
                        </Box>

                        {/* 3. Central Specimen Mount / Smear / Section */}
                        <group position={[0.2, 0.035, 0]}>
                            {/* Forensic Biological Sample Staining Disc / Smear */}
                            <Cylinder args={[0.26, 0.26, 0.015, 32]} position={[0, 0.01, 0]}>
                                <meshStandardMaterial
                                    map={specimenTexture || undefined}
                                    color={specimenTexture ? '#ffffff' : sampleColor}
                                    roughness={0.3}
                                    metalness={0.1}
                                />
                            </Cylinder>

                            {/* Thin Optical Cover Slip (Square Glass) */}
                            <Box args={[0.7, 0.02, 0.7]} position={[0, 0.02, 0]}>
                                <meshPhysicalMaterial
                                    color="#ffffff"
                                    transmission={0.95}
                                    opacity={0.95}
                                    roughness={0.04}
                                    ior={1.5}
                                    transparent
                                    clearcoat={1.0}
                                />
                            </Box>
                        </group>
                    </group>
                </group>

                {/* Pillar Base Collar / Flange */}
                <group position={[-0.9, 0.4, -1.4]}>
                    <Cylinder args={[0.65, 0.75, 0.35, 32]}>
                        <meshPhysicalMaterial {...whiteEnamelProps} />
                    </Cylinder>
                    <Cylinder args={[0.5, 0.5, 0.4, 32]}>
                        <meshStandardMaterial {...darkMetalProps} />
                    </Cylinder>
                </group>

                {/* Substage Soft Ambient Uplight (Controlled and Natural, NOT blinding) */}
                {isTransmittedOn && lightIntensity > 0 && (
                    <pointLight
                        position={[0, 0.6, 0.6]}
                        intensity={(lightIntensity / 100) * 1.8}
                        distance={2.5}
                        color="#fef08a"
                    />
                )}
            </group>

            {/* 2. VERTICAL CHROME / STAINLESS STEEL PILLAR POST */}
            <group position={[-0.9, 3.4, -1.4]}>
                {/* Main Chrome Pillar */}
                <Cylinder args={[0.34, 0.34, 6.2, 32]}>
                    <meshPhysicalMaterial {...chromePillarProps} />
                </Cylinder>
                {/* Top Pillar End Cap */}
                <Cylinder args={[0.35, 0.35, 0.15, 32]} position={[0, 3.15, 0]}>
                    <meshStandardMaterial {...blackKnobProps} />
                </Cylinder>
            </group>

            {/* 3. OPTICAL POD & FOCUS MOUNT ASSEMBLY (Translates vertically with focus) */}
            <group ref={podRef} position={[-0.9, 3.6, -1.4]}>
                {/* Sliding Pillar Collar Clamp */}
                <group position={[0, 0, 0]}>
                    <Cylinder args={[0.52, 0.52, 1.4, 32]}>
                        <meshPhysicalMaterial {...whiteEnamelProps} />
                    </Cylinder>
                    {/* Rear Collar Locking Star Knob */}
                    <group position={[0, 0.1, -0.65]} rotation={[-Math.PI / 2, 0, 0]}>
                        <Cylinder args={[0.35, 0.35, 0.25, 24]}>
                            <meshStandardMaterial {...blackKnobProps} />
                        </Cylinder>
                        {/* Wing grips on knob */}
                        <Box args={[0.85, 0.18, 0.22]}>
                            <meshStandardMaterial {...blackKnobProps} />
                        </Box>
                    </group>
                </group>

                {/* Dual Ribbed Coaxial Focus Knobs (Left & Right) */}
                <group ref={focusKnobLeftRef} position={[-0.75, -0.15, 0.3]} rotation={[0, 0, Math.PI / 2]}>
                    <Cylinder args={[0.65, 0.65, 0.45, 32]}>
                        <meshStandardMaterial {...blackKnobProps} />
                    </Cylinder>
                    {/* Fine inner knob */}
                    <Cylinder args={[0.42, 0.42, 0.6, 32]}>
                        <meshStandardMaterial color="#1e293b" roughness={0.4} />
                    </Cylinder>
                </group>
                <group ref={focusKnobRightRef} position={[0.75, -0.15, 0.3]} rotation={[0, 0, -Math.PI / 2]}>
                    <Cylinder args={[0.65, 0.65, 0.45, 32]}>
                        <meshStandardMaterial {...blackKnobProps} />
                    </Cylinder>
                    {/* Fine inner knob */}
                    <Cylinder args={[0.42, 0.42, 0.6, 32]}>
                        <meshStandardMaterial color="#1e293b" roughness={0.4} />
                    </Cylinder>
                </group>

                {/* Horizontal Extension Arm (Offsets toward center stage [0, y, 0.6]) */}
                <group position={[0.9, 0, 1.2]}>
                    {/* Arm Bracket casting */}
                    <RoundedBox args={[1.3, 1.1, 1.8]} position={[0, 0, 0]} radius={0.15} smoothness={4}>
                        <meshPhysicalMaterial {...whiteEnamelProps} />
                    </RoundedBox>

                    {/* Arm Ring Collar holding the zoom pod */}
                    <Cylinder args={[1.2, 1.2, 0.4, 32]} position={[0, -0.4, 0.8]}>
                        <meshPhysicalMaterial {...whiteEnamelProps} />
                    </Cylinder>
                    <Cylinder args={[1.22, 1.22, 0.1, 32]} position={[0, -0.4, 0.8]}>
                        <meshStandardMaterial {...darkMetalProps} />
                    </Cylinder>

                    {/* 4. MAIN STEREO ZOOM MICROSCOPE POD / HEAD */}
                    <group position={[0, -0.2, 0.8]}>
                        {/* Upper Prism Housing (Angled/Sloped Enclosure) */}
                        <group position={[0, 0.5, 0]}>
                            {/* Main white cast zoom body */}
                            <RoundedBox args={[2.1, 1.6, 2.2]} position={[0, 0.1, 0.05]} radius={0.25} smoothness={5}>
                                <meshPhysicalMaterial {...whiteEnamelProps} />
                            </RoundedBox>

                            {/* Front Chamfered ForenClue Brand Plate */}
                            <group position={[0, 0.25, 1.16]} rotation={[-0.15, 0, 0]}>
                                <RoundedBox args={[1.7, 0.95, 0.03]} radius={0.04}>
                                    <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
                                </RoundedBox>
                                {brandTexture && (
                                    <Box args={[1.62, 0.88, 0.04]} position={[0, 0, 0.01]}>
                                        <meshStandardMaterial map={brandTexture} roughness={0.5} metalness={0.1} />
                                    </Box>
                                )}
                            </group>

                            {/* Lateral Continuous Zoom Knobs (Left & Right) */}
                            <group ref={zoomKnobRef} position={[-1.15, 0.3, -0.1]} rotation={[0, 0, Math.PI / 2]}>
                                <Cylinder args={[0.42, 0.42, 0.35, 24]}>
                                    <meshStandardMaterial {...blackKnobProps} />
                                </Cylinder>
                                <Cylinder args={[0.3, 0.3, 0.42, 24]}>
                                    <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
                                </Cylinder>
                            </group>
                            <group position={[1.15, 0.3, -0.1]} rotation={[0, 0, -Math.PI / 2]}>
                                <Cylinder args={[0.42, 0.42, 0.35, 24]}>
                                    <meshStandardMaterial {...blackKnobProps} />
                                </Cylinder>
                                <Cylinder args={[0.3, 0.3, 0.42, 24]}>
                                    <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
                                </Cylinder>
                            </group>
                        </group>

                        {/* Lower Objective Housing Assembly */}
                        <group position={[0, -0.6, 0]}>
                            {/* Black Tapered Objective Nose Cone */}
                            <Cylinder args={[1.05, 0.88, 0.7, 32]} position={[0, 0, 0]}>
                                <meshStandardMaterial {...darkMetalProps} />
                            </Cylinder>
                            {/* Lower Knurled Objective Ring */}
                            <Cylinder args={[0.9, 0.9, 0.25, 32]} position={[0, -0.4, 0]}>
                                <meshStandardMaterial color="#27272a" roughness={0.6} />
                            </Cylinder>
                            {/* Objective Glass Element */}
                            <Cylinder args={[0.76, 0.76, 0.08, 32]} position={[0, -0.48, 0]}>
                                <meshPhysicalMaterial {...coatedLensProps} />
                            </Cylinder>

                            {/* Upper Incident LED Ring Light on Objective Cone */}
                            <group position={[0, -0.52, 0]}>
                                <Cylinder args={[0.92, 0.92, 0.12, 32]}>
                                    <meshStandardMaterial color="#09090b" />
                                </Cylinder>
                                <Cylinder args={[0.85, 0.85, 0.14, 32]}>
                                    <meshPhysicalMaterial
                                        emissive={isIncidentOn ? "#ffffff" : "#000000"}
                                        emissiveIntensity={isIncidentOn ? (lightIntensity / 100) * 0.5 : 0}
                                        color="#ffffff"
                                        roughness={0.1}
                                    />
                                </Cylinder>
                                {isIncidentOn && lightIntensity > 0 && (
                                    <spotLight
                                        position={[0, -0.2, 0]}
                                        target-position={[0, -2.5, 0]}
                                        intensity={(lightIntensity / 100) * 3.5}
                                        angle={0.6}
                                        penumbra={0.4}
                                        color="#ffffff"
                                    />
                                )}
                            </group>
                        </group>

                        {/* 5. BINOCULAR VIEWING HEAD & DUAL EYEPIECES (Angled upwards ~45°) */}
                        <group position={[0, 1.05, -0.2]} rotation={[-0.75, 0, 0]}>
                            {/* Binocular Head Top Base Plate (Black Bezel) */}
                            <RoundedBox args={[1.8, 0.4, 1.2]} position={[0, 0.1, 0]} radius={0.15} smoothness={4}>
                                <meshStandardMaterial {...darkMetalProps} />
                            </RoundedBox>

                            {/* LEFT EYEPIECE ASSEMBLY */}
                            <group position={[-0.45, 0.45, 0]}>
                                {/* Diopter Adjustment Base Ring */}
                                <Cylinder args={[0.3, 0.32, 0.3, 24]}>
                                    <meshStandardMaterial {...blackKnobProps} />
                                </Cylinder>
                                {/* Eyepiece White/Metallic Tube */}
                                <Cylinder args={[0.26, 0.26, 0.85, 24]} position={[0, 0.5, 0]}>
                                    <meshPhysicalMaterial {...whiteEnamelProps} />
                                </Cylinder>
                                {/* Black Rubber Eyecup */}
                                <Cylinder args={[0.34, 0.28, 0.35, 24]} position={[0, 0.95, 0]}>
                                    <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
                                </Cylinder>
                                {/* Multi-coated Violet/Blue Optical Lens */}
                                <Cylinder args={[0.24, 0.24, 0.05, 24]} position={[0, 1.05, 0]}>
                                    <meshPhysicalMaterial {...coatedLensProps} />
                                </Cylinder>
                            </group>

                            {/* RIGHT EYEPIECE ASSEMBLY */}
                            <group position={[0.45, 0.45, 0]}>
                                {/* Diopter Adjustment Base Ring */}
                                <Cylinder args={[0.3, 0.32, 0.3, 24]}>
                                    <meshStandardMaterial {...blackKnobProps} />
                                </Cylinder>
                                {/* Eyepiece White/Metallic Tube */}
                                <Cylinder args={[0.26, 0.26, 0.85, 24]} position={[0, 0.5, 0]}>
                                    <meshPhysicalMaterial {...whiteEnamelProps} />
                                </Cylinder>
                                {/* Black Rubber Eyecup */}
                                <Cylinder args={[0.34, 0.28, 0.35, 24]} position={[0, 0.95, 0]}>
                                    <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
                                </Cylinder>
                                {/* Multi-coated Violet/Blue Optical Lens */}
                                <Cylinder args={[0.24, 0.24, 0.05, 24]} position={[0, 1.05, 0]}>
                                    <meshPhysicalMaterial {...coatedLensProps} />
                                </Cylinder>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    );
}
