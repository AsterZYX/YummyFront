<template>
  <div class="main-container">
    <div class="form-title">
      <md-icon class="form-title-icon">account_box</md-icon>
      <span class="form-title-text">用户统计</span>
    </div>
    <div class="form-content">
      <el-card>
        <div ref="userSignChart" style="width: 100%; height: 600px"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
    let echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/line');
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    require('echarts/lib/component/title');
    require('echarts/lib/component/axisPointer');
    require('echarts/lib/component/toolbox');
    export default {
        name: "user-statistics",
        data(){
          return {
            userSignData: {
              date: [],
              total: [],
              growth: []
            }
          }
        },
        created(){
        },
        mounted(){
          this.getUserSignData();
        },
        methods: {
          initUserSignChart: function () {
            let vm = this;
            let userSignChart = echarts.init(this.$refs.userSignChart);
            userSignChart.setOption({
              title: {
                text: '近15日用户总量及增长量'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  crossStyle: {
                    color: '#999'
                  }
                }
              },
              toolbox: {
                feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
                }
              },
              legend: {
                data:['总人数','增长数']
              },
              xAxis: [
                {
                  type: 'category',
                  data: vm.userSignData.date,
                  axisPointer: {
                    type: 'shadow'
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  name: '总人数',
                  minInterval: 1,
                  axisLabel: {
                    formatter: '{value} 人'
                  }
                },
                {
                  type: 'value',
                  name: '增长数',
                  minInterval: 1,
                  axisLabel: {
                    formatter: '{value} 人'
                  }
                }
              ],
              series: [
                {
                  name:'总人数',
                  type:'bar',
                  data:vm.userSignData.total
                },
                {
                  name:'增长数',
                  type:'line',
                  data:vm.userSignData.growth
                }
              ]
            })
          },
          getUserSignData: function () {
            this.$ajax.get('/user/sign/data').then((response) => {
              let data = response.data;
              if (data.code === 0){
                for (let i=0; i<data.data.length; i++){
                  this.userSignData.date.push(data.data[i].date);
                  this.userSignData.total.push(data.data[i].total);
                  this.userSignData.growth.push(data.data[i].growth);
                }
                this.initUserSignChart();
              }
            })
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
    padding-top 50px
</style>
