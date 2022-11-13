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
