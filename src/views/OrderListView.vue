<!-- vueinit -->
<template lang="">
    <div>
        <NavBar :name="userName" :role="roleId" />
    </div>
    <div class="container my-5">
        <h1 class="text-center mb-4">Daftar Pesanan</h1>
        <div class="table-container">
            <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama Pelanggan</th>
                            <th>Nomor Meja</th>
                            <th>Tanggal Pesanan</th>
                            <th>Waktu Pesanan</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Nama Pelayan</th>
                            <th>Casier</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Contoh Data -->
                        <tr v-for="(order, index) in orders" :key="index">
                            <td>{{ index+1 }}</td>
                            <td>{{ order.customer_name }}</td>
                            <td>{{ order.table_no }}</td>
                            <td>{{ order.order_date }}</td>
                            <td>{{ order.order_time }}</td>
                            <td class="text-center">
                                <span class="badge bg-warning">
                                    <i class="bi bi-hourglass-split"></i> {{ order.status }}
                                </span>
                            </td>
                            <td class="text-end">{{ order.total }}</td>
                            <td>{{ order.waitress.name }}</td>
                            <td>{{ order.cashier ? order.cashier.name : '' }}</td>
                            <td class="btn-actions">
                                <button class="btn btn-primary btn-sm text-white">
                                    <router-link :to="{ name: 'orderDetail', params: { orderId: order.id } } "class="text-white text-decoration-none">Detail</router-link>
                                </button>
                            </td>
                        </tr>
                        <!-- Tambahkan data lainnya -->
                    </tbody>
                </table>
            </div>
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
            userName: "",
            roleId: "",
            orders: [],
        };
    },
    mounted() {
        // Ambil nama pengguna dari localStorage
        this.userName = localStorage.getItem("name");
        this.roleId = localStorage.getItem("role_id");

        // Jika nama pengguna kosong atau tidak ditemukan, arahkan ke halaman login
        if (!this.userName) {
            router.push({ name: "login" });
        }
        this.getOrders();
    },
    methods: {
        getOrders() {
            axios
                .get('http://127.0.0.1:8000/api/list-order', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    console.log(response)
                    this.orders = response.data.data
                })
                .catch(error => {
                    if (error.response.status == 401) {
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
    },
}
</script>
<style>
.table-container {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.table th {
    background: #343a40;
    color: #fff;
    text-align: center;
}

.badge {
    font-size: 90%;
}

.btn-actions {
    display: flex;
    justify-content: center;
    gap: 5px;
}

.btn-actions .btn {
    padding: 5px 10px;
    font-size: 14px;
}
</style>