function ExtendSuperclass(mod, cls, makeSubclass) {
    mod.modInterface.extendClass(cls, (old) => {
        return makeSubclass(old).prototype;
    });
}

shapez;
const { Application, CHANGELOG, AnimationFrame, compressionPrefix, asyncCompressor, AtlasDefinition, atlasFiles, getLogoSprite, BackgroundResourcesLoader, BufferMaintainer, enableImageSmoothing, disableImageSmoothing, getBufferVramUsageBytes, getBufferStats, clearBufferBacklog, makeOffscreenBuffer, registerCanvas, freeCanvas, cachebust, MAX_MOVE_DISTANCE_PX, clickDetectorGlobals, ClickDetector, IS_DEBUG, SUPPORT_TOUCH, IS_MAC, THIRDPARTY_URLS, A_B_TESTING_LINK_TYPE, globalConfig, IS_MOBILE, getDeviceDPI, smoothenDpi, prepareHighDPIContext, resizeHighDPICanvas, resizeCanvas, resizeCanvasAndClear, DrawParameters, initDrawUtils, drawRotatedSprite, drawSpriteClipped, APPLICATION_ERROR_OCCURED, ExplainedResult, Factory, GameState, gMetaBuildingRegistry, gBuildingsByCategory, gComponentRegistry, gGameModeRegistry, gGameSpeedRegistry, gItemRegistry, initBuildingsByCategory, GLOBAL_APP, setGlobalApp, BUILD_OPTIONS, InputDistributor, InputReceiver, Loader, createLogger, serializeError, stringifyObjectContainingErrors, globalDebug, globalLog, globalWarn, globalError, logSection, compressU8, compressU8WHeader, decompressU8WHeader, compressX64, decompressX64, Dialog, DialogLoading, DialogOptionChooser, DialogWithForm, FormElement, FormElementInput, FormElementCheckbox, FormElementItemChooser, queryParamOptions, ReadWriteProxy, Rectangle, PROMISE_ABORTED, RequestChannel, RestrictionManager, RandomNumberGenerator, sha1, getNameOfProvider, CRC_PREFIX, computeCrc, STOP_PROPAGATION, Signal, SingletonFactory, ORIGINAL_SPRITE_SCALE, FULL_CLIP_RECT, BaseSprite, SpriteAtlasLink, AtlasSprite, RegularSprite, StaleAreaDetector, StateManager, TextualGameState, TrackedState, isAndroid, isIos, getPlatformName, make2DUndefinedArray, newEmptyMap, randomInt, accessNestedPropertyReverse, randomChoice, fastArrayDelete, fastArrayDeleteValue, fastArrayDeleteValueIfContained, arrayDelete, arrayDeleteValue, epsilonCompare, lerp, findNiceValue, findNiceIntegerValue, formatBigNumber, formatBigNumberFull, waitNextFrame, round1Digit, round2Digits, round3Digits, round4Digits, clamp, makeDivElement, makeDiv, makeButtonElement, makeButton, removeAllChildren, isSupportedBrowser, formatSecondsToTimeAgo, formatSeconds, round1DigitLocalized, formatItemsPerSecond, rotateFlatMatrix3x3, generateMatrixRotations, rotateDirectionalObject, safeModulo, smoothPulse, fillInLinkIntoTranslation, generateFileDownload, startFileChoose, getRomanNumber, enumDirection, enumInvertedDirections, enumDirectionToAngle, enumAngleToDirection, arrayAllDirections, Vector, mixVector, enumDirectionToVector, AchievementProxy, enumSavePriority, AutomaticSave, BaseItem, BeltPath, Blueprint, gBuildingVariants, registerBuildingVariant, getBuildingDataFromCode, buildBuildingCodeCache, getCodeFromBuildingData, MetaAnalyzerBuilding, enumBalancerVariants, MetaBalancerBuilding, arrayBeltVariantToRotation, beltOverlayMatrices, MetaBeltBuilding, MetaBlockBuilding, MetaComparatorBuilding, MetaConstantProducerBuilding, MetaConstantSignalBuilding, enumCutterVariants, MetaCutterBuilding, MetaDisplayBuilding, MetaFilterBuilding, MetaGoalAcceptorBuilding, MetaHubBuilding, MetaItemProducerBuilding, MetaLeverBuilding, enumLogicGateVariants, MetaLogicGateBuilding, enumMinerVariants, MetaMinerBuilding, MetaMixerBuilding, enumPainterVariants, MetaPainterBuilding, MetaReaderBuilding, enumRotaterVariants, MetaRotaterBuilding, MetaStackerBuilding, MetaStorageBuilding, enumTransistorVariants, MetaTransistorBuilding, MetaTrashBuilding, arrayUndergroundRotationVariantToMode, enumUndergroundBeltVariants, enumUndergroundBeltVariantToTier, MetaUndergroundBeltBuilding, enumVirtualProcessorVariants, MetaVirtualProcessorBuilding, arrayWireRotationVariantToType, wireOverlayMatrices, wireVariants, MetaWireBuilding, MetaWireTunnelBuilding, USER_INTERACT_MOVE, USER_INTERACT_ZOOM, USER_INTERACT_TOUCHEND, enumMouseButton, Camera, enumColors, enumColorToShortcode, enumShortcodeToColor: enumShortcodeToColor$1, enumColorsToHexCode, enumColorMixingResults, Component, initComponentRegistry, curvedBeltLength, FAKE_BELT_ACCEPTOR_SLOT, FAKE_BELT_EJECTOR_SLOT_BY_DIRECTION, BeltComponent, enumBeltReaderType, BeltReaderComponent, enumClippedBeltUnderlayType, BeltUnderlaysComponent, ConstantSignalComponent, DisplayComponent, FilterComponent, GoalAcceptorComponent, HubComponent, ItemAcceptorComponent, ItemEjectorComponent, enumItemProcessorTypes, enumItemProcessorRequirements, ItemProcessorComponent, ItemProducerComponent, LeverComponent, enumLogicGateType, LogicGateComponent, MinerComponent, StaticMapEntityComponent, MODS_ADDITIONAL_STORAGE_ITEM_RESOLVER, StorageComponent, enumUndergroundBeltMode, UndergroundBeltComponent, enumWireType, enumWireVariant, WireComponent, WireTunnelComponent, enumPinSlotType, WiredPinsComponent, GameCore, DynamicTickrate, Entity, EntityComponentStorage, EntityManager, GameLoadingOverlay, enumGameModeIds, enumGameModeTypes, GameMode, initGameModeRegistry, initGameSpeedRegistry, GameSystem, MODS_ADDITIONAL_SYSTEMS, GameSystemManager, GameSystemWithFilter, getRandomHint, MOD_ITEM_PROCESSOR_SPEEDS, HubGoals, BaseHUDPart, DynamicDomAttach, GameHUD, HUDBaseToolbar, HUDBetaOverlay, HUDBlueprintPlacer, HUDBuildingPlacer, HUDBuildingPlacerLogic, HUDBuildingsToolbar, HUDCatMemes, HUDColorBlindHelper, MODS_ADDITIONAL_CONSTANT_SIGNAL_RESOLVER, HUDConstantSignalEdit, HUDChangesDebugger, HUDDebugInfo, HUDGameMenu, HUDInteractiveTutorial, HUDKeybindingOverlay, HUDLayerPreview, HUDLeverToggle, HUDMassSelector, HUDMinerHighlight, HUDModalDialogs, HUDPuzzleNextPuzzle, enumNotificationType, HUDNotifications, HUDPinnedShapes, HUDPuzzleBackToMenu, HUDPuzzleCompleteNotification, HUDPuzzleDLCLogo, HUDPuzzleEditorControls, HUDPuzzleEditorReview, HUDPuzzleEditorSettings, HUDPuzzlePlayMetadata, HUDPuzzlePlaySettings, HUDSandboxController, HUDScreenshotExporter, HUDSettingsMenu, HUDShapeTooltip, HUDShapeViewer, HUDShop, HUDStandaloneAdvantages, HUDStatistics, enumDisplayMode, statisticsUnitsSeconds, HUDShapeStatisticsHandle, HUDPartTutorialHints, HUDTutorialVideoOffer, HUDUnlockNotification, HUDVignetteOverlay, HUDWatermark, HUDWaypoints, HUDWireInfo, HUDWiresOverlay, HUDWiresToolbar, initItemRegistry, MODS_ADDITIONAL_ITEMS, itemResolverSingleton, typeItemSingleton, BooleanItem, BOOL_FALSE_SINGLETON, BOOL_TRUE_SINGLETON, isTrueItem, isTruthyItem, ColorItem, COLOR_ITEM_SINGLETONS, ShapeItem, keyToKeyCode, KEYCODES, KEYMAPPINGS, KEYCODE_LMB, KEYCODE_MMB, KEYCODE_RMB, getStringForKeyCode, Keybinding, KeyActionMapper, GameLogic, BaseMap, MODS_ADDITIONAL_SHAPE_MAP_WEIGHTS, MapChunk, MapChunkAggregate, CHUNK_OVERLAY_RES, MOD_CHUNK_DRAW_HOOKS, MapChunkView, MapView, defaultBuildingVariant, MetaBuilding, registerBuildingVariants, initMetaBuildingRegistry, initBuildingCodesAfterResourcesLoaded, PuzzleGameMode, PuzzleEditGameMode, PuzzlePlayGameMode, rocketShape, finalGameShape, generateLevelDefinitions, RegularGameMode, enumAnalyticsDataSource, ProductionAnalytics, layers, GameRoot, MODS_ADDITIONAL_SUB_SHAPE_DRAWERS, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT, TOP_LEFT, enumSubShape, enumSubShapeToShortcode, enumShortcodeToSubShape, createSimpleShape, ShapeDefinition, ShapeDefinitionManager, SoundProxy, BELT_ANIM_COUNT, BeltSystem, BeltReaderSystem, BeltUnderlaysSystem, ConstantProducerSystem, ConstantSignalSystem, MODS_ADDITIONAL_DISPLAY_ITEM_RESOLVER, MODS_ADDITIONAL_DISPLAY_ITEM_DRAW, DisplaySystem, FilterSystem, GoalAcceptorSystem, HubSystem, ItemAcceptorSystem, ItemEjectorSystem, MOD_ITEM_PROCESSOR_HANDLERS, MODS_PROCESSING_REQUIREMENTS, MODS_CAN_PROCESS, ItemProcessorSystem, ItemProcessorOverlaysSystem, ItemProducerSystem, LeverSystem, LogicGateSystem, MapResourcesSystem, MinerSystem, StaticMapEntitySystem, StorageSystem, UndergroundBeltSystem, WireNetwork, WireSystem, WiredPinsSystem, ZoneSystem, THEMES, THEME, applyGameTheme, BaseGameSpeed, FastForwardGameSpeed, GameTime, PausedGameSpeed, RegularGameSpeed, enumHubGoalRewards, enumHubGoalRewardsToContentUnlocked, LANGUAGES, Mod: Mod$1, ModInterface, ModMetaBuilding, MOD_SIGNALS, ModLoader, MODS, ACHIEVEMENTS, AchievementProviderInterface, Achievement, AchievementCollection, AdProviderInterface, AdinplayAdProvider, GamedistributionAdProvider, NoAdProvider, AnalyticsInterface, ClientAPI, ShapezGameAnalytics, GoogleAnalyticsImpl, NoAchievementProvider, NoGameAnalytics, SoundImplBrowser, StorageImplBrowser, StorageImplBrowserIndexedDB, PlatformWrapperImplBrowser, SteamAchievementProvider, StorageImplElectron, PlatformWrapperImplElectron, GameAnalyticsInterface, SOUNDS, MUSIC, SoundInstanceInterface, MusicInstanceInterface, SoundInterface, FILE_NOT_FOUND, StorageInterface, PlatformWrapperInterface, enumCategories, uiScales, scrollWheelSensitivities, movementSpeeds, autosaveIntervals, refreshRateOptions, ApplicationSettings, BaseSetting, EnumSetting, BoolSetting, RangeSetting, PuzzleSerializer, Savegame, compressObject, decompressObject, BaseSavegameInterface, savegameInterfaces, getSavegameInterface, enumLocalSavegameStatus, SavegameManager, SavegameSerializer, SavegameInterface_V1000, SavegameInterface_V1001, SavegameInterface_V1002, SavegameInterface_V1003, SavegameInterface_V1004, SavegameInterface_V1005, SavegameInterface_V1006, SavegameInterface_V1007, SavegameInterface_V1008, SavegameInterface_V1009, SavegameInterface_V1010, types, BasicSerializableObject, serializeSchema, deserializeSchema, verifySchema, extendSchema, globalJsonSchemaDefs, schemaToJsonSchema, BaseDataType, TypeInteger, TypePositiveInteger, TypePositiveIntegerOrString, TypeBoolean, TypeString, TypeVector, TypeTileVector, TypeNumber, TypePositiveNumber, TypeEnum, TypeEntity, TypeEntityWeakref, TypeClass, TypeClassData, TypeClassFromMetaclass, TypeMetaClass, TypeArray, TypeFixedClass, TypeKeyValueMap, TypeClassId, TypePair, TypeNullable, TypeStructuredObject, SerializerInternal, AboutState, ChangelogState, GAME_LOADING_STATES, gameCreationAction, GameCreationPayload, InGameState, KeybindingsState, LoginState, MainMenuState, MobileWarningState, ModsState, PreloadState, PuzzleMenuState, SettingsState, WegameSplashState, T, autoDetectLanguageId, matchDataRecursive, updateApplicationLanguage } = shapez;

var SzInfo;
(function (SzInfo) {
    (function (color_1) {
        color_1.outline = "#55575a";
        color_1.list = [
            { name: 'red', style: 'red', code: 'r', combo: 'rrr' },
            { name: 'orange', style: 'orange', code: 'o', combo: 'grr' },
            { name: 'yellow', style: 'yellow', code: 'y', combo: 'ggr' },
            { name: 'green', style: 'green', code: 'g', combo: 'ggg' },
            { name: 'lawngreen', style: 'lawngreen', code: 'l', combo: 'bgg' },
            { name: 'cyan', style: 'cyan', code: 'c', combo: 'bbg' },
            { name: 'blue', style: 'blue', code: 'b', combo: 'bbb' },
            { name: 'purple', style: 'purple', code: 'v', combo: 'bbr' },
            { name: 'pink', style: 'pink', code: 'p', combo: 'brr' },
            { name: 'grey', style: 'grey', code: 'u' },
            { name: 'white', style: 'white', code: 'w' },
            { name: 'none', style: 'none', code: '-' },
        ];
        Object.assign(globalThis, { list: color_1.list });
        color_1.colorList = color_1.list.map(e => e.name);
        color_1.byName = Object.fromEntries(color_1.list.map(e => [e.name, e]));
        color_1.byChar = Object.fromEntries(color_1.list.map(e => [e.code, e]));
        color_1.byCombo = Object.fromEntries(color_1.list.filter(e => e.combo).map(e => [e.combo, e]));
        function exampleLayer(color) {
            let i = 0;
            return new SzLayer({
                quads: [
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
                ]
            });
        }
        color_1.exampleLayer = exampleLayer;
    })(SzInfo.color || (SzInfo.color = {}));
    (function (quad_1) {
        quad_1.list = [
            { name: 'circle', code: 'C', combo: 'C', spawn: '6CuCuCuCuCuCu' },
            { name: 'square', code: 'R', combo: 'R', spawn: '6RuRuRuRuRuRu' },
            { name: 'star', code: 'S', combo: 'S', spawn: '6SuSuSuSuSuSu' },
            { name: 'windmill', code: 'W', combo: 'W', spawn: '6WuWuWuWuWuWu' },
        ];
        quad_1.named4 = {
            circleSpawn: 'CuCuCuCu',
            squareSpawn: 'RuRuRuRu',
            starSpawn: 'SuSuSuSu',
            windmillSpawn: 'WuWuWuWu',
            circleBottom: '--CuCu--',
            circle: "CuCuCuCu",
            circleHalf: "----CuCu",
            rect: "RuRuRuRu",
            rectHalf: "RuRu----",
            circleHalfRotated: "Cu----Cu",
            circleQuad: "Cu------",
            circleRed: "CrCrCrCr",
            rectHalfBlue: "RbRb----",
            circlePurple: "CpCpCpCp",
            starCyan: "ScScScSc",
            fish: "CgScScCg",
            blueprint: "CbCbCbRb:CwCwCwCw",
            rectCircle: "RpRpRpRp:CwCwCwCw",
            watermelon: "--Cg----:--Cr----",
            starCircle: "SrSrSrSr:CyCyCyCy",
            starCircleStar: "SrSrSrSr:CyCyCyCy:SwSwSwSw",
            fan: "CbRbRbCb:CwCwCwCw:WbWbWbWb",
            monster: "Sg----Sg:CgCgCgCg:--CyCy--",
            bouquet: "CpRpCp--:SwSwSwSw",
            logo: "RuCw--Cw:----Ru--",
            target: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr",
            speedometer: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy",
            // spikedBall: "CcSyCcSy:SyCcSyCc:CcSyCcSy:SyCcSyCc",
            spikedBall: "CcSyCcSy:SyCcSyCc:CcSyCcSy",
            compass: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy",
            plant: "Rg--Rg--:CwRwCwRw:--Rg--Rg",
            rocket: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw",
            mill: "CwCwCwCw:WbWbWbWb",
            star: "SuSuSuSu",
            circleStar: "CwCrCwCr:SgSgSgSg",
            clown: "WrRgWrRg:CwCrCwCr:SgSgSgSg",
            windmillRed: "WrWrWrWr",
            fanTriple: "WpWpWpWp:CwCwCwCw:WpWpWpWp",
            fanQuadruple: "WpWpWpWp:CwCwCwCw:WpWpWpWp:CwCwCwCw",
            bird: "Sr------:--Cg--Cg:Sb--Sb--:--Cw--Cw",
            scissors: "Sr------:--CgCgCg:--Sb----:Cw--CwCw",
        };
        quad_1.named6 = {
            circleSpawn: '6CuCuCuCuCuCu',
            squareSpawn: '6RuRuRuRuRuRu',
            starSpawn: '6SuSuSuSuSuSu',
            windmillSpawn: '6WuWuWuWuWuWu',
            circleBottom: '6----CuCuCu--',
            circle: "6CuCuCuCuCuCu",
            circleHalf: "6------CuCuCu",
            rect: "6RuRuRuRuRuRu",
            rectHalf: "6RuRuRu------",
            circleHalfRotated: "6Cu------CuCu",
            circleQuad: "6CuCu--------",
            circleRed: "6CrCrCrCrCrCr",
            rectHalfBlue: "6RbRbRb------",
            circlePurple: "6CpCpCpCpCpCp",
            starCyan: "6ScScScScScSc",
            fish: "6CgCgScScCgCg",
            blueprint: "6CbCbCbCbCbRb:6CwCwCwCwCwCw",
            rectCircle: "6RpRpRpRpRpRp:6CwCwCwCwCwCw",
            watermelon: "6--CgCg------:6--CrCr------",
            starCircle: "6SrSrSrSrSrSr:6CyCyCyCyCyCy",
            starCircleStar: "6SrSrSrSrSrSr:6CyCyCyCyCyCy:6SwSwSwSwSwSw",
            fan: "6CbCbRbRbCbCb:6CwCwCwCwCwCw:6WbWbWbWbWbWb",
            monster: "6Sg--------Sg:6CgCgCgCgCgCg:6--CyCyCyCy--",
            bouquet: "6CpCpRpCpCp--:6SwSwSwSwSwSw",
            logo: "6RwCuCw--CwCu:6------Ru----",
            target: "6CrCwCrCwCrCw:6CwCrCwCrCwCr:6CrCwCrCwCrCw:6CwCrCwCrCwCr",
            speedometer: "6CgCb----CrCy:6CwCw----CwCw:6Sc----------:6CyCy----CyCy",
            spikedBall: "6CcSyCcSyCcSy:6SyCcSyCcSyCc:6CcSyCcSyCcSy:6SyCcSyCcSyCc",
            compass: "6CcRcRcCcRcRc:6RwCwCwRwCwCw:6----Sr----Sb:6CyCyCyCyCyCy",
            plant: "6Rg--Rg--Rg--:6CwRwCwRwCwRw:6--Rg--Rg--Rg",
            rocket: "6CbCuCbCuCbCu:6Sr----------:6--CrCrSrCrCr:6CwCwCwCwCwCw",
            mill: "6CwCwCwCwCwCw:6WbWbWbWbWbWb",
            star: "6SuSuSuSuSuSu",
            circleStar: "6CwCrCwCrCwCr:6SgSgSgSgSgSg",
            clown: "6WrRgWrRgWrRg:6CwCrCwCrCwCr:6SgSgSgSgSgSg",
            windmillRed: "6WrWrWrWrWrWr",
            fanTriple: "6WpWpWpWpWpWp:6CwCwCwCwCwCw:6WpWpWpWpWpWp",
            fanQuadruple: "6WpWpWpWpWpWp:6CwCwCwCwCwCw:6WpWpWpWpWpWp:6CwCwCwCwCwCw",
            bird: "6Sr----------:6--CgCg--CgCg:6Sb----Sb----:6--CwCw--CwCw",
            scissors: "6Sr----------:6--CgCgCgCgCg:6----Sb------:6CwCw--CwCwCw",
        };
        quad_1.named = {
            circleSpawn: '6CuCuCuCuCuCu',
            squareSpawn: '6RuRuRuRuRuRu',
            starSpawn: '6SuSuSuSuSuSu',
            windmillSpawn: '6WuWuWuWuWuWu',
        };
        Object.assign(quad_1.named, Object.fromEntries(Object.keys(quad_1.named6).flatMap(k => {
            let s4 = quad_1.named4[k];
            let s6 = quad_1.named6[k];
            let a = [];
            if (s4)
                a.push([k + 4, s4]);
            if (s4)
                a.push([s4, s6]);
            if (s6)
                a.push([k, s6]);
            return a;
        })));
        console.log({ named: quad_1.named });
        Object.assign(globalThis, { named: quad_1.named });
        quad_1.byName = Object.fromEntries(quad_1.list.map(e => [e.name, e]));
        quad_1.byChar = Object.fromEntries(quad_1.list.map(e => [e.code, e]));
        function exampleLayer(shape) {
            let i = 0, d = 4;
            return new SzLayer({
                quads: [
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                    { shape, from: i, to: i += d, color: 'grey' },
                ],
            });
        }
        quad_1.exampleLayer = exampleLayer;
        quad_1.quadList = quad_1.list.map(e => e.name);
    })(SzInfo.quad || (SzInfo.quad = {}));
    let s = Array(100).fill(0).map((e, i) => i.toString(36)).join('').slice(0, 36);
    s += s.slice(10).toUpperCase();
    SzInfo.nToChar = s.split('');
    SzInfo.charToN = Object.fromEntries(SzInfo.nToChar.map((e, i) => [e, i]));
})(SzInfo || (SzInfo = {}));
class SzLayerQuad {
    shape = 'circle';
    color = 'none';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
    }
    clone() { return new SzLayerQuad(this); }
    outerPath(ctx, layer) {
        switch (this.shape) {
            case 'circle': {
                ctx.arc(0, 0, 1, this.from, this.to);
                return;
            }
            case 'square': {
                ctx.lineToR(1, this.from);
                // 6 -> Math.SQRT2, 12 -> 1
                let a = this.to - this.from;
                let ar = a * (Math.PI / 24);
                let R = a <= 6 ? 1 / Math.cos(ar) : 1;
                ctx.lineToR(R, (this.from + this.to) / 2);
                ctx.lineToR(1, this.to);
                return;
            }
            case 'star': {
                ctx.lineToR(0.6, this.from);
                ctx.lineToR(Math.SQRT2, (this.from + this.to) / 2);
                ctx.lineToR(0.6, this.to);
                return;
            }
            case 'windmill': {
                ctx.lineToR(1, this.from);
                let a = this.to - this.from;
                let ar = a * (Math.PI / 24);
                let R = a <= 6 ? 1 / Math.cos(ar) : 1;
                ctx.lineToR(R, (this.from + this.to) / 2);
                ctx.lineToR(0.6, this.to);
                // let originX = -quadrantHalfSize;
                // let originY = quadrantHalfSize - dims;
                // const moveInwards = dims * 0.4;
                // context.moveTo(originX, originY + moveInwards);
                // context.lineTo(originX + dims, originY);
                // context.lineTo(originX + dims, originY + dims);
                // context.lineTo(originX, originY + dims);
                // context.closePath();
                // context.fill();
                // context.stroke();
                break;
            }
            default: {
                ctx.saved(ctx => {
                    if (this.shape == 'cover') {
                        ctx.scale(1 / layer.layerScale());
                    }
                    SzInfo.quad.byName[this.shape].path(ctx, this);
                });
                return;
            }
        }
    }
    getHash() {
        return `${SzInfo.quad.byName[this.shape].code}${SzInfo.color.byName[this.color].code}${SzInfo.nToChar[this.from]}${SzInfo.nToChar[this.to]}`;
    }
    static fromShortKey(e) {
        return new SzLayerQuad({
            shape: SzInfo.quad.byChar[e[0]].name,
            color: SzInfo.color.byChar[e[1]].name,
            from: SzInfo.charToN[e[2]],
            to: SzInfo.charToN[e[3]],
        });
    }
}
const testTemplate = {
    quads: [
        { shape: 'square', color: 'green', from: 2, to: 4 },
        { shape: 'circle', color: 'pink', from: 5, to: 19 },
        { shape: 'square', color: 'green', from: 20, to: 22 },
    ],
};
class SzLayer {
    layerIndex = 0;
    quads = [];
    static createTest() {
        let l = new SzLayer(testTemplate);
        console.error('test layer', l);
        return l;
    }
    constructor(source, layerIndex) {
        if (source) {
            this.quads = (source.quads ?? []).map(e => new SzLayerQuad(e));
            if (source.layerIndex) {
                this.layerIndex = source.layerIndex;
            }
        }
        if (layerIndex != null) {
            this.layerIndex = layerIndex;
        }
        return this.normalize();
    }
    layerScale(layerIndex) {
        layerIndex ??= this.layerIndex;
        return 0.9 - 0.22 * layerIndex;
    }
    drawCenteredLayerScaled(ctx, layerIndex) {
        ctx.saved(ctx => {
            ctx.scale(this.layerScale(layerIndex));
            this.drawCenteredNormalized(ctx);
        });
    }
    drawCenteredNormalized(ctx) {
        ctx.saved(ctx => {
            this.clipShapes(ctx);
            this.quads.forEach(q => ctx.saved(ctx => this.fillQuad(q, ctx)));
        });
        ctx.saved(ctx => this.drawQuadOutline(ctx, true));
    }
    fillQuad(quad, ctx) {
        ctx.fillStyle = SzInfo.color.byName[quad.color].style;
        if (quad.color == 'cover')
            ;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        quad.outerPath(ctx, this);
        ctx.fill();
    }
    fullQuadPath(ctx, withCuts) {
        ctx.beginPath();
        for (let i = 0; i < this.quads.length; i++) {
            let prev = i > 0 ? this.quads[i - 1] : this.quads.slice(-1)[0];
            let quad = this.quads[i];
            if (withCuts || quad.from != prev.to % 24)
                ctx.lineTo(0, 0);
            quad.outerPath(ctx, this);
        }
        ctx.closePath();
    }
    drawQuadOutline(ctx, withCuts) {
        this.fullQuadPath(ctx, withCuts);
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = SzInfo.color.outline; // 'orange';
        ctx.stroke();
    }
    clipShapes(ctx) {
        this.fullQuadPath(ctx);
        ctx.clip();
    }
    clone() {
        return new SzLayer(this);
    }
    isNormalized() {
        for (let i = 0; i < this.quads.length; i++) {
            let next = this.quads[i];
            let prev = this.quads[i - 1] || this.quads[this.quads.length - 1];
            if (next.from < 0 || next.from >= 24)
                return false;
            if (next.from >= next.to)
                return false;
            if (i == 0) {
                if (prev.to > 24 && prev.to % 24 > next.from)
                    return false;
            }
            else {
                if (prev.to > next.from)
                    return false;
            }
        }
        let places = Array(24).fill('');
        Array(24).fill('');
        for (let q of this.quads) {
            for (let i = q.from; i < q.to; i++) {
                if (places[i % 24])
                    return false;
                places[i % 24] = q.shape;
            }
        }
        return true;
    }
    normalize() {
        if (this.isNormalized())
            return this;
        for (let i = 0; i < this.quads.length; i++) {
            let q = this.quads[i];
            if (q.from > q.to) {
                this.quads.splice(i, 1);
                i--;
                continue;
            }
            if (q.from >= 24) {
                q.from -= 24;
                q.to -= 24;
            }
        }
        this.quads.sort((a, b) => a.from - b.from);
        let places = Array(24).fill('');
        let paints = Array(24).fill('');
        for (let q of this.quads) {
            for (let i = q.from; i < q.to; i++) {
                places[i % 24] = q.shape;
            }
        }
        for (let i = 0; i < 24; i++)
            if (!places[i])
                paints[i] = '';
        if (!this.isNormalized()) {
            Object.assign(globalThis, { layer: this });
            console.error('Layer failed to normalize properly!', this);
            debugger;
        }
        return this;
    }
    isEmpty() {
        return this.quads.length == 0;
    }
    getQuadAtSector(s) {
        let s1 = (s + 0.5) % 24, s2 = s1 + 24;
        return this.quads.find(q => (q.from < s1 && q.to > s1) || (q.from < s2 && q.to > s2));
    }
    canStackWith(upper) {
        if (!upper)
            return true;
        for (let i = 0; i < 24; i++) {
            let q1 = this.getQuadAtSector(i);
            let q2 = upper.getQuadAtSector(i);
            if (q1 && q2)
                return false;
        }
        return true;
    }
    stackWith(upper) {
        if (!this.canStackWith(upper)) {
            console.error('Invalid stacking requested!');
            debugger;
            return this.clone();
        }
        if (!upper)
            return this.clone();
        return new SzLayer({
            quads: this.quads.concat(upper.quads),
        });
    }
    rotate(rot) {
        this.quads.map(e => { e.from += rot; e.to += rot; });
        return this.normalize();
    }
    cloneFilteredByQuadrants(includeQuadrants) {
        const good = (n) => includeQuadrants.includes((~~(n / 6)) % 4);
        let allowed = Array(48).fill(0).map((e, i) => good(i + 0.5));
        function convert(old) {
            let filled = Array(48).fill(0).map((e, i) => old.from < i + 0.5 && i + 0.5 < old.to);
            let last = old.clone();
            last.to = -999;
            let list = [];
            for (let i = 0; i < 48; i++) {
                if (!filled[i])
                    continue;
                if (!allowed[i])
                    continue;
                if (last.to != i) {
                    last = old.clone();
                    last.from = i;
                    last.to = i + 1;
                    list.push(last);
                }
                else {
                    last.to++;
                }
            }
            return list;
        }
        return new SzLayer({
            quads: this.quads.flatMap(convert),
        });
    }
    cloneAsCover() {
        function convert(quad) {
            return new SzLayerQuad({
                color: 'cover',
                shape: 'cover',
                from: quad.from, to: quad.to,
            });
        }
        return new SzLayer({
            quads: this.quads.flatMap(convert),
        }).paint('cover').normalize();
    }
    removeCover() {
        this.quads = this.quads.filter(e => e.shape != 'cover');
        return this;
    }
    filterPaint(paint) {
        return paint.map((e, i) => {
            let quad = this.getQuadAtSector(i);
            return quad && quad.shape == 'cover' ? null : e;
        });
    }
    paint(paint) {
        if (Array.isArray(paint))
            throw this;
        this.quads.map(e => e.color = paint);
        // if (!Array.isArray(paint)) paint = Array<color | null>(24).fill(paint);
        // paint.map((color, i) => {
        // 	if (color) {
        // 		this.areas.push(new SzLayerArea({
        // 			color,
        // 			from: i, to: i + 1,
        // 			shape: 'sector',
        // 		}))
        // 	}
        // });
        return this.normalize();
    }
    static fromShapezHash(hash) {
        let angle = 6;
        if (hash[0] == '6') {
            angle = 4;
            hash = hash.slice(1);
        }
        return new SzLayer({
            quads: hash.match(/../g).map((s, i) => {
                if (s[0] == '-')
                    return null;
                return new SzLayerQuad({
                    shape: SzInfo.quad.byChar[s[0]].name,
                    color: SzInfo.color.byChar[s[1]].name,
                    from: i * angle,
                    to: (i + 1) * angle,
                });
            }).filter(e => e),
        });
    }
    getHash() {
        if (this.quads.every(e => e.to - e.from == 6)) {
            return [0, 1, 2, 3].map(i => {
                let q = this.quads.find(q => q.from == i * 6);
                if (!q)
                    return '--';
                return q.getHash().slice(0, 2);
            }).join('');
        }
        return '6' + [0, 1, 2, 3, 4, 5].map(i => {
            let q = this.quads.find(q => q.from == i * 4);
            if (!q)
                return '--';
            return q.getHash().slice(0, 2);
        }).join('');
    }
    static fromShortKey(key) {
        if (key.startsWith('6') || !key.startsWith('!') && key.length == 8) {
            return SzLayer.fromShapezHash(key);
        }
        if (key.startsWith('sz!'))
            key = key.slice(3);
        if (!key.startsWith('l!z|'))
            throw new Error('invalid hash');
        let layer = new SzLayer();
        for (let part of key.split('|')) {
            if (part.startsWith('q!')) {
                let strs = part.slice('q!'.length).split(',');
                layer.quads = strs.map(e => SzLayerQuad.fromShortKey(e));
            }
        }
        return layer;
    }
}

const PI12 = -Math.PI / 12;
class SzContext2D {
    static fromCanvas(cv) {
        let ctx = cv.getContext('2d');
        ctx.scale(cv.width / 2, cv.height / 2);
        ctx.translate(1, 1);
        ctx.rotate(-Math.PI / 2);
        ctx.scale(1 / 1.15, 1 / 1.15);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        return new SzContext2D(ctx);
    }
    clear() {
        this.ctx.clearRect(-2, -2, 4, 4);
    }
    ctx;
    constructor(ctx) {
        this.ctx = ctx;
    }
    get lineWidth() { return this.ctx.lineWidth; }
    set lineWidth(v) { this.ctx.lineWidth = v; }
    get strokeStyle() { return this.ctx.strokeStyle; }
    set strokeStyle(v) { this.ctx.strokeStyle = v; }
    get fillStyle() { return this.ctx.fillStyle; }
    set fillStyle(v) {
        this.ctx.fillStyle = v || 'black';
        if (v == 'sz-cover') {
            let gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
            let c1 = '#00000000';
            let c2 = '#00000033';
            let n = 20;
            for (let i = 1; i < n; i++) {
                gradient.addColorStop((i - 0.01) / n, i % 2 ? c2 : c1);
                gradient.addColorStop((i + 0.01) / n, i % 2 ? c1 : c2);
            }
            this.ctx.fillStyle = gradient;
        }
        if (v == 'none') {
            let gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
            let c1 = 'red';
            let c2 = 'blue';
            let n = 20;
            for (let i = 0; i <= n; i++) {
                gradient.addColorStop(i / n, i % 2 ? c2 : c1);
            }
            this.ctx.fillStyle = gradient;
            // this.ctx.fillStyle = 'transparent';
        }
    }
    get globalAlpha() { return this.ctx.globalAlpha; }
    set globalAlpha(v) { this.ctx.globalAlpha = v; }
    createGradientFill(source) {
        if (source.type == 'none') {
            return source.color;
        }
        if (source.type == 'radial10') {
            let g = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 2);
            const n = 10;
            g.addColorStop(0, source.color);
            for (let i = 0; i < n; i++) {
                g.addColorStop((i + 0.5) / n, source.secondaryColor);
                g.addColorStop((i + 1) / n, source.color);
            }
            return g;
        }
        throw 0;
    }
    beginPath() { this.ctx.beginPath(); return this; }
    closePath() { this.ctx.closePath(); return this; }
    stroke() { this.ctx.stroke(); return this; }
    fill() { this.ctx.fill(); return this; }
    clip() { this.ctx.clip(); return this; }
    save() { this.ctx.save(); return this; }
    restore() { this.ctx.restore(); return this; }
    scale(x, y = x) {
        this.ctx.scale(x, y);
        return this;
    }
    rotate(angle) {
        this.ctx.rotate(-angle * PI12);
        return this;
    }
    moveTo(x, y) {
        // log({ move: { x: +x.toFixed(3), y: +y.toFixed(3) } });
        this.ctx.moveTo(y, x);
        return this;
    }
    moveToR(r, a) {
        this.moveTo(-r * Math.sin(a * PI12), r * Math.cos(a * PI12));
        return this;
    }
    lineTo(x, y) {
        // log({ line: { x: +x.toFixed(3), y: +y.toFixed(3) } })
        this.ctx.lineTo(y, x);
        return this;
    }
    lineToR(radius, direction) {
        this.lineTo(-radius * Math.sin(direction * PI12), radius * Math.cos(direction * PI12));
        return this;
    }
    rToXY(radius, direction) {
        return [-radius * Math.sin(direction * PI12), radius * Math.cos(direction * PI12)];
    }
    arc(cx, cy, radius, from, to, dir) {
        this.ctx.arc(cx, cy, radius, -from * PI12, -to * PI12, dir);
        return this;
    }
    fillRect(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h);
        return this;
    }
    saved(f) {
        this.save();
        f(this);
        this.restore();
    }
}

class SzDefinition extends BasicSerializableObject {
    static getId() {
        return "sz-definition";
    }
    static createTest() {
        return new SzDefinition({
            layers: [SzLayer.createTest()],
        });
    }
    constructor(data, clone = false) {
        super();
        if (typeof data == 'string')
            return SzDefinition.fromShortKey(data);
        if (data?.layers)
            this.layers = data.layers.map((e, i) => new SzLayer(e, i));
        if (!this.layers.every(e => e.isNormalized())) {
            this.layers = SzDefinition.createTest().layers;
        }
        // console.log(this.getHash())
        if (clone)
            return;
        if (SzDefinition.definitionCache.has(this.getHash())) {
            return SzDefinition.definitionCache.get(this.getHash());
        }
        console.log(this.getHash());
    }
    layers = [];
    cachedHash = '';
    bufferGenerator;
    getClonedLayers() {
        throw new Error("Method not implemented.");
    }
    isEntirelyEmpty() {
        return this.layers.every(e => e.isEmpty());
    }
    getHash() {
        if (this.cachedHash)
            return this.cachedHash;
        if (!this.layers.length)
            debugger;
        return this.cachedHash = this.layers.map(e => e.getHash()).join(':');
    }
    drawFullSizeOnCanvas(context, size) {
        this.internalGenerateShapeBuffer(null, context, size, size, 1);
    }
    generateAsCanvas(size = 120) {
        const [canvas, context] = makeOffscreenBuffer(size, size, {
            smooth: true,
            label: "definition-canvas-cache-" + this.getHash(),
            reusable: false,
        });
        this.internalGenerateShapeBuffer(canvas, context, size, size, 1);
        return canvas;
    }
    cloneFilteredByQuadrants(includeQuadrants) {
        let layers = this.layers.map(e => e.cloneFilteredByQuadrants(includeQuadrants)).filter(e => !e.isEmpty());
        return new SzDefinition({ layers });
    }
    cloneRotateCW() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(4))
        });
    }
    cloneRotate24(n) {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(n))
        });
    }
    cloneRotateCCW() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(24 - 4))
        });
    }
    cloneRotate180() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(12))
        });
    }
    cloneAndStackWith(upper) {
        let bottom = this.clone(e => e.removeCover()).layers;
        let top = upper.clone().layers;
        let dh = 0;
        dhloop: for (dh = 5; dh > 0; dh--) {
            for (let iBottom = 0; iBottom < bottom.length; iBottom++) {
                let iTop = iBottom - dh + 1;
                let can = bottom[iBottom].canStackWith(top[iTop]);
                console.log({
                    iBottom,
                    iTop, can
                });
                if (!can)
                    break dhloop;
            }
        }
        let overlap = bottom.length - dh;
        let newLayers = bottom.map((l, i) => {
            return l.stackWith(top[i - dh]);
        }).concat(top.slice(overlap));
        return new SzDefinition({ layers: newLayers.slice(0, 4) });
    }
    cloneAndPaintWith(color) {
        Array(24).fill(color);
        if (color == 'purple')
            color = 'pink';
        return this.clone((l, i, a) => l.clone().paint(color));
        // return this.clone((l, i, a) => {
        // 	let paints = a.slice(i).reduceRight((v, e) => e.filterPaint(v), rawPaints);
        // 	return l.removeCover().paint(paints);
        // });
    }
    cloneAndPaintWith4Colors(colors) {
        throw new Error("Method not implemented.");
    }
    cloneAndMakeCover() {
        return new SzDefinition({ layers: this.layers.map(e => e.cloneAsCover()) });
    }
    clone(layerMapper) {
        if (layerMapper) {
            return new SzDefinition({
                layers: this.layers.map(e => e.clone()).flatMap((e, i, a) => {
                    return layerMapper(e, i, a) || [];
                }).filter(e => !e.isEmpty())
            });
        }
        return new SzDefinition(this, true);
    }
    static getSchema() {
        return types.string;
    }
    serialize() {
        return this.getHash();
    }
    deserialize(data, root) {
        console.log('deser', this);
    }
    // inherited
    drawCentered(x, y, parameters, diameter) {
        const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
        if (!this.bufferGenerator) {
            this.bufferGenerator = this.internalGenerateShapeBuffer.bind(this);
        }
        const key = diameter + "/" + dpi + "/" + this.cachedHash;
        const canvas = parameters.root.buffers.getForKey({
            key: "shapedef",
            subKey: key,
            w: diameter,
            h: diameter,
            dpi,
            redrawMethod: this.bufferGenerator,
        });
        parameters.context.drawImage(canvas, x - diameter / 2, y - diameter / 2, diameter, diameter);
    }
    internalGenerateShapeBuffer(canvas, ctx, w, h, dpi) {
        // prepare context
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 0.05;
        ctx.translate((w * dpi) / 2, (h * dpi) / 2);
        ctx.scale((dpi * w) / 2.3, (dpi * h) / 2.3);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = THEME.items.outline;
        ctx.lineWidth = THEME.items.outlineWidth / 10;
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = THEME.items.circleBackground;
        ctx.beginPath();
        ctx.arc(0, 0, 1.15, 0, 2 * Math.PI);
        ctx.fill();
        let sCtx = new SzContext2D(ctx);
        this.layers.forEach((l, i) => l.drawCenteredLayerScaled(sCtx, i));
    }
    static rawHashMap = new Map();
    static getHashfromRawHash(hash) {
        if (!this.rawHashMap.has(hash)) {
            this.rawHashMap.set(hash, SzDefinition.fromShortKey(hash).getHash());
        }
        return this.rawHashMap.get(hash);
    }
    static fromRawShape(shapeDefinition) {
        if (typeof shapeDefinition != 'string')
            shapeDefinition = shapeDefinition.getHash();
        return new SzDefinition({
            layers: shapeDefinition.split(':').map(e => SzLayer.fromShortKey(e))
        });
    }
    static definitionCache = new Map();
    static fromShortKey(key) {
        if (!this.definitionCache.has(key)) {
            this.definitionCache.set(key, new SzDefinition({
                layers: key.split(':').map(e => SzLayer.fromShortKey(e))
            }));
        }
        return this.definitionCache.get(key);
    }
    compute_ANALYZE(root) {
        let firstQuad = this.layers[0].quads[0];
        if (firstQuad.from != 0)
            return [null, null];
        let definition = new SzDefinition({ layers: [SzInfo.quad.exampleLayer(firstQuad.shape)] });
        // @ts-expect-error
        let color = enumShortcodeToColor[SzInfo.color.byName[firstQuad.color].code];
        return [
            COLOR_ITEM_SINGLETONS[color],
            root.shapeDefinitionMgr.getShapeItemFromDefinition(definition),
        ];
    }
    static install(mod) {
        mod.modInterface.extendObject(ShapeDefinition, ({ $old }) => ({
            fromShortKey(key) {
                return SzDefinition.fromShortKey(key);
            },
            isValidShortKey(key) {
                try {
                    SzDefinition.fromShortKey(key);
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
        }));
        mod.modInterface.extendClass(LogicGateSystem, ({ $old }) => ({
            compute_ANALYZE(parameters) {
                let item = parameters[0];
                if (!item || item.getItemType() !== "shape") {
                    // Not a shape
                    return [null, null];
                }
                let def = item.definition;
                if (def instanceof SzDefinition) {
                    return def.compute_ANALYZE(this.root);
                }
                return $old.compute_ANALYZE.call(this, parameters);
            }
        }));
    }
}

class SzLevel {
    index;
    shapeName;
    shape;
    required;
    reward;
    throughputOnly = false;
    constructor(index, required, shape, reward) {
        this.index = index;
        if (named[shape]) {
            this.shapeName = shape;
            shape = named[shape];
        }
        this.shape = shape;
        this.required = required;
        this.reward = reward;
    }
    static modifyLevelDefinitions(levels) {
        Object.assign(levels, levelDefinitions);
        Object.assign(globalThis, { levels });
        levels.map(d => {
            if (named[d.shape]) {
                d.shape = named[d.shape];
            }
            d.shape = SzDefinition.getHashfromRawHash(d.shape);
            d.required = ~~(d.required / 3);
        });
    }
    static modifyUpgrades(upgrades) {
        Object.values(upgrades).flat().flatMap(e => e.required)
            .map(e => {
            e.shape = SzDefinition.getHashfromRawHash(e.shape);
            if (named[e.shape])
                e.shape = named[e.shape];
            e.amount = ~~(e.amount / 10);
        });
        Object.assign(globalThis, { upgrades });
    }
    static install(mod) {
        mod.signals.modifyLevelDefinitions.add(SzLevel.modifyLevelDefinitions);
        mod.signals.modifyUpgrades.add(SzLevel.modifyUpgrades);
        let r = 'reward_painter_double';
        T.storyRewards[r] = {
            title: 'Multicolor painter',
            desc: `
				You have unlocked <strong>Double Painter</strong>.<br>
				It can use more then a single paint at once to paint shapes in 7 combined colors
			`,
        };
        ExtendSuperclass(mod, GameMode, (old) => {
            // @ts-ignore
            return class HexaGameMode extends GameMode {
                getBlueprintShapeKey() {
                    return SzInfo.quad.named6.blueprint;
                }
            };
        });
        ExtendSuperclass(mod, HubGoals, (old) => {
            return class HexaGameMode extends HubGoals {
                computeFreeplayShape(level) {
                    const rng = new RandomNumberGenerator(this.root.map.seed + "/" + level);
                    return SzLevel.computeFreeplayShape(level, rng);
                }
            };
        });
        // const rewardName = T.storyRewards[reward].title;
        // let html = `
        // <div class="rewardName">
        //     ${T.ingame.levelCompleteNotification.unlockText.replace("<reward>", rewardName)}
        // </div>
        // <div class="rewardDesc">
        //     ${T.storyRewards[reward].desc}
        // </div>
    }
    static computeFreeplayShape(level, rng) {
        let layerCount = 1;
        if (level >= 50)
            layerCount = 2;
        if (level >= 75)
            layerCount = 3;
        if (level >= 100)
            layerCount = 4;
        if (rng.next() < 0.2) {
            layerCount && layerCount--;
            if (rng.next() < 0.25) {
                layerCount && layerCount--;
            }
        }
        const allowHoles = level > 60;
        let choice = (s) => rng.choice(s.split(''));
        const shapes = "RCSW";
        const symmetries = [
            "012210",
            "012321",
            "012012",
            "010101", // third-rotate
        ];
        const colorWheel = "rygcbp".repeat(3);
        const extraColors = level < 50 ? "w" : "wu";
        const colorWheelGroups = [
            "a012",
            "a024",
            "ab03",
            "0134", // opposite pairs
        ];
        const symmetryOffset = +choice('012345');
        const cwOffset = +choice('012345');
        const symmetry = rng.choice(symmetries).repeat(3).slice(symmetryOffset, symmetryOffset + 6);
        const colors = rng.choice(colorWheelGroups)
            .replace(/\d/g, n => colorWheel[+n + cwOffset])
            .replace(/[ab]/g, () => choice(extraColors));
        /** @type {ShapestLayer[]} */
        let layers = [];
        for (let layerIndex = 0; layerIndex <= layerCount; layerIndex++) {
            const quads = Array(6).fill('').map(() => choice(shapes) + choice(colors));
            if (allowHoles) {
                quads[+choice('012345')] = '--';
            }
            // const layer = new Shape6Layer('6' + symmetry.replace(/\d/g, n => quads[+n]), layerIndex);
            // if (!allowUnstackable && layers.length && layer.can_fall_through(layers[layers.length - 1])) {
            // 	layerIndex--;
            // } else {
            // 	layers.push(layer);
            // }
            layers.push('6' + symmetry.replace(/\d/g, n => quads[+n]));
        }
        return SzDefinition.fromShortKey(layers.join(':'));
    }
}
const named = SzInfo.quad.named;
const levelDefinitions = [
// new SzLevel(1, 30, 'circle1', 'reward_cutter_and_trash'),
// new SzLevel(2, 40, 'circleHalfLeft', 'no_reward'),
// new SzLevel(3, 70, 'square2', 'reward_balancer'),
// new SzLevel(4, 70, 'squareHalfRight', 'reward_rotater'),
// new SzLevel(5, 170, 'circleHalfTop2', 'reward_tunnel'),
// new SzLevel(6, 270, 'squareHalfTop2', 'reward_painter'),
// new SzLevel(7, 300, 'circleRed', 'reward_rotater_ccw'),
// new SzLevel(8, 480, 'square3TopBlue', 'reward_painter_double'),
// new SzLevel(9, 600, 'star3Cyan', 'reward_blueprints'),
// new SzLevel(10, 800, 'diamond', 'reward_stacker'),
// new SzLevel(11, 1000, 'squid', 'no_reward'),
// new SzLevel(12, 1000, 'splikeball48', 'no_reward'),
// // @ts-expect-error
// new SzLevel(8, 480, "RbRb----", 'reward_mixer'),
// // @ts-expect-error
// new SzLevel(9, 600, "CpCpCpCp", 'reward_merger'),
// // @ts-expect-error
// new SzLevel(10, 800, "ScScScSc", 'reward_stacker'),
// // @ts-expect-error
// new SzLevel(11, 1000, "CgScScCg", 'reward_miner_chainable'),
// // @ts-expect-error
// new SzLevel(12, 1000, "CbCbCbRb:CwCwCwCw", 'reward_blueprints'),
];
// 	// Tunnel Tier 2
// 	{
// 		shape: chinaShapes ? "CuCuCuCu:CwCwCwCw:Sb--Sr--" : "RpRpRpRp:CwCwCwCw", // painting t3
// 		required: 3800,
// 		reward: enumHubGoalRewards.reward_underground_belt_tier_2,
// 	},
// 	// 14
// 	// Belt reader
// 	{
// 		shape: "--Cg----:--Cr----", // unused
// 		required: 8, // Per second!
// 		reward: enumHubGoalRewards.reward_belt_reader,
// 		throughputOnly: true,
// 	},
// 	// 15
// 	// Storage
// 	{
// 		shape: "SrSrSrSr:CyCyCyCy", // unused
// 		required: 10000,
// 		reward: enumHubGoalRewards.reward_storage,
// 	},
// 	// 16
// 	// Quad Cutter
// 	{
// 		shape: "SrSrSrSr:CyCyCyCy:SwSwSwSw", // belts t4 (two variants)
// 		required: 6000,
// 		reward: enumHubGoalRewards.reward_cutter_quad,
// 	},
// 	// 17
// 	// Double painter
// 	{
// 		shape: chinaShapes
// 			? "CyCyCyCy:CyCyCyCy:RyRyRyRy:RuRuRuRu"
// 			: "CbRbRbCb:CwCwCwCw:WbWbWbWb", // miner t4 (two variants)
// 		required: 20000,
// 		reward: enumHubGoalRewards.reward_painter_double,
// 	},
// 	// 18
// 	// Rotater (180deg)
// 	{
// 		shape: "Sg----Sg:CgCgCgCg:--CyCy--", // unused
// 		required: 20000,
// 		reward: enumHubGoalRewards.reward_rotater_180,
// 	},
// 	// 19
// 	// Compact splitter
// 	{
// 		shape: "CpRpCp--:SwSwSwSw",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_splitter, // X
// 	},
// 	// 20
// 	// WIRES
// 	{
// 		shape: finalGameShape,
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_wires_painter_and_levers,
// 	},
// 	// 21
// 	// Filter
// 	{
// 		shape: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_filter,
// 	},
// 	// 22
// 	// Constant signal
// 	{
// 		shape: chinaShapes
// 			? "RrSySrSy:RyCrCwCr:CyCyRyCy"
// 			: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_constant_signal,
// 	},
// 	// 23
// 	// Display
// 	{
// 		shape: chinaShapes
// 			? "CrCrCrCr:CwCwCwCw:WwWwWwWw:CrCrCrCr"
// 			: "CcSyCcSy:SyCcSyCc:CcSyCcSy",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_display,
// 	},
// 	// 24 Logic gates
// 	{
// 		shape: chinaShapes
// 			? "Su----Su:RwRwRwRw:Cu----Cu:CwCwCwCw"
// 			: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_logic_gates,
// 	},
// 	// 25 Virtual Processing
// 	{
// 		shape: "Rg--Rg--:CwRwCwRw:--Rg--Rg",
// 		required: 25000,
// 		reward: enumHubGoalRewards.reward_virtual_processing,
// 	},
// 	// 26 Freeplay
// 	{
// 		shape: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw",
// 		required: 50000,
// 		reward: enumHubGoalRewards.reward_freeplay,
// 	},
// ]),
// ];

class SzShapeItem extends ShapeItem {
    static getId() {
        return 'szItem';
    }
    // @ts-ignore
    definition;
    constructor(definition) {
        if (SzShapeItem.constructorCache.has(definition.getHash())) {
            return SzShapeItem.constructorCache.get(definition.getHash());
        }
        super(null);
        this.definition = definition;
        this.definition.getHash();
        SzShapeItem.constructorCache.set(definition.getHash(), this);
    }
    static constructorCache = new Map();
    static getSchema() {
        return types.string;
    }
    getItemType() {
        return 'shape';
    }
    equals(other) {
        return other.getItemType() == this.getItemType() && other.definition == this.definition;
    }
    drawItemCenteredClipped(x, y, parameters, diameter) {
        if (!parameters.visibleRect.containsCircle(x, y, diameter / 2))
            return;
        if (!diameter)
            throw new Error();
        this.drawItemCenteredImpl(x, y, parameters, diameter);
    }
    getBackgroundColorAsResource() {
        return THEME.map.resources.shape;
    }
    static deserialize(data) {
        // debugger;
        console.log('deserialize', data);
        if (data.length < 4)
            debugger;
        // this.definition = SzDefinition.fromShortKey(data);
        return new SzShapeItem(new SzDefinition(data));
    }
    serialize() {
        let h = this.definition.getHash();
        if (h.length < 4)
            debugger;
        // console.log('serialize', h);
        return h;
    }
    // deserialize(data: any, root?: GameRoot): string | void {
    // 	throw new Error("Method not implemented.");
    // }
    getAsCopyableKey() {
        throw new Error("Method not implemented.");
    }
    equalsImpl(other) {
        throw new Error("Method not implemented.");
    }
    drawFullSizeOnCanvas(context, size) {
        this.definition.drawFullSizeOnCanvas(context, size);
    }
    drawItemCenteredImpl(x, y, parameters, diameter) {
        this.definition.drawCentered(x, y, parameters, diameter);
    }
    static install(mod) {
        mod.modInterface.extendClass(ShapeDefinitionManager, ({ $old }) => ({
            getShapeItemFromDefinition(definition) {
                if (!(definition instanceof SzDefinition)) {
                    return $old.getShapeItemFromDefinition.call(this, definition);
                }
                return this.shapeKeyToItem[definition.getHash()] ??= new SzShapeItem(definition);
            }
        }));
        mod.modInterface.registerItem(SzShapeItem, data => SzShapeItem.deserialize(data));
    }
}

const shapePatchChances = {
    circleSpawn: { base: 50, growth: 3, cap: 100 },
    squareSpawn: { base: 100, growth: 2, cap: 100 },
    starSpawn: { base: 20, growth: 1, cap: 100 },
    windmillSpawn: { base: 6, growth: 0.5, cap: 100 },
};
const predefinedPatches = [
    {
        x: 0, y: 0, item: 
        // SzColorItem.fromColor('red')
        COLOR_ITEM_SINGLETONS.red,
        dx: 7, dy: 7
    },
    { x: -1, y: 0, item: SzInfo.quad.named.circleSpawn, dx: -9, dy: 7 },
    { x: 0, y: -1, item: SzInfo.quad.named.squareSpawn, dx: 5, dy: -7 },
    {
        x: -1, y: -1, item: 
        // SzColorItem.fromColor('green')
        COLOR_ITEM_SINGLETONS.green
    },
    { x: 5, y: -2, item: SzInfo.quad.named.starSpawn, dx: 5, dy: -7 },
];
class SpawnOwerride extends MapChunk {
    // internalGenerateColorPatch(rng: RandomNumberGenerator, colorPatchSize: number, distanceToOriginInChunks: number) {
    // 	console.log(this)
    // 	let available = ['red', 'green'];
    // 	if (distanceToOriginInChunks > 2) available.push('blue');
    // 	this.internalGeneratePatch(rng, colorPatchSize, SzColorItem.fromColor(rng.choice(available)));
    // }
    internalGenerateShapePatch(rng, shapePatchSize, distanceToOriginInChunks) {
        let dToChance = (base, grow, maxTotal) => Math.round(base + clamp(distanceToOriginInChunks * grow, 0, maxTotal - base));
        let weights = Object.fromEntries(Object.entries(shapePatchChances).map(([k, { base, growth, cap }]) => [k, dToChance(base, growth, cap)]));
        if (distanceToOriginInChunks < 7) {
            // Initial chunks can not spawn the good stuff
            weights.starSpawn = 0;
            weights.windmillSpawn = 0;
        }
        let quadNames = [];
        let next = this.internalGenerateRandomSubShape(rng, weights);
        quadNames.push(next);
        if (distanceToOriginInChunks >= 10) {
            let next = this.internalGenerateRandomSubShape(rng, weights);
            while (quadNames.concat(next).filter(e => e == 'windmillSpawn').length > 1)
                next = this.internalGenerateRandomSubShape(rng, weights);
            quadNames.push(next);
        }
        if (distanceToOriginInChunks >= 15) {
            let next = this.internalGenerateRandomSubShape(rng, weights);
            while (quadNames.concat(next).filter(e => e == 'windmillSpawn').length > 1)
                next = this.internalGenerateRandomSubShape(rng, weights);
            quadNames.push(next);
        }
        let quadHashes = quadNames.map(e => SzInfo.quad.named[e]);
        let hash = '6' + quadHashes.map((e, i, a) => {
            let l = 12 / a.length;
            return e.slice(1 + l * i, 1 + l * (i + 1));
        }).join('');
        const definition = SzDefinition.fromShortKey(hash);
        this.internalGeneratePatch(rng, shapePatchSize, this.root.shapeDefinitionMgr.getShapeItemFromDefinition(definition));
    }
    generatePredefined(rng) {
        let def = predefinedPatches.find(p => p.x == this.x && p.y == this.y);
        if (!def)
            return false;
        let item = def.item instanceof BaseItem ? def.item
            : this.root.shapeDefinitionMgr.getShapeItemFromDefinition(ShapeDefinition.fromShortKey(def.item));
        let dx = def.dx == null ? null : def.dx + (def.dx > 0 ? 0 : globalConfig.mapChunkSize);
        let dy = def.dy == null ? null : def.dy + (def.dy > 0 ? 0 : globalConfig.mapChunkSize);
        this.internalGeneratePatch(rng, 2, item, dx, dy);
        return true;
    }
    static install(mod) {
        ExtendSuperclass(mod, MapChunk, () => SpawnOwerride);
    }
}

const METADATA = {
    "id": "hexagonal",
    "version": "1.3.0",
    "name": "hexagonal",
    "author": "Dimava",
    "description": "Hexagonal shapes",
    "website": "",
    "settings": {},
};
class Mod extends Mod$1 {
    init() {
        // return;
        this.use(SzDefinition);
        this.use(SzShapeItem);
        // this.use(SzColorItem);
        // this.use(PainterOverride);
        // this.use(Balancer22);
        // this.use(Rotator3);
        this.use(SpawnOwerride);
        this.use(SzLevel);
        // this.use(TestMode);
        for (let c in enumShortcodeToColor$1) {
            // @ts-ignore
            SzInfo.color.byChar[c].style = enumColorsToHexCode[enumShortcodeToColor$1[c]];
        }
    }
    use(module) {
        module.install(this);
        return this;
    }
}
