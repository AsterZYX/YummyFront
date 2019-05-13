<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">person_pin_circle</md-icon>
      <span class="form-title-text">地址管理</span>
    </div>
    <md-button class="add-button md-primary" @click="showDialog = true">
      <md-icon>add_location</md-icon>
      <span>添加地址</span>
    </md-button>
    <div class="form-content">
      <address-card v-for="(item, index) in addressList" :addressInfo="item" :key="item.id" :index="index" @deleteAddress="deleteAddress"></address-card>
      <div class="empty" v-for="(item,index) in emptyNum" :key="index"></div>
    </div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>新增地址</md-dialog-title>
      <md-dialog-content>
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm" label-position="right" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" class="form-input" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" class="form-input" />
          </el-form-item>
          <el-form-item label="地区" prop="district">
            <el-cascader
              size="large"
              :options="options"
              v-model="ruleForm.district"
              @change="handleChange"
              class="form-input"
            />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="ruleForm.address" id="address-input" class="form-input" />
          </el-form-item>
          <el-form-item label="房间号">
            <el-input v-model="ruleForm.room" class="form-input" />
          </el-form-item>
        </el-form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="confirmAddress">确认</md-button>
        <md-button @click="cancelAddress">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
    import AddressCard from "../../components/user/AddressCard";
    import AMap from 'AMap';
    import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data';
    export default {
      components: {AddressCard},
      name: "user-address",
      data() {
        return {
          showDialog: false,
          ruleForm: {
            name: '',
            phone: '',
            address: '',
            room: '',
            district: []
          },
          rules: {
            name: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            }],
            phone: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
              {
                validator: function (rule, value, callback) {
                  if (/^1[34578]\d{9}$/.test(value) === false) {
                    callback(new Error('请输入正确的手机号'))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ],
            address: [{
              required: true,
              message: '请输入地址',
              trigger: 'blur'
            }],
            district: [{
              required: true,
              message: '请选择地区',
              trigger: 'blur'
            }]
          },
          addressList: [],
          emptyNum: 0,
          options: provinceAndCityData,
          autoComplete: {}
        }
      },
      methods: {
        confirmAddress: function () {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              this.showDialog = false;
              this.$ajax.post('/address/'+this.$store.getters.email, {
                id: null,
                name: this.ruleForm.name,
                phone: this.ruleForm.phone,
                addressDisp: this.ruleForm.address,
                room: this.ruleForm.room,
                province: CodeToText[this.ruleForm.district[0]],
                city: CodeToText[this.ruleForm.district[1]]
              }).then((response) => {
                let data = response.data;
                if(data.code === 0){
                  this.addressList.push(data.data);
                  if(this.addressList.length % 4 === 0){
                    this.emptyNum = 0;
                  }
                  else {
                    this.emptyNum = 4 - (this.addressList.length % 4 === 0);
                  }
                  this.ruleForm.name = '';
                  this.ruleForm.phone = '';
                  this.ruleForm.address = '';
                  this.ruleForm.room = '';
                  this.ruleForm.district = [];
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        cancelAddress: function () {
          this.showDialog = false;
          this.ruleForm.name = '';
          this.ruleForm.phone = '';
          this.ruleForm.address = '';
          this.ruleForm.room = '';
          this.ruleForm.district = [];
        },
        initAddressList: function () {
          this.$ajax.get('/user/address', {
            params: {
              email: this.$store.getters.email
            }
          }).then((response) => {
            let data = response.data;
            if(data.code === 0){
              this.addressList = data.data;
              if(this.addressList.length % 4 === 0){
                this.emptyNum = 0;
              }
              else {
                this.emptyNum = 4 - (this.addressList.length % 4 === 0);
              }
            }
          })
        },
        deleteAddress: function (id) {
          this.$ajax.post('/address/delete', this.qs.stringify({
            id: id
          })).then((response) => {
            let data = response.data;
            if(data.code === 0){
              var deleteItem = this.addressList.find(item => item.id === id);
              var index = this.addressList.indexOf(deleteItem);
              this.addressList.splice(index, 1);

              if(this.addressList.length % 4 === 0){
                this.emptyNum = 0;
              }
              else {
                this.emptyNum = 4 - (this.addressList.length % 4 === 0);
              }
            }
          })
        },
        handleChange: function () {
          this.autoComplete.setCity(CodeToText[this.ruleForm.district[1]]);
          this.autoComplete.setCityLimit(true);
          this.ruleForm.address = '';
        }
      },
      watch: {
        showDialog(curVal, oldVal){
          if(curVal === true){
            let vm = this;
            var t = setTimeout(function () {
              AMap.plugin('AMap.Autocomplete', function(){
                // 实例化Autocomplete
                var autoOptions = {
                  // input 为绑定输入提示功能的input的DOM ID
                  input: "address-input"
                };
                var autoComplete= new AMap.Autocomplete(autoOptions);
                // 无需再手动执行search方法，autoComplete会根据传入input对应的DOM动态触发search
                AMap.event.addListener(autoComplete, 'select', function(e){
                  //TODO 针对选中的poi实现自己的功能
                  vm.ruleForm.address = e.poi.name;
                });

                vm.autoComplete = autoComplete;
              })
            }, 10);
          }
        }
      },
      created() {
        this.initAddressList();
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
  .form-title
    float left
  .form-title-text
    font-weight bold
    font-size 20px
    text-align left
    margin-left 15px
  .form-title-icon
    font-size 34px !important
  .form-content
    width 100%
    height 100%
    padding-top 50px
    position relative
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content flex-start
    align-items flex-start
  .empty
    visibility hidden
    width 280px
    margin-bottom 30px
    height 204px
  .add-button
    float right
    margin 0
  .md-dialog
    width 800px
  .form-input
    width 500px
</style>
