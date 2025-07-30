# GLB Model Setup

## How to Add Your GLB Model

1. **Place your GLB file** in this `public/` folder
2. **Name it** `butterfly.glb` (or update the URL in `components/Three.tsx`)
3. **Supported formats**: GLB, GLTF

## Example GLB Files

You can find free GLB models at:
- [Sketchfab](https://sketchfab.com/features/free-3d-models)
- [Google Poly](https://poly.pizza/)
- [TurboSquid](https://www.turbosquid.com/Search/3D-Models/free)

## Current Setup

The component will:
- ✅ Load GLB models using `useGLTF`
- ✅ Auto-scale models to fit the scene
- ✅ Provide smooth loading with spinner
- ✅ Show fallback model if GLB fails to load
- ✅ Enable OrbitControls for interaction
- ✅ Apply proper lighting and shadows

## File Structure

```
public/
├── butterfly.glb    # Your GLB model here
└── README_GLB.md    # This file
```

## Features

- **High DPI rendering** with `dpr={[1, 2]}`
- **Hardware acceleration** enabled
- **Shadow mapping** for realistic lighting
- **Environment lighting** with sunset preset
- **Auto-rotation** for showcase
- **Responsive controls** with damping 