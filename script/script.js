let keranjang = [];
let totalHarga = 0;

async function tambahKeKeranjang(namaProduk, hargaProduk, deskripsiProduk = '') {
    const user = window.auth.currentUser;
    if (!user) {
        alert("Silahkan login terlebih dahulu");
        window.location.href = "login.html";
        return;
    }

    const cartRef = window.doc(window.db, "carts", user.uid);
    const cartSnap = await window.getDoc(cartRef);
    let items = [];

    if (cartSnap.exists()) {
        items = cartSnap.data().items;
    }

    const existingItem = items.find(item => item.nama === namaProduk);

    if (existingItem) {
        existingItem.jumlah += 1; // Jika ada, tambah jumlahnya
    } else {
        items.push({ 
            nama: namaProduk, 
            harga: hargaProduk, 
            deskripsi: deskripsiProduk, 
            jumlah: 1 
        });
    }

    await window.setDoc(cartRef, { items: items });
    alert(`${namaProduk} berhasil ditambahkan!`);
}

async function ubahJumlah(namaProduk, aksi) {
    const user = window.auth.currentUser;
    const cartRef = window.doc(window.db, "carts", user.uid);
    const cartSnap = await window.getDoc(cartRef);

    if (cartSnap.exists()) {
        let items = cartSnap.data().items;
        const index = items.findIndex(item => item.nama === namaProduk);

        if (index !== -1) {
            if (aksi === 'tambah') {
                items[index].jumlah += 1;
            } else if (aksi === 'kurang') {
                items[index].jumlah -= 1;
                if (items[index].jumlah <= 0) {
                    items.splice(index, 1); // Hapus jika jumlah 0
                }
            }
            await window.setDoc(cartRef, { items: items });
        }
    }
}

// Panggil fungsi ini saat user login
function sinkronkanKeranjangRealtime(uid) {
    const cartRef = window.doc(window.db, "carts", uid);

    // onSnapshot akan jalan otomatis setiap kali data di database berubah
    window.onSnapshot(cartRef, (doc) => {
        const daftarPesan = document.getElementById('daftar-pesanan');
        const teksTotal = document.getElementById('total-harga');
        
        if (!doc.exists() || doc.data().items.length === 0) {
            daftarPesan.innerHTML = '<li class="empty-cart">Keranjang kosong.</li>';
            teksTotal.innerText = 'Rp. 0';
            return;
        }

        const items = doc.data().items;
        daftarPesan.innerHTML = '';
        let total = 0;

        items.forEach((item) => {
            total += (item.harga * item.jumlah);
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-info">
                    <span class="item-nama"><b>${item.nama}</b> (x${item.jumlah})</span>
                </div>
                <div class="item-controls">
                    <button onclick="ubahJumlah('${item.nama}', 'kurang')">-</button>
                    <button onclick="ubahJumlah('${item.nama}', 'tambah')">+</button>
                    <span class="item-harga">Rp ${ (item.harga * item.jumlah).toLocaleString() }</span>
                </div>
            `;
            daftarPesan.appendChild(li);
        });

        teksTotal.innerText = `Rp. ${total.toLocaleString()}`;
    });
}
function checkoutWA() {
    if (!window.isUserLoggedIn) {
        alert("Silahkan login terlebih dahulu sebelum memesan");
        window.location.href = "login.html"
        return;
    }

    if (keranjang.length === 0) {
        alert("Keranjang Anda masih kosong. Silahkan dipilih menunya!");
        return
    }
    const nomorWA = "+6285795125230"
    let pesan = "Hallo kak, Saya ingin memesan Mochi dari toko Anda:\n\n";

    keranjang.forEach((item, index) => {
        pesan += `${index + 1}. ${item.nama} - Rp. ${item.harga.toLocaleString('id-ID')}\n`;
    });

    pesan += `\n*Total Tagihan: Rp ${totalHarga.toLocaleString('id-ID')}*`;
    pesan += "\n\nApakah pesanan saya bisa diproses?";

    const pesanEncoded = encodeURIComponent(pesan);
    window.open(`https://wa.me/${nomorWA}?text=${pesanEncoded}`, '_blank');
}

// Memantau gerakan scroll pada layar
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');

    // Jika layar di-scroll lebih dari 10 pixel dari atas
    if (window.scrollY > 50) {
        header.classList.add('scrolled'); // Ubah lengkungan ke bawah
    } else {
        header.classList.remove('scrolled'); // Kembalikan lengkungan ke atas
    }
});

const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const headerElement = document.querySelector('header');

hamburger.addEventListener('click', function () {
    navMenu.classList.toggle('tampil');
    headerElement.classList.toggle('menu-buka');
})

// carousel

const sliderWrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slider-wrapper img');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');

let slideIndex = 1;
let slideInterval;
let isTransitioning = false;

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

sliderWrapper.appendChild(firstClone);
sliderWrapper.insertBefore(lastClone, slides[0]);

sliderWrapper.style.display = 'flex';
sliderWrapper.style.flexWrap = 'nowrap';
const allSlides = document.querySelectorAll('.slider-wrapper img');
allSlides.forEach(img => {
    img.style.minWidth = '100%';
    img.style.flexShrink = '0';
});

sliderWrapper.style.transition = 'none';
sliderWrapper.style.transform = `translateX(-100)`;

function updateSlider() {
    sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
    sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));

    let dotIndex = slideIndex - 1;
    if (slideIndex === slides.length + 1) dotIndex = 0;
    if (slideIndex === 0) dotIndex = slides.length - 1;

    if (dots[dotIndex]) dots[dotIndex].classList.add('active');
}

function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    slideIndex++;
    updateSlider();
}

function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    slideIndex--;
    updateSlider();
}

sliderWrapper.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (slideIndex === slides.length + 1) {
        sliderWrapper.style.transition = 'none';
        slideIndex = 1;
        sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
    }


    if (slideIndex === 0) {
        sliderWrapper.style.transition = 'none';
        slideIndex = slides.length;
        sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
    }
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
})

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        slideIndex = index + 1;
        updateSlider();
        resetInterval();
    });
});

function startInterval() {
    slideInterval = setInterval(nextSlide, 3000);
}

function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
}

startInterval();

// fade in scrol

const observerAnimasi = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('muncul');
            observerAnimasi.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

const elemenFadeIn = document.querySelectorAll('.fade-in');

elemenFadeIn.forEach(elemen => {
    observerAnimasi.observe(elemen);
});