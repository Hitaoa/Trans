const crypto = require('crypto')
const { exec } = require('child_process');
const iconv = require('iconv-lite');

window.u = {
    image:"",
    screenCapture:function(){
        utools.screenCapture(base64Str => {
            console.log(base64Str)
            document.getElementById("image").src=base64Str;
            this.image = base64Str
            window.OCRTrans(base64Str)           
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
    },
    openURL:function(url){
        utools.shellOpenExternal(url)
    },
    textSpeak(text,speed){
        exec(`powershell.exe Add-Type -AssemblyName System.speech; $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.Rate =${speed}; $speak.Speak([Console]::In.ReadLine()); exit`).stdin.end(iconv.encode(text, 'gbk'));
    }
}

//插件加载
utools.onPluginEnter(({code,type,payload})=>{
    console.log('user in.')
    window.appInit()
    switch(code){
        case "jtfy":{
            window.u.screenCapture();
        }break;
        case "tpfy":{
            document.getElementById("image").src=payload
            window.u.image=payload
            window.OCRTrans(payload)
        }break;
    }
})     






