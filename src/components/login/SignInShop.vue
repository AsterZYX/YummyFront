<template>
  <form class="shop-login-form">
    <md-field class="form-input">
      <md-icon>store</md-icon>
      <label>商店识别码</label>
      <md-input v-model="identifyCode" />
    </md-field>
    <md-field class="form-input">
      <md-icon>lock</md-icon>
      <!--<icon-svg class="icon-username" icon-class="wode" />-->
      <label>密码</label>
      <md-input v-model="password" type="password" />
    </md-field>
    <md-field class="form-input" :class="{'md-invalid':codeWrong}">
      <md-icon>extension</md-icon>
      <label>验证码</label>
      <md-input class="image-input" v-model="validateCode" @blur="checkCode" />
      <img id="codeImage" src="/code?codeName=shopLoginCode" alt="更换验证码" height="36" width="100%" @click="getCodeImage" />
      <span class="md-error">请输入正确的验证码</span>
    </md-field>
    <a class="sign-button" href="#/sign/shop">注册账号</a>
    <a class="forget-button">忘记密码</a>
    <md-button class="md-raised md-primary login-button" @click="login">登录</md-button>
    <md-snackbar :md-position="'left'" :md-duration="3000" :md-active.sync="showSnackBar">
      <span>{{errorMessage}}</span>
    </md-snackbar>
  </form>
</template>

<script>
    import {mapMutations} from 'vuex'
    export default {
        name: "sign-in-shop",
        data() {
          return {
            identifyCode: '',
            password: '',
            validateCode: '',
            codeWrong: false,
            showSnackBar: false,
            errorMessage: ''
          }
        },
        mounted(){
          this.getCodeImage()
        },
        methods: {
          getCodeImage: function () {
            var obj = document.getElementById('codeImage');
            obj.src = '/code?codeName=shopLoginCode&rand='+Math.random();
          },
          checkCode: function () {
            this.$ajax.get('/code/check', {
              params: {
                validateCode: this.validateCode,
                codeName: 'shopLoginCode'
              }
            }).then((response) => {
              let data = response.data
              this.codeWrong = !data.data;
            })
          },
          login: function () {
            let vm = this;
            var t = setTimeout(function () {
              if(vm.identifyCode !== '' && vm.password !== '' && !vm.codeWrong && vm.validateCode !== ''){
                vm.$ajax.post('/login/shop', vm.qs.stringify({
                    identifyCode: vm.identifyCode,
                    password: vm.password
                  })
                ).then((response) => {
                  let data = response.data;
                  if(data.code === 0){
                    let shop = data.data;
                    let shopInfo = {
                      identifyCode: shop.identifyCode,
                      shopName: shop.name,
                      shopAddress: shop.address,
                      shopType: shop.shopType,
                      shopState: shop.shopState
                    };
                    vm.shopLogin(shopInfo);
                    vm.$router.push('/shop');
                  }
                  else if(data.code === 1){
                    vm.errorMessage = '输入密码或登录识别码错误！';
                    vm.showSnackBar = true;
                  }
                  else if(data.code === 4){
                    vm.errorMessage = '登录识别码不存在！';
                    vm.showSnackBar = true;
                  }
                  else{
                    vm.errorMessage = '系统错误！';
                    vm.showSnackBar = true;
                  }
                })
              }
              else{
                vm.errorMessage = '请完整并正确填写信息！';
                vm.showSnackBar = true;
              }
            }, 500);
          },
          ...mapMutations({
            shopLogin: 'shopLogin'
          })
        }
    }
</script>

<style lang="stylus" scoped>
  .shop-login-form
    width 70%
    margin 0 auto
    margin-top 27%
  a
    text-decoration none
    out-line none
  a:link
    text-decoration none
  a:active
    color red
  a:visited
    text-decoration none
  a:hover
    text-decoration none
  .sign-button
    float left
    color #C9A990
    margin-top 15px
  .sign-button:hover, .sign-button:avtive, .sign-button:link
    color #C9A990
  .forget-button
    float right
    color #8f8f8f !important
    margin-top 15px
  .forget-button:hover, .forget-button:active, .forget-button:link
    color #8f8f8f !important
  .login-button
    width 100%
    margin-left 0
    margin-top 50px
    color: #ffffff !important
  #codeImage:hover
    cursor pointer
</style>
