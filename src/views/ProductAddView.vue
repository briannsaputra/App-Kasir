<template>
  <NavBar :name="userName" :role="roleId" />
  <div>
    <h1>Ini Halaman Tambah Produk</h1>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <div class="card shadow-lg">
            <div class="card-header bg-gradient-primary">
              <h4 class="mb-0 text-center">Tambah Produk</h4>
            </div>
            <div class="card-body p-4">
              <form @submit.prevent="createProduct">
                <div class="form-group mb-4">
                  <label for="name" class="form-label">Nama Produk</label>
                  <input
                    type="text"
                    id="name"
                    v-model="name"
                    class="form-control form-control-lg"
                    placeholder="Masukkan nama produk"
                  />
                </div>
                <div class="form-group mb-4">
                  <label for="image" class="form-label">Gambar Produk</label>
                  <div class="input-group">
                    <input
                      type="file"
                      id="image"
                      @change="imageChanged"
                      class="form-control"
                      accept="image/*"
                    />
                  </div>
                  <div v-if="previewImage" class="preview-container mt-2">
                    <img
                      :src="previewImage"
                      alt="Preview Gambar"
                      class="img-thumbnail"
                    />
                  </div>
                </div>
                <div class="form-group mb-4">
                  <label for="price" class="form-label">Harga Produk</label>
                  <input
                    type="number"
                    id="price"
                    v-model="price"
                    class="form-control form-control-lg"
                    placeholder="Masukkan harga produk"
                  />
                </div>
                <div class="text-center">
                  <button
                    type="submit"
                    class="btn btn-success btn-lg px-5 me-3"
                  >
                    <i class="fas fa-save"></i> Simpan
                  </button>
                </div>
              </form>
            </div>
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
      name: "",
      price: "",
      file: null,
      previewImage: null,
    };
  },
  mounted() {
    this.userName = localStorage.getItem("name");
    this.roleId = localStorage.getItem("role_id");

    if (!this.userName) {
      router.push({ name: "login" });
    } else if (this.roleId != 4) {
      router.push({ name: "home" });
    }
  },
  methods: {
    createProduct() {
      if (!this.name || !this.price || !this.file) {
        alert("Semua data harus diisi!");
        return;
      }

      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("price", this.price);
      formData.append("image_file", this.file);

      axios
        .post("http://127.0.0.1:8000/api/item", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          alert("Produk berhasil ditambahkan!");
          router.push({ name: "product" });
        })
        .catch((error) => {
          const message =
            error.response?.data?.message || "Terjadi kesalahan, coba lagi.";
          console.error("Terjadi kesalahan:", message);
          alert(`Gagal menambahkan produk: ${message}`);
        });
    },
    imageChanged(e) {
      const file = e.target.files[0];
      this.file = file;
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.previewImage = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style>
.preview-container img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}
</style>
