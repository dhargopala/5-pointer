chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //console.log(request.link)
    //console.log(request.token)

    chrome.storage.local.get([request.link], (cache) => { 
      if (request.link in cache){
        //console.log("--------------",cache,request)
        if ("headline" in cache[request.link] && request.headline){
          sendResponse(cache[request.link].headline)
        }
        else if ("linkedin" in cache[request.link] && (request.social == "linkedin")){
          sendResponse(cache[request.link].linkedin)
        }
        else if ("twitter" in cache[request.link] && (request.social == "twitter")){
          sendResponse(cache[request.link].twitter)
        }
        else if ("pointers" in cache[request.link] && !("social" in request) && (!request.headline)){
          sendResponse(cache[request.link].pointers)
        }
      }
   })

    var prompt;
    var requestType;
    if (request.headline) {
      prompt = `Summarize ${request.link} in a one line headline.`
      requestType = "headline"
    }
    else if (request.social == "twitter"){
      prompt = `Write an informative tweet summarizing the contents of the webpage: ${request.link}`
      requestType = "twitter"
    }
    else if (request.social == "linkedin"){
      prompt = `Write an insightful linkedin post in 100 words including business lesson from: ${request.link}`
      requestType = "linkedin"
    }
    else {
      prompt = `Summarize ${request.link} in 5 one-liner points and format as a HTML Unordered List.`;
      requestType = "pointers"
    }
    // const prompt = `Summarize ${request.link} in 5 one-liner points and format as a HTML Ordered List of class "mdl-list" with each list item having class "mdl-list__item"`;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    //console.log(prompt)
      //console.log('running the background...')

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.token}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{"role":"user","content":prompt}],
          max_tokens: 2000,
          n: 1,
          temperature: 0
        })
      })
      .then(response => response.json())
      .then(data => {
        //console.log('Data:' , data)
        if ("error" in data) {
          sendResponse(data.error.message)
        } 
        else{
          const summary = data.choices[0].message.content;
          var data;
          chrome.storage.local.get([request.link], (cache) => { 
            if (request.link in cache){
              data = cache[request.link]
            }
            else {
              data = {}
            }
            data[requestType] = summary
            //console.log('----->',data)
            chrome.storage.local.set({
              [request.link] : data
            })
          })
          sendResponse(summary);
      }
      })
      .catch(error => {
        // abc = error
        //console.log('Error console:' , error)
        sendResponse('Error: ' , error.error.message);
      });
    return true;
  });  