<template lang="">
        <header v-if="$route.name != 'login'">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item me-3 text-white">
            <RouterLink to="/" class="custom-link">Home</RouterLink>
            </li>
            <li class="nav-item me-3" v-if="role == 4 || role == 1">
            <RouterLink to="/order" class="custom-link">Order</RouterLink>
            </li>
            <li class="nav-item me-3">
            <RouterLink to="/order-list" class="custom-link">Order List</RouterLink>
            </li>
            <li class="nav-item me-3" v-if="role == 4">
            <RouterLink to="/product" class="custom-link">Product</RouterLink>
            </li>
            <li class="nav-item" >
            <a href="#" @click="logout()" class="custom-link">Logout</a>
            </li>
        </ul>
        <li class="d-flex">
            <span>Hai, {{ name }}</span>
        </li>
        </div>
    </div>
    </nav>
</header>
</template>
<script>
import axios from 'axios';
import router from '@/router';

export default {
    props: ['name', 'role'],
    methods: {
        logout() {
            axios.get('http://127.0.0.1:8000/api/auth/logout', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(function (response) {
                    localStorage.removeItem('email')
                    localStorage.removeItem('name')
                    localStorage.removeItem('role_id')
                    localStorage.removeItem('token')
                    router.push({ name: 'login' })
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
}

</script>
<style>
.custom-link {
    color: white; /* Warna teks default */
    text-decoration: none; /* Hilangkan garis bawah */
    transition: color 0.3s ease, text-decoration 0.3s ease; /* Efek transisi halus */
}

.custom-link:hover {
    color: #f0a500; /* Warna saat di-hover */
    text-decoration: underline; /* Tambahkan garis bawah saat hover */
}
</style>