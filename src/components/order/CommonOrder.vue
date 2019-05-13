<template>
    <md-card class="order-card" md-with-hover>
      <div class="line"></div>
      <icon-svg class="icon-order" icon-class="order1" />
      <div class="logo-container">
        <div class="logo">
          <img :src="getAvatar" alt="Cover">
        </div>
        <span>{{orderInfo.shop.name}}</span>
      </div>
      <span class="order-id-container">
        <span>订单号</span>
        <span class="order-id">{{orderInfo.orderId}}</span>
      </span>
      <span class="time-container">
        <span class="time">{{orderInfo.createTime}}</span>
      </span>
      <div class="order-content">
        {{orderInfo.itemList[0].name}}{{orderInfo.itemList[0].num}}份等{{orderInfo.itemList.length}}个菜品
      </div>
      <span class="total-price-container">
        <span>￥</span>
        <span class="total-price">{{orderInfo.price - orderInfo.discount}}</span>
      </span>
      <span class="state">{{getState}}</span>
      <md-card-actions>
        <md-button class="card-button" @click="clickDetailButton">查看详情</md-button>
        <md-button v-show="orderInfo.orderState === 0" class="card-button" @click="clickPayButton">支付订单</md-button>
        <md-button v-show="orderInfo.orderState === 2" class="card-button" @click="confirmReceipt">确认收货</md-button>
        <md-button v-show="orderInfo.orderState === 0 || orderInfo.orderState === 1 || orderInfo.orderState === 8" class="card-button" @click="cancelOrder">退订</md-button>
      </md-card-actions>
      <div class="clock-container" v-show="orderInfo.orderState === 0">
        <md-icon class="clock-icon">alarm</md-icon>
        <span class="clock-time" style="color: #c9a990">{{lastPayTime}}</span>
      </div>
    </md-card>
</template>

<script>
    export default {
        name: "common-order",
        props: {
          orderInfo: {
            type: Object
          }
        },
        data() {
          return {
            lastPayTime: '15:00',
            timer: null
          }
        },
        computed: {
          getState: function () {
            switch (this.orderInfo.orderState) {
              case 0:
                return '等待支付中';
              case 1:
                return '等待接单中';
              case 2:
                return '订单配送中';
              case 3:
                return '订单已完成';
              case 4:
                return '订单已过期';
              case 5:
                return '订单已退订';
              case 6:
                return '订单已拒绝';
              case 7:
                return '等待退订中';
              case 8:
                return '商家已接单';
            }
          },
          getAvatar: function () {
            if (!this.orderInfo.shop || !this.orderInfo.shop.avatar){
              return '../../../static/image/default-shop.png';
            } else {
              return '/shop/avatar/' + this.orderInfo.shop.identifyCode + '/' + this.orderInfo.shop.avatar;
            }
          }
        },
        methods: {
          clickDetailButton: function () {
            this.$router.push({
              path: '/order/detail',
              query: {
                orderId: this.orderInfo.id
              }
            });
          },
          computedPayTime:function () {
            let vm = this;
            let createTime = Date.parse(vm.orderInfo.createTime) / 1000;
            let endTime = createTime + 2*60;
            this.timer = setInterval(function() {
              let clientTime = Date.now() / 1000;
              let lastTime = Math.round(endTime - clientTime);
              let int_minute;
              if(lastTime > 0){
                int_minute = Math.floor(lastTime / 60);
                lastTime -= int_minute * 60;
                if (int_minute < 10 && lastTime < 10) {
                  vm.lastPayTime = '0' + int_minute + ':0' + lastTime;
                } else if (int_minute < 10 && lastTime >= 10){
                  vm.lastPayTime = '0' + int_minute + ':' + lastTime;
                } else if (int_minute >= 10 && lastTime < 10){
                  vm.lastPayTime = int_minute + ':0' + lastTime;
                } else {
                  vm.lastPayTime = int_minute + ':' + lastTime;
                }
              } else {
                vm.orderInfo.orderState = 4;
                vm.$emit('expire', vm.orderInfo);
              }
            },1000);
          },
          clickPayButton: function () {
            this.$emit('pay', this.orderInfo.id);
          },
          confirmReceipt: function () {
            this.$ajax.post('/order/receive', this.qs.stringify({
              id: this.orderInfo.id
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.orderInfo.orderState = 3;
                this.$emit('done', this.orderInfo);
              }
            })
          },
          cancelOrder: function () {
            this.$ajax.post('/order/cancel', this.qs.stringify({
              id: this.orderInfo.id
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.orderInfo.orderState = data.data*1;
                this.$emit('cancel', this.orderInfo);
              }
            })
          }
        },
        mounted() {
          if (this.orderInfo.orderState === 0) {
            this.computedPayTime();
          }
        },
        beforeDestroy(){
          if (this.timer){
            clearInterval(this.timer);
            this.timer = null;
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .order-card
    width 100%
    height 200px
    position relative
  .md-card
    margin 0
    margin-bottom 30px
  .icon-order
    font-size 45px
    position absolute
    left 22px
    top 73px
    background-color white
    height 53px
  .line
    height 100%
    width 45px
    border-right #C9A990 solid 2px
    float left
  .order-id-container
    position absolute
    left 96px
    top 92px
  .order-id, .time
    margin-left 13px
  .logo
    width 40px
    height 40px
    float left
    margin-right 20px
  .logo-container
    /*display flex*/
    /*align-items center*/
    font-weight bold
    position absolute
    left 90px
    top 19px
  .card-button
    background-color #C9A990
    color white !important
  .time-container
    position absolute
    left 136px
    top 40px
    color #969696
  .state
    position absolute
    color #C9A990
    right 28px
    top 20px
  .md-card-actions
    position absolute
    right 18px
    bottom 14px
  .order-content
    position absolute
    left 96px
    top 140px
  .total-price-container
    position absolute
    right 34px
    top 80px
  .total-price
    font-size 23px
    color red
  .clock-icon
    color #C9A990 !important
  .clock-icon
    font-size 26px !important
  .clock-time
    font-size 16px
    margin-left 8px
  .clock-container
    display flex
    align-items center
    position absolute
    top 19px
    right 129px
</style>
