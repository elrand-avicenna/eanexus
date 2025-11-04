# Mobile S25 Ultra Web Interface — Development Plan

Context: Pure frontend (HTML/CSS/JS/JSON), dynamic and responsive smartphone interface simulating Samsung S25 Ultra. Assets provided by user:
- Videos: Nexus.mp4, Kajiit Mage Alchimiste.mp4, Cyber Haqueuse.mp4
- Music: Musique 1.wav, Musique 2.wav
- Default background video: Nexus.mp4 (can be changed in-app)
- Theme: Samsung S25 Ultra dark
- Content: Use complete placeholder examples (editable later)

Core of the experience: seamless app switching with persistent background video wallpaper and continuous music playback while navigating the simulated smartphone.

---

## Objectives
- Build a single-page, responsive smartphone UI with:
  - 5s loading screen → Welcome “Portal” page with notification ribbons
  - Fixed bottom dock (always visible) with 6 apps: Auteur, Calendrier, Casque (music), Fond d’écran, Projets, EA NEXUS
  - EA NEXUS app launcher housing 5 category apps:
    - Anim'Connect (WhatsApp-like layout)
    - Echo-Sphere (LinkedIn/Facebook-like feed)
    - Arena (Samsung Gaming Hub-like gallery)
    - Adventures (Habit tracker-like)
    - Medias (YouTube Video/Music-like)
  - Background video/image selector (Fond d’écran)
  - Background music player (Casque) that persists across app navigation
  - Author profile (Le Coin de l’Auteur)
  - Calendar app (month grid + day view navigation)
  - Projects overview (simple categories grid)
  - Smooth opening animations for all apps mimicking native smartphone transitions
- Data-driven via JSON (projects, playlists, wallpapers, portal notifications) for easy future editing by the user.

---

## Development Philosophy Mapping
- Identify Core Workflow: persistent video wallpaper + persistent audio + app window manager
- Core Level Assessment: No external APIs/integrations. POC not required. Build directly and test incrementally.
- Build App → Test incrementally (UI flows, media playback, persistence via localStorage)

---

## Phases

### Phase 1: Core Function/Feature POC (Isolation)
- Status: Skipped intentionally (no external APIs; pure frontend). We will validate the core as part of the V1 shell: wallpaper video autoplay (muted), persistent audio, window manager.

### Phase 2: V1 App Development (MVP)
1) Project structure (served statically by frontend/public):
   - /frontend/public/s25/index.html
   - /frontend/public/s25/styles.css
   - /frontend/public/s25/app.js
   - /frontend/public/s25/data/
     - wallpapers.json (default + options with video URLs)
     - playlist.json (list of tracks with titles/authors/urls)
     - portal.json (welcome text + notification ribbons)
     - projects.json (categories + items for 
       Anim'Connect/Echo-Sphere/Arena/Adventures/Medias)
   - /frontend/public/s25/assets/ (icons, placeholders)

2) Base shell & frame
   - Smartphone bezel with 20:9 aspect container, dark glass effect, subtle inner shadow
   - Status bar (time, signal, wifi, battery icons, punch-hole camera indicator)
   - Full-bleed background video element (autoplay muted, loop, plays inline)
   - Gradient overlays for readability

3) Global window manager
   - Single-page containers for: Portal, Auteur, Calendrier, Casque, Fond d’écran, Projets, EA NEXUS, plus the 5 category apps
   - All windows hidden by default; open/close with CSS transitions (scale, blur, opacity, slight parallax)
   - ESC/back button behavior to close current app; hardware-like back affordance in status bar

4) Fixed dock (always visible)
   - 6 centered app icons with labels: Auteur, Calendrier, Casque, Fond d’écran, Projets, EA NEXUS
   - Active state highlighting and haptic-like micro-animation (CSS)

5) Portal (home on load)
   - 5s loader splash (with skip after 2s)
   - Welcome text (from portal.json)
   - Notification ribbons/cards (from portal.json) with soft entry animation

6) Fond d’écran (Wallpaper)
   - Load wallpapers.json (videos + optional images)
   - Default set to Nexus.mp4
   - On select: immediately switch background source, save to localStorage
   - Provide simple controls: preview, set, mute/unmute wallpaper (unmute remains off by default due to autoplay policies)

7) Casque (Music)
   - Load playlist.json (Musique 1.wav, Musique 2.wav)
   - Global <audio> element outside app windows to persist playback
   - Controls: play/pause, next/prev, seek, volume, loop, track title/artist display
   - Save last track/time/volume in localStorage and restore

8) Calendrier
   - Samsung-like month grid (weekday headers, current day highlight)
   - Month navigation (prev/next), touch-friendly
   - Day details panel (placeholder events from JSON or in-memory)

9) Le Coin de l’Auteur (Profile)
   - Card/modal with avatar, name, short bio, social links
   - Edit placeholders easily from JSON

10) Projets (Overview)
   - Categories grid leading to EA NEXUS apps or directly presenting category summaries

11) EA NEXUS (App Launcher)
   - 5 app icons/cards with micro-landing (small animated info panel) before deep-opening the app

12) Category App Layouts with Placeholder Content
   - Anim'Connect: WhatsApp-like (chat list + chat view mock, messages from JSON)
   - Echo-Sphere: Feed of posts (avatar, title, text, image/video, reactions)
   - Arena: Game Hub grid (cards with covers, tags, CTA)
   - Adventures: Habit tracker (habit list, daily toggles, progress ring)
   - Medias: YouTube-like list (thumbnails/placeholders, play overlay opens a floating player)

13) Persistence & Settings
   - localStorage: selected wallpaper, music state, last opened app

14) Accessibility & Responsiveness
   - Keyboard navigation for core controls
   - Centered smartphone frame on desktop; on small screens, use full viewport mode

15) Media Policies & Fallbacks
   - Wallpaper video: autoplay muted, loop, playsinline; provide poster image fallback
   - Music requires user gesture to start (complies with autoplay restrictions)

16) Minimal JSON Schemas
   - wallpapers.json: [{ id, type: "video"|"image", title, url, poster }]
   - playlist.json: [{ id, title, artist, url, cover }]
   - portal.json: { welcomeTitle, welcomeText, notifications: [{ id, title, summary, ctaText, link }] }
   - projects.json: { categories: [{ id, name, icon, summary, items: [...] }] }

17) Implementation order (for stability)
   1. Base shell + video background (default Nexus.mp4) + dock
   2. Window manager + Portal (loader → welcome)
   3. Casque (persistent audio)
   4. Fond d’écran (wallpaper switcher + persistence)
   5. Calendrier
   6. Auteur + Projets
   7. EA NEXUS + 5 category apps
   8. Polish animations, a11y, responsive

18) End-of-Phase Testing (Automated + Manual)
   - Use testing agent to verify key flows (no drag-and-drop/camera/voice)
   - Manual cross-check for media playback and transitions

### Phase 3: Feature Expansion & Refinement
- Search bars in apps (chat, feed, media)
- Notifications center with badges
- Theming options (accent colors)
- Advanced media controls (crossfade, equalizer UI)
- Deep links and back-stack simulation
- Code modularization: split JS modules per app, SCSS build (optional)
- Re-run tests and fix issues

### Phase 4: Final Polish
- Performance: lazy-load heavy media, prefetch icons
- SEO for the public landing (if needed)
- Documentation: how to replace assets & JSON content
- Final testing pass and handoff

---

## Implementation Steps (Detailed)
1. Create the /s25 static app folder under frontend/public and scaffold index.html, styles.css, app.js
2. Add base smartphone frame and status bar UI
3. Insert background video element with Nexus.mp4 URL as default (muted autoplay)
4. Implement dock and window manager with animations
5. Build Portal from portal.json
6. Build Casque with playlist.json (uses Musique 1.wav + Musique 2.wav)
7. Build Fond d’écran from wallpapers.json (3 provided videos) with localStorage persistence
8. Build Calendrier month grid and navigation
9. Build Auteur and Projets shells
10. Build EA NEXUS and 5 category app UIs with placeholder data from projects.json
11. Add responsive rules and accessibility improvements
12. Test media playback, navigation, persistence
13. Fix issues, polish UI, micro-interactions

---

## Next Actions
- Proceed to Phase 2, Step 1–4: scaffold static files, base shell, default wallpaper video, dock, window manager
- Populate JSON files with initial placeholder content using provided asset URLs
- Share preview link to /s25/index.html for the first visual check

---

## Success Criteria
- Loader displays ≤ 5 seconds and transitions to Portal page
- Dock is always visible and interactive; app windows open with smooth animations
- Background video wallpaper loads by default (Nexus.mp4), can be changed in Fond d’écran
- Music player persists playback across app navigation; playlist loads and controls work
- EA NEXUS shows 5 apps with micro-landing animations; each app matches its target layout style with placeholder data
- Calendar month grid renders correctly with navigation
- Author profile and Projects overview accessible and well-structured
- All core content loaded from JSON; easy to replace by user
- Responsive on desktop and mobile; no console errors; media policies respected

---

## Asset URLs (for integration in JSON)
- Videos
  - Nexus.mp4: https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/6tcu83ul_Nexus.mp4
  - Kajiit Mage Alchimiste.mp4: https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/z97nb42w_Kajiit%20Mage%20Alchimiste.mp4
  - Cyber Haqueuse.mp4: https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/hg05l3f8_Cyber%20Haqueuse.mp4
- Music
  - Musique 1.wav: https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/bx6uroob_Musique%201.wav
  - Musique 2.wav: https://customer-assets.emergentagent.com/job_mobile-hub-13/artifacts/f1jlazwh_Musique%202.wav

---

## Risks & Mitigations
- Autoplay policies: wallpaper video will be muted by default; music requires user gesture to start
- Remote asset availability: if a URL fails, show graceful fallback placeholders and toasts
- Performance: use lazy rendering for heavy sections, keep animations GPU-friendly

---

## Testing Plan (after V1 build)
- Primary workflow
  1) Load → 5s splash → Portal
  2) Verify default wallpaper video plays (muted)
  3) Open Casque → start music → navigate between apps → verify music persists
  4) Open Fond d’écran → switch wallpaper → reload page → verify persistence
- Critical checks
  - Dock always visible, open/close animations smooth
  - Calendar navigation works
  - EA NEXUS → open each app → verify layout renders with data
  - No drag-and-drop/camera/voice tests
- Error handling
  - Invalid asset URL fallback messages
  - Empty JSON states display helpful info
