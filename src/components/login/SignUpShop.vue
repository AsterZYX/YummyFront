<template>
  <form class="shop-sign-form">
    <md-field class="form-input">
      <md-icon>store</md-icon>
      <label>商家名称</label>
      <md-input v-model="name" />
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
    <div class="form-input">
      <md-icon style="margin-right: 8px">business</md-icon>
      <el-cascader
        style="width: 355.078px"
        size="large"
        :options="options"
        v-model="selectedOptions"
        @change="handleChange"/>
    </div>
    <el-popover
      placement="top"
      width="340"
      trigger="click"
      v-bind:visible-arrow="true">
      <div id="map-container"></div>
      <!--<el-button slot="reference">click 激活</el-button>-->
      <md-field slot="reference" class="form-input">
        <md-icon>room</md-icon>
        <label>地址</label>
        <md-input id="map-search" v-model="address" @blur="onAddressBlur" @mousedown="toggleMap=true" v-on:input="searchPlace" />
      </md-field>
    </el-popover>
    <div class="map-input" style="text-align: left">
      <md-icon style="margin-right: 8px">developer_board</md-icon>
      <el-select style="width: 355.078px" v-model="type" placeholder="类型">
        <el-option
          v-for="(typeValue,index) in shopType"
          :key="index"
          :label="typeValue"
          :value="typeValue">
        </el-option>
      </el-select>
    </div>
    <md-field class="form-input" :class="{'md-invalid':codeWrong}">
      <md-icon>extension</md-icon>
      <label>验证码</label>
      <md-input class="image-input" v-model="validateCode" @blur="checkCode" />
      <img id="codeImage" src="/code?codeName=shopSignCode" alt="更换验证码" height="36" width="100%" @click="getCodeImage" />
      <span class="md-error">请输入正确的验证码</span>
    </md-field>
    <a class="login-button" href="#/login/user">已有账号？</a>
    <md-button class="md-raised md-primary sign-button" @click="register">注册</md-button>
    <md-snackbar :md-position="'left'" :md-duration="3000" :md-active.sync="showSnackBar">
      <span>{{errorMessage}}</span>
    </md-snackbar>
    <md-dialog :md-active.sync="dialogShow">
      <md-dialog-title>等待审核中</md-dialog-title>
      <div class="message-div">以下为您的登录识别码: {{dialogMessage}} 。此为登录必须凭证，请务必或记录在您可找到的地方！审核通过后即可登录。</div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="backToSign">确认，我已记住</md-button>
      </md-dialog-actions>
    </md-dialog>
  </form>
</template>

<script>
  import AMap from 'AMap';
  import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data';
  export default {
        name: "sign-up-shop",
        data() {
          return {
            password: '',
            passwordRepeat: '',
            type: '',
            validateCode: '',
            name: '',
            address: '',
            codeWrong: false,
            psdReWrong: false,
            psdWrong: false,
            shopType: ['美食', '快餐便当', '特色菜系', '异国料理', '小吃夜宵', '甜品饮品', '果蔬生鲜', '商店超市', '鲜花绿植', '医药健康'],
            toggleMap: false,
            showSnackBar: false,
            errorMessage: '',
            placeSearch: '',
            map: '',
            dialogShow: false,
            dialogMessage: '',
            options: provinceAndCityData,
            selectedOptions: [],
            autoComplete: {},
            province: '',
            city: ''
          }
        },
        mounted(){
          this.getCodeImage();
          this.initMap();
        },
        methods: {
          getCodeImage: function () {
            var obj = document.getElementById('codeImage');
            obj.src = '/code?codeName=shopSignCode&rand='+Math.random();
          },
          checkPsdRe: function () {
            this.psdReWrong = this.password !== this.passwordRepeat;
          },
          checkPsd: function () {
            var regPsw = /^[a-zA-Z]\w{8,25}$/;
            this.psdWrong = !regPsw.test(this.password);
          },
          checkCode: function () {
            this.$ajax.get('/code/check', {
              params: {
                validateCode: this.validateCode,
                codeName: 'shopSignCode'
              }
            }).then((response) => {
              let data = response.data
              this.codeWrong = !data.data;
            })
          },
          initMap: function () {
            var map = new AMap.Map('map-container',{
              zoom: 11,
              resizeEnable: true,
              makers: []
            });
            this.map = map;
            let vm = this;
            AMap.plugin('AMap.CitySearch', function () {
              var citySearch = new AMap.CitySearch();
              citySearch.getLocalCity(function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  // 查询成功，result即为当前所在城市信息
                  var cityinfo = result.city;
                  var citybounds = result.bounds;
                  //地图显示当前城市
                  // map.setCenter(citybounds.getCenter());

                  if (vm.selectedOptions && vm.selectedOptions.length !== 0) {
                    map.setCity(CodeToText(vm.selectedOptions[0]));
                  } else {
                    map.setCenter(citybounds.getCenter());
                    // var marker = new AMap.Marker({
                    //   position: citybounds.getCenter(),
                    //   map: map
                    // });
                  }

                  AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
                    var autoOptions = {
                      input: "map-search"
                    };
                    var autocomplete= new AMap.Autocomplete(autoOptions);

                    if (vm.selectedOptions && vm.selectedOptions.length !== 0) {
                      autocomplete.setCity(CodeToText(vm.selectedOptions[0]));
                      autocomplete.setCityLimit(true);
                    }

                    var placeSearch = new AMap.PlaceSearch({
                      map: map
                    });

                    AMap.event.addListener(autocomplete, 'select', function(e){
                      //TODO 针对选中的poi实现自己的功能
                      vm.address = e.poi.name;
                      placeSearch.search(e.poi.name);
                    });

                    vm.placeSearch = placeSearch;
                    vm.autoComplete = autocomplete;
                  })
                }
                else{
                  vm.errorMessage = '获取所在城市失败！';
                  vm.showSnackBar = true;
                }
              })
            })
          },
          searchPlace: function () {
            this.map.clearMap();
            let vm = this;
            this.placeSearch.search(this.address, function (status, result) {
              // 查询成功时，result即对应匹配的POI信息
              vm.map.clearMap();
              var pois = result.poiList.pois;
              for (var i = 0; i < pois.length; i++) {
                var poi = pois[i];
                var marker = [];
                marker[i] = new AMap.Marker({
                  position: poi.location,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                  title: poi.name
                });
                // 将创建的点标记添加到已有的地图实例：
                vm.map.add(marker[i]);
              }
              vm.map.setFitView();
            });
          },
          register: function () {
            let vm = this;
            var t = setTimeout(function () {
              if(vm.name!=='' && vm.password!=='' && !vm.psdWrong && vm.passwordRepeat!=='' && !vm.psdReWrong && !vm.codeWrong &&
                vm.validateCode!=='' && vm.address!=='' && vm.type!=='' && vm.selectedOptions){
                vm.$ajax.post('/sign/shop',{
                  name: vm.name,
                  password: vm.password,
                  address: vm.address,
                  shopType: vm.shopType.indexOf(vm.type),
                  province: CodeToText[vm.selectedOptions[0]],
                  city: CodeToText[vm.selectedOptions[1]]
                }).then((response) => {
                  let result = response.data;
                  if(result.code === 0){
                    vm.dialogMessage = result.data;
                    console.log(result.data);
                    vm.dialogShow = true;
                  }
                  else if(result.code === 1){
                    vm.errorMessage = '注册失败！';
                    vm.showSnackBar = true;
                  }
                  else{
                    vm.errorMessage = '系统错误！';
                    vm.showSnackBar = true;
                  }
                })
              }
              else{
                vm.errorMessage = '请正确并完整填写信息！';
                vm.showSnackBar = true;
              }
            }, 500);
          },
          backToSign: function () {
            this.dialogShow = false;
            this.$router.push('/');
          },
          handleChange: function () {
            this.map.setCity(CodeToText[this.selectedOptions[1]]);
            this.map.clearMap();
            this.autoComplete.setCity(CodeToText[this.selectedOptions[1]]);
            this.autoComplete.setCityLimit(true);
            this.placeSearch.setCity(CodeToText[this.selectedOptions[1]]);
            this.placeSearch.setCityLimit(true);
          },
          onAddressBlur: function () {
            let vm = this;
            setTimeout(function () {
              vm.toggleMap = false;
            }, 10);
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .shop-sign-form
    width 70%
    margin 0 auto
    margin-top -20px
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
  .login-button
    float left
    color #C9A990
    margin-top 15px
  .login-button:hover, .login-button:avtive, .login-button:link
    color #C9A990
  .sign-button
    width 100%
    margin-left 0
    margin-top 50px
    color: #ffffff !important
  #codeImage:hover
    cursor pointer
  .type
    margin-left 10px
    width 100%
  .map-menu
    width 100%
  .map-input
    width 100%
  .map-menu-content
    width 100%
    max-width 21%
    height 300px
  #map-container
    width 100% !important
    height 284px
  .message-div
    margin 0 25px
</style>
