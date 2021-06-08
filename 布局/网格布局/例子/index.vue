<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/html">
<!-- begin::Head -->

<head>
    <title>仪表板</title>
    <meta charset="UTF-8">
    <meta name="referrer" content="no-referrer-when-downgrade"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!--引入样式-->
    <link rel="stylesheet" href="/dataInsight/agcloud/framework/js-lib/element-2/element.css"/>
    <link rel="stylesheet" href="/dataInsight/agcloud/framework/icon-lib/agcloud-fonts/iconfont.css">
    <link rel="stylesheet" href="/dataInsight/agcloud/framework/ui-private/default/green/css/theme.css">
    <link rel="stylesheet" href="/dataInsight/agcloud/framework/js-lib/agcloud-lib/css/reset.css">
    <link rel="stylesheet" href="/dataInsight/common/css/layout.css">
    <script>
        var ctx = '/dataInsight/';
    </script>

    <script>
        var _REST_SERVERURL = ''; // 后端写入的接口前缀变量
        var pctx = '/dataInsight/';
        console.log(_REST_SERVERURL, pctx);
    </script>

</head>

<body>
<div id="dashboardPage" v-cloak
     class="dashboard-page absolute-top" :class="{'editable': editable }">
    <div class="db-header absolute-bottom">
        <dashboard-header @save-dashboard="saveDashboard" ref="dbHeader"></dashboard-header>
    </div>
    <div class="db-main absolute-top" :class="{'is-edit': editing}">
        <div class="db-main-left absolute-right">
            <div class="db-wrap absolute-bottom">
                <package-panel v-for="(u, i) in pageList" :key="i"
                               v-show="i===subjectActive" :dom-index="i" :ref="'panel_'+i">
                </package-panel>
            </div>
            <div class="db-footer absolute-top">
                <dashboard-footer></dashboard-footer>
            </div>
        </div>
        <div class="db-main-right absolute-left">
            <dashboard-setting></dashboard-setting>
        </div>
    </div>
    <folder-dialog ref="fDialogRef" :title.sync="fTitle" :visible.sync="fVisible"
                   dialog-type="chooseFolder" @ensure-choose="chooseFolder"></folder-dialog>
</div>
</body>
<!-- 配置文件引入 -->
<script src="/dataInsight/common/config/indexConf.js"></script>
<script src="/dataInsight/common/js/es6-promise/es6-promise-auto.js"></script>
<script src="/dataInsight/agcloud/framework/js-lib/jquery-v1/jquery.min.js"></script>
<script src="/dataInsight/agcloud/framework/js-lib/vue-v2/vue.js"></script>
<script src="/dataInsight/agcloud/framework/js-lib/element-2/element.js"></script>
<!--<script th:src="@{/agcloud/framework/js-lib/antV-g2-3.5.1/g2.min.js}"></script>-->
<script src="/dataInsight/common/js/antV-g2/g2.min.js"></script>
<script src="/dataInsight/common/js/vuex/vuex.js"></script>
<script src="/dataInsight/common/js/axios/axios.min.js"></script>
<script src="/dataInsight/agcloud/framework/js-lib/agcloud-lib/js/common_opus.js"></script>
<script src="/dataInsight/agcloud/framework/js-lib/agcloud-lib/js/mixins.js"></script>
<script src="/dataInsight/common/js/comm.js"></script>

<!--grid-area: 1 / 1 / span 24 / span 6;-->
<div id="gridLayout" v-cloak>
    <div class="grid-box"
         @mousemove="gridMousemove"
         @mouseup="gridMouseup">
        <div class="db-grid" ref="dbGridRef">
            <div v-for="(item,index) in layout"
                 :key="index"
                 class="dbg-item-wrap"
                 :class="{'deleted': item.deleted}"
                 :style="{
				     'grid-area':(item.y+1)+' / '+(item.x+1)+' / span '+item.h+' / span '+item.w,
				     'z-index': item.zIndex || 1
				    }">
                <div class="db-grid-unit"
                     v-loading="item.unitLoading!=0"
                     :class="{
				      'active':index===activeIndex,'opacity':opacity,
				      'show-title': item.titleChecked || item.jumpChecked,
				      'bgfff': checkBgfff(item)
				     }"
                     @mousedown.stop="gridItemMousedown($event, index, 'move-position')"
                     @click.right.stop="mouseRight($event, index)" @click.stop="emptyFn">
                    <div class="gu-title">
						<span v-show="item.titleChecked" class="chartu-title">
							{{item.titleText||item.name}}
						</span>
                        <span v-show="item.jumpChecked" class="chartu-jump" @click="clickSeeMore(item)">
							{{item.jumpText||'查看更多'}}<i class="ag ag-right-arrow"></i>
						</span>
                    </div>
                    <div class="gu-chart" :id="item.domId">
                        <!-- 表格 -->
                        <div v-if="item.chartType=='Table'">
                            <el-table border :data="item.tableData" width="100%"
                                      v-if="item.tableCol&&item.tableCol.length"
                                      :height="item.h*10-(item.titleChecked||item.jumpChecked?90:34)">
                                <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                                <el-table-column v-for="(tcol, tcoli) in item.tableCol" :key="tcoli"
                                                 show-overflow-tooltip
                                                 :label="tcol.columnAlias" :prop="tcol.propertyName"></el-table-column>
                            </el-table>
                        </div>
                        <!-- 指标 -->
                        <div v-else-if="item.chartType=='Index'" class="chart-index-wrap">
                            <div class="chic-left">
                                <div>{{item.indexName || '暂未选择'}}</div>
                                <div style="margin-top:5px;">{{item.indexNumber || '0'}}</div>
                            </div>
                            <div class="chic-right">
                                <img class="chic-icon" src="/dataInsight/dataSet/imgs/total_0.png" alt=""
                                     ondragstart="return false">
                            </div>
                        </div>
                        <!-- 文本 -->
                        <div v-else-if="item.chartType=='Text'" class="chart-text-wrap">
                            <el-input v-model="item.textContent"
                                      @mousedown.native.stop="textChartMouseDown($event,index,'move-position')"
                                      type="textarea" class="ctextareau" autosize :readonly="!editing"
                                      :rows="4"></el-input>
                        </div>
                        <!-- 图片 -->
                        <div v-else-if="item.chartType=='Img'" class="chart-img-wrap">
                            <img v-if="item.detailId" ondragstart="return false"
                                 :src="ctx+'rest/file/download?detailId='+item.detailId">
                        </div>
                    </div>
                    <div v-for="type in zoomTypeList" :key="type"
                         class="resize-icon" :class="[type.split('-')]"
                         @mousedown.stop="gridItemMousedown($event, index, type)"
                         @click.stop="emptyFn"></div>
                </div>
            </div>
        </div>
        <transition name="el-zoom-in-top">
            <div data-title="单个图表右键菜单" class="right-menu-wrap" @mouseleave="showRightMenu=false"
                 v-show="showRightMenu" :style="{top: rightMenuTop+'px',left:rightMenuLeft+'px'}">
                <div v-for="(u,i) in rightMenuList" :key="i"
                     class="right-menu-unit" @click.stop="clickRightMenu($event, u)">
                    {{u.text}}
                    <i class="ag" :class="[u.icon]"></i>
                </div>
            </div>
        </transition>
        <el-upload class="img-upload" action="rest/file/upload" :http-request="uploadImg"
                   ref="uploadImgRef" accept="image/png, image/jpeg" :show-file-list="false">
            <button class="upload-img-btn" ref="uploadBtnRef">-</button>
        </el-upload>
    </div>
</div>
<script>
    Vue.component('grid-layout', {
        template: '#gridLayout',
        mixins: [ALLMIXIN.COMMMIXIN],
        data: function () {
            return {
                ctx: ctx,
                rightOpeIndex: 0,
                dbGridRefWidth: 0, // grid宽度
                layout: [], // grid通过该输入生成布局
                colNum: 24, // 宽度分成多少等份
                itemMinWidth: 3, // 单个小图表最小宽度，4/24，宽度分成24份
                itemMinHeight: 10, // 单个小图表最小高度，10*10px=100px
                activeIndex: '', // 当前激活的组件
                mousedownEvent: null, // 保存鼠标按下事件数据
                opacity: false, // 正在拖拽或者改变大小的样式变为半透明
                zIndexOld: 1, // 临时保存编辑的item的z-index，结束后需要赋会原来的值
                zIndexNext: 1000, // 下一个grid item z-index值
                zIndexStep: 10, // 每新增一个 grid item z-index间隔
                zoomTypeList: [
                    'left-top', 'center-top', 'right-top',
                    'left-center', 'right-center',
                    'left-bottom', 'center-bottom', 'right-bottom'
                ], // 可操作缩放方向
                editType: '', // 对grid item的操作类型，移动还是缩放
                editGridItem: {}, // 深拷贝一份当前正在编辑的小图表数据
                chartInstDic: {}, // 所有小图表G2Plot实例，通过domId映射
                defaultChartCfg: {
                    unitLoading: 0,
                    datasetId: '', // 当前选中数据集id
                    dimesionList: [], // 选中的维度
                    mesureList: [], // 选中的度量
                    colorList: [], // 选中的颜色图例/维度
                    filterList: [], // 选中的过滤器
                    titleChecked: true, // 是否显示标题
                    titleText: '', // 标题文本
                    memoChecked: false, // 是否有显示备注
                    memoText: '', // 备注文本
                    digChecked: false, // 是否下钻
                    jumpChecked: false, // 是否有跳转链接
                    jumpText: '', // 跳转链接文本
                    jumpUrl: '', // 跳转链接url值
                    tableData: [], // 表格组件-表格数据
                    tableCol: [], // 表格组件-表格列数据
                    detailId: '', // 图片组件detailId
                    textContent: '', // 文本组件文本值
                    indexName: '', // 指标组件-指标文本
                    indexNumber: '', // 指标组件-指标数值
                },
                showRightMenu: false, // 是否展示右键菜单
                rightMenuTop: 0,
                rightMenuLeft: 0,
                rightMenuList: [
                    {text: '删除', clickFn: 'deleteGridItem', icon: 'ag-trash'},
                ],
            }
        },
        props: {
            domIndex: {
                type: Number,
                default: 0,
            }
        },
        computed: {
            // 是否允许编辑
            editing: function () {
                return this.$store.state.editing;
            },
            subjectActive: function () {
                return this.$store.state.subjectActive;
            },
        },
        created: function () {
            var vm = this;
            // 监听 loadByStore ，通过dashboard触发
            this.eventBus.$on('loadByStore', function () {
                var data = vm.$store.state.dashboardData.pageList[vm.domIndex].elementList || [];
                data = JSON.parse(JSON.stringify(data));
                var list = [];
                var maxIndex = 1000;
                data.forEach(function (u) {
                    var elementRenderer = u.elementRenderer;
                    if (elementRenderer) {
                        elementRenderer = JSON.parse(elementRenderer);
                    }
                    var o = $.extend({}, u, elementRenderer, {elementRenderer: ''});
                    maxIndex = maxIndex > o.zIndex ? maxIndex : o.zIndex;
                    list.push(o);
                });
                vm.zIndexNext = maxIndex + vm.zIndexStep;
                vm.layout = [];
                list.forEach(function (u) {
                    (function (u) {
                        vm.$nextTick(function () {
                            vm.layout.push(u);
                            (function (i) {
                                vm.loadChartData(i);
                            })(vm.layout.length - 1);
                        });
                    })(u);
                });
            });
            // 监听 addComponent 事件，可通过 header 组件触发
            this.eventBus.$on('addComponent', function (item) {
                if (vm.domIndex == vm.subjectActive) {
                    var row = JSON.parse(JSON.stringify(item));
                    row = $.extend({}, vm.defaultChartCfg, row);
                    row.elementCode = Date.now();
                    row.elementName = row.name;
                    row.widgetId = 'f21db1f5-7265-4107-93a1-c8f6ee158ef5';
                    vm.addComponent(row);
                }
            });
            // 监听 setGridActiveIndex，可通过 packagePanel 触发
            this.eventBus.$on('setGridActiveIndex', function (k) {
                if (vm.domIndex == vm.subjectActive) {
                    vm.activeIndex = k;
                    vm.$store.commit('setCfgPanelType', 'panel');
                }
            });
            var timerDic = {};
            // 监听 loadChartData，可通过 dashboard-setting 触发
            this.eventBus.$on('loadChartData', function () {
                if (vm.domIndex == vm.subjectActive) {
                    var index = vm.activeIndex;
                    if (index === '') return null;
                    window.clearTimeout(timerDic[index]);
                    timerDic[index] = window.setTimeout(function () {
                        vm.loadChartData(index);
                        window.clearTimeout(timerDic[index]);
                        timerDic[index] = null;
                    }, 1000);
                }
            });
            // 监听 loadChartSetting，可通过 footer 触发
            this.eventBus.$on('loadChartSetting', function () {
                if (vm.domIndex == vm.subjectActive) {
                    vm.loadChartCfg();
                }
            });
            // 监听 uploadImg，可通过 setting 触发
            this.eventBus.$on('uploadImg', function (file) {
                if (vm.domIndex == vm.subjectActive) {
                    vm.uploadImg(file);
                }
            });
        },
        methods: {
            developing: function () {
                this.$message('开发中...');
            },
            // 删除单个小图表
            deleteGridItem: function () {
                var index = this.rightOpeIndex;
                var curr = this.layout[index];
                this.$set(curr, 'deleted', true);
                var activeIndex = '';
                this.layout.forEach(function (u, i) {
                    if (!u.deleted) {
                        activeIndex = i;
                    }
                });
                this.activeIndex = activeIndex;
                this.loadChartCfg();
            },
            // 点击菜单某个
            clickRightMenu: function (ev, item) {
                ev.preventDefault();
                var fn = this[item.clickFn];
                typeof fn == 'function' && fn();
                this.showRightMenu = false;
            },
            // 单个小图表鼠标右击事件
            mouseRight: function (ev, i) {
                ev.preventDefault();
                this.rightOpeIndex = i;
                // 预览模式下直接return
                if (!this.editing) {
                    return null;
                }
                this.showRightMenu = true;
                this.rightMenuLeft = ev.clientX - 5;
                this.rightMenuTop = ev.clientY - 5;
            },
            // 通过维度和度量获取数据
            packageRequstParams: function (i) {
                var index = (typeof i == 'number' ? i : this.activeIndex);
                if (index === '') return null;
                var curr = this.layout[index];
                var row = curr.dimesionList;
                var column = curr.mesureList;
                var datasetId = '';
                var pageSize = 100;
                var queryDetail = false;
                if (curr.chartType == 'Table') {
                    if (row && row.length) {
                        // 需要至少一个维度才加载数据
                        datasetId = row[0].datasetId;
                    } else {
                        return null;
                    }
                } else if (curr.chartType == 'Index') {
                    if (column && column.length) {
                        // 需要至少一个度量才加载数据
                        datasetId = column[0].datasetId;
                        pageSize = 1;
                        queryDetail = true;
                    } else {
                        return null;
                    }
                } else {
                    if (row && row.length && column && column.length) {
                        // 需要至少一个维度和度量才加载数据
                        datasetId = row[0].datasetId;
                    } else {
                        return null;
                    }
                }
                return {
                    datasetId: datasetId,
                    row: row,
                    column: column,
                    filter: [],
                    pageNum: 1,
                    pageSize: pageSize,
                    queryDetail: queryDetail,
                }
                /*
				* 行列 row column
				* datasetColumnId 维度或度量ID
				* columnProperty 字段属性：m 度量、d 维度、默认为m
				* propertyId 对应属性ID
				* propertyAlias 属性别名。用于返回数据的属性名称
				* sqlTextType 扩展字段取值方式，0表示聚合函数，1表示聚合表达式，2表示sqlText
				* aggregationFunc 聚合函数，如count、avg、sum等
				* aggregationEl 聚合表达式
				* 过滤器 filter
				* datasetColumnId 维度或度量ID
				* propertyId 对应属性ID
				* columnProperty 字段属性：m 度量、d 维度、默认为m
				* sqlTextType 扩展字段取值方式，0表示聚合函数，1表示聚合表达式，2表示sqlText
				* aggregationFunc 聚合函数，如count、avg、sum等
				* aggregationEl 聚合表达式
				* condition 过滤条件 ==> valueOperator操作符。> < = in；values 值列表
				* textQueryOperator 多个过滤条件的链接方式，and表示并且，or表示或者
				*/
            },
            // 根据数据，绘制图表
            charting: function (data, i) {
                var vm = this;
                var index = (typeof i == 'number' ? i : this.activeIndex);
                if (index === '') return null;
                var curr = this.layout[index];
                var domId = curr.domId;
                var chartType = curr.chartType;
                var row = curr.dimesionList;
                var column = curr.mesureList;
                var G2PlotArr = ['Column', 'Pie'];
                if (G2PlotArr.indexOf(chartType) != -1) {
                    var dimesion = row[0].propertyName;
                    var mesure = column[0].propertyName;
                    var cfg = {};
                    if (chartType == 'Column') {
                        // 柱状图
                        if (row.length > 1) {
                            // 多维度
                            data.forEach(function (u) {
                                var strArr = [];
                                row.forEach(function (r) {
                                    strArr.push(u[r.propertyName].slice(0, 6));
                                });
                                u[row[0].propertyName] = strArr.join('-');
                            });
                        }
                        cfg = {
                            data: data,
                            xField: dimesion,
                            yField: mesure,
                            label: {position: 'middle', style: {fill: '#fff', opacity: 0.9,}},
                            xAxis: {label: {autoHide: true, autoRotate: true,}},
                            tooltip: {
                                showTitle: true,
                                formatter: function (data) {
                                    return {name: data[dimesion], value: data[mesure]};
                                },
                            },
                        };
                        if (data.length > 10) {
                            cfg.slider = {start: 0, end: 0.5};
                        }
                    } else if (chartType == 'Pie') {
                        // 饼图
                        cfg = {
                            data: data,
                            radius: 0.9, // 饼图的半径，原点为画布中心。配置值域为 (0,1]，1 代表饼图撑满绘图区域。
                            appendPadding: 10, // 额外增加的 appendPadding 值，在 padding 的基础上，设置额外的 padding 数值，可以是单个数字 16，或者数组 [16, 8, 16, 8] 代表四个方向。
                            angleField: mesure, // 扇形切片大小（弧度）所对应的数据字段名。
                            colorField: dimesion, // 扇形颜色映射对应的数据字段名。
                            label: {
                                type: 'spider',
                                content: '{name}\n{percentage}',
                            },
                            interactions: [{type: 'element-selected'}, {type: 'element-active'}],
                            tooltip: {showTitle: true,},
                        };
                    }
                    if (this.chartInstDic[domId]) {
                        this.chartInstDic[domId].update(cfg);
                    } else {
                        this.$nextTick(function () {
                            var plot = new G2Plot[chartType](domId, cfg);
                            plot.on('plot:click', function (o) {
                                console.log(o);
                            });
                            plot.on('element:click', function (o) {
                                console.log(o);
                            });
                            plot.render();
                            vm.chartInstDic[domId] = plot;
                        });
                    }
                } else {
                    // 其它图表
                    if (chartType == 'Table') {
                        curr.tableData = data;
                        curr.tableCol = row;
                    } else if (chartType == 'Index') {
                        try {
                            curr.indexName = column[0].propertyChineseName;
                            curr.indexNumber = data[0][column[0].propertyName];
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            },
            // 接口请求选中的小图表数据
            loadChartData: function (i) {
                var index = (typeof i == 'number' ? i : this.activeIndex);
                if (index === '') return null;
                this['loadChartData' + this.layout[index].chartType](index);
            },
            // 获取文本组件数据
            loadChartDataText: function (i) {
            },
            // 获取指标组件数据
            loadChartDataIndex: function (i) {
                this.loadChartDataBySettingRows(i);
            },
            // 获取图片组件数据
            loadChartDataImg: function (i) {
            },
            // 获取柱状图组件数据
            loadChartDataColumn: function (i) {
                this.loadChartDataBySettingRows(i);
            },
            // 获取饼图组件数据
            loadChartDataPie: function (i) {
                this.loadChartDataBySettingRows(i);
            },
            // 获取表格组件数据
            loadChartDataTable: function (i) {
                this.loadChartDataBySettingRows(i);
            },
            // 通过维度和度量获取组件数据
            loadChartDataBySettingRows: function (i) {
                var params = this.packageRequstParams(i);
                if (!params) return null;
                var vm = this;
                var index = (typeof i == 'number' ? i : this.activeIndex);
                this.layout[index].unitLoading++;
                this.http({
                    url: 'dashboard/statistical',
                    type: 'post',
                    noLoading: true,
                    ContentType: 'application/json',
                    data: JSON.stringify(params),
                    success: function (res) {
                        vm.charting(res.content.data || [], i);
                    },
                    final: function () {
                        vm.layout[index].unitLoading--;
                    },
                });
            },
            // 加载配置设置信息
            loadChartCfg: function () {
                var index = this.activeIndex;
                if (index === '') {
                    this.$store.commit('setCfgPanelType', 'panel');
                } else {
                    var current = this.layout[index];
                    this.$store.commit('setCfgPanelType', 'echart');
                    this.$store.commit('setCurrChartCfg', current);
                    this.eventBus.$emit('datasetIdChange'); // setting 组件接收
                }
            },
            // 新增组件
            addComponent: function (item) {
                var row = JSON.parse(JSON.stringify(item));
                var o = this.getAddComponentXY(row);
                row.x = o.x;
                row.y = o.y;
                row.zIndex = this.zIndexNext;
                row.domId = 'chart_' + this.domIndex + '_' + row.zIndex;
                this.zIndexNext += this.zIndexStep;
                this.layout.push(row);
                this.activeIndex = this.layout.length - 1;
                this.loadChartCfg();
                this.loadChartData();
                item.chartType == 'Img' && this.$refs.uploadBtnRef.click();
            },
            gridItemMousedown: function (e, index, type) {
                if (!this.editing) return null;
                var curr = this.layout[index];
                this.editType = type;
                this.dbGridRefWidth = this.$refs.dbGridRef.offsetWidth;
                this.mousedownEvent = e;
                this.activeIndex = index;
                this.opacity = true;
                this.zIndexOld = curr.zIndex;
                this.editGridItem = JSON.parse(JSON.stringify(curr));
                this.loadChartCfg();
                curr.zIndex = 8000; // 设置为一个很大的值，保证拖拽的时候不被其它组件遮盖中断
            },
            // 移动单个小图表
            gridMousemove: function (e) {
                if (!this.editing) return null;
                if (!this.opacity) return null;
                var minWidth = this.itemMinWidth; // 控件最小宽度
                var minHeight = this.itemMinHeight; // 空间高度最小高度
                var unitWidth = parseInt(this.dbGridRefWidth / this.colNum);
                var diffX = parseInt((e.pageX - this.mousedownEvent.pageX) / unitWidth);
                var diffY = parseInt((e.pageY - this.mousedownEvent.pageY) / 10);
                var curr = this.editGridItem;
                var type = this.editType;
                var x = curr.x;
                var y = curr.y;
                var w = curr.w;
                var h = curr.h;
                if (type == 'move-position') {
                    // 拖拽移动位置
                    x = x + diffX;
                    y = y + diffY;
                    if (x < 0) {
                        x = 0;
                    }
                    if (y < 0) {
                        y = 0;
                    }
                    var maxX = this.colNum - curr.w;
                    if (x > maxX) {
                        x = maxX;
                    }
                } else if (type == 'left-top') {
                    /**
                     * ↖ 左上调整大小 影响 x y w h
                     * 边界 minX minY maxX maxY
                     */
                    x = x + diffX;
                    y = y + diffY;
                    w = w - diffX;
                    h = h - diffY;
                    var minX = 0;
                    var minY = 0;
                    var maxX = curr.x + curr.w - minWidth;
                    var maxY = curr.y + curr.h - minHeight;
                    if (x < minX) {
                        x = minX;
                        w = curr.x + curr.w;
                    } else if (x > maxX) {
                        x = maxX;
                        w = minWidth;
                    }
                    if (y < minY) {
                        y = minY;
                        h = curr.y + curr.h;
                    } else if (y > maxY) {
                        y = maxY;
                        h = minHeight;
                    }
                } else if (type == 'center-top') {
                    /**
                     * ↑ 上中调整大小 影响 y h
                     * 边界 minY maxY
                     */
                    y = y + diffY;
                    h = h - diffY;
                    var minY = 0;
                    var maxY = curr.y + curr.h - minHeight;
                    if (y < minY) {
                        y = minY;
                        h = curr.y + curr.h;
                    } else if (y > maxY) {
                        y = maxY;
                        h = minHeight;
                    }
                } else if (type == 'right-top') {
                    /**
                     * ↗ 右上调整大小 影响 y w h
                     * 边界 minY maxY minW maxW
                     */
                    y = y + diffY;
                    w = w + diffX;
                    h = h - diffY;
                    var minY = 0;
                    var maxY = curr.y + curr.h - minHeight;
                    var maxW = this.colNum - curr.x;
                    if (w < minWidth) {
                        w = minWidth;
                    } else if (w > maxW) {
                        w = maxW;
                    }
                    if (y < minY) {
                        y = minY;
                        h = curr.y + curr.h;
                    } else if (y > maxY) {
                        y = maxY;
                        h = minHeight;
                    }
                } else if (type == 'left-center') {
                    /**
                     * ← 左中调整大小 影响 x w
                     * 边界 minX maxX
                     */
                    x = x + diffX;
                    w = w - diffX;
                    var minX = 0;
                    var maxX = curr.x + curr.w - minWidth;
                    if (x < minX) {
                        x = minX;
                        w = curr.x + curr.w;
                    } else if (x > maxX) {
                        x = maxX;
                        w = minWidth;
                    }
                } else if (type == 'right-center') {
                    /**
                     * → 右中调整大小 影响 w
                     * 边界 minW maxW
                     */
                    w = w + diffX;
                    var maxW = this.colNum - curr.x;
                    if (w < minWidth) {
                        w = minWidth;
                    } else if (w > maxW) {
                        w = maxW;
                    }
                } else if (type == 'left-bottom') {
                    /**
                     * ↙ 左下调整大小 影响 x w h
                     * 边界 minX maxX minH
                     */
                    x = x + diffX;
                    w = w - diffX;
                    h = h + diffY;
                    var minX = 0;
                    var maxX = curr.x + curr.w - minWidth;
                    if (x < minX) {
                        x = minX;
                        w = curr.x + curr.w;
                    } else if (x > maxX) {
                        x = maxX;
                        w = minWidth;
                    }
                    if (h < minHeight) {
                        h = minHeight;
                    }
                } else if (type == 'center-bottom') {
                    /**
                     * ↓ 下中调整大小 影响 h
                     * 边界 minH
                     */
                    h = h + diffY;
                    if (h < minHeight) {
                        h = minHeight;
                    }
                } else if (type == 'right-bottom') {
                    /**
                     * ↘ 右下调整大小 影响 w h
                     * 边界 minW maxW minH
                     */
                    w = w + diffX;
                    h = h + diffY;
                    var maxW = this.colNum - curr.x;
                    if (w < minWidth) {
                        w = minWidth;
                    } else if (w > maxW) {
                        w = maxW;
                    }
                    if (h < minHeight) {
                        h = minHeight;
                    }
                }
                if (this.activeIndex !== '') {
                    var target = this.layout[this.activeIndex];
                    target.x = x;
                    target.y = y;
                    target.w = w;
                    target.h = h;
                }
            },
            // 文件组件点击
            textChartMouseDown: function (e, index, type) {
                if (!this.editing) return null;
                var curr = this.layout[index];
                this.mousedownEvent = e;
                this.activeIndex = index;
                this.loadChartCfg();
            },
            gridMouseup: function (e) {
                if (!this.editing) return null;
                if (!this.opacity) return null;
                if (this.activeIndex !== '') {
                    // 设置编辑过grid item z-index为原来的值
                    this.layout[this.activeIndex].zIndex = this.zIndexOld;
                    this.opacity = false;
                }
            },
            // 计算得到插入组件的x和y值
            getAddComponentXY: function (item) {
                var maxY = this.getMaxY();
                var o = {x: 0, y: maxY};
                var width = item.w;
                var height = item.h;
                if (this.layout.length == 0 || width == this.colNum) {
                    return o;
                }
                var arr = this.getMatrixArr();
                var maxW = this.colNum - width + 1;
                var maxH = maxY - height + 1;
                for (var y = 0; y < maxH; y++) {
                    for (var x = 0; x < maxW; x++) {
                        if (this.countMatrix(y, x, width, height, arr) == 0) {
                            // 对应区域二维矩阵求和为零，说明能放下新加的组件
                            return {x: x, y: y};
                        }
                    }
                }
                return o;
            },
            // 得到0和1的二维矩阵，1代表该位置已被占用
            getMatrixArr: function () {
                var arr = [];
                var rowArr = [];
                // 计算现有高度，生成二维数组
                var maxY = this.getMaxY();
                for (var i = 0; i < this.colNum; i++) {
                    rowArr.push(0);
                }
                for (var i = 0; i < maxY; i++) {
                    arr.push(JSON.parse(JSON.stringify(rowArr)));
                }
                // 已占用的位置设为1
                this.layout.forEach(function (u) {
                    if (u.deleted) return null;
                    var h = u.y + u.h;
                    var w = u.x + u.w;
                    for (var y = u.y; y < h; y++) {
                        for (var x = u.x; x < w; x++) {
                            arr[y][x] = 1;
                        }
                    }
                });
                return arr;
            },
            // 二维矩阵求和
            countMatrix: function (y, x, w, h, arr) {
                var sum = 0;
                var maxY = y + h;
                var maxX = x + w;
                for (var i = y; i < maxY; i++) {
                    for (var j = x; j < maxX; j++) {
                        sum += arr[i][j];
                    }
                }
                return sum;
            },
            // 获取布局最大的y
            getMaxY: function () {
                var y = 0;
                this.layout.forEach(function (u) {
                    var _y = u.y + u.h;
                    y = y < _y ? _y : y;
                });
                return y;
            },
            getData: function () {
                return this.layout;
            },
            clickSeeMore: function (item) {
                var url = item.jumpUrl;
                if (url.length == 0) {
                    return this.$message.error('未设置跳转链接');
                }
                this.$util.openUrl(url);
            },
            checkBgfff: function (item) {
                var arr = ['Img', 'Text'];
                return arr.indexOf(item.chartType) == -1;
            },
            // 图片组件上传图片
            uploadImg: function (file) {
                var vm = this;
                var formData = new FormData();
                formData.append('file', file.file);
                this.uploadFile({
                    formData: formData,
                    success: function (res) {
                        var curr = vm.layout[vm.activeIndex];
                        var detailId = curr.detailId;
                        curr.detailId = res.content;
                        detailId && vm.deleteDetailId(detailId);
                    },
                });
            },
            emptyFn: function () {
            },
        },
    });
</script>
<style>
    .grid-box {
        height: 100%;
        overflow: hidden auto;
        background: #EEEFEF;
        position: relative;
        /*padding-bottom: 50px;*/
    }

    .db-grid {
        position: relative;
        display: grid;
        grid-template-columns: repeat(24, 1fr);
        padding: 5px;
        grid-auto-rows: 10px;
    }

    .dbg-item-wrap {
        padding: 5px;
    }

    .db-grid-unit {
        /*background: #fff;*/
        height: 100%;
        border-radius: 2px;
        /*border: 1px solid #fff;*/
        /*box-shadow: 0 0 1px 1px #EEEFEF;*/
        position: relative;
    }

    .db-grid-unit.bgfff {
        background: #fff;
    }

    .active.opacity.db-grid-unit {
        opacity: 0.5;
    }

    .gu-title {
        line-height: 49px;
        height: 50px;
        font-size: 16px;
        padding: 0 8px 0 24px;
        border-bottom: 1px solid #DCE0E7;
        position: relative;
        display: none;
    }

    .gu-chart {
        height: 100%;
        padding: 12px;
        padding-top: 14px;
        overflow: hidden;
        position: relative;
    }

    .show-title .gu-title {
        display: block;
    }

    .show-title .gu-chart {
        height: calc(100% - 50px);
    }

    .db-grid-unit, .gu-title {
        transition: all .3s;
    }

    .chartu-title {
        display: block;
        width: calc(100% - 88px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .chartu-jump {
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 8px;
        color: #808896;
        font-size: 14px;
    }

    .chartu-jump:hover {
        color: #242C3A;
    }

    .chartu-jump .ag {
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        font-size: 14px;
        margin-left: 2px;
    }

    .resize-icon {
        position: absolute;
        width: 10px;
        height: 10px;
        border-style: solid;
        border-color: #55BC8A;
        display: none;
        border-width: 0px;
    }

    .resize-icon.left {
        border-left-width: 4px;
        left: -3px;
    }

    .resize-icon.top {
        border-top-width: 4px;
        top: -3px;
    }

    .resize-icon.right {
        border-right-width: 4px;
        right: -3px;
    }

    .resize-icon.bottom {
        border-bottom-width: 4px;
        bottom: -3px;
    }

    .resize-icon.center.top,
    .resize-icon.center.bottom {
        left: 50%;
        margin-left: -2px;
        cursor: ns-resize;
    }

    .resize-icon.center.left,
    .resize-icon.center.right {
        top: 50%;
        margin-top: -2px;
        cursor: ew-resize;
    }

    .resize-icon.left.top,
    .resize-icon.right.bottom {
        cursor: nwse-resize;
    }

    .resize-icon.left.bottom,
    .resize-icon.right.top {
        cursor: nesw-resize;
    }

    .right-menu-wrap {
        position: fixed;
        z-index: 10000;
        background: #fff;
        user-select: none;
        box-shadow: 0 0 1px 1px #eeefef;
    }

    .right-menu-unit {
        cursor: pointer;
        line-height: 36px;
        width: 140px;
        padding-left: 40px;
        transition: all .3s;
        position: relative;
    }

    .right-menu-unit:hover {
        background: #E8F8F0;
        color: #55BC8A;
    }

    .right-menu-unit .ag {
        position: absolute;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        font-size: 16px;
        top: 8px;
        left: 12px;
    }

    .dbg-item-wrap.deleted {
        display: none;
    }

    .chart-index-wrap {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        height: 100%;
    }

    .chic-left {
        line-height: 24px;
        font-size: 20px;
        text-align: center;
    }

    .chic-right {
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .chic-icon {
        max-width: 54px;
        max-height: 54px;
    }

    .chart-img-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        position: relative;
    }

    .chart-img-wrap img {
        max-height: 100%;
        max-width: 100%;
    }

    .img-upload {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 10px;
        height: 10px;
        overflow: hidden;
        opacity: 0;
    }

    .chart-text-wrap {
        position: absolute;
        top: 12px;
        bottom: 12px;
        left: 12px;
        right: 0px;
    }

    .ctextareau {
        width: 100%;
        height: 100%;
        cursor: default;
    }

    .ctextareau textarea {
        border: none;
        padding: 0;
        line-height: 20px;
        resize: none;
        height: 100% !important;
        background: transparent;
    }

    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-corner,
    ::-webkit-scrollbar,
    ::-webkit-scrollbar-track-piece {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        /*border: 3px solid transparent;*/
    }
</style>


<div id="dbHeader" v-cloak>
    <div class="dbh-box c-f">
        <div class="dbh-left l">
            <el-input v-model="shareUrl" class="share-input" ref="shareInputRef"></el-input>
            <el-input v-model="topicName" placeholder="请输入专题名称" :readonly="!editing"></el-input>
            <transition name="el-fade-in">
                <div class="dbh-lopes c-f" v-show="editing&&false">
                    <el-tooltip :effect="leftEffect" content="撤销"
                                :placement="leftPlacement" :open-delay="openDelay">
                        <div class="dbhlu-ope" @click="developing">
                            <i class="ag ag-back"></i>
                        </div>
                    </el-tooltip>
                    <el-tooltip :effect="leftEffect" content="恢复"
                                :placement="leftPlacement" :open-delay="openDelay">
                        <div class="dbhlu-ope" @click="developing">
                            <i class="ag ag-reback"></i>
                        </div>
                    </el-tooltip>
                    <el-tooltip :effect="leftEffect" content="刷新"
                                :placement="leftPlacement" :open-delay="openDelay">
                        <div class="dbhlu-ope" @click="developing">
                            <i class="ag ag-sync"></i>
                        </div>
                    </el-tooltip>
                </div>
            </transition>
        </div>
        <transition name="el-fade-in">
            <div class="dbh-center l" v-show="editing">
                <div class="dbhcu-ope" v-for="item in widgetList" :key="item.name"
                     @click="clickComponent(item)">
                    <div class="dbhcu-icon"><i :class="item.icon"></i></div>
                    <div class="dbhcu-text">{{item.name}}</div>
                </div>
            </div>
        </transition>
        <div class="dbh-right r c-f">
            <el-tooltip :effect="rightEffect" content="设置"
                        :placement="rightPlacement" :open-delay="openDelay">
                <div class="dbhru-ope" @click="clickSetting">
                    <i class="ag ag-setting"></i>
                </div>
            </el-tooltip>
            <el-tooltip :effect="rightEffect" content="帮助"
                        :placement="rightPlacement" :open-delay="openDelay">
                <div v-show="false" class="dbhru-ope" @click="developing">
                    <i class="ag ag-question_outlined"></i>
                </div>
            </el-tooltip>
            <el-tooltip :effect="rightEffect" content="预览"
                        :placement="rightPlacement" :open-delay="openDelay">
                <div class="dbhru-ope" @click="preview">
                    <i class="ag ag-Preview_outlined"></i>
                </div>
            </el-tooltip>
            <el-tooltip :effect="rightEffect" content="保存"
                        :placement="rightPlacement" :open-delay="openDelay">
                <div class="dbhru-ope" @click="clickSave">
                    <i class="ag ag-save_outlined"></i>
                </div>
            </el-tooltip>
            <el-tooltip :effect="rightEffect" content="分享"
                        :placement="rightPlacement" :open-delay="openDelay">
                <div class="dbhru-ope" @click="clickShare">
                    <i class="ag ag-share_filling"></i>
                </div>
            </el-tooltip>
            <el-tooltip :effect="rightEffect" content="关闭"
                        :placement="rightPlacement" :open-delay="openDelay">
                <div v-show="false" class="dbhru-ope" @click="developing">
                    <i class="ag ag-poweroff"></i>
                </div>
            </el-tooltip>
        </div>
    </div>
</div>
<script>
    Vue.component('dashboard-header', {
        template: '#dbHeader',
        data: function () {
            return {
                leftEffect: 'light',
                leftPlacement: 'top',
                openDelay: 300, // 提示信息延迟出现，单位毫秒
                rightEffect: 'light',
                rightPlacement: 'top',
                widgetList: [
                    {name: '柱状图', icon: 'el-icon-s-data', w: 8, h: 32, chartType: 'Column'},
                    {name: '饼图', icon: 'el-icon-help', w: 8, h: 32, chartType: 'Pie'},
                    {name: '表格', icon: 'ag ag-view_outlined', w: 12, h: 40, chartType: 'Table'},
                    {name: '指标', icon: 'ag ag-number', w: 4, h: 11, chartType: 'Index', titleChecked: false},
                    {
                        name: '图片', icon: 'el-icon-picture-outline',
                        w: 4, h: 20, chartType: 'Img', titleChecked: false
                    },
                    {name: '文本', icon: 'el-icon-edit', w: 12, h: 20, chartType: 'Text', titleChecked: false},
                ],
                shareUrl: '',
            }
        },
        props: {},
        created: function () {
        },
        computed: {
            editing: function () {
                return this.$store.state.editing;
            },
            topicName: {
                get: function () {
                    return this.$store.state.dashboardData.dashboardName;
                },
                set: function (val) {
                    this.$store.commit('setDashboardName', val);
                },
            },
        },
        methods: {
            // 点击保存
            clickSave: function () {
                this.$emit('save-dashboard');
            },
            getData: function () {
                return {dashboardName: this.topicName};
            },
            validateSave: function () {
                var flag = true;
                if (this.topicName.length == 0) {
                    flag = false;
                    this.$message.warning('请在填写左上角专题名称');
                }
                return flag;
            },
            clickSetting: function () {
                this.$store.commit('setCfgPanelType', 'panel');
            },
            clickShare: function () {
                var vm = this;
                var dbId = this.$store.state.dashboardData.dashboardId || '';
                if (!dbId) {
                    return this.$message.warning('仪表板暂未保存，请先保存仪表板');
                }
                this.shareUrl = location.origin + ctx + 'main/dashboard?dbId=' + dbId;
                this.$nextTick(function () {
                    vm.$refs.shareInputRef.select();
                    document.execCommand('copy');
                    vm.$message.success('分享链接已经复制到粘贴板');
                });
            },
            // 点击预览
            preview: function () {
                this.$store.commit('toggleEditing');
            },
            developing: function () {
                this.$message('开发中...');
            },
            // 点击单个组件
            clickComponent: function (item) {
                // grid-layout 接收 addComponent 事件
                this.editing && this.eventBus.$emit('addComponent', item);
            },
        },
    });
</script>
<style>
    .dbh-box {
        height: 100%;
        padding: 12px 32px 12px 20px;
    }

    .dbh-left {
        width: 320px;
    }

    .dbh-left .el-input__inner {
        border-radius: 0;
        background-color: #2C2E39;
        color: #D4D5D7;
        border: 1px solid #24453E;
    }

    .dbh-lopes {
        margin: 12px 0 0 6px;
    }

    .dbh-lopes .ag {
        font-size: 18px;
    }

    .dbhlu-ope {
        float: left;
        width: 18px;
        height: 18px;
        line-height: 18px;
        font-size: 18px;
        text-align: center;
        cursor: pointer;
        color: #fff;
    }

    .dbhlu-ope + .dbhlu-ope {
        margin-left: 20px;
    }

    .dbhru-ope {
        float: left;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        font-size: 20px;
        cursor: pointer;
        color: #CFCFD2;
    }

    .dbhru-ope + .dbhru-ope {
        margin-left: 24px;
    }

    .dbh-right {
        margin-top: 18px;
    }

    .dbh-right .ag {
        font-size: 24px;
    }

    .dbh-center {
        margin: 2px 0 0 160px;
    }

    .dbhcu-ope {
        min-width: 60px;
        text-align: center;
        cursor: pointer;
        float: left;
    }

    .dbhcu-icon {
        width: 32px;
        height: 32px;
        line-height: 32px;
        margin: auto;
        color: #FAFCFF;
        font-size: 24px;
    }

    .dbhcu-icon .ag {
        font-size: 24px;
    }

    .dbhcu-text {
        color: #C9C9CC;
        font-size: 14px;
        line-height: 22px;
        margin-top: 3px;
    }

    .dbhcu-ope + .dbhcu-ope {
        margin-left: 5px;
    }

    .share-input {
        position: absolute;
        width: 100px;
        left: 30px;
        opacity: 0;
    }
</style>


<div id="setting" v-cloak>
    <div class="dbset-wrap">
        <transition :name="transitionName">
            <div data-title="页面设置" v-show="cfgPanelType=='panel'" class="setu-wrap panel-set-wrap">
                <h3 class="psetu-row">页面设置</h3>
                <div class="psetu-row" :class="{'expand': expand1}">
                    <h4 class="psetiner-title"
                        @click="expand1=!expand1">
                        基础设置<i class="el-icon-arrow-right"></i>
                    </h4>
                    <div class="psetu-row-child">
                        <el-row>
                            <el-col :span="6">主题风格</el-col>
                            <el-col :span="18">
                                <el-radio-group v-model="themeType" @change="developing">
                                    <el-radio label="1">浅色版</el-radio>
                                    <el-radio label="2">深色版</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">报告类型</el-col>
                            <el-col :span="18">
                                <el-radio-group v-model="subjectType" @change="developing">
                                    <el-radio label="1">普通报告</el-radio>
                                    <el-radio label="2">指标报告</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </transition>
        <transition :name="transitionName">
            <div data-title="图表设计" v-show="cfgPanelType=='echart'" class="setu-wrap" v-loading="settingLoading">
                <h3 class="psetu-row">
                    图表设计
                </h3>
                <div class="chart-set-tabs c-f">
					<span class="cst-slider" :class="{'sec': chartTabIndex===1,'third': chartTabIndex===2}">
						{{chartTabs[chartTabIndex]}}
					</span>
                    <div class="chart-set-u" :class="{'active': i===chartTabIndex}"
                         v-for="(u, i) in chartTabs" :key="i" @click="clickChartSetTab(i)">
                        {{u}}
                    </div>
                </div>
                <transition :name="transitionName">
                    <div class="set-chart-tabu" v-show="chartTabIndex===0">
                        <!-- 图片组件数据设置 -->
                        <template v-if="chartType=='Img'">
                            <div class="setu-wrap panel-set-wrap">
                                <div class="psetu-row" :class="{'expand': expand7}">
                                    <h4 class="psetiner-title"
                                        @click="expand7=!expand7">
                                        图片文件<i class="el-icon-arrow-right"></i>
                                    </h4>
                                    <div class="psetu-row-child">
                                        <el-upload action="rest/file/upload" :http-request="uploadImg"
                                                   ref="uploadImgRef" accept="image/png, image/jpeg"
                                                   class="upload-img" :show-file-list="false">
                                            <el-button type="primary">选择图片</el-button>
                                        </el-upload>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <!-- 文本组件数据设置 -->
                        <template v-else-if="chartType=='Text'">
                            <div class="setting-text-wrap">
                                <el-row>
                                    <el-col :span="4" class="text-ar">文本内容</el-col>
                                    <el-col :span="20">
                                        <el-input v-model="textContent" type="textarea" :rows="6"
                                                  placeholder="请填写内容"></el-input>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>
                        <!-- 拥有维度度量的组件数据设置 -->
                        <template v-else>
                            <div class="sctu sctu-left">
                                <div v-show="judgeShowDimesionRow(chartType)" class="sctu-uint"
                                     :class="{'expand': expand2}"
                                     @drop="dragDrop($event, 'dimesion')" @dragover="dragover($event)">
                                    <h4 class="psetiner-title" @click="expand2=!expand2">
                                        {{chartType!='Table'?'类别/维度':'列'}}<i class="el-icon-arrow-right"></i>
                                    </h4>
                                    <transition name="el-zoom-in-top">
                                        <div v-show="expand2">
                                            <div class="sctu-udrag" :class="[fmtdrClass(u)]"
                                                 v-for="(u,i) in dimesionList" :key="i">
                                                {{u.columnAlias}}
                                                <div class="sctuud-btns">
                                                    <i class="ag ag-down-arrow" @click.stop="clickMore($event,u)"></i>
                                                    <el-tooltip effect="dark" content="下钻" placement="top">
                                                        <i class="ag ag-drill_down_outlined" v-if="false"></i>
                                                    </el-tooltip>
                                                    <i class="ag ag-delete_outlined"
                                                       @click="delDataRow(u,'dimesion')"></i>
                                                </div>
                                            </div>
                                            <div class="sctu-udrag drag-target">双击或拖动数据字段至此处</div>
                                        </div>
                                    </transition>
                                </div>
                                <div v-show="judgeShowMesureRow(chartType)" class="sctu-uint"
                                     :class="{'expand': expand3}"
                                     @drop="dragDrop($event, 'mesure')" @dragover="dragover($event)">
                                    <h4 class="psetiner-title" @click="expand3=!expand3">
                                        值/度量<i class="el-icon-arrow-right"></i>
                                    </h4>
                                    <transition name="el-zoom-in-top">
                                        <div v-show="expand3">
                                            <div class="sctu-udrag" :class="[fmtdrClass(u)]"
                                                 v-for="(u,i) in mesureList" :key="i">
                                                {{u.columnAlias}}
                                                <div class="sctuud-btns">
                                                    <i class="ag ag-down-arrow" @click.stop="clickMore($event,u)"></i>
                                                    <i class="ag ag-delete_outlined"
                                                       @click="delDataRow(u,'mesure')"></i>
                                                </div>
                                            </div>
                                            <div class="sctu-udrag drag-target">双击或拖动数据字段至此处</div>
                                        </div>
                                    </transition>
                                </div>
                                <div v-if="false" class="sctu-uint" :class="{'expand': expand4}"
                                     @drop="dragDrop($event, 'color')" @dragover="dragover($event)">
                                    <h4 class="psetiner-title" @click="expand4=!expand4">
                                        颜色图例/维度<i class="el-icon-arrow-right"></i>
                                    </h4>
                                    <transition name="el-zoom-in-top">
                                        <div v-show="expand4">
                                            <div class="sctu-udrag" :class="[fmtdrClass(u)]"
                                                 v-for="(u,i) in colorList" :key="i">
                                                {{u.columnAlias}}
                                                <div class="sctuud-btns">
                                                    <i class="ag ag-delete_outlined" @click="delDataRow(u,'color')"></i>
                                                </div>
                                            </div>
                                            <div class="sctu-udrag drag-target">拖动数据字段至此处</div>
                                        </div>
                                    </transition>
                                </div>
                                <div v-if="false" class="sctu-uint" :class="{'expand': expand5}"
                                     @drop="dragDrop($event, 'filter')" @dragover="dragover($event)">
                                    <h4 class="psetiner-title" @click="expand5=!expand5">
                                        过滤器<i class="el-icon-arrow-right"></i>
                                    </h4>
                                    <transition name="el-zoom-in-top">
                                        <div v-show="expand5">
                                            <div class="sctu-udrag" :class="[fmtdrClass(u)]"
                                                 v-for="(u,i) in filterList" :key="i">
                                                {{u.columnAlias}}
                                                <div class="sctuud-btns">
                                                    <i class="ag ag-delete_outlined"
                                                       @click="delDataRow(u,'filter')"></i>
                                                </div>
                                            </div>
                                            <div class="sctu-udrag drag-target">拖动数据字段至此处</div>
                                        </div>
                                    </transition>
                                </div>
                                <div data-title="更多设置" class="more-setting-wrap" :class="{'show': showMoreSetting}"
                                     :style="{left: moreSettingLeft+'px', top: moreSettingTop+'px'}"
                                     @click.stop="emptyFn" @mouseleave="showMoreSetting=false">
                                    <div v-for="(uset, usi) in moreSettingCfgList"
                                         :key="usi" class="more-uset" @click="clickMoreP(uset)">
                                        <div class="more-s-text">
                                            {{uset.text}}
                                            <div class="more-set-trangle" v-if="uset.child&&uset.child.length">
                                                <i class="el-icon-arrow-right"></i>
                                            </div>
                                            <div class="more-usetc-box" v-if="uset.child&&uset.child.length">
                                                <div class="musb-u"
                                                     :class="{active: editMoreRow[uset.keyVal]===uuset.val}"
                                                     v-for="(uuset, uusi) in uset.child" :key="uusi"
                                                     @click="changeMoreSetting(uset, uuset.val)">
                                                    {{uuset.text}}
                                                    <i class="ag ag-check"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div data-title="选择数据集和展示该数据集下的维度和度量" class="sctu sctu-right">
                                <div class="scturu sctur-search-box">
                                    <div class="sctur-su">
                                        <div class="sctur-select">
                                            <div class="sctur-sel-text" :class="[datasetName?'':'placeholder']"
                                                 @click.stop="showDatasetList=!showDatasetList">
                                                <span>{{datasetName||'请选择数据集'}}</span>
                                                <i class="ag ag-down-arrow" :class="[showDatasetList?'is-down':'']"></i>
                                                <transition name="el-zoom-in-top">
                                                    <div class="sctur-sel-wrap" v-show="showDatasetList">
                                                        <div class="sctur-sel-list">
                                                            <div class="sctur-se-unit" v-for="(u,i) in datasetList"
                                                                 :key="i" :class="{active:u.datasetId==datasetId}"
                                                                 @click.stop="datasetIdChange(u.datasetId)">
                                                                {{u.datasetName}}
                                                                <i class="ag ag-check"></i>
                                                            </div>
                                                        </div>
                                                        <div class="sctursel-fbtn c-f">
                                                            <div class="create-ds-btn l" @click="clickCreateDs">新建数据集
                                                            </div>
                                                            <div class="refresh-ds-btn r" @click="getDataSets(true)"
                                                                 title="刷新数据集"><i class="el-icon-refresh"></i></div>
                                                        </div>
                                                    </div>
                                                </transition>
                                            </div>
                                            <div class="sctur-edit" @click="clickEditDataset" title="编辑数据集">
                                                <i class="ag ag-edit_outlined"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="false" class="sctur-su">
                                        <el-input v-model="searchKey" placeholder="搜索"></el-input>
                                    </div>
                                </div>
                                <div class="sctur-bottom" ref="datasetListRef"
                                     @mousemove="sliderMouseMove" @mouseup="sliderMouseup">
                                    <div class="sctur-bottomu ur-top" :style="{height: topSliderHeight+'px'}">
                                        <div class="sctur-title dimesion">
                                            维度<i class="ag ag-add elip" @click="developing"></i>
                                        </div>
                                        <div class="sctur-main">
                                            <div v-for="(row, rowI) in dimesionColumns">
                                                <div class="scturmd-row dimesion scturmd-title"
                                                     @click="row.domExpand=!row.domExpand">
                                                    {{row.name}}
                                                    <i class="ag"
                                                       :class="[row.domExpand?'ag-down-arrow':'ag-right-arrow']"></i>
                                                </div>
                                                <div v-show="row.domExpand">
                                                    <div class="scturmd-row dimesion" v-for="(u,i) in row.columns"
                                                         :key="i" draggable="true" @dragstart="dragStart($event, u)"
                                                         @dblclick="addDataConfig(u, 'dimesion')">
                                                        {{u.columnAlias}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sctur-bottomu ur-bottom" :style="{top: topSliderHeight+'px'}">
                                        <div class="sctur-title">
                                            <i class="ag ag-Drag move-slider" @mousedown="sliderMousedown"></i>
                                            度量<i class="ag ag-add elip" @click="developing"></i>
                                        </div>
                                        <div class="sctur-main">
                                            <div v-for="(row, rowI) in mesureColumns">
                                                <div class="scturmd-row scturmd-title"
                                                     @click="row.domExpand=!row.domExpand">
                                                    {{row.name}}
                                                    <i class="ag"
                                                       :class="[row.domExpand?'ag-down-arrow':'ag-right-arrow']"></i>
                                                </div>
                                                <div v-show="row.domExpand">
                                                    <div class="scturmd-row" v-for="(u,i) in row.columns"
                                                         :key="i" draggable="true" @dragstart="dragStart($event, u)"
                                                         @dblclick="addDataConfig(u, 'mesure')">
                                                        {{u.columnAlias}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </transition>
                <transition :name="transitionName">
                    <div class="set-chart-tabu" v-show="chartTabIndex===1">
                        <div class="style-set-cu" :class="{'expand': expand6}">
                            <div class="style-set-title" @click="expand6=!expand6">
                                <i class="el-icon-arrow-right"></i>基础信息
                            </div>
                            <transition name="el-zoom-in-top">
                                <div class="style-set-main" v-show="expand6">
                                    <el-row>
                                        <el-col :span="7">
                                            <el-checkbox v-model="titleChecked">标题</el-checkbox>
                                        </el-col>
                                        <transition :name="fadeInName">
                                            <el-col :span="17">
                                                <el-input v-model="titleText" :disabled="!titleChecked" maxlength="15"
                                                          placeholder="请输入"></el-input>
                                            </el-col>
                                        </transition>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="7">
                                            <el-checkbox v-model="memoChecked">备注</el-checkbox>
                                        </el-col>
                                        <transition :name="fadeInName">
                                            <el-col :span="17">
                                                <el-input v-model="memoText" :disabled="!memoChecked"
                                                          placeholder="请输入"></el-input>
                                            </el-col>
                                        </transition>
                                    </el-row>
                                    <el-row style="padding:0;" v-if="false">
                                        <el-col :span="7">
                                            <el-checkbox v-model="digChecked">可下钻</el-checkbox>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="7">
                                            <el-checkbox v-model="jumpChecked">显示跳转文案</el-checkbox>
                                        </el-col>
                                        <transition :name="fadeInName">
                                            <el-col :span="17">
                                                <el-input v-model="jumpText" :disabled="!jumpChecked" maxlength="4"
                                                          placeholder="请输入"></el-input>
                                            </el-col>
                                        </transition>
                                    </el-row>
                                    <transition name="el-zoom-in-top">
                                        <el-row>
                                            <el-col :span="7">链接地址</el-col>
                                            <el-col :span="17">
                                                <el-input v-model="jumpUrl" :disabled="!jumpChecked"
                                                          placeholder="请输入"></el-input>
                                            </el-col>
                                        </el-row>
                                    </transition>
                                </div>
                            </transition>
                        </div>
                    </div>
                </transition>
                <transition :name="transitionName">
                    <div class="set-chart-tabu" v-show="chartTabIndex===2">
                        高级设置开发中...
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</div>
<script>
    Vue.component('dashboard-setting', {
        template: '#setting',
        mixins: [ALLMIXIN.COMMMIXIN],
        data: function () {
            return {
                datasetColumnCache: {}, // 数据集缓存数据
                settingLoading: 0,
                expand1: true,
                expand2: true,
                expand3: true,
                expand4: true,
                expand5: true,
                expand6: true,
                expand7: true,
                // 页面设置 start
                themeType: '1', // 主题风格
                subjectType: '1', // 报告类型
                // 页面设置 start
                transitionName: 'el-zoom-in-center',
                chartTabs: ['数据', '样式', '高级设置'],
                chartTabIndex: 0,
                topSliderHeight: 200,
                listMinHeight: 120,
                searchKey: '',
                slidering: false,
                oldY: 0,
                oldH: 0,
                datasetList: [], // 数据集list
                dimesionColumns: [], // 维度
                mesureColumns: [], // 度量
                editMoreRow: {}, // 正在修改对应row的属性
                showMoreSetting: false, //
                moreSettingLeft: 0,
                moreSettingTop: 0,
                moreSettingCfgList: [],
                // 维度更多设置菜单数据
                dimesionSettingList: [{
                    text: '重命名',
                    clickFn: 'clickReName',
                }, {
                    text: '排序',
                    keyVal: 'sort',
                    child: [
                        {text: '不排序', val: '0'},
                        {text: '升序', val: 'asc'},
                        {text: '降序', val: 'decs'},
                    ],
                }],
                // 度量更多设置菜单数据
                mesureSettingList: [{
                    text: '重命名',
                    clickFn: 'clickReName',
                }, {
                    text: '聚合方式',
                    keyVal: 'juheType',
                    child: [
                        // {text: '无', val: ''},
                        {text: '求和', val: 'sum'},
                        {text: '平均数', val: 'avg'},
                        {text: '总个数', val: 'count'},
                    ],
                }, {
                    text: '数据格式',
                    keyVal: 'dataFmt',
                    child: [
                        {text: '自动', val: '0'},
                        {text: '整数', val: '1'},
                        {text: '保留1位小数', val: '2'},
                        {text: '保留2位小数', val: '3'},
                        {text: '百分比', val: '4'},
                        {text: '百分比1位小数', val: '5'},
                        {text: '百分比2位小数', val: '6'},
                    ],
                }, {
                    text: '排序',
                    keyVal: 'sort',
                    child: [
                        {text: '不排序', val: '0'},
                        {text: '升序', val: 'asc'},
                        {text: '降序', val: 'decs'},
                    ],
                }],
                // 样式设置 start
                fadeInName: 'el-fade-in',
                // 样式设置 end
                datasetName: '',//当前选中数据集名称
                showDatasetList: false,
            }
        },
        props: {},
        computed: {
            editable: function () {
                return this.$store.state.editable;
            },
            // 多专题当前操作tab索引
            subjectActive: function () {
                return this.$store.state.subjectActive;
            },
            // 设置面板当前设置信息所属 panel or echart
            cfgPanelType: function () {
                return this.$store.state.cfgPanelType;
            },
            // 当前选中数据集id
            datasetId: {
                get: function () {
                    return this.$store.state.currChartCfg.datasetId || '';
                },
                set: function (val) {
                    this.setStoreCurrCfgDatasetId(val);
                },
            },
            // 选中的维度
            dimesionList: function () {
                return this.$store.state.currChartCfg.dimesionList || [];
            },
            // 选中的度量
            mesureList: function () {
                return this.$store.state.currChartCfg.mesureList || [];
            },
            // 选中的颜色图例/维度
            colorList: function () {
                return this.$store.state.currChartCfg.colorList || [];
            },
            // 选中的过滤器
            filterList: function () {
                return this.$store.state.currChartCfg.filterList || [];
            },
            // 是否显示标题
            titleChecked: {
                get: function () {
                    return this.$store.state.currChartCfg.titleChecked || false
                },
                set: function (val) {
                    this.setStoreCurrCfg('titleChecked', val);
                }
            },
            // 标题文本
            titleText: {
                get: function () {
                    return this.$store.state.currChartCfg.titleText || ''
                },
                set: function (val) {
                    this.setStoreCurrCfg('titleText', val);
                }
            },
            // 是否有显示备注
            memoChecked: {
                get: function () {
                    return this.$store.state.currChartCfg.memoChecked || false
                },
                set: function (val) {
                    this.setStoreCurrCfg('memoChecked', val);
                }
            },
            // 备注文本
            memoText: {
                get: function () {
                    return this.$store.state.currChartCfg.memoText || ''
                },
                set: function (val) {
                    this.setStoreCurrCfg('memoText', val);
                }
            },
            // 是否下钻
            digChecked: {
                get: function () {
                    return this.$store.state.currChartCfg.digChecked || false
                },
                set: function (val) {
                    this.setStoreCurrCfg('digChecked', val);
                }
            },
            // 是否有跳转链接
            jumpChecked: {
                get: function () {
                    return this.$store.state.currChartCfg.jumpChecked || false
                },
                set: function (val) {
                    this.setStoreCurrCfg('jumpChecked', val);
                }
            },
            // 跳转链接文本
            jumpText: {
                get: function () {
                    return this.$store.state.currChartCfg.jumpText || ''
                },
                set: function (val) {
                    this.setStoreCurrCfg('jumpText', val);
                }
            },
            // 跳转链接url值
            jumpUrl: {
                get: function () {
                    return this.$store.state.currChartCfg.jumpUrl || ''
                },
                set: function (val) {
                    this.setStoreCurrCfg('jumpUrl', val);
                }
            },
            // 表格类型
            chartType: {
                get: function () {
                    return this.$store.state.currChartCfg.chartType || ''
                },
                set: function (val) {
                    this.setStoreCurrCfg('chartType', val);
                }
            },
            // 文本内容
            textContent: {
                get: function () {
                    return this.$store.state.currChartCfg.textContent || ''
                },
                set: function (val) {
                    this.setStoreCurrCfg('textContent', val);
                }
            },
            choosedDatasetId: function () {
                if (this.dimesionList && this.dimesionList.length) {
                    return this.dimesionList[0].datasetId;
                }
                if (this.mesureList && this.mesureList.length) {
                    return this.mesureList[0].datasetId;
                }
                if (this.colorList && this.colorList.length) {
                    return this.colorList[0].datasetId;
                }
                if (this.filterList && this.filterList.length) {
                    return this.filterList[0].datasetId;
                }
                return '';
            },
        },
        created: function () {
            var vm = this;
            this.editable && this.getDataSets();
            // 监听 datasetIdChange，可通过 gridLayout 触发
            this.eventBus.$on('datasetIdChange', function () {
                vm.datasetIdChange();
            });
        },
        updated: function () {
            if (this.slidering) return null;
            if (!this.$refs.datasetListRef) return null;
            var h = parseInt(this.$refs.datasetListRef.offsetHeight / 2);
            if (h < this.listMinHeight) {
                h = this.listMinHeight;
            }
            this.topSliderHeight = (h < this.topSliderHeight) ? this.topSliderHeight : h;
        },
        mounted: function () {
            var vm = this;
            window.addEventListener('click', function () {
                vm.showDatasetList = false;
            });
        },
        methods: {
            // 点击新建数据集
            clickCreateDs: function () {
                this.$message.warning('开发中...');
            },
            // 点击编辑数据集
            clickEditDataset: function () {
                if (this.datasetId) {
                    return this.$message.warning('开发中...');
                    window.localStorage.setItem('datasetId', this.datasetId);
                    window.open(ctx + 'main/index');
                } else {
                    this.$message.warning('请先选择数据集');
                }
            },
            // 更改更多设置某项值
            changeMoreSetting: function (parent, newVal) {
                var keyVal = parent.keyVal;
                var oldVal = this.editMoreRow[parent.keyVal];
                var resultVal = (oldVal === newVal ? newVal : newVal);
                this.$set(this.editMoreRow, parent.keyVal, resultVal);
                if (keyVal == 'juheType') {
                    this.$set(this.editMoreRow, 'sqlTextType', resultVal ? '0' : '');
                    this.$set(this.editMoreRow, 'aggregationFunc', resultVal);
                }
                this.eventBus.$emit('loadChartData');
            },
            // 点击维度设置重命名
            clickReName: function () {
                this.showMoreSetting = false;
                this.$message.warning('重命名开发中');
            },
            clickMoreP: function (item) {
                item.clickFn && this[item.clickFn]();
            },
            // 点击更多设置
            clickMore: function (ev, item) {
                var type = item.dataType;
                var listStr = type + 'SettingList';
                if (!this[listStr]) return null;
                this.moreSettingCfgList = this[listStr];
                this.editMoreRow = item;
                this.showMoreSetting = true;
                this.moreSettingLeft = ev.clientX - 10;
                this.moreSettingTop = ev.clientY - 10;
            },
            // 删除选中的 度量、维度、颜色图例、过滤器
            delDataRow: function (row, type) {
                var keyStr = type + 'List';
                var arr = this[keyStr];
                var index = -1;
                arr.forEach(function (u, i) {
                    if (u.datasetColumnId == row.datasetColumnId) {
                        index = i;
                    }
                });
                if (index == -1) {
                    return this.$message.error('删除失败，内部错误，未找到该元素');
                }
                arr.splice(index, 1);
                this.setStoreCurrCfg(keyStr, arr);
                // 加载单个图表数据
                this.eventBus.$emit('loadChartData');
            },
            /**
             * type
             * mesure 度量
             * dimesion 维度
             * color 颜色图例
             * filter 过滤器
             */
            addDataConfig: function (obj, domType) {
                var data = JSON.parse(JSON.stringify(obj));
                var dataType = data.dataType;
                var chartType = this.chartType;
                if (chartType == 'Table') {
                    // table的图表，全部加到维度
                    domType = 'dimesion';
                    dataType = 'dimesion';
                }
                var text = '';
                if (domType == 'mesure' && dataType == 'dimesion') {
                    text = '不支持添加维度到[度量]';
                }
                if (domType == 'dimesion' && dataType == 'mesure') {
                    text = '不支持添加度量到[维度]';
                }
                if (domType == 'mesure' && this.mesureList.length) {
                    text = '只支持添加一种[度量]';
                }
                if (chartType == 'Pie') {
                    if (domType == 'dimesion' && this.dimesionList.length) {
                        text = '饼图只支持添加一种[维度]';
                    }
                }
                if (chartType == 'Index') {
                    if (dataType == 'dimesion') {
                        text = '指标组件只需添加度量即可，无需添加维度';
                    }
                }
                var keyStr = domType + 'List';
                var targetList = this[keyStr];
                targetList.forEach(function (u) {
                    if (u.datasetColumnId == data.datasetColumnId) {
                        text = '已经存在，无需再次添加';
                    }
                });
                if (this.choosedDatasetId && this.choosedDatasetId != data.datasetId) {
                    text = '一个图表只能添加同一个数据集的字段';
                }
                if (text) {
                    return this.$message.warning(text);
                }
                var arr = ['Column', 'Pie'];
                if (arr.indexOf(this.chartType) != -1 && dataType == 'mesure') {
                    // 柱状图和饼图 度量必须设置聚合方式
                    data.juheType = data.juheType || 'sum';
                    data.aggregationFunc = data.aggregationFunc || 'sum';
                    data.sqlTextType = data.sqlTextType || '0';
                }
                targetList.push(data);
                this.setStoreCurrCfg(keyStr, targetList);
                // 加载单个图表数据
                this.eventBus.$emit('loadChartData');
            },
            dragDrop: function (ev, domType) {
                this.addDataConfig(
                    JSON.parse(ev.dataTransfer.getData('dragData')),
                    domType
                );
            },
            dragover: function (ev) {
                // 必须阻止 DOM 元素对 dragover 的默认行为，才能使 drop 事件在其上正确执行
                ev.preventDefault();
            },
            dragStart: function (ev, item) {
                ev.dataTransfer.setData('dragData', JSON.stringify(item));
            },
            // 选择数据集
            datasetIdChange: function (val) {
                var vm = this;
                var id = val || this.$store.state.currChartCfg.datasetId || '';
                this.showDatasetList = false;
                if (id === '') {
                    this.datasetName = '';
                    this.mesureColumns = [];
                    this.dimesionColumns = [];
                    this.setStoreCurrCfgDatasetId(id);
                    return null;
                }
                // id = 1; //
                if (this.datasetColumnCache[id]) {
                    // 缓存中有，则无需请求接口获取
                    vm.datasetName = this.datasetColumnCache[id].datasetName;
                    vm.mesureColumns = this.datasetColumnCache[id].mesureColumns;
                    vm.dimesionColumns = this.datasetColumnCache[id].dimesionColumns;
                    this.setStoreCurrCfgDatasetId(id);
                    return null;
                }
                this.requestDatasetDetail(id, function (res) {
                    var dimesionColumns = res.content.dimesionColumns || [];
                    var mesureColumns = res.content.mesureColumns || [];
                    dimesionColumns.forEach(function (u) {
                        u.columns = u.columns || [];
                        u.domExpand = true;
                        u.columns.forEach(function (uu) {
                            uu.datasetId = id;
                            uu.dataType = 'dimesion'; // 维度
                        });
                    });
                    mesureColumns.forEach(function (u) {
                        u.columns = u.columns || [];
                        u.domExpand = true;
                        u.columns.forEach(function (uu) {
                            uu.datasetId = id;
                            uu.dataType = 'mesure'; // 度量
                        });
                    });
                    vm.setStoreCurrCfgDatasetId(id);
                    vm.datasetName = res.content.datasetName;
                    vm.mesureColumns = mesureColumns;
                    vm.dimesionColumns = dimesionColumns;
                    // 设置缓存数据
                    vm.datasetColumnCache[id] = {
                        datasetName: res.content.datasetName,
                        mesureColumns: mesureColumns,
                        dimesionColumns: dimesionColumns,
                    };
                });
            },
            requestDatasetDetail: function (id, cb) {
                var vm = this;
                this.settingLoading++;
                this.http({
                    url: 'dashboard/dataset/tree',
                    type: 'get',
                    noLoading: true,
                    data: {datasetId: id},
                    success: function (res) {
                        typeof cb == 'function' && cb(res);
                    },
                    final: function () {
                        vm.settingLoading--;
                    }
                });
            },
            // 获取数据集list force传参代表是否需要强制请求接口加载最新数据
            getDataSets: function (force) {
                var vm = this;
                if (this.datasetList.length && !force) {
                    return null;
                }
                if (force) {
                    // 强制更新的，清除缓存数据
                    this.datasetColumnCache = {};
                }
                this.settingLoading++;
                this.http({
                    url: 'rest/folder/folder/tree',
                    url: 'dashboard/datasets',
                    success: function (res) {
                        var list = res.content || [];
                        if (list.length == 0) {
                            return vm.$message.warning('暂未查询到数据集信息，请先新增数据集');
                        }
                        vm.datasetList = list;
                        vm.datasetIdChange(vm.datasetId);
                    },
                    final: function () {
                        vm.settingLoading--;
                    }
                });
            },
            sliderMousedown: function (e) {
                this.slidering = true;
                this.oldY = e.y;
                this.oldH = this.topSliderHeight;
            },
            // 设置维度和度量占的高度
            sliderMouseMove: function (e) {
                if (!this.slidering) return null;
                var diff = e.y - this.oldY;
                var maxH = this.$refs.datasetListRef.offsetHeight - this.listMinHeight;
                var y = this.oldH + diff;
                if (y < this.listMinHeight) {
                    y = this.listMinHeight;
                } else if (y > maxH) {
                    y = maxH;
                }
                this.topSliderHeight = y;
            },
            sliderMouseup: function () {
                this.slidering = false;
            },
            fmtdrClass: function (item) {
                return item.dataType == 'dimesion' ? 'blue-box' : '';
            },
            // 切换右边图标设计的设置tab
            clickChartSetTab: function (i) {
                if (i == 2) {
                    this.$message.warning('高级设置开发中...');
                } else {
                    this.chartTabIndex = i;
                }
            },
            setStoreCurrCfgDatasetId: function (id) {
                this.setStoreCurrCfg('datasetId', id);
            },
            setStoreCurrCfg: function (key, val) {
                this.$store.commit('setCurrChartCfgKeyVal', {
                    key: key, val: val,
                });
            },
            // 图片组件上传图片
            uploadImg: function (file) {
                this.eventBus.$emit('uploadImg', file);
            },
            // 是否展示维度配置row
            judgeShowDimesionRow: function (type) {
                var noArr = ['Index'];
                return noArr.indexOf(type) == -1;
            },
            // 是否展示度量配置row
            judgeShowMesureRow: function (type) {
                var noArr = ['Table'];
                return noArr.indexOf(type) == -1;
            },
            developing: function () {
                this.$message.warning('开发中...');
            },
            emptyFn: function () {
            },
        },
    });
</script>
<style>
    .dbset-wrap {
        position: relative;
        height: 100%;
        overflow: auto;
        background: #F7F8F9;
    }

    .dbset-wrap .el-select {
        width: 100%;
    }

    .setu-wrap {
        position: relative;
        height: 100%;
        user-select: none;
    }

    .psetu-row {
        padding: 10px 24px;
        border-bottom: 1px solid #DCE0E7;
        overflow: hidden;
    }

    .psetu-row + .psetu-row {
        border-top: 1px solid #fff;
    }

    h3.psetu-row {
        font-size: 20px;
        line-height: 30px;
    }

    .psetiner-title {
        cursor: pointer;
        position: relative;
        padding-left: 20px;
        line-height: 30px;
    }

    .psetiner-title .el-icon-arrow-right {
        font-size: 14px;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        position: absolute;
        top: 6px;
        left: 0px;
    }

    .expand .el-icon-arrow-right {
        transform: rotate(90deg);
    }

    .psetu-row-child {
        height: 0px;
        overflow: hidden;
    }

    .psetiner-title .el-icon-arrow-right,
    .psetu-row-child,
    .cst-slider,
    .chart-set-u {
        transition: all .3s;
    }

    .expand .psetu-row-child {
        height: auto;
        padding: 10px 18px;
    }

    .setu-wrap .el-row {
        padding: 10px 0;
    }

    .setu-wrap h3,
    .setu-wrap h4 {
        font-weight: normal;
    }

    .chart-set-tabs {
        position: relative;
        border-bottom: 1px solid #DCE0E7;
    }

    .chart-set-u {
        width: 33.3%;
        line-height: 38px;
        text-align: center;
        cursor: pointer;
        float: left;
        z-index: 100;
    }

    .chart-set-u:hover {
        color: #55BC8A;
    }

    .chart-set-u + .chart-set-u {
        border-left: 1px solid #DCE0E7;
    }

    .chart-set-u.active {
        color: #fff;
    }

    .chart-set-u.active:hover {
        color: #fff;
    }

    .cst-slider {
        display: block;
        position: absolute;
        width: 33.3%;
        top: -1px;
        bottom: 0px;
        left: 0;
        background: #55BC8A;
        z-index: 50;
        color: #fff;
        text-align: center;
        line-height: 39px;
    }

    .cst-slider.sec {
        left: 33.3%;
    }

    .cst-slider.third {
        left: 66.7%;
    }

    .set-chart-tabu {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 90px;
    }

    .sctu {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50%;
        overflow: hidden auto;
    }

    .sctu-left {
        left: 0;
        border-right: 1px solid #DCE0E7;
    }

    .sctu-right {
        right: 0;
    }

    .sctu-uint {
        padding: 12px 10px 16px 15px;
        border-bottom: 1px solid #DCE0E7;
    }

    .sctu-uint + .sctu-uint {
        border-top: 1px solid #fff;
    }

    .sctu-udrag {
        position: relative;
        line-height: 32px;
        padding: 0 12px;
        border: 1px solid #55BC8A;
        border-radius: 17px;
        color: #55BC8A;
        background: #E8F8F0;
        margin-top: 12px;
        height: 32px;
        overflow: hidden;
    }

    .sctu-udrag.drag-target {
        border: 1px dashed #DCDFE6;
        color: #A6AEBC;
        background: #fff;
        text-align: center;
    }

    .sctu-udrag.blue-box {
        border: 1px solid #5B90FA;
        color: #5B90FA;
        background: #E4F2FE;
    }

    .sctur-su + .sctur-su {
        margin-top: 12px;
    }

    .sctur-search-box {
        height: 108px;
        height: 58px;
        padding: 12px 8px 0px 8px;
    }

    .scturu {
        border-bottom: 1px solid #DCE0E7;
    }

    .scturu + .scturu {
        border-top: 1px solid #FFF;
    }

    .sctur-select {
        background: #E5E8ED;
        border: 1px solid #DCDFE6;
        border-radius: 3px;
        position: relative;
        padding-right: 24px;
        height: 34px;
    }

    .sctur-sel-text {
        position: relative;
        height: 32px;
        line-height: 32px;
        border-right: 1px solid #DCDFE6;
        padding-left: 11px;
        background: #fff;
        border-radius: 3px;
        cursor: pointer;
    }

    .sctur-sel-text.placeholder > span {
        color: #A6AEBC;
    }

    .sctur-sel-text > span {
        display: block;
        width: 150px;
        height: 32px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .sctur-sel-text > i {
        position: absolute;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        transition: all .3s;
        top: 6px;
        right: 10px;
    }

    .sctur-sel-text > i.is-down {
        transform: rotate(180deg);
    }

    .sctur-edit {
        position: absolute;
        width: 24px;
        height: 32px;
        text-align: center;
        line-height: 28px;
        top: 0;
        right: 0;
        cursor: pointer;
        font-size: 18px;
        color: #5D616B;
    }

    .sctur-edit:hover {
        opacity: 0.7;
    }

    .sctur-bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 108px;
        top: 58px;
    }

    .sctur-bottomu {
        position: absolute;
        left: 0;
        right: 0;
        border-top: 1px solid #fff;
    }

    .sctur-bottomu.ur-top {
        top: 0px;
        border-bottom: 1px solid #DCE0E7;
    }

    .sctur-bottomu.ur-bottom {
        bottom: 0px;
    }

    .sctur-title {
        line-height: 22px;
        padding: 12px 6px 10px 12px;
        user-select: none;
    }

    .sctur-title .elip {
        cursor: pointer;
        display: block;
        float: right;
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
    }

    .sctur-main {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0px;
        top: 45px;
        overflow: hidden auto;
        padding-bottom: 12px;
    }

    .move-slider {
        position: absolute;
        width: 30px;
        height: 14px;
        text-align: center;
        top: 0px;
        left: 50%;
        margin-left: -15px;
        cursor: ns-resize;
        font-size: 26px;
    }

    .scturmd-row {
        cursor: pointer;
        line-height: 30px;
        margin-top: 4px;
        padding: 0 12px 0 50px;
        position: relative;
    }

    .scturmd-title {
        padding-left: 35px;
    }

    .scturmd-title .ag {
        position: absolute;
        font-size: 18px;
        top: 0px;
        left: 12px;
    }

    .scturmd-row:hover {
        color: #55BC8A;
    }

    .dimesion.scturmd-row:hover {
        color: #5B90FA;
    }

    .sctu-udrag:hover {
        color: #fff;
        background: #55BC8A;
    }

    .sctu-udrag.blue-box:hover {
        background: #5B90FA;
    }

    .sctu-udrag.drag-target:hover {
        color: #A6AEBC;
        background: #fff;
    }

    .sctu-udrag:hover .sctuud-btns {
        display: block;
    }

    .sctuud-btns {
        position: absolute;
        top: 4px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        right: 10px;
        display: none;
        background: #55BC8A;
    }

    .blue-box .sctuud-btns {
        background: #5B90FA;
    }

    .sctuud-btns .ag {
        font-size: 16px;
        color: #fff;
        width: 24px;
        height: 24px;
        text-align: center;
        cursor: pointer;
    }

    .sctuud-btns .ag + .ag {
        margin-left: 2px;
    }

    .style-set-cu {
        border-bottom: 1px solid #DCE0E7;
        padding: 24px 24px 14px 24px;
    }

    .style-set-cu + .style-set-cu {
        border-top: 1px solid #fff;
    }

    .style-set-title {
        position: relative;
        line-height: 22px;
        cursor: pointer;
    }

    .style-set-cu .el-icon-arrow-right {
        margin-right: 5px;
    }

    .style-set-main {
        padding-top: 14px;
        line-height: 34px;
    }

    .style-set-main .el-row {
        padding: 8px 0;
    }

    .more-setting-wrap {
        position: fixed;
        z-index: 8888;
        display: none;
        box-shadow: 0 0 1px 1px #eeefef;
    }

    .more-setting-wrap.show {
        display: block;
    }

    .more-s-text, .musb-u {
        width: 140px;
        cursor: pointer;
        line-height: 36px;
        height: 36px;
        padding-left: 16px;
        position: relative;
        background: #fff;
    }

    .more-s-text:hover,
    .musb-u:hover {
        background: #E8F8F0;
        color: #55BC8A;
    }

    .more-s-text:hover .el-icon-arrow-right {
        color: #55BC8A;
    }

    .more-s-text:hover .more-usetc-box {
        display: block;
    }

    .more-usetc-box {
        position: absolute;
        left: 100%;
        top: 0px;
        display: none;
        color: #242C3A;
        box-shadow: 0 0 1px 1px #eeefef;
    }

    .more-set-trangle {
        position: absolute;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        font-size: 14px;
        right: 8px;
        top: 9px;
    }

    .musb-u {
        position: relative;
    }

    .musb-u .ag {
        position: absolute;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        right: 10px;
        top: 9px;
        display: none;
    }

    .musb-u.active {
        color: #55BC8A;
    }

    .musb-u.active .ag {
        display: block;
    }

    .sctur-sel-wrap {
        position: absolute;
        top: 34px;
        left: 0px;
        width: 100%;
        z-index: 1000;
        background: #fff;
        box-shadow: 0px 1px 10px 0px rgba(62, 101, 189, 0.16), 0px 1px 10px 0px rgba(62, 101, 189, 0.20);
    }

    .sctur-se-unit {
        line-height: 36px;
        height: 36px;
        padding: 0 24px 0 16px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
    }

    .sctur-se-unit:hover {
        color: #55BC8A;
    }

    .sctur-se-unit.active {
        color: #55BC8A;
        background: #E8F8F0;
    }

    .sctur-se-unit .ag {
        display: none;
        position: absolute;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-weight: bold;
        right: 8px;
        top: 8px;
        text-align: center;
    }

    .sctur-se-unit.active .ag {
        display: block;
    }

    .sctur-sel-list {
        max-height: 300px;
        overflow: auto;
    }

    .sctursel-fbtn {
        border-top: 1px solid #DCE0E7;
        padding: 6px 8px;
    }

    .sctursel-fbtn > div {
        cursor: pointer;
        text-align: center;
        line-height: 28px;
        border-radius: 2px;
    }

    .sctursel-fbtn > div:hover {
        opacity: 0.7;
    }

    .create-ds-btn {
        width: 148px;
        color: #fff;
        background: #55BC8A;
    }

    .refresh-ds-btn {
        width: 28px;
        background: #E5E8ED;
        font-size: 20px;
    }

    .upload-img .el-upload,
    .upload-img .el-button {
        width: 100%;
    }

    .setting-text-wrap {
        padding: 12px;
        height: 100%;
        overflow: auto;
        line-height: 30px;
    }

    .text-ar {
        text-align: right;
        padding-right: 12px;
    }
</style>


<div id="footer" v-cloak>
    <div class="dbf-box c-f">
        <div class="dbf-u dbf-menu"><i class="ag ag-menu"></i></div>
        <div v-for="(u, i) in tabs" :key="u.text"
             class="dbf-u dbfm-tab" :class="{'active': i===activeIndex}"
             @click="clickTab(i)">
            {{u.pageName}}
        </div>
        <div class="dbf-u dbfm-plus" @click="addTab" v-show="tabs.length<7" v-if="editing">
            <i class="ag ag-add"></i>
        </div>
    </div>
</div>
<script>
    Vue.component('dashboard-footer', {
        template: '#footer',
        data: function () {
            return {}
        },
        props: {},
        computed: {
            tabs: function () {
                return this.$store.state.dashboardData.pageList;
            },
            activeIndex: function () {
                return this.$store.state.subjectActive;
            },
            editing: function () {
                return this.$store.state.editing;
            },
        },
        created: function () {
        },
        methods: {
            clickTab: function (index) {
                this.$store.commit('setSubjectActive', index);
                this.eventBus.$emit('loadChartSetting'); // gridLayout接收
            },
            addTab: function () {
                var len = this.tabs.length + 1;
                if (len > 3) {
                    return this.$message.warning('单个报告页面已达到上限');
                }
                this.$store.commit('addSubject', {pageName: '页面' + len, sortNo: len});
                this.$store.commit('setCfgPanelType', 'panel');
            },
        },
    });
</script>
<style>
    .dbf-u {
        float: left;
        padding: 0 23px;
        cursor: pointer;
    }

    .dbf-box {
        height: 39px;
        line-height: 39px;
        height: 39px;
        font-size: 14px;
        color: #fff;
    }

    .dbf-box .ag {
        font-size: 18px;
    }

    .dbf-box .ag-add {
        font-weight: bold;
    }

    .dbf-menu {
        background: #A6AEBC;
    }

    .dbf-menu,
    .dbfm-plus {
        font-size: 18px;
    }

    .dbfm-plus {
        color: #5D616B;
    }

    .dbfm-tab {
        color: #808896;
        position: relative;
    }

    .dbfm-tab::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 14px;
        background: #CCD3DF;
        top: 12px;
        right: 0px;
    }

    .dbfm-tab:hover,
    .active.dbfm-tab {
        color: #55BC8A;
    }
</style>


<div id="packagePanel" v-cloak>
    <div class="grid-wrap" @mousedown="mousedown" @mouseup="mouseup">
        <grid-layout :ref="'layout_'+domIndex" :dom-index="domIndex"></grid-layout>
    </div>
</div>
<script>
    Vue.component('package-panel', {
        template: '#packagePanel',
        data: function () {
            return {
                isMe: false,
            }
        },
        props: {
            domIndex: {
                type: Number,
                default: 0,
            }
        },
        created: function () {
        },
        methods: {
            mousedown: function () {
                this.isMe = true;
            },
            mouseup: function () {
                if (this.isMe) {
                    this.eventBus.$emit('setGridActiveIndex', '');
                }
                this.isMe = false;
            },
            getData: function () {
                return this.$refs['layout_' + this.domIndex].getData();
            }
        },
    });
</script>
<style>
    .grid-wrap {
        height: 100%;
        overflow: hidden auto;
        background: #EEEFEF;
    }
</style>


<div id="folderDialog" v-cloak>
    <el-dialog :title="title" :visible="visible" top="50px" class="db-dia"
               width="600px" :close-on-click-modal="false" @close="close">
        <div class="fdia-wrap">
            <div class="f-input-box" v-if="dialogType=='createFolder'">
                <div class="fib-text">文件夹名称</div>
                <el-input maxlength="10" show-word-limit v-model="folderName"
                          placeholder="请输入文件夹名称"></el-input>
            </div>
            <el-tabs v-model="activeName" type="card" class="dbf-tabs">
                <el-tab-pane v-for="(u,i) in tabList" :key="i" :label="u.folderName" :name="u._treeName">
                    <div class="dfb-el-content">
                        <el-input v-model="u.searchKey" @input="searchKeyChange"
                                  placeholder="请输入关键字搜索"></el-input>
                        <el-tree :data="treeList[i]" :props="defaultProps" node-key="folderId"
                                 :ref="'treeRef'+i" highlight-current default-expand-all
                                 :filter-node-method="filterNode" style="margin-top:16px;">
                        </el-tree>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
            <el-button type="primary" @click="ensure">确 定</el-button>
        </div>
    </el-dialog>
</div>
<script>
    Vue.component('folder-dialog', {
        template: '#folderDialog',
        data: function () {
            return {
                folderName: '',
                activeName: '',
                tabList: [],
                treeList: [],
                searchKey0: '',
                searchKey1: '',
                defaultProps: {
                    children: 'childrenNodes',
                    label: 'folderName'
                },
            }
        },
        props: {
            title: {
                type: String,
                default: '',
            },
            visible: {
                type: Boolean,
                default: false,
            },
            dialogType: {
                type: String,
                default: 'createFolder',
            }
        },
        watch: {},
        computed: {
            topicName: {
                get: function () {
                    return this.$store.state.dashboardData.dashboardName;
                },
                set: function (val) {
                    this.$store.commit('setDashboardName', val);
                },
            },
        },
        created: function () {
        },
        methods: {
            ensure: function () {
                if (this.dialogType == 'createFolder') {
                    this.ensureCreateFolder();
                } else if (this.dialogType == 'chooseFolder') {
                    this.ensureChooseFolder();
                }
            },
            ensureChooseFolder: function () {
                var vm = this;
                var id = this.$refs['treeRef' + this.activeName][0].getCurrentKey();
                var text = '';
                if (!id) {
                    text = '请点击选择文件夹';
                    return this.$message.warning(text);
                }
                var node = this.$refs['treeRef' + this.activeName][0].getCurrentNode();
                var abiDashboards = node.abiDashboards || [];
                var topicName = this.topicName;
                abiDashboards.forEach(function (u) {
                    if (u.dashboardName == topicName) {
                        text = '“' + node.folderName + '”已存在名为“' + topicName + '”的仪表板';
                    }
                });
                if (text) {
                    return this.$message.warning(text);
                }
                this.$emit('ensure-choose', id);
            },
            ensureCreateFolder: function () {
                var vm = this;
                var folderName = this.folderName;
                var id = this.$refs['treeRef' + this.activeName][0].getCurrentKey();
                var text = '';
                if (!id) {
                    text = '请选择父文件夹';
                    return this.$message.warning(text);
                }
                if (!folderName) {
                    text = '请输入文件夹名称';
                }
                var node = this.$refs['treeRef' + this.activeName][0].getCurrentNode();
                var childrenNodes = node.childrenNodes || [];
                childrenNodes.forEach(function (u) {
                    if (u.folderName == folderName) {
                        text = '“' + node.folderName + '”已存在名为“' + folderName + '”的文件夹';
                    }
                });
                if (text) {
                    return this.$message.warning(text);
                }
                this.http({
                    url: 'rest/folder/saveorupdate',
                    type: 'post',
                    ContentType: 'application/json',
                    data: JSON.stringify({
                        folderType: '1',
                        folderName: folderName,
                        parentFolderId: id,
                    }),
                    success: function () {
                        try {
                            opener.vm.initReportTree();
                        } catch (e) {
                            console.error(e);
                        }
                        vm.$message.success('文件夹新建成功');
                        vm.$emit('refresh');
                        vm.close();
                    },
                });
            },
            searchKeyChange: function (val) {
                var i = this.activeName;
                this['searchKey' + i] = val;
                var ref = this.$refs['treeRef' + i][0];
                ref.setCurrentKey(null);
                ref.filter(val);
            },
            // 初始化弹窗
            initDialog: function () {
                var vm = this;
                this.requestFolderTree(function (res) {
                    var arr = res.content || [];
                    var list = [];
                    arr.forEach(function (u, i) {
                        u.searchKey = vm['searchKey' + i];
                        u._treeName = i + '';
                        list.push([u]);
                    });
                    if (arr.length) {
                        vm.activeName = arr[0]._treeName;
                        vm.tabList = arr;
                        vm.treeList = list;
                        vm.$emit('update:visible', true);
                    } else {
                        vm.$message.error('未查询到文件夹主目录数据');
                    }
                });
            },
            // 获取文件夹数据
            requestFolderTree: function (cb) {
                this.http({
                    url: 'rest/folder/BizTree',
                    type: 'get',
                    data: {folderType: '1'},
                    success: function (res) {
                        typeof cb == 'function' && cb(res);
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.folderName.indexOf(value) !== -1;
            },
            close: function () {
                var vm = this;
                this.$emit('update:visible', false);
                this.$nextTick(function () {
                    vm.folderName = '';
                    vm.searchKey0 = '';
                    vm.searchKey1 = '';
                });
            },
        },
    });
</script>
<style>
    .fdia-wrap {
        padding: 20px;
    }

    .f-input-box {
        position: relative;
        padding-left: 90px;
        margin-bottom: 14px;
    }

    .fib-text {
        position: absolute;
        left: 0;
        top: 0;
        line-height: 34px;
    }

    .dbf-tabs {
    }

    .dfb-el-content {
        padding: 16px;
        min-height: 250px;
        max-height: 400px;
        overflow: auto;
    }

    .el-tree-node:focus > .el-tree-node__content {
        background: #f5f7fa;
    }
</style>

<script src="/dataInsight/dashboard/js/dashboardStore.js"></script>
<script src="/dataInsight/common/js/vueEleInit.js"></script>
<script>
    function vueElePageInit() {
        if (window.vm) return null;
        var vm = new Vue({
            el: '#dashboardPage',
            mixins: [ALLMIXIN.LOADINGMIXIN],
            store: dashboardStore,
            data: function () {
                return {
                    fVisible: false,
                    fTitle: '选择文件夹',
                }
            },
            created: function () {
                var vm = this;
                if (this.$util.getUrlParam('a') == 'w') {
                    // 进入编辑模式
                    this.$store.commit('setEditable', true);
                    this.$store.commit('setEditing', true);
                }
                window.addEventListener('resize', function () {
                    // vm.$store.commit('setClientHeight');
                });
            },
            mounted: function () {
                var dbId = this.$util.getUrlParam('dbId');
                var fdId = this.$util.getUrlParam('fdId');
                if (dbId) {
                    var vm = this;
                    this.http({
                        url: 'dashboard/get',
                        type: 'get',
                        data: {dashboardId: dbId},
                        success: function (res) {
                            var content = res.content || {};
                            try {
                                content.pageList.reverse();
                            } catch (e) {
                                console.error(e);
                            }
                            vm.$store.commit('setDashboardData', {object: content});
                            vm.$nextTick(function () {
                                vm.eventBus.$emit('loadByStore'); // gridlayout接收
                            });
                        },
                    });
                } else if (fdId) {
                    this.$store.commit('setDashboardKeyVal', {key: 'folderId', val: fdId});
                }
            },
            methods: {
                requestDashboard: function () {
                    var vm = this;
                    var requestObj = JSON.parse(JSON.stringify(this.$store.state.dashboardData));
                    var pageList = [];
                    this.pageList.forEach(function (u, i) {
                        var layout = vm.$refs['panel_' + i][0].getData();
                        var elementList = [];
                        layout.forEach(function (uu) {
                            !uu.deleted && elementList.push($.extend({}, uu, {
                                elementRenderer: JSON.stringify(uu),
                            }));
                        });
                        var _u = JSON.parse(JSON.stringify(u));
                        _u.elementList = elementList;
                        pageList.push(_u);
                    });
                    requestObj.pageList = pageList;
                    this.http({
                        url: 'dashboard/create',
                        type: 'post',
                        ContentType: 'application/json',
                        data: JSON.stringify(requestObj),
                        success: function (res) {
                            vm.$refs.fDialogRef && vm.$refs.fDialogRef.close();
                            if (res.content && res.content.dashboardId) {
                                vm.$message.success('保存成功');
                                vm.$store.commit('setDashboardData', {object: res.content});
                            } else {
                                vm.$message.error('保存出错了，未获取到仪表盘详情数据');
                            }
                            try {
                                opener.vm.initReportTree();
                            } catch (e) {
                                console.error(e);
                            }
                        },
                    });
                },
                saveDashboard: function () {
                    var vm = this;
                    if (!this.validateSave()) return null;
                    var folderId = this.$store.state.dashboardData.folderId || '';
                    if (folderId) {
                        this.requestDashboard();
                    } else {
                        // 打开弹窗，选择要添加到的文件夹
                        this.fTitle = '选择文件夹';
                        this.$refs.fDialogRef.initDialog();
                    }
                },
                chooseFolder: function (id) {
                    this.$store.commit('setDashboardKeyVal', {key: 'folderId', val: id});
                    this.requestDashboard();
                },
                validateSave: function () {
                    var headerRef = this.$refs.dbHeader;
                    return headerRef.validateSave();
                },
            },
            computed: {
                editing: function () {
                    return this.$store.state.editing;
                },
                editable: function () {
                    return this.$store.state.editable;
                },
                pageList: function () {
                    return this.$store.state.dashboardData.pageList;
                },
                subjectActive: function () {
                    return this.$store.state.subjectActive;
                },
            },
            watch: {},
        });
        window.vm = vm;
    }
</script>
<style>
    .absolute-top,
    .absolute-bottom,
    .absolute-left,
    .absolute-right {
        position: absolute;
    }

    .absolute-top,
    .absolute-bottom,
    .absolute-right {
        left: 0;
    }

    .absolute-top,
    .absolute-bottom,
    .absolute-left {
        right: 0;
    }

    .absolute-bottom,
    .absolute-left,
    .absolute-right {
        top: 0;
    }

    .absolute-top,
    .absolute-left,
    .absolute-right {
        bottom: 0;
    }

    .dashboard-page {
        top: 0;
        min-width: 1350px;
        min-height: 600px;
    }

    .db-header {
        height: 90px;
        background: #10131F;
    }

    .db-main {
        top: 0px;
        z-index: 100;
    }

    .editable .db-main {
        top: 90px;
    }

    .db-main > div,
    .db-wrap {
        transition: all .3s;
    }

    .db-main-right {
        width: 480px;
        background: #F7F8F9;
        border-left: 1px solid #DCE0E7;
    }

    .db-main-left {
        right: 0px;
        z-index: 100;
    }

    .db-wrap {
        bottom: 40px;
        z-index: 100;
    }

    .db-footer {
        height: 40px;
        border-top: 1px solid #DCE0E7;
        background: #fff;
    }

    .el-textarea__inner {
        resize: none;
    }

    /*预览模式样式 start*/
    /*.is-edit .db-wrap{*/
    /*	bottom: 40px;*/
    /*}*/
    .is-edit .db-main-left {
        right: 480px;
    }

    .is-edit .db-grid-unit:hover {
        box-shadow: 0 0 1px 1px #62CECC;
    }

    .is-edit .active.db-grid-unit {
        /* border: 1px solid #55BC8A; */
        /* box-shadow: 0 0 1px 1px #62CECC; */
    }

    .is-edit .db-grid-unit {
        cursor: move;
        user-select: none;
    }

    .is-edit .active.db-grid-unit .resize-icon {
        display: block;
    }

    /*预览模式样式 end*/
</style>
</html>
