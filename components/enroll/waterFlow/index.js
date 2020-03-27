let col1H = 0, col2H = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Pimage:{
      type:Array,
      value:[],
    },
    imgWidth: {  //图片比例
      type:Number,
      value:0
    },

    
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadingCount: 0,
    images: [],
    col1: [],
    col2: []
  },

 
  methods: {
//图片初始化
    onImageLoad: function (e) {
      let imageId = e.currentTarget.id;
      let oImgW = e.detail.width;         //图片原始宽度
      let oImgH = e.detail.height;        //图片原始高度
      let imgWidth = this.data.imgWidth;  //图片设置的宽度
      //比例计算
      let scale = imgWidth/oImgW;       
      let imgHeight = oImgH * scale;      //自适应高度

      let images = this.data.images;
      let imageObj = null;

      for (let i = 0; i < images.length; i++) {
        let img = images[i];
        if (img.id === imageId) {
          imageObj = img;
          break;
        }
      }

      imageObj.height = imgHeight;

      let loadingCount = this.data.loadingCount - 1;
      let col1 = this.data.col1;
      let col2 = this.data.col2;

      //判断当前图片添加到左列还是右列
      if (col1H <= col2H) {
        col1H += imgHeight;
        col1.push(imageObj);
      } else {
        col2H += imgHeight;
        col2.push(imageObj);
      }
      console.log('col2:', col2, col1)
      let data = {
        loadingCount: loadingCount,
        col1: col1,
        col2: col2
      };

      //当前这组图片已加载完毕，则清空图片临时加载区域的内容

      if (!loadingCount) {
        data.images = [];
      }

      this.setData(data);
    },
//图片加载
    loadImages: function () {

      let images = this.data.Pimage

      let baseId = "img-" + (+new Date());

      for (let i = 0; i < images.length; i++) {
        images[i].id = baseId + "-" + i;
      }
      this.setData({
        loadingCount: images.length,
        images: images
      });
    }
    
  }
})
