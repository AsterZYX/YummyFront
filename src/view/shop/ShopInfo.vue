<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">store</md-icon>
      <span class="form-title-text">商家资料</span>
    </div>
    <div class="form-content">
      <el-form class="origin-form-main" label-position="right" label-width="80px">
        <el-form-item label="名称">
          <span class="origin-content">{{shopInfo.name}}</span>
        </el-form-item>
        <el-form-item label="类型">
          <span class="origin-content">{{shopInfo.shopType}}</span>
        </el-form-item>
        <el-form-item label="地区">
          <span class="origin-content">{{shopInfo.province}} {{shopInfo.city}}</span>
        </el-form-item>
        <el-form-item label="地址">
          <span class="origin-content">{{shopInfo.address}}</span>
        </el-form-item>
      </el-form>
      <div class="origin-avatar-uploader">
        <img :src="getAvatar" class="avatar">
      </div>
      <md-button class="md-dense md-raised md-primary form-button" @click="clickModifyButton">修改信息</md-button>
    </div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>修改商家信息</md-dialog-title>
      <md-dialog-content>
        <el-form class="form-main" :model="ruleForm" label-position="right" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="ruleForm.name" class="form-input"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="ruleForm.type" class="form-input" placeholder="请选择所属分类">
              <el-option v-for="(item, index) in shopType" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="ruleForm.address" class="form-input" id="address-input" />
          </el-form-item>
        </el-form>
        <el-upload
          class="avatar-uploader"
          ref="uploader"
          action="/upload/shop"
          :show-file-list="false"
          :file-list="fileList"
          :on-success="handleAvatarSuccess"
          :on-change="onAvatarUploadChange"
          accept="image/*"
          :auto-upload="false"
          :data="uploadData">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="edit-button" @click="modifyShopInfo">确认</md-button>
        <md-button class="edit-button" @click="cancelModifyShop">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog-alert
      :md-active.sync="showAlert"
      md-title="提交成功!"
      md-content="请耐心等待管理员审核，审核通过后信息会即时更新"
      md-confirm-text="确定"
    />
    <md-dialog-alert
      :md-active.sync="showError"
      md-title="请完整填写信息!"
      md-content="请将表格中的信息填写完整后提交"
      md-confirm-text="确定"
    />
  </div>
</template>

<script>
  import AMap from 'AMap';
  export default {
    name: "shop-info",
    data() {
      return {
          imageUrl: '',
          buttonText: '修改信息',
          isModify: false,
          ruleForm: {
            name: '',
            type: '',
            address: ''
          },
          showDialog: false,
          shopInfo: {},
          shopType: ['美食', '快餐便当', '特色菜系', '异国料理', '小吃夜宵', '甜品饮品', '果蔬生鲜', '商店超市', '鲜花绿植', '医药健康'],
          fileList: [],
          isAvatarModified: false,
          showAlert: false,
          showError: false
        }
      },
    methods: {
      handleAvatarSuccess: function(res, file) {
        this.showDialog = false;
        this.ruleForm.name = '';
        this.ruleForm.type = '';
        this.ruleForm.address = '';
        this.isAvatarModified = false;

        this.showAlert = true;
      },
      onAvatarUploadChange: function(file) {
        const isPIC = /^image\/(jpeg|png|jpg)$/.test(file.raw.type);
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isPIC) {
          this.$message.error('上传文件只能是图片格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }

        if(isPIC && isLt2M){
          this.imageUrl = URL.createObjectURL(file.raw);
          this.isAvatarModified = true;
          if (this.$refs.uploader) {
            this.$refs.uploader.clearFiles();
          }
          this.fileList = [];
          this.fileList.push(file);
        }

        return isPIC && isLt2M;
      },
      initShopInfo: function () {
        this.$ajax.get('/shop/'+this.$store.getters.identifyCode).then((response) => {
          let data = response.data;
          if (data.code === 0) {
            this.shopInfo = data.data;
          }
        });
      },
      modifyShopInfo: function () {
        if (this.ruleForm.name !== '' && this.ruleForm.type !== '' && this.ruleForm.address !== ''){
          if (this.isAvatarModified){
            this.$refs.uploader.submit();
            this.showDialog = false;
          } else {
            this.showDialog = false;
            this.$ajax.post('/upload/shop', this.qs.stringify({
              identifyCode: this.$store.getters.identifyCode,
              name: this.ruleForm.name,
              shopType: this.shopType.indexOf(this.ruleForm.type),
              address: this.ruleForm.address
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.handleAvatarSuccess(data, null);
              }
            })
          }
        } else {
          this.showError = true;
        }
      },
      cancelModifyShop: function () {
        this.showDialog = false;
        this.ruleForm.name = '';
        this.ruleForm.type = '';
        this.ruleForm.address = '';
        this.isAvatarModified = false;
      },
      clickModifyButton: function () {
        this.ruleForm.name = this.shopInfo.name;
        this.ruleForm.address = this.shopInfo.address;
        this.ruleForm.type = this.shopInfo.shopType;
        this.imageUrl = this.getAvatar;
        this.isAvatarModified = false;

        this.showDialog = true;
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
              })

              autoComplete.setCity(vm.shopInfo.city);
              autoComplete.setCityLimit(true);
            })
          }, 10);
        }
      }
    },
    computed: {
      uploadData(){
        return {
          identifyCode: this.$store.getters.identifyCode,
          name: this.ruleForm.name,
          shopType: this.shopType.indexOf(this.ruleForm.type),
          address: this.ruleForm.address
        }
      },
      getAvatar: function () {
        if(!this.shopInfo.avatar){
          return '../../../static/image/default-shop.png'
        }
        else{
          return '/shop/avatar/' + this.$store.getters.identifyCode + '/' + this.shopInfo.avatar;
        }
      }
    },
    created() {
      this.initShopInfo();
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
    padding-top 90px
    position relative
  .form-input
    width 400px
  .avatar-uploader
    border 1px dashed #d9d9d9
    border-radius 6px
    cursor pointer
    position relative
    overflow hidden
    width 170px
    float right
    right 50px
    top 20px
  .avatar-uploader:hover
    border-color #C9A990
  .avatar-uploader-icon
    font-size 28px
    color #8c939d
    width 170px
    height 170px
    line-height 170px
    text-align center
  .avatar-uploader-icon:hover
    color #C9A990
  .avatar
    width 170px
    height 170px
    display block
  .form-main
    float left
    margin-left 40px
    margin-top 20px
  .form-button
    color white !important
    position absolute
    left 46%
    top 400px
  .origin-avatar-uploader
    position relative
    overflow hidden
    width 170px
    float right
    right 150px
    border 1px solid #d9d9d9
    border-radius 6px
  .md-dialog
    width 850px
  .edit-button
    background-color  #C9A990
    color white !important
    width 100px
    margin-right 20px
    margin-bottom 20px
  .origin-form-main
    float left
    margin-left 150px
  .origin-content
    font-size 18px
    margin-left 20px
</style>
