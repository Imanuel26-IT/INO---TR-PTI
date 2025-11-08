       
        let isLoginMode = true;

        
        function toggleAuthMode() {
            isLoginMode = !isLoginMode;
            
            const authTitle = document.getElementById('authTitle');
            const authSubtitle = document.getElementById('authSubtitle');
            const nameField = document.getElementById('nameField');
            const confirmPasswordField = document.getElementById('confirmPasswordField');
            const forgotPassword = document.getElementById('forgotPassword');
            const submitText = document.getElementById('submitText');
            const toggleQuestion = document.getElementById('toggleQuestion');
            const toggleButton = document.getElementById('toggleButton');

            if (isLoginMode) {
                
                authTitle.textContent = 'Masuk';
                authSubtitle.textContent = 'Selamat datang kembali!';
                nameField.classList.add('hidden');
                confirmPasswordField.classList.add('hidden');
                forgotPassword.style.display = 'block';
                submitText.textContent = 'Masuk';
                toggleQuestion.textContent = 'Belum punya akun?';
                toggleButton.textContent = 'Daftar di sini';
            } else {
                
                authTitle.textContent = 'Daftar';
                authSubtitle.textContent = 'Buat akun baru Anda';
                nameField.classList.remove('hidden');
                confirmPasswordField.classList.remove('hidden');
                forgotPassword.style.display = 'none';
                submitText.textContent = 'Daftar Sekarang';
                toggleQuestion.textContent = 'Sudah punya akun?';
                toggleButton.textContent = 'Masuk di sini';
            }

            
            clearForm();
        }

        
        function togglePassword(fieldId) {
            const input = document.getElementById(fieldId);
            const icon = document.getElementById(fieldId + 'Icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        
        function handleSubmit() {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (isLoginMode) {
                // LOGIN MODE
                if (!storedUser) {
                    alert("Belum ada akun. Silakan daftar terlebih dahulu.");
                    return;
                }

                if (email === storedUser.email && password === storedUser.password) {
                    alert("Login berhasil!\n\nSelamat datang, " + storedUser.name);
                    clearForm();
                    window.location.assign("./main/Index.html");
                } else {
                    alert("Email atau password salah!");
                }

            } else {
                // REGISTER MODE
                if (storedUser) {
                    alert("Akun sudah terdaftar. Silakan login saja.");
                    toggleAuthMode(); // paksa pindah ke login
                    return;
                }

                if (!name || !email || !password || !confirmPassword) {
                    alert("Semua kolom harus diisi!");
                    return;
                }

                if (password !== confirmPassword) {
                    alert("Password dan konfirmasi tidak cocok!");
                    return;
                }

                if (password.length < 6) {
                    alert("Password minimal 6 karakter!");
                    return;
                }

                const newUser = { name, email, password };
                localStorage.setItem("user", JSON.stringify(newUser));
                alert("Registrasi berhasil! Silakan login.");
                toggleAuthMode(); // otomatis pindah ke login
                clearForm();
            }
        }

       
        function forgotPasswordHandler() {
            const email = prompt('Masukkan email Anda untuk reset password:');
            if (email) {
                alert('Link reset password telah dikirim ke: ' + email);
            }
        }

        
        function clearForm() {
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';
        }

       
        document.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        });
