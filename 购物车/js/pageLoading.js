function pageLoading(datacon,pagenum,filterData){
    $(window).unbind('scroll');//滚动条到页面底部加载更多功能
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();    //滚动条距离顶部的高度
        var scrollHeight = $(document).height();   //当前页面的总高度
        var clientHeight = $(this).height();    //当前可视的页面高度
        if(scrollTop + clientHeight >= scrollHeight-2){   
            pagenum++;//下一页
            if( $(".loading_p").length == 0){
                datacon.append( //加载中
                    "<p class='loading_p'>"+
                        "<span class='bt_loading'></span>"+
                        "<span class='loading_span'>加载中</span>"+
                    "</p>"
                )
            }
            filterData(datacon,pagenum);
            // setTimeout(function(){
            //     filterData(datacon,pagenum);
            // },2000)
            $(window).unbind('scroll');
        }
    });
}