<template>
    <md-card class="food-card">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title title">{{goodsInfo.name}}</div>
          <div class="md-subhead color-red">￥ {{goodsInfo.price}}</div>
          <div class="md-subhead remain">剩余 {{goodsInfo.num}}</div>
        </md-card-header-text>

        <md-card-media>
          <img :src="getAvatar" alt="Food">
        </md-card-media>
      </md-card-header>

      <md-card-actions md-alignment="space-between">
        <md-button class="md-icon-button md-primary md-mini" @click="clickDeleteButton">
          <md-icon>delete_forever</md-icon>
        </md-button>
        <div>
          <md-button class="primary-button" @click="clickClearButton">沽清</md-button>
          <md-button class="sub-button" @click="clickEditButton">编辑</md-button>
        </div>
      </md-card-actions>
    </md-card>
</template>

<script>
    export default {
        name: "shop-goods",
        data() {
          return {
          }
        },
        props: {
          goodsInfo: {
            type: Object
          }
        },
        computed: {
          getAvatar: function () {
            if(!this.goodsInfo.avatar){
              return '../../../static/image/default-item.png'
            }
            else{
              return '/item/avatar/' + this.$store.getters.identifyCode + '/' + this.goodsInfo.avatar;
            }
          }
        },
        methods: {
          clickDeleteButton: function () {
            this.$emit('delete', this.goodsInfo.id, this.goodsInfo.goodsType);
          },
          clickClearButton: function () {
            this.$ajax.post('/item/clear', this.qs.stringify({
              id: this.goodsInfo.id
            })).then((response) => {
              let data = response.data;
              if( data.code === 0 ){
                this.goodsInfo.num = 0;
              }
            })
          },
          clickEditButton: function () {
            this.$emit('modify', this.goodsInfo);
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .food-card
    width 320px
    margin 4px
    display inline-block
    vertical-align top
    text-align left
    margin-bottom 30px
  .color-red
    color red !important
    font-weight bold
  .title
    font-size 16px !important
    width 190px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  .remain
    margin-top 20px
  .primary-button
    background-color #C9A990
    color white !important
  .sub-button
    background-color #ececec
</style>
