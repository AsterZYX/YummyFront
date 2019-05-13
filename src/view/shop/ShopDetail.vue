<template>
  <div class="main-container">
    <div class="shop-description-container">
      <div class="logo">
        <img :src="getShopAvatar" alt="Cover">
      </div>
      <span class="logo-text">{{shopInfo.name}}</span>
    </div>
    <md-card class="type-container">
      <md-card-content>
        <a v-for="(item, index) in shopInfo.itemType" :id="getLabelId(index)" @click="clickLabel(index)" :key="index">{{item}}</a>
      </md-card-content>
    </md-card>
    <div class="menu-container">
      <div class="menu-item" v-for="(item, index) in shopInfo.itemType" :id="getContainerId(index)" :key="index">
        <div class="menu-label">{{item}}</div>
        <div class="goods-item-container">
          <goods-item v-for="(goods, goodsIndex) in shopInfo.goodsList" v-if="goods.goodsType === item" :key="goods.id" :itemInfo="goods" :code="shopInfo.identifyCode" :shopName="shopInfo.name"></goods-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import '../../components/order/GoodsItem'
    import GoodsItem from "../../components/order/GoodsItem";
    export default {
      components: {GoodsItem},
      name: "shop-detail",
        data() {
          return {
            shopInfo: {}
          }
        },
        methods: {
          getLabelId: function (index) {
            return "label-"+index;
          },
          clickLabel: function (index) {
            for(var i=0; i<this.shopInfo.itemType.length; i++){
              var temp = document.getElementById('label-'+i);
              if(temp.classList.contains('active')){
                temp.classList.remove('active');
              }
            }

            var item = document.getElementById('label-'+index);
            item.classList.add('active');

            this.goAnchor(index);
          },
          getContainerId: function (index) {
            return "container-"+index;
          },
          goAnchor: function (index) {
            let selector = '#container-'+index;
            let anchor = this.$el.querySelector(selector);
            //document.documentElement.scrollTop = anchor.offsetTop;
            let total = anchor.offsetTop;
            let main = document.getElementsByClassName('md-scrollbar')[0];

            // 平滑滚动，时长500ms，每10ms一跳，共50跳
            // 获取当前滚动条与窗体顶部的距离
            let distance = main.scrollTop;
            // 计算每一小段的距离
            let step = total/50;

            (function smoothDown () {
              if (distance < total) {
                distance += step;
                // 移动一小段
                main.scrollTop = distance;
                // 设定每一次跳动的时间间隔为10ms
                setTimeout(smoothDown, 8)
              } else {
                // 限制滚动停止时的距离
                main.scrollTop = total;
              }
            })();
          }
        },
        created() {
          var code = localStorage.getItem('shopCode');
          this.$ajax.get('/shop/'+code).then((response) => {
            let data = response.data;
            if(data.code === 0){
              this.shopInfo = data.data;
            }
          })
        },
        computed: {
          getShopAvatar: function () {
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
  .main-container
    height 100%
    width 70%
    margin 0 auto
    background-color white
    position relative
    overflow hidden
    padding 0 200px
  .logo
    width 80px
    height 80px
  .shop-description-container
    margin 0 auto
    display flex
    align-items center
    padding 20px
    margin-top 20px
    box-shadow 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)
  .logo-text
    font-size 20px
    font-weight bold
    margin-left 20px
  .type-container
    width 100%
    margin-left 0 !important
    margin-right 0 !important
    margin-top 30px !important
  .type-container a
    display inline-block
    margin 5px
    padding 3px 10px
    width 18%
    border-radius 2px
    color #666
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
    vertical-align top
    text-decoration none
    cursor pointer
  .type-container .md-card-content
    text-align left
    padding-bottom 16px
  .type-container a.active
    background-color #C9A990
    color white !important
  .menu-container
    width 100%
    text-align left
    padding 10px 0
  .menu-label
    padding 20px
    font-size 20px
    font-weight bold
  .goods-item-container
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content flex-start
    align-items flex-start
  .goods-item-container .md-card
    margin-left 0
    margin-right 0
</style>
