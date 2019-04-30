<template>
  <section class="playerBlock">
    <i class="mdi mdi-format-align-left" aria-hidden="true"></i>
    Hello from player!
    {{currentTrack}}
  </section>
</template>


<script>
import { mapState } from "Vuex";
import { handleSave } from "../js/utils/helpers.js";
const sortByImage = (a, b) => {
  if (!a.artwork_url) return 1;
  if (!b.artwork_url) return -1;
  return 0;
};

export default {
  //mixins: [handleSave([], "playercomponent")],
  data() {
    return {};
  },
  computed: {
    ...mapState(["currentTrack"])
  },
  methods: {}
};
</script>