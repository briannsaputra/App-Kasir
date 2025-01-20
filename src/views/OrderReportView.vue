<template lang="">
	<div>
			<NavBar :name="userName" :role="roleId" />
	</div>
	<div class="container mt-5">
<div class="mb-3 w-50">
	<label for="month" class="form-label fw-bold">Month :</label>
	<select class="form-control shadow-sm" id="month" v-model="month" @change="getReport()">
	<option value="">Pilih Periode Bulan</option>
	<option v-for="month in months" :value="month.value">
			{{ month.name }}
	</option>
	</select>
</div>

<div class="row mt-5">
	<div class="col-12 col-sm-4 mb-3">
	<div class="card shadow-sm text-center border-primary">
			<div class="card-body">
			<h5 class="card-title text-primary">Order Count</h5>
			<p class="card-text fs-4 fw-bold">{{ data.orderCount }}</p>
			</div>
	</div>
	</div>
	<div class="col-12 col-sm-4 mb-3">
	<div class="card shadow-sm text-center border-success">
			<div class="card-body">
			<h5 class="card-title text-success">Min Payment</h5>
			<p class="card-text fs-4 fw-bold">Rp {{ data.minpayment }}</p>
			</div>
	</div>
	</div>
	<div class="col-12 col-sm-4 mb-3">
	<div class="card shadow-sm text-center border-danger">
			<div class="card-body">
			<h5 class="card-title text-danger">Max Payment</h5>
			<p class="card-text fs-4 fw-bold">Rp {{ data.maxpayment }}</p>
			</div>
	</div>
	</div>
</div>

<hr class="my-5">

<div class="table-responsive">
	<table class="table table-hover align-middle shadow-sm">
	<thead class="table-dark">
			<tr>
			<th scope="col">#</th>
			<th scope="col">Customer Name</th>
			<th scope="col">Table No.</th>
			<th scope="col">Order Date</th>
			<th scope="col">Time</th>
			<th scope="col">Total</th>
			<th scope="col">Status</th>
			<th scope="col">Waitress</th>
			<th scope="col">Cashier</th>
			</tr>
	</thead>
	<tbody>
			<tr v-for="(order, index) in data.orders" :key="index" class="table-light">
			<td>{{ index + 1 }}</td>
			<td>{{ order.customer_name }}</td>
			<td>{{ order.table_no }}</td>
			<td>{{ order.order_date }}</td>
			<td>{{ order.order_time }}</td>
			<td class="text-end">Rp {{ order.total }}</td>
			<td>
					<span
					:class="{
							'badge bg-warning text-dark': order.status === 'ordered',
							'badge bg-success': order.status === 'done',
							'badge bg-danger': order.status === 'paid',
					}"
					>
					{{ order.status }}
					</span>
			</td>
			<td>{{ order.waitress ? order.waitress.name : '-' }}</td>
			<td>{{ order.cashier ? order.cashier.name : '-' }}</td>
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
			userName: "",
			roleId: "",
			months: [
				{ value: 1, name: "January" },
				{ value: 2, name: "February" },
				{ value: 3, name: "March" },
				{ value: 4, name: "April" },
				{ value: 5, name: "May" },
				{ value: 6, name: "June" },
				{ value: 7, name: "July" },
				{ value: 8, name: "Augustus" },
				{ value: 9, name: "September" },
				{ value: 10, name: "October" },
				{ value: 11, name: "November" },
				{ value: 12, name: "December" },
			],
			month: "",
			data: {
				orderCount: 0,
				minpayment: 0,
				maxpayment: 0,
			}
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
	},
	methods: {
		getReport() {
			axios
				.get('http://127.0.0.1:8000/api/order-report?month=' + this.month, {
					headers: {
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then(response => {
					console.log(response)
					this.data = response.data.data
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
};
</script>
<style lang=""></style>
