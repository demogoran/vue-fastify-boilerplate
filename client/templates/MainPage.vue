<style lang="scss">
@import "../styles/main.scss";
</style>


<template>
  <b-container class="playerContainer">
    <b-row>
      <b-col>
        <h3>Player</h3>
      </b-col>
    </b-row>

    <b-row>
      <b-input-group :prepend="$t('Search track')" class="mt-3">
        <b-form-input v-model="searchStr"></b-form-input>
        <b-button variant="info" @click="search()">{{ $t('Search') }}</b-button>
      </b-input-group>
    </b-row>

    <b-row>
      <audio :src="currentTrack" controls="controls"></audio>
    </b-row>

    <b-row>
      <b-tabs pills card vertical class="playerTabs">
        <b-tab
          v-for="(contentTabValue, contentTabKey) in audioInfo"
          v-bind:key="contentTabKey"
          :title="contentTabKey"
          :class="{active: Object.keys(audioInfo).indexOf(contentTabKey)===0}"
        >
          <b-list-group>
            <b-list-group-item
              :href="item.permalink_url"
              :class="`flex-column align-items-start playerRow ${index===0?'active': ''}`"
              v-for="(item, index) in contentTabValue"
              v-bind:key="index"
              @click.prevent="playCurrent(item.permalink_url)"
            >
              <b-img
                thumbnail
                fluid
                :src="item.artwork_url"
                class="playerThumbImage"
                @error="imgFallback($event)"
              ></b-img>
              <div class="d-flex w-100 justify-content-between playerDescription">
                <h5 class="mb-1">{{item.title}}</h5>
                <small>{{(item.user?`${item.user.username}:${item.id}`:item.id)}}</small>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-tab>
      </b-tabs>
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

const sortByImage = (a, b) => {
  if (!a.artwork_url) return 1;
  if (!b.artwork_url) return -1;
  return 0;
};

export default {
  mixins: [handleSave(["audioInfo", "searchStr"])],
  data() {
    return {
      alertContent: "",
      searchStr: "Skillet",
      audioInfo: {
        Tracks: [],
        People: [],
        Playlists: []
      },
      currentTrack: null
    };
  },
  methods: {
    async search() {
      const response = await fetchJSON("/api/music/search", "post", {
        q: this.searchStr
      });
      const kinds = response?.result;
      if (response.error || !kinds) {
        console.log(response.errorMessage);
        return;
      }
      this.audioInfo = {
        Tracks: kinds.track.sort(sortByImage),
        People: kinds.user.sort(sortByImage),
        Playlists: kinds.playlist.sort(sortByImage)
      };
      console.log(this.audioInfo);
    },
    playCurrent(currentUrl) {
      if (!currentUrl) return;
      this.currentTrack = currentUrl;
    },
    imgFallback(event) {
      event.target.src = "img/notfound.jfif";
    }
  }
};
</script>