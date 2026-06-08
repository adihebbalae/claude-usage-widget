# Copilot Instructions — Claude Usage Widget (Enterprise Fork)

## Project Conventions

- **`.dev/` folder is gitignored** — internal strategy, roadmap, and planning docs live here. Never commit `.dev/` contents. Reference them for context but don't expose in PRs.
- **Fork attribution is required** — MIT license mandates keeping the original copyright in `LICENSE`. The README includes an attribution line to the original author. Do not remove these.
- **Author/branding is Hebbala LLC** — all copyright, package.json author, and repo links point to `adihebbalae/claude-usage-widget`. When adding new user-facing strings, use this identity.
- **Platform-conditional features** — features like the tray flyout are Windows-only. Always gate platform-specific code with `process.platform === 'win32'` and ensure macOS/Linux paths remain functional.
- **Flyout is a separate renderer** — `flyout.html/css/js` + `preload-flyout.js` are a self-contained UI. They share no code with the main widget renderer. Keep them decoupled.

## Tooling & Commands

- **Dev launch**: `npm run dev` — runs Electron with `--remote-debugging-port=9223 --remote-allow-origins=*`
- **Debug logging**: set `DEBUG_LOG=1` env var or pass `--verbose` flag. Do NOT use `--debug` — Electron 33+ treats it as the deprecated Node.js inspector flag (`DEP0062`) and crashes.
- **Kill before relaunch**: Electron's single-instance lock means stray processes block new launches. Always `Get-Process -Name "electron" | Stop-Process -Force` before relaunching.
- **Build**: `npm run build:win` / `build:mac` / `build:linux` via electron-builder.

## Gotchas & Anti-Patterns

- **Electron 33 CDP requires `--remote-allow-origins=*`** — without this flag, WebSocket connections to CDP targets return 403 Forbidden. The dev script already includes it; do not remove.
- **Hidden windows can't be screenshotted via CDP** — `Page.captureScreenshot` on a `show: false` BrowserWindow will time out. Use `Runtime.evaluate` to inspect DOM text content instead, or `.show()` the window first.
- **Port 9223 collides with Chrome** — if the user has Chrome running with browser-harness on the default port, Electron can't bind 9223. Use a different port (`9444`) and set `$env:BU_CDP_URL` accordingly.
- **browser-harness lacks websocket module** — raw WebSocket CDP calls fail with `ModuleNotFoundError`. Use `curl -s http://127.0.0.1:9223/json` for target discovery and `pip install websocket-client` for WebSocket-based inspection, or stick to browser-harness's built-in helpers.
- **`backgroundMaterial` requires Electron 30+** — the tray flyout uses `backgroundMaterial: 'mica'`. Do not downgrade Electron below 30.
- **Tray flyout is pre-created but hidden** — `createFlyoutWindow()` runs at startup with `show: false`. It's toggled visible on tray click. The `blur` event hides it. Do not destroy/recreate it on every toggle.
- **Settings skin re-application** — opening the settings panel runs `loadSettings()` which re-applies the saved skin. After programmatic skin changes, re-apply at runtime after settings close.

## Agent Behavior

- **Verify Electron API changes before upgrading** — Electron makes breaking changes across major versions. Always check the breaking changes list for the target version before upgrading. The jump from 28→33 broke `--debug` and added CDP origin restrictions.
- **Use text-based CDP verification over screenshots for hidden windows** — when testing flyout or other hidden windows, use `Runtime.evaluate` to check `document.body.innerText` or specific element content rather than attempting screenshots.
- **Don't open interactive debuggers** — `git rebase -i`, `git add -i`, and similar interactive commands hang in this environment. Use non-interactive alternatives.
