let keranjang = [];
let totalHarga = 0;

function tambahKeKeranjang(namaProduk, hargaProduk) {
    keranjang.push({ nama: namaProduk, harga: hargaProduk });
    totalHarga += hargaProduk;
    perbaruiTampilanKeranjang();
}

function perbaruiTampilanKeranjang() {
    const daftarPesan = document.getElementById('daftar-pesanan');
    const teksTotal = document.getElementById('total-harga');

    daftarPesan.innerHTML = '';

    keranjang.forEach((item) => {
        const li = document.createElement('li')

        li.textContent = `${item.nama} - Rp. ${item.harga.toLocaleString('id-ID')}`;
        daftarPesan.appendChild(li);
    });

    teksTotal.textContent = totalHarga.toLocaleString('id-ID');
}
function checkoutWA() {
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
window.addEventListener('scroll', function() {
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

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('tampil');
    headerElement.classList.toggle('menu-buka');
})

// carousel

const sliderWrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slider-wrapper img');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');

let slideIndex = 0;
let slideInterval;

function updateSlider() {
    sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[slideIndex].classList.add('active');
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

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
        slideIndex = index;
        updateSlider();
        resetInterval();
    });
});

function startInterval() {
    slideInterval = setInterval(nextSlide, 4000);
}

function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
}

startInterval();