// import qs from 'qs';
import {
  get,
} from './request.js';
import search from './search.js';
/**
 * 统计用户开户信息
 * usertoken： 用户token,
 * statType: 3(开户中)
 * sourceid: 埋点id
 * sourcetype: 类型（1牛股王，2股票牛，3外部h5）
 * invitercode: 经纪人id
 */
export default ({
  userToken,
  statType,
}) => {
  try {
    const sourceid = search('sourceid');
    const sourcetype = search('sourcetype');
    const invitercode = search('invitercode');

    if (sourceid) {
      const params = {
        userToken,
        trackingId: sourceid,
        brokerId: invitercode || 0,
        statType,
        sourceType: sourcetype || 3,
      };
      get('https://kr.huanyingzq.com/operate/tracking/addtrackingrecord.ashx', params);
    }
  } catch (e) {
    console.log(e);
  }
};
