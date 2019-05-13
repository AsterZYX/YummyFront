<template>
  <md-card md-with-hover>
    <md-ripple>
      <md-card-content>
        <div class="content">
          <md-icon>person</md-icon>
          <span>{{addressInfo.name}}</span>
        </div>
        <div class="content">
          <md-icon>phone</md-icon>
          <span>{{addressInfo.phone}}</span>
        </div>
        <div class="content">
          <md-icon>location_city</md-icon>
          <span>{{addressInfo.addressDisp}}</span>
        </div>
        <div class="content">
          <md-icon>domain</md-icon>
          <span>{{addressInfo.room}}</span>
        </div>
      </md-card-content>

      <md-card-actions v-show="showButton">
        <md-button @click="clickEditButton">
          <md-icon>edit_location</md-icon>
          <md-tooltip>编辑地址</md-tooltip>
        </md-button>
        <md-button @click="showDeleteDialog = true">
          <md-icon>delete_sweep</md-icon>
          <md-tooltip>删除地址</md-tooltip>
        </md-button>
      </md-card-actions>
    </md-ripple>

    <md-dialog class="add-address-dialog" :md-active.sync="showDialog">
      <md-dialog-title>修改地址</md-dialog-title>
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
    <md-dialog-confirm
      :md-active.sync="showDeleteDialog"
      md-title="确定要删除该地址吗?"
      md-content="删除地址将不会影响您查看过往订单"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-cancel="showDeleteDialog = false"
      @md-confirm="clickDeleteButton" />
  </md-card>
</template>

<script>
    import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data';
    export default {
        name: "address-card",
        props: {
          showButton: {
            type: Boolean,
            default: true
          },
          addressInfo: {
            type: Object
          }
        },
        data() {
          return {
            showDialog: false,
            showDeleteDialog: false,
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
                message: '请选择所在地区',
                trigger: 'blur'
              }]
            },
            autoComplete: {},
            options: provinceAndCityData
          }
        },
        methods: {
          confirmAddress: function () {
            this.$refs['ruleForm'].validate((valid) => {
              if (valid) {
                this.showDialog = false;

                this.$ajax.post('address/modify', {
                  id: this.addressInfo.id,
                  name: this.ruleForm.name,
                  phone: this.ruleForm.phone,
                  addressDisp: this.ruleForm.address,
                  room: this.ruleForm.room,
                  province: CodeToText[this.ruleForm.district[0]],
                  city: CodeToText[this.ruleForm.district[1]]
                }).then((response) => {
                  let data = response.data;
                  if(data.code === 0){
                    this.addressInfo.name = this.ruleForm.name;
                    this.addressInfo.phone = this.ruleForm.phone;
                    this.addressInfo.addressDisp = this.ruleForm.address;
                    this.addressInfo.room = this.ruleForm.room;
                    this.addressInfo.province = this.ruleForm.district[0];
                    this.addressInfo.city = this.ruleForm.district[1];
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
          },
          clickEditButton: function () {
            this.ruleForm.name = this.addressInfo.name;
            this.ruleForm.phone = this.addressInfo.phone;
            this.ruleForm.address = this.addressInfo.addressDisp;
            this.ruleForm.room = this.addressInfo.room;
            this.ruleForm.district = [TextToCode[this.addressInfo.province].code, TextToCode[this.addressInfo.province][this.addressInfo.city].code];
            this.showDialog = true;
          },
          clickDeleteButton: function () {
            this.$emit('deleteAddress', this.addressInfo.id);
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

                  if (vm.ruleForm.district){
                    autoComplete.setCity(CodeToText[vm.ruleForm.district[1]]);
                    autoComplete.setCityLimit(true);
                  }

                  vm.autoComplete = autoComplete;
                })
              }, 10);
            }
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .md-card
    width 280px
    margin-bottom 30px
  .md-card:nth-child(4n+1)
    margin-left 0
  .md-card:nth-child(4n)
    margin-right 0
  .content
    margin-bottom 10px
  .md-card-content
    padding-bottom 0
  .md-button
    min-width 50px
  .active
    box-shadow 0 5px 5px -3px rgba(201,169,144,.2), 0 8px 10px 1px rgba(201,169,144,.14), 0 3px 14px 2px rgba(201,169,144,.12);
    color #C9A990
  .active .md-icon
    color #C9A990 !important
  .add-address-dialog
    width 800px !important
  .form-input
    width 500px
</style>
