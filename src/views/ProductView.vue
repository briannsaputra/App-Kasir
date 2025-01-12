<template lang="">
    <NavBar :name=userName :role=roleId />
    
    <div class="container">
    <div class="table-container">
        <h2 class="text-center mb-4">Contoh Tabel Menarik Menggunakan Bootstrap</h2>
        <a href="/product-add" class="btn btn-primary my-3">Tambah Produk</a>

        <table class="table table-striped table-hover">
            <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Gambar</th>
                    <th>Price</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody v-for="(item, index) in items" ::key="index">
                <tr>
                    <td>{{ index+1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <img v-if="item.image" :src="url+item.image"  alt="Gambar Alice" style="width: 100px; height: 100px;">
                        <img v-else src="@/assets/images/R.jpeg"  alt="not found" style="width: 100px; height: 100px;">
                    </td>
                    <td>{{ `Rp ${item.price}` }}</td>
                    <td>
                        <a class="btn btn-warning btn-sm mx-2"><RouterLink :to="{ name: 'productUpdate', params: { productId: item.id }}">edit</RouterLink></a>
                        <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Hapus</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
import router from "@/router";
export default {
    components: {
        NavBar,
    },
    data() {
        return {
        userName: '',
        roleId: '',
        items: [],
        url: 'http://127.0.0.1:8000/storage/items/',
        };
    },
    mounted() {
        // Ambil nama pengguna dari localStorage
        this.userName = localStorage.getItem("name");
        this.roleId = localStorage.getItem('role_id');


        // Jika nama pengguna kosong atau tidak ditemukan, arahkan ke halaman login
        if (!this.userName) {
        router.push({ name: "login" });
        }
        if (this.roleId != 4) {
            router.push({ name: "home" });
        }

        this.getItems();
    },
    methods: {
        getItems() {
            axios
                .get('http://127.0.0.1:8000/api/item-show', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                this.items = response.data.data
                })
                .catch(error => {
                    if(error.response.status == 401) {
                        localStorage.removeItem('token')
                        localStorage.removeItem('email')
                        localStorage.removeItem('name')
                        localStorage.removeItem('role_id')

                        router.push({ name: 'login' })
                    }
                    console.log(error.response.status);
                    console.error("Login failed:", error);
                    alert("eror");
                });
        }
    }
}
</script>

<style>
    body {
            background-color: #f8f9fa;
        }
        .table-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-top: 30px;
        }
        .table-hover tbody tr:hover {
            background-color: #e9ecef;
            transition: background-color 0.3s ease;
        }
        .btn-custom {
            background-color: #007bff;
            color: white;
            transition: background-color 0.3s ease;
        }
        .btn-custom:hover {
            background-color: #0056b3;
        }
        .btn-danger {
            transition: background-color 0.3s ease;
        }
        .btn-danger:hover {
            background-color: #c82333;
        }
        h2 {
            color: #343a40;
        }
</style>