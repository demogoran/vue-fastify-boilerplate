<style lang="scss">
@import "../../styles/player.scss";
</style>

<template>
  <section class="player">
    <div class="player__rowwrap">
      <div class="container">
        <div class="player__time">
          <div class="player__timer">
            <div class="player__timer__elapsed">{{elapsed}}</div>
            <div class="player__timer__total">{{duration}}</div>
          </div>
          <div
            class="slider player__progress-bar"
            ref="trackbar"
            @click.prevent="setTrackTime($event)"
          >
            <div
              class="player__progress-bar__elapsed"
              v-bind:style="{width: `${playerInfo.elapsed/playerInfo.duration*100}%`}"
            ></div>
          </div>
        </div>

        <div class="level">
          <ul class="player__controls level-left">
            <li class="control">
              <i @click="goToTrack(-1)" class="fas fa-backward"></i>
            </li>
            <li class="control">
              <i @click="togglePlay()" :class="`fas ${!playerInfo.playing?'fa-play':'fa-pause'}`"></i>
            </li>
            <li class="control">
              <i @click="goToTrack(1)" class="fas fa-forward"></i>
            </li>
          </ul>

          <div class="player__volume level-right">
            <div class="player__volume__icon">
              <i class="fas fa-volume-up"></i>
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
import { API } from "../../js/utils/api.js";
import { MixinInjector } from "../../js/utils/helpers.js";
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
    MixinInjector.extendGlobalState("playercomponent"),
    MixinInjector.handleSave(["trackVolume"], "playercomponent"),
    MixinInjector.getLoadedComponents("playercomponent")
  ],
  data() {
    return {
      playerInfo: {
        duration: 0,
        elapsed: 0,
        playing: false,
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
      console.log(this.$refs.audioPlayer.volume);
    },

    goToTrack(step) {
      const tracksAmount = +this.globalState.audioInfo?.Tracks?.length || 0;
      const maxIndex = tracksAmount - 1;
      let newIndex = this.globalState.currentIndex + step;
      if (newIndex < 0) newIndex = maxIndex;
      if (newIndex > maxIndex) newIndex = 0;

      this.globalState.currentIndex = newIndex;
      this.$refs.audioPlayer.pause();
      this.togglePlay(newIndex);
    },

    setTrackTime(event) {
      this.$refs.audioPlayer.currentTime =
        (event.offsetX / this.$refs.trackbar.clientWidth) *
        this.$refs.audioPlayer.duration;
    },

    async togglePlay(currentIndex) {
      if (!this.playerInfo.currentTrack && !currentIndex) {
        currentIndex = 0;
        this.globalState.currentIndex = currentIndex;
      }
      if (Number.isInteger(currentIndex)) {
        try {
          const item = this.globalState.audioInfo?.Tracks[currentIndex];
          let trackData;
          if(!item.isTracker){
            const response = await API.musicGetInfo({
              ids: [item.id]
            });
            trackData = response.result[0];
          }
          else{
            this.playerInfo.title = item.shortname;
            this.playerInfo.currentTrack = item.permalink_url;
          }

          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: this.playerInfo.title,
              artist: this.playerInfo.artist
            });
          }
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
    this.changeVolume(this.trackVolume);

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        this.togglePlay();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        this.togglePlay();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        this.goToTrack(-1);
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        this.goToTrack(1);
      });
    }
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