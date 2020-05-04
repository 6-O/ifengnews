// components/BaseTopNav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topNavItems: Array,
    nowChannel: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeCategory: function(event){
      if(event.currentTarget.dataset.item.num==this.data.currentCategory) return;
      this.triggerEvent("changeCategory", event.currentTarget.dataset.item)
    }
  }
})
