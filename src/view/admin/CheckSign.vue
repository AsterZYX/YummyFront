<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">verified_user</md-icon>
      <span class="form-title-text">审核申请</span>
    </div>
    <div class="form-content">
      <md-card class="sign-card" v-for="(item, index) in applyList" :key="item.identifyCode">
        <md-card-header style="height: 164px;">
          <md-card-header-text>
            <div class="md-title title">{{item.name}}</div>
            <div class="md-subhead">{{item.identifyCode}}</div>
            <div class="md-subhead">{{item.shopType}}</div>
            <div class="md-subhead">{{item.province}} {{item.city}}</div>
            <div class="md-subhead">{{item.address}}</div>
          </md-card-header-text>
        </md-card-header>
        <md-card-actions>
            <md-button class="accept-button" @click="examineApply(item.identifyCode, true)">通过</md-button>
            <md-button class="refuse-button" @click="examineApply(item.identifyCode, false)">拒绝</md-button>
        </md-card-actions>
      </md-card>
      <div v-for="(index) in emptyNum" :key="index" class="empty"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "check-sign",
    data() {
      return {
        applyList: [],
        emptyNum: 0
      }
    },
    methods: {
      initApplyList: function () {
        this.$ajax.get('/apply/sign/list').then((response) => {
          let data = response.data;
          if (data.code === 0){
            this.applyList = data.data;
            this.setEmpty();
          }
        })
      },
      setEmpty: function () {
        var len = this.applyList.length;
        if ( len % 3 === 0 ){
          this.emptyNum = 0;
        } else {
          this.emptyNum = 3 - ( len % 3 );
        }
      },
      examineApply: function (identifyCode, res) {
        this.$ajax.post('/apply/sign/examine', this.qs.stringify({
          code: identifyCode,
          res: res
        })).then((response) => {
          let data = response.data;
          if (data.code === 0){
            let temp = this.applyList.find(item => item.identifyCode === identifyCode);
            let index = this.applyList.indexOf(temp);
            if(index !== -1) {
              this.applyList.splice(index, 1);
              this.setEmpty();
            }
          }
        })
      }
    },
    created() {
      this.initApplyList();
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
    width 90%
    height 100%
    padding-top 50px
    position relative
    margin 0 auto
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content flex-start
    align-items flex-start
  .empty
    visibility hidden
    width 320px
    height 216px
    display inline-block
    vertical-align top
    margin-bottom 30px
    margin-left 16px
    margin-right 16px
  .sign-card
    width 320px
    display inline-block
    vertical-align top
    margin-bottom 30px
  .title
    font-size 18px
    margin-top 0 !important
  .accept-button
    background-color  #C9A990
    color white !important
  .refuse-button
    background-color #ececec
</style>
