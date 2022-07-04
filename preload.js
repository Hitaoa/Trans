var con = false
utools.onPluginEnter(({code,type,payload})=>{
    console.log('user in.')
    // screenCapture()
})     

function screenCapture(){
    utools.screenCapture(base64Str => {
        console.log(base64Str)
        document.getElementById("image").src=base64Str;
        window.sOCR(base64Str)
        window.trans(window.lastText)
    })
}