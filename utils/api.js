import {
  Base
} from 'base.js';
var _base = new Base();

class Api extends Base {
  constructor() {
    super();
  }
  // 获取所有小区
  getEstates(latitude, longitude, callBack) {
    var params = {
      url: 'villageinfo/list',
      data: {
        latitude: latitude,
        longitude: longitude,
        sortByDistance: true
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  // 获取所有小区
  getAll(status, page, pagesize, callBack) {
    var params = {
      url: 'villageinfo/list',
      data: {
        status: status,
        page: page,
        pagesize: pagesize
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  // 获取历史小区
  getHisvillage(callBack) {
    var params = {
      url: 'villagehistory/getlast',
      data: {},
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }

  //手机号
  wxLogin(data,callBack){
      let sessionId = wx.getStorageSync("sessionId");
      let params = {
          url: 'userinfo/getPhoneEncryptedData',
          data: {
            encryptedData:data.data,
            iv:data.iv,
            sessionId:sessionId
          },
          sCallBack: function(res) {
              callBack && callBack(res);
          }
      }
      this.request(params);
  }

  // 根据小区获取楼栋?
  getBuilding(village_id, callBack) {
    var params = {
      url: 'villageroomnumber/getlist',
      data: {
        village_id: village_id
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }

  // 获取首页集采?
  getGroupPageInfo(id, callBack) {
    var params = {
      url: 'villageinfo/view',
      data: {
        village_id: id
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }

  // 获取首页集采展示数据?
  getGroupData(callBack) {
    var params = {
      url: 'json/allnum',
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }

  // 手机登录?
  doLogin(phone, code, callBack) {
    var params = {
      url: 'userinfo/loginMobile',
      data: {
        anycode: 'soask_duorang',
        mobile: phone,
        code: code
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //退出登录
  exitLogin(callBack) {
    var params = {
      url: 'userinfo/loginout',
      data: {

      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  // 多让会员认证？
  uploadMemberInfo(villageName,village_id, door_number, certificate_img, card_img, callBack) {
    var params = {
      url: 'useraut/doadd',
      data: {
        villageName: villageName ,
        village_id: village_id,
        door_number: door_number,
        certificate_img: certificate_img,
        card_img: card_img
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //看会员是否审核通过
  becomeVip(callBack) {
    var params = {
      url: 'useraut/list',
      data: {

      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //判断登陆，会员审核，团长状态的接口
  diffState(callBack) {
    var params = {
      url: 'userinfo/getdes',
      data: { },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //团长申请
  applyCompany(content, door_number, certificate_img, card_img, callBack) {
    var params = {
      url: 'villageapply/doadd',
      data: {
        content: content,
        door_number: door_number,
        certificate_img: certificate_img,
        card_img: card_img
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //报名接口
  singUp(village_activity_id, user_name, mobile, callBack) {
    var params = {
      url: 'villageactivityenroll/doadd',
      data: {
        village_activity_id: village_activity_id,
        user_name: user_name,
        mobile: mobile
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //  预约接口
  appointTime(village_activity_id, project_id, plan_at, user_name, mobile, callBack) {
    var params = {
      url: 'villageactivityplan/doadd',
      data: {
        village_activity_id: village_activity_id,
        project_id: project_id,
        plan_at: plan_at,
        user_name: user_name,
        mobile: mobile
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //  取消报名接口
  calcelSingup(village_activity_id, callBack) {
    var params = {
      url: 'villageactivityenroll/doupdate',
      data: {
        village_activity_id: village_activity_id
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //获取验证码
  getCode(phone, codeType, callBack) {
    var params = {
      url: 'json/getCode',
      data: {
        mobile: phone,
        codeType: codeType
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  // 获取轮播接口图片
  getSlider(callBack) {
    var params = {
      url: 'json/bannerlist',
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  // 显示联系人
  seeContact(callBack) {
    var params = {
      url: 'userlink/list',
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  //添加联系人
  addContact(link_name, link_mobile, callBack) {
    var params = {
      url: 'userlink/doadd',
      data: {
        link_name: link_name,
        link_mobile: link_mobile
      },
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  //删除联系人
  delContact(delId, callBack) {
    var params = {
      url: 'userlink/del',
      data: {
        id: delId
      },
      sCallBack: function(res) {
        console.log(res);
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  //修改联系人信息
  updateContact(link_name, link_mobile, id, callBack) {
    var params = {
      url: 'userlink/doupdate',
      data: {
        link_name: link_name,
        link_mobile: link_mobile,
        id: id
      },
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  //设置默认联系人
  setDcontact(id, callBack) {
    var params = {
      url: 'userlink/updatedefault',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  // 获取默认联系人
  reqDcontact(callBack) {
    var params = {
      url: 'userlink/getdefault',
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  //获取集采
  getCollects(callBack) {
    var params = {
      url: 'group/getCollects',
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  // 获取集采详情
  getCollectDetail(collectId, callBack) {
    var params = {
      url: 'villageactivity/view',
      data: {
        village_activity_id: collectId
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  getCollectById(collectId, callBack) {
    var params = {
      url: 'collect/getCollectById',
      data: {
        collectId: collectId
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  // 获取集采评论
  getCollectComment(collectId, callBack) {
    var params = {
      url: 'collect/getCollectComment',
      data: {
        collectId: collectId
      },
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  // 获取集采数据表格
  getCollectTable(collectId, callBack) {
    var params = {
      url: 'collect/getCollectTable',
      data: {
        collectId: collectId
      },
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }

  getMyGroups(callBack) {
    var params = {
      url: 'my/myGroups',
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }

  //获取个人订单评价
  getOrderEvalute(data,callback){
      let params = {
          url: 'evaluateinfo/view',
          data:data,
          sCallBack: function(res) {
              callback && callback(res.data);
          }
      }
      this.request(params);
  }

  //获取项目商品评价
  getShopEvalute(data,callback){
      let params = {
          url: 'evaluateinfo/list',
          data:data,
          sCallBack: function(res) {
              callback && callback(res.data);
          }
      }
      this.request(params);
  }

  //提交服务费
  sunmitService(id, sessionId, callBack) {
    var params = {
      url: 'soinfo/payaut',
      data: {
        id: id,
        sessionId: sessionId
      },
      sCallBack: function(res) {
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }
  //处理开通小区页面接口
  dealDetail(village_id, callBack) {
    var params = {
      url: 'villageopen/view',
      data: {
        village_id: village_id
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //助力开通小区接口
  helpBecome(village_id, callBack) {
    var params = {
      url: 'villageopen/doadd',
      data: {
        village_id: village_id
      },
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //我的参团
  myOfffered(callBack) {
    var params = {
      url: 'activityinfo/alllist',
      data: {},
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(params);
  }
  //我的团长
  // getCommanders(callBack) {
  //   var params = {
  //     url: 'userreceiveinfo/list',
  //     sCallBack: function(res) {
  //       callBack(res.data);
  //     }
  //   }
  //   this.request(params);
  // }

  //我的定金
  getDeposits(typeId, callBack) {
    if (typeId == 9) {
      typeId = "";
    }
    var params = {
      url: 'soinfo/list',
      data: {
        status: typeId,
        page: 1,
        pagesize: 1000
      },
      sCallBack: function(res) {
        callBack(res.data);
      }
    }
    this.request(params);
  }
  //取消订单
  cancel_order(so_id, callBack) {
    var params = {
      url: 'soinfo/socancel',
      data: {
        so_id: so_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //订金详情
  deposit_detail(id, callBack) {
    var params = {
      url: 'soinfo/view',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //支付
  pay(so_id, callBack) {
    var sessionId = wx.getStorageSync('sessionId');
    var params = {
      url: 'soinfo/pay',
      data: {
        so_id: so_id,
        sessionId: sessionId,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //  申请退订金
  refund_deposit(typeId, callBack) {
    var params = {
      url: 'soinfo/list',
      data: {
        statusStr: '1,2',
        apiTypeStatus:1,
        page: 1,
        pagesize: 1000
      },
      sCallBack: function(res) {
        callBack(res.data);
      }
    }
    this.request(params);
  }

  //  取消申请退订金
  cancel_deposit(id, callBack) {
    var params = {
      url: 'socancel/cancel',
      data: {
        so_cancel_id: id
      },
      sCallBack: function(res) {
        callBack(res)
      }
    }
    this.request(params);
  }

  //  退定金记录
  record_deposit(callBack) {
    var params = {
      url: 'socancel/list',
      data: {
        page: 1,
        pagesize: 1000
      },
      sCallBack: function(res) {
        callBack(res.data);
      }
    }
    this.request(params);
  }

  //申请返现
  applyMoney(data,callBack){
      var params = {
          url: 'soitem/applyReturnMoney',
          data: data,
          sCallBack: function(res) {
              callBack(res.data);
          }
      }
      this.request(params);
  }

  //申请退定金列表

  listGroupBySoId() {
    let params = {
      url: 'soitem/listGroupBySoId',
      type: 'GET',
      data: {},
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }


  get_order(typeId, callBack) {
    console.log(typeId,'typeIdtypeIdtypeId')
   let data;
    switch (typeId){
      case '9':
        data = {
            status: '',
            pagesize: 1000
        }
        break;
      case '-2':  
        data = {
          status: typeId,
          pagesize: 1000
        }
        break;  
      case '-1':
        data = {
          payStatus: -1,
          status: typeId,
          pagesize: 1000
       }
        break;  
       //待验收
      case '0,1':
        data = {
          payStatus: 1,
          statusStr:'0,1',
          pagesize: 1000
        }
    break;  
      case '3,4':
        data = {
          soTypeStr:'3,4',
          pagesize: 1000
        }

      break;  
        
      default:
        data = {
          status: typeId,
          pagesize: 1000,
          payStatus:1
        }
    }
    var params = {
      url: 'soitem/list',
      data: data,
      sCallBack: function(res) {
        callBack(res.data);
      }
    }
    this.request(params);
  }

  //获取团长信息
  getGroupInfo(callback){
      var params = {
          url: 'userinfo/myGroup',
          data: {},
          sCallBack: function(res) {
              callback(res.data);
          }
      }
      this.request(params);
  }

  //申请退定金提交
  sub_record(para, callBack) {
    var params = {
      url: 'socancel/doadd',
      data: {
        so_id: para.ref_id,
        reason: para.textArea,

      },
      sCallBack: function(res) {
        callBack(res.data);
      }
    }
    this.request(params);
  }
  //订单详情
  order_detail(id, callBack) {
    var params = {
      url: 'soitem/view',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //我的订单-确定验收
  sure_check(data, callBack) {
    //true 是担保交易验收，fasle 非担保交易验收
    var url = ''
    if (data.type==true){
       url='soitem/acceptSecuredSoItem'
     }else{
       url='soitem/doupdate12'
     }
    var params = {
      url: url,
      data: {
        id: data.id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }


  //我的订单-提交评论
  evaluateinfo(para, callBack) {
    var params = {
      url: 'evaluateinfo/doadd',
      data: {
        content: para.content,
        evalute_type: para.evalute_type,
        img_url: para.img_url,
        label: para.label,
        radioValue: para.radioValue,
        ref_id: para.ref_id,
        score: para.score,
        textArea: para.textArea,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //我的订单-问题反馈
  problem_feedback(para, callBack) {
    var params = {
      url: 'evaluateinfo/doadd',
      data: {
        content: para.content,
        imgUrl: para.img_url,
        label: para.label,
        score: para.score,
        content: para.content,
        soItemId:para.soItemId,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //我的订单-查看评价
  view_evaluation(id, callBack) {
    var params = {
      url: 'evaluateinfo/view',
      data: {
        id: id,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //集采-填写定金单
  fill_deposit(activity_project_id, callBack) {
    var params = {
      url: 'soinfo/add',
      data: {
        activity_project_id: activity_project_id,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //搜索小区接口
  serachArea(village_name, callBack) {
    var params = {
      url: 'villageinfo/list',
      data: {
        village_name: village_name
      },
      sCallBack: function(res) {
        console.log(res);
        callBack && callBack(res.data);
      }
    }
    this.request(params);
  }

  //个人信息
  my_info(callBack) {
    var params = {
      url: 'userinfo/view',
      data: {

      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //个人信息更换图像
  update_icon(icon, callBack) {
    var params = {
      url: 'userinfo/updateIcon',
      data: {
        icon: icon
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  // 上传二维码
  uploadCode(user_img, callBack) {
    var params = {
      url: 'userinfo/updateuser_img',
      data: {
        user_img: user_img
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //个人信息更换昵称
  save_name(user_name, callBack) {
    var params = {
      url: 'userinfo/updateUserName',
      data: {
        user_name: user_name
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //收货地址
  adress(callBack) {
    var params = {
      url: 'userreceiveinfo/list',
      data: {
        page: 1,
        pagesize: 20,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //提交定金单
  sub_deposit(para, callBack) {
    var params = {
      url: 'soinfo/doadd',
      data: {
        user_receive_id: para.user_receive_id,
        user_link_id: para.user_link_id,
        activity_project_id: para.activity_project_id,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //定金单支付
  pay_money(so_id, callBack) {
    var params = {
      url: 'soinfo/pay',
      data: {
        so_id: so_id,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //添加常驻地址
  adress_add(para, callBack) {
    var params = {
      url: 'userreceiveinfo/doadd',
      data: {
          village_name: para.village_name,
          door_number:para.number,
          province_name:para.province_name,
          city_name:para.city_name,
          district_name:para.district_name
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //修改常驻地址
  adress_doupdate(para, callBack) {
    var params = {
      url: 'userreceiveinfo/doupdate',
      data: {
          village_name: para.village_name,
          door_number:para.number,
          province_name:para.province_name,
          city_name:para.city_name,
          district_name:para.district_name,
          id:para.id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //删除常驻地址
  del_adress(id, callBack) {
    var params = {
      url: 'userreceiveinfo/del',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //修改默认地址
  adress_update(id, callBack) {
    var params = {
      url: 'userreceiveinfo/updatedefault',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }


  //我的业主码
  my_auth(callBack) {
    var params = {
      url: 'userinfo/view',
      data: {

      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }


  //小区会员总数
  member_all(callBack) {
    var params = {
      url: 'useraut/getall',
      data: {
        status: 1
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }


  //小区会员待审核总数
  member_unaudited(callBack) {
    var params = {
      url: 'useraut/getall',
      data: {
        status: 0
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //小区会员列表
  member_list(k, callBack) {
    var params = {
      url: 'useraut/teamlist',
      data: {
        k: k,
        page: 1,
        pagesize: 20,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //小区会员待审核列表
  member_unaudited_list(callBack) {
    var params = {
      url: 'useraut/teamlist',
      data: {
        status: 0,
        page: 1,
        pagesize: 20,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }


  //小区会员详情信息
  examine_detail(id, callBack) {
    var params = {
      url: 'useraut/view',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //查看会员详情信息
  member_info(id, callBack) {
    var params = {
      url: 'useraut/view',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //小区会员审核通过
  pass(id, door_number, village_name, callBack) {
    console.log(door_number);
    var params = {
      url: 'useraut/pass',
      data: {
        id: id,
        door_number: door_number,
        village_name: village_name
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //小区会员审核不通过
  no_pass(id, door_number, err_msg, callBack) {
    var params = {
      url: 'useraut/nopass',
      data: {
        id: id,
        err_msg: err_msg,
        door_number: door_number,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //集采项目价格表接口
  collectPrice(id, callBack) {
    var params = {
      url: 'activityproject/view_prods',
      data: {
        id: id,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  // 更换手机账户
  updateMobile(mobile, code, callBack) {
    var params = {
      url: 'userinfo/updatemobile',
      data: {
        mobile: mobile,
        code: code
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  // //定时器判断是否支付成功
  checkpay(so_id, callBack) {
    var params = {
      url: 'soinfo/checkpay',
      data: {
        so_id: so_id,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //项目列表接口
  progressList(data, callBack) {
    console.log('执行参数',data);
    var params = {
      url: 'projectinfo/list',
      data:data,
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //获取集采预告
  collectPredect(village_id, callBack) {
    var params = {
      url: 'baseinfo/list',
      data: {
        village_id: village_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //集采预告详情列表页
  collectPlist(base_id, village_id, callBack) {
    var params = {
      url: 'activityinfo/list',
      data: {
        base_id: base_id,
        village_id: village_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //批量报名接口
  allJoinlist(user_name, mobile, activity_project_ids, village_full_name, ridingId, callBack, base_id) {
    var params = {
      url: 'activityprojectenroll/doadds',
      data: {
        user_name: user_name,
        mobile: mobile,
        activity_project_ids: activity_project_ids,
        village_full_name: village_full_name,
        ridingId:ridingId,
        base_id:base_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //joinImg成团图片接口
  joinImg(id, callBack) {
    var params = {
      url: 'baseinfo/view',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //项目详情页
  progressDetail(id, callBack) {
    var params = {
      url: 'activityproject/view',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //获取报名人信息接口 joinCollectbybase_id
  joinCollect(activity_project_id, callBack) {
    var params = {
      url: 'activityprojectenroll/listbyactivity_project_id',
      data: {
        activity_project_id: activity_project_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  joinCollectbybase_id(base_id, callBack) {
    var params = {
      url: 'activityprojectenroll/list',
      data: {
        base_id: base_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //报名签到
  doRSignIn(data,callBack){
      var params = {
          url: 'activityProjectSign/doAddEnrollSign',
          data: data,
          sCallBack: function(res) {
              callBack(res);
          }
      }
      this.request(params);
  }

  // 返回列表小区id接口
  returnList(base_id, village_id, callBack) {
    var params = {
      url: 'activityprojectenroll/list',
      data: {
        base_id: base_id,
        village_id: village_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //30天激活接口
  activationCode(callBack) {
    var params = {
      url: 'userinfo/updateactivate',
      data: {},
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }


  //被邀请人进入邀请函
  updateref_user(id, callBack) {
    var params = {
      url: 'userinfo/updateref_user_id',
      data: {
        ref_user_id: id,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //被邀请人进入邀请函获取人气推荐
  updateref_list(village_id, callBack) {
    var params = {
      url: 'activityproject/list',
      data: {
        village_id: village_id,
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //查看邀请的好友
  myref(callBack) {
    var params = {
      url: 'userinfo/myref',
      data: {

      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //获取评论接口
  reqComment(activity_project_id, callBack) {
    var params = {
      url: 'evaluateinfo/list',
      data: {
        activity_project_id: activity_project_id,
        evalute_type: 1
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //会员人数显示接口
  vipPeople(callBack) {
    var params = {
      url: 'userinfo/getdes',
      data: {},
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //显示集采的报名人数接口
  showCollect(base_id, callBack) {
    var params = {
      url: 'activityprojectenroll/countbybase_id',
      data: {
        base_id: base_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  // 修改会员资料接口
  updateVip(id, village_id, door_number, certificate_img, card_img, callBack) {
    var params = {
      url: 'useraut/doupdate',
      data: {
        id: id,
        village_id: village_id,
        door_number: door_number,
        certificate_img: certificate_img,
        card_img: card_img
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  // 去重重复报名信息接口
  deleteAgain(base_id, village_id, callBack) {
    var params = {
      url: 'activityprojectenroll/distinctlist',
      data: {
        base_id: base_id,
        village_id: village_id
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }
  //转单码接口
  orderCode(soId, callBack) {
    var params = {
      url: 'soInfoQrCode/getQrCode',
      data: {
        soId: soId
      },
      sCallBack: function(res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  // 提交验房预约
  submitCheckRoom(data, callBack) {
    var params = {
      url: 'grouponcollageorder/save',
      data: data,
      sCallBack: function(res) {
        callBack(res)
      }
    }
    this.request(params)
  }

  // 根据拼团ID查询订单信息
  getOrderInfo(collageId, callback) {
    var params = {
      url: 'grouponcollageorder/listById',
      data: {
        collageId: collageId
      },
      sCallBack: function(res) {
        callback && callback(res)
      }
    }
    this.request(params)
  }

  // 根据订单ID查询订单信息
  getOrderByOrderId(orderId, callback) {
    var params = {
      url: 'grouponcollageorder/listByOrderId',
      data: {
        orderId: orderId
      },
      sCallBack: function (res) {
        callback && callback(res)
      }
    }
    this.request(params)
  }

  // 支付定金
  payOrder(id, sessionId, callBack) {
    var params = {
      url: 'grouponcollageorder/pay',
      data: {
        orderId: id,
        sessionId: sessionId
      },
      sCallBack: function (res) {
        callBack && callBack(res.data)
      }
    }
    this.request(params)
  }

  // 查询预约状态
  queryAuditStatus(callback) {
    var params = {
      url: 'grouponcollageorder/listOrderByUserId',
      sCallBack: function (res) {
        callback && callback(res.data)
      }
    }
    this.request(params)
  }

  // 分享回写
  shareReturn(orderId, callback) {
    var params = {
      url: 'grouponcollageorder/sharewriteback',
      data: {
        orderId: orderId
      },
      sCallBack: function (res) {
        callback && callback(res)
      }
    }
    this.request(params)
  }

  //获取一级分类及商品信息
  getClassfication(data,callback){
    if(data.type === 1){
      data = {parentId: data.parentId, projectId:data.id,page:data.index,pagesize:6}
    }else if(data.type === 2){
        data = {parentId: data.parentId, projectId:data.id, productName:data.txt,page:data.index,pagesize:6}
    }
      var params = {
          url: 'category/selectByParentId',
          data: data,
          sCallBack: function (res) {
              callback && callback(res)
          }
      }
      this.request(params)
  }

  //获取项目信息
  getProjectInformation(categoryId,projectId,callback){
      var params = {
          url: 'category/selectByParentId',
          data: {
              categoryId: categoryId,
              projectId:projectId
          },
          sCallBack: function (res) {
              callback && callback(res)
          }
      }
      this.request(params)
  }

  //获取项目信息
  getProjectInfo(id,callback){
      var params = {
          url: 'projectinfo/view',
          data: {
              id: id
          },
          sCallBack: function (res) {
              callback && callback(res)
          }
      }
      this.request(params)
  }

  //提交订单(POST请求)
  submitOrder(data,callback){
      var params = {
          url: 'soitem/addOrder',
          type:'POST',
          data: {
             params:JSON.stringify(data)
          },
          sCallBack: function (res) {
              callback && callback(res)
          }
      }
      this.request(params)
  }
  //支付
  pay_data(id,callback){
      let sessionId = wx.getStorageSync('sessionId');
      let params = {
          url: 'soitem/payOrder',
          type:'POST',
          data: {
              soItemId:id,
              sessionId:sessionId
          },
          sCallBack: function (res) {
            console.log(res,"api")
              callback && callback(res)
          }
      }
      this.request(params)
  }
    //申请退定金列表
    get_data(typeId, callBack) {
        let params = {
            url: 'soitem/list',
            data: {
                payStatus:typeId,
                status:0,
                pagesize: 1000
            },
            sCallBack: function(res) {
                callBack(res.data);
            }
        }
        this.request(params);
    }

 //订单列表接口
  get_dataNewList(data, callBack) {
        let params = {
            url: 'soitem/newList',
            data: data,
            sCallBack: function(res) {
                callBack(res.data);
            }
        }
        this.request(params);
    }


    //支付状态
  getStatus(id){
      let params = {
          url: 'soinfo/checkpay',
          data: {
              id:id
          },
          sCallBack: function(res) {
              callBack(res.data);
          }
      }
      this.request(params);
  }

    //获取分类商品信息
    getCatagoryInfo(data,callBack){
        let params = {
            url: 'product/getProduct',
            data: {
                categoryId:data.cid,
                projectId: data.pid,
                productName:data.proName,
                pagesize:8,
                page:data.page
            },
            sCallBack: function(res) {
                callBack(res.data);
            }
        }
        this.request(params);
    }

    //是否签到
    isSignIn(data,callBack){
        let params = {
            url: 'activityProjectSign/doAddSign',
            data: {
                baseId:data.baseId,
                ridingId: data.ridingId,
                userId:data.uid
            },
            sCallBack: function(res) {
                callBack(res);
            }
        }
        this.request(params);
    }

  //购物车数据
  getShopCar(data,callBack){
      let params = {
          isAuth:data.url,
          url: 'shopCar/getShopCar',
          data: data,
          sCallBack: function(res) {
              callBack(res.data);
          }
      }
      this.request(params);
  }

  //修改购物车数据
    updateShopCar(data,callBack){
    console.log(data);
        let params = {
            url: 'shopCar/addShopCar',
            type:"POST",
            data: {params:JSON.stringify(data)},
            sCallBack: function(res) {
                callBack(res.data);
            }
        }
        this.request(params);
    }

    //清空购物车数据
    clearShopCar(data,callBack){
        let params = {
            url: 'shopCar/clearShopCar',
            type:"POST",
            data: data,
            sCallBack: function(res) {
                callBack(res.data);
            }
        }
        this.request(params);
    }

    //查询个人银行卡
   searchPersonBank(callBack){
       let params = {
           url: 'bankInfo/list',
           sCallBack: function(res) {
               callBack(res.data);
           }
       }
       this.request(params);
   }
    //修改个人银行卡
    updatePersonBank(data,callBack){
        let params = {
            url: 'bankInfo/doupdate',
            data: JSON.stringify(data),
            sCallBack: function(res) {
                callBack(res.data);
            }
        }
        this.request(params);
    }

    //添加个人银行卡
    addPersonBank(data,callBack){
        let params = {
            url: 'bankInfo/doadd',
            data: data,
            sCallBack: function(res) {
                callBack(res.data);
            }
        }
        this.request(params);
    }

    //取消订单
  cancelOrder(data,callBack){
    var url = '';
    var datas ={}

    if (data.securedId ==1){
      url ='soitem/cancelOrder';
      datas.soItemId = data.id
    }else{
      url = 'soitem/cancelSecuredSoItem';
      datas.id = data.id
    }
      let params = {
          type:'POST',
          url: url,
          data: datas,
          sCallBack: function(res) {
              callBack(res.data);
          }
      }
      this.request(params);
  }
//申请退款
  refundOrder(data, callBack) {
    var url = '';
    if(data.type==true){  //true 担保交易退款  false 非担保交易退款
      url ='soitem/applyRefundSecuredSoItem'
    }else{
      url = 'soitem/refundOrder'
    }
    let params = {
      type: 'POST',
      url: url,
      data: data.item,
      sCallBack: function (res) {
        callBack(res);
      }
    }
    this.request(params);
  }

  //担保——取消申请
  cancelRefundSecuredSoItem(data, callback){
    var url='';
    var data1 = {};

    if(data.type){ //非担保
      url = 'soitem/cancelRefundOrder'
      data1.soItemId = data.id
    }else{  //担保
      url ='soitem/cancelRefundSecuredSoItem'
      data1.id = data.id
    }

  let params = {
    isAuth: data.url,
    url: url,
    data: data1,
    sCallBack: function (res) {
      callback(res.data);
    }
  }
  this.request(params, true);
}

  toSubscription(data,callback){
      let params = {
          isAuth:data.url,
          url: 'projectinfo/view',
          data: data,
          sCallBack: function(res) {
              callback(res.data);
          }
      }
      this.request(params,true);
  }

  getEnrollNum(data,callback){
      let params = {
          url: 'projectEnroll/list',
          data: data,
          sCallBack: function(res) {
              callback(res.data);
          }
      }
      this.request(params,true);
  }

//填写订金单
  orderData(data,callback){
      let params = {
          url: 'soinfo/getSoInfo',
          data: data,
          sCallBack: function(res) {
              callback(res.data);
          }
      }
      this.request(params,true);
  }

  //提交订金单
  submitOrders(data,callback){
      let params = {
          url: 'soinfo/submitSoInfo',
          data: data,
          sCallBack: function(res) {
              callback(res.data);
          }
      }
      this.request(params);
  }

  //获取商品详情
  getShopDesc(data,callback){
      let params = {
          url: 'product/view',
          data: data,
          sCallBack: function(res) {
              callback(res.data);
          }
      }
      this.request(params);
  }
  //获取属性价格
  getAttrPrice(data,callback){
      let params = {
          url: 'product/getPrice',
          data: data,
          sCallBack: function(res) {
              callback(res.data);
          }
      }
      this.request(params);
  }
  //查看返现进度
  returnMoneView(data, callback) {
    let params = {
      url: 'returnApply/view',
      data: data,
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
// 更新邀请绑定关系
  updateInvite(inviteId, callback){
    let params = {
      url: 'userinfo/updateInvite',
      type: 'POST',
      data: {
        inviteId:inviteId
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
 //报名成功推荐产品
  getHotProduct(page,pagesize, callback){
  let params = {
    url: 'product/getHotProduct',
    type: 'GET',
    data: {
      page: page,
      pagesize: pagesize
    },
    sCallBack: function (res) {
      callback(res.data);
    }
  }
  this.request(params);
}

  businessInfo(shopId,callback){
    let params = {
      url: 'soinfo/businessInfo',
      type: 'POST',
      data: {
        shopId: shopId
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }

  listBySoId(data, callback) {
    let params = {
      url: 'soitem/listBySoId',
      type: 'POST',
      data: {
        soId: data
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
//验房————首页数据请求
homepage(callback){
  let params = {
    url: 'houseCheckSmallProgram/homepage',
    type: 'POST',
    data: {},
    sCallBack: function (res) {
      callback(res.data);
    }
  }
  this.request(params);
}
//多让————首页验房团列表
  groupList(data,callback) {
    let params = {
      url: 'houseCheckSmallProgram/groupList',
      type: 'POST',
      data: {
        name :data.name,
        status:data.status,
        page: data.page, 
        pagesize: data.pagesize
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  //多让————验房团详情
  groupDetail(id, callback) {
    let params = {
      url: 'houseCheckSmallProgram/groupDetail',
      type: 'POST',
      data: {
        id:id || 0
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  //多让————参团用户查询
  applyGroupUser(id, callback) {
    let params = {
      url: 'houseCheckSmallProgram/applyGroupUser',
      type: 'POST',
      data: {
        house_check_group_id: id==0 ?'' : id
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
//多让————开通验房小区
  applyGroup(data, callback) {
    let params = {
      url: 'houseCheckUser/applyGroup',
      type: 'POST',
      data: {
        village_name: data.villageName,
        handed_house_time: data.time
      },
      sCallBack: function (res) {
        callback(res);
      }
    }
    this.request(params);
  }
//多让————申请加入验房
  submitSoInfo(data, callback) {
    let params = {
      url: 'houseCheckUser/submitSoInfo',
      type: 'POST',
      data: data,
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  //多让————验房，申请列表
  queryApply(type,callback){
    let params = {
      url: 'houseCheckUser/queryApply',
      type: 'POST',
      data: {
        type: type
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
 //支付成功，分享文案，图片
  qryShareByHouseCheckGroupStatus(status, callback){
    let params = {
      url: 'houseCheckSmallProgram/qryShareByHouseCheckGroupStatus',
      type: 'POST',
      data: {
        house_check_group_status: status,
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  
//发布评论
  judgment(data, callback) {
    let params = {
      url: 'houseCheckUser/judgment',
      type: 'POST',
      data: {
        type: 0,
        house_check_user_apply_id: data.applyId,
        house_check_group_id: data.groupId,

        service_level: data.newStart, //星星数量
        service_word: data.newServe, //服务评价（标签）
        service_image_urls: data.imgs,
        service_desc: data.desc,

        level: data.newStart_1, //星星数量
        word: data.newServe_1, //服务评价（标签）
        image_urls: data.imgs_1,
        desc: data.desc_1
      },
      sCallBack: function (res) {
        callback(res);
      }
    }
    this.request(params);
  }
  
  //多让————团评论列表查询
  groupJudgment(id, callback) {
    let params = {
      url: 'houseCheckSmallProgram/groupJudgment',
      type: 'POST',
      data: {
        house_check_group_id: id
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }

  //多让———取消订单
  cancelApplyGroup(id, callback) {
    let params = {
      url: 'houseCheckUser/cancelApplyGroup',
      type: 'POST',
      data: {
        id: id
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }

//多让————查看自己的评价
 queryJudgment(id, callback) {
   console.log(id,'idididid')
  let params = {
    url: 'houseCheckUser/queryJudgment',
    type: 'POST',
    data: {
      house_check_user_apply_id:id,
    },
    sCallBack: function (res) {
      callback(res.data);
    }
  }
  this.request(params);
}
//多让————退订金
  socancel(data, callback) {
  let params = {
    url: 'houseCheckUser/socancel',
    type: 'POST',
    data: {
      id: data.id,
      so_id:data.soId
    },
    sCallBack: function (res) {
      callback(res.data);
    }
  }
  this.request(params);
}
  //根据项目返回软装类型
  selectCategoryList(callback) {
    let params = {
      url: 'rzHousePlan/selectCategoryList',
      type: 'POST',
      data: {},
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  //封窗返回所有小区  字段 hot ： 0-非热门 1-热门
  selectVillageList(hot,callback) {
    let params = {
      url: 'rzHousePlan/selectVillageList',
      type: 'POST',
      data: {
        hot: hot
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  //封窗————小区户型
  selectBuildingList(id,callback) {
    let params = {
      url: 'rzHousePlan/selectBuildingList',
      type: 'POST',
      data: {
        use_village_id:id
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  //封窗————方案
  selectHouseTypeById(id, callback) {
    let params = {
      url: 'rzHousePlan/selectHouseTypeById',
      type: 'POST',
      data: {
        house_type_id: id
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  //查询软装类型属性列表 区域的 
  selectCategoryAttrList(callback) {
    let params = {
      url: 'rzHousePlan/selectCategoryAttrList',
      type: 'POST',
      data: { },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
  //查询品牌
  selectBrandList(id,callback) {
    let params = {
      url: 'rzProduct/selectBrandList',
      type: 'POST',
      data: {
        category_id: id
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
//品牌下的产品系列
  selectProductList(id, callback) {
    let params = {
      url: 'rzProduct/selectProductList',
      type: 'POST',
      data: {
        brand_id: id
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }


  //查询用户申请记录
  // recordList(id,callback) {
  //   let params = {
  //     url: 'rzEnrollRecord/list',
  //     type: 'POST',
  //     data: {
  //       use_village_id:id
  //     },
  //     sCallBack: function (res) {
  //       callback(res.data);
  //     }
  //   }
  //   this.request(params);
  // }

 //用户新增地址，户型
  addOrUpdate(data,callback) {
    let params = {
      url: 'rzEnrollRecord/addOrUpdate',
      type: 'POST',
      dataType:'JSON',
      data: {
        params: data
      },
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
//预约量尺
  addApointRecord(data,callback){
    let params = {
      url: 'rzEnrollRecord/addApointRecord',
      type: 'POST',
      dataType: 'JSON',
      data: {
        link_name: data.link_name,
        phone: data.phone,
        project_id: data.project_id,
        village_name: data.village_name,
        building_no: data.building_no,
        appoint_time: data.appoint_time
      },
      sCallBack: function (res) {
        callback(res);
      }
    }
    this.request(params);
  }
  //查询预约量尺信息
  apointList(callback) {
  let params = {
    url: 'rzEnrollRecord/apoint',
    type: 'POST',
    dataType: 'JSON',
    data: {},
    sCallBack: function (res) {
      callback(res.data);
    }
  }
  this.request(params);
}
  //查询预约量尺信息
  myApointList(callback) {
    let params = {
      url: 'rzEnrollRecord/apointList',
      type: 'POST',
      dataType: 'JSON',
      data: {},
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }

 //查询提交小区，户型数据   
  rzEnrollRecordList(id,callback) {
    let params = {
      url: 'rzEnrollRecord/list',
      type: 'POST',
      dataType: 'JSON',
      data: {use_village_id:id},
      sCallBack: function (res) {
        callback(res.data);
      }
    }
    this.request(params);
  }
//修改预约量尺时间，状态
  updateApointRecord(datas, callback) {
    var data={
          id: datas.id,
          status: datas.status,
          appoint_time: datas.date
        }
    if (!datas.status){
      delete data.status
    }else{
      delete data.appoint_time
    }
    console.log(data,"11111")
    let params = {
      url: 'rzEnrollRecord/updateApointRecord',
      type: 'POST',
      dataType: 'JSON',
      data:data,
      sCallBack: function (res) {
        callback(res);
      }
    }
    this.request(params);
  }

  //担保交易 订单页面待支付按钮支付
  
  paySecuredSoItem(id, callback) {
    let sessionId = wx.getStorageSync('sessionId');
    let params = {
      url: 'soitem/paySecuredSoItem',
      type: 'POST',
      dataType: 'JSON',
      data: { id: id, sessionId: sessionId},
      sCallBack: function (res) {
        callback(res.data);
      }
    }
  this.request(params);
}
  
  
}

export {
  Api
};
