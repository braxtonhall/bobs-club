# bob's club

a webring for friends

## joining bob's club

1. pick an id
2. make a PR into this repository, adding your id as a key, and your website as a value to [`static/registry.json`](./static/registry.json)
3. add the following html (or some variation of it) to your website

```html
<b>This site is a member of <a href="https://bobs-club.net/">bob's club!</a> check out a friend's website too</b><br>
<a href="https://bobs-club.net/site/ID/pred">previous site</a> --
<a href="https://bobs-club.net/site/ID/random">random site</a> --
<a href="https://bobs-club.net/site/ID/succ">next site</a>
```
