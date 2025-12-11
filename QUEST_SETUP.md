# Connecting Your Meta Quest to the VR App

## What is the Quest Browser?

The Quest Browser is the built-in web browser on your Meta Quest headset (Quest 2, Quest 3, or Quest Pro). It's similar to Chrome/Firefox but runs inside VR and supports WebXR for VR experiences.

## Step-by-Step Setup

### 1. Make Sure Your Dev Server is Running

On your computer, start the dev server:
```bash
npm run dev
```

You should see output like:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   https://localhost:5173/
➜  Network: https://10.0.0.56:5173/
```

**Important**: Note the Network URL (your IP address) - you'll need this!

### 2. Put on Your Quest Headset

1. Turn on your Quest headset
2. Put it on and make sure you're in the Quest home environment

### 3. Open the Browser on Quest

1. **Press the Oculus/Meta button** on your right controller (the button with the O logo)
2. This opens the **Quick Actions** menu
3. Look for **"Browser"** or **"Internet"** in the menu
4. Click on it to open the Quest Browser

**Alternative method:**
- Use the search bar at the top of the Quest home
- Type "Browser" and select it

### 4. Navigate to Your Dev Server

1. In the Quest Browser, you'll see an address bar at the top
2. Click on it (you may need to use the controller to point and click)
3. Type your computer's IP address with `https://` prefix:
   ```
   https://10.0.0.56:5173
   ```
   (Replace `10.0.0.56` with your actual IP address from step 1)

4. Press Enter or click Go

### 5. Accept the SSL Certificate (if needed)

- If you see a security warning, click **"Advanced"** or **"Details"**
- Then click **"Proceed anyway"** or **"Accept risk"**
- This is normal for local development certificates

### 6. Enter VR Mode

Once the page loads:
1. You should see your forest scene rendered in the browser
2. Look for a button that says **"Enter VR"** or **"Enter XR"**
3. Click it with your controller
4. The browser will ask permission to enter VR mode - **Allow it**

**Note**: If you don't see an "Enter VR" button, the app might auto-detect VR and prompt you automatically.

### 7. You're in VR! 🎉

- You should now be inside your forest scene
- Move your controllers around to interact
- Try grabbing mushrooms (get close and press trigger)
- Try pointing at distant mushrooms to pull them closer
- Move controllers near trees to see pop-out information

## Troubleshooting

### Can't Find the Browser

- Make sure your Quest is updated to the latest software
- Try searching for "Browser" in the Quest home search
- Some Quest headsets have it in the Apps section

### Can't Connect to the Server

**Check Network:**
- Make sure your Quest and computer are on the **same WiFi network**
- Quest must be on WiFi (not mobile hotspot)
- Try pinging your computer's IP from another device to verify it's accessible

**Check Firewall:**
- Your computer's firewall might be blocking connections
- Temporarily disable firewall or allow Node.js/Vite through firewall
- See SETUP.md for firewall instructions

**Check IP Address:**
- Make sure you're using the correct IP address
- On Mac: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- The IP should start with `192.168.x.x` or `10.0.x.x`

### Page Loads But No "Enter VR" Button

- Make sure you're using **HTTPS** (not HTTP)
- Check browser console for errors (hard to access on Quest, but you can check on your computer)
- Try refreshing the page
- Make sure WebXR is enabled in Quest settings

### Enter VR Button Doesn't Work

- Make sure you've granted VR permissions when prompted
- Try restarting the Quest browser
- Make sure your Quest software is up to date
- Some Quest browsers require you to enable "Experimental Features" for WebXR

### Controllers Not Showing Up

- Make sure controllers are turned on and paired
- Try restarting the Quest
- Check that the app is detecting controllers (they should appear as hands/controllers in VR)

## Quick Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Quest and computer on same WiFi network
- [ ] Quest Browser opened
- [ ] Navigated to `https://YOUR_IP:5173`
- [ ] Accepted SSL certificate (if prompted)
- [ ] Clicked "Enter VR" button
- [ ] Granted VR permissions
- [ ] Controllers visible and working

## Alternative: Using Quest Link (Advanced)

If you want to test in the Quest browser on your computer first:

1. Install **Quest Link** software on your computer
2. Connect Quest via USB cable
3. Enable "Developer Mode" in Quest settings
4. You can then use the Quest browser through the Oculus software

However, the WiFi method above is usually easier for development!

## Need More Help?

- Check the main README.md for general setup
- See SETUP.md for SSL certificate issues
- Make sure all dependencies are installed: `npm install`

