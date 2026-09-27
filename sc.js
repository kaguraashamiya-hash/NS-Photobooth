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
    }
};
const FRAME_LABELS = { classic: 'Classic White', frame1: 'Brownc', frame2: 'Bured', frame3: 'Silver Fang' };
const frameImageCache = {};

let currentFrame = 'classic';
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
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            cameraStream = stream;
            video.srcObject = stream;
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
    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    if (editScreen) {
        editScreen.classList.add('hidden');
        editScreen.classList.remove('flex', 'flex-col');
    }
    if (boothScreen) {
        boothScreen.classList.remove('hidden');
        boothScreen.classList.add('flex', 'flex-col');
    }
    setFrameChoice(themeId);
    startCamera();
}

function exitBooth() {
    inBoothScreen = false;
    stopCamera();
    if (boothScreen) {
        boothScreen.classList.add('hidden');
        boothScreen.classList.remove('flex', 'flex-col');
    }
    if (editScreen) {
        editScreen.classList.add('hidden');
        editScreen.classList.remove('flex', 'flex-col');
    }
    if (welcomeScreen) welcomeScreen.classList.remove('hidden');
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
    const containerAspect = targetAspect || (boxRect.width / boxRect.height);
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
            btn.classList.add('ring-4', 'ring-white', 'scale-95');
        } else {
            btn.classList.remove('ring-4', 'ring-white', 'scale-95');
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
}

setFrameChoice(currentFrame);

// Fungsi Ubah Jumlah Foto
function setShotCount(count, silent) {
    shotCount = count;
    highlightActiveButton('count-btn', 'data-count', String(count));
    if (countLabel) countLabel.textContent = count + 'x';
    setFrameChoice(currentFrame); // refresh aspect ratio & preload sesuai jumlah foto yang baru
    if (!silent) closeModal('count-modal');
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
        await sleep(800);
    }
    countdownOverlay.classList.add('hidden');
    countdownOverlay.classList.remove('flex');
}

function triggerFlash() {
    if (!flashEffect) return;
    flashEffect.style.opacity = '1';
    setTimeout(() => { flashEffect.style.opacity = '0'; }, 150);
}

// Ambil 1 frame foto mentah (mirror + crop sesuai aspect preview yang lagi aktif)
function captureSingleFrame() {
    const crop = computeCropRect();
    const { sx, sy, sw, sh } = crop;

    const shotCanvas = document.createElement('canvas');
    shotCanvas.width = sw;
    shotCanvas.height = sh;
    const ctx = shotCanvas.getContext('2d');

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, -shotCanvas.width, 0, shotCanvas.width, shotCanvas.height);
    ctx.restore();

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

    try {
        const count = shotCount;
        const shots = [];
        for (let i = 0; i < count; i++) {
            await runCountdown(3);
            triggerFlash();
            await sleep(150);
            shots.push(captureSingleFrame());
            await sleep(400);
        }

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
    }
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
        thumb.className = 'photo-pick-thumb relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700 transition cursor-pointer';

        const img = document.createElement('img');
        img.src = shot.toDataURL('image/png');
        img.className = 'w-full h-full object-cover';
        thumb.appendChild(img);

        const badge = document.createElement('span');
        badge.className = 'photo-pick-badge hidden absolute top-1 right-1 w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold items-center justify-center';
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
            thumb.classList.add('border-pink-500');
            thumb.classList.remove('border-gray-700', 'opacity-40');
            if (badge) {
                badge.classList.remove('hidden');
                badge.classList.add('flex');
                badge.textContent = String(sortedSelected.indexOf(idx) + 1);
            }
        } else {
            thumb.classList.remove('border-pink-500');
            thumb.classList.add('border-gray-700', 'opacity-40');
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
    ['classic', 'frame1', 'frame2', 'frame3'].forEach(fid => {
        const btn = document.querySelector('.edit-frame-btn[data-frame="' + fid + '"]');
        if (!btn) return;
        btn.disabled = false;
        btn.classList.remove('opacity-30', 'cursor-not-allowed');
    });
    if (editFrameNote) {
        editFrameNote.classList.toggle('hidden', hasExactLayout);
    }
}

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