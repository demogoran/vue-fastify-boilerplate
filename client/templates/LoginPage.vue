<style lang="scss">
@import "../styles/login.scss";
</style>


<template>
  <b-container class="loginContainer" align-self="start">
    <b-row>
      <b-input-group :prepend="$t('Username')" class="mt-3 fixedPrepend">
        <b-form-input v-model="login"></b-form-input>
      </b-input-group>
      <b-input-group :prepend="$t('Password')" class="mt-3 fixedPrepend">
        <b-form-input type="password" v-model="password"></b-form-input>
      </b-input-group>
      <b-button variant="info" class="actionButton" @click="accountLogin()">{{ $t('Login') }}</b-button>
      <b-button variant="info" class="actionButton" @click="accountCreate()">{{ $t('Create') }}</b-button>
    </b-row>

    <b-alert
      :show="typeof alertContent!=='undefined'&&alertContent.length>0"
      variant="danger"
      class="customizedAlert"
      @dismissed="alertContent=''"
      dismissible
    >{{alertContent}}</b-alert>
  </b-container>
</template>


<script>
import { fetchJSON, handleSave } from "../js/utils/helpers.js";
export default {
  mixins: [handleSave(['login'])],
  data() {
    return {
      login: "admin",
      password: "test",
      alertContent: ""
    };
  },
  methods: {
    accountLogin: async function() {
      this.alertContent = "";
      const result = await fetchJSON("/api/user/login", "post", {
        login: this.login,
        password: this.password
      });
      this.alertContent = result.errorMessage;
      console.log(result);
      if (!result.error) this.$router.push("/");
    },
    accountCreate: async function() {
      this.alertContent = "";
      const result = await fetchJSON("/api/user/create", "post", {
        login: this.login,
        password: this.password
      });
      this.alertContent = result.errorMessage;
      console.log(result, this.alertContent);
      if (!result.error) this.$router.push("/");
    }
  }
};
</script>