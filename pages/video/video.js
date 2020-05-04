// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ucode: "",
    upTime: 1,
    videosList: [],
    nowChannel: "IFENGVIDEO",
    topNavItems: [
      {
        num: "1",
        id: "IFENGVIDEO",
        text: "精选"
      },
      {
        num: "2",
        id: "IFENGVIDEO_YL",
        text: "娱乐"
      },
      {
        num: "3",
        id: "IFENGVIDEO_MS",
        text: "美食"
      },
      {
        num: "4",
        id: "IFENGVIDEO_JS",
        text: "军事"
      },
      {
        num: "5",
        id: "IFENGVIDEO_TY",
        text: "体育"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let temp = ""
    for (let i = 0; i < 26; i++) {
      let randomNum = Math.ceil(25 * Math.random());
      temp += String.fromCharCode(65 + randomNum);
    }
    this.setData({
      ucode: temp
    })
    this.getVideos("IFENGVIDEO", "1_1231", null)
  },
  getVideos: function (channel, uid, page) {
    let nowPage = this
    wx.request({
      url: "https://api.iclient.ifeng.com/weixin_list",
      data: {
        channel: channel,
        uid: uid,
        page: page
      },
      method: "GET",
      success: function (res) {
        let newVideosList = nowPage.data.videosList
        res.data.forEach(item => {
          if (item.guid) item.id = item.guid
          if (item.phvideo) item.source = item.phvideo.channelName
          if (item.weMedia) item.source = item.weMedia.name
          newVideosList.push(item)
        })
        nowPage.setData({
          videosList: newVideosList
        })
      }
    })
  },
  changeCategory: function (event) {
    let nowPage = this
    nowPage.setData({
      videosList: [],
      nowChannel: event.detail.id
    })
    nowPage.getVideos(event.detail.id, "1_1231", null)
  },
  onReachBottom: function () {
    let upTime = this.data.upTime + 1
    let uid = upTime + "_" + this.data.ucode + "_up"
    this.getVideos(this.data.nowChannel, uid, upTime)
    this.setData({ upTime: upTime })
  }
})