var con = false
utools.onPluginEnter(({code,type,payload})=>{
    console.log('user in.')
    appInit()
    screenCapture()

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