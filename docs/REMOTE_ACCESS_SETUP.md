# Remote Access Setup - X: Drive & Ollama from Anywhere

## What This Enables

✅ Access X: drive (`\\mouhajerserver2\creative`) from anywhere
✅ Use Ollama chatbot remotely (your AI works from any location)
✅ Secure encrypted connection (no exposed ports)
✅ Works on phone, laptop, tablet - anywhere with internet

---

## Step 1: Install Tailscale on Windows PC (✅ Done)

The installer is launching now. Follow these steps:

### Installation:
1. **Click "Install"** in the Tailscale setup wizard
2. **Sign in** when prompted (create account if needed - it's free)
   - Recommended: Sign in with Google or GitHub for easy access
3. **Allow network changes** when Windows asks for permission

### After Installation:
- Tailscale will show in your system tray (look for the Tailscale icon)
- Your PC will get a Tailscale IP like `100.x.x.x`

---

## Step 2: Enable Subnet Routing (Critical for Network Drives)

This allows remote access to your network drives (X:, Z:) and other local network devices.

### Run these commands in PowerShell (as Administrator):

```powershell
# Enable subnet routing
tailscale up --advertise-routes=192.168.1.0/24,10.0.0.0/8 --accept-routes

# If your network uses different IPs, adjust the ranges above
# Common ranges:
# - 192.168.0.0/24 or 192.168.1.0/24 (most home networks)
# - 10.0.0.0/8 (some networks)
```

### In Tailscale Admin Console:
1. Go to: https://login.tailscale.com/admin/machines
2. Find your Windows PC in the list
3. Click **"..."** → **"Edit route settings"**
4. **Enable** "Subnet routes" (approve the routes you advertised)

---

## Step 3: Install Tailscale on Remote Devices

### On Your Laptop:
1. Download: https://tailscale.com/download
2. Install and sign in with **same account** as PC
3. You'll now see your PC in the Tailscale network

### On Your Phone:
1. **iOS**: Download "Tailscale" from App Store
2. **Android**: Download "Tailscale" from Play Store
3. Sign in with **same account** as PC

### On Mac Mini (if you want):
```bash
# Already done via SSH
ssh bassamfouad@100.111.21.66
brew install tailscale
sudo tailscale up
```

---

## Step 4: Access X: Drive Remotely

### From Windows Laptop:
```cmd
# Map network drive using Tailscale IP
# First, get your PC's Tailscale IP (run on main PC):
tailscale ip -4

# Then on laptop, map drive (replace 100.x.x.x with actual Tailscale IP):
net use X: \\100.x.x.x\mouhajerserver2\creative
```

Or use the server name directly:
```cmd
net use X: \\mouhajerserver2\creative
```

### From Mac/Linux:
```bash
# Mount network share (replace 100.x.x.x with PC's Tailscale IP)
mount -t cifs //100.x.x.x/mouhajerserver2/creative /mnt/x-drive \
  -o username=YourWindowsUsername,password=YourPassword
```

### From Phone:
- **iOS**: Use "Files" app → Connect to Server → `smb://100.x.x.x/mouhajerserver2/creative`
- **Android**: Use "Solid Explorer" or "FX File Explorer" → Network → Add SMB connection

---

## Step 5: Access Ollama Remotely

### Get Your PC's Tailscale IP:
Run on your Windows PC:
```cmd
tailscale ip -4
```

You'll get something like: `100.111.21.66`

### Update Environment Variables (for remote access):

**On your laptop** (when developing remotely):

**.env.local**:
```bash
# Use your PC's Tailscale IP (get it from 'tailscale ip -4')
OLLAMA_BASE_URL=http://100.x.x.x:11434
OLLAMA_MODEL=llama3.2:3b
```

### Test Remote Ollama:
```bash
# From any device on Tailscale network
curl http://100.x.x.x:11434/api/tags
```

---

## Step 6: Run Ollama as Windows Service (Always On)

So Ollama starts automatically when your PC boots:

```powershell
# Stop current Ollama instance
taskkill /F /IM ollama.exe

# Create Windows service
sc.exe create Ollama binPath="C:\Users\thegh\AppData\Local\Programs\Ollama\ollama.exe serve" start=auto

# Set environment variable for service
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Ollama" /v Environment /t REG_MULTI_SZ /d "OLLAMA_MODELS=X:\ollama-models"

# Start service
sc.exe start Ollama
```

Or simpler - use Task Scheduler:
1. Open Task Scheduler
2. Create Basic Task → "Ollama Service"
3. Trigger: "When computer starts"
4. Action: "Start a program"
   - Program: `C:\Users\thegh\AppData\Local\Programs\Ollama\ollama.exe`
   - Arguments: `serve`
5. ✅ Run whether user is logged on or not

---

## Benefits Summary

| Feature | Before | After (Tailscale) |
|---------|--------|-------------------|
| **X: Drive Access** | Local network only | ✅ Anywhere with internet |
| **Ollama AI** | Local PC only | ✅ Works remotely |
| **Security** | Unencrypted local network | ✅ End-to-end encrypted |
| **Setup Complexity** | N/A | ✅ 5 minutes |
| **Cost** | Free | ✅ Still free |

---

## Production Deployment (Vercel)

**Important**: For your website deployed on Vercel, you still need a cloud AI provider because:
- Vercel servers cannot join your Tailscale network
- Your PC must be on 24/7 for remote Ollama to work

**Recommended Production Setup**:
1. **Development** (when you're coding): Use local/remote Ollama via Tailscale
2. **Production** (live website): Use Groq (free cloud AI)

I can set up hybrid mode so it auto-switches:
- Local dev → Tailscale Ollama
- Vercel production → Groq cloud AI

---

## Troubleshooting

### X: Drive not accessible remotely
1. Check subnet routing is enabled (Step 2)
2. Verify Windows file sharing is enabled:
   - Settings → Network → Advanced sharing settings
   - Enable "File and printer sharing"
3. Check Windows Firewall allows SMB (port 445)

### Ollama not accessible remotely
1. Check Ollama is running: `tasklist | findstr ollama`
2. Test locally first: `curl http://localhost:11434/api/tags`
3. Check Windows Firewall allows port 11434
4. Get Tailscale IP: `tailscale ip -4`

### Can't connect to Tailscale
1. Check you're signed in to same account on all devices
2. Verify Tailscale is running (system tray icon)
3. Try: `tailscale status` to see network state

---

## Security Notes

✅ **Tailscale is secure**:
- End-to-end encrypted (WireGuard protocol)
- Zero-trust architecture
- No exposed ports to internet
- Only devices on YOUR account can connect

✅ **Best practices**:
- Use strong password for Windows account (for network drive access)
- Enable Windows firewall
- Keep Tailscale updated
- Don't share your Tailscale account

---

## Quick Commands Reference

```bash
# Get your PC's Tailscale IP
tailscale ip -4

# Check Tailscale status
tailscale status

# Check Ollama is running
curl http://localhost:11434/api/tags

# Check Ollama remotely (from laptop)
curl http://100.x.x.x:11434/api/tags

# Map X: drive remotely (Windows)
net use X: \\mouhajerserver2\creative

# Restart Ollama
taskkill /F /IM ollama.exe && ollama serve
```

---

## What's Next?

1. ✅ Complete Tailscale installation (follow wizard)
2. ✅ Run subnet routing commands (Step 2)
3. ✅ Install Tailscale on laptop/phone
4. ✅ Test remote access to X: drive
5. ✅ Test remote access to Ollama
6. Optional: Set up Groq for production (so website works even when PC is off)

**Ready to test!** 🚀
