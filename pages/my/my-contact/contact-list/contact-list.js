import { Base } from '../../../../utils/base.js';
import { Api } from '../../../../utils/api.js';
var _base = new Base();
var _api = new Api();

Page({
  data:{
    pageType: '',
    pageTitle: '常用联系人',
    animationData: {},
    contactList: [],
    becomeDefault: true,
    flag: ''
  },
  onLoad: function (options) {
    // this.doDefaultTap();
    console.log('load')
    wx.hideShareMenu();
  },
  onShow:function(){
    _api.seeContact((res) => {
      console.log(res);
      // for(var i=0;i<res.length;i++){
      //   if (res[i].is_default==0){
      //     console.log("a");
      //     this.setData({
      //       becomeDefault:false
      //     })
      //   }else{
      //     console.log("b");
      //     this.setData({
      //       becomeDefault: true
      //     })
      //   }
      // }
      this.setData({
        pageTitle: '选择联系人',
        contactList: res
      });
    })
  },
  onUpdateTap: function (event) {
    let id = _base.getDataSet(event, 'id');
    let name = _base.getDataSet(event, 'name');
    let phone = _base.getDataSet(event, 'phone');
    wx.navigateTo({
      url: `/pages/my/my-contact/contact-update/contact-update?id=${id}&name=${name}&phone=${phone}`
    })
  },

  doChooseBack: function (para) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      chooseContactBack: para,
      newuserNamescofs: para,//活动页面提交信息
      onHideeroll: true//保持显示报名弹框
    });

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 500)
  },

  doChooseTap: function (id, para) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateX(-140).step()
    let contactList = this.data.contactList;
    contactList.forEach((ele) => {
      if (ele.id == id) {
        ele.isSelected = true;
      } else {
        ele.isSelected = false;
      }
    });
    that.setData({
      animationData: animation.export(),
      contactList: this.data.contactList
    })
    setTimeout(function () {
      animation.translateX(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 50)
    that.doChooseBack(para);
  },

  onSelectContactTap(event) {
    let that = this;
    if(that.data.flag) {
      return false
    }
    let id = _base.getDataSet(event, 'id');
    let name = _base.getDataSet(event, 'name');
    let phone = _base.getDataSet(event, 'phone');
    let para = {
      id: id,
      link_name: name,
      link_mobile: phone,
      hasValue: true
    }

      this.doChooseTap(id, para);
  },

  showConfirm(content, typeFlag, contactId, name, phone) {
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
              that.doDefaultTap(contactId);
              let para = {
                id: contactId,
                link_name: name,
                link_mobile: phone,
                hasValue: true
              }
              that.doChooseTap(contactId, para);
              break;
            case 'onDeleteTap':
              that.doDeleteTap(contactId);
              break;
          }
        } else if (res.cancel){
          console.log('用户点击取消');
        }
      }
    })
  },

  doDeleteTap: function (contactId) {
    _api.delContact(contactId, (res) => {
      _base.showToast('删除成功', 'success',1000,function(){
        wx.navigateTo({
          url: 'contact-list',
        })
      });
    });
  },

  doDefaultTap: function (contactId) {
    console.log(contactId,"啊哈哈哈");
    _api.setDcontact(contactId, (res) => {
      let contactList = this.data.contactList;
      contactList.forEach((ele) => {
        ele.is_default = 0;
        if (ele.id == contactId) {
          ele.is_default = 1;
        }
      });
      this.setData({
        contactList: contactList
      });
    })
  },

  changeDefaultTap: function (event) {
    let contactId = _base.getDataSet(event, 'contactId');
    let name = _base.getDataSet(event, 'name');
    let phone = _base.getDataSet(event, 'phone');
    
    this.showConfirm('确定设置为默认联系人吗?', 'changeDefaultTap', contactId, name, phone);
  },

  onDeleteTap: function (event) {
    let contactId = _base.getDataSet(event, 'contactId');
      this.showConfirm('确定删除吗?', 'onDeleteTap', contactId);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    let title = '常用联系人';
    if(prevpage.route == 'pages/my/my-info/my-info') {
      title = '常用联系人'
      this.setData({
        flag: true
      })
    } else {
      title = '选择联系人'
    }
    wx.setNavigationBarTitle({
      title: title
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
    //活动页面提交信息 显示报名弹框
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      onHideeroll: true
    });
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
