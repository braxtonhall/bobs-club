# bob's club

a webring for friends

## joining bob's club

1. pick an id
2. make a PR into this repository, adding your id as a key, and your website as a value to [`registry.json`](https://github.com/braxtonhall/bobs-club/edit/main/registry.json)
3. add one of the following html snippets (or some variation of them) to your website. don't forget to replace "ID" with your actual id from the first step

```html
<b>This site is a member of <a href="https://bobs-club.net/">bob's club!</a> check out a friend's website too</b><br />
<a href="https://bobs-club.net/site/ID/pred">previous site</a> --
<a href="https://bobs-club.net/site/ID/random">random site</a> --
<a href="https://bobs-club.net/site/ID/succ">next site</a>
```

```html
<span>
	<a href="https://bobs-club.net/site/ID/pred" title="previous site">&lt;&lt;</a>
	<a href="https://bobs-club.net/site/ID/random" title="random site">?</a>
	<a href="https://bobs-club.net/" title="web ring">bob's club</a>
	<a href="https://bobs-club.net/site/ID/succ" title="next site">&gt;&gt;</a>
</span>
```
