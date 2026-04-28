# Testing Guide: Corruption Fix Verification

Follow these steps to verify the intermittent load failure fix is working correctly.

## Test 1: Fresh Load (No Corruption)

**Goal:** Confirm normal loading works

1. Open DevTools: **F12**
2. Go to **Storage** tab → **Local Storage** → Select your domain
3. Clear all entries (right-click → Delete All or manually delete creature_v2, generation_history_v1, grid_dimensions_v1)
4. Reload page: **Ctrl+R** (or Cmd+R on Mac)
5. Check console for any errors
6. **Expected:** App loads with fresh creature, no console errors, no corruption warnings

## Test 2: Returning User (Normal Load)

**Goal:** Confirm saved state loads correctly

1. Click creature to feed it or interact with it
2. Close browser tab (this triggers auto-save)
3. Open page again
4. **Expected:** App loads with your previous creature state intact, no console errors

## Test 3: Simulated Creature Corruption

**Goal:** Verify auto-recovery from corrupted save file

1. Open DevTools: **F12**
2. Go to **Console** tab
3. Paste and run:
   ```javascript
   localStorage.setItem('creature_v2', 'CORRUPTED{invalid[json');
   location.reload();
   ```
4. **Expected:** 
   - Console shows: `"Detected corrupted creature_v2 in localStorage. Clearing it..."`
   - App loads with fresh creature (you've lost your save, but no crash)
   - All buttons and UI work

## Test 4: Simulated Generation History Corruption

**Goal:** Verify generation history corruption doesn't crash app

1. Open DevTools: **F12**
2. Go to **Console** tab
3. Paste and run:
   ```javascript
   localStorage.setItem('generation_history_v1', 'NOT[A{VALID}JSON');
   location.reload();
   ```
4. **Expected:**
   - Console shows: `"Detected corrupted generation_history_v1 in localStorage. Clearing it..."`
   - App loads normally with empty generation history (no paintings)
   - Everything still works

## Test 5: Simulated Grid Dimensions Corruption

**Goal:** Verify grid corruption resets to defaults

1. Open DevTools: **F12**
2. Go to **Console** tab
3. Paste and run:
   ```javascript
   localStorage.setItem('grid_dimensions_v1', 'INVALID_JSON]');
   location.reload();
   ```
4. **Expected:**
   - Console shows: `"Detected corrupted grid_dimensions_v1 in localStorage. Clearing it..."`
   - App loads with default 30×30 grid
   - No crashes or rendering issues

## Test 6: Multiple Simultaneous Corruptions

**Goal:** Verify app handles multiple corrupted files at once

1. Open DevTools: **F12**
2. Go to **Console** tab
3. Paste and run:
   ```javascript
   localStorage.setItem('creature_v2', '{invalid');
   localStorage.setItem('generation_history_v1', 'not json');
   localStorage.setItem('grid_dimensions_v1', '][}');
   location.reload();
   ```
4. **Expected:**
   - Console shows three corruption warnings
   - All three files are cleared
   - App loads with all defaults
   - Everything functional

## Test 7: Verify Positioning Variables Work

**Goal:** Confirm radial menu and canvas button positioning

1. Load page normally
2. Open DevTools: **F12** → **Console**
3. Check these values:
   ```javascript
   console.log('RADIAL_MENU_CENTER_X:', RADIAL_MENU_CENTER_X);
   console.log('RADIAL_MENU_CENTER_Y:', RADIAL_MENU_CENTER_Y);
   console.log('CANVAS_BUTTON_X:', CANVAS_BUTTON_X);
   console.log('CANVAS_BUTTON_Y:', CANVAS_BUTTON_Y);
   ```
4. Visual check: 
   - Radial menu should be in correct position when you click the creature
   - Canvas button should be visible and clickable on the right side

## Test 8: Check Normal Error Handling

**Goal:** Confirm non-corruption errors are also logged

1. Load page normally with existing save
2. Open DevTools: **F12** → **Console**
3. Look for a line like:
   - `"Some DOM elements not available during setup (normal)"` - This is OK
   - `"Sale overlay draw failed"` - This is OK (handled gracefully)
   - Any other errors - Report to developer
4. **Expected:** App works despite any logged warnings

## Common Issues & Solutions

### Issue: "Detected corrupted..." but I didn't corrupt anything

**Cause:** Browser or extension corrupted the file automatically

**Solution:** 
- Close all browser extensions (try incognito mode)
- Check if other apps are using browser storage
- Switch browsers to see if issue persists

### Issue: Still seeing only computer and book sprites

**Check:**
1. Open console: Are there corruption errors? (expected)
2. Are there other JavaScript errors? (check red X symbols)
3. Check if creature drawing code is failing (search console for "draw", "creature", "image" errors)
4. If drawing errors, report full error message

### Issue: Positioning still looks wrong

**Check:**
- Are you seeing the positioning variables when you console.log them?
- Try adjusting RADIAL_MENU_CENTER_X/Y values:
  ```javascript
  RADIAL_MENU_CENTER_X = 400; // Try different values
  RADIAL_MENU_CENTER_Y = 350;
  ```
- Use browser inspector to measure pixel positions and adjust variables accordingly

## Success Criteria

The fix is working correctly if:

- ✅ Fresh loads work (no localStorage)
- ✅ Normal loads work (with valid save)
- ✅ Corrupted saves are auto-detected and cleared
- ✅ App never shows just computer + book sprite (unless you force extreme corruption)
- ✅ Console shows helpful error messages when corruption happens
- ✅ Positioning variables control menu/button placement
- ✅ No unhandled JavaScript errors in console

## Reporting Issues

If you find problems after this fix:

1. **Always include console output** (F12 → Console, copy all errors)
2. **Describe what you did** (steps to reproduce)
3. **Note when it happens** (on first load? after a certain action? intermittent?)
4. **Check with localStorage cleared** (does it help?)

