<template>
  <md-card class="card" md-with-hover>
    <md-card-media class="media">
      <img class="shop-img" :src="getAvatar"/>
    </md-card-media>

    <md-card-header>
      <div class="md-title title">{{shopInfo.name}}
        <md-tooltip md-direction="top">{{shopInfo.name}}</md-tooltip>
      </div>
      <div class="md-subhead">{{shopInfo.shopType}}</div>
    </md-card-header>

    <md-card-content>
      <div class="location">
        <md-icon>location_on</md-icon>
        <span>{{shopInfo.address}}</span>
      </div>
    </md-card-content>

    <md-card-actions>
      <md-button class="detail-button" @click="clickDetailButton">详细</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
    export default {
        name: "shop-card",
        props: {
          shopInfo: {
            type: Object
          }
        },
        data() {
          return {
          }
        },
        methods: {
          clickDetailButton: function () {
            localStorage.setItem('shopCode', this.shopInfo.identifyCode);
            this.$router.push('/shop/detail');
          }
        },
        computed: {
          getAvatar: function () {
            if (this.shopInfo.avatar){
              return '/shop/avatar/'+ this.shopInfo.identifyCode +'/'+ this.shopInfo.avatar;
            } else {
              return '../../../static/image/default-shop.png';
            }
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .card
    width 300px
    height 386px
    margin 12px
  .card:nth-child(4n)
    margin-right 0
  .card:nth-child(4n+1)
    margin-left 0
  .media
    height 180px
    width 100%
    display flex
    justify-content center
    align-items center
    overflow hidden
  .shop-img
    width 150px
  .md-title, .md-subhead, .md-card-content
    text-align left
  .title
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  .location
    height 46px
    overflow hidden
    text-overflow ellipsis
  .detail-button
    background-color #C9A990
    color white !important
  .md-card-actions
    padding 16px
    padding-top 0
</style>
