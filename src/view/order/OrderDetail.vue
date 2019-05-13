<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">receipt</md-icon>
      <span class="form-title-text">订单详情</span>
    </div>
    <md-button class="back-button" @click="$router.go(-1)">返回</md-button>
    <div class="form-content">
      <div v-show="orderInfo.orderState !== 4 && orderInfo.orderState !== 5 && orderInfo.orderState !== 6 && orderInfo.orderState !== 7" class="status-container">
        <el-steps :active="activeStep" align-center>
          <el-step title="订单已提交"></el-step>
          <el-step title="订单已支付"></el-step>
          <el-step title="商家已接单"></el-step>
          <el-step title="已送达"></el-step>
        </el-steps>
      </div>
      <div class="order-main-container">
        <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <div class="logo">
                <img :src="getAvatar" alt="Cover">
              </div>
              <div class="md-title shop-title">{{orderInfo.shop.name}}</div>
              <div class="order-id">
                <span>订单号</span>
                <span>{{orderInfo.orderId}}</span>
              </div>
            </div>

            <md-field md-clearable class="md-toolbar-section-end">
              <md-input placeholder="搜索菜品.." v-model="search" @input="searchOnTable" />
            </md-field>
          </md-table-toolbar>

          <md-table-empty-state
            md-label="未搜索到相应菜品"
            :md-description="`请尝试输入其他菜品名称`">
          </md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="菜品名称" md-sort-by="name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="数量" md-sort-by="num">{{ item.num }}</md-table-cell>
            <md-table-cell md-label="小计（元）" md-sort-by="price">{{ item.price*item.num }}</md-table-cell>
          </md-table-row>
        </md-table>

        <md-card class="price-container">
          <div class="price-main">
            <span class="price-label">合计： ￥</span>
            <span v-show="orderInfo.discount !== 0" style="text-decoration: line-through; margin-right: 10px">{{orderInfo.price}}</span>
            <span class="price-text">{{orderInfo.price - orderInfo.discount}}</span>
          </div>
        </md-card>

        <md-card class="distribute-info-container">
          <md-card-header class="info-header">
            <md-icon class="store-icon">store</md-icon>
            <span class="store-text">配送信息</span>
          </md-card-header>
          <md-card-content>
            <div class="info-content">
              <span class="info-label">配送方式</span>
              <span class="info-text">商家配送</span>
            </div>
            <div class="info-content">
              <span class="info-label">联系人</span>
              <span class="info-text">{{orderInfo.linkman}}</span>
            </div>
            <div class="info-content">
              <span class="info-label">联系电话</span>
              <span class="info-text">{{orderInfo.phone}}</span>
            </div>
            <div class="info-content">
              <span class="info-label">收货地址</span>
              <span class="info-text">{{orderInfo.addressDisp}} {{orderInfo.room}}</span>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>

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
        name: "order-detail",
        data() {
          return {
            search: null,
            searched: [],
            dishes: [],
            orderInfo: {
              shop: {
                name: '',
                avatar: ''
              }
            },
            activeStep: 0
          }
        },
        methods: {
          searchOnTable () {
            this.searched = searchByName(this.dishes, this.search)
          },
          initOrderList: function () {
            this.$ajax.get('/order/info', {
              params: {
                id: this.$route.query.orderId
              }
            }).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.orderInfo = data.data;
                this.dishes = this.orderInfo.itemList;
                this.searched = this.dishes;

                switch (this.orderInfo.orderState){
                  case 0:
                    this.activeStep = 1;
                    break;
                  case 1:
                    this.activeStep = 2;
                    break;
                  case 2:
                    this.activeStep = 3;
                    break;
                  case 3:
                    this.activeStep = 3;
                    break;
                  case 8:
                    this.activeStep = 3;
                    break;
                }
              }
            })
          }
        },
        created () {
          this.initOrderList();
        },
        computed: {
          getAvatar: function () {
            if (!this.orderInfo.shop || !this.orderInfo.shop.avatar){
              return '../../../static/image/default-shop.png';
            } else {
              return '/shop/avatar/' + this.orderInfo.shop.identifyCode + '/' + this.orderInfo.shop.avatar;
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
    top 46px
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
</style>

<style lang="stylus">
  .el-step__title
    font-size 14px !important
</style>
