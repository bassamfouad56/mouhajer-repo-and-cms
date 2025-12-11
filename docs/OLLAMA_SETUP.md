# Ollama Setup & Maintenance Guide

## Current Status
- **Mac Mini IP**: 100.111.21.66
- **Ollama Port**: 11434
- **Currently Running**: Yes (PID: 66365)

## Keep Ollama Always Online

### Option 1: LaunchDaemon (Recommended for Mac)

Create a system service that auto-starts on boot and restarts on crash.

**SSH into Mac Mini:**
```bash
ssh bassamfouad@100.111.21.66
```

**Create LaunchDaemon file:**
```bash
sudo nano /Library/LaunchDaemons/com.ollama.server.plist
```

**Paste this content:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
    </dict>
    <key>StandardErrorPath</key>
    <string>/tmp/ollama.err</string>
    <key>StandardOutPath</key>
    <string>/tmp/ollama.out</string>
</dict>
</plist>
```

**Set permissions and load:**
```bash
sudo chown root:wheel /Library/LaunchDaemons/com.ollama.server.plist
sudo chmod 644 /Library/LaunchDaemons/com.ollama.server.plist
sudo launchctl load /Library/LaunchDaemons/com.ollama.server.plist
```

**Verify it's running:**
```bash
sudo launchctl list | grep ollama
curl http://localhost:11434/api/tags
```

### Option 2: Cron Job (Simple Alternative)

Add this to crontab to check every 5 minutes:

```bash
# Edit crontab
crontab -e

# Add this line:
*/5 * * * * pgrep -f "ollama serve" || /usr/local/bin/ollama serve > /tmp/ollama.log 2>&1 &
```

### Option 3: Screen Session (Manual but Persistent)

```bash
# Start a detached screen session
screen -dmS ollama ollama serve

# Reattach to view logs
screen -r ollama

# Detach: Ctrl+A then D
```

---

## Prevent Mac Mini from Sleeping

Run on Mac Mini:
```bash
# Never sleep
sudo pmset -a sleep 0
sudo pmset -a displaysleep 0
sudo pmset -a disksleep 0

# Verify settings
pmset -g
```

---

## Monitor Ollama Health

**Check if running:**
```bash
pgrep -f ollama || echo "Ollama is DOWN"
```

**Test API:**
```bash
curl http://localhost:11434/api/tags
```

**View logs (if using LaunchDaemon):**
```bash
tail -f /tmp/ollama.out
tail -f /tmp/ollama.err
```

**Restart manually:**
```bash
# If using LaunchDaemon
sudo launchctl unload /Library/LaunchDaemons/com.ollama.server.plist
sudo launchctl load /Library/LaunchDaemons/com.ollama.server.plist

# Or kill and restart
pkill ollama
ollama serve &
```

---

## Best Practices

1. **Use LaunchDaemon** - Most reliable, auto-restarts on crash
2. **Disable Mac Mini sleep** - Prevents network drops
3. **Monitor logs** - Check `/tmp/ollama.out` for issues
4. **Test regularly** - Run `curl http://100.111.21.66:11434/api/tags` from your dev machine

---

## Troubleshooting

### Ollama Not Responding
```bash
# Check if process exists
pgrep -f ollama

# Check logs
tail -50 /tmp/ollama.out

# Restart service
sudo launchctl stop com.ollama.server
sudo launchctl start com.ollama.server
```

### Port Already in Use
```bash
# Find what's using port 11434
lsof -i :11434

# Kill the process
kill -9 <PID>

# Restart Ollama
ollama serve
```

### Mac Mini Unreachable
```bash
# From your Windows machine
ping 100.111.21.66

# If no response, Mac Mini might be asleep or network issue
# Wake it remotely (if Wake-on-LAN is enabled)
```

---

## Models Available

Check installed models:
```bash
ssh bassamfouad@100.111.21.66 "ollama list"
```

Pull new models:
```bash
ssh bassamfouad@100.111.21.66 "ollama pull llama3.2"
```

---

This setup ensures Ollama is always available for your chatbot! 🚀
