var result = {
    "success": true,
    "message": "请求成功。",
    "content": {
        "totalArray": [{
            "label": "总组织",
            "value": 1111
        }, {
            "label": "行政区划",
            "value": 2
        }, {
            "label": "单位",
            "value": 3
        }, {
            "label": "部门",
            "value": 4
        }, {
            "label": "工作组",
            "value": 5
        }, {
            "label": "总用户数",
            "value": 10000
        }, {
            "label": "总岗位数",
            "value": 9999
        }],
        "model1": {
            "orgStatus": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "组织状态"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "组织数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "启用",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "禁用",
                    "value": 80,
                    "ratio": "8%"
                }],
                "title": "组织状态",
                "type": "pie"
            },
            "orgLevel": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "组织等级"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "组织数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "一级",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "二级",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "三级",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "四级",
                    "value": 80,
                    "ratio": "98%"
                }],
                "title": "组织等级",
                "type": "pie"
            },
            "orgUserNum": {
                "data": [{
                    "name": "研发中心",
                    "value": 980
                }, {
                    "name": "营销中心",
                    "value": 880
                }, {
                    "name": "运营中心",
                    "value": 780
                }, {
                    "name": "研发中心",
                    "value": 680
                }, {
                    "name": "营销中心",
                    "value": 580
                }, {
                    "name": "运营中心",
                    "value": 480
                }, {
                    "name": "研发中心",
                    "value": 380
                }, {
                    "name": "营销中心",
                    "value": 280
                }, {
                    "name": "运营中心",
                    "value": 180
                }, {
                    "name": "运营中心",
                    "value": 80
                }],
                "title": "组织用户规模",
                "type": "bar"
            },
            "orgType": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "组织状态"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "组织数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "实施",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "研发",
                    "value": 380,
                    "ratio": "8%"
                }, {
                    "name": "销售",
                    "value": 80,
                    "ratio": "8%"
                }, {
                    "name": "科研",
                    "value": 80,
                    "ratio": "8%"
                }, {
                    "name": "后勤",
                    "value": 80,
                    "ratio": "8%"
                }],
                "title": "组织类型",
                "type": "pie"
            },
            "orgPosUserNum": {
                "data": [{
                    "userNum": 680,
                    "posNum": 80,
                    "name": "研发中心"
                }, {
                    "userNum": 780,
                    "posNum": 280,
                    "name": "运营中心"
                }, {
                    "userNum": 980,
                    "posNum": 380,
                    "name": "营销中心"
                }, {
                    "userNum": 680,
                    "posNum": 80,
                    "name": "研发中心"
                }, {
                    "userNum": 780,
                    "posNum": 280,
                    "name": "运营中心"
                }, {
                    "userNum": 980,
                    "posNum": 380,
                    "name": "营销中心"
                }],
                "title": "一级组织规模",
                "type": "bar"
            }
        },
        "model2": {
            "userSex": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "用户性别"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "用户数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "男性",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "女性",
                    "value": 80,
                    "ratio": "8%"
                }],
                "title": "用户性别",
                "type": "pie"
            },
            "userEdu": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "用户学历"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "用户数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "博士",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "硕士",
                    "value": 80,
                    "ratio": "8%"
                }, {
                    "name": "本科",
                    "value": 80,
                    "ratio": "8%"
                }, {
                    "name": "大专",
                    "value": 80,
                    "ratio": "8%"
                }],
                "title": "用户学历",
                "type": "pie"
            },
            "userStatus": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "用户状态"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "用户数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "启用",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "禁用",
                    "value": 80,
                    "ratio": "8%"
                }],
                "title": "用户状态",
                "type": "pie"
            },
            "userPwdSafe": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "密码等级"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "用户数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "高",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "中",
                    "value": 580,
                    "ratio": "8%"
                }, {
                    "name": "低",
                    "value": 80,
                    "ratio": "8%"
                }],
                "title": "密码安全性",
                "type": "pie"
            }
        },
        "model3": {
            "posStatus": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "岗位状态"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "岗位数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "空岗",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "非空岗",
                    "value": 80,
                    "ratio": "8%"
                }],
                "title": "岗位状态",
                "type": "pie"
            },
            "posRank": {
                "tableColumns": [{
                    "prop": "name",
                    "id": "name",
                    "label": "岗位类型"
                }, {
                    "prop": "value",
                    "id": "value",
                    "label": "岗位数"
                }, {
                    "prop": "ratio",
                    "id": "ratio",
                    "label": "占比"
                }],
                "data": [{
                    "name": "一级",
                    "value": 980,
                    "ratio": "98%"
                }, {
                    "name": "二级",
                    "value": 80,
                    "ratio": "8%"
                }, {
                    "name": "三级",
                    "value": 80,
                    "ratio": "8%"
                }, {
                    "name": "四级",
                    "value": 80,
                    "ratio": "8%"
                }],
                "title": "岗位等级",
                "type": "pie"
            }
        }
    },
    "code": "",
    "solution": null
}

var ringOption1 = {

}