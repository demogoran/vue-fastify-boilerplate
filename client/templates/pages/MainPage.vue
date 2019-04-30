<style lang="scss">
@import "../../styles/main.scss";
</style>


<template>
  <section>
    <div class="block">
      <audio :src="currentTrack" controls="controls" autoplay></audio>
    </div>
    <b-field>
      <b-input type="search" icon="magnify" v-model="searchStr"></b-input>
      <p class="control">
        <button class="button is-primary" variant="info" @click="search()">{{ $t('Search') }}</button>
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
          :selected.sync="selected"
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
  <!-- <b-container class="playerContainer">
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
      <audio :src="currentTrack" controls="controls" autoplay></audio>
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
              :class="`flex-column align-items-start playerRow ${selectedIndexes[contentTabKey]===index?'active': ''}`"
              v-for="(item, index) in contentTabValue"
              v-bind:key="index"
              @click.prevent="playCurrent(item.id, contentTabKey, index)"
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
  </b-container>-->
</template>


<script>
import { fetchJSON, handleSave } from "../../js/utils/helpers.js";

const sortByImage = (a, b) => {
  if (!a.artwork_url) return 1;
  if (!b.artwork_url) return -1;
  return 0;
};

export default {
  mixins: [handleSave(["audioInfo", "searchStr", "cachedUrls"], 'mainpage')],
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
      const id = item.id;
      if (!id) return;
      try {
        const response = await fetchJSON("/api/music/trackinfo", "post", {
          ids: [id]
        });
        this.currentTrack = response.result[0].url;
        this.$store.dispatch('callCurrentTrack', this.currentTrack);
        this.selected = item;
      } catch (ex) {
        console.log(ex);
      }
    },
    imgFallback(event) {
      event.target.src = "img/notfound.jfif";
    }
  }
};
</script>