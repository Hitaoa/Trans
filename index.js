var appID='26382bf7be581c59'
var appSe='URt8jRFog5p2Ga2Kpp32GG2fQSwKVSvv'
$(function(){
    $("#go").click(function () { 
        $.ajax({
            type: "post",
            url: "https://openapi.youdao.com/ocrapi",
            data: encode(objTotext(getData(ima))),
            success: function (response) {
                console.log(response)
            }
        });
    });
  
});

function getData(image){
    uuid = guid()
    time=parseInt(new Date().getTime()/1000)
    console.log(uuid)
    image = image.substring(22,image.length)
    input = image.substring(0,10)+image.length+image.substring(image.length-10,image.length)
    console.log(appID+input+uuid+time+appSe)
    sign = CryptoJS.SHA256(appID+input+uuid+time+appSe).toString()
    console.log(sign)
    console.log(time+','+input+','+sign)
    console.log(image)
    mes = {
        img:image,
        langType:"auto",
        detectType:"10012",
        imageType:"1",
        appKey:appID,
        salt:uuid,
        sign:sign,
        docType:"json",
        signType:"v3",
        curtime:time.toString()
    }
    return mes
}

function ocr(image){
    console.log("1234567890")
    mes = getData(image)
    res = post("https://openapi.youdao.com/ocrapi",mes)
    console.log(res)
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function post(url,arr){
     // 发送ajax
    // （1） 获取 XMLHttpRequest对象
    xmlHttp = new XMLHttpRequest();
    console.log("array ",arr)
     //  (2) 连接服务器
    //  post
    xmlHttp.open("post",url);
    // 设置请求头的Content-Type
    xmlHttp.setRequestHeader("Content-Type","x-www-form-urlencoded");
    //xmlHttp.setRequestHeader("X-CSRFToken",ele_csrf.value);
    // （3） 发送数据
    console.log("array",arr)
    wsend = objTotext(arr)
    console.log(wsend)
    xmlHttp.send(wsend);   // 请求体数据
    // （4） 回调函数  success
    text = 0;
    xmlHttp.onreadystatechange = function() {
        if(this.status==200){
            console.log("responseText",this.responseText)
            text=this.responseText
        }
    };   
    return text;
}

function objTotext(obj){
    var result = ''
    for (var key in obj) {
        result = result+key+"="+obj[key]+"&"
    }
    return result.substring(0,result.length-1);
}

function encode(str){
    var had = ["","!","#","$","%","+",'@',":","=",'?']
    var give = ["%20","%21","%23","%24","%25","%2B","%40","%3A","%3D","%3F"]
    res = str
    for(var i=0;i<had.length;i++){
        res = res.replace(had[i],give[i])
    }
    return result
}