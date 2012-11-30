// `TWD.omit(wordsList)`: Array of words to omit if found (e.g.: a, the, by, of, etc.)
// `TWD.get(username[, words count])`: optional words count, by default it's 20 top words.
// TODO: documentation

(function(global) {
    "use strict";

    if (!global.jQuery) {
        return false;
    }

    var $ = global.jQuery,
        TWD = global.TWD = {},
        URL_PREFIX = 'http://api.tumblr.com/v2/blog/',
        initialized = false,
        API_KEY = null,
        // TODO: ability to override this parameter
        MINIMUM_WORD_LENGTH = 4,
        omitted = {},

        finalStore = [],

        save = function(word, count) {
            finalStore.push({
                word: word,
                count: count
            });
        };

    TWD.init = function(apiKey) {
        if (initialized) {
            // throw new Exception('.init(\'API_KEY\') cannot be called twice.');
            return false;
        }
        if (!apiKey) {
            // throw new Exception('API key (first argument) is required.');
            return false;
        }
        API_KEY = apiKey;
        initialized = true;
    };

    TWD.omit = function(wordsList) {
        if (!initialized) {
            // throw new Exception('.init(\'API_KEY\') is required before using this method.');
            return false;
        }
        $.each(wordsList, function(i, word) {
            omitted['_' + word.toLowerCase()] = true;
        });
    };

    // TODO: keep looping through more results (pages of 20)
    // TODO: support other posts types
    TWD.get = function(username, count) {
        if (!initialized) {
            // throw new Exception('.init(\'API_KEY\') is required before using this method.');
            return false;
        }
        if (!username) {
            // throw new Exception('Username (first argument) is required.');
            return false;
        }
        var URL = URL_PREFIX + username + '.tumblr.com/posts/text?callback=?&api_key=' + API_KEY;
        count = count || 20;

        return $.getJSON(URL, function(data) {
            var texts = '',
                tempStore = {},
                store = [],
                currentCount = 0,
                i, l, word,
                j, words;

            // Save all words
            data.response.posts.map(function(item) {
                // Strip tags with jQuery
                texts += $(item.body).text();
            });

            // Parse each word and store the count
            texts = texts.split(/\b/);
            for (i = 0, l = texts.length; i < l; i++) {
                // Underscore usage to prevent Array#prototype conflicts
                tempStore['_' + texts[i]] = (tempStore['_' + texts[i]] || 0) + 1;
            }

            for (word in tempStore) {
                // TODO: add more validation rules
                if (word.length > MINIMUM_WORD_LENGTH && !(word.toLowerCase() in omitted)) {
                    store[tempStore[word]] = (store[tempStore[word]] || '') + word + ',';
                }
            }

            j = store.length;
            while (j--) {
                if (store[j]) {
                    words = store[j].split(',');
                    $.each(words, function(i, word) {
                        if (word && currentCount < count) {
                            save(word.replace('_', ''), j);
                            currentCount++;
                        }
                    });
                }
            }

            finalStore.sort(function(a, b) {
                return b.count - a.count;
            });

            this.finalStore = finalStore;
        });
    };

}(this));