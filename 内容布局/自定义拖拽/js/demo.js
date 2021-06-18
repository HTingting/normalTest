let mouseXY = {"x": null, "y": null};
let DragPos = {"x": null, "y": null, "w": 1, "h": 1, "i": null};

Vue.component('grid-item-render', {
    props: ['item'],
    watch: {
        item: {
            handler(val) {
                this.renderData = val;
            },
            deep:true,
        },
    },
    data(){
        return {
            renderData:{}
        }
    },
    render(h){
        //设置render函数
        if(this.item.tag){
            return h('portal-'+this.item.tag,{props:{item:this.item}})
        }
    }
});

const defaultLayout = [
    {"x": 0, "y": 0, "w": 2, "h": 2, "i": "0",config:{}},
    {"x": 2, "y": 0, "w": 2, "h": 4, "i": "1",config:{}},
    {"x": 4, "y": 0, "w": 2, "h": 5, "i": "2",config:{}},
];
const vm = new Vue({
    el: '#container',
    data() {
        return {
            leftData: [
                {
                    id: 1,
                    value: 1,
                    tag: 'table',
                    text:"测试表格",
                    config:{
                        tableData: [{
                            date: '2016-05-02',
                            name: 'Harry',
                            address: '上海市普陀区金沙江路 1518 弄'
                        }],
                        tableColumn:[
                            {prop:'date',label:'日期',width:'180'},
                            {prop:'name',label:'姓名',width:'180'},
                            {prop:'address',label:'地址',width:'180'}
                        ]
                    }
                },
                {
                    id: 2,
                    value: 2,
                    tag: 'panel',
                    text:"测试面板",
                    config:{
                        title:'',
                        dataSource:[
                            {id:'a',text:'带续费项',num:5},
                            {id:'b',text:'待支付订单',num:10},
                            {id:'c',text:'代办工单',num:9},
                        ]
                    }
                }
            ],
            layout: defaultLayout,
            index: 0,
            currentIndex:0,
            currentItem:{},
            saveLayoutDebounce: this.debounce(340,this.saveLayout)
        }
    },
    watch:{
        //这里又不能监听，因为这个位置变化也涉及多层监听
        layout: {
            handler(val) {
                //console.log('layout-----更新监听',val)
                //this.saveLayoutDebounce(val)
            },
            deep: true
        },

    },
    created(){
        localStorage.setItem('LAYOUT_LIST',JSON.stringify(this.layout));
        this.currentItem = this.layout[0];
    },
    mounted() {
        document.addEventListener("dragover", function (e) {
            mouseXY.x = e.clientX;
            mouseXY.y = e.clientY;
        }, false);
    },
    methods: {
        debounce:function(wait,fn){
            var timer = null;

            return function () {
                var context = this,args = arguments;

                if(timer){
                    clearTimeout(timer);
                    timer = null;
                }

                timer = setTimeout(() => {
                    fn.apply(context,args);
                },wait)
            }
        },
        saveLayout:function(val){
            localStorage.setItem('LAYOUT_LIST', JSON.stringify(val))
        },
        getLayout:function(val){
            localStorage.getItem('LAYOUT_LIST');
        },
        drag: function (e) {
            //用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left等属性
            let parentRect = document.getElementById('content').getBoundingClientRect();
            let mouseInGrid = false;
            //判断当前鼠标位置，是否在主面板内
            if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
                mouseInGrid = true;
            }
            //当前鼠标位置在主面板内，且主面板元素内没有正在移动的元素？
            if (mouseInGrid === true && (this.layout.findIndex(item => item.i === 'drop')) === -1) {
                this.layout.push({
                    x: (this.layout.length * 2) % (this.colNum || 12),
                    y: this.layout.length + (this.colNum || 12), // puts it at the bottom
                    w: 1,
                    h: 1,
                    i: 'drop',
                });
            }
            let index = this.layout.findIndex(item => item.i === 'drop');

            if (index !== -1) {
                try {
                    this.$refs.gridlayout.$children[this.layout.length].$refs.item.style.display = "none";
                } catch {
                }
                //获取当前移动的el元素
                let el = this.$refs.gridlayout.$children[index];
                // dragging获取的是——当前元素距离主面板的相对位置，左和上的位置
                el.dragging = {"top": mouseXY.y - parentRect.top, "left": mouseXY.x - parentRect.left};
                // 把px单位转成栅格布局的单位
                let new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left);

                if (mouseInGrid === true) {
                    this.$refs.gridlayout.dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, 1, 1);
                    DragPos.i = String(index);
                    DragPos.x = this.layout[index].x;
                    DragPos.y = this.layout[index].y;
                }
                // 做法是移动默认添加一个drop的单元格；如果不在表格内，就把这个数据删掉。
                if (mouseInGrid === false) {
                    this.$refs.gridlayout.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 1, 1);
                    this.layout = this.layout.filter(obj => obj.i !== 'drop');
                }
            }
        },

        calcXY1:function(top, left) {
            const colWidth = this.calcColWidth();   //获取每一列的内容宽度

            // left = colWidth * x + margin * (x + 1)
            // l = cx + m(x+1)
            // l = cx + mx + m
            // l - m = cx + mx
            // l - m = x(c + m)
            // (l - m) / (c + m) = x
            // x = (left - margin) / (coldWidth + margin)
            let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
            let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));

            // Capping
            x = Math.max(Math.min(x, this.cols - this.innerW), 0);
            y = Math.max(Math.min(y, this.maxRows - this.innerH), 0);

            return {x, y};
        },

        calcColWidth() {
            // (总宽度 - 总的margin  /
            const colWidth = (this.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols;
            // console.log("### COLS=" + this.cols + " COL WIDTH=" + colWidth + " MARGIN " + this.margin[0]);
            return colWidth;
        },

        dragend: function (e) {
            let parentRect = document.getElementById('content').getBoundingClientRect();
            let mouseInGrid = false;
            if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
                mouseInGrid = true;
            }
            if (mouseInGrid === true) {
                alert(`Dropped element props:\n${JSON.stringify(DragPos, ['x', 'y', 'w', 'h'], 2)}`);
                this.$refs.gridlayout.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 1, 1);
                this.layout = this.layout.filter(obj => obj.i !== 'drop');
                // UNCOMMENT below if you want to add a grid-item
                this.layout.push({
                    x: DragPos.x,
                    y: DragPos.y,
                    w: 1,
                    h: 1,
                    i: DragPos.i,
                    tag: 'table',
                });
                /*this.$refs.gridLayout.dragEvent('dragend', DragPos.i, DragPos.x, DragPos.y, 1, 1);
                try {
                    this.$refs.gridLayout.$children[this.layout.length].$refs.item.style.display = "block";
                } catch {
                }*/
                this.currentIndex = DragPos.i;
            }
        },

        addComponent(item){
            //todo list 这里需要克隆一个新节点
            const cloneItem = JSON.parse(JSON.stringify((item)));
            console.log(cloneItem);
            this.index = +this.layout.length;
            this.layout.push({
                x: (this.layout.length * 2) % (this.colNum || 12),
                y: this.layout.length + (this.colNum || 12), // puts it at the bottom
                w: 2,
                h: 2,
                i: this.index,
                tag: cloneItem.tag,
                config: cloneItem.config
            });
            console.log(this.layout);

            // 克隆一份组件

            this.currentIndex = this.index;
            this.currentItem = cloneItem;
            console.log('currentItem----',this.currentItem);
            // Increment the counter to ensure key is always unique.
            this.index++;
        },

        // 移动事件监听，重新绑定当前activeItem对象
        moveEvent(i, newX, newY){
            const msg = "MOVE i=" + i + ", X=" + newX + ", Y=" + newY;
            if(i !== this.currentIndex){
                this.currentIndex = i;
                this.currentItem = this.layout.filter(val=>{
                    return val.i === i;
                });
                console.log(this.currentIndex,this.currentItem);
            }

            console.log(msg);
        },
    }
})
