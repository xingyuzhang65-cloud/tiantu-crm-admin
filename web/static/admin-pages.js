(function () {
  const prefix = '/tiantu-crm-admin/web';
  const originalFetch = window.fetch.bind(window);
  const referenceData = window.__TIANTU_CRM_REFERENCE__ || {};
  const jsonResponse = (data, status = 200) => Promise.resolve(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }));

  const seedLeads = [
    { id: 1, company_name: '深圳思科达电子有限公司', contact_name: '陈总', contact_mobile: '13800138001', logistics_type: 'FBA', target_market: '美国', lead_status: 1, lead_status_label: '私海跟进中', owner: '张晓明', owner_id: 1, follow_count: 5, source: '展会', country: '中国', latest_follow: { content: '已确认 Q3 发货计划，报价方案已发送。', created_by: '张晓明' } },
    { id: 2, company_name: '广州恒通服装贸易有限公司', contact_name: '李经理', contact_mobile: '13800138002', logistics_type: '空派', target_market: '欧洲', lead_status: 0, lead_status_label: '公海待认领', owner: null, owner_id: null, follow_count: 0, source: '独立站', country: '中国', latest_follow: { content: '新建线索，等待首次联系。', created_by: '系统' } },
    { id: 3, company_name: '义乌欧凯进出口有限公司', contact_name: '王芳', contact_mobile: '13800138003', logistics_type: '海派', target_market: '欧洲', lead_status: 1, lead_status_label: '私海跟进中', owner: '李强', owner_id: 2, follow_count: 4, source: '社媒', country: '中国', latest_follow: { content: '需要中欧班列与卡航组合方案。', created_by: '李强' } },
    { id: 4, company_name: '杭州锐思科技有限公司', contact_name: '赵总', contact_mobile: '13800138004', logistics_type: '海派', target_market: '日韩', lead_status: 0, lead_status_label: '公海待认领', owner: null, owner_id: null, follow_count: 0, source: '海关数据', country: '中国', latest_follow: { content: '新建线索，等待认领。', created_by: '系统' } },
    { id: 5, company_name: '东莞联达塑胶制品有限公司', contact_name: '孙经理', contact_mobile: '13800138005', logistics_type: '海派', target_market: '欧洲', lead_status: 0, lead_status_label: '公海待认领', owner: null, owner_id: null, follow_count: 0, source: '转介绍', country: '中国', latest_follow: { content: '客户关注欧洲海派时效。', created_by: '系统' } },
    { id: 6, company_name: '宁波远洋国际贸易有限公司', contact_name: '周董', contact_mobile: '13800138006', logistics_type: '海派', target_market: '美国', lead_status: 1, lead_status_label: '私海跟进中', owner: '张晓明', owner_id: 1, follow_count: 8, source: '展会', country: '中国', latest_follow: { content: '关注鹿特丹 DDP 条款与清关能力。', created_by: '张晓明' } },
    { id: 7, company_name: 'AmazonSeller-DE GmbH', contact_name: 'Michael Braun', contact_mobile: '+49-176-1234567', logistics_type: 'FBA', target_market: '欧洲', lead_status: 0, lead_status_label: '公海待认领', owner: null, owner_id: null, follow_count: 0, source: '独立站', country: '德国', latest_follow: { content: '德国站卖家线索，等待认领。', created_by: '系统' } },
    { id: 8, company_name: '同行-深圳快运通', contact_name: '黄某', contact_mobile: '13800138007', logistics_type: '一件代发', target_market: '中东', lead_status: 2, lead_status_label: '已转化', owner: '李强', owner_id: 2, follow_count: 2, source: '海关数据', country: '中国', latest_follow: { content: '同行客户，主要做中东市场，希望合作互补。', created_by: '李强' } },
  ];

  const seedCustomers = [
    { id: 1, customer_name: '深圳思科达电子有限公司', company_name: '深圳思科达电子有限公司', contact_name: '陈总', mobile: '13800138001', masked_mobile: '138****8001', hot_contact: { name: '陈总', mobile: '138****8001' }, source: '已登记', tags: ['A', '直客'], follow_status: 'CLOSED', follow_status_label: '成交', ownership_status: 'CLOSED_CUSTOMER', ownership_label: '成交客户', owner: '张晓明', owner_id: 1, latest_follow: { content: '发送Q2季度运输方案：美森主线+盐田备线，已确认', created_by: '张晓明' }, credit: { balance_due: 120000, days_aged: 18 }, latest_order: { tracking_number: 'SCD202604001UK', status: 'delivered' }, lifecycle_status: 'active', avg_monthly_volume: 45.5, avg_monthly_revenue: 285000, volume_mom: 12, monthly_order_count: 8, health_score: 92, main_category: '消费电子', shipping_frequency: '每周', usual_routes: '深圳→洛杉矶 / 英国' },
    { id: 2, customer_name: '义乌欧凯进出口有限公司', company_name: '义乌欧凯进出口有限公司', contact_name: '王芳', mobile: '13800138003', masked_mobile: '138****8003', hot_contact: { name: '王芳', mobile: '138****8003' }, source: '已登记', tags: ['A', '直客'], follow_status: 'INTERESTED', follow_status_label: '有意向', ownership_status: 'MY_CUSTOMER', ownership_label: '我的客户', owner: '李强', owner_id: 2, latest_follow: { content: '确认圣诞季备货计划，需提前预订舱位', created_by: '李强' }, credit: { balance_due: 350000, days_aged: 25 }, latest_order: { tracking_number: 'OKE202604001DE', status: 'departed' } },
    { id: 3, customer_name: '宁波远洋国际贸易有限公司', company_name: '宁波远洋国际贸易有限公司', contact_name: '周董', mobile: '13800138006', masked_mobile: '138****8006', hot_contact: { name: '周董', mobile: '138****8006' }, source: '已登记', tags: ['B', '同行'], follow_status: 'QUOTED', follow_status_label: '报价', ownership_status: 'MY_CUSTOMER', ownership_label: '我的客户', owner: '张晓明', owner_id: 1, latest_follow: { content: '鹿特丹查验延误，正在协调处理', created_by: '张晓明' }, credit: { balance_due: 280000, days_aged: 55 }, latest_order: { tracking_number: 'NBY202605001NL', status: 'customs' } },
    { id: 5, customer_name: '广州恒通服装贸易有限公司', company_name: '广州恒通服装贸易有限公司', contact_name: '李经理', mobile: '13800138002', masked_mobile: '138****8002', hot_contact: { name: '李经理', mobile: '138****8002' }, source: '已登记', tags: ['C', '直客'], follow_status: 'TEMP_HOLD', follow_status_label: '暂时搁置', ownership_status: 'MY_CUSTOMER', ownership_label: '我的客户', owner: '张晓明', owner_id: 1, latest_follow: { content: '欠款已超账期，需跟进近期无新单原因', created_by: '财务部' }, credit: { balance_due: 95000, days_aged: 72 }, latest_order: { tracking_number: 'HTF202605001NL', status: 'departed' } },
    { id: 8, customer_name: '深圳星链跨境电商有限公司', company_name: '深圳星链跨境电商有限公司', contact_name: '林小姐', mobile: '13800138008', masked_mobile: '138****8008', hot_contact: { name: '林小姐', mobile: '138****8008' }, source: '独立开发', tags: ['C', '直客'], follow_status: 'INITIAL_VISIT', follow_status_label: '初访', ownership_status: 'MY_CUSTOMER', ownership_label: '我的客户', owner: '张晓明', owner_id: 1, latest_follow: { content: '确认 TikTok Shop 美国小包试跑需求', created_by: '张晓明' }, credit: { balance_due: 0, days_aged: 0 }, latest_order: null },
    { id: 6, customer_name: '杭州锐思科技有限公司', company_name: '杭州锐思科技有限公司', contact_name: '赵总', mobile: '13800138004', masked_mobile: '138****8004', hot_contact: { name: '赵总', mobile: '138****8004' }, source: '已登记', tags: ['C', '同行'], follow_status: 'INTERESTED', follow_status_label: '有意向', ownership_status: 'MY_CUSTOMER', ownership_label: '我的客户', owner: '李强', owner_id: 2, latest_follow: { content: '客户对时效和在线轨迹追踪功能认可', created_by: '李强' }, credit: null, latest_order: null },
    { id: 4, customer_name: 'AmazonSeller-DE GmbH', company_name: 'AmazonSeller-DE GmbH', contact_name: 'Michael Braun', mobile: '+49-176-1234567', masked_mobile: '+49****4567', hot_contact: { name: 'Michael Braun', mobile: '+49****4567' }, source: '独立开发', tags: ['B', '直客'], follow_status: 'QUOTED', follow_status_label: '报价', ownership_status: 'COMPANY_POOL', ownership_label: '公司池', owner: '', owner_id: null, pool_name: '客户公海（默认）', latest_follow: { content: '讨论CE认证产品运输要求，等待客户确认报价', created_by: '李强' }, credit: { balance_due: 85000, days_aged: 10 }, latest_order: { tracking_number: 'ADE202605001DE', status: 'arrived' } },
    { id: 7, customer_name: '东莞联达塑胶制品有限公司', company_name: '东莞联达塑胶制品有限公司', contact_name: '孙经理', mobile: '13800138005', masked_mobile: '138****8005', hot_contact: { name: '孙经理', mobile: '138****8005' }, source: '已登记', tags: ['D', '直客'], follow_status: 'TEMP_HOLD', follow_status_label: '暂时搁置', ownership_status: 'COMPANY_POOL', ownership_label: '公司池', owner: '', owner_id: null, pool_name: '客户公海（默认）', latest_follow: { content: '发送归档确认邮件，保留未来合作可能', created_by: '张晓明' }, credit: null, latest_order: null },
    { id: 9, customer_name: '厦门拓海家居用品有限公司', company_name: '厦门拓海家居用品有限公司', contact_name: '高经理', mobile: '13800138009', masked_mobile: '138****8009', hot_contact: { name: '高经理', mobile: '138****8009' }, source: '独立开发', tags: ['C', '直客'], follow_status: 'INITIAL_VISIT', follow_status_label: '初访', ownership_status: 'EXPIRING_PROTECTION', ownership_label: '即将掉保', owner: '王芳', owner_id: 3, latest_follow: { content: '客户要求欧洲海派报价，需及时继续跟进', created_by: '王芳' }, credit: { balance_due: 15000, days_aged: 12 }, latest_order: null },
    { id: 10, customer_name: '佛山海迅贸易黑名单样例', company_name: '佛山海迅贸易黑名单样例', contact_name: '郑某', mobile: '13800138010', masked_mobile: '138****8010', hot_contact: { name: '郑某', mobile: '138****8010' }, source: '独立开发', tags: ['D', '同行'], follow_status: 'TEMP_HOLD', follow_status_label: '暂时搁置', ownership_status: 'COMPANY_POOL', ownership_label: '公司池', owner: '', owner_id: null, pool_name: '客户公海（默认）', latest_follow: { content: '资料缺失且货品疑似侵权，保留为黑名单样例', created_by: '风控部' }, credit: { balance_due: 0, days_aged: 0 }, latest_order: null },
  ];

  const customerMetrics = {
    1: ['active', 45.5, 285000, 12, 8, 92, '消费电子', '每周', '深圳→洛杉矶 / 英国'],
    2: ['nurturing', 120, 360000, 18, 12, 88, '小商品', '每周', '义乌→杜伊斯堡'],
    3: ['quoted', 200, 520000, -32, 16, 68, '大型设备', '每周', '宁波→鹿特丹'],
    4: ['quoted', 32, 125000, 8, 5, 82, 'Amazon FBA', '每月', '深圳→德国'],
    5: ['receding', 18, 68000, -42, 3, 55, '服装', '每月', '广州→欧洲'],
    6: ['contacted', 5, 22000, 0, 1, 76, '科技产品', '不定期', '杭州→日韩'],
    7: ['disqualified', 0, 0, 0, 0, 45, '塑胶制品', '暂停', '-'],
    8: ['new', 8, 32000, 100, 2, 80, '跨境小包', '每周', '深圳→美国'],
    9: ['contacted', 14.5, 48000, -12, 2, 70, '家居用品', '每月', '厦门→欧洲'],
    10: ['churned', 0, 0, -100, 0, 20, '贸易品', '暂停', '-'],
  };
  seedCustomers.forEach(function (customer) {
    const metric = customerMetrics[customer.id];
    if (!metric) return;
    customer.lifecycle_status = customer.lifecycle_status || metric[0];
    customer.avg_monthly_volume = customer.avg_monthly_volume ?? metric[1];
    customer.avg_monthly_revenue = customer.avg_monthly_revenue ?? metric[2];
    customer.volume_mom = customer.volume_mom ?? metric[3];
    customer.monthly_order_count = customer.monthly_order_count ?? metric[4];
    customer.health_score = customer.health_score ?? metric[5];
    customer.main_category = customer.main_category || metric[6];
    customer.shipping_frequency = customer.shipping_frequency || metric[7];
    customer.usual_routes = customer.usual_routes || metric[8];
    customer.created_at = customer.created_at || '2026-08-13 14:07';
    customer.last_followup_at = customer.last_followup_at || '2026-08-13 14:07';
    customer.protect_expire_at = customer.protect_expire_at || '2026-09-12 14:07';
    customer.closed_at = customer.closed_at || (customer.follow_status === 'CLOSED' ? '2026-08-13 14:07' : null);
  });

  const seedMoments = [
    { id: 1, user_id: 1, user: { id: 1, name: '张晓明', phone: '13800138000' }, type: 'SYSTEM_KPI', content: '5月团队战报：本周新签客户3家，运单量环比增长12%，美森线满载率92%！', media_urls: [prefix + '/static/uploads/moment_chart5.jpg', prefix + '/static/uploads/moment_team2.jpg'], visible_type: 'DEPT', visible_target: [1], created_at: '2026-08-13 12:07:24', like_count: 3, user_liked: false, comments: [] },
    { id: 2, user_id: 2, user: { id: 2, name: '陈总', phone: '13800138001' }, type: 'ACTIVITY', content: '恭喜签约！思科达电子确认Q3美森快船月度包舱，预计月出货量500方以上，感谢客户信任！', media_urls: [prefix + '/static/uploads/moment_sign8.jpg', prefix + '/static/uploads/moment_office1.jpg'], visible_type: 'ALL', visible_target: null, link_client_id: 1, link_client: { id: 1, company_name: '深圳思科达电子有限公司' }, created_at: '2026-08-13 09:07:24', like_count: 3, user_liked: true, comments: [] },
    { id: 3, user_id: 1, user: { id: 1, name: '张晓明', phone: '13800138000' }, type: 'DAILY', content: '今天拜访了富通国际，客户对新增的东南亚线很感兴趣。下周安排具体报价方案。', media_urls: [prefix + '/static/uploads/moment_office6.jpg'], visible_type: 'ALL', visible_target: null, created_at: '2026-08-13 06:07:24', like_count: 2, user_liked: false, comments: [] },
    { id: 4, user_id: 3, user: { id: 3, name: '李强', phone: '13800138002' }, type: 'ACTIVITY', content: '盐田至鹿特丹线本周成功首航！感谢运营团队的全力配合，客户反馈时效满意度提升明显。', media_urls: [prefix + '/static/uploads/moment_warehouse7.jpg', prefix + '/static/uploads/moment_cargo3.jpg'], visible_type: 'DEPT', visible_target: [2], created_at: '2026-08-12 14:07:24', like_count: 2, user_liked: true, comments: [] },
  ];

  const seedInquiries = [
    { id: 1001, inquiry_no: 'XJ20260817001', customer_name: '深圳思科达电子有限公司', contact_name: '陈总', route: '深圳 - 洛杉矶', transport_mode: '美森快船', cargo_desc: '蓝牙耳机（带电）', weight_kg: 1280, volume_cbm: 8.6, status: 'pricing', status_label: '核价中', owner: '张晓明', created_at: '2026-08-17 09:20', remark: '希望本周五前入仓' },
    { id: 1002, inquiry_no: 'XJ20260816006', customer_name: '义乌欧凯进出口有限公司', contact_name: '王芳', route: '义乌 - 杜伊斯堡', transport_mode: '中欧班列', cargo_desc: '家居百货', weight_kg: 3560, volume_cbm: 15.2, status: 'quoted', status_label: '已出价', owner: '李强', created_at: '2026-08-16 14:05', remark: '含税到门' },
    { id: 1003, inquiry_no: 'XJ20260816002', customer_name: '厦门拓海家居用品有限公司', contact_name: '高经理', route: '厦门 - 汉堡', transport_mode: '海派', cargo_desc: '折叠收纳架', weight_kg: 2200, volume_cbm: 12.4, status: 'new', status_label: '待受理', owner: '王芳', created_at: '2026-08-16 10:18', remark: '需提供普船和快船两个方案' },
  ];
  const seedQuotations = [
    { id: 2001, quotation_no: 'BJ20260816008', inquiry_id: 1002, customer_name: '义乌欧凯进出口有限公司', route: '义乌 - 杜伊斯堡', channel: '中欧班列', currency: 'CNY', amount: 28600, validity: '2026-08-23', status: 'sent', status_label: '已发送', created_at: '2026-08-16 16:40' },
    { id: 2002, quotation_no: 'BJ20260815012', inquiry_id: 998, customer_name: '深圳星链跨境电商有限公司', route: '深圳 - 洛杉矶', channel: '美国空派', currency: 'CNY', amount: 12600, validity: '2026-08-20', status: 'accepted', status_label: '客户接受', created_at: '2026-08-15 11:22' },
    { id: 2003, quotation_no: 'BJ20260814005', inquiry_id: 991, customer_name: 'AmazonSeller-DE GmbH', route: '深圳 - 汉堡', channel: '欧洲海派', currency: 'CNY', amount: 43800, validity: '2026-08-18', status: 'expired', status_label: '即将到期', created_at: '2026-08-14 13:10' },
  ];
  const seedOrders = [
    { id: 3001, tracking_number: 'SCD202608001US', customer_name: '深圳思科达电子有限公司', route_detail: '深圳 - 美森快船 - 洛杉矶', origin: '深圳仓', destination: '洛杉矶仓', cargo_desc: '消费电子', weight_kg: 5680, volume_cbm: 31.5, status: 'transit', status_label: '海运在途', progress: 62, etd: '2026-08-10', eta: '2026-08-22', latest_event: '太平洋航行中，预计 8 月 19 日抵达长滩港', subscribed: true, exception_type: null, created_at: '2026-08-09 17:20', events: [{ event_type:'transit', location:'太平洋', description:'船舶航行正常，下一节点为长滩港', time:'2026-08-17 08:30' },{ event_type:'departure', location:'盐田港', description:'船舶已离港', time:'2026-08-10 22:15' },{ event_type:'warehouse', location:'深圳仓', description:'货物完成装柜并放行', time:'2026-08-09 16:40' }] },
    { id: 3002, tracking_number: 'OKE202608003DE', customer_name: '义乌欧凯进出口有限公司', route_detail: '义乌 - 中欧班列 - 杜伊斯堡', origin: '义乌站', destination: '杜伊斯堡站', cargo_desc: '家居百货', weight_kg: 7200, volume_cbm: 28.4, status: 'rail_transit', status_label: '铁路在途', progress: 48, etd: '2026-08-08', eta: '2026-08-26', latest_event: '已出阿拉山口，班列运行正常', subscribed: false, exception_type: null, created_at: '2026-08-07 12:10', events: [{ event_type:'transit', location:'哈萨克斯坦', description:'班列境外段运行中', time:'2026-08-16 18:05' },{ event_type:'customs', location:'阿拉山口', description:'完成换装及口岸放行', time:'2026-08-13 09:30' },{ event_type:'departure', location:'义乌站', description:'班列发车', time:'2026-08-08 14:20' }] },
    { id: 3003, tracking_number: 'NBY202608002NL', customer_name: '宁波远洋国际贸易有限公司', route_detail: '宁波 - 海运 - 鹿特丹', origin: '宁波港', destination: '鹿特丹港', cargo_desc: '机械配件', weight_kg: 12600, volume_cbm: 42.8, status: 'customs', status_label: '目的港清关', progress: 82, etd: '2026-07-24', eta: '2026-08-16', latest_event: '鹿特丹海关查验，等待补充申报资料', subscribed: true, exception_type: '海关查验', exception_level: 'severe', created_at: '2026-07-23 09:35', events: [{ event_type:'exception', location:'鹿特丹港', description:'海关查验，要求补充产品用途及材质申报', time:'2026-08-16 10:25' },{ event_type:'arrival', location:'鹿特丹港', description:'船舶靠港并完成卸柜', time:'2026-08-15 21:10' },{ event_type:'departure', location:'宁波港', description:'船舶离港', time:'2026-07-24 18:40' }] },
    { id: 3004, tracking_number: 'HTF202608006FR', customer_name: '广州恒通服装贸易有限公司', route_detail: '广州 - 空运 - 巴黎', origin: '广州机场', destination: '巴黎戴高乐机场', cargo_desc: '服装', weight_kg: 860, volume_cbm: 5.1, status: 'air_transit', status_label: '空运在途', progress: 70, etd: '2026-08-15', eta: '2026-08-18', latest_event: '航班因天气延误 9 小时', subscribed: false, exception_type: '航班延误', exception_level: 'warning', created_at: '2026-08-14 15:00', events: [{ event_type:'exception', location:'迪拜机场', description:'受天气影响，中转航班预计延误 9 小时', time:'2026-08-17 06:20' },{ event_type:'departure', location:'广州机场', description:'航班已起飞', time:'2026-08-15 23:30' },{ event_type:'warehouse', location:'广州机场仓', description:'安检完成', time:'2026-08-15 17:45' }] },
    { id: 3005, tracking_number: 'ADE202608004DE', customer_name: 'AmazonSeller-DE GmbH', route_detail: '汉堡港 - 卡车 - FRA3', origin: '汉堡港', destination: 'Amazon FRA3', cargo_desc: 'FBA 商品', weight_kg: 3850, volume_cbm: 20.2, status: 'last_mile', status_label: '尾程派送中', progress: 92, etd: '2026-08-01', eta: '2026-08-18', latest_event: '卡车已提柜，预约 8 月 18 日送仓', subscribed: false, exception_type: '预约延后', exception_level: 'warning', created_at: '2026-07-31 10:10', events: [{ event_type:'delivery', location:'汉堡', description:'卡车提柜，等待 Amazon 预约时段', time:'2026-08-17 07:50' },{ event_type:'exception', location:'Amazon FRA3', description:'原预约取消，已改约至 8 月 18 日', time:'2026-08-16 15:30' },{ event_type:'customs', location:'汉堡港', description:'清关完成', time:'2026-08-15 11:20' }] },
  ];
  const seedConfig = { reclaim_no_follow_days: '7', reclaim_no_convert_days: '30', claim_daily_limit: '5', claim_private_limit: '50' };

  const clone = value => JSON.parse(JSON.stringify(value));
  function read(key, seed) {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? clone(seed) : JSON.parse(stored);
    } catch (_) { return clone(seed); }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function parseBody(init) {
    if (!init || init.body === undefined || init.body instanceof FormData) return {};
    if (typeof init.body === 'string') {
      try { return JSON.parse(init.body); } catch (_) { return {}; }
    }
    return init.body || {};
  }
  function nowText() { return new Date().toISOString().slice(0, 16); }
  function maskMobile(value) {
    const phone = String(value || '');
    return phone.length > 7 ? phone.slice(0, 3) + '****' + phone.slice(-4) : phone;
  }
  function mergeSeed(stored, seed) {
    const ids = new Set(stored.map(item => item.id));
    return stored.concat(seed.filter(item => !ids.has(item.id)).map(clone));
  }

  const baseLeads = referenceData.leads?.length ? clone(referenceData.leads) : clone(seedLeads);
  const baseCustomers = referenceData.customers?.length ? referenceData.customers.map(function (customer) {
    return { ...(seedCustomers.find(item => Number(item.id) === Number(customer.id)) || {}), ...clone(customer) };
  }) : clone(seedCustomers);
  let leads = read('tiantu_admin_leads', baseLeads);
  let customers = read('tiantu_admin_customers', baseCustomers);
  let leadFollowUps = read('tiantu_admin_lead_followups', {});
  if (localStorage.getItem('tiantu_admin_schema') !== '4') {
    const mutableLeadKeys = ['lead_status', 'lead_status_label', 'owner', 'owner_id', 'follow_count', 'last_followed', 'next_follow_at', 'latest_follow'];
    const mutableCustomerKeys = ['follow_status', 'follow_status_label', 'ownership_status', 'ownership_label', 'owner', 'owner_id', 'pool_name', 'latest_follow', 'last_followup_at', 'protect_expire_at', 'closed_at', 'lifecycle_status'];
    const previousLeads = leads;
    const previousCustomers = customers;
    leads = baseLeads.map(function (base) {
      const previous = previousLeads.find(item => Number(item.id) === Number(base.id));
      const oldSeed = seedLeads.find(item => Number(item.id) === Number(base.id));
      if (!previous || !oldSeed) return base;
      const changed = mutableLeadKeys.some(key => JSON.stringify(previous[key]) !== JSON.stringify(oldSeed[key]));
      return changed ? { ...base, ...Object.fromEntries(mutableLeadKeys.map(key => [key, previous[key]])) } : base;
    }).concat(previousLeads.filter(item => !baseLeads.some(base => Number(base.id) === Number(item.id))));
    customers = baseCustomers.map(function (base) {
      const previous = previousCustomers.find(item => Number(item.id) === Number(base.id));
      const oldSeed = seedCustomers.find(item => Number(item.id) === Number(base.id));
      if (!previous || !oldSeed) return base;
      const changed = mutableCustomerKeys.some(key => JSON.stringify(previous[key]) !== JSON.stringify(oldSeed[key]));
      return changed ? { ...base, ...Object.fromEntries(mutableCustomerKeys.map(key => [key, previous[key]])) } : base;
    }).concat(previousCustomers.filter(item => !baseCustomers.some(base => Number(base.id) === Number(item.id))));
    const referenceFollowUps = {};
    Object.entries(referenceData.lead_details || {}).forEach(function ([id, detail]) { referenceFollowUps[id] = clone(detail.follow_ups || []); });
    Object.entries(referenceFollowUps).forEach(function ([id, items]) {
      const localAdditions = (leadFollowUps[id] || []).filter(item => Number(item.id) > 1000000000);
      leadFollowUps[id] = items.concat(localAdditions.filter(local => !items.some(item => item.id === local.id)));
    });
    write('tiantu_admin_leads', leads);
    write('tiantu_admin_customers', customers);
    write('tiantu_admin_lead_followups', leadFollowUps);
    localStorage.setItem('tiantu_admin_schema', '4');
  }

  let customerActivities = read('tiantu_admin_customer_activities', {});
  let inquiries = read('tiantu_admin_inquiries', seedInquiries);
  let quotations = read('tiantu_admin_quotations', seedQuotations);
  let orders = read('tiantu_admin_orders', seedOrders);
  let systemConfig = read('tiantu_admin_config', seedConfig);
  leads.forEach(function (lead) {
    if (!leadFollowUps[lead.id]) {
      leadFollowUps[lead.id] = lead.latest_follow ? [{
        id: lead.id * 100,
        status: lead.lead_status === 0 ? '新建线索' : '跟进',
        content: lead.latest_follow.content,
        created_by: lead.latest_follow.created_by || '系统',
        created_at: lead.last_followed || '2026-08-13T14:07',
        next_follow_at: lead.next_follow_at || null,
        image_urls: '',
      }] : [];
    }
  });
  write('tiantu_admin_lead_followups', leadFollowUps);

  function saveLeads() { write('tiantu_admin_leads', leads); }
  function saveCustomers() { write('tiantu_admin_customers', customers); }
  function stageOf(customer) {
    const map = { new: 'developing', contacted: 'developing', nurturing: 'quoted', quoted: 'quoted', negotiating: 'quoted', trial: 'cooperating', active: 'cooperating', receding: 'cooperating', disqualified: 'churned', churned: 'churned' };
    return map[customer.lifecycle_status] || 'developing';
  }
  function customerCounts() {
    return {
      my: customers.filter(c => c.ownership_status === 'MY_CUSTOMER').length,
      pool: customers.filter(c => c.ownership_status === 'COMPANY_POOL').length,
      expiring: customers.filter(c => c.ownership_status === 'EXPIRING_PROTECTION').length,
      closed: customers.filter(c => c.ownership_status === 'CLOSED_CUSTOMER' || c.follow_status === 'CLOSED').length,
      all: customers.length,
    };
  }
  function customerFromLead(lead, opportunity) {
    return {
      id: Math.max(0, ...customers.map(c => Number(c.id) || 0)) + 1,
      customer_name: lead.company_name,
      company_name: lead.company_name,
      contact_name: lead.contact_name || '-',
      mobile: lead.contact_mobile || '',
      masked_mobile: maskMobile(lead.contact_mobile),
      hot_contact: { name: lead.contact_name || '-', mobile: maskMobile(lead.contact_mobile) },
      source: lead.source || '线索转化',
      tags: ['C', '新转化'],
      follow_status: opportunity ? 'INTERESTED' : 'INITIAL_VISIT',
      follow_status_label: opportunity ? '有意向' : '初访',
      ownership_status: 'MY_CUSTOMER', ownership_label: '我的客户',
      owner: lead.owner || '张晓明', owner_id: lead.owner_id || 1,
      latest_follow: { content: opportunity ? '由线索转为商机' : '由线索转为客户', created_by: '张晓明' },
      last_followup_at: nowText(), protect_expire_at: '2026-09-30 18:00', created_at: nowText(),
      credit: { balance_due: 0, days_aged: 0 }, latest_order: null,
      lifecycle_status: opportunity ? 'nurturing' : 'contacted', avg_monthly_volume: 0,
      avg_monthly_revenue: 0, volume_mom: 0, monthly_order_count: 0, health_score: 80,
      main_category: lead.product_interest || '-', shipping_frequency: '待确认', usual_routes: lead.target_market || '-',
    };
  }
  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  window.fetch = function (input, init = {}) {
    const raw = typeof input === 'string' ? input : input.url;
    const url = new URL(raw, location.href);
    const path = url.pathname.replace(prefix, '') || '/';
    const method = (init.method || 'GET').toUpperCase();
    const body = parseBody(init);

    if (path === '/api/leads/list') return jsonResponse({ ok: true, leads, total: leads.length });
    if (/^\/api\/leads\/\d+$/.test(path) && method === 'GET') {
      const id = Number(path.split('/').pop());
      const lead = leads.find(item => item.id === id);
      if (!lead) return jsonResponse({ ok: false, msg: '线索不存在' }, 404);
      const detailLead = referenceData.lead_details?.[id]?.lead || {};
      return jsonResponse({ ok: true, lead: { ...detailLead, ...lead, reclaim_countdown_hours: lead.lead_status === 1 ? (lead.reclaim_countdown_hours ?? 168) : null }, follow_ups: leadFollowUps[id] || [] });
    }
    if (path === '/api/leads/create' && method === 'POST') {
      const duplicate = leads.find(item => item.contact_mobile === body.contact_mobile || item.company_name === body.company_name);
      if (duplicate) return jsonResponse({ ok: false, duplicate: true, in_pool: duplicate.lead_status === 0 ? 'public' : 'private', existing_lead_id: duplicate.id, msg: '检测到相同公司或手机号的线索' });
      const item = { ...body, id: Date.now(), lead_status: 0, lead_status_label: '公海待认领', owner: null, owner_id: null, follow_count: 0, created_at: nowText(), latest_follow: { content: '新建线索，等待认领。', created_by: '张晓明' } };
      leads = [item, ...leads];
      leadFollowUps[item.id] = [];
      saveLeads(); write('tiantu_admin_lead_followups', leadFollowUps);
      return jsonResponse({ ok: true, msg: '线索创建成功', lead: item });
    }
    if (/^\/api\/leads\/\d+\/claim$/.test(path) && method === 'POST') {
      const id = Number(path.split('/')[3]);
      leads = leads.map(item => item.id === id ? { ...item, lead_status: 1, lead_status_label: '私海跟进中', owner: body.user_name || '张晓明', owner_id: body.user_id || 1 } : item);
      saveLeads();
      return jsonResponse({ ok: true, msg: '领取成功' });
    }
    if (path === '/api/leads/batch-to-pool' && method === 'POST') {
      let ids = Array.isArray(body.ids) ? body.ids : [];
      if (!ids.length) ids = Array.from(document.querySelectorAll('.lead-checkbox:checked')).map(node => Number(node.value));
      leads = leads.map(item => ids.includes(item.id) && item.lead_status !== 2 ? { ...item, lead_status: 0, lead_status_label: '公海待认领', owner: null, owner_id: null } : item);
      saveLeads();
      return jsonResponse({ ok: true, msg: '已将 ' + ids.length + ' 条线索放入公海' });
    }
    if (/^\/api\/leads\/\d+\/follow-up$/.test(path) && method === 'POST') {
      const id = Number(path.split('/')[3]);
      const follow = { id: Date.now(), status: body.status || '跟进', content: body.content || '', image_urls: body.image_urls || '', next_follow_at: body.next_follow_at || null, created_by: body.created_by || '张晓明', created_at: nowText() };
      leadFollowUps[id] = [follow].concat(leadFollowUps[id] || []);
      leads = leads.map(item => item.id === id ? { ...item, follow_count: (item.follow_count || 0) + 1, last_followed: nowText(), next_follow_at: follow.next_follow_at, latest_follow: { content: follow.content, created_by: follow.created_by } } : item);
      saveLeads(); write('tiantu_admin_lead_followups', leadFollowUps);
      return jsonResponse({ ok: true, msg: '跟进记录已保存' });
    }
    if (/^\/api\/leads\/\d+\/convert$/.test(path) && method === 'POST') {
      const id = Number(path.split('/')[3]);
      const lead = leads.find(item => item.id === id);
      if (!lead) return jsonResponse({ ok: false, msg: '线索不存在' }, 404);
      leads = leads.map(item => item.id === id ? { ...item, lead_status: 2, lead_status_label: '已转化' } : item);
      const opportunity = body.convert_type === 'opportunity';
      if (!customers.some(c => c.mobile === lead.contact_mobile || c.company_name === lead.company_name)) customers.unshift(customerFromLead(lead, opportunity));
      saveLeads(); saveCustomers();
      return jsonResponse({ ok: true, msg: opportunity ? '线索已转化为商机' : '线索已转化为客户' });
    }
    if (path === '/api/leads/reclaim' && method === 'POST') {
      const candidates = leads.filter(item => item.lead_status === 1 && item.reclaim_overdue);
      leads = leads.map(item => candidates.some(c => c.id === item.id) ? { ...item, lead_status: 0, lead_status_label: '公海待认领', owner: null, owner_id: null } : item);
      saveLeads();
      return jsonResponse({ ok: true, reclaimed: candidates.length, params: { N_days: 7, M_days: 30 } });
    }
    if (path === '/api/upload/follow-up-image' && method === 'POST') {
      const file = init.body instanceof FormData ? init.body.get('file') : null;
      if (!file) return jsonResponse({ ok: false, msg: '请选择图片' }, 400);
      return fileToDataUrl(file).then(dataUrl => jsonResponse({ ok: true, url: dataUrl }));
    }
    if (path === '/api/crm/customers' && method === 'GET') {
      const tab = url.searchParams.get('tab') || 'my';
      const keyword = (url.searchParams.get('keyword') || '').toLowerCase();
      const field = url.searchParams.get('keyword_field') || 'customer_name';
      const status = url.searchParams.get('follow_status') || '';
      const source = url.searchParams.get('source') || '';
      let records = customers.filter(function (item) {
        if (tab === 'my' && item.ownership_status !== 'MY_CUSTOMER') return false;
        if (tab === 'pool' && item.ownership_status !== 'COMPANY_POOL') return false;
        if (tab === 'expiring' && item.ownership_status !== 'EXPIRING_PROTECTION') return false;
        if (tab === 'closed' && item.ownership_status !== 'CLOSED_CUSTOMER' && item.follow_status !== 'CLOSED') return false;
        if (keyword && !String(item[field] || item.customer_name || '').toLowerCase().includes(keyword)) return false;
        if (status && item.follow_status !== status) return false;
        if (source && item.source !== source) return false;
        return true;
      });
      const page = Number(url.searchParams.get('page') || 1);
      const pageSize = Number(url.searchParams.get('page_size') || 20);
      const total = records.length;
      records = records.slice((page - 1) * pageSize, page * pageSize);
      return jsonResponse({ ok: true, records, total, page, page_size: pageSize, tab_counts: customerCounts(), selected_all_token: tab + ':' + total });
    }
    if (/^\/api\/crm\/customers\/batch\//.test(path) && method === 'POST') {
      const ids = Array.isArray(body.ids) ? body.ids.map(Number) : [];
      const statusLabels = { INITIAL_VISIT: '初访', INTERESTED: '有意向', QUOTED: '报价', CLOSED: '成交', TEMP_HOLD: '暂时搁置' };
      if (path.endsWith('/delete')) customers = customers.filter(item => !ids.includes(Number(item.id)));
      else customers = customers.map(function (item) {
        if (!ids.includes(Number(item.id))) return item;
        if (path.endsWith('/update-status')) return { ...item, follow_status: body.status, follow_status_label: statusLabels[body.status] || body.status, ownership_status: body.status === 'CLOSED' ? 'CLOSED_CUSTOMER' : item.ownership_status, ownership_label: body.status === 'CLOSED' ? '成交客户' : item.ownership_label, closed_at: body.status === 'CLOSED' ? nowText() : item.closed_at };
        if (path.endsWith('/claim')) return { ...item, owner: body.owner || '张晓明', owner_id: 1, ownership_status: 'MY_CUSTOMER', ownership_label: '我的客户', pool_name: '' };
        if (path.endsWith('/transfer-owner')) return { ...item, owner: body.owner || '张晓明', owner_id: 1 };
        if (path.endsWith('/return-pool')) return { ...item, owner: '', owner_id: null, ownership_status: 'COMPANY_POOL', ownership_label: '公司池', pool_name: '客户公海（默认）' };
        return item;
      });
      saveCustomers();
      return jsonResponse({ ok: true, msg: '已完成 ' + ids.length + ' 个客户的操作' });
    }
    if (/^\/api\/customers\/\d+\/trend$/.test(path) && method === 'GET') {
      const id = Number(path.split('/')[3]);
      if (referenceData.trends?.[id]) return jsonResponse(clone(referenceData.trends[id]));
      const customer = customers.find(c => Number(c.id) === id) || {};
      const average = Number(customer.avg_monthly_volume || 0);
      const weights = [0.72, 0.81, 0.9, 1.08, 0.96, 1];
      const labels = ['03月', '04月', '05月', '06月', '07月', '08月'];
      return jsonResponse({ ok: true, trend: labels.map((label, index) => ({ label, month: '2026-' + String(index + 3).padStart(2, '0'), volume: Number((average * weights[index]).toFixed(1)) })) });
    }
    if (/^\/api\/customers\/\d+\/orders$/.test(path) && method === 'GET') {
      const id = Number(path.split('/')[3]);
      if (referenceData.orders?.[id]) return jsonResponse(clone(referenceData.orders[id]));
      const customer = customers.find(c => Number(c.id) === id) || {};
      const count = Math.max(1, Number(customer.monthly_order_count || 1));
      const orders = Array.from({ length: Math.min(6, count) }, (_, index) => ({ id: id * 100 + index, tracking_number: (customer.latest_order && customer.latest_order.tracking_number) || ('TT202608' + id + String(index + 1).padStart(3, '0')), route_detail: customer.usual_routes || '-', cargo_desc: customer.main_category || '-', weight_kg: Number(((customer.avg_monthly_volume || 1) * 1000 / count).toFixed(1)), etd: '2026-08-' + String(13 - index).padStart(2, '0'), status: index === 0 ? 'transit' : 'delivered', volume_cbm: Number(((customer.avg_monthly_volume || 1) / count).toFixed(1)), revenue: Number(((customer.avg_monthly_revenue || 0) / count).toFixed(0)) }));
      return jsonResponse({ ok: true, orders });
    }
    if (/^\/api\/customer\/\d+\/transition$/.test(path) && method === 'POST') {
      const id = Number(path.split('/')[3]);
      const requested = url.searchParams.get('to_status') || url.searchParams.get('target') || url.searchParams.get('stage') || body.stage || 'contacted';
      const stageDefaults = { developing: 'contacted', quoted: 'quoted', cooperating: 'active', churned: 'churned' };
      const target = stageDefaults[requested] || requested;
      customers = customers.map(item => Number(item.id) === id ? { ...item, lifecycle_status: target } : item);
      saveCustomers();
      return jsonResponse({ ok: true, msg: '客户阶段已更新' });
    }
    if (/^\/api\/customer\/\d+\/add-activity$/.test(path) && method === 'POST') {
      const id = Number(path.split('/')[3]);
      const activity = { id: Date.now(), content: url.searchParams.get('content') || body.content || '', activity_type: url.searchParams.get('activity_type') || body.activity_type || 'follow', created_by: '张晓明', created_at: nowText(), image_urls: url.searchParams.get('image_urls') || body.image_urls || '' };
      customerActivities[id] = [activity].concat(customerActivities[id] || []);
      customers = customers.map(item => Number(item.id) === id ? { ...item, latest_follow: { content: activity.content, created_by: activity.created_by }, last_followup_at: activity.created_at } : item);
      write('tiantu_admin_customer_activities', customerActivities); saveCustomers();
      return jsonResponse({ ok: true, msg: '跟进记录已保存' });
    }
    if (path === '/api/ai/customer_insight' && method === 'GET') {
      const id = Number(url.searchParams.get('customer_id'));
      if (referenceData.ai_insights?.[id]) return jsonResponse(clone(referenceData.ai_insights[id]));
      const customer = customers.find(item => Number(item.id) === id);
      if (!customer) return jsonResponse({ ok: false, msg: '客户不存在' }, 404);
      const score = Number(customer.health_score || 70);
      const riskLevel = score < 60 ? '高' : score < 80 ? '中' : '低';
      const riskColor = score < 60 ? '#ef4444' : score < 80 ? '#f59e0b' : '#10b981';
      const insights = [
        '客户当前处于“' + (lifecycleLabels[customer.lifecycle_status] || customer.lifecycle_status) + '”阶段，健康评分为 ' + score + ' 分。',
        '近30天运单 ' + Number(customer.monthly_order_count || 0) + ' 票，货量环比 ' + Number(customer.volume_mom || 0) + '%。',
        Number(customer.credit?.balance_due || 0) > 0 ? '当前存在应收余额，建议同步关注账期与回款进度。' : '当前无逾期应收压力，可继续推进业务增量。',
      ];
      return jsonResponse({ ok: true, customer_name: customer.company_name, risk_level: riskLevel, risk_color: riskColor, risk_action: riskLevel === '高' ? '建议立即安排客户拜访，核查货量下滑和回款风险。' : riskLevel === '中' ? '建议本周完成一次有效跟进并更新下一步计划。' : '客户状态稳定，建议结合旺季计划推动增购与交叉销售。', insights, score_breakdown: { 货量表现: Math.max(0, Math.min(100, 70 + Number(customer.volume_mom || 0))), 回款表现: Number(customer.credit?.days_aged || 0) > 60 ? 45 : 85, 活跃互动: Math.min(100, 55 + Number(customer.monthly_order_count || 0) * 4) } });
    }
    if (path === '/api/reminders/list') return jsonResponse({ ok: true, reminders: [], total: 0 });
    if (path === '/api/inquiries/list' && method === 'GET') {
      const status = url.searchParams.get('status') || '';
      const keyword = (url.searchParams.get('keyword') || '').toLowerCase();
      const items = inquiries.filter(item => (!status || item.status === status) && (!keyword || [item.inquiry_no, item.customer_name, item.route, item.cargo_desc].join(' ').toLowerCase().includes(keyword)));
      return jsonResponse({ ok: true, inquiries: items, total: items.length });
    }
    if (path === '/api/inquiries/create' && method === 'POST') {
      const item = { ...body, id: Date.now(), inquiry_no: 'XJ' + new Date().toISOString().slice(0,10).replaceAll('-','') + String(inquiries.length + 1).padStart(3,'0'), status: 'new', status_label: '待受理', owner: body.owner || '张晓明', created_at: nowText().replace('T',' ') };
      inquiries = [item, ...inquiries]; write('tiantu_admin_inquiries', inquiries);
      return jsonResponse({ ok: true, inquiry: item, msg: '询价已创建' });
    }
    if (/^\/api\/inquiries\/\d+\/urge$/.test(path) && method === 'POST') {
      const id = Number(path.split('/')[3]);
      inquiries = inquiries.map(item => item.id === id ? { ...item, status: 'pricing', status_label: '核价中', urged_at: nowText() } : item);
      write('tiantu_admin_inquiries', inquiries);
      return jsonResponse({ ok: true, msg: '已通知商务和操作加急核价' });
    }
    if (path === '/api/quotations/list' && method === 'GET') return jsonResponse({ ok: true, quotations, total: quotations.length });
    if (path === '/api/orders/list' && method === 'GET') {
      const status = url.searchParams.get('status') || '';
      const keyword = (url.searchParams.get('keyword') || '').toLowerCase();
      const items = orders.filter(item => (!status || item.status === status) && (!keyword || [item.tracking_number, item.customer_name, item.route_detail, item.cargo_desc].join(' ').toLowerCase().includes(keyword)));
      return jsonResponse({ ok: true, orders: items, total: items.length });
    }
    if (path === '/api/orders/exceptions' && method === 'GET') {
      const items = orders.filter(item => item.exception_type);
      return jsonResponse({ ok: true, orders: items, total: items.length, stats: { severe: items.filter(item => item.exception_level === 'severe').length, warning: items.filter(item => item.exception_level !== 'severe').length } });
    }
    if (/^\/api\/orders\/\d+\/subscribe$/.test(path) && method === 'POST') {
      const id = Number(path.split('/')[3]);
      orders = orders.map(item => item.id === id ? { ...item, subscribed: !item.subscribed } : item);
      write('tiantu_admin_orders', orders);
      const item = orders.find(order => order.id === id);
      return jsonResponse({ ok: true, subscribed: Boolean(item?.subscribed), msg: item?.subscribed ? '已订阅节点变化提醒' : '已取消订阅' });
    }
    if (/^\/api\/tracking\/\d+$/.test(path) && method === 'GET') {
      const id = Number(path.split('/')[3]);
      const item = orders.find(order => order.id === id || order.tracking_number === path.split('/')[3]);
      return item ? jsonResponse({ ok: true, order: item, events: item.events || [] }) : jsonResponse({ ok: false, msg: '运单不存在' }, 404);
    }
    if (path === '/api/config' && method === 'GET') return jsonResponse({ ok: true, config: systemConfig });
    if (path === '/api/config' && method === 'POST') {
      systemConfig = { ...systemConfig, ...body }; write('tiantu_admin_config', systemConfig);
      return jsonResponse({ ok: true, config: systemConfig, msg: '配置已保存' });
    }
    if (path === '/api/v1/crm/moments' && method === 'GET') {
      const moments = read('tiantu_admin_moments', seedMoments);
      return jsonResponse({ ok: true, items: moments, total: moments.length, page: 1, page_size: 50, has_more: false });
    }
    if (path === '/api/v1/crm/moments' && method === 'POST') {
      const moments = read('tiantu_admin_moments', seedMoments);
      const item = { id: Date.now(), user_id: 1, user: { id: 1, name: '张晓明', phone: '13800138000' }, type: body.type || 'DAILY', content: body.content || '', media_urls: [], visible_type: body.visible_type || 'ALL', visible_target: null, created_at: new Date().toLocaleString('zh-CN'), like_count: 0, user_liked: false, comments: [] };
      write('tiantu_admin_moments', [item, ...moments]);
      return jsonResponse({ ok: true, item });
    }
    if (/^\/api\/v1\/crm\/moments\/\d+\/like$/.test(path) && method === 'POST') return jsonResponse({ ok: true, liked: true });
    if (/^\/api\/v1\/crm\/moments\/\d+\/comment$/.test(path) && method === 'POST') return jsonResponse({ ok: true, msg: '评论已保存' });
    if (path.startsWith('/api/')) return jsonResponse({ ok: false, msg: '当前静态版尚未实现该接口：' + path }, 404);
    return originalFetch(input, init);
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  function renderLeadPage() {
    const tbody = document.getElementById('leadTableBody');
    if (!tbody) return;
    const mutableKeys = ['lead_status', 'lead_status_label', 'owner', 'owner_id', 'follow_count', 'last_followed', 'next_follow_at', 'latest_follow'];
    leads.forEach(function (lead) {
      const status = Number(lead.lead_status);
      let row = tbody.querySelector('tr[data-lead-id="' + lead.id + '"]');
      const original = baseLeads.find(item => Number(item.id) === Number(lead.id));
      const changed = !original || mutableKeys.some(key => JSON.stringify(lead[key]) !== JSON.stringify(original[key]));
      if (!row) {
        row = document.createElement('tr');
        row.dataset.leadId = lead.id;
        row.dataset.pool = status;
        row.dataset.market = lead.target_market || '';
        row.dataset.logistics = lead.logistics_type || '';
        row.dataset.search = [lead.company_name, lead.contact_mobile, lead.contact_name].join(' ');
        row.innerHTML = '<td><input type="checkbox" class="lead-checkbox" value="' + lead.id + '" onchange="updateBatchBar()"></td><td><a href="javascript:void(0)" onclick="openDetailModal(' + lead.id + ')" style="font-weight:600;color:var(--primary-light);">' + esc(lead.company_name) + '</a></td><td>' + esc(lead.contact_name || '-') + '</td><td style="font-family:monospace;font-size:13px;">' + esc(lead.contact_mobile || '-') + '</td><td><span class="badge badge-blue">' + esc(lead.logistics_type || '-') + '</span></td><td>' + esc(lead.target_market || '-') + '</td><td></td><td></td><td></td><td></td>';
        tbody.prepend(row);
      }
      if (!changed) return;
      row.dataset.pool = status;
      const cells = row.children;
      cells[6].innerHTML = status === 0 ? '<span class="badge badge-gray">🌊 公海</span>' : status === 1 ? '<span class="badge badge-blue">🔒 私海</span>' : '<span class="badge badge-green">✅ 已转化</span>';
      cells[7].innerHTML = lead.owner ? esc(lead.owner) : '<span style="color:var(--text-secondary);">-</span>';
      cells[8].innerHTML = status === 1 ? '<span class="countdown-warn" style="font-family:monospace;">⏱ 剩 168h</span>' : status === 2 ? '<span style="color:var(--success);font-size:12px;">已转化</span>' : '<span style="color:var(--text-secondary);">-</span>';
      cells[9].innerHTML = (status === 0 ? '<button class="btn btn-primary btn-sm" onclick="claimLead(' + lead.id + ')">认领</button> ' : status === 1 ? '<button class="btn btn-outline btn-sm" onclick="openDetailModal(' + lead.id + ', true)">跟进</button> ' : '') + '<button class="btn btn-outline btn-sm" onclick="openDetailModal(' + lead.id + ')">详情</button>';
    });
    const values = document.querySelectorAll('.stats-grid .stat-card .value');
    const counts = [leads.length, leads.filter(item => item.lead_status === 0).length, leads.filter(item => item.lead_status === 1).length, leads.filter(item => item.lead_status === 2).length];
    values.forEach((node, index) => { if (counts[index] !== undefined) node.textContent = counts[index]; });
    if (typeof window.applyFilters === 'function') window.applyFilters();
  }

  function activityList(customer) {
    const items = customerActivities[customer.id] || [];
    if (!items.length && customer.latest_follow) return [{ content: customer.latest_follow.content, created_by: customer.latest_follow.created_by, created_at: customer.last_followup_at, activity_type: 'follow' }];
    return items;
  }
  function showCustomerQuickDetail(id) {
    const customer = customers.find(item => Number(item.id) === Number(id));
    if (!customer || typeof window.openModal !== 'function') return;
    const activities = activityList(customer);
    const activityHtml = activities.length ? activities.map(item => '<div style="padding:10px 0;border-bottom:1px solid var(--border);"><div><span class="badge badge-blue">' + esc(item.activity_type || '跟进') + '</span><span style="float:right;color:var(--text-secondary);font-size:12px;">' + esc(item.created_at || '-') + '</span></div><div style="margin-top:7px;">' + esc(item.content) + '</div><div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">记录人：' + esc(item.created_by || '张晓明') + '</div></div>').join('') : '<div class="muted" style="padding:20px;text-align:center;">暂无跟进记录</div>';
    window.openModal('<div style="max-height:72vh;overflow:auto;"><h3>' + esc(customer.company_name) + '</h3>'
      + '<div style="display:flex;gap:6px;margin:8px 0 16px;flex-wrap:wrap;">' + (customer.tags || []).map(tag => '<span class="mini-tag blue">' + esc(tag) + '</span>').join('') + '<span class="mini-tag">' + esc(customer.ownership_label) + '</span></div>'
      + '<div class="detail-grid"><div class="field"><label>联系人</label><span>' + esc(customer.contact_name || '-') + '</span></div><div class="field"><label>手机号</label><span>' + esc(customer.mobile || '-') + '</span></div><div class="field"><label>负责人</label><span>' + esc(customer.owner || '未分配') + '</span></div><div class="field"><label>跟进状态</label><span>' + esc(customer.follow_status_label || '-') + '</span></div><div class="field"><label>主营品类</label><span>' + esc(customer.main_category || '-') + '</span></div><div class="field"><label>常走路线</label><span>' + esc(customer.usual_routes || '-') + '</span></div></div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0;"><div class="panel" style="padding:12px;"><div class="muted">月均货量</div><strong>' + Number(customer.avg_monthly_volume || 0).toFixed(1) + ' 方</strong></div><div class="panel" style="padding:12px;"><div class="muted">月均营收</div><strong>¥' + Number(customer.avg_monthly_revenue || 0).toLocaleString() + '</strong></div><div class="panel" style="padding:12px;"><div class="muted">健康分</div><strong>' + esc(customer.health_score || 0) + '</strong></div></div>'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;"><h4>跟进记录</h4><button class="btn btn-primary btn-sm" onclick="openCustomerFollowForm(' + customer.id + ')">+ 添加跟进</button></div><div>' + activityHtml + '</div>'
      + '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">关闭</button></div></div>');
  }
  function showCustomerDetail(id) {
    if (Number(id) >= 1 && Number(id) <= 10) {
      location.href = prefix + '/customer/' + Number(id) + '/';
      return;
    }
    showCustomerQuickDetail(id);
  }
  function openCustomerFollowForm(id) {
    const customer = customers.find(item => Number(item.id) === Number(id));
    if (!customer) return;
    window.openModal('<h3>新增客户跟进</h3><div class="modal-field"><label>客户</label><input value="' + esc(customer.company_name) + '" readonly></div><div class="modal-field"><label>跟进类型</label><select id="staticCustomerActivityType"><option value="电话">电话</option><option value="拜访">拜访</option><option value="会议">会议</option><option value="邮件">邮件</option></select></div><div class="modal-field"><label>跟进内容</label><textarea id="staticCustomerActivityContent" rows="4" placeholder="请输入本次跟进内容"></textarea></div><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="saveCustomerFollow(' + id + ')">保存跟进</button></div>');
  }
  function saveCustomerFollow(id) {
    const content = document.getElementById('staticCustomerActivityContent').value.trim();
    if (!content) return window.showToast('请输入跟进内容', 'error');
    const type = document.getElementById('staticCustomerActivityType').value;
    const activity = { id: Date.now(), activity_type: type, content, created_by: '张晓明', created_at: nowText() };
    customerActivities[id] = [activity].concat(customerActivities[id] || []);
    customers = customers.map(item => Number(item.id) === Number(id) ? { ...item, latest_follow: { content, created_by: '张晓明' }, last_followup_at: activity.created_at } : item);
    write('tiantu_admin_customer_activities', customerActivities); saveCustomers();
    window.closeModal(); window.showToast('跟进记录已保存');
    renderOpportunityCards();
  }

  function exportCustomers() {
    const header = ['客户名称', '联系人', '手机号', '负责人', '所属状态', '跟进状态', '最近跟进'];
    const rows = customers.map(item => [item.customer_name, item.contact_name, item.mobile, item.owner || '', item.ownership_label, item.follow_status_label, item.latest_follow?.content || '']);
    const csv = '\ufeff' + [header].concat(rows).map(row => row.map(value => '"' + String(value ?? '').replace(/"/g, '""') + '"').join(',')).join('\r\n');
    const href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = href; link.download = '天图CRM客户列表.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    window.showToast('客户列表已导出');
  }
  function showManagementAction(name) {
    if (name === '营销触达') {
      window.openModal('<h3>营销触达</h3><div class="modal-field"><label>触达渠道</label><select id="marketingChannel"><option>短信</option><option>邮件</option><option>企业微信</option></select></div><div class="modal-field"><label>营销内容</label><textarea id="marketingContent" rows="4" placeholder="请输入营销内容"></textarea></div><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="saveMarketing()">创建触达任务</button></div>');
      return;
    }
    if (name === '空号检测') {
      const valid = customers.filter(item => /\d{7,}/.test(String(item.mobile || '').replace(/\D/g, ''))).length;
      window.openModal('<h3>空号检测结果</h3><div style="padding:18px 0;line-height:2;">已检测 <strong>' + customers.length + '</strong> 个号码<br><span style="color:var(--success);">格式正常：' + valid + ' 个</span><br><span style="color:var(--danger);">需人工复核：' + (customers.length - valid) + ' 个</span></div><div class="modal-actions"><button class="btn btn-primary" onclick="closeModal()">完成</button></div>');
      return;
    }
    if (name === '客户查重') {
      const duplicates = customers.filter((item, index) => customers.findIndex(other => other.mobile === item.mobile || other.company_name === item.company_name) !== index);
      window.openModal('<h3>客户查重结果</h3><div style="padding:18px 0;">' + (duplicates.length ? '发现 ' + duplicates.length + ' 条重复数据：' + duplicates.map(item => esc(item.company_name)).join('、') : '<span style="color:var(--success);">未发现重复客户</span>') + '</div><div class="modal-actions"><button class="btn btn-primary" onclick="closeModal()">完成</button></div>');
      return;
    }
    window.openModal('<h3>自定义表格</h3><div style="padding:12px 0;line-height:2;"><label><input type="checkbox" checked> 客户/公司</label><br><label><input type="checkbox" checked> 联系方式</label><br><label><input type="checkbox" checked> 负责人及状态</label><br><label><input type="checkbox" checked> 最近跟进</label></div><div class="modal-actions"><button class="btn btn-primary" onclick="closeModal();showToast(\'表格设置已保存\')">保存</button></div>');
  }
  function saveMarketing() {
    const content = document.getElementById('marketingContent').value.trim();
    if (!content) return window.showToast('请输入营销内容', 'error');
    const tasks = read('tiantu_admin_marketing_tasks', []);
    tasks.unshift({ id: Date.now(), channel: document.getElementById('marketingChannel').value, content, customer_count: customers.length, created_at: nowText() });
    write('tiantu_admin_marketing_tasks', tasks);
    window.closeModal(); window.showToast('营销触达任务已创建');
  }

  const stageLabels = { developing: '开发中', quoted: '已报价', cooperating: '合作中', churned: '已流失' };
  const lifecycleLabels = { new: '待处理', contacted: '跟进中', disqualified: '无效/关闭', nurturing: '意向客户', quoted: '已报价', negotiating: '商务谈判', trial: '试单中', active: '正式合作', receding: '减量/休眠', churned: '已流失' };
  let currentOpportunityStage = 'all';
  function opportunityStyles() {
    return '<style>.opp-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.status-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 18px}.status-tabs button{padding:7px 15px;border:1px solid var(--border);border-radius:18px;background:#fff;color:var(--text-secondary);cursor:pointer}.status-tabs button.active{background:var(--primary-light);color:#fff;border-color:var(--primary-light)}.status-tabs .warning-tab{border-color:#ef4444;color:#ef4444}.status-tabs .warning-tab.active{background:#ef4444;color:#fff}.customer-card{border-left:4px solid var(--primary-light);margin-bottom:12px}.customer-card.warning{border-left-color:#ef4444;background:#fffafa}.customer-card .panel-header{padding:14px 20px}.card-top{display:flex;justify-content:space-between;gap:12px;align-items:center}.card-name{font-weight:700;font-size:16px}.card-tags{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:6px}.opp-grid{display:grid;grid-template-columns:1.2fr 1fr 1.25fr 1fr 1fr;gap:16px}.opp-field .label{font-size:12px;color:var(--text-secondary);margin-bottom:5px}.opp-field .value{font-size:14px;font-weight:500}.status-dropdown-btn{border:1px solid #bfdbfe;background:#eff6ff;color:#2563eb;border-radius:14px;padding:5px 10px;cursor:pointer}.warning-tag{background:#fee2e2;color:#dc2626;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700}.metric-value{cursor:pointer;color:var(--primary-light)}.trend-up{color:#10b981}.trend-down{color:#ef4444}.trend-bars{height:130px;display:flex;align-items:flex-end;gap:10px;border-bottom:1px solid var(--border);padding:10px}.trend-col{flex:1;text-align:center;font-size:11px}.trend-bar{background:#3b82f6;border-radius:4px 4px 0 0;min-height:5px;margin:4px auto;width:70%}@media(max-width:980px){.opp-grid{grid-template-columns:1fr 1fr}.opp-head,.card-top{align-items:flex-start;flex-direction:column}}</style>';
  }
  function renderOpportunityCards() {
    const list = document.getElementById('opportunityCustomerList');
    if (!list) return;
    const keyword = (document.getElementById('opportunitySearch')?.value || '').toLowerCase();
    const visible = customers.filter(function (customer) {
      const warning = Number(customer.volume_mom || 0) < -20;
      if (currentOpportunityStage === 'warning' && !warning) return false;
      if (!['all', 'warning'].includes(currentOpportunityStage) && stageOf(customer) !== currentOpportunityStage) return false;
      return !keyword || [customer.company_name, customer.contact_name, customer.main_category, customer.usual_routes].join(' ').toLowerCase().includes(keyword);
    }).sort((a, b) => Number(b.avg_monthly_revenue || 0) - Number(a.avg_monthly_revenue || 0));
    list.innerHTML = visible.length ? visible.map(function (customer) {
      const warning = Number(customer.volume_mom || 0) < -20;
      const trendClass = Number(customer.volume_mom || 0) >= 0 ? 'trend-up' : 'trend-down';
      const trendArrow = Number(customer.volume_mom || 0) >= 0 ? '▲' : '▼';
      return '<div class="panel customer-card ' + (warning ? 'warning' : '') + '"><div class="panel-header" onclick="showCustomerDetail(' + customer.id + ')" style="cursor:pointer;"><div class="card-top"><div><span class="card-name">' + esc(customer.company_name) + '</span><div class="card-tags"><span class="badge badge-blue">' + esc((customer.tags || ['C'])[0]) + '级</span>' + (warning ? '<span class="warning-tag">⚠ 预警</span>' : '') + '<span class="mini-tag">' + stageLabels[stageOf(customer)] + '</span><span style="font-size:11px;color:var(--primary-light);">👤 ' + esc(customer.owner || '未分配') + '</span></div></div><div style="display:flex;gap:6px;"><button class="status-dropdown-btn" onclick="event.stopPropagation();showStatusPicker(' + customer.id + ')">' + esc(lifecycleLabels[customer.lifecycle_status] || customer.lifecycle_status) + ' ▾</button><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();showQuickFollowUp(' + customer.id + ')">+ 跟进</button></div></div></div><div class="panel-body" style="padding:12px 20px 16px;"><div class="opp-grid"><div class="opp-field"><div class="label">主营品类</div><div class="value">' + esc(customer.main_category || '-') + '</div></div><div class="opp-field"><div class="label">发货频率</div><div class="value">' + esc(customer.shipping_frequency || '-') + '</div></div><div class="opp-field"><div class="label">常走路线</div><div class="value">' + esc(customer.usual_routes || '-') + '</div></div><div class="opp-field"><div class="label">月均货量</div><div class="value metric-value" onclick="openVolumeTrend(' + customer.id + ')">' + Number(customer.avg_monthly_volume || 0).toFixed(1) + '方 <span class="' + trendClass + '">' + trendArrow + Math.abs(Number(customer.volume_mom || 0)) + '%</span></div></div><div class="opp-field"><div class="label">月均营收</div><div class="value" onclick="openOrderDrill(' + customer.id + ')" style="cursor:pointer;font-weight:700;">¥' + Number(customer.avg_monthly_revenue || 0).toLocaleString() + '</div></div></div></div></div>';
    }).join('') : '<div class="panel" style="text-align:center;padding:70px;color:var(--text-secondary);">暂无符合条件的客户数据</div>';
  }
  function renderOpportunitiesPage() {
    const main = document.querySelector('main.main');
    if (!main) return;
    const warningCount = customers.filter(customer => Number(customer.volume_mom || 0) < -20).length;
    main.innerHTML = opportunityStyles() + '<div class="workspace-switch" style="display:flex;gap:8px;align-items:center;margin-bottom:14px;"><a class="btn btn-primary btn-sm" href="' + prefix + '/customers/?view=opportunities">客户与商机</a><a class="btn btn-outline btn-sm" href="' + prefix + '/customers/?view=management">客户管理</a><a class="btn btn-outline btn-sm" href="' + prefix + '/leads/">线索公海池</a></div><div class="opp-head"><h1 style="font-size:22px;">👥 客户与商机管理 <span style="font-size:13px;color:var(--text-secondary);font-weight:400;">PRD V2.0</span></h1><input id="opportunitySearch" placeholder="搜索客户名称/联系人..." oninput="renderOpportunityCards()" style="padding:8px 14px;border:1px solid var(--border);border-radius:8px;width:220px;"></div><div class="status-tabs" id="opportunityTabs"><button class="active" onclick="setOpportunityStage(\'all\',this)">全部</button><button onclick="setOpportunityStage(\'developing\',this)">开发中</button><button onclick="setOpportunityStage(\'quoted\',this)">已报价</button><button onclick="setOpportunityStage(\'cooperating\',this)">合作中</button><button onclick="setOpportunityStage(\'churned\',this)">已流失</button><button class="warning-tab" onclick="setOpportunityStage(\'warning\',this)">⚠ 预警中 <span>' + warningCount + '</span></button></div><div id="opportunityCustomerList"></div>';
    renderOpportunityCards();
  }
  function setOpportunityStage(stage, button) {
    currentOpportunityStage = stage;
    document.querySelectorAll('#opportunityTabs button').forEach(node => node.classList.remove('active'));
    if (button) button.classList.add('active');
    renderOpportunityCards();
  }
  function showStatusPicker(id) {
    const customer = customers.find(item => Number(item.id) === Number(id));
    if (!customer) return;
    const options = [['contacted', '开发中'], ['quoted', '已报价'], ['active', '合作中'], ['churned', '已流失']];
    window.openModal('<h3>更新客户阶段</h3><div class="muted" style="margin-bottom:12px;">' + esc(customer.company_name) + '</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' + options.map(option => '<button class="btn ' + (stageOf(customer) === stageOf({ lifecycle_status: option[0] }) ? 'btn-primary' : 'btn-outline') + '" onclick="pickOpportunityStage(' + id + ',\'' + option[0] + '\')">' + option[1] + '</button>').join('') + '</div><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">取消</button></div>');
  }
  function pickOpportunityStage(id, status) {
    customers = customers.map(item => Number(item.id) === Number(id) ? { ...item, lifecycle_status: status } : item);
    saveCustomers(); window.closeModal(); window.showToast('客户阶段已更新'); renderOpportunityCards();
  }
  function showQuickFollowUp(id) { openCustomerFollowForm(id); }
  async function openVolumeTrend(id) {
    const customer = customers.find(item => Number(item.id) === Number(id));
    const result = await window.fetch('/api/customers/' + id + '/trend').then(response => response.json());
    const max = Math.max(1, ...result.trend.map(item => item.volume));
    const bars = result.trend.map(item => '<div class="trend-col"><div>' + item.volume + '</div><div class="trend-bar" style="height:' + Math.max(5, item.volume / max * 90) + 'px"></div><div>' + item.label + '</div></div>').join('');
    window.openModal('<h3>📈 ' + esc(customer.company_name) + ' - 近6个月货量走势</h3><div class="trend-bars">' + bars + '</div><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">关闭</button></div>');
  }
  async function openOrderDrill(id) {
    const customer = customers.find(item => Number(item.id) === Number(id));
    const result = await window.fetch('/api/customers/' + id + '/orders').then(response => response.json());
    const rows = result.orders.map(order => '<tr><td>' + esc(order.tracking_number) + '</td><td>' + esc(order.route) + '</td><td>' + esc(order.status) + '</td><td>' + order.volume_cbm + '方</td><td>¥' + Number(order.revenue).toLocaleString() + '</td></tr>').join('');
    window.openModal('<h3>📦 ' + esc(customer.company_name) + ' - 近期订单</h3><div class="table-wrap"><table><thead><tr><th>运单号</th><th>线路</th><th>状态</th><th>货量</th><th>营收</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">关闭</button></div>');
  }

  function hydrateCustomerDetailPage() {
    const match = location.pathname.match(/\/customer\/(\d+)\/?$/);
    if (!match) return;
    const id = Number(match[1]);
    const customer = customers.find(item => Number(item.id) === id);
    if (!customer) return;
    const stage = stageOf(customer);
    const stageClass = { developing: 'developing', quoted: 'negotiating', cooperating: 'cooperating', churned: 'archived' }[stage];
    const stageBadge = document.querySelector('.stage-badge');
    if (stageBadge) {
      stageBadge.className = 'stage-badge ' + stageClass;
      stageBadge.textContent = stageLabels[stage] || stage;
    }
    const statusPanel = Array.from(document.querySelectorAll('.panel')).find(panel => panel.querySelector('.panel-header')?.textContent.includes('客户状态'));
    const statusValue = statusPanel?.querySelector('.panel-body > div');
    if (statusValue) statusValue.textContent = lifecycleLabels[customer.lifecycle_status] || customer.lifecycle_status;

    const logPanel = Array.from(document.querySelectorAll('.panel')).find(panel => panel.querySelector('.panel-header')?.textContent.includes('跟进记录与状态变更日志'));
    const logBody = logPanel?.querySelector('.panel-body');
    const localItems = customerActivities[id] || [];
    if (logBody && localItems.length) {
      const typeMeta = { call: ['📞 电话', 'badge-blue'], meeting: ['🤝 会议', 'badge-green'], email: ['📧 邮件', 'badge-yellow'], visit: ['🏢 拜访', 'badge-gray'], status_change: ['🔄 状态流转', 'badge-purple'] };
      const html = localItems.map(function (activity) {
        const meta = typeMeta[activity.activity_type] || [activity.activity_type || '跟进', 'badge-gray'];
        let images = '';
        try {
          const urls = activity.image_urls ? JSON.parse(activity.image_urls) : [];
          images = urls.length ? '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">' + urls.map(url => '<img src="' + esc(url) + '" style="width:72px;height:72px;border-radius:6px;object-fit:cover;cursor:pointer;" onclick="previewFullImage(this.src)">').join('') + '</div>' : '';
        } catch (_) {}
        return '<div style="padding:8px 0;border-bottom:1px solid var(--border);"><div class="flex-between"><span class="badge ' + meta[1] + '">' + meta[0] + '</span><span class="text-sm">' + esc(activity.created_at || '') + '</span></div><div style="font-size:13px;margin-top:4px;">' + esc(activity.content || '') + '</div>' + images + '<div class="text-sm">操作人: ' + esc(activity.created_by || '张晓明') + '</div></div>';
      }).join('');
      logBody.insertAdjacentHTML('afterbegin', html);
    }
  }

  function hydrateOpportunityPage() {
    if (!/\/opportunities\/?$/.test(location.pathname)) return;
    document.querySelectorAll('.customer-card[data-cid]').forEach(function (card) {
      const id = Number(card.dataset.cid);
      const customer = customers.find(item => Number(item.id) === id);
      if (!customer) return;
      const previousStage = card.dataset.stage;
      const currentStage = stageOf(customer);
      card.dataset.stage = currentStage;
      const statusButton = card.querySelector('.status-dropdown-btn');
      if (statusButton) {
        statusButton.className = 'status-dropdown-btn ' + (customer.lifecycle_status || 'contacted');
        statusButton.textContent = (lifecycleLabels[customer.lifecycle_status] || customer.lifecycle_status) + ' ▾';
        statusButton.setAttribute('onclick', "event.stopPropagation();showStatusPicker(" + id + ", '" + (customer.lifecycle_status || 'contacted') + "')");
      }
      const stageTag = Array.from(card.querySelectorAll('.card-tags span')).find(node => node.textContent.trim() === (stageLabels[previousStage] || previousStage));
      if (stageTag) stageTag.textContent = stageLabels[currentStage] || currentStage;
      const ownerTag = card.querySelector('.card-tags span[title="跟进人"]');
      if (ownerTag) {
        ownerTag.textContent = customer.owner ? '👤 ' + customer.owner : '';
        ownerTag.style.display = customer.owner ? '' : 'none';
      }
    });
  }

  Object.assign(window, { showCustomerDetail, openCustomerFollowForm, saveCustomerFollow, saveMarketing, renderOpportunityCards, setOpportunityStage, showStatusPicker, pickOpportunityStage, showQuickFollowUp, openVolumeTrend, openOrderDrill });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="/"], link[href^="/"], img[src^="/"]').forEach(function (node) {
      const attr = node.hasAttribute('href') ? 'href' : 'src';
      const value = node.getAttribute(attr);
      if (value.startsWith('/static/')) node.setAttribute(attr, prefix + value);
      else if (!value.startsWith('/api/') && !value.startsWith(prefix)) node.setAttribute(attr, prefix + (value === '/' ? '/' : value));
    });
    document.querySelectorAll('[onclick]').forEach(function (node) {
      const value = node.getAttribute('onclick');
      node.setAttribute('onclick', value.replace(/location\.href='\//g, "location.href='" + prefix + '/'));
    });
    window.openCustomer = showCustomerDetail;
    window.exportList = exportCustomers;
    window.placeholderAction = showManagementAction;
    if (document.getElementById('leadTableBody')) renderLeadPage();
    hydrateCustomerDetailPage();
    hydrateOpportunityPage();
  });
})();
