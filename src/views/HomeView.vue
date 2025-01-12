<template>
  <!-- Navbar componen -->
  <NavBar :name=userName :role=roleId />
  <div>
    {{ userName }}
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import NavBar from '@/components/NavBar.vue';


export default {
  components: {
    NavBar
  },
  data() {
    return {
      userName: '',
      roleId   : ''
    };
  },
  mounted() {
    // Ambil nama pengguna dari localStorage
    this.userName = localStorage.getItem('name');
    this.roleId = localStorage.getItem('role_id')

    // Jika nama pengguna kosong atau tidak ditemukan, arahkan ke halaman login
    if (!this.userName) {
      router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
/* Tambahkan gaya CSS di sini jika diperlukan */
</style>
