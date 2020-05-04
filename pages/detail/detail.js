// pages/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: "",
    type: "",
    source: "",
    time: "",
    artical: "",
    slides: [],
    comments: [],
    commentsFold: true,
    commentsList: [],
    noRecommendTips: "",
    recommendPage: 0,
    recommendList: [],
    detailInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowPage = this
    wx.request({
      url: 'https://c1.m.ifeng.com/weixin_text?aid=' + options.aid,
      success: function (res) {
        if (res.data.status == 0) {
          return wx.navigateBack({
            success: function () {
              wx.showToast({
                title: '页面不存在',
                icon: "none",
                duration: 2000
              })
            }
          })
        }
        let source = ""
        let time = ""
        let detailInfo = res.data[0]
        if (detailInfo.source) source = detailInfo.source
        if (detailInfo.phvideo) source = detailInfo.phvideo.channelName
        if (detailInfo.weMedia) source = detailInfo.weMedia.name
        if (detailInfo.updateTime) time = detailInfo.updateTime
        if (detailInfo.updateDate) time = detailInfo.updateDate
        if (detailInfo.type == "video") {
          nowPage.setData({
            aid: options.aid,
            source: source,
            time: time,
            detailInfo: detailInfo
          })
        }
        if (detailInfo.type == "doc") {
          let artical = detailInfo.text
            .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
            .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
            .replace(/<p>/ig, '<p class="artical--p">')
            .replace(/<img/gi, '<img class="artical--img" ')
          nowPage.setData({
            aid: options.aid,
            source: source,
            time: time,
            detailInfo: detailInfo,
            artical: artical
          })
        }
        if (detailInfo.type == "slide") {
          nowPage.setData({
            aid: options.aid,
            source: source,
            time: time,
            detailInfo: detailInfo,
            slides: detailInfo.slides
          })
        }
        nowPage.getComments()
        nowPage.getRecommends()
      }
    })
  },
  getComments: function () {
    let nowPage = this
    wx.request({
      url: "https://comment.ifeng.com/get/comments?doc_url=" + nowPage.data.aid,
      success: function (res) {
        let comments = res.data.comments
        let commentsList = []
        for (let index = 0; index < comments.length && index < 3; index++) {
          commentsList.push(comments[index])
        }
        nowPage.setData({
          comments: comments,
          commentsList: commentsList
        })
      }
    })
  },
  getRecommends: function () {
    let nowPage = this
    wx.request({
      url: 'https://api.iclient.ifeng.com/NewRelatedDocs',
      data: {
        proid: "ifengnewsh5",
        id: nowPage.data.aid,
        title: nowPage.data.detailInfo.title,
        page: nowPage.data.recommendPage + 1,
        size: 10
      },
      success: function (res) {
        let recommendList = nowPage.data.recommendList
        res.data[0].item.forEach(item => recommendList.push(item))
        if (recommendList.length == 0) return nowPage.setData({ noRecommendTips: "本篇标题含敏感词，无法获取相关推荐!" })
        nowPage.setData({
          recommendPage: nowPage.data.recommendPage + 1,
          recommendList: recommendList
        })
      }
    })
  },
  commentsFoldTrigger: function () {
    let comments = this.data.comments
    let commentsList = []
    if (this.data.commentsFold) commentsList = comments
    else {
      for (let index = 0; index < comments.length && index < 3; index++) {
        commentsList.push(comments[index])
      }
    }
    this.setData({
      commentsFold: !this.data.commentsFold,
      commentsList: commentsList
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.recommendList.length == 0) return;
    this.getRecommends()
  },
  tapBottomBar: function (event) {
    switch (event.target.dataset.to) {
      case "news":
        wx.switchTab({
          url: "/pages/index/index"
        });
        break;
      case "video":
        wx.switchTab({
          url: "/pages/video/video"
        });
        break;
      default: break;
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})