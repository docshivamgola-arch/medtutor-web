import bpy
import math

def create_professional_anatomy_model(output_path):
    # 1. Reset Scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    collection = bpy.context.scene.collection

    # 2. Material Helper
    def create_material(name, base_color, roughness=0.3, metalness=0.1, transmission=0.0, emission_color=(0,0,0,1), emission_strength=0.0):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs['Base Color'].default_value = base_color
            bsdf.inputs['Roughness'].default_value = roughness
            bsdf.inputs['Metallic'].default_value = metalness
            if 'Transmission Weight' in bsdf.inputs:
                bsdf.inputs['Transmission Weight'].default_value = transmission
            elif 'Transmission' in bsdf.inputs:
                bsdf.inputs['Transmission'].default_value = transmission
            if 'Emission Color' in bsdf.inputs:
                bsdf.inputs['Emission Color'].default_value = emission_color
                bsdf.inputs['Emission Strength'].default_value = emission_strength
        return mat

    mat_skin = create_material("Mat_Skin_Translucent", (0.25, 0.25, 0.28, 1.0), roughness=0.25, transmission=0.6)
    mat_skeleton = create_material("Mat_Skeleton_Ivory", (0.9, 0.88, 0.82, 1.0), roughness=0.5)
    mat_thyroid = create_material("Mat_Thyroid_Cobalt", (0.15, 0.4, 0.95, 1.0), roughness=0.2, emission_color=(0.15, 0.4, 0.95, 1.0), emission_strength=0.8)
    mat_stomach = create_material("Mat_Stomach_Amber", (0.95, 0.65, 0.1, 1.0), roughness=0.25, emission_color=(0.95, 0.65, 0.1, 1.0), emission_strength=0.7)
    mat_liver = create_material("Mat_Liver_Crimson", (0.85, 0.2, 0.15, 1.0), roughness=0.3, emission_color=(0.85, 0.2, 0.15, 1.0), emission_strength=0.6)
    mat_heart = create_material("Mat_Heart_Ruby", (0.9, 0.1, 0.2, 1.0), roughness=0.2, emission_color=(0.9, 0.1, 0.2, 1.0), emission_strength=0.9)
    mat_brain = create_material("Mat_Brain_Violet", (0.65, 0.25, 0.9, 1.0), roughness=0.35, emission_color=(0.65, 0.25, 0.9, 1.0), emission_strength=0.7)
    mat_kidney = create_material("Mat_Kidney_Cyan", (0.1, 0.75, 0.85, 1.0), roughness=0.25, emission_color=(0.1, 0.75, 0.85, 1.0), emission_strength=0.7)

    # 3. Sculpt Anatomical Human Torso Silhouette
    # Head & Cranium
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=24, radius=0.48, location=(0, 0, 2.15))
    head = bpy.context.active_object
    head.name = "Anatomy_Head"
    head.scale = (0.82, 0.98, 1.08)
    head.data.materials.append(mat_skin)

    # Neck
    bpy.ops.mesh.primitive_cylinder_add(radius=0.28, depth=0.55, vertices=24, location=(0, 0, 1.5))
    neck = bpy.context.active_object
    neck.name = "Anatomy_Neck"
    neck.data.materials.append(mat_skin)

    # Torso (Chest & Pectorals)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.75, depth=1.3, vertices=32, location=(0, 0, 0.85))
    chest = bpy.context.active_object
    chest.name = "Anatomy_Chest"
    chest.scale = (1.05, 0.65, 1.0)
    chest.data.materials.append(mat_skin)

    # Abdomen & Pelvis
    bpy.ops.mesh.primitive_cylinder_add(radius=0.62, depth=1.1, vertices=32, location=(0, 0, -0.2))
    abdomen = bpy.context.active_object
    abdomen.name = "Anatomy_Abdomen"
    abdomen.scale = (0.95, 0.62, 1.0)
    abdomen.data.materials.append(mat_skin)

    # 4. Sculpt Anatomical Organs as Distinct Named Meshes
    # Thyroid Gland (Bilateral Lobes with Isthmus)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.18, minor_radius=0.07, major_segments=24, minor_segments=16, location=(0, 0.16, 1.38))
    thyroid = bpy.context.active_object
    thyroid.name = "Organ_Thyroid"
    thyroid.rotation_euler = (math.radians(75), 0, math.radians(90))
    thyroid.scale = (0.85, 1.2, 0.6)
    thyroid.data.materials.append(mat_thyroid)

    # Heart (4-Chambered Silhouette)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=20, radius=0.26, location=(-0.12, 0.12, 0.82))
    heart = bpy.context.active_object
    heart.name = "Organ_Heart"
    heart.scale = (0.9, 1.1, 1.2)
    heart.rotation_euler = (math.radians(15), math.radians(-20), math.radians(10))
    heart.data.materials.append(mat_heart)

    # Stomach (J-Shaped Organ with Curvatures)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.11, major_segments=24, minor_segments=16, location=(-0.08, 0.1, 0.42))
    stomach = bpy.context.active_object
    stomach.name = "Organ_Stomach"
    stomach.rotation_euler = (math.radians(45), math.radians(30), math.radians(-25))
    stomach.scale = (1.1, 0.85, 0.9)
    stomach.data.materials.append(mat_stomach)

    # Liver (Anatomical Wedge Lobes)
    bpy.ops.mesh.primitive_cone_add(radius1=0.38, depth=0.48, vertices=20, location=(0.28, 0.1, 0.38))
    liver = bpy.context.active_object
    liver.name = "Organ_Liver"
    liver.rotation_euler = (math.radians(-20), math.radians(50), math.radians(-45))
    liver.scale = (1.2, 0.8, 0.95)
    liver.data.materials.append(mat_liver)

    # Brain (Dual Cerebral Hemispheres)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=28, ring_count=24, radius=0.36, location=(0, 0, 2.22))
    brain = bpy.context.active_object
    brain.name = "Organ_Brain"
    brain.scale = (0.88, 1.1, 0.92)
    brain.data.materials.append(mat_brain)

    # Kidneys (Left & Right Bean-Shaped)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=16, radius=0.15, location=(-0.32, -0.05, 0.05))
    kidney_l = bpy.context.active_object
    kidney_l.name = "Organ_Kidney_Left"
    kidney_l.scale = (0.7, 0.85, 1.4)
    kidney_l.data.materials.append(mat_kidney)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=16, radius=0.15, location=(0.32, -0.05, 0.0))
    kidney_r = bpy.context.active_object
    kidney_r.name = "Organ_Kidney_Right"
    kidney_r.scale = (0.7, 0.85, 1.4)
    kidney_r.data.materials.append(mat_kidney)

    # 5. Skeletal Rib Cage & Vertebrae Accents
    for i in range(5):
        z_pos = 0.55 + (i * 0.15)
        rad = 0.55 - (abs(i - 2) * 0.05)
        bpy.ops.mesh.primitive_torus_add(major_radius=rad, minor_radius=0.025, major_segments=24, minor_segments=12, location=(0, 0.02, z_pos))
        rib = bpy.context.active_object
        rib.name = f"Skeletal_Rib_{i+1}"
        rib.scale = (1.05, 0.68, 0.8)
        rib.data.materials.append(mat_skeleton)

    # Vertebral Column
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=1.8, vertices=16, location=(0, -0.22, 0.4))
    spine = bpy.context.active_object
    spine.name = "Skeletal_Spine"
    spine.data.materials.append(mat_skeleton)

    # 6. Smooth Shading & Modifier Optimization
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            # Smooth shading
            for poly in obj.data.polygons:
                poly.use_smooth = True
            
            # Subtle Bevel/Subsurf for high-end look
            sub = obj.modifiers.new(name="Subsurf", type='SUBSURF')
            sub.levels = 1
            sub.render_levels = 1

    # 7. Export GLB (glTF Binary) with full mesh hierarchy, materials, and PBR properties
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_materials='EXPORT',
        export_cameras=False,
        export_lights=False
    )
    print(f"Successfully generated and exported: {output_path}")

if __name__ == "__main__":
    output_glb = r"C:\Users\shiva\.gemini\antigravity\scratch\medtutor-web\public\models\human_anatomy_pro.glb"
    create_professional_anatomy_model(output_glb)
