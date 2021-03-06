/**
 * Created by Moyu on 16/10/20.
 */
import fetch from 'isomorphic-fetch'
const moka = window.__moka__ || {};

module.exports = {
    remotePromise() {
        const md5 = moka.md5 || {};

        return Promise.all([
            'moka_api/db.json?k='+(md5.dbMd5 || ''), 
            'moka_api/moka.config.json?k='+(md5.mokaConfigMd5 || ''), 
            'moka_api/theme.config.json?k='+(md5.themeConfigMd5 || '')
        ].map(r=>fetch(r).then(res=>res.json())))
        .then(reses=>{
            return {
                db: reses[0],
                moka: reses[1],
                theme: reses[2]
            }
        })
    },

    isTagsPath(pathname) {
        return /^\/?tags\/.+$/.test(pathname)
    },

    isTagsRootPath(pathname) {
        return /^\/?tags\/?$/.test(pathname)
    },

    isTagsPagesPath(pathname) {
        return /^\/?tags\/pages\/\d+$/.test(pathname);
    },

    isRootPath(pathname) {
        return pathname === '/'
    },
    
    isPostsPath(pathname) {
        return /^\/?posts\/?$/.test(pathname) || /^\/?posts\/\d+$/.test(pathname)
    },

    isArticlePath(pathname) {
        return /^\/?article\/.+$/.test(pathname)
    },

    isArchivePath(pathname) {
        return /^\/?archive\/?$/.test(pathname)
    },
    
    getSummary(html, summaryNum=100) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.innerText.slice(0, summaryNum)
    },
    getInnerText(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.innerText;
    },

    setMainSummary(main, num=100) {
        Object.keys(main).forEach(href => {
            const item = main[href]
            // if(!item.innerText) {
            //     item.innerText = this.getInnerText(item.content);
            // }
            if(!item.summary) {
                item.summary = this.getInnerText(item.content).slice(0, num)
            }
        })
    },

    setTitle(title) {
        document.title = title;
    },

    fillCovers(sorted, main, covers, lazy) {
        if(covers.length===0) {
            return;
        }
        let c = 0;
        sorted.forEach((href, i) => {
            const item = main[href]
            // if(!item.innerText) {
            //     item.innerText = this.getInnerText(item.content);
            // }
            if(!item.head.cover) {
                let match = item.content.match(/<img src="(.+?)".*?>/g);
                let isMatch = match && match.length>1
                item.head.cover = isMatch && RegExp.$1 || covers[c++%covers.length]
                item.head.fakeCover = !isMatch;
                if(!lazy) {
                    new Image().src=item.head.cover
                }
            }
        })
    }
}