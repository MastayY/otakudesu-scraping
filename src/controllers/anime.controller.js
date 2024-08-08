import { baseUrl as _baseUrl } from "../utils/base-url.js";
import { default as Axios } from "axios";
import { load } from "cheerio";
import { requestFailed } from "../utils/errors.js";
import { get, getStreamUrl } from "../utils/episodeHelper.js";
import { baseUrl } from "../utils/base-url.js";
import e from "express";

export async function detailAnime(req, res) {
  const id = req.params.id;
  const fullUrl = _baseUrl + `anime/${id}`;
  // console.log(fullUrl);
  try {
    const response = await Axios.get(fullUrl);

    const $ = load(response.data);
    const detailElement = $(".venser").find(".fotoanime");
    const epsElement = $("#_epslist").html();
    let object = {};
    let episode_list = [];
    object.thumb = detailElement.find("img").attr("src");
    object.anime_id = req.params.id;
    let genre_name, genre_id, genre_link;
    let genreList = [];

    object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
      .find("p")
      .text();

    detailElement.find(".infozin").filter(function () {
      object.title = $(this)
        .find("p")
        .children()
        .eq(0)
        .text()
        .replace("Judul: ", "");
      object.japanase = $(this)
        .find("p")
        .children()
        .eq(1)
        .text()
        .replace("Japanese: ", "");
      object.score = parseFloat(
        $(this).find("p").children().eq(2).text().replace("Skor: ", "")
      );
      object.producer = $(this)
        .find("p")
        .children()
        .eq(3)
        .text()
        .replace("Produser: ", "");
      object.type = $(this)
        .find("p")
        .children()
        .eq(4)
        .text()
        .replace("Tipe: ", "");
      object.status = $(this)
        .find("p")
        .children()
        .eq(5)
        .text()
        .replace("Status: ", "");
      object.total_episode = parseInt(
        $(this).find("p").children().eq(6).text().replace("Total Episode: ", "")
      );
      object.duration = $(this)
        .find("p")
        .children()
        .eq(7)
        .text()
        .replace("Durasi: ", "");
      object.release_date = $(this)
        .find("p")
        .children()
        .eq(8)
        .text()
        .replace("Tanggal Rilis: ", "");
      object.studio = $(this)
        .find("p")
        .children()
        .eq(9)
        .text()
        .replace("Studio: ", "");
      $(this)
        .find("p")
        .children()
        .eq(10)
        .find("span > a")
        .each(function () {
          genre_name = $(this).text();
          genre_id = $(this)
            .attr("href").match(/\/genres\/(.*?)\//)[1]
          genre_link = $(this).attr("href");
          genreList.push({ genre_name, genre_id, genre_link });
          object.genre_list = genreList;
        });
    });

    $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
      (i, element) => {
        const dataList = {
          title: $(element).find("span > a").text(),
          id: $(element)
            .find("span > a")
            .attr("href").match(/\/episode\/(.*?)\//)[1],
          link: $(element).find("span > a").attr("href"),
          uploaded_on: $(element).find(".zeebr").text(),
        };
        episode_list.push(dataList);
      }
    );
    object.episode_list =
      episode_list.length === 0
        ? [
            {
              title: "Masih kosong gan",
              id: "Masih kosong gan",
              link: "Masih kosong gan",
              uploaded_on: "Masih kosong gan",
            },
          ]
        : episode_list;
    const batch_link = {
      id:
        $("div.venser > div:nth-child(6) > ul").text().length !== 0
          ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
              .attr("href").match(/\/batch\/(.*?)\//)[1]
          : "Masih kosong gan",
      link:
        $("div.venser > div:nth-child(6) > ul").text().length !== 0
          ? $(
              "div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a"
            ).attr("href")
          : "Masih kosong gan",
    };
    const empty_link = {
      id: "Masih kosong gan",
      link: "Masih kosong gan",
    };
    object.batch_link = batch_link;
    //console.log(epsElement);
    res.json(object);
  } catch (err) {
    console.log(err);
    requestFailed(req, res, err);
  }
}
export async function batchAnime(req, res) {
  const id = req.params.id;
  const fullUrl = `${baseUrl}batch/${id}`;
  console.log(fullUrl);
  Axios.get(fullUrl)
    .then((response) => {
      const $ = load(response.data);
      const obj = {};
      obj.title = $(".batchlink > h4").text();
      obj.status = "success";
      obj.baseUrl = fullUrl;
      let low_quality = _batchQualityFunction(0, response.data);
      let medium_quality = _batchQualityFunction(1, response.data);
      let high_quality = _batchQualityFunction(2, response.data);
      obj.download_list = { low_quality, medium_quality, high_quality };
      res.send(obj);
    })
    .catch((err) => {
      requestFailed(req, res, err);
    });
}
export async function epsAnime(req, res) {
  const id = req.params.id;
  const fullUrl = `${_baseUrl}/episode/${id}`;
  try {
    const response = await Axios.get(fullUrl);
    const $ = load(response.data);
    const streamElement = $("#lightsVideo").find("#embed_holder");
    const obj = {};
    obj.title = $(".venutama > h1").text();
    obj.baseUrl = fullUrl;

    obj.id = $("div.flir > a:contains('Episodes')").attr("href")?.match(/\/anime\/([^\/]+)/)[1] || "-";
    obj.stream_link = streamElement.find("iframe").attr("src");
    obj.prev_eps_slug = $("div.flir > a:contains('Previous')").attr("href")?.match(/\/episode\/([^\/]+)/)[1] || "-";
    obj.next_eps_slug = $("div.flir > a:contains('Next')").attr("href")?.match(/\/episode\/([^\/]+)/)[1] || "-";

    // obj.link_stream = await get(streamLink);

    $("div.keyingpost > li").each((i, element) => {
      const dataEpsList = {
        title: $(element).find("a").text(),
        id: $(element).find("a").attr("href").match(/\/episode\/([^\/]+)/)[1]
      }

      obj.episode_list = obj.episode_list ? [...obj.episode_list, dataEpsList] : [dataEpsList]
    })

    let low_quality;
    let medium_quality;
    let high_quality;

    if($('#venkonten > div.venser > div.venutama > div.download > ul > li:nth-child(1)').text() === ''){
      console.log('ul is empty');
      low_quality = _notFoundQualityHandler(response.data,0)
      medium_quality = _notFoundQualityHandler(response.data,1)
      high_quality = _notFoundQualityHandler(response.data,2)
    }else{
      console.log('ul is not empty');
      low_quality = _epsQualityFunction(0, response.data);
      medium_quality = _epsQualityFunction(1, response.data);
      high_quality = _epsQualityFunction(2, response.data);
    }
    obj.download = { low_quality, medium_quality, high_quality };
    res.send(obj);
  } catch (err) {
    console.log(err);
    requestFailed(req, res, err);
  }
}

export async function epsMirror(req, res) {
  const mirrorId = req.body.mirrorId;
  const animeId = req.params.animeId;
  const fullUrl = `${baseUrl}${animeId}/${mirrorId}`;
  try {
    const response = await Axios.get(fullUrl);
    const $ = load(response.data);
    const obj = {};
    obj.title = $(".venutama > h1").text();
    obj.baseUrl = fullUrl;
    obj.id = fullUrl.replace(_baseUrl, "");
    const streamLink = $('#pembed > div > iframe').attr('src')
    obj.streamLink = streamLink
    obj.link_stream = await get(streamLink);
    res.send(obj);
  } catch (error) {
    console.log(error);
    requestFailed(req, res, err);
  }
}

function _batchQualityFunction(num, res) {
  const $ = load(res);
  const element = $(".download").find(".batchlink");
  const download_links = [];
  let response;
  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        const _list = {
          host: $(this).text(),
          link: $(this).attr("href"),
        };
        download_links.push(_list);
        response = { quality, size, download_links };
      });
  });
  return response;
}
function _epsQualityFunction(num, res) {
  const $ = load(res);
  const element = $(".download");
  const download_links = [];
  let response;

  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this).find("li").eq(num).find("a").each(function () {
        const _list = {
          host: $(this).text(),
          link: $(this).attr("href"),
        };
        download_links.push(_list);
        response = { quality, size, download_links };
        
      });
  });
  return response;
}

function _notFoundQualityHandler(res,num){
  const $ = load(res);
  const download_links = [];
  const element = $('.download')
  let response;

  element.filter(function(){
    if($(this).find('.anime-box > .anime-title').eq(0).text() === ''){
      $(this).find('.yondarkness-box').filter(function(){
        const quality = $(this).find('.yondarkness-title').eq(num).text().split('[')[1].split(']')[0];
        const size = $(this).find('.yondarkness-title').eq(num).text().split(']')[1].split('[')[1];
        $(this).find('.yondarkness-item').eq(num).find('a').each((idx,el) => {
          const _list = {
            host: $(el).text(),
            link: $(el).attr("href"),
          };
          download_links.push(_list);
          response = { quality, size, download_links };
        })
      })
    }else{
      $(this).find('.anime-box').filter(function(){
        const quality = $(this).find('.anime-title').eq(num).text().split('[')[1].split(']')[0];
        const size = $(this).find('.anime-title').eq(num).text().split(']')[1].split('[')[1];
        $(this).find('.anime-item').eq(num).find('a').each((idx,el) => {
          const _list = {
            host: $(el).text(),
            link: $(el).attr("href"),
          };
          download_links.push(_list);
          response = { quality, size, download_links };
        })
      })
    }
  })
  return response;

}