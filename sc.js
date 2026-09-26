const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result-container');
const downloadBtn = document.getElementById('download-btn');
const deleteBtn = document.getElementById('delete-btn');
const cameraContainer = document.getElementById('camera-container');
const countdownOverlay = document.getElementById('countdown-overlay');
const flashEffect = document.getElementById('flash-effect');
const openCountModalBtn = document.getElementById('open-count-modal');
const openEffectModalBtn = document.getElementById('open-effect-modal');
const countLabel = document.getElementById('count-label');
const effectLabel = document.getElementById('effect-label');

const emptyResultHTML = '<span class="text-gray-500 text-sm text-center p-4">Foto kamu bakal muncul di sini</span>';

// Definisi frame: gambar bingkai + posisi & ukuran tiap slot foto (dalam resolusi asli gambar frame)
const FRAME_DEFS = {
    frame1: {
        label: 'Postal',
        src: 'frames/frame1.png',
        canvasW: 941,
        canvasH: 1672,
        slots: [
            { x: 87, y: 72, w: 766, h: 375 },
            { x: 87, y: 489, w: 766, h: 376 },
            { x: 87, y: 906, w: 766, h: 355 }
        ]
    },
    frame2: {
        label: 'Merah',
        src: 'frames/frame2.png',
        canvasW: 941,
        canvasH: 1672,
        slots: [
            { x: 209, y: 70, w: 523, h: 410 },
            { x: 209, y: 526, w: 523, h: 395 },
            { x: 209, y: 964, w: 523, h: 405 }
        ]
    }
};
const FRAME_LABELS = { classic: 'Klasik', frame1: 'Postal', frame2: 'Merah' };
const frameImageCache = {};

let currentFrame = 'classic';
let shotCount = 3;
let cameraStream = null;

// 1. Akses Webcam
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        cameraStream = stream;
        video.srcObject = stream;
    })
    .catch(err => {
        alert("Gagal akses kamera! Pastikan izin kamera diaktifkan.");
        console.error(err);
    });

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
    if (document.hidden) {
        stopCamera();
    } else if (!cameraStream) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                cameraStream = stream;
                video.srcObject = stream;
            })
            .catch(err => console.error(err));
    }
});

// Hitung area video (resolusi asli kamera) yang match sebuah aspect ratio target.
// Kalau targetAspect tidak dikasih, pakai aspect kotak preview seperti biasa.
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

// Kasih highlight ke tombol yang lagi aktif (frame maupun jumlah foto)
function highlightActiveButton(className, dataAttr, activeValue) {
    document.querySelectorAll('.' + className).forEach(btn => {
        if (btn.getAttribute(dataAttr) === activeValue) {
            btn.classList.add('ring-4', 'ring-white', 'scale-95');
        } else {
            btn.classList.remove('ring-4', 'ring-white', 'scale-95');
        }
    });
}

// Preload gambar frame, dipakai pas nyusun hasil foto & biar siap dipakai
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function ensureFrameImageLoaded(frameId) {
    if (frameImageCache[frameId]) return Promise.resolve(frameImageCache[frameId]);
    return loadImage(FRAME_DEFS[frameId].src).then(img => {
        frameImageCache[frameId] = img;
        return img;
    });
}

// 2. Fungsi Pilih Frame
function setFrameChoice(frameId) {
    currentFrame = frameId;

    if (frameId === 'classic') {
        // Kembalikan aspect preview ke default responsive (lewat class Tailwind)
        cameraContainer.style.aspectRatio = '';
    } else {
        const def = FRAME_DEFS[frameId];
        const slot0 = def.slots[0];
        // Samakan preview kamera dengan bentuk slot foto di frame ini
        cameraContainer.style.aspectRatio = (slot0.w / slot0.h).toString();
        ensureFrameImageLoaded(frameId).catch(err => console.error('Gagal load frame:', err));
    }

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

// Ambil 1 frame foto (mirror + crop sesuai target aspect) ke canvas terpisah
function captureSingleFrame(targetAspect) {
    const crop = computeCropRect(targetAspect);
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

// Gabungkan beberapa foto jadi 1 strip vertikal polos (frame Klasik)
function combineClassicStrip(shots) {
    const gap = shots[0].width * 0.03;
    const stripWidth = shots[0].width + gap * 2;
    const stripHeight = shots.reduce((sum, c) => sum + c.height, 0) + gap * (shots.length + 1);

    canvas.width = stripWidth;
    canvas.height = stripHeight;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    let y = gap;
    shots.forEach(shot => {
        ctx.drawImage(shot, gap, y);
        y += shot.height + gap;
    });

    return canvas;
}

// Tempel foto ke slot-slot frame custom. Kalau foto lebih dari kapasitas 1 frame,
// bingkainya diulang per grup (misal 12 foto -> 4x bingkai ditumpuk vertikal).
function combineFrameComposite(shots, frameId) {
    const def = FRAME_DEFS[frameId];
    const frameImg = frameImageCache[frameId];
    const groupSize = def.slots.length;
    const numGroups = Math.ceil(shots.length / groupSize);
    const gap = def.canvasW * 0.04;

    // Susun tiap bingkai SEJAJAR KE SAMPING (horizontal), bukan ditumpuk ke bawah
    canvas.width = numGroups * def.canvasW + gap * (numGroups - 1);
    canvas.height = def.canvasH;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let g = 0; g < numGroups; g++) {
        const groupShots = shots.slice(g * groupSize, g * groupSize + groupSize);

        const unitCanvas = document.createElement('canvas');
        unitCanvas.width = def.canvasW;
        unitCanvas.height = def.canvasH;
        const uctx = unitCanvas.getContext('2d');

        groupShots.forEach((shot, i) => {
            const slot = def.slots[i];
            if (slot) uctx.drawImage(shot, slot.x, slot.y, slot.w, slot.h);
        });
        uctx.drawImage(frameImg, 0, 0, def.canvasW, def.canvasH);

        const xOffset = g * (def.canvasW + gap);
        ctx.drawImage(unitCanvas, xOffset, 0);
    }

    return canvas;
}

async function takePhotoStrip() {
    if (!captureBtn) return;
    captureBtn.disabled = true;
    captureBtn.classList.add('opacity-50', 'cursor-not-allowed');

    try {
        const isCustomFrame = currentFrame !== 'classic';
        const count = shotCount;

        if (isCustomFrame) {
            try {
                await ensureFrameImageLoaded(currentFrame);
            } catch (err) {
                throw new Error('Gagal memuat gambar frame "' + currentFrame + '". Pastikan folder frames/ dan file ' + FRAME_DEFS[currentFrame].src + ' ada di lokasi yang benar.');
            }
        }

        const shots = [];
        for (let i = 0; i < count; i++) {
            await runCountdown(3);
            triggerFlash();
            await sleep(150);

            if (isCustomFrame) {
                const slots = FRAME_DEFS[currentFrame].slots;
                const slot = slots[i % slots.length];
                shots.push(captureSingleFrame(slot.w / slot.h));
            } else {
                shots.push(captureSingleFrame());
            }
            await sleep(400);
        }

        if (isCustomFrame) {
            combineFrameComposite(shots, currentFrame);
        } else {
            combineClassicStrip(shots);
        }

        const dataURL = canvas.toDataURL('image/png');

        result.innerHTML = `<img src="${dataURL}" class="w-full h-full object-contain">`;

        if (downloadBtn) {
            downloadBtn.href = dataURL;
            downloadBtn.download = 'photobooth-strip.png';
            downloadBtn.classList.remove('hidden');
        }
        if (deleteBtn) {
            deleteBtn.classList.remove('hidden');
        }
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

// 4. Tombol Hapus Foto (Delete Photo)
if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        result.innerHTML = emptyResultHTML;
        if (downloadBtn) {
            downloadBtn.classList.add('hidden');
            downloadBtn.removeAttribute('href');
        }
        deleteBtn.classList.add('hidden');
    });
}