//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    ucode: "",
    upTime: 0,
    downTime: 0,
    newsTop: [],
    swiperItems: [],
    newsList: [],
    nowChannel: "RECOMMEND",
    topNavItems: [
      {
        num: "1",
        id: "RECOMMEND",
        text: "头条"
      },
      {
        num: "2",
        id: "YLPD",
        text: "娱乐"
      },
      {
        num: "3",
        id: "CJPD",
        text: "财经"
      },
      {
        num: "4",
        id: "JSPD",
        text: "军事"
      },
      {
        num: "5",
        id: "TYPD",
        text: "体育"
      }
    ]
  },
  onLoad: function () {
    let temp = ""
    for (let i = 0; i < 26; i++) {
      let randomNum = Math.ceil(25 * Math.random());
      temp += String.fromCharCode(65 + randomNum);
    }
    this.setData({
      ucode: temp
    })
    this.getNews("RECOMMEND", "1_daada")
  },
  getNews: function (channel, uid) {
    let nowPage = this
    wx.request({
      url: "https://api.iclient.ifeng.com/weixin_list",
      data: {
        channel: channel,
        uid: uid
      },
      method: "GET",
      success: function (res) {
        let newNewsList = nowPage.data.newsList
        res.data.forEach(item => newNewsList.push(item))
        if (uid == "1_daada" && channel == "RECOMMEND") {
          nowPage.setData({
            newsTop: [newNewsList.shift()]
          })
        }
        nowPage.setData({
          newsList: newNewsList
        })
      }
    })
  },
  changeCategory: function (event) {
    let nowPage = this
    nowPage.setData({
      newsTop: [],
      swiperItems: [],
      newsList: [],
      nowChannel: event.detail.id
    })
    nowPage.getNews(event.detail.id, "1_daada")
    if (event.detail.id == "RECOMMEND") return;
    wx.request({
      url: "https://c1.m.ifeng.com/weixin_focus?channel=" + event.detail.id + "&pagesize=3",
      method: "GET",
      success: function (res) {
        nowPage.setData({
          swiperItems: res.data
        })
      }
    })
  },
  onReachBottom: function () {
    let upTime = this.data.upTime + 1
    let uid = upTime + "_" + this.data.ucode + "_up"
    this.getNews(this.data.nowChannel, uid)
    this.setData({upTime: upTime})
  },
  onPullDownRefresh: function () {
    let downTime = this.data.downTime + 1
    let uid = downTime + "_" + this.data.ucode + "_down"
    this.setData({
      newsTop: [],
      newsList: [],
      downTime: downTime
    })
    this.getNews(this.data.nowChannel, uid)
  }
})
