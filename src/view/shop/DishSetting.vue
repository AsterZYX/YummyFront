<template>
  <div class="main-container">
    <div class="nav-bar">
      <div class="input-container">
        <el-input placeholder="请输入内容" v-model="searchInput" class="search-input">
          <el-button slot="append" class="search-button" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-menu default-active="0" class="menu-type">
        <el-menu-item index="0" key="all" @click="clickAllMenu">
          <span slot="title">全部</span>
        </el-menu-item>
        <el-menu-item v-for="(item, index) in shopInfo.itemType" :index="index+1+''" :key="item" @click="clickSubMenu(item)">
          <span slot="title">{{item}}</span>
          <md-button class="md-icon-button md-primary menu-item-button" @click.stop="deleteItem = item; showDeleteTypeConfirmDialog = true">
            <md-icon>cancel</md-icon>
          </md-button>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="dish-container">
      <shop-goods v-for="(item, index) in itemList" :index="index" :key="item.id" :goodsInfo="item" @delete="clickDeleteGoodsButton" @modify="initModifyDialog"></shop-goods>
      <div class="empty" v-for="(item,index) in emptyNum" :index="index" :key="index"></div>
    </div>
    <md-dialog-alert
      :md-active.sync="showDeleteTypeDialog"
      md-title="删除失败！"
      md-content="在删除种类时必须确保<strong>该类型下没有商品</strong>"
      md-confirm-text="确认"/>
    <md-dialog-confirm
      :md-active.sync="showDeleteTypeConfirmDialog"
      md-title="确定要删除该类型吗？"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-cancel="showDeleteTypeConfirmDialog = false"
      @md-confirm="deleteType()" />
    <md-dialog-confirm
      :md-active.sync="showDeleteGoodsConfirmDialog"
      md-title="确定要删除该项吗？"
      md-content="删除后将<strong>不可恢复</strong>"
      md-confirm-text="确定"
      md-cancel-text="取消"
      @md-cancel="showDeleteGoodsConfirmDialog = false"
      @md-confirm="deleteGoods" />
    <md-dialog class="modify-dialog" :md-active.sync="showModifyDialog">
      <md-dialog-title>菜品表单</md-dialog-title>
      <!--<md-dialog-content>-->
      <el-form class="dish-form" label-position="right" label-width="80px">
        <el-form-item label="名称">
          <el-input class="item" v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input class="item" type="textarea" v-model="description"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input class="item" v-model="price"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="selectedType" class="item" placeholder="请选择菜品所属分类">
            <el-option v-for="(item,index) in shopInfo.itemType" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="remainNum" :min="0"></el-input-number>
        </el-form-item>
        <el-upload
          class="avatar-uploader"
          ref="uploader"
          :action="uploadUrl"
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
        <md-button class="md-primary color-white" @click="submitModifyGoods">确定</md-button>
        <md-button class="md-primary color-white" @click="cancelModifyGoods">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
    import ShopGoods from "../../components/shop/ShopGoods";
    import {mapGetters} from 'vuex'

    export default {
      components: {ShopGoods},
      name: "dish-setting",
        data() {
          return {
            searchInput: '',
            shopInfo: {},
            itemList: [],
            emptyNum: 0,
            menu: '全部',
            showDeleteTypeDialog: false,
            showDeleteTypeConfirmDialog: false,
            deleteItem: '',
            name: '',
            description: '',
            price: 0,
            remainNum: 0,
            imageUrl: '',
            selectedType: '',
            showModifyDialog: false,
            showDeleteGoodsConfirmDialog: false,
            deleteGoodsItem: {
              id: '',
              type: ''
            },
            modifyGoodsId: '',
            fileList: [],
            isAvatarModified: false
          }
        },
        methods: {
          initShopInfo: function () {
            this.$ajax.get('/shop/'+this.$store.getters.identifyCode).then((response) => {
              let data = response.data;
              if(data.code === 0){
                this.shopInfo = data.data;
                this.itemList = this.shopInfo.goodsList;
                this.setEmpty();
              }
            })
          },
          clickAllMenu: function () {
            this.itemList = [];
            this.itemList = this.shopInfo.goodsList;
            this.menu = '全部';
            this.setEmpty();
          },
          clickSubMenu: function (item) {
            this.itemList = [];
            this.menu = item;
            var tempList = this.shopInfo.goodsList;
            for(var i=0; i<tempList.length; i++){
              if(tempList[i].goodsType === item){
                this.itemList.push(tempList[i]);
              }
            }
            this.setEmpty();
          },
          setEmpty: function () {
            var size = this.itemList.length;
            if(size % 3 === 0){
              this.emptyNum = 0;
            }
            else{
              this.emptyNum = 3 - (this.emptyNum % 3);
            }
          },
          addType: function (item) {
            this.shopInfo.itemType.push(item);
          },
          addDishItem: function (item) {
            this.shopInfo.goodsList.push(item);
            if(this.menu === item.goodsType){
              this.itemList.push(item);
            }
            this.setEmpty();
          },
          deleteType: function () {
            var list = this.shopInfo.goodsList;
            var isEmpty = true;
            for(var i=0; i<list.length; i++){
              if (list[i].goodsType === this.deleteItem){
                isEmpty = false;
                break;
              }
            }
            if (!isEmpty) {
              this.showDeleteTypeDialog = true;
            } else {
              this.$ajax.post('/type/delete', this.qs.stringify({
                type: this.deleteItem,
                identifyCode: this.$store.getters.identifyCode
              })).then((response) => {
                let data = response.data;
                if (data.code === 0){
                  var temp = this.shopInfo.itemType.find(type => type === this.deleteItem);
                  var index = this.shopInfo.itemType.indexOf(temp);
                  if(index !== -1) {
                    this.shopInfo.itemType.splice(index, 1);
                  }
                  if(this.menu === this.deleteItem){
                    this.clickAllMenu();
                  }
                }
                this.deleteItem = '';
              })
            }
          },
          deleteGoods: function () {
            this.$ajax.post('/item/delete', this.qs.stringify({
              identifyCode: this.$store.getters.identifyCode,
              id: this.deleteGoodsItem.id
            })).then((response) => {
              let data = response.data;
              if( data.code === 0 ){
                var temp = this.shopInfo.goodsList.find(item => item.id === this.deleteGoodsItem.id);
                var index = this.shopInfo.goodsList.indexOf(temp);
                this.shopInfo.goodsList.splice(index, 1);
                if (this.menu === this.deleteGoodsItem.type){
                  var otherTemp = this.itemList.find(item => item.id === this.deleteGoodsItem.id);
                  var otherIndex = this.itemList.indexOf(otherTemp);
                  this.itemList.splice(otherIndex, 1);
                  this.setEmpty();
                }
                this.deleteGoodsItem.id = '';
                this.deleteGoodsItem.type = '';
              }
            })
          },
          clickDeleteGoodsButton: function (id, type) {
            this.showDeleteGoodsConfirmDialog = true;
            this.deleteGoodsItem.id = id;
            this.deleteGoodsItem.type = type;
          },
          initModifyDialog: function (goodsInfo) {
            this.name = goodsInfo.name;
            this.description = goodsInfo.description;
            this.price = goodsInfo.price;
            this.remainNum = goodsInfo.num;
            this.selectedType = goodsInfo.goodsType;
            this.modifyGoodsId = goodsInfo.id;
            if(goodsInfo.avatar === null){
              this.imageUrl = '../../../static/image/default-item.png'
            }
            else{
              this.imageUrl = '/item/avatar/' + this.$store.getters.identifyCode + '/' + goodsInfo.avatar;
            }
            this.showModifyDialog = true;
          },
          handleAvatarSuccess: function(res, file) {
            this.isAvatarModified = false;
            this.modifyGoodsId = '';
            this.name = '';
            this.price = '';
            this.goodsType = '';
            this.num = '';
            this.description = '';
            this.imageUrl = '';

            var goods = res.data;
            var temp = this.shopInfo.goodsList.find(item => item.id === goods.id);
            var index = this.shopInfo.goodsList.indexOf(temp);
            this.shopInfo.goodsList.splice(index, 1, goods);
            if (this.menu === goods.goodsType){
              var otherTemp = this.itemList.find(item => item.id === goods.id);
              var otherIndex = this.itemList.indexOf(otherTemp);
              this.itemList.splice(otherIndex, 1, goods);
            }
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
          cancelModifyGoods: function () {
            this.showModifyDialog = false;
            this.isAvatarModified = false;
            this.modifyGoodsId = '';
            this.name = '';
            this.price = '';
            this.goodsType = '';
            this.num = '';
            this.description = '';
            this.imageUrl = '';
          },
          submitModifyGoods: function () {
            if (this.isAvatarModified){
              this.$refs.uploader.submit();
              this.showModifyDialog = false;
            } else {
              this.showModifyDialog = false;
              this.$ajax.post('/modify/item/'+this.$store.getters.identifyCode, this.qs.stringify({
                id: this.modifyGoodsId,
                name: this.name,
                price: this.price,
                goodsType: this.selectedType,
                num: this.remainNum,
                description: this.description
              })).then((response) => {
                let data = response.data;
                if (data.code === 0){
                  this.handleAvatarSuccess(data, null);
                }
              })
            }
          }
        },
        watch: {
        },
        props: {
        },
        computed: {
          uploadData(){
            return {
              id: this.modifyGoodsId,
              name: this.name,
              price: this.price,
              goodsType: this.selectedType,
              num: this.remainNum,
              description: this.description
            }
          },
          uploadUrl: function () {
            return '/modify/item/'+this.$store.getters.identifyCode;
          }
        },
        created() {
          this.initShopInfo();
        }
    }
</script>

<style lang="stylus" scoped>
  .main-container
    width 80%
    height 100%
    margin 0 auto
    background-color white
  .nav-bar
    width 200px
    float left
    height 100%
    background-color white
  .menu-type
    width 100%
    height calc(100% - 60px)
  .search-input
    margin 10px
    width 180px
  .input-container
    border-right solid 1px #e6e6e6
    position relative
  .search-button:active
    padding 14px 18px 10px 22px
  .dish-container
    height 100%
    width calc(100% - 200px)
    float right
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content flex-start
    align-items flex-start
    padding 20px 60px
  .empty
    visibility hidden
    width 320px
    height 164px
    margin 4px 16px
    display inline-block
    vertical-align top
    text-align left
    margin-bottom 30px
  .menu-item-button
    position absolute
    right -3px
    top 14px
    width 30px !important
    min-width 30px !important
    height 30px !important
  .menu-item-button .md-icon
    width 20px !important
    min-width 20px !important
    height 20px !important
    font-size 20px !important
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
  .color-white
    color white !important
    background-color #C9A990
    margin-right 10px
    margin-bottom 10px
    width 90px
  .dish-form
    height 350px
    margin-top 30px
  .modify-dialog
    width 860px
  .item
    width 400px
</style>
