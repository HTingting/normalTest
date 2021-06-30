Vue.component('right-board', {
    props: ['currentItem', 'refItem'],
    mounted() {
        //console.log('rightBoard---',Vue.$refs)
    },
    methods: {
        addTableData() {
            var value = {date: '2016-05-02', name: '王小虎2', address: '上海市普陀区金沙江路 1518 弄'};
            this.currentItem.config.tableData.push(value);
        }
    },
    /*这个难道要根据不同组件来做这个属性的处理吗？？？*/
    template: `
            <div class="right-board">
              <h3>{{currentItem.text}}</h3>
              <h4>配置相关信息</h4>
              <!--表格列表-->
              <ul v-if="currentItem.config.tag === 'table'">
                <li v-for="cell in currentItem.config.tableData">
                    {{cell.date}}- {{cell.name}} - {{cell.address}}
                </li>
              </ul>
              <el-button @click="addTableData">添加数据</el-button>
              <h4>配置的列数据</h4>
              <ul v-if="currentItem.config.tag === 'table'">
                <li v-for="column in currentItem.config.tableColumn">
                    {{column.prop}}-{{column.label}}
                </li>
              </ul>
              <!--表格数据-->
              {{currentItem.config.dataSource}}
              <ul>
                <li v-for="dataItem in currentItem.config.dataSource">
                    <el-input v-model="dataItem.num" placeholder="请输入内容"></el-input>
                </li>
              </ul>
            </div>
  `
})
