const crypto = require('crypto')

window.u = {
    image:"",
    screenCapture:function(){
        utools.screenCapture(base64Str => {
            console.log(base64Str)
            document.getElementById("image").src=base64Str;
            this.image = base64Str           
            return base64Str
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
        case "jtfy":{
            i = window.u.screenCapture();
            window.OCRTrans(i)
        }break;
        case "tpfy":{
            document.getElementById("image").src=payload
            window.u.image=payload
            window.OCRTrans(payload)
        }break;
    }
})     






