
class Base {
  constructor() {
    //  this.baseRequestUrl = 'https://easy-mock.com/mock/5abe04cda2146a37688ec380/mock/';
        this.baseRequestUrl = 'https://app.duorang.com/';                                                                
    //  this.baseRequestUrl = 'http://api-test.duorang.com/';
    //  this.baseRequestUrl = 'http://172.16.201.216:8081/api/';
  }

  request(params, otherUrl,isExcept) {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // });
    var url = this.baseRequestUrl + params.url + '.json';
    var that = this;
    var nowparam ;
    if (!params.type) {
      params.type = 'GET'
    }
    nowparam = params.data || {};
    //不想加这两个参数的使用的时候第三个加个true
    if ( isExcept !== true ){   
      nowparam.token = wx.getStorageSync('token');
      nowparam.tokenid = wx.getStorageSync('tokenid');
    }
    wx.request({
      url: url,
      data: nowparam,
      method: params.type,
      header: {
         'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        setTimeout(() => {
          wx.hideLoading();
        }, 100); 
        if (res.data.resultCode == 1000) {
            console.log('res1000',res);
          if(otherUrl){
              params.sCallBack(res);
          }else{
              params.sCallBack(res.data);
          }
        }else if(res.data.resultCode == 1005){
            params.sCallBack(res.data);
            that.showToast('该账户异常', 'none', 2000);
        } else{
            if (res.data.error!='') {
              that.showToast(String(res.data.error), 'none', 2000);
              params.sCallBack(res.data);
             return
          }
          params.sCallBack(res.data);
        }
      },
      fail: function (err) {
        setTimeout(() => {  
         wx.hideLoading();  
        }, 1000);  
      },complete:()=>{
         setTimeout(() => {
          wx.hideLoading();
        }, 1000);
      }
    })
  }

  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }

  showToast(title, icon, duration,callBack) {
    wx.showToast({
      title: title || "",
      icon: icon || 'loading',
      duration: duration || 1000,
      success: callBack
    })
  }

  showAlert(content, confirmText) {
    wx.showModal({
      title: "",
      content: content || "",
      showCancel: false,
      confirmText: confirmText || "确定",
      confirmColor: "#E94816",
      success: function (res) {
        // console.log(res);
      }
    })
  }

  splitData(data){
      let right = [];
      let left = [];
      for(let i=0; i<data.length;i++){
          if(i%2 !== 0){
              right.push(data[i]);
          }else{
              left.push(data[i]);
          }
      }
      return {left:left,right:right,data:data}
  }

  changState(state,type){
      let txt = '';
      switch (state) {
          case -3:
              txt = '退款中';
              break;
          case -2:
              txt = '已退单';
              break;
          case -1:
              txt = '取消';
              break;
          case 0:
              txt = '待支付';
              if(type){
                  txt = '申请中';
              }
              break;
          case 1:
              txt = '待转单';
              if(type){
                  txt = '已退单';
              }
              break;
          case 2:
              txt = '已转单';
              if(type){
                  txt = '已取消';
              }
              break;
          default:{
              txt = '部分退款中';
          }
      }
      return txt;
  }

  validate(value, type) {
    if ('require' === type) {
      return !!value;
    }
    if ('phone' === type) {
      return /^1[3456789]\d{9}$/.test(value);
    }
  }

  isVisitor () {
    return wx.getStorageSync("token") ? true : false;
  }

  isLogin() {
    return wx.getStorageSync("status") ? true : false;
  }

  //折扣价格
  fixedPrice(capital,rules){
      let mix = 0,index = null;
      let discount,price;
      let amount,mrule;
      for(let i=0;i<rules.length;i++){
          if(capital>rules[i].amount){
              if(mix<rules[i].amount){
                  mix = rules[i].amount;
                  index = i;
              }
          }
      }
      if(index === null) return{price:capital,discount:0}
      amount = rules[index].amount;
      mrule = rules[index].rule;
      if(mrule.includes('%')){
          discount = (capital-amount) * parseFloat(mrule.split('%')[0]/100);
          price = capital - discount;
      }else{
          discount = parseInt(mrule);
          price = capital - discount;
      }
      return {price:price,discount:discount}
  }

  isAuth() {
    return wx.getStorageSync("status") === 1 && wx.getStorageSync("token") ? true : false;
  }

  isGoHome() {
    if (!wx.getStorageSync("status")) {
      wx.switchTab({
        url: '/pages/group/group'
      });
    }
  }

  remove(id,arr,idx){
      let temp = [];
    if(idx !== undefined){
        for(let i=0;i<arr.length;i++){
            if(i!==idx){
                temp.push(arr[i]);
            }
        }
    }else{
        let index = arr.findIndex((n)=> n.id == id);
        if(index !== -1){
            for(let i=0;i<arr.length;i++){
                if(i!==index){
                    temp.push(arr[i]);
                }
            }
        }
    }
    return temp;
  }

  //
  addItem(data,arr){
    console.log(typeof arr);
    console.log(arr);
    let temp = false;
    if(arr.length>0){
        for(let o of arr){
            if(o === data) temp = true;
        }
        if(!temp) arr.push(data)
    }else{
        arr.push(data);
    }
    return  arr;
  }

  getIndex(arr){
    let index = -1;
    for(let o = 0;o<arr.length;o++){
       if(arr[o].proFlag){
         index = o;
         break;
       }
    }
    return index;
  }

  removeData(arr){
      let temp = [];
      for(let o of arr){
          if(o.proFlag){
              temp.push(o);
          }
      }
      return temp;
  }

  reLoadData(data){
      for(let o of data){
          let t0 = [];//在线下单
          let t1 = [];//定金转单
          let t2 = [];//需求征集
          if(o.projectInfoList){
              for(let i of o.projectInfoList){
                  if(i.project_type == 1){
                      t0.push(i);
                  }else{
                      if(i.status == 3){
                          t1.push(i);
                      }else{
                          t2.push(i);
                      }
                  }
              }
          }
          o.t0  = t0;
          o.t1 = t1;
          o.t2 = t2;
      }
      return data;
  }

  getRow(len){
      let num = len%3;
      if(num !== 0){
         let temp = Math.floor(len/3);
         num = temp + 1;
      }else{
          num = len/3;
      }
      return num;
  }


  shareData(obj){
        return{
            title: obj.title?obj.title:'',
            imageUrl: obj.img?obj.img:'',
            desc:obj.desc?obj.desc:'',
            path: obj.url,
            success: function(res) {
                _base.showToast('分享成功', 'success');
            },
            fail: function(res) {
                // _base.showToast('取消分享');
            }
        }
  }
  //中转
  reChangeData(res){
      let temp = [];
      let count = 0;
      for(let o of res){
        for(let i of Object.keys(o)){
            temp.push(o[i]);
            count += o[i].productCount;
        }
      }
      temp[0].count = count;
      return temp;
  }

  rePlayData(goods,data){
    if(goods && goods.val && goods.val.length >0){
      for(let o of goods.val){
        let index = data.findIndex((val,idx)=> val.id === o.id)
        if(index !== -1){
          data[index].count = o.count
        }
      }
    }
    return data;
  }

   updateInvite(userId){
    console.log(`%c 阿文提醒您，分享者的用户ID为：${userId},由分享页面进入`, `color:#f00;font-weight:bold;`)
    wx.request({
      url: this.baseRequestUrl + 'userinfo/updateInvite.json',
      data: {
        inviteId: userId,
        token: wx.getStorageSync('token'),
        tokenid: wx.getStorageSync('tokenid')
      },
      method: 'POST',
      header: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(`%c 阿文提醒您，更新邀请绑定关系回调值：${res}`, `color:#f00;font-weight:bold;`)
      },
      fail: function (err) {
        console.log(err);
      }
    })
  }


    
 

}
export { Base };
