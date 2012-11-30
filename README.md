Tumblr Words Density
======

Get a list of the most used words in a Tumblr blog.

<!-- [Demo](?) -->

Options
-----
`TWD.omit(wordsList)`: Array of words to omit if found (e.g.: a, the, by, of, etc.)

`TWD.get(username[, words count])`: optional words count, by default it's 20 top words.

Usage
-----

The script relies on [jQuery](http://jquery.com/) (or [Zepto](http://zeptojs.com/))
To test enter the username (the one that works with *.tumblr.com):

    var list = TWD.get('tomasdev');
    console.log(list);