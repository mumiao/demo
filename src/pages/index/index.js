import Vue from 'vue';
import $ from 'jquery';
import { Style, Loading, createAPI, Dialog, TabBar, Scroll, Slide } from 'cube-ui';
import { Toast, MessageBox } from 'mint-ui';
// import NGWbridge from 'ng-bridge';
import Download from 'plugins/download';
import { post } from 'lib/request';
import { gettaskUrl, checkinUrl, getweekcheckinUrl, getrewardUrl } from 'lib/config/config.js';
import 'mint-ui/lib/style.css';
import './index.scss';

Vue.use(Dialog);
Vue.use(Loading);
Vue.use(TabBar);
Vue.use(Scroll);
Vue.use(Slide);

$(() => {
  new Vue({
    el: '#credit',
    data() {
      return {
        autoPlay: false,
        creditInfos: [],
        disabled: false,
        gifInfo: [],
        giftItem: '',
        loop: false,
        options: {
          listenScroll: true,
          probeType: 3,
          click: false,
          eventPassthrough: 'vertical'
        },
        state: 0,
        selectedLabel: '换礼品',
        showDots: false,
        signInfo: [],
        tabs: [{ label: '换礼品' }, { label: '赚积分' }],
        userToken: '',
        isClick: '',
        fundAccountID: '',
      }
    },
    created() {
      if (Download.qvendor.ios || Download.qvendor.android) {
        // const token = '-vh7w-pkUxeCbjczsu9nNOMDpbUx0b_ZHmpUDuVRXIRo7O0HDbsIA79H97dYzQv_';
        // const token = 'niaK0t5f59x8HteZmtIsfq42YrYX3M1ZmNMIrZ4yZIjqiBYhSvpyqg**';
        const token = 'ZIkaPmDGpyEMwnXP8VWpc3E8VDlEZVgoQMgHqEOxObTOJVcABwVSebOWJVbKcapB';
        // NGWbridge.utoken((token) => {
        if (token) {
          this.userToken = token;
          // 初始化页面信息
          this.initData();
        } else {
          // NGWbridge.login();
        }
        // });
      } else {
        this.userToken = '-vh7w-pkUxeCbjczsu9nNOMDpbUx0b_ZHmpUDuVRXIRo7O0HDbsIA79H97dYzQv_';
        // 初始化页面信息
        this.initData();
      }
    },
    mounted() {
      // NGWbridge.init();
      // NGWbridge.setTitle('积分任务');
    },
    computed: {
      initialIndex () {
        let index = 0;
        index = this.findIndex(this.tabs, item => item.label === this.selectedLabel)
        return index
      },
      creditText() {
        let text = '';
        if (!this.signInfo.todaySignIn) {
          this.isClick = false;
          text = `签到+${this.signInfo.todayScore}积分`;
        } else {
          this.isClick = true;
          text = '已签到';
        }
        return text;
      }
    },
    methods: {
      initData() {
        // 一周签到信息
        this.getWeekCheckIn().then((res) => {
          this.signInfo = res;
        });
        // 积分任务显示
        this.getCreditTask().then((res) => {
          console.log(res);
          this.fundAccountID = +res.fundAccountID;
          this.gifInfo = res.data;
        });
      },
      getWeekCheckIn() {
        return new Promise((resolve, reject) => {
          post(getweekcheckinUrl, {
            usertoken: this.userToken
          }).then((res) => {
            if (res && +res.code === 1) {
              resolve(res.data);
            } else {
              Toast(res.message || '获取一周签到信息失败');
              reject();
            }
          });
        });
      },
      getCreditTask() {
        return new Promise((resolve, reject) => {
          post(gettaskUrl, {
            state: this.state,
            usertoken: this.userToken
          }).then((res) => {
            if (res && +res.code === 1) {
              resolve(res);
            } else {
              Toast(res.message || '获取礼品信息失败');
              reject();
            }
          });
        });
      },
      scroll (pos) {
        const x = Math.abs(pos.x)
        const tabItemWidth = this.$refs.tabNav.$el.clientWidth
        const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
        const deltaX = x / slideScrollerWidth * tabItemWidth
        this.$refs.tabNav.setSliderTransform(deltaX);
      },
      changePage (current) {
        this.selectedLabel = this.tabs[current].label;
        this.state = current;
        this.getCreditTask().then((res) => {
          this.fundAccountID = +res.fundAccountID;
          if (this.state === 0) {
            this.gifInfo = res.data;
          } else {
            this.creditInfos = res.data;
          }
        });
      },
      findIndex(ary, fn) {
        if (ary.findIndex) {
          return ary.findIndex(fn)
        }
        let index = -1
        ary.some(function indexItem (item, i, ary) {
          const ret = fn.call(this, item, i, ary)
          if (ret) {
            index = i
            return ret
          }
        });
        return index
      },
      async creditSign() {
        const res = await post(checkinUrl, {
          usertoken: this.userToken
        });
        if (+res.code === 1) {
          // 连续签到提示信息
          if (res.data.desc) {
            Toast({
              message: res.data.desc,
              duration: 2000
            });
          }
          // 切换当天领取积分状态
          this.signInfo.weekData.forEach((element, index) => {
            if (element.week === this.signInfo.todayDesc) {
              this.signInfo.weekData[index].status = true;
            }
          });
          this.signInfo.userIntegral = res.data.userIntegral;
          this.signInfo.todaySignIn = true;
          // this.isClick = true;
        } else {
          Toast(res.message || '签到失败');
        }
      },
      toRewardCenter() {
        this.openCount('https://h5.huanyingzq.com/pages/rewardCenter/index.html');
        // if (Download.qvendor.ios) {
        //   NGWbridge.toFullScreen('https://h5.huanyingzq.com/pages/rewardCenter/index.html');
        // } else {
        //   location.href = 'https://h5.huanyingzq.com/pages/rewardCenter/index.html';
        // }
      },
      creditTip() {
        this.$createDialog({
          type: 'alert',
          showClose: true,
          title: '积分说明',
          content: '累计的积分请在积分商城及时兑换',
        }).show()
      },
      toTaskDetail(task) {
        // 任务状态引导
        if (task.isDone === '待领取') {
          // 领取礼品赚积分
          post(getrewardUrl, {
            usertoken: this.userToken,
            giftid: 0,
            taskid: task.id
          }).then((res) => {
            if (+res.code === 1) {
              MessageBox({
                title: '',
                message: '领取成功！',
                showCancelButton: false,
                confirmButtonText: '好的'
              }).then((value, action) => {
                // 更新一下总积分
                this.signInfo.userIntegral = res.data;
                // 切换一下待领取状态到完成状态显示
                task.isDone = '已完成';
              });
            }
          });
        } else if (task.isDone === '去完成') {
          // 做任务领积分
          switch (task.id) {
            case 1:
              // 完成自选
              this.$createDialog({
                type: 'confirm',
                title: task.title,
                content: `${task.desc},可获得${task.integralValue}积分`,
                confirmBtn: {
                  text: '去完成'
                },
                showClose: true,
                onConfirm: () => {
                  // 跳转行情-自选页
                  // NGWbridge.toMyStock();
                  // if (this.fundAccountID === 0) {
                  //   // 跳转开户页
                  //   this.openCount('https://h5.huanyingzq.com/newkaihu/index.html');
                  // } else {
                  //   NGWbridge.toMyStock();
                  // }
                }
              }).show();
              break;
            case 2:
              // 开通港美股账户
              this.$createDialog({
                type: 'confirm',
                title: task.title,
                content: `${task.desc},可获得${task.integralValue}积分`,
                confirmBtn: {
                  text: '去开户'
                },
                showClose: true,
                onConfirm: () => {
                  if (this.fundAccountID === 0) {
                    // 跳转开户页
                    this.openCount('https://h5.huanyingzq.com/newkaihu/index.html');
                  }
                }
              }).show();
              break;
            case 3:
              // 存入资金
              this.$createDialog({
                type: 'confirm',
                title: task.title,
                content: `${task.desc},可获得${task.integralValue}积分`,
                confirmBtn: {
                  text: '去入金'
                },
                showClose: true,
                onConfirm: () => {
                  if (this.fundAccountID === 0) {
                    // 跳转开户页
                    this.openCount('https://h5.huanyingzq.com/newkaihu/index.html');
                  } else {
                    // 跳转入金页
                    this.openGold();
                  }
                }
              }).show();
              break;
            case 4:
              // 首次港股交易
              this.$createDialog({
                type: 'confirm',
                title: task.title,
                content: `${task.desc},可获得${task.integralValue}积分`,
                confirmBtn: {
                  text: '去下单'
                },
                showClose: true,
                onConfirm: () => {
                  // 跳转交易页
                  this.tradeStocks();
                }
              }).show();
              break;
            case 5:
              // 首次美股交易
              this.$createDialog({
                type: 'confirm',
                title: task.title,
                content: `${task.desc},可获得${task.integralValue}积分`,
                confirmBtn: {
                  text: '去下单'
                },
                showClose: true,
                onConfirm: () => {
                  // 跳转交易页
                  this.tradeStocks();
                }
              }).show();
              break;
            case 6:
              // 首次港股打新
              this.$createDialog({
                type: 'confirm',
                title: task.title,
                content: `${task.desc},可获得${task.integralValue}积分`,
                confirmBtn: {
                  text: '去打新'
                },
                showClose: true,
                onConfirm: () => {
                  if (this.fundAccountID === 0) {
                    // 跳转开户
                    this.openCount('https://h5.huanyingzq.com/newkaihu/index.html');
                  } else {
                    // 跳转打新页
                    this.openCount('https://h5.huanyingzq.com/newstock/index.html');
                  }
                }
              }).show();
              break;
            case 7:
              // 每日完成交易笔数(0/3)
              this.$createDialog({
                type: 'confirm',
                title: task.title,
                content: `${task.desc},可获得${task.integralValue}积分`,
                confirmBtn: {
                  text: '去交易'
                },
                showClose: true,
                onConfirm: () => {
                  // 跳交易页
                  this.tradeStocks();
                }
              }).show();
              break;
            default:
              break;
          }
        }
      },
      toChangeCredit(giftItem) {
        this.giftItem = giftItem;
      },
      openCount(_url) {
        // let qs = '';
        // if (window.location.search.indexOf('_usertoken') > -1) {
        //   qs = window.location.search;
        // } else if (window.location.search.indexOf('?') > -1) {
        //   qs = `${window.location.search}&usertoken=${_usertoken}`;
        // } else {
        //   qs = `?usertoken=${_usertoken}`;
        // }
        // ios和android跳转区分
        if (Download.qvendor.ios) {
          // NGWbridge.toFullScreen(_url);
        } else {
          location.href = _url;
        }
      },
      openGold() {
        this.openCount('https://openaccount.huanyingzq.com/Embed/openaccount/index.html#!/charge');
        // if (Download.qvendor.ios) {
        //   NGWbridge.toFullScreen('https://openaccount.huanyingzq.com/Embed/openaccount/index.html#!/charge');
        // } else {
        //   location.href = 'https://openaccount.huanyingzq.com/Embed/openaccount/index.html#!/charge';
        // }
      },
      tradeStocks() {
        if (this.fundAccountID === 0) {
          // 引导开户
          this.openCount('https://h5.huanyingzq.com/newkaihu/index.html');
        } else {
          // 引导交易
          if (Download.qvendor.android) {
            // NGWbridge.toGMDetail(this.fundAccountID.toString());
          } else {
            // NGWbridge.toOpenForeignAccount();
          }
        }
      },
      closeLayer() {
        this.giftItem = '';
      },
      toChangeGif() {
        if (this.fundAccountID === 0 && +this.giftItem.cardType !== 1) {
          // 引导开户
          this.$createDialog({
            type: 'confirm',
            title: '去开户',
            content: '您还未开户，请开户后再来兑换免佣卡。点击确定跳转到开户页',
            confirmBtn: {
              text: '确定'
            },
            showClose: true,
            onConfirm: () => {
              // 跳开户
              this.openCount('https://h5.huanyingzq.com/newkaihu/index.html');
            }
          }).show();
        } else {
          post(getrewardUrl, {
            usertoken: this.userToken,
            taskid: 0,
            giftid: this.giftItem.id
          }).then((res) => {
            if (+res.code === 1) {
              // 更新积分
              this.signInfo.userIntegral = res.data;
              // 兑换积分
              this.$createDialog({
                type: 'confirm',
                title: '换礼品',
                content: '兑换成功！是否去奖励中心查看？',
                confirmBtn: {
                  text: '去查看'
                },
                showClose: true,
                onConfirm: () => {
                  // 跳转奖励中心
                  this.openCount('https://h5.huanyingzq.com/pages/rewardCenter/index.html');
                  // NGWbridge.toFullScreen('https://h5.huanyingzq.com/pages/rewardCenter/index.html');
                }
              }).show();
            } else {
              Toast({
                message: res.message || '兑换错误',
                duration: 2000
              });
            }
          });
        }
      }
    },
  });
});

