<template>
  <md-card>
    <md-card-header v-show="!showOrigin">
      <md-card-header-text>
        <div class="md-title title">{{applyInfo.newInfo.name}}</div>
        <div class="md-subhead">{{applyInfo.newInfo.shopType}}</div>
        <div class="md-subhead">{{applyInfo.newInfo.address}}</div>
      </md-card-header-text>

      <md-card-media>
        <img :src="getNewAvatar" alt="Shop">
      </md-card-media>
    </md-card-header>

    <md-card-header v-show="showOrigin">
      <md-card-header-text>
        <div class="md-title title">{{applyInfo.oldInfo.name}}</div>
        <div class="md-subhead">{{applyInfo.oldInfo.shopType}}</div>
        <div class="md-subhead">{{applyInfo.oldInfo.address}}</div>
      </md-card-header-text>

      <md-card-media>
        <img :src="getOldAvatar" alt="Shop">
      </md-card-media>
    </md-card-header>

    <md-card-actions md-alignment="space-between">
      <md-button class="md-icon-button md-primary md-mini" @click="clickSwitchButton">
        <md-icon v-show="!showOrigin">chevron_left</md-icon>
        <md-icon v-show="showOrigin">chevron_right</md-icon>
      </md-button>
      <div>
        <md-button class="accept-button" @click="passApply">通过</md-button>
        <md-button class="refuse-button" @click="refuseApply">拒绝</md-button>
      </div>
    </md-card-actions>
  </md-card>
</template>

<script>
    export default {
        name: "shop-edit-card",
        props: {
          applyInfo: {
            type: Object
          }
        },
        computed: {
          getNewAvatar: function () {
            if ( this.applyInfo.newInfo.avatar ){
              return '/shop/avatar/'+ this.applyInfo.newInfo.identifyCode +'/' + this.applyInfo.newInfo.avatar;
            } else if ( this.applyInfo.oldInfo.avatar ){
              return '/shop/avatar/'+ this.applyInfo.oldInfo.identifyCode +'/' + this.applyInfo.oldInfo.avatar;
            } else {
              return '../../../static/image/default-shop.png';
            }
          },
          getOldAvatar: function () {
            if ( this.applyInfo.oldInfo.avatar ){
              return '/shop/avatar/'+ this.applyInfo.oldInfo.identifyCode +'/' + this.applyInfo.oldInfo.avatar;
            } else {
              return '../../../static/image/default-shop.png';
            }
          }
        },
        data() {
          return {
            showOrigin: false
          }
        },
        methods: {
          clickSwitchButton: function () {
            this.showOrigin = !this.showOrigin;
          },
          passApply: function () {
            this.$ajax.post('/apply/examine', this.qs.stringify({
              id: this.applyInfo.newInfo.id,
              res: true
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.$emit('examine', this.applyInfo.newInfo.id);
              }
            })
          },
          refuseApply: function () {
            this.$ajax.post('/apply/examine', this.qs.stringify({
              id: this.applyInfo.newInfo.id,
              res: false
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.$emit('examine', this.applyInfo.newInfo.id);
              }
            })
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .md-card
    width 320px
    display inline-block
    vertical-align top
    margin-bottom 30px
  .title
    font-size 18px
    margin-top 0 !important
  .accept-button
    background-color  #C9A990
    color white !important
  .refuse-button
    background-color #ececec
</style>
