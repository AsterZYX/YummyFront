<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">business_center</md-icon>
      <span class="form-title-text">财务统计</span>
    </div>
    <div class="form-content">
      <el-card class="finance-card" :body-style="{ height: '100%' }">
        <div class="turnover-container">
          <div class="title">营业额</div>
          <div class="price">{{today}}</div>
          <div class="compare">
            <span>比昨日同时段</span>
            <md-icon v-show="today >= yesterday" class="compare-color">arrow_drop_up</md-icon>
            <md-icon v-show="today < yesterday" class="compare-color">arrow_drop_down</md-icon>
            <span class="compare-color">￥{{Math.abs(today-yesterday)}}</span>
          </div>
        </div>
        <div class="expanse-container">
          <div class="title">支出</div>
          <div class="price">{{today*0.9}}</div>
          <div class="compare">
            <span>比昨日同时段</span>
            <md-icon v-show="today >= yesterday" class="compare-color">arrow_drop_up</md-icon>
            <md-icon v-show="today < yesterday" class="compare-color">arrow_drop_down</md-icon>
            <span class="compare-color">￥{{Math.abs(today-yesterday)*0.9}}</span>
          </div>
        </div>
        <div class="profit-container">
          <div class="title">纯收入</div>
          <div class="price">{{today*0.1}}</div>
          <div class="compare">
            <span>比昨日同时段</span>
            <md-icon v-show="today >= yesterday" class="compare-color">arrow_drop_up</md-icon>
            <md-icon v-show="today < yesterday" class="compare-color">arrow_drop_down</md-icon>
            <span class="compare-color">￥{{Math.abs(today-yesterday)*0.1}}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
    export default {
        name: "financial-statistics",
        data() {
          return {
            isUp: true,
            today: 0.0,
            yesterday: 0.0
          }
        },
        created() {
          this.initFinanceData();
        },
        methods: {
          initFinanceData: function () {
            this.$ajax.get('/platform/finance/data').then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.today = data.data.turnoverToday;
                this.yesterday = data.data.turnoverYesterday;
              }
            })
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
  .form-title-text
    font-weight bold
    font-size 20px
    text-align left
    margin-left 15px
  .form-title-icon
    font-size 34px !important
  .form-content
    width 100%
    padding-top 50px
  .finance-card
    width 90%
    height 212px
    margin 0 auto
  .turnover-container
    width 33%
    display inline-block
    height 100%
    vertical-align top
    border-right solid 1px #e6e6e6
  .expanse-container
    width 33%
    display inline-block
    height 100%
    vertical-align top
    padding-left 20px
    border-right solid 1px #e6e6e6
  .profit-container
    width 33%
    display inline-block
    height 100%
    vertical-align top
    padding-left 20px
  .title
    font-size 16px
    font-weight bold
    color #333333
    padding-top 20px
    padding-left 20px
  .price
    font-size 45px
    font-weight bold
    color #666666
    padding 30px
  .compare
    padding-left 32px
  .compare-color
    color coral !important
</style>
