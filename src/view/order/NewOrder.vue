<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">receipt</md-icon>
      <span class="form-title-text">订单详情</span>
    </div>
    <md-button class="back-button" @click="$router.go(-1)">返回</md-button>
    <div class="form-content">
      <div class="status-container">
        <el-steps :active="2" align-center>
          <el-step title="选择商品"></el-step>
          <el-step title="确认订单信息"></el-step>
          <el-step title="成功提交订单"></el-step>
        </el-steps>
      </div>
      <div class="order-main-container">
        <md-table v-model="cart" md-sort="name" md-sort-order="asc" @md-selected="onSelect" :md-selected-value.sync="selected" md-card md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <div class="logo">
                <img :src="getAvatar" alt="Cover">
              </div>
              <div class="md-title shop-title">{{cartName}}</div>
              <!--<div class="order-id">-->
                <!--<span>订单号</span>-->
                <!--<span>2103926540410759213</span>-->
              <!--</div>-->
            </div>
          </md-table-toolbar>

          <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
            <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>

            <div class="md-toolbar-section-end">
              <md-button class="md-icon-button" @click="deleteCartProduct">
                <md-icon>delete</md-icon>
              </md-button>
            </div>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="multiple">
            <md-table-cell md-label="菜品名称" md-sort-by="name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="数量" md-sort-by="num">
              <el-input-number class="dish-num" v-model="item.quantity" :min="0" @click.stop />
            </md-table-cell>
            <md-table-cell md-label="小计（元）" md-sort-by="price">{{ item.price*item.quantity }}</md-table-cell>
          </md-table-row>
        </md-table>

        <md-card class="price-container">
          <div class="price-main">
            <span class="price-label">合计： ￥</span>
            <span v-show="discount !== 0" style="text-decoration: line-through; margin-right: 10px">{{totalPrice}}</span>
            <span class="price-text">{{getTotalPrice}}</span>
          </div>
        </md-card>

        <md-card class="distribute-info-container">
          <md-card-header class="info-header">
            <md-icon class="store-icon">store</md-icon>
            <span class="store-text">配送信息</span>
            <div v-show="address && Object.keys(address).length !== 0" style="float: right">
              <span>预计送达所需时间</span>
              <span style="color: #C9A990">{{time}} 分钟</span>
            </div>
          </md-card-header>
          <md-card-content>
            <md-card v-show="!address || Object.keys(address).length === 0" class="empty-card" md-with-hover>
              <md-ripple>
                <md-card-content class="empty-card-container" @click.native="showDialog = true">
                  <md-icon class="empty-card-icon">add</md-icon>
                  <strong>选择配送地址</strong>
                </md-card-content>
              </md-ripple>
            </md-card>
            <address-card v-show="address && Object.keys(address).length !== 0" :addressInfo="address" :show-button.sync="showButton" @click.native="showDialog = true"></address-card>
          </md-card-content>
        </md-card>

        <md-button class="submit-button" @click="submitOrder">提交订单</md-button>
      </div>
    </div>

    <md-dialog class="address-selector" :md-active.sync="showDialog">
      <md-dialog-title>选择地址</md-dialog-title>
      <md-dialog-content class="address-container">
        <address-card v-for="(item, index) in addressList" :addressInfo="item" :show-button.sync="showButton" :key="index" @click.native="changeAddress(item)"></address-card>
        <div v-for="(item,index) in empty" :key="index" class="empty"></div>
      </md-dialog-content>
    </md-dialog>

    <md-dialog-confirm
      :md-active.sync="active"
      md-title="您确定要支付订单吗?"
      md-content="若不立即支付，请在15分钟内支付订单，否则订单会被关闭"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-cancel="cancelPay"
      @md-confirm="confirmPay" />

    <div id="map-container" style="display: none"></div>
  </div>
</template>

<script>
  import '../../components/user/AddressCard'
  import AddressCard from "../../components/user/AddressCard";
  import AMap from 'AMap';

  const toLower = text => {
    return text.toString().toLowerCase()
  };

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.name).includes(toLower(term)))
    }

    return items
  };

  export default {
    components: {AddressCard},
    name: "new-order",
    data() {
      return {
        search: null,
        selected: [],
        showButton: false,
        addressList: [],
        address: {},
        showDialog: false,
        discountList: [],
        discount: 0,
        totalPrice: 0,
        shopInfo: {},
        time: '',
        active: false,
        orderId: '',
        empty: 0
      }
    },
    methods: {
      searchOnTable () {
        this.searched = searchByName(this.dishes, this.search)
      },
      getAlternateLabel: function (count) {
        return `${count} 种菜品被选择`;
      },
      onSelect: function (items) {
        this.selected = items;
      },
      deleteCartProduct(){
        for(var i=0; i<this.selected.length; i++){
          this.$store.dispatch('deleteProduct', this.selected[i].id);
        }
        this.selected = [];
      },
      initAddressList: function () {
        this.$ajax.get('/user/address/city', {
          params: {
            email: this.$store.getters.email,
            city: this.shopInfo.city
          }
        }).then((response) => {
          let data = response.data;
          if(data.code === 0){
            this.addressList = data.data;
          }
        })
      },
      changeAddress: function (item) {
        this.address = item;
        this.showDialog = false;

        let vm = this;

        AMap.plugin('AMap.Riding', function() {
          var riding = new AMap.Riding({
            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            policy: 0
          });

          var points = [
            { keyword: vm.shopInfo.address, city: vm.shopInfo.city },
            { keyword: item.addressDisp, city: item.city }
          ];

          riding.search(points, function (status, result) {
            // 未出错时，result即是对应的路线规划方案
            if (status === 'complete'){
              vm.time = Math.round(result.routes[0].time / 60) + 15;
            } else {
              vm.time = '暂无数据';
            }
          })
        })
      },
      initDiscountList: function () {
        this.$ajax.get('/shop/discount/valid', {
          params:{
            identifyCode: this.cartId
          }
        }).then((response) => {
          let res = response.data;
          if (res.code === 0){
            this.discountList = res.data;
          } else {
            this.discountList = [];
          }
        })
      },
      initShop: function () {
        this.$ajax.get('/shop/'+this.cartId).then((response) => {
          let data = response.data;
          if(data.code === 0){
            this.shopInfo = data.data;

            this.initAddressList();
          }
        })
      },
      getGoods: function () {
        var list = [];
        for(var i=0; i< this.cart.length; i++){
          var temp = {
            goodsId: this.cart[i].id,
            num: this.cart[i].quantity,
            name: this.cart[i].name,
            price: this.cart[i].price
          };
          list.push(temp);
        }
        return list;
      },
      submitOrder: function () {
        if (this.address && this.address !== '' && this.cart && this.cart.length !== 0){
          this.$ajax.post('/order/new', {
            shopCode: this.cartId,
            userId: this.$store.getters.id,
            linkman: this.address.name,
            phone: this.address.phone,
            addressDisp: this.address.addressDisp,
            room: this.address.room,
            price: this.getTotalPrice + this.discount,
            discount: this.discount,
            itemList: this.getGoods()
          }).then((response) => {
            let data = response.data;
            if (data.code === 0){
              this.$notify({
                title: '提交成功',
                message: '订单已成功创建并等待支付',
                type: 'success',
                position: 'bottom-left'
              });
              this.orderId = data.data;
              this.active = true;
            } else if (data.code === 9){
              this.$notify.error({
                title: '提交失败',
                message: '所选商品库存不足，请重新选择',
                position: 'bottom-left'
              });
            } else if (data.code === 10){
              this.$notify.error({
                title: '提交失败',
                message: '商品信息错误',
                position: 'bottom-left'
              });
            }
          })
        }
      },
      cancelPay: function () {
        this.active = false;
        this.$store.dispatch('clearCart');
        this.$router.push('/user/order');
      },
      confirmPay: function () {
        this.active = false;
        this.$ajax.post('/order/pay', this.qs.stringify({
          id: this.orderId
        })).then((response) => {
          let data = response.data;
          if (data.code === 0){
            this.$store.dispatch('clearCart');
            this.$router.push('/user/order');
          } else if (data.code === 9){
            this.$notify.error({
              title: '用户余额不足',
              message: '请先充值后再进行支付',
              position: 'bottom-left'
            });
            this.$store.dispatch('clearCart');
            this.$router.push('/user/order');
          } else {
            this.$notify.error({
              title: '支付错误',
              message: '请重新尝试',
              position: 'bottom-left'
            });
            this.$store.dispatch('clearCart');
            this.$router.push('/user/order');
          }
        })
      }
    },
    created () {
      this.initShop();
      this.initDiscountList();
    },
    computed: {
      cart: {
        get() {
          return this.$store.state.cart.goods
        },
        set(value) {
          this.$store.commit('setGoods', value)
        }
      },
      cartName: {
        get() {
          return this.$store.state.cart.cartName
        },
        set(value){
          this.$store.commit('setName', value)
        }
      },
      cartId: {
        get() {
          return this.$store.state.cart.cartId
        },
        set(value){
          this.$store.commit('setId', value)
        }
      },
      getTotalPrice: function () {
        var total = 0.0;
        for(var i=0; i<this.cart.length; i++){
          total = total + this.cart[i].price * this.cart[i].quantity;
        }
        var list = this.discountList;
        var tempMax = 0;
        if (list && list.length !== 0){
          for( var i=0; i<list.length; i++ ){
            if (total >= list[i].spend && list[i].discount >= tempMax){
              tempMax = list[i].discount;
            }
          }
          this.discount = tempMax;
        } else {
          this.discount = 0;
        }
        this.totalPrice = total;
        return (total-this.discount);
      },
      getAvatar: function () {
        if (!this.shopInfo.avatar){
          return '../../../static/image/default-shop.png';
        } else {
          return '/shop/avatar/' + this.shopInfo.identifyCode + '/' + this.shopInfo.avatar;
        }
      }
    },
    watch: {
      cartId(newVal, oldVal){
        if (newVal !== oldVal) {
          if (newVal){
            this.$ajax.get('/shop/discount/valid', {
              params:{
                identifyCode: newVal
              }
            }).then((response) => {
              let res = response.data;
              if (res.code === 0){
                this.discountList = res.data;
              } else {
                this.discountList = [];
              }
            });

            this.initAddressList();
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .main-container
    width 70%
    height 100%
    margin 0 auto
    background-color white
    padding 36px
    text-align left
    position relative
  .form-title-text
    font-weight bold
    font-size 20px
    text-align left
    margin-left 15px
  .form-title-icon
    font-size 34px !important
  .form-content
    width 100%
    height 73%
    padding 0 150px
  .status-container
    margin-top 45px
    padding 24px 30px
    background-color #f7f7f7
    border-radius 5px
  .order-main-container
    width 100%
    height 100%
    padding-top 30px
  .md-app-content .md-card
    margin-left  0 !important
    margin-right 0 !important
  .logo
    width 30px
    height 30px
  .order-id
    color #969696
    position absolute
    top 34px
    left 54px
  .shop-title
    font-size 17px
    font-weight bold
    margin-top -12px
  .distribute-info-container
    margin-top 30px
    padding 0  10px
    padding-top 5px
  .store-icon
    font-size 37px !important
    margin-right 15px
  .store-text
    font-size 18px
  .info-label
    font-size 16px
    margin-right 15px
  .info-text
    font-size 14px
  .info-content
    margin-bottom 8px
  .info-header
    margin-bottom 10px
  .price-container
    padding 15px
  .price-text
    color red
    font-size 23px
  .price-label
    margin-left 80%
    font-size 16px
  .back-button
    background-color #C9A990
    color white !important
    position absolute
    top 30px
    right 178px
  .distribute-info-container .md-card-content
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content flex-start
    align-items flex-start
  .submit-button
    background-color #C9A990
    color white !important
    float right
    margin 60px 0
  .empty-card
    width 280px
    height 152px
    margin-bottom 30px
  .address-container
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content flex-start
    align-items flex-start
  .empty-card-container
    height 100%
    width 100%
    display flex
    flex-direction column
    align-items center !important
    justify-content center !important
    text-align center !important
  .empty-card-icon
    font-size 65px !important
    color #C9A990 !important
  .address-selector
    width 970px
  .empty
    width 280px
    margin-bottom 30px
</style>

<style lang="stylus">
  .el-step__title
    font-size 14px !important
</style>

