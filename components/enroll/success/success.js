// components/enroll/success/success.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      isShare:{
          type:Boolean,
          value:false
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      height:wx.getSystemInfoSync().windowHeight,//屏幕高度
      showLogin:false,
      mask:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
      //隐藏
      hideRow(e){
          this.setData({
              mask:false
          })
          setTimeout(()=>{
              this.setData({
                  showLogin:false
              })
          },10)
      },

      //复制微信号
      copyWechat(){
          let that = this;
          wx.setClipboardData({
              data: 'duoranghuazhu',
              success: function (res) {
                  wx.getClipboardData({
                      success: function (res) {
                          that.setData({
                              showLogin:true
                          })
                          setTimeout(()=>{
                              that.setData({
                                  mask:true
                              })
                          },10)
                      }
                  })
              }
          })
      },

      //拨打电话
      callPhone(e){
        let phone = e.target.dataset.phone;
          wx.makePhoneCall({
              phoneNumber: phone
          })
      },

      returnHome(){
          wx.reLaunch({
              url: '/pages/group/group?village_id=22'
          })
      },
  }
})
