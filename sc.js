const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const canvas = document.getElementById('canvas');
const cameraContainer = document.getElementById('camera-container');
const countdownOverlay = document.getElementById('countdown-overlay');
const flashEffect = document.getElementById('flash-effect');
const openCountModalBtn = document.getElementById('open-count-modal');
const openEffectModalBtn = document.getElementById('open-effect-modal');
const countLabel = document.getElementById('count-label');
const effectLabel = document.getElementById('effect-label');
const welcomeScreen = document.getElementById('welcome-screen');
const boothScreen = document.getElementById('booth-screen');
const editScreen = document.getElementById('edit-screen');
const editPreviewImg = document.getElementById('edit-preview-img');
const editDownloadBtn = document.getElementById('edit-download-btn');
const editFrameNote = document.getElementById('edit-frame-note');
const photoPickSection = document.getElementById('photo-pick-section');
const photoPickFormat = document.getElementById('photo-pick-format');
const photoPickGridWrap = document.getElementById('photo-pick-grid-wrap');
const photoPickGrid = document.getElementById('photo-pick-grid');
const photoPickCounter = document.getElementById('photo-pick-counter');

// Definisi frame:
// - "base"     = layout 3 slot yang dipakai & diulang per lembar buat jumlah foto kelipatan 3 (3, 6, 9, 12...)
// - "variants" = layout khusus (1 lembar, slot sesuai persis) buat jumlah foto tertentu yang BUKAN kelipatan 3.
//                Kalau suatu jumlah foto belum ada variant-nya, sistem otomatis fallback ke "base" (foto
//                terakhir diulang buat ngisi slot kosong). Begitu variant-nya ditambahin di sini, otomatis kepake.
const FRAME_DEFS = {
    classic: {
        label: 'Classic White',
        base: {
            src: 'frames/classic.png',
            canvasW: 591,
            canvasH: 1772,
            slots: [
                { x: 89, y: 86, w: 413, h: 412 },
                { x: 89, y: 567, w: 413, h: 413 },
                { x: 89, y: 1049, w: 413, h: 413 }
            ]
        },
        variants: {
            1: {
                src: 'frames/single_classic_whiite.png',
                canvasW: 591,
                canvasH: 749,
                slots: [
                    { x: 88, y: 35, w: 415, h: 415 }
                ]
            },
            2: {
                src: 'frames/2_classic_white.png',
                canvasW: 591,
                canvasH: 1225,
                slots: [
                    { x: 88, y: 29, w: 415, h: 415 },
                    { x: 88, y: 511, w: 415, h: 415 }
                ]
            }
        }
    },
    frame1: {
        label: 'Brownc',
        base: {
            src: 'frames/frame1.png',
            canvasW: 591,
            canvasH: 1772,
            slots: [
                { x: 89, y: 86, w: 413, h: 412 },
                { x: 89, y: 567, w: 413, h: 413 },
                { x: 89, y: 1049, w: 413, h: 413 }
            ]
        },
        variants: {
            1: {
                src: 'frames/single_brownc.png',
                canvasW: 591,
                canvasH: 749,
                slots: [
                    { x: 88, y: 35, w: 415, h: 415 }
                ]
            },
            2: {
                src: 'frames/2_brownc.png',
                canvasW: 591,
                canvasH: 1225,
                slots: [
                    { x: 88, y: 29, w: 415, h: 415 },
                    { x: 88, y: 511, w: 415, h: 415 }
                ]
            }
        }
    },
    frame2: {
        label: 'Bured',
        base: {
            src: 'frames/frame2.png',
            canvasW: 591,
            canvasH: 1772,
            slots: [
                { x: 89, y: 86, w: 413, h: 412 },
                { x: 89, y: 568, w: 413, h: 412 },
                { x: 89, y: 1049, w: 413, h: 413 }
            ]
        },
        variants: {
            1: {
                src: 'frames/single_bured.png',
                canvasW: 591,
                canvasH: 749,
                slots: [
                    { x: 88, y: 36, w: 414, h: 414 }
                ]
            },
            2: {
                src: 'frames/2_bured.png',
                canvasW: 591,
                canvasH: 1225,
                slots: [
                    { x: 88, y: 30, w: 414, h: 414 },
                    { x: 88, y: 512, w: 414, h: 413 }
                ]
            }
        }
    },
    frame3: {
        label: 'Silver Fang',
        base: {
            src: 'frames/frame3.png',
            canvasW: 591,
            canvasH: 1772,
            slots: [
                { x: 89, y: 86, w: 413, h: 412 },
                { x: 89, y: 567, w: 413, h: 413 },
                { x: 89, y: 1049, w: 413, h: 413 }
            ]
        },
        variants: {
            1: {
                src: 'frames/single_silver_fang.png',
                canvasW: 590,
                canvasH: 749,
                slots: [
                    { x: 87, y: 34, w: 417, h: 420 }
                ]
            },
            2: {
                src: 'frames/2_silver_fang.png',
                canvasW: 590,
                canvasH: 1225,
                slots: [
                    { x: 87, y: 29, w: 417, h: 416 },
                    { x: 87, y: 511, w: 417, h: 416 }
                ]
            }
        }
    },
    cuteRed: {
        label: 'Cute Red',
        base: {
            src: 'frames/cute_red.png',
            canvasW: 591,
            canvasH: 1771,
            slots: [
                    { x: 56, y: 65, w: 481, h: 464 },
                    { x: 60, y: 582, w: 474, h: 473 },
                    { x: 61, y: 1111, w: 473, h: 404 }
            ]
        },
        variants: {
            1: {
                src: 'frames/single_cute_red.png',
                canvasW: 589,
                canvasH: 708,
                slots: [
                    { x: 59, y: 53, w: 473, h: 404 }
                ]
            },
            2: {
                src: 'frames/2cute_red.png',
                canvasW: 590,
                canvasH: 1230,
                slots: [
                    { x: 60, y: 40, w: 474, h: 473 },
                    { x: 60, y: 569, w: 474, h: 404 }
                ]
            }
        }
    },
    funDrop: {
        label: 'FunDrop',
        base: {
            src: 'frames/fundrop.png',
            canvasW: 590,
            canvasH: 1771,
            slots: [
                    { x: 88, y: 54, w: 415, h: 374 },
                    { x: 88, y: 520, w: 415, h: 374 },
                    { x: 88, y: 987, w: 415, h: 374 }
            ]
        },
        variants: {
            1: {
                src: 'frames/single_fundrop.png',
                canvasW: 590,
                canvasH: 772,
                slots: [
                    { x: 88, y: 54, w: 415, h: 374 }
                ]
            },
            2: {
                src: 'frames/2_fundrop.png',
                canvasW: 590,
                canvasH: 1305,
                slots: [
                    { x: 88, y: 54, w: 415, h: 374 },
                    { x: 88, y: 521, w: 415, h: 374 }
                ]
            }
        }
    }
};
const FRAME_LABELS = { classic: 'Classic White', frame1: 'Brownc', frame2: 'Bured', frame3: 'Silver Fang', cuteRed: 'Cute Red', funDrop: 'FunDrop' };
const frameImageCache = {};

let currentFrame = 'classic';

// Daftar booth & frame di dalamnya
const BOOTHS = {
    booth1: { label: 'Booth 1', frames: ['classic', 'frame1', 'frame2', 'frame3'] },
    booth2: { label: 'Booth 2', frames: ['cuteRed', 'funDrop'] },
    // Booth 3 (LDR): sementara pakai frame Booth 1, disembunyikan dari galeri Frames biar nggak dobel
    booth3: { label: 'Booth 3 (LDR)', frames: ['classic', 'frame1', 'frame2', 'frame3'], hidden: true }
};
let currentBooth = 'booth1';

// Simpan posisi menu (sessionStorage) biar refresh tetap di menu yang sama
const STATE_KEY = 'nsPhotoboothState';
let currentScreen = 'home';   // 'home' | 'booth' | 'frames' | 'camera'
let stateReady = false;       // baru mulai nyimpen setelah state lama selesai dipulihkan
function saveState() {
    if (!stateReady) return;
    try {
        sessionStorage.setItem(STATE_KEY, JSON.stringify({
            screen: currentScreen, booth: currentBooth, frame: currentFrame,
            shots: shotCount, countdown: countdownSeconds, mirror: mirrorResult, facing: facingMode
        }));
    } catch (e) { /* storage diblokir, abaikan */ }
}
function boothOfFrame(frameId) {
    return Object.keys(BOOTHS).find(b => BOOTHS[b].frames.includes(frameId)) || 'booth1';
}

// Bikin daftar frame (popup Pilih Frame & panel edit) sesuai booth yang aktif
function renderFrameLists() {
    const ids = BOOTHS[currentBooth].frames;
    const grid = document.getElementById('effect-grid');
    if (grid) {
        grid.innerHTML = ids.map(id => `
            <button onclick="setFrameChoice('${id}')" data-effect="${id}" class="effect-btn flex flex-col items-center gap-1 p-1.5 rounded-2xl bg-mist text-deep hover:opacity-80 transition cursor-pointer">
                <img src="${FRAME_DEFS[id].base.src}" class="w-full aspect-[9/16] object-cover rounded bg-white">
                <span class="text-[11px] leading-tight font-bold text-center">${FRAME_LABELS[id]}</span>
            </button>`).join('');
    }
    const list = document.getElementById('edit-frame-list');
    if (list) {
        list.innerHTML = ids.map(id => `
            <button onclick="selectEditFrame('${id}')" data-frame="${id}" class="edit-frame-btn p-3 rounded-full bg-mist text-deep font-bold hover:opacity-80 transition cursor-pointer">${FRAME_LABELS[id]}</button>`).join('');
    }
    highlightActiveButton('effect-btn', 'data-effect', currentFrame);
    highlightActiveButton('edit-frame-btn', 'data-frame', currentEditFrame);
}
let shotCount = 3;
let cameraStream = null;
let inBoothScreen = false;
let lastRawShots = [];
let lastShotCount = 0;
let currentEditFrame = 'classic';
let pickCount = 0;
let selectedShotIndices = [];
let selectedFormat = 3; // dipakai khusus buat take 6x-12x: pilihan "3 Foto" atau "6 Foto"

// 1. Akses Webcam (dipanggil manual pas masuk booth screen, bukan otomatis pas buka web)
let facingMode = 'user';   // 'user' = kamera depan, 'environment' = kamera belakang
let mirrorResult = true;   // true = hasil foto (dan preview) di-mirror
let cameraRequestId = 0;

// Tampilan toggle switch on/off (warna track + posisi knob)
function setToggleUI(btn, on) {
    if (!btn) return;
    btn.setAttribute('aria-checked', String(on));
    btn.classList.toggle('bg-mint', on);
    btn.classList.toggle('bg-mist', !on);
    const knob = btn.querySelector('span');
    if (knob) knob.classList.toggle('translate-x-5', on);
}

function applyMirrorPreview() {
    if (video) video.classList.toggle('-scale-x-100', mirrorResult);
    setToggleUI(document.getElementById('mirror-toggle-btn'), mirrorResult);
    setToggleUI(document.getElementById('switch-camera-btn'), facingMode === 'environment');
}

function startCamera() {
    const requestId = ++cameraRequestId;
    stopCamera(); // pastikan stream lama mati dulu (wajib di iOS sebelum ganti kamera)
    applyMirrorPreview();

    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facingMode } }, audio: false })
        .then(stream => {
            // kalau ada request kamera yang lebih baru (klik cepat), buang stream ini
            if (requestId !== cameraRequestId) {
                stream.getTracks().forEach(track => track.stop());
                return;
            }
            cameraStream = stream;
            video.srcObject = stream;
            ldrOnLocalStream(stream);
        })
        .catch(err => {
            alert("Gagal akses kamera! Pastikan izin kamera diaktifkan.");
            console.error(err);
        });
}

// 1b. Matikan Kamera Otomatis
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    if (video) {
        video.srcObject = null;
    }
}

window.addEventListener('pagehide', stopCamera);
window.addEventListener('beforeunload', stopCamera);

document.addEventListener('visibilitychange', () => {
    if (!inBoothScreen) return; // kamera memang belum/tidak aktif di welcome/edit screen
    if (document.hidden) {
        stopCamera();
    } else if (!cameraStream) {
        startCamera();
    }
});

// 0. Pindah antar Welcome Screen (pilih tema), Booth Screen (kamera) & Edit Screen (pilih frame hasil)
function enterBooth(themeId) {
    inBoothScreen = true;
    setNav(false);
    if (homeScreen) homeScreen.classList.add('hidden');
    if (framesScreen) framesScreen.classList.add('hidden');
    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    if (editScreen) {
        editScreen.classList.add('hidden');
        editScreen.classList.remove('flex', 'flex-col');
    }
    if (boothScreen) {
        boothScreen.classList.remove('hidden');
        boothScreen.classList.add('flex', 'flex-col');
    }
    if (BOOTHS[themeId]) currentBooth = themeId;
    if (!BOOTHS[currentBooth].frames.includes(currentFrame)) currentFrame = BOOTHS[currentBooth].frames[0];
    renderFrameLists();
    setFrameChoice(currentFrame);
    startCamera();
    if (currentBooth === 'booth3') ldrEnter(); else ldrLeave();
    currentScreen = 'camera';
    saveState();
}

// Home -> pilih booth
const homeScreen = document.getElementById('home-screen');
const framesScreen = document.getElementById('frames-screen');
const mainNav = document.getElementById('main-nav');

// Navbar: tampil di Home / Booth / Frames, disembunyikan pas lagi di kamera & edit
function setNav(visible, active) {
    if (!mainNav) return;
    mainNav.classList.toggle('hidden', !visible);
    document.querySelectorAll('.nav-btn').forEach(b => {
        const on = b.dataset.nav === active;
        b.classList.toggle('bg-mint', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('text-deep', !on);
    });
}

function showScreen(name) {
    if (homeScreen) homeScreen.classList.toggle('hidden', name !== 'home');
    if (welcomeScreen) welcomeScreen.classList.toggle('hidden', name !== 'booth');
    if (framesScreen) framesScreen.classList.toggle('hidden', name !== 'frames');
    if (name === 'frames') renderFramesGallery();
    setNav(true, name);
    currentScreen = name;
    saveState();
}
function navTo(name) { showScreen(name); }
function startPhotobooth() { showScreen('booth'); }
function showHome() { showScreen('home'); }

function renderFramesGallery() {
    const wrap = document.getElementById('frames-grid');
    if (wrap) {
        wrap.innerHTML = Object.keys(BOOTHS).filter(b => !BOOTHS[b].hidden).map(bid => `
            <h2 class="text-sm font-bold text-deep mb-2 ${bid === 'booth1' ? '' : 'mt-6'}">${BOOTHS[bid].label}</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${BOOTHS[bid].frames.map(id => `
                <button onclick="pickFrameFromGallery('${id}')" data-frame-pick="${id}" class="frames-card flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-line hover:border-mint transition cursor-pointer">
                    <img src="${FRAME_DEFS[id].base.src}" class="w-full aspect-[9/16] object-cover rounded-xl bg-white">
                    <span class="text-sm font-bold text-ink">${FRAME_LABELS[id]}</span>
                </button>`).join('')}
            </div>`).join('');
    }
    highlightActiveButton('frames-card', 'data-frame-pick', currentFrame);
}

function pickFrameFromGallery(frameId) {
    currentBooth = boothOfFrame(frameId);
    setFrameChoice(frameId);
    renderFramesGallery();
}
setNav(true, 'home');

// Pilihan countdown (3s/5s/10s) di panel setting
let countdownSeconds = 3;
function applyCountdownUI() {
    document.querySelectorAll('.cd-btn').forEach(b => {
        const on = Number(b.dataset.cd) === countdownSeconds;
        b.classList.toggle('bg-mint', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('bg-mist', !on);
        b.classList.toggle('text-deep', !on);
    });
}
document.querySelectorAll('.cd-btn').forEach(b => {
    b.addEventListener('click', () => { countdownSeconds = Number(b.dataset.cd); applyCountdownUI(); saveState(); });
});
applyCountdownUI();

function exitBooth() {
    ldrLeave();
    inBoothScreen = false;
    closeSettingsPanel();
    stopCamera();
    if (boothScreen) {
        boothScreen.classList.add('hidden');
        boothScreen.classList.remove('flex', 'flex-col');
    }
    if (editScreen) {
        editScreen.classList.add('hidden');
        editScreen.classList.remove('flex', 'flex-col');
    }
    showScreen('booth');
}

function finishEditing() {
    exitBooth();
}

function backToBoothFromEdit() {
    inBoothScreen = true;
    if (editScreen) {
        editScreen.classList.add('hidden');
        editScreen.classList.remove('flex', 'flex-col');
    }
    if (boothScreen) {
        boothScreen.classList.remove('hidden');
        boothScreen.classList.add('flex', 'flex-col');
    }
    startCamera();
}

// Hitung area video (resolusi asli kamera) yang match sebuah aspect ratio target.
function computeCropRect(targetAspect) {
    const boxRect = cameraContainer.getBoundingClientRect();
    const containerAspect = targetAspect || (boxRect.width / boxRect.height) * (ldr.on ? 0.5 : 1);
    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 960;
    const videoAspect = vw / vh;

    let sx, sy, sw, sh;
    if (videoAspect > containerAspect) {
        sh = vh;
        sw = vh * containerAspect;
        sx = (vw - sw) / 2;
        sy = 0;
    } else {
        sw = vw;
        sh = vw / containerAspect;
        sx = 0;
        sy = (vh - sh) / 2;
    }
    return { sx, sy, sw, sh, vw, vh, boxWidth: boxRect.width, boxHeight: boxRect.height };
}

// Crop sebuah canvas hasil foto biar pas dengan aspect ratio target (mirip object-cover)
function cropCanvasToAspect(sourceCanvas, targetAspect) {
    const sw = sourceCanvas.width;
    const sh = sourceCanvas.height;
    const srcAspect = sw / sh;

    let cx, cy, cw, ch;
    if (srcAspect > targetAspect) {
        ch = sh;
        cw = sh * targetAspect;
        cx = (sw - cw) / 2;
        cy = 0;
    } else {
        cw = sw;
        ch = sw / targetAspect;
        cx = 0;
        cy = (sh - ch) / 2;
    }

    const out = document.createElement('canvas');
    out.width = cw;
    out.height = ch;
    out.getContext('2d').drawImage(sourceCanvas, cx, cy, cw, ch, 0, 0, cw, ch);
    return out;
}

// Buka/Tutup Popup Pilihan (Jumlah Foto & Frame)
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

if (openCountModalBtn) {
    openCountModalBtn.addEventListener('click', () => openModal('count-modal'));
}
if (openEffectModalBtn) {
    openEffectModalBtn.addEventListener('click', () => openModal('effect-modal'));
}

['count-modal', 'effect-modal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(id);
        });
    }
});

// Kasih highlight ke tombol yang lagi aktif
function highlightActiveButton(className, dataAttr, activeValue) {
    document.querySelectorAll('.' + className).forEach(btn => {
        if (btn.getAttribute(dataAttr) === activeValue) {
            btn.classList.add('ring-4', 'ring-mint', 'scale-95');
        } else {
            btn.classList.remove('ring-4', 'ring-mint', 'scale-95');
        }
    });
}

// Ambil layout yang pas buat frameId + jumlah foto tertentu.
// Kalau ada variant khusus buat jumlah itu -> dipakai apa adanya, 1 lembar, nggak diulang.
// Kalau nggak ada -> fallback ke "base" (3 slot), diulang per grup (dipakai buat kelipatan 3, atau
// dipadding/diduplikat foto terakhirnya kalau bukan kelipatan 3).
function getFrameLayout(frameId, count) {
    const def = FRAME_DEFS[frameId];
    const variant = def.variants && def.variants[count];
    if (variant) {
        return { src: variant.src, canvasW: variant.canvasW, canvasH: variant.canvasH, slots: variant.slots, repeatGroup: false };
    }
    return { src: def.base.src, canvasW: def.base.canvasW, canvasH: def.base.canvasH, slots: def.base.slots, repeatGroup: true };
}

function frameCacheKey(frameId, count) {
    const def = FRAME_DEFS[frameId];
    return (def.variants && def.variants[count]) ? (frameId + '_v' + count) : frameId;
}

// Preload gambar frame
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function ensureFrameImageLoaded(frameId, count) {
    const key = frameCacheKey(frameId, count);
    if (frameImageCache[key]) return Promise.resolve(frameImageCache[key]);
    const layout = getFrameLayout(frameId, count);
    return loadImage(layout.src).then(img => {
        frameImageCache[key] = img;
        return img;
    });
}

// 2. Fungsi Pilih Frame (dipakai sebelum & sesudah foto)
function setFrameChoice(frameId) {
    currentFrame = frameId;

    const count = isFlexibleShotCount(shotCount) ? selectedFormat : computePickCount(shotCount);
    const layout = getFrameLayout(frameId, count);
    const slot0 = layout.slots[0];
    cameraContainer.style.aspectRatio = (slot0.w / slot0.h).toString();
    ensureFrameImageLoaded(frameId, count).catch(err => console.error('Gagal load frame:', err));

    highlightActiveButton('effect-btn', 'data-effect', frameId);
    if (effectLabel) effectLabel.textContent = FRAME_LABELS[frameId] || frameId;
    closeModal('effect-modal');
    saveState();
}

setFrameChoice(currentFrame);

// Fungsi Ubah Jumlah Foto
function setShotCount(count, silent) {
    shotCount = count;
    highlightActiveButton('count-btn', 'data-count', String(count));
    if (countLabel) countLabel.textContent = count + 'x';
    setFrameChoice(currentFrame); // refresh aspect ratio & preload sesuai jumlah foto yang baru
    if (!silent) closeModal('count-modal');
    saveState();
}
setShotCount(shotCount, true);


// 3. Countdown & Flash
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCountdown(seconds) {
    if (!countdownOverlay) {
        await sleep(seconds * 1000);
        return;
    }
    countdownOverlay.classList.remove('hidden');
    countdownOverlay.classList.add('flex');
    for (let i = seconds; i >= 1; i--) {
        countdownOverlay.textContent = i;
        ldrSend({ t: 'cd', n: i });
        await sleep(800);
    }
    ldrSend({ t: 'cdend' });
    countdownOverlay.classList.add('hidden');
    countdownOverlay.classList.remove('flex');
}

function triggerFlash() {
    if (!flashEffect) return;
    flashEffect.style.opacity = '1';
    setTimeout(() => { flashEffect.style.opacity = '0'; }, 150);
}

// Ambil 1 frame foto mentah (mirror sesuai pilihan + crop sesuai aspect preview yang lagi aktif)
function captureSingleFrame() {
    const crop = computeCropRect();
    const { sx, sy, sw, sh } = crop;

    const shotCanvas = document.createElement('canvas');
    shotCanvas.width = sw;
    shotCanvas.height = sh;
    const ctx = shotCanvas.getContext('2d');

    if (mirrorResult) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, sw, sh, -shotCanvas.width, 0, shotCanvas.width, shotCanvas.height);
        ctx.restore();
    } else {
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, shotCanvas.width, shotCanvas.height);
    }

    return shotCanvas;
}

// Tempel foto (yang sudah di-crop pas) ke slot-slot frame custom.
// Kalau layout.repeatGroup true (pakai "base"), grup slot diulang & disusun sejajar per lembar.
// Kalau false (pakai "variant" khusus), semua foto ditempel langsung di 1 lembar sesuai slot aslinya.
function combineFrameComposite(shots, frameId, layout, cacheCount) {
    const frameImg = frameImageCache[frameCacheKey(frameId, cacheCount)];
    const groupSize = layout.slots.length;
    const numGroups = layout.repeatGroup ? Math.ceil(shots.length / groupSize) : 1;
    const gap = layout.canvasW * 0.04;

    canvas.width = numGroups * layout.canvasW + gap * (numGroups - 1);
    canvas.height = layout.canvasH;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let g = 0; g < numGroups; g++) {
        const groupShots = layout.repeatGroup ? shots.slice(g * groupSize, g * groupSize + groupSize) : shots;

        const unitCanvas = document.createElement('canvas');
        unitCanvas.width = layout.canvasW;
        unitCanvas.height = layout.canvasH;
        const uctx = unitCanvas.getContext('2d');

        groupShots.forEach((shot, i) => {
            const slot = layout.slots[i];
            if (slot) uctx.drawImage(shot, slot.x, slot.y, slot.w, slot.h);
        });
        uctx.drawImage(frameImg, 0, 0, layout.canvasW, layout.canvasH);

        const xOffset = g * (layout.canvasW + gap);
        ctx.drawImage(unitCanvas, xOffset, 0);
    }

    return canvas;
}

// Kalau layout dipakai berulang (base, 3 slot) dan jumlah foto bukan kelipatan groupSize,
// ulang foto terakhir biar slot di lembar terakhir tetap keisi penuh.
function padShotsForFrame(shots, groupSize) {
    if (!shots.length) return shots;
    const remainder = shots.length % groupSize;
    if (remainder === 0) return shots;

    const needed = groupSize - remainder;
    const padded = shots.slice();
    const lastShot = shots[shots.length - 1];
    for (let i = 0; i < needed; i++) {
        padded.push(lastShot);
    }
    return padded;
}

// Susun komposit akhir berdasarkan frame yang dipilih DI EDIT SCREEN (bisa beda dari saat capture)
function buildCompositeForFrame(frameId, rawShots) {
    const count = rawShots.length;
    const layout = getFrameLayout(frameId, count);
    const groupSize = layout.slots.length;
    const shotsForFrame = layout.repeatGroup ? padShotsForFrame(rawShots, groupSize) : rawShots;

    const croppedShots = shotsForFrame.map((shot, i) => {
        const slot = layout.slots[i % groupSize];
        return cropCanvasToAspect(shot, slot.w / slot.h);
    });
    return combineFrameComposite(croppedShots, frameId, layout, count);
}

async function takePhotoStrip() {
    if (!captureBtn) return;
    captureBtn.disabled = true;
    captureBtn.classList.add('opacity-50', 'cursor-not-allowed');
    setCameraControlsLocked(true);

    try {
        const count = shotCount;
        const shots = [];
        for (let i = 0; i < count; i++) {
            await runCountdown(countdownSeconds);
            triggerFlash();
            await sleep(150);
            shots.push(await captureShot(i));
            await sleep(400);
        }

        ldrSend({ t: 'done' });
        lastRawShots = shots;
        lastShotCount = count;

        inBoothScreen = false;
        stopCamera();
        if (boothScreen) {
            boothScreen.classList.add('hidden');
            boothScreen.classList.remove('flex', 'flex-col');
        }
        showEditScreen(currentFrame);
    } catch (err) {
        console.error('Gagal ambil foto:', err);
        alert(err.message || 'Gagal ambil foto, cek console (F12) untuk detail error.');
    } finally {
        captureBtn.disabled = false;
        captureBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        setCameraControlsLocked(false);
    }
}

function setCameraControlsLocked(locked) {
    if (locked) closeSettingsPanel();
    ['settings-btn', 'switch-camera-btn', 'mirror-toggle-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.disabled = locked;
        btn.classList.toggle('opacity-50', locked);
        btn.classList.toggle('cursor-not-allowed', locked);
    });
}

// Tombol setting: buka/tutup panel toggle
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');

function closeSettingsPanel() {
    if (settingsPanel) settingsPanel.classList.add('hidden');
    if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');
}

if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', e => {
        e.stopPropagation();
        const willOpen = settingsPanel.classList.contains('hidden');
        settingsPanel.classList.toggle('hidden', !willOpen);
        settingsBtn.setAttribute('aria-expanded', String(willOpen));
    });
    // klik di luar panel = tutup
    document.addEventListener('click', e => {
        if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) closeSettingsPanel();
    });
}

// Ganti kamera depan/belakang: default mirror otomatis (depan = ya, belakang = tidak), tapi tetap bisa diubah manual
const switchCameraBtn = document.getElementById('switch-camera-btn');
if (switchCameraBtn) {
    switchCameraBtn.addEventListener('click', () => {
        facingMode = facingMode === 'user' ? 'environment' : 'user';
        mirrorResult = facingMode === 'user';
        startCamera();
        saveState();
    });
}

const mirrorToggleBtn = document.getElementById('mirror-toggle-btn');
if (mirrorToggleBtn) {
    mirrorToggleBtn.addEventListener('click', () => {
        mirrorResult = !mirrorResult;
        applyMirrorPreview();
        saveState();
    });
}

if (captureBtn) {
    captureBtn.addEventListener('click', takePhotoStrip);
}

// 4. Edit Screen: pilih foto favorit (kalau perlu), lalu pilih/ganti frame berdasarkan hasil foto

// Aturan jumlah foto yang boleh dipilih berdasarkan berapa banyak foto yang diambil.
// Khusus take 6x s/d 12x, jumlahnya nggak fixed - user milih sendiri format 3 Foto atau 6 Foto
// (lihat isFlexibleShotCount & setPickFormat di bawah).
function computePickCount(n) {
    if (n === 4) return 2; // 4x        -> pilih 2
    if (n === 5) return 3; // 5x        -> pilih 3
    return n;              // 3x, 2x, 1x -> semua foto tetap bisa dipilih/dipakai
}

function isFlexibleShotCount(n) {
    return n >= 6 && n <= 12;
}

function getSelectedShotsInOrder() {
    return [...selectedShotIndices].sort((a, b) => a - b).map(i => lastRawShots[i]);
}

// Terapkan pickCount + selection default sesuai pickCount yang lagi aktif, lalu render grid kalau perlu.
function applyPickCount() {
    if (pickCount >= lastShotCount) {
        // Jumlah foto sudah pas/minimal, nggak perlu milih satu-satu
        selectedShotIndices = lastRawShots.map((_, i) => i);
        if (photoPickGridWrap) photoPickGridWrap.classList.add('hidden');
        return;
    }

    // Default: pilih otomatis foto pertama sejumlah pickCount, biar preview langsung ada
    selectedShotIndices = Array.from({ length: pickCount }, (_, i) => i);
    renderPhotoPickGrid();
    if (photoPickGridWrap) photoPickGridWrap.classList.remove('hidden');
}

// Ganti format (3 Foto / 6 Foto) - dipakai khusus buat take 6x-12x
function setPickFormat(format) {
    selectedFormat = format;
    pickCount = format;
    highlightActiveButton('pick-format-btn', 'data-format', String(format));
    applyPickCount();
    updateEditFrameAvailability();
    renderEditPreview(currentEditFrame);
}

function setupPhotoPicker() {
    if (isFlexibleShotCount(lastShotCount)) {
        pickCount = selectedFormat; // ikutin format yang lagi dipilih (default 3)
        if (photoPickFormat) photoPickFormat.classList.remove('hidden');
        highlightActiveButton('pick-format-btn', 'data-format', String(selectedFormat));
    } else {
        pickCount = computePickCount(lastShotCount);
        if (photoPickFormat) photoPickFormat.classList.add('hidden');
    }

    applyPickCount();

    const needSection = isFlexibleShotCount(lastShotCount) || pickCount < lastShotCount;
    if (photoPickSection) photoPickSection.classList.toggle('hidden', !needSection);
}

function renderPhotoPickGrid() {
    if (!photoPickGrid) return;
    photoPickGrid.innerHTML = '';

    lastRawShots.forEach((shot, idx) => {
        const thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.dataset.index = String(idx);
        thumb.className = 'photo-pick-thumb relative aspect-square rounded-lg overflow-hidden border-2 border-mist transition cursor-pointer';

        const img = document.createElement('img');
        img.src = shot.toDataURL('image/png');
        img.className = 'w-full h-full object-cover';
        thumb.appendChild(img);

        const badge = document.createElement('span');
        badge.className = 'photo-pick-badge hidden absolute top-1 right-1 w-6 h-6 rounded-full bg-mint text-white text-xs font-bold items-center justify-center';
        thumb.appendChild(badge);

        thumb.addEventListener('click', () => togglePhotoSelection(idx));
        photoPickGrid.appendChild(thumb);
    });

    updatePhotoPickUI();
}

function togglePhotoSelection(idx) {
    const pos = selectedShotIndices.indexOf(idx);
    if (pos !== -1) {
        if (selectedShotIndices.length <= 1) return; // minimal 1 foto harus tetap terpilih
        selectedShotIndices.splice(pos, 1);
    } else {
        if (selectedShotIndices.length >= pickCount) return; // udah penuh, abaikan klik
        selectedShotIndices.push(idx);
    }
    updatePhotoPickUI();
    renderEditPreview(currentEditFrame);
}

function updatePhotoPickUI() {
    if (photoPickCounter) {
        photoPickCounter.textContent = 'Terpilih: ' + selectedShotIndices.length + '/' + pickCount;
    }
    if (!photoPickGrid) return;

    const sortedSelected = [...selectedShotIndices].sort((a, b) => a - b);
    photoPickGrid.querySelectorAll('.photo-pick-thumb').forEach(thumb => {
        const idx = Number(thumb.dataset.index);
        const isSelected = selectedShotIndices.includes(idx);
        const badge = thumb.querySelector('.photo-pick-badge');
        if (isSelected) {
            thumb.classList.add('border-mint');
            thumb.classList.remove('border-mist', 'opacity-40');
            if (badge) {
                badge.classList.remove('hidden');
                badge.classList.add('flex');
                badge.textContent = String(sortedSelected.indexOf(idx) + 1);
            }
        } else {
            thumb.classList.remove('border-mint');
            thumb.classList.add('border-mist', 'opacity-40');
            if (badge) {
                badge.classList.add('hidden');
                badge.classList.remove('flex');
            }
        }
    });
}

function updateEditFrameAvailability() {
    const effectiveCount = selectedShotIndices.length || lastShotCount;
    // 1 & 2 foto sekarang punya layout khusus (nggak perlu diulang). Kelipatan 3 juga pas persis.
    // Sisanya (4,5,7,8,...) tetap fallback ke layout 3-slot dengan foto terakhir diulang.
    const hasExactLayout = effectiveCount === 1 || effectiveCount === 2 || (effectiveCount % 3 === 0 && effectiveCount > 0);
    Object.keys(FRAME_DEFS).forEach(fid => {
        const btn = document.querySelector('.edit-frame-btn[data-frame="' + fid + '"]');
        if (!btn) return;
        btn.disabled = false;
        btn.classList.remove('opacity-30', 'cursor-not-allowed');
    });
    if (editFrameNote) {
        editFrameNote.classList.toggle('hidden', hasExactLayout);
    }
}

let currentBlob = null;
let renderToken = 0;

async function renderEditPreview(frameId) {
    const shotsToUse = getSelectedShotsInOrder();
    currentEditFrame = frameId;

    try {
        await ensureFrameImageLoaded(frameId, shotsToUse.length);
    } catch (err) {
        alert('Gagal memuat gambar frame "' + frameId + '". Pastikan folder frames/ ada.');
        return;
    }

    const composed = buildCompositeForFrame(frameId, shotsToUse);
    const dataURL = composed.toDataURL('image/png');

    if (editPreviewImg) editPreviewImg.src = dataURL;
    if (editDownloadBtn) {
        editDownloadBtn.href = dataURL;
        editDownloadBtn.download = 'photobooth-strip.png';
    }

    // Siapin Blob di awal (bukan pas diklik) biar share sheet iOS tetap dianggap aksi user langsung
    currentBlob = null;
    const myToken = ++renderToken;
    composed.toBlob(blob => {
        if (myToken === renderToken) currentBlob = blob;
    }, 'image/png');
    highlightActiveButton('edit-frame-btn', 'data-frame', frameId);
}

function selectEditFrame(frameId) {
    renderEditPreview(frameId);
}

function showEditScreen(initialFrameId) {
    if (editScreen) {
        editScreen.classList.remove('hidden');
        editScreen.classList.add('flex', 'flex-col');
    }
    setupPhotoPicker();
    updateEditFrameAvailability();
    renderEditPreview(initialFrameId);
}

// ==================== DOWNLOAD (support iOS) ====================
function isIOSDevice() {
    return /iP(hone|ad|od)/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function handleDownload() {
    const filename = 'photobooth-strip.png';

    if (!currentBlob) {
        alert('Gambar masih diproses, coba lagi sebentar.');
        return;
    }

    const file = new File([currentBlob], filename, { type: 'image/png' });

    // iOS: pakai share sheet -> pilih "Save Image" / "Simpan Gambar" biar masuk ke Foto
    if (isIOSDevice()) {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file], title: 'Photobooth' }).catch(err => {
                if (err && err.name !== 'AbortError') console.error('Share gagal:', err);
            });
        } else {
            // Fallback: buka gambar di tab baru, user tekan lama -> Simpan ke Foto
            const url = URL.createObjectURL(currentBlob);
            window.open(url, '_blank');
            alert('Tekan lama pada gambar, lalu pilih "Simpan ke Foto".');
        }
        return;
    }

    // Desktop / Android: download biasa lewat blob URL
    const url = URL.createObjectURL(currentBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

if (editDownloadBtn) {
    editDownloadBtn.addEventListener('click', e => {
        e.preventDefault();
        handleDownload();
    });
}

renderFrameLists();

// ==================== BOOTH 3: LDR (host + join pakai kode angka, via PeerJS/WebRTC) ====================
const ldr = { on: false, role: null, peer: null, conn: null, call: null, connected: false, pending: {} };
const remoteVideo = document.getElementById('remote-video');
const ldrModal = document.getElementById('ldr-modal');
const ldrStatus = document.getElementById('ldr-status');
const $ldr = id => document.getElementById(id);

function ldrShowModal(show) { ldrModal.classList.toggle('hidden', !show); ldrModal.classList.toggle('flex', show); }
function ldrSetStatus(t) { ldrStatus.textContent = t || ''; ldrStatus.classList.toggle('hidden', !t); }
function ldrSend(msg) { if (ldr.conn && ldr.conn.open) ldr.conn.send(msg); }

// Mode LDR: kotak kamera jadi persegi, kamera kita di kiri, kamera pasangan di kanan
function ldrLayout(on) {
    cameraContainer.style.aspectRatio = on ? '1 / 1' : '';
    Object.assign(video.style, on
        ? { position: 'absolute', left: '0', top: '0', width: '50%', height: '100%' }
        : { position: '', left: '', top: '', width: '', height: '' });
    remoteVideo.classList.toggle('hidden', !on);
}

function ldrResetLobby(msg) {
    $ldr('ldr-choose').classList.remove('hidden');
    $ldr('ldr-host-box').classList.add('hidden');
    $ldr('ldr-msg').textContent = msg || 'Foto bareng pasangan walau beda kota.';
}

function ldrEnter() {
    ldrLeave();
    ldr.on = true;
    ldrLayout(true);
    ldrResetLobby();
    $ldr('ldr-code-input').value = '';
    ldrShowModal(true);
}

function ldrLeave() {
    try { if (ldr.call) ldr.call.close(); if (ldr.conn) ldr.conn.close(); if (ldr.peer) ldr.peer.destroy(); } catch (e) { /* abaikan */ }
    Object.assign(ldr, { on: false, role: null, peer: null, conn: null, call: null, connected: false, pending: {} });
    ldrLayout(false);
    remoteVideo.srcObject = null;
    ldrShowModal(false);
    ldrSetStatus('');
    captureBtn.classList.remove('hidden');
    openCountModalBtn.parentElement.classList.remove('hidden');
}

function ldrFail(msg) {
    try { if (ldr.peer) ldr.peer.destroy(); } catch (e) { /* abaikan */ }
    ldr.peer = ldr.conn = ldr.call = null;
    ldrResetLobby(msg);
}

async function ldrWaitStream() {
    for (let i = 0; i < 100 && !cameraStream; i++) await sleep(100);
    if (!cameraStream) throw new Error('Kamera belum aktif, izinkan akses kamera dulu.');
}

function ldrHost() {
    ldr.role = 'host';
    const tryOpen = () => {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const peer = new Peer('nsldr-' + code);
        ldr.peer = peer;
        peer.on('open', () => {
            $ldr('ldr-choose').classList.add('hidden');
            $ldr('ldr-host-box').classList.remove('hidden');
            $ldr('ldr-code').textContent = code;
        });
        peer.on('error', err => {
            if (err.type === 'unavailable-id') { peer.destroy(); tryOpen(); }
            else ldrFail('Gagal bikin room (' + err.type + '). Coba lagi.');
        });
        peer.on('connection', conn => {
            if (ldr.conn && ldr.conn.open) { conn.close(); return; } // room cuma buat 2 orang
            ldrBind(conn);
        });
        peer.on('call', call => {
            ldrWaitStream().then(() => { call.answer(cameraStream); ldrBindCall(call); }).catch(e => ldrFail(e.message));
        });
    };
    tryOpen();
}

function ldrJoin() {
    const code = $ldr('ldr-code-input').value.trim();
    if (!/^\d{6}$/.test(code)) { $ldr('ldr-msg').textContent = 'Masukin 6 angka kodenya ya.'; return; }
    ldr.role = 'guest';
    $ldr('ldr-msg').textContent = 'Menyambungkan…';
    const peer = new Peer();
    ldr.peer = peer;
    peer.on('error', err => ldrFail(err.type === 'peer-unavailable' ? 'Kode nggak ketemu, cek lagi kodenya.' : 'Gagal nyambung (' + err.type + ').'));
    peer.on('open', () => {
        const hostId = 'nsldr-' + code;
        ldrBind(peer.connect(hostId, { reliable: true }));
        ldrWaitStream().then(() => ldrBindCall(peer.call(hostId, cameraStream))).catch(e => ldrFail(e.message));
    });
}

function ldrBind(conn) {
    ldr.conn = conn;
    const onOpen = () => {
        if (ldr.connected) return;
        ldr.connected = true;
        ldrShowModal(false);
        if (ldr.role === 'guest') {
            captureBtn.classList.add('hidden');
            openCountModalBtn.parentElement.classList.add('hidden');
            ldrSetStatus('Nyambung! Nunggu host ambil foto 📸');
        } else {
            ldrSetStatus('Pasangan tersambung 💞');
            setTimeout(() => { if (ldrStatus.textContent.includes('tersambung')) ldrSetStatus(''); }, 3000);
        }
    };
    if (conn.open) onOpen();
    conn.on('open', onOpen);
    conn.on('data', ldrOnData);
    conn.on('close', () => { if (ldr.on) { ldrSetStatus('Koneksi terputus. Keluar lalu buat/join room baru.'); remoteVideo.srcObject = null; } });
}

function ldrBindCall(call) {
    ldr.call = call;
    call.on('stream', stream => { remoteVideo.srcObject = stream; remoteVideo.play().catch(() => {}); });
}

// Kamera lokal diganti (ambil ulang / ganti kamera): kirim track baru ke pasangan
function ldrOnLocalStream(stream) {
    const pc = ldr.call && ldr.call.peerConnection;
    if (!pc) return;
    const track = stream.getVideoTracks()[0];
    pc.getSenders().forEach(snd => { if (snd.track && snd.track.kind === 'video') snd.replaceTrack(track); });
}

function ldrOnData(m) {
    if (!m || !m.t) return;
    if (ldr.role === 'guest') {
        if (m.t === 'cd') {
            ldrSetStatus('');
            countdownOverlay.textContent = m.n;
            countdownOverlay.classList.remove('hidden'); countdownOverlay.classList.add('flex');
        } else if (m.t === 'cdend') {
            countdownOverlay.classList.add('hidden'); countdownOverlay.classList.remove('flex');
        } else if (m.t === 'snap') {
            triggerFlash();
            ldrSend({ t: 'photo', i: m.i, data: captureSingleFrame().toDataURL('image/jpeg', 0.85) });
        } else if (m.t === 'done') {
            ldrSetStatus('Host lagi milih foto & frame ✨');
        }
    } else if (m.t === 'photo') {
        const img = new Image();
        img.onload = () => {
            const c = document.createElement('canvas');
            c.width = img.width; c.height = img.height;
            c.getContext('2d').drawImage(img, 0, 0);
            if (ldr.pending[m.i]) ldr.pending[m.i](c);
        };
        img.src = m.data;
    }
}

function ldrWaitPhoto(i) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Foto pasangan nggak diterima, cek koneksi lalu coba lagi.')), 10000);
        ldr.pending[i] = c => { clearTimeout(timer); resolve(c); };
    });
}

// Gabung 2 foto (kita kiri, pasangan kanan) jadi 1 foto persegi; nanti di-crop ke slot frame Booth 1 seperti biasa
function ldrPair(a, b) {
    const L = cropCanvasToAspect(a, 0.5), R = cropCanvasToAspect(b, 0.5);
    const h = Math.max(L.height, R.height), w = h / 2;
    const out = document.createElement('canvas');
    out.width = w * 2; out.height = h;
    const ctx = out.getContext('2d');
    ctx.drawImage(L, 0, 0, w, h);
    ctx.drawImage(R, w, 0, w, h);
    return out;
}

async function captureShot(i) {
    if (!ldr.on || ldr.role !== 'host' || !ldr.connected) return captureSingleFrame();
    const waiting = ldrWaitPhoto(i);
    ldrSend({ t: 'snap', i });
    const mine = captureSingleFrame();
    return ldrPair(mine, await waiting);
}

// ==================== PULIHKAN POSISI SETELAH REFRESH ====================
(function restoreState() {
    let st = null;
    try { st = JSON.parse(sessionStorage.getItem(STATE_KEY) || 'null'); } catch (e) { st = null; }

    if (st) {
        if (BOOTHS[st.booth]) currentBooth = st.booth;
        if (FRAME_DEFS[st.frame] && BOOTHS[currentBooth].frames.includes(st.frame)) currentFrame = st.frame;
        if (typeof st.mirror === 'boolean') mirrorResult = st.mirror;
        if (st.facing === 'user' || st.facing === 'environment') facingMode = st.facing;
        if ([3, 5, 10].includes(st.countdown)) countdownSeconds = st.countdown;
        applyCountdownUI();
        applyMirrorPreview();
        if (Number.isInteger(st.shots) && st.shots >= 1 && st.shots <= 12) setShotCount(st.shots, true);
        renderFrameLists();
    }

    stateReady = true;
    const screen = st && st.screen;
    if (screen === 'camera') {
        enterBooth(currentBooth);          // foto hasil ambil nggak bisa dipulihin, jadi balik ke kamera
    } else if (screen === 'booth' || screen === 'frames') {
        showScreen(screen);
    } else {
        saveState();
    }
})();