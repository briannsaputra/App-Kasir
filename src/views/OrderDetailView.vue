<template lang="">
    <div>
        <NavBar :name="userName" :role="roleId" />
    </div>
    <div class="container my-5">
    <!-- Judul -->
    <h1 class="text-center mb-4 text-primary">Daftar Pesanan</h1>
    
    <!-- Container untuk tabel -->
    <div class="table-container shadow-sm p-4 bg-light rounded">
    <div class="table-responsive">
        <!-- Tabel Informasi Pesanan -->
        <table class="table table-bordered table-hover align-middle">
            <thead class="table-primary text-center">
                <tr>
                    <th colspan="4">Informasi Pesanan</th>
                </tr>
            </thead>
            <tbody>
                <!-- Baris Informasi Utama -->
                <tr>
                    <td><strong>Customer Name:</strong> {{ order.customer_name }}</td>
                    <td><strong>Table No:</strong> {{ order.table_no }}</td>
                    <td><strong>Order Date:</strong> {{ order.order_date }}</td>
                    <td><strong>Status:</strong>
                        <span class="badge bg-success" v-if="order.status === 'done'">Completed</span>
                        <span class="badge bg-warning text-dark" v-else-if="order.status === 'ordered'">Pending</span>
                        <span class="badge bg-info text-white" v-else-if="order.status === 'paid'">Payment</span>
                    </td>
                </tr>
                <!-- Baris Informasi Tambahan -->
                <tr>
                    <td><strong>Waitress:</strong> {{ order.waitress?.name || '-' }}</td>
                    <td><strong>Cashier:</strong> {{ order.cashier?.name || '-' }}</td>
                    <td><strong>Order Time:</strong> {{ order.order_time }}</td>
                    <td><strong>Grand Total:</strong>
                        <span class="text-success fw-bold">Rp {{ order.total }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr>
        <!-- Tabel Detail Pesanan -->
        <table class="table table-bordered table-hover align-middle">
            <thead class="table-primary text-center">
                <tr>
                    <th>No</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in order.order_detail" :key="index">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>{{ item.item?.name || '-' }}</td>
                    <td>Rp {{ item.price }}</td>
                    <td>{{ item.qty }}</td>
                    <td>Rp {{ item.price * item.qty }}</td>
                </tr>
            </tbody>
        </table>
        <div class="mt-3 d-flex gap-2">
            <!-- Tombol Done -->
            <button 
                v-if="(order.status == 'ordered') && (roleId == 2)" 
                class="btn btn-success d-flex align-items-center gap-1" @click="setAsDone(order.id)">
                <i class="bi bi-check-circle"></i> Done
            </button>
            <!-- Tombol Paid -->
            <button 
            v-if="(order.status == 'done') && (roleId == 3 || roleId == 4)"
                class="btn btn-primary d-flex align-items-center gap-1"  @click="setAsPaid(order.id)">
                <i class="bi bi-cash"></i> Paid
            </button>
        </div>
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
            order: "",
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


        this.getOrder()
    },
    methods: {
        getOrder() {
            axios
                .get('http://127.0.0.1:8000/api/order-detail/'+this.$route.params.orderId, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    console.log(response)
                    this.order = response.data.data
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
        },
        setAsDone(orderId) {
            axios
                .get('http://127.0.0.1:8000/api/list-order/'+ orderId + '/set-as-done', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    if(response.status == 200) {
                        alert('Ubah Status Berhasil')
                    }
                    this.order = response.data.data
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
        },
        setAsPaid(orderId) {
            axios
                .get('http://127.0.0.1:8000/api/list-order/'+ orderId + '/payment', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    if(response.status == 200) {
                        alert('Ubah Status Paid Berhasil')
                    }
                    this.order = response.data.data
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
    }
}
</script>
<style lang="">

</style>