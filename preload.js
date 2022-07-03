var ima = '';
utools.onPluginEnter(({code,type,payload})=>{
    console.log('user in.')
})     

utools.screenCapture(base64Str => {
    console.log(base64Str)
    document.getElementById("image").src=base64Str;
    ima=base64Str;
})