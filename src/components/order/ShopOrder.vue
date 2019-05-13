<template>
  <md-card class="order-card">
    <div class="main-container">
      <div class="order-info">
        <span class="order-num">#{{orderNum+1}}</span>
        <span class="order-time">{{orderInfo.createTime}}</span>
        <span class="order-state">{{getOrderState}}</span>
      </div>
      <md-divider></md-divider>
      <div class="user-info">
        <span class="user-name">{{orderInfo.linkman}}</span>
        <div class="user-phone">
          <md-icon class="md-primary">phone</md-icon>
          <span class="user-phone-text">{{orderInfo.phone}}</span>
        </div>
        <span class="user-address">{{orderInfo.addressDisp}} {{orderInfo.room}}</span>
      </div>
      <md-divider></md-divider>
    </div>

    <md-card-expand>
      <md-card-actions md-alignment="space-between">
        <div>
          <span class="goods-title">商品</span>
        </div>
        <md-card-expand-trigger>
          <md-button class="md-primary md-icon-button">
            <md-icon>keyboard_arrow_down</md-icon>
          </md-button>
        </md-card-expand-trigger>
      </md-card-actions>
      <md-card-expand-content>
        <md-card-content class="expand">
          <md-table class="expand-table" v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
              <div class="md-toolbar-section-start">
                <h2>点单列表</h2>
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
              <md-table-cell md-label="小计（元）" md-sort-by="price">{{ item.price }}</md-table-cell>
            </md-table-row>
          </md-table>

          <md-card class="price-container">
            <div class="price-main">
              <span class="price-label">合计： ￥</span>
              <span v-show="orderInfo.discount !== 0" style="text-decoration: line-through; margin-right: 10px">{{orderInfo.discount}}</span>
              <span class="price-text">{{orderInfo.price - orderInfo.discount}}</span>
            </div>
          </md-card>
        </md-card-content>
      </md-card-expand-content>
    </md-card-expand>
    <md-card-content v-show="showButton" class="button-container">
      <md-divider style="margin-bottom: 10px"></md-divider>
      <md-card-actions>
        <md-button v-show="orderInfo.orderState === 1" class="accept-button" @click="refuseOrder">拒绝订单</md-button>
        <md-button v-show="orderInfo.orderState === 1" class="accept-button" @click="acceptOrder">接受订单</md-button>
        <md-button v-show="orderInfo.orderState === 7" class="accept-button" @click="refuseCancelOrder">拒绝退订</md-button>
        <md-button v-show="orderInfo.orderState === 7" class="accept-button" @click="acceptCancelOrder">接受退订</md-button>
      </md-card-actions>
    </md-card-content>
  </md-card>
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
        name: "shop-order",
        data() {
          return {
            search: null,
            searched: [],
            dishes: []
          }
        },
        methods: {
          searchOnTable () {
            this.searched = searchByName(this.dishes, this.search)
          },
          acceptOrder: function () {
            this.$ajax.post('/order/accept', this.qs.stringify({
              id: this.orderInfo.id
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.$emit('changeList', this.orderInfo.id);
              }
            })
          },
          refuseOrder: function () {
            this.$ajax.post('/order/refuse', this.qs.stringify({
              id: this.orderInfo.id
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.$emit('changeList', this.orderInfo.id);
              }
            })
          },
          acceptCancelOrder: function () {
            this.$ajax.post('/order/cancel/accept', this.qs.stringify({
              id: this.orderInfo.id
            })).then((response) =>{
              let data = response.data;
              if (data.code === 0){
                this.$emit('changeList', this.orderInfo.id);
              }
            })
          },
          refuseCancelOrder: function () {
            this.$ajax.post('/order/cancel/refuse', this.qs.stringify({
              id: this.orderInfo.id
            })).then((response) =>{
              let data = response.data;
              if (data.code === 0){
                this.$emit('changeList', this.orderInfo.id);
              }
            })
          }
        },
        created () {
          this.dishes = this.orderInfo.itemList;
          this.searched = this.dishes;
        },
        mounted() {
        },
        props: {
          orderInfo: {
            type: Object
          },
          orderNum: {
            type: Number
          },
          showButton: {
            type: Boolean,
            default: true
          }
        },
        computed: {
          getOrderState: function () {
            switch (this.orderInfo.orderState){
              case 1:
                return '等待接单中';
              case 7:
                return '等待退订中';
            }
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .order-card
    width 100%
    text-align left
    display inline-block
    vertical-align top
    margin-left 0
    margin-right 0
    margin-bottom 30px
  .order-num
    color #C9A990
    font-size 20px
    font-weight bold
    position absolute
    top 20px
    left 20px
  .order-time
    color #969696
    position absolute
    top 20px
    left 130px
  .order-state
    color #C9A990
    position absolute
    right 20px
    top 20px
    font-size 15px
    font-weight bold
  .order-info
    height 40px
  .user-info
    position relative
    height 90px
  .user-name
    position absolute
    font-size 20px
    font-weight bold
    top 20px
    left 5px
  .user-phone
    position absolute
    right 5px
    top 20px
  .user-phone-text
    margin-left 10px
    color #C9A990
    font-size 15px
  .user-address
    position absolute
    color #6f7180
    top 50px
    left 5px
  .goods-title
    font-size 16px
    font-weight bold
    margin-left 15px
  .expand-button
    float right
    margin-left 0
    margin-right 0
  .price-container
    padding 15px
  .price-text
    color red
    font-size 23px
  .price-label
    margin-left 80%
    font-size 16px
  .main-container
    padding 16px
    font-size 14px
    line-height 22px
    padding-bottom 0
  .expand .md-card
    box-shadow none
  .button-container
    padding-top 0
    padding-bottom 10px
  .accept-button
    background-color #C9A990
    color white !important
    margin-left 15px !important
  .expand-table
    max-height 400px
    height 400px
</style>
