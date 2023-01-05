appID ="44581899d351c37b"
appSe ="ysRuKfm5zNkrgsTxwrU0aeA0jqfP1ETI"
error_code = 0
let TIPS={
    APPID_ERROR:"请先在右下角的设置中参照文档说明申请并填写appid,本程序依赖它们工作！若已经配置，请检查它们是否配置OCR服务！",
    INTERNET_ERROR:"网络问题导致请求错误，请重试！",
    NonERROR_ERROR:"错误码：{ec}，请参照文档提交bug至issue或是邮件至dev@100721.xyz"
}

$(function(){
    $("#getScreen").click(function () { 
        window.u.screenCapture()               
    });

    $("#go").click(function () { 
        var transText = $("#input").val()
        if(transText != window.lastText){
            console.log(transText)
            window.trans(transText)
        }else{
            console.warn("That's the same")
        }

    });
    
    $("#copy").click(function () { 
        navigator.clipboard.writeText($("#result").val())
    });

    $("#settings").click(function () { 
        $(".setting").toggle()
    });

    $("#setCon").click(function () { 
        $(".setting").hide()
        appID = $("#appID").val()
        appSe = $("#appSec").val()
        window.u.DBput("appid",appID)
        window.u.DBput("appsec",appSe)
    });

    window.sOCR = function(image){
        $.ajax({
            type: "post",
            url: "https://openapi.youdao.com/ocrapi",
            data: objTotext(getOcrData(image)),
            async:false,
            success: function (response) {
                var resText="";
                ec = response["errorCode"]
                if(ec == 0){
                    console.log("ocr")
                    var res = response["Result"]["regions"]
                    for(var i = 0;i<res.length;i++){
                        lines=res[i.toString()]["lines"]
                        for(var j=0;j<lines.length;j++){
                            resText+=lines[j.toString()]["text"]+"\n"
                            
                        }                       
                    }  

                }
                else{
                    console.error(ec)
                    if(ec==113){
                        $("#result").val(TIPS.APPID_ERROR)
                    }else{
                        $("#result").val(TIPS.NonERROR_ERROR.replace("{ec}",ec))
                    }
                    return 0
                }
                // $(".input").find("textarea").each(function(){$(this).text($(this).val());});
                $("#input").val(resText)
                window.lastText = resText
            },
            error:function(){
                $("#result").val(TIPS.INTERNET_ERROR)
                return 0
            }
        });
        return 1
    }

    window.trans = function (text){
        console.log("trans")
        $.ajax({
            type: "post",
            url: "https://openapi.youdao.com/api",
            data: objTotext(getTransData(text)),
            async:false,
            success: function (response) {
                var resText="";
                ec = response["errorCode"]
                if(ec == 0){
                    // console.log("ocr")
                    var res = response["translation"]
                    for(var i = 0;i<res.length;i++){
                        resText+=res[i.toString()]+"\n"
                    }  
                    $("#result").val(resText)
                }
                else{
                    console.error(ec)
                    if(ec==113){
                        $("#result").val(TIPS.APPID_ERROR)
                    }else{
                        $("#result").val(TIPS.NonERROR_ERROR.replace("{ec}",ec))
                    }
                }
            }
        });
    }
});

function getOcrData(image){
    console.log(image)
    uuid = guid()
    time=parseInt(new Date().getTime()/1000)
    image = image.substring(22,image.length)
    input = image.substring(0,10)+image.length+image.substring(image.length-10,image.length)
    sign = window.u.sha256(appID+input+uuid+time+appSe).toString()
    mes = {
        img:encode(image),
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
    // console.log(mes)
    return mes
}

function getTransData(text){
    console.log(text)
    uuid = guid()
    time=parseInt(new Date().getTime()/1000)
    if(text.length <= 20){
        input = text
    }else{
        input = text.substring(0,10)+text.length+text.substring(text.length-10,text.length)
    }   
    sign = window.u.sha256(appID+input+uuid+time+appSe).toString()
    mes = {
        q:encode(text),
        from:"auto",
        to:"auto",
        appKey:appID,
        salt:uuid,
        sign:sign,
        signType:"v3",
        curtime:time.toString()
    }
    // console.log(mes)
    return mes
}



function objTotext(obj){
    var res = ""
    for (var key in obj) {
        var res = res+key+"="+obj[key]+"&"
    }
    // console.log("1",res)
    return res.substring(0,res.length-1);
}

function encode(str){
    var had = ["%"," ","!","#","$","+","@",":","=","?"]
    var give = ["%25","%20","%21","%23","%24","%2B","%40","%3A","%3D","%3F"]
    var res = str
    console.log(res)
    for(var i=0;i<had.length;i++){
        res = res.replaceAll(had[i],give[i])
    }
    // console.log(res)
    return res
}

function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

window.appInit=function(){
    if (appID!=""&appSe!=""){
        return
    }
    appID = window.u.DBget("appid")
    appSe = window.u.DBget("appsec")
}