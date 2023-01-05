const crypto = require('crypto')
var con = false

window.u = {
    screenCapture:function(){
        utools.screenCapture(base64Str => {
            console.log(base64Str)
            document.getElementById("image").src=base64Str;
            if(window.sOCR(base64Str)){
                window.trans(window.lastText)
            }
            
        })
    },
    DBget:function(key){
        return utools.dbStorage.getItem(key)
    },
    DBput:function(key,value){
        utools.dbStorage.setItem(key,value)
    },
    sha256:function(str){
        let hash = crypto.createHash('sha256')
            .update(str)
            .digest('hex');
        console.log(hash)
        return hash;
    }
}

//插件加载
utools.onPluginEnter(({code,type,payload})=>{
    console.log('user in.')
    window.appInit()
    switch(code){
        case "jtfy":window.u.screenCapture();break;
        case "tpfy":{
            document.getElementById("image").src=payload;
            window.sOCR(payload)
            window.trans(window.lastText)
        }break;
    }
})     






