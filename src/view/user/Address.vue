<!--暂不需要-->
<template>
    <div class="main-container">
      <div class="upper-container">
        <div class="user-container">
          <md-avatar class="md-small avatar">
            <img src="../../../static/image/default_avatar.png" alt="Avatar">
          </md-avatar>
          <div class="avatar-name">{{name}}</div>
        </div>
        <div class="map-container">
          <img class="logo-img" src="../../../static/image/logo-white.png">
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "address",
        data() {
          return {
            name: 'default'
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .main-container
    width 100%
    height 100%
  .upper-container
    width 100%
    height 60%
    background-color #C9A990
  .map-container

  .logo-img
    width 40%
    position absolute
    left 29%
    top 20%
  .user-container
    display inline
    float right
    margin-right 25%
    margin-top 40px
  .avatar
    float left
    margin-right 20px
  .avatar-name
    color white
    font-size 18px
    float left
</style>
