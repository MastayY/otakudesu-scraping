import { load } from "cheerio";
import { baseUrl as _baseUrl, completeAnime as _completeAnime, onGoingAnime as _onGoingAnime, schedule, genreList as _genreList } from "../utils/base-url.js";
import { default as Axios } from "axios";
import { requestFailed } from "../utils/errors.js";
import { ImageList } from "../utils/image_genre.js";
import e from "express";

const baseUrl = _baseUrl;
const completeAnime = _completeAnime;
const onGoingAnime = _onGoingAnime;

export function home(req, res) {
  let home = {};
  let on_going = [];
  let complete = [];
  Axios.get(baseUrl)
    .then((response) => {
      const $ = load(response.data);
      const element = $(".venz");
      let episode, uploaded_on, day_updated, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.match(/\/anime\/([^\/]+)/)[1];
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          day_updated = $(this).find(".epztipe").text().replace(" ", "");
          on_going.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            day_updated,
            link,
          });
        });
      home.on_going = on_going;
      return response;
    })
    .then((response) => {
      const $ = load(response.data);
      const element = $(".venz");
      let episode, uploaded_on, score, thumb, title, link, id;
      element
        .children()
        .eq(1)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.match(/\/anime\/([^\/]+)/)[1];
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));
          complete.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            score,
            link,
          });
        });
      home.complete = complete;
      res.status(200).json({
        status: "success",
        baseUrl: baseUrl,
        home,
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
}
export function completeAnimeList(req, res) {
  const params = req.params.page;
  const page =
    typeof params === "undefined" ? "" : params === "1" ? "" : `page/${params}`;
  const fullUrl = `${baseUrl}${completeAnime}${page}`;
  console.log(fullUrl);
  Axios.get(fullUrl)
    .then((response) => {
      const $ = load(response.data);
      const element = $(".venz");
      let animeList = [];
      let episode, uploaded_on, score, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.match(/\/anime\/([^\/]+)/)[1];
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));
          animeList.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            score,
            link,
          });
        });

      const next = $(".pagenavix > a.next").text();
      
      const maxPage = next == "Berikutnya »" ? parseInt($('.page-numbers:nth-last-child(2)').text()) : parseInt($('.page-numbers:nth-last-child(1)').text())

      res.status(200).json({
        status: "success",
        baseUrl: fullUrl,
        maxPage,
        animeList,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}
export function onGoingAnimeList(req, res) {
  const params = req.params.page;
  const page = typeof params === "undefined" ? "" : params === "1" ? "" : `page/${params}`;
  const fullUrl = `${baseUrl}${onGoingAnime}${page}`;
  Axios.get(fullUrl)
    .then((response) => {
      const $ = load(response.data);
      const element = $(".venz");
      let animeList = [];
      let episode, uploaded_on, day_updated, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.match(/\/anime\/([^\/]+)/)[1];
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          day_updated = $(this).find(".epztipe").text().replace(" ", "");
          animeList.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            day_updated,
            link,
          });
        });

      const next = $(".pagenavix > a.next").text();
    
      const maxPage = next == "Berikutnya »" ? parseInt($('.page-numbers:nth-last-child(2)').text()) : parseInt($('.page-numbers:nth-last-child(1)').text())

      res.status(200).json({
        status: "success",
        baseUrl: baseUrl,
        maxPage,
        animeList,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}
export function schedules(req, res) {
  Axios.get(baseUrl + schedule).then((response) => {
    const $ = load(response.data);
    const element = $(".kgjdwl321");
    let animeList = [];
    let scheduleList = [];
    let day;
    let anime_name, link, id;
    element.find(".kglist321").each(function () {
      day = $(this).find("h2").text();
      animeList = [];
      $(this)
        .find("ul > li")
        .each(function () {
          anime_name = $(this).find("a").text();
          link = $(this).find("a").attr("href");
          id = link.match(/\/anime\/([^\/]+)/)[1];
          animeList.push({ anime_name, id, link });
        });
      scheduleList.push({ day, animeList });
    });
    res.json({ scheduleList });
  });
}
export function genre(req, res) {
  const fullUrl = baseUrl + _genreList;
  Axios.get(fullUrl)
    .then((response) => {
      const $ = load(response.data);
      const element = $(".genres");
      let genreList = [];
      element.find("li > a").each(function (i, el) {
        let object = {};
        object.genre_name = $(el).text();
        object.id = $(el).attr("href").replace("/genres/", "");
        object.link = baseUrl + $(el).attr("href");
        object.image_link = ImageList[i];
        genreList.push(object);
      });
      res.json({ genreList });
    })
    .catch((err) => {
      console.log(err.message);
    });
}
export function animeByGenre(req, res) {
  const pageNumber = req.params.pageNumber;
  const id = req.params.id;
  const fullUrl = baseUrl + `genres/${id}/page/${pageNumber}`;
  console.log(fullUrl);
  Axios.get(fullUrl)
    .then((response) => {
      const $ = load(response.data);
      const element = $(".page");
      let animeList = [];
      let genreList = [];
      let object = {};
      let genre_name, genre_link, genre_id;
      element.find(".col-md-4").each(function () {
        object = {};
        object.anime_name = $(this).find(".col-anime-title").text();
        object.thumb = $(this).find('div.col-anime-cover > img').attr('src')
        object.link = $(this).find(".col-anime-title > a").attr("href");
        object.id = $(this)
          .find(".col-anime-title > a")
          .attr("href")
          .match(/\/anime\/([^\/]+)/)[1];
        object.studio = $(this).find(".col-anime-studio").text();
        object.episode = $(this).find(".col-anime-eps").text();
        object.score = parseFloat($(this).find(".col-anime-rating").text());
        object.release_date = $(this).find(".col-anime-date").text();
        genreList = [];
        $(this)
          .find(".col-anime-genre > a")
          .each(function () {
            genre_name = $(this).text();
            genre_link = $(this).attr("href");
            genre_id = genre_link.match(/\/genres\/([^\/]+)/)[1];
            genreList.push({ genre_name, genre_link, genre_id });
            object.genre_list = genreList;
          });
        animeList.push(object);
      });
      res.send({
        status: "success",
        baseUrl: fullUrl,
        animeList,
      });
    })
    .catch((err) => {
      requestFailed(req, res, err);
    });
}
export function search(req, res) {
  const query = req.params.query;
  const fullUrl = `${baseUrl}?s=${query}&post_type=anime`;
  Axios.get(fullUrl).then((response) => {
    const $ = load(response.data);
    const element = $(".page");
    let obj = {};
    let anime_list = [];
    (obj.status = "success"), (obj.baseUrl = fullUrl);
    if(element.find("ul > li").length === 0){
      obj.search_results = [];
    }else {
      element.find("ul > li").each(function () {
        const genre_list = [];
        $(this).find(".set").find("a").each(function () {
            const genre_result = {
              genre_title: $(this).text(),
              genre_link: $(this).attr("href"),
              genre_id: $(this).attr("href").replace(`${baseUrl}genres/`, ""),
            };
            genre_list.push(genre_result);
          });
        const results = {
          thumb: $(this).find("img").attr("src"),
          title: $(this).find("h2").text(),
          link: $(this).find("h2 > a").attr("href"),
          id: $(this).find("h2 > a").attr("href").match(/\/anime\/([^\/]+)/)[1],
          status: $(this).find(".set").eq(1).text().replace("Status : ", ""),
          score: parseFloat(
            $(this).find(".set").eq(2).text().replace("Rating : ", "")
          ),
          genre_list,
        };
        anime_list.push(results);
        obj.search_results = anime_list;
      });
    }
    res.send(obj);
  });
}