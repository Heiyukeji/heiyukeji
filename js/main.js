/* ═══ 黑彧导航 · 交互脚本 ═══
   职责：左右侧翼屏（常用工具 / 常用链接）、三栏面板渲染、
         卡片跟手倾斜与光斑、地图流光连线、悬浮音乐条。 */

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ── 常用工具：8 项，条目与原站一致（点击弹层看详情；doc 为外链直开）
   lg = 真实产品 logo（照原站：节点 karing / 命令 3X-UI / 检测 IPinfo / 二维码 小火箭 /
        下载 karing / 测速 Speedtest / 域名优选 Xray / 文档 黑彧站标） ── */
const TOOLS = [
  { k: "node", t: "免费节点", sub: "长期更新免费vpn", c: "255,196,92", lg: "real/v2ray.png" },
  { k: "cmd", t: "一键命令", sub: "7 个面板，粘贴就装", c: "157,124,255", lg: "real/3xui.png" },
  { k: "check", t: "环境与 IP 检测", sub: "纯净度、泄漏、路由", c: "52,211,153", lg: "tools/ipinfo.io.png" },
  { k: "qr", t: "SOCKS5 转二维码", sub: "住宅 IP 扫码进小火箭", c: "244,114,182", lg: "real/shadowrocket.png" },
  { k: "dl", t: "节点工具下载", sub: "客户端、SSH 工具", c: "91,140,255", lg: "real/karing.png" },
  { k: "speed", t: "测速工具", sub: "延迟、带宽、节点质量", c: "56,189,248", lg: "tools/speedtest.net.png" },
  { k: "rd", t: "域名优选", sub: "Reality 目标域名测速", c: "167,139,250", lg: "real/xray.png" },
  { k: "doc", t: "代理技术文档", sub: "协议原理与搭建手册", c: "148,163,184", u: "https://xtls.github.io/", lg: "real/xray.png" },
];

/* ── 站长社群（顶栏「站长社群」弹层；以下为示例数据，部署前换成你自己的入口） ── */
const SQ = {
  tg: "https://t.me/hykftgbot",      // Telegram 客服机器人
  qq: "928533857",                      // QQ 客服
  qq2: "319070682",                     // QQ 客服（备用）
  web: "https://tawk.to/hykf",          // 24 小时网页客服
};
/* ── 弹层内容数据（照原站 tools.js / nav-data.js 原样搬运） ── */
const FREENODE = {
  url: "https://example.com/free-nodes.txt",  // 示例订阅地址：部署前换成你自己的
  openUrl: "",
  openLabel: "在浏览器直接打开",
};

const CMDS = [
  { name: "3X-UI 面板（原版稳定）", badge: "Xray · Panel", desc: "Xray 可视化管理面板，支持多种协议",
    github: "https://github.com/MHSanaei/3x-ui",
    cmd: "bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh) v3.7.0" },
  { name: "3X-UI 面板（魔改版）", badge: "Xray · Panel", desc: "Xray 可视化管理面板，支持多种协议",
    github: "https://github.com/Heiyukeji/3x-ui",
    cmd: "XUI_AUTO=1 bash <(curl -Ls https://raw.githubusercontent.com/Heiyukeji/3x-ui/main/install.sh)" },
  { name: "一键搭建面板", badge: "Aurora · Panel", desc: "多协议共存，一键搭建，无需配置，可中转，可指纹浏览器",
    cmd: "bash <(curl -fsSL https://www.geto.im/oneclick/install.sh)" },
  { name: "TMS 面板", badge: "Xray · Panel", desc: "流量转发管理面板，多机集中监控与调度",
    github: "https://github.com/Heiyukeji/Tms",
    cmd: "curl -L https://raw.githubusercontent.com/Heiyukeji/Tms/main/panel_install.sh -o panel_install.sh && chmod +x panel_install.sh && ./panel_install.sh)" },
  { name: "S-UI 面板", badge: "Sing-box · Panel", desc: "Sing-box 可视化管理面板，支持多协议节点",
    github: "https://github.com/Heiyukeji/s-ui",
    cmd: "SUI_AUTO=1 bash <(curl -Ls https://raw.githubusercontent.com/Heiyukeji/s-ui/main/install.sh)" },
  { name: "Sing-box", badge: "sing-box · Proxy", desc: "新一代通用代理平台，支持多种入站/出站",
    cmd: "bash <(wget -qO- https://raw.githubusercontent.com/fscarmen/sing-box/main/sing-box.sh)" },
  { name: "极光面板", badge: "Aurora · Panel", desc: "Aurora Admin Panel，多节点可视化管理面板",
    cmd: "bash <(curl -fsSL https://raw.githubusercontent.com/Aurora-Admin-Panel/deploy/main/install.sh)" },
];

const CHECK_SECS = [
  { title: "IP 信息查询", items: [
    { name: "ipip.la", url: "https://ipip.la/", desc: "IP 归属地、运营商、ASN 详细信息" },
    { name: "IP2Location", url: "https://www.ip2location.com/", desc: "IP 地理位置精准查询" } ] },
  { title: "安全 / 风险评估", items: [
    { name: "IPQualityScore", url: "https://www.ipqualityscore.com/user/search", desc: "IP 欺诈风险、代理/VPN 检测评分" },
    { name: "Scamalytics", url: "https://scamalytics.com/ip/", desc: "欺诈值评分，适合判断 IP 纯净度" },
    { name: "Whoer", url: "https://whoer.net/zh", desc: "匿名度综合评估" },
    { name: "DNS 泄漏检测", url: "https://ipleak.net/", desc: "检查 DNS / WebRTC 是否泄漏真实 IP" },
    { name: "Yalala", url: "https://www.yalala.com/", desc: "检测代理连通性与延迟，判断节点是否可用" },
    { name: "DNS Leak Test", url: "https://dnsleaktest.com/", desc: "检测 DNS 是否泄漏，确认代理是否真正生效" } ] },
  { title: "网络诊断", items: [
    { name: "Ping.pe", url: "https://ping.pe/", desc: "全球多节点 Ping，判断 IP 是否被墙" },
    { name: "路由追踪", url: "https://tools.ipip.net/traceroute.php", desc: "追踪数据包路径，分析网络延迟" } ] },
  { title: "情报 & 资产搜索", items: [
    { name: "FOFA", url: "https://fofa.info", desc: "网络空间资产搜索引擎" },
    { name: "Shodan 国家搜索", url: "https://www.shodan.io/search/facet?facet=isp&query=http.html%3Aassets%2Fqs%2Fqs.min.js+country%3A", desc: "按国家查询 ISP / 在线资产，URL 末尾填入国家代码（如 CN / US）" },
    { name: "国家代码查询", url: "https://zh.wikipedia.org/wiki/ISO_3166-1", desc: "ISO 3166-1 对照表，配合 Shodan 使用" } ] },
];

const DL_ITEMS = [
  { name: "karing", url: "https://karing.app", desc: "安卓 / ios / Windows / Mac 客户端,官方发布页" },
  { name: "工具合集", url: "https://huarun.win", desc: "大师整理的，里面包括所有节点工具下载方式" },
  { name: "Finalshell SSH 工具", url: "https://www.hostbuf.com/", desc: "SSH 连接与服务器管理工具" },
];

const SPEED_INTRO = "检测你的网络延迟与带宽，判断节点质量。";
const SPEED_ITEMS = [
  { name: "Speedtest.net", url: "https://www.speedtest.net/", desc: "Ookla 全球测速，支持选择测速节点" },
  { name: "Fast.com", url: "https://fast.com/", desc: "Netflix 出品，专测下载速度，简洁直观" },
  { name: "Cloudflare Speed Test", url: "https://speed.cloudflare.com/", desc: "测试延迟、抖动、上下行，数据详细" },
];

const RD = {
  tags: ["TLS 1.3", "H2 / H3", "CDN friendly"],
  batches: [
    ["d.oracleinfinity.io","aws.amazon.com","d0.m.awsstatic.com","r.bing.com","c.marsflag.com","d1.awsstatic.com","www.bing.com","www.aws.com"],
    ["apps.mzstatic.com","www.xbox.com","developer.apple.com","s0.awsstatic.com","icloud.com","itunes.apple.com","www.microsoft.com","cdn.apple-cloudkit.com"],
    ["gateway.icloud.com","www.apple.com","swdist.apple.com","swcdn.apple.com","updates.cdn-apple.com","mensura.cdn-apple.com","osxapps.itunes.apple.com","aod.itunes.apple.com"],
    ["www.cloudflare.com","ajax.googleapis.com","www.gstatic.com","dl.google.com","storage.googleapis.com","maps.gstatic.com","www.google.com","fonts.gstatic.com"],
    ["cdn.jsdelivr.net","cdnjs.cloudflare.com","unpkg.com","raw.githubusercontent.com","objects.githubusercontent.com","codeload.github.com","github.githubassets.com","avatars.githubusercontent.com"],
    ["s3.amazonaws.com","s3-us-west-2.amazonaws.com","cloudfront.net","d1.awsstatic.com","d7uri8nf7uskq.cloudfront.net","d2908q01vomqb2.cloudfront.net","d3ko8w4ej5s9kd.cloudfront.net","d16r8lzcronp14.cloudfront.net"],
    ["update.googleapis.com","lh3.googleusercontent.com","yt3.ggpht.com","i.ytimg.com","www.youtube.com","googlevideo.com","ytimg.com","play.google.com"],
    ["login.microsoftonline.com","outlook.office365.com","graph.microsoft.com","teams.microsoft.com","onedrive.live.com","sharepoint.com","azure.microsoft.com","aka.ms"],
  ],
  tpl: "for d in {D}; do t1=$(date +%s%N)\n  xray x25519 -i $d 2>/dev/null\n  t2=$(date +%s%N)\n  echo \"$d $((($t2-$t1)/1000000))ms\"\ndone | sort -t' ' -k2 -n | head -3",
};

/* 常用链接：三组，条目与原站一致（[名称, 色相, 链接]）；ICONS = 原站 icon/ 目录下的真实站点图标 */
const ICONS = {
  "Gemini": "gemini.svg", "ChatGPT": "chatgpt.svg", "Claude": "claude.svg", "Grok": "grok.svg",
  "Heygen 数字人": "heygen.svg", "Google AI Studio": "aistudio.svg", "Meta AI": "meta.svg", "Perplexity": "perplexity.svg",
  "YouTube": "youtube-color-svgrepo-com.svg", "TikTok": "tiktok.svg", "Instagram": "instagram-1-svgrepo-com.svg",
  "X (Twitter)": "twitter-color-svgrepo-com.svg", "Threads": "threads.svg", "Facebook": "facebook-svgrepo-com.svg",
  "Discord": "discord.svg", "Snapchat": "snapchat-svgrepo-com.svg", "Reddit": "reddit-svgrepo-com.svg",
  "Pinterest": "pinterest-color-svgrepo-com.svg",
  "Netflix": "netflix-1-logo-svgrepo-com.svg", "Disney+": "desney.svg", "Prime Video": "primevideo.svg",
  "HBO Max": "icons8-hbo.svg", "Spotify": "icons8-spotify.svg", "Twitch": "twitch-svgrepo-com.svg",
};
const LINKS = [
  { g: "常用 AI 工具", items: [
    ["Gemini", 210, "https://www.google.com/gemini"], ["ChatGPT", 160, "https://chat.openai.com/"],
    ["Claude", 25, "https://claude.ai/"], ["Grok", 0, "https://grok.com/"],
    ["Heygen 数字人", 330, "https://www.heygen.com/"], ["Google AI Studio", 205, "https://aistudio.google.com/"],
    ["Meta AI", 215, "https://www.meta.ai/"], ["Perplexity", 220, "https://www.perplexity.ai/"]] },
  { g: "社交媒体", items: [
    ["YouTube", 0, "https://www.youtube.com/"], ["TikTok", 180, "https://www.tiktok.com/"],
    ["Instagram", 300, "https://www.instagram.com/"], ["X (Twitter)", 0, "https://twitter.com/"],
    ["Threads", 0, "https://www.threads.net/"], ["Facebook", 220, "https://www.facebook.com/"],
    ["Discord", 235, "https://discord.com/"], ["Snapchat", 50, "https://www.snapchat.com/"],
    ["Reddit", 15, "https://www.reddit.com/"], ["Pinterest", 350, "https://www.pinterest.com/"]] },
  { g: "流媒体大全", items: [
    ["Netflix", 0, "https://www.netflix.com/"], ["Disney+", 230, "https://www.disneyplus.com/"],
    ["Prime Video", 210, "https://www.primevideo.com/"], ["HBO Max", 280, "https://www.max.com/"],
    ["Spotify", 140, "https://www.spotify.com/"], ["Twitch", 265, "https://www.twitch.tv/"]] },
];

/* 站长推荐（lg = 真实产品 logo；dk = 深色底 logo） */
const PICKS = [
  { t: "开源面板下载", d: "多台服务器统一管理，图形化操作，装好就能用。", tag: "站长自研", c: "157,124,255", lg: "real/tms-app.png" },
  { t: "AI 助手注册", d: "个人助理，能写能画；新用户注册即送体验额度。", tag: "送体验额度", c: "244,114,182", lg: "links/meta.svg" },
  { t: "视频复刻工具", d: "上传素材自动拆解分镜，一键生成同款短视频。", tag: "免费体验", c: "56,189,248", lg: "real/jinggan.svg", dk: 1 },
  { t: "效率工具聚合", d: "常用小工具打包成一个启动器，付费版可商用。", tag: "付费 · 可商用", c: "255,196,92", lg: "real/usb.svg", dk: 1 },
];

const NEWS = [
  { t: "云服务器选购指南", ago: "6 天前", free: 1, c: "56,189,248" },
  { t: "AI 绘画从零入门", ago: "8 天前", free: 1, c: "157,124,255" },
  { t: "个人博客搭建全流程", ago: "2026/9/2", free: 1, c: "52,211,153" },
  { t: "笔记软件横评", ago: "2026/7/1", free: 0, c: "251,166,72" },
  { t: "短视频剪辑速成", ago: "2026/6/22", free: 1, c: "244,114,182" },
];

/* ── 三栏（无对应元素的页面自动跳过） ── */
const pickList = $("#pickList");
if (pickList) pickList.innerHTML = PICKS.map(p => `
  <a class="row pk" href="#picks" style="--c:${p.c}">
    <span class="pk-ic real${p.dk ? " dk" : ""}"><img src="assets/img/${p.lg}" alt="" loading="lazy"></span>
    <span class="nm"><b>${esc(p.t)}</b><i>${esc(p.d)}</i></span>
    <span class="pk-tag">${esc(p.tag)}</span>
  </a>`).join("");

const newsList = $("#newsList");
if (newsList) newsList.innerHTML = NEWS.map(v => `
  <a class="row" href="#">
    <span class="nw-th" style="--c:${v.c}"></span>
    <span class="nm"><b>${esc(v.t)}</b><i>${esc(v.ago)} · ${v.free ? "免费" : "会员"}</i></span>
  </a>`).join("");


/* ── 首屏卡片：跟手倾斜 + 光斑（无 #stack 的页面自动跳过） ── */
const stack = $("#stack");
const TILT = matchMedia("(prefers-reduced-motion: reduce)").matches ? 2.5 : 6;
if (stack) {
  stack.querySelectorAll(".hcard").forEach((el, i) => el.style.setProperty("--i", i));
  stack.addEventListener("pointermove", e => {
    const k = e.target.closest(".hcard"); if (!k || e.pointerType !== "mouse") return;
    const r = k.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    k.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    k.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    k.style.transform =
      `translateY(-3px) rotateX(${((.5 - y) * TILT).toFixed(2)}deg) rotateY(${((x - .5) * TILT).toFixed(2)}deg)`;
  });
  stack.addEventListener("pointerout", e => {
    const k = e.target.closest(".hcard");
    if (k && !k.contains(e.relatedTarget)) k.style.transform = "";
  });
}

/* ── 首屏星空：canvas 闪烁星点（照原站，滚出视口/切后台自动停帧） ── */
(() => {
  const hero = $(".stage-sec"); if (!hero) return;
  const host = document.createElement("div");
  host.style.cssText = "position:absolute;inset:0;z-index:0;pointer-events:none";
  hero.prepend(host);
  const cv = document.createElement("canvas");
  cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.append(cv);
  const ctx = cv.getContext("2d"), TAU = Math.PI * 2;
  const N = 240, st = Array.from({ length: N }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() ** 3 * 1.6 + .3,
    p: Math.random() * TAU, s: .4 + Math.random() * 1.4 }));
  const SPEED = matchMedia("(prefers-reduced-motion: reduce)").matches ? .35 : 1;
  let W = 1, H = 1, raf = 0, vis = true, last = performance.now(), t = 0;
  const fit = () => {
    const r = hero.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  const go = () => { if (!raf && vis && !document.hidden) raf = requestAnimationFrame(tick); };
  function tick(now) {
    raf = 0;
    const dt = Math.min(Math.max((now - last) / 1000, 0), .05) * SPEED;
    last = Math.max(last, now); t += dt;
    ctx.clearRect(0, 0, W, H);
    for (const s of st) {
      ctx.globalAlpha = .25 + .55 * (.5 + .5 * Math.sin(t * s.s + s.p));
      ctx.fillStyle = s.r > 1.2 ? "#dfe6ff" : "#9fb0e6";
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1; go();
  }
  fit(); addEventListener("resize", fit);
  new IntersectionObserver(es => { vis = es[0].isIntersecting; last = performance.now(); go(); }).observe(host);
  document.addEventListener("visibilitychange", () => { last = performance.now(); go(); });
  go();
})();

/* ── 右侧舞台：轨道地球（照原站 A 版）
   三条倾斜轨道分前后两半：上半段用 mask 挖掉球体所在圆（绕到球背后），
   下半段压在球前面并发光；实线轨道上各跑一颗彗星（头 + 4 节尾巴）；
   轨道上钉死三枚地区标签：欧洲 / 北美 / 亚太。 ── */
(() => {
  const anim = $("#anim"); if (!anim) return;
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  const SPEED = matchMedia("(prefers-reduced-motion: reduce)").matches ? .35 : 1;
  const BODY_R = 33;  // 主体半径（.body inset 17% → 33%）
  const ORBITS = [{ rx: 47, ry: 15, rot: -16 }, { rx: 44, ry: 24, rot: 28 }, { rx: 40, ry: 8, rot: -4, dash: 1 }];
  const TAGS = [{ text: "欧洲", o: 0, th: 208 }, { text: "北美", o: 0, th: 330, dx: 3 }, { text: "亚太", o: 1, th: 52 }];
  const orbitPt = (o, th) => {
    const lx = o.rx * Math.cos(th), ly = o.ry * Math.sin(th), r = o.rot * D2R;
    return { x: 50 + lx * Math.cos(r) - ly * Math.sin(r), y: 50 + lx * Math.sin(r) + ly * Math.cos(r), back: ly < 0 };
  };
  const sys = document.createElement("div"); sys.className = "sys";
  sys.innerHTML = `
    <div class="body"><div class="globe3d"></div><div class="globe-sh"></div><div class="globe-rim"></div></div>
    <svg class="orb" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <mask id="gmk" maskUnits="userSpaceOnUse"><rect x="-50" y="-50" width="200" height="200" fill="#fff"/>
          <circle cx="50" cy="50" r="${BODY_R + .3}" fill="#000"/></mask>
        <linearGradient id="gog" x1="0" x2="1">
          <stop offset="0" stop-color="#7b5cff" stop-opacity=".15"/><stop offset=".5" stop-color="#9d8bff"/>
          <stop offset="1" stop-color="#5b8cff" stop-opacity=".2"/></linearGradient>
        <filter id="ggl" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation=".6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      ${ORBITS.map(o => {
        const up = `M${50 - o.rx} 50 A${o.rx} ${o.ry} 0 0 1 ${50 + o.rx} 50`;
        const dn = `M${50 + o.rx} 50 A${o.rx} ${o.ry} 0 0 1 ${50 - o.rx} 50`;
        const dash = o.dash ? 'stroke-dasharray=".6 1"' : "";
        return `<g transform="rotate(${o.rot} 50 50)">
          <path d="${up}" fill="none" stroke="url(#gog)" stroke-width="${o.dash ? .18 : .32}" ${dash} opacity=".55" mask="url(#gmk)"/>
          <path d="${dn}" fill="none" stroke="url(#gog)" stroke-width="${o.dash ? .2 : .42}" ${dash} filter="url(#ggl)"/>
        </g>`; }).join("")}
      <g id="gcm"></g>
    </svg>`;
  anim.append(sys);
  const cm = sys.querySelector("#gcm");
  /* 每条实线轨道一颗彗星：白头 + 渐淡的紫色尾巴 */
  const comets = ORBITS.filter(o => !o.dash).map((o, i) => {
    const dots = [0, 1, 2, 3, 4].map(k => {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("r", k ? (.55 - k * .09).toFixed(2) : ".9");
      c.setAttribute("fill", k ? "#b9b0ff" : "#fff");
      if (!k) c.setAttribute("filter", "url(#ggl)");
      cm.appendChild(c); return c;
    });
    return { o, dots, sp: (i % 2 ? -1 : 1) * (.42 + i * .07), ph: i * 2.1 };
  });
  TAGS.forEach(g => {
    const p = orbitPt(ORBITS[g.o], g.th * D2R);
    const n = document.createElement("span"); n.className = "gnode";
    n.style.left = p.x + "%"; n.style.top = p.y + "%"; sys.append(n);
    const tg = document.createElement("span"); tg.className = "gtag"; tg.textContent = g.text;
    tg.style.left = (p.x + (g.dx || 0)) + "%"; tg.style.top = (p.y + (g.dy ?? -7.5)) + "%"; sys.append(tg);
  });
  /* 可见才跑的动画循环 */
  let raf = 0, vis = true, last = performance.now(), t = 0;
  const go = () => { if (!raf && vis && !document.hidden) raf = requestAnimationFrame(tick); };
  function tick(now) {
    raf = 0;
    const dt = Math.min(Math.max((now - last) / 1000, 0), .05) * SPEED;
    last = Math.max(last, now); t += dt;
    for (const c of comets) {
      const base = c.ph + t * c.sp;
      c.dots.forEach((d, k) => {
        const p = orbitPt(c.o, base - Math.sign(c.sp) * k * .045);
        const inBody = Math.hypot(p.x - 50, p.y - 50) < BODY_R;
        d.setAttribute("cx", p.x); d.setAttribute("cy", p.y);
        d.setAttribute("opacity", p.back && inBody ? 0 : (p.back ? .45 : 1) * (1 - k * .19));
      });
    }
    go();
  }
  new IntersectionObserver(es => { vis = es[0].isIntersecting; last = performance.now(); go(); }).observe(anim);
  document.addEventListener("visibilitychange", () => { last = performance.now(); go(); });
  go();
})();

/* ── 地图浮标 + 流光连线 ── */
const PINS = [
  ["AI 工具", 2, 6], ["云服务", 54, 2], ["学习平台", 20, 44],
  ["效率软件", 62, 40], ["设计素材", 8, 78], ["社区", 52, 76],
];
const mapPins = $("#mapPins");
if (mapPins) mapPins.insertAdjacentHTML("beforeend", PINS.map(([t, l, tp], i) =>
  `<span class="map-pin" style="left:${l}%;top:${tp}%"><em style="--d:${(i * .42).toFixed(2)}s"></em>${esc(t)}</span>`).join(""));

(() => {
  const cv = $("#arcs"), host = $("#mapPins");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  const slow = matchMedia("(prefers-reduced-motion: reduce)").matches ? .3 : 1;
  let W = 0, H = 0, paths = [], raf = 0, last = performance.now();

  function layout() {
    W = host.clientWidth; H = host.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pt = PINS.map(([, l, t]) => [l / 100 * W + 50, t / 100 * H + 14]);
    const pairs = [[0, 2], [2, 3], [3, 1], [4, 2], [5, 3], [0, 4]];
    paths = pairs.map(([a, b], i) => {
      const [x1, y1] = pt[a], [x2, y2] = pt[b];
      return { x1, y1, x2, y2,
        cx: (x1 + x2) / 2, cy: (y1 + y2) / 2 - Math.abs(x2 - x1) * .28 - 24,
        t: i / pairs.length, sp: .0022 + (i % 3) * .0006 };
    });
  }
  const at = (p, t) => {
    const u = 1 - t;
    return [u * u * p.x1 + 2 * u * t * p.cx + t * t * p.x2,
            u * u * p.y1 + 2 * u * t * p.cy + t * t * p.y2];
  };
  function frame(now) {
    const dt = Math.min(now - last, 60); last = now;
    ctx.clearRect(0, 0, W, H);
    for (const p of paths) {
      ctx.strokeStyle = "rgba(110,180,255,.16)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(p.x1, p.y1);
      ctx.quadraticCurveTo(p.cx, p.cy, p.x2, p.y2); ctx.stroke();
      p.t += p.sp * dt * slow; if (p.t > 1) p.t = 0;
      for (let k = 0; k < 7; k++) {
        const t = p.t - k * .018; if (t < 0) continue;
        const [x, y] = at(p, t);
        ctx.fillStyle = `rgba(150,215,255,${(1 - k / 7) * .9})`;
        ctx.beginPath(); ctx.arc(x, y, 2.4 - k * .22, 0, 7); ctx.fill();
      }
      const [hx, hy] = at(p, p.t);
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 11);
      g.addColorStop(0, "rgba(180,230,255,.75)"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, 11, 0, 7); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  layout(); raf = requestAnimationFrame(frame);
  addEventListener("resize", () => {
    cancelAnimationFrame(raf); layout(); last = performance.now();
    raf = requestAnimationFrame(frame);
  });
  /* 滚出视口就停 */
  new IntersectionObserver(es => es.forEach(e => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) { last = performance.now(); raf = requestAnimationFrame(frame); }
  })).observe(host);
})();

/* ── 杂项 ── */
const toTop = $("#toTop");
if (toTop) toTop.addEventListener("click", e => {
  e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" });
});
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── 左右隐藏导航（侧翼屏）：左=常用工具，右=常用链接 ──
   工具与链接只在两侧展示，条目均为真实站点，可换成你自己的。 */
(() => {
  if (!document.body) return;                 // 全页面注入（含视频页等）
  document.body.classList.add("has-wings");
  const total = LINKS.reduce((n, g) => n + g.items.length, 0);
  const left = document.createElement("aside");
  left.className = "wing wing-l";
  left.setAttribute("aria-label", "常用工具");
  left.innerHTML = `
    <span class="wing-tab" aria-hidden="true">常用工具</span>
    <div class="wing-h"><i></i><b>常用工具</b><small>${TOOLS.length} 个</small></div>
    <div class="wing-list">${TOOLS.map(t => {
      const inner = `<span class="wing-ic real"><img src="assets/img/${t.lg}" alt="" loading="lazy"></span>
        <span><b>${esc(t.t)}</b><small>${esc(t.sub)}</small></span>`;
      return t.u
        ? `<a class="wing-it" style="--c:${t.c}" href="${t.u}" target="_blank" rel="noopener" title="${esc(t.t)}：${esc(t.sub)}">${inner}</a>`
        : `<button type="button" class="wing-it" style="--c:${t.c}" data-k="${t.k}" title="${esc(t.t)}：${esc(t.sub)}">${inner}</button>`;
    }).join("")}
    </div>
    <p class="wing-note">条目与原站一致：点击打开详情弹层，文档为外链直达。</p>`;
  const right = document.createElement("aside");
  right.className = "wing wing-r";
  right.setAttribute("aria-label", "常用链接");
  right.innerHTML = `
    <span class="wing-tab" aria-hidden="true">常用链接</span>
    <div class="wing-h"><i></i><b>常用链接</b><small>${total} 个</small></div>
    ${LINKS.map(g => `
      <div class="wing-grp">
        <div class="wing-gt">${esc(g.g)}<small>${g.items.length}</small></div>
        <div class="wing-tiles">${g.items.map(([n, h, u]) => `
          <a class="wing-lg" style="--h:${h}" href="${u}" target="_blank" rel="noopener" title="${esc(n)}">
            <img src="assets/img/icon/${ICONS[n] || ""}" alt="" loading="lazy"></a>`).join("")}
        </div>
      </div>`).join("")}
    <p class="wing-note">收录的都是常用站点，可按需增删。</p>`;
  document.body.append(left, right);

  /* ── 移动端：底部两个入口 + 抽屉（照原站 w-dock 方案）：手机上侧翼收起，
     底部悬浮「常用工具 / 常用链接」胶囊，点按钮滑出对应抽屉，点遮罩或 Esc 收起。 ── */
  const dock = document.createElement("div");
  dock.className = "w-dock";
  dock.innerHTML = `
    <button type="button" data-d="l">常用工具</button>
    <button type="button" data-d="r">常用链接</button>`;
  const mask = document.createElement("div");
  mask.className = "w-mask";
  const dl = document.createElement("aside");
  dl.className = "w-drawer l";
  dl.setAttribute("aria-label", "常用工具");
  dl.innerHTML = left.innerHTML.replace('class="wing-tab" aria-hidden="true"', 'class="wing-tab" aria-hidden="true" style="display:none"');
  const dr = document.createElement("aside");
  dr.className = "w-drawer r";
  dr.setAttribute("aria-label", "常用链接");
  dr.innerHTML = right.innerHTML.replace('class="wing-tab" aria-hidden="true"', 'class="wing-tab" aria-hidden="true" style="display:none"');
  const closeDrawers = () => [mask, dl, dr].forEach(x => x.classList.remove("on"));
  dock.addEventListener("click", e => {
    const b = e.target.closest("[data-d]");
    if (!b) return;
    closeDrawers();
    mask.classList.add("on");
    (b.dataset.d === "l" ? dl : dr).classList.add("on");
  });
  mask.addEventListener("click", closeDrawers);
  addEventListener("keydown", e => { if (e.key === "Escape") closeDrawers(); });
  /* 抽屉里点了工具/链接就收起抽屉（工具弹层的委托在 document 上，不受影响） */
  [dl, dr].forEach(d => d.addEventListener("click", e => {
    if (e.target.closest("button[data-k], a")) closeDrawers();
  }));
  document.body.append(dock, mask, dl, dr);
})();

/* ── 工具弹层（照原站 tools.js：外壳 .sheet + tl- 内容布局，条目数据一致） ── */
(() => {
  if (!document.body) return;                 // 全页面可用（含视频页等）
  let sheet, bd, body, cur;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let rdBatches = shuffle(RD.batches), rdIdx = 0;
  const rdCmd = ds => RD.tpl.replace("{D}", ds.join(" "));

  const toast = m => {
    let t = document.querySelector(".tl-toast");
    if (!t) { t = document.createElement("div"); t.className = "tl-toast"; document.body.append(t); }
    t.textContent = m; t.classList.add("on");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 1600);
  };
  const copy = async (t, what) => {
    const fb = () => { const a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select(); document.execCommand("copy"); a.remove(); };
    try { await navigator.clipboard.writeText(t); } catch (e) { fb(); }
    toast(`${what || "内容"}已复制`);
  };
  const hd = (t, sub) => `<div class="tl-hd"><h3>${esc(t)}</h3>${sub ? `<span>${esc(sub)}</span>` : ""}</div>`;
  /* 站点条目 logo：assets/img/tools/<主域名>.png（照原站，取自 Google 图标服务 / 站点 apple-touch-icon）；
     只有 16px 的按原尺寸显示不放大；完全没图标的站（Ping.pe、FinalShell）用分组色线条图标 */
  const HAS = ["cloudflare.com", "dnsleaktest.com", "fast.com", "fofa.info", "github.com", "ip2location.com", "ipinfo.io", "ipip.net", "ipleak.net", "ipqualityscore.com", "scamalytics.com", "shodan.io", "speedtest.net", "whoer.net", "wikipedia.org", "yalala.com"];
  const LO = ["ipleak.net", "dnsleaktest.com", "fofa.info"];
  const GLYPH = { "ping.pe": '<path d="M3 12h4l2-6 4 12 2-6h6"/>', "hostbuf.com": '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9l3 3-3 3M12.5 15H17"/>' };
  const host = u => { try { const h = new URL(u).hostname.split("."); return h.slice(-2).join("."); } catch (e) { return ""; } };
  const plate = u => { const h = host(u);
    return HAS.includes(h) ? `<span class="tl-pl"><img src="assets/img/tools/${h}.png" alt=""${LO.includes(h) ? ' class="lo"' : ""} loading="lazy"></span>`
      : `<span class="tl-pl gl"><svg viewBox="0 0 24 24" aria-hidden="true">${GLYPH[h] || '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>'}</svg></span>`; };
  const lk = i => `<a class="tl-lk" href="${esc(i.url)}" target="_blank" rel="noopener">${plate(i.url)}<span class="tx2"><b>${esc(i.name)}</b><span>${esc(i.desc || "")}</span></span><em aria-hidden="true">↗</em></a>`;
  /* 分组：颜色和图标按组名（照原站正则表）；两项以内的小组并排，多的占整行 */
  const SEC = [[/IP 信息/, "91,140,255", '<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'],
    [/安全|风险/, "52,211,153", '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'],
    [/网络诊断/, "56,189,248", '<path d="M3 12h4l2-6 4 12 2-6h6"/>'],
    [/情报|资产/, "244,114,182", '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>']];
  const secs = list => { const half = list.filter(s => s.items.length <= 2), full = list.filter(s => s.items.length > 2);
    return `<div class="tl-secs">${[...half, ...full].map(s => { const m = SEC.find(x => x[0].test(s.title)) || [0, "157,124,255", '<circle cx="12" cy="12" r="8"/>'];
      return `<section class="tl-sec${s.items.length > 2 ? " full" : ""}" style="--c:${m[1]}"><div class="tl-sh"><i><svg viewBox="0 0 24 24" aria-hidden="true">${m[2]}</svg></i><b>${esc(s.title)}</b><small>${s.items.length} 个</small></div>
        <div class="tl-lks">${s.items.map(lk).join("")}</div></section>`; }).join("")}</div>`; };
  const big = (items, c, act) => `<div class="tl-big">${(items || []).map(i => `<a class="tl-bg" href="${esc(i.url)}" target="_blank" rel="noopener" style="--c:${c}">${plate(i.url)}<b>${esc(i.name)}</b><span>${esc(i.desc || "")}</span><em>${esc(act)} ↗</em></a>`).join("")}</div>`;
  const nLinks = CHECK_SECS.reduce((n, s) => n + s.items.length, 0);

  /* 各弹层内容：模板照原站 TABS 逐条对应（数据取自本文件顶部 const） */
  function content(k) {
        if (k === "node") return hd("免费网络", "安卓 / iOS") + `
      <div class="tl-grid" style="grid-template-columns:1fr 1fr;gap:16px">
        <div style="padding:20px;border-radius:14px;background:rgba(13,19,48,.7);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05)">
          <div style="font-size:28px;margin-bottom:8px">📱</div>
          <h4 style="margin:0 0 8px;font-size:15px;color:#e4e9ff">安卓系统</h4>
          <p style="margin:0;font-size:13.5px;line-height:1.85;color:#c9d1ee">1：下载迅雷<br>2：打开搜索：黑彧wj251995<br>3：每个文件夹都有加速，长期更新</p>
        </div>
        <div style="padding:20px;border-radius:14px;background:rgba(13,19,48,.7);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05)">
          <div style="font-size:28px;margin-bottom:8px">🍎</div>
          <h4 style="margin:0 0 8px;font-size:15px;color:#e4e9ff">iOS系统</h4>
          <p style="margin:0;font-size:13.5px;line-height:1.85;color:#c9d1ee">需要海外ID下载，本站有免费ID链接<br>1：火种VPN<br>2：1.1.1.1<br>3：快喵<br>4：nthlink</p>
        </div>
      </div>`;
    if (k === "cmd") return hd("一键安装命令", `${CMDS.length} 个面板脚本`) + `
      <p class="tl-lead">连上 VPS 后粘贴运行就能装好面板。还不会连 VPS？先装 <button type="button" class="tl-b" style="height:26px;padding:0 10px" data-go="dl">FinalShell</button></p>
      <div class="tl-grid">${CMDS.map((c, i) => `<div class="tl-cmd"><h4>${esc(c.name)}${c.badge ? `<small>${esc(c.badge)}</small>` : ""}</h4><p>${c.variant ? `<em class="vr">${esc(c.variant)}</em><br>` : ""}${esc(c.desc)}${c.note ? `<br><span style="font-size:12px;color:#7f8ab0">${esc(c.note)}</span>` : ""}</p>
        <div class="tl-code">${esc(c.cmd)}</div>
        <div class="tl-row"><button class="tl-b main" data-copy-i="${i}">复制命令</button>${c.github ? `<a class="tl-b" href="${esc(c.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}</div></div>`).join("")}</div>`;
    if (k === "check") return hd("环境与 IP 检测", `${nLinks} 个检测站`) + `
      <p class="tl-lead">新买的 IP、新搭的节点，先在这里测一遍：归属地对不对、干不干净、DNS 有没有漏。</p>` + secs(CHECK_SECS);
    if (k === "qr") return hd("SOCKS5 转二维码", "只在你的浏览器里转换") + `
      <p class="tl-lead">住宅 IP 买来是「host:port:用户名:密码」这种格式，粘进来就转成小火箭能扫的二维码，不会发给任何人。</p>
      <div class="tl-qr"><div><input id="tlSocks" placeholder="host:port:username:password" autocomplete="off"><div class="url" id="tlSocksUrl"></div></div>
        <div class="out" id="tlQR">粘贴后这里出二维码</div></div>
      <ol class="tl-steps"><li><b>复制 IP 信息</b>从买住宅 IP 的后台复制「host:port:用户名:密码」整行。</li><li><b>粘到上面</b>自动转成 socks5:// 链接和二维码。</li><li><b>小火箭扫码</b>打开小火箭的扫码，对准右边的二维码，扫完就添加好了。</li></ol>`;
    if (k === "dl") return hd("软件下载", "Windows / Mac / 安卓 /ios") + `
      <p class="tl-lead">代理客户端、节点管理面板客户端，还有连 VPS 用的 SSH 工具。</p>` +
      big(DL_ITEMS, "91,140,255", "去下载") + `
      <ol class="tl-steps"><li><b>安装客户端</b>电脑装 karing，安卓装 karing，苹果用karing / 小火箭。</li><li><b>搭一条自己的线路</b>会一点命令行的去 <button type="button" data-go="cmd">一键命令</button>，粘贴就装好面板。</li><li><b>连上 VPS</b>FinalShell 填 IP 和密码就能登录服务器。</li></ol>`;
    if (k === "speed") return hd("测速工具") + `
      <p class="tl-lead">${esc(SPEED_INTRO)}开着代理测，测出来的就是节点本身的速度。</p>` +
      big(SPEED_ITEMS, "56,189,248", "开始测速") + `
      <ol class="tl-steps"><li><b>先关代理测一次</b>记下本地宽带的速度。</li><li><b>再开代理测一次</b>同一个测速站，看节点跑出来多少。</li><li><b>对比两次</b>差得太多或延迟很高，就换个节点或换线路。</li></ol>`;
    if (k === "rd") return hd("Reality 目标域名优选", `${rdBatches.length} 批域名`) + `
      <p class="tl-lead">搭 Reality 节点要挑一个「目标域名」。在 VPS 上跑下面这段，会测出这一批里延迟最低的 3 个，挑一个填进面板。</p>
      ${RD.tags ? `<div class="tl-tags">${RD.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
      <div class="tl-code" id="tlRd" style="max-height:none">${esc(rdCmd(rdBatches[rdIdx] || []))}</div>
      <div class="tl-row"><button class="tl-b main" id="tlRdCopy">复制命令</button><button class="tl-b" id="tlRdNext">换一批</button>
        <span style="align-self:center;font-size:12.5px;color:#7f8ab0">第 <b id="tlRdN">${rdIdx + 1}</b> / ${rdBatches.length} 批 · VPS 上要先装好 xray</span></div>`;
    if (k === "sq") return hd("站长社群", "由于国内网络限制，请优先选择加密通讯软件") + `
  <div class="sq-grid">
    <div class="sq-card"><div class="sq-hd"><span class="sq-ic">✈</span><h4>Telegram 客服机器人</h4></div>
      <div class="sq-bd"><p>推荐使用！我们的核心交流区。点击下方按钮直接唤起 APP 加入，获取最新资源与技术支持。</p></div>
      <a class="sq-join" href="${esc(SQ.tg)}" target="_blank" rel="noopener">点击加入</a></div>
    <div class="sq-card"><div class="sq-hd"><span class="sq-ic">✆</span><h4>QQ 客服</h4></div>
      <div class="sq-bd">
        <div class="sq-qrow"><span class="sq-qtag">客服</span><code>${esc(SQ.qq)}</code><button type="button" class="sq-cp" data-copy="${esc(SQ.qq)}" data-what="客服 QQ">复制</button></div>
        <div class="sq-qrow"><span class="sq-qtag sp">备用</span><code>${esc(SQ.qq2)}</code><button type="button" class="sq-cp" data-copy="${esc(SQ.qq2)}" data-what="备用 QQ">复制</button></div>
      </div></div>
    <div class="sq-card"><div class="sq-hd"><span class="sq-ic">🎧</span><h4>24 小时网页客服</h4></div>
      <div class="sq-bd"><p>点右下角客服图标即可，或点击下方按钮直接打开在线客服</p></div>
      <a class="sq-live" href="${esc(SQ.web)}" target="_blank" rel="noopener"><span class="sq-dot"></span>在线客服 · 点击打开<span class="sq-arrow">↗</span></a></div>
  </div>`;
  }

  /* SOCKS5 → 二维码：host:port:user:pass → socks5://user:pass@host:port（照原站，纯本地转换） */
  function socks(v) {
    const out = document.getElementById("tlQR"), u = document.getElementById("tlSocksUrl");
    if (!v) { out.textContent = "粘贴后这里出二维码"; u.textContent = ""; return; }
    const p = v.split(":");
    if (p.length < 2 || !/^\d+$/.test(p[1])) { out.textContent = "格式不对，要 host:port:用户名:密码"; u.textContent = ""; return; }
    const url = p.length >= 4 ? `socks5://${encodeURIComponent(p[2])}:${encodeURIComponent(p.slice(3).join(":"))}@${p[0]}:${p[1]}` : `socks5://${p[0]}:${p[1]}`;
    u.textContent = url;
    qr(out, url, 134);
  }
  function qr(out, text, size) {
    const draw = () => { out.innerHTML = ""; new QRCode(out, { text, width: size, height: size, correctLevel: QRCode.CorrectLevel.M }); };
    if (window.QRCode) return draw();
    out.textContent = "生成中…"; setTimeout(() => window.QRCode ? draw() : (out.textContent = "二维码组件加载失败，检查网络"), 600);
  }

  /* 弹框外壳：照原站用 .sheet（用到时才建） */
  function ensureSheet() {
    if (sheet) return;
    bd = document.createElement("div"); bd.className = "sheet-bd"; bd.id = "tlBd";
    sheet = document.createElement("div"); sheet.className = "sheet tl-sheet"; sheet.id = "tlSheet"; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true");
    sheet.innerHTML = `<div class="sheet-h"><b class="st"></b><p class="sd"></p><button class="sheet-x" type="button" aria-label="关闭">×</button></div><div class="tl-body" id="tlBody"></div>`;
    document.body.append(bd, sheet);
    body = sheet.querySelector("#tlBody");
    bd.onclick = close; sheet.querySelector(".sheet-x").onclick = close;
    addEventListener("keydown", e => { if (e.key === "Escape" && sheet.classList.contains("open")) close(); });
  }
  function show(k) {
    const t = TOOLS.find(x => x.k === k) || (k === "sq" ? { k: "sq", t: "站长社群", c: "0,243,255" } : null);
    if (!t || t.u) return;
    ensureSheet();
    cur = k; body.innerHTML = content(k);
    const h = body.querySelector(".tl-hd"); // 面板里自带的标题挪到弹框头上
    sheet.querySelector(".st").textContent = h ? h.querySelector("h3").textContent : t.t;
    sheet.querySelector(".sd").textContent = h && h.querySelector("span") ? h.querySelector("span").textContent : "";
    h && h.remove();
        sheet.style.setProperty("--ac", t.c);
    sheet.classList.toggle("wide", k === "sq"); // 站长社群三卡并排，弹层加宽
    if (!sheet.classList.contains("open")) { bd.classList.add("open"); sheet.classList.add("open"); document.body.style.overflow = "hidden"; }
    sheet.scrollTop = 0; bind(); sheet.querySelector(".sheet-x").focus();
  }
  function close() {
    bd.classList.remove("open"); sheet.classList.remove("open"); document.body.style.overflow = "";
    const c = document.querySelector(`[data-k="${cur}"]`); c && c.focus();
  }
  function bind() {
    body.querySelectorAll("[data-go]").forEach(b => b.onclick = () => show(b.dataset.go));
    body.querySelectorAll("[data-copy]").forEach(b => b.onclick = () => copy(b.dataset.copy, b.dataset.what));
    body.querySelectorAll("[data-copy-i]").forEach(b => b.onclick = () => copy(CMDS[+b.dataset.copyI].cmd, `${CMDS[+b.dataset.copyI].name} 安装命令`));
    const rc = body.querySelector("#tlRdCopy"); if (rc) {
      rc.onclick = () => copy(rdCmd(rdBatches[rdIdx]), "域名优选命令");
      body.querySelector("#tlRdNext").onclick = () => { rdIdx = (rdIdx + 1) % rdBatches.length; if (!rdIdx) rdBatches = shuffle(rdBatches); body.querySelector("#tlRd").textContent = rdCmd(rdBatches[rdIdx]); body.querySelector("#tlRdN").textContent = rdIdx + 1; };
    }
    const si = body.querySelector("#tlSocks"); if (si) { si.oninput = () => socks(si.value.trim()); si.focus(); }
    const nq = body.querySelector("#tlNodeQR"); if (nq && FREENODE.url) qr(nq, FREENODE.url, 100);
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("button[data-k]");
    if (b) show(b.dataset.k);
  });
  /* 顶栏/页脚「站长社群」：点击开弹层；带 #sq 进来（如视频页跳回）也直接开 */
  ["#navSq", "#footSq"].forEach(sel => { const el = $(sel); if (el) el.addEventListener("click", e => { e.preventDefault(); show("sq"); }); });
  if (location.hash === "#sq") show("sq");
})();
