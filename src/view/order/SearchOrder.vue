<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">search</md-icon>
      <span class="form-title-text">订单查询</span>
    </div>
    <div class="sub-container">
      <md-card class="search-sort">
        <md-card-content>
          <div class="order-type-container">
            <span class="order-type-title">订单类型</span>
            <md-radio v-model="typeRadio" class="md-primary" value="all">全部</md-radio>
            <md-radio v-model="typeRadio" class="md-primary" value="accept">接单订单</md-radio>
            <md-radio v-model="typeRadio" class="md-primary" value="cancel">退单订单</md-radio>
            <md-radio v-model="typeRadio" class="md-primary" value="refuse">拒单订单</md-radio>
          </div>
          <div class="order-time-container">
            <span class="order-time-title">订单时间</span>
            <el-date-picker
              v-model="selectedDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              @change="changeDate">
            </el-date-picker>
          </div>
        </md-card-content>
      </md-card>
      <div class="order-list">
        <shop-order v-for="(item, index) in orderList" :orderInfo="item" :orderNum="index" :key="index" :showButton="false"></shop-order>
      </div>
    </div>
  </div>
</template>

<script>
    import ShopOrder from "../../components/order/ShopOrder";
    export default {
      components: {ShopOrder},
      name: "search-order",
        data() {
          return {
            typeRadio: 'all',
            selectedDate: [],
            pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
            orderList: []
          }
        },
        created() {
          this.initOrderList();
        },
        methods: {
          initOrderList: function () {
            this.$ajax.get('/order/list/shop/history', {
              params: {
                code: this.$store.getters.identifyCode
              }
            }).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.orderList = data.data;
              }
            })
          },
          changeDate: function () {
            if (this.selectedDate && this.selectedDate.length !== 0) {
              this.$ajax.get('/order/list/search', {
                params: {
                  code: this.$store.getters.identifyCode,
                  type: this.typeRadio,
                  startDate: this.selectedDate[0],
                  endDate: this.selectedDate[1]
                }
              }).then((response) => {
                let data = response.data;
                if (data.code === 0) {
                  this.orderList = data.data;
                }
              })
            } else {
              this.$ajax.get('/order/list/search', {
                params: {
                  code: this.$store.getters.identifyCode,
                  type: this.typeRadio,
                  startDate: null,
                  endDate: null
                }
              }).then((response) => {
                let data = response.data;
                if (data.code === 0){
                  this.orderList = data.data;
                }
              })
            }
          }
        },
        watch: {
          typeRadio(){
            this.changeDate();
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
  .date
    width 300px
  .sub-container
    padding-top 50px
    padding-left 220px
    padding-right 220px
    width 100%
  .order-type-title
    margin-right 50px
  .order-time-title
    margin-right 50px
  .order-time-container
    margin-top 20px
    margin-bottom 10px
    margin-left 15px
  .order-type-container
    margin-top 10px
    margin-left 15px
  .search-sort
    width 100%
    margin-left 0
    margin-right 0
  .order-list
    width 100%
    padding-top 50px
</style>
