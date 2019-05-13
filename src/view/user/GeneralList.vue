<template>
    <div class="main-container">
      <div class="sub-container">
        <div class="nav-bar">
          <el-select class="select select-left" v-model="shopType" placeholder="请选择">
            <el-option
              v-for="(item, index) in types"
              :key="index"
              :value="item">
              <span>{{ item }}</span>
            </el-option>
          </el-select>
          <el-select class="select" v-model="sort" placeholder="请选择">
            <el-option
              v-for="(item, index) in sortType"
              :key="index"
              :value="item">
              <span>{{ item }}</span>
            </el-option>
          </el-select>
          <el-cascader
            style="float: right"
            size="large"
            :options="options"
            v-model="district"
            @change="handleChange"
            class="form-input"
          />
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select search-input">
            <el-button class="search-button" slot="append" @click="searchShop">
              <i class="el-icon-search search-icon"></i>
            </el-button>
          </el-input>
        </div>

        <div class="shop-list">
          <shop-card v-for="(item, index) in shopList" :shopInfo="item" :key="item.id" :index="index"></shop-card>
          <div class="empty" v-for="(item, index) in emptyNum" :key="index-20"></div>
        </div>

        <el-pagination
          class="page"
          v-if="totalItems > 0"
          background
          layout="prev, pager, next"
          :total="totalItems"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange">
        </el-pagination>

      </div>

    </div>
</template>

<script>
    import '../../components/shop/ShopCard'
    import ShopCard from "../../components/shop/ShopCard";
    import AMap from 'AMap';
    import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data';
    export default {
      components: {ShopCard},
      name: "general-list",
      data() {
        return {
          shopType: '所有类型',
          types: ['所有类型','美食','快餐便当','特色菜系','异国料理','小吃夜宵','甜品饮品','果蔬生鲜','商店超市','鲜花绿植','医药健康'],
          sort: '默认排序',
          sortType: ['默认排序','按销量','按距离'],
          search: '',
          shopList: [],
          totalItems: 0,
          currentPage: 1,
          pageSize: 16,
          emptyNum: 0,
          options: provinceAndCityData
        }
      },
      computed: {
        district: {
          get() {
            return this.$store.state.user.userCity;
          },
          set(value) {
            this.$store.commit('setUserCity', value);
          }
        }
      },
      methods: {
        initList: function () {
          if (!this.district || this.district.length === 0) {
            let vm = this;
            AMap.plugin('AMap.CitySearch', function () {
              var citySearch = new AMap.CitySearch();
              citySearch.getLocalCity(function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  // 查询成功，result即为当前所在城市信息
                  var cityinfo = result.city;
                  var provinceInfo = result.province;

                  vm.$ajax.get('/shop/list/city', {
                    params: {
                      size: vm.pageSize,
                      page: vm.currentPage,
                      city: cityinfo
                    }
                  }).then((response) => {
                    let data = response.data;
                    let page = data.data;
                    vm.shopList = page.content;
                    vm.totalItems = page.totalItems;
                    vm.emptyNum = page.emptyNum;
                  });

                  vm.district = [TextToCode[provinceInfo].code, TextToCode[provinceInfo][cityinfo].code];
                }
              });
            });
          } else {
            this.$ajax.get('/shop/list/city', {
              params: {
                size: this.pageSize,
                page: this.currentPage,
                city: CodeToText[this.district[1]]
              }
            }).then((response) => {
              let data = response.data;
              let page = data.data;
              this.shopList = page.content;
              this.totalItems = page.totalItems;
              this.emptyNum = page.emptyNum;
            })
          }
        },
        handleCurrentChange: function (val) {
          this.currentPage = val;
          this.initList();
        },
        handleChange: function () {
          this.$ajax.get('/shop/list/city', {
            params: {
              size: this.pageSize,
              page: this.currentPage,
              city: CodeToText[this.district[1]]
            }
          }).then((response) => {
            let data = response.data;
            let page = data.data;
            this.shopList = page.content;
            this.totalItems = page.totalItems;
            this.emptyNum = page.emptyNum;
          })
        },
        searchShop: function () {
          let type = null;
          if (this.shopType !== '所有类型'){
            type = this.types.indexOf(this.shopType);
            this.$ajax.get('/shop/search', {
              params: {
                size: this.pageSize,
                page: this.currentPage,
                city: CodeToText[this.district[1]],
                shopType: type,
                keyword: this.search
              }
            }).then((response) => {
              let data = response.data;
              let page = data.data;
              this.shopList = page.content;
              this.totalItems = page.totalItems;
              this.emptyNum = page.emptyNum;
            })
          } else {
            this.$ajax.get('/shop/list/city', {
              params: {
                size: this.pageSize,
                page: this.currentPage,
                city: CodeToText[this.district[1]]
              }
            }).then((response) => {
              let data = response.data;
              let page = data.data;
              this.shopList = page.content;
              this.totalItems = page.totalItems;
              this.emptyNum = page.emptyNum;
            })
          }
        }
      },
      created() {
        this.initList();
      },
      watch: {
        shopType(newVal){
          this.searchShop();
        }
      }
    }
</script>

<style lang="stylus" scoped>
  .main-container
    width 100%
    height 100%
  .sub-container
    width 70%
    margin 0 auto
    height 100%
  .search-input
    width 500px
    float right
    margin-right 20px
  .select
    width 120px
    float left
  .select-left
    margin-right 20px
  .search-button:hover
    cursor pointer
  .search-button:active
    padding 14px 18px 10px 22px
  .search-button
    width 70px
  .nav-bar
    height 50px
  .shop-list
    width 100%
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content flex-start
    align-items flex-start
    padding-top 20px
    margin-bottom 50px
  .empty
    visibility hidden
    height 386px
    width 300px
    margin 12px
  .empty:nth-child(4n)
    margin-right 0
  .empty:nth-child(4n+1)
    margin-left 0
  .page
    text-align center
</style>
