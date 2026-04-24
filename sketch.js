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
    const CANVAS_SPRITE_PATH = 'Environment/Canvas.png';
    const SEARCH_COMPUTER_IDLE_SPRITE_PATH = 'Environment/SearchComputerIdle.png';
    const SEARCH_COMPUTER_SEARCH_SPRITE_PATH = 'Environment/SearchComputerSearch.png';
    const SEARCH_COMPUTER_DISPLAY_SPRITE_PATH = 'Environment/SearchComputerDisplay.png';
    const PAINTBRUSH_BUTTON_SPRITE_PATH = 'Environment/PaintbrushButton.png';
    const EXIT_BUTTON_SPRITE_PATH = 'Environment/ExitButton.png';
    const SOUND_EFFECT_PATHS = {
        purchase: 'SoundEffects/Purchase.mp3',
        renovate: 'SoundEffects/Renovate.mp3',
        eating: 'SoundEffects/Eating.wav',
        shakeWake: 'SoundEffects/ShakeWake.wav',
    };
    const SHOP_MUSIC_TRACKS = [
        { id: 'classical-background', label: 'Classical Background Music', price: 60, path: 'SoundEffects/ClassicalBackgroundMusic.mp3' },
    ];
    const FIRST_TIME_VISITOR_PROMPT_KEY = 'first_time_visitor_prompt_v1';
    const NEW_PLAYER_MENU_SPRITE_PATH = 'UI/NewPlayerMenu.png';
    // Tutorial pages are configured here. Add new pages by appending an object.
    const TUTORIAL_BOOK_PAGES = [
        { sprite: 'UI/TutorialBookFront.png', leftText: '', rightText: '' },
        {
            sprite: 'UI/TutorialBookPage1.png',
            leftText: '',
            rightText: 'This scientefic hypothesis was written by Dr. Duxelles, in order to analyse the possibility of teaching a mushroom to paint. \n Of course, in the scientific community, we all know this is impossible as mushrooms lack the limbs, eyes, and brain necessary to paint, but this paper aims to solve how a hypothetical mushroom with the ability to paint would learn to do so.',
            leftBox: { y: 130, height: 206, fontSize: 13 },
            rightBox: { y: 110, height: 240, fontSize: 16 },
        },
        {
            sprite: 'UI/TutorialBookPage2.png',
            leftText: "Firstly in order to paint, the mushroom would need some basic equipment of a studio, canvas, paintbrush, and of course a teacher. \n Although it is possible for the mutated mushroom to paint on it's own, without human knowledge it would be unable to determine what is good and bad.",
            rightText: 'Hence the importance of a teacher, by CLICKING on the mushroom, the teacher could find a way to communicate with the mushroom and give it guidance to teach it how to paint with a style and colour that a human would find appealing.',
            leftBox: { y: 130, height: 206, fontSize: 13 },
            rightBox: { y: 130, height: 206, fontSize: 13 },
        },
        {
            sprite: 'UI/TutorialBookPage3.png',
            leftText: "However, if this hypothetical mushroom had a brain, it would actively seek out advice by asking questions to the teacher, represented by a large ? over it's head. When seeing this the teacher should listen to the creature worries and questions to not only give it guidance, but to help it develop it's own judgement in the future.",
            rightText: "Like every artist, the mushroom would need to rest it's overworked mind to regain it's energy. Not letting it get enough rest can result in it slipping back in to it's old style, creating art that can be unappealing to the human eye. However, substances like energy drinks could give a temporary boost to it's energy and even enhance the creature's speed.",
            leftBox: { y: 130, height: 206, fontSize: 13 },
            rightBox: { y: 130, height: 206, fontSize: 13 },
        },
        {
            sprite: 'UI/TutorialBookPage4.png',
            leftText: "This hypothetical creature's biology would also change greatly, as controlling brain's and limbs would require far more ENERGY than a standard muhroom could attain through absorption. As a result it would be sensible to FEED this creature human FOOD, which it would of course have the required organs to digest. However, without long limbs it's possible the creature would need to be fed by hand.",
            rightText: "Now this all might seem like a lot of work just to teach a mushroom to paint, but you need to consider the potential for SCIENCE. imagine being able to teach a mushroom human creativity, by researching the creature we could understand how this phenomenon occurs, and solve art block for everyone! Although it may seem impossible, even the slightest chance someone could successfully do this their would be MILLIONS of DOLLARS in offer for just the research alone.",
            leftBox: { y: 130, height: 206, fontSize: 13 },
            rightBox: { y: 130, height: 206, fontSize: 13 },
        },
        {
            sprite: 'UI/TutorialBookPage5.png',
            leftText: "\nOf course, even if the potential cash return for such a scientific discovery, it wouldn't hurt to make a bit of extra cash by selling the practice paintings. However, when selling paintings you never know what kind of buyer you might get, with everyone having different tastes and preferences. So I would suggest making a variety of paintings to match different tastes, in order to optimise their earnings.",
            rightText: "\n This extra cash can then be used to further improve the mushroom's teaching, buying it UPGRADES to improve it's skill, and buying DECOR to increase it's happiness.",
            leftBox: { y: 130, height: 206, fontSize: 13 },
            rightBox: { y: 130, height: 206, fontSize: 13 },
        },
        {
            sprite: "UI/TutorialBookBlank.png",
            leftText:"I didn't really know how to explain the rest of these mechanics in the context of a scientific paper, so this page is just written by Tomer: \n Some of the upgrades you can buy are the paintbrush, the computer, and the pallette upgrades. The Paintbrush can be selected in the canvas tab (found by clicking on the canvas to preview the generation), where you can chose a colour from the colour pallette to paint over the mushroom's paintings to fix mistakes or even guide the painting when done during generation.",
            rightText:"The Computer can be clicked on to search for more reference images than the one's prebuilt into the code. The Pallette upgrades will increase the amount of different colours the creature can use during generation, however if you don't like having to many colours you can always freeze some pallettes by clicking them, which temporarily stores the colour and stops using it in the generation.",
            leftBox: { y: 130, height: 206, fontSize: 13 },
            rightBox: { y: 130, height: 206, fontSize: 13 },
        }
    ];
    const SHOP_MUSIC_VOLUME = 0.46;
    const SOUND_EFFECT_VOLUMES = {
        purchase: 0.38,
        renovate: 0.32,
        eating: 0.4,
        shakeWake: 0.36,
    };
    const AREA_BUTTON_LAYOUT = {
        spriteSize: 360,
        searchButtonX: 20,
        searchButtonY: 70,
        canvasButtonOffsetX: 0.55,
        canvasButtonOffsetY: 0.2,
        galleryButtonBottom: 420,
        searchScreenLeft: 29,
        searchScreenTop: 31.5,
        searchScreenWidth: 26.5,
        searchScreenHeight: 19,
        searchScreenObjectPosition: 'center',
        searchHitboxTop: 18,
        searchHitboxRight: 19,
        searchHitboxBottom: 16,
        searchHitboxLeft: 15,
        canvasHitboxTop: 8,
        canvasHitboxRight: 24,
        canvasHitboxBottom: 4,
        canvasHitboxLeft: 24,
    };
    const REFERENCE_SPRITE_PATHS = [
        'References/FamiliarBallReference.png',
        'References/FamiliarBirdReference.png',
        'References/FamiliarBirdReference2.png',
        'References/FamiliarRealBirdReference.webp',
        'References/FamiliarRealBirdReference2.webp',
        'TextArt/FamiliarTextArt-Happy.png',
        'TextArt/FamiliarTextArt-Pride.png',
        'TextArt/FamiliarTextArt-Sad.png',
        'TextArt/FamiliarTextArt-Nervous.png',
        'TextArt/FamiliarTextArt-Yawn.png',
    ];

    const TEXTART_EXPRESSION_KEYWORDS = {
        happy: 'TextArt/FamiliarTextArt-Happy.png',
        joy: 'TextArt/FamiliarTextArt-Happy.png',
        proud: 'TextArt/FamiliarTextArt-Pride.png',
        pride: 'TextArt/FamiliarTextArt-Pride.png',
        confident: 'TextArt/FamiliarTextArt-Pride.png',
        determined: 'TextArt/FamiliarTextArt-Pride.png',
        neutral: 'TextArt/FamiliarTextArt-Happy.png',
        sad: 'TextArt/FamiliarTextArt-Sad.png',
        sorrow: 'TextArt/FamiliarTextArt-Sad.png',
        nervous: 'TextArt/FamiliarTextArt-Nervous.png',
        anxious: 'TextArt/FamiliarTextArt-Nervous.png',
        worried: 'TextArt/FamiliarTextArt-Nervous.png',
        yawn: 'TextArt/FamiliarTextArt-Yawn.png',
        sleepy: 'TextArt/FamiliarTextArt-Yawn.png',
        tired: 'TextArt/FamiliarTextArt-Yawn.png',
    };
    let REFERENCE_DEBUG_ENABLED = true;



    // ============================================================
    //  TWEAKABLE SETTINGS HUB
    //  Edit values here. Runtime state lives further below.
    // ============================================================

    const SHOW_UI      = true;   // set false to hide the sidebar while designing

    // --- Creature core ---
    let CREATURE_SIZE  = 300;    // body diameter in pixels
    let CREATURE_HOME_X = 0.65;   // normalized home position (0..1)
    let CREATURE_HOME_Y = 0.48;   // normalized home position (0..1)

    // --- Hunger / energy ---
    let DECAY_RATE     = 0.003;  // need change per frame over time
    let AWAY_RATE      = 0.020;  // kept for compatibility with older saves/settings
    let SHORT_REST_ENERGY_RECOVERY = 0.0025; // energy gain per frame during short rest
    let LONG_REST_ENERGY_RECOVERY = 0.008;   // energy gain per frame during long rest

    let AFK_PER_HOUR   = 5;      // extra need added per hour since last visit
    let AFK_MAX_HOURS  = 168;    // cap time-away at 7 days
    let CLICK_FEED     = 20;     // how much a click increases need
    let MIC_THRESHOLD  = 0.15;   // how loud is "loud" (0–1)
    let MIC_WAKE_TRIGGER_MS = 900;
    let EXCITED_FRAMES = 40;  
    let SLEEPING_FRAMES = 800;     // how long the creature stays asleep
    let BOUNCE_SCALE   = 1.0;    // multiplier for all bounce amounts
    let MIC_ANIMATION_SPEED_MULTIPLIER = 7.0;
    
    // --- Grid generation ---
    let GRID_COLS      = 30;
    let GRID_ROWS      = 30;
    let GRID_SIZE      = 16;
    let GRID_GAP       = 2;
    let GRID_BUTTON_OPEN_SIZE_MULTIPLIER = 0.8;
    let GRID_MARGIN    = 26;
    let GRID_MAX_COLS = 220;
    let GRID_MAX_ROWS = 220;
    let GRID_MAX_TOTAL_CELLS = 32000;
    
    let GRID_UPDATES_PER_SECOND = 30;
    let GRID_MAX_UPDATES_PER_FRAME = 120;
    let GRID_PANEL_MIN_WIDTH = 100;
    let GRID_PANEL_MIN_HEIGHT = 100;
    let GRID_PANEL_MAX_WIDTH = 1600;
    let GRID_PANEL_MAX_HEIGHT = 1200;
    let GRID_DEFAULT_OPEN_SCALE = 0.58;
    const GRID_TAB_HEIGHT = 34;
    const GRID_TAB_GAP = 6;
    const GRID_TAB_BUTTON_W = 34;
    const GRID_PANEL_PADDING = 10;

    let GRID_RANDOM_INTERVAL_MS = 0.15;
   
    // --- Style / colour evolution ---
    let COLOR_SCHEME_COUNT = 6;
    let COLOR_SCHEME_OFFSET_RANGE = 20;
    let REFERENCE_MATCH_RGB_RANGE = 10; // Added dedicated RGB range variable
    let NEIGHBOR_SIMILAR_RANGE = 20;
    let REFERENCE_RULE_PRECISION = 0.80;
    let ADJACENT_SCHEME_OVERRIDE_CHANCE = 0.03;
    let GLOBAL_RANDOM_COLOR_CHANCE = 0.01;
    let ENABLE_GLOBAL_RANDOM_COLOR_RULE = false;

    let PAUSE_INTERACTION_THRESHOLD = 0.99;
    let PAUSE_AFTER_THRESHOLD_CHANCE = 0.10;

    // --- Grid painting UI ---
    let SCHEME_TILE_SIZE = 16;
    let SCHEME_GAP = 4;
    let PALETTE_TILE_SIZE = 16;
    let PAINT_BUTTON_HEIGHT = 38;
    let PAINTING_SPRITE_SHEET_PATH = 'Animations/FamiliarPaintingAnimation.png';
    let PAINTING_SPRITE_COLS = 4;
    let PAINTING_SPRITE_ROWS = 4;
    let PAINTING_SPRITE_FPS = 8;
    let SLEEPING_SPRITE_SHEET_PATH = 'Animations/FamiliarSleepingAnimation.png';
    let SLEEPING_SPRITE_COLS = 5;
    let SLEEPING_SPRITE_ROWS = 6;
    let SLEEPING_SPRITE_DRAW_SCALE = 1.25;
    let SLEEPING_SPRITE_SEQUENCES = {
        fallingAsleep: { startFrame: 1, endFrame: 12, fps: 10 },
        sleepLoop: { startFrame: 13, endFrame: 16, fps: 7 },
        wakingUp: { startFrame: 17, endFrame: 23, fps: 10 },
    };
    let ART_ACCENT_CHANGE_EVERY_LOOPS = 1;
    let DISLIKE_STYLE_RANGE_MIN = 6;
    let DISLIKE_STYLE_RANGE_MAX = 14;

    // --- Creature / menu placement ---
    let CREATURE_CENTER_OFFSET_X = -280;
    let CREATURE_CENTER_OFFSET_Y = 0;
    // Radial menu centre offsets (edit directly in code).
    let RADIAL_CENTER_OFFSET_X = -330;
    let RADIAL_CENTER_OFFSET_Y = -330;

    let GRID_PANEL_OFFSET_X = -250;
    let GRID_PANEL_OFFSET_Y = 0;
    let GRID_OPEN_CANVAS_BUTTON_GAP_X = 42;
    let GRID_OPEN_CANVAS_BUTTON_OFFSET_Y = -24;
    let GRID_TAB_OFFSET_X = 0;
    let GRID_TAB_OFFSET_Y = 0;
    let GRID_TAB_WIDTH = 120;
    let GRID_CANVAS_Z_INDEX = 500;
    let AREA_OPEN_BUTTONS_Z_INDEX = 1;

    let ENERGY_DRINK_GRID_UPS_MULTIPLIER = 5.2;
    let ENERGY_DRINK_ENERGY_DRAIN_MULTIPLIER = 5.2;
    let ENERGY_DRINK_ANIMATION_SPEED_MULTIPLIER = 3;
    let ENERGY_DRINK_BOOST_TARGET_ENERGY = 50;

    let CREATURE_QUESTION_MIN_INTERVAL_MS = 45000;
    let CREATURE_QUESTION_MAX_INTERVAL_MS = 95000;
    let CREATURE_QUESTION_MARK_OFFSET_Y = -190;

    // --- New player sprite menu ---
    let NEW_PLAYER_MENU_WIDTH = 680;
    let NEW_PLAYER_MENU_MAX_WIDTH_VW = 82;
    let NEW_PLAYER_MENU_ASPECT = 1.64;
    let NEW_PLAYER_MENU_YES_X = 0.28;
    let NEW_PLAYER_MENU_YES_Y = 0.79;
    let NEW_PLAYER_MENU_YES_W = 0.22;
    let NEW_PLAYER_MENU_YES_H = 0.14;
    let NEW_PLAYER_MENU_NO_X = 0.52;
    let NEW_PLAYER_MENU_NO_Y = 0.79;
    let NEW_PLAYER_MENU_NO_W = 0.22;
    let NEW_PLAYER_MENU_NO_H = 0.14;

    // --- Tutorial book UI ---
    let TUTORIAL_BOOK_WIDTH = 760;
    let TUTORIAL_BOOK_SCALE = 1.5;
    let TUTORIAL_BOOK_MAX_WIDTH_VW = 92;
    let TUTORIAL_BOOK_START_X = 120;
    let TUTORIAL_BOOK_START_Y = 80;
    let TUTORIAL_BOOK_SHOW_DRAG_AREA_DEBUG = true;

    // Drag area for cover sprite (page index 0)
    let TUTORIAL_BOOK_COVER_DRAG_OFFSET_X = 210;
    let TUTORIAL_BOOK_COVER_DRAG_OFFSET_Y = 0;
    let TUTORIAL_BOOK_COVER_DRAG_W = 330;
    let TUTORIAL_BOOK_COVER_DRAG_H = 370;

    // Drag area for numbered page sprites (page index 1..5)
    let TUTORIAL_BOOK_PAGE_DRAG_OFFSET_X = 50;
    let TUTORIAL_BOOK_PAGE_DRAG_OFFSET_Y = 0;
    let TUTORIAL_BOOK_PAGE_DRAG_W = 660;
    let TUTORIAL_BOOK_PAGE_DRAG_H = 380;

    let TUTORIAL_BOOK_TEXTBOX_1_X = 78;
    let TUTORIAL_BOOK_TEXTBOX_1_Y = 130;
    let TUTORIAL_BOOK_TEXTBOX_1_W = 296;
    let TUTORIAL_BOOK_TEXTBOX_1_H = 206;
    let TUTORIAL_BOOK_TEXTBOX_2_X = 388;
    let TUTORIAL_BOOK_TEXTBOX_2_Y = 130;
    let TUTORIAL_BOOK_TEXTBOX_2_W = 296;
    let TUTORIAL_BOOK_TEXTBOX_2_H = 206;
    let TUTORIAL_BOOK_TEXTBOX_1_FONT_SIZE = 13;
    let TUTORIAL_BOOK_TEXTBOX_2_FONT_SIZE = 13;
    let TUTORIAL_BOOK_TEXT_OFFSET_X = 16;
    let TUTORIAL_BOOK_TEXT_OFFSET_Y = 14;
    let TUTORIAL_BOOK_TEXT_LINE_HEIGHT = 1.4;

    // Navigation button offsets for the cover page.
    let TUTORIAL_BOOK_COVER_PREV_BUTTON_X = 170;
    let TUTORIAL_BOOK_COVER_NEXT_BUTTON_X = 532;
    let TUTORIAL_BOOK_COVER_BUTTON_Y = 330;

    // Navigation button offsets for all numbered pages.
    let TUTORIAL_BOOK_NUMBERED_PREV_BUTTON_X = 28;
    let TUTORIAL_BOOK_NUMBERED_NEXT_BUTTON_X = 690;
    let TUTORIAL_BOOK_NUMBERED_BUTTON_Y = 330;

    let TUTORIAL_BOOK_NAV_BUTTON_SIZE = 72;
    let TUTORIAL_BOOK_CLOSE_BUTTON_RIGHT = 14;
    let TUTORIAL_BOOK_CLOSE_BUTTON_TOP = 10;
    let TUTORIAL_BOOK_CLOSE_BUTTON_SIZE = 34;

    let GRID_CANVAS_TAB_BUTTON_SIZE = GRID_TAB_HEIGHT * 3;
    let GRID_CLOSE_BUTTON_OFFSET_X = 5 * (GRID_TAB_WIDTH + GRID_TAB_GAP);
    let GRID_CLOSE_BUTTON_OFFSET_Y = -2.6 * (GRID_TAB_WIDTH + GRID_TAB_GAP);
    let GRID_PAINT_BUTTON_OFFSET_X = 0;
    let GRID_PAINT_BUTTON_OFFSET_Y = 0;

    
    let GRID_AREAS_VISIBLE = true;
    let STUDIO_WALL_FLOOR_SPLIT_Y = 0.62;
    let STUDIO_FLOOR_DARKEN = 0.82;
    
    let STUDIO_FAVORITE_FRAME_X = 0.82;
    let STUDIO_FAVORITE_FRAME_Y = 0.2;
    let STUDIO_FAVORITE_FRAME_W = 120;
    let STUDIO_FAVORITE_FRAME_H = 120;
    let STUDIO_FAVORITE_FRAME_SIZE_SCALE = 1.0;

    // --- World hotspot buttons ---
    let WORLD_AREA_1_X = 80;
    let WORLD_AREA_1_Y = 92;
    let WORLD_AREA_2_X = 80;
    let WORLD_AREA_2_Y = 208;
    let WORLD_AREA_SIZE = 92;
    let WORLD_AREA_BUTTONS_VISIBLE = false;

    // --- Generation thumbnails / announcements ---
    let GENERATION_THUMB_WIDTH = 100;
    let GENERATION_THUMB_HEIGHT = 100;

    let SALE_ANNOUNCEMENT_DURATION_MS = 2200;
    let SALE_ANNOUNCEMENT_FADE_IN_MS = 260;
    let SALE_ANNOUNCEMENT_FADE_OUT_MS = 520;
    let BULK_SALE_ENTRY_LIFETIME_MS = 2600;
    let BULK_SALE_ENTRY_INTERVAL_MS = 430;
    let BULK_SALE_TOTAL_DELAY_MS = 700;
    let BULK_SALE_TOTAL_DURATION_MS = 2000;

    // --- Search / rest tuning ---
    let OPENVERSE_SEARCH_RESULT_COUNT = 20;
    let OPENVERSE_RANDOM_POOL_SIZE = 6;
    let BASE_LONG_REST_DURATION_MS = 0.5 * 60 * 1000;
    let SHORT_REST_DURATION_MS = BASE_LONG_REST_DURATION_MS;
    let LONG_REST_DURATION_MS = BASE_LONG_REST_DURATION_MS * 10;
    let LONG_REST_CLICK_REDUCTION_MS = 6000;
    let SHORT_REST_WAKE_CLICKS_REQUIRED = 3;
    let REST_WAKE_SHAKE_FRAMES = 8;
    let REST_WAKE_SHAKE_AMPLITUDE = 5;
    let GENERATING_ENERGY_DRAIN = 0.0018;
    let ENERGY_DECREASE_SPEED = 1.2;
    let ENERGY_INCREASE_SPEED = 1.0;
    const ARCHIVE_PREVIEW_SYNC_MS = 180;

    // --- Shop economy ---
    const SHOP_NEED_PRICE = 25;
    const SHOP_NEED_DELTA = 35;
    const SHOP_ENERGY_PRICE = 20;
    const SHOP_ENERGY_DELTA = 25;
    const SHOP_CANVAS_LONG_PRICE = 65;
    const SHOP_CANVAS_WIDE_PRICE = 65;
    const SHOP_CANVAS_BIG_PRICE = 110;
    const SHOP_CANVAS_CUSTOM_PRICE_PER_CELL = 0.04;
    const SHOP_PALETTE_UPGRADE_BASE_PRICE = 70;
    const SHOP_PALETTE_UPGRADE_STEP_PRICE = 35;
    const SHOP_PALETTE_MAX_SLOTS = 14;
    const SHOP_COMPUTER_PRICE = 180;
    const SHOP_PROGRESS_RESET_PRICE = 900;
    const SHOP_FOOD_VARIANTS = [
        { id: 'apple', label: 'Apple', hungerGain: 12, price: 5, spritePath: 'FoodSprites/Apple.png' },
        { id: 'burger', label: 'Burger', hungerGain: 65, price: 25, spritePath: 'FoodSprites/Burger.png' },
        { id: 'sandwich', label: 'Sandwich', hungerGain: 27, price: 10, spritePath: 'FoodSprites/Sandwhich.png' },
        { id: 'energy-drink', label: 'Energy Drink', energyGain: 25, price: 22, spritePath: 'FoodSprites/EnergyDrink.png' },
    ];
    let FOOD_ITEM_SIZE = 122;
    let FOOD_GRAVITY = 0.45;
    let FOOD_MAX_FALL_SPEED = 8;
    let FOOD_FLOOR_Y = 0.65;
    const FOOD_DROP_HITBOX_SCALE = 0.55;
    const FOOD_HOVER_OUTLINE_COLOUR = [235, 135, 42, 245];

    // --- Theme presets ---
    const GALLERY_WALL_THEMES = [
        { id: 'sage', label: 'Sage Mist', colour: [220, 242, 210], price: 0 },
        { id: 'linen', label: 'Warm Linen', colour: [244, 236, 217], price: 55 },
        { id: 'clay', label: 'Terracotta Clay', colour: [232, 202, 176], price: 65 },
        { id: 'slate', label: 'Slate Blue', colour: [188, 203, 218], price: 80 },
    ];
    const STUDIO_WALL_THEMES = [
        { id: 'cloud', label: 'Cloud Studio', colour: [242, 238, 229], price: 0 },
        { id: 'rose', label: 'Rose Studio', colour: [245, 226, 225], price: 35 },
        { id: 'ink', label: 'Ink Studio', colour: [220, 228, 236], price: 45 },
        { id: 'moss', label: 'Moss Studio', colour: [224, 233, 214], price: 45 },
    ];
    const STUDIO_DECOR_THEMES = [
        { id: 'frame-favorite', label: 'Framed favorite painting', price: 200, spritePath: null, worldX: 0.82, worldY: 0.2, spriteW: 120, spriteH: 120 },
        { id: 'plant-vase', label: 'Plant Vase', price: 35, spritePath: 'Environment/PlantVase.png', worldX: 0.72, worldY: 0.42, spriteW: 130, spriteH: 130 },
        { id: 'golden-statue', label: 'Golden Statue', price: 350, spritePath: 'Environment/GoldenStatue.png', worldX: 0.62, worldY: 0.42, spriteW: 150, spriteH: 150 },
        { id: 'pet-mush', label: 'Pet Mush', price: 100, spritePath: 'Environment/PetMush.png', worldX: 0.8, worldY: 0.5, spriteW: 128, spriteH: 128 },
        { id: 'lamp', label: 'Lamp', price: 50, spritePath: 'Environment/Lamp.png', worldX: 0.8, worldY: 0.5, spriteW: 128, spriteH: 128 },
        { id: 'expensive_painting', label: 'Expensive Painting', price: 600, spritePath: 'Environment/ExpensivePainting.png', worldX: 0.8, worldY: 0.5, spriteW: 128, spriteH: 128 },
    ];
    const BASE_COLOR_SCHEME_COUNT = 6;
    const PAINT_BLACK = [20, 20, 20];
    const PAINT_WHITE = [255, 255, 255];

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
        excited:    { bounceAmt: 0.10, shakeAmt: 0.0, alphaTarget: 255, bodyTarget: [200, 100, 0] },
        sleepy:     { bounceAmt: 0.005, shakeAmt: 0.0, alphaTarget: 255, bodyTarget: [150, 0, 150] },
    };

    const STATE_DESCRIPTIONS = {
        happy:      'hunger is high — bouncy, fully visible',
        neutral:    'hunger is lower — calmer movement',
        excited:    'heard a sound! — big pupils, roaming',
        sleepy:     'low energy — sleeping',
    };

    // First match wins — checked top to bottom every frame.
    function getState(c) {
        if (c.sleepTimer > 0) return 'sleepy';
        if (c.exciteTimer > 0) return 'excited';
        if (c.need >= 70)      return 'happy';
        return 'neutral';
    }


    // ============================================================
    //  CREATURE FACTORY
    // ============================================================

    function createCreature(x, y) {
        return {
            x, y,
            need:  50,
            energy: 100,
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
    let micAboveThresholdSinceMs = 0;
    let gridColors  = [];
    let gridChanged = [];
    let colorScheme = [];
    let gridChangedCount = 0;
    let generationPaused = false;
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
    let selectSellModeActive = false;
    let selectedSellSerials = new Set();
    let galleryCoins = 0;
    let saleAnnouncement = null;
    let bulkSaleCredits = null;
    let referenceSearchPending = false;
    let queuedReferenceForNextGeneration = null;
    let queuedExpressionReferenceForNextGeneration = null;
    let paintingSpriteSheet = null;
    let paintingFrameIndex = 0;
    let lastPaintingFrameAt = 0;
    let paintingCompletedLoops = 0;
    let artAccentColour = [120, 220, 110];
    let paintingFrameBuffer = null;
    let sleepingSpriteSheet = null;
    let sleepingFrameIndex = SLEEPING_SPRITE_SEQUENCES.fallingAsleep.startFrame;
    let sleepingLastFrameAt = 0;
    let sleepingAnimationPhase = 'idle';
    let sleepingFrameBuffer = null;
    let sleepingAccentColour = null;
    let activeReferencePreview = {
        imageUrl: '',
        caption: 'Using default local references.',
    };
    let colourPreference = {
        mode: null,
        targetScheme: null,
        likeStreak: 0,
    };
    let stylePreference = {
        mode: null,
        target: null,
        likeStreak: 0,
    };
    let easyStyleProfile = null;
    let fullEnergyStyleSnapshot = null;
    let fullEnergyColorScheme = null;
    let lastEnergyStyleInfluence = 0;
    let restState = {
        shortActive: false,
        shortRestUntil: 0,
        longRestUntil: 0,
    };
    let shortRestWakeClicks = 0;
    let restWakeShakeFrames = 0;
    let wasLongRestActive = false;
    let wasShortRestActive = false;
    let restGenerationSnapshot = null;

    let gridView = {
        panX: 0,
        panY: 0,
        scale: 1,
        minScale: 0.4,
        maxScale: 2.8,
        isPanning: false,
        isVisible: false,
        openedViaCanvasButton: false,
        canvasButtonAnchorX: null,
        canvasButtonAnchorY: null,
        isZoomedTab: false,
        spaceDown: false,
    };

    let paintModeEnabled = false;
    let selectedPaintColourIndex = 0;

    let paletteUpgradeCount = 0;
    let hasComputerUpgrade = false;
    let ownedGalleryWallThemeIds = ['sage'];
    let activeGalleryWallThemeId = 'sage';
    let ownedStudioWallThemeIds = ['cloud'];
    let activeStudioWallThemeId = 'cloud';
    let studioWallColour = [242, 238, 229];
    let ownedStudioDecorThemeIds = [];
    let studioFavoritePaintingImage = null;
    let studioFavoritePaintingSerial = null;
    let studioFavoritePaintingPendingSerial = null;
    let favouriteGenerationSerial = null;
    let frozenSchemeSlots = [];
    let frozenSchemeValues = [];
    let archivedPreviewDirty = false;
    let foodSprites = new Map();
    let foodOutlineSprites = new Map();
    let pendingFoodSpriteLoads = new Set();
    let studioDecorSprites = new Map();
    let pendingStudioDecorSpriteLoads = new Set();
    let foodItems = [];
    let nextFoodItemId = 1;
    let draggedFoodItemId = null;
    let foodDragOffsetX = 0;
    let foodDragOffsetY = 0;
    let creatureFoodHoverActive = false;
    let energyDrinkGridBoostActive = false;
    let creatureQuestionState = {
        active: false,
        type: null,
        prompt: '',
        nextAtMs: 0,
    };
    let soundEffectTemplates = {};
    let soundEffectLastPlayAt = {};
    let shopMusicAudio = null;
    let ownedShopMusicTrackIds = [];
    let activeShopMusicTrackId = null;
    let paintbrushButtonSprite = null;
    let exitButtonSprite = null;
    let pendingNewPlayerMenuChoice = null;
    let tutorialBookState = {
        isOpen: false,
        pageIndex: 0,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        x: TUTORIAL_BOOK_START_X,
        y: TUTORIAL_BOOK_START_Y,
    };

        function getGalleryWallThemeById(themeId) {
            return GALLERY_WALL_THEMES.find(theme => theme.id === themeId) || GALLERY_WALL_THEMES[0];
        }

        function ensureGalleryWallState() {
            if (!Array.isArray(ownedGalleryWallThemeIds) || ownedGalleryWallThemeIds.length === 0) {
                ownedGalleryWallThemeIds = ['sage'];
            }

            let validIds = new Set(GALLERY_WALL_THEMES.map(theme => theme.id));
            ownedGalleryWallThemeIds = ownedGalleryWallThemeIds
                .filter(id => validIds.has(id))
                .filter((id, idx, arr) => arr.indexOf(id) === idx);

            if (!ownedGalleryWallThemeIds.includes('sage')) {
                ownedGalleryWallThemeIds.unshift('sage');
            }

            if (!validIds.has(activeGalleryWallThemeId) || !ownedGalleryWallThemeIds.includes(activeGalleryWallThemeId)) {
                activeGalleryWallThemeId = ownedGalleryWallThemeIds[0] || 'sage';
            }
        }

        function applyActiveGalleryWallTheme() {
            ensureGalleryWallState();
            let theme = getGalleryWallThemeById(activeGalleryWallThemeId);
            bgColour = [...theme.colour];
        }

        function getStudioWallThemeById(themeId) {
            return STUDIO_WALL_THEMES.find(theme => theme.id === themeId) || STUDIO_WALL_THEMES[0];
        }

        function ensureStudioWallState() {
            if (!Array.isArray(ownedStudioWallThemeIds) || ownedStudioWallThemeIds.length === 0) {
                ownedStudioWallThemeIds = ['cloud'];
            }

            let validIds = new Set(STUDIO_WALL_THEMES.map(theme => theme.id));
            ownedStudioWallThemeIds = ownedStudioWallThemeIds
                .filter(id => validIds.has(id))
                .filter((id, idx, arr) => arr.indexOf(id) === idx);

            if (!ownedStudioWallThemeIds.includes('cloud')) {
                ownedStudioWallThemeIds.unshift('cloud');
            }

            if (!validIds.has(activeStudioWallThemeId) || !ownedStudioWallThemeIds.includes(activeStudioWallThemeId)) {
                activeStudioWallThemeId = ownedStudioWallThemeIds[0] || 'cloud';
            }
        }

        function applyActiveStudioWallTheme() {
            ensureStudioWallState();
            let theme = getStudioWallThemeById(activeStudioWallThemeId);
            studioWallColour = [...theme.colour];
        }

        function getShopMusicTrackById(trackId) {
            return SHOP_MUSIC_TRACKS.find(track => track.id === trackId) || SHOP_MUSIC_TRACKS[0];
        }

        function ensureShopMusicState() {
            if (!Array.isArray(ownedShopMusicTrackIds)) {
                ownedShopMusicTrackIds = [];
            }

            let validIds = new Set(SHOP_MUSIC_TRACKS.map(track => track.id));
            ownedShopMusicTrackIds = ownedShopMusicTrackIds
                .filter(id => validIds.has(id))
                .filter((id, idx, arr) => arr.indexOf(id) === idx);

            if (activeShopMusicTrackId && (!validIds.has(activeShopMusicTrackId) || !ownedShopMusicTrackIds.includes(activeShopMusicTrackId))) {
                activeShopMusicTrackId = ownedShopMusicTrackIds[0] || null;
            }
        }

        function stopShopMusic() {
            if (shopMusicAudio) {
                shopMusicAudio.pause();
                shopMusicAudio.currentTime = 0;
            }
            shopMusicAudio = null;
        }

        function playShopMusic(trackId) {
            ensureShopMusicState();
            let track = getShopMusicTrackById(trackId);
            if (!track || !ownedShopMusicTrackIds.includes(track.id)) return;

            if (shopMusicAudio && activeShopMusicTrackId !== track.id) {
                stopShopMusic();
            }

            if (!shopMusicAudio) {
                shopMusicAudio = new Audio(track.path);
                shopMusicAudio.loop = true;
                shopMusicAudio.preload = 'auto';
                shopMusicAudio.volume = SHOP_MUSIC_VOLUME;
            }

            activeShopMusicTrackId = track.id;
            shopMusicAudio.currentTime = 0;
            shopMusicAudio.play().catch(() => {});
        }

        function buyOrPlayShopMusic(trackId) {
            ensureShopMusicState();
            let track = getShopMusicTrackById(trackId);
            if (!track) return;

            let owned = ownedShopMusicTrackIds.includes(track.id);
            let wasPurchasedNow = false;
            if (!owned && track.price > 0) {
                if (galleryCoins < track.price) {
                    setShopStatus('Not enough coins for that music track.', true);
                    return;
                }
                galleryCoins -= track.price;
                playSoundEffect('purchase');
                ownedShopMusicTrackIds.push(track.id);
                setShopStatus(`Purchased music track: ${track.label}`);
                wasPurchasedNow = true;
            } else if (!owned) {
                ownedShopMusicTrackIds.push(track.id);
                setShopStatus(`Unlocked music track: ${track.label}`);
                wasPurchasedNow = true;
            } else if (activeShopMusicTrackId === track.id) {
                setShopStatus(`Restarting music track: ${track.label}`);
            } else {
                setShopStatus(`Playing music track: ${track.label}`);
            }

            playShopMusic(track.id);
            if (wasPurchasedNow) {
                showShopPurchaseReaction('music', track.label);
            }
            refreshShopUI();
            saveState(creature);
        }

        function getStudioDecorThemeById(themeId) {
            return STUDIO_DECOR_THEMES.find(theme => theme.id === themeId) || STUDIO_DECOR_THEMES[0];
        }

        function ensureStudioDecorState() {
            if (!Array.isArray(ownedStudioDecorThemeIds) || ownedStudioDecorThemeIds.length === 0) {
                ownedStudioDecorThemeIds = [];
            }

            let validIds = new Set(STUDIO_DECOR_THEMES.map(theme => theme.id));
            ownedStudioDecorThemeIds = ownedStudioDecorThemeIds
                .filter(id => validIds.has(id))
                .filter((id, idx, arr) => arr.indexOf(id) === idx);
        }
    let lastArchivePreviewSyncAt = 0;


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
            w: p.windowWidth - 20,
            h: p.windowHeight - 20,
        };
    }

    function applyAreaButtonLayoutVariables() {
        let rootStyle = document.documentElement.style;
        rootStyle.setProperty('--area-sprite-size', `${AREA_BUTTON_LAYOUT.spriteSize}px`);
        rootStyle.setProperty('--search-open-button-x', `${AREA_BUTTON_LAYOUT.searchButtonX}%`);
        rootStyle.setProperty('--search-open-button-y', `${AREA_BUTTON_LAYOUT.searchButtonY}%`);
        rootStyle.setProperty('--gallery-open-button-bottom', `${AREA_BUTTON_LAYOUT.galleryButtonBottom}px`);
        rootStyle.setProperty('--search-screen-left', `${AREA_BUTTON_LAYOUT.searchScreenLeft}%`);
        rootStyle.setProperty('--search-screen-top', `${AREA_BUTTON_LAYOUT.searchScreenTop}%`);
        rootStyle.setProperty('--search-screen-width', `${AREA_BUTTON_LAYOUT.searchScreenWidth}%`);
        rootStyle.setProperty('--search-screen-height', `${AREA_BUTTON_LAYOUT.searchScreenHeight}%`);
        rootStyle.setProperty('--search-screen-object-position', AREA_BUTTON_LAYOUT.searchScreenObjectPosition);
        rootStyle.setProperty('--search-hitbox-top', `${AREA_BUTTON_LAYOUT.searchHitboxTop}%`);
        rootStyle.setProperty('--search-hitbox-right', `${AREA_BUTTON_LAYOUT.searchHitboxRight}%`);
        rootStyle.setProperty('--search-hitbox-bottom', `${AREA_BUTTON_LAYOUT.searchHitboxBottom}%`);
        rootStyle.setProperty('--search-hitbox-left', `${AREA_BUTTON_LAYOUT.searchHitboxLeft}%`);
        rootStyle.setProperty('--canvas-hitbox-top', `${AREA_BUTTON_LAYOUT.canvasHitboxTop}%`);
        rootStyle.setProperty('--canvas-hitbox-right', `${AREA_BUTTON_LAYOUT.canvasHitboxRight}%`);
        rootStyle.setProperty('--canvas-hitbox-bottom', `${AREA_BUTTON_LAYOUT.canvasHitboxBottom}%`);
        rootStyle.setProperty('--canvas-hitbox-left', `${AREA_BUTTON_LAYOUT.canvasHitboxLeft}%`);
        rootStyle.setProperty('--grid-canvas-z-index', `${Math.floor(Number(GRID_CANVAS_Z_INDEX) || 0)}`);
        rootStyle.setProperty('--open-area-buttons-z-index', `${Math.floor(Number(AREA_OPEN_BUTTONS_Z_INDEX) || 2)}`);
        rootStyle.setProperty('--canvas-tab-button-z-index', `${Math.floor(Number(GRID_CANVAS_Z_INDEX) || 0)}`);
    }

    function isEnergyDrinkBoostActive(currentCreature = creature) {
        return !!energyDrinkGridBoostActive
            && !!currentCreature
            && Number(currentCreature.energy) > ENERGY_DRINK_BOOST_TARGET_ENERGY;
    }

    function getMicBoostRatio(currentCreature = creature) {
        if (!micActive || !currentCreature) return 0;
        let threshold = p.constrain(Number(MIC_THRESHOLD) || 0, 0, 1);
        let level = p.constrain(Number(currentCreature.micLevel) || 0, 0, 1);
        if (level <= threshold) return 0;
        let span = Math.max(0.0001, 1 - threshold);
        return p.constrain((level - threshold) / span, 0, 1);
    }

    function getMicScaledMultiplier(maxMultiplier, currentCreature = creature) {
        let max = p.max(1, Number(maxMultiplier) || 1);
        return p.lerp(1, max, getMicBoostRatio(currentCreature));
    }

    function getMicAnimationSpeedMultiplier(currentCreature = creature) {
        let max = p.max(1, Number(MIC_ANIMATION_SPEED_MULTIPLIER) || 1);
        let micBoostRatio = getMicBoostRatio(currentCreature);
        let micBoost = micBoostRatio > 0
            ? p.lerp(1, max, p.pow(micBoostRatio, 0.4))
            : 1;
        let exciteBoost = 1;
        if (currentCreature && Number(currentCreature.exciteTimer) > 0) {
            let exciteRatio = p.constrain(Number(currentCreature.exciteTimer) / p.max(1, Number(EXCITED_FRAMES) || 1), 0, 1);
            exciteBoost = p.lerp(1, max, p.pow(exciteRatio, 0.55));
        }
        return p.max(micBoost, exciteBoost);
    }

    function getStackedGridSpeedMultiplier(currentCreature = creature) {
        let drinkMult = isEnergyDrinkBoostActive(currentCreature)
            ? p.max(1, Number(ENERGY_DRINK_GRID_UPS_MULTIPLIER) || 1)
            : 1;
        return drinkMult * getMicScaledMultiplier(ENERGY_DRINK_GRID_UPS_MULTIPLIER, currentCreature);
    }

    function getStackedEnergyDrainMultiplier(currentCreature = creature) {
        let drinkMult = isEnergyDrinkBoostActive(currentCreature)
            ? p.max(1, Number(ENERGY_DRINK_ENERGY_DRAIN_MULTIPLIER) || 1)
            : 1;
        return drinkMult * getMicScaledMultiplier(ENERGY_DRINK_ENERGY_DRAIN_MULTIPLIER, currentCreature);
    }

    function getStackedAnimationSpeedMultiplier(currentCreature = creature) {
        let drinkMult = isEnergyDrinkBoostActive(currentCreature)
            ? p.max(1, Number(ENERGY_DRINK_ANIMATION_SPEED_MULTIPLIER) || 1)
            : 1;
        return drinkMult * getMicAnimationSpeedMultiplier(currentCreature);
    }

    function forceWakeFromRest(reason = 'short') {
        if (reason === 'long') {
            restState.longRestUntil = 0;
            wasLongRestActive = false;
            showWakeUpDialogue('long');
            return;
        }

        restState.shortActive = false;
        restState.shortRestUntil = 0;
        shortRestWakeClicks = 0;
        wasShortRestActive = false;
        showWakeUpDialogue('short');
    }

    function scheduleNextCreatureQuestion(nowMs = p.millis()) {
        let minDelay = p.max(5000, Number(CREATURE_QUESTION_MIN_INTERVAL_MS) || 45000);
        let maxDelay = p.max(minDelay + 1000, Number(CREATURE_QUESTION_MAX_INTERVAL_MS) || 95000);
        creatureQuestionState.nextAtMs = nowMs + p.random(minDelay, maxDelay);
    }

    function pickCreatureQuestionType() {
        let roll = p.random();
        if (roll < 0.34) return 'colours';
        if (roll < 0.67) return 'precision';
        return 'noise';
    }

    function buildCreatureQuestionPrompt(type) {
        if (type === 'precision') {
            return 'Should I be more precise or more abstract right now? [expr:nervous]';
        }
        if (type === 'noise') {
            return 'Do you want noisier or cleaner style while I paint this one? [expr:neutral]';
        }
        return 'Are these colours working, or should I shift the palette now? [expr:confident]';
    }

    function maybeStartCreatureQuestion(c) {
        if (!c || creatureQuestionState.active) return;
        if (generationPaused || isRestingNow()) return;
        if (!c.isWatched) return;
        let now = p.millis();
        if (now < creatureQuestionState.nextAtMs) return;

        let type = pickCreatureQuestionType();
        creatureQuestionState.active = true;
        creatureQuestionState.type = type;
        creatureQuestionState.prompt = buildCreatureQuestionPrompt(type);
        generationPaused = true;
    }

    function openCreatureQuestionInteraction() {
        if (!creatureQuestionState.active) return;

        if (typeof window._showNpcDialogueWithExpr === 'function') {
            window._showNpcDialogueWithExpr(
                creatureQuestionState.prompt || buildCreatureQuestionPrompt(creatureQuestionState.type || 'colours')
            );
        }

        if (typeof window._openRadialForQuestion === 'function') {
            window._openRadialForQuestion(creatureQuestionState.type || 'colours');
        } else if (ui.radialMenu) {
            ui.radialMenu.classList.add('radial-active');
        }
        if (ui.radialMenu) updateRadialMenuPosition(creature);
    }

    function drawCreatureQuestionIndicator(c) {
        if (!creatureQuestionState.active || !c) return;
        p.push();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(44);
        p.fill(255, 243, 120, 240);
        p.stroke(40, 40, 40, 180);
        p.strokeWeight(2.5);
        p.text('!', c.x, c.y + CREATURE_QUESTION_MARK_OFFSET_Y);
        p.pop();
    }

    function onLikeColoursFeedbackImmediate() {
        if (colourPreference.mode === 'like' && Array.isArray(colourPreference.targetScheme)) {
            colourPreference.targetScheme = blendSchemeToward(colourPreference.targetScheme, colorScheme, 0.5);
            colourPreference.likeStreak = Math.min(10, (colourPreference.likeStreak || 0) + 1);
        } else {
            colourPreference.targetScheme = colorScheme.map(col => [...col]);
            colourPreference.likeStreak = 1;
        }
        colourPreference.mode = 'like';
        // Keep current colours unchanged for in-generation question feedback.
        colorScheme = colorScheme.map(col => [...col]);
        applyFrozenSchemeConstraints();
        lastFeedbackAction = 'like-colours-now';
    }

    function onDislikeColoursFeedbackImmediate() {
        colourPreference.mode = 'dislike';
        colourPreference.targetScheme = colorScheme.map(col => [...col]);
        colourPreference.likeStreak = 0;
        colorScheme = buildDislikedScheme(colorScheme);
        applyFrozenSchemeConstraints();
        lastFeedbackAction = 'dislike-colours-now';
    }

    function onLikeStyleFeedbackImmediate() {
        let wasLike = stylePreference.mode === 'like';
        let snap = captureCurrentStyleSnapshot();
        if (wasLike && stylePreference.target) {
            stylePreference.target = {
                referenceRulePrecision: p.lerp(stylePreference.target.referenceRulePrecision, snap.referenceRulePrecision, 0.5),
                colorSchemeOffsetRange: p.lerp(stylePreference.target.colorSchemeOffsetRange, snap.colorSchemeOffsetRange, 0.5),
                neighborSimilarRange: p.lerp(stylePreference.target.neighborSimilarRange, snap.neighborSimilarRange, 0.5),
                referenceMatchRgbRange: p.lerp(stylePreference.target.referenceMatchRgbRange, snap.referenceMatchRgbRange, 0.5),
                adjacentSchemeOverrideChance: p.lerp(stylePreference.target.adjacentSchemeOverrideChance, snap.adjacentSchemeOverrideChance, 0.5),
                globalRandomColorChance: p.lerp(stylePreference.target.globalRandomColorChance, snap.globalRandomColorChance, 0.5),
                enableGlobalRandomColorRule: snap.enableGlobalRandomColorRule,
            };
            stylePreference.likeStreak = Math.min(10, (stylePreference.likeStreak || 0) + 1);
        } else {
            stylePreference.target = snap;
            stylePreference.likeStreak = 1;
        }
        stylePreference.mode = 'like';
        applyStyleSnapshot(buildLikedStyleSnapshot(stylePreference.target));
        lastFeedbackAction = 'like-style-now';
    }

    function onDislikeStyleFeedbackImmediate() {
        stylePreference.mode = 'dislike';
        stylePreference.target = captureCurrentStyleSnapshot();
        stylePreference.likeStreak = 0;
        applyStyleSnapshot(buildDislikedStyleSnapshot(stylePreference.target));
        lastFeedbackAction = 'dislike-style-now';
    }

    function getOfflineLikedStyleSnapshot() {
        if (stylePreference && stylePreference.mode === 'like' && stylePreference.target) {
            return {
                referenceRulePrecision: Number(stylePreference.target.referenceRulePrecision) || REFERENCE_RULE_PRECISION,
                colorSchemeOffsetRange: Number(stylePreference.target.colorSchemeOffsetRange) || COLOR_SCHEME_OFFSET_RANGE,
                neighborSimilarRange: Number(stylePreference.target.neighborSimilarRange) || NEIGHBOR_SIMILAR_RANGE,
                referenceMatchRgbRange: Number(stylePreference.target.referenceMatchRgbRange) || REFERENCE_MATCH_RGB_RANGE,
                adjacentSchemeOverrideChance: Number(stylePreference.target.adjacentSchemeOverrideChance) || ADJACENT_SCHEME_OVERRIDE_CHANCE,
                globalRandomColorChance: Number(stylePreference.target.globalRandomColorChance) || GLOBAL_RANDOM_COLOR_CHANCE,
                enableGlobalRandomColorRule: !!stylePreference.target.enableGlobalRandomColorRule,
            };
        }
        if (easyStyleProfile && easyStyleProfile.style) {
            return { ...easyStyleProfile.style };
        }
        return captureCurrentStyleSnapshot();
    }

    function getOfflineLikedColourScheme() {
        if (colourPreference && colourPreference.mode === 'like' && Array.isArray(colourPreference.targetScheme) && colourPreference.targetScheme.length > 0) {
            return colourPreference.targetScheme.map(col => [...col]);
        }
        if (Array.isArray(colorScheme) && colorScheme.length > 0) {
            return colorScheme.map(col => [...col]);
        }
        if (easyStyleProfile && Array.isArray(easyStyleProfile.colorScheme) && easyStyleProfile.colorScheme.length > 0) {
            return easyStyleProfile.colorScheme.map(col => [...col]);
        }
        return [[20, 20, 20], [255, 255, 255]];
    }

    function synthesizeOfflinePaintingHours(hoursAway) {
        let paintingsToCreate = Math.max(0, Math.floor(Number(hoursAway) || 0));
        if (paintingsToCreate <= 0 || !ui.generationStripList) return 0;

        let baseStyle = getOfflineLikedStyleSnapshot();
        let baseScheme = getOfflineLikedColourScheme();

        let styleBackup = captureCurrentStyleSnapshot();
        let schemeBackup = Array.isArray(colorScheme) ? colorScheme.map(col => [...col]) : [];
        let pausedBackup = generationPaused;

        for (let i = 0; i < paintingsToCreate; i++) {
            applyStyleSnapshot(baseStyle);
            colorScheme = baseScheme.map(col => [...col]);
            initColorGrid();

            for (let r = 0; r < GRID_ROWS; r++) {
                for (let c = 0; c < GRID_COLS; c++) {
                    gridColors[r][c] = schemeConstrainedColour(COLOR_SCHEME_OFFSET_RANGE);
                    markGridChanged(r, c);
                }
            }

            generationPaused = true;
            archiveCurrentGeneration('offline-hourly');
            generationSerial += 1;
            archivedGenerationSerial = 0;
        }

        applyStyleSnapshot(styleBackup);
        colorScheme = schemeBackup.length ? schemeBackup.map(col => [...col]) : colorScheme;
        initColorGrid();
        generationPaused = pausedBackup;
        refreshShopUI();
        rebuildGenerationStripFromHistory();
        updateGenerationStripControls();
        saveGenerationHistoryToStorage();

        return paintingsToCreate;
    }

    function getGridSpacePoint(mx, my) {
        return {
            x: (mx - gridView.panX) / gridView.scale,
            y: (my - gridView.panY) / gridView.scale,
        };
    }

    function getCreatureHomePosition() {
        return {
            x: (p.width * CREATURE_HOME_X) + CREATURE_CENTER_OFFSET_X,
            y: (p.height * CREATURE_HOME_Y) + CREATURE_CENTER_OFFSET_Y,
        };
    }

    function isGridPanEvent(event) {
        if (gridView.spaceDown) return true;
        if (!event) return false;
        return event.button === 1 || event.button === 2;
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

    function ensureSchemeLockArraysLength() {
        while (frozenSchemeSlots.length < COLOR_SCHEME_COUNT) frozenSchemeSlots.push(false);
        while (frozenSchemeValues.length < COLOR_SCHEME_COUNT) frozenSchemeValues.push(null);

        if (frozenSchemeSlots.length > COLOR_SCHEME_COUNT) {
            frozenSchemeSlots = frozenSchemeSlots.slice(0, COLOR_SCHEME_COUNT);
        }
        if (frozenSchemeValues.length > COLOR_SCHEME_COUNT) {
            frozenSchemeValues = frozenSchemeValues.slice(0, COLOR_SCHEME_COUNT);
        }
    }

    function applyFrozenSchemeConstraints() {
        ensureSchemeLockArraysLength();
        for (let i = 0; i < COLOR_SCHEME_COUNT; i++) {
            if (!frozenSchemeSlots[i]) continue;

            let locked = frozenSchemeValues[i];
            if (Array.isArray(locked) && locked.length === 3) {
                colorScheme[i] = [...locked];
            } else if (Array.isArray(colorScheme[i]) && colorScheme[i].length === 3) {
                frozenSchemeValues[i] = [...colorScheme[i]];
            }
        }
    }

    function getActiveSchemeColours() {
        ensureSchemeLockArraysLength();
        let active = [];
        for (let i = 0; i < colorScheme.length; i++) {
            if (frozenSchemeSlots[i]) continue;
            if (!Array.isArray(colorScheme[i])) continue;
            active.push(colorScheme[i]);
        }
        if (active.length > 0) return active;
        return colorScheme;
    }

    function blendColor(a, b, t) {
        return [
            clampByte(p.lerp(a[0], b[0], t)),
            clampByte(p.lerp(a[1], b[1], t)),
            clampByte(p.lerp(a[2], b[2], t)),
        ];
    }

    function blendSchemeToward(targetScheme, observedScheme, t) {
        if (!Array.isArray(targetScheme) || !Array.isArray(observedScheme)) return targetScheme;
        let n = Math.min(targetScheme.length, observedScheme.length);
        let out = [];
        for (let i = 0; i < n; i++) {
            let target = targetScheme[i];
            let observed = observedScheme[i];
            if (!Array.isArray(target) || !Array.isArray(observed)) continue;
            out.push(blendColor(target, observed, t));
        }
        return out.length > 0 ? out : targetScheme;
    }

    function chooseArtAccentFromPalette() {
        let active = getActiveSchemeColours();
        if (!Array.isArray(active) || active.length === 0) {
            artAccentColour = [120, 220, 110];
            return;
        }
        let idx = p.floor(p.random(active.length));
        artAccentColour = [...active[idx]];
    }

    function isGreenAccentPixel(r, g, b, a) {
        if (a < 16) return false;
        if (g < 100) return false;
        let greenDominant = g > r + 35 && g > b + 35;
        return greenDominant;
    }

    function recolorGreenPixelsInGraphics(gfx, targetRgb) {
        if (!gfx || !targetRgb) return;
        gfx.loadPixels();
        let data = gfx.pixels;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            let a = data[i + 3];
            if (!isGreenAccentPixel(r, g, b, a)) continue;

            let strength = p.constrain(g / 255, 0.45, 1);
            data[i] = clampByte(targetRgb[0] * strength);
            data[i + 1] = clampByte(targetRgb[1] * strength);
            data[i + 2] = clampByte(targetRgb[2] * strength);
        }
        gfx.updatePixels();
    }

    function getSleepingSequenceConfig(phase) {
        return SLEEPING_SPRITE_SEQUENCES[phase] || null;
    }

    function setSleepingAnimationPhase(phase) {
        let config = getSleepingSequenceConfig(phase);
        if (!config) return;
        if (phase === 'fallingAsleep' && sleepingAnimationPhase === 'idle') {
            sleepingAccentColour = [...artAccentColour];
        }
        sleepingAnimationPhase = phase;
        sleepingFrameIndex = config.startFrame;
        sleepingLastFrameAt = p.millis();
    }

    function advanceSleepingAnimation() {
        if (!sleepingSpriteSheet) return;

        let now = p.millis();
        let config = getSleepingSequenceConfig(sleepingAnimationPhase);
        if (!config) return;

        let frameDuration = 1000 / p.max(1, config.fps);
        if (sleepingLastFrameAt > 0 && now - sleepingLastFrameAt < frameDuration) return;
        sleepingLastFrameAt = now;

        if (sleepingFrameIndex < config.endFrame) {
            sleepingFrameIndex += 1;
            return;
        }

        if (sleepingAnimationPhase === 'fallingAsleep') {
            if (isRestingNow()) {
                setSleepingAnimationPhase('sleepLoop');
            } else {
                setSleepingAnimationPhase('wakingUp');
            }
            return;
        }

        if (sleepingAnimationPhase === 'sleepLoop') {
            if (isRestingNow()) {
                sleepingFrameIndex = config.startFrame;
            } else {
                setSleepingAnimationPhase('wakingUp');
            }
            return;
        }

        if (sleepingAnimationPhase === 'wakingUp') {
            sleepingAnimationPhase = 'idle';
            sleepingAccentColour = null;
        }
    }

    function drawSleepingAnimation(c) {
        if (!sleepingSpriteSheet) return false;

        let config = getSleepingSequenceConfig(sleepingAnimationPhase);
        if (!config) return false;

        let frameW = sleepingSpriteSheet.width / p.max(1, SLEEPING_SPRITE_COLS);
        let frameH = sleepingSpriteSheet.height / p.max(1, SLEEPING_SPRITE_ROWS);
        let frameCol = sleepingFrameIndex % SLEEPING_SPRITE_COLS;
        let frameRow = p.floor(sleepingFrameIndex / SLEEPING_SPRITE_COLS);
        let sx = frameCol * frameW;
        let sy = frameRow * frameH;
        let drawW = CREATURE_SIZE * SLEEPING_SPRITE_DRAW_SCALE;
        let drawH = drawW * (frameH / frameW);

        if (!sleepingFrameBuffer || sleepingFrameBuffer.width !== frameW || sleepingFrameBuffer.height !== frameH) {
            sleepingFrameBuffer = p.createGraphics(frameW, frameH);
            sleepingFrameBuffer.pixelDensity(1);
            sleepingFrameBuffer.noSmooth();
        }

        sleepingFrameBuffer.clear();
        sleepingFrameBuffer.drawingContext.imageSmoothingEnabled = false;
        sleepingFrameBuffer.image(
            sleepingSpriteSheet,
            0,
            0,
            frameW,
            frameH,
            sx,
            sy,
            frameW,
            frameH
        );
        recolorGreenPixelsInGraphics(sleepingFrameBuffer, sleepingAccentColour || artAccentColour);

        p.push();
        p.tint(255, c.bodyAlpha);
        p.drawingContext.imageSmoothingEnabled = false;
        p.imageMode(p.CENTER);
        if (creatureFoodHoverActive) {
            let outlineBuffer = buildSpriteOutlineBuffer(sleepingFrameBuffer, FOOD_HOVER_OUTLINE_COLOUR);
            if (outlineBuffer) {
                p.image(outlineBuffer, 0, 0, drawW, drawH);
            }
        }
        p.image(sleepingFrameBuffer, 0, 0, drawW, drawH);
        p.pop();
        return true;
    }

    function getPaintPaletteChoices() {
        return [
            [...PAINT_BLACK],
            [...PAINT_WHITE],
            ...colorScheme.map(col => [...col]),
        ];
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
        if (ui.referenceSearchButton) ui.referenceSearchButton.disabled = isPending || !hasComputerUpgrade;
        if (ui.referencePromptInput) ui.referencePromptInput.disabled = isPending || !hasComputerUpgrade;
        if (ui.radialPromptSubmit) ui.radialPromptSubmit.disabled = isPending || !hasComputerUpgrade;
        if (ui.radialPromptInput) ui.radialPromptInput.disabled = isPending || !hasComputerUpgrade;
        refreshAreaButtonSprites();
    }

    function getSearchOpenButtonPreviewImage() {
        if (queuedReferenceForNextGeneration && queuedReferenceForNextGeneration.thumbnailUrl) {
            return queuedReferenceForNextGeneration.thumbnailUrl;
        }

        if (activeReferencePreview && activeReferencePreview.imageUrl) {
            let caption = activeReferencePreview.caption || '';
            if (caption.startsWith('Active: prompt reference') || caption.startsWith('Active: expression sprite')) {
                return activeReferencePreview.imageUrl;
            }
        }

        return '';
    }

    function getSearchOpenButtonState() {
        if (!hasComputerUpgrade) return 'locked';
        if (referenceSearchPending) return 'search';
        if (getSearchOpenButtonPreviewImage()) return 'display';
        return 'idle';
    }

    function refreshAreaButtonSprites() {
        if (!ui.searchOpenButton) return;

        let state = getSearchOpenButtonState();
        ui.searchOpenButton.dataset.spriteState = state;

        if (ui.searchOpenSprite) {
            if (state === 'search') {
                ui.searchOpenSprite.src = SEARCH_COMPUTER_SEARCH_SPRITE_PATH;
            } else if (state === 'display') {
                ui.searchOpenSprite.src = SEARCH_COMPUTER_DISPLAY_SPRITE_PATH;
            } else {
                ui.searchOpenSprite.src = SEARCH_COMPUTER_IDLE_SPRITE_PATH;
            }
        }

        if (ui.searchOpenScreenImage) {
            let previewImage = state === 'display' ? getSearchOpenButtonPreviewImage() : '';
            if (previewImage) {
                ui.searchOpenScreenImage.src = previewImage;
                ui.searchOpenScreenImage.hidden = false;
            } else {
                ui.searchOpenScreenImage.removeAttribute('src');
                ui.searchOpenScreenImage.hidden = true;
            }
        }
    }

    function refreshReferencePreviewCard() {
        if (!ui.referencePreviewImage || !ui.referencePreviewCaption) return;

        let previewImage = null;
        let previewCaption = '';

        if (queuedReferenceForNextGeneration && queuedReferenceForNextGeneration.thumbnailUrl) {
            previewImage = queuedReferenceForNextGeneration.thumbnailUrl;
            previewCaption = `Queued for next generation: ${queuedReferenceForNextGeneration.prompt}`;
        } else if (queuedExpressionReferenceForNextGeneration && queuedExpressionReferenceForNextGeneration.spritePath) {
            previewImage = queuedExpressionReferenceForNextGeneration.spritePath;
            previewCaption = `Queued expression for next generation: ${queuedExpressionReferenceForNextGeneration.keyword}`;
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
        refreshAreaButtonSprites();
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
        if (!hasComputerUpgrade) {
            setReferenceSearchStatus('Buy the computer in Shop to unlock search.', true);
            return;
        }

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

    function closeRadialPromptModal() {
        if (!ui.radialPromptModal) return;
        ui.radialPromptModal.classList.remove('active');
        ui.radialPromptModal.setAttribute('aria-hidden', 'true');
        if (ui.radialPromptStatus) ui.radialPromptStatus.textContent = '';
    }

    function toggleRadialPromptModal() {
        if (ui.radialPromptModal && ui.radialPromptModal.classList.contains('active')) {
            closeRadialPromptModal();
            return;
        }
        openRadialPromptModal();
    }

    function openRadialPromptModal() {
        if (!hasComputerUpgrade) {
            if (ui.radialPromptStatus) {
                ui.radialPromptStatus.textContent = 'Buy the computer in Shop to unlock search.';
                ui.radialPromptStatus.classList.add('error');
            }
            return;
        }
        if (!ui.radialPromptModal) return;
        if (ui.radialMenu) ui.radialMenu.classList.remove('radial-active');
        ui.radialPromptModal.classList.add('active');
        ui.radialPromptModal.setAttribute('aria-hidden', 'false');

        if (ui.radialPromptInput) {
            let seed = ui.referencePromptInput ? ui.referencePromptInput.value : '';
            ui.radialPromptInput.value = seed || '';
            window.requestAnimationFrame(() => ui.radialPromptInput.focus());
        }
    }

    function toggleGridView() {
        let opening = !gridView.isVisible;
        gridView.isVisible = opening;
        gridView.openedViaCanvasButton = opening;
        if (opening) {
            let scaleBounds = getGridScaleBoundsFromPanelSize();
            gridView.scale = p.constrain(GRID_DEFAULT_OPEN_SCALE, scaleBounds.min, scaleBounds.max);
            gridView.isZoomedTab = false;
        }
        if (!gridView.isVisible) {
            gridView.isPanning = false;
            gridView.isZoomedTab = false;
        }
    }

    function getActiveGridCellSize() {
        if (gridView.isVisible && gridView.openedViaCanvasButton) {
            return p.max(6, p.floor(GRID_SIZE * GRID_BUTTON_OPEN_SIZE_MULTIPLIER));
        }
        return GRID_SIZE;
    }

    function onRadialPromptInputKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onRadialPromptSubmit();
        }
    }

    async function onRadialPromptSubmit(event) {
        if (event) event.preventDefault();
        if (!ui.radialPromptInput || !ui.referencePromptInput) return;

        let promptText = (ui.radialPromptInput.value || '').trim();
        if (!promptText) {
            if (ui.radialPromptStatus) {
                ui.radialPromptStatus.textContent = 'Enter a prompt first.';
                ui.radialPromptStatus.classList.add('error');
            }
            return;
        }

        ui.referencePromptInput.value = promptText;
        closeRadialPromptModal();
        onReferenceSearchSubmit();
    }

    function getOverlayRootElement() {
        return document.querySelector('.canvas-area') || document.body;
    }

    function ensureNewPlayerMenuUI() {
        if (ui.newPlayerMenuBackdrop) return;

        let root = getOverlayRootElement();
        let backdrop = document.createElement('div');
        backdrop.id = 'ui-new-player-menu-backdrop';
        Object.assign(backdrop.style, {
            position: 'absolute',
            inset: '0',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.45)',
            zIndex: '950',
            pointerEvents: 'auto',
        });

        let panel = document.createElement('div');
        panel.id = 'ui-new-player-menu-panel';
        Object.assign(panel.style, {
            position: 'relative',
            width: `${NEW_PLAYER_MENU_WIDTH}px`,
            maxWidth: `${NEW_PLAYER_MENU_MAX_WIDTH_VW}vw`,
            aspectRatio: String(NEW_PLAYER_MENU_ASPECT),
            backgroundImage: `url(${NEW_PLAYER_MENU_SPRITE_PATH})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.42))',
        });

        let yesButton = document.createElement('button');
        yesButton.type = 'button';
        yesButton.setAttribute('aria-label', 'Yes, first time visitor');
        Object.assign(yesButton.style, {
            position: 'absolute',
            left: `${NEW_PLAYER_MENU_YES_X * 100}%`,
            top: `${NEW_PLAYER_MENU_YES_Y * 100}%`,
            width: `${NEW_PLAYER_MENU_YES_W * 100}%`,
            height: `${NEW_PLAYER_MENU_YES_H * 100}%`,
            transform: 'translate(-50%, -50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            pointerEvents: 'auto',
        });

        let noButton = document.createElement('button');
        noButton.type = 'button';
        noButton.setAttribute('aria-label', 'No, not first time visitor');
        Object.assign(noButton.style, {
            position: 'absolute',
            left: `${NEW_PLAYER_MENU_NO_X * 100}%`,
            top: `${NEW_PLAYER_MENU_NO_Y * 100}%`,
            width: `${NEW_PLAYER_MENU_NO_W * 100}%`,
            height: `${NEW_PLAYER_MENU_NO_H * 100}%`,
            transform: 'translate(-50%, -50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            pointerEvents: 'auto',
        });

        yesButton.addEventListener('click', () => {
            if (typeof pendingNewPlayerMenuChoice === 'function') {
                pendingNewPlayerMenuChoice(true);
            }
            pendingNewPlayerMenuChoice = null;
            closeNewPlayerMenu();
        });

        noButton.addEventListener('click', () => {
            if (typeof pendingNewPlayerMenuChoice === 'function') {
                pendingNewPlayerMenuChoice(false);
            }
            pendingNewPlayerMenuChoice = null;
            closeNewPlayerMenu();
        });

        panel.appendChild(yesButton);
        panel.appendChild(noButton);
        backdrop.appendChild(panel);
        root.appendChild(backdrop);

        ui.newPlayerMenuBackdrop = backdrop;
        ui.newPlayerMenuPanel = panel;
        ui.newPlayerMenuYesButton = yesButton;
        ui.newPlayerMenuNoButton = noButton;
    }

    function openNewPlayerMenu(onChoice) {
        ensureNewPlayerMenuUI();
        pendingNewPlayerMenuChoice = typeof onChoice === 'function' ? onChoice : null;
        if (ui.newPlayerMenuBackdrop) {
            ui.newPlayerMenuBackdrop.style.display = 'flex';
            ui.newPlayerMenuBackdrop.setAttribute('aria-hidden', 'false');
        }
    }

    function closeNewPlayerMenu() {
        if (!ui.newPlayerMenuBackdrop) return;
        ui.newPlayerMenuBackdrop.style.display = 'none';
        ui.newPlayerMenuBackdrop.setAttribute('aria-hidden', 'true');
    }

    function ensureTutorialBookUI() {
        if (ui.tutorialBookRoot) return;

        let root = getOverlayRootElement();
        let bookRoot = document.createElement('div');
        bookRoot.id = 'ui-tutorial-book';
        Object.assign(bookRoot.style, {
            position: 'absolute',
            left: `${tutorialBookState.x}px`,
            top: `${tutorialBookState.y}px`,
            width: `${TUTORIAL_BOOK_WIDTH * TUTORIAL_BOOK_SCALE}px`,
            maxWidth: `${TUTORIAL_BOOK_MAX_WIDTH_VW}vw`,
            display: 'none',
            zIndex: '960',
            userSelect: 'none',
            touchAction: 'none',
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.42))',
        });

        let bookImage = document.createElement('img');
        bookImage.id = 'ui-tutorial-book-image';
        bookImage.alt = 'Tutorial Book';
        bookImage.draggable = false;
        Object.assign(bookImage.style, {
            width: '100%',
            height: 'auto',
            display: 'block',
            imageRendering: 'pixelated',
            pointerEvents: 'none',
        });

        let textBox1 = document.createElement('div');
        let textBox2 = document.createElement('div');
        let dragAreaDebug = document.createElement('div');
        for (let box of [textBox1, textBox2]) {
            Object.assign(box.style, {
                position: 'absolute',
                border: '1px solid rgba(96, 82, 58, 0.35)',
                background: 'rgba(255, 252, 241, 0.28)',
                color: '#2d2418',
                fontFamily: "'Tiny5', monospace",
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
                pointerEvents: 'none',
                boxSizing: 'border-box',
            });
        }

        Object.assign(dragAreaDebug.style, {
            position: 'absolute',
            border: '2px dashed rgba(20, 190, 110, 0.95)',
            background: 'rgba(20, 190, 110, 0.12)',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            display: TUTORIAL_BOOK_SHOW_DRAG_AREA_DEBUG ? 'block' : 'none',
        });

        let prevButton = document.createElement('button');
        prevButton.type = 'button';
        prevButton.textContent = '<';
        Object.assign(prevButton.style, {
            position: 'absolute',
            left: '12px',
            bottom: '10px',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            border: '1px solid rgba(70, 55, 35, 0.35)',
            background: 'rgba(255, 248, 230, 0.82)',
            color: '#3d2d1d',
            fontSize: '24px',
            lineHeight: '1',
            cursor: 'pointer',
            pointerEvents: 'auto',
        });

        let nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.textContent = '>';
        Object.assign(nextButton.style, {
            position: 'absolute',
            width: `${TUTORIAL_BOOK_NAV_BUTTON_SIZE}px`,
            height: `${TUTORIAL_BOOK_NAV_BUTTON_SIZE}px`,
            borderRadius: '10px',
            border: '1px solid rgba(70, 55, 35, 0.35)',
            background: 'rgba(255, 248, 230, 0.82)',
            color: '#3d2d1d',
            fontSize: '24px',
            lineHeight: '1',
            cursor: 'pointer',
            pointerEvents: 'auto',
        });

        let closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.textContent = 'X';
        closeButton.setAttribute('aria-label', 'Close tutorial book');
        Object.assign(closeButton.style, {
            position: 'absolute',
            right: `${TUTORIAL_BOOK_CLOSE_BUTTON_RIGHT}px`,
            top: `${TUTORIAL_BOOK_CLOSE_BUTTON_TOP}px`,
            width: `${TUTORIAL_BOOK_CLOSE_BUTTON_SIZE}px`,
            height: `${TUTORIAL_BOOK_CLOSE_BUTTON_SIZE}px`,
            borderRadius: '9px',
            border: '1px solid rgba(70, 55, 35, 0.45)',
            background: 'rgba(255, 247, 232, 0.9)',
            color: '#3d2d1d',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            pointerEvents: 'auto',
            lineHeight: '1',
        });

        prevButton.addEventListener('click', (event) => {
            event.stopPropagation();
            setTutorialBookPage(tutorialBookState.pageIndex - 1);
        });

        nextButton.addEventListener('click', (event) => {
            event.stopPropagation();
            setTutorialBookPage(tutorialBookState.pageIndex + 1);
        });

        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            closeTutorialBook();
        });

        bookRoot.addEventListener('pointerdown', onTutorialBookPointerDown);
        document.addEventListener('pointermove', onTutorialBookPointerMove);
        document.addEventListener('pointerup', onTutorialBookPointerUp);

        bookRoot.appendChild(bookImage);
        bookRoot.appendChild(textBox1);
        bookRoot.appendChild(textBox2);
        bookRoot.appendChild(dragAreaDebug);
        bookRoot.appendChild(prevButton);
        bookRoot.appendChild(nextButton);
        bookRoot.appendChild(closeButton);
        root.appendChild(bookRoot);

        ui.tutorialBookRoot = bookRoot;
        ui.tutorialBookImage = bookImage;
        ui.tutorialBookTextBox1 = textBox1;
        ui.tutorialBookTextBox2 = textBox2;
        ui.tutorialBookDragAreaDebug = dragAreaDebug;
        ui.tutorialBookPrevButton = prevButton;
        ui.tutorialBookNextButton = nextButton;
        ui.tutorialBookCloseButton = closeButton;
    }

    function getTutorialBookLayoutScale() {
        if (!ui.tutorialBookRoot || !ui.tutorialBookRoot.clientWidth) {
            return Math.max(0.01, Number(TUTORIAL_BOOK_SCALE) || 1);
        }
        return ui.tutorialBookRoot.clientWidth / TUTORIAL_BOOK_WIDTH;
    }

    function getTutorialBookDragAreaForPage(pageIndex) {
        let scale = getTutorialBookLayoutScale();
        if (pageIndex <= 0) {
            return {
                x: TUTORIAL_BOOK_COVER_DRAG_OFFSET_X * scale,
                y: TUTORIAL_BOOK_COVER_DRAG_OFFSET_Y * scale,
                w: TUTORIAL_BOOK_COVER_DRAG_W * scale,
                h: TUTORIAL_BOOK_COVER_DRAG_H * scale,
            };
        }
        return {
            x: TUTORIAL_BOOK_PAGE_DRAG_OFFSET_X * scale,
            y: TUTORIAL_BOOK_PAGE_DRAG_OFFSET_Y * scale,
            w: TUTORIAL_BOOK_PAGE_DRAG_W * scale,
            h: TUTORIAL_BOOK_PAGE_DRAG_H * scale,
        };
    }

    function isPointInTutorialDragArea(localX, localY) {
        let dragArea = getTutorialBookDragAreaForPage(tutorialBookState.pageIndex);
        return localX >= dragArea.x &&
            localY >= dragArea.y &&
            localX <= dragArea.x + dragArea.w &&
            localY <= dragArea.y + dragArea.h;
    }

    function onTutorialBookPointerDown(event) {
        if (!tutorialBookState.isOpen || !ui.tutorialBookRoot) return;
        if (event.target === ui.tutorialBookPrevButton ||
            event.target === ui.tutorialBookNextButton ||
            event.target === ui.tutorialBookCloseButton) {
            return;
        }

        let rect = ui.tutorialBookRoot.getBoundingClientRect();
        let localX = event.clientX - rect.left;
        let localY = event.clientY - rect.top;

        if (!isPointInTutorialDragArea(localX, localY)) return;

        tutorialBookState.isDragging = true;
        tutorialBookState.dragOffsetX = event.clientX - rect.left;
        tutorialBookState.dragOffsetY = event.clientY - rect.top;
        ui.tutorialBookRoot.style.cursor = 'grabbing';
        event.preventDefault();
    }

    function onTutorialBookPointerMove(event) {
        if (!tutorialBookState.isOpen || !tutorialBookState.isDragging || !ui.tutorialBookRoot) return;
        let parent = ui.tutorialBookRoot.offsetParent || getOverlayRootElement();
        let parentRect = parent.getBoundingClientRect();
        tutorialBookState.x = event.clientX - parentRect.left - tutorialBookState.dragOffsetX;
        tutorialBookState.y = event.clientY - parentRect.top - tutorialBookState.dragOffsetY;
        ui.tutorialBookRoot.style.left = `${tutorialBookState.x}px`;
        ui.tutorialBookRoot.style.top = `${tutorialBookState.y}px`;
    }

    function onTutorialBookPointerUp() {
        if (!tutorialBookState.isDragging) return;
        tutorialBookState.isDragging = false;
        if (ui.tutorialBookRoot) {
            ui.tutorialBookRoot.style.cursor = 'grab';
        }
    }

    function setTutorialBookPage(nextPageIndex) {
        let maxPage = TUTORIAL_BOOK_PAGES.length - 1;
        tutorialBookState.pageIndex = p.constrain(nextPageIndex, 0, maxPage);
        refreshTutorialBookUI();
    }

    function getTutorialTextBoxStyle(pageData, side) {
        let isLeft = side === 'left';
        let baseStyle = isLeft
            ? { y: TUTORIAL_BOOK_TEXTBOX_1_Y, height: TUTORIAL_BOOK_TEXTBOX_1_H, fontSize: TUTORIAL_BOOK_TEXTBOX_1_FONT_SIZE }
            : { y: TUTORIAL_BOOK_TEXTBOX_2_Y, height: TUTORIAL_BOOK_TEXTBOX_2_H, fontSize: TUTORIAL_BOOK_TEXTBOX_2_FONT_SIZE };

        let key = isLeft ? 'leftBox' : 'rightBox';
        let customStyle = pageData && typeof pageData[key] === 'object' && pageData[key] ? pageData[key] : {};

        let y = Number.isFinite(customStyle.y) ? customStyle.y : baseStyle.y;
        let height = Number.isFinite(customStyle.height) ? customStyle.height : baseStyle.height;
        let fontSize = Number.isFinite(customStyle.fontSize) ? customStyle.fontSize : baseStyle.fontSize;

        return { y, height, fontSize };
    }

    function refreshTutorialBookUI() {
        if (!ui.tutorialBookRoot || !ui.tutorialBookImage) return;
        let pageIndex = tutorialBookState.pageIndex;
        let pageData = TUTORIAL_BOOK_PAGES[pageIndex] || TUTORIAL_BOOK_PAGES[0];
        let spritePath = pageData ? pageData.sprite : '';

        ui.tutorialBookImage.src = spritePath;
        ui.tutorialBookRoot.style.width = `${TUTORIAL_BOOK_WIDTH * TUTORIAL_BOOK_SCALE}px`;
        ui.tutorialBookRoot.style.left = `${tutorialBookState.x}px`;
        ui.tutorialBookRoot.style.top = `${tutorialBookState.y}px`;
        ui.tutorialBookRoot.style.cursor = 'grab';

        let scale = getTutorialBookLayoutScale();

        let box1 = ui.tutorialBookTextBox1;
        let box2 = ui.tutorialBookTextBox2;
        let isNumberedPage = pageIndex > 0;

        if (box1 && box2) {
            let box1PageStyle = getTutorialTextBoxStyle(pageData, 'left');
            let box2PageStyle = getTutorialTextBoxStyle(pageData, 'right');

            box1.style.left = `${TUTORIAL_BOOK_TEXTBOX_1_X * scale}px`;
            box1.style.top = `${box1PageStyle.y * scale}px`;
            box1.style.width = `${TUTORIAL_BOOK_TEXTBOX_1_W * scale}px`;
            box1.style.height = `${box1PageStyle.height * scale}px`;

            box2.style.left = `${TUTORIAL_BOOK_TEXTBOX_2_X * scale}px`;
            box2.style.top = `${box2PageStyle.y * scale}px`;
            box2.style.width = `${TUTORIAL_BOOK_TEXTBOX_2_W * scale}px`;
            box2.style.height = `${box2PageStyle.height * scale}px`;

            box1.style.padding = `${TUTORIAL_BOOK_TEXT_OFFSET_Y * scale}px ${TUTORIAL_BOOK_TEXT_OFFSET_X * scale}px`;
            box2.style.padding = `${TUTORIAL_BOOK_TEXT_OFFSET_Y * scale}px ${TUTORIAL_BOOK_TEXT_OFFSET_X * scale}px`;
            box1.style.fontSize = `${box1PageStyle.fontSize * scale}px`;
            box2.style.fontSize = `${box2PageStyle.fontSize * scale}px`;
            box1.style.lineHeight = String(TUTORIAL_BOOK_TEXT_LINE_HEIGHT);
            box2.style.lineHeight = String(TUTORIAL_BOOK_TEXT_LINE_HEIGHT);

            if (isNumberedPage) {
                box1.textContent = pageData && typeof pageData.leftText === 'string' ? pageData.leftText : '';
                box2.textContent = pageData && typeof pageData.rightText === 'string' ? pageData.rightText : '';
                box1.style.display = 'block';
                box2.style.display = 'block';
            } else {
                box1.style.display = 'none';
                box2.style.display = 'none';
                box1.textContent = '';
                box2.textContent = '';
            }
        }

        if (ui.tutorialBookPrevButton) {
            ui.tutorialBookPrevButton.disabled = pageIndex <= 0;
            ui.tutorialBookPrevButton.style.opacity = pageIndex <= 0 ? '0.45' : '1';
            ui.tutorialBookPrevButton.style.cursor = pageIndex <= 0 ? 'not-allowed' : 'pointer';
        }
        if (ui.tutorialBookNextButton) {
            let atEnd = pageIndex >= TUTORIAL_BOOK_PAGES.length - 1;
            ui.tutorialBookNextButton.disabled = atEnd;
            ui.tutorialBookNextButton.style.opacity = atEnd ? '0.45' : '1';
            ui.tutorialBookNextButton.style.cursor = atEnd ? 'not-allowed' : 'pointer';
        }

        let buttonScale = scale;
        let isCoverPage = pageIndex <= 0;
        let prevX = isCoverPage ? TUTORIAL_BOOK_COVER_PREV_BUTTON_X : TUTORIAL_BOOK_NUMBERED_PREV_BUTTON_X;
        let nextX = isCoverPage ? TUTORIAL_BOOK_COVER_NEXT_BUTTON_X : TUTORIAL_BOOK_NUMBERED_NEXT_BUTTON_X;
        let buttonsY = isCoverPage ? TUTORIAL_BOOK_COVER_BUTTON_Y : TUTORIAL_BOOK_NUMBERED_BUTTON_Y;

        if (ui.tutorialBookPrevButton) {
            ui.tutorialBookPrevButton.style.left = `${prevX * buttonScale}px`;
            ui.tutorialBookPrevButton.style.top = `${buttonsY * buttonScale}px`;
            ui.tutorialBookPrevButton.style.width = `${TUTORIAL_BOOK_NAV_BUTTON_SIZE * buttonScale}px`;
            ui.tutorialBookPrevButton.style.height = `${TUTORIAL_BOOK_NAV_BUTTON_SIZE * buttonScale}px`;
            ui.tutorialBookPrevButton.style.fontSize = `${24 * buttonScale}px`;
        }
        if (ui.tutorialBookNextButton) {
            ui.tutorialBookNextButton.style.left = `${nextX * buttonScale}px`;
            ui.tutorialBookNextButton.style.top = `${buttonsY * buttonScale}px`;
            ui.tutorialBookNextButton.style.width = `${TUTORIAL_BOOK_NAV_BUTTON_SIZE * buttonScale}px`;
            ui.tutorialBookNextButton.style.height = `${TUTORIAL_BOOK_NAV_BUTTON_SIZE * buttonScale}px`;
            ui.tutorialBookNextButton.style.fontSize = `${24 * buttonScale}px`;
        }

        if (ui.tutorialBookCloseButton) {
            ui.tutorialBookCloseButton.style.right = `${TUTORIAL_BOOK_CLOSE_BUTTON_RIGHT * buttonScale}px`;
            ui.tutorialBookCloseButton.style.top = `${TUTORIAL_BOOK_CLOSE_BUTTON_TOP * buttonScale}px`;
            ui.tutorialBookCloseButton.style.width = `${TUTORIAL_BOOK_CLOSE_BUTTON_SIZE * buttonScale}px`;
            ui.tutorialBookCloseButton.style.height = `${TUTORIAL_BOOK_CLOSE_BUTTON_SIZE * buttonScale}px`;
            ui.tutorialBookCloseButton.style.fontSize = `${18 * buttonScale}px`;
        }

        if (ui.tutorialBookDragAreaDebug) {
            let dragArea = getTutorialBookDragAreaForPage(pageIndex);
            ui.tutorialBookDragAreaDebug.style.display = TUTORIAL_BOOK_SHOW_DRAG_AREA_DEBUG ? 'block' : 'none';
            ui.tutorialBookDragAreaDebug.style.left = `${dragArea.x}px`;
            ui.tutorialBookDragAreaDebug.style.top = `${dragArea.y}px`;
            ui.tutorialBookDragAreaDebug.style.width = `${dragArea.w}px`;
            ui.tutorialBookDragAreaDebug.style.height = `${dragArea.h}px`;
        }
    }

    function openTutorialBook() {
        ensureTutorialBookUI();
        tutorialBookState.isOpen = true;
        if (ui.tutorialBookRoot) {
            ui.tutorialBookRoot.style.display = 'block';
            ui.tutorialBookRoot.setAttribute('aria-hidden', 'false');
        }
        refreshTutorialBookUI();
    }

    function closeTutorialBook() {
        tutorialBookState.isOpen = false;
        tutorialBookState.isDragging = false;
        if (ui.tutorialBookRoot) {
            ui.tutorialBookRoot.style.display = 'none';
            ui.tutorialBookRoot.setAttribute('aria-hidden', 'true');
        }
    }

    p.setup = function() {
        let sz  = canvasSize();
        let cnv = p.createCanvas(sz.w, sz.h);
        cnv.parent('canvas-container');
        cnv.mousePressed(onCanvasPointerDown);
        cnv.elt.addEventListener('contextmenu', event => event.preventDefault());
        p.noSmooth();
        cnv.elt.style.imageRendering = 'pixelated';
        applyAreaButtonLayoutVariables();

        let home = getCreatureHomePosition();
        creature = createCreature(home.x, home.y);
        loadState(creature);
        applyActiveGalleryWallTheme();
        applyActiveStudioWallTheme();
        p.loadImage(
            PAINTING_SPRITE_SHEET_PATH,
            (img) => { paintingSpriteSheet = img; },
            (err) => { console.warn('Painting animation sprite failed to load:', err); }
        );
        p.loadImage(
            SLEEPING_SPRITE_SHEET_PATH,
            (img) => { sleepingSpriteSheet = img; },
            (err) => { console.warn('Sleeping animation sprite failed to load:', err); }
        );
        p.loadImage(
            PAINTBRUSH_BUTTON_SPRITE_PATH,
            (img) => { paintbrushButtonSprite = img; },
            () => {}
        );
        p.loadImage(
            EXIT_BUTTON_SPRITE_PATH,
            (img) => { exitButtonSprite = img; },
            () => {}
        );
        initColorGrid();
        generateColorScheme();
        let easyStyleWasCreated = ensureEasyStyleProfile();
        if (easyStyleWasCreated) {
            applyStyleSnapshot(easyStyleProfile.style);
            colorScheme = easyStyleProfile.colorScheme.map(col => [...col]);
        }
        chooseArtAccentFromPalette();
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
        ui.generationSelectSellToggle = document.getElementById('generation-select-sell-toggle');
        ui.generationSellSelectedButton = document.getElementById('generation-sell-selected-btn');
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
        ui.radialMenu = document.getElementById('ui-radial-menu');
        ui.radialPromptModal = document.getElementById('ui-radial-prompt-modal');
        ui.radialPromptForm = document.getElementById('ui-radial-prompt-form');
        ui.radialPromptInput = document.getElementById('ui-radial-prompt-input');
        ui.radialPromptSubmit = document.getElementById('ui-radial-prompt-submit');
        ui.radialPromptCancel = document.getElementById('ui-radial-prompt-cancel');
        ui.radialPromptStatus = document.getElementById('ui-radial-prompt-status');
        ui.shopOpenButton = document.getElementById('ui-shop-open-btn');
        ui.searchOpenButton = document.getElementById('ui-search-open-btn');
        ui.searchOpenSprite = document.getElementById('ui-search-open-sprite');
        ui.searchOpenScreenImage = document.getElementById('ui-search-open-screen-image');
        ui.galleryOpenButton = document.getElementById('ui-gallery-open-btn');
        ui.reopenGridButton = document.getElementById('ui-reopen-grid-btn');
        ui.reopenGridSprite = document.getElementById('ui-reopen-grid-sprite');
        if (ui.searchOpenSprite) ui.searchOpenSprite.src = SEARCH_COMPUTER_IDLE_SPRITE_PATH;
        if (ui.reopenGridSprite) ui.reopenGridSprite.src = CANVAS_SPRITE_PATH;
        ui.shopModal = document.getElementById('ui-shop-modal');
        ui.shopCloseButton = document.getElementById('ui-shop-close-btn');
        ui.shopBuyFoodAppleButton = document.getElementById('ui-shop-buy-food-apple');
        ui.shopBuyFoodBurgerButton = document.getElementById('ui-shop-buy-food-burger');
        ui.shopBuyFoodSandwichButton = document.getElementById('ui-shop-buy-food-sandwich');
        ui.shopBuyFoodEnergyDrinkButton = document.getElementById('ui-shop-buy-food-energy-drink');
        ui.shopBuyCanvasLongButton = document.getElementById('ui-shop-buy-canvas-long');
        ui.shopBuyCanvasWideButton = document.getElementById('ui-shop-buy-canvas-wide');
        ui.shopBuyCanvasBigButton = document.getElementById('ui-shop-buy-canvas-big');
        ui.shopBuyCanvasCustomButton = document.getElementById('ui-shop-buy-canvas-custom');
        ui.shopCustomColsInput = document.getElementById('ui-shop-custom-cols');
        ui.shopCustomRowsInput = document.getElementById('ui-shop-custom-rows');
        ui.shopBuyPaletteButton = document.getElementById('ui-shop-buy-palette');
        ui.shopBuyComputerButton = document.getElementById('ui-shop-buy-computer');
        ui.shopBuyProgressResetButton = document.getElementById('ui-shop-buy-progress-reset');
        ui.shopMusicClassicalButton = document.getElementById('ui-shop-music-classical');
        ui.shopStudioWallCloudButton = document.getElementById('ui-shop-studio-wall-cloud');
        ui.shopStudioWallRoseButton = document.getElementById('ui-shop-studio-wall-rose');
        ui.shopStudioWallInkButton = document.getElementById('ui-shop-studio-wall-ink');
        ui.shopStudioWallMossButton = document.getElementById('ui-shop-studio-wall-moss');
        ui.shopStudioDecorFavoriteButton = document.getElementById('ui-shop-studio-decor-fav');
        ui.shopStudioDecorPlantVaseButton = document.getElementById('ui-shop-studio-decor-plant-vase');
        ui.shopStudioDecorGoldenStatueButton = document.getElementById('ui-shop-studio-decor-golden-statue');
        ui.shopStudioDecorPetMushButton = document.getElementById('ui-shop-studio-decor-pet-mush');
        ui.shopStudioDecorLampButton = document.getElementById('ui-shop-studio-decor-lamp');
        ui.shopStudioDecorExpensivePaintingButton = document.getElementById('ui-shop-studio-decor-expensive-painting');

        ui.shopWallSageButton = document.getElementById('ui-shop-wall-sage');
        ui.shopWallLinenButton = document.getElementById('ui-shop-wall-linen');
        ui.shopWallClayButton = document.getElementById('ui-shop-wall-clay');
        ui.shopWallSlateButton = document.getElementById('ui-shop-wall-slate');
        ui.shopComputerNote = document.getElementById('ui-shop-computer-note');
        ui.shopStatus = document.getElementById('ui-shop-status');
        ui.coins = document.getElementById('ui-coins');
        ui.sceneCash = document.getElementById('ui-scene-cash');

        if (ui.generationPopupInStyle) {
            ui.generationPopupInStyle.addEventListener('click', onInThisStyleClicked);
        }
        if (ui.generationPopupWithColours) {
            ui.generationPopupWithColours.addEventListener('click', onWithTheseColoursClicked);
        }
        if (ui.generationPopupSellButton) {
            ui.generationPopupSellButton.addEventListener('click', onSellGenerationClicked);
        }
        if (ui.generationSelectSellToggle) {
            ui.generationSelectSellToggle.addEventListener('click', toggleSelectSellMode);
        }
        if (ui.generationSellSelectedButton) {
            ui.generationSellSelectedButton.addEventListener('click', onSellSelectedGenerationsClicked);
        }
        if (ui.generationStripList) {
            ui.generationStripList.addEventListener('scroll', closeGenerationPopup);
        }
        if (ui.referenceSearchForm) {
            ui.referenceSearchForm.addEventListener('submit', onReferenceSearchSubmit);
        }
        if (ui.radialPromptForm) {
            ui.radialPromptForm.addEventListener('submit', onRadialPromptSubmit);
        }
        if (ui.radialPromptInput) {
            ui.radialPromptInput.addEventListener('keydown', onRadialPromptInputKeyDown);
        }
        if (ui.radialPromptCancel) {
            ui.radialPromptCancel.addEventListener('click', closeRadialPromptModal);
        }
        if (ui.radialPromptModal) {
            ui.radialPromptModal.addEventListener('click', (event) => {
                if (event.target === ui.radialPromptModal) closeRadialPromptModal();
            });
        }
        if (ui.shopOpenButton) {
            ui.shopOpenButton.addEventListener('click', openShopModal);
        }
        if (ui.searchOpenButton) {
            ui.searchOpenButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleRadialPromptModal();
            });
        }
        if (ui.galleryOpenButton) {
            ui.galleryOpenButton.addEventListener('click', () => {
                window.location.href = 'UsersGallery.html';
            });
        }
        if (ui.reopenGridButton) {
            ui.reopenGridButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleGridView();
            });
        }
        if (ui.shopCloseButton) {
            ui.shopCloseButton.addEventListener('click', closeShopModal);
        }
        if (ui.shopBuyFoodAppleButton) {
            ui.shopBuyFoodAppleButton.addEventListener('click', () => buyFoodItem('apple'));
        }
        if (ui.shopBuyFoodBurgerButton) {
            ui.shopBuyFoodBurgerButton.addEventListener('click', () => buyFoodItem('burger'));
        }
        if (ui.shopBuyFoodSandwichButton) {
            ui.shopBuyFoodSandwichButton.addEventListener('click', () => buyFoodItem('sandwich'));
        }
        if (ui.shopBuyFoodEnergyDrinkButton) {
            ui.shopBuyFoodEnergyDrinkButton.addEventListener('click', () => buyFoodItem('energy-drink'));
        }
        if (ui.shopBuyCanvasLongButton) {
            ui.shopBuyCanvasLongButton.addEventListener('click', () => buyCanvasPreset('long', 52, 24, SHOP_CANVAS_LONG_PRICE));
        }
        if (ui.shopBuyCanvasWideButton) {
            ui.shopBuyCanvasWideButton.addEventListener('click', () => buyCanvasPreset('wide', 24, 52, SHOP_CANVAS_WIDE_PRICE));
        }
        if (ui.shopBuyCanvasBigButton) {
            ui.shopBuyCanvasBigButton.addEventListener('click', () => buyCanvasPreset('big', 44, 44, SHOP_CANVAS_BIG_PRICE));
        }
        if (ui.shopBuyCanvasCustomButton) {
            ui.shopBuyCanvasCustomButton.addEventListener('click', buyCustomCanvasSize);
        }
        if (ui.shopCustomColsInput) {
            ui.shopCustomColsInput.addEventListener('input', refreshShopUI);
        }
        if (ui.shopCustomRowsInput) {
            ui.shopCustomRowsInput.addEventListener('input', refreshShopUI);
        }
        if (ui.shopBuyPaletteButton) {
            ui.shopBuyPaletteButton.addEventListener('click', buyPaletteUpgrade);
        }
        if (ui.shopBuyComputerButton) {
            ui.shopBuyComputerButton.addEventListener('click', buyComputerUpgrade);
        }
        if (ui.shopBuyProgressResetButton) {
            ui.shopBuyProgressResetButton.addEventListener('click', buyProgressReset);
        }
        if (ui.shopMusicClassicalButton) {
            ui.shopMusicClassicalButton.addEventListener('click', () => buyOrPlayShopMusic('classical-background'));
        }
        if (ui.shopStudioWallCloudButton) {
            ui.shopStudioWallCloudButton.addEventListener('click', () => buyOrSelectStudioWall('cloud'));
        }
        if (ui.shopStudioWallRoseButton) {
            ui.shopStudioWallRoseButton.addEventListener('click', () => buyOrSelectStudioWall('rose'));
        }
        if (ui.shopStudioWallInkButton) {
            ui.shopStudioWallInkButton.addEventListener('click', () => buyOrSelectStudioWall('ink'));
        }
        if (ui.shopStudioWallMossButton) {
            ui.shopStudioWallMossButton.addEventListener('click', () => buyOrSelectStudioWall('moss'));
        }
        if (ui.shopStudioDecorFavoriteButton) {
            ui.shopStudioDecorFavoriteButton.addEventListener('click', () => buyOrSelectStudioDecor('frame-favorite'));
        }
        if (ui.shopStudioDecorPlantVaseButton) {
            ui.shopStudioDecorPlantVaseButton.addEventListener('click', () => buyOrSelectStudioDecor('plant-vase'));
        }
        if (ui.shopStudioDecorGoldenStatueButton) {
            ui.shopStudioDecorGoldenStatueButton.addEventListener('click', () => buyOrSelectStudioDecor('golden-statue'));
        }
        if (ui.shopStudioDecorPetMushButton) {
            ui.shopStudioDecorPetMushButton.addEventListener('click', () => buyOrSelectStudioDecor('pet-mush'));
        }
        if (ui.shopStudioDecorLampButton) {
            ui.shopStudioDecorLampButton.addEventListener('click', () => buyOrSelectStudioDecor('lamp'));
        }
        if (ui.shopStudioDecorExpensivePaintingButton) {
            ui.shopStudioDecorExpensivePaintingButton.addEventListener('click', () => buyOrSelectStudioDecor('expensive_painting'));
        }

        if (ui.shopWallSageButton) {
            ui.shopWallSageButton.addEventListener('click', () => buyOrSelectGalleryWall('sage'));
        }
        if (ui.shopWallLinenButton) {
            ui.shopWallLinenButton.addEventListener('click', () => buyOrSelectGalleryWall('linen'));
        }
        if (ui.shopWallClayButton) {
            ui.shopWallClayButton.addEventListener('click', () => buyOrSelectGalleryWall('clay'));
        }
        if (ui.shopWallSlateButton) {
            ui.shopWallSlateButton.addEventListener('click', () => buyOrSelectGalleryWall('slate'));
        }
        if (ui.shopModal) {
            ui.shopModal.addEventListener('click', (event) => {
                if (event.target === ui.shopModal) closeShopModal();
            });
        }

        // Remove sidebar from the scene; controls are in-scene/radial now.
        let sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.remove();

        document.addEventListener('click', onDocumentClickForPopup);
        document.addEventListener('keydown', (event) => {
            let target = event.target;
            let isTextInputTarget = target && (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            );
            if (event.code === 'Space') {
                if (!isTextInputTarget) {
                    gridView.spaceDown = true;
                    event.preventDefault();
                }
            }
            if (event.key === 'Escape') {
                closeRadialPromptModal();
                closeShopModal();
                closeTutorialBook();
                closeNewPlayerMenu();
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Space') gridView.spaceDown = false;
        });
        updateGenerationStripLayout();
        updateGenerationStripControls();
        refreshReferencePreviewCard();
        refreshShopUI();
        updateSearchFeatureGateUI();
        setReferenceSearchPendingState(false);
        ensureNewPlayerMenuUI();
        ensureTutorialBookUI();

        let finishStartupAfterFirstTimeChoice = (shouldFreshStartReset) => {
            if (shouldFreshStartReset) {
                clearSavedProgressStorage();
                applyFullProgressResetState({
                    shouldPlayPurchaseSound: false,
                    initialCoins: 5000,
                    statusMessage: 'Fresh start ready. Progress and paintings were reset.',
                });
            }

            loadGridDimensions();
            if (!shouldFreshStartReset) {
                loadGenerationHistoryFromStorage();
            }
            if (!shouldFreshStartReset && creature && creature.lastVisit) {
                let hoursAway = Math.min((Date.now() - creature.lastVisit) / 3600000, AFK_MAX_HOURS);
                synthesizeOfflinePaintingHours(hoursAway);
            }

            // Temporary: always open tutorial book on tab load.
            openTutorialBook();
        };

        if (shouldAskForFirstTimeVisitorReset()) {
            openNewPlayerMenu((isFirstTime) => {
                rememberFirstTimeVisitorPromptAnswer(isFirstTime);
                finishStartupAfterFirstTimeChoice(!!isFirstTime);
            });
        } else {
            finishStartupAfterFirstTimeChoice(false);
        }

        scheduleNextCreatureQuestion();
        ensureFoodSprites();
        ensureStudioDecorSprites();



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
        applyActiveGalleryWallTheme();
        applyActiveStudioWallTheme();
        p.background(...bgColour);

        updateMic(creature);
        drawStudioEnvironment(creature);
        updateCreature(creature);
        maybeStartCreatureQuestion(creature);
        updateFoodDragHoverState();
        drawCreature(creature);
        drawCreatureQuestionIndicator(creature);
        drawFoodItems();
        drawWorldAreaButtons(creature);
        drawLongRestMeter(creature);
        randomizeGridSquareOverTime();
        drawColorGrid();
        drawSaleAnnouncementOverlay();
        updateNpcActionButtonsPosition(creature);

        if (ui.radialMenu && ui.radialMenu.classList.contains('radial-active')) {
            updateRadialMenuPosition(creature);
        }

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

    function drawSingleSaleAnnouncementOverlay(now) {
        if (!saleAnnouncement) return;

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

    function drawBulkSaleCreditsOverlay(now) {
        if (!bulkSaleCredits) return;

        let baseX = p.width * 0.5;
        let baseY = p.height * 0.46;
        let scrollAmount = p.constrain(p.height * 0.28, 120, 220);
        let anyVisible = false;

        for (let i = 0; i < bulkSaleCredits.entries.length; i++) {
            let entry = bulkSaleCredits.entries[i];
            let elapsed = now - entry.startAt;
            if (elapsed < 0 || elapsed > BULK_SALE_ENTRY_LIFETIME_MS) continue;

            if (!entry.soundPlayed) {
                playRegisterSound();
                entry.soundPlayed = true;
            }

            anyVisible = true;
            let progress = p.constrain(elapsed / BULK_SALE_ENTRY_LIFETIME_MS, 0, 1);
            let fadeIn = p.constrain(elapsed / 240, 0, 1);
            let fadeOut = p.constrain((BULK_SALE_ENTRY_LIFETIME_MS - elapsed) / 620, 0, 1);
            let alpha01 = Math.min(fadeIn, fadeOut);
            let alpha = Math.round(255 * alpha01);
            let scale = p.lerp(1, 0.66, progress);
            // Spawn every sold line from the same anchor position, then scroll upward.
            let y = baseY - progress * scrollAmount;

            p.push();
            p.translate(baseX, y);
            p.scale(scale);
            p.textAlign(p.CENTER, p.CENTER);
            p.noStroke();
            p.textSize(p.constrain(p.width * 0.028, 16, 30));
            p.fill(10, 10, 10, alpha);
            p.text(`SOLD ${entry.amount} coins`, 1.5, 1.5);
            p.fill(255, 244, 168, alpha);
            p.text(`SOLD ${entry.amount} coins`, 0, 0);
            p.textSize(p.constrain(p.width * 0.018, 11, 18));
            p.fill(10, 10, 10, alpha);
            p.text(`Buyer: ${entry.buyer}`, 1.5, 18);
            p.fill(230, 255, 255, alpha);
            p.text(`Buyer: ${entry.buyer}`, 0, 16.5);
            p.pop();
        }

        if (now >= bulkSaleCredits.totalStartAt) {
            let elapsed = now - bulkSaleCredits.totalStartAt;
            let fadeIn = p.constrain(elapsed / 300, 0, 1);
            let fadeOut = p.constrain((bulkSaleCredits.endAt - now) / 520, 0, 1);
            let alpha01 = Math.min(fadeIn, fadeOut);
            let alpha = Math.round(255 * alpha01);

            if (alpha > 0) {
                anyVisible = true;
                let totalSize = p.constrain(p.width * 0.06, 30, 62);
                let totalY = p.height * 0.66;

                p.push();
                p.textAlign(p.CENTER, p.CENTER);
                p.noStroke();
                p.textSize(totalSize);
                p.fill(20, 20, 20, alpha);
                p.text(`Total Earnings : ${bulkSaleCredits.total} coins`, baseX + 2, totalY + 2);
                p.fill(255, 240, 145, alpha);
                p.text(`Total Earnings : ${bulkSaleCredits.total} coins`, baseX, totalY);
                p.pop();
            }
        }

        if (!anyVisible && now > bulkSaleCredits.endAt) {
            bulkSaleCredits = null;
        }
    }

    function drawSaleAnnouncementOverlay() {
        let now = p.millis();
        drawSingleSaleAnnouncementOverlay(now);
        drawBulkSaleCreditsOverlay(now);
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

    function startBulkSaleCredits(appraisals, totalEarnings) {
        let now = p.millis();
        let entries = appraisals.map((item, index) => ({
            buyer: item.buyerName || 'Unknown buyer',
            amount: Math.max(0, Math.round(item.payout || 0)),
            startAt: now + index * BULK_SALE_ENTRY_INTERVAL_MS,
            soundPlayed: false,
        }));

        let totalStartAt = now + appraisals.length * BULK_SALE_ENTRY_INTERVAL_MS + BULK_SALE_TOTAL_DELAY_MS;
        bulkSaleCredits = {
            entries,
            total: Math.max(0, Math.round(totalEarnings || 0)),
            totalStartAt,
            endAt: totalStartAt + BULK_SALE_TOTAL_DURATION_MS,
        };
    }


    // ============================================================
    //  CREATURE LOGIC
    // ============================================================

    function updateCreature(c) {
        let longRestActive = isLongRestActive();
        let shortRestActive = isShortRestActive();
        if (wasLongRestActive && !longRestActive) {
            showWakeUpDialogue('long');
            saveState(creature);
        }
        if (wasShortRestActive && !shortRestActive && !longRestActive) {
            showWakeUpDialogue('short');
            saveState(creature);
        }
        wasLongRestActive = longRestActive;
        wasShortRestActive = shortRestActive;

        shortRestActive = shortRestActive && !longRestActive;
        let restingActive = shortRestActive || longRestActive;

        if (c.sleepTimer === 0 && c.energy < 1 && restingActive) {
            c.sleepTimer = SLEEPING_FRAMES;
            c.exciteTimer = 0;
        }

        if (c.sleepTimer > 0) {
            c.sleepTimer--;
        }

        // Need (hunger meter) now decays at one consistent rate over time.
        let hungerRate = DECAY_RATE;
        let isGenerating = !generationPaused && !isRestingNow();
        let tiredRate = 0;

        if (restingActive) {
            tiredRate = longRestActive
                ? -(LONG_REST_ENERGY_RECOVERY * ENERGY_INCREASE_SPEED)
                : -(SHORT_REST_ENERGY_RECOVERY * ENERGY_INCREASE_SPEED);
        } else if (isGenerating) {
            tiredRate = (GENERATING_ENERGY_DRAIN + (c.exciteTimer > 0 ? 0.01 : 0)) * ENERGY_DECREASE_SPEED;
            tiredRate *= getStackedEnergyDrainMultiplier(c);
        }

        c.need = p.constrain(c.need - hungerRate, 0, 100);
        c.energy = p.constrain(c.energy - tiredRate, 0, 100);

        if (energyDrinkGridBoostActive && c.energy <= ENERGY_DRINK_BOOST_TARGET_ENERGY) {
                energyDrinkGridBoostActive = false;
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
            let animationSpeed = getStackedAnimationSpeedMultiplier(c);
            c.breathe += 0.018 * animationSpeed;
            c.bob     += 0.012 * animationSpeed;
        }

        // Keep character anchored; excited state now affects style only, not roaming.
        if (c.exciteTimer > 0) c.exciteTimer--;
        c.wanderTargetX = 0;
        c.wanderTargetY = 0;

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

        if (restWakeShakeFrames > 0) {
            p.translate(
                p.random(-REST_WAKE_SHAKE_AMPLITUDE, REST_WAKE_SHAKE_AMPLITUDE),
                p.random(-REST_WAKE_SHAKE_AMPLITUDE * 0.6, REST_WAKE_SHAKE_AMPLITUDE * 0.6)
            );
            restWakeShakeFrames -= 1;
        }

        p.scale(bScale);
        drawBody(c);
        p.pop();
    }

    function drawLongRestMeter(c) {
        let now = Date.now();
        let longRestActive = isLongRestActive(now);
        let shortRestActive = isShortRestActive(now) && !longRestActive;
        if (!longRestActive && !shortRestActive) return;

        let durationMs = longRestActive ? LONG_REST_DURATION_MS : SHORT_REST_DURATION_MS;
        let untilMs = longRestActive ? restState.longRestUntil : restState.shortRestUntil;
        let msRemaining = Math.max(0, untilMs - now);
        let progress = 1 - (msRemaining / Math.max(1, durationMs));
        progress = p.constrain(progress, 0, 1);
        let barW = CREATURE_SIZE * 0.72;
        let barH = 12;
        let barX = c.x - barW * 0.5;
        let barY = c.y - CREATURE_SIZE * 0.72;
        let totalSeconds = Math.ceil(msRemaining / 1000);
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let timerText = `${longRestActive ? 'LONG' : 'SHORT'} REST ${minutes}:${String(seconds).padStart(2, '0')}`;

        p.push();
        p.noStroke();
        p.fill(20, 20, 20, 90);
        p.rect(barX, barY, barW, barH, barH * 0.5);
        p.fill(255, 255, 255, 220);
        p.rect(barX + 1, barY + 1, (barW - 2) * progress, barH - 2, barH * 0.45);
        p.fill(255, 255, 255, 230);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(11);
        p.text(timerText, c.x, barY - 4);
        p.pop();
    }

    function ensureFoodSprites() {
        if (foodSprites.size === SHOP_FOOD_VARIANTS.length) return;
        for (let i = 0; i < SHOP_FOOD_VARIANTS.length; i++) {
            let type = SHOP_FOOD_VARIANTS[i];
            if (foodSprites.has(type.id) || pendingFoodSpriteLoads.has(type.id)) continue;
            pendingFoodSpriteLoads.add(type.id);
            p.loadImage(
                type.spritePath,
                (img) => {
                    foodSprites.set(type.id, img);
                    foodOutlineSprites.delete(type.id);
                    pendingFoodSpriteLoads.delete(type.id);
                },
                () => {
                    foodSprites.set(type.id, buildFoodSpriteGraphic(type));
                    foodOutlineSprites.delete(type.id);
                    pendingFoodSpriteLoads.delete(type.id);
                }
            );
        }
    }

    function buildFoodSpriteGraphic(type) {
        let g = p.createGraphics(FOOD_SPRITE_SIZE, FOOD_SPRITE_SIZE);
        g.pixelDensity(1);
        g.noSmooth();
        g.clear();
        g.noStroke();

        if (type.id === 'apple') {
            g.fill(205, 54, 46);
            g.ellipse(21, 24, 22, 22);
            g.fill(90, 150, 70);
            g.ellipse(24, 12, 11, 7);
            g.fill(85, 55, 32);
            g.rect(20, 8, 2, 6, 1);
        } else if (type.id === 'sandwich') {
            g.fill(240, 137, 36);
            g.triangle(12, 14, 30, 14, 21, 34);
            g.fill(84, 160, 82);
            g.rect(18, 6, 2, 8, 1);
            g.rect(22, 5, 2, 9, 1);
            g.rect(14, 6, 2, 7, 1);
        } else {
            g.fill(120, 86, 48);
            g.ellipse(21, 27, 28, 10);
            g.fill(214, 171, 110);
            g.ellipse(21, 22, 24, 12);
            g.fill(180, 90, 60);
            g.ellipse(16, 22, 6, 4);
            g.fill(90, 150, 80);
            g.ellipse(24, 21, 6, 4);
        }
        return g;
    }

    function getFoodById(foodId) {
        for (let i = 0; i < foodItems.length; i++) {
            if (foodItems[i].id === foodId) return foodItems[i];
        }
        return null;
    }

    function getFoodTypeById(typeId) {
        for (let i = 0; i < SHOP_FOOD_VARIANTS.length; i++) {
            if (SHOP_FOOD_VARIANTS[i].id === typeId) return SHOP_FOOD_VARIANTS[i];
        }
        return SHOP_FOOD_VARIANTS[0];
    }

    function pickRandomFoodType() {
        return SHOP_FOOD_VARIANTS[Math.floor(p.random(SHOP_FOOD_VARIANTS.length))];
    }

    function getFoodSpawnPosition() {
        let half = FOOD_ITEM_SIZE * 0.5;
        let x = p.constrain(p.width * 0.78 + p.random(-35, 35), half, p.width - half);
        let y = p.constrain(p.height * 0.18 + p.random(-24, 24), half, p.height - half);
        return { x, y };
    }

    function getFoodFloorY() {
        let half = FOOD_ITEM_SIZE * 0.5;
        return p.constrain(p.height * FOOD_FLOOR_Y, half, p.height - half);
    }

    function spawnFoodItem(foodType) {
        let spawn = getFoodSpawnPosition();
        foodItems.push({
            id: nextFoodItemId++,
            typeId: foodType.id,
            x: spawn.x,
            y: spawn.y,
            vy: 0,
        });
    }

    function drawFoodItems() {
        if (!foodItems.length) return;
        ensureFoodSprites();
        let hoveredIndex = draggedFoodItemId == null ? getFoodItemIndexAt(p.mouseX, p.mouseY) : -1;
        let floorY = getFoodFloorY();

        for (let i = 0; i < foodItems.length; i++) {
            let item = foodItems[i];
            let sprite = foodSprites.get(item.typeId);
            if (!sprite) continue;

            let dragging = item.id === draggedFoodItemId;
            let hovered = i === hoveredIndex;
            if (!dragging) {
                item.vy = p.constrain((Number(item.vy) || 0) + FOOD_GRAVITY, -FOOD_MAX_FALL_SPEED, FOOD_MAX_FALL_SPEED);
                item.y += item.vy;
                if (item.y > floorY) {
                    item.y = floorY;
                    item.vy = 0;
                }
            }
            let drawX = dragging ? p.mouseX + foodDragOffsetX : item.x;
            let drawY = dragging ? p.mouseY + foodDragOffsetY : item.y;
            let size = dragging ? FOOD_ITEM_SIZE * 1.06 : FOOD_ITEM_SIZE;
            let outlineSprite = (dragging || hovered) ? getFoodOutlineSprite(item.typeId) : null;

            p.push();
            p.imageMode(p.CENTER);
            if (!dragging) {
                p.noStroke();
                p.fill(20, 20, 20, 35);
                p.ellipse(drawX + 1, drawY + FOOD_ITEM_SIZE * 0.28, FOOD_ITEM_SIZE * 0.58, FOOD_ITEM_SIZE * 0.24);
            }
            if (outlineSprite) {
                p.image(outlineSprite, drawX, drawY, size, size);
            }
            p.image(sprite, drawX, drawY, size, size);
            p.pop();
        }
    }

    function foodEffectText(foodType) {
        if (!foodType) return '';
        let hunger = Number(foodType.hungerGain) || 0;
        let energy = Number(foodType.energyGain) || 0;
        let parts = [];
        if (hunger > 0) parts.push(`+${hunger} hunger`);
        if (energy > 0) parts.push(`+${energy} energy`);
        if (foodType.id === 'energy-drink') parts.push('boost speed while energy > 50%');
        return parts.join(', ');
    }

    function getFoodOutlineSprite(typeId) {
        if (foodOutlineSprites.has(typeId)) return foodOutlineSprites.get(typeId);
        let sprite = foodSprites.get(typeId);
        if (!sprite) return null;
        let outline = buildSpriteOutlineBuffer(sprite, FOOD_HOVER_OUTLINE_COLOUR);
        if (!outline) return null;
        foodOutlineSprites.set(typeId, outline);
        return outline;
    }

    function getFoodItemIndexAt(x, y) {
        for (let i = foodItems.length - 1; i >= 0; i--) {
            let item = foodItems[i];
            let drawX = item.id === draggedFoodItemId ? p.mouseX + foodDragOffsetX : item.x;
            let drawY = item.id === draggedFoodItemId ? p.mouseY + foodDragOffsetY : item.y;
            if (Math.abs(x - drawX) <= FOOD_ITEM_SIZE * 0.5 && Math.abs(y - drawY) <= FOOD_ITEM_SIZE * 0.5) {
                return i;
            }
        }
        return -1;
    }

    function startFoodDragAt(x, y) {
        let idx = getFoodItemIndexAt(x, y);
        if (idx < 0) return false;

        let picked = foodItems.splice(idx, 1)[0];
        foodItems.push(picked);
        draggedFoodItemId = picked.id;
        foodDragOffsetX = picked.x - x;
        foodDragOffsetY = picked.y - y;
        return true;
    }

    function updateFoodDragHoverState() {
        if (!creature || draggedFoodItemId == null) {
            creatureFoodHoverActive = false;
            return;
        }
        let dragged = getFoodById(draggedFoodItemId);
        if (!dragged) {
            creatureFoodHoverActive = false;
            return;
        }

        let dragX = p.mouseX + foodDragOffsetX;
        let dragY = p.mouseY + foodDragOffsetY;
        creatureFoodHoverActive = p.dist(dragX, dragY, creature.x, creature.y) <= CREATURE_SIZE * FOOD_DROP_HITBOX_SCALE;
    }

    function finishFoodDrag() {
        if (draggedFoodItemId == null) return false;

        let dragged = getFoodById(draggedFoodItemId);
        if (!dragged || !creature) {
            draggedFoodItemId = null;
            creatureFoodHoverActive = false;
            return true;
        }

        let dropX = p.constrain(p.mouseX + foodDragOffsetX, FOOD_ITEM_SIZE * 0.5, p.width - FOOD_ITEM_SIZE * 0.5);
        let dropY = p.constrain(p.mouseY + foodDragOffsetY, FOOD_ITEM_SIZE * 0.5, p.height - FOOD_ITEM_SIZE * 0.5);
        let overCreature = p.dist(dropX, dropY, creature.x, creature.y) <= CREATURE_SIZE * FOOD_DROP_HITBOX_SCALE;

        if (overCreature) {
            let foodType = getFoodTypeById(dragged.typeId);
            let hunger = Number(foodType.hungerGain) || 0;
            let energy = Number(foodType.energyGain) || 0;
            if (hunger > 0) creature.need = p.min(100, creature.need + hunger);
            if (energy > 0) creature.energy = p.min(100, creature.energy + energy);
            if (foodType.id === 'energy-drink') {
                energyDrinkGridBoostActive = creature.energy > ENERGY_DRINK_BOOST_TARGET_ENERGY;
            }
            foodItems = foodItems.filter(item => item.id !== draggedFoodItemId);
            playEatingSoundBurst();
            setShopStatus(`Used ${foodType.label} (${foodEffectText(foodType)}).`);
            saveState(creature);
        } else {
            dragged.x = dropX;
            dragged.y = dropY;
            dragged.vy = 0;
        }

        draggedFoodItemId = null;
        creatureFoodHoverActive = false;
        return true;
    }

    function drawWorldAreaButtons(c) {
        if (!WORLD_AREA_BUTTONS_VISIBLE) return;

        p.push();
        p.rectMode(p.CORNER);
        p.strokeWeight(2);

        p.fill(250, 250, 246, 235);
        p.stroke(60, 140, 220, 220);
        p.rect(WORLD_AREA_1_X, WORLD_AREA_1_Y, WORLD_AREA_SIZE, WORLD_AREA_SIZE, 6);
        p.fill(20, 60, 110, 220);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(10);
        p.text('Search', WORLD_AREA_1_X + WORLD_AREA_SIZE / 2, WORLD_AREA_1_Y + WORLD_AREA_SIZE / 2 - 8);
        p.text('Computer', WORLD_AREA_1_X + WORLD_AREA_SIZE / 2, WORLD_AREA_1_Y + WORLD_AREA_SIZE / 2 + 7);

        p.fill(250, 250, 246, 235);
        p.stroke(40, 180, 120, 220);
        p.rect(WORLD_AREA_2_X, WORLD_AREA_2_Y, WORLD_AREA_SIZE, WORLD_AREA_SIZE, 6);
        p.fill(10, 90, 60, 220);
        p.text('Open', WORLD_AREA_2_X + WORLD_AREA_SIZE / 2, WORLD_AREA_2_Y + WORLD_AREA_SIZE / 2 - 8);
        p.text('Canvas Tab', WORLD_AREA_2_X + WORLD_AREA_SIZE / 2, WORLD_AREA_2_Y + WORLD_AREA_SIZE / 2 + 7);

        p.pop();
    }

    function isPointInWorldAreaButton(mx, my, x, y) {
        return mx >= x && mx <= x + WORLD_AREA_SIZE && my >= y && my <= y + WORLD_AREA_SIZE;
    }

    function buildSpriteOutlineBuffer(sourceBuffer, outlineColour) {
        if (!sourceBuffer) return null;

        sourceBuffer.loadPixels();
        let width = sourceBuffer.width;
        let height = sourceBuffer.height;
        let src = sourceBuffer.pixels;
        let outlineBuffer = p.createGraphics(width, height);
        outlineBuffer.pixelDensity(1);
        outlineBuffer.noSmooth();
        outlineBuffer.clear();
        outlineBuffer.loadPixels();
        let dst = outlineBuffer.pixels;

        function isOpaque(x, y) {
            if (x < 0 || y < 0 || x >= width || y >= height) return false;
            return src[(y * width + x) * 4 + 3] > 0;
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (isOpaque(x, y)) continue;

                let touchesOpaque = false;
                for (let oy = -1; oy <= 1 && !touchesOpaque; oy++) {
                    for (let ox = -1; ox <= 1; ox++) {
                        if (ox === 0 && oy === 0) continue;
                        if (isOpaque(x + ox, y + oy)) {
                            touchesOpaque = true;
                            break;
                        }
                    }
                }

                if (!touchesOpaque) continue;

                let idx = (y * width + x) * 4;
                dst[idx] = outlineColour[0];
                dst[idx + 1] = outlineColour[1];
                dst[idx + 2] = outlineColour[2];
                dst[idx + 3] = outlineColour[3];
            }
        }

        outlineBuffer.updatePixels();
        sourceBuffer.updatePixels();
        return outlineBuffer;
    }

    function ensureStudioDecorSprites() {
        for (let i = 0; i < STUDIO_DECOR_THEMES.length; i++) {
            let theme = STUDIO_DECOR_THEMES[i];
            if (!theme.spritePath) continue;
            if (studioDecorSprites.has(theme.id) || pendingStudioDecorSpriteLoads.has(theme.id)) continue;
            pendingStudioDecorSpriteLoads.add(theme.id);
            p.loadImage(
                theme.spritePath,
                (img) => {
                    studioDecorSprites.set(theme.id, img);
                    pendingStudioDecorSpriteLoads.delete(theme.id);
                },
                () => {
                    pendingStudioDecorSpriteLoads.delete(theme.id);
                }
            );
        }
    }

    function getStudioDecorRenderRect(theme) {
        if (theme.id === 'frame-favorite') {
            let baseSide = Math.max(STUDIO_FAVORITE_FRAME_W, STUDIO_FAVORITE_FRAME_H);
            if (studioFavoritePaintingImage) {
                let sourceSide = Math.max(studioFavoritePaintingImage.width || 0, studioFavoritePaintingImage.height || 0);
                if (sourceSide > 0) {
                    baseSide = sourceSide;
                }
            }
            let side = Math.max(32, Math.round(baseSide * STUDIO_FAVORITE_FRAME_SIZE_SCALE));
            return {
                x: p.width * STUDIO_FAVORITE_FRAME_X,
                y: p.height * STUDIO_FAVORITE_FRAME_Y,
                w: side,
                h: side,
            };
        }

        return {
            x: p.width * (Number(theme.worldX) || 0.82),
            y: p.height * (Number(theme.worldY) || 0.2),
            w: Number(theme.spriteW) || 120,
            h: Number(theme.spriteH) || 120,
        };
    }

    function syncStudioFavoritePaintingImage() {
        if (!ownedStudioDecorThemeIds.includes('frame-favorite')) return;
        if (favouriteGenerationSerial == null) {
            studioFavoritePaintingImage = null;
            studioFavoritePaintingSerial = null;
            studioFavoritePaintingPendingSerial = null;
            return;
        }
        if (studioFavoritePaintingSerial === favouriteGenerationSerial || studioFavoritePaintingPendingSerial === favouriteGenerationSerial) return;

        let snapshot = generationHistory.find(item => item.serial === favouriteGenerationSerial);
        if (!snapshot || !snapshot.imageDataUrl) return;

        studioFavoritePaintingPendingSerial = favouriteGenerationSerial;
        p.loadImage(snapshot.imageDataUrl, (img) => {
            if (studioFavoritePaintingPendingSerial === favouriteGenerationSerial) {
                studioFavoritePaintingImage = img;
                studioFavoritePaintingSerial = favouriteGenerationSerial;
            }
        }, () => {
            if (studioFavoritePaintingPendingSerial === favouriteGenerationSerial) {
                studioFavoritePaintingImage = null;
                studioFavoritePaintingSerial = null;
            }
        });
    }

    function drawStudioEnvironment(c) {
        let splitY = p.height * p.constrain(STUDIO_WALL_FLOOR_SPLIT_Y, 0.2, 0.9);
        let floorColour = [
            clampByte(studioWallColour[0] * STUDIO_FLOOR_DARKEN),
            clampByte(studioWallColour[1] * STUDIO_FLOOR_DARKEN),
            clampByte(studioWallColour[2] * STUDIO_FLOOR_DARKEN),
        ];

        p.push();
        p.noStroke();
        p.fill(...studioWallColour);
        p.rect(0, 0, p.width, splitY);
        drawStudioWallTexture(splitY);
        p.fill(...floorColour);
        p.rect(0, splitY, p.width, p.height - splitY);
        p.pop();

        ensureStudioDecorSprites();
        syncStudioFavoritePaintingImage();

        p.push();
        p.noStroke();

        for (let i = 0; i < STUDIO_DECOR_THEMES.length; i++) {
            let theme = STUDIO_DECOR_THEMES[i];
            if (!ownedStudioDecorThemeIds.includes(theme.id)) continue;
            if (theme.id !== 'frame-favorite') continue;

            let rect = getStudioDecorRenderRect(theme);
            p.fill(255, 255, 255, 152);
            p.rect(rect.x - 8, rect.y - 8, rect.w + 16, rect.h + 16, 0);
            p.fill(30, 30, 30, 120);
            p.rect(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4, 0);
            if (studioFavoritePaintingImage) {
                p.tint(255, 145);
                p.imageMode(p.CORNER);
                p.image(studioFavoritePaintingImage, rect.x, rect.y, rect.w, rect.h);
                p.noTint();
            } else {
                p.fill(...studioWallColour, 180);
                p.rect(rect.x, rect.y, rect.w, rect.h, 0);
                p.fill(20, 20, 20, 120);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(11);
                p.text('Favourite', rect.x + rect.w / 2, rect.y + rect.h / 2 - 6);
                p.text('painting', rect.x + rect.w / 2, rect.y + rect.h / 2 + 8);
            }
            p.noFill();
            p.stroke(130, 98, 52, 220);
            p.strokeWeight(8);
            p.rect(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4, 0);
            p.noStroke();
        }

        for (let i = 0; i < STUDIO_DECOR_THEMES.length; i++) {
            let theme = STUDIO_DECOR_THEMES[i];
            if (!ownedStudioDecorThemeIds.includes(theme.id)) continue;
            if (theme.id === 'frame-favorite') continue;

            let rect = getStudioDecorRenderRect(theme);
            let sprite = studioDecorSprites.get(theme.id);
            if (sprite) {
                p.imageMode(p.CORNER);
                p.image(sprite, rect.x, rect.y, rect.w, rect.h);
            } else {
                p.fill(255, 255, 255, 105);
                p.rect(rect.x, rect.y, rect.w, rect.h, 8);
                p.fill(30, 30, 30, 150);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(10);
                p.text(theme.label, rect.x + rect.w / 2, rect.y + rect.h / 2);
            }
        }

        p.pop();
    }

    function drawStudioWallTexture(splitY) {
        if (activeStudioWallThemeId === 'ink') {
            drawBrickWallTexture(splitY);
            return;
        }

        if (activeStudioWallThemeId === 'rose') {
            p.push();
            p.stroke(196, 136, 136, 78);
            p.strokeWeight(1.2);
            for (let x = -p.height; x < p.width + p.height; x += 24) {
                p.line(x, 0, x + splitY * 0.75, splitY);
            }
            p.pop();
            return;
        }

        if (activeStudioWallThemeId === 'moss') {
            p.push();
            p.stroke(120, 154, 118, 62);
            p.strokeWeight(1.5);
            for (let y = 10; y < splitY; y += 22) {
                p.line(0, y, p.width, y);
            }
            p.pop();
        }
    }

    function drawBrickWallTexture(splitY) {
        let brickH = 24;
        let brickW = 68;

        p.push();
        p.stroke(114, 120, 132, 82);
        p.strokeWeight(1.4);

        for (let y = brickH; y < splitY; y += brickH) {
            p.line(0, y, p.width, y);
        }

        for (let row = 0, y = 0; y < splitY; row += 1, y += brickH) {
            let xOffset = (row % 2) * (brickW * 0.5);
            for (let x = xOffset; x < p.width; x += brickW) {
                p.line(x, y, x, p.min(splitY, y + brickH));
            }
        }
        p.pop();
    }

    // ── EDIT THIS — redesign the creature's body ──────────────

    function drawBody(c) {
        let restingActive = isRestingNow();

        if (restingActive || sleepingAnimationPhase === 'wakingUp') {
            if (restingActive && sleepingAnimationPhase === 'idle') {
                setSleepingAnimationPhase('fallingAsleep');
            } else if (!restingActive && (sleepingAnimationPhase === 'fallingAsleep' || sleepingAnimationPhase === 'sleepLoop')) {
                setSleepingAnimationPhase('wakingUp');
            }

            drawSleepingAnimation(c);
            advanceSleepingAnimation();
            return;
        }

        if (paintingSpriteSheet) {
            let now = p.millis();
            let paintingSpeed = getStackedAnimationSpeedMultiplier(c);
            let frameDuration = 1000 / p.max(1, PAINTING_SPRITE_FPS * paintingSpeed);
            let isGenerating = !generationPaused && !isRestingNow();

            if (isGenerating && now - lastPaintingFrameAt >= frameDuration) {
                let totalFrames = p.max(1, PAINTING_SPRITE_COLS * PAINTING_SPRITE_ROWS);
                paintingFrameIndex = (paintingFrameIndex + 1) % totalFrames;
                if (paintingFrameIndex === 0) {
                    paintingCompletedLoops += 1;
                    if (paintingCompletedLoops % p.max(1, ART_ACCENT_CHANGE_EVERY_LOOPS) === 0) {
                        chooseArtAccentFromPalette();
                    }
                }
                lastPaintingFrameAt = now;
            }

            let frameW = paintingSpriteSheet.width / p.max(1, PAINTING_SPRITE_COLS);
            let frameH = paintingSpriteSheet.height / p.max(1, PAINTING_SPRITE_ROWS);
            let frameCol = paintingFrameIndex % PAINTING_SPRITE_COLS;
            let frameRow = p.floor(paintingFrameIndex / PAINTING_SPRITE_COLS);

            let sx = frameCol * frameW;
            let sy = frameRow * frameH;
            let drawW = CREATURE_SIZE * 1.25;
            let drawH = drawW * (frameH / frameW);
            let hoveringCreature = p.dist(p.mouseX, p.mouseY, c.x, c.y) <= CREATURE_SIZE * 0.5;

            if (!paintingFrameBuffer || paintingFrameBuffer.width !== frameW || paintingFrameBuffer.height !== frameH) {
                paintingFrameBuffer = p.createGraphics(frameW, frameH);
                paintingFrameBuffer.pixelDensity(1);
                paintingFrameBuffer.noSmooth();
            }

            paintingFrameBuffer.clear();
            paintingFrameBuffer.drawingContext.imageSmoothingEnabled = false;
            paintingFrameBuffer.image(
                paintingSpriteSheet,
                0,
                0,
                frameW,
                frameH,
                sx,
                sy,
                frameW,
                frameH
            );
            recolorGreenPixelsInGraphics(paintingFrameBuffer, artAccentColour);

            p.push();
            p.tint(255, c.bodyAlpha);
            p.drawingContext.imageSmoothingEnabled = false;
            p.imageMode(p.CENTER);
            let outlineColour = creatureFoodHoverActive
                ? FOOD_HOVER_OUTLINE_COLOUR
                : (hoveringCreature ? [255, 255, 255, 230] : null);
            if (outlineColour) {
                let outlineBuffer = buildSpriteOutlineBuffer(paintingFrameBuffer, outlineColour);
                if (outlineBuffer) {
                    p.image(outlineBuffer, 0, 0, drawW, drawH);
                }
            }
            p.image(paintingFrameBuffer, 0, 0, drawW, drawH);
            p.pop();
            return;
        }

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
        ensureSchemeLockArraysLength();
        let previousScheme = colorScheme.map(col => [...col]);

        colorScheme = [];
        let seen = new Set();

        for (let i = 0; i < COLOR_SCHEME_COUNT; i++) {
            if (frozenSchemeSlots[i] && previousScheme[i]) {
                colorScheme.push([...previousScheme[i]]);
                seen.add(previousScheme[i].join(','));
            } else {
                colorScheme.push(null);
            }
        }

        for (let i = 0; i < COLOR_SCHEME_COUNT; i++) {
            if (Array.isArray(colorScheme[i])) continue;
            let candidate = [
                p.floor(p.random(256)),
                p.floor(p.random(256)),
                p.floor(p.random(256)),
            ];
            let key = candidate.join(',');
            if (seen.has(key)) {
                i -= 1;
                continue;
            }
            seen.add(key);
            colorScheme[i] = candidate;
        }

        applyFrozenSchemeConstraints();
    }

    function randomUniqueColourScheme(count) {
        let out = [];
        let seen = new Set();
        let safeCount = Math.max(1, Math.floor(count || COLOR_SCHEME_COUNT || 1));

        while (out.length < safeCount) {
            let candidate = [
                p.floor(p.random(256)),
                p.floor(p.random(256)),
                p.floor(p.random(256)),
            ];
            let key = candidate.join(',');
            if (seen.has(key)) continue;
            seen.add(key);
            out.push(candidate);
        }

        return out;
    }

    function buildRandomEasyStyleSnapshot() {
        return {
            referenceRulePrecision: p.random(0.4, 0.92),
            colorSchemeOffsetRange: Math.round(p.random(8, 50)),
            neighborSimilarRange: Math.round(p.random(8, 50)),
            referenceMatchRgbRange: Math.round(p.random(8, 50)),
            adjacentSchemeOverrideChance: clamp01(p.random(0.005, 0.04)),
            globalRandomColorChance: clamp01(p.random(0.0, 0.03)),
            enableGlobalRandomColorRule: false,
        };
    }

    function normalizeEasyStyleProfile(profile) {
        if (!profile || typeof profile !== 'object') return null;

        let style = profile.style || profile.styleSnapshot || null;
        let scheme = Array.isArray(profile.colorScheme) ? profile.colorScheme : null;
        if (!style || !scheme) return null;

        let normalizedScheme = scheme
            .map(col => (Array.isArray(col) && col.length === 3
                ? [clampByte(col[0]), clampByte(col[1]), clampByte(col[2])]
                : null))
            .filter(Boolean);

        if (normalizedScheme.length === 0) return null;

        return {
            style: {
                referenceRulePrecision: p.constrain(Number(style.referenceRulePrecision) || 0.4, 0.4, 1),
                colorSchemeOffsetRange: p.constrain(Math.round(Number(style.colorSchemeOffsetRange) || 24), 0, 50),
                neighborSimilarRange: p.constrain(Math.round(Number(style.neighborSimilarRange) || 24), 0, 50),
                referenceMatchRgbRange: p.constrain(Math.round(Number(style.referenceMatchRgbRange) || 24), 0, 50),
                adjacentSchemeOverrideChance: clamp01(Number(style.adjacentSchemeOverrideChance) || 0.02),
                globalRandomColorChance: clamp01(Number(style.globalRandomColorChance) || 0.01),
                enableGlobalRandomColorRule: !!style.enableGlobalRandomColorRule,
            },
            colorScheme: normalizedScheme,
        };
    }

    function ensureEasyStyleProfile() {
        let createdNow = false;

        if (!easyStyleProfile) {
            easyStyleProfile = {
                style: buildRandomEasyStyleSnapshot(),
                colorScheme: randomUniqueColourScheme(COLOR_SCHEME_COUNT),
            };
            createdNow = true;
        }

        if (!Array.isArray(easyStyleProfile.colorScheme)) {
            easyStyleProfile.colorScheme = randomUniqueColourScheme(COLOR_SCHEME_COUNT);
        }

        if (!easyStyleProfile.style) {
            easyStyleProfile.style = buildRandomEasyStyleSnapshot();
        }

        // Keep constraints for easy mode.
        easyStyleProfile.style.referenceRulePrecision = p.constrain(Number(easyStyleProfile.style.referenceRulePrecision) || 0.4, 0.4, 1);
        easyStyleProfile.style.colorSchemeOffsetRange = p.constrain(Math.round(Number(easyStyleProfile.style.colorSchemeOffsetRange) || 24), 0, 50);
        easyStyleProfile.style.neighborSimilarRange = p.constrain(Math.round(Number(easyStyleProfile.style.neighborSimilarRange) || 24), 0, 50);
        easyStyleProfile.style.referenceMatchRgbRange = p.constrain(Math.round(Number(easyStyleProfile.style.referenceMatchRgbRange) || 24), 0, 50);

        let needed = Math.max(1, COLOR_SCHEME_COUNT);
        if (easyStyleProfile.colorScheme.length > needed) {
            easyStyleProfile.colorScheme = easyStyleProfile.colorScheme.slice(0, needed);
        } else if (easyStyleProfile.colorScheme.length < needed) {
            let seen = new Set(easyStyleProfile.colorScheme.map(col => col.join(',')));
            while (easyStyleProfile.colorScheme.length < needed) {
                let candidate = [
                    p.floor(p.random(256)),
                    p.floor(p.random(256)),
                    p.floor(p.random(256)),
                ];
                let key = candidate.join(',');
                if (seen.has(key)) continue;
                seen.add(key);
                easyStyleProfile.colorScheme.push(candidate);
            }
        }

        return createdNow;
    }

    function easyStyleInfluenceFromEnergy(energyValue) {
        let e = p.constrain(Number(energyValue) || 0, 0, 100);
        if (e > 50) {
            lastEnergyStyleInfluence = 0;
            return 0;
        }
        if (e < 40) {
            lastEnergyStyleInfluence = clamp01((40 - e) / 40);
            return lastEnergyStyleInfluence;
        }
        return lastEnergyStyleInfluence;
    }

    function applyEasyStyleInfluenceToGeneration(energyValue) {
        ensureEasyStyleProfile();
        let influence = easyStyleInfluenceFromEnergy(energyValue);
        let current = captureCurrentStyleSnapshot();

        if (Number(energyValue) > 50) {
            fullEnergyStyleSnapshot = {
                ...current,
                enableGlobalRandomColorRule: !!current.enableGlobalRandomColorRule,
            };
            fullEnergyColorScheme = Array.isArray(colorScheme)
                ? colorScheme.map(col => [...col])
                : null;
            return;
        }

        if (influence <= 0) return;

        let sourceStyle = fullEnergyStyleSnapshot || current;
        let target = easyStyleProfile.style;
        let blended = {
            referenceRulePrecision: p.lerp(sourceStyle.referenceRulePrecision, target.referenceRulePrecision, influence),
            colorSchemeOffsetRange: p.lerp(sourceStyle.colorSchemeOffsetRange, target.colorSchemeOffsetRange, influence),
            neighborSimilarRange: p.lerp(sourceStyle.neighborSimilarRange, target.neighborSimilarRange, influence),
            referenceMatchRgbRange: p.lerp(sourceStyle.referenceMatchRgbRange, target.referenceMatchRgbRange, influence),
            adjacentSchemeOverrideChance: p.lerp(sourceStyle.adjacentSchemeOverrideChance, target.adjacentSchemeOverrideChance, influence),
            globalRandomColorChance: p.lerp(sourceStyle.globalRandomColorChance, target.globalRandomColorChance, influence),
            enableGlobalRandomColorRule: influence >= 0.5 ? target.enableGlobalRandomColorRule : sourceStyle.enableGlobalRandomColorRule,
        };
        applyStyleSnapshot(blended);

        let sourceScheme = Array.isArray(fullEnergyColorScheme) ? fullEnergyColorScheme : colorScheme;
        if (!Array.isArray(sourceScheme) || !Array.isArray(easyStyleProfile.colorScheme) || !Array.isArray(colorScheme)) return;
        let n = Math.min(sourceScheme.length, easyStyleProfile.colorScheme.length, colorScheme.length);
        for (let i = 0; i < n; i++) {
            colorScheme[i] = blendColor(sourceScheme[i], easyStyleProfile.colorScheme[i], influence);
        }
    }

    function copyGridState(grid) {
        return Array.isArray(grid)
            ? grid.map(row => (Array.isArray(row) ? row.map(cell => (Array.isArray(cell) ? [...cell] : cell)) : row))
            : null;
    }

    function captureRestGenerationSnapshot() {
        restGenerationSnapshot = {
            generationPaused,
            lastGridRandomizeAt,
            colorScheme: colorScheme.map(col => [...col]),
            frozenSchemeSlots: frozenSchemeSlots.map(v => !!v),
            frozenSchemeValues: frozenSchemeValues.map(col => (Array.isArray(col) ? [...col] : null)),
            gridColors: copyGridState(gridColors),
            gridChanged: copyGridState(gridChanged),
            gridChangedCount,
            referenceSprite,
            referenceAssociations: copyGridState(referenceAssociations),
            referenceColourMap: copyGridState(referenceColourMap),
            currentReferenceSpritePath,
            referenceRuleReady,
            activeReferencePreview: {
                imageUrl: activeReferencePreview.imageUrl,
                caption: activeReferencePreview.caption,
            },
            easyStyleProfile: normalizeEasyStyleProfile(easyStyleProfile),
            style: captureCurrentStyleSnapshot(),
        };
    }

    function restoreRestGenerationSnapshot() {
        if (!restGenerationSnapshot) return;

        generationPaused = !!restGenerationSnapshot.generationPaused;
        lastGridRandomizeAt = Number(restGenerationSnapshot.lastGridRandomizeAt) || lastGridRandomizeAt;
        colorScheme = Array.isArray(restGenerationSnapshot.colorScheme)
            ? restGenerationSnapshot.colorScheme.map(col => [...col])
            : colorScheme;
        frozenSchemeSlots = Array.isArray(restGenerationSnapshot.frozenSchemeSlots)
            ? restGenerationSnapshot.frozenSchemeSlots.map(v => !!v)
            : frozenSchemeSlots;
        frozenSchemeValues = Array.isArray(restGenerationSnapshot.frozenSchemeValues)
            ? restGenerationSnapshot.frozenSchemeValues.map(col => (Array.isArray(col) ? [...col] : null))
            : frozenSchemeValues;
        gridColors = Array.isArray(restGenerationSnapshot.gridColors)
            ? copyGridState(restGenerationSnapshot.gridColors)
            : gridColors;
        gridChanged = Array.isArray(restGenerationSnapshot.gridChanged)
            ? copyGridState(restGenerationSnapshot.gridChanged)
            : gridChanged;
        gridChangedCount = Number(restGenerationSnapshot.gridChangedCount) || gridChangedCount;
        referenceSprite = restGenerationSnapshot.referenceSprite || referenceSprite;
        referenceAssociations = Array.isArray(restGenerationSnapshot.referenceAssociations)
            ? copyGridState(restGenerationSnapshot.referenceAssociations)
            : referenceAssociations;
        referenceColourMap = Array.isArray(restGenerationSnapshot.referenceColourMap)
            ? restGenerationSnapshot.referenceColourMap.map(col => (Array.isArray(col) ? [...col] : col))
            : referenceColourMap;
        currentReferenceSpritePath = typeof restGenerationSnapshot.currentReferenceSpritePath === 'string'
            ? restGenerationSnapshot.currentReferenceSpritePath
            : currentReferenceSpritePath;
        referenceRuleReady = !!restGenerationSnapshot.referenceRuleReady;
        activeReferencePreview = restGenerationSnapshot.activeReferencePreview
            ? {
                imageUrl: restGenerationSnapshot.activeReferencePreview.imageUrl || '',
                caption: restGenerationSnapshot.activeReferencePreview.caption || 'Using default local references.',
            }
            : activeReferencePreview;
        easyStyleProfile = normalizeEasyStyleProfile(restGenerationSnapshot.easyStyleProfile || easyStyleProfile);
        applyStyleSnapshot(restGenerationSnapshot.style || captureCurrentStyleSnapshot());
        refreshReferencePreviewCard();
    }

    function clearRestGenerationSnapshot() {
        restGenerationSnapshot = null;
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

    function captureCurrentStyleSnapshot() {
        return {
            referenceRulePrecision: REFERENCE_RULE_PRECISION,
            colorSchemeOffsetRange: COLOR_SCHEME_OFFSET_RANGE,
            neighborSimilarRange: NEIGHBOR_SIMILAR_RANGE,
            referenceMatchRgbRange: REFERENCE_MATCH_RGB_RANGE,
            adjacentSchemeOverrideChance: ADJACENT_SCHEME_OVERRIDE_CHANCE,
            globalRandomColorChance: GLOBAL_RANDOM_COLOR_CHANCE,
            enableGlobalRandomColorRule: ENABLE_GLOBAL_RANDOM_COLOR_RULE,
        };
    }

    function applyStyleSnapshot(snapshot) {
        if (!snapshot) return;

        REFERENCE_RULE_PRECISION = clamp01(snapshot.referenceRulePrecision || 0);
        COLOR_SCHEME_OFFSET_RANGE = p.constrain(Math.round(snapshot.colorSchemeOffsetRange || 0), 0, 255);
        NEIGHBOR_SIMILAR_RANGE = p.constrain(Math.round(snapshot.neighborSimilarRange || 0), 0, 255);
        REFERENCE_MATCH_RGB_RANGE = p.constrain(Math.round(snapshot.referenceMatchRgbRange || 0), 0, 255);
        ADJACENT_SCHEME_OVERRIDE_CHANCE = clamp01(snapshot.adjacentSchemeOverrideChance || 0);
        GLOBAL_RANDOM_COLOR_CHANCE = clamp01(snapshot.globalRandomColorChance || 0);
        ENABLE_GLOBAL_RANDOM_COLOR_RULE = !!snapshot.enableGlobalRandomColorRule;
    }

    function buildLikedStyleSnapshot(target) {
        if (!target) return captureCurrentStyleSnapshot();
        return {
            referenceRulePrecision: mutateScalarWithinPercent(target.referenceRulePrecision, 0.06, 0, 1),
            colorSchemeOffsetRange: mutateScalarWithinPercent(target.colorSchemeOffsetRange, 0.08, 0, 255),
            neighborSimilarRange: mutateScalarWithinPercent(target.neighborSimilarRange, 0.08, 0, 255),
            referenceMatchRgbRange: mutateScalarWithinPercent(target.referenceMatchRgbRange, 0.08, 0, 255),
            adjacentSchemeOverrideChance: mutateScalarWithinPercent(target.adjacentSchemeOverrideChance, 0.12, 0, 1),
            globalRandomColorChance: mutateScalarWithinPercent(target.globalRandomColorChance, 0.12, 0, 1),
            enableGlobalRandomColorRule: !!target.enableGlobalRandomColorRule,
        };
    }

    function buildDislikedStyleSnapshot(target) {
        if (!target) return captureCurrentStyleSnapshot();
        let clampedRange = (value) => p.constrain(Math.round(value), DISLIKE_STYLE_RANGE_MIN, DISLIKE_STYLE_RANGE_MAX);
        return {
            referenceRulePrecision: pickValueOutsideBand(0, 1, target.referenceRulePrecision, 0.12),
            colorSchemeOffsetRange: clampedRange(pickValueOutsideBand(0, 255, target.colorSchemeOffsetRange, 14)),
            neighborSimilarRange: clampedRange(pickValueOutsideBand(0, 255, target.neighborSimilarRange, 14)),
            referenceMatchRgbRange: clampedRange(pickValueOutsideBand(0, 255, target.referenceMatchRgbRange, 14)),
            adjacentSchemeOverrideChance: pickValueOutsideBand(0, 1, target.adjacentSchemeOverrideChance, 0.08),
            globalRandomColorChance: pickValueOutsideBand(0, 1, target.globalRandomColorChance, 0.08),
            enableGlobalRandomColorRule: !target.enableGlobalRandomColorRule,
        };
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

    function getReferenceKeywordFromSnapshot(snapshot) {
        if (snapshot.referenceKeyword && String(snapshot.referenceKeyword).trim()) {
            return String(snapshot.referenceKeyword).trim();
        }

        let path = snapshot.referencePath || '';
        if (path.startsWith('prompt:')) {
            let promptKeyword = path.slice('prompt:'.length).trim();
            return promptKeyword || 'Prompt Study';
        }

        return inferReferenceKeywordFromPath(path);
    }

    function stableSeedForSnapshotTitle(snapshot, salt) {
        let serial = Number(snapshot.serial) || 0;
        let precisionBits = Math.round((Number(snapshot.referenceRulePrecision) || 0) * 1000);
        let offsetBits = Number(snapshot.colorSchemeOffsetRange) || 0;
        let neighborBits = Number(snapshot.neighborSimilarRange) || 0;
        let refBits = Number(snapshot.referenceMatchRgbRange) || 0;
        let seed = serial * 131 + precisionBits * 17 + offsetBits * 31 + neighborBits * 13 + refBits * 7 + salt * 97;
        return Math.abs(seed);
    }

    function pickSnapshotTitleVariant(snapshot, options, salt) {
        if (!Array.isArray(options) || options.length === 0) return '';
        let seed = stableSeedForSnapshotTitle(snapshot, salt);
        let index = seed % options.length;
        return options[index];
    }

    function generationTitlePrefix(snapshot) {
        let precision = Number(snapshot.referenceRulePrecision) || 0.5;
        if (precision < 0.25) {
            return pickSnapshotTitleVariant(snapshot, ['The Essence of ', 'The Ideal ', 'Death of a ', 'Scribble of ', 'My '], 1);
        }
        if (precision < 0.5) {
            return pickSnapshotTitleVariant(snapshot, ['Abstracted ', 'Deconstructed ', 'Sketch of ', 'Exploded ', 'Chaotic ', 'Impasto Painting of '], 2);
        }
        if (precision < 0.8) {
            return pickSnapshotTitleVariant(snapshot, ['Study of ', 'Painting of ', 'Midday Light on ', 'Morning Render with ', 'Reality of ', 'The World of '], 3);
        }
        return pickSnapshotTitleVariant(snapshot, ['Portrait of ', 'Hyperrealistic Painting with ', 'My ', 'Photograph of '], 4);
    }

    function generatedSnapshotTitle(snapshot) {
        let keyword = getReferenceKeywordFromSnapshot(snapshot);
        let year = Number(snapshot.createdAtYear) || new Date().getFullYear();
        return `${generationTitlePrefix(snapshot)}${keyword} (${year})`;
    }

    function snapshotLabelText(snapshot) {
        let soldTag = snapshot.sold ? ' [sold]' : '';
        return `${generatedSnapshotTitle(snapshot)}${soldTag}`;
    }

    function updateGenerationStripControls() {
        let selectedCount = selectedSellSerials.size;

        if (ui.generationStrip) {
            ui.generationStrip.classList.toggle('select-sell-active', selectSellModeActive);
        }

        if (ui.generationSelectSellToggle) {
            ui.generationSelectSellToggle.textContent = selectSellModeActive ? 'Select Sell: On' : 'Select Sell: Off';
            ui.generationSelectSellToggle.setAttribute('aria-pressed', selectSellModeActive ? 'true' : 'false');
        }

        if (ui.generationSellSelectedButton) {
            ui.generationSellSelectedButton.textContent = `Sell Selected (${selectedCount})`;
            ui.generationSellSelectedButton.disabled = !selectSellModeActive || selectedCount === 0;
        }
    }

    function toggleGenerationSellSelection(serial) {
        if (selectedSellSerials.has(serial)) {
            selectedSellSerials.delete(serial);
        } else {
            selectedSellSerials.add(serial);
        }
        updateGenerationStripControls();
    }

    function clearGenerationSellSelection() {
        selectedSellSerials.clear();
        updateGenerationStripControls();
    }

    function toggleSelectSellMode() {
        selectSellModeActive = !selectSellModeActive;
        if (!selectSellModeActive) {
            clearGenerationSellSelection();
        }
        closeGenerationPopup();
        rebuildGenerationStripFromHistory();
        updateGenerationStripControls();
    }

    function rebuildGenerationStripFromHistory() {
        if (!ui.generationStripList) return;
        ui.generationStripList.innerHTML = '';
        for (let i = 0; i < generationHistory.length; i++) {
            ui.generationStripList.appendChild(createGenerationCard(generationHistory[i]));
        }
    }

    function createGenerationCard(snapshot) {
        let card = document.createElement('div');
        card.className = 'generation-thumb';
        if (snapshot.sold) card.classList.add('generation-thumb-sold');
        if (selectedSellSerials.has(snapshot.serial)) card.classList.add('generation-thumb-selected');
        card.dataset.serial = String(snapshot.serial);
        card.title = generatedSnapshotTitle(snapshot);

        let img = document.createElement('img');
        img.src = snapshot.imageDataUrl;
        img.alt = generatedSnapshotTitle(snapshot);
        img.style.width = `${GENERATION_THUMB_WIDTH}px`;
        img.style.height = `${GENERATION_THUMB_HEIGHT}px`;

        let label = document.createElement('div');
        label.className = 'generation-thumb-label';
        label.textContent = snapshotLabelText(snapshot);

        card.addEventListener('click', (event) => {
            event.stopPropagation();
            if (selectSellModeActive) {
                toggleGenerationSellSelection(snapshot.serial);
                card.classList.toggle('generation-thumb-selected', selectedSellSerials.has(snapshot.serial));
                return;
            }
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
        selectedSellSerials.delete(serial);
        if (selectedHistorySerial === serial) {
            selectedHistorySerial = null;
        }

        if (ui.generationStripList) {
            let card = ui.generationStripList.querySelector(`.generation-thumb[data-serial="${serial}"]`);
            if (card) card.remove();
        }
        updateGenerationStripControls();
        return removed;
    }

    function formatSnapshotValues(snapshot) {
        let schemeText = snapshot.colorScheme
            .map(col => `(${col[0]},${col[1]},${col[2]})`)
            .join(' ');
        return [
            `generation #${snapshot.serial} (${snapshot.reason})`,
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
        if (!ui.generationPopup || ui.generationPopup.hidden) return;
        if (ui.generationPopup.contains(event.target)) return;
        if (event.target.closest('.generation-thumb')) return;
        closeGenerationPopup();
    }

    function openGenerationPopup(snapshot, thumbElement) {
        if (!ui.generationPopup || !ui.generationPopupImage || !ui.generationPopupValues) return;
        selectedHistorySerial = snapshot.serial;
        ui.generationPopupImage.src = snapshot.imageDataUrl;
        ui.generationPopupValues.textContent = formatSnapshotValues(snapshot);
        updateGenerationSaleSummary(snapshot);
        ui.generationPopup.hidden = false;

        let rect = thumbElement.getBoundingClientRect();
        let popupWidth = Math.min(440, window.innerWidth - 24);
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
        if (favouriteGenerationSerial === snapshot.serial) {
            favouriteGenerationSerial = null;
        }

        lastFeedbackAction = `sold-#${snapshot.serial}`;
        removeSnapshotFromHistory(snapshot.serial);
        closeGenerationPopup();
        saveGenerationHistoryToStorage();
        saveState(creature);
    }

    function onSellSelectedGenerationsClicked() {
        if (!selectSellModeActive || selectedSellSerials.size === 0) return;

        let snapshotsToSell = generationHistory.filter(snapshot =>
            selectedSellSerials.has(snapshot.serial) && !snapshot.sold
        );
        if (!snapshotsToSell.length) {
            clearGenerationSellSelection();
            rebuildGenerationStripFromHistory();
            return;
        }

        let total = 0;
        let appraisals = [];

        for (let i = 0; i < snapshotsToSell.length; i++) {
            let snapshot = snapshotsToSell[i];
            let appraisal = appraiseSnapshotForSale(snapshot);
            appraisals.push(appraisal);
            total += appraisal.payout;

            if (favouriteGenerationSerial === snapshot.serial) {
                favouriteGenerationSerial = null;
            }
        }

        galleryCoins += total;
        for (let i = 0; i < snapshotsToSell.length; i++) {
            removeSnapshotFromHistory(snapshotsToSell[i].serial);
        }

        closeGenerationPopup();
        clearGenerationSellSelection();
        selectSellModeActive = false;
        updateGenerationStripControls();
        rebuildGenerationStripFromHistory();
        startBulkSaleCredits(appraisals, total);

        lastFeedbackAction = `bulk-sold-${snapshotsToSell.length}`;
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

    function applyPersistentPreferencesToGeneration() {
        if (colourPreference.mode && Array.isArray(colourPreference.targetScheme) && colourPreference.targetScheme.length > 0) {
            if (colourPreference.mode === 'like') {
                colourPreference.targetScheme = blendSchemeToward(colourPreference.targetScheme, colorScheme, 0.35);
                let tightenPct = p.constrain(0.065 - (colourPreference.likeStreak || 0) * 0.007, 0.008, 0.065);
                colorScheme = mutateSchemeWithinPercent(colourPreference.targetScheme, tightenPct);
                colourPreference.likeStreak = Math.min(10, (colourPreference.likeStreak || 0) + 1);
            } else if (colourPreference.mode === 'dislike') {
                colorScheme = buildDislikedScheme(colourPreference.targetScheme);
                colourPreference.likeStreak = 0;
            }
        }

        if (stylePreference.mode && stylePreference.target) {
            if (stylePreference.mode === 'like') {
                let observed = captureCurrentStyleSnapshot();
                let t = 0.3;
                stylePreference.target = {
                    referenceRulePrecision: p.lerp(stylePreference.target.referenceRulePrecision, observed.referenceRulePrecision, t),
                    colorSchemeOffsetRange: p.lerp(stylePreference.target.colorSchemeOffsetRange, observed.colorSchemeOffsetRange, t),
                    neighborSimilarRange: p.lerp(stylePreference.target.neighborSimilarRange, observed.neighborSimilarRange, t),
                    referenceMatchRgbRange: p.lerp(stylePreference.target.referenceMatchRgbRange, observed.referenceMatchRgbRange, t),
                    adjacentSchemeOverrideChance: p.lerp(stylePreference.target.adjacentSchemeOverrideChance, observed.adjacentSchemeOverrideChance, t),
                    globalRandomColorChance: p.lerp(stylePreference.target.globalRandomColorChance, observed.globalRandomColorChance, t),
                    enableGlobalRandomColorRule: stylePreference.target.enableGlobalRandomColorRule,
                };

                let liked = buildLikedStyleSnapshot(stylePreference.target);
                let tighten = p.constrain(0.22 - (stylePreference.likeStreak || 0) * 0.022, 0.04, 0.22);
                liked.colorSchemeOffsetRange = p.lerp(stylePreference.target.colorSchemeOffsetRange, liked.colorSchemeOffsetRange, tighten);
                liked.neighborSimilarRange = p.lerp(stylePreference.target.neighborSimilarRange, liked.neighborSimilarRange, tighten);
                liked.referenceMatchRgbRange = p.lerp(stylePreference.target.referenceMatchRgbRange, liked.referenceMatchRgbRange, tighten);
                applyStyleSnapshot(liked);
                stylePreference.likeStreak = Math.min(10, (stylePreference.likeStreak || 0) + 1);
            } else if (stylePreference.mode === 'dislike') {
                applyStyleSnapshot(buildDislikedStyleSnapshot(stylePreference.target));
                stylePreference.likeStreak = 0;
            }
        }
    }

    function onLikeColoursFeedback() {
        if (colourPreference.mode === 'like' && Array.isArray(colourPreference.targetScheme)) {
            colourPreference.targetScheme = blendSchemeToward(colourPreference.targetScheme, colorScheme, 0.5);
            colourPreference.likeStreak = Math.min(10, (colourPreference.likeStreak || 0) + 1);
        } else {
            colourPreference.targetScheme = colorScheme.map(col => [...col]);
            colourPreference.likeStreak = 1;
        }
        colourPreference.mode = 'like';
        lastFeedbackAction = 'like-colours';
        resetGeneration();
    }

    function onDislikeColoursFeedback() {
        colourPreference.mode = 'dislike';
        colourPreference.targetScheme = colorScheme.map(col => [...col]);
        colourPreference.likeStreak = 0;
        lastFeedbackAction = 'dislike-colours';
        resetGeneration();
    }

    function onLikeStyleFeedback() {
        let wasLike = stylePreference.mode === 'like';
        let snap = captureCurrentStyleSnapshot();
        if (wasLike && stylePreference.target) {
            stylePreference.target = {
                referenceRulePrecision: p.lerp(stylePreference.target.referenceRulePrecision, snap.referenceRulePrecision, 0.5),
                colorSchemeOffsetRange: p.lerp(stylePreference.target.colorSchemeOffsetRange, snap.colorSchemeOffsetRange, 0.5),
                neighborSimilarRange: p.lerp(stylePreference.target.neighborSimilarRange, snap.neighborSimilarRange, 0.5),
                referenceMatchRgbRange: p.lerp(stylePreference.target.referenceMatchRgbRange, snap.referenceMatchRgbRange, 0.5),
                adjacentSchemeOverrideChance: p.lerp(stylePreference.target.adjacentSchemeOverrideChance, snap.adjacentSchemeOverrideChance, 0.5),
                globalRandomColorChance: p.lerp(stylePreference.target.globalRandomColorChance, snap.globalRandomColorChance, 0.5),
                enableGlobalRandomColorRule: snap.enableGlobalRandomColorRule,
            };
            stylePreference.likeStreak = Math.min(10, (stylePreference.likeStreak || 0) + 1);
        } else {
            stylePreference.target = snap;
            stylePreference.likeStreak = 1;
        }
        stylePreference.mode = 'like';
        lastFeedbackAction = 'like-style';
        resetGeneration();
    }

    function onDislikeStyleFeedback() {
        stylePreference.mode = 'dislike';
        stylePreference.target = captureCurrentStyleSnapshot();
        stylePreference.likeStreak = 0;
        lastFeedbackAction = 'dislike-style';
        resetGeneration();
    }

    function increasePrecision() {
        let deltaPct = p.random(0, 0.10);
        REFERENCE_RULE_PRECISION = p.constrain(
            REFERENCE_RULE_PRECISION * (1 + deltaPct),
            0,
            1
        );
        if (p.random() < 0.2) ENABLE_GLOBAL_RANDOM_COLOR_RULE = false;
        REFERENCE_MATCH_RGB_RANGE = p.constrain(
            Math.round(REFERENCE_MATCH_RGB_RANGE - p.random(0, 5)),
            0,
            255
        );
        lastFeedbackAction = 'more-precise';
    }

    function decreasePrecision() {
        let deltaPct = p.random(0, 0.08);
        REFERENCE_RULE_PRECISION = p.constrain(
            REFERENCE_RULE_PRECISION * (1 - deltaPct),
            0,
            1
        );
        if (p.random() < 0.2) ENABLE_GLOBAL_RANDOM_COLOR_RULE = true;
        REFERENCE_MATCH_RGB_RANGE = p.constrain(
            Math.round(REFERENCE_MATCH_RGB_RANGE + p.random(0, 5)),
            0,
            255
        );
        lastFeedbackAction = 'more-abstract';
    }

    function increaseNoise() {
        let delta = p.random(0, 5);
        let chanceDelta = p.random(0, 0.02);
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
        REFERENCE_MATCH_RGB_RANGE = p.constrain(
            Math.round(REFERENCE_MATCH_RGB_RANGE + delta),
            0,
            255
        );
        ADJACENT_SCHEME_OVERRIDE_CHANCE = clamp01(ADJACENT_SCHEME_OVERRIDE_CHANCE + chanceDelta);
        GLOBAL_RANDOM_COLOR_CHANCE = clamp01(GLOBAL_RANDOM_COLOR_CHANCE + chanceDelta);
        lastFeedbackAction = 'noisier';
    }

    function decreaseNoise() {
        let delta = p.random(0, 5);
        let chanceDelta = p.random(0, 0.02);
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
        REFERENCE_MATCH_RGB_RANGE = p.constrain(
            Math.round(REFERENCE_MATCH_RGB_RANGE - delta),
            0,
            255
        );
        ADJACENT_SCHEME_OVERRIDE_CHANCE = clamp01(ADJACENT_SCHEME_OVERRIDE_CHANCE - chanceDelta);
        GLOBAL_RANDOM_COLOR_CHANCE = clamp01(GLOBAL_RANDOM_COLOR_CHANCE - chanceDelta);
        lastFeedbackAction = 'cleaner';
    }

    function isLongRestActive(nowMs = Date.now()) {
        if (restState.longRestUntil <= 0) return false;
        if (nowMs >= restState.longRestUntil) {
            restState.longRestUntil = 0;
            return false;
        }
        return true;
    }

    function isShortRestActive(nowMs = Date.now()) {
        if (!restState.shortActive) return false;
        if (restState.shortRestUntil > 0 && nowMs >= restState.shortRestUntil) {
            restState.shortActive = false;
            restState.shortRestUntil = 0;
            shortRestWakeClicks = 0;
            return false;
        }
        return true;
    }

    function isRestingNow(nowMs = Date.now()) {
        return isShortRestActive(nowMs) || isLongRestActive(nowMs);
    }

    function takeBreak(mode) {
        if (mode === 'short') {
            if (!isShortRestActive()) {
                captureRestGenerationSnapshot();
                restState.shortActive = true;
                restState.shortRestUntil = Date.now() + SHORT_REST_DURATION_MS;
                shortRestWakeClicks = 0;
                generationPaused = true;
                setSleepingAnimationPhase('fallingAsleep');
            } else {
                restState.shortActive = false;
                restState.shortRestUntil = 0;
                restoreRestGenerationSnapshot();
                clearRestGenerationSnapshot();
                setSleepingAnimationPhase('wakingUp');
                wasShortRestActive = false;
            }
            lastFeedbackAction = restState.shortActive ? 'short-rest-on' : 'short-rest-off';
            if (ui.radialMenu) ui.radialMenu.classList.remove('radial-active');
            closeRadialPromptModal();
            saveState(creature);
            return;
        }

        if (mode === 'long') {
            captureRestGenerationSnapshot();
            restState.shortActive = false;
            restState.shortRestUntil = 0;
            restState.longRestUntil = Date.now() + LONG_REST_DURATION_MS;
            shortRestWakeClicks = 0;
            wasLongRestActive = true;
            generationPaused = true;
            setSleepingAnimationPhase('fallingAsleep');
            lastFeedbackAction = 'long-rest';
            if (ui.radialMenu) ui.radialMenu.classList.remove('radial-active');
            closeRadialPromptModal();
            saveState(creature);
        }
    }

    function showWakeUpDialogue(restKind) {
        let line = restKind === 'long'
            ? 'I am awake from my long rest. Ready to paint again.'
            : 'You woke me up from my short rest. I am ready to continue.';

        setSleepingAnimationPhase('wakingUp');
        if (typeof window._showNpcDialogueWithExpr === 'function') {
            window._showNpcDialogueWithExpr(line);
        }
        restoreRestGenerationSnapshot();
        clearRestGenerationSnapshot();
    }

    function responseBucketFromValue(value) {
        if (value <= 0) return 'zero';
        if (value <= 5) return 'five';
        if (value < 10) return 'ten';
        if (value > 90) return 'over90';
        if (value >= 30) return 'mid';
        return 'low';
    }

    function pickOne(pool) {
        if (!Array.isArray(pool) || pool.length === 0) return '';
        return pool[p.floor(p.random(pool.length))] || '';
    }

    function checkUpStatusMessage() {
        let hungerValue = Number(creature ? creature.need : 50);
        let energyValue = Number(creature ? creature.energy : 50);
        let hungerBucket = responseBucketFromValue(creature ? creature.need : 50);
        let energyBucket = responseBucketFromValue(creature ? creature.energy : 50);

        let hungerLines = {
            zero: [
                "I'm starving. Please feed me. I can't paint like this. [expr:sad]",
                "I'm trying my best to focus, but hunger is overwhelming me. I might start eating my own paint brush, but then I can't paint.[expr:sad]",
            ],
            five: [
                "Sorry, but my painting's are taking longer to make since I'm really hungry.[expr:confident]",
                "I'm really really hungry. Can you please buy me a meal? I have no hands to feed myself so please.[expr:sad]",
            ],
            ten: [
                "It's getting difficult to focus while I'm hungry.[expr:neutral]",
                "I'm getting very hungry, please can I have some lunch?[expr:sad]",
            ],
            low: [
                "I wouldn't mind getting some food soon.[expr:confident]",
                "I think it's about time for my lunch break.[expr:neutral]",
            ],
            mid: [
                "I'm not hungry, but I wouldn't mind some water.[expr:neutral]",
                "I feel a little peckish, but generally I'm all good.[expr:happy]",
            ],
            over90: [
                "I feel full right now. I'm sure I can paint a thousand paintings before I'm hungry again. [expr:happy]",
                "I feel very well fed.[expr:pride]",
            ],
        };

        let energyLines = {
            zero: [
                "I'm fine. I can keep going, I don't need sleep. I just need to keep painting. Then when I'm famous I can sleep.[expr:determined]",
                "Zzzzzz... Oh sorry, I just had to close my eyes for a bit. I'll keep painting now. Artist's don't sleep... Right?[expr:sad]",
            ],
            five: [
                "I'm getting really tired, but I can keep going if you think I should.[expr:yawn]",
                "Yaaaaaawwn... is it okay if I close my eyes for a bit.[expr:yawn]",
            ],
            ten: [
                "All this painting has made me very tired. I think I might need to sleep soon.[expr:neutral]",
                "I'm running low on energy, after this painting I'll go to bed.[expr:yawn]",
            ],
            low: [
                "My, ... well I was going to say hand but... uh, my head is getting pretty tired. I wouldn't mind a nap.[expr:sad]",
                "I'm feeling a little tired, can I take a short break?[expr:confident]",
                "I'm feeling a bit nervous about this pace, can we slow down a little?[expr:nervous]",
            ],
            mid: [
                "I'm kind of bored, can I take a break to do something else?[expr:neutral]",
                "Do you think I could get a break soon?[expr:confident]",
            ],
            over90: [
                "I'm really energized right now! I can paint a million paintings! I'm so ready for this![expr:happy]",
                "I'm well rested and ready to learn![expr:neutral]",
                "I'm so awake right now! I could paint circles around any other artist![expr:happy]",
                "Good morning, I'm ready to paint! Let's do this![expr:pride]",
                "I'm well rested and ready to learn![expr:neutral]",
                "I CAN WIN! I FEEL GREAT! I. CAN. DO. THIS!!! [expr:determined]",
            ],
        };

        let useHungerLine = hungerValue <= energyValue;
        let selectedLine = useHungerLine
            ? pickOne(hungerLines[hungerBucket])
            : pickOne(energyLines[energyBucket]);

        if (!selectedLine) {
            selectedLine = isRestingNow() ? 'Zzzzzz...[expr:yawn]' : 'I am doing okay.[expr:neutral]';
        }

        // Keep expr tags for the index dialogue system so portrait selection can read them.
        return selectedLine;
    }

    function normalizeExpressionKeyword(rawKeyword) {
        if (!rawKeyword || typeof rawKeyword !== 'string') return '';
        return rawKeyword.trim().toLowerCase();
    }

    function stripExpressionTagsFromReply(text) {
        if (!text || typeof text !== 'string') return '';
        return text
            .replace(/\[(?:expr|expression|sprite)\s*:\s*([a-z0-9_-]+)\]/gi, '')
            .replace(/\{(?:expr|expression|sprite)\s*:\s*([a-z0-9_-]+)\}/gi, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\n\s+/g, '\n')
            .trim();
    }

    function extractExpressionKeywordFromReply(text) {
        if (!text || typeof text !== 'string') return '';

        let bracketMatch = text.match(/\[(?:expr|expression|sprite)\s*:\s*([a-z0-9_-]+)\]/i);
        if (bracketMatch && bracketMatch[1]) {
            return normalizeExpressionKeyword(bracketMatch[1]);
        }

        let braceMatch = text.match(/\{(?:expr|expression|sprite)\s*:\s*([a-z0-9_-]+)\}/i);
        if (braceMatch && braceMatch[1]) {
            return normalizeExpressionKeyword(braceMatch[1]);
        }

        return '';
    }

    function applyTextArtExpressionKeyword(keyword) {
        let normalized = normalizeExpressionKeyword(keyword);
        if (!normalized) return false;

        let spritePath = TEXTART_EXPRESSION_KEYWORDS[normalized] || '';
        if (!spritePath) return false;

        queuedExpressionReferenceForNextGeneration = {
            keyword: normalized,
            spritePath,
        };
        refreshReferencePreviewCard();

        return true;
    }

    function prepareDialogueTextWithExpression(text) {
        let expressionKeyword = extractExpressionKeywordFromReply(text);
        if (expressionKeyword) {
            applyTextArtExpressionKeyword(expressionKeyword);
        }
        return stripExpressionTagsFromReply(text);
    }

    function updateGenerationStripLayout() {
        const stripPadding = 20;
        const headerHeight = 24;
        const labelHeight = 14;
        const thumbCardPadding = 8;
        const stripHeight = GENERATION_THUMB_HEIGHT + stripPadding + headerHeight + labelHeight + thumbCardPadding;
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

        let exportCanvas = document.createElement('canvas');
        exportCanvas.width = GENERATION_THUMB_WIDTH;
        exportCanvas.height = GENERATION_THUMB_HEIGHT;
        let exportCtx = exportCanvas.getContext('2d');
        exportCtx.imageSmoothingEnabled = false;
        exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
        exportCtx.drawImage(logicalCanvas, 0, 0, exportCanvas.width, exportCanvas.height);
        return exportCanvas.toDataURL('image/png');
    }

    function inferReferenceKeywordFromPath(path) {
        if (!path || typeof path !== 'string') return 'Reference Study';

        if (path.startsWith('prompt:')) {
            let promptText = path.slice('prompt:'.length).trim();
            return promptText || 'Prompt Study';
        }

        let fileName = path.split('/').pop() || '';
        let map = {
            'FamiliarBallReference.png': 'Sphere',
            'FamiliarBirdReference.png': 'Bird',
            'FamiliarBirdReference2.png': 'Bird',
            'FamiliarRealBirdReference.webp': 'Real Bird',
            'FamiliarRealBirdReference2.webp': 'Real Bird',
            'FamiliarTextArt-Happy.png': 'Happiness',
            'FamiliarTextArt-Pride.png': 'Pride',
            'FamiliarTextArt-Sad.png': 'Sadness',
            'FamiliarTextArt-Yawn.png': 'Sleepiness',
        };
        if (map[fileName]) return map[fileName];

        let cleaned = fileName.replace(/\.[^.]+$/, '').replace(/^[^A-Za-z0-9]+/, '');
        cleaned = cleaned.replace(/Familiar|Reference|TextArt/gi, ' ').replace(/[_-]+/g, ' ');
        cleaned = cleaned.trim().replace(/\s+/g, ' ');
        return cleaned || 'Reference Study';
    }

    function buildReferenceDescriptor() {
        let referencePath = currentReferenceSpritePath || '';
        if (queuedReferenceForNextGeneration && queuedReferenceForNextGeneration.prompt) {
            referencePath = `prompt:${queuedReferenceForNextGeneration.prompt}`;
        }

        return {
            referencePath,
            referenceKeyword: inferReferenceKeywordFromPath(referencePath),
        };
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
        img.style.width = `${GENERATION_THUMB_WIDTH}px`;
        img.style.height = `${GENERATION_THUMB_HEIGHT}px`;

        let referenceInfo = buildReferenceDescriptor();

        let snapshot = {
            serial: generationSerial,
            reason,
            imageDataUrl: img.src,
            colorScheme: colorScheme.map(col => [...col]),
            referenceRulePrecision: REFERENCE_RULE_PRECISION,
            colorSchemeOffsetRange: COLOR_SCHEME_OFFSET_RANGE,
            neighborSimilarRange: NEIGHBOR_SIMILAR_RANGE,
            referenceMatchRgbRange: REFERENCE_MATCH_RGB_RANGE,
            sold: false,
            salePrice: 0,
            soldTo: '',
            saleFit: 0,
            referencePath: referenceInfo.referencePath,
            referenceKeyword: referenceInfo.referenceKeyword,
            createdAtYear: new Date().getFullYear(),
        };
        generationHistory.push(snapshot);
        let card = createGenerationCard(snapshot);
        ui.generationStripList.appendChild(card);
        ui.generationStripList.scrollLeft = ui.generationStripList.scrollWidth;

        archivedGenerationSerial = generationSerial;
        archivedPreviewDirty = false;
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

            if (!styleSnap && !colourSnap) {
                applyPersistentPreferencesToGeneration();
            }

            applyEasyStyleInfluenceToGeneration(creature ? creature.energy : 100);
        }

        applyFrozenSchemeConstraints();

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
            } else if (queuedExpressionReferenceForNextGeneration && queuedExpressionReferenceForNextGeneration.spritePath) {
                let expressionReference = queuedExpressionReferenceForNextGeneration;
                queuedExpressionReferenceForNextGeneration = null;

                referenceRuleReady = false;
                let requestId = ++referenceSpriteRequestId;
                p.loadImage(
                    expressionReference.spritePath,
                    (img) => {
                        if (requestId !== referenceSpriteRequestId) return;
                        referenceSprite = img;
                        currentReferenceSpritePath = expressionReference.spritePath;

                        let applied = false;
                        try {
                            applied = buildReferenceRuleData();
                        } catch (_) {
                            applied = false;
                        }

                        if (!applied) return;

                        activeReferencePreview.imageUrl = expressionReference.spritePath;
                        activeReferencePreview.caption = `Active: expression sprite (${expressionReference.keyword})`;
                        refreshReferencePreviewCard();
                    },
                    () => {
                        loadRandomReferenceSpriteAndApply();
                    }
                );
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

        let activeScheme = getActiveSchemeColours();
        let sampled = sampleReferenceIndexGrid(referenceSprite, GRID_COLS, GRID_ROWS, activeScheme.length);
        if (!sampled) return false;

        referenceAssociations = sampled.indexGrid;
        referenceColourMap = buildReferenceToSchemeMap(sampled.uniqueColours, activeScheme);
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
        let cellSize = getActiveGridCellSize();
        let w = GRID_COLS * cellSize + (GRID_COLS - 1) * GRID_GAP;
        let h = GRID_ROWS * cellSize + (GRID_ROWS - 1) * GRID_GAP;
        let topOffset = 10;

        let x = p.width - GRID_MARGIN - w + GRID_PANEL_OFFSET_X;
        let y = GRID_MARGIN + topOffset + GRID_PANEL_OFFSET_Y;

        if (
            gridView.isVisible &&
            gridView.openedViaCanvasButton &&
            Number.isFinite(gridView.canvasButtonAnchorX) &&
            Number.isFinite(gridView.canvasButtonAnchorY)
        ) {
            x = gridView.canvasButtonAnchorX + GRID_OPEN_CANVAS_BUTTON_GAP_X;
            y = gridView.canvasButtonAnchorY + GRID_OPEN_CANVAS_BUTTON_OFFSET_Y;

            let minX = GRID_MARGIN;
            let maxX = p.width - GRID_MARGIN - w;
            let minY = GRID_MARGIN + topOffset;
            let maxY = p.height - GRID_MARGIN - h;

            x = p.constrain(x, minX, Math.max(minX, maxX));
            y = p.constrain(y, minY, Math.max(minY, maxY));
        }

        return {
            x,
            y,
            w,
            h,
        };
    }

    function getGridTabRect() {
        let gridRect = getGridRect();
        return {
            x: gridRect.x + GRID_TAB_OFFSET_X,
            y: gridRect.y - GRID_TAB_HEIGHT - GRID_TAB_GAP + GRID_TAB_OFFSET_Y,
            w: GRID_TAB_WIDTH,
            h: GRID_TAB_HEIGHT,
        };
    }

    function getGridPanelBoundsRect() {
        let tab = getGridTabRect();
        let grid = getGridRect();
        let close = getGridTabCloseRect();
        let paint = getPaintButtonRect();
        let palette = paintModeEnabled ? getPaletteRect() : null;
        let scheme = getSchemeRect();

        let minX = Math.min(tab.x, grid.x, close.x, paint.x, scheme.x);
        if (palette) minX = Math.min(minX, palette.x);
        let maxX = Math.max(tab.x + tab.w, grid.x + grid.w);
        let minY = Math.min(tab.y, close.y, paint.y);
        let maxY = Math.max(grid.y + grid.h, close.y + close.h, paint.y + paint.h, scheme.y + scheme.h);
        if (palette) maxY = Math.max(maxY, palette.y + palette.h);

        return {
            x: minX - GRID_PANEL_PADDING,
            y: minY - GRID_PANEL_PADDING,
            w: (maxX - minX) + GRID_PANEL_PADDING * 2,
            h: (maxY - minY) + GRID_PANEL_PADDING * 2,
        };
    }

    function getGridTabCloseRect() {
        let rect = getGridRect();
        let buttonGap = 6;
        let buttonSize = Math.max(10, GRID_CANVAS_TAB_BUTTON_SIZE);
        let clusterHeight = buttonSize * 2 + buttonGap;
        let baseY = rect.y + rect.h * 0.5 - clusterHeight * 0.5;
        return {
            x: rect.x - buttonSize - GRID_TAB_GAP + GRID_CLOSE_BUTTON_OFFSET_X,
            y: baseY + GRID_CLOSE_BUTTON_OFFSET_Y,
            w: buttonSize,
            h: buttonSize,
        };
    }

    function getGridScaleBoundsFromPanelSize() {
        let panelBounds = getGridPanelBoundsRect();
        let baseW = Math.max(1, panelBounds.w);
        let baseH = Math.max(1, panelBounds.h);

        let minScaleFromSize = Math.max(
            GRID_PANEL_MIN_WIDTH / baseW,
            GRID_PANEL_MIN_HEIGHT / baseH
        );
        let maxScaleFromSize = Math.min(
            GRID_PANEL_MAX_WIDTH / baseW,
            GRID_PANEL_MAX_HEIGHT / baseH
        );

        minScaleFromSize = Math.max(0.05, minScaleFromSize);
        maxScaleFromSize = Math.max(minScaleFromSize, maxScaleFromSize);

        return {
            min: minScaleFromSize,
            max: maxScaleFromSize,
        };
    }

    function getGridReopenTabRectScreen() {
        return {
            x: p.width - 136,
            y: 52,
            w: 120,
            h: 26,
        };
    }

    function getPaintButtonRect() {
        let gridRect = getGridRect();
        let sideSize = Math.max(10, GRID_CANVAS_TAB_BUTTON_SIZE);
        return {
            x: gridRect.x - sideSize - SCHEME_GAP + GRID_PAINT_BUTTON_OFFSET_X,
            y: gridRect.y + GRID_PAINT_BUTTON_OFFSET_Y,
            w: sideSize,
            h: sideSize,
        };
    }

    function getPaletteRect() {
        let paintRect = getPaintButtonRect();
        let paletteCount = getPaintPaletteChoices().length;
        return {
            x: paintRect.x,
            y: paintRect.y + paintRect.h + SCHEME_GAP,
            w: paintRect.w,
            h: paletteCount * PALETTE_TILE_SIZE + (paletteCount - 1) * SCHEME_GAP,
        };
    }

    function getSchemeRect() {
        let paintRect = getPaintButtonRect();
        let y = paintRect.y + paintRect.h + SCHEME_GAP;
        let x = paintRect.x;
        if (paintModeEnabled) {
            x = paintRect.x + paintRect.w + SCHEME_GAP * 2;
        }
        return {
            x,
            y,
            w: paintRect.w,
            h: COLOR_SCHEME_COUNT * SCHEME_TILE_SIZE + (COLOR_SCHEME_COUNT - 1) * SCHEME_GAP,
        };
    }

    function drawColorGrid() {
        if (!gridView.isVisible) {
            let reopen = getGridReopenTabRectScreen();
            p.push();
            p.noStroke();
            p.fill(248, 245);
            p.rect(reopen.x, reopen.y, reopen.w, reopen.h, 7);
            p.fill(40);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(11);
            p.text('Open Canvas Tab', reopen.x + reopen.w / 2, reopen.y + reopen.h / 2);
            p.pop();
            return;
        }

        let paintRect = getPaintButtonRect();
        let paletteRect = getPaletteRect();
        let schemeRect = getSchemeRect();
        let rect = getGridRect();
        let tabRect = getGridTabRect();
        let closeRect = getGridTabCloseRect();
        let panelBounds = getGridPanelBoundsRect();

        p.push();
        p.translate(gridView.panX, gridView.panY);
        p.scale(gridView.scale);
        p.noStroke();

        // Window-like background around tab + controls + grid.
        p.fill(255, 245);
        p.rect(panelBounds.x, panelBounds.y, panelBounds.w, panelBounds.h, 10);

        if (GRID_AREAS_VISIBLE) {
            p.noFill();
            p.stroke(50, 110, 210, 220);
            p.strokeWeight(2);
            p.rect(panelBounds.x, panelBounds.y, panelBounds.w, panelBounds.h, 10);
            p.stroke(40, 150, 220, 230);
            p.rect(tabRect.x, tabRect.y, tabRect.w, tabRect.h, 6);
            p.stroke(40, 180, 120, 220);
            p.rect(rect.x, rect.y, rect.w, rect.h, 4);
            p.noStroke();
        }

        p.fill(248);
        p.rect(closeRect.x, closeRect.y, closeRect.w, closeRect.h, 4);
        if (exitButtonSprite) {
            p.imageMode(p.CORNER);
            p.image(exitButtonSprite, closeRect.x, closeRect.y, closeRect.w, closeRect.h);
        } else {
            p.fill(45);
            p.text('×', closeRect.x + closeRect.w / 2, closeRect.y + closeRect.h / 2);
        }

        p.fill(248);
        p.rect(paintRect.x, paintRect.y, paintRect.w, paintRect.h, 4);
        if (paintbrushButtonSprite) {
            p.imageMode(p.CORNER);
            p.image(paintbrushButtonSprite, paintRect.x, paintRect.y, paintRect.w, paintRect.h);
        } else {
            p.fill(40);
            p.textSize(15);
            p.text('🖌', paintRect.x + paintRect.w / 2, paintRect.y + paintRect.h / 2 + 0.5);
        }
        if (paintModeEnabled) {
            p.noFill();
            p.stroke(52);
            p.strokeWeight(2);
            p.rect(paintRect.x - 1, paintRect.y - 1, paintRect.w + 2, paintRect.h + 2, 5);
            p.noStroke();
        }

        let paintPalette = getPaintPaletteChoices();
        if (selectedPaintColourIndex >= paintPalette.length) {
            selectedPaintColourIndex = 0;
        }

        if (paintModeEnabled) {
            for (let i = 0; i < paintPalette.length; i++) {
                let px = paletteRect.x;
                let py = paletteRect.y + i * (PALETTE_TILE_SIZE + SCHEME_GAP);
                let col = paintPalette[i];
                p.fill(col[0], col[1], col[2]);
                p.rect(px, py, PALETTE_TILE_SIZE, PALETTE_TILE_SIZE, 3);

                if (i === selectedPaintColourIndex) {
                    p.noFill();
                    p.stroke(20);
                    p.strokeWeight(2);
                    p.rect(px - 2, py - 2, PALETTE_TILE_SIZE + 4, PALETTE_TILE_SIZE + 4, 4);
                    p.noStroke();
                }
            }
        }

        for (let i = 0; i < colorScheme.length; i++) {
            let sx = schemeRect.x;
            let sy = schemeRect.y + i * (SCHEME_TILE_SIZE + SCHEME_GAP);
            p.fill(...colorScheme[i]);
            p.rect(sx, sy, SCHEME_TILE_SIZE, SCHEME_TILE_SIZE, 3);

            if (frozenSchemeSlots[i]) {
                p.noFill();
                p.stroke(25);
                p.strokeWeight(2);
                p.rect(sx - 1, sy - 1, SCHEME_TILE_SIZE + 2, SCHEME_TILE_SIZE + 2, 4);
                p.line(sx + 2, sy + 2, sx + SCHEME_TILE_SIZE - 2, sy + SCHEME_TILE_SIZE - 2);
                p.line(sx + SCHEME_TILE_SIZE - 2, sy + 2, sx + 2, sy + SCHEME_TILE_SIZE - 2);
                p.noStroke();
            }
        }

        p.fill(255, 235);
        p.rect(rect.x - 8, rect.y - 8, rect.w + 16, rect.h + 16, 8);

        let cellSize = getActiveGridCellSize();
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                let x = rect.x + c * (cellSize + GRID_GAP);
                let y = rect.y + r * (cellSize + GRID_GAP);
                p.fill(...gridColors[r][c]);
                p.rect(x, y, cellSize, cellSize, 3);
            }
        }

        if (REFERENCE_DEBUG_ENABLED) {
            drawReferenceDebugOverlay(rect);
        }
        p.pop();

        syncArchivedGenerationPreview();
    }

    function drawReferenceDebugOverlay(rect) {
        p.push();

        if (referenceRuleReady && referenceAssociations && referenceColourMap) {
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(8);
            let cellSize = getActiveGridCellSize();
            for (let r = 0; r < GRID_ROWS; r++) {
                for (let c = 0; c < GRID_COLS; c++) {
                    let associationIndex = referenceAssociations[r][c];
                    if (associationIndex < 0) continue;

                    let x = rect.x + c * (cellSize + GRID_GAP);
                    let y = rect.y + r * (cellSize + GRID_GAP);
                    let mapped = referenceColourMap[associationIndex] || [0, 0, 0];

                    p.noFill();
                    p.stroke(mapped[0], mapped[1], mapped[2], 200);
                    p.strokeWeight(1);
                    p.rect(x + 1, y + 1, cellSize - 2, cellSize - 2, 2);

                    if (cellSize >= 12) {
                        let labelLum = colourLuminance(mapped);
                        p.noStroke();
                        p.fill(labelLum > 140 ? 15 : 245);
                        p.text(String(associationIndex), x + cellSize * 0.5, y + cellSize * 0.52);
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
        let activeScheme = getActiveSchemeColours();
        let base = activeScheme[p.floor(p.random(activeScheme.length))];
        return similarTo(base, range);
    }

    function markGridChanged(r, c) {
        if (!gridChanged[r][c]) {
            gridChanged[r][c] = true;
            gridChangedCount++;
        }

        if (archivedGenerationSerial === generationSerial) {
            archivedPreviewDirty = true;
        }
    }

    function syncArchivedGenerationPreview(force = false) {
        if (archivedGenerationSerial !== generationSerial) return;
        if (!archivedPreviewDirty && !force) return;

        let now = p.millis();
        if (!force && (now - lastArchivePreviewSyncAt) < ARCHIVE_PREVIEW_SYNC_MS) return;

        let snapshot = generationHistory.find(item => item.serial === generationSerial);
        if (!snapshot) return;

        try {
            snapshot.imageDataUrl = buildGridSnapshotDataURL();
        } catch (_) {
            return;
        }

        if (ui.generationStripList) {
            let card = ui.generationStripList.querySelector(`.generation-thumb[data-serial="${snapshot.serial}"]`);
            if (card) {
                let img = card.querySelector('img');
                if (img) img.src = snapshot.imageDataUrl;
            }
        }

        if (selectedHistorySerial === snapshot.serial && ui.generationPopupImage && ui.generationPopup && !ui.generationPopup.hidden) {
            ui.generationPopupImage.src = snapshot.imageDataUrl;
        }

        saveGenerationHistoryToStorage();
        archivedPreviewDirty = false;
        lastArchivePreviewSyncAt = now;
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
        if (generationPaused) return;
        if (isRestingNow()) return;

        let elapsedMs = now - lastGridRandomizeAt;
        let speedMultiplier = getStackedGridSpeedMultiplier(creature);
        let effectiveGridIntervalMs = GRID_RANDOM_INTERVAL_MS / p.max(1, speedMultiplier);
        if (elapsedMs < effectiveGridIntervalMs) return;

        let energyRatio = p.constrain((creature ? creature.energy : 100) / 100, 0, 1);
        let tiredness = 1 - energyRatio;
        let dynamicPauseThreshold = p.constrain(
            PAUSE_INTERACTION_THRESHOLD - tiredness * 0.04,
            0.9,
            PAUSE_INTERACTION_THRESHOLD
        );

        let hungerSpeed = p.constrain((creature ? creature.need : 50) / 100, 0.08, 1);
        let effectiveUpdatesPerSecond = GRID_UPDATES_PER_SECOND * hungerSpeed;
        effectiveUpdatesPerSecond *= speedMultiplier;

        // Convert elapsed time into a bounded batch count so updates are not tied to frame rate.
        let updates = Math.floor((elapsedMs * effectiveUpdatesPerSecond) / 1000);
        updates = p.constrain(updates, 0, GRID_MAX_UPDATES_PER_FRAME);
        if (updates <= 0) return;

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
                archiveCurrentGeneration('finished');
                break;
            }

            if (interactedRatio() > dynamicPauseThreshold && p.random() < PAUSE_AFTER_THRESHOLD_CHANCE) {
                generationPaused = true;
                archiveCurrentGeneration('paused');
                break;
            }
        }

        lastGridRandomizeAt = now;
    }

    function paintGridCellAt(mx, my) {
        if (!paintModeEnabled || !gridView.isVisible) return false;

        let point = getGridSpacePoint(mx, my);
        let rect = getGridRect();
        if (point.x < rect.x || point.y < rect.y || point.x > rect.x + rect.w || point.y > rect.y + rect.h) {
            return false;
        }

        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                let cellSize = getActiveGridCellSize();
                let x = rect.x + c * (cellSize + GRID_GAP);
                let y = rect.y + r * (cellSize + GRID_GAP);
                if (point.x >= x && point.x <= x + cellSize && point.y >= y && point.y <= y + cellSize) {
                    let paintPalette = getPaintPaletteChoices();
                    let choice = paintPalette[selectedPaintColourIndex] || paintPalette[0];
                    gridColors[r][c] = [...choice];
                    markGridChanged(r, c);
                    return true;
                }
            }
        }

        return false;
    }

    function handleGridClick(mx, my) {
        if (!gridView.isVisible) {
            let reopen = getGridReopenTabRectScreen();
            if (mx >= reopen.x && mx <= reopen.x + reopen.w && my >= reopen.y && my <= reopen.y + reopen.h) {
                gridView.isVisible = true;
                gridView.openedViaCanvasButton = false;
                let scaleBounds = getGridScaleBoundsFromPanelSize();
                gridView.scale = p.constrain(GRID_DEFAULT_OPEN_SCALE, scaleBounds.min, scaleBounds.max);
                gridView.isZoomedTab = false;
                return true;
            }
            return false;
        }

        let point = getGridSpacePoint(mx, my);

        let closeRect = getGridTabCloseRect();
        if (point.x >= closeRect.x && point.x <= closeRect.x + closeRect.w &&
            point.y >= closeRect.y && point.y <= closeRect.y + closeRect.h) {
            gridView.isVisible = false;
            gridView.openedViaCanvasButton = false;
            return true;
        }

        let paintRect = getPaintButtonRect();
        if (point.x >= paintRect.x && point.x <= paintRect.x + paintRect.w &&
            point.y >= paintRect.y && point.y <= paintRect.y + paintRect.h) {
            paintModeEnabled = !paintModeEnabled;
            return true;
        }

        let paletteRect = getPaletteRect();
        if (paintModeEnabled &&
            point.x >= paletteRect.x && point.x <= paletteRect.x + paletteRect.w &&
            point.y >= paletteRect.y && point.y <= paletteRect.y + paletteRect.h) {
            let paintPalette = getPaintPaletteChoices();
            for (let i = 0; i < paintPalette.length; i++) {
                let py = paletteRect.y + i * (PALETTE_TILE_SIZE + SCHEME_GAP);
                if (point.y >= py && point.y <= py + PALETTE_TILE_SIZE) {
                    selectedPaintColourIndex = i;
                    return true;
                }
            }
            return true;
        }

        let schemeRect = getSchemeRect();
        if (point.x >= schemeRect.x && point.x <= schemeRect.x + schemeRect.w &&
            point.y >= schemeRect.y && point.y <= schemeRect.y + schemeRect.h) {
            for (let i = 0; i < colorScheme.length; i++) {
                let sy = schemeRect.y + i * (SCHEME_TILE_SIZE + SCHEME_GAP);
                if (point.y >= sy && point.y <= sy + SCHEME_TILE_SIZE) {
                    ensureSchemeLockArraysLength();
                    frozenSchemeSlots[i] = !frozenSchemeSlots[i];
                    frozenSchemeValues[i] = frozenSchemeSlots[i] ? [...colorScheme[i]] : null;
                    buildReferenceRuleData();
                    lastFeedbackAction = frozenSchemeSlots[i]
                        ? `freeze-colour-${i + 1}`
                        : `unfreeze-colour-${i + 1}`;
                    return true;
                }
            }
            return true;
        }

        let rect = getGridRect();
        if (point.x < rect.x || point.y < rect.y || point.x > rect.x + rect.w || point.y > rect.y + rect.h) return false;

        if (paintModeEnabled) {
            return paintGridCellAt(mx, my);
        }

        // Grid clicks are consumed, but manual painting is only active in paint mode.
        return true;
    }


    // ============================================================
    //  INPUT: MOUSE CLICK
    // ============================================================

    function onCanvasPointerDown(event) {
        if (event.button === 0 && startFoodDragAt(p.mouseX, p.mouseY)) {
            return false;
        }

        if (!gridView.isVisible) {
            onCanvasClick();
            return false;
        }

        let point = getGridSpacePoint(p.mouseX, p.mouseY);
        let tabRect = getGridTabRect();
        let panelRect = getGridPanelBoundsRect();
        let paintRect = getPaintButtonRect();
        let paletteRect = getPaletteRect();
        let closeRect = getGridTabCloseRect();

        let pointInRect = (pt, r) => (
            pt.x >= r.x && pt.x <= r.x + r.w &&
            pt.y >= r.y && pt.y <= r.y + r.h
        );

        let onClose = pointInRect(point, closeRect);
        let onPaintToggle = pointInRect(point, paintRect);
        let onPalette = paintModeEnabled && pointInRect(point, paletteRect);
        let schemeRect = getSchemeRect();
        let onScheme = pointInRect(point, schemeRect);

        let rect = getGridRect();
        let onCanvasSquare = false;
        if (point.x >= rect.x && point.y >= rect.y && point.x <= rect.x + rect.w && point.y <= rect.y + rect.h) {
            let cellSize = getActiveGridCellSize();
            let cellStep = cellSize + GRID_GAP;
            let localX = point.x - rect.x;
            let localY = point.y - rect.y;
            let xInCell = (localX % cellStep) <= cellSize;
            let yInCell = (localY % cellStep) <= cellSize;
            onCanvasSquare = xInCell && yInCell;
        }

        if (event.button === 0 && point.x >= tabRect.x && point.x <= tabRect.x + tabRect.w &&
            point.y >= tabRect.y && point.y <= tabRect.y + tabRect.h) {
            // Skip drag when clicking action buttons.
            if (!onClose) {
                gridView.isPanning = true;
                return false;
            }
        }

        // Drag from panel/background when not clicking controls and not clicking a paintable square.
        if (event.button === 0 && pointInRect(point, panelRect)) {
            if (!onClose && !onPaintToggle && !onPalette && !onScheme) {
                if (!paintModeEnabled || !onCanvasSquare) {
                    gridView.isPanning = true;
                    return false;
                }
            }
        }

        if (isGridPanEvent(event)) {
            gridView.isPanning = true;
            return false;
        }
        onCanvasClick();
        return false;
    }

    p.mouseDragged = function() {
        if (draggedFoodItemId != null) {
            return false;
        }

        if (gridView.isPanning) {
            gridView.panX += p.movedX;
            gridView.panY += p.movedY;
            return false;
        }

        if (paintModeEnabled && p.mouseButton === p.LEFT) {
            if (paintGridCellAt(p.mouseX, p.mouseY)) return false;
        }
    };

    function onCanvasClick() {
        if (gridView.spaceDown || gridView.isPanning) return;
        if (handleGridClick(p.mouseX, p.mouseY)) return;
        if (WORLD_AREA_BUTTONS_VISIBLE) {
            if (isPointInWorldAreaButton(p.mouseX, p.mouseY, WORLD_AREA_1_X, WORLD_AREA_1_Y)) {
                openRadialPromptModal();
                return;
            }
            if (isPointInWorldAreaButton(p.mouseX, p.mouseY, WORLD_AREA_2_X, WORLD_AREA_2_Y)) {
                gridView.isVisible = true;
                gridView.openedViaCanvasButton = false;
                let scaleBounds = getGridScaleBoundsFromPanelSize();
                gridView.scale = p.constrain(GRID_DEFAULT_OPEN_SCALE, scaleBounds.min, scaleBounds.max);
                gridView.isZoomedTab = false;
                return;
            }
        }
        if (!micActive) startMic();
        
        let d = p.dist(p.mouseX, p.mouseY, creature.x, creature.y);
        if (d < CREATURE_SIZE / 2) {
            let longRestActive = isLongRestActive();
            let shortRestActive = isShortRestActive();
            if (shortRestActive || longRestActive) {
                if (ui.radialMenu) ui.radialMenu.classList.remove('radial-active');

                if (longRestActive) {
                    playSoundEffect('shakeWake');
                    restState.longRestUntil = Math.max(Date.now(), restState.longRestUntil - LONG_REST_CLICK_REDUCTION_MS);
                    restWakeShakeFrames = REST_WAKE_SHAKE_FRAMES;
                    if (!isLongRestActive()) {
                        restState.longRestUntil = 0;
                        wasLongRestActive = false;
                        showWakeUpDialogue('long');
                    }
                    saveState(creature);
                    return;
                }

                if (shortRestActive) {
                    playSoundEffect('shakeWake');
                    shortRestWakeClicks += 1;
                    restWakeShakeFrames = REST_WAKE_SHAKE_FRAMES;
                    if (shortRestWakeClicks >= SHORT_REST_WAKE_CLICKS_REQUIRED) {
                        restState.shortActive = false;
                        restState.shortRestUntil = 0;
                        shortRestWakeClicks = 0;
                        wasShortRestActive = false;
                        showWakeUpDialogue('short');
                        saveState(creature);
                    }
                    return;
                }
            }

            if (ui.radialMenu) {
                if (creatureQuestionState.active) {
                    openCreatureQuestionInteraction();
                } else {
                    ui.radialMenu.classList.add('radial-active');
                    updateRadialMenuPosition(creature);
                }
            }
        } else {
            // Close menu if clicking outside creature
            if (ui.radialMenu) {
                ui.radialMenu.classList.remove('radial-active');
            }
        }
    }

    p.mouseReleased = function() {
        if (finishFoodDrag()) {
            gridView.isPanning = false;
            return false;
        }
        gridView.isPanning = false;
    };

    p.doubleClicked = function() {
        return false;
    };

    p.mouseWheel = function(event) {
        if (!gridView.isVisible) return;
        let point = getGridSpacePoint(p.mouseX, p.mouseY);
        let panelBounds = getGridPanelBoundsRect();
        let cursorInPanel = point.x >= panelBounds.x && point.x <= panelBounds.x + panelBounds.w &&
            point.y >= panelBounds.y && point.y <= panelBounds.y + panelBounds.h;
        if (!cursorInPanel) return;

        let localBefore = getGridSpacePoint(p.mouseX, p.mouseY);
        if (localBefore.x < panelBounds.x || localBefore.y < panelBounds.y ||
            localBefore.x > panelBounds.x + panelBounds.w || localBefore.y > panelBounds.y + panelBounds.h) {
            return;
        }

        let scaleBounds = getGridScaleBoundsFromPanelSize();
        gridView.minScale = scaleBounds.min;
        gridView.maxScale = scaleBounds.max;

        let oldScale = gridView.scale;
        let rawDelta = Number(event && (event.deltaY ?? event.delta) || 0);
        if (!Number.isFinite(rawDelta) || rawDelta === 0) return false;

        let zoomFactor = rawDelta < 0 ? 1.08 : (1 / 1.08);
        let nextScale = p.constrain(oldScale * zoomFactor, scaleBounds.min, scaleBounds.max);
        if (nextScale === oldScale) return false;

        gridView.scale = nextScale;
        gridView.isZoomedTab = gridView.scale > (scaleBounds.min + 0.02);
        gridView.panX = p.mouseX - localBefore.x * nextScale;
        gridView.panY = p.mouseY - localBefore.y * nextScale;
        return false;
    };

    function setShopStatus(message, isError = false) {
        if (!ui.shopStatus) return;
        ui.shopStatus.textContent = message || '';
        ui.shopStatus.style.color = isError ? '#b4432b' : 'var(--dark)';
    }

    function showShopPurchaseReaction(kind, label = '') {
        if (typeof window._showNpcDialogueWithExpr !== 'function') return;

        let text = '';
        if (kind === 'palette') {
            text = 'More colours to play with. I can already see new combinations. [expr:happy]';
        } else if (kind === 'computer') {
            text = 'A computer? Nice. I can search for references properly now. [expr:confident]';
        } else if (kind === 'music') {
            text = `This track sets a good mood for painting: ${label}. [expr:pride]`;
        } else if (kind === 'studio-wall') {
            text = `The studio feels different already with ${label}. [expr:confident]`;
        } else if (kind === 'studio-decor') {
            text = `${label} makes the space feel more like ours. [expr:happy]`;
        } else if (kind === 'gallery-wall') {
            text = `${label} gives the gallery a cleaner look. [expr:neutral]`;
        }

        if (text) {
            window._showNpcDialogueWithExpr(text);
        }
    }

    function updateSearchFeatureGateUI() {
        if (ui.searchOpenButton) {
            ui.searchOpenButton.disabled = !hasComputerUpgrade;
            ui.searchOpenButton.style.display = hasComputerUpgrade ? 'flex' : 'none';
        }
        if (ui.shopComputerNote) {
            ui.shopComputerNote.textContent = hasComputerUpgrade
                ? 'Computer installed. Search Generation is unlocked.'
                : 'Computer not owned. Buy one to unlock Search Generation.';
        }
        refreshAreaButtonSprites();
    }

    function getPaletteUpgradePrice() {
        return SHOP_PALETTE_UPGRADE_BASE_PRICE + paletteUpgradeCount * SHOP_PALETTE_UPGRADE_STEP_PRICE;
    }

    function getCustomCanvasDraft() {
        let cols = ui.shopCustomColsInput ? Number(ui.shopCustomColsInput.value) : GRID_COLS;
        let rows = ui.shopCustomRowsInput ? Number(ui.shopCustomRowsInput.value) : GRID_ROWS;

        cols = Math.max(10, Math.min(GRID_MAX_COLS, Math.floor(cols || GRID_COLS)));
        rows = Math.max(10, Math.min(GRID_MAX_ROWS, Math.floor(rows || GRID_ROWS)));

        let totalCells = cols * rows;
        if (totalCells > GRID_MAX_TOTAL_CELLS) {
            rows = Math.max(10, Math.floor(GRID_MAX_TOTAL_CELLS / cols));
            totalCells = cols * rows;
        }

        let price = Math.max(30, Math.round(totalCells * SHOP_CANVAS_CUSTOM_PRICE_PER_CELL));
        return { cols, rows, totalCells, price };
    }

    function refreshShopUI() {
        let foodButtonMap = {
            apple: ui.shopBuyFoodAppleButton,
            burger: ui.shopBuyFoodBurgerButton,
            sandwich: ui.shopBuyFoodSandwichButton,
            'energy-drink': ui.shopBuyFoodEnergyDrinkButton,
        };

        for (let i = 0; i < SHOP_FOOD_VARIANTS.length; i++) {
            let foodType = SHOP_FOOD_VARIANTS[i];
            let button = foodButtonMap[foodType.id];
            if (!button) continue;
            setShopButtonLabel(button, `${foodType.label} (${foodEffectText(foodType)}) · ${foodType.price} coins`);
            button.disabled = galleryCoins < foodType.price;
        }

        if (ui.shopBuyCanvasLongButton) {
            ui.shopBuyCanvasLongButton.textContent = `Long canvas (52x24) · ${SHOP_CANVAS_LONG_PRICE} coins`;
        }
        if (ui.shopBuyCanvasWideButton) {
            ui.shopBuyCanvasWideButton.textContent = `Wide canvas (24x52) · ${SHOP_CANVAS_WIDE_PRICE} coins`;
        }
        if (ui.shopBuyCanvasBigButton) {
            ui.shopBuyCanvasBigButton.textContent = `Big canvas (44x44) · ${SHOP_CANVAS_BIG_PRICE} coins`;
        }

        if (ui.shopBuyCanvasCustomButton) {
            let draft = getCustomCanvasDraft();
            ui.shopBuyCanvasCustomButton.textContent = `Buy custom (${draft.cols}x${draft.rows}) · ${draft.price}`;
        }

        if (ui.shopBuyPaletteButton) {
            if (COLOR_SCHEME_COUNT >= SHOP_PALETTE_MAX_SLOTS) {
                ui.shopBuyPaletteButton.textContent = `Palette slots maxed (${COLOR_SCHEME_COUNT})`;
                ui.shopBuyPaletteButton.disabled = true;
            } else {
                ui.shopBuyPaletteButton.textContent = `+1 palette colour slot (${COLOR_SCHEME_COUNT}→${COLOR_SCHEME_COUNT + 1}) · ${getPaletteUpgradePrice()} coins`;
                ui.shopBuyPaletteButton.disabled = false;
            }
        }

        if (ui.shopBuyComputerButton) {
            ui.shopBuyComputerButton.textContent = hasComputerUpgrade
                ? 'Computer purchased (search unlocked)'
                : `Buy computer (unlock search) · ${SHOP_COMPUTER_PRICE} coins`;
            ui.shopBuyComputerButton.disabled = hasComputerUpgrade;
        }
        if (ui.shopBuyProgressResetButton) {
            ui.shopBuyProgressResetButton.textContent = `Progress Reset · ${SHOP_PROGRESS_RESET_PRICE} coins`;
            ui.shopBuyProgressResetButton.disabled = galleryCoins < SHOP_PROGRESS_RESET_PRICE;
        }

        let musicButtonMap = {
            'classical-background': ui.shopMusicClassicalButton,
        };

        for (let i = 0; i < SHOP_MUSIC_TRACKS.length; i++) {
            let track = SHOP_MUSIC_TRACKS[i];
            let button = musicButtonMap[track.id];
            if (!button) continue;

            let owned = ownedShopMusicTrackIds.includes(track.id);
            let active = activeShopMusicTrackId === track.id;

            if (owned && active) {
                setShopButtonLabel(button, `${track.label} (playing)`);
            } else if (owned) {
                setShopButtonLabel(button, `${track.label} (owned)`);
            } else {
                setShopButtonLabel(button, `${track.label} · ${track.price} coins`);
            }
            button.disabled = false;
        }

        function setShopButtonLabel(button, text) {
            if (!button) return;
            let labelNode = button.querySelector('.shop-item-label');
            if (labelNode) {
                labelNode.textContent = text;
            } else {
                button.textContent = text;
            }
        }

        let studioWallButtonMap = {
            cloud: ui.shopStudioWallCloudButton,
            rose: ui.shopStudioWallRoseButton,
            ink: ui.shopStudioWallInkButton,
            moss: ui.shopStudioWallMossButton,
        };

        for (let i = 0; i < STUDIO_WALL_THEMES.length; i++) {
            let theme = STUDIO_WALL_THEMES[i];
            let button = studioWallButtonMap[theme.id];
            if (!button) continue;

            let owned = ownedStudioWallThemeIds.includes(theme.id);
            let active = activeStudioWallThemeId === theme.id;

            if (owned && active) {
                setShopButtonLabel(button, `${theme.label} (active)`);
            } else if (owned) {
                setShopButtonLabel(button, `${theme.label} (owned)`);
            } else {
                setShopButtonLabel(button, `${theme.label} · ${theme.price} coins`);
            }
            button.disabled = false;
        }

        let studioDecorButtonMap = {
            'frame-favorite': ui.shopStudioDecorFavoriteButton,
            'plant-vase': ui.shopStudioDecorPlantVaseButton,
            'golden-statue': ui.shopStudioDecorGoldenStatueButton,
            'pet-mush': ui.shopStudioDecorPetMushButton,
            'expensive_painting': ui.shopStudioDecorExpensivePaintingButton,
            'lamp': ui.shopStudioDecorLampButton,
        };

        for (let i = 0; i < STUDIO_DECOR_THEMES.length; i++) {
            let theme = STUDIO_DECOR_THEMES[i];
            let button = studioDecorButtonMap[theme.id];
            if (!button) continue;

            let owned = ownedStudioDecorThemeIds.includes(theme.id);

            if (owned) {
                setShopButtonLabel(button, `${theme.label} (active, owned)`);
            } else {
                setShopButtonLabel(button, `${theme.label} · ${theme.price} coins`);
            }
            button.disabled = false;
        }

        let wallButtonMap = {
            sage: ui.shopWallSageButton,
            linen: ui.shopWallLinenButton,
            clay: ui.shopWallClayButton,
            slate: ui.shopWallSlateButton,
        };

        for (let i = 0; i < GALLERY_WALL_THEMES.length; i++) {
            let theme = GALLERY_WALL_THEMES[i];
            let button = wallButtonMap[theme.id];
            if (!button) continue;

            let owned = ownedGalleryWallThemeIds.includes(theme.id);
            let active = activeGalleryWallThemeId === theme.id;

            if (owned && active) {
                setShopButtonLabel(button, `${theme.label} (active)`);
            } else if (owned) {
                setShopButtonLabel(button, `${theme.label} (owned)`);
            } else {
                setShopButtonLabel(button, `${theme.label} · ${theme.price} coins`)
                button.textContent = `${theme.label} · ${theme.price} coins`;
            }
            button.disabled = false;
        }

        updateSearchFeatureGateUI();
    }
    function buyOrSelectGalleryWall(themeId) {
        ensureGalleryWallState();
        let theme = getGalleryWallThemeById(themeId);
        let owned = ownedGalleryWallThemeIds.includes(theme.id);
        let previousThemeId = activeGalleryWallThemeId;
        let wasPurchasedNow = false;

        if (!owned && theme.price > 0) {
            if (galleryCoins < theme.price) {
                setShopStatus('Not enough coins for that gallery wall.', true);
                return;
            }
            galleryCoins -= theme.price;
            playSoundEffect('purchase');
            ownedGalleryWallThemeIds.push(theme.id);
            setShopStatus(`Purchased gallery wall: ${theme.label}`);
            wasPurchasedNow = true;
        } else if (!owned) {
            ownedGalleryWallThemeIds.push(theme.id);
            setShopStatus(`Unlocked gallery wall: ${theme.label}`);
            wasPurchasedNow = true;
        } else {
            setShopStatus(`Selected gallery wall: ${theme.label}`);
        }

        activeGalleryWallThemeId = theme.id;
        applyActiveGalleryWallTheme();
        if (activeGalleryWallThemeId !== previousThemeId) {
            playSoundEffect('renovate');
        }
        if (wasPurchasedNow) {
            showShopPurchaseReaction('gallery-wall', theme.label);
        }
        refreshShopUI();
        saveState(creature);
    }

    function buyOrSelectStudioWall(themeId) {
        ensureStudioWallState();
        let theme = getStudioWallThemeById(themeId);
        let owned = ownedStudioWallThemeIds.includes(theme.id);
        let previousThemeId = activeStudioWallThemeId;
        let wasPurchasedNow = false;

        if (!owned && theme.price > 0) {
            if (galleryCoins < theme.price) {
                setShopStatus('Not enough coins for that studio wall.', true);
                return;
            }
            galleryCoins -= theme.price;
            playSoundEffect('purchase');
            ownedStudioWallThemeIds.push(theme.id);
            setShopStatus(`Purchased studio wall: ${theme.label}`);
            wasPurchasedNow = true;
        } else if (!owned) {
            ownedStudioWallThemeIds.push(theme.id);
            setShopStatus(`Unlocked studio wall: ${theme.label}`);
            wasPurchasedNow = true;
        } else {
            setShopStatus(`Selected studio wall: ${theme.label}`);
        }

        activeStudioWallThemeId = theme.id;
        applyActiveStudioWallTheme();
        if (activeStudioWallThemeId !== previousThemeId) {
            playSoundEffect('renovate');
        }
        if (wasPurchasedNow) {
            showShopPurchaseReaction('studio-wall', theme.label);
        }
        refreshShopUI();
        saveState(creature);
    }

    function buyOrSelectStudioDecor(themeId) {
        ensureStudioDecorState();
        let theme = getStudioDecorThemeById(themeId);
        let owned = ownedStudioDecorThemeIds.includes(theme.id);
        let wasPurchasedNow = false;

        if (!owned && theme.price > 0) {
            if (galleryCoins < theme.price) {
                setShopStatus('Not enough coins for that studio decor.', true);
                return;
            }
            galleryCoins -= theme.price;
            playSoundEffect('purchase');
            ownedStudioDecorThemeIds.push(theme.id);
            setShopStatus(`Purchased studio decor: ${theme.label}`);
            wasPurchasedNow = true;
        } else if (!owned) {
            ownedStudioDecorThemeIds.push(theme.id);
            setShopStatus(`Unlocked studio decor: ${theme.label}`);
            wasPurchasedNow = true;
        } else {
            setShopStatus(`Studio decor already active: ${theme.label}`);
        }

        if (wasPurchasedNow) {
            showShopPurchaseReaction('studio-decor', theme.label);
        }
        refreshShopUI();
        saveState(creature);
    }

    function getSoundEffectTemplate(effectId) {
        let path = SOUND_EFFECT_PATHS[effectId];
        if (!path) return null;
        if (!soundEffectTemplates[effectId]) {
            soundEffectTemplates[effectId] = new Audio(path);
            soundEffectTemplates[effectId].preload = 'auto';
        }
        return soundEffectTemplates[effectId];
    }

    function playSoundEffect(effectId, customVolume = null) {
        let template = getSoundEffectTemplate(effectId);
        if (!template) return;

        let audio = template.cloneNode();
        let volume = customVolume == null ? SOUND_EFFECT_VOLUMES[effectId] : customVolume;
        audio.volume = p.constrain(Number(volume) || 0.5, 0, 1);
        soundEffectLastPlayAt[effectId] = Date.now();
        audio.play().catch(() => {});
    }

    function playEatingSoundBurst() {
        let playCount = p.floor(p.random(1, 4));
        let elapsedMs = 0;
        for (let i = 0; i < playCount; i++) {
            let jitter = p.floor(p.random(120, 260));
            elapsedMs += jitter;
            let volume = p.random(0.42, 0.58);
            setTimeout(() => {
                playSoundEffect('eating', volume);
            }, elapsedMs);
        }
    }

    function openShopModal() {
        if (!ui.shopModal) return;
        ui.shopModal.classList.add('active');
        ui.shopModal.setAttribute('aria-hidden', 'false');
        setShopStatus('Spend coins earned from sales.');
        refreshShopUI();
    }

    function closeShopModal() {
        if (!ui.shopModal) return;
        ui.shopModal.classList.remove('active');
        ui.shopModal.setAttribute('aria-hidden', 'true');
    }

    function buyFoodItem(foodTypeId) {
        if (!creature) return;
        let foodType = getFoodTypeById(foodTypeId);
        if (!foodType) return;

        if (galleryCoins < foodType.price) {
            setShopStatus('Not enough coins for that item.', true);
            return;
        }

        galleryCoins -= foodType.price;
        playSoundEffect('purchase');
        spawnFoodItem(foodType);
        setShopStatus(`Purchased: ${foodType.label}. Drag it to your Familiar (${foodEffectText(foodType)}).`);
        refreshShopUI();
        saveState(creature);
    }
    function buyShopNeedRelief() {
        buyFoodItem('apple');
    }

    function buyShopEnergySnack() {
        if (!creature) return;
        if (galleryCoins < SHOP_ENERGY_PRICE) {
            setShopStatus('Not enough coins for that item.', true);
            return;
        }
        galleryCoins -= SHOP_ENERGY_PRICE;
        playSoundEffect('purchase');
        creature.energy = p.min(100, creature.energy + SHOP_ENERGY_DELTA);
        setShopStatus('Purchased: Energy Snack');
        refreshShopUI();
        saveState(creature);
    }

    function buyCanvasPreset(name, cols, rows, price) {
        if (galleryCoins < price) {
            setShopStatus('Not enough coins for that canvas.', true);
            return;
        }

        galleryCoins -= price;
        playSoundEffect('purchase');
        setGridDimensions(cols, rows);
        resetGeneration({ keepCurrentReference: true });
        setShopStatus(`Purchased ${name} canvas (${cols}x${rows}).`);
        refreshShopUI();
        saveState(creature);
    }

    function buyCustomCanvasSize() {
        let draft = getCustomCanvasDraft();
        if (galleryCoins < draft.price) {
            setShopStatus('Not enough coins for that custom canvas.', true);
            return;
        }

        galleryCoins -= draft.price;
        playSoundEffect('purchase');
        setGridDimensions(draft.cols, draft.rows);
        resetGeneration({ keepCurrentReference: true });
        setShopStatus(`Purchased custom canvas (${draft.cols}x${draft.rows}).`);
        refreshShopUI();
        saveState(creature);
    }

    function buyPaletteUpgrade() {
        if (COLOR_SCHEME_COUNT >= SHOP_PALETTE_MAX_SLOTS) {
            setShopStatus('Palette slots are already maxed.', true);
            return;
        }

        let price = getPaletteUpgradePrice();
        if (galleryCoins < price) {
            setShopStatus('Not enough coins for palette upgrade.', true);
            return;
        }

        galleryCoins -= price;
        playSoundEffect('purchase');
        paletteUpgradeCount += 1;
        COLOR_SCHEME_COUNT = Math.min(SHOP_PALETTE_MAX_SLOTS, BASE_COLOR_SCHEME_COUNT + paletteUpgradeCount);
        ensureEasyStyleProfile();

        ensureSchemeLockArraysLength();
        let seen = new Set(colorScheme.map(col => col.join(',')));
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
        applyFrozenSchemeConstraints();
        buildReferenceRuleData();

        setShopStatus('Purchased: +1 palette colour slot');
        showShopPurchaseReaction('palette');
        refreshShopUI();
        saveState(creature);
    }

    function buyComputerUpgrade() {
        if (hasComputerUpgrade) {
            setShopStatus('Computer already purchased.');
            refreshShopUI();
            return;
        }

        if (galleryCoins < SHOP_COMPUTER_PRICE) {
            setShopStatus('Not enough coins for a computer.', true);
            return;
        }

        galleryCoins -= SHOP_COMPUTER_PRICE;
        playSoundEffect('purchase');
        hasComputerUpgrade = true;
        setShopStatus('Purchased: Computer unlocked search features.');
        showShopPurchaseReaction('computer');
        refreshShopUI();
        saveState(creature);
    }

    function buyProgressReset() {
        if (galleryCoins < SHOP_PROGRESS_RESET_PRICE) {
            setShopStatus('Not enough coins for Progress Reset.', true);
            return;
        }

        let confirmed = window.confirm('Progress Reset removes purchased upgrades/decor and clears all generation history. Continue?');
        if (!confirmed) {
            setShopStatus('Progress Reset cancelled.');
            return;
        }

        galleryCoins -= SHOP_PROGRESS_RESET_PRICE;
        applyFullProgressResetState({
            shouldPlayPurchaseSound: true,
            statusMessage: 'Progress reset complete. Easy style loaded and generation history cleared.',
        });
    }

    function shouldAskForFirstTimeVisitorReset() {
        try {
            let answer = localStorage.getItem(FIRST_TIME_VISITOR_PROMPT_KEY);
            return answer !== 'yes' && answer !== 'no';
        } catch (e) {
            return false;
        }
    }

    function rememberFirstTimeVisitorPromptAnswer(isFirstTime) {
        try {
            localStorage.setItem(FIRST_TIME_VISITOR_PROMPT_KEY, isFirstTime ? 'yes' : 'no');
        } catch (e) {}
    }

    function clearSavedProgressStorage() {
        try {
            localStorage.removeItem('creature_v2');
            localStorage.removeItem('generation_history_v1');
            localStorage.removeItem('grid_dimensions_v1');
            localStorage.removeItem('gallery_owner_name_v1');
        } catch (e) {}
    }

    function applyFullProgressResetState(options = {}) {
        let shouldPlayPurchaseSound = !!options.shouldPlayPurchaseSound;
        let initialCoins = Number.isFinite(Number(options.initialCoins))
            ? Math.max(0, Math.floor(Number(options.initialCoins)))
            : 0;
        let statusMessage = typeof options.statusMessage === 'string'
            ? options.statusMessage
            : 'Progress reset complete.';

        if (shouldPlayPurchaseSound) {
            playSoundEffect('purchase');
        }

        if (creature) {
            creature.need = 50;
            creature.energy = 100;
            creature.lastVisit = Date.now();
            creature.totalVisits = 1;
        }

        paletteUpgradeCount = 0;
        COLOR_SCHEME_COUNT = BASE_COLOR_SCHEME_COUNT;
        hasComputerUpgrade = false;

        ownedGalleryWallThemeIds = ['sage'];
        activeGalleryWallThemeId = 'sage';
        applyActiveGalleryWallTheme();

        ownedStudioWallThemeIds = ['cloud'];
        activeStudioWallThemeId = 'cloud';
        applyActiveStudioWallTheme();

        ownedStudioDecorThemeIds = [];
        ownedShopMusicTrackIds = [];
        activeShopMusicTrackId = null;
        stopShopMusic();

        galleryCoins = initialCoins;
        favouriteGenerationSerial = null;
        studioFavoritePaintingSerial = null;
        studioFavoritePaintingPendingSerial = null;
        studioFavoritePaintingImage = null;

        pendingFeedback = null;
        pendingInStyleSnapshot = null;
        pendingWithColoursSnapshot = null;
        foodItems = [];
        draggedFoodItemId = null;
        creatureFoodHoverActive = false;

        generationHistory = [];
        generationSerial = 1;
        archivedGenerationSerial = 0;
        generationPaused = false;
        selectedHistorySerial = null;
        selectedSellSerials.clear();
        selectSellModeActive = false;

        easyStyleProfile = null;
        ensureEasyStyleProfile();
        applyStyleSnapshot(easyStyleProfile.style);
        colorScheme = easyStyleProfile.colorScheme.map(col => [...col]);
        chooseArtAccentFromPalette();

        initColorGrid();
        closeGenerationPopup();
        rebuildGenerationStripFromHistory();
        updateGenerationStripControls();
        saveGenerationHistoryToStorage();

        setShopStatus(statusMessage);
        refreshShopUI();
        saveState(creature);
    }

    function updateRadialMenuPosition(creature) {
        if (!ui.radialMenu) return;
        
        // Get the canvas DOM element
        let canvasEl = document.querySelector('#canvas-container canvas');
        if (!canvasEl) return;
        
        // Get canvas position and size in DOM
        let canvasRect = canvasEl.getBoundingClientRect();
        let canvasAreaRect = document.querySelector('.canvas-area').getBoundingClientRect();
        
        // Calculate canvas width and height (p5.js dimensions)
        let canvasWidth = canvasRect.width;
        let canvasHeight = canvasRect.height;
        
        // Convert creature's p5.js coordinates (creature.x, creature.y) to DOM coordinates
        let creatureDOMX = canvasRect.left + (creature.x / p.width) * canvasWidth;
        let creatureDOMY = canvasRect.top + (creature.y / p.height) * canvasHeight;
        
        // Position relative to canvas-area (which is the parent with position: relative)
        let relativeX = creatureDOMX - canvasAreaRect.left;
        let relativeY = creatureDOMY - canvasAreaRect.top;
        
        // CSS centers the menu with translate(-50%, -50%), so write center coordinates directly.
        ui.radialMenu.style.left = (relativeX + RADIAL_CENTER_OFFSET_X) + 'px';
        ui.radialMenu.style.top = (relativeY + RADIAL_CENTER_OFFSET_Y) + 'px';
    }

    function updateNpcActionButtonsPosition(creature) {
        if (!ui.reopenGridButton) return;

        let canvasEl = document.querySelector('#canvas-container canvas');
        if (!canvasEl) {
            ui.reopenGridButton.style.display = 'none';
            return;
        }

        let canvasRect = canvasEl.getBoundingClientRect();
        let canvasArea = document.querySelector('.canvas-area');
        if (!canvasArea) {
            ui.reopenGridButton.style.display = 'none';
            return;
        }
        let canvasAreaRect = canvasArea.getBoundingClientRect();

        let creatureDOMX = canvasRect.left + (creature.x / p.width) * canvasRect.width;
        let creatureDOMY = canvasRect.top + (creature.y / p.height) * canvasRect.height;
        let relativeX = creatureDOMX - canvasAreaRect.left;
        let relativeY = creatureDOMY - canvasAreaRect.top;
        let buttonOffsetX = CREATURE_SIZE * AREA_BUTTON_LAYOUT.canvasButtonOffsetX;
        let buttonOffsetY = CREATURE_SIZE * AREA_BUTTON_LAYOUT.canvasButtonOffsetY;

        ui.reopenGridButton.style.display = 'inline-flex';
        ui.reopenGridButton.style.left = `${Math.round(relativeX + buttonOffsetX)}px`;
        ui.reopenGridButton.style.top = `${Math.round(relativeY + buttonOffsetY)}px`;

        gridView.canvasButtonAnchorX = creature.x + buttonOffsetX;
        gridView.canvasButtonAnchorY = creature.y + buttonOffsetY;
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
        if (!micActive || !c) return;
        c.micLevel = getMicLevel();

        let now = p.millis();
        let loudEnough = c.micLevel > MIC_THRESHOLD;

        if (loudEnough) {
            if (micAboveThresholdSinceMs <= 0) {
                micAboveThresholdSinceMs = now;
            }
        } else {
            micAboveThresholdSinceMs = 0;
        }

        let sustainedLoudDuration = micAboveThresholdSinceMs > 0 ? (now - micAboveThresholdSinceMs) : 0;
        if (isRestingNow() && sustainedLoudDuration >= p.max(1, Number(MIC_WAKE_TRIGGER_MS) || 1)) {
            if (isLongRestActive()) {
                forceWakeFromRest('long');
            } else {
                forceWakeFromRest('short');
            }
            micAboveThresholdSinceMs = 0;
            saveState(c);
            return;
        }

        if (c.sleepTimer > 0) return;
        if (loudEnough) c.exciteTimer = EXCITED_FRAMES;
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
                sold: !!snapshot.sold,
                salePrice: snapshot.salePrice || 0,
                soldTo: snapshot.soldTo || '',
                saleFit: snapshot.saleFit || 0,
                referencePath: snapshot.referencePath || '',
                referenceKeyword: snapshot.referenceKeyword || '',
                createdAtYear: snapshot.createdAtYear || new Date().getFullYear(),
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
                    sold: !!item.sold,
                    salePrice: item.salePrice || 0,
                    soldTo: item.soldTo || '',
                    saleFit: item.saleFit || 0,
                    referencePath: item.referencePath || '',
                    referenceKeyword: item.referenceKeyword || inferReferenceKeywordFromPath(item.referencePath || ''),
                    createdAtYear: item.createdAtYear || new Date().getFullYear(),
                };
                generationHistory.push(snapshot);
            }
            
            // Rebuild the generation strip UI from history
            if (ui.generationStripList) {
                rebuildGenerationStripFromHistory();
            }

            updateGenerationStripControls();

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
                galleryCoins,
                longRestUntil: restState.longRestUntil,
                shortRestActive: restState.shortActive,
                shortRestUntil: restState.shortRestUntil,
                paletteUpgradeCount,
                hasComputerUpgrade,
                easyStyleProfile,
                fullEnergyStyleSnapshot,
                fullEnergyColorScheme,
                lastEnergyStyleInfluence,
                colourPreference,
                stylePreference,
                frozenSchemeSlots,
                frozenSchemeValues,
                energyDrinkGridBoostActive,
                ownedGalleryWallThemeIds,
                activeGalleryWallThemeId,
                ownedStudioWallThemeIds,
                activeStudioWallThemeId,
                ownedStudioDecorThemeIds,
                ownedShopMusicTrackIds,
                activeShopMusicTrackId,
                favouriteGenerationSerial,
            }));
            saveGenerationHistoryToStorage();
        } catch(e) {}
    }

    function loadState(c) {
        try {
            let raw = localStorage.getItem('creature_v2');
            if (!raw) { c.totalVisits = 1; return; }
            let data = JSON.parse(raw);
            c.need        = data.need ?? 50;
            c.energy      = data.energy ?? 100;
            c.lastVisit   = data.lastVisit;
            c.totalVisits = (data.totalVisits || 0) + 1;
            galleryCoins  = data.galleryCoins || 0;
            paletteUpgradeCount = Math.max(0, Math.floor(Number(data.paletteUpgradeCount) || 0));
            COLOR_SCHEME_COUNT = Math.min(SHOP_PALETTE_MAX_SLOTS, BASE_COLOR_SCHEME_COUNT + paletteUpgradeCount);
            hasComputerUpgrade = !!data.hasComputerUpgrade;
            easyStyleProfile = normalizeEasyStyleProfile(data.easyStyleProfile);
            if (data.colourPreference && typeof data.colourPreference === 'object') {
                colourPreference.mode = data.colourPreference.mode || null;
                colourPreference.targetScheme = Array.isArray(data.colourPreference.targetScheme)
                    ? data.colourPreference.targetScheme.map(col => (Array.isArray(col) ? [...col] : col)).filter(Array.isArray)
                    : null;
                colourPreference.likeStreak = Math.max(0, Number(data.colourPreference.likeStreak) || 0);
            }
            if (data.stylePreference && typeof data.stylePreference === 'object') {
                stylePreference.mode = data.stylePreference.mode || null;
                stylePreference.target = data.stylePreference.target && typeof data.stylePreference.target === 'object'
                    ? { ...data.stylePreference.target }
                    : null;
                stylePreference.likeStreak = Math.max(0, Number(data.stylePreference.likeStreak) || 0);
            }
            energyDrinkGridBoostActive = !!data.energyDrinkGridBoostActive;
            ownedGalleryWallThemeIds = Array.isArray(data.ownedGalleryWallThemeIds) ? data.ownedGalleryWallThemeIds.slice() : ['sage'];
            activeGalleryWallThemeId = typeof data.activeGalleryWallThemeId === 'string' ? data.activeGalleryWallThemeId : 'sage';
            favouriteGenerationSerial = Number.isFinite(Number(data.favouriteGenerationSerial))
                ? Number(data.favouriteGenerationSerial)
                : null;
            ensureGalleryWallState();
            ownedStudioWallThemeIds = Array.isArray(data.ownedStudioWallThemeIds) ? data.ownedStudioWallThemeIds.slice() : ['cloud'];
            activeStudioWallThemeId = typeof data.activeStudioWallThemeId === 'string' ? data.activeStudioWallThemeId : 'cloud';
            ownedStudioDecorThemeIds = Array.isArray(data.ownedStudioDecorThemeIds) ? data.ownedStudioDecorThemeIds.slice() : [];
            if (typeof data.activeStudioDecorThemeId === 'string') {
                ownedStudioDecorThemeIds.push(data.activeStudioDecorThemeId);
            }
            ownedShopMusicTrackIds = Array.isArray(data.ownedShopMusicTrackIds) ? data.ownedShopMusicTrackIds.slice() : [];
            activeShopMusicTrackId = typeof data.activeShopMusicTrackId === 'string' ? data.activeShopMusicTrackId : null;
            ensureStudioWallState();
            ensureStudioDecorState();
            ensureShopMusicState();
            stopShopMusic();
            activeShopMusicTrackId = null;
            applyActiveGalleryWallTheme();
            applyActiveStudioWallTheme();
            frozenSchemeSlots = Array.isArray(data.frozenSchemeSlots) ? data.frozenSchemeSlots.map(v => !!v) : [];
            frozenSchemeValues = Array.isArray(data.frozenSchemeValues)
                ? data.frozenSchemeValues.map(col => (Array.isArray(col) && col.length === 3 ? [...col] : null))
                : [];
            ensureSchemeLockArraysLength();
            restState.shortActive = !!data.shortRestActive;
            restState.shortRestUntil = Math.max(0, Number(data.shortRestUntil) || 0);
            restState.longRestUntil = Math.max(0, Number(data.longRestUntil) || 0);
            fullEnergyStyleSnapshot = data.fullEnergyStyleSnapshot && typeof data.fullEnergyStyleSnapshot === 'object'
                ? {
                    referenceRulePrecision: Number(data.fullEnergyStyleSnapshot.referenceRulePrecision) || REFERENCE_RULE_PRECISION,
                    colorSchemeOffsetRange: Number(data.fullEnergyStyleSnapshot.colorSchemeOffsetRange) || COLOR_SCHEME_OFFSET_RANGE,
                    neighborSimilarRange: Number(data.fullEnergyStyleSnapshot.neighborSimilarRange) || NEIGHBOR_SIMILAR_RANGE,
                    referenceMatchRgbRange: Number(data.fullEnergyStyleSnapshot.referenceMatchRgbRange) || REFERENCE_MATCH_RGB_RANGE,
                    adjacentSchemeOverrideChance: Number(data.fullEnergyStyleSnapshot.adjacentSchemeOverrideChance) || ADJACENT_SCHEME_OVERRIDE_CHANCE,
                    globalRandomColorChance: Number(data.fullEnergyStyleSnapshot.globalRandomColorChance) || GLOBAL_RANDOM_COLOR_CHANCE,
                    enableGlobalRandomColorRule: !!data.fullEnergyStyleSnapshot.enableGlobalRandomColorRule,
                }
                : null;
            fullEnergyColorScheme = Array.isArray(data.fullEnergyColorScheme)
                ? data.fullEnergyColorScheme
                    .map(col => (Array.isArray(col) && col.length === 3
                        ? [clampByte(col[0]), clampByte(col[1]), clampByte(col[2])]
                        : null))
                    .filter(Boolean)
                : null;
            lastEnergyStyleInfluence = clamp01(Number(data.lastEnergyStyleInfluence) || 0);

            if (!isLongRestActive() && !isShortRestActive()) {
                restState.longRestUntil = 0;
                restState.shortRestUntil = 0;
            }
            if (c.lastVisit) {
                let hours = Math.min((Date.now() - c.lastVisit) / 3600000, AFK_MAX_HOURS);
                c.energy = Math.min(c.energy + hours * AFK_PER_HOUR, 100);
            }
            ensureEasyStyleProfile();
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

        ui.needBar.style.width = c.need + '%';
        ui.needBar.style.backgroundColor =
            c.need > 70 ? '#788c5d' :
            c.need > 30 ? '#c9973a' : '#c0522a';

        ui.energyBar.style.width = c.energy + '%';
        ui.energyBar.style.backgroundColor =
            c.energy < 30 ? '#788c5d' :
            c.energy < 70 ? '#c9973a' : '#c0522a';
    }


    // ============================================================
    //  WINDOW RESIZE
    // ============================================================

    p.windowResized = function() {
        let sz = canvasSize();
        p.resizeCanvas(sz.w, sz.h);
        let home = getCreatureHomePosition();
        creature.originX = home.x;
        creature.originY = home.y;
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
    window._likeColours = () => { onLikeColoursFeedback(); };
    window._dislikeColours = () => { onDislikeColoursFeedback(); };
    window._likeStyle = () => { onLikeStyleFeedback(); };
    window._dislikeStyle = () => { onDislikeStyleFeedback(); };
    window._likeGeneration = () => { onLikeColoursFeedback(); };
    window._dislikeGeneration = () => { onDislikeColoursFeedback(); };
    window._morePrecise = () => { increasePrecision(); };
    window._moreAbstract = () => { decreasePrecision(); };
    window._noisier = () => { increaseNoise(); };
    window._cleaner = () => { decreaseNoise(); };
    window._likeColoursImmediate = () => { onLikeColoursFeedbackImmediate(); };
    window._dislikeColoursImmediate = () => { onDislikeColoursFeedbackImmediate(); };
    window._likeStyleImmediate = () => { onLikeStyleFeedbackImmediate(); };
    window._dislikeStyleImmediate = () => { onDislikeStyleFeedbackImmediate(); };
    window._onRadialQuestionAnswered = (actionKey, questionType) => {
        if (!creatureQuestionState.active) return;
        creatureQuestionState.active = false;
        creatureQuestionState.type = null;
        creatureQuestionState.prompt = '';
        generationPaused = false;
        scheduleNextCreatureQuestion();
        saveState(creature);
    };
    window._checkUp = () => { return checkUpStatusMessage(); };
    window._prepareDialogueTextWithExpression = text => { return prepareDialogueTextWithExpression(String(text || '')); };
    window._showPromptInput = () => { openRadialPromptModal(); };
    window._suggestPrompt = () => { openRadialPromptModal(); };
    window._getArtAccentColour = () => { return [...artAccentColour]; };
    window._nextGeneration = () => { resetGeneration(); };
    window._takeBreak = mode => { takeBreak(mode); };
    window._setGridCols = cols => { setGridDimensions(cols, GRID_ROWS); };
    window._setGridRows = rows => { setGridDimensions(GRID_COLS, rows); };

}, document.body);
