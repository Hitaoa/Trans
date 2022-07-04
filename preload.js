var con = false
utools.onPluginEnter(({code,type,payload})=>{
    console.log('user in.')
    appInit()
    switch(code){
        case "jtfy":screenCapture();break;
        case "tpfy":{
            document.getElementById("image").src=payload;
            window.sOCR(payload)
            window.trans(window.lastText)
        }break;
    }
})     

function screenCapture(){
    utools.screenCapture(base64Str => {
        console.log(base64Str)
        document.getElementById("image").src=base64Str;
        window.sOCR(base64Str)
        window.trans(window.lastText)
    })
}

function utoolsDBput(key,value){
    utools.dbStorage.setItem(key,value)
}

function utoolsDBget(key){
    return utools.dbStorage.getItem(key)
}