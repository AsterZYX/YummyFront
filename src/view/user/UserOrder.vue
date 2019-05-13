<template>
  <div class="main-container">
    <md-tabs class="md-transparent" md-alignment="centered" @md-changed="checkNewTab">
      <md-tab id="0" md-label="等待中"></md-tab>
      <md-tab id="2" md-label="配送中"></md-tab>
      <md-tab id="3" md-label="已完成"></md-tab>
      <md-tab id="4" md-label="已过期"></md-tab>
      <md-tab id="5" md-label="已退订"></md-tab>
    </md-tabs>
    <div class="list-container">
      <common-order v-for="(item, index) in orderList" :orderInfo="item" :key="item.id" @expire="setExpiredOrder" @pay="payOrder" @done="setDoneOrder" @cancel="setCancelOrder"></common-order>
    </div>
    <md-dialog-confirm
      :md-active.sync="showPayDialog"
      md-title="您确定要支付订单吗?"
      md-content="若不立即支付，请在15分钟内支付订单，否则订单会被关闭"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-cancel="cancelPay"
      @md-confirm="confirmPay" />
  </div>
</template>

<script>
    import '../../components/order/CommonOrder'
    import CommonOrder from "../../components/order/CommonOrder";
    export default {
      components: {CommonOrder},
      name: "user-order",
      data() {
        return {
          orderList: [],
          activeTab: '0',
          showPayDialog: false,
          payId: 0
        }
      },
      methods: {
        initOrderList: function () {
          this.$ajax.get('order/list/wait', {
            params: {
              id: this.$store.getters.id
            }
          }).then((response) => {
            let data = response.data;
            if (data.code === 0){
              this.orderList = data.data;
            }
          })
        },
        checkNewTab: function (val) {
          this.activeTab = val;
          if (val === '0'){
            this.initOrderList();
          } else if (val === '3'){
            this.$ajax.get('order/list/done', {
              params: {
                id: this.$store.getters.id
              }
            }).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.orderList = data.data;
              }
            })
          } else if (val === '2') {
            this.$ajax.get('order/list/distribute', {
              params: {
                id: this.$store.getters.id
              }
            }).then((response) => {
              let data = response.data;
              if (data.code === 0) {
                this.orderList = data.data;
              }
            })
          } else if (val === '5') {
            this.$ajax.get('order/list/cancel', {
              params: {
                id: this.$store.getters.id
              }
            }).then((response) => {
              let data = response.data;
              if (data.code === 0) {
                this.orderList = data.data;
              }
            })
          } else {
            this.$ajax.get('order/list', {
              params: {
                id: this.$store.getters.id,
                state: val
              }
            }).then((response) => {
              let data = response.data;
              if (data.code === 0) {
                this.orderList = data.data;
              }
            })
          }
        },
        setExpiredOrder: function (orderInfo) {
          if (this.activeTab === 0 || this.activeTab === '0'){
            let orderItem = this.orderList.find(item => item.id === orderInfo.id);
            let index = this.orderList.indexOf(orderItem);
            this.orderList.splice(index, 1);
          } else if (this.activeTab === 4 || this.activeTab === '4'){
            this.orderList.push(orderInfo);
          }
        },
        setDoneOrder: function (orderInfo) {
          if (this.activeTab === 2 || this.activeTab === '2'){
            let orderItem = this.orderList.find(item => item.id === orderInfo.id);
            let index = this.orderList.indexOf(orderItem);
            this.orderList.splice(index, 1);
          } else if (this.activeTab === 3 || this.activeTab === '3'){
            this.orderList.push(orderInfo);
          }
        },
        setCancelOrder: function (orderInfo) {
          let orderItem = this.orderList.find(item => item.id === orderInfo.id);
          if (orderItem) {
            let index = this.orderList.indexOf(orderItem);
            this.orderList.splice(index, 1);
          }
          if (this.activeTab === 5 || this.activeTab === '5'){
            this.orderList.push(orderInfo);
          }
        },
        payOrder: function (id) {
          this.payId = id;
          this.showPayDialog = true;
        },
        cancelPay: function () {
          this.showPayDialog = false;
          this.payId = 0;
        },
        confirmPay: function () {
          this.showPayDialog = false;
          this.$ajax.post('/order/pay', this.qs.stringify({
            id: this.payId
          })).then((response) => {
            let data = response.data;
            if (data.code === 0){
              const orderItem = this.orderList.find(item => item.id === this.payId);
              var index = this.orderList.indexOf(orderItem);
              if (this.activeTab === 0){
                this.orderList[index].orderState = 1;
              }
            } else if (data.code === 9){
              this.$notify.error({
                title: '用户余额不足',
                message: '请先充值后再进行支付',
                position: 'bottom-left'
              });
            } else {
              this.$notify.error({
                title: '支付错误',
                message: '请重新尝试',
                position: 'bottom-left'
              });
            }
          })
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
    padding-left 239px
    padding-right 239px
    width 100%
</style>
