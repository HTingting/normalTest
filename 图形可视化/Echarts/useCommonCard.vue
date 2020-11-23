<template>
    <common-card title="" value="">
        <!--这里就是默认的slot，没有名字的slot-->
        <template>
            <div class="charts">

            </div>
        </template>
        <template v-slot:footer>
            <span class="自定义的class">自定义内容</span>
        </template>
    </common-card>
</template>

<script>
    export default {
        name: '',
        data() {
            return {}
        },
        mounted(){
            const chartDom = document.getElementById('charts');
            //echart初始化
            const chart = this.$echarts.init(chartDom);
            chart.setOptions({
                //不展示x轴
                xAxis:{
                    type:'category',
                    show:false,
                    boundaryGap:false,  //设置x轴的间距
                },
                //不展示y轴
                yAxis:{
                    show:false
                },
                series:[{
                    type:'line',   //需要制定类型
                    data:[123,455,123,45,6,34,56,78,90],
                    //设置面积的样式
                    areaStyle:{
                        color:'purple'
                    },
                    //折线图，设置线段的样式，不展示线段
                    lineStyle:{
                       width:0,
                    },
                    //点不用展示出来
                    itemStyle:{
                      opacity:0,
                    },
                    smooth:true,  //去掉锯齿
                }],
                //设置图标的位置
                grid:{
                    top:0,
                    bottom:0,
                    left:0,
                    right:0
                }
            })
        },
        methods: {}
    }
</script>

<style scoped lang="">

</style>

