<style lang="scss">
@import "../../styles/main.scss";
</style>


<template>
  <section>
    <b-field>
      <b-input type="search" icon="magnify" v-model="searchStr"></b-input>
      <p class="control">
        <button class="button is-primary" variant="info" @click="search()">{{ ('Search') }}</button>
      </p>
    </b-field>
    <b-tabs v-model="activeTab">
      <b-tab-item
        v-for="(contentTabValue, contentTabKey) in audioInfo"
        v-bind:key="contentTabKey"
        :label="contentTabKey"
        :class="{active: Object.keys(audioInfo).indexOf(contentTabKey)===0}"
      >
        <b-table
          :data="contentTabValue"
          ref="table"
          paginated
          per-page="30"
          :opened-detailed="defaultOpenedDetails"
          detailed
          detail-key="id"
          :show-detail-icon="true"
          :selected.sync="selectedObj"
          selectable
          @select="(item)=>{playCurrent(item, contentTabKey);}"
        >
          <template
            slot-scope="props"
            @click="toggle(props.row)">
            <b-table-column field="id" label="ID" width="40" sortable numeric>
              <a target="_blank" :href="props.row.permalink_url">{{ props.row.id }}</a>
            </b-table-column>
            <b-table-column field="title" label="Title" sortable>{{ props.row.title }}</b-table-column>
            <b-table-column field="user.username" label="User" sortable>
              {{
                (props.row.user||{}).username||''
              }}
            </b-table-column>
          </template>

          <template slot="detail" slot-scope="props">
            <article class="media">
              <figure class="media-left">
                <p class="image is-64x64">
                  <img
                    :src="props.row.artwork_url"
                    class="playerThumbImage"
                    @error="imgFallback($event)"
                  >
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ (props.row.user||{}).username || '' }}</strong>
                    <small>@{{ props.row.id || '' }}</small>
                    <div class="playControls"></div>
                  </p>
                </div>
              </div>
            </article>
          </template>
        </b-table>
      </b-tab-item>
    </b-tabs>

    <a href="test">Test</a>
  </section>
</template>


<script>
import { mapState } from "vuex";
import { fetchJSON, handleSave, extendGlobalState } from "../../js/utils/helpers.js";

const sortByImage = (a, b) => {
  if (!a.artwork_url) return 1;
  if (!b.artwork_url) return -1;
  return 0;
};

export default {
  mixins: [
    handleSave(["audioInfo", "searchStr", "cachedUrls"], 'mainpage'),
    extendGlobalState],
  data() {
    return {
      searchStr: "Skillet",
      defaultOpenedDetails: [1],
      audioInfo: {
        Tracks: [],
        People: [],
        Playlists: []
      },
      selectedIndexes: {
        Tracks: 0,
        People: 0,
        Playlists: 0
      },
      cachedUrls: {},
      activeTab: 0,
      currentTrack: null,
      selected: null
    };
  },
  methods: {
    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },
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
    },
    async playCurrent(item, contentTabKey) {
      if(contentTabKey!=='Tracks') return;
      const id = item.id;
      if (!id) return;

      this.globalState.currentIndex = this.audioInfo.Tracks.findIndex(x=>x.id===item.id);
    },
    imgFallback(event) {
      event.target.src = "img/notfound.jfif";
    }
  },
  computed:{
    selectedObj: {
      get: function () {
        console.log(this.globalState.currentIndex);
        return this.audioInfo.Tracks[this.globalState.currentIndex];
      },
      set: function (newValue) {
        this.globalState.currentIndex = this.audioInfo.Tracks.findIndex(x=>x.id===newValue.id);
      }
    }
  },
  watch: {
    audioInfo(newValue){
      this.globalState.audioInfo = newValue;
    }
  }
};
</script>