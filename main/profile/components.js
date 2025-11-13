let userData = {
    name: 'Username',
    email: 'email.pengguna@example.com',
    phone: '',
    birthday: '',
    gender: '',
    address: '',
    profilePicture: ''
};

function init() {
    // Load saved data from localStorage if exists
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        userData = JSON.parse(savedData);
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById('displayName').textContent = userData.name;
    document.getElementById('displayEmail').textContent = userData.email;
    document.getElementById('infoName').textContent = userData.name;
    document.getElementById('infoEmail').textContent = userData.email;
    
    updateField('infoPhone', userData.phone);
    updateField('infoBirthday', userData.birthday);
    updateField('infoGender', userData.gender);
    updateField('infoAddress', userData.address);

    if (userData.profilePicture) {
        document.getElementById('profilePicture').innerHTML = 
            `<img src="${userData.profilePicture}" alt="Profile">`;
    }
}

function updateField(elementId, value) {
    const element = document.getElementById(elementId);
    if (value) {
        element.textContent = value;
        element.classList.remove('empty');
    } else {
        element.textContent = 'Belum diisi';
        element.classList.add('empty');
    }
}

function changePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                userData.profilePicture = event.target.result;
                localStorage.setItem('userData', JSON.stringify(userData));
                updateDisplay();
                alert('Foto profil berhasil diubah!');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function openEditModal() {
    document.getElementById('editName').value = userData.name;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editPhone').value = userData.phone;
    document.getElementById('editBirthday').value = userData.birthday;
    document.getElementById('editGender').value = userData.gender;
    document.getElementById('editAddress').value = userData.address;
    
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

function saveProfile() {
    userData.name = document.getElementById('editName').value || 'Username';
    userData.email = document.getElementById('editEmail').value || 'email.pengguna@example.com';
    userData.phone = document.getElementById('editPhone').value;
    userData.birthday = document.getElementById('editBirthday').value;
    userData.gender = document.getElementById('editGender').value;
    userData.address = document.getElementById('editAddress').value;

    localStorage.setItem('userData', JSON.stringify(userData));
    
    updateDisplay();
    closeEditModal();
    alert('Profile berhasil diperbarui!');
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        // Clear user session but keep the data
        alert('Logout berhasil!\n\nAnda akan diarahkan ke halaman login.');
        // Redirect to login page
        // window.location.href = 'login.html';
        console.log('User logged out');
    }
}

function shutdownSystem() {
    if (confirm('Apakah Anda yakin ingin mematikan sistem?')) {
        alert('Sistem akan dimatikan...');
        console.log('System shutdown initiated');
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
};

init();
