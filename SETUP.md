# Setup Guide for Quest VR Development

## SSL Certificate Issues

The Quest browser is very strict about SSL certificates. Here are solutions:

### Option 1: Use mkcert (Recommended)

`mkcert` creates locally-trusted certificates that browsers will accept:

1. **Install mkcert** (if not already installed):

   **macOS:**
   ```bash
   brew install mkcert
   ```

   **Linux:**
   ```bash
   sudo apt install libnss3-tools
   wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
   chmod +x mkcert
   sudo mv mkcert /usr/local/bin/
   ```

   **Windows:**
   Download from: https://github.com/FiloSottile/mkcert/releases

2. **Install the local CA:**
   ```bash
   mkcert -install
   ```

3. **Generate certificates for your project:**
   ```bash
   mkcert localhost 127.0.0.1 ::1 YOUR_LOCAL_IP
   ```
   Replace `YOUR_LOCAL_IP` with your actual local IP (e.g., `10.0.0.56`)

   This creates `localhost.pem` and `localhost-key.pem` in your project root.

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

### Option 2: Accept Self-Signed Certificate in Quest Browser

If you can't use mkcert, you need to accept the certificate in Quest:

1. Start the dev server: `npm run dev`
2. On your Quest, open the browser
3. Navigate to `https://YOUR_IP:5173`
4. You'll see a security warning - look for "Advanced" or "Details" button
5. Click "Proceed anyway" or "Accept risk" (exact wording varies)
6. The page should load

**Note:** Quest browser may require you to accept the certificate each time you restart the server.

### Option 3: Use ngrok (Alternative)

If the above don't work, you can use ngrok to create a secure tunnel:

1. **Install ngrok:**
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Start your dev server:**
   ```bash
   npm run dev
   ```

3. **In another terminal, create tunnel:**
   ```bash
   ngrok http 5173
   ```

4. **Use the HTTPS URL from ngrok** in your Quest browser

## Network Connectivity Issues

If you're getting connection timeouts:

### Check Firewall

**macOS:**
1. System Settings → Network → Firewall
2. Make sure firewall allows incoming connections for Node/Vite
3. Or temporarily disable firewall for testing

**Linux:**
```bash
# Check if port is open
sudo ufw status
# Allow port 5173 if needed
sudo ufw allow 5173
```

**Windows:**
1. Windows Security → Firewall & network protection
2. Allow an app through firewall → Add Node.js/Vite

### Verify Server is Running

1. Check that the dev server shows:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   https://localhost:5173/
   ➜  Network: https://10.0.0.56:5173/
   ```

2. Test from your computer first:
   ```bash
   curl -k https://localhost:5173
   ```

3. Test from another device on the same network (phone, tablet)

### Verify IP Address

Make sure you're using the correct IP:

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Look for your local network IP (usually starts with 192.168.x.x or 10.0.x.x)

## Quick Test Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] Server shows Network URL with your IP
- [ ] Quest and computer are on same WiFi network
- [ ] Firewall allows connections on port 5173
- [ ] Using HTTPS (not HTTP) - WebXR requires HTTPS
- [ ] Certificate is accepted in Quest browser (if using self-signed)

## Still Having Issues?

1. Try accessing from your phone's browser first to verify connectivity
2. Check Quest browser console for specific errors
3. Try a different port (modify `vite.config.ts`)
4. Restart both the dev server and Quest browser
5. Ensure Quest browser is updated to latest version

