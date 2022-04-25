<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-button v-if="!islogin" type="primary" style="margin-right: 10px;" @click="connectToMetaMask" >链接钱包</el-button>
      <el-dropdown v-if="islogin" > 
        <span class="el-dropdown-link">
          当前账户：{{account}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided>账户登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      islogin: false,
      account: '',
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  async created() {
    console.log(ethereum.selectedAddress);
    
    // const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // console.log(accounts)
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async connectToMetaMask(){
      console.log('@@@');

      if (typeof window.ethereum === "undefined") {
        alert("metamask not install yet");
      } else {
        console.log('yes you have metamask !!');
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        this.islogin = true
        console.log(accounts);
        this.account = accounts[0]
        
      }

    }
  }
}
</script>

<style lang="scss" scoped>

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
  }
}
</style>
