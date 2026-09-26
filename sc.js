const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result-container');
const downloadBtn = document.getElementById('download-btn');
const deleteBtn = document.getElementById('delete-btn');
const liveFrame = document.getElementById('live-frame');

const emptyResultHTML = '<span class="text-gray-500 text-sm text-center p-4">Foto kamu bakal muncul di sini</span>';

let currentTheme = 'pink';
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

// Matikan saat tab/halaman ditutup atau di-navigasi keluar
window.addEventListener('pagehide', stopCamera);
window.addEventListener('beforeunload', stopCamera);

// Matikan saat tab disembunyikan (pindah tab / minimize),
// nyalakan lagi otomatis kalau user balik ke tab ini
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

// 2. Fungsi Ubah Frame (Choose Frame)
function setFrame(theme) {
    currentTheme = theme;
    if (!liveFrame) return;

    if (theme === 'pink') {
        liveFrame.style.borderColor = "#ec4899";
        liveFrame.style.backgroundColor = "rgba(236, 72, 153, 0.1)";
    } else if (theme === 'dark') {
        liveFrame.style.borderColor = "#111827";
        liveFrame.style.backgroundColor = "rgba(17, 24, 39, 0.3)";
    } else if (theme === 'neon') {
        liveFrame.style.borderColor = "#10b981";
        liveFrame.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
    } else if (theme === 'retro') {
        liveFrame.style.borderColor = "#d97706";
        liveFrame.style.backgroundColor = "rgba(217, 119, 6, 0.1)";
    }
}

// 3. Fungsi Cetak Bingkai ke Canvas saat Foto Diambil
function drawFrameOnCanvas(ctx, width, height) {
    const borderWidth = width * 0.04;

    if (currentTheme === 'pink') ctx.fillStyle = '#ec4899';
    else if (currentTheme === 'dark') ctx.fillStyle = '#111827';
    else if (currentTheme === 'neon') ctx.fillStyle = '#10b981';
    else if (currentTheme === 'retro') ctx.fillStyle = '#d97706';

    // Cetak border keliling
    ctx.fillRect(0, 0, width, borderWidth);
    ctx.fillRect(0, height - borderWidth, width, borderWidth);
    ctx.fillRect(0, 0, borderWidth, height);
    ctx.fillRect(width - borderWidth, 0, borderWidth, height);

    // Teks di dalam hasil foto
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${width * 0.025}px Poppins, sans-serif`;
    ctx.fillText("PHOTOBOOTH", borderWidth * 1.5, borderWidth * 2);
}

// 4. Tombol Ambil Foto (Take Photo)
if (captureBtn) {
    captureBtn.addEventListener('click', () => {
        // Samakan framing hasil foto dengan kotak preview (ukuran box asli, object-cover)
        const previewBox = document.getElementById('camera-container');
        const boxRect = previewBox.getBoundingClientRect();
        const containerAspect = boxRect.width / boxRect.height;
        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 960;
        const videoAspect = vw / vh;

        let sx, sy, sw, sh;
        if (videoAspect > containerAspect) {
            // video lebih lebar dari 4:3 -> potong kiri-kanan
            sh = vh;
            sw = vh * containerAspect;
            sx = (vw - sw) / 2;
            sy = 0;
        } else {
            // video lebih tinggi dari 4:3 -> potong atas-bawah
            sw = vw;
            sh = vw / containerAspect;
            sx = 0;
            sy = (vh - sh) / 2;
        }

        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');

        // Mirror horizontal biar sama kayak tampilan preview
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, sw, sh, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // Terapkan frame ke hasil foto canvas
        drawFrameOnCanvas(ctx, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/png');

        // Tampilkan hasil foto di dalam kotak result
        result.innerHTML = `<img src="${dataURL}" class="w-full h-full object-cover">`;

        // Aktifkan tombol download yang sudah ada di HTML
        if (downloadBtn) {
            downloadBtn.href = dataURL;
            downloadBtn.download = 'photobooth.png';
            downloadBtn.classList.remove('hidden');
        }

        // Aktifkan tombol hapus
        if (deleteBtn) {
            deleteBtn.classList.remove('hidden');
        }
    });
}

// 5. Tombol Hapus Foto (Delete Photo)
if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        // Kembalikan kotak hasil ke tampilan kosong
        result.innerHTML = emptyResultHTML;

        // Sembunyikan tombol download & hapus
        if (downloadBtn) {
            downloadBtn.classList.add('hidden');
            downloadBtn.removeAttribute('href');
        }
        deleteBtn.classList.add('hidden');
    });
}