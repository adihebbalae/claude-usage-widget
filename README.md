# Claude Usage Widget

A real-time desktop widget for monitoring Claude.ai usage across your organization. Track session limits, weekly quotas, and cost — at a glance.

![Claude Usage Widget - Main](assets/screenshot-main.png)

---

## Features

- **Real-time Usage Tracking** — Monitor session and weekly usage limits
- **Visual Progress Bars** — Gradient indicators with configurable warning thresholds
- **Countdown Timers** — Circular timers showing reset windows
- **Auto-refresh** — Configurable polling interval (default 5 min)
- **Usage History Graph** — 7-day trend chart for session and weekly usage
- **Multi-Account Support** — Switch between multiple Claude accounts
- **Multi-Org Support** — Teams and Personal organization switching
- **Currency Support** — Billing display in your account's currency
- **Cross-Platform** — Windows, macOS (Intel + Apple Silicon), Linux
- **Secure** — Encrypted credential storage via OS keychain
- **System Tray** — Dual tray icons with real-time usage percentages (Windows)
- **Themes** — Dark, Light, System, and Liquid Glass skins
- **Compact Mode** — Minimal two-bar view
- **Usage Alerts** — Desktop notifications at configurable thresholds

---

## Installation

### Download

Download the latest release for your platform:

- **Windows:** Setup installer or portable exe
- **macOS:** DMG (Apple Silicon or Intel)
- **Linux:** AppImage (x64 or arm64)

### Build from Source

```bash
git clone https://github.com/adihebbalae/claude-usage-widget.git
cd claude-usage-widget
npm install
npm start
```

Requires Node.js 18+.

---

## Quick Start

1. Launch the widget
2. Click "Login to Claude"
3. Sign in with your Claude.ai credentials
4. Usage data displays immediately

---

## Understanding the Display

| Element | Description |
|---------|-------------|
| Session Used | 5-hour rolling window progress (0-100%) |
| Weekly Used | 7-day rolling limit progress |
| Elapsed Timer | Circular indicator of time through current window |
| Resets In | Countdown to window reset |
| Resets At | Local clock time when the window resets |

**Threshold Colors:**
- Purple/Blue: Normal usage (below warning)
- Orange: High usage (above warning threshold)
- Red: Critical usage (above danger threshold)

---

## Settings

- Warning & danger thresholds
- Time format (12h / 24h)
- Date format for reset displays
- Theme (Dark / Light / System)
- Skin (Default / Liquid Glass)
- Refresh interval
- Auto-start at login
- Minimize to tray behavior
- Usage alert notifications
- Organization selector (Teams + Personal)

---

## Privacy & Security

- Credentials stored locally using OS-level encrypted storage
- No data sent to third-party servers
- Communicates only with the official Claude.ai API
- Logout clears all session data and cookies

---

## License

This project is licensed under the [MIT License](LICENSE).

Original work by [Slavomir Durej](https://github.com/SlavomirDurej/claude-usage-widget). Forked and maintained by [Hebbala LLC](https://github.com/adihebbalae).
