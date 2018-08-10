// 测试访问
// const CreditUrl = 'https://hz.huanyingzq.com/huanyingapi/';
// 正式访问
const CreditUrl = 'https://api.huanyingzq.com/';
const kaihuUrl = 'https://openaccount.huanyingzq.com/embed/api/getAuditStatus.ashx';
// 活动中心
const adsUrl = `${CreditUrl}ads/getads.ashx`;
// 奖励中心页面 显示接口
const rewardUrl = `${CreditUrl}ads/getreward.ashx`;
// 奖励中心 领取奖励/赚积分接口
const getrewardUrl = `${CreditUrl}ads/postintegralchange.ashx`;
// 奖励中心 奖励状态生效中和待领取tab切换状态接口
const getrewardstateUrl = `${CreditUrl}ads/getrewardstate.ashx`;
// 积分任务页面 显示接口
const gettaskUrl = `${CreditUrl}ads/gettask.ashx`;
// 积分任务 签到接口
const checkinUrl = `${CreditUrl}ads/checkin.ashx`;
// 积分任务 一周信息签到接口
const getweekcheckinUrl = `${CreditUrl}ads/getweekcheckin.ashx`;

export {
  kaihuUrl,
  adsUrl,
  rewardUrl,
  getrewardUrl,
  getrewardstateUrl,
  gettaskUrl,
  checkinUrl,
  getweekcheckinUrl
}

