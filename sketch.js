// ============================================================
//  YOUR CREATURE  —  sketch.js
//  MDDN242 Project 2
// ============================================================
//
//  QUICK START
//  1. Edit drawBody() to redesign the shape
//  2. Edit drawEyes() — or remove the call to drop eyes entirely
//  3. Add a new state in STATES + one line in getState()
//  4. Tune the SETTINGS constants at the top
//  5. Rename "need" to match your concept (hunger, loneliness…)
//
// ============================================================

new p5(function(p) {

    const USE_REFERENCE_SPRITE_OVERRIDE = true;
    const OPENVERSE_IMAGE_SEARCH_URL = 'https://api.openverse.org/v1/images/';
    const REFERENCE_SPRITE_PATHS = [
        'References/FamiliarBallReference.png',
        'References/FamiliarBirdReference.png',
        'References/FamiliarBirdReference2.png',
        'References/FamiliarRealBirdReference.webp',
        'References/FamiliarRealBirdReference2.webp',
    ];
    let REFERENCE_DEBUG_ENABLED = true;



    // ============================================================
    //  SETTINGS  —  tweak these, or use the sidebar sliders
    // ============================================================

    const SHOW_UI      = true;   // set false to hide the sidebar while designing

    let CREATURE_SIZE  = 220;    // body diameter in pixels
    let DECAY_RATE     = 0.003;  // need rise per frame while tab is focused
    let AWAY_RATE      = 0.020;  // need rise per frame while tab is hidden
    let ENERGY_RECOVERY = -0.01;   // energy recovery per frame while tab is focused
    let ENERGY_AWAY_RATE = -20;     // energy recovery per frame while tab is hidden

    let AFK_PER_HOUR   = 5;      // extra need added per hour since last visit
    let AFK_MAX_HOURS  = 168;    // cap time-away at 7 days
    let CLICK_FEED     = 20;     // how much a click reduces need
    let MIC_THRESHOLD  = 0.15;   // how loud is "loud" (0–1)
    let EXCITED_FRAMES = 40;  
    let SLEEPING_FRAMES = 800;     // how long the creature stays asleep
    let BOUNCE_SCALE   = 1.0;    // multiplier for all bounce amounts
    
    let GRID_COLS      = 30;
    let GRID_ROWS      = 30;
    let GRID_SIZE      = 16;
    let GRID_GAP       = 2;
    let GRID_MARGIN    = 26;
    let GRID_LEFT_SHIFT = 350;

    let GRID_MAX_COLS = 220;
    let GRID_MAX_ROWS = 220;
    let GRID_MAX_TOTAL_CELLS = 32000;
    let GRID_UPDATES_PER_SECOND = 300;
    let GRID_MAX_UPDATES_PER_FRAME = 120;

    let GRID_RANDOM_INTERVAL_MS = 0.1;
   
    let COLOR_SCHEME_COUNT = 6;
    let COLOR_SCHEME_OFFSET_RANGE = 20;
    let REFERENCE_MATCH_RGB_RANGE = 10; // Added dedicated RGB range variable
    let NEIGHBOR_SIMILAR_RANGE = 20;
    let REFERENCE_RULE_PRECISION = 0.80;
    let ADJACENT_SCHEME_OVERRIDE_CHANCE = 0.03;
    let GLOBAL_RANDOM_COLOR_CHANCE = 0.01;
    let ENABLE_GLOBAL_RANDOM_COLOR_RULE = false;

    let PAUSE_INTERACTION_THRESHOLD = 0.99;
    let PAUSE_AFTER_THRESHOLD_CHANCE = 1.00;
    let SCHEME_TILE_SIZE = 16;
    let SCHEME_GAP = 4;
    let RESET_BUTTON_HEIGHT = 25;

    let GENERATION_THUMB_HEIGHT = 46;
    let GENERATION_THUMB_MAX_WIDTH = 220;

    let HUNGER_DECAY_RATE = 0.008;
    let HUNGER_AWAY_DECAY_RATE = 0.015;
    let SHOP_FOOD_HUNGER_GAIN = 35;
    let SHOP_PRICE_FOOD = 25;
    let SHOP_PRICE_CANVAS_BIGGER = 90;
    let SHOP_PRICE_CANVAS_WIDER = 120;
    let SHOP_PRICE_CANVAS_TALLER = 120;
    let SHOP_PRESET_BIGGER = { cols: 48, rows: 48 };
    let SHOP_PRESET_WIDER = { cols: 72, rows: 36 };
    let SHOP_PRESET_TALLER = { cols: 36, rows: 72 };

    let SALE_ANNOUNCEMENT_DURATION_MS = 2200;
    let SALE_ANNOUNCEMENT_FADE_IN_MS = 260;
    let SALE_ANNOUNCEMENT_FADE_OUT_MS = 520;

    // Openverse prompt-search tuning.
    let OPENVERSE_SEARCH_RESULT_COUNT = 20;
    let OPENVERSE_RANDOM_POOL_SIZE = 6;

    // Art market preferences. Add new buyers by appending objects with these fields.
    const BUYER_PROFILES = [
        {
            id: 'realist',
            name: 'Realist',
            weight: 1.0,    //effects probability of being the random buyer

            baseMin: 10,    //Base buying price min
            baseMax: 95,    //Base buying price max

            precisionTarget: 0.95, //The target precision value
            precisionTolerance: 0.05, //The tolerance around precison target

            rangeTarget: 0.12, //The target for noisiness (color range)
            rangeTolerance: 0.1,

            styleWeight: 0.85, //The impact style factors have to the buyer's price
           
            harmonyWeight: 0.15, //The impact of colour theory to the buyers price
            harmonyLikes: { complementary: 1.0, similar: 0.25, contrasting: 0.45 }, //How much the color theory effects things based of types
        },
        {
            id: 'abstractist',
            name: 'Abstractist',
            weight: 1.0,
            baseMin: 10,
            baseMax: 90,
            precisionTarget: 0.25,
            precisionTolerance: 0.5,
            rangeTarget: 0.82,
            rangeTolerance: 0.28,
            styleWeight: 0.70,
            harmonyWeight: 0.30,
            harmonyLikes: { complementary: 0.4, similar: 0.95, contrasting: 0.95 },
        },
        {
            id: 'confetti-enthusiast',
            name: 'Confetti Enthusiast',
            weight: 0.7,
            baseMin: 15,
            baseMax: 105,
            precisionTarget: 0.6,
            precisionTolerance: 0.2,
            rangeTarget: 0.97,
            rangeTolerance: 0.12,
            styleWeight: 0.35,
            harmonyWeight: 0.65,
            harmonyLikes: { complementary: 0.25, similar: 0.3, contrasting: 1.0 },
        },
    ];

    // Colours — also editable via sidebar colour pickers
    let bgColour   = [220, 242, 210];  // background (r, g, b)
    let bodyColour = [20,  20,  20];   // body fill  (r, g, b)

    const GRID_PALETTE = [
        [20, 20, 20],
        [255, 255, 255],
        [200, 100, 0],
        [0, 80, 200],
        [150, 0, 150],
        [150, 200, 0],
        [40, 160, 120],
    ];


    // ============================================================
    //  STATE MACHINE
    //
    //  Each state is a row of visual/behaviour targets.
    //  Add a new state here, then add one condition in getState().
    // ============================================================

    const STATES = {
        //            bounce      shake     opacity     body colour target
        happy:      { bounceAmt: 0.04, shakeAmt: 0.0, alphaTarget: 255, bodyTarget: [150, 200, 0] },
        neutral:    { bounceAmt: 0.02, shakeAmt: 0.0, alphaTarget: 180, bodyTarget: [0, 0, 0] },
        distressed: { bounceAmt: 0.01, shakeAmt: 1.5, alphaTarget: 127, bodyTarget: [0, 80, 200] },
        excited:    { bounceAmt: 0.10, shakeAmt: 0.0, alphaTarget: 255, bodyTarget: [200, 100, 0] },
        sleepy:     { bounceAmt: 0.005, shakeAmt: 0.0, alphaTarget: 255, bodyTarget: [150, 0, 150] },
    };

    const STATE_DESCRIPTIONS = {
        happy:      'need is low — bouncy, fully visible',
        neutral:    'need is rising — slightly transparent',
        distressed: 'need is high — shaking, 50% transparent',
        excited:    'heard a sound! — big pupils, roaming',
        sleepy:     'low energy — sleeping',
    };

    // First match wins — checked top to bottom every frame.
    function getState(c) {
        if (c.sleepTimer > 0) return 'sleepy';
        if (c.exciteTimer > 0) return 'excited';
        if (c.need <= 30)      return 'happy';
        if (c.need <= 70)      return 'neutral';
        return 'distressed';
    }


    // ============================================================
    //  CREATURE FACTORY
    // ============================================================

    function createCreature(x, y) {
        return {
            x, y,
            need:  50,
            energy: 100,
            hunger: 100,
            state: 'neutral',
            bounceAmt: 0.02,
            bodyAlpha: 255,
            originX: x, originY: y,
            wanderX: 0, wanderY: 0,
            wanderTargetX: 0, wanderTargetY: 0,
            wanderChangeTimer: 0,
            exciteTimer: 0,
            sleepTimer: 0,
            orbitAngle:  0,
            breathe: 0,
            bob:     0,
            hour:    new Date().getHours(),
            isWatched: true,
            micLevel:  0,
            lastVisit:   null,
            totalVisits: 0,
        };
    }

    let creature;
    let micAnalyser = null;
    let micActive   = false;
    let micData     = null;   // reused buffer — allocated once when mic starts
    let gridColors  = [];
    let gridChanged = [];
    let colorScheme = [];
    let gridChangedCount = 0;
    let generationPaused = false;
    let generationPauseReason = '';
    let lastGridRandomizeAt = 0;
    let referenceSprite = null;
    let referenceAssociations = null;
    let referenceColourMap = null;
    let referenceRuleReady = false;
    let referenceSpriteRequestId = 0;
    let currentReferenceSpritePath = '';
    let pendingFeedback = null;
    let pendingInStyleSnapshot = null;
    let pendingWithColoursSnapshot = null;
    let lastFeedbackAction = 'none';
    let generationSerial = 1;
    let archivedGenerationSerial = 0;
    let generationHistory = [];
    let selectedHistorySerial = null;
    let galleryCoins = 0;
    let saleAnnouncement = null;
    let shopStatusMessage = '';
    let shopStatusUntil = 0;
    let referenceSearchPending = false;
    let queuedReferenceForNextGeneration = null;
    let activeReferencePreview = {
        imageUrl: '',
        caption: 'Using default local references.',
    };


    // Cached DOM refs — populated in setup, never queried again
    let ui = {};


    // ============================================================
    //  SETUP
    // ============================================================

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function canvasSize() {
        if (isMobile()) {
            return { w: window.innerWidth, h: window.innerHeight };
        }
        return {
            w: SHOW_UI ? p.windowWidth - 320 : p.windowWidth - 20,
            h: p.windowHeight - 20,
        };
    }

    function setGridDimensions(cols, rows) {
        cols = Math.max(10, Math.min(GRID_MAX_COLS, Math.floor(cols)));
        rows = Math.max(10, Math.min(GRID_MAX_ROWS, Math.floor(rows)));

        // Keep total cells bounded so very large grids do not tank performance.
        let totalCells = cols * rows;
        if (totalCells > GRID_MAX_TOTAL_CELLS) {
            rows = Math.max(10, Math.floor(GRID_MAX_TOTAL_CELLS / cols));
        }

        GRID_COLS = cols;
        GRID_ROWS = rows;
        saveGridDimensions(cols, rows);
        if (ui.gridColsInput) ui.gridColsInput.value = cols;
        if (ui.gridRowsInput) ui.gridRowsInput.value = rows;
        // Reinitialize the grid and rebuild reference sampling for new dimensions
        initColorGrid();
        if (referenceSprite && referenceRuleReady) {
            buildReferenceRuleData();
        }
    }

    function pickRandomReferenceSpritePath() {
        if (REFERENCE_SPRITE_PATHS.length === 0) return null;
        let idx = p.floor(p.random(REFERENCE_SPRITE_PATHS.length));
        return REFERENCE_SPRITE_PATHS[idx];
    }

    function shuffledReferencePaths() {
        let paths = [...REFERENCE_SPRITE_PATHS];
        for (let i = paths.length - 1; i > 0; i--) {
            let j = p.floor(p.random(i + 1));
            let tmp = paths[i];
            paths[i] = paths[j];
            paths[j] = tmp;
        }
        return paths;
    }

    function loadRandomReferenceSpriteAndApply() {
        if (!USE_REFERENCE_SPRITE_OVERRIDE) return;

        let spritePath = pickRandomReferenceSpritePath();
        if (!spritePath) {
            referenceSprite = null;
            referenceAssociations = null;
            referenceColourMap = null;
            referenceRuleReady = false;
            currentReferenceSpritePath = '';
            generationPaused = false;
            generationPauseReason = '';
            return;
        }

        referenceRuleReady = false;
        let requestId = ++referenceSpriteRequestId;
        let paths = shuffledReferencePaths();
        let tryIndex = 0;

        function tryNextPath() {
            if (requestId !== referenceSpriteRequestId) return;

            if (tryIndex >= paths.length) {
                referenceSprite = null;
                referenceAssociations = null;
                referenceColourMap = null;
                referenceRuleReady = false;
                currentReferenceSpritePath = '';
                generationPaused = false;
                generationPauseReason = '';
                activeReferencePreview.imageUrl = '';
                activeReferencePreview.caption = 'Using default local references.';
                refreshReferencePreviewCard();
                console.warn('No reference sprites could be loaded/applied. Falling back to procedural rules.');
                return;
            }

            let path = paths[tryIndex++];
            p.loadImage(
                path,
                (img) => {
                    if (requestId !== referenceSpriteRequestId) return;
                    currentReferenceSpritePath = path;
                    referenceSprite = img;
                    let applied = buildReferenceRuleData();
                    if (!applied) {
                        console.warn('Reference sprite loaded but sampling failed:', path);
                        tryNextPath();
                        return;
                    }

                    activeReferencePreview.imageUrl = path;
                    activeReferencePreview.caption = 'Active: local reference';
                    refreshReferencePreviewCard();
                },
                (err) => {
                    if (requestId !== referenceSpriteRequestId) return;
                    console.warn('Reference sprite failed to load:', path, err);
                    tryNextPath();
                }
            );
        }

        tryNextPath();
    }

    function setReferenceSearchStatus(message, isError = false) {
        if (!ui.referenceSearchStatus) return;
        ui.referenceSearchStatus.textContent = message || '';
        ui.referenceSearchStatus.classList.toggle('error', !!isError);
    }

    function setReferenceSearchPendingState(isPending) {
        referenceSearchPending = isPending;
        if (ui.referenceSearchButton) ui.referenceSearchButton.disabled = isPending;
        if (ui.referencePromptInput) ui.referencePromptInput.disabled = isPending;
    }

    function refreshReferencePreviewCard() {
        if (!ui.referencePreviewImage || !ui.referencePreviewCaption) return;

        let previewImage = null;
        let previewCaption = '';

        if (queuedReferenceForNextGeneration && queuedReferenceForNextGeneration.thumbnailUrl) {
            previewImage = queuedReferenceForNextGeneration.thumbnailUrl;
            previewCaption = `Queued for next generation: ${queuedReferenceForNextGeneration.prompt}`;
        } else if (activeReferencePreview.imageUrl) {
            previewImage = activeReferencePreview.imageUrl;
            previewCaption = activeReferencePreview.caption || 'Active reference image';
        } else {
            previewCaption = 'Using default local references.';
        }

        if (previewImage) {
            ui.referencePreviewImage.src = previewImage;
            ui.referencePreviewImage.hidden = false;
        } else {
            ui.referencePreviewImage.removeAttribute('src');
            ui.referencePreviewImage.hidden = true;
        }

        ui.referencePreviewCaption.textContent = previewCaption;
    }

    function normalizeOpenverseThumbnailUrl(rawUrl) {
        if (!rawUrl || typeof rawUrl !== 'string') return '';
        let trimmed = rawUrl.trim();
        if (!trimmed) return '';

        if (trimmed.startsWith('//')) {
            trimmed = `https:${trimmed}`;
        }

        if (!/^https?:\/\//i.test(trimmed)) {
            return '';
        }

        let parsed = null;
        try {
            parsed = new URL(trimmed);
        } catch (_) {
            return '';
        }

        if (parsed.hostname !== 'api.openverse.org') return '';
        if (!parsed.pathname.includes('/thumb')) return '';
        return parsed.toString();
    }

    function shuffleInPlace(list) {
        for (let i = list.length - 1; i > 0; i--) {
            let j = p.floor(p.random(i + 1));
            let tmp = list[i];
            list[i] = list[j];
            list[j] = tmp;
        }
        return list;
    }

    function analyseReferenceImageClarity(img) {
        let source = img && (img.canvas || img.elt || img);
        if (!source || !source.width || !source.height) {
            return null;
        }

        let sampleSize = 64;
        let canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        let ctx = canvas.getContext('2d', { willReadFrequently: true });

        try {
            ctx.imageSmoothingEnabled = true;
            ctx.clearRect(0, 0, sampleSize, sampleSize);
            ctx.drawImage(source, 0, 0, sampleSize, sampleSize);
        } catch (_) {
            return null;
        }

        let pixels = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        let uniqueToneBuckets = new Set();
        let sum = 0;
        let sumSq = 0;
        let count = 0;
        let minTone = 255;
        let maxTone = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            let a = pixels[i + 3];
            if (a < 16) continue;

            let tone = pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722;
            let bucket = p.floor(tone / 8); // 32 tone buckets.
            uniqueToneBuckets.add(bucket);
            sum += tone;
            sumSq += tone * tone;
            count += 1;
            if (tone < minTone) minTone = tone;
            if (tone > maxTone) maxTone = tone;
        }

        if (count === 0) return null;

        let mean = sum / count;
        let variance = p.max(0, (sumSq / count) - (mean * mean));
        return {
            uniqueToneCount: uniqueToneBuckets.size,
            contrastStdDev: Math.sqrt(variance),
            toneRange: maxTone - minTone,
        };
    }

    function compareReferenceCandidateQuality(a, b) {
        // Fewer tones generally yields clearer blocky composition; then prefer stronger contrast.
        if (a.uniqueToneCount !== b.uniqueToneCount) {
            return a.uniqueToneCount - b.uniqueToneCount;
        }
        if (a.contrastStdDev !== b.contrastStdDev) {
            return b.contrastStdDev - a.contrastStdDev;
        }
        return b.toneRange - a.toneRange;
    }

    async function fetchReferenceCandidatesFromPrompt(promptText) {
        let query = encodeURIComponent(promptText);
        let searchCount = p.constrain(Math.floor(OPENVERSE_SEARCH_RESULT_COUNT), 3, 80);
        let url = `${OPENVERSE_IMAGE_SEARCH_URL}?q=${query}&page_size=${searchCount}&mature=false`;
        let response = await fetch(url);
        if (!response.ok) throw new Error(`Image search failed (${response.status})`);

        let data = await response.json();
        let results = Array.isArray(data.results) ? data.results : [];
        let candidates = [];

        for (let i = 0; i < results.length; i++) {
            let item = results[i] || {};
            let loadUrl = normalizeOpenverseThumbnailUrl(item.thumbnail || '');
            if (!loadUrl) continue;

            candidates.push({
                loadUrl,
                promptText,
            });
        }

        return candidates;
    }

    function loadCandidateImage(url) {
        return new Promise((resolve) => {
            p.loadImage(
                url,
                (img) => resolve(img || null),
                () => resolve(null)
            );
        });
    }

    async function queueRandomPromptReference(promptText, candidates) {
        if (!Array.isArray(candidates) || candidates.length === 0) return false;

        let analysed = [];
        let queue = shuffleInPlace([...candidates]);

        for (let i = 0; i < queue.length; i++) {
            let candidate = queue[i];
            let img = await loadCandidateImage(candidate.loadUrl);
            if (!img) continue;

            let sampled = null;
            try {
                sampled = sampleReferenceIndexGrid(img, GRID_COLS, GRID_ROWS, colorScheme.length);
            } catch (err) {
                sampled = null;
            }
            if (!sampled) continue;

             let clarity = analyseReferenceImageClarity(img);
             if (!clarity) continue;

             analysed.push({
                 candidate,
                 img,
                 clarity,
             });
        }

        if (analysed.length === 0) return false;

        analysed.sort((a, b) => compareReferenceCandidateQuality(a.clarity, b.clarity));
        let poolSize = p.constrain(Math.floor(OPENVERSE_RANDOM_POOL_SIZE), 1, analysed.length);
        let pool = analysed.slice(0, poolSize);
        let selected = pool[p.floor(p.random(pool.length))];

        queuedReferenceForNextGeneration = {
            prompt: promptText,
            thumbnailUrl: selected.candidate.loadUrl,
            image: selected.img,
        };
        refreshReferencePreviewCard();
        return true;

    }

    async function onReferenceSearchSubmit(event) {
        if (event) event.preventDefault();
        if (referenceSearchPending) return;

        let rawPrompt = ui.referencePromptInput ? ui.referencePromptInput.value : '';
        let promptText = (rawPrompt || '').trim();
        if (!promptText) {
            setReferenceSearchStatus('Enter a prompt first.', true);
            return;
        }

        setReferenceSearchPendingState(true);
        setReferenceSearchStatus('Searching...');

        try {
            let candidates = await fetchReferenceCandidatesFromPrompt(promptText);
            if (candidates.length === 0) {
                setReferenceSearchStatus("Sorry I couldn't find that", true);
                return;
            }

            let queued = await queueRandomPromptReference(promptText, candidates);
            if (!queued) {
                setReferenceSearchStatus("Sorry I couldn't find that", true);
                return;
            }

            setReferenceSearchStatus('Queued for next generation.');
        } catch (err) {
            console.warn('Reference search failed:', err);
            setReferenceSearchStatus("Sorry I couldn't find that", true);
        } finally {
            setReferenceSearchPendingState(false);
        }
    }

    function getSnapshotAspectRatio(snapshot) {
        let cols = Math.max(1, snapshot && snapshot.gridCols ? snapshot.gridCols : 1);
        let rows = Math.max(1, snapshot && snapshot.gridRows ? snapshot.gridRows : 1);
        return cols / rows;
    }

    function getThumbWidthForRatio(ratio) {
        let safeRatio = p.constrain(ratio || 1, 0.2, 6.0);
        return Math.round(p.constrain(GENERATION_THUMB_HEIGHT * safeRatio, 24, GENERATION_THUMB_MAX_WIDTH));
    }

    function setShopStatus(message) {
        shopStatusMessage = message || '';
        shopStatusUntil = p.millis() + 2400;
        if (ui.shopStatus) ui.shopStatus.textContent = shopStatusMessage;
    }

    function spendCoins(cost) {
        if (galleryCoins < cost) return false;
        galleryCoins -= cost;
        return true;
    }

    function applyCanvasPreset(preset) {
        if (!preset) return;
        setGridDimensions(preset.cols, preset.rows);
        resetGeneration({ keepCurrentReference: true });
    }

    function buildShopItems() {
        return [
            {
                id: 'food',
                name: 'Food',
                description: `Feed creature (+${SHOP_FOOD_HUNGER_GAIN} hunger)`,
                price: SHOP_PRICE_FOOD,
                buy: () => {
                    if (!spendCoins(SHOP_PRICE_FOOD)) {
                        setShopStatus('Not enough cash for food.');
                        return;
                    }
                    creature.hunger = p.constrain(creature.hunger + SHOP_FOOD_HUNGER_GAIN, 0, 100);
                    if (generationPauseReason === 'hunger' && creature.hunger > 0) {
                        generationPaused = false;
                        generationPauseReason = '';
                    }
                    setShopStatus('Creature fed.');
                },
            },
            {
                id: 'bigger',
                name: 'Bigger Canvas',
                description: `${SHOP_PRESET_BIGGER.cols} x ${SHOP_PRESET_BIGGER.rows}`,
                price: SHOP_PRICE_CANVAS_BIGGER,
                buy: () => {
                    if (!spendCoins(SHOP_PRICE_CANVAS_BIGGER)) {
                        setShopStatus('Not enough cash for bigger canvas.');
                        return;
                    }
                    applyCanvasPreset(SHOP_PRESET_BIGGER);
                    setShopStatus('Applied bigger canvas preset.');
                },
            },
            {
                id: 'wider',
                name: 'Wider Canvas',
                description: `${SHOP_PRESET_WIDER.cols} x ${SHOP_PRESET_WIDER.rows}`,
                price: SHOP_PRICE_CANVAS_WIDER,
                buy: () => {
                    if (!spendCoins(SHOP_PRICE_CANVAS_WIDER)) {
                        setShopStatus('Not enough cash for wider canvas.');
                        return;
                    }
                    applyCanvasPreset(SHOP_PRESET_WIDER);
                    setShopStatus('Applied wider canvas preset.');
                },
            },
            {
                id: 'taller',
                name: 'Taller Canvas',
                description: `${SHOP_PRESET_TALLER.cols} x ${SHOP_PRESET_TALLER.rows}`,
                price: SHOP_PRICE_CANVAS_TALLER,
                buy: () => {
                    if (!spendCoins(SHOP_PRICE_CANVAS_TALLER)) {
                        setShopStatus('Not enough cash for taller canvas.');
                        return;
                    }
                    applyCanvasPreset(SHOP_PRESET_TALLER);
                    setShopStatus('Applied taller canvas preset.');
                },
            },
        ];
    }

    function renderShopItems() {
        if (!ui.shopItems) return;
        ui.shopItems.innerHTML = '';

        let items = buildShopItems();
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let row = document.createElement('div');
            row.className = 'shop-item';

            let meta = document.createElement('div');
            meta.className = 'shop-item-meta';

            let title = document.createElement('div');
            title.className = 'shop-item-name';
            title.textContent = `${item.name} (${item.price})`;

            let desc = document.createElement('div');
            desc.className = 'shop-item-desc';
            desc.textContent = item.description;

            let button = document.createElement('button');
            button.type = 'button';
            button.className = 'button';
            button.textContent = 'Buy';
            button.addEventListener('click', () => item.buy());

            meta.appendChild(title);
            meta.appendChild(desc);
            row.appendChild(meta);
            row.appendChild(button);
            ui.shopItems.appendChild(row);
        }
    }

    function openShopPopup() {
        if (!ui.shopPopup) return;
        renderShopItems();
        ui.shopPopup.hidden = false;
    }

    function closeShopPopup() {
        if (ui.shopPopup) ui.shopPopup.hidden = true;
    }

    p.setup = function() {
        let sz  = canvasSize();
        let cnv = p.createCanvas(sz.w, sz.h);
        cnv.parent('canvas-container');
        cnv.mousePressed(onCanvasClick);

        creature = createCreature(p.width / 2, p.height / 2);
        loadState(creature);
        initColorGrid();
        generateColorScheme();
        loadRandomReferenceSpriteAndApply();
        lastGridRandomizeAt = p.millis();

        if (!SHOW_UI) document.querySelector('.sidebar').style.display = 'none';

        // Cache sidebar DOM refs once — no per-frame getElementById calls
        ui.hour    = document.getElementById('ui-hour');
        ui.period  = document.getElementById('ui-period');
        ui.state   = document.getElementById('ui-state');
        ui.desc    = document.getElementById('ui-desc');
        ui.needVal = document.getElementById('ui-need-val');
        ui.needBar = document.getElementById('ui-need-bar');

        ui.energyVal = document.getElementById('ui-energy-val');
        ui.energyBar = document.getElementById('ui-energy-bar');
        ui.hungerVal = document.getElementById('ui-hunger-val');
        ui.hungerBar = document.getElementById('ui-hunger-bar');

        ui.visits  = document.getElementById('ui-visits');
        ui.excited = document.getElementById('ui-excited');
        ui.watched = document.getElementById('ui-watched');
        ui.mic     = document.getElementById('ui-mic');
        ui.feedback = document.getElementById('ui-feedback');
        ui.precision = document.getElementById('ui-precision');
        ui.offsetRange = document.getElementById('ui-offset-range');
        ui.neighborRange = document.getElementById('ui-neighbor-range');
        ui.refRange = document.getElementById('ui-ref-range');
        ui.randomRule = document.getElementById('ui-random-rule');
        ui.scheme = document.getElementById('ui-scheme');
        ui.gridColsInput = document.getElementById('ui-grid-cols');
        ui.gridRowsInput = document.getElementById('ui-grid-rows');
        ui.generationStrip = document.getElementById('generation-strip');
        ui.generationStripList = document.getElementById('generation-strip-list');
        ui.generationPopup = document.getElementById('generation-popup');
        ui.generationPopupImage = document.getElementById('generation-popup-image');
        ui.generationPopupValues = document.getElementById('generation-popup-values');
        ui.generationPopupSaleSummary = document.getElementById('generation-popup-sale-summary');
        ui.generationPopupInStyle = document.getElementById('generation-popup-in-style');
        ui.generationPopupWithColours = document.getElementById('generation-popup-with-colours');
        ui.generationPopupSellButton = document.getElementById('generation-popup-sell-btn');
        ui.referenceSearchForm = document.getElementById('reference-search-form');
        ui.referencePromptInput = document.getElementById('ui-reference-prompt');
        ui.referenceSearchButton = document.getElementById('ui-reference-search-btn');
        ui.referenceSearchStatus = document.getElementById('ui-reference-search-status');
        ui.referencePreviewImage = document.getElementById('ui-reference-preview-image');
        ui.referencePreviewCaption = document.getElementById('ui-reference-preview-caption');
        ui.coins = document.getElementById('ui-coins');
        ui.sceneCash = document.getElementById('ui-scene-cash');
        ui.shopOpenButton = document.getElementById('shop-open-btn');
        ui.shopPopup = document.getElementById('shop-popup');
        ui.shopItems = document.getElementById('shop-items');
        ui.shopCashLine = document.getElementById('shop-cash-line');
        ui.shopStatus = document.getElementById('shop-status');
        ui.shopCloseButton = document.getElementById('shop-close-btn');

        if (ui.generationPopupInStyle) {
            ui.generationPopupInStyle.addEventListener('click', onInThisStyleClicked);
        }
        if (ui.generationPopupWithColours) {
            ui.generationPopupWithColours.addEventListener('click', onWithTheseColoursClicked);
        }
        if (ui.generationPopupSellButton) {
            ui.generationPopupSellButton.addEventListener('click', onSellGenerationClicked);
        }
        if (ui.generationStripList) {
            ui.generationStripList.addEventListener('scroll', closeGenerationPopup);
        }
        if (ui.referenceSearchForm) {
            ui.referenceSearchForm.addEventListener('submit', onReferenceSearchSubmit);
        }
        if (ui.shopOpenButton) {
            ui.shopOpenButton.addEventListener('click', (event) => {
                event.stopPropagation();
                openShopPopup();
            });
        }
        if (ui.shopCloseButton) {
            ui.shopCloseButton.addEventListener('click', closeShopPopup);
        }
        if (ui.shopPopup) {
            ui.shopPopup.addEventListener('click', (event) => event.stopPropagation());
        }
        document.addEventListener('click', onDocumentClickForPopup);
        updateGenerationStripLayout();
        refreshReferencePreviewCard();
        loadGridDimensions();
        loadGenerationHistoryFromStorage();



        // Track focus via events — no polling in the draw loop
        window.addEventListener('focus', () => { creature.isWatched = true; });
        window.addEventListener('blur',  () => { creature.isWatched = false; });

        setInterval(() => { saveState(creature); creature.hour = new Date().getHours(); }, 30000);
        window.addEventListener('beforeunload', () => saveState(creature));
    };


    // ============================================================
    //  DRAW LOOP
    // ============================================================

    p.draw = function() {
        p.background(...bgColour);

        updateMic(creature);
        updateCreature(creature);
        drawCreature(creature);
        randomizeGridSquareOverTime();
        drawColorGrid();
        drawSaleAnnouncementOverlay();

        if (p.frameCount % 6 === 0) updateSidebar(creature); // ~10fps is plenty for UI
    };

    function currentAnnouncementAlpha(now, ann) {
        let elapsed = now - ann.startAt;
        if (elapsed < 0 || elapsed > ann.durationMs) return 0;

        if (elapsed <= ann.fadeInMs) {
            return p.constrain(elapsed / ann.fadeInMs, 0, 1);
        }

        let fadeOutStart = ann.durationMs - ann.fadeOutMs;
        if (elapsed >= fadeOutStart) {
            return p.constrain((ann.durationMs - elapsed) / ann.fadeOutMs, 0, 1);
        }

        return 1;
    }

    function drawSaleAnnouncementOverlay() {
        if (!saleAnnouncement) return;

        let now = p.millis();
        let alpha01 = currentAnnouncementAlpha(now, saleAnnouncement);
        if (alpha01 <= 0) {
            if (now - saleAnnouncement.startAt > saleAnnouncement.durationMs) {
                saleAnnouncement = null;
            }
            return;
        }

        let alpha = Math.round(255 * alpha01);
        p.push();
        p.textAlign(p.CENTER, p.CENTER);
        p.noStroke();

        let titleSize = p.constrain(p.width * 0.05, 26, 56);
        let subtitleSize = p.constrain(p.width * 0.028, 16, 30);
        let centerX = p.width * 0.5;
        let centerY = p.height * 0.5;

        p.textSize(titleSize);
        p.fill(20, 20, 20, alpha);
        p.text(`SOLD ${saleAnnouncement.amount} coins`, centerX + 2, centerY + 2);
        p.fill(255, 245, 160, alpha);
        p.text(`SOLD ${saleAnnouncement.amount} coins`, centerX, centerY);

        p.textSize(subtitleSize);
        p.fill(20, 20, 20, alpha);
        p.text(`Buyer: ${saleAnnouncement.buyer}`, centerX + 1, centerY + titleSize * 0.85 + 1);
        p.fill(235, 255, 255, alpha);
        p.text(`Buyer: ${saleAnnouncement.buyer}`, centerX, centerY + titleSize * 0.85);
        p.pop();
    }

    function playRegisterSound() {
        let AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        if (!window._saleAudioCtx) {
            window._saleAudioCtx = new AudioCtx();
        }
        let ctx = window._saleAudioCtx;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        let now = ctx.currentTime;
        let master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        master.connect(ctx.destination);

        let tone1 = ctx.createOscillator();
        tone1.type = 'square';
        tone1.frequency.setValueAtTime(740, now);
        tone1.frequency.exponentialRampToValueAtTime(980, now + 0.12);
        tone1.connect(master);
        tone1.start(now);
        tone1.stop(now + 0.2);

        let tone2 = ctx.createOscillator();
        tone2.type = 'triangle';
        tone2.frequency.setValueAtTime(1200, now + 0.08);
        tone2.frequency.exponentialRampToValueAtTime(820, now + 0.24);
        tone2.connect(master);
        tone2.start(now + 0.08);
        tone2.stop(now + 0.32);
    }

    function showSaleAnnouncement(buyerName, amount) {
        saleAnnouncement = {
            buyer: buyerName || 'Unknown buyer',
            amount: Math.max(0, Math.round(amount || 0)),
            startAt: p.millis(),
            durationMs: SALE_ANNOUNCEMENT_DURATION_MS,
            fadeInMs: SALE_ANNOUNCEMENT_FADE_IN_MS,
            fadeOutMs: SALE_ANNOUNCEMENT_FADE_OUT_MS,
        };
        playRegisterSound();
    }


    // ============================================================
    //  CREATURE LOGIC
    // ============================================================

    function updateCreature(c) {
        if (c.sleepTimer === 0 && c.energy < 1) {
            c.sleepTimer = SLEEPING_FRAMES;
            c.exciteTimer = 0;
        }

        if (c.sleepTimer > 0) {
            c.sleepTimer--;
        }

        // Need rises over time
        let rate = c.isWatched ? DECAY_RATE : AWAY_RATE;
        let tiredRate = c.sleepTimer > 0
            ? -(50 / SLEEPING_FRAMES)
            : c.exciteTimer > 0
                ? 0.02 + (1 - c.micLevel) * 0.05
                : c.isWatched ? ENERGY_RECOVERY : ENERGY_AWAY_RATE;
        c.need = p.constrain(c.need + rate, 0, 100);
        c.energy = p.constrain(c.energy - tiredRate, 0, 100);

        let hungerRate = c.isWatched ? HUNGER_DECAY_RATE : HUNGER_AWAY_DECAY_RATE;
        c.hunger = p.constrain(c.hunger - hungerRate, 0, 100);
        if (generationPauseReason === 'hunger' && c.hunger > 0) {
            generationPaused = false;
            generationPauseReason = '';
        }

        // State machine
        c.state = getState(c);
        let s = STATES[c.state];
        c.bounceAmt = p.lerp(c.bounceAmt, s.bounceAmt * BOUNCE_SCALE, 0.08);
        c.bodyAlpha = p.lerp(c.bodyAlpha, s.alphaTarget, 0.05);
        bodyColour[0] = p.lerp(bodyColour[0], s.bodyTarget[0], 0.05);
        bodyColour[1] = p.lerp(bodyColour[1], s.bodyTarget[1], 0.05);
        bodyColour[2] = p.lerp(bodyColour[2], s.bodyTarget[2], 0.05);

        // Animation phases
        if (c.sleepTimer === 0) {
            c.breathe += 0.018;
            c.bob     += 0.012;
        }

        // Excited: chase mouse (orbit when close), or wander if mouse is off canvas.
        // Calm: drift back to origin.
        if (c.sleepTimer > 0) {
            c.wanderTargetX = 0;
            c.wanderTargetY = 0;
        } else if (c.exciteTimer > 0) {
            c.exciteTimer--;
            let mouseOnCanvas = p.mouseX >= 0 && p.mouseX <= p.width &&
                                p.mouseY >= 0 && p.mouseY <= p.height;
            if (mouseOnCanvas) {
                const ORBIT_RADIUS = CREATURE_SIZE * 0.55;
                let distToMouse = p.dist(c.x, c.y, p.mouseX, p.mouseY);
                if (distToMouse > ORBIT_RADIUS * 1.5) {
                    c.wanderTargetX = p.mouseX - c.originX;
                    c.wanderTargetY = p.mouseY - c.originY;
                } else {
                    c.orbitAngle   += 0.025;
                    c.wanderTargetX = (p.mouseX - c.originX) + Math.cos(c.orbitAngle) * ORBIT_RADIUS;
                    c.wanderTargetY = (p.mouseY - c.originY) + Math.sin(c.orbitAngle) * ORBIT_RADIUS;
                }
            } else {
                c.wanderChangeTimer--;
                if (c.wanderChangeTimer <= 0) {
                    let pad = CREATURE_SIZE * 0.6;
                    c.wanderTargetX = p.random(pad, p.width  - pad) - c.originX;
                    c.wanderTargetY = p.random(pad, p.height - pad) - c.originY;
                    c.wanderChangeTimer = p.floor(p.random(30, 70));
                }
            }
        } else {
            c.wanderTargetX = 0;
            c.wanderTargetY = 0;
        }

        let energyMoveScale = p.constrain(c.energy / 100, 0, 1);
        let dampedTargetX = c.wanderTargetX * energyMoveScale;
        let dampedTargetY = c.wanderTargetY * energyMoveScale;
        let moveLerp = p.lerp(0.02, 0.07, energyMoveScale);

        c.wanderX = p.lerp(c.wanderX, dampedTargetX, moveLerp);
        c.wanderY = p.lerp(c.wanderY, dampedTargetY, moveLerp);
        c.x = c.originX + c.wanderX;
        c.y = c.originY + c.wanderY;
    }


    // ============================================================
    //  DRAWING
    // ============================================================

    function drawCreature(c) {
        p.push();
        p.translate(c.x, c.y);
        p.translate(0, p.sin(c.bob) * 6);

        let s = STATES[c.state];
        let bScale = 1 + p.sin(c.breathe) * c.bounceAmt;

        if (s.shakeAmt > 0) {
            p.translate(
                p.random(-s.shakeAmt, s.shakeAmt),
                p.random(-s.shakeAmt * 0.4, s.shakeAmt * 0.4)
            );
        }

        p.scale(bScale);
        drawBody(c);
        drawEyes(c);
        p.pop();
    }


    // ── EDIT THIS — redesign the creature's body ──────────────

    function drawBody(c) {
        p.noStroke();
        p.fill(...bodyColour, c.bodyAlpha);
        p.ellipse(0, 0, CREATURE_SIZE, CREATURE_SIZE);
    }


    // ── EDIT THIS — or remove the call from drawCreature() ────

    function drawEyes(c) {
        let isSleepy   = c.state === 'sleepy';
        let eyeSize    = CREATURE_SIZE * 0.38;
        let eyeSpacing = CREATURE_SIZE * 0.26;
        let eyeY       = -CREATURE_SIZE * 0.08;

        let basePupilSize = c.state === 'excited' ? eyeSize * 0.62 : eyeSize * 0.38;
        let pupilSize = isSleepy ? basePupilSize + (eyeSize * 0.28) : basePupilSize;
        let darkerBody = [
            p.max(0, bodyColour[0] - 35),
            p.max(0, bodyColour[1] - 35),
            p.max(0, bodyColour[2] - 35),
        ];
        let pupilColour = isSleepy ? bodyColour : darkerBody;


        let angle     = p.atan2(p.mouseY - c.y, p.mouseX - c.x);
        let mouseDist = p.dist(p.mouseX, p.mouseY, c.x, c.y);
        let move      = isSleepy ? 0 : p.min(eyeSize * 0.18, mouseDist * 0.012);
        let px2       = p.cos(angle) * move;
        let py2       = isSleepy ? -(eyeSize * 0.12) : p.sin(angle) * move;

        for (let side of [-1, 1]) {
            let ex = eyeSpacing * side;
            let ey = eyeY;
            p.noStroke();
            p.fill(255);
            p.ellipse(ex, ey, eyeSize * 0.88, eyeSize * 0.88);
            p.fill(...pupilColour);
            p.ellipse(ex + px2, ey + py2, pupilSize, pupilSize);
        }
        p.noStroke();
    }

    function initColorGrid() {
        gridColors = [];
        gridChanged = [];
        gridChangedCount = 0;
        generationPaused = false;
        generationPauseReason = '';
        for (let r = 0; r < GRID_ROWS; r++) {
            let row = [];
            let changedRow = [];
            for (let c = 0; c < GRID_COLS; c++) {
                row.push([255, 255, 255]);
                changedRow.push(false);
            }
            gridColors.push(row);
            gridChanged.push(changedRow);
        }
    }

    function generateColorScheme() {
        colorScheme = [];
        let seen = new Set();
        while (colorScheme.length < COLOR_SCHEME_COUNT) {
            let candidate = [
                p.floor(p.random(256)),
                p.floor(p.random(256)),
                p.floor(p.random(256)),
            ];
            let key = candidate.join(',');
            if (seen.has(key)) continue;
            seen.add(key);
            colorScheme.push(candidate);
        }
    }

    function clampByte(v) {
        return p.constrain(Math.round(v), 0, 255);
    }

    function colorDistance(a, b) {
        let dr = a[0] - b[0];
        let dg = a[1] - b[1];
        let db = a[2] - b[2];
        return Math.sqrt(dr * dr + dg * dg + db * db);
    }

    function pickValueOutsideBand(minVal, maxVal, center, minDelta) {
        let lowerMax = center - minDelta;
        let upperMin = center + minDelta;
        let choices = [];

        if (lowerMax >= minVal) choices.push([minVal, lowerMax]);
        if (upperMin <= maxVal) choices.push([upperMin, maxVal]);

        if (choices.length === 0) {
            return p.constrain(center < (minVal + maxVal) * 0.5 ? maxVal : minVal, minVal, maxVal);
        }

        let pick = choices[p.floor(p.random(choices.length))];
        return p.random(pick[0], pick[1]);
    }

    function uniqueColorKey(col) {
        return `${col[0]},${col[1]},${col[2]}`;
    }

    function shiftByBoundedDelta(value, minVal, maxVal, minAbsDelta, maxAbsDelta) {
        let delta = p.random(minAbsDelta + 0.001, maxAbsDelta - 0.001);
        let canIncrease = value + delta <= maxVal;
        let canDecrease = value - delta >= minVal;

        if (canIncrease && canDecrease) {
            return p.random() < 0.5 ? value + delta : value - delta;
        }
        if (canIncrease) return value + delta;
        if (canDecrease) return value - delta;

        // Near bounds with no valid shift in requested band: move to nearest valid edge.
        return value < (minVal + maxVal) * 0.5 ? maxVal : minVal;
    }

    function mutateScalarWithinPercent(value, pct, minVal, maxVal) {
        let delta = Math.abs(value) * pct;
        let next = value + p.random(-delta, delta);
        return p.constrain(next, minVal, maxVal);
    }

    function mutateSchemeWithinPercent(previousScheme, pct) {
        let channelDelta = 255 * pct;
        let out = [];
        for (let i = 0; i < previousScheme.length; i++) {
            let base = previousScheme[i];
            out.push([
                clampByte(base[0] + p.random(-channelDelta, channelDelta)),
                clampByte(base[1] + p.random(-channelDelta, channelDelta)),
                clampByte(base[2] + p.random(-channelDelta, channelDelta)),
            ]);
        }
        return out;
    }

    function clamp01(v) {
        return p.constrain(v, 0, 1);
    }

    function rgbToHsvHue(col) {
        let r = (col[0] || 0) / 255;
        let g = (col[1] || 0) / 255;
        let b = (col[2] || 0) / 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let d = max - min;
        if (d === 0) return 0;

        let h = 0;
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;

        h *= 60;
        if (h < 0) h += 360;
        return h;
    }

    function hueDistanceDegrees(a, b) {
        let d = Math.abs(a - b) % 360;
        return d > 180 ? 360 - d : d;
    }

    function analyzeColourTheoryFromScheme(scheme) {
        if (!Array.isArray(scheme) || scheme.length < 2) {
            return { similar: 0, complementary: 0, contrasting: 0.5 };
        }

        let hues = scheme.map(rgbToHsvHue);
        let pairCount = 0;
        let similar = 0;
        let complementary = 0;
        let contrasting = 0;

        for (let i = 0; i < hues.length; i++) {
            for (let j = i + 1; j < hues.length; j++) {
                let d = hueDistanceDegrees(hues[i], hues[j]);
                pairCount += 1;
                if (d <= 25) similar += 1;
                if (d >= 150 && d <= 210) complementary += 1;
                if (d >= 70 && d <= 140) contrasting += 1;
            }
        }

        if (pairCount === 0) return { similar: 0, complementary: 0, contrasting: 0.5 };
        return {
            similar: similar / pairCount,
            complementary: complementary / pairCount,
            contrasting: contrasting / pairCount,
        };
    }

    function targetMatchScore(value, target, tolerance) {
        let safeTol = Math.max(0.0001, tolerance);
        return clamp01(1 - Math.abs(value - target) / safeTol);
    }

    function normalisedRangeEnergy(snapshot) {
        let offset = clamp01((snapshot.colorSchemeOffsetRange || 0) / 255);
        let neighbor = clamp01((snapshot.neighborSimilarRange || 0) / 255);
        let ref = clamp01((snapshot.referenceMatchRgbRange || 0) / 255);
        return (offset + neighbor + ref) / 3;
    }

    function evaluateSnapshotAgainstBuyer(snapshot, buyer, useRandomBase = true) {
        let precision = clamp01(snapshot.referenceRulePrecision || 0);
        let rangeEnergy = normalisedRangeEnergy(snapshot);
        let colourTheory = analyzeColourTheoryFromScheme(snapshot.colorScheme || []);

        let precisionScore = targetMatchScore(precision, buyer.precisionTarget, buyer.precisionTolerance);
        let rangeScore = targetMatchScore(rangeEnergy, buyer.rangeTarget, buyer.rangeTolerance);
        let styleScore = (precisionScore + rangeScore) * 0.5;

        let harmonyLikes = buyer.harmonyLikes || {};
        let harmonyWeighted =
            colourTheory.complementary * (harmonyLikes.complementary || 0) +
            colourTheory.similar * (harmonyLikes.similar || 0) +
            colourTheory.contrasting * (harmonyLikes.contrasting || 0);
        let harmonyWeightSum =
            (harmonyLikes.complementary || 0) +
            (harmonyLikes.similar || 0) +
            (harmonyLikes.contrasting || 0);
        let harmonyScore = harmonyWeightSum > 0 ? clamp01(harmonyWeighted / harmonyWeightSum) : 0.5;

        let combinedFit = clamp01(
            styleScore * (buyer.styleWeight || 0.5) +
            harmonyScore * (buyer.harmonyWeight || 0.5)
        );

        let baseValue = useRandomBase
            ? p.random(buyer.baseMin, buyer.baseMax)
            : (buyer.baseMin + buyer.baseMax) * 0.5;

        let payout = Math.round(baseValue * (0.45 + combinedFit * 1.35));
        return {
            buyerId: buyer.id,
            buyerName: buyer.name,
            fit: combinedFit,
            payout,
        };
    }

    function pickRandomBuyerProfile() {
        let totalWeight = BUYER_PROFILES.reduce((sum, b) => sum + Math.max(0, b.weight || 0), 0);
        if (totalWeight <= 0) return BUYER_PROFILES[0];

        let pick = p.random(totalWeight);
        let cursor = 0;
        for (let i = 0; i < BUYER_PROFILES.length; i++) {
            cursor += Math.max(0, BUYER_PROFILES[i].weight || 0);
            if (pick <= cursor) return BUYER_PROFILES[i];
        }
        return BUYER_PROFILES[BUYER_PROFILES.length - 1];
    }

    function appraiseSnapshotForSale(snapshot) {
        let buyer = pickRandomBuyerProfile();
        return evaluateSnapshotAgainstBuyer(snapshot, buyer, true);
    }

    function estimateSnapshotMarketValue(snapshot) {
        if (!BUYER_PROFILES.length) {
            return { estimate: 0, topBuyer: 'none', topFit: 0 };
        }

        let evaluations = BUYER_PROFILES.map(b => evaluateSnapshotAgainstBuyer(snapshot, b, false));
        let estimate = Math.round(evaluations.reduce((sum, e) => sum + e.payout, 0) / evaluations.length);
        let top = evaluations[0];
        for (let i = 1; i < evaluations.length; i++) {
            if (evaluations[i].fit > top.fit) top = evaluations[i];
        }
        return {
            estimate,
            topBuyer: top.buyerName,
            topFit: top.fit,
        };
    }

    function snapshotLabelText(snapshot) {
        let soldTag = snapshot.sold ? ' [sold]' : '';
        return `#${snapshot.serial} ${snapshot.reason}${soldTag}`;
    }

    function createGenerationCard(snapshot) {
        let card = document.createElement('div');
        card.className = 'generation-thumb';
        if (snapshot.sold) card.classList.add('generation-thumb-sold');
        card.dataset.serial = String(snapshot.serial);
        card.title = `Generation ${snapshot.serial}`;

        let img = document.createElement('img');
        img.src = snapshot.imageDataUrl;
        img.alt = `Generation ${snapshot.serial}`;
        img.style.height = `${GENERATION_THUMB_HEIGHT}px`;
        let thumbWidth = getThumbWidthForRatio(getSnapshotAspectRatio(snapshot));
        img.style.width = `${thumbWidth}px`;

        let label = document.createElement('div');
        label.className = 'generation-thumb-label';
        label.textContent = snapshotLabelText(snapshot);

        card.addEventListener('click', (event) => {
            event.stopPropagation();
            openGenerationPopup(snapshot, card);
        });

        card.appendChild(img);
        card.appendChild(label);
        return card;
    }

    function refreshGenerationCardUI(snapshot) {
        if (!ui.generationStripList) return;
        let card = ui.generationStripList.querySelector(`.generation-thumb[data-serial="${snapshot.serial}"]`);
        if (!card) return;
        let label = card.querySelector('.generation-thumb-label');
        if (label) label.textContent = snapshotLabelText(snapshot);
        card.classList.toggle('generation-thumb-sold', !!snapshot.sold);
    }

    function removeSnapshotFromHistory(serial) {
        let idx = generationHistory.findIndex(item => item.serial === serial);
        if (idx === -1) return null;

        let removed = generationHistory[idx];
        generationHistory.splice(idx, 1);

        if (ui.generationStripList) {
            let card = ui.generationStripList.querySelector(`.generation-thumb[data-serial="${serial}"]`);
            if (card) card.remove();
        }
        return removed;
    }

    function formatSnapshotValues(snapshot) {
        let schemeText = snapshot.colorScheme
            .map(col => `(${col[0]},${col[1]},${col[2]})`)
            .join(' ');
        return [
            `generation #${snapshot.serial} (${snapshot.reason})`,
            `grid: ${snapshot.gridCols || GRID_COLS} x ${snapshot.gridRows || GRID_ROWS}`,
            `precision: ${snapshot.referenceRulePrecision.toFixed(3)}`,
            `color_scheme_offset_range: ${snapshot.colorSchemeOffsetRange}`,
            `neighbor_similar_range: ${snapshot.neighborSimilarRange}`,
            `reference_match_rgb_range: ${snapshot.referenceMatchRgbRange}`,
            `scheme: ${schemeText}`,
        ].join('\n');
    }

    function updateGenerationSaleSummary(snapshot) {
        if (!ui.generationPopupSaleSummary || !ui.generationPopupSellButton) return;

        if (snapshot.sold) {
            ui.generationPopupSaleSummary.textContent = `Sold to ${snapshot.soldTo || 'buyer'} for ${snapshot.salePrice || 0} coins.`;
            ui.generationPopupSellButton.disabled = true;
            ui.generationPopupSellButton.textContent = 'Sold';
            return;
        }

        let estimate = estimateSnapshotMarketValue(snapshot);
        ui.generationPopupSaleSummary.textContent =
            `Market estimate: ~${estimate.estimate} coins. Best fit: ${estimate.topBuyer} (${Math.round(estimate.topFit * 100)}%).`;
        ui.generationPopupSellButton.disabled = false;
        ui.generationPopupSellButton.textContent = 'Sell';
    }

    function closeGenerationPopup() {
        selectedHistorySerial = null;
        if (ui.generationPopup) ui.generationPopup.hidden = true;
    }

    function onDocumentClickForPopup(event) {
        if (ui.generationPopup && !ui.generationPopup.hidden) {
            if (!ui.generationPopup.contains(event.target) && !event.target.closest('.generation-thumb')) {
                closeGenerationPopup();
            }
        }

        if (ui.shopPopup && !ui.shopPopup.hidden) {
            if (!ui.shopPopup.contains(event.target) && !event.target.closest('.shop-open-btn')) {
                closeShopPopup();
            }
        }
    }

    function openGenerationPopup(snapshot, thumbElement) {
        if (!ui.generationPopup || !ui.generationPopupImage || !ui.generationPopupValues) return;
        selectedHistorySerial = snapshot.serial;
        ui.generationPopupImage.src = snapshot.imageDataUrl;
        ui.generationPopupValues.textContent = formatSnapshotValues(snapshot);
        updateGenerationSaleSummary(snapshot);
        ui.generationPopup.hidden = false;

        let rect = thumbElement.getBoundingClientRect();
        let ratio = getSnapshotAspectRatio(snapshot);
        let popupWidth = Math.min(Math.max(340, Math.round(280 * ratio)), window.innerWidth - 24, 720);
        let left = Math.max(12, Math.min(rect.left, window.innerWidth - popupWidth - 12));
        let top = rect.bottom + 8;

        ui.generationPopup.style.left = `${left}px`;
        ui.generationPopup.style.top = `${top}px`;
    }

    function onSellGenerationClicked() {
        if (selectedHistorySerial == null) return;
        let snapshot = generationHistory.find(item => item.serial === selectedHistorySerial);
        if (!snapshot || snapshot.sold) {
            if (snapshot) updateGenerationSaleSummary(snapshot);
            return;
        }

        let appraisal = appraiseSnapshotForSale(snapshot);
        galleryCoins += appraisal.payout;
        showSaleAnnouncement(appraisal.buyerName, appraisal.payout);

        lastFeedbackAction = `sold-#${snapshot.serial}`;
        removeSnapshotFromHistory(snapshot.serial);
        closeGenerationPopup();
        saveGenerationHistoryToStorage();
        saveState(creature);
    }

    function onInThisStyleClicked() {
        if (selectedHistorySerial == null) return;
        let snapshot = generationHistory.find(item => item.serial === selectedHistorySerial);
        if (!snapshot) return;

        pendingInStyleSnapshot = snapshot;
        lastFeedbackAction = `in-style-#${snapshot.serial}`;
        closeGenerationPopup();
        resetGeneration();
    }

    function onWithTheseColoursClicked() {
        if (selectedHistorySerial == null) return;
        let snapshot = generationHistory.find(item => item.serial === selectedHistorySerial);
        if (!snapshot) return;

        pendingWithColoursSnapshot = snapshot;
        lastFeedbackAction = `with-colours-#${snapshot.serial}`;
        closeGenerationPopup();
        resetGeneration();
    }

    function buildLikedScheme(previousScheme) {
        let out = [];
        let used = new Set();

        for (let i = 0; i < previousScheme.length; i++) {
            let base = previousScheme[i];
            let candidate = null;

            for (let tries = 0; tries < 25; tries++) {
                let test = [
                    clampByte(base[0] + p.random(-25.5, 25.5)),
                    clampByte(base[1] + p.random(-25.5, 25.5)),
                    clampByte(base[2] + p.random(-25.5, 25.5)),
                ];
                let key = uniqueColorKey(test);
                if (!used.has(key)) {
                    candidate = test;
                    used.add(key);
                    break;
                }
            }

            if (!candidate) {
                candidate = [
                    clampByte(base[0]),
                    clampByte(base[1]),
                    clampByte(base[2]),
                ];
            }
            out.push(candidate);
        }

        return out;
    }

    function buildDislikedScheme(previousScheme) {
        let out = [];
        let used = new Set();
        const MIN_DISSIMILAR_DISTANCE = 0.2 * Math.sqrt(255 * 255 * 3);

        for (let i = 0; i < previousScheme.length; i++) {
            let base = previousScheme[i];
            let candidate = null;

            for (let tries = 0; tries < 80; tries++) {
                let test = [
                    p.floor(p.random(256)),
                    p.floor(p.random(256)),
                    p.floor(p.random(256)),
                ];
                if (colorDistance(test, base) < MIN_DISSIMILAR_DISTANCE) continue;
                let key = uniqueColorKey(test);
                if (used.has(key)) continue;
                candidate = test;
                used.add(key);
                break;
            }

            if (!candidate) {
                candidate = [255 - base[0], 255 - base[1], 255 - base[2]];
                used.add(uniqueColorKey(candidate));
            }

            out.push(candidate);
        }

        return out;
    }

    function applyPendingFeedbackToGeneration() {
        if (!pendingFeedback || !pendingFeedback.snapshot) return;

        let snap = pendingFeedback.snapshot;
        if (pendingFeedback.type === 'like') {
            colorScheme = buildLikedScheme(snap.colorScheme);
        } else if (pendingFeedback.type === 'dislike') {
            colorScheme = buildDislikedScheme(snap.colorScheme);
        }

        pendingFeedback = null;
    }

    function captureFeedback(type) {
        pendingFeedback = {
            type,
            snapshot: {
                colorScheme: colorScheme.map(col => [...col]),
                referenceRulePrecision: REFERENCE_RULE_PRECISION,
                colorSchemeOffsetRange: COLOR_SCHEME_OFFSET_RANGE,
                neighborSimilarRange: NEIGHBOR_SIMILAR_RANGE,
                referenceMatchRgbRange: REFERENCE_MATCH_RGB_RANGE,
            },
        };
        lastFeedbackAction = type;
        resetGeneration();
    }

    function increasePrecision() {
        let deltaPct = p.random(0, 0.10);
        REFERENCE_RULE_PRECISION = p.constrain(
            REFERENCE_RULE_PRECISION * (1 + deltaPct),
            0,
            1
        );
        REFERENCE_MATCH_RGB_RANGE = p.constrain(
            Math.round(REFERENCE_MATCH_RGB_RANGE - p.random(0, 5)),
            0,
            255
        );
        lastFeedbackAction = 'more-precise';
    }

    function decreasePrecision() {
        let deltaPct = p.random(0, 0.10);
        REFERENCE_RULE_PRECISION = p.constrain(
            REFERENCE_RULE_PRECISION * (1 - deltaPct),
            0,
            1
        );
        REFERENCE_MATCH_RGB_RANGE = p.constrain(
            Math.round(REFERENCE_MATCH_RGB_RANGE + p.random(0, 5)),
            0,
            255
        );
        lastFeedbackAction = 'more-abstract';
    }

    function increaseNoise() {
        let delta = p.random(0, 5);
        COLOR_SCHEME_OFFSET_RANGE = p.constrain(
            Math.round(COLOR_SCHEME_OFFSET_RANGE + delta),
            0,
            255
        );
        NEIGHBOR_SIMILAR_RANGE = p.constrain(
            Math.round(NEIGHBOR_SIMILAR_RANGE + delta),
            0,
            255
        );
        lastFeedbackAction = 'noisier';
    }

    function decreaseNoise() {
        let delta = p.random(0, 5);
        COLOR_SCHEME_OFFSET_RANGE = p.constrain(
            Math.round(COLOR_SCHEME_OFFSET_RANGE - delta),
            0,
            255
        );
        NEIGHBOR_SIMILAR_RANGE = p.constrain(
            Math.round(NEIGHBOR_SIMILAR_RANGE - delta),
            0,
            255
        );
        lastFeedbackAction = 'cleaner';
    }

    function updateGenerationStripLayout() {
        const stripPadding = 20;
        const titleHeight = 18;
        const labelHeight = 14;
        const thumbCardPadding = 8;
        const stripHeight = GENERATION_THUMB_HEIGHT + stripPadding + titleHeight + labelHeight + thumbCardPadding;
        document.documentElement.style.setProperty('--generation-strip-h', `${stripHeight}px`);
    }

    function buildGridSnapshotDataURL() {
        let cols = Math.max(1, GRID_COLS);
        let rows = Math.max(1, GRID_ROWS);

        let logicalCanvas = document.createElement('canvas');
        logicalCanvas.width = cols;
        logicalCanvas.height = rows;
        let logicalCtx = logicalCanvas.getContext('2d');
        let imageData = logicalCtx.createImageData(cols, rows);
        let data = imageData.data;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let colour = (gridColors[r] && gridColors[r][c]) ? gridColors[r][c] : [255, 255, 255];
                let i = (r * cols + c) * 4;
                data[i] = colour[0];
                data[i + 1] = colour[1];
                data[i + 2] = colour[2];
                data[i + 3] = 255;
            }
        }

        logicalCtx.putImageData(imageData, 0, 0);
        return logicalCanvas.toDataURL('image/png');
    }

    function archiveCurrentGeneration(reason) {
        if (!ui.generationStripList) return;
        if (gridChangedCount <= 0) return;
        if (archivedGenerationSerial === generationSerial) return;

        updateGenerationStripLayout();

        let img = document.createElement('img');
        try {
            // Rebuild snapshot from logical grid data so it exactly matches tile colours.
            img.src = buildGridSnapshotDataURL();
        } catch (err) {
            console.warn('Failed to archive generation snapshot:', err);
            return;
        }
        img.alt = `Generation ${generationSerial}`;
        img.style.height = `${GENERATION_THUMB_HEIGHT}px`;
        let thumbWidth = getThumbWidthForRatio(GRID_COLS / GRID_ROWS);
        img.style.width = `${thumbWidth}px`;

        let snapshot = {
            serial: generationSerial,
            reason,
            imageDataUrl: img.src,
            colorScheme: colorScheme.map(col => [...col]),
            referenceRulePrecision: REFERENCE_RULE_PRECISION,
            colorSchemeOffsetRange: COLOR_SCHEME_OFFSET_RANGE,
            neighborSimilarRange: NEIGHBOR_SIMILAR_RANGE,
            referenceMatchRgbRange: REFERENCE_MATCH_RGB_RANGE,
            gridCols: GRID_COLS,
            gridRows: GRID_ROWS,
            sold: false,
            salePrice: 0,
            soldTo: '',
            saleFit: 0,
        };
        generationHistory.push(snapshot);
        let card = createGenerationCard(snapshot);
        ui.generationStripList.appendChild(card);
        ui.generationStripList.scrollLeft = ui.generationStripList.scrollWidth;

        archivedGenerationSerial = generationSerial;
        saveGenerationHistoryToStorage();
    }

    function resetGeneration(options = {}) {
        let keepCurrentReference = !!options.keepCurrentReference;
        archiveCurrentGeneration('interrupted');
        generationSerial += 1;
        archivedGenerationSerial = 0;
        initColorGrid();

        if (pendingFeedback) {
            applyPendingFeedbackToGeneration();
        } else {
            let styleSnap = pendingInStyleSnapshot;
            let colourSnap = pendingWithColoursSnapshot;
            pendingInStyleSnapshot = null;
            pendingWithColoursSnapshot = null;

            if (colourSnap) {
                colorScheme = mutateSchemeWithinPercent(colourSnap.colorScheme, 0.05);
            } else if (!styleSnap) {
                generateColorScheme();
            }

            if (styleSnap) {
                REFERENCE_RULE_PRECISION = mutateScalarWithinPercent(
                    styleSnap.referenceRulePrecision,
                    0.05,
                    0,
                    1
                );
                COLOR_SCHEME_OFFSET_RANGE = Math.round(
                    mutateScalarWithinPercent(styleSnap.colorSchemeOffsetRange, 0.05, 0, 255)
                );
                NEIGHBOR_SIMILAR_RANGE = Math.round(
                    mutateScalarWithinPercent(styleSnap.neighborSimilarRange, 0.05, 0, 255)
                );
                REFERENCE_MATCH_RGB_RANGE = Math.round(
                    mutateScalarWithinPercent(styleSnap.referenceMatchRgbRange, 0.05, 0, 255)
                );
            }
        }
        if (!keepCurrentReference) {
            if (queuedReferenceForNextGeneration && queuedReferenceForNextGeneration.image) {
                referenceSprite = queuedReferenceForNextGeneration.image;
                currentReferenceSpritePath = `prompt:${queuedReferenceForNextGeneration.prompt}`;

                let appliedQueued = false;
                try {
                    appliedQueued = buildReferenceRuleData();
                } catch (err) {
                    appliedQueued = false;
                }

                if (appliedQueued) {
                    activeReferencePreview.imageUrl = queuedReferenceForNextGeneration.thumbnailUrl;
                    activeReferencePreview.caption = `Active: prompt reference (${queuedReferenceForNextGeneration.prompt})`;
                    queuedReferenceForNextGeneration = null;
                    refreshReferencePreviewCard();
                } else {
                    queuedReferenceForNextGeneration = null;
                    refreshReferencePreviewCard();
                    loadRandomReferenceSpriteAndApply();
                }
            } else {
                loadRandomReferenceSpriteAndApply();
            }
        }
        lastGridRandomizeAt = p.millis();
    }

    function buildReferenceRuleData() {
        referenceRuleReady = false;
        referenceAssociations = null;
        referenceColourMap = null;
        if (!USE_REFERENCE_SPRITE_OVERRIDE || !referenceSprite) return false;

        let sampled = sampleReferenceIndexGrid(referenceSprite, GRID_COLS, GRID_ROWS, colorScheme.length);
        if (!sampled) return false;

        referenceAssociations = sampled.indexGrid;
        referenceColourMap = buildReferenceToSchemeMap(sampled.uniqueColours, colorScheme);
        referenceRuleReady = Array.isArray(referenceColourMap) && referenceColourMap.length > 0;
        return true;
    }

    function sampleReferenceIndexGrid(image, cols, rows, targetColourCount) {
        if (!image) return null;
        let source = image.canvas || image.elt || image;

        let tmp = document.createElement('canvas');
        tmp.width = cols;
        tmp.height = rows;
        let ctx = tmp.getContext('2d', { willReadFrequently: true });
        ctx.imageSmoothingEnabled = false;
        let pixels = null;

        try {
            ctx.clearRect(0, 0, cols, rows);
            ctx.drawImage(source, 0, 0, cols, rows);
            pixels = ctx.getImageData(0, 0, cols, rows).data;
        } catch (err) {
            console.warn('Reference image sampling failed (likely CORS/security restrictions):', err);
            return null;
        }

        let samples = [];

        // Convert resized reference to grayscale first so clustering finds unique tones.
        for (let i = 0; i < pixels.length; i += 4) {
            let a = pixels[i + 3];
            if (a < 16) continue;
            let tone = Math.round(
                pixels[i] * 0.2126 +
                pixels[i + 1] * 0.7152 +
                pixels[i + 2] * 0.0722
            );
            pixels[i] = tone;
            pixels[i + 1] = tone;
            pixels[i + 2] = tone;
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let i = (r * cols + c) * 4;
                let a = pixels[i + 3];
                if (a < 16) continue;
                samples.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
            }
        }

        if (samples.length === 0) return null;

        let k = p.constrain(Math.floor(targetColourCount || COLOR_SCHEME_COUNT), 1, samples.length);
        let uniqueColours = clusterReferenceColours(samples, k);
        let indexGrid = [];

        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                let i = (r * cols + c) * 4;
                let a = pixels[i + 3];
                if (a < 16) {
                    row.push(-1);
                    continue;
                }

                let colour = [pixels[i], pixels[i + 1], pixels[i + 2]];
                let idx = nearestReferenceColourIndex(colour, uniqueColours);
                row.push(idx);
            }
            indexGrid.push(row);
        }

        return { uniqueColours, indexGrid };
    }

    function squaredDistanceRgb(a, b) {
        let dr = a[0] - b[0];
        let dg = a[1] - b[1];
        let db = a[2] - b[2];
        return dr * dr + dg * dg + db * db;
    }

    function initialiseCentroidsByDistance(samples, k) {
        let centroids = [];
        centroids.push([...samples[p.floor(p.random(samples.length))]]);

        while (centroids.length < k) {
            let bestSample = samples[0];
            let bestDistance = -1;

            for (let i = 0; i < samples.length; i++) {
                let sample = samples[i];
                let nearestDist = Number.POSITIVE_INFINITY;

                for (let j = 0; j < centroids.length; j++) {
                    let d = squaredDistanceRgb(sample, centroids[j]);
                    if (d < nearestDist) nearestDist = d;
                }

                if (nearestDist > bestDistance) {
                    bestDistance = nearestDist;
                    bestSample = sample;
                }
            }

            centroids.push([...bestSample]);
        }

        return centroids;
    }

    function clusterReferenceColours(samples, k) {
        let centroids = initialiseCentroidsByDistance(samples, k);

        for (let iter = 0; iter < 10; iter++) {
            let buckets = Array.from({ length: k }, () => ({ r: 0, g: 0, b: 0, n: 0 }));

            for (let s of samples) {
                let idx = nearestReferenceColourIndex(s, centroids);
                buckets[idx].r += s[0];
                buckets[idx].g += s[1];
                buckets[idx].b += s[2];
                buckets[idx].n += 1;
            }

            for (let i = 0; i < k; i++) {
                if (buckets[i].n === 0) {
                    centroids[i] = [...samples[p.floor(p.random(samples.length))]];
                    continue;
                }

                centroids[i][0] = Math.round(buckets[i].r / buckets[i].n);
                centroids[i][1] = Math.round(buckets[i].g / buckets[i].n);
                centroids[i][2] = Math.round(buckets[i].b / buckets[i].n);
            }
        }

        return centroids;
    }

    function nearestReferenceColourIndex(colour, palette) {
        let best = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (let i = 0; i < palette.length; i++) {
            let dr = palette[i][0] - colour[0];
            let dg = palette[i][1] - colour[1];
            let db = palette[i][2] - colour[2];
            let dist = dr * dr + dg * dg + db * db;
            if (dist < bestDistance) {
                bestDistance = dist;
                best = i;
            }
        }
        return best;
    }

    function colourLuminance(col) {
        // Perceptual luminance weights so matching follows tone rather than raw channel sum.
        return col[0] * 0.2126 + col[1] * 0.7152 + col[2] * 0.0722;
    }

    function buildReferenceToSchemeMap(uniqueColours, scheme) {
        let sortedReference = uniqueColours
            .map((col, idx) => ({ idx, lum: colourLuminance(col) }))
            .sort((a, b) => a.lum - b.lum);

        let sortedScheme = scheme
            .map(col => [...col])
            .sort((a, b) => colourLuminance(a) - colourLuminance(b));

        let mapping = new Array(uniqueColours.length);
        for (let i = 0; i < sortedReference.length; i++) {
            let ref = sortedReference[i];
            mapping[ref.idx] = sortedScheme[i % sortedScheme.length];
        }
        return mapping;
    }

    function getGridRect() {
        let w = GRID_COLS * GRID_SIZE + (GRID_COLS - 1) * GRID_GAP;
        let h = GRID_ROWS * GRID_SIZE + (GRID_ROWS - 1) * GRID_GAP;
        let topOffset = SCHEME_TILE_SIZE + SCHEME_GAP + RESET_BUTTON_HEIGHT + 10;
        return {
            x: p.width - GRID_MARGIN - w - GRID_LEFT_SHIFT,
            y: GRID_MARGIN + topOffset,
            w,
            h,
        };
    }

    function getSchemeRect() {
        let w = COLOR_SCHEME_COUNT * SCHEME_TILE_SIZE + (COLOR_SCHEME_COUNT - 1) * SCHEME_GAP;
        return {
            x: getGridRect().x,
            y: GRID_MARGIN,
            w,
            h: SCHEME_TILE_SIZE,
        };
    }

    function getResetButtonRect() {
        let schemeRect = getSchemeRect();
        return {
            x: schemeRect.x,
            y: schemeRect.y + schemeRect.h + SCHEME_GAP,
            w: schemeRect.w,
            h: RESET_BUTTON_HEIGHT,
        };
    }

    function drawColorGrid() {
        let schemeRect = getSchemeRect();
        let resetRect = getResetButtonRect();
        let rect = getGridRect();
        p.push();
        p.noStroke();

        for (let i = 0; i < colorScheme.length; i++) {
            let sx = schemeRect.x + i * (SCHEME_TILE_SIZE + SCHEME_GAP);
            let sy = schemeRect.y;
            p.fill(...colorScheme[i]);
            p.rect(sx, sy, SCHEME_TILE_SIZE, SCHEME_TILE_SIZE, 3);
        }

        p.fill(248);
        p.rect(resetRect.x, resetRect.y, resetRect.w, resetRect.h, 4);
        p.fill(40);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(11);
        p.text('Reset Generation', resetRect.x + resetRect.w / 2, resetRect.y + resetRect.h / 2);
        if (generationPaused) {
            p.fill(180, 40, 40);
            p.textSize(10);
            let pausedLabel = generationPauseReason === 'hunger' ? 'paused: creature hungry' : 'paused';
            p.text(pausedLabel, resetRect.x + resetRect.w / 2, resetRect.y - 8);
        }

        p.fill(255, 235);
        p.rect(rect.x - 8, rect.y - 8, rect.w + 16, rect.h + 16, 8);

        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                let x = rect.x + c * (GRID_SIZE + GRID_GAP);
                let y = rect.y + r * (GRID_SIZE + GRID_GAP);
                p.fill(...gridColors[r][c]);
                p.rect(x, y, GRID_SIZE, GRID_SIZE, 3);
            }
        }

        if (REFERENCE_DEBUG_ENABLED) {
            drawReferenceDebugOverlay(rect);
        }
        p.pop();
    }

    function drawReferenceDebugOverlay(rect) {
        p.push();

        let statusX = rect.x;
        let statusY = rect.y - 22;
        p.noStroke();
        p.fill(255, 245);
        p.rect(statusX, statusY, 260, 16, 3);
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(9);

        if (referenceRuleReady && referenceAssociations && referenceColourMap) {
            p.fill(40, 120, 55);
            let spriteName = currentReferenceSpritePath
                ? currentReferenceSpritePath.split('/').pop()
                : 'unknown';
            p.text(`ref clusters active: ${spriteName}`, statusX + 5, statusY + 8);
        } else {
            p.fill(170, 50, 45);
            p.text('ref clusters inactive: using fallback rules', statusX + 5, statusY + 8);
        }

        if (referenceRuleReady && referenceAssociations && referenceColourMap) {
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(8);
            for (let r = 0; r < GRID_ROWS; r++) {
                for (let c = 0; c < GRID_COLS; c++) {
                    let associationIndex = referenceAssociations[r][c];
                    if (associationIndex < 0) continue;

                    let x = rect.x + c * (GRID_SIZE + GRID_GAP);
                    let y = rect.y + r * (GRID_SIZE + GRID_GAP);
                    let mapped = referenceColourMap[associationIndex] || [0, 0, 0];

                    p.noFill();
                    p.stroke(mapped[0], mapped[1], mapped[2], 200);
                    p.strokeWeight(1);
                    p.rect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 2);

                    if (GRID_SIZE >= 12) {
                        let labelLum = colourLuminance(mapped);
                        p.noStroke();
                        p.fill(labelLum > 140 ? 15 : 245);
                        p.text(String(associationIndex), x + GRID_SIZE * 0.5, y + GRID_SIZE * 0.52);
                    }
                }
            }
        }

        p.pop();
    }

    function isWhite(color) {
        return color[0] === 255 && color[1] === 255 && color[2] === 255;
    }

    function isSignificantlyDifferent(a, b) {
        return Math.abs(a[0] - b[0]) > 50 ||
               Math.abs(a[1] - b[1]) > 50 ||
               Math.abs(a[2] - b[2]) > 50;
    }

    function clampColor(v) {
        return p.constrain(Math.floor(v), 0, 255);
    }

    function getAdjacentColoredColors(r, c) {
        let out = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                let nr = r + dr;
                let nc = c + dc;
                if (nr < 0 || nr >= GRID_ROWS || nc < 0 || nc >= GRID_COLS) continue;
                let neighbour = gridColors[nr][nc];
                if (!isWhite(neighbour)) out.push(neighbour);
            }
        }
        return out;
    }

    function getAdjacentSameAssociationColors(r, c, associationIndex) {
        let out = [];
        if (!referenceRuleReady || !referenceAssociations || associationIndex < 0) return out;

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                let nr = r + dr;
                let nc = c + dc;
                if (nr < 0 || nr >= GRID_ROWS || nc < 0 || nc >= GRID_COLS) continue;
                if (referenceAssociations[nr][nc] !== associationIndex) continue;

                let neighbour = gridColors[nr][nc];
                if (!isWhite(neighbour)) out.push(neighbour);
            }
        }

        return out;
    }

    function hasDistinctAdjacentPair(colors) {
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                if (isSignificantlyDifferent(colors[i], colors[j])) return true;
            }
        }
        return false;
    }

    function averageColors(colors) {
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        for (let col of colors) {
            sumR += col[0];
            sumG += col[1];
            sumB += col[2];
        }
        return [
            clampColor(sumR / colors.length),
            clampColor(sumG / colors.length),
            clampColor(sumB / colors.length),
        ];
    }

    function similarTo(base, variance) {
        return [
            clampColor(base[0] + p.random(-variance, variance + 1)),
            clampColor(base[1] + p.random(-variance, variance + 1)),
            clampColor(base[2] + p.random(-variance, variance + 1)),
        ];
    }

    function pickTargetCell() {
        let untouched = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                if (!gridChanged[r][c]) untouched.push([r, c]);
            }
        }
        if (untouched.length > 0) {
            return untouched[p.floor(p.random(untouched.length))];
        }
        return [p.floor(p.random(GRID_ROWS)), p.floor(p.random(GRID_COLS))];
    }

    function schemeConstrainedColour(range) {
        let base = colorScheme[p.floor(p.random(colorScheme.length))];
        return similarTo(base, range);
    }

    function markGridChanged(r, c) {
        if (!gridChanged[r][c]) {
            gridChanged[r][c] = true;
            gridChangedCount++;
        }
    }

    function interactedRatio() {
        return gridChangedCount / (GRID_ROWS * GRID_COLS);
    }

    function fullyRandomColour() {
        return [
            p.floor(p.random(256)),
            p.floor(p.random(256)),
            p.floor(p.random(256)),
        ];
    }

    function applyLegacyGridRule(adjacent) {
        if (adjacent.length > 0 && p.random() < ADJACENT_SCHEME_OVERRIDE_CHANCE) {
            // Rule 5: adjacent tile can still branch to a scheme-based unique colour.
            return schemeConstrainedColour(COLOR_SCHEME_OFFSET_RANGE);
        }
        if (adjacent.length > 1 && hasDistinctAdjacentPair(adjacent)) {
            // Rule 2: blend toward a transition tile when neighbouring colours differ a lot.
            return averageColors(adjacent);
        }
        if (adjacent.length > 0) {
            // Rule 1: otherwise become similar to one adjacent coloured tile.
            let seed = adjacent[p.floor(p.random(adjacent.length))];
            return similarTo(seed, NEIGHBOR_SIMILAR_RANGE);
        }
        // Rule 4: isolated generation is constrained to the colour scheme.
        return schemeConstrainedColour(COLOR_SCHEME_OFFSET_RANGE);
    }

    function randomizeGridSquareOverTime() {
        let now = p.millis();
        if (creature && creature.hunger <= 0) {
            generationPaused = true;
            generationPauseReason = 'hunger';
            return;
        }
        if (generationPaused) return;

        let elapsedMs = now - lastGridRandomizeAt;
        if (elapsedMs < GRID_RANDOM_INTERVAL_MS) return;

        // Convert elapsed time into a bounded batch count so updates are not tied to frame rate.
        let updates = Math.floor((elapsedMs * GRID_UPDATES_PER_SECOND) / 1000);
        updates = p.constrain(updates, 1, GRID_MAX_UPDATES_PER_FRAME);

        for (let i = 0; i < updates; i++) {
            let [r, c] = pickTargetCell();
            let adjacent = getAdjacentColoredColors(r, c);
            let hasReferenceRule = referenceRuleReady && referenceAssociations && referenceColourMap;
            let associationIndex = hasReferenceRule ? referenceAssociations[r][c] : -1;
            let associatedColour =
                (associationIndex >= 0 && associationIndex < referenceColourMap.length)
                    ? referenceColourMap[associationIndex]
                    : null;

            if (ENABLE_GLOBAL_RANDOM_COLOR_RULE && p.random() < GLOBAL_RANDOM_COLOR_CHANCE) {
                // Rule 6: small chance to ignore all other rules and go fully random.
                gridColors[r][c] = fullyRandomColour();
            } else if (associatedColour) {
                if (adjacent.length === 0) {
                    // New Rule: isolated cells have an 80% chance to follow reference-associated tone.
                    if (p.random() < REFERENCE_RULE_PRECISION) {
                        gridColors[r][c] = similarTo(associatedColour, REFERENCE_MATCH_RGB_RANGE);
                    } else {
                        gridColors[r][c] = applyLegacyGridRule(adjacent);
                    }
                } else {
                    let sameAssociationAdjacent = getAdjacentSameAssociationColors(r, c, associationIndex);
                    if (sameAssociationAdjacent.length > 0) {
                        // New Rule: if adjacent tile shares association, follow the same-association neighbour.
                        let seed = sameAssociationAdjacent[p.floor(p.random(sameAssociationAdjacent.length))];
                        gridColors[r][c] = similarTo(seed, NEIGHBOR_SIMILAR_RANGE);
                    } else if (p.random() < REFERENCE_RULE_PRECISION) {
                        // New Rule: adjacent but different association still biases to its own associated tone.
                        gridColors[r][c] = similarTo(associatedColour, REFERENCE_MATCH_RGB_RANGE);
                    } else {
                        gridColors[r][c] = applyLegacyGridRule(adjacent);
                    }
                }
            } else {
                gridColors[r][c] = applyLegacyGridRule(adjacent);
            }
            markGridChanged(r, c);

            if (interactedRatio() >= 0.999) {
                generationPaused = true;
                generationPauseReason = 'finished';
                archiveCurrentGeneration('finished');
                break;
            }

            if (interactedRatio() > PAUSE_INTERACTION_THRESHOLD && p.random() < PAUSE_AFTER_THRESHOLD_CHANCE) {
                generationPaused = true;
                generationPauseReason = 'paused';
                archiveCurrentGeneration('paused');
                break;
            }
        }

        lastGridRandomizeAt = now;
    }

    function handleGridClick(mx, my) {
        let resetRect = getResetButtonRect();
        if (mx >= resetRect.x && mx <= resetRect.x + resetRect.w &&
            my >= resetRect.y && my <= resetRect.y + resetRect.h) {
            resetGeneration();
            return true;
        }

        let rect = getGridRect();
        if (mx < rect.x || my < rect.y || mx > rect.x + rect.w || my > rect.y + rect.h) return false;

        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                let x = rect.x + c * (GRID_SIZE + GRID_GAP);
                let y = rect.y + r * (GRID_SIZE + GRID_GAP);
                if (mx >= x && mx <= x + GRID_SIZE && my >= y && my <= y + GRID_SIZE) {
                    let current = gridColors[r][c];
                    let idx = GRID_PALETTE.findIndex(col => col[0] === current[0] && col[1] === current[1] && col[2] === current[2]);
                    let next = (idx + 1 + GRID_PALETTE.length) % GRID_PALETTE.length;
                    gridColors[r][c] = [...GRID_PALETTE[next]];
                    markGridChanged(r, c);
                    return true;
                }
            }
        }
        return true;
    }


    // ============================================================
    //  INPUT: MOUSE CLICK
    // ============================================================

    function onCanvasClick() {
        if (handleGridClick(p.mouseX, p.mouseY)) return;
        if (!micActive) startMic();
        let d = p.dist(p.mouseX, p.mouseY, creature.x, creature.y);
        if (d < CREATURE_SIZE / 2) {
            creature.need = p.max(0, creature.need - CLICK_FEED);
        }
    }


    // ============================================================
    //  INPUT: MICROPHONE
    // ============================================================

    async function startMic() {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            let ctx    = new (window.AudioContext || window.webkitAudioContext)();
            let source = ctx.createMediaStreamSource(stream);
            micAnalyser = ctx.createAnalyser();
            micAnalyser.fftSize = 256;
            source.connect(micAnalyser);
            micData   = new Uint8Array(micAnalyser.frequencyBinCount);
            micActive = true;
        } catch(e) {
            console.log('Mic unavailable:', e);
        }
    }

    function getMicLevel() {
        if (!micAnalyser) return 0;
        micAnalyser.getByteFrequencyData(micData);
        let sum = 0;
        for (let i = 0; i < micData.length; i++) sum += micData[i];
        return sum / (micData.length * 255);
    }

    function updateMic(c) {
        if (!micActive) return;
        c.micLevel = getMicLevel();
        if (c.sleepTimer > 0) return;
        if (c.micLevel > MIC_THRESHOLD) c.exciteTimer = EXCITED_FRAMES;
    }


    // ============================================================
    //  PERSISTENCE
    // ============================================================

    function saveGridDimensions(cols, rows) {
        try {
            localStorage.setItem('grid_dimensions_v1', JSON.stringify({ cols, rows }));
        } catch(e) {}
    }

    function loadGridDimensions() {
        try {
            let raw = localStorage.getItem('grid_dimensions_v1');
            if (!raw) return;
            let data = JSON.parse(raw);
            if (data.cols && data.rows) {
                setGridDimensions(data.cols, data.rows);
            }
        } catch(e) {}
    }

    function saveGenerationHistoryToStorage() {
        try {
            let serialized = generationHistory.map(snapshot => ({
                serial: snapshot.serial,
                reason: snapshot.reason,
                imageDataUrl: snapshot.imageDataUrl,
                colorScheme: snapshot.colorScheme,
                referenceRulePrecision: snapshot.referenceRulePrecision,
                colorSchemeOffsetRange: snapshot.colorSchemeOffsetRange,
                neighborSimilarRange: snapshot.neighborSimilarRange,
                referenceMatchRgbRange: snapshot.referenceMatchRgbRange,
                gridCols: snapshot.gridCols || GRID_COLS,
                gridRows: snapshot.gridRows || GRID_ROWS,
                sold: !!snapshot.sold,
                salePrice: snapshot.salePrice || 0,
                soldTo: snapshot.soldTo || '',
                saleFit: snapshot.saleFit || 0,
            }));
            localStorage.setItem('generation_history_v1', JSON.stringify(serialized));
        } catch(e) {}
    }

    function loadGenerationHistoryFromStorage() {
        try {
            let raw = localStorage.getItem('generation_history_v1');
            if (!raw) return;
            let data = JSON.parse(raw);
            if (!Array.isArray(data)) return;
            
            generationHistory = [];
            for (let item of data) {
                if (!item.imageDataUrl) continue;
                
                let snapshot = {
                    serial: item.serial,
                    reason: item.reason,
                    imageDataUrl: item.imageDataUrl,
                    colorScheme: item.colorScheme || [],
                    referenceRulePrecision: item.referenceRulePrecision || REFERENCE_RULE_PRECISION,
                    colorSchemeOffsetRange: item.colorSchemeOffsetRange || COLOR_SCHEME_OFFSET_RANGE,
                    neighborSimilarRange: item.neighborSimilarRange || NEIGHBOR_SIMILAR_RANGE,
                    referenceMatchRgbRange: item.referenceMatchRgbRange || REFERENCE_MATCH_RGB_RANGE,
                    gridCols: item.gridCols || GRID_COLS,
                    gridRows: item.gridRows || GRID_ROWS,
                    sold: !!item.sold,
                    salePrice: item.salePrice || 0,
                    soldTo: item.soldTo || '',
                    saleFit: item.saleFit || 0,
                };
                generationHistory.push(snapshot);
            }
            
            // Rebuild the generation strip UI from history
            if (ui.generationStripList && generationHistory.length > 0) {
                ui.generationStripList.innerHTML = '';
                for (let snapshot of generationHistory) {
                    let card = createGenerationCard(snapshot);
                    ui.generationStripList.appendChild(card);
                }
            }

            if (generationHistory.length > 0) {
                let maxSerial = Math.max(...generationHistory.map(item => item.serial || 0));
                generationSerial = Math.max(generationSerial, maxSerial + 1);
            }
        } catch(e) {}
    }

    function saveState(c) {
        try {
            localStorage.setItem('creature_v2', JSON.stringify({
                need: c.need, lastVisit: Date.now(), totalVisits: c.totalVisits,
                energy: c.energy,
                hunger: c.hunger,
                galleryCoins,
            }));
            saveGenerationHistoryToStorage();
        } catch(e) {}
    }

    function loadState(c) {
        try {
            let raw = localStorage.getItem('creature_v2');
            if (!raw) { c.totalVisits = 1; return; }
            let data = JSON.parse(raw);
            c.need        = data.need || 50;
            c.energy      = data.energy || 100;
            c.hunger      = data.hunger ?? 100;
            c.lastVisit   = data.lastVisit;
            c.totalVisits = (data.totalVisits || 0) + 1;
            galleryCoins  = data.galleryCoins || 0;
            if (c.lastVisit) {
                let hours = Math.min((Date.now() - c.lastVisit) / 3600000, AFK_MAX_HOURS);
                c.need = Math.min(c.need + hours * AFK_PER_HOUR, 100);
                c.energy = Math.min(c.energy + hours * AFK_PER_HOUR, 100);
            }
        } catch(e) {
            c.totalVisits = 1;
        }
    }


    // ============================================================
    //  SIDEBAR SYNC  —  updates the live state panel each frame
    // ============================================================

    function updateSidebar(c) {
        ui.hour.textContent    = c.hour % 12 || 12;
        ui.period.textContent  = c.hour < 12 ? 'am' : 'pm';
        ui.state.textContent   = c.state;
        ui.desc.textContent    = STATE_DESCRIPTIONS[c.state] || '';
        ui.needVal.textContent = Math.floor(c.need);
        ui.energyVal.textContent = Math.floor(c.energy);
        if (ui.hungerVal) ui.hungerVal.textContent = Math.floor(c.hunger);
        ui.visits.textContent  = c.totalVisits;
        ui.excited.textContent = c.exciteTimer > 0 ? 'yes!' : 'no';
        ui.watched.textContent = c.isWatched ? 'on' : 'away';
        ui.mic.textContent     = micActive ? c.micLevel.toFixed(2) : '—';
        if (ui.feedback) ui.feedback.textContent = lastFeedbackAction;
        if (ui.precision) ui.precision.textContent = REFERENCE_RULE_PRECISION.toFixed(2);
        if (ui.offsetRange) ui.offsetRange.textContent = String(COLOR_SCHEME_OFFSET_RANGE);
        if (ui.neighborRange) ui.neighborRange.textContent = String(NEIGHBOR_SIMILAR_RANGE);
        if (ui.refRange) ui.refRange.textContent = String(REFERENCE_MATCH_RGB_RANGE);
        if (ui.randomRule) ui.randomRule.textContent = ENABLE_GLOBAL_RANDOM_COLOR_RULE ? 'on' : 'off';
        if (ui.scheme) ui.scheme.textContent = colorScheme.map(col => `(${col[0]},${col[1]},${col[2]})`).join(' ');
        if (ui.coins) ui.coins.textContent = String(galleryCoins);
        if (ui.sceneCash) ui.sceneCash.textContent = `Cash: ${galleryCoins}`;
        if (ui.shopCashLine) ui.shopCashLine.textContent = `Cash: ${galleryCoins}`;
        if (ui.shopStatus && p.millis() > shopStatusUntil) ui.shopStatus.textContent = '';

        ui.needBar.style.width = c.need + '%';
        ui.needBar.style.backgroundColor =
            c.need < 30 ? '#788c5d' :
            c.need < 70 ? '#c9973a' : '#c0522a';

        ui.energyBar.style.width = c.energy + '%';
        ui.energyBar.style.backgroundColor =
            c.energy < 30 ? '#788c5d' :
            c.energy < 70 ? '#c9973a' : '#c0522a';

        if (ui.hungerBar) {
            ui.hungerBar.style.width = c.hunger + '%';
            ui.hungerBar.style.backgroundColor =
                c.hunger < 20 ? '#c0522a' :
                c.hunger < 60 ? '#c9973a' : '#788c5d';
        }
    }


    // ============================================================
    //  WINDOW RESIZE
    // ============================================================

    p.windowResized = function() {
        let sz = canvasSize();
        p.resizeCanvas(sz.w, sz.h);
        creature.originX = p.width / 2;
        creature.originY = p.height / 2;
    };


    // ============================================================
    //  REFERENCE SPRITE OVERRIDE MODE
    // ============================================================






    // ============================================================
    //  SIDEBAR CONTROLS  —  exposed to button onclick handlers
    // ============================================================

    window._resetNeed = () => { if (creature) creature.need = 0; };
    window._maxNeed   = () => { if (creature) creature.need = 100; };
    window._setDecay  = v => { DECAY_RATE = v; };
    window._setFeed   = v => { CLICK_FEED = v; };
    window._toggleReferenceDebug = () => { REFERENCE_DEBUG_ENABLED = !REFERENCE_DEBUG_ENABLED; };
    window._likeGeneration = () => { captureFeedback('like'); };
    window._dislikeGeneration = () => { captureFeedback('dislike'); };
    window._morePrecise = () => { increasePrecision(); };
    window._moreAbstract = () => { decreasePrecision(); };
    window._noisier = () => { increaseNoise(); };
    window._cleaner = () => { decreaseNoise(); };
    window._setGridCols = cols => { setGridDimensions(cols, GRID_ROWS); };
    window._setGridRows = rows => { setGridDimensions(GRID_COLS, rows); };

}, document.body);
