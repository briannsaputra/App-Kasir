<!-- vueinit -->
<template lang="">
    <div>
        <NavBar :name="userName" :role="roleId" />
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
}
</script>
<style lang="">

</style>