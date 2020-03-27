import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    pageType: '',
    pageTitle: '我的地址',
    animationData:{},
      useAnimate:true,
    addressList: [
      // {
      //   "id": 10001,
      //   "isDefault": 1,
      //   "isOfen": 0,
      //   "estate": "家和园 17-2101",
      //   "address":"湖南省长沙市岳麓区枫林三路742号"
      // },
      // {
      //   "id": 10002,
      //   "isDefault": 0,
      //   "isOfen": 0,
      //   "estate": "家和园 17-2102",
      //   "address": "湖南省长沙市岳麓区枫林三路742号"
      // },
      // {
      //   "id": 10003,
      //   "isDefault": 0,
      //   "isOfen": 1,
      //   "estate": "家和园 17-2103",
      //   "address": "湖南省长沙市岳麓区枫林三路742号三路742号三路742号三路742号三路742号三路742"
      // }
    ]
  },

  onShow: function (options) {
    let that=this;
    // if (options.hasOwnProperty('pageType')) {
    //   let addressList = this.data.addressList;
    //   addressList.forEach((ele) => {
    //     ele.isSelected = false;
    //   });
    //   this.setData({
    //     pageType: options.pageType,
    //     pageTitle: '选择收货地址',
    //     addressList: this.data.addressList
    //   });
    // }
      _api.adress((res) => {
      
        that.setData({
          addressList: res.data
        })
      })



  },

  onUpdateAddressTap: function (event) {
    let data = this.data.addressList;
    let index = _base.getDataSet(event, 'index');
    let item = data[index];
    // let address = encodeURI(_base.getDataSet(event, 'address'));
    // console.log(address);
    wx.navigateTo({
      url: `/pages/my/my-address/address-update/address-update?data=${JSON.stringify(item)}`,
    })
  },

  doChooseBack: function (para) {
     console.log(para);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      chooseAddressBack: para
    });
    setTimeout(()=>{
      wx.navigateBack({
        delta: 1
      })
    }, 500)
  },

  doChooseTap: function (id, para) {
    console.log("到了这里")
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateX(-140).step()
    let addressList = this.data.addressList;
    addressList.forEach((ele) => {
      if (ele.id == id) {
        ele.isSelected = true;
      } else {
        ele.isSelected = false;
      }
    });
    that.setData({
      animationData: animation.export(),
      addressList: this.data.addressList
    })
    setTimeout(function () {
      animation.translateX(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 50)
    that.doChooseBack(para);
  },

  onSelectAddressTap (event) {
    let can_update = _base.getDataSet(event, 'can_update');
    let id = _base.getDataSet(event, 'id');
    let address_type = _base.getDataSet(event, 'address_type');
    let para={}
    if (address_type==1){ //认证地址
      let village_name = _base.getDataSet(event, 'village_name');
      let img_url = _base.getDataSet(event, 'img_url');
      let door_number = _base.getDataSet(event, 'door_number');
      para = {
        id: id,
        address_detail: door_number ||address_detail,
        can_update: can_update,
        address_type: address_type,
        village_name: village_name,
        img_url: img_url,
         door_number: door_number,
        hasValue: true,
        useAnimate:true
      }
    }
    if (address_type==0){ //常住地址
      let address_detail = _base.getDataSet(event, 'address_detail');
      let door_number = _base.getDataSet(event, 'door_number');
      let village_name = _base.getDataSet(event, 'village_name');
      para = {
        id: id,
        address_detail: address_detail || door_number,
        can_update: can_update,
        address_type: address_type,
        door_number: door_number,
        village_name:village_name,
        hasValue: true
      }
    }
      this.doChooseTap(id, para);

  },

  showConfirm(content, typeFlag, id, event) {
    let that = this;
    wx.showModal({
      title: "",
      content: content || "",
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#999999',
      confirmText: '确定',
      confirmColor: '#FF5D22',
      success: function (res) {
        if (res.confirm) {
          switch (typeFlag) {
            case 'changeDefaultTap':
              that.doDefaultTap(id);
              that.onSelectAddressTap(event)
              break;
            case 'onDeleteTap':
              that.doDeleteTap(id);
              break;
          }
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
        // if (res.confirm) {
        //   that.doDefaultTap(id);
        // }
      }
    })
  },

  doDefaultTap: function (id) {
    _api.adress_update(id,(res)=>{
      let addressList = this.data.addressList;
      addressList.forEach((ele) => {
        ele.is_default = 0;
        if (ele.id == id) {
          ele.is_default = 1;
        }
      });
      this.setData({
        addressList: addressList
      });
      console.log(this.data.addressList)
      _base.showToast('设置成功', 'success');
    })
  },

  doDeleteTap: function (id) {
    _api.del_adress(id, (res) => {
      _base.showToast('删除成功', 'success', 1000);

      _api.adress((res) => {
        this.setData({
          addressList: res.data
        })
      })

    });
  },

  changeDefaultTap: function (event) {
    let id = _base.getDataSet(event, 'id');
    this.showConfirm('确定设置为默认地址吗?', 'changeDefaultTap', id, event);
  },

  onDeleteTap: function (event) {
    let id = _base.getDataSet(event, 'id');
    console.log("这是id")
    console.log(id)
    this.showConfirm('确定删除吗?', 'onDeleteTap', id);
  },

  onLoad:function(option){
    wx.hideShareMenu();
    //个人中心收货地址，点击选项 不做处理，销毁click事件
    if(option.type == 0){
      this.setData({
          useAnimate:false
      })
    }
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.pageTitle
    });
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
