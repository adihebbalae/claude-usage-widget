# Claude Usage Widget v1.7.X Release History

This document consolidates all release notes for the 1.7.x release series.

---

## v1.7.6

**Released:** August 2026

This release adds multi-account support, per-model usage breakdowns, clearer credit reporting, smarter notifications, and resolves several security advisories.

### What's New

**Multi-account support**
New `--profile=<name>` launch flag isolates an instance to its own session, cookies, and settings, letting two accounts run side by side. This is a new power-user feature. Please report anything odd via a Discussion as more people try it.

**Per-model weekly limits (Fable and future models)**
Fable now gets its own row in the expanded panel, the usage history chart, and compact mode, with the same threshold coloring as Session and Weekly. Any future per-model limit Anthropic adds will render automatically, no update required. Thanks to @irishpolyglot, @torsten-liermann, and @gastyg, who each independently found and fixed the root cause across three separate PRs.

**Credit clarity for Extra Usage**
The spend meter is now labeled "Monthly Spend $X/$Y cap" to make clear it's a consumption throttle, not a running bill. A new Credits row shows your live balance, with a promo-vs-purchased split and an expiry warning when relevant.

**Compact mode spend row**
Compact mode can now show a collapsible Monthly Spend row via a chevron toggle, so you don't need to switch to normal mode to check it.

**Smarter usage alerts**
Notifications now fire once when usage is fully blocked (session or weekly hits 100%) and again when it's genuinely available, spanning both windows so a session reset doesn't falsely report "available again" while weekly is still maxed out.

**Pre-release update notifications**
Users running a release candidate now get notified when a newer pre-release ships, not just when a stable release does.

### Bug Fixes

- Off-screen window recovery: if your saved window position falls outside every connected display (for example after a monitor change), the widget now centers itself instead of launching invisibly, both at startup and live while running.
- Fixed the app getting stuck running invisibly with no way back when Tray Stats is off and the window is closed or minimized.
- Fixed "Exit" not actually quitting when Tray Stats is on.
- The Elapsed-time ring no longer borrows the usage warn/danger colors. It now uses its own fixed thresholds, since an approaching reset isn't a warning. Reported by KickTechnic.

### Security

Updated Electron (28 to 41) and electron-builder (24 to 26), resolving 6 high-severity CVEs. Thanks to @Dolphin2ii for the initial PR. `npm audit` is clean at 0 vulnerabilities.

---

## v1.7.5

**Released:** June 2026

This release brings chart improvements, expanded usage field support, per-account history isolation, UI polish, and a collection of behind-the-scenes fixes that improve stability and reduce resource usage.

### What's New

**Expanded usage fields**
The widget now displays rows and chart lines for additional API fields when your account returns them: Cowork (7d), OAuth Apps (7d), Sonnet (7d), Opus (7d), and Design (7d). Rows and chart lines only appear when the API returns non-null data for that field — users on plans without model-level breakdowns will see no change.

**Proportional chart time scale**
The usage graph X-axis now positions data points according to their actual timestamps. Time gaps (such as closing the app overnight) appear as proportional gaps in the graph line rather than being compressed. Rapid manual refreshes no longer distort the chart scale.

**Full settings panel from compact mode**
Clicking the settings icon in compact mode now temporarily expands the window to full size and opens the complete settings panel. Previously, compact mode only showed a minimal overlay. The window returns to compact mode after clicking Done.

**Per-account history isolation**
Usage history is now stored separately per organization ID. Switching accounts shows only that account's data in the graph, and switching back restores its history. Existing single-account history is automatically migrated on first launch — no data is lost. History older than 8 days is pruned automatically on startup.

### Bug Fixes

**Hide to tray on close when tray stats are enabled**
When Show Tray Stats is enabled, clicking the close button now hides the window to the tray instead of quitting the app. The tray context menu Exit option always quits regardless of this setting.

**Login screen buttons unreachable on fresh install**
On a fresh install or after logout, the login screen was not resizing the window from the widget's default height, causing the Log In and Manual buttons to render off-screen with no way to reach them. Fixed. Thanks to @Geozstevenzz for the detailed reproduction steps and root cause analysis.

**Pre-release versions no longer trigger update notifications**
The update check now correctly ignores remote versions with any pre-release suffix (rc, beta, alpha, etc.) regardless of version number. Previously a tag like `v1.7.5-rc.1` could incorrectly trigger an update alert over an installed `1.7.4`.

**Stable chart X-axis date range**
The chart X-axis no longer extends beyond the last data point with phantom future dates. Daily tick labels now use calendar day arithmetic for stability across auto-refreshes.

**Design (7d) field correctly separated from Cowork**
The `seven_day_omelette` API field was previously aliased to Cowork. It is now correctly mapped as its own Design (7d) row in brown. Cowork and Design are now fully independent.

**Invalid session data no longer pollutes the graph**
The app now skips writing to the graph history if the API response is missing reset timestamps, which reliably indicates a dead or expired session.

### Performance

**~20x reduction in idle CPU usage**
The countdown timer interval was reduced from 1 second to 30 seconds. Since the display only shows minute-level precision, per-second ticking was triggering unnecessary repaints with no visible benefit. New data from API fetches still displays immediately.

### Platform & CI

**Portable mode autostart**
The Launch at Startup toggle is now disabled in portable mode with a clear explanation. Registry-based autorun is incompatible with version-specific portable filenames. See the README for the `shell:startup` workaround.

**Automatic prerelease detection in CI**
All three platform build workflows now derive prerelease status from the tag name automatically. Tags containing a hyphen are marked as pre-release; clean version tags are marked as stable. This removes a manual correction step from the release process.

---

## v1.7.3

**Released:** April 30, 2026

This release focuses on performance optimization, UI polish, and preventing accidental app hiding.

### What's New

**API Call Optimization & Memory Efficiency**

**Single-Window Reuse**: Refactored API fetching to reuse a single BrowserWindow across sequential requests instead of creating/destroying three separate windows per poll cycle. This reduces memory overhead and improves stability during automated refresh cycles.

**Conditional Polling**: Extended usage data (overage costs, prepaid balance) is now fetched only when the expand panel is visible. When the panel is collapsed, only the primary usage endpoint is called, reducing API traffic by ~66% during typical usage. Opening the expand panel triggers an immediate fetch of the additional data.

**Currency Formatting Enhancement**: All currency values now display with two decimal places (e.g., $2.00 instead of $2) for consistency with financial reporting standards and improved readability.

**Tray Icon Click Behavior (Windows)**: Fixed tray icon click behavior on Windows where clicking the weekly usage tray icon would flash the window instead of properly showing it. The fix uses opacity masking to hide the DWM compositor blink during window restoration, ensuring smooth transitions when bringing the window to the foreground.

### Bug Fixes

**Prevent Accidental App Hiding**: Implemented bidirectional toggle coupling between "Hide from Taskbar" and "Show Tray Stats" settings to prevent users from accidentally hiding the app completely:
- Enabling "Hide from Taskbar" automatically enables "Show Tray Stats" (ensures tray icon visibility)
- Disabling "Show Tray Stats" automatically disables "Hide from Taskbar" (prevents app from becoming inaccessible)

Changes take effect immediately in the Settings UI, providing clear visual feedback when toggles are coupled.

**Expand Panel Immediate Polling**: Fixed issue where expanding the Extra Usage panel would show blank data until the next polling cycle. The panel now fetches extended data immediately when opened and preserves existing data while waiting for the fetch to complete.

---

## v1.7.2

**Released:** March 2026

This release brings multi-organization support, real-time system tray indicators, enhanced security, and improved platform documentation.

### What's New

**Multi-Organization Support**: Users with both Personal and Teams Claude accounts can now select which organization to monitor directly from Settings. The organization selector appears automatically when multiple chat-enabled organizations are detected, defaulting to Teams when available. Switching organizations triggers an immediate refresh of usage data.

**System Tray Usage Indicators**: Two compact tray icons provide at-a-glance monitoring of your Claude usage without opening the widget. The left icon (blue) displays Weekly usage; the right icon (purple) shows Session usage. Each icon renders percentage values using a crisp 8├ù11 bitmap font optimized for legibility at system tray scale. When usage reaches 99-100%ΓÇöthe realistic threshold where Claude API requests begin to failΓÇöicons automatically switch to a red X indicator. Currently available on Windows; macOS and Linux support is planned for a future release.

**Enhanced Login Security**: Login flow now enforces strict navigation controls, restricting the login window to trusted authentication domains only (claude.ai, Google, Apple, Microsoft OAuth providers). Popup windows are blocked, and the current URL is displayed in the window title bar for full transparency. These measures prevent phishing attacks and login flow hijacking attempts.

**Expanded Platform Documentation**: Linux users now have access to comprehensive setup instructions for creating application launchers and configuring auto-start behavior, contributed by community member [@sergkuzn](https://github.com/sergkuzn).

### Bug Fixes

**Semantic Versioning Compliance**: Corrected update checker logic to properly handle pre-release version comparisons. The checker previously treated stable versions (e.g., 1.7.1) as newer than pre-release candidates (e.g., 1.7.2-rc.1), causing incorrect update notifications. Version comparison now strictly follows semantic versioning standards.

---

## v1.7.1

**Released:** March 2026

### Bug Fixes

Security and stability improvements.

---

## v1.7.0

**Released:** March 15, 2026

### New Features

**Currency Support**: Extra usage row now displays the correct currency symbol (Γé¼, ┬ú, $) based on the user's account billing currency. Falls back to the ISO code for any currency without a mapped symbol (e.g. 42 CHF).

**Usage History Graph** (contributed by cwil2072): A toggleable line graph showing up to 7 days of session and weekly usage history. Snapshots are persisted in local storage so history survives app restarts. Session and Weekly lines are always shown; Sonnet and Extra Usage lines appear only when those sections are visible. The graph button highlights purple when active. Graph tooltip shows exact timestamp and value on hover.

### Improvements

**Refresh Icon Animation**: The refresh button now spins during both manual and automatic background refreshes, giving a clear visual indication the app is updating.

**Always Show Widget When Logged In**: The widget now always displays session and weekly rows after login, showing 0% and "Not started" when no active session exists ΓÇö consistent with Claude's own usage UI.

**macOS Window Width**: Increased widget width from 530px to 560px to prevent the "Resets At" date/time column from clipping on macOS due to higher-DPI font rendering.

### Bug Fixes

**macOS Minimize/Restore** (contributed by cwil2072): Fixed minimize button and Dock restore behavior on macOS. The widget now minimizes to the Dock (instead of vanishing) and reliably returns when the Dock icon is clicked. Windows behavior unchanged ΓÇö minimize still hides to tray.

**Alert Crash Fix**: Fixed missing Notification import in main.js that caused an uncaught ReferenceError and app crash whenever a usage alert fired (e.g. at 90% threshold).

**Weekly Limit Always Visible**: Fixed a bug where the widget would show "No Usage Yet" between session windows even when weekly usage data was present.

---

**For older releases (v1.6.x and earlier), see:** https://github.com/SlavomirDurej/claude-usage-widget/releases
