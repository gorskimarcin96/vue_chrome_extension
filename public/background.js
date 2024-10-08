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
