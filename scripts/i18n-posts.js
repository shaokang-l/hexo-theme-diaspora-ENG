/**
 * Translated posts / 多语言文章
 * @description Groups translations of the same post by the `i18n` front-matter key, so the home page lists each
 *     post once (the preferred translation) and every translation gets a language switch.
 *     Front matter is the only source of truth:
 *         i18n: restir-di-02   # same key on every translation of one post
 *         lang: en             # optional; auto-detected from the text (kana -> ja, hangul -> ko, CJK -> zh, else en)
 *     Theme config (_config.yml): i18n_posts: { enable, prefer, labels }
 * @example
 *     <% var sibs = i18n_siblings(page) %>   // [] for standalone posts
 *     <%= i18n_lang(post) %>  <%= i18n_label('zh') %>  <% if (i18n_is_primary(post)) { %>
 */
'use strict';

var pagination = require('hexo-pagination');
var unescapeHTML = require('hexo-util').unescapeHTML;

function options() {
    var c = (hexo.theme && hexo.theme.config && hexo.theme.config.i18n_posts) || {};
    return {
        enable: c.enable !== false,
        prefer: c.prefer ? normLang(c.prefer) : '',
        labels: c.labels || {}
    };
}

// "zh_cn" / "ZH-cn" -> "zh-CN"; "zh-hans" -> "zh-Hans"
function normLang(code) {
    var parts = String(code || '').trim().split(/[-_]/).filter(Boolean);
    if (!parts.length) return '';
    return parts.map(function (p, i) {
        if (!i) return p.toLowerCase();
        if (p.length === 2) return p.toUpperCase();
        return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
    }).join('-');
}

function base(code) {
    return String(code || '').split('-')[0];
}

function sameLang(a, b) {
    return !!a && !!b && (a.toLowerCase() === b.toLowerCase() || base(a) === base(b));
}

function count(text, re) {
    var m = text.match(re);
    return m ? m.length : 0;
}

// Guess the language of a post from its markdown source (code, math, links and tags are ignored).
function detectLang(src) {
    var text = String(src || '')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
        .replace(/`[^`\n]*`/g, ' ')
        .replace(/\$\$[\s\S]*?\$\$/g, ' ')
        .replace(/\{%[\s\S]*?%\}/g, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\]\([^)]*\)/g, ']')
        .replace(/https?:\/\/\S+/g, ' ');
    var kana = count(text, /[぀-ヿㇰ-ㇿｦ-ﾟ]/g),
        hangul = count(text, /[가-힯ᄀ-ᇿ]/g),
        han = count(text, /[㐀-䶿一-鿿豈-﫿]/g),
        latin = count(text, /[A-Za-zÀ-ɏ]/g),
        cjk = kana + hangul + han;
    // one CJK character carries about as much as a short word, so a CJK text full of English terms still counts
    if (cjk < 10 || cjk * 8 < latin) return 'en';
    if (hangul > (kana + han) * 0.5) return 'ko';
    if (kana >= 10 && kana >= (kana + han) * 0.15) return 'ja';
    return 'zh';
}

function postKey(post) {
    return post && (post._id || post.source || post.path);
}

function explicitLang(post) {
    return post && typeof post.lang === 'string' && post.lang.trim() ? normLang(post.lang) : '';
}

var cache = null;

hexo.extend.filter.register('before_generate', function () {
    cache = null;
});

// posts grouped by `i18n` key, rebuilt whenever Hexo hands out a new posts query (every generation / server rebuild)
function state() {
    var posts = hexo.locals.get('posts');
    if (cache && cache.src === posts) return cache;
    var opt = options(),
        info = {},
        groups = {};
    posts.forEach(function (post) {
        var key = post.i18n == null ? '' : String(post.i18n).trim(),
            lang = explicitLang(post) || detectLang(post._content || post.raw);
        info[postKey(post)] = { lang: lang, group: key };
        if (key) (groups[key] = groups[key] || []).push(post);
    });
    var labelOrder = Object.keys(opt.labels).map(normLang);
    function rank(lang) {
        if (sameLang(lang, opt.prefer)) return -1;
        for (var i = 0; i < labelOrder.length; i++) if (sameLang(lang, labelOrder[i])) return i;
        return labelOrder.length;
    }
    Object.keys(groups).forEach(function (key) {
        var list = groups[key].slice().sort(function (a, b) {
            return (a.date && b.date ? a.date.valueOf() - b.date.valueOf() : 0) ||
                String(a.path).localeCompare(String(b.path));
        });
        // the preferred translation represents the group, otherwise the earliest one
        var primary = list.filter(function (p) { return sameLang(info[postKey(p)].lang, opt.prefer); })[0] || list[0];
        var seen = {};
        list.forEach(function (p) {
            var l = info[postKey(p)].lang.toLowerCase();
            if (seen[l]) hexo.log.warn('[i18n-posts] "%s" and "%s" share i18n key "%s" and language "%s"', seen[l], p.source, key, l);
            seen[l] = p.source;
        });
        // switch order: preferred language first, then the order of `labels`, then by language code
        list.sort(function (a, b) {
            var la = info[postKey(a)].lang, lb = info[postKey(b)].lang;
            return rank(la) - rank(lb) || la.localeCompare(lb);
        });
        groups[key] = { primary: primary, posts: list };
    });
    cache = { src: posts, opt: opt, info: info, groups: groups };
    return cache;
}

function langOf(post) {
    var s = state(), i = s.info[postKey(post)];
    return i ? i.lang : explicitLang(post) || detectLang(post && (post._content || post.raw));
}

function groupOf(post) {
    var s = state();
    if (!s.opt.enable) return null;
    var i = s.info[postKey(post)], g = i && i.group && s.groups[i.group];
    return g && g.posts.length > 1 ? g : null;
}

function label(code) {
    var labels = options().labels, n = normLang(code);
    var hit = Object.keys(labels).filter(function (k) { return normLang(k) === n; })[0] ||
        Object.keys(labels).filter(function (k) { return normLang(k) === base(n); })[0];
    return hit ? String(labels[hit]) : n.toUpperCase();
}

function isPrimary(post) {
    var g = groupOf(post);
    return !g || postKey(g.primary) === postKey(post);
}

// [{lang, label, path, title, date, current, primary, post}] for every translation of `post`, [] if it has none
function siblings(post) {
    var g = groupOf(post);
    if (!g) return [];
    var me = postKey(post);
    return g.posts.map(function (p) {
        var lang = langOf(p);
        return {
            lang: lang,
            label: label(lang),
            path: p.path,
            title: p.title,
            date: p.date,
            current: postKey(p) === me,
            primary: postKey(p) === postKey(g.primary),
            post: p
        };
    });
}

// JSON for js/i18n.js on a list card / the hero: every translation's link, title, date and plain-text summary
function cards(sibs, opts) {
    var self = this, o = opts || {};
    return JSON.stringify((sibs || []).map(function (s) {
        return {
            lang: s.lang,
            url: self.url_for(s.path),
            title: s.title || o.untitled || 'Untitled',
            date: s.date ? s.date.clone().locale(o.locale || 'en-us').format(o.format || 'MMMM DD, YYYY') : '',
            summary: unescapeHTML(self.truncate(self.strip_html(s.post.content), { length: o.length || 80, omission: '...' })).trim()
        };
    }));
}

hexo.extend.helper.register('i18n_cards', cards);
hexo.extend.helper.register('i18n_lang', langOf);
hexo.extend.helper.register('i18n_label', label);
hexo.extend.helper.register('i18n_is_primary', isPrimary);
hexo.extend.helper.register('i18n_siblings', siblings);

// Home page: same as hexo-generator-index 3.x, but one entry per translation group.
hexo.config.index_generator = Object.assign({
    per_page: typeof hexo.config.per_page === 'undefined' ? 10 : hexo.config.per_page,
    order_by: '-date'
}, hexo.config.index_generator);

hexo.extend.generator.register('index', function (locals) {
    var config = this.config,
        ig = config.index_generator || {},
        posts = locals.posts.sort(ig.order_by || '-date');

    if (options().enable) posts = posts.filter(isPrimary);
    posts.data.sort(function (a, b) { return (b.sticky || 0) - (a.sticky || 0); });

    return pagination(ig.path || '', posts, {
        perPage: ig.per_page,
        layout: ['index', 'archive'],
        format: (config.pagination_dir || 'page') + '/%d/',
        data: {
            __index: true
        }
    });
});
