Vue.component('layout-item',{
    name:'layout-item',
    props:['record'],
    data(){
        return {}
    },
    mounted(){
        console.log(this.record);
    },
    template:`
      <div
        class="grid-box"
        @click.stop="handleSelectItem(record)"
      >
        <el-row class="grid-row" :gutter="record.options.gutter">
          <el-col
            class="grid-col"
            v-for="(colItem, idnex) in record.columns"
            :key="idnex"
            :span="colItem.span || 0"
          >
            <draggable
              tag="div"
              class="draggable-box"
              v-bind="{
                group: 'form-draggable',
                ghostClass: 'moving',
                animation: 180,
                handle: '.drag-move'
              }"
              :force-fallback="true"
              v-model="colItem.list"
              @start="$emit('dragStart', $event, colItem.list)"
              @add="$emit('handleColAdd', $event, colItem.list)"
            >
              <transition-group tag="div" name="list" class="list-main">
                <layoutItem
                  class="drag-move"
                  v-for="item in colItem.list"
                  :key="item.key"
                  :startType="startType"
                  :insertAllowedType="insertAllowedType"
                  :record="item"
                  :hideModel="hideModel"
                  :config="config"
                  @handleSelectItem="handleSelectItem"
                  @handleColAdd="handleColAdd"
                  @handleCopy="$emit('handleCopy')"
                  @handleShowRightMenu="handleShowRightMenu"
                  @handleDetele="$emit('handleDetele')"
                />
              </transition-group>
            </draggable>
          </el-col>
        </el-row>

        <div
          class="copy"
        
          @click.stop="$emit('handleCopy')"
        >
          <i class="el-icon-copy-document" />
        </div>
        <div
          class="delete"
        
          @click.stop="$emit('handleDetele')"
        >
          <i class="el-icon-delete" />
        </div>
      </div>
   
    `
});

const vm = new Vue({
    el:'#home',
    name: "clone",
    data() {
        return {
            //左边的组件列表
            layoutArray:[
                {
                    type:"grid",
                    label:"栅格布局",
                    columns:[{"span":12,"list":[]},{"span":12,"list":[]}],
                    options:{"gutter":0,"dynamicVisible":false,"dynamicVisibleValue":""},
                    key:"grid_1623984443365",
                    model:"grid_1623984443365"
                }
            ],
            // 基础配置
            data: {
                list: [

                ],
                config: {
                    labelPosition: "left",
                    labelWidth: 100,
                    size: 'mini',
                    outputHidden: true ,//  是否输出隐藏字段的值 默认打开,所有字段都输出
                    hideRequiredMark: true ,
                    customStyle: ""
                }
            },

            arr1: [
                { id: 1, name: 'www.itxst.com' },
                { id: 2, name: 'www.jd.com' },
                { id: 3, name: 'www.baidu.com' },
                { id: 3, name: 'www.taobao.com' }
            ],
            arr2: [
                { id: 1, name: 'www.google.com' },
                { id: 2, name: 'www.msn.com' },
                { id: 3, name: 'www.ebay.com' },
                { id: 4, name: 'www.yahoo.com' }
            ],
        };
    },

    watch: {
        data :{
            handler(newValue, oldValue){
                if(this.selectForm && this.selectForm.id) {
                    // 修改数据发生变化
                    //this.selectForm.change = true
                    const jsonForm = JSON.stringify(this.selectForm.htmlModel)
                    const jsonData = JSON.stringify(this.data)
                    if(jsonForm != jsonData){
                        this.$set(this.selectForm , 'change' , true)
                        this.$set(this.selectForm , 'htmlModel' , cloneDeep(this.data))
                    }
                }
            },
            //对象的深度监听deep，默认为false不进行深度监听
            deep: true
        },
        selectForm :{
            handler(newValue, oldValue){
                if(newValue && newValue.id != (oldValue ? oldValue.id: '')) {
                    // 修改数据发生变化

                    const htmlModel = newValue.htmlModel

                    let jsonModel = htmlModel ? (typeof htmlModel == 'object' ? htmlModel : JSON.parse(htmlModel) ) : null

                    this.initModel(cloneDeep(htmlModel))

                }
            },
            //对象的深度监听deep，默认为false不进行深度监听
            deep: true
        },

    },

    methods: {
        //开始拖拽
        handleStart(e,list) {
            //
            var index = e.oldIndex;
            this.generateKey(list,index)
        },
        generateKey(list, index) {
            // 生成key值
            const key = list[index].type + "_" + new Date().getTime();
            this.$set(list, index, {
                ...list[index],
                key,
                model: key
            });
        },

        deepClone(evt) {
            const newIndex = evt.newIndex;

            // json深拷贝一次
            const listString = JSON.stringify(this.data.list);
            this.data.list = JSON.parse(listString);
            // 删除icon及compoent属性
            delete this.data.list[newIndex].icon;
            delete this.data.list[newIndex].component;
            this.$emit("handleSetSelectItem", this.data.list[newIndex]);
            console.log(this.data.list);
        },
    }
})


var js = {
    "list": [
        {
            "type": "grid",
            "label": "栅格布局",
            "columns": [
                {
                    "span": 12,
                    "list": [
                        {
                            "type": "grid",
                            "label": "栅格布局",
                            "columns": [
                                {
                                    "span": 12,
                                    "list": [
                                        {
                                            "type": "rate",
                                            "label": "评分",
                                            "index": "I",
                                            "options": {
                                                "defaultValue": 0,
                                                "max": 5,
                                                "tooptip": "",
                                                "disabled": false,
                                                "hidden": false,
                                                "allowHalf": false,
                                                "dynamicHide": false,
                                                "dynamicHideValue": ""
                                            },
                                            "model": "rate_1624002723850",
                                            "key": "rate_1624002723850",
                                            "rules": [
                                                {
                                                    "required": false,
                                                    "message": "必填项",
                                                    "trigger": [
                                                        "change",
                                                        "blur"
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "span": 12,
                                    "list": [
                                        {
                                            "type": "rate",
                                            "label": "评分",
                                            "index": "I",
                                            "options": {
                                                "defaultValue": 0,
                                                "max": 5,
                                                "tooptip": "",
                                                "disabled": false,
                                                "hidden": false,
                                                "allowHalf": false,
                                                "dynamicHide": false,
                                                "dynamicHideValue": ""
                                            },
                                            "model": "rate_1624002733142",
                                            "key": "rate_1624002733142",
                                            "rules": [
                                                {
                                                    "required": false,
                                                    "message": "必填项",
                                                    "trigger": [
                                                        "change",
                                                        "blur"
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "options": {
                                "gutter": 0,
                                "dynamicVisible": false,
                                "dynamicVisibleValue": ""
                            },
                            "key": "grid_1624002687289"
                        },
                        {
                            "type": "rate",
                            "label": "评分",
                            "index": "I",
                            "options": {
                                "defaultValue": 0,
                                "max": 5,
                                "tooptip": "",
                                "disabled": false,
                                "hidden": false,
                                "allowHalf": false,
                                "dynamicHide": false,
                                "dynamicHideValue": ""
                            },
                            "model": "rate_1624000850905",
                            "key": "rate_1624000850905",
                            "rules": [
                                {
                                    "required": false,
                                    "message": "必填项",
                                    "trigger": [
                                        "change",
                                        "blur"
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "span": 12,
                    "list": [
                        {
                            "type": "button",
                            "label": "按钮",
                            "index": "O",
                            "options": {
                                "type": "primary",
                                "handle": "submit",
                                "textAlign": "left",
                                "dynamicFun": "",
                                "tooptip": "",
                                "hidden": false,
                                "disabled": false,
                                "dynamicHide": false,
                                "dynamicHideValue": ""
                            },
                            "key": "button_1624000850905",
                            "model": "button_1624000850905"
                        },
                        {
                            "type": "rate",
                            "label": "评分",
                            "index": "I",
                            "options": {
                                "defaultValue": 0,
                                "max": 5,
                                "tooptip": "",
                                "disabled": false,
                                "hidden": false,
                                "allowHalf": false,
                                "dynamicHide": false,
                                "dynamicHideValue": ""
                            },
                            "model": "rate_1624002721467",
                            "key": "rate_1624002721467",
                            "rules": [
                                {
                                    "required": false,
                                    "message": "必填项",
                                    "trigger": [
                                        "change",
                                        "blur"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "options": {
                "gutter": 0,
                "dynamicVisible": false,
                "dynamicVisibleValue": ""
            },
            "key": "grid_1624000854266"
        }
    ],
    "config": {
        "labelPosition": "top",
        "labelWidth": 100,
        "size": "medium",
        "outputHidden": true,
        "hideRequiredMark": true,
        "customStyle": ""
    }
}
