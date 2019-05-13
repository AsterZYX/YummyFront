<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">assessment</md-icon>
      <span class="form-title-text">财务中心</span>
    </div>
    <div class="sub-container">
      <div class="balance-container">
        <div class="balance-main-container">
          <span class="balance-label">可用余额</span>
          <span class="balance-symbol">￥</span>
          <span class="balance-text">{{balance}}</span>
        </div>
        <md-button class="deposit-button" @click="active = true">提现</md-button>
      </div>
      <div class="table-container">
        <div class="table-selector">
          <el-date-picker
            v-model="time"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            class="date-picker">
          </el-date-picker>
          <md-radio class="md-primary type-radio" v-model="radio" value="out">支出</md-radio>
          <md-radio class="md-primary type-radio" v-model="radio" value="in">收入</md-radio>
          <md-radio class="md-primary type-radio" v-model="radio" value="all">全部</md-radio>
        </div>
        <div class="table-main">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              width="180">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="金额">
            </el-table-column>
            <el-table-column
              prop="sum"
              label="余额">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <md-dialog :md-active="active">
      <md-dialog-title>提现</md-dialog-title>
      <md-dialog-content>
        <md-field :class="{'md-invalid':inputWrong}">
          <label>提现金额</label>
          <md-input v-model="depositNum" type="number" min="0" :max="balance" @blur="checkDeposit"></md-input>
          <span class="md-error">提现金额不可大于余额</span>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="cancelDeposit">取消</md-button>
        <md-button @click="confirmDeposit">确认</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
    export default {
        name: "shop-data",
        data() {
          return {
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
            time: '',
            radio: 'all',
            tableData: [],
            balance: 0.0,
            active: false,
            depositNum: '',
            inputWrong: false
          }
        },
        methods: {
          initAccount: function () {
            this.$ajax.get('/shop/'+this.$store.getters.identifyCode).then((response) => {
              let data = response.data;
              if(data.code === 0){
                this.balance = data.data.balance;
              }
            })
          },
          initFinance: function () {
            this.$ajax.get('/shop/finance/list', {
              params: {
                identifyCode: this.$store.getters.identifyCode
              }
            }).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.tableData = data.data;
              }
            })
          },
          confirmDeposit: function () {
            if (this.balance >= this.depositNum*1.0){
              this.active = false;
              this.$ajax.post('/shop/deposit', this.qs.stringify({
                identifyCode: this.$store.getters.identifyCode,
                amount: this.depositNum*1.0
              })).then((response) => {
                let data = response.data;
                if (data.code === 0){
                  this.balance = this.balance - this.depositNum*1.0;
                  this.depositNum = '';
                }
              })
            }
          },
          cancelDeposit: function () {
            this.active = false;
            this.depositNum = '';
          },
          checkDeposit: function () {
            if (this.balance < this.depositNum*1.0){
              this.inputWrong = true;
            } else {
              this.inputWrong = false;
            }
          }
        },
        created() {
          this.initAccount();
          this.initFinance();
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
  .sub-container
    width 70%
    margin 0 auto
    padding-top 50px
  .balance-container
    width 100%
    height 100px
    display flex
    align-items center
    box-shadow 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)
  .balance-main-container
    width 70%
    height 60%
    text-align right
    float left
    line-height 60px
    vertical-align center
    padding-right 40px
    border-right solid 1px #e6e6e6
    margin-right 40px
  .balance-label
    font-size 13px
  .balance-symbol
    color darkorange
    font-size 18px
  .balance-text
    font-size 35px
    color darkorange
  .deposit-button
    background-color #C9A990
    color white !important
  .table-container
    margin-top 30px
  .time-picker
    float left
  .type-radio
    float right
  .table-main
    padding-top 40px
</style>
