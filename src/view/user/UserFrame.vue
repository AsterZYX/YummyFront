<template>
  <div class="page-container">
    <md-app class="main-container" md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon class="toolbar">menu</md-icon>
        </md-button>
        <span class="md-title toolbar">Yummy</span>
        <div class="md-toolbar-section-end">
          <md-menu md-size="small" md-align-trigger>
            <md-button class="md-icon-button" md-menu-trigger>
              <md-icon class="toolbar">more_vert</md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item @click="$router.push('/user/data'); dialogShow = false">
                <md-icon class="sub-menu">person</md-icon>
                <span class="sub-menu-text">个人中心</span>
              </md-menu-item>
              <md-menu-item @click="$store.commit('logout'); $router.push('/')">
                <md-icon style="color: red" class="sub-menu">power_settings_new</md-icon>
                <span class="sub-menu-text">退出登录</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
      </md-app-toolbar>

      <md-app-drawer class="drawer my-drawer" :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          <md-avatar class="md-avatar-icon md-large md-accent">
            <img :src="getUserAvatar" alt="A" />
          </md-avatar>
        </md-toolbar>
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="name-container">{{$store.getters.username}}</span>
        </md-toolbar>

        <md-divider />

        <md-list class="menu-list" :md-expand-single="expandSingle">
          <md-list-item @click="$router.push('/user/list'); menuVisible = false; dialShow = true;">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">网站首页</span>
          </md-list-item>

          <md-list-item md-expand :md-expanded.sync="expandNews">
            <md-icon>account_box</md-icon>
            <span class="md-list-item-text">我的资料</span>

            <md-list class="menu-list" slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/user/data'); menuVisible = false; dialShow = false;">个人资料</md-list-item>
              <md-list-item class="md-inset" @click="$router.push('/user/address'); menuVisible = false; dialShow = false;">地址管理</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item md-expand>
            <md-icon>account_balance</md-icon>
            <span class="md-list-item-text">我的资产</span>

            <md-list class="menu-list" slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/user/balance'); menuVisible = false; dialShow = false;">账户余额</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item md-expand>
            <md-icon>receipt</md-icon>
            <span class="md-list-item-text">我的订单</span>

            <md-list class="menu-list" slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/user/order'); menuVisible = false; dialShow = false;">所有订单</md-list-item>
            </md-list>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content class="content">

        <router-view />

      </md-app-content>

    </md-app>

    <el-popover
      placement="left"
      width="500"
      trigger="click"
      transition="el-zoom-in-bottom"
      @show="handleShow"
      @hide="handleHide"
      v-show="dialShow && !menuVisible">
      <div class="pop">
        <div class="pop-title">
          <md-icon>shopping_cart</md-icon>
          <span>购物车</span>
        </div>
        <md-content v-show="cart.length !== 0">
          <md-table v-model="cart" md-card @md-selected="onSelect" :md-selected-value.sync="selected" md-fixed-header>
            <md-table-toolbar>
              <h1 class="md-title">{{cartName}}</h1>
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
              <md-table-cell md-label="菜品名称" md-sort-by="name" style="width: 168px">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="数量" md-sort-by="quantity" style="width: 174px">
                <el-input-number class="dish-num" v-model="item.quantity" :min="0" :max="item.max" @change="watchDishNum(item.id, item.quantity)"/>
              </md-table-cell>
              <md-table-cell md-label="价格" md-sort-by="price" style="width: 64px">{{ item.price*item.quantity }}</md-table-cell>
            </md-table-row>
          </md-table>
          <md-card>
            <md-card-content class="pop-price">
              <span>总价：</span>
              <span>￥</span>
              <span v-show="discount !== 0" style="text-decoration: line-through; margin-right: 4px">{{totalPrice}}</span>
              <span style="color: red; font-size: 24px">{{getTotalPrice}}</span>
            </md-card-content>
          </md-card>
        </md-content>
        <md-content v-show="cart.length === 0">
          <md-empty-state
            class="md-primary"
            md-icon="add_shopping_cart"
            md-label="购物车是空的"
            md-description="赶紧去选购吧">
          </md-empty-state>
        </md-content>
      </div>
      <md-speed-dial slot="reference" id="dial" md-event="click" class="md-bottom-right">
        <md-speed-dial-target>
          <md-icon>shopping_cart</md-icon>
        </md-speed-dial-target>

        <md-speed-dial-content>
          <md-button class="md-icon-button" @click="clearCartAll">
            <md-icon>remove_shopping_cart</md-icon>
            <md-tooltip md-direction="top">清空购物车</md-tooltip>
          </md-button>

          <md-button class="md-icon-button" @click="payCart" :disabled="cart.length === 0">
            <md-icon>payment</md-icon>
            <md-tooltip md-direction="top">结算购物车</md-tooltip>
          </md-button>
        </md-speed-dial-content>
      </md-speed-dial>
    </el-popover>
  </div>
</template>

<script>
    export default {
        name: "user-frame",
        data() {
          return {
            menuVisible: false,
            expandNews: false,
            expandSingle: false,
            dialShow: true,
            selected: [],
            discount: 0,
            totalPrice: 0,
            discountList: []
          }
        },
        created() {
        },
        mounted() {
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
          getUserAvatar: function () {
            if(this.$store.getters.avatar === null || this.$store.getters.avatar === '') {
              return '../../../static/image/default_avatar.png';
            } else {
              return '/user/avatar/'+ this.$store.getters.id +'/' + this.$store.getters.avatar;
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
          }
        },
        methods: {
          handleHide: function () {
            var t = setTimeout(function () {
              var dial = document.getElementById('dial');
              if (dial.classList.contains('md-active')) {
                dial.classList.remove('md-active');
              }
            }, 5);
          },
          handleShow: function () {
            var t = setTimeout(function () {
              var dial = document.getElementById('dial');
              if (!dial.classList.contains('md-active')) {
                dial.classList.add('md-active');
              }
            }, 5);
          },
          onSelect: function (items) {
            this.selected = items;
          },
          getAlternateLabel: function (count) {
            return `${count} 种菜品被选择`;
          },
          payCart: function () {
            if( this.cart.length !== 0){
              this.$router.push('/order/new');
            }
          },
          clearCartAll: function () {
            this.$store.dispatch('clearCart');
          },
          deleteCartProduct: function(){
            for(var i=0; i<this.selected.length; i++){
              this.$store.dispatch('deleteProduct', this.selected[i].id);
            }
            this.selected = [];
          },
          watchDishNum: function (id, quantity) {
            if (quantity === 0){
              this.$store.dispatch('deleteProduct', id);
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
                })
              }
            }
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .page-container
    height 100%
    width 100%
    display flex
  .main-container
    height 100%
    width 100%
  .drawer
    width 200px
  .toolbar
    color white !important
  .sub-menu
    margin-right 8px !important
    font-size 20px !important
  .my-drawer
    padding-top 20px
  .name-container
    width 100%
    text-align center
    font-size 20px
  .sub-menu-text
    font-size 11px
  .content
    background-color #f7f7f7
  .pop
    height 500px
  .pop-container
    max-width 100%
    max-height 476px
    overflow auto
  .menu-list
    padding 0
  .md-content
    padding-top 10px
    height 100%
  .md-table
    height 400px
    width 100% !important
  .pop .md-card
    box-shadow none
  .dish-num
    width 120px
  .pop-price
    text-align right
  .md-empty-state
    height 100%
  .md-table table
    width 100% !important
</style>

<style lang="stylus">
  .md-table table
    width 100% !important
</style>
