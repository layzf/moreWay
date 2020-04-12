import {
  Base
} from '../../../../utils/base.js';
import {
  Api
} from '../../../../utils/api.js';
import {
  login
} from '../../../../utils/login.js';
var _base = new Base();
var _login = new login();
var _api = new Api();
Page({
  data: {
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
    animationData: {},
    commanderList: [],
    userreceivelist: [],
    activity_project_id: "",
    user:'',
    /**安居佳临时项目**/
    anjujiaPid:'',
    orderDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
 /**安居佳临时项目 pid 这是安居佳id标识**/
 
    if(options.pid){ 
      this.setData({
        anjujiaPid:options.pid
      })
    }
    //订金有效期
    if(options.data){
      this.setData({
        orderDate:options.data
      })
    }
    that.setData({
      activity_project_id: options.id,
    })

    let activity_project_id = that.data.activity_project_id
    //项目查询
    _api.orderData({project_id:activity_project_id}, (res) => {
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
      projectInfoDTO: res.projectInfoDTO
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
  },

  // 设置默认联系人
  default_link(res) {
    let chooseContactBack = this.data.chooseContactBack;
    for (let h = 0; h < res.userlinklist.length; h++) {
      if (res.userlinklist[h].is_default == 1) {
        chooseContactBack.link_mobile = res.userlinklist[h].link_mobile
        chooseContactBack.link_name = res.userlinklist[h].link_name
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

    result.status = true;
    result.msg = '';
    return result;
  },

  onSubmitTap: function() {
    let para = {};
    para.address = this.data.chooseAddressBack.address_detail;
    para.contact = this.data.chooseContactBack.link_name;
    para.user_receive_id = this.data.chooseAddressBack.id;
    para.user_link_id = this.data.chooseContactBack.id;
/**安居佳**/
    var products = ''
    if (this.data.anjujiaPid==''){
      products = this.data.activity_project_id;
    }else{
      products = this.data.anjujiaPid
    }
    para.project_id = products

    var validateResult = this.formValidateSubmit(para);

    if (!validateResult.status) {
      _base.showToast(validateResult.msg,'none');
      return false;
    }

    console.log(para,"提交订金的参数值")
 
    _api.submitOrders(para, (res) => {
      this.pay(res);
    })
  },

  //支付接口
  pay(so_id) {
    _api.pay(so_id, (res) => {
      var tiem = 0;

      console.log(res,'支付');
  //会话过期，重新请求
      if (res.resultCode===1002){
        _login.wxLogin2()
      } else if (res.resultCode===1000){
        wx.requestPayment({
          'timeStamp': "" + res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': "prepay_id=" + res.data.prepay_id,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            console.log("成功");
            if (res.errMsg == 'requestPayment:ok') {

              wx.requestSubscribeMessage({
                tmplIds: ['2y4fzly6TSrnKVbMIVgzXE0rk841RV219-luuueGmEI'],
                success: (res) => {
               
                  if (res['2y4fzly6TSrnKVbMIVgzXE0rk841RV219-luuueGmEI'] === 'accept') {
                    wx.showToast({
                      title: '订阅成功',
                      duration: 1500,
                      success:()=>{

                        setTimeout(() => {
                          wx.redirectTo({
                            url: '/pages/earnest/pay-result/result?payorder=2&payid=' + so_id + ''
                          })
                        }, 1700)

                      }
                    })
                  }else{
                    wx.redirectTo({
                      url: '/pages/earnest/pay-result/result?payorder=2&payid=' + so_id + ''
                    })
                  }
                }
              })

            }
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '/pages/my/my-deposit/deposit-list/deposit-list?type=' + 0,
            })
          }
        })
      }
     
    });
  },


  onShow: function() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let user = wx.getStorageSync('loginUser');//是否有授权后的名字
    
    //没有名字弹出 授权弹框
    if (!user.user_name) {
      _base.showToast('未授权', 'none', 1200, wx.navigateTo({
        url: '../../../newLogin/index',
      })) 
    }
//名字不为空，并且选择联系人 为空的时候
    if (user.user_name && !currPage.data.chooseContactBack.link_name){
      this.setData({
        'chooseContactBack.link_name': user.user_name,
      })
    }

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
  },

})
