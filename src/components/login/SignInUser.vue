<template>
  <form class="main-form">
    <md-radio class="md-primary" v-model="radio" value="user">用户</md-radio>
    <md-radio class="md-primary" style="margin-left: 50px" v-model="radio" value="admin">管理员</md-radio>
    <md-field class="form-input" :class="{'md-invalid':emailInvalid}" v-show="radio === 'user'">
      <md-icon>perm_identity</md-icon>
      <label>邮箱地址</label>
      <md-input v-model="email" v-on:input="checkEmail" />
      <span class="md-error">请输入正确的邮箱地址</span>
    </md-field>
    <md-field class="form-input" v-show="radio === 'admin'">
      <md-icon>perm_identity</md-icon>
      <label>账号</label>
      <md-input v-model="adminId"/>
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
      <img id="codeImage" src="/code?codeName=userLoginCode" alt="更换验证码" height="36" width="100%" @click="getCodeImage" />
      <span class="md-error">请输入正确的验证码</span>
    </md-field>
    <a class="sign-button" href="#/sign/user">注册账号</a>
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
        name: "sign-in-user",
        data() {
          return {
            email: '',
            validateCode: '',
            password: '',
            emailInvalid: false,
            codeWrong: false,
            showSnackBar: false,
            errorMessage: '',
            radio: 'user',
            adminId: ''
          }
        },
        mounted(){
          this.getCodeImage()
        },
        methods: {
          getCodeImage: function () {
            var obj = document.getElementById('codeImage');
            obj.src = '/code?codeName=userLoginCode&rand='+Math.random();
          },
          checkEmail: function () {
            var regEmail= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            this.emailInvalid = !regEmail.test(this.email);
          },
          checkCode: function () {
            this.$ajax.get('/code/check', {
              params: {
                validateCode: this.validateCode,
                codeName: 'userLoginCode'
              }
            }).then((response) => {
              let data = response.data;
              this.codeWrong = !data.data;
            })
          },
          login: function () {
            let vm = this;
            var t = setTimeout(function () {
              if(vm.radio === 'user') {
                if (vm.email !== '' && !vm.emailInvalid && vm.password !== '' && !vm.codeWrong && vm.validateCode !== '') {
                  vm.$ajax.post('/login/user', vm.qs.stringify({
                      email: vm.email,
                      password: vm.password
                    })
                  ).then((response) => {
                    let data = response.data;
                    if (data.code === 0) {
                      let user = data.data;
                      let userInfo = {
                        id: user.id,
                        username: user.name,
                        level: user.userLevel,
                        avatar: user.avatar,
                        email: user.email,
                        phone: user.phone,
                        isAdmin: false
                      };
                      vm.userLogin(userInfo);
                      vm.$router.push('/user');
                    }
                    else if (data.code === 1) {
                      vm.errorMessage = '输入密码或登录邮箱错误！';
                      vm.showSnackBar = true;
                    }
                    else if (data.code === 4) {
                      vm.errorMessage = '登录邮箱不存在！';
                      vm.showSnackBar = true;
                    }
                    else {
                      vm.errorMessage = '系统错误！';
                      vm.showSnackBar = true;
                    }
                  })
                }
                else {
                  vm.errorMessage = '请完整并正确填写信息！';
                  vm.showSnackBar = true;
                }
              }
              else {
                if (vm.adminId !== '' && vm.password !== '' && !vm.codeWrong && vm.validateCode !== '') {
                  vm.$ajax.post('/login/admin', vm.qs.stringify({
                      id: vm.adminId,
                      password: vm.password
                    })
                  ).then((response) => {
                    let data = response.data;
                    if (data.code === 0) {
                      let user = data.data;
                      let userInfo = {
                        id: -1,
                        username: '',
                        level: '',
                        avatar: '',
                        email: '',
                        phone: '',
                        isAdmin: true
                      };
                      vm.userLogin(userInfo);
                      vm.$router.push('/admin');
                    }
                    else if (data.code === 1) {
                      vm.errorMessage = '输入密码或登录账号错误！';
                      vm.showSnackBar = true;
                    }
                    else if (data.code === 4) {
                      vm.errorMessage = '登录账号不存在！';
                      vm.showSnackBar = true;
                    }
                    else {
                      vm.errorMessage = '系统错误！';
                      vm.showSnackBar = true;
                    }
                  })
                }
                else {
                  vm.errorMessage = '请完整并正确填写信息！';
                  vm.showSnackBar = true;
                }
              }
            }, 500);
          },
          ...mapMutations({
            userLogin: 'login'
          })
        }
    }
</script>

<style lang="stylus" scoped>
  .main-form
    width 70%
    margin 0 auto
    margin-top 25%
  .image-input
    float left
  #codeImage:hover
    cursor pointer
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
</style>
