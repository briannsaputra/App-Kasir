<template>
   <NavBar :name="userName" :role="roleId" />
   <div>Perbarui Produk</div>
   <div class="container mt-5">
      <div class="row justify-content-center">
         <div class="col-lg-8 col-md-10">
            <div class="card shadow-lg">
               <div class="card-header bg-gradient-primary">
                  <h4 class="mb-0 text-center">Perbarui Produk</h4>
               </div>
               <div class="card-body p-4">
                  <form @submit.prevent="updateProduct">
                     <div class="form-group mb-4">
                        <label for="name" class="form-label">Nama Produk</label>
                        <input
                           type="text"
                           id="name"
                           v-model="item.name"
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
                        <div class="preview-container mt-2">
                           <img
                              v-if="item.image"
                              :src="url + item.image"
                              alt="Gambar Produk"
                              style="width: 100px; height: 100px;"
                           />
                        </div>
                     </div>
                     <div class="form-group mb-4">
                        <label for="price" class="form-label">Harga Produk</label>
                        <input
                           type="number"
                           id="price"
                           v-model="item.price"
                           class="form-control form-control-lg"
                           placeholder="Masukkan harga produk"
                        />
                     </div>
                     <div class="text-center">
                        <button type="submit" class="btn btn-success btn-lg px-5 me-3">
                           <i class="fas fa-save"></i> Simpan
                        </button>
                     </div>
                  </form>
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
         url: "http://127.0.0.1:8000/storage/items/",
         productId: "",
         item: {
            name: "",
            price: "",
         },
         selectedImage: null,
         previewImage: null,
      };
   },
   mounted() {
      this.productId = this.$route.params.productId;
      this.userName = localStorage.getItem("name");
      this.roleId = localStorage.getItem("role_id");

      // Redirect jika pengguna tidak terautentikasi
      if (!this.userName) {
         router.replace({ name: "login" });
      }
      // Redirect jika role bukan 4
      if (this.roleId != 4) {
         router.replace({ name: "home" });
      }

      this.showItems();
   },
   methods: {
      // Menampilkan detail produk
      showItems() {
         axios
            .get(`http://127.0.0.1:8000/api/item/${this.productId}`, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            })
            .then((response) => {
               this.item = response.data.data;
            })
            .catch((error) => {
               console.error("Error saat mengambil data produk:", error);
               alert("Gagal mengambil detail produk.");
            });
      },
      // Menangani perubahan gambar
      imageChanged(event) {
         const file = event.target.files[0];
         if (file) {
            this.selectedImage = file;
            const reader = new FileReader();
            reader.onload = (e) => {
               this.previewImage = e.target.result;
            };
            reader.readAsDataURL(file);
         }
      },
      // Menyimpan produk
      updateProduct() {
         if (!this.item.name || !this.item.price) {
            alert("Nama dan harga produk harus diisi!");
            return;
         }

         const formData = new FormData();
         formData.append("name", this.item.name);
         formData.append("price", this.item.price);
         if (this.selectedImage) {
            formData.append("image_file", this.selectedImage);
         }
         formData.append("_method", "patch");

         axios
            .post(`http://127.0.0.1:8000/api/item/${this.productId}`, formData, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            })
            .then(() => {
               alert("Produk berhasil diperbarui!");
               router.push({ name: "product" });
            })
            .catch((error) => {
               const message =
                  error.response?.data?.message || "Terjadi kesalahan, coba lagi.";
               console.error("Terjadi kesalahan:", message);
               alert(`Gagal memperbarui produk: ${message}`);
            });
      },
   },
};
</script>

<style scoped>
.preview-container img {
   max-width: 100%;
   height: auto;
}
</style>
