# VR Forest Experience

A Meta Quest VR headset compatible Three.js application built with React Three Fiber. Explore an interactive forest where you can grab mushrooms, inspect them, and discover information about trees and fungi.

## Features

- **VR Support**: Full WebXR support for Meta Quest headsets
- **Interactive Mushrooms**: 
  - Direct grab when close (within 2 meters)
  - Ray grab from distance (up to 10 meters) - pull mushrooms closer
  - Info boxes appear when grabbed
- **Interactive Trees**: 
  - Hover detection when controllers are near
  - Cylinders pop out from behind trees with information
- **Forest Scene**: Procedurally generated forest with trees, mushrooms, and grass

## Prerequisites

- Node.js 18+ and npm/yarn
- Meta Quest headset (Quest 2, Quest 3, or Quest Pro)
- Development machine and Quest on the same network (for testing)

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The server will start with HTTPS (required for WebXR) on `https://localhost:5173`

### Accessing from Meta Quest

**Important**: The Quest browser requires proper SSL certificates. See [SETUP.md](./SETUP.md) for detailed SSL setup instructions.

**Quick Start:**
1. Install mkcert: `brew install mkcert` (macOS) or see SETUP.md for other platforms
2. Run the setup script: `npm run setup-cert`
3. **IMPORTANT**: Restart your dev server after generating certificates:
   ```bash
   # Stop the current server (Ctrl+C), then:
   npm run dev
   ```
4. On Quest browser, navigate to `https://10.0.0.56:5173` (or your IP)
5. Click "Enter VR" when prompted

**If you get "Unsupported protocol" errors:**
- Make sure you restarted the dev server after generating certificates
- Try `npm run dev:quest` instead (uses TLS 1.2 compatibility mode)
- See [SETUP.md](./SETUP.md) for more troubleshooting steps

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. Deploy these to a web server with HTTPS enabled.

## Controls

- **Grab Button**: Grab mushrooms when close or use ray grab from distance
- **Controller Movement**: Move controllers to interact with objects
- **Hover**: Move controllers near trees to trigger pop-out information

## Project Structure

```
src/
  ├── App.tsx                 # Main app with Canvas and XR setup
  ├── main.tsx                # Entry point
  ├── components/
  │   ├── Scene.tsx           # Main 3D scene wrapper
  │   ├── Forest.tsx          # Forest container component
  │   ├── Tree.tsx            # Tree component with hover detection
  │   ├── Mushroom.tsx        # Mushroom component (grab + ray grab)
  │   ├── Grass.tsx           # Grass/ground component
  │   ├── InfoBox.tsx         # Sprite-based info display
  │   └── PopOutCylinder.tsx  # Cylinder that pops out from trees
  └── utils/
      └── constants.ts        # Scene configuration
```

## Technologies

- **React Three Fiber**: React renderer for Three.js
- **@react-three/xr**: WebXR support for React Three Fiber
- **@react-three/drei**: Useful helpers and utilities
- **Three.js**: 3D graphics library
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety

## Configuration

Edit `src/utils/constants.ts` to adjust:
- Forest size and object counts
- Interaction distances
- Animation speeds
- Visual settings

## Troubleshooting

### WebXR not working
- Ensure you're using HTTPS (or localhost)
- Check that your Quest browser supports WebXR
- Try restarting the Quest browser

### Can't connect from Quest
- Verify both devices are on the same network
- Check firewall settings on your development machine
- Try accessing via IP address instead of localhost

### Performance issues
- Reduce object counts in `constants.ts`
- Lower the grass density
- Simplify geometry if needed

## License

MIT

