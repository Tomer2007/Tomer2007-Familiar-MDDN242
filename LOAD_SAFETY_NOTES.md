# Load-Time Safety & Positioning Configuration

## Overview
This document describes the load-time safety improvements, corrupted save file recovery, and how to configure UI positioning variables.

## Problem: Intermittent Load Failures (FIXED)

**Symptom:** Page occasionally loads with only the computer and wrongly-sized book sprite visible.

**Root Cause:** If the localStorage save file becomes corrupted:
1. `loadState()` would fail and only set `c.totalVisits = 1`, leaving 40+ variables uninitialized
2. These uninitialized variables (galleryCoins, easyStyleProfile, etc.) would be undefined
3. The draw loop would fail at rendering the creature, background, grid, or UI elements
4. Only elements that don't depend on those variables (guide book sprite) would render

**Solution Implemented:**
- Added `validateAndCleanupLocalStorage()` function that runs before setup
- This function checks all localStorage entries for valid JSON before loading
- If a file is corrupted, it's automatically cleared with a console warning
- Updated `loadState()` catch block to initialize ALL 40+ critical variables with safe defaults
- Added error logging to all JSON.parse failures so you can see what's corrupted

## Critical Fixes Applied

## Critical Fixes Applied

### 1. Storage Corruption Detection (NEW - lines 2840-2867)
- **validateAndCleanupLocalStorage()** runs at the very start of setup
- Checks 3 critical localStorage keys for valid JSON:
  - creature_v2 (creature state)
  - generation_history_v1 (paintings)
  - grid_dimensions_v1 (canvas size)
- If any are corrupted (invalid JSON), they're automatically removed
- Logs a warning to console: `"Detected corrupted X in localStorage. Clearing it..."`

### 2. Enhanced loadState() Error Recovery (lines 8805-8848)
- Previous: Only set `c.totalVisits = 1` on error (leaving 40+ variables undefined)
- **Current:** Full reset of ALL critical variables to safe defaults on error:
  - `galleryCoins = 0`
  - `easyStyleProfile = null` then `ensureEasyStyleProfile()`
  - `paletteUpgradeCount = 0`
  - `hasComputerUpgrade = false`
  - All theme IDs reset to defaults
  - Rest state reset
  - All style snapshots cleared
- Logs: `"loadState failed - save file may be corrupted..."`
- Now safe to continue rendering even if save is completely corrupted

### 3. Generation History Error Logging (line 8628)
- Previous: Silent failure `catch(e) {}`
- **Current:** Logs when history is corrupted:
  - `"loadGenerationHistoryFromStorage failed - generation history may be corrupted..."`
- Ensures `generationHistory = []` explicitly (safe default)

### 4. Grid Dimensions Error Logging (line 8466)
- Previous: Silent failure `catch(e) {}`
- **Current:** Logs and returns with defaults:
  - `"loadGridDimensions failed - grid dimensions may be corrupted..."`
  - Uses GRID_COLS and GRID_ROWS defaults

## Browser Console Diagnostics

If you see intermittent loading failures, check the browser console (`F12 → Console`) for these error messages:

| Message | Meaning | Fix |
|---------|---------|-----|
| `Detected corrupted creature_v2 in localStorage...` | Creature save file is corrupted | Auto-fixed; you'll start fresh |
| `Detected corrupted generation_history_v1...` | Paintings list is corrupted | Auto-fixed; painting history will be empty |
| `Detected corrupted grid_dimensions_v1...` | Canvas size settings corrupted | Auto-fixed; grid reverts to 30×30 default |
| `loadState failed - save file may be corrupted...` | Creature JSON failed to parse | Auto-fixed; full recovery from defaults |
| `loadGenerationHistoryFromStorage failed...` | Paintings JSON failed to parse | Auto-fixed; history starts empty |
| `loadGridDimensions failed...` | Grid JSON failed to parse | Auto-fixed; uses defaults |

**No action needed!** All corruption is detected and fixed automatically. The app will continue with safe defaults.

## Positioning Variables

Instead of calculating menu/button positions dynamically based on creature location, the system now uses static positioning variables that can be easily configured:

```javascript
let RADIAL_MENU_CENTER_X = 450;   // center X of radial menu
let RADIAL_MENU_CENTER_Y = 300;   // center Y of radial menu
let CANVAS_BUTTON_X = 550;        // button X position
let CANVAS_BUTTON_Y = 150;        // button Y position
```

**Location in code:** `sketch.js` lines ~209-212 (in TWEAKABLE SETTINGS section)

### How to Adjust Positioning
1. Open `sketch.js`
2. Find the "UI Positioning (static/manual)" section
3. Adjust the 4 variables to position elements where you want them
4. These values are in pixels, relative to the `.canvas-area` container
5. No page reload or restart needed for basic positioning verification

### Current Implementation
- `updateRadialMenuPosition()` now uses `RADIAL_MENU_CENTER_X/Y` directly
- `updateNpcActionButtonsPosition()` now uses `CANVAS_BUTTON_X/Y` directly
- Both functions have null checks to prevent crashes during load
- Grid anchor calculations remain creature-relative

## Load-Time Safety Improvements

### 1. DOM Element Caching Safety (lines 2934-3318)
- **Issue:** 107+ `getElementById()` calls happening during setup could fail if HTML elements don't exist yet
- **Fix:** Wrapped all DOM element caching in `try-catch` block with informative logging
- **Behavior:** If elements are missing, they're gracefully skipped; UI functionality degrades gracefully

### 2. Sidebar Access Safety (line 2933)
- **Issue:** `document.querySelector('.sidebar').style.display = 'none'` would crash if sidebar doesn't exist
- **Fix:** Added null check: `if (!SHOW_UI && sidebar) sidebar.style.display = 'none'`

### 3. Positioning Functions Safety (lines 8364, 8372)
- **Issue:** Both `updateRadialMenuPosition()` and `updateNpcActionButtonsPosition()` did expensive DOM queries every frame and could fail if canvas elements weren't ready
- **Fix:** Replaced with static variable assignments and added `ui` object null checks
- **Benefit:** No more per-frame DOM queries = better performance + no load-time crashes

### 4. Creature State Validation (line 8381)
- **Issue:** Canvas button positioning used `creature.x` and `creature.y` without checking if they exist
- **Fix:** Added explicit check: `if (creature && creature.x !== undefined && creature.y !== undefined)`

## Initialization Sequence

The safe initialization order is:

1. **p.setup()** (line 2840)
   - Canvas created and attached to DOM
   - Background layer attached
   - Creature created and positioned
   - State loaded from localStorage
   - Theme applied

2. **DOM Caching** (lines 2934-3318)
   - All UI element references cached in `try-catch` block
   - Missing elements don't crash the app
   - Event listeners attached safely with null checks

3. **Post-Setup** (line 3320+)
   - Strip layout recalculated
   - Reference preview refreshed
   - Shop UI rendered
   - Startup menus shown
   - AFK generation triggered (async, non-blocking)

## Potential Load-Time Breakpoints (Mitigated)

| Breakpoint | Original Behavior | Current Safety | Location |
|-----------|-------------------|-----------------|----------|
| Missing #canvas-container | Canvas setup would fail | Canvas queries already safe in p5.js | setup() |
| Missing .canvas-area | updateRadialMenuPosition crash on getBoundingClientRect | No longer queries .canvas-area | updateRadialMenuPosition() |
| Missing radial menu element | updateRadialMenuPosition crash | Checks `ui.radialMenu` before access | updateRadialMenuPosition() |
| Missing reopen grid button | updateNpcActionButtonsPosition crash | Checks `ui.reopenGridButton` before access | updateNpcActionButtonsPosition() |
| Missing UI elements (107+) | Setup fails with ReferenceError | Wrapped in try-catch, gracefully skips | setup() |
| Missing sidebar | Crash when hiding sidebar | Added null check | setup() |
| Creature undefined | Creature distance calculations crash | Checks creature && creature.x/y exist | updateNpcActionButtonsPosition() |

## Async Operations

The following async operations are non-blocking and safe:

- **loadImageAsync()** (line 808-815): Wraps p.loadImage() in Promise, never rejects (returns null on failure)
- **synthesizeOfflinePaintingHours()** (line 1545+): Called as `void` to indicate fire-and-forget, doesn't block setup
- **p5.loadImage()** in setup: Multiple sync loads happen after creature initialization

## Debugging

If UI elements are missing or positioning is off:

1. Check browser console for "DOM elements not available" warning
2. Verify HTML file has all expected IDs (see elements in lines 2934-3010)
3. Adjust `RADIAL_MENU_CENTER_X/Y` and `CANVAS_BUTTON_X/Y` variables
4. Confirm `.canvas-area` container exists in HTML with `position: relative`

## Best Practices Going Forward

- Always add null checks before accessing `ui.*` elements
- Use static variables for positions that don't need dynamic updates
- Wrap DOM queries in try-catch if timing is uncertain
- Test positioning variables with the browser DevTools to find exact pixel values
- Consider inspector to measure distance from viewport edges to desired element positions
