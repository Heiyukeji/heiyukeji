/* ═══ 视频数据（全站唯一数据源） ═══
   视频教程页 video.html 与 1对1 页 coach.html 都读这一个文件。
   以后加视频：只在 SITE_VIDEOS 里追加一条（cid 填下面分类的 id），
   视频页的分类计数、1对1 页的「看相关视频 · 共 N 节」都会自动更新。
   —— 分类 id 对照（1对1 页用）——
   c2 跨境网络 · 节点搭建   c3 TikTok 环境 · 矩阵   c4 海外手机号 · 账号
   c5 AI 工具               c6 港卡 · 跨境支付
   c1 新手必看（1对1 页不显示） */

window.SITE_CATS = [
  { id: "c1", name: "新手必看", desc: "新建的分类，把视频拖进来。", ac: "96,165,250" },
  { id: "c2", name: "跨境网络 · 节点搭建", desc: "VPS、面板、协议、中转：自己搭一条稳定的线路。", ac: "157,124,255" },
  { id: "c3", name: "TikTok 环境 · 矩阵", desc: "原生环境、软路由一机一 IP、直播线路，到账号运营。", ac: "244,114,182" },
  { id: "c4", name: "海外手机号 · 账号", desc: "eSIM / 实体号，保号收码，注册不风控。", ac: "56,189,248" },
  { id: "c5", name: "AI 工具", desc: "注册、订阅、用起来，选适合你业务的 AI 工具。", ac: "251,166,72" },
  { id: "c6", name: "港卡 · 跨境支付", desc: "港卡开户、虚拟卡、USDT + Bybit，收款付款怎么搭。", ac: "96,165,250" },
];

window.SITE_VIDEOS = [
  { id:"fangfa2", vid:"", cid:"c2", title:"3XUI面板搭建与中转教程，魔改版一键安装，稳定安全，个人独享网络节点搭建，新手一学就会", cover_url:"assets/img/v-cover-2.jpg", duration:657, view_count:0, sort_order:3, is_free:true, badge:"新上架", highlight:true, category:"精华课程", created_at:"2026-10-12", mp4:"assets/video/video2.mp4" },
  { id:"fangfa1", vid:"", cid:"c2", title:"一键搭建节点教程，个人独享，无需面板配置，搭建即用，多协议选择，可共存", cover_url:"assets/img/v-cover-1.jpg", duration:495, view_count:0, sort_order:2, is_free:true, badge:"精品", highlight:false, category:null, created_at:"2026-10-12", mp4:"assets/video/yijiandajian.mp4" },
];
