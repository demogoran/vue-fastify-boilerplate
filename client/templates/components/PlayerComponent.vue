<style lang="scss">
@import "../../styles/player.scss";
</style>

<template>
  <section class="player">
    <div class="player__rowwrap">
      <div class="player__time">
        <div class="player__timer">
          <div class="player__timer__elapsed">{{elapsed}}</div>
          <div class="player__timer__total">{{duration}}</div>
        </div>
        <div class="slider player__progress-bar">
          <input
            type="range"
            :value="playerInfo.elapsed"
            :max="playerInfo.duration"
            @mousedown="isDraggingRange=true"
            @mouseup="isDraggingRange=false; $refs.audioPlayer.currentTime=$event.target.value;"
          >
        </div>
      </div>

      <ul class="player__controls">
        <li
          class="control control--small"
          v-bind:class="{
                    'control--active' : playerInfo.repeat,
                    'control--dimmed' : !playerInfo.repeat
                }"
          @click="toggleRepeat"
        >
          <svg class="icon" viewBox="0 0 100 100">
            <use xlink:href="client/img/buttonsSet.svg#repeat"></use>
          </svg>
        </li>
        <li class="control" @click="goToTrack(-1)">
          <svg class="icon" viewBox="0 0 100 100">
            <use xlink:href="client/img/buttonsSet.svg#skip-back"></use>
          </svg>
        </li>
        <li class="control control--outlined">
          <svg class="icon" viewBox="0 0 100 100" @click="togglePlay()" v-if="!playerInfo.playing">
            <use xlink:href="client/img/buttonsSet.svg#play"></use>
          </svg>
          <svg class="icon" viewBox="0 0 100 100" @click="togglePlay()" v-if="playerInfo.playing">
            <use xlink:href="client/img/buttonsSet.svg#pause"></use>
          </svg>
        </li>
        <li class="control" @click="goToTrack(1)">
          <svg class="icon" viewBox="0 0 100 100">
            <use xlink:href="client/img/buttonsSet.svg#skip-forward"></use>
          </svg>
        </li>
        <li
          class="control control--small"
          v-bind:class="{
                    'control--active' : playerInfo.shuffle,
                    'control--dimmed' : !playerInfo.shuffle
                }"
          @click="toggleShuffle"
        >
          <svg class="icon" viewBox="0 0 100 100">
            <use xlink:href="client/img/buttonsSet.svg#shuffle"></use>
          </svg>
        </li>
      </ul>

      <div class="player__volume">
        <div class="player__volume__icon">
          <svg class="icon" viewBox="0 0 100 100">
            <use xlink:href="client/img/buttonsSet.svg#volume"></use>
          </svg>
        </div>
        <div class="slider slider--volume player__volume__slider">
          <input
            type="range"
            max="100"
            :value="trackVolume"
            @input="changeVolume(+$event.target.value)"
          >
        </div>
      </div>
    </div>

    <h1 class="player__title" v-text="playerInfo.title"></h1>

    <div class="hide">
      <audio
        :src="playerInfo.currentTrack"
        controls="controls"
        class="hide"
        ref="audioPlayer"
        autoplay
        @play="playerInfo.playing=true"
        @pause="playerInfo.playing=false"
        @timeupdate="onTimeUpdate($event)"
        @ended="goToTrack(1)"
      ></audio>
    </div>
  </section>
</template>


<script>
import {
  fetchJSON,
  extendGlobalState,
  handleSave
} from "../../js/utils/helpers.js";
const sortByImage = (a, b) => {
  if (!a.artwork_url) return 1;
  if (!b.artwork_url) return -1;
  return 0;
};
const formatTime = secs => {
  secs = secs || 0;
  let minutes = Math.floor(secs / 60),
    seconds = Math.floor(secs % 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
};

export default {
  mixins: [
    extendGlobalState("playercomponent"),
    handleSave(["trackVolume"], "playercomponent")
  ],
  data() {
    return {
      playerInfo: {
        duration: 0,
        elapsed: 0,
        playing: false,
        repeat: false,
        shuffle: false,
        title: "",
        album: "",
        artist: "",
        currentTrack: ""
      },
      trackVolume: 100,
      isDraggingRange: false
    };
  },
  methods: {
    onTimeUpdate($event) {
      if (!this.isDraggingRange) {
        this.playerInfo.elapsed = $event.target.currentTime;
        this.playerInfo.duration = $event.target.duration;
      }
    },

    changeVolume(newValue) {
      this.trackVolume = newValue;
      this.$refs.audioPlayer.volume = this.trackVolume / 100;
    },

    goToTrack(step) {
      const tracksAmount = +this.globalState.audioInfo?.Tracks?.length || 0;
      const maxIndex = tracksAmount - 1;
      let newIndex = this.globalState.currentIndex + step;
      if (newIndex < 0) newIndex = maxIndex;
      if (newIndex > maxIndex) newIndex = 0;

      this.globalState.currentIndex = newIndex;
      this.togglePlay(newIndex);
    },

    toggleRepeat() {},

    toggleShuffle() {},

    async togglePlay(currentIndex) {
      if (!this.playerInfo.currentTrack && !currentIndex) {
        currentIndex = 0;
        this.globalState.currentIndex = currentIndex;
      }
      if (Number.isInteger(currentIndex)) {
        try {
          const item = this.globalState.audioInfo?.Tracks[currentIndex];
          const response = await fetchJSON("/api/music/trackinfo", "post", {
            ids: [item.id]
          });
          const trackData = response.result[0];
          this.playerInfo.title = trackData.name;
          this.playerInfo.currentTrack = trackData.url;
          return;
        } catch (ex) {
          console.log(ex);
        }
      }

      if (this.playerInfo.playing) {
        this.$refs.audioPlayer.pause();
      } else {
        this.$refs.audioPlayer.play();
      }
    }
  },
  mounted() {
    Object.assign(this.globalStateWatch, {
      currentIndex: newValue => this.togglePlay(newValue)
    });
  },
  computed: {
    duration() {
      return formatTime(this.playerInfo.duration);
    },
    elapsed() {
      return formatTime(this.playerInfo.elapsed);
    }
  }
};
</script>