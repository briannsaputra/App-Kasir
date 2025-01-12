<template>
    <div class="d-flex justify-content-center align-items-center bg-light vh-100">
        <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%; border-radius: 15px;">
            <h2 class="text-center mb-4">Login</h2>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" v-model="email" class="form-control" id="email" name="email" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" v-model="password" class="form-control" id="password" name="password"
                        required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
            <div class="text-center mt-3">
                <a href="forgot-password.html" class="text-decoration-none">Forgot Password?</a>
            </div>
            <div class="text-center mt-2">
                <span>Don't have an account? <a href="register.html" class="text-decoration-none">Register</a></span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';

export default {
    data() {
        return {
            email: "",
            password: ""
        };
    },
    methods: {
        login() {
            axios
                .post('http://127.0.0.1:8000/api/auth/login', {
                    email: this.email,
                    password: this.password
                })
                .then(response => {
                    // Simpan data login ke localStorage
                    localStorage.setItem('email', response.data.data.email);
                    localStorage.setItem('name', response.data.data.name);
                    localStorage.setItem('role_id', response.data.data.role_id);
                    localStorage.setItem('token', response.data.data.token);

                    // Arahkan ke halaman home
                    router.push({ name: 'home' });
                })
                .catch(error => {
                    console.error("Login failed:", error);
                    alert("Login gagal. Silakan periksa email dan password Anda.");
                });
        }
    },
    mounted() {
        // Periksa apakah pengguna sudah login
        const userName = localStorage.getItem('name');
        if (userName) {
            router.push({ name: 'home' });
        }
    }
};
</script>

<style scoped>
/* Gaya khusus */
.card {
    border-radius: 15px;
}
</style>