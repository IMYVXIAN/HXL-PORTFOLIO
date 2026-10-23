/* =================================================================
   Portfolio 交互脚本
   1. 顶部导航 / 底部玻璃导航 / 详情页分类菜单：JS 统一注入
   2. 视图切换（SPA，8 个视图）
   3. 首页卡片轮播（自动 + 圆点点击）
   4. 作品详情 Tab：数据驱动（改下面 DETAIL_DATA 即可增减作品）
   ================================================================= */

/* ====================== 1. 模板：顶部导航 ======================
   data-active 决定哪个按钮为「白底蓝框」当前态 */
function navHTML(active){
  const btn = (name, key) =>
    `<button class="nav-btn ${key===active?'':'pill'}" data-goto="${key}">${name}</button>`;
  return `
  <header class="topnav">
    ${btn('HOME','home')}
    ${btn('WORK','work')}
    ${btn('ABOUT','about')}
    <button class="nav-play" data-goto="work" aria-label="跳转作品页"></button>
  </header>`;
}

/* ====================== 2. 模板：分类菜单（详情页右侧） ====================== */
const MENU_ITEMS = [
  ['work-product','Product & UI/UX Design','产品设计'],
  ['work-industrial','Industrial Design','工业设计'],
  ['work-brand','Brand & Visual Design','品牌与视觉设计'],
  ['work-motion','3D & Motion Design','三维与动效设计'],
  ['work-exploration','Exploration','探索'],
];
function menuHTML(){
  return MENU_ITEMS.map(([g,en,zh])=>`
    <div class="cat" data-goto="${g}">
      <span class="dot">·</span>
      <div><span class="en">${en}</span><span class="zh">${zh}</span></div>
    </div>`).join('');
}

/* ====================== 3. 模板：底部玻璃导航 ====================== */
const FOOTER_HTML = `
  <div class="footer-holder">
    <footer class="footer-glass">
      <div class="footer-col">
        <h4>HOME</h4>
        <a data-goto="home" data-anchor="anchor-myself">· For Myself</a>
        <a data-goto="home" data-anchor="anchor-works">· For My Works</a>
        <a data-goto="home" data-anchor="anchor-feelings">· For My Feelings</a>
      </div>
      <span class="footer-x">✕</span>
      <div class="footer-col">
        <h4>WORK</h4>
        <a data-goto="work-product">· Product & UI/UX Design</a>
        <a data-goto="work-industrial">· Industrial Design</a>
        <a data-goto="work-brand">· Brand & Visual Design</a>
        <a data-goto="work-motion">· 3D & Motion Design</a>
        <a data-goto="work-exploration">· Exploration</a>
      </div>
      <span class="footer-x">✕</span>
      <div class="footer-col">
        <h4>ABOUT</h4>
        <a data-goto="about">· Personal Profile</a>
        <a data-goto="about" data-anchor="contact-anchor">· Contact Information</a>
      </div>
    </footer>
  </div>`;

/* ====================== 4. 作品详情数据（可增减删改） ======================
   每个 key = 一个分类页；tabs 数组中每项 = 一个作品（一个 Tab）
   title：作品标题条文字   imgs：作品长图（按顺序堆叠）
   替换作品：改图片路径；新增作品：在 tabs 中加一组 {title, imgs}
   ================================================================ */
const D = '素材/work-作品详情例图/';   // 详情例图目录（放入真实作品图后替换下方 P）
const O = '素材/work-总览区例图/';     // 总览例图目录
/* 可替换占位图：正式作品就绪后，把对应 imgs 中的 P 换成真实图片路径即可 */
const P = '素材/占位图-黑.svg';

const I1 = '作品集/2.industraul/';   // 工业设计
const I2 = '作品集/1.product&UIUX/';  // 产品 & UI/UX

const DETAIL_DATA = {

  industrial:{
    tabs:[
      { title:'#01工业设计作品',
        imgs:[1,2,3,4,5,6,7,8].map(n=>`${I1}01/1-01- (${n}).jpg`) },
      { title:'#02工业设计作品',
        imgs:[1,2,3,4,5].map(n=>`${I1}02/${n}.jpg`) },
      { title:'#03工业设计作品',
        imgs:[1,2,3,4,5].map(n=>`${I1}03/${n}.jpg`) },
    ]
  },

  product:{
    tabs:[
      { title:'#01C端界面设计——Pulse音乐社交APP',
        imgs:[1,2,3,4,5,6,7,8,9,10].map(n=>`${I2}01/01-${n}.png`) },
      { title:'#02创新服务设计——风车头村荷藕助农',
        imgs:[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`${I2}02/1- (${n}).jpg`) },
      { title:'#03Vibe coding开发——拿下单词韩语学习APP',
        imgs:[1,2,3,4,5,6,7,8].map(n=>`${I2}03/${n}.png`) },
      { title:'#04B端界面设计——YOULING智能管理系统',
        imgs:[1,2,3,4,5,6,7].map(n=>`${I2}04/1-02- (${n}).png`) },
      { title:'#05C端界面设计——写凡尘书法学习APP',
        imgs:[1,2,3,4,5].map(n=>`${I2}05/${n}.jpg`) },
    ]
  },
};

/* ====================== 5. 注入通用结构 ====================== */
document.querySelectorAll('.chrome-topnav').forEach(el=>{
  el.innerHTML = navHTML(el.dataset.active);
});
document.querySelectorAll('.chrome-footer').forEach(el=>{
  el.innerHTML = FOOTER_HTML;
});
document.querySelectorAll('.detail-menu').forEach(el=>{
  el.innerHTML = menuHTML();
});

/* about 页 Contact 锚点 */
const contactSec = document.querySelector('.contact-sec');
if(contactSec) contactSec.id = 'contact-anchor';

/* ====================== 6. 视图切换 ====================== */
function goView(name, anchor){
  const target = document.querySelector(`.view[data-view="${name}"]`);
  if(!target) return;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  target.classList.add('active');
  window.scrollTo(0,0);
  if(anchor){
    // 等视图进入动画开始后再滚到锚点
    setTimeout(()=>{
      const a = target.querySelector('#'+anchor);
      if(a) a.scrollIntoView({behavior:'smooth',block:'start'});
    },120);
  }
}

/* 总览卡片带 data-tab 时，跳转后自动激活对应 Tab（01-04） */
function activateDetailTab(key, idx){
  const body = document.querySelector(`.detail-body[data-detail="${key}"]`);
  if(!body) return;
  const btn = body.querySelectorAll('.work-tabs .tab')[idx-1];
  if(btn) btn.click();
}

/* 总览卡片带 data-group 时，跳转后滚动到页内第 N 个作品组（-01-/-02-/-03-） */
function scrollToGroup(view, n){
  const target = document.querySelector(`.view[data-view="${view}"]`);
  if(!target) return;
  const g = target.querySelectorAll('.other-group')[n-1];
  if(g) setTimeout(()=>g.scrollIntoView({behavior:'smooth',block:'start'}), 150);
}

/* 全局事件委托：所有 data-goto 元素 */
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-goto]');
  if(!el) return;
  goView(el.dataset.goto, el.dataset.anchor || null);
  // 视图名 work-product → 详情容器 data-detail="product"（去掉 work- 前缀）
  if(el.dataset.tab) activateDetailTab(el.dataset.goto.replace(/^work-/,''), +el.dataset.tab);
  else if(el.dataset.group) scrollToGroup(el.dataset.goto, +el.dataset.group);
});

/* ====================== 7. 首页卡片轮播 ====================== */
const HOME_SLIDES = [
  '素材/home-作品区例图/展示产品.png',
  '素材/home-作品区例图/展示产品-1.png',
  '素材/home-作品区例图/展示产品-2.png',
  '素材/home-作品区例图/展示产品-3.png',
];
const homeCard = document.getElementById('homeCardImg');
let homeSlide = 0, homeTimer = null;

function showHomeSlide(i){
  homeSlide = (i + HOME_SLIDES.length) % HOME_SLIDES.length;
  homeCard.style.opacity = '0';
  setTimeout(()=>{
    homeCard.src = HOME_SLIDES[homeSlide];
    homeCard.style.opacity = '1';
  },220);
  document.querySelectorAll('.card-dot').forEach((d,idx)=>
    d.classList.toggle('on', idx===homeSlide));
}
function startHomeAuto(){
  stopHomeAuto();
  homeTimer = setInterval(()=>showHomeSlide(homeSlide+1), 3600);
}
function stopHomeAuto(){ if(homeTimer) clearInterval(homeTimer); }

const carousel = document.getElementById('homeCardCarousel');
if(carousel){
  carousel.addEventListener('click', e=>{
    const hot = e.target.closest('.card-dot');
    if(hot){ showHomeSlide(+hot.dataset.slide); startHomeAuto(); }
  });
  carousel.addEventListener('mouseenter', stopHomeAuto);
  carousel.addEventListener('mouseleave', startHomeAuto);
  startHomeAuto();
}

/* ====================== 8. 作品详情 Tab 渲染 ====================== */
function buildDetail(key){
  const body = document.querySelector(`.detail-body[data-detail="${key}"]`);
  if(!body) return;
  const data = DETAIL_DATA[key];
  if(!data) return;
  const tabsEl = body.querySelector('.work-tabs');
  const captionEl = body.querySelector('.work-caption');
  const galleryEl = body.querySelector('.work-gallery');

  function mediaTag(src){
    // 作品位支持三种媒体：图片（png/jpg/gif/webp/svg）、动态视频（mp4/webm/mov）、PDF
    if(/\.(mp4|webm|mov|m4v|ogg)$/i.test(src)){
      return `<video src="${src}" controls muted loop playsinline preload="metadata"></video>`;
    }
    if(/\.pdf$/i.test(src)){
      return `<iframe src="${src}" title="PDF作品"></iframe>`;
    }
    return `<img src="${src}" alt="作品图" loading="lazy">`;
  }

  function render(idx){
    const t = data.tabs[idx];
    captionEl.textContent = t.title;
    galleryEl.innerHTML = t.cls
      ? `<div class="${t.cls}">` + t.imgs.map(mediaTag).join('') + '</div>'
      : t.imgs.map(mediaTag).join('');
    tabsEl.querySelectorAll('.tab').forEach((b,i)=>
      b.classList.toggle('active', i===idx));
  }

  tabsEl.innerHTML = data.tabs.map((_,i)=>
    `<button class="tab ${i===0?'active':''}">0${i+1}</button>`).join('');
  tabsEl.addEventListener('click', e=>{
    const b = e.target.closest('.tab');
    if(b) render([...tabsEl.children].indexOf(b));
  });
  render(0);
}
['industrial','product'].forEach(buildDetail);

/* ====================== 9. 滚动进入动画 ====================== */
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
