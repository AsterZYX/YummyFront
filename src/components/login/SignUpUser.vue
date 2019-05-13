<template>
  <form class="user-sign-form">
    <md-field class="form-input" :class="{'md-invalid':emailInvalid}">
      <md-icon>email</md-icon>
      <label>邮箱地址</label>
      <md-input v-model="email" v-on:input="checkEmail" />
      <span class="md-error">请输入正确的邮箱地址</span>
    </md-field>
    <md-field class="form-input" :md-toggle-password="false" :class="{'md-invalid':psdWrong}">
      <md-icon>lock</md-icon>
      <!--<icon-svg class="icon-username" icon-class="wode" />-->
      <label>密码</label>
      <md-input v-model="password" type="password" v-on:input="checkPsd" />
      <span class="md-error">必须以字母开头，长度在8~25位之间，只能包含字符、数字和下划线</span>
    </md-field>
    <md-field class="form-input" :md-toggle-password="false" :class="{'md-invalid':psdReWrong}">
      <md-icon>lock</md-icon>
      <!--<icon-svg class="icon-username" icon-class="wode" />-->
      <label>确认密码</label>
      <md-input v-model="passwordRepeat" type="password" @blur="checkPsdRe" />
      <span class="md-error">两次输入密码不同</span>
    </md-field>
    <md-field class="form-input">
      <md-icon>perm_identity</md-icon>
      <label>姓名</label>
      <md-input v-model="name" />
    </md-field>
    <md-field class="form-input" :class="{'md-invalid':phoneWrong}">
      <md-icon>phone</md-icon>
      <label>电话</label>
      <md-input v-model="phone" @blur="checkPhone" />
      <span class="md-error">请输入正确的电话号码</span>
    </md-field>
    <md-field class="form-input" :class="{'md-invalid':codeWrong}">
      <md-icon>extension</md-icon>
      <label>验证码</label>
      <md-input class="image-input" v-model="validateCode" @blur="checkCode" />
      <img id="codeImage" src="/code?codeName=userSignCode" alt="更换验证码" height="36" width="100%" @click="getCodeImage" />
      <span class="md-error">请输入正确的验证码</span>
    </md-field>
    <md-field class="form-input" :class="{'md-invalid':mailCodeWrong}">
      <md-icon>vpn_key</md-icon>
      <label>邮箱验证</label>
      <md-input class="image-input" v-model="mailCode" @blur="checkMailCode" />
      <md-button v-show="!timerShow" class="send-button" @click="getMailCode">发送验证码</md-button>
      <md-button v-show="timerShow" class="send-button send-timer" @click="getMailCode" disabled>{{count}} s</md-button>
      <span class="md-error">验证码错误</span>
    </md-field>
    <a class="login-button" href="#/login/user">已有账号？</a>
    <md-button class="md-raised md-primary sign-button" @click="register">注册</md-button>
    <md-snackbar :md-position="'left'" :md-duration="3000" :md-active.sync="showSnackBar">
      <span>{{errorMessage}}</span>
    </md-snackbar>
  </form>
</template>

<script>
    export default {
        name: "sign-up-user",
        data(){
          return {
            timerShow: false,
            count: 60,
            time: null,
            email: '',
            password: '',
            passwordRepeat: '',
            name: '',
            phone: '',
            validateCode: '',
            mailCode: '',
            emailInvalid: false,
            psdWrong: false,
            psdReWrong: false,
            codeWrong: false,
            mailCodeWrong: false,
            phoneWrong: false,
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
            obj.src = '/code?codeName=userSignCode&rand='+Math.random();
          },
          getMailCode: function () {
            let vm = this;
            var t = setTimeout(function () {
              const TIME_COUNT = 60;
              if (!vm.timer && !vm.emailInvalid && vm.email !== '') {
                vm.count = TIME_COUNT;
                vm.timerShow = true;
                vm.timer = setInterval(() => {
                  if (vm.count > 0 && vm.count <= TIME_COUNT) {
                    vm.count--;
                  } else {
                    vm.timerShow = false;
                    clearInterval(vm.timer);
                    vm.timer = null;
                  }
                }, 1000);
                vm.$ajax.get('/mail', {
                  params: {
                    email: vm.email
                  }
                }).then((response) => {
                  let data = response.data
                  if(data.code === 1){
                    vm.psdWrong = true;
                  }
                  else if(data.code === 4){
                    vm.emailInvalid = true;
                  }
                })
              }
            })
          },
          checkEmail: function () {
            var regEmail= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            this.emailInvalid = !regEmail.test(this.email);
          },
          checkPsdRe: function () {
            this.psdReWrong = this.password !== this.passwordRepeat;
          },
          checkCode: function () {
            this.$ajax.get('/code/check', {
              params: {
                validateCode: this.validateCode,
                codeName: 'userSignCode'
              }
            }).then((response) => {
              let data = response.data
              this.codeWrong = !data.data;
            })
          },
          checkMailCode: function () {
            this.$ajax.get('/mail/check', {
              params: {
                mailCode: this.mailCode
              }
            }).then((response) => {
              let data = response.data;
              this.mailCodeWrong = !data.data
            })
          },
          checkPsd: function () {
            var regPsw = /^[a-zA-Z]\w{8,25}$/;
            this.psdWrong = !regPsw.test(this.password);
          },
          checkPhone: function () {
            var regPhone = /^1[34578]\d{9}$/;
            this.phoneWrong = !regPhone.test(this.phone);
          },
          register: function () {
            let vm = this;
            var t = setTimeout(function () {
              if(vm.email!=='' && !vm.emailInvalid && vm.password!=='' && !vm.psdWrong && vm.passwordRepeat!=='' && !vm.psdReWrong && !vm.codeWrong &&
                vm.validateCode!=='' && !vm.mailCodeWrong && vm.mailCode!=='' && vm.name!=='' && vm.phone!=='' && !vm.phoneWrong){
                vm.$ajax.post('/sign/user',{
                  email: vm.email,
                  password: vm.password,
                  phone: vm.phone,
                  name: vm.name
                }).then((response) => {
                  let data = response.data;
                  if(data.code === 0){
                    vm.errorMessage = '注册成功！';
                    vm.$router.push('/login/user');
                  }
                  else if(data.code === 1){
                    vm.errorMessage = '注册失败！'
                  }
                  else if(data.code === 6){
                    vm.errorMessage = '邮箱已存在！'
                  }
                  else{
                    vm.errorMessage = '系统错误！'
                  }
                })
              }
              else{
                vm.errorMessage = '请正确并完整填写信息！'
              }
              vm.showSnackBar = true;
            }, 500);
          }
        },
      computed: {
      }
    }
</script>

<style lang="stylus" scoped>
  .user-sign-form
    width 70%
    margin 0 auto
    margin-top -40px
  .send-button
    margin-top -9px
    background-color #C9A990
    color white
  .login-button
    float left
  .login-button:hover, .login-button:avtive, .login-button:link
    color #C9A990
  .sign-button
    width 100%
    margin-left 0
    margin-top 50px
    color: #ffffff !important
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
  .send-timer
    background-color #bdbdbd
    color: white !important
  #codeImage:hover
    cursor pointer
</style>
