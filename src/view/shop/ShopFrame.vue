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
              <md-menu-item @click="$router.push('/shop/info'); menuVisible = false; dialShow = false;">
                <md-icon class="sub-menu">store_mall_directory</md-icon>
                <span class="sub-menu-text">商家信息</span>
              </md-menu-item>
              <md-menu-item @click="$store.commit('shopLogout'); $router.push('/')">
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
            <img :src="getShopAvatar" alt="Avatar">
          </md-avatar>
        </md-toolbar>
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="name-container">{{shopName}}</span>
        </md-toolbar>

        <md-divider />

        <md-list class="menu-list" :md-expand-single="expandSingle">
          <md-list-item md-expand :md-expanded.sync="expandNews">
            <md-icon>receipt</md-icon>
            <span class="md-list-item-text">订单</span>

            <md-list class="menu-list" slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/order/handle'); menuVisible = false; dialShow = false;">订单处理</md-list-item>
              <md-list-item class="md-inset" @click="$router.push('/order/search'); menuVisible = false; dialShow = false;">订单查询</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item md-expand>
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">商品管理</span>

            <md-list class="menu-list" slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/shop/dish'); menuVisible = false; dialShow = true;">菜品</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item md-expand>
            <md-icon>card_giftcard</md-icon>
            <span class="md-list-item-text">促销管理</span>

            <md-list class="menu-list" slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/shop/discount'); menuVisible = false; dialShow = false;">满减活动</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item @click="$router.push('/shop/info'); menuVisible = false; dialShow = false;">
            <md-icon>store_mall_directory</md-icon>
            <span class="md-list-item-text">商家信息</span>
          </md-list-item>

          <md-list-item @click="$router.push('/shop/data'); menuVisible = false; dialShow = false;">
            <md-icon>assessment</md-icon>
            <span class="md-list-item-text">财务中心</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content class="content">

        <router-view ref="dish" />

      </md-app-content>

    </md-app>

    <md-speed-dial slot="reference" id="dial" md-event="click" class="md-bottom-right" v-show="dialShow">
      <md-speed-dial-target>
        <md-icon>add</md-icon>
        <md-tooltip md-direction="top">添加</md-tooltip>
      </md-speed-dial-target>

      <md-speed-dial-content>
        <md-button class="md-icon-button" @click="active = true">
          <md-icon>dashboard</md-icon>
          <md-tooltip md-direction="top">添加分类</md-tooltip>
        </md-button>

        <md-button class="md-icon-button" @click="showDialog = true; imageUrl = '';">
          <md-icon>fastfood</md-icon>
          <md-tooltip md-direction="top">添加菜品</md-tooltip>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>

    <md-dialog-prompt
      :md-active.sync="active"
      v-model="sortValue"
      md-title="添加分类"
      md-input-maxlength="15"
      md-input-placeholder="请输入分类名"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-confirm="addType"/>

    <md-dialog class="add-dish-dialog" :md-active.sync="showDialog">
      <md-dialog-title>菜品表单</md-dialog-title>
      <!--<md-dialog-content>-->
      <el-form class="dish-form" label-position="right" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="name" class="item"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="description" class="item" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="price" type="number" class="item"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="selectedType" class="item" placeholder="请选择菜品所属分类">
            <el-option v-for="(item, index) in shopInfo.itemType" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="remainNum" :min="1"></el-input-number>
        </el-form-item>
        <el-upload
          class="avatar-uploader"
          ref="uploader"
          action="/upload/item"
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
      </el-form>
      <!--</md-dialog-content>-->
      <md-dialog-actions>
        <md-button class="md-primary color-white" @click="addDishItem">确定</md-button>
        <md-button class="md-primary color-white" @click="cleanDialog">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "shop-frame",
    data() {
      return {
        menuVisible: false,
        expandNews: false,
        expandSingle: false,
        dialShow: false,
        showDialog: false,
        active: false,
        sortValue: '',
        name: '',
        description: '',
        price: '',
        selectedType:'',
        remainNum: '',
        imageUrl: '',
        shopInfo: {},
        fileList: []
      }
    },
    mounted() {
    },
    computed: {
      ...mapGetters([
        'shopName',
        'identifyCode'
      ]),
      uploadData(){
        return {
          name: this.name,
          price: this.price*1,
          goodsType: this.selectedType,
          num: parseInt(this.remainNum),
          description: this.description,
          shopCode: this.$store.getters.identifyCode
        }
      },
      getShopAvatar: function () {
        if ( this.shopInfo.avatar ){
          return '/shop/avatar/'+ this.$store.getters.identifyCode +'/' + this.shopInfo.avatar;
        } else {
          return '../../../static/image/default-shop.png';
        }
      }
    },
    methods: {
      handleAvatarSuccess: function(res, file) {
        this.showDialog = false;
        this.name = '';
        this.description = '';
        this.price = '';
        this.selectedType = '';
        this.remainNum = '';
        this.imageUrl = '';

        this.$refs.dish.addDishItem(res.data);
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
          if (this.$refs.uploader) {
            this.$refs.uploader.clearFiles();
          }
          this.fileList = [];
          this.fileList.push(file);
        }

        return isPIC && isLt2M;
      },
      addType: function () {
        if(this.shopInfo.itemType.indexOf(this.sortValue) === -1) {
          this.$ajax.post('/type/add', this.qs.stringify({
            type: this.sortValue,
            identifyCode: this.$store.getters.identifyCode
          })).then((response) => {
            let data = response.data;
            if (data.code === 0) {
              this.$refs.dish.addType(this.sortValue);
              this.shopInfo.itemType.push(this.sortValue);
              this.sortValue = '';
            }
          })
        }
      },
      addDishItem: function () {
        this.$refs.uploader.submit();
      },
      initShopInfo: function () {
        this.$ajax.get('/shop/'+this.$store.getters.identifyCode).then((response) => {
          let data = response.data;
          if(data.code === 0){
            this.shopInfo = data.data;
          }
        })
      },
      getAvatar: function () {

      },
      cleanDialog: function () {
        this.showDialog = false;
        this.name = '';
        this.description = '';
        this.price = '';
        this.selectedType = '';
        this.remainNum = '';
        this.imageUrl = '';
      }
    },
    created() {
      this.initShopInfo();
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
  .md-content
    padding-top 10px
  .dish-form
    height 350px
    margin-top 30px
  .add-dish-dialog
    width 860px
  .item
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
    top -323px
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
</style>
