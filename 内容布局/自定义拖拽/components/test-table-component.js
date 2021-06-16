Vue.component('portal-table',{
    props:['item'],
    mounted(){
        console.log('rightBoard---',this);
        this.tableData = this.item.config.tableData;
        this.tableColumn = this.item.config.tableColumn;
    },
    data(){
        return {
            tableData: [],
            tableColumn:[]
        }
    },
    /*  watch:{
        item:{
            handle(val){
                console.log('------------protal-table',val);
                this.tableData = val.config.tableData;
                this.tableColumn = val.config.tableColumn;
            },
            deep:true
        }
    },*/
    template: `
            <el-table
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="地址">
                  </el-table-column>
            </el-table>
        `
})
