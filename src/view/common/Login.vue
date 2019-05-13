<template>
  <div class="pane">
    <div class="main-pane">
      <div class="spanner-wrapper">
        <img class="logo" src="../../../static/image/logo-white.png"/>
      </div>
      <div class="form-wrapper">
        <div class="form">
          <md-tabs class="form-tab md-transparent" md-alignment="fixed">
            <md-tab class="tab" md-label="会员" href="#/login/user" />
            <md-tab class="tab" md-label="商家" href="#/login/shop" />
          </md-tabs>
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "login"
    }
</script>

<style lang="stylus" scoped>
  .pane
    width 100%
    height 100%
    background-image url("/static/image/background.jpg")
    background-repeat no-repeat
    background-size 100% 100%
    display flex
    justify-content center
    align-items center
  .main-pane
    margin 0 auto
    width 97%
    height 94%
    background-color rgba(255,255,255,.5)
    -webkit-box-shadow 0 0 15px #8F8F8F ;
    -moz-box-shadow 0 0 15px #8F8F8F ;
    box-shadow: 0 0 15px #8F8F8F ;
  .spanner-wrapper
    float left
    height 100%
    width 70%
    position relative
  .form-wrapper
    height 100%
    width 30%
    float right
    background-color white
  .form
    height 100%
    width 100%
    position relative
  .form-tab
    width 70%
    margin 0 auto
    margin-top 15%
    margin-bottom 15%
  .tab
    font-size 15px
  .logo
    width 60%
    bottom 5%
    right 20%
    position absolute
</style>
