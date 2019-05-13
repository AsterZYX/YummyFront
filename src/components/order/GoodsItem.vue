<template>
  <md-card md-with-hover>
    <md-card-media>
      <img :src="getAvatar" alt="Cover"/>
    </md-card-media>
    <md-card-content>
      <span class="goods-name">{{itemInfo.name}}</span>
      <el-tooltip placement="bottom">
        <div slot="content" class="tooltip">{{itemInfo.description}}</div>
        <p class="goods-description">{{itemInfo.description}}</p>
      </el-tooltip>
      <p class="sales">剩余 {{itemInfo.num}}</p>
      <p class="price-container">
        <span class="price-symbol">￥</span>
        <span class="price-num">{{itemInfo.price}}</span>
      </p>
    </md-card-content>
    <md-card-actions>
      <md-button class="md-icon-button md-primary add-button" @click="addGoodsToCart">
        <md-icon>add_box</md-icon>
      </md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
    export default {
        name: "goods-item",
        props: {
          itemInfo: {
            type: Object
          },
          code: {
            type: String
          },
          shopName: {
            type: String
          }
        },
        computed: {
          getAvatar: function () {
            if(this.itemInfo.avatar === null){
              return '../../../static/image/default-item.png';
            }
            else{
              return '/item/avatar/' + this.code + '/' + this.itemInfo.avatar;
            }
          }
        },
        methods: {
          addGoodsToCart: function () {
            if (this.itemInfo.num > 0) {
              if (this.code !== this.$store.getters.cartId) {
                this.$store.dispatch('changeCart', {
                  name: this.shopName,
                  cartId: this.code
                });
                this.$store.dispatch('setCartContent', []);
              }
              this.$store.dispatch('incrementProduct', {
                id: this.itemInfo.id,
                name: this.itemInfo.name,
                price: this.itemInfo.price,
                max: this.itemInfo.num
              });
              this.$notify({
                title: '添加成功',
                message: '该商品已成功添加至购物车',
                position: 'bottom-left',
                type: 'success'
              });
            } else {
              this.$notify.error({
                title: '添加失败',
                message: '该商品余量不足',
                position: 'bottom-left'
              });
            }
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .md-card
    width 400px
    height 120px
    position relative
    margin-bottom 20px
  .md-card-media
    width 120px
    height 120px
    float left
  .md-card-content
    height 120px
    width 280px
    position relative
    margin-left 120px
    overflow hidden
  .goods-name
    font-weight bold
    font-size 15px
  .goods-description
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    width 100%
    font-size 10px
    color #969696
  .tooltip
    width 250px
    font-size 13px
    line-height 20px
  .sales
    font-size 10px
    color #969696
    margin-top -2px
  .price-symbol
    font-size 10px
    color red
  .price-num
    color red
    font-size 17px
  .price-container
    margin-top 7px
  .add-button
    position absolute
    right 7px
    bottom 7px
</style>
