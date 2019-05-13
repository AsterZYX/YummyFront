<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">verified_user</md-icon>
      <span class="form-title-text">审核修改</span>
    </div>
    <div class="form-content">
      <shop-edit-card v-for="(item, index) in applyList" :key="item.id" :applyInfo="item" @examine="examineApply"></shop-edit-card>
      <div v-for="(index) in emptyNum" :key="index" class="empty"></div>
    </div>
  </div>
</template>

<script>
    import ShopEditCard from "../../components/shop/ShopEditCard";

    export default {
      components: {ShopEditCard},
      name: "check-shop",
      data() {
        return {
          applyList: [],
          emptyNum: 0
        }
      },
      methods: {
        initApplyList: function () {
          this.$ajax.get('/apply/list').then((response) => {
            let data = response.data;
            if (data.code === 0){
              this.applyList = data.data;
              this.setEmpty();
            }
          })
        },
        setEmpty: function () {
          var len = this.applyList.length;
          if ( len % 3 === 0 ){
            this.emptyNum = 0;
          } else {
            this.emptyNum = 3 - ( len % 3 );
          }
        },
        examineApply: function (id) {
          var temp = this.applyList.find(item => item.newInfo.id === id);
          var index = this.applyList.indexOf(temp);
          if(index !== -1) {
            this.applyList.splice(index, 1);
            this.setEmpty();
          }
        }
      },
      created() {
        this.initApplyList();
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
    width 90%
    height 100%
    padding-top 50px
    position relative
    margin 0 auto
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content flex-start
    align-items flex-start
  .empty
    visibility hidden
    width 320px
    height 168px
    display inline-block
    vertical-align top
    margin-bottom 30px
    margin-left 16px
    margin-right 16px
</style>
