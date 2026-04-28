# Intermittent Load Failure - Root Cause & Fix Summary

## Problem Diagnosis

**Symptom:** Page occasionally loads with only the computer and wrongly-sized book sprite visible.

**Root Cause:** Corrupted localStorage files causing cascading initialization failures.

### What Was Broken

When a save file becomes corrupted (by browser crashes, storage quota issues, etc.):

1. **Old behavior:**
   - `loadState()` catches JSON.parse error
   - Only sets `c.totalVisit = 1`
   - **40+ critical variables remain undefined**: galleryCoins, easyStyleProfile, paletteUpgradeCount, hasComputerUpgrade, colorScheme, restState, ownedWallThemes, etc.

2. **Cascading failures:**
   - Draw loop tries to access undefined variables
   - `refreshShopUI()` → `if (ui.coins) ui.coins.textContent = String(galleryCoins)` → undefined error
   - `updateCreature()` → references undefined mood/preference variables → fails
   - Only rendering that succeeds: HTML elements like the guide book button (which exists in DOM regardless)

3. **User sees:**
   - Computer sprite (from HTML canvas)
   - Book sprite (from HTML image/DOM)
   - Nothing else (all p5.js drawing fails due to undefined variable cascade)

## Solution: Three-Layer Corruption Recovery

### Layer 1: Pre-Setup Validation (NEW)
**Function:** `validateAndCleanupLocalStorage()` - lines 2840-2867

Runs **before** setup begins. Checks all localStorage keys for valid JSON:

```javascript
validateAndCleanupLocalStorage(); // Called at very start of p.setup

// Checks these keys:
// - creature_v2 (creature state)
// - generation_history_v1 (paintings)
// - grid_dimensions_v1 (canvas size)

// If any are invalid JSON, removes them immediately
// Console logs: "Detected corrupted creature_v2 in localStorage. Clearing it..."
```

**Benefit:** Prevents corrupted files from ever entering load functions.

### Layer 2: Comprehensive Error Recovery (IMPROVED)
**Function:** `loadState()` - lines 8805-8848

If corruption passes through Layer 1 or occurs during parsing:

```javascript
catch(e) {
    // OLD: c.totalVisits = 1; (leaves 40+ vars undefined!)
    
    // NEW: Reset ALL critical variables to safe defaults
    c.totalVisits = 1;
    c.lastVisit = Date.now();
    c.need = 50;
    c.energy = 100;
    galleryCoins = 0;
    paletteUpgradeCount = 0;
    hasComputerUpgrade = false;
    easyStyleProfile = null;
    // ... 30+ more variables...
    ensureEasyStyleProfile();
    // ... call all ensure*() functions to init themes...
}
```

**Benefit:** Even if corruption slips through, all variables have safe defaults. No cascading failures.

### Layer 3: Error Logging (NEW)
**Functions:** `loadGenerationHistoryFromStorage()`, `loadGridDimensions()`

Changed from silent failures:
```javascript
catch(e) {} // Silent - no way to know what went wrong
```

To logged failures:
```javascript
catch(e) {
    console.error('loadGenerationHistoryFromStorage failed - generation history may be corrupted. Error:', e.message);
    generationHistory = [];
}
```

**Benefit:** Users and developers can see what's corrupted in the console.

## Testing the Fix

### To verify corruption recovery works:

1. **Simulate corrupted creature file:**
   ```javascript
   // In browser console:
   localStorage.setItem('creature_v2', 'INVALID_JSON{');
   location.reload();
   ```
   - Console should show: `"Detected corrupted creature_v2 in localStorage. Clearing it..."`
   - App should start fresh with defaults

2. **Check normal load:**
   ```javascript
   // In console:
   // Should see nothing (or warnings about style/theme recovery)
   // App should load and render normally
   ```

3. **Check returning user:**
   - Close browser (triggers autosave)
   - Reopen page
   - Should load with creature state intact

## Browser Console Diagnostics

If you encounter issues, check `F12 → Console` for these messages:

| Message | Meaning | Action |
|---------|---------|--------|
| `Detected corrupted creature_v2...` | Save corrupted | Auto-fixed on next load |
| `Detected corrupted generation_history_v1...` | Paintings corrupted | Auto-fixed; history starts empty |
| `loadState failed - save file may be corrupted...` | Creature JSON parse error | Full recovery from defaults |
| `loadGenerationHistoryFromStorage failed...` | Paintings JSON parse error | History resets to [] |
| `loadGridDimensions failed...` | Grid JSON parse error | Reverts to 30×30 |

**No manual action needed.** All corruption is auto-detected and rebuilt.

## Files Modified

1. **sketch.js**
   - Added `validateAndCleanupLocalStorage()` function (lines 2840-2867)
   - Call to it at start of setup (line 2871)
   - Enhanced loadState catch block (lines 8805-8848)
   - Added error logging to loadGenerationHistoryFromStorage and loadGridDimensions

2. **LOAD_SAFETY_NOTES.md**
   - Documented corruption detection and recovery system
   - Added browser console diagnostics table
   - Updated root cause analysis

## Prevention Tips

While this fix makes corruption non-fatal, you can prevent it by:

1. **Keep browser DevTools closed** - Some older browsers have issues with storage when DevTools are open
2. **Monitor console** - Watch for corruption warnings; if frequent, may indicate browser storage issues
3. **Use incognito/private mode** - Helps identify if storage is corrupted or browser extensions are interfering
4. **Clear old data** - If storage quota is full, browser might truncate files. Check for other apps using storage.

## Verification Checklist

- [ ] App loads on fresh page (no localStorage)
- [ ] App loads with existing save (with localStorage)
- [ ] No console errors on normal load
- [ ] Can simulate corruption in console and app recovers
- [ ] Radial menu appears in correct position (check RADIAL_MENU_CENTER_X/Y if not)
- [ ] Canvas button appears in correct position (check CANVAS_BUTTON_X/Y if not)
