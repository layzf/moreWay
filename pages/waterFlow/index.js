Page({

  data: {
      Pimage:[
        {
          pic: "../../../images/share.jpg",
          height: 0
        },

        {
          pic: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190313090409/完美9.png",
          height: 0
        },
        {
          pic: "../../../images/share.jpg",
          height: 0
        },
        {
          pic: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190313090409/完美9.png",
          height: 0
        },
        {
          pic: "../../../images/custom.jpg",
          height: 0
        },
        {
          pic: "http://dashus.oss-cn-shenzhen.aliyuncs.com/DefaultImage/Game/20190313090409/完美9.png",
          height: 0
        },
      ],
    scrollH: 0,
    imgWidth: 0
  },

  onLoad: function () {
    
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        //加载首组图片
        this.selectComponent('#waters').loadImages()
      }
    })

  },
  loadImages(){
    this.selectComponent('#waters').loadImages()
  }


})

