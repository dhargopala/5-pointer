const output = document.getElementById('output');
const loadingBar = document.getElementById('loading-bar');
function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
window.onload = async function(){
    const response = await fetch('https://chat.openai.com/api/auth/session');
    if (response.status == 403){
        output.align = "center"
        output.style.marginRight = "0px"
        output.innerHTML = '<a class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" data-upgraded=",MaterialButton" style="margin-top:100px;" href="https://chat.openai.com" id="auth" target="_blank" rel="noreferrer">Login to your OpenAI account</a>'
    }
    const auth_info = await response.json();
    //console.log('auth')
    const token = auth_info.accessToken;
    //console.log(auth_info)
    if (!token){
        output.align = "center"
        output.style.marginRight = "0px"
        output.innerHTML = '<a class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" data-upgraded=",MaterialButton" style="margin-top:100px;" href="https://chat.openai.com" id="auth" target="_blank" rel="noreferrer">Login to your OpenAI account</a>'
    }
    loadingBar.style.marginTop = "150px"
    loadingBar.style.opacity = 1;
    function _getCurrentTab(callback){ 
        chrome.tabs.query({active:true, currentWindow:true},function(tab){
            callback(tab);
        });
    };
    function _displaySummary(tab){
        //console.log(tab[0].url);
        //console.log(token);

        if (tab[0].url && token){
            chrome.runtime.sendMessage({
            headline: true,
            link: tab[0].url,
            token: token
        }   , (response) => {
            output.innerHTML = '<p style="margin-right:-15px;margin-left:25px;font-size:16px;"><i>' + response.replaceAll('"','') + "</i></p>";
            loadingBar.style.marginTop = "100px"
            //console.log(response)
        })

        chrome.runtime.sendMessage({
            headline: false,
            link: tab[0].url,
            token: token
        }   , (response) => {
            loadingBar.remove()

            var points = document.createElement('div');
            points.innerHTML = response;
            const listItems = points.querySelectorAll('li')
            var finalList = document.createElement('ul')
            finalList.className = "mdl-list"
            var listItem
            listItems.forEach((item) => {
                listItem = document.createElement('li')
                listItem.className = "mdl-list__item"
                listItem.style.fontSize = "14px"
                listItem.style.padding = "0px"
                listItem.style.paddingLeft = "20px"
                listItem.style.paddingBottom = "20px"
                listItem.style.marginBottom = "0px"
                listItem.innerHTML = `<span class="material-icons mdl-list__item-icon">check</span>${item.innerHTML}`
                finalList.appendChild(listItem)
            })
            output.innerHTML += finalList.innerHTML
            output.innerHTML += `
            <a id="twitter" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" data-upgraded=",MaterialButton" style="font-size:12px;padding:0px;float:center;margin-left:40px;width:150px;margin-bottom:50px;color:rgb(68,138,255);">Write a Tweet</a>
            <a id="linkedin" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" data-upgraded=",MaterialButton" style="font-size:12px;float:center;margin-left:15px;width:150px;margin-bottom:50px;padding:0px;color:rgb(68,138,255);">Write a Linkedin Post</a></h6>
            `
            //console.log(response)

            const twitter = document.getElementById("twitter")
            const linkedin = document.getElementById("linkedin")
            twitter.addEventListener("click", () => {
                    output.innerHTML += `
                    <div id="loading-bar" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="opacity:1;/* margin-right:auto; *//* margin-left:auto; */margin-left: 40px;/* margin-right: 40px; *//* width:250px; */width: 320px;margin-top: -30px;/* margin-bottom:0.7em; *//* border:20px; *//* height:100px; */">
                    <div class="progressbar bar bar1" style="width: 0%"></div>
                    <div class="bufferbar bar bar2" style="width: 100%;"></div>
                    <div class="auxbar bar bar3" style="width: 0%;"></div><br></div>
                    `
                    chrome.runtime.sendMessage({
                    headline: false,
                    social: "twitter",
                    link: tab[0].url,
                    token: token
                }   , (response) => {
                    //console.log(response)
                    document.getElementById("twitter").remove()
                    document.getElementById("linkedin").remove()
                    document.getElementById("loading-bar").remove()
                    removeElementsByClass('mdl-list__item')
                    //console.log(twitter)
                    //output.innerHTML += '<p align="center" style="font-size:16px;background-color:#2196F3;color: white;text-align:center;padding: .2em;width: 400px;margin-top:0px;">Tweet</p>'
                    //output.innerHTML += `<div class="demo-card-wide mdl-card mdl-shadow--2dp" style="width:320px;margin-left:40px;"><div class="mdl-card__supporting-text">${response.replaceAll('"','')}</div></div>`
                    output.innerHTML += `<div class="demo-card-wide mdl-card mdl-shadow--2dp" style="width:320px;margin-left:40px;"><div class="mdl-card__title" style="color:rgba(0,0,0,.7)">Tweet</div><div class="mdl-card__actions mdl-card--border"></div><div class="mdl-card__supporting-text" align="left">${response.replaceAll('"','')}</div></div>`
                    //output.innerHTML += `<a id="linkedin" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" data-upgraded=",MaterialButton" style="font-size:12px;float:center;margin-left:109px;width:150px;margin-top: 20px;margin-bottom: 20px;">Write a Linkedin Post</a>`
                    
                    //output.innerHTML += '<p style="margin-right:-15px;margin-left:25px;font-size:14px;"><i>' + response.replaceAll('"','') + "</i></p>";
                })
            })

        linkedin.addEventListener("click", () => {
            output.innerHTML += `
            <div id="loading-bar" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="opacity:1;/* margin-right:auto; *//* margin-left:auto; */margin-left: 40px;/* margin-right: 40px; *//* width:250px; */width: 320px;margin-top: -30px;/* margin-bottom:0.7em; *//* border:20px; *//* height:100px; */">
            <div class="progressbar bar bar1" style="width: 0%"></div>
            <div class="bufferbar bar bar2" style="width: 100%;"></div>
            <div class="auxbar bar bar3" style="width: 0%;"></div><br></div>
            `
            chrome.runtime.sendMessage({
            headline: false,
            social: "linkedin",
            link: tab[0].url,
            token: token
        }   , (response) => {
            //console.log(response)
            document.getElementById("twitter").remove()
            document.getElementById("linkedin").remove()
            document.getElementById("loading-bar").remove()
            removeElementsByClass('mdl-list__item')
            //console.log(twitter)
            //output.innerHTML += '<p align="center" style="font-size:16px;background-color:#2196F3;color: white;text-align:center;padding: .2em;width: 400px;margin-top:0px;">Tweet</p>'
            //output.innerHTML += `<div class="demo-card-wide mdl-card mdl-shadow--2dp" style="width:320px;margin-left:40px;"><div class="mdl-card__supporting-text">${response.replaceAll('"','')}</div></div>`
            output.innerHTML += `<div class="demo-card-wide mdl-card mdl-shadow--2dp" style="width:320px;margin-left:40px;bottom:10px;"><div class="mdl-card__title" style="color:rgba(0,0,0,.7)">LinkedIn Post</div><div class="mdl-card__actions mdl-card--border"></div><div class="mdl-card__supporting-text" align="left">${response.replaceAll('"','')}</div></div>`
            //output.innerHTML += `<a id="twitter" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" data-upgraded=",MaterialButton" style="font-size:12px;float:center;margin-left:109px;width:150px;margin-top: 20px;margin-bottom: 20px;">Write a Tweet</a>`
            //output.innerHTML += '<p style="margin-right:-15px;margin-left:25px;font-size:14px;"><i>' + response.replaceAll('"','') + "</i></p>";
        })
    })

})
};
     };
     _getCurrentTab(_displaySummary);
    }
