<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">shopping_basket</md-icon>
      <span class="form-title-text">满减活动</span>
      <md-button class="add-button md-primary" @click="showDialog = true">
        <md-icon>add</md-icon>
        <span>添加优惠</span>
      </md-button>
    </div>
    <div class="sub-container">
      <el-table
        :data="discountList"
        style="width: 100%"
        stripe
        align="center">
        <el-table-column
          fixed
          prop="name"
          label="活动名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="spend"
          label="满减标准"
          width="120">
        </el-table-column>
        <el-table-column
          prop="discount"
          label="折扣"
          width="120">
        </el-table-column>
        <el-table-column
          prop="startDate"
          label="开始时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="discountState"
          label="状态"
          width="100">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button v-show="discountList[scope.$index].discountState !== '已结束'" type="text" size="small" @click="deleteDiscount(scope.$index, discountList)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>新增优惠</md-dialog-title>
      <md-dialog-content>
        <el-form label-position="right" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="name" class="form-input" />
          </el-form-item>
          <el-form-item label="满减标准">
            <el-input-number v-model="spend" controls-position="right" class="number-input" />
          </el-form-item>
          <el-form-item label="折扣">
            <el-input-number v-model="discount" controls-position="right" class="number-input" />
          </el-form-item>
          <el-form-item label="优惠时间">
            <el-date-picker
              v-model="date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="main-button" @click="confirmDiscount">确认</md-button>
        <md-button class="sub-button" @click="cancelDiscount">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
    export default {
        name: "shop-discount",
        data() {
          return {
            pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
            discountList:[],
            showDialog: false,
            name: '',
            spend: '',
            discount: '',
            date: '',
            status: ''
          }
        },
        methods: {
          confirmDiscount: function () {
            this.showDialog = false;

            this.$ajax.post('/shop/discount/'+this.$store.getters.identifyCode, {
              name: this.name,
              spend: this.spend*1.0,
              discount: this.discount*1.0,
              startDate: this.date[0],
              endDate: this.date[1]
            }).then((response) => {
              let data = response.data;
              if (data.code === 0){
                this.discountList.push(data.data);
              }
            })
          },
          cancelDiscount: function () {
            this.showDialog = false;
            this.name = '';
            this.spend = '';
            this.discount = '';
            this.date = '';
          },
          initDiscount: function () {
            this.$ajax.post('/shop/discount/list', this.qs.stringify({
              identifyCode: this.$store.getters.identifyCode
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                console.log(data.data);
                this.discountList = data.data;
              }
            })
          },
          deleteDiscount: function (index, tableData) {
            this.$ajax.post('/shop/discount/delete', this.qs.stringify({
              id: tableData[index].id
            })).then((response) => {
              let data = response.data;
              if (data.code === 0){
                tableData.splice(index, 1, data.data);
              }
            })
          }
        },
        created() {
          this.initDiscount();
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
  .sub-container
    width 80%
    margin 0 auto
    padding-top 50px
  .add-button
    float right
    margin 0
    margin-right 150px
    /*border 1px solid #C9A990*/
  .form-input
    width 500px
  .number-input
    width 200px
  .main-button
    background-color #C9A990
    color white !important
    width 100px
  .sub-button
    background-color #ececec
    width 100px
</style>
