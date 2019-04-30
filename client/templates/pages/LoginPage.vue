<style lang="scss">
@import "../../styles/login.scss";
</style>


<template>
  <section class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">Login</h3>
          <p class="subtitle has-text-grey">Please login or create to proceed.</p>
          <div class="box">
            <div class="field">
              <div class="control">
                <input class="input is-large" type="text" v-model="login">
              </div>
            </div>

            <div class="field">
              <div class="control">
                <input class="input is-large" type="password" v-model="password">
              </div>
            </div>
            <b-button variant="info" class="actionButton" @click="accountLogin()">{{ $t('Login') }}</b-button>
            <b-button
              variant="info"
              class="actionButton"
              @click="accountCreate()"
            >{{ $t('Create') }}</b-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { fetchJSON, handleSave } from "../../js/utils/helpers.js";
export default {
  mixins: [handleSave(["login"])],
  data() {
    return {
      login: "admin",
      password: "test",
      alertContent: ""
    };
  },
  methods: {
    showAlert: function(message) {
      if (!message) return;
      this.$toast.open({
        duration: 5000,
        message: message,
        position: "is-bottom",
        type: "is-danger"
      });
    },
    accountLogin: async function() {
      this.alertContent = "";
      const result = await fetchJSON("/api/user/login", "post", {
        login: this.login,
        password: this.password
      });
      this.showAlert(result.errorMessage);
      console.log(result);
      if (!result.error) this.$router.push("/");
    },
    accountCreate: async function() {
      this.alertContent = "";
      const result = await fetchJSON("/api/user/create", "post", {
        login: this.login,
        password: this.password
      });

      this.showAlert(result.errorMessage);
      console.log(result);
      if (!result.error) this.$router.push("/");
    }
  }
};
</script>