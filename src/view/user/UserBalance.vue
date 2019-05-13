<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">payment</md-icon>
      <span class="form-title-text">账户余额</span>
    </div>
    <div class="form-content">
      <div class="balance-container">
        <span>当前账户余额：</span>
        <span class="balance-num">{{balance}}</span>
        <span>元</span>
        <md-button class="charge" @click="active = true">充值</md-button>
      </div>
    </div>
    <div>
      <md-dialog :md-active="active">
        <md-dialog-title>充值</md-dialog-title>
        <md-dialog-content>
          <md-field>
            <label>充值金额</label>
            <md-input v-model="chargeNum" type="number"></md-input>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="cancelCharge">取消</md-button>
          <md-button @click="confirmCharge">确认</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
    export default {
        name: "user-balance",
        data() {
          return {
            chargeNum: '',
            active: false,
            balance: 0.0
          }
        },
        methods: {
          confirmCharge: function () {
            this.active = false;
            if(this.chargeNum !== '') {
              this.$ajax.post('/user/balance/charge', this.qs.stringify({
                email: this.$store.getters.email,
                charge: this.chargeNum
              })).then((response) => {
                let data = response.data;
                if (data.code === 0){
                  this.balance = this.balance + this.chargeNum*1.0;
                  this.chargeNum = '';
                } else {
                  this.chargeNum = '';
                }
              })
            }
          },
          cancelCharge: function () {
            this.active = false;
            this.chargeNum = '';
          },
          initBalance: function () {
            this.$ajax.get('/user/info', {
              params: {
                email: this.$store.getters.email
              }
            }).then((response) => {
              let data = response.data;
              if(data.code === 0){
                let user = data.data;
                this.balance = user.balance;
              }
            })
          }
        },
        created() {
          this.initBalance();
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
  .balance-container
    margin-top 30px
    padding 19px
    background-color #fafafa
    border 1px solid #f3f3f3
    display flex;
    align-items Center;
  .balance-num
    color red
    font-size 24px
    margin 0 15px
  .charge
    margin-left 50px
    background-color #C9A990
    color white !important
</style>
