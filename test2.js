1
(function(){var a="1.1.0";var r="";var e="https://alitest-gw-app-api.iauto360.cn/gw-collector";var t="";var i="";var s="";var n={params:{A1:[{B1:"",B2:"page",B3:"PageView",B4:{C1:0,C2:0,C4:"",C5:"",C6:-2,C7:0,C8:"PageView",C9:"page",C10:"",C11:1,C12:0},B5:{fromElement:"",fromUrl:"",fromModel:"",fromSubjectLocationId:"",fromSubectBizId:"",fromEntryLocationId:"",fromEntryBizId:"",curElement:"",curUrl:"",curModel:"",curSubjectLocationId:"",curSubjectBizId:"",curEntryLocationId:"",curEntryBizId:"",specialId:"",specialName:"",pageName:"",pageGroup:""}}],A2:{D1:0,D2:"",D3:"",D4:"",D5:"",D6:"",D7:"",D8:"",D9:0,D10:0,D11:"",D12:0,D13:"",D14:"",D15:"",D16:a,D17:1}}};n.params.A1[0].B4.C1=(new Date).getTime();n.params.A1[0].B4.C2=n.params.A1[0].B4.C1;if(localStorage.uuid){n.params.A2.D5=localStorage.uuid}else{r=_uuid();n.params.A2.D5=r;localStorage.uuid=r}if(document){n.params.A1[0].B5.fromUrl=document.referrer||"";n.params.A1[0].B5.curUrl=document.URL||""}if(window&&window.screen){n.params.A2.D9=window.screen.width||0;n.params.A2.D10=window.screen.height||0}window.addEventListener("DOMContentLoaded",function(){if(document.getElementById("search_ipt")){document.getElementById("search_ipt").onsearch=function(){if(localStorage.YMOEM){var a=JSON.parse(localStorage.YMOEM);a.params.A1[0].B1=document.getElementById("search_ipt").value;a.params.A1[0].B2="word";a.params.A1[0].B4.C9="word";a.params.A1[0].B3="Search";a.params.A1[0].B4.C8="Search";localStorage.Search=JSON.stringify(a.params)}}}},false);if(navigator){if(_IsIOS()){n.params.A2.D12=2;n.params.A2.D4="Apple"}else if(_IsAndroid()){n.params.A2.D12=1;n.params.A2.D4=navigator.userAgent||""}n.params.A2.D8=navigator.userAgent||"";n.params.A2.D13=navigator.language.split("-")[1]||"";n.params.A2.D14=navigator.language.split("-")[0]||""}if(_maq){for(var o in _maq){switch(_maq[o][0]){case"appId":n.params.A2.D1=_maq[o][1];break;case"initiatorId":n.params.A1[0].B4.C10=_maq[o][1];break;case"version":n.params.A2.D2=_maq[o][1];break;case"channel":n.params.A2.D3=_maq[o][1];break;case"targetId":n.params.A1[0].B1=_maq[o][1];t=_maq[o][1];break;case"specialId":n.params.A1[0].B5.specialId=_maq[o][1];break;case"specialName":n.params.A1[0].B5.specialName=_maq[o][1];break;case"curModel":n.params.A1[0].B5.curModel=_maq[o][1];break;case"pageName":n.params.A1[0].B5.pageName=_maq[o][1];break;case"pageGroup":n.params.A1[0].B5.pageGroup=_maq[o][1];break;case"landPage":s=_maq[o][1];break;case"fromEntryBizId":n.params.A1[0].B5.fromEntryBizId=_maq[o][1];break;default:break}}}var c=function(a){a=a||window.event;var r=a.srcElement||a.target;while(true){if(r.tagName=="BODY"||!(attr=r.attributes)){break}if(attr["targetId"]){n.params.A1[0].B1=attr["targetId"].value}if(attr["targetType"]){n.params.A1[0].B2=attr["targetType"].value;n.params.A1[0].B4.C9=attr["targetType"].value}if(attr["action"]){n.params.A1[0].B3=attr["action"].value;n.params.A1[0].B4.C8=attr["action"].value}if(attr["curUrl"]){n.params.A1[0].B5.curUrl=attr["curUrl"].value}if(attr["curSubjectLocationId"]){n.params.A1[0].B5.curSubjectLocationId=attr["curSubjectLocationId"].value}if(attr["curSubjectBizId"]){n.params.A1[0].B5.curSubjectBizId=attr["curSubjectBizId"].value}if(attr["curEntryLocationId"]){n.params.A1[0].B5.curEntryLocationId=attr["curEntryLocationId"].value}if(attr["curEntryBizId"]){n.params.A1[0].B5.curEntryBizId=attr["curEntryBizId"].value}if(attr["isNoLink"]){i=attr["isNoLink"].value}try{r=r.parentNode}catch(a){break}}if(n.params.A1[0].B1!=""){n.params.A1[0].B5.fromUrl="";n.params.A1[0].B5.curElement="icon";if(n.params.A1[0].B5.stayTime||n.params.A1[0].B5.stayTime===0){delete n.params.A1[0].B5.stayTime}if(n.params.A1[0].B3=="Clicked"){localStorage.Clicked=JSON.stringify(n.params)}console.log(i);if(i=="1"){localStorage.extraData=JSON.stringify(n.params);_ymAjax({method:"POST",url:e,data:JSON.stringify({params:_zip(JSON.stringify(n.params))}),success:function(a){try{if(typeof bigDataCallback=="function"){bigDataCallback("dataPostSuccess")}else{console.log("函数不存在")}}catch(a){}console.log(a);n.params.A1[0].B1="";localStorage.removeItem("Clicked")}})}}};var m=function(a,r){if(document.addEventListener){document.addEventListener(a,r)}else{document.attachEvent("on"+a,r)}};m("click",c);function u(){n.params.A1[0].B5.stayTime=(new Date).getTime()-n.params.A1[0].B4.C1;n.params.A1[0].B2="page";n.params.A1[0].B4.C9="page";n.params.A1[0].B3="PageOut";n.params.A1[0].B4.C8="PageOut";if(n.params.A1[0].B5.curModel=="detail"){n.params.A1[0].B1=t}else{n.params.A1[0].B1=n.params.A1[0].B5.curModel}n.params.A1[0].B5.fromUrl="";n.params.A1[0].B5.curElement="";n.params.A1[0].B5.curUrl="";n.params.A1[0].B5.curSubjectLocationId="";n.params.A1[0].B5.curSubjectBizId="";n.params.A1[0].B5.curEntryLocationId="";n.params.A1[0].B5.curEntryBizId="";localStorage.PageOut=JSON.stringify(n.params);n.params.A1[0].B1=""}window.onbeforeunload=function(a){u()};if(_IsIOS()){window.addEventListener("pagehide",function(){u()},false)}localStorage.PageView=JSON.stringify(n);localStorage.YMOEM=JSON.stringify(n);_ymAjax({method:"POST",url:e,data:JSON.stringify({params:_zip(JSON.stringify(n.params))}),success:function(a){n.params.A1[0].B1=""}});if(s==1||GetQueryValue("landPage")==1){n.params.A1[0].B3="LandingPage";n.params.A1[0].B4.C8="LandingPage";_ymAjax({method:"POST",url:e,data:JSON.stringify({params:_zip(JSON.stringify(n.params))}),success:function(a){n.params.A1[0].B1=""}})}if(localStorage.Clicked){_ymAjax({method:"POST",url:e,data:JSON.stringify({params:_zip(localStorage.Clicked)}),success:function(a){localStorage.removeItem("Clicked")}})}if(localStorage.PageOut){_ymAjax({method:"POST",url:e,data:JSON.stringify({params:_zip(localStorage.PageOut)}),success:function(a){localStorage.removeItem("PageOut")}})}if(localStorage.Search){_ymAjax({method:"POST",url:e,data:JSON.stringify({params:_zip(localStorage.Search)}),success:function(a){localStorage.removeItem("Search")}})}})();function _IsIOS(){if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){return true}else{return false}}function _IsAndroid(){if(/(Android|Adr)/i.test(navigator.userAgent)){return true}else{return false}}function GetQueryValue(a){var r=decodeURI(window.location.search.substring(1));var e=r.split("&");for(var t=0;t<e.length;t++){var i=e[t].split("=");if(i[0]==a){return i[1]}}return null}function _uuid(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var r=Math.random()*16|0,e=a=="x"?r:r&3|8;return e.toString(16)})}function _ymAjax(a){a=a||{};a.method=a.method.toUpperCase()||"POST";a.url=a.url||"";a.async=a.async||true;a.data=a.data||null;a.success=a.success||function(){};var r=null;if(XMLHttpRequest){r=new XMLHttpRequest}else{r=new ActiveXObject("Microsoft.XMLHTTP")}var e=[];for(var t in a.data){e.push(t+"="+a.data[t])}var i=e.join("&");if(a.method.toUpperCase()==="POST"){r.open(a.method,a.url,a.async);r.setRequestHeader("Content-Type","application/json;charset=utf-8");r.send(a.data)}else if(a.method.toUpperCase()==="GET"){r.open(a.method,a.url+"?"+i,a.async);r.send(null)}r.onreadystatechange=function(){if(r.readyState==4&&r.status==200){a.success(r.responseText)}}}function _unzip(a){var r=atob(a);var e=r.split("").map(function(a){return a.charCodeAt(0)});var t=new Uint8Array(e);var i=pako.inflate(t);r=String.fromCharCode.apply(null,new Uint16Array(i));return r}function _zip(a){var r=pako.gzip(a,{to:"string"});return btoa(r)}