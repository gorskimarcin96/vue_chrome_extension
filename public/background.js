//command to copy data for clipboard
chrome.commands.onCommand.addListener(() => {
    chrome.storage.sync.get(['words'], function (result) {
        let words = Object.values(result.words);

        chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: function () {
                    return window.getSelection().toString()
                }
            }, (response => {
                const word = response[0].result;

                if (word) {
                    words.push(word);
                    chrome.storage.sync.set({'words': words}, function () {
                        chrome.notifications.create(words.length.toString(), {
                            type: 'basic',
                            iconUrl: './logo.png',
                            title: 'mgorski.dev',
                            message: words.length + ': Added word "' + word + '" to clipboard.',
                        })
                    });
                }
            }));
        });
    });
});

//event listener for complete and send form
chrome.runtime.onMessage.addListener(function (request) {
    if (request.event_name && request.event_name === 'log_in') {
        chrome.tabs.create({url: request.url, active: true}, tab => {
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: (request) => {
                    let loginField = document.querySelector("[type=email]") ?? document.querySelector("[type=text]") ?? false;
                    let passwordField = document.querySelector("[type=password]") ?? false;
                    let submitButton = document.querySelector("[type=submit]") ?? false;

                    loginField ? loginField.value = request.login : loginField = false;
                    passwordField ? passwordField.value = request.password : passwordField = false;


                    if (loginField && passwordField && submitButton) {
                        submitButton.click();
                    }
                },
                args: [request]
            })
        });
    }
});
