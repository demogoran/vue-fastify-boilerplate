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
            <b-button variant="info" class="actionButton" @click="accountLogin()">{{ ('Login') }}</b-button>
            <b-button
              variant="info"
              class="actionButton"
              @click="accountCreate()"
            >{{ ('Create') }}</b-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { API } from "../../js/utils/api.js";
import { MixinInjector } from "../../js/utils/helpers.js";
export default {
  mixins: [
    MixinInjector.handleSave(["login"]),
    MixinInjector.addAlert()
  ],
  data() {
    return {
      login: "admin",
      password: "test",
      alertContent: ""
    };
  },
  methods: {
    async accountLogin() {
      this.alertContent = "";
      const result = await API.userLogin({
        login: this.login,
        password: this.password
      });
      this.showToastMessage(result.errorMessage);
      console.log(result);
      if (!result.error) this.$router.push("/");
    },
    async accountCreate() {
      this.alertContent = "";
      const result = await API.userCreate({
        login: this.login,
        password: this.password
      });

      result.error?
        this.showToastMessage(result.errorMessage):
        this.showToastMessage("User created", true);

      console.log(result);
      if (!result.error) this.$router.push("/");
    }
  }
};
</script>