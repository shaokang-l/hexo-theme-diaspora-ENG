# Hexo-theme-diaspora


**[在线预览 | PREVIEW ](http://fech.in)**

一款基于WP移植的Hexo主题，适合喜欢摄影，影评，乐评和玩弄文字的你，干净，清新； 响应式，Ajax，更多好玩的等你来发现。 

> 再次感谢原作者创作出这么精美的主题 [@Loeify](https://github.com/LoeiFy/Diaspora) 。如果你喜欢，请捐助原作者。

![cover](https://fech.in/static/images/Diaspora.jpg)


### 安装主题

``` bash
$ git clone https://github.com/Fechin/hexo-theme-diaspora.git themes/diaspora
```


### 启用主题

修改Hexo配置文件 `_config.yml` 主题项设置为diaspora


``` yaml

...
theme: diaspora
...
```
### 更新主题

注意：请在更时主题时备份`_config.yml`配置文件

``` bash
cd themes/diaspora
git pull
```


### 新建文章模板

``` markdown
---
title: My awesome title
date: 2016-10-12 18:38:45
categories: 
    - 分类1
    - 分类2
tags: 
    - 标签1
    - 标签2
mp3: http://domain.com/awesome.mp3
cover: http://domain.com/awesome.jpg
---
```

### 创建分类页
1 新建一个页面，命名为 categories 。命令如下：
```
hexo new page categories
```
2 编辑刚新建的页面，将页面的类型设置为 categories
``` 
title: categories
date: 2014-12-22 12:39:04
type: "categories"
---
```
主题将自动为这个页面显示所有分类。

### 创建标签页
1 新建一个页面，命名为 tags 。命令如下：
```
hexo new page tags
```
2 编辑刚新建的页面，将页面的类型设置为 tags
```
title: tags
date: 2014-12-22 12:39:04
type: "tags"
---
```
主题将自动为这个页面显示所有标签。

### 创建搜索页

1 需要安装hexo的搜索插件
```
npm install hexo-generator-searchdb --save
```

2 配置hexo全局配置文件（请将生成的索引文件放在网站根目录或修改主题js文件的path值）
```yml
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```

3 新建一个页面，命名为 search 。命令如下：
```
hexo new page search
```
4 编辑刚新建的页面，将页面的类型设置为 search
```
title: search
date: 2014-12-22 12:39:04
type: "search"
---
```

5 在主题配置文件启用本地搜索
```yml
#本地搜索,请将索引文件放在网站根目录
local_search:
    #是否启用
    enable: true

```

主题将自动为这个页面显示搜索功能。



### 主题配置
```yml
# 头部菜单，title: link
menu:
  首页: /
  分类: /categories
  标签: /tags
  归档: /archives  
  关于: /about

# 是否显示目录
TOC: false

# 是否自动播放音乐
autoplay: false

# 默认音乐（随机播放）
mp3: 
    - http://link.hhtjim.com/163/425570952.mp3
    - http://link.hhtjim.com/163/425570952.mp3

# 首页封面图, 为空时取文章的cover作为封面(注意跨域问题,建议使用同源图片)
welcome_cover: /img/welcome-cover.jpg


# 默认文章封面图（随机调用,支持外链）
cover: 
  - /img/cover.jpg
  - /img/welcome-cover.jpg

# 是否显示Twitter分享卡片图像(图像尺寸要求：1200*600，creatorid不需要带@符号。注意：链接必须是完整url，否则Twitter将无法读取图片信息）
twitterpic:
  enable: false
  src: https://bangdream.moe/img/ident.png
  creatorid: yourtwitteridhere

# 是否关闭默认滚动条
scrollbar: true

# 本地搜索,请将索引文件放在网站根目录,或修改主题js文件的path值
local_search:
    # 是否启用
    enable: false

# 是否显示 一言(hitokoto)
hitokoto: true

# 链接(可选:facebook,twitter,github,wechat,email)
links:
    facebook: /
    twitter: /
    github: /
    wechat: /img/logo.png
    email: mailto:xxxx@gmail.com
  
# 备案
beian: 
    # 是否显示备案信息
    enable: true
    # 是否在主页面最底下显示备案信息(虽然丑，但是完全满足规定要求)
    enableFooter: false
    # 备案号
    beianInfo: 冀ICP备xxxxxxx号
    # 链接地址
    link: http://www.beian.miit.gov.cn

# 是否使用mathjax
mathjax: false

# Valine 评论 (LeanCloud, https://valine.js.org)
valine:
    # 是否启用评论功能
    enable: false
    # 是否自动展开评论框
    autoExpand: false
    # LeanCloud 应用的 AppID / AppKey
    appId: ''
    appKey: ''
    # 评论框占位文字
    placeholder: '到此一游'
    # 头像风格: mp, identicon, monsterid, wavatar, retro, robohash, hide
    avatar: robohash
    # 提交时需要验证码
    verify: true

# 网站关键字
keywords: Fechin

# 要使用google_analytics进行统计的话，这里需要配置ID
google_analytics: 

# 网站ico
favicon: /img/favicon.png

# rss文件
rss: atom.xml

```


### NPR 三维封面与菜单 (three.js)

首页封面是一个手绘风格 (NPR) 的 three.js 场景：雾中森林与鹿角发出金光的鹿；菜单是一个小房间，每个菜单项对应房间里一个可点击的物件。
不支持 WebGL2 的浏览器、加载失败或关闭此功能时，仍显示原来的封面图和文字菜单。

The home cover is an illustrated (NPR) three.js forest with a golden-antlered stag, and the menu is a small
room in which every entry is a clickable object. Without WebGL2, on any loading error, or when disabled,
the original cover painting and text menu are shown.

```yml
npr:
  enable: true            # 总开关 / master switch
  night_default: auto     # 夜间模式默认值 / night mode default: auto (跟随系统 / follow the OS), day, night
  hero: true              # 首页 3D 封面 / 3D home cover
  menu_room: true         # 3D 菜单房间 / 3D menu room
  mobile: true            # 触屏、小屏、低端设备也运行 (低画质) / also on touch, narrow or low-end devices (low quality)
  overlay_color: "#102a33" # 3D 封面开启时左侧多边形的颜色 / #vibrant polygon colour over the 3D cover
  accent_color: "#f5c46a"  # 搜索、菜单图标颜色, 也传给场景 / icon colour over the cover, also used by the scenes
  room_objects:           # 菜单名 -> 物件, 未列出的显示为木箱 (crate) / menu name -> object, others become a crate
    Category: bookshelf   # 可选 / keys: bookshelf tags cabinet portrait gramophone sofa desk corkboard easel
```

调试 / debug: `?npr=0` 关闭 3D (显示原主题) / disables the scenes; `?npr=low` 强制低画质 / forces low quality.
代码 / code: `source/js/npr/` (`boot.js` 入口 / entry, `core.js` NPR 渲染 / rendering, `forest.js`, `room.js`),
`source/css/npr.css`, `source/css/npr-room.css`, three.js r170 in `source/js/three/`.

### 夜间模式 / Night mode

每个页面右上角都有一个太阳/月亮按钮 (首页在搜索、菜单图标左边, 文章和页面在顶栏右端), 切换温暖的夜间配色:
文字页面变成深棕底、米色字、金色链接, 3D 场景 (森林、菜单房间、子页面插图) 换成灯光照亮的夜景。
访客的选择保存在浏览器里 (`localStorage['npr-theme']`), 没有选择过时使用 `npr.night_default`
(`auto` 跟随系统的深色模式)。链接可以带 `?night=1` / `?night=0` 强制夜间/白天 (会被记住)。

Every page has a sun/moon button (home: left of the search and menu icons; posts and pages: right end of
the top bar) that switches to a warm night palette: the text pages turn umber with cream text and gold links,
and the 3D scenes (forest, menu room, sub-page vignettes) become lamp-lit night scenes. The visitor's choice is
remembered (`localStorage['npr-theme']`); until they choose, `npr.night_default` applies (`auto` follows the
OS dark setting). A link may force it with `?night=1` / `?night=0` (also remembered).

- 状态 / state: `<html data-theme="night|day">`, set by an inline script in `layout/_partial/head.ejs` before the
  first paint (no flash). The static `source/friends/index.html` carries a copy of that snippet.
- 代码 / code: `source/js/theme.js` (button, storage, `window.NPRTheme = { isNight(), set(night), toggle() }`,
  and a `npr:theme` event on `document` with `detail.night`), `source/css/night.css` (page styles).
- 场景 / scenes: `boot.js` mounts every scene with `{ night }` and calls `setNight(night)` on each `npr:theme`.


### 多语言文章 / Translated posts

同一篇文章的不同语言版本 (例如中文原文和英文翻译) 各自是一个普通的 `.md` 文件, 有自己的网址。
在它们的 front matter 里写上**同一个** `i18n` key, 主题就会把它们当作一组:

- 首页 (以及分页、"Click for more") 每组只列出一篇 (`i18n_posts.prefer` 语言的那篇), 卡片和首页大标题下面显示语言小标签 `中文 · English`;
- 文章页标题下方显示语言切换 `中文 | English` (当前语言加粗), 在首页的 Ajax 预览里切换时原地替换, 按返回键回到首页;
- 访客点过语言标签或切换后会被记住 (`localStorage['npr-lang']`), 之后首页卡片直接显示该语言的标题、摘要和链接;
- 文章页 `<head>` 里有 `<link rel="alternate" hreflang="…">`, 正文带 `lang` 属性; 归档页在标题后标出语言;
- 分类、标签、归档、搜索、sitemap 仍然列出每一个版本。

Each language version of a post is an ordinary `.md` file with its own URL. Give all of them the **same**
`i18n` key in the front matter and the theme treats them as one post:

- the home page (and its pagination / "Click for more") lists the group once — the translation in
  `i18n_posts.prefer` — with language chips `中文 · English` on the card and on the hero;
- the post page shows a switch `中文 | English` under the title (in the home page's Ajax preview it swaps the
  translation in place, and Back returns to the list);
- a visitor who uses a chip or the switch is remembered (`localStorage['npr-lang']`) and home cards then show that
  language's title, summary and link;
- posts get `<link rel="alternate" hreflang="…">` tags and a `lang` attribute on the content; the archive marks the
  language after the title;
- categories, tags, archives, search and the sitemap still list every translation.

**新增一个译本 / adding a translation**

```yml
# source/_posts/My_Post.md (原文 / original)
title: 我的文章
date: 2026-10-01 00:00:00
i18n: my-post        # 任意不重复的名字, 同组相同 / any name, the same on every translation
lang: zh             # 可省略 / optional

# source/_posts/My_Post_en.md (译文 / translation)
title: My Post
date: 2026-10-01 00:00:00   # 建议与原文相同 / best keep the original's date
i18n: my-post
lang: en
```

1. 复制原文为新文件 (文件名随意, 例如加 `_en`), 翻译正文和标题; copy the post to a new file (any name, e.g. with
   `_en`) and translate the title and text.
2. 两个文件都写上同一个 `i18n:`; 写 `lang:` 最稳妥, 不写时按正文自动识别 (有假名 → `ja`, 有谚文 → `ko`,
   其他 CJK 为主 → `zh`, 否则 `en`)。Put the same `i18n:` in both; `lang:` is safest, otherwise it is detected from
   the text (kana → `ja`, hangul → `ko`, mostly CJK → `zh`, else `en`). Any code works (`fr`, `zh-TW` …).
3. 给两者相同的 `date` (没写 date 的文章用文件修改时间, 排序会乱); give both the same `date` (a post without one uses
   the file's mtime).
4. 第三种语言同理, 再加一个同 key 的文件即可; a third language is just one more file with the same key.

`hexo new post` 生成的新文章已经带有空的 `i18n:` / `lang:` 和一段提示注释 (`scaffolds/post.md`), 用不到时留空或删除。
New posts from `hexo new` come with empty `i18n:` / `lang:` fields and a hint comment (`scaffolds/post.md`);
leave them empty or delete them when the post has no translation.

```yml
i18n_posts:
  enable: true        # false: 恢复原样, 每个版本都列在首页 / every translation listed separately again
  prefer: zh          # 首页代表该组的语言, 没有时取最早的一篇 / language listed on the home page (fallback: earliest)
  labels:             # 切换上显示的名字, 没列出的显示大写代码 (FR) / switch labels, others shown upper-cased
    zh: 中文
    en: English
    ja: 日本語
```

- 代码 / code: `scripts/i18n-posts.js` (分组、语言识别、替换 `index` 生成器 / grouping, detection, replaces the
  `index` generator of hexo-generator-index; helpers `i18n_siblings(post)`, `i18n_lang(post)`, `i18n_label(code)`,
  `i18n_is_primary(post)`, `i18n_cards(sibs, opts)`), `layout/_partial/post/i18n-chips.ejs`,
  `layout/_partial/post/i18n-switch.ejs`, `source/js/i18n.js` (记住语言 / remembered language), `source/css/i18n.css`.
- `hexo server` 不会重新加载 `scripts/` 里修改过的文件, 改动脚本后需重启; after editing `scripts/`, restart `hexo server`.
- 同一组里两篇相同语言会在生成时给出警告; two translations with the same language in one group log a warning.
