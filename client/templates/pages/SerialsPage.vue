<style lang="scss">
@import "../../styles/serials.scss";
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
        v-for="(contentTabValue, contentTabKey) in serialsInfo"
        v-bind:key="contentTabKey"
        :label="contentTabKey"
        :class="{active: Object.keys(serialsInfo).indexOf(contentTabKey)===0}"
      >
        <b-table
          :data="contentTabValue"
          ref="table"
          paginated
          per-page="30"
          detailed
          detail-key="id"
          :row-class="(row) => visitedEntries[contentTabKey].indexOf(row.url)>-1?'visited':''"
          :show-detail-icon="true"
          :selected.sync="selectedIndexes[contentTabKey]"
          selectable
          @select="(item)=>{setCurrent(item, contentTabKey);}"
        >
          <template slot-scope="props">
            <b-table-column field="id" label="ID" width="40" sortable numeric>
              <a target="_blank" :href="props.row.url">{{ props.row.id }}</a>
            </b-table-column>
            <b-table-column field="title" label="Title" sortable>{{ props.row.name }}</b-table-column>
          </template>
        </b-table>
      </b-tab-item>
    </b-tabs>

    <a href="#" @click.prevent="$router.push('/test')">Test</a>
  </section>
</template>


<script>
import { API } from "../../js/utils/api.js";
import { MixinInjector } from "../../js/utils/helpers.js";

export default {
  mixins: [
    MixinInjector.handleSave(
      ["serialsInfo", "visitedEntries", "searchStr"],
      "serialspage"
    )
  ],
  data() {
    return {
      searchStr: "Друзья",
      serialsInfo: {
        Serials: [],
        Seasons: [],
        Series: []
      },
      selectedIndexes: {
        Serials: {},
        Seasons: {},
        Series: {}
      },
      visitedEntries: {
        Serials: [],
        Seasons: [],
        Series: []
      },
      activeTab: 0,
      selected: null
    };
  },
  methods: {
    async setVisited(url, key) {
      if (this.visitedEntries[key].indexOf(url) < 0) {
        const copy = { ...this.visitedEntries };
        this.visitedEntries[key].push(url);
        this.visitedEntries = copy;
      }
    },
    async search() {
      const response = await API.serialsSearch({
        q: this.searchStr
      });

      //little hack to trigger watcher
      const copy = { ...this.serialsInfo };
      console.log("copy", copy);
      copy.Serials = response?.result;
      this.serialsInfo = copy;
      this.activeTab = 1;
    },
    async getSeasons(item) {
      this.setVisited(item.url, 'Serials');
      const response = await API.serialsGetSeasons(item);

      const copy = { ...this.serialsInfo };
      copy.Seasons = response?.result;
      this.serialsInfo = copy;
      this.activeTab = 2;
    },
    async getSeries(item) {
      this.setVisited(item.url, 'Seasons');
      const response = await API.serialsGetSeries(item);

      const copy = { ...this.serialsInfo };
      copy.Series = (response?.result || []).map((item, index) => {
        item.id = index;
        return item;
      });
      this.serialsInfo = copy;
    },
    async setCurrent(item, contentTabKey) {
      if (contentTabKey === "Serials") {
        this.getSeasons(item);
        return;
      }
      if (contentTabKey === "Seasons") {
        this.getSeries(item);
        return;
      }
      this.setVisited(item.url, 'Series');

      this.$modal.open(`<video class="modalVideo" autoplay controls src="${item.url}"/>`);
    }
  }
};
</script>