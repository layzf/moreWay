import {
  Base
} from '../../../../utils/base.js';
import {
  Api
} from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();
Page({
  data: {
    aa: "",
    chooseAddressBack: {

    },
    chooseContactBack: {
      id: "",
      name: '',
      phone: '',
      hasValue: ""
    },
    chooseCommanderBack: {
      id: "",
      name: '',
      hasValue: "",
    },
    userlinklist: "",
    projectInfoDTO: {},
    selectCommanderTap: false,
    animationData: {},
    commanderList: [],
    userreceivelist: [],
    activity_project_id: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let project_id = options.project_id
    let that = this;
    that.setData({
      activity_project_id: options.id,
    })
    let activity_project_id = that.data.activity_project_id
    _api.fill_deposit(activity_project_id, (res) => {
      console.log(res);
      // 把联系人附给userlinklist，以便传递
      let userlinklist = JSON.stringify(res.data.userlinklist);
      let addrList = res.data.userreceivelist;
      let back = that.data.chooseAddressBack;
      let i = null,j = null;
      for(let index=0;index<addrList.length;index++){
        if(addrList[index].address_type === 1){
          i = index;
        }
        if(addrList[index].is_default === 1){
          j = index
        }
      }
      if(i != null){
          back.village_name = addrList[i].village_name;
          back.address_detail = addrList[i].door_number;
          back.id = addrList[i].id;
      }else if(j != null){
          back.village_name = addrList[j].village_name;
          back.address_detail = addrList[j].door_number;
          back.id = addrList[j].id;
      }else{
          if(addrList.length>0){
              back.village_name = addrList[0].village_name;
              back.address_detail = addrList[0].door_number;
              back.id = addrList[0].id;
          }
      }

      that.setData({
        userlinklist: userlinklist,
        userreceivelist: res.data.userreceivelist,
        chooseAddressBack:back
      })
      //调用设置默认团长，地址
      that.project(res.data);
      that.default_link(res.data);
     // that.default_adress(res.data);
    })
  },
  // 项目定金数据
  project(res) {
    this.setData({
      projectInfoDTO: res.activityProjectDTO
    })
  },
  // 设置默认收货地址
  default_adress(res) {
    let chooseAddressBack = this.data.chooseAddressBack;
    for (let h = 0; h < res.userreceivelist.length; h++) {
      if (res.userreceivelist[h].is_default == 1) {
        chooseAddressBack.id = res.userreceivelist[h].id
        chooseAddressBack.address_detail = res.userreceivelist[h].address_detail || res.userreceivelist[h].door_number
        chooseAddressBack.can_update = res.userreceivelist[h].can_update
        chooseAddressBack.address_type = res.userreceivelist[h].address_type
        chooseAddressBack.can_update = res.userreceivelist[h].can_update
        chooseAddressBack.img_url = res.userreceivelist[h].img_url
        chooseAddressBack.hasValue = true
      }
    }
    this.setData({
      chooseAddressBack: chooseAddressBack
    })
    console.log("这攻速");
    console.log(this.data.chooseAddressBack);
  },
  // // 设置默团长
  // commander(res) {
  //   let commanderList = res.userreceivelist
  //   this.setData({
  //     commanderList: commanderList,
  //   })
  //   console.log(this.data.commanderList);
  // },
  // 设置默认联系人
  default_link(res) {
    let chooseContactBack = this.data.chooseContactBack;
    for (let h = 0; h < res.userlinklist.length; h++) {
      if (res.userlinklist[h].is_default == 1) {
        chooseContactBack.phone = res.userlinklist[h].link_mobile
        chooseContactBack.name = res.userlinklist[h].link_name
        chooseContactBack.id = res.userlinklist[h].id
        chooseContactBack.hasValue = true
      }
    }
    this.setData({
      chooseContactBack: chooseContactBack
    })
  },

  formValidateSubmit: function(para) {
    var result = {
      status: false,
      msg: ''
    }
    if (!_base.validate(para.address, 'require')) {
      result.msg = '请选择收货地址';
      return result;
    }
    if (!_base.validate(para.contact, 'require')) {
      result.msg = '请选择联系人';
      return result;
    }
    // if (!_base.validate(para.commander, 'require')) {
    //   result.msg = '选择服务团长';
    //   return result;
    // }
    result.status = true;
    result.msg = '';
    return result;
  },

  onSubmitTap: function() {
    let para = {};
    para.address = this.data.chooseAddressBack.address_detail;
    para.contact = this.data.chooseContactBack.name;
    para.user_receive_id = this.data.chooseAddressBack.id;
    para.user_link_id = this.data.chooseContactBack.id;
    para.activity_project_id = this.data.activity_project_id;
    var validateResult = this.formValidateSubmit(para);
    if (!validateResult.status) {
      _base.showToast(validateResult.msg);
      return false;
    }
    _api.sub_deposit(para, (res) => {
      _base.showToast('提交成功');
      console.log(res.data)
      this.pay(res.data);
      // setTimeout(() => {
      //   wx.redirectTo({
      //     url: '/pages/my/my-deposit/deposit-pay-res/deposit-pay-res'
      //   })
      // }, 500);
    })
  },

  changeCommanderTap: function(event) {
    let id = _base.getDataSet(event, 'id');
    let name = _base.getDataSet(event, 'name');
    let para = {
      id: id,
      name: name + '团长',
      hasValue: true,
    }
    let commanderList = this.data.commanderList;
    commanderList.forEach((ele) => {
      ele.is_default = 0;
      if (ele.id == id) {
        ele.is_default = 1;
      }
    });
    this.setData({
      commanderList: commanderList,
      chooseCommanderBack: para
    });
    setTimeout(() => {
      this.hideCommanderModal();
    }, 500);
    this.default_adress(id);
  },

  onSelectCommanderTap: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export(),
      selectCommanderTap: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  hideCommanderModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        selectCommanderTap: false
      })
    }, 200)
  },
  //支付接口
  pay(so_id) {
    _api.pay(so_id, (res) => {
      console.log(res);
      wx.requestPayment({
        'timeStamp': "" + res.data.timeStamp,
        'nonceStr': res.data.nonceStr,
        'package': "prepay_id=" + res.data.prepay_id,
        'signType': res.data.signType,
        'paySign': res.data.paySign,
        'success': function(res) {
          console.log("成功");
          if (res.errMsg == 'requestPayment:ok') {
            wx.redirectTo({
              url: '/pages/result/result-pay/result-pay'
            })
          }
        },
        'fail': function(res) {
          wx.redirectTo({
            url: '/pages/my/my-deposit/deposit-list/deposit-list?type=' + 0,
          })
        }
      })
      // wx.navigateTo({
      //   url: '/pages/my/my-deposit/deposit-pay-res/deposit-pay-res'
      // })
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function() {
    console.log(1);
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    console.log('currPage',currPage);
    if (currPage.data.chooseAddressBack) {
      this.setData({
        chooseAddressBack: currPage.data.chooseAddressBack
      });
    }
    if (currPage.data.chooseContactBack) {
      this.setData({
        chooseContactBack: currPage.data.chooseContactBack
      });
    }
    // console.log(this.data.chooseContactBack);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
