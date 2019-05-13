<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import store from './store/index'
export default {
  name: 'App',
  store
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
html,body,#app{
  height: 100%;
}
body{
  overflow: hidden;
}
</style>
<style lang="scss">
  @import "assets/theme";
  @import "assets/el-theme";
</style>
