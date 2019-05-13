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
              <md-menu-item @click="$router.push('/')">
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
            <img src="../../../static/image/default_avatar.png" alt="Avatar">
          </md-avatar>
        </md-toolbar>
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="name-container">Admin</span>
        </md-toolbar>

        <md-divider />

        <md-list class="menu-list" :md-expand-single="expandSingle">

          <md-list-item md-expand :md-expanded.sync="expandExamine">
            <md-icon>verified_user</md-icon>
            <span class="md-list-item-text">审核</span>

            <md-list class="menu-list" slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/admin/check'); menuVisible = false;">审核修改</md-list-item>
              <md-list-item class="md-inset" @click="$router.push('/admin/check/sign'); menuVisible = false;">审核申请</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item md-expand :md-expanded.sync="expandNews">
            <md-icon>insert_chart</md-icon>
            <span class="md-list-item-text">统计信息</span>

            <md-list class="menu-list" slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/statistics/shop'); menuVisible = false;">餐厅统计</md-list-item>
              <md-list-item class="md-inset" @click="$router.push('/statistics/user'); menuVisible = false;">会员统计</md-list-item>
              <md-list-item class="md-inset" @click="$router.push('/statistics/finance'); menuVisible = false;">财务统计</md-list-item>
            </md-list>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content class="content">

        <router-view />

      </md-app-content>

    </md-app>
  </div>
</template>

<script>
  export default {
    name: "admin-frame",
    data() {
      return {
        menuVisible: false,
        expandExamine: false,
        expandNews: false,
        expandSingle: false
      }
    },
    mounted() {
    },
    methods: {
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
</style>
