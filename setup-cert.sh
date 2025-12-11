#!/bin/bash

# Setup script for SSL certificates using mkcert

echo "🔐 Setting up SSL certificates for Quest VR development..."
echo ""

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert is not installed."
    echo ""
    echo "Please install mkcert first:"
    echo "  macOS:   brew install mkcert"
    echo "  Linux:   See https://github.com/FiloSottile/mkcert#linux"
    echo "  Windows: Download from https://github.com/FiloSottile/mkcert/releases"
    exit 1
fi

# Get local IP address
LOCAL_IP=$(ifconfig | grep -E "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

if [ -z "$LOCAL_IP" ]; then
    echo "❌ Could not detect local IP address"
    exit 1
fi

echo "📍 Detected local IP: $LOCAL_IP"
echo ""

# Install local CA if not already installed
echo "📦 Installing local CA (you may be prompted for password)..."
mkcert -install

# Generate certificates
echo ""
echo "🔑 Generating certificates for localhost, 127.0.0.1, ::1, and $LOCAL_IP..."
mkcert localhost 127.0.0.1 ::1 "$LOCAL_IP"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Certificates generated successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Restart your dev server: npm run dev"
    echo "   2. On Quest, navigate to: https://$LOCAL_IP:5173"
    echo "   3. The certificate should now be trusted!"
else
    echo ""
    echo "❌ Failed to generate certificates"
    exit 1
fi

