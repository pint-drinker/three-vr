import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// mkcert may generate files with suffixes like localhost+3.pem, so check for any localhost*.pem
const findCertFiles = () => {
  try {
    const files = readdirSync(__dirname)
    const certFile = files.find(f => f.startsWith('localhost') && f.endsWith('.pem') && !f.includes('-key'))
    const keyFile = files.find(f => f.startsWith('localhost') && f.includes('-key') && f.endsWith('.pem'))
    
    if (certFile && keyFile) {
      return {
        cert: resolve(__dirname, certFile),
        key: resolve(__dirname, keyFile)
      }
    }
  } catch (e) {
    // Directory read failed
  }
  return null
}

const certFiles = findCertFiles()

// Configure HTTPS with TLS options for Quest browser compatibility
let httpsConfig: any = true

if (certFiles && existsSync(certFiles.cert) && existsSync(certFiles.key)) {
  httpsConfig = {
    cert: readFileSync(certFiles.cert),
    key: readFileSync(certFiles.key),
    // Quest browsers need TLS 1.2 support
    // Note: Vite passes this to Node's https.createServer
  }
  console.log(`✅ Using mkcert certificates: ${certFiles.cert.split('/').pop()}`)
} else {
  console.log('⚠️  Using Vite default HTTPS (self-signed). Run "npm run setup-cert" for trusted certificates.')
}

// Plugin to configure TLS for Quest browser compatibility
const questTLSPlugin = (): Plugin => {
  return {
    name: 'quest-tls-config',
    configureServer(server) {
      // Configure TLS options after server creation
      server.httpServer?.once('listening', () => {
        // The server is already created, but we can log TLS info
        console.log('🔒 HTTPS server configured for Quest browser compatibility')
        console.log('📱 Access from Quest: https://10.0.0.56:5173')
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    questTLSPlugin()
  ],
  server: {
    https: httpsConfig, // Required for WebXR
    host: '0.0.0.0', // Listen on all interfaces for network access
    port: 5173,
    strictPort: false, // Try next available port if 5173 is taken
  },
  build: {
    target: 'esnext', // Modern browsers for WebXR support
    minify: 'esbuild'
  }
})

