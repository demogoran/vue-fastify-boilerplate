<style lang="scss">
@import "../../styles/main.scss";
</style>


<template>
  <section>
    <b-field>
      <b-input type="search" icon="magnify" v-model="searchStr"></b-input>
      <p class="control">
        <button class="button is-primary" variant="info" @click="search()">{{ ('Search') }}</button>
        <button class="button is-primary" variant="info" @click="searchTracker()">{{ ('Search tracker') }}</button>
      </p>
    </b-field>
    <p class="control">
      <button class="button is-primary" variant="info" @click="download()">{{ ('Download') }}</button>
    </p>
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
          :selected.sync="audioInfo.Tracks[globalState.currentIndex]"
          selectable
          :checked-rows.sync="checkedRows"
          checkable
          :is-row-checkable="()=>contentTabKey==='Tracks'"
          @select="(item)=>{setCurrent(item, contentTabKey);}"
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

    <a href='#' @click.prevent="$router.push('/test')">Test</a>
  </section>
</template>


<script>
import JSZip from 'jszip';
import { API } from "../../js/utils/api.js";
import { MixinInjector } from "../../js/utils/helpers.js";

const zip = new JSZip();

const sortByImage = (a, b) => {
  if (!a.artwork_url) return 1;
  if (!b.artwork_url) return -1;
  return 0;
};

export default {
  mixins: [
    MixinInjector.handleSave(["audioInfo", "searchStr", "cachedUrls"], 'mainpage'),
    MixinInjector.extendGlobalState("mainpage"),
    MixinInjector.getLoadedComponents("mainpage"),
    MixinInjector.addWebSocket()],
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
      selected: null,
      checkedRows: []
    };
  },
  methods: {
    async search() {
      const response = await API.musicSearch({
        q: this.searchStr,
        socketToken: this.socketToken
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

    async searchTracker() {
      const response = await API.musicSearch({
        q: this.searchStr,
        type: 'tracker',
        socketToken: this.socketToken
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
      this.activeTab = 0;
    },

    async loadPlaylist(item){
      console.log(item);
      if(item.type!=='tracker'){
        this.audioInfo.Tracks = item.tracks;
        return;
      }

      const response = await API.musicTrackerTracks({
        id: item.id,
      });

      console.log(response.result);
      this.audioInfo = {
        Tracks: response.result,
        People: this.audioInfo.People,
        Playlists: this.audioInfo.Playlists
      };
    },

    async setCurrent(item, contentTabKey) {
      if(contentTabKey==='Playlists'){
        this.loadPlaylist(item);
        return;
      }
      if(contentTabKey!=='Tracks') return;
      const id = item.id;
      if (!id) return;

      this.globalState.currentIndex = this.audioInfo.Tracks.findIndex(x=>x.id===item.id);
    },

    async download(){
      const isTracker = this.checkedRows[0]?.isTracker;
      let fileUrls = [];
      if(!isTracker){
        const ids = this.checkedRows.map(x=>x.id);
        const response = await API.musicGetInfo({ids});
        fileUrls = response.result;
      }
      else{
        const magnet = this.checkedRows[0].magnet;
        const zipBlob = await API.musicTrackerDownload({
          fileList: this.checkedRows.map(x=>({
            name: x.shortname,
            path: x.title
          })),
          magnet
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = "result.zip";
        link.click();
        link.remove();
        return;
      }
    },

    imgFallback(event) {
      event.target.src = "img/notfound.jfif";
    },

    toggle(row) {
      this.$refs.table.toggleDetails(row);
    }
  },
  watch: {
    audioInfo(newValue){
      this.globalState.audioInfo = newValue;
    }
  },
  mounted() {
    Object.assign(this.globalStateWatch, {
      currentIndex: newValue => this.$forceUpdate()
    });


    this.socket.onmessage = msg => {
      try{
        const data = JSON.parse(msg.data);
        if(this.searchStr === data.type){
          console.log(data);

          const kinds = data?.data;
          this.audioInfo = {
            Tracks: kinds.track.sort(sortByImage),
            People: kinds.user.sort(sortByImage),
            Playlists: kinds.playlist.sort(sortByImage)
          };
        }
      }
      catch(ex){
        console.log("Error", ex);
      }
    };
  },
};
</script>