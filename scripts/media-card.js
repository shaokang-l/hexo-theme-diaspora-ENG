/**
 * Media Card Tag
 * @description Offline replacement for {% douban %}: renders a book / music / movie card from
 *     source/_data/media.yml (filled by `node tools/media-fetch.js <type> <id>`). No network at build time.
 * @example
 *     {% media book 35315153 %}
 *     {% media https://movie.douban.com/subject/10527275/ %}
 */
var fs = require('fs');
var path = require('path');

var KIND = { book: '图书', music: '音乐', movie: '影视' };
var ROLE = {
    author: '作者', artist: '表演者', director: '导演', actor: '主演', playwright: '编剧',
    developer: '开发', publisher: '发行', host: '主播', performer: '表演者'
};

function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function loadData() {
    var data = hexo.locals.get('data') || {};
    if (data.media) return data.media;
    // fallback (e.g. data box not processed yet): read the file directly
    var file = path.join(hexo.source_dir, '_data', 'media.yml');
    try {
        return require('js-yaml').load(fs.readFileSync(file, 'utf8')) || {};
    } catch (e) {
        return {};
    }
}

function link(href, text, cls) {
    return '<a class="' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + text + '</a>';
}

hexo.extend.tag.register('media', function (args) {
    var type = args[0], id = args[1];
    var m = String(type || '').match(/^https?:\/\/(book|music|movie)\.douban\.com\/subject\/(\d+)/);
    if (m) { type = m[1]; id = m[2]; }
    if (!KIND[type] || !/^\d+$/.test(String(id || ''))) {
        hexo.log.warn('media: expected {% media book|music|movie <douban id> %}, got: ' + args.join(' '));
        return '';
    }
    var key = type + '-' + id;
    var douban = 'https://' + type + '.douban.com/subject/' + id + '/';
    var d = loadData()[key];
    var url_for = hexo.extend.helper.get('url_for').bind(hexo);

    if (!d) {
        hexo.log.warn('media: no entry "' + key + '" in source/_data/media.yml, run `node tools/media-fetch.js ' + type + ' ' + id + '`');
        return '<div class="media-card media-card-' + type + ' media-card-missing"><div class="mc-body">' +
            '<div class="mc-kind">' + KIND[type] + '</div>' +
            '<div class="mc-name">未知条目</div>' +
            '<div class="mc-links">' + link(douban, '豆瓣', 'mc-link') + '</div>' +
            '</div></div>';
    }

    var title = d.title || '未知条目';
    var kind = KIND[type] + (d.year ? ' · ' + esc(d.year) : '');
    var creators = [].concat(d.creators || []).filter(Boolean);
    var html = '<div class="media-card media-card-' + type + '">';
    if (d.cover) {
        html += '<div class="mc-art"><img src="' + esc(url_for(d.cover)) + '" alt="' + esc(title) + '" loading="lazy"></div>';
    }
    html += '<div class="mc-body">';
    html += '<div class="mc-kind">' + kind + '</div>';
    html += '<div class="mc-name">' + link(d.douban || douban, esc(title), 'mc-title') + '</div>';
    if (d.original_title && d.original_title !== title) html += '<div class="mc-orig">' + esc(d.original_title) + '</div>';
    if (creators.length) {
        html += '<div class="mc-by">' + (ROLE[d.creator_role] ? '<span>' + ROLE[d.creator_role] + '</span> ' : '') +
            creators.map(esc).join(' / ') + '</div>';
    }
    var r = parseFloat(d.rating);
    if (!isNaN(r) && r > 0) {
        var fill = Math.max(0, Math.min(100, r * 10));
        html += '<div class="mc-score"><span class="mc-stars" style="--mc-fill:' + fill + '%" role="img" aria-label="' + r.toFixed(1) + ' / 10"></span>' +
            '<b>' + r.toFixed(1) + '</b>' +
            '<small>' + esc(d.rating_source || 'NeoDB') + (d.rating_count ? ' · ' + esc(d.rating_count) + ' 人评分' : '') + '</small></div>';
    } else {
        html += '<div class="mc-score mc-score-none"><small>暂无评分</small></div>';
    }
    html += '<div class="mc-links">' + link(d.douban || douban, '豆瓣', 'mc-link');
    if (d.neodb) html += link(d.neodb, 'NeoDB', 'mc-link');
    html += '</div></div></div>';
    return html;
});
