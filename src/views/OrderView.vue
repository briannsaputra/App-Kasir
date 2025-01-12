<template lang="">
  <div>
    <NavBar :name="userName" :role="roleId" />
  </div>
  <div class="container my-5">
    <h1 class="text-center mb-4 text-primary">
      <i class="fas fa-cash-register"></i> Aplikasi Kasir
    </h1>
    <div class="row">
      <!-- Item List -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div
            class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          >
            <span><i class="fas fa-boxes"></i> Item List</span>
            <input
              type="text"
              v-model="keyword"
              class="form-control form-control-sm w-50 search-bar"
              placeholder="Cari item..."
              :onchange="searchItem()"
            />
          </div>
          <div class="card-body">
            <div id="itemList" class="list-group">
              <!-- Item 1 -->
              <div v-for="item in filteredItems">
                <button
                  @click="orderItem(item.id)"
                  class="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <img
                    :src="url + item.image"
                    alt="Item 1"
                    class="img-thumbnail me-3"
                    style="width: 100px; height: 100px"
                  />
                  <div class="flex-grow-1">
                    <strong>{{ item.name }}</strong>
                    <span class="badge badge-price rounded-pill float-end">{{
                      `Rp ${item.price}`
                    }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ordered -->
      <div class="col-md-6 mx-auto">
  <div class="card shadow-sm">
    <!-- Card Header -->
    <div class="card-header bg-success text-white d-flex align-items-center">
      <i class="fas fa-shopping-cart me-2"></i>
      <strong>Ordered List</strong>
    </div>

    <!-- Card Body -->
    <div class="card-body">
      <!-- Customer Details -->
      <div class="mb-3">
        <label for="customerName" class="form-label">Customer Name</label>
        <input type="text" id="customerName" class="form-control" placeholder="Enter customer name" v-model="customerName">
      </div>
      <div class="mb-3">
        <label for="tableNo" class="form-label">Table No</label>
        <input type="text" id="tableNo" class="form-control" placeholder="Enter table number" v-model="tableNo">
      </div>

      <!-- List Group for Orders -->
      <ul class="list-group mb-3">
        <li
          v-for="order in orders"
          class="list-group-item d-flex align-items-center justify-content-between"
        >
          <!-- Order Image -->
          <img
            :src="url + order.image"
            alt="Order Image"
            class="img-thumbnail me-3"
            style="width: 50px; height: 50px"
          />

          <!-- Order Details -->
          <div class="flex-grow-1">
            <strong>{{ order.name }} (x{{ order.qty }})</strong>
            <p class="text-muted mb-0">Rp. 30.000</p>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex align-items-center">
            <button
              class="btn btn-outline-secondary btn-sm me-2"
              @click="decreaseItemQty(order)"
            >
              <i class="fas fa-minus"></i>
            </button>
            <button
              class="btn btn-outline-secondary btn-sm me-2"
              @click="increaseItemQty(order)"
            >
              <i class="fas fa-plus"></i>
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="deleteItem(order)"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>

          <!-- Price Badge -->
          <span class="badge bg-primary rounded-pill ms-3">
            Rp {{ order.price }}
          </span>
        </li>
      </ul>

      <!-- Total and Checkout -->
      <hr />
      <div class="d-flex justify-content-between align-items-center mb-3">
        <strong>Total:</strong>
        <span class="fs-5 fw-bold">Rp {{ total }}</span>
      </div>
      <button class="btn btn-success w-100" :disabled=processing @click="submitOrder()" >
        <i class="fas fa-credit-card me-2"></i> {{ processing ? 'Processing Order..' : 'Submit' }}
      </button>
    </div>
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
      items: [],
      filteredItems: [],
      keyword: "",
      url: "http://127.0.0.1:8000/storage/items/",
      orders: [],
      total: 0,
      customerName: "",
      tableNo: "",
      processing: false,
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
    if (this.roleId != 4 && this.roleId != 1) {
      router.push({ name: "home" });
    }
    this.getItems();
  },
  methods: {
    // Melakukan permintaan HTTP GET ke endpoint API
    getItems() {
      axios
        .get("http://127.0.0.1:8000/api/item-show", {
          headers: {
            // Menambahkan header Authorization dengan token dari localStorage
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          // Jika permintaan berhasil, data dari respons API disimpan ke properti 'items'
          this.items = response.data.data;
        })
        .catch((error) => {
          // Jika terjadi kesalahan, tampilkan pesan error di konsol
          console.error("Login failed:", error);
          // Berikan pemberitahuan kepada pengguna
          alert("eror");
        });
    },
    searchItem() {
      // Filter item berdasarkan kata kunci pencarian
      this.filteredItems = this.items.filter((item) =>
        // Ubah nama item menjadi huruf kecil dan periksa apakah nama tersebut mengandung kata kunci
        // `includes` digunakan untuk memeriksa apakah substring (keyword) ditemukan dalam nama item
        item.name.toLowerCase().includes(this.keyword.toLowerCase())
      );
    },
    orderItem(id) {
      let item = this.filteredItems.filter(item => item.id === id)[0];
      let orderItem = Object.assign({}, item);
      orderItem.eachPrice = item.price;
      let indexOfArrayItem = this.orders.map(e => e.id).indexOf(orderItem.id);

      if (indexOfArrayItem != -1) {
        // Jika item yang diorder ada di array orders, maka tambah qty & kalikan harga
        this.orders[indexOfArrayItem].qty++;
        this.orders[indexOfArrayItem].price =
          this.orders[indexOfArrayItem].eachPrice * this.orders[indexOfArrayItem].qty;
      } else {
        // Jika item yang diorder belum ada di array orders, maka push item ke dalam array orders dengan qty 1
        orderItem.qty = 1;
        this.orders.push(orderItem);
      }

      let orderPrice = this.orders.map(order => order.price);
      let priceTotal = 0;

      orderPrice.forEach(price => {
        priceTotal += price;
      });

      this.total = priceTotal;
    },
    decreaseItemQty(item) {

      if (item.qty <= 1) {
        return
      }

      let indexOfArrayItem = this.orders.map(e => e.id).indexOf(item.id);

      this.orders[indexOfArrayItem].qty--;
      this.orders[indexOfArrayItem].price =
        this.orders[indexOfArrayItem].eachPrice * this.orders[indexOfArrayItem].qty;

      let orderPrice = this.orders.map(order => order.price);
      let priceTotal = 0;

      orderPrice.forEach(price => {
        priceTotal += price;
      });

      this.total = priceTotal;
    },
    increaseItemQty(item) {
      let indexOfArrayItem = this.orders.map(e => e.id).indexOf(item.id);
      this.orders[indexOfArrayItem].qty++;
      this.orders[indexOfArrayItem].price = this.orders[indexOfArrayItem].eachPrice * this.orders[indexOfArrayItem].qty;

      let orderPrice = this.orders.map(order => order.price);
      let priceTotal = 0;

      orderPrice.forEach(price => {
        priceTotal += price;
      });

      this.total = priceTotal;
    },
    deleteItem(item) {
      let indexOfArrayItem = this.orders.map(e => e.id).indexOf(item.id);
      this.orders.splice(indexOfArrayItem, 1);

      let orderPrice = this.orders.map(order => order.price);
      let priceTotal = 0;

      orderPrice.forEach(price => {
        priceTotal += price;
      });

      this.total = priceTotal;
    },
    submitOrder() {
      if (!this.customerName || !this.tableNo) {
        alert("Customer name and Table no cannot be empty");
        return; // Berhenti jika salah satu field kosong
      }

      let items = this.orders.map((order) => {
        return {
          id: order.id,
          qty: order.qty,
        };
      });

      this.processing = true
      // Kirim permintaan menggunakan axios
      axios
        .post(
          "http://127.0.0.1:8000/api/order",
          {
            customer_name: this.customerName, // Nama pelanggan
            table_no: this.tableNo,          // Nomor meja
            items: items,                    // Daftar item yang dipesan
          },
          {
            headers: {
              // Menambahkan header Authorization dengan token dari localStorage
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          // Jika permintaan berhasil, tampilkan response di konsol
          console.log("Order berhasil:", response.data);
          alert("Order berhasil dibuat");
          this.orders = []
          this.customerName = ''
          this.tableNo = ''
        })
        .catch(function (eror) {
          if (eror.response.status == 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            localStorage.removeItem('name')
            localStorage.removeItem('role_id')

            router.push({ name: 'login' })
          }
        })
        .finally(() => this.processing = false);
    }

  },
};
</script>
<style>
body {
  background-color: #f8f9fa;
}

.search-bar {
  border-radius: 20px;
}

.card-header {
  font-weight: bold;
}

.list-group-item {
  border: none;
  border-bottom: 1px solid #dee2e6;
}

.list-group-item:last-child {
  border-bottom: none;
}

.badge-price {
  background: linear-gradient(90deg, #4caf50, #81c784);
  color: white;
}

.btn-checkout {
  background: linear-gradient(90deg, #ff5722, #ff7043);
  border: none;
  color: white;
  font-weight: bold;
}

.btn-checkout:hover {
  background: linear-gradient(90deg, #ff7043, #ff5722);
  color: white;
}
</style>
