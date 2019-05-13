<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">account_box</md-icon>
      <span class="form-title-text">个人资料</span>
      <md-button class="md-accent md-raised shut-up-button" @click="active = true">
        <md-icon>exit_to_app</md-icon>
        <span>注销用户</span>
      </md-button>
    </div>
    <div class="form-content">
      <el-form class="form-main" :rules="rules" ref="ruleForm" :model="ruleForm" label-position="right" label-width="80px">
        <el-form-item label="邮箱">
          <span>674527347@qq.com</span>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input :disabled="!isModify" v-model="ruleForm.name" class="form-input" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input :disabled="!isModify" v-model="ruleForm.phone" class="form-input" />
        </el-form-item>
        <el-form-item label="等级">
          <span>{{ruleForm.level}}</span>
        </el-form-item>
      </el-form>
      <div class="origin-avatar" v-show="!isModify">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
      </div>
      <el-upload
        class="avatar-uploader"
        ref="uploader"
        action="/upload/user"
        :show-file-list="false"
        :file-list="fileList"
        :on-success="handleAvatarSuccess"
        :on-change="onAvatarUploadChange"
        accept="image/*"
        :auto-upload="false"
        :data="uploadData"
        v-show="isModify">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <md-button class="md-dense md-raised md-primary form-button accept-button" @click="modifyInfo">{{buttonText}}</md-button>
      <md-button class="md-dense md-raised md-primary form-button cancel-button" v-show="isModify" @click="cancelModify">取消修改</md-button>
    </div>
    <md-snackbar :md-position="'center'" :md-duration="3000" :md-active.sync="showSnackBar">
      <span>请正确填写个人信息</span>
    </md-snackbar>
    <md-dialog-confirm
      :md-active.sync="active"
      md-title="您确定要注销该账户吗?"
      md-content="注销账户后，该账户将<strong>不可恢复</strong>"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-cancel="active = false"
      @md-confirm="onConfirm" />
  </div>
</template>

<script>
    export default {
        name: "personal-data",
        data() {
          return {
            fileList: [],
            imageUrl: '',
            buttonText: '修改信息',
            isModify: false,
            ruleForm: {
              name: '',
              phone: '',
              level: ''
            },
            originForm: {
              name: '',
              phone: '',
              originUrl: ''
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
              ]
            },
            isAvatarModified: false,
            showSnackBar: false,
            isInfoModified: false,
            active: false
          }
        },
        methods: {
          handleAvatarSuccess(res, file) {
            this.isAvatarModified = false;
            this.isInfoModified = false;
            this.originForm.originUrl = this.imageUrl;
            this.originForm.name = this.ruleForm.name;
            this.originForm.phone = this.ruleForm.phone;
            this.$store.commit('setUserName', this.ruleForm.name);
            this.$store.commit('setUserPhone', this.ruleForm.phone);
            this.$store.commit('changeAvatar', res.data);
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
              this.$refs.uploader.clearFiles();
              this.fileList = [];
              this.fileList.push(file);
            }

            return isPIC && isLt2M;
          },
          modifyInfo: function () {
            if(!this.isModify) {
              this.isModify = true;
              this.buttonText = '确认修改';
            }else {
              this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                  this.isModify = false;
                  this.buttonText = '修改信息';

                  if( this.isAvatarModified ){
                    this.$refs.uploader.submit();
                  } else {
                    if ( this.isInfoModified ){
                      this.$ajax.post('/upload/user', this.qs.stringify({
                        id: this.$store.getters.id,
                        email: this.$store.getters.email,
                        name: this.ruleForm.name,
                        phone: this.ruleForm.phone,
                        isAvatarModified: this.isAvatarModified
                      }));
                      this.originForm.name = this.ruleForm.name;
                      this.originForm.phone = this.ruleForm.phone;
                      this.isAvatarModified = false;
                      this.isInfoModified = false;
                      this.$store.commit('setUserName', this.ruleForm.name);
                      this.$store.commit('setUserPhone', this.ruleForm.phone);
                    }
                  }
                } else {
                  this.showSnackBar = true;
                  return false;
                }
              });
            }
          },
          initInfo: function () {
            this.$ajax.get('/user/info', {
              params: {
                email: this.$store.getters.email
              }
            }).then((response) => {
              let data = response.data;
              if(data.code === 0){
                let user = data.data;
                this.ruleForm.name = user.name;
                this.ruleForm.phone = user.phone;
                this.ruleForm.level = user.userLevel;
                this.originForm.name = user.name;
                this.originForm.phone = user.phone;
                this.isInfoModified = false;

                if( user.avatar === null ){
                  this.imageUrl = '../../../static/image/default_avatar.png';
                  this.originForm.originUrl = this.imageUrl;
                }
                else{
                  this.imageUrl = '/user/avatar/' + this.$store.getters.id + '/' + user.avatar;
                  this.originForm.originUrl = this.imageUrl;
                }
              }
            })
          },
          cancelModify: function () {
            this.imageUrl = this.originForm.originUrl;
            this.ruleForm.name = this.originForm.name;
            this.ruleForm.phone = this.originForm.phone;
            this.isAvatarModified = false;
            this.isInfoModified = false;
            this.isModify = false;
            this.buttonText = '修改信息';
          },
          onConfirm: function () {
            this.active = false;
            this.$ajax.post('/user/cancel', this.qs.stringify({
              email: this.$store.getters.email
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.$notify({
                  title: '注销成功',
                  message: '该账号已成功被注销',
                  type: 'success',
                  position: 'bottom-left'
                });
                this.$store.commit('logout');
                this.$router.push('/');
              }
            })
          }
        },
        created() {
          this.initInfo();
        },
        watch: {
          userName(newVal, oldVal){
            if(newVal !== oldVal){
              this.isInfoModified = true;
            }
          },
          userPhone(newVal, oldVal){
            if(newVal !== oldVal){
              this.isInfoModified = true;
            }
          }
        },
        computed: {
          uploadData(){
            return {
              id: this.$store.getters.id,
              email: this.$store.getters.email,
              name: this.ruleForm.name,
              phone: this.ruleForm.phone,
              isAvatarModified: this.isAvatarModified
            }
          },
          userName: function () {
            return this.ruleForm.name;
          },
          userPhone: function () {
            return this.ruleForm.phone;
          }
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
  .origin-avatar
    border 1px solid #d9d9d9
    border-radius 6px
    position relative
    overflow hidden
    width 170px
    height 170px
    float right
    right 150px
  .avatar-uploader
    border 1px dashed #d9d9d9
    border-radius 6px
    cursor pointer
    position relative
    overflow hidden
    width 170px
    float right
    right 150px
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
    margin-left 150px
  .form-button
    color white !important
    position absolute
    top 400px
  .accept-button
    left 44%
  .cancel-button
    left 53%
  .shut-up-button
    float right
    margin 0
    right 12%
</style>
