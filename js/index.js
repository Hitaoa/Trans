var appID;//='26382bf7be581c59'
var appSe;//='URt8jRFog5p2Ga2Kpp32GG2fQSwKVSvv'

$(function(){
    $("#getScreen").click(function () { 
        screenCapture()               
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
        utoolsDBput("appid",$("#appID").val())
        utoolsDBput("appsec",$("#appSec").val())
    });

    window.sOCR = function(image){
        $.ajax({
            type: "post",
            url: "https://openapi.youdao.com/ocrapi",
            data: objTotext(getOcrData(image)),
            async:false,
            success: function (response) {
                var resText='';
                if(response['errorCode'] == 0){
                    console.log("ocr")
                    var res = response['Result']["regions"]
                    for(var i = 0;i<res.length;i++){
                        lines=res[i.toString()]["lines"]
                        for(var j=0;j<lines.length;j++){
                            resText+=lines[j.toString()]["text"]+"\n"
                        }
                    }  
                }
                else{
                    console.error(errorCode)
                }
                $("#input").text(resText)
                window.lastText = resText
            },
            error:function(){
                console.error('ERROR')
            }
        });
    }

    window.trans = function (text){
        console.log("trans")
        $.ajax({
            type: "post",
            url: "https://openapi.youdao.com/api",
            data: objTotext(getTransData(text)),
            async:false,
            success: function (response) {
                var resText='';
                if(response['errorCode'] == 0){
                    console.log("ocr")
                    var res = response['translation']
                    for(var i = 0;i<res.length;i++){
                        resText+=res[i.toString()]+"\n"
                    }  
                }
                else{
                    console.error(errorCode)
                    resText = "发生了错误，错误码为"+errorCode
                }
                $("#result").text(resText)
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
    sign = CryptoJS.SHA256(appID+input+uuid+time+appSe).toString()
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
    console.log(mes)
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
    sign = CryptoJS.SHA256(appID+input+uuid+time+appSe).toString()
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
    console.log(mes)
    return mes
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function objTotext(obj){
    var res = ''
    for (var key in obj) {
        var res = res+key+"="+obj[key]+"&"
    }
    console.log("1",res)
    return res.substring(0,res.length-1);
}

function encode(str){
    var had = ["%"," ","!","#","$","+",'@',":","=",'?']
    var give = ["%25","%20","%21","%23","%24","%2B","%40","%3A","%3D","%3F"]
    var res = str
    console.log(res)
    for(var i=0;i<had.length;i++){
        res = res.replaceAll(had[i],give[i])
    }
    console.log(res)
    return res
}

function appInit(){
    appID = utoolsDBget("appid")
    appSe = utoolsDBget("appsec")
}