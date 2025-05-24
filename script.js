document.addEventListener('DOMContentLoaded', function() {
    const loginPage = document.getElementById('loginPage');
    const generatorPage = document.getElementById('generatorPage');
    const usernameInput = document.getElementById('usernameInput');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userIdInput = document.getElementById('userId');
    const saveIdButton = document.getElementById('saveIdButton');
    const savedIdMessage = document.getElementById('savedIdMessage');
    const resultArea = document.getElementById('resultArea');
    const rewardNotice = document.getElementById('rewardNotice');
    const generatorButtons = document.querySelectorAll('.generator-btn');

    let loggedInUser = null;
    let savedPlayerId = null;

    // --- Fungsi untuk Notifikasi "Claim Reward" ---
    function showRandomRewardNotice() {
        const randomIdPart = Math.floor(100 + Math.random() * 899); // 3 digit acak
        const censoredId = `ID${randomIdPart}******`;
        const rewards = ["500 Diamonds (Visual)", "Starlight Membership (Visual)", "100 Tickets (Visual)", "Rare Skin Fragment (Visual)"];
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

        rewardNotice.innerHTML = `✨ ${censoredId} baru saja mengklaim ${randomReward}! ✨`;
        rewardNotice.style.opacity = '1'; // Tampilkan

        // Sembunyikan setelah beberapa detik
        setTimeout(() => {
            rewardNotice.style.opacity = '0';
            // Jadwalkan notifikasi berikutnya
            setTimeout(showRandomRewardNotice, Math.random() * 15000 + 10000); // Antara 10-25 detik
        }, 5000); // Tampilkan selama 5 detik
    }


    // --- Logika Login & UI ---
    function showLoginPage() {
        loginPage.classList.add('active');
        generatorPage.classList.remove('active');
        rewardNotice.style.opacity = '0'; // Sembunyikan notif saat di login page
    }

    function showGeneratorPage() {
        loginPage.classList.remove('active');
        generatorPage.classList.add('active');
        welcomeMessage.textContent = `Welcome, ${loggedInUser}!`;
        loadPlayerId(); // Coba muat ID pemain yang tersimpan untuk user ini
        displaySavedIdMessage();
        setTimeout(showRandomRewardNotice, Math.random() * 5000 + 2000); // Mulai notifikasi setelah login
    }

    loginButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        if (username) {
            loggedInUser = username;
            localStorage.setItem('loggedInUser', loggedInUser);
            showGeneratorPage();
            usernameInput.value = ''; // Kosongkan input setelah login
        } else {
            alert('Username tidak boleh kosong!');
        }
    });

    logoutButton.addEventListener('click', function() {
        loggedInUser = null;
        savedPlayerId = null; // Hapus juga ID game saat logout
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('playerGameId_' + loggedInUser); // Hapus ID spesifik user
        userIdInput.value = ''; // Kosongkan input ID
        savedIdMessage.textContent = '';
        resultArea.innerHTML = ''; // Bersihkan area hasil
        showLoginPage();
    });

    // Cek status login saat halaman dimuat
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        loggedInUser = storedUser;
        showGeneratorPage();
    } else {
        showLoginPage();
    }

    // --- Logika Simpan ID Player (Visual & Client-Side) ---
    function savePlayerId() {
        const playerId = userIdInput.value.trim();
        if (playerId) {
            savedPlayerId = playerId;
            if (loggedInUser) { // Simpan ID terkait dengan user yang login
                localStorage.setItem('playerGameId_' + loggedInUser, playerId);
            }
            displaySavedIdMessage();
        } else {
            alert('Masukkan ID Player terlebih dahulu.');
        }
    }

    function loadPlayerId() {
        if (loggedInUser) {
            const storedPlayerId = localStorage.getItem('playerGameId_' + loggedInUser);
            if (storedPlayerId) {
                savedPlayerId = storedPlayerId;
                userIdInput.value = storedPlayerId; // Isi kembali ke input field
            }
        }
    }
    
    function displaySavedIdMessage() {
        if (savedPlayerId) {
            savedIdMessage.textContent = `ID Aktif untuk visualisasi: ${savedPlayerId}`;
            savedIdMessage.style.color = '#2ecc71';
        } else {
            savedIdMessage.textContent = 'Belum ada ID yang diatur untuk visualisasi.';
            savedIdMessage.style.color = '#e67e22';
        }
    }

    saveIdButton.addEventListener('click', savePlayerId);


    // --- Logika Generator (Visual) ---
    generatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemType = this.dataset.type;
            const currentId = savedPlayerId || userIdInput.value.trim(); // Gunakan ID tersimpan, atau dari input jika belum disimpan

            if (!currentId) {
                resultArea.innerHTML = '<p style="color:#e67e22;">Silakan masukkan User ID Anda atau simpan ID terlebih dahulu!</p>';
                return;
            }

            resultArea.innerHTML = `<p>Memproses ${itemType} untuk ID: ${currentId}...</p><div class="loader"></div>`;

            // Simulasi loading
            setTimeout(function() {
                let message = '';
                switch(itemType) {
                    case 'Diamonds':
                        const randomDiamonds = Math.floor(Math.random() * 2000) + 500;
                        message = `Selamat! ${randomDiamonds} Diamond (Visual) telah ditambahkan ke akun ${currentId}!`;
                        break;
                    case 'Starlight':
                        message = `Selamat! Starlight Gift (Visual) telah diaktifkan untuk akun ${currentId}!`;
                        break;
                    case 'WeeklyPass':
                        message = `Selamat! Weekly Diamond Pass Gift (Visual) telah diaktifkan untuk akun ${currentId}!`;
                        break;
                }
                resultArea.innerHTML = `<p style="color:#2ecc71;">${message}</p>`;
                resultArea.innerHTML += '<p style="font-size:0.8em; color:gray;">(Ini hanya tampilan, tidak ada item sungguhan yang ditambahkan.)</p>';
            }, 2000 + Math.random() * 1500); // Waktu proses acak antara 2 - 3.5 detik
        });
    });
});

// Tambahkan sedikit CSS untuk loader sederhana jika mau
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
.loader {
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #00aaff; /* Blue */
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 10px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);