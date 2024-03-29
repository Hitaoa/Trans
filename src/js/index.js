var appID = "44581899d351c37b"
var appSe = "ysRuKfm5zNkrgsTxwrU0aeA0jqfP1ETI"
var from = "auto"
var to = "auto"
var ttsPlat = "ttsN"//默认不提供tts服务

$(function(){
    for(let key in languages){
        $("#from").append("<option value='"+key+"'>"+languages[key]+"</option>");
        $("#to").append("<option value='"+key+"'>"+languages[key]+"</option>");
        $("#froms").append("<option value='"+key+"'>"+languages[key]+"</option>");
        $("#tos").append("<option value='"+key+"'>"+languages[key]+"</option>");
    }

    $(".audio").click(function () { 
        if(ttsPlat=="ttsY"){
            var u = $(this).attr("url")
            new Audio(u).play()
        }else{
            console.log($(this).parent().children("textarea").val())
            window.u.textSpeak($(this).parent().children("textarea").val(),4)
        }
    });

    $("#from").change(function () { 
        from = $("#from").val();
    });
    $("#to").change(function () { 
        to = $("#to").val();
    });

    $("#getScreen").click(function () { 
        window.u.screenCapture()              
    });

    $("#restart").click(function () { 
        window.OCRTrans(window.u.image)
    });

    $("#go").click(function () { 
        var transText = $("#input").val()
        if(transText != window.lastText){
            window.trans(transText)
        }
    });
    
    $("#copy").click(function () { 
        navigator.clipboard.writeText($("#result").val())
    });

    $("#settings").click(function () { 
        if(!window.u.isWindows()){
            $("#ttsW").attr("disabled", "disabled");
        } 
        $("#appID").val(appID)
        $("#appSec").val(appSe)
        $("#froms").val(from);
        $("#tos").val(to);
        $(`#${ttsPlat}`).attr("checked", "checked");
        $(".setting").toggle()
    });

    $("#setCon").click(function () { 
        $(".setting").hide()
        appID = $("#appID").val()
        appSe = $("#appSec").val()
        from = $("#froms").val();
        to = $("#tos").val();
        ttsPlat=$("input[type='radio']:checked").attr("id")
        if(ttsPlat=="ttsN"){
            $(".audio").hide();
        }else{
            $(".audio").show();
        }
        window.u.DBput("appid",appID)
        window.u.DBput("appsec",appSe)
        window.u.DBput("from",from)
        window.u.DBput("to",to)
        window.u.DBput("ttsPlat",ttsPlat)
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
                    if(res==""){
                        $("#input").val(TIPS.NOTEXT_ERROR)
                        return 1
                    }
                }
                else{
                    console.error(ec)
                    error(TIPS.TRANS_PLACE,ec)
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
        $.ajax({
            type: "post",
            url: "https://openapi.youdao.com/api",
            data: objTotext(getTransData(text)),
            async:false,
            success: function (response) {
                var resText="";
                ec = response["errorCode"]
                if(ec == 0){
                    console.log(response)
                    var res = response["translation"]
                    for(var i = 0;i<res.length;i++){
                        resText+=res[i.toString()]+"\n"
                    }  
                    $("#result").val(resText)
                    $("#fromA").attr("url",response["speakUrl"]);
                    $("#toA").attr("url",response["tSpeakUrl"]);                    
                }
                else{
                    console.log(ec)
                    error(TIPS.TRANS_PLACE,ec)
                }
            }
        });
    }

    window.OCRTrans = function(image){
        if(window.sOCR(image)){
            window.trans(window.lastText)
        }
    }
});


function getOcrData(image){
    var uuid = guid()
    var time=parseInt(new Date().getTime()/1000)
    var image = image.substring(22,image.length)
    var input = image.substring(0,10)+image.length+image.substring(image.length-10,image.length)
    var sign = window.u.sha256(appID+input+uuid+time+appSe).toString()
    var mes = {
        img:encode(image),
        langType:from,
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
    var uuid = guid()
    var time=parseInt(new Date().getTime()/1000)
    var input=""
    if(text.length <= 20){
        input = text
    }else{
        input = text.substring(0,10)+text.length+text.substring(text.length-10,text.length)
    }   
    var sign = window.u.sha256(appID+input+uuid+time+appSe).toString()
    var mes = {
        q:encode(text),
        from:from,
        to:to,
        appKey:appID,
        salt:uuid,
        sign:sign,
        signType:"v3",
        curtime:time.toString()
    }
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
    for(var i=0;i<had.length;i++){
        res = res.replaceAll(had[i],give[i])
    }
    return res
}

function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function error(place,ec){
    ec=parseInt(ec)
    switch(ec){
        case 108:
            $("#result").val(place+TIPS.APPID_ERROR)//错误码108，APPID配置问题
            break
        case 110:
            $("#result").val(place+TIPS.APP_ERROR)//错误码110，应用开通问题
            break
        case 401:
            $("#result").val(place+TIPS.NOMONEY_ERROR)//错误码401，账户欠费问题
            break
        default:
            $("#result").val(place+TIPS.NonERROR_ERROR.replace("{ec}",ec))
    }
}

window.appInit=function(){
    if (appID==""&appSe==""){
        appID = window.u.DBget("appid")
        appSe = window.u.DBget("appsec")
    } 
    var f = window.u.DBget("from")
    var t = window.u.DBget("to")
    if(f!=undefined||t!=undefined){
        from=f
        to=t
        $("#from").val(f);
        $("#to").val(t);
    }
    t=window.u.DBget("ttsPlat")
    if(t!=undefined){
        ttsPlat=t
        
    }
    if(ttsPlat=="ttsN"){
        $(".audio").hide();
    }
}