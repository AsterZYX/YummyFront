<template>
  <div class="main-container">
    <md-tabs class="md-transparent" md-alignment="centered" @md-changed="changeTab">
      <md-tab id="1" md-label="新订单"></md-tab>
      <md-tab id="7" md-label="取消订单"></md-tab>
    </md-tabs>
    <div class="list-container">
      <shop-order v-for="(item, index) in orderList" :orderInfo="item" :key="index" :orderNum="index" @changeList="changeNewList"></shop-order>
    </div>
  </div>
</template>

<script>
    import ShopOrder from "../../components/order/ShopOrder";
    export default {
      components: {ShopOrder},
      name: "handle-order",
      data() {
        return {
          activeTab: '1',
          orderList: []
        }
      },
      methods: {
        initOrderList: function () {
          this.$ajax.get('/order/list/shop', {
            params: {
              code: this.$store.getters.identifyCode,
              state: 1
            }
          }).then((response) => {
            let data = response.data;
            if (data.code === 0){
              this.orderList = data.data;
            }
          })
        },
        changeTab: function (val) {
          this.activeTab = val;
          this.$ajax.get('/order/list/shop', {
            params: {
              code: this.$store.getters.identifyCode,
              state: val
            }
          }).then((response) => {
            let data = response.data;
            if (data.code === 0){
              this.orderList = data.data;
            }
          })
        },
        changeNewList: function (id) {
          let orderItem = this.orderList.find(item => item.id === id);
          if (orderItem) {
            let index = this.orderList.indexOf(orderItem);
            this.orderList.splice(index, 1);
          }
        }
      },
      created() {
        this.initOrderList();
      }
    }
</script>

<style lang="stylus" scoped>
  .main-container
    width 70%
    height 100%
    margin 0 auto
    background-color white
  .list-container
    padding-top 50px
    padding-left 245px
    padding-right 245px
    width 100%
</style>
