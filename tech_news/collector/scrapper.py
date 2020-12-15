import requests
from time import sleep
from parsel import Selector


def fetch_content(url, timeout=3, delay=0.5):
    try:
        response = requests.get(url, timeout=timeout)
        sleep(delay)
    except requests.ReadTimeout:
        return ""
    else:
        if response.status_code != 200:
            return ""
        return response.text


def scrape(fetcher, pages=1):
    news_list = []
    for n in range(pages):
        page = Selector(
            text=fetcher(f"https://www.tecmundo.com.br/novidades?page={n}")
        )
        news = page.css("h3 .tec--card__title__link::attr(href)").getall()
        for new in news:
            res = Selector(text=fetcher(new))
            news_list.append({
                "url": new,
                "title": res.css("#js-article-title::text").get(),
                "timestamp": res.css("#js-article-date::attr(datetime)").get(),
                "writer": res.css(".tec--author__info__link::text").get(),
                "shares_count": int(res.css(
                    ".tec--toolbar__item::text").re_first(r"\d")),
                "comments_count": int(res.css(
                    "#js-comments-btn::attr(data-count)").get()),
                "summary": res.css(".tec--article__body p *::text").get(),
                "sources": res.css(".z--mb-16 .tec--badge::text").getall(),
                "categories": res.css(
                    "#js-categories .tec--badge--primary::text").getall(),
            })
    return news_list
