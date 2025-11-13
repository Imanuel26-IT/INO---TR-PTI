    // Track photo type (default avatar or uploaded)
            let isDefaultAvatar = true;
            let uploadedPhotoUrl = null;

            // LocalStorage keys
            const LS_KEYS = {
                photo: 'profile_photo',           // final saved profile photo (data URL or URL)
                tempPhoto: 'profile_temp_photo',  // temporary preview (before saving)
                isDefault: 'profile_isDefault'    // boolean flag as string
            };

            // Load stored photo (if any) when script runs
            function loadProfilePhotoFromStorage() {
                try {
                    const saved = localStorage.getItem(LS_KEYS.photo);
                    const isDef = localStorage.getItem(LS_KEYS.isDefault);
                    const temp = localStorage.getItem(LS_KEYS.tempPhoto);

                    if (saved) {
                        const imgEl = document.getElementById('profileImage');
                        if (imgEl) imgEl.src = saved;
                        // also set preview if edit panel is open later
                        const preview = document.getElementById('editPhotoPreview');
                        if (preview) preview.src = saved;

                        isDefaultAvatar = (isDef === 'true');
                        uploadedPhotoUrl = isDefaultAvatar ? null : saved;
                    } else if (temp) {
                        // If there's a temp preview (user uploaded but didn't save)
                        const preview = document.getElementById('editPhotoPreview');
                        if (preview) preview.src = temp;
                        isDefaultAvatar = false;
                        uploadedPhotoUrl = temp;
                    }

                    // Update color options UI according to state
                    updateColorOptions(isDefaultAvatar);
                } catch (e) {
                    console.warn('Could not load profile photo from localStorage', e);
                }
            }
       
       // Tab Switching
        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.closest('.tab-btn').classList.add('active');
            document.getElementById(tab + 'Tab').classList.add('active');
        }

        // Show Edit Options
        function showEditOptions() {
            const editPage = document.getElementById('editProfilePage');
            const editPageTitle = document.getElementById('editPageTitle');
            const editPageContent = document.getElementById('editPageContent');
            
            editPageTitle.textContent = 'Edit Profile';
            editPageContent.innerHTML = `
                <div class="info-section">
                    <h2 class="section-title">
                        <i class="fas fa-edit"></i> Pilih yang ingin diubah
                    </h2>
                    <div class="edit-options">
                        <div class="edit-option-card" onclick="editProfileInfo()">
                            <div class="edit-option-icon">
                                <i class="fas fa-user-edit"></i>
                            </div>
                            <div class="edit-option-title">Informasi Profile</div>
                            <div class="edit-option-desc">Ubah nama, username, bio, tanggal lahir, dan jenis kelamin</div>
                        </div>
                        
                        <div class="edit-option-card" onclick="editProfilePhoto()">
                            <div class="edit-option-icon">
                                <i class="fas fa-camera"></i>
                            </div>
                            <div class="edit-option-title">Foto Profile</div>
                            <div class="edit-option-desc">Ganti atau hapus foto profile Anda</div>
                        </div>
                    </div>
                </div>
            `;
            
            editPage.classList.add('active');
        }

        // Edit Profile Info
        function editProfileInfo() {
            const editPageTitle = document.getElementById('editPageTitle');
            const editPageContent = document.getElementById('editPageContent');
            
            editPageTitle.innerHTML = '<i class="fas fa-user-edit"></i> Edit Informasi Profile';
            editPageContent.innerHTML = `
                <div class="info-section">
                    <form onsubmit="saveProfileInfo(event)">
                        <div class="form-group">
                            <label class="form-label">Nama Lengkap</label>
                            <input type="text" class="form-input" id="editName" value="${document.getElementById('displayName').textContent}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-input" id="editUsername" value="${document.getElementById('displayUsername').textContent.replace('@', '')}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea class="form-input form-textarea" id="editBio" required>${document.getElementById('displayBio').textContent}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Tanggal Lahir</label>
                            <input type="date" class="form-input" id="editBirthdate" value="1995-08-15" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Jenis Kelamin</label>
                            <select class="form-select" id="editGender" required>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        
                        <div class="btn-group">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Simpan Perubahan
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="showEditOptions()">
                                <i class="fas fa-arrow-left"></i> Kembali
                            </button>
                        </div>
                    </form>
                </div>
            `;
            
            // Set current gender value
            document.getElementById('editGender').value = document.getElementById('infoGender').textContent;
        }

        // Edit Profile Photo
        function editProfilePhoto() {
            const editPageTitle = document.getElementById('editPageTitle');
            const editPageContent = document.getElementById('editPageContent');
            const currentPhoto = document.getElementById('profileImage').src;
    
        // Check if current photo is uploaded or default avatar
            const isCurrentDefault = currentPhoto.includes('ui-avatars.com');
    
            editPageTitle.innerHTML = '<i class="fas fa-camera"></i> Edit Foto Profile';
            editPageContent.innerHTML = `
            <div class="profile-photo-section">
                    <div class="profile-photo-wrapper">
                        <img src="${currentPhoto}" alt="Profile Photo" class="profile-photo-large" id="editPhotoPreview">
                    </div>
            
                <div class="photo-options">
                    <button class="photo-option-btn" onclick="changeRandomPhoto()">
                        <i class="fas fa-random"></i> Foto Random
                    </button>
                    <div class="photo-option-btn" style="padding: 0;">
                        <label style="cursor: pointer; display: block; width: 100%; height: 100%; padding: 12px 20px;">
                            <i class="fas fa-upload"></i> Upload Foto
                            <input type="file" id="photoUploadInput" accept="image/*" style="display: none;" onchange="handlePhotoUpload(event)">
                        </label>
                    </div>
                    <button class="photo-option-btn" onclick="removePhoto()">
                        <i class="fas fa-trash"></i> Hapus Foto
                    </button>
                </div>
            </div>
        
            <div class="info-section" id="colorAvatarSection">
                <h2 class="section-title">
                    <i class="fas fa-palette"></i> Pilih Avatar Warna
                </h2>
                <p style="color: #999; margin-bottom: 20px; font-size: 14px;">
                    ${!isCurrentDefault ? '⚠️ Pilihan warna hanya tersedia untuk avatar default. Upload foto baru atau hapus foto untuk menggunakan avatar warna.' : 'Pilih warna untuk avatar default Anda:'}
                </p>
                <div class="edit-options">
                    <div class="edit-option-card ${!isCurrentDefault ? 'disabled' : ''}" onclick="setAvatarColor('f9d423')">
                        <div class="edit-option-icon" style="background: #f9d423;">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="edit-option-title">Kuning</div>
                    </div>
                
                    <div class="edit-option-card ${!isCurrentDefault ? 'disabled' : ''}" onclick="setAvatarColor('ff4e50')">
                        <div class="edit-option-icon" style="background: #ff4e50;">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="edit-option-title">Merah</div>
                    </div>
                
                    <div class="edit-option-card ${!isCurrentDefault ? 'disabled' : ''}" onclick="setAvatarColor('00c853')">
                        <div class="edit-option-icon" style="background: #00c853;">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="edit-option-title">Hijau</div>
                    </div>
                
                    <div class="edit-option-card ${!isCurrentDefault ? 'disabled' : ''}" onclick="setAvatarColor('2196f3')">
                        <div class="edit-option-icon" style="background: #2196f3;">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="edit-option-title">Biru</div>
                    </div>
                
                    <div class="edit-option-card ${!isCurrentDefault ? 'disabled' : ''}" onclick="setAvatarColor('9c27b0')">
                        <div class="edit-option-icon" style="background: #9c27b0;">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="edit-option-title">Ungu</div>
                    </div>
                
                    <div class="edit-option-card ${!isCurrentDefault ? 'disabled' : ''}" onclick="setAvatarColor('ff9800')">
                        <div class="edit-option-icon" style="background: #ff9800;">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="edit-option-title">Oranye</div>
                    </div>
                </div>
            
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="savePhotoChanges()">
                        <i class="fas fa-save"></i> Simpan Foto
                    </button>
                    <button class="btn btn-secondary" onclick="showEditOptions()">
                        <i class="fas fa-arrow-left"></i> Kembali
                    </button>
                </div>
            </div>
            `;
            }

        // Save Profile Info
        function saveProfileInfo(e) {
            e.preventDefault();
            const name = document.getElementById('editName').value;
            const username = document.getElementById('editUsername').value;
            const bio = document.getElementById('editBio').value;
            const birthdate = document.getElementById('editBirthdate').value;
            const gender = document.getElementById('editGender').value;

            // Update display
            document.getElementById('displayName').textContent = name;
            document.getElementById('displayUsername').textContent = '@' + username;
            document.getElementById('displayBio').textContent = bio;
            
            document.getElementById('infoName').textContent = name;
            document.getElementById('infoUsername').textContent = '@' + username;
            
            // Format birthdate
            const date = new Date(birthdate);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('id-ID', options);
            document.getElementById('infoBirthdate').textContent = formattedDate;
            
            document.getElementById('infoGender').textContent = gender;

            closeEditPage();
            showSuccess('Informasi profile berhasil diperbarui!');
        }

        // Photo Functions
        let tempPhotoUrl = '';

        function changeRandomPhoto() {
        const names = ['Andi Pratama', 'Budi Santoso', 'Citra Dewi', 'Doni Kusuma', 'Eka Putri'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const colors = ['f9d423', 'ff4e50', '00c853', '2196f3', '9c27b0', 'ff9800'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        tempPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&size=180&background=${randomColor}&color=fff&bold=true`;
        const previewEl = document.getElementById('editPhotoPreview');
        if (previewEl) previewEl.src = tempPhotoUrl;

        // Set as default avatar
        isDefaultAvatar = true;
        uploadedPhotoUrl = null;

        // Persist temporary preview so it stays if user reloads while editing
        try {
            localStorage.setItem(LS_KEYS.tempPhoto, tempPhotoUrl);
            localStorage.setItem(LS_KEYS.isDefault, 'true');
        } catch (e) {
            console.warn('Could not save temp avatar to localStorage', e);
        }

        // Enable color options
        updateColorOptions(true);
        }

        function setAvatarColor(color) {
        // Only allow if using default avatar
        const previewEl = document.getElementById('editPhotoPreview');
        const currentPreview = previewEl ? previewEl.src : '';
        if (currentPreview && !currentPreview.includes('ui-avatars.com')) {
            alert('⚠️ Pilihan warna hanya tersedia untuk avatar default.\n\nSilakan hapus foto atau gunakan avatar default terlebih dahulu.');
            return;
        }

        const name = document.getElementById('displayName').textContent;
        tempPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=180&background=${color}&color=fff&bold=true`;
        if (previewEl) previewEl.src = tempPhotoUrl;

        isDefaultAvatar = true;
        uploadedPhotoUrl = null;

        try {
            localStorage.setItem(LS_KEYS.tempPhoto, tempPhotoUrl);
            localStorage.setItem(LS_KEYS.isDefault, 'true');
        } catch (e) {
            console.warn('Could not save avatar color to localStorage', e);
        }
        }

        function uploadPhoto() {
            document.getElementById('photoUploadInput').click();
        }

        function handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Validasi tipe file
                if (!file.type.startsWith('image/')) {
                    alert('Mohon pilih file gambar yang valid (JPG, PNG, GIF, dll).');
                    return;
                }

                // Validasi ukuran file (maksimal 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB dalam bytes
                if (file.size > maxSize) {
                    alert('Ukuran file terlalu besar. Maksimal 5MB.');
                    return;
                }

                const reader = new FileReader();
                
                // Tampilkan loading effect
                const previewImg = document.getElementById('editPhotoPreview');
                if (previewImg) previewImg.style.opacity = '0.5';
                
                reader.onload = function(e) {
                    // Validasi dimensi gambar
                    const img = new Image();
                    img.onload = function() {
                        // Batasi dimensi maksimal (opsional)
                        const maxDimension = 2000; // pixels
                        if (img.width > maxDimension || img.height > maxDimension) {
                            alert('Dimensi gambar terlalu besar. Maksimal 2000x2000 pixels.');
                            if (previewImg) previewImg.style.opacity = '1';
                            return;
                        }

                        // Jika semua validasi berhasil
                        tempPhotoUrl = e.target.result;
                        if (previewImg) {
                            previewImg.src = tempPhotoUrl;
                            previewImg.style.opacity = '1';
                        }
                        
                        // Update status foto
                        isDefaultAvatar = false;
                        uploadedPhotoUrl = tempPhotoUrl;
                        
                        // Nonaktifkan opsi warna avatar
                        updateColorOptions(false);

                        // Persist temporary upload so it remains after reload while editing
                        try {
                            localStorage.setItem(LS_KEYS.tempPhoto, tempPhotoUrl);
                            localStorage.setItem(LS_KEYS.isDefault, 'false');
                        } catch (err) {
                            console.warn('Could not save temp upload to localStorage', err);
                        }

                        showSuccess('Foto berhasil diunggah!');
                    };
                    
                    img.onerror = function() {
                        alert('File yang dipilih bukan gambar yang valid.');
                        if (previewImg) previewImg.style.opacity = '1';
                    };
                    
                    img.src = e.target.result;
                };
                
                reader.onerror = function() {
                    alert('Terjadi kesalahan saat membaca file. Silakan coba lagi.');
                    const p = document.getElementById('editPhotoPreview');
                    if (p) p.style.opacity = '1';
                };

                reader.readAsDataURL(file);
            }
        }

        function removePhoto() {
        const name = document.getElementById('displayName').textContent;
        tempPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=180&background=333&color=999&bold=true`;
        const preview = document.getElementById('editPhotoPreview');
        if (preview) preview.src = tempPhotoUrl;
    
        // Set as default avatar
        isDefaultAvatar = true;
        uploadedPhotoUrl = null;
    
        // Persist change
        try {
            localStorage.setItem(LS_KEYS.tempPhoto, tempPhotoUrl);
            localStorage.setItem(LS_KEYS.isDefault, 'true');
            localStorage.removeItem(LS_KEYS.photo);
        } catch (e) {
            console.warn('Could not update localStorage on removePhoto', e);
        }

        // Enable color options
        updateColorOptions(true);
        }

        function updateColorOptions(enable) {
        const colorSection = document.getElementById('colorAvatarSection');
        if (!colorSection) return;
    
        const cards = colorSection.querySelectorAll('.edit-option-card');
        const message = colorSection.querySelector('p');
    
        if (enable) {
            cards.forEach(card => card.classList.remove('disabled'));
            if (message) {
                message.innerHTML = 'Pilih warna untuk avatar default Anda:';
            }
        } else {
            cards.forEach(card => card.classList.add('disabled'));
            if (message) {
                message.innerHTML = '⚠️ Pilihan warna hanya tersedia untuk avatar default. Upload foto baru atau hapus foto untuk menggunakan avatar warna.';
            }   
        }
    }

        function savePhotoChanges() {
            if (tempPhotoUrl) {
                const profileImg = document.getElementById('profileImage');
                if (profileImg) profileImg.src = tempPhotoUrl;

                // Update global state
                const currentPhoto = profileImg ? profileImg.src : tempPhotoUrl;
                if (currentPhoto.includes('ui-avatars.com')) {
                    isDefaultAvatar = true;
                    uploadedPhotoUrl = null;
                } else {
                    isDefaultAvatar = false;
                    uploadedPhotoUrl = currentPhoto;
                }

                // Persist final selection to localStorage
                try {
                    localStorage.setItem(LS_KEYS.photo, currentPhoto);
                    localStorage.setItem(LS_KEYS.isDefault, isDefaultAvatar ? 'true' : 'false');
                    localStorage.removeItem(LS_KEYS.tempPhoto);
                } catch (e) {
                    console.warn('Could not save profile photo to localStorage', e);
                }
                showSuccess('Foto profile berhasil diperbarui!');
                closeEditPage();
                
                alert("screen will reload")
                window.parent.location.reload()

            } else {
                alert('Silakan pilih foto terlebih dahulu');
            }
        }

        // Close Edit Page
        function closeEditPage() {
            document.getElementById('editProfilePage').classList.remove('active');
            tempPhotoUrl = '';
        }

        // Change Password
        function changePassword() {
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!oldPassword || !newPassword || !confirmPassword) {
                alert('Semua field harus diisi!');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('Password baru dan konfirmasi password tidak cocok!');
                return;
            }

            if (newPassword.length < 8) {
                alert('Password minimal 8 karakter!');
                return;
            }

            // Clear fields
            document.getElementById('oldPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';

            showSuccess('Password berhasil diubah!');
        }

        // Change Email
        function changeEmail() {
            const newEmail = document.getElementById('newEmail').value;
            const password = document.getElementById('emailPassword').value;

            if (!newEmail || !password) {
                alert('Email dan password harus diisi!');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                alert('Format email tidak valid!');
                return;
            }

            document.getElementById('infoEmail').textContent = newEmail;
            document.getElementById('newEmail').value = '';
            document.getElementById('emailPassword').value = '';

            showSuccess('Email berhasil diubah!');
        }

        // Change Phone
        function changePhone() {
            const newPhone = document.getElementById('newPhone').value;

            if (!newPhone) {
                alert('Nomor telepon harus diisi!');
                return;
            }

            document.getElementById('infoPhone').textContent = newPhone;
            document.getElementById('newPhone').value = '';

            showSuccess('Nomor telepon berhasil diubah!');
        }

        // Deactivate Account
        function deactivateAccount() {
            const confirmation = confirm('Apakah Anda yakin ingin menonaktifkan akun? Akun Anda akan disembunyikan dari publik dan Anda dapat mengaktifkannya kembali dengan login.');
            
            if (confirmation) {
                showSuccess('Akun berhasil dinonaktifkan. Anda akan dialihkan...');
                setTimeout(() => {
                    alert('Akun Anda telah dinonaktifkan.');
                }, 2000);
            }
        }

        // Delete Account
        function deleteAccount() {
            const confirmation = confirm('PERINGATAN: Tindakan ini akan menghapus akun Anda secara permanen!\n\nSemua data, playlist, dan riwayat Anda akan hilang dan tidak dapat dipulihkan.\n\nApakah Anda yakin ingin melanjutkan?');
            
            if (confirmation) {
                const doubleConfirm = prompt('Ketik "HAPUS AKUN" untuk mengkonfirmasi penghapusan:');
                
                if (doubleConfirm === 'HAPUS AKUN') {
                    showSuccess('Akun berhasil dihapus. Selamat tinggal...');
                    setTimeout(() => {
                        alert('Akun Anda telah dihapus.');
                    }, 2000);
                } else {
                    alert('Konfirmasi tidak sesuai. Penghapusan akun dibatalkan.');
                }
            }
        }

        // Show Success Message
        function showSuccess(message) {
            const successMsg = document.getElementById('successMessage');
            document.getElementById('successText').textContent = message;
            successMsg.classList.add('active');
            
            setTimeout(() => {
                successMsg.classList.remove('active');
            }, 3000);
        }

        // Initialize stored photo (run on script load)
        try {
            loadProfilePhotoFromStorage();
        } catch (e) {
            // safe to ignore if DOM not ready; function will be called when edit panel opens
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeEditPage();
            }
        });