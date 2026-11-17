'use strict';
const icons={
 mic:'<rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a4 4 0 0 0-4-2H4zM20 4h-4a3 3 0 0 0-3 3M20 4v14h-3"/>',
 person:'<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
 chat:'<path d="M4 4h16v12H9l-5 4z"/><path d="M8 8h8M8 12h5"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',
 switch:'<path d="M5 7h14l-4-4M19 17H5l4 4"/>',
 source:'<path d="M7 3h8l4 4v14H5V3zM14 3v5h5M8 12h8M8 16h6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 pen:'<path d="m4 16 11-11 4 4L8 20H4zM13 7l4 4"/>',
 bag:'<path d="M5 7h14l1 14H4zM9 9V6a3 3 0 0 1 6 0v3"/>',
 drop:'<path d="M12 3C9 8 5 11 5 15a7 7 0 0 0 14 0c0-4-4-7-7-12z"/>',
 box:'<path d="m3 7 9-4 9 4v11l-9 4-9-4zM3 7l9 4 9-4M12 11v11M8 5l9 4"/>',
 copy:'<path d="M8 8h12v13H8zM16 8V3H3v14h5"/>',
 shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6"/>'
};
function icon(name,size=17){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.info}</svg>`;}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const clients={
 wang:{id:'wang',number:'01',name:'王女士',monogram:'王',subtitle:'再次相遇 · 第二次到店',summary:'精华试用反馈 / 防晒小样承诺',tags:['精华已试用','关注防晒','购买状态待核实'],
  brief:[
   ['她是谁','第二次到店的顾客。曾领取精华小样，<strong>已试用一周</strong>。'],
   ['上次聊了什么','反馈<span class="quote-inline">“皮肤没那么干了”</span>；觉得正装偏贵，想等双十一。下个月去三亚，咨询防晒。'],
   ['答应过什么','<strong>新防晒小样到货后留两支</strong>，并在<span class="quote-inline">“周五前”</span>通过微信告知。','待履行'],
   ['这次注意什么','先核实小样到货及预留，再回应旅行防晒需求；沟通时尊重她的价格顾虑。']
  ],
  warning:'到货、预留均未确认。<strong>先核实，再告知。</strong>',
  source:'王女士，第二次来了，上次拿了精华的小样，说用了一周皮肤没那么干了，但是觉得价格有点高，想等双十一。她下个月要去三亚，问防晒。我答应她到新的防晒小样给她留两支，周五前微信告诉她。',
  statuses:[['box','已领取','精华小样'],['drop','已试用','一周 · 客户自述'],['bag','购买未知','需核对购买记录']],
  fields:[['到店记录','第二次到店'],['使用反馈','“皮肤没那么干了”'],['购买顾虑','认为正装价格偏高'],['购买计划','“想等双十一” · 非购买确认'],['新需求','“下个月”去三亚，咨询防晒'],['精华 SKU','待确认'],['领样日期','待确认'],['防晒小样','到货与预留状态待核实'],['购买记录','未知 · 需核对 POS / CRM']],
  pending:[['防晒小样到货及预留','核实是否到货、是否已经预留两支；“答应留”不等于“已留好”。'],['回访的具体日期','原始口述为“周五前”，记录日期未知；需人工确认对应日期。'],['精华 SKU 与购买记录','核对具体产品和实际订单，不能将领样或试用当作购买。']],
  draft:'王女士您好，我是 Maison Aurèle 的顾问。您上次提到下个月去三亚，也咨询了防晒。我这边正在关注新防晒小样的到货情况，确认后会第一时间通过微信告诉您。也希望能提前帮您做好旅行护肤方面的准备。',
  draftContext:'当前使用「到货未确认」版本。草稿保留关注与告知承诺，不宣称已经预留。',
  timeline:[['此前领样','领取精华小样，具体 SKU 与领样日期待确认。','历史记录'],['第二次到店','反馈试用一周后“皮肤没那么干”；交流价格顾虑与三亚防晒需求。','最近一次口述'],['下一步','核实新防晒小样，履行预留与微信告知承诺。','周五前 · 具体日期待确认']]
 },
 guest:{id:'guest',number:'02',name:'未留名男士',monogram:'客',subtitle:'临时档案 · 已添加企业微信',summary:'代太太咨询 / 小样试用待确认',tags:['代太太咨询','已提供小样','实际试用待确认'],
  brief:[
   ['他是谁','出差途中，<strong>受太太委托了解产品</strong>的男士。实际使用者为太太，顾客未留姓名。'],
   ['上次聊了什么','太太曾使用其他品牌面霜后出现不适。已推荐舒缓系列并提供小样，顾客表示带回给太太试用。'],
   ['答应过什么','<strong>已提供舒缓系列小样</strong>并添加企微；未约定具体回访时间。','回访待约'],
   ['这次注意什么','先问太太是否已试用，再了解使用感受。肤质及过敏原因未知，避免直接判断或承诺效果。']
  ],
  warning:'到店顾客 ≠ 实际使用者。<strong>太太的反馈需单独确认。</strong>',
  source:'一位男士来出差，太太让他来看看我们家产品，他们那没我们家专柜。不知道太太是什么肌肤类型，只知道之前用别家的面霜过敏过。我推荐了舒缓系列，并给了他小样，他说回去给太太试试。没留名字，加了企微。',
  statuses:[['box','已提供','舒缓系列小样'],['drop','试用待确认','拟带回给太太'],['bag','购买未知','口述未提及']],
  fields:[['到店原因','出差，受太太委托了解产品'],['实际使用者','太太'],['到店次数','未知'],['所在地区','当地没有品牌专柜，城市未知'],['肤质','未知 · 不推断为敏感肌'],['历史情况','其他品牌面霜曾引起不适'],['不适原因','未知 · 表现、成分均待确认'],['小样 SKU / 数量','待确认'],['试用状态','未确认 · 表示带回试用'],['联系方式','已添加企业微信'],['回访时间','未约定'],['购买记录','未知']],
  pending:[['太太是否已经试用','先询问是否开始使用，再收集实际感受；带回试用不等于已试用。'],['历史不适的具体情况','确认原产品、出现的不适表现与使用情境，不推断肤质或致敏成分。'],['姓名及合适的回访时间','补充称呼，询问适合的联系时间；不要因已添加企微而默认预约成功。'],['小样 SKU 与数量','已提供小样是事实，但具体产品和数量尚未记录。']],
  draft:'您好，我是 Maison Aurèle 的顾问。上次您来店里时，提到想帮太太了解一些护肤产品。我记得您说她之前使用其他品牌面霜时有过不适的情况。想问一下，之前给您带回去的舒缓系列小样，太太有开始试用了吗？如果方便的话，也可以跟我分享一下她的实际使用感受，我们可以再根据她的具体需求做了解。',
  draftContext:'先确认太太是否试用，再了解实际感受。不预设试用结果，也不作功效保证。',
  timeline:[['到店咨询','男士受太太委托了解产品；到店次数未知。','最近一次口述'],['推荐及领样','已推荐舒缓系列并提供小样，表示带回给太太试用；已加企微。','已发生'],['下一步','询问实际试用情况，并确认合适的回访时间。','未约定时间']]
 }
};
const STORE_KEY='maison-aurele-demo-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(STORE_KEY)||'{}');}catch{saved={};}
if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
let activeId='wang',activeTab='brief',toastTimer;
const app=document.getElementById('app'),sheet=document.getElementById('sheet');
function record(){if(!saved[activeId]||typeof saved[activeId]!=='object')saved[activeId]={};return saved[activeId];}
function persist(){try{localStorage.setItem(STORE_KEY,JSON.stringify(saved));return true;}catch{toast('浏览器未允许保存，当前更改仅保留至关闭页面');return false;}}
function client(){return clients[activeId];}
function toast(text){const el=document.getElementById('toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
function clientCard(){const c=client();return `<section class="client-card" aria-label="当前顾客"><div class="client-top"><div class="client-name"><div class="client-monogram">${c.monogram}</div><div><h2>${c.name}</h2><p>${c.subtitle}</p></div></div><button class="switch-button" data-action="switch">切换 ${icon('switch',13)}</button></div><div class="client-tags">${c.tags.map((t,i)=>`<span class="client-tag ${i===2?'muted':''}">${t}</span>`).join('')}</div></section>`;}
function heading(title,en){return `<div class="page-heading"><div><p class="eyebrow">${en}</p><h1>${title}</h1></div>${activeTab==='brief'?`<span class="reading-time">${icon('clock',12)} 30 秒回顾</span>`:''}</div>`;}
function sourceButton(){return `<button class="source-button" data-action="source">${icon('source',12)} 核对原话</button>`;}
function briefPage(){const c=client(),r=record();return `${heading('接待前速览','BEFORE WE MEET')}${clientCard()}<div class="section-label"><span>记住这四件事</span>${sourceButton()}</div><section aria-label="四项接待重点">${c.brief.map((x,i)=>`<article class="brief-item"><span class="brief-number">0${i+1}</span><div><h3 class="brief-title">${x[0]}${x[2]?`<span class="label-small">${x[2]}</span>`:''}</h3><p class="brief-body">${x[1]}</p></div></article>`).join('')}</section><aside class="priority"><span class="priority-icon">${icon('info',15)}</span><div><p>${c.warning}</p><button data-action="pending">查看 ${c.pending.length} 项待确认 ${'→'}</button></div></aside><div class="action-row"><button class="btn btn-outline" data-action="tab" data-tab="voice">${icon('mic',15)}离店语音复盘</button><button class="btn btn-primary" data-action="tab" data-tab="followup">跟进草稿 ${icon('arrow',15)}</button></div><button class="read-button ${r.read?'is-read':''}" data-action="read">${icon(r.read?'check':'book',13)}${r.read?'已阅读速览 · 待确认项仍保留':'标记已阅读速览'}</button><p class="fineprint">AI 整理 · 依据导购口述 · 重要信息需人工核实</p>`;}
function memoryPage(){const c=client(),r=record();const notes=Array.isArray(r.notes)?r.notes:[];return `${heading('客户记忆','A MEMORY, WITH CARE')}${clientCard()}${activeId==='guest'?'<div class="relationship"><div>未留名男士<small>到店咨询者</small></div><span>→</span><div>太太<small>实际使用者 · 肤质未知</small></div></div>':''}<div class="status-grid">${c.statuses.map(x=>`<div class="status-cell">${icon(x[0],18)}<strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}</div><div class="subheading"><h3>记忆档案</h3>${sourceButton()}</div><dl class="detail-rows">${c.fields.map(x=>`<div class="detail-row"><dt>${x[0]}</dt><dd class="${/未知|待确认|待核实|未约定/.test(x[1])?'unknown':''}">${x[1]}</dd></div>`).join('')}</dl><div class="subheading"><h3>相遇的线索</h3><span>Moments</span></div><div class="timeline">${c.timeline.map(x=>`<article class="timeline-item"><h4>${x[0]}</h4><p>${x[1]}</p><small>${x[2]}</small></article>`).join('')}</div><div class="subheading"><h3>顾问补充</h3><button class="source-button" data-action="note">${icon('pen',12)} 添加记录</button></div>${notes.length?notes.map(n=>`<article class="saved-note"><h4><span>人工补充 · 本机记录</span><span>${escapeHTML(n.createdLabel||'')}</span></h4>${n.feedback?`<p>使用反馈：${escapeHTML(n.feedback)}</p>`:''}${n.task?`<p>后续事项：${escapeHTML(n.task)}</p>`:''}${n.date?`<small>计划联系日期：${escapeHTML(n.date)}</small>`:''}</article>`).join(''):'<div class="empty-note">还没有本次接待记录。<br>新的反馈与约定，可以在这里补充。</div>'}<p class="secondary-meta">客户 ID 未关联；本演示未接入 CRM。补充记录与原始口述分开保存，不自动改写已知事实。</p>`;}
function followupPage(){const c=client(),r=record(),draft=typeof r.draft==='string'?r.draft:c.draft;return `${heading('把关照，延续','A THOUGHTFUL FOLLOW-UP')}${clientCard()}<div class="subheading"><h3>下一次联系</h3><span>01</span></div><div class="detail-rows"><div class="detail-row"><dt>联系渠道</dt><dd>${activeId==='wang'?'微信 · 好友关系待核实':'企业微信 · 已添加'}</dd></div><div class="detail-row"><dt>约定时间</dt><dd>${activeId==='wang'?'“周五前” · 具体日期待确认':'未约定 · 先征询合适时间'}</dd></div><div class="detail-row"><dt>跟进重点</dt><dd>${activeId==='wang'?'核实小样到货，回应旅行防晒需求':'确认太太试用情况，收集实际反馈'}</dd></div></div><div class="draft-context">${icon('info',15)}<p>${c.draftContext}</p></div><label class="draft-label" for="draft-editor">跟进草稿 <span>AI DRAFT · 可编辑</span></label><textarea id="draft-editor" aria-label="跟进草稿" maxlength="2000">${escapeHTML(draft)}</textarea><div class="draft-tools"><span id="draft-count">${draft.length} 字 · ${r.reviewed?'已审阅':'待人工审阅'}</span><button data-action="reset-draft">恢复案例草稿</button></div><label class="check-label"><input type="checkbox" id="review-check" ${r.reviewed?'checked':''}><span>我已核对人物、承诺和时间，并确认这份草稿适合本次跟进。</span></label><div class="action-row"><button class="btn btn-outline" id="save-draft" data-action="save-draft" ${r.reviewed?'':'disabled'}>保存审阅稿</button><button class="btn btn-primary" id="copy-draft" data-action="copy-draft" ${r.reviewed?'':'disabled'}>${icon('copy',14)}复制文案</button></div>${r.reviewed?`<p class="reviewed-badge">${icon('check',13)} 已人工审阅 · 尚未发送</p>`:''}<p class="fineprint">草稿仅在本机保存。复制后，由顾问自行决定发送。<br>本演示不会发送客户消息。</p><button class="btn btn-outline btn-wide" data-action="note">${icon('pen',15)} 补充沟通记录</button>`;}
function render(options={}){const scroll=document.getElementById('app-scroll');const previous=scroll.scrollTop;app.innerHTML=`<div class="page">${activeTab==='brief'?briefPage():activeTab==='memory'?memoryPage():activeTab==='voice'?voicePage():followupPage()}</div>`;document.getElementById('desktop-cases').innerHTML=Object.values(clients).map(c=>`<button type="button" class="desktop-case ${c.id===activeId?'active':''}" aria-pressed="${c.id===activeId}" data-action="select" data-client="${c.id}"><span class="case-index">${c.number}</span><span><strong>${c.name}</strong><small>${c.summary}</small></span><span class="case-arrow">${c.id===activeId?'↗':'→'}</span></button>`).join('');document.getElementById('bottom-nav').className='bottom-nav';document.getElementById('bottom-nav').innerHTML=[['brief','book','接待速览'],['voice','mic','语音复盘'],['memory','person','客户记忆'],['followup','chat','跟进关照']].map(x=>`<button class="nav-button ${activeTab===x[0]?'active':''}" data-action="tab" data-tab="${x[0]}" ${activeTab===x[0]?'aria-current="page"':''}>${icon(x[1],20)}<span>${x[2]}</span></button>`).join('');scroll.scrollTop=options.keepScroll?previous:0;}
function openSheet(title,eyebrow,content){document.getElementById('sheet-title').textContent=title;document.getElementById('sheet-eyebrow').textContent=eyebrow;document.getElementById('sheet-content').innerHTML=content;if(!sheet.open)sheet.showModal();sheet.scrollTop=0;}
function closeSheet(){sheet.close();}
function showSource(){openSheet('原始口述','SOURCE · '+client().name,`<div class="source-meta"><span>来源：题目中的导购接待复盘</span><span>日期未提供</span></div><blockquote class="source-text">“${client().source}”</blockquote><p class="sheet-note">保留原话供核对。以上为导购口述，未与订单、库存或 CRM 自动核验。相对时间不自动换算为具体日期。</p><button class="btn btn-primary btn-wide" data-action="close">已核对，返回速览</button>`);}
function showPending(){openSheet('先确认，再向前','DETAILS TO CONFIRM',client().pending.map((x,i)=>`<div class="pending-item"><span class="pending-status">0${i+1} · 待人工确认</span><strong>${x[0]}</strong><p>${x[1]}</p></div>`).join('')+'<p class="sheet-note">核实后可补充接待记录。阅读此列表不会自动变更客户状态。</p><button class="btn btn-primary btn-wide" data-action="note">添加核实记录</button>');}
function showNote(){openSheet('记录这次相遇','ADVISOR NOTES · '+client().name,`<form id="note-form"><label class="form-field">实际使用反馈<textarea name="feedback" maxlength="800" placeholder="例如：顾客本次补充的试用感受、实际使用者…"></textarea></label><label class="form-field">核实结果 / 后续事项<textarea name="task" maxlength="800" placeholder="例如：核实小样到货与预留情况，或新的联系约定…"></textarea></label><label class="form-field">具体回访日期（选填）<input type="date" name="date"><small>仅记录明确约定的日期，不自动推算“周五前”。</small></label><p class="sheet-note">这条人工记录将与原始口述分开保存，仅用于当前演示，不同步 CRM 或发送提醒。</p><p id="note-error" role="alert" class="error-message"></p><button type="submit" class="btn btn-primary btn-wide">保存本次记录 ${icon('arrow',15)}</button></form>`);}
function showSwitch(){openSheet('每一位，都值得记得','SELECT A CLIENT',Object.values(clients).map(c=>`<button class="sheet-case ${c.id===activeId?'active':''}" data-action="select" data-client="${c.id}" aria-pressed="${c.id===activeId}"><span class="case-index">${c.number}</span><span><strong>${c.name}</strong><small>${c.summary}</small></span><span class="case-arrow">${c.id===activeId?'✓':'→'}</span></button>`).join('')+'<p class="sheet-note">两位顾客均来自题目案例。切换顾客不会混用补充记录或跟进草稿。</p>');}
function showAbout(){openSheet('细节，让关照发生','MAISON AURÈLE · CONCEPT DEMO',`<div class="sheet-copy"><p><strong>问题 4 · 接待前速览演示</strong><br>基于两段导购口述，呈现身份、上次沟通、承诺和本次注意事项。</p><p>以奢侈品牌数字精品店的克制排版为视觉方向，参考 <a href="https://www.chanel.cn/cn/skincare/" target="_blank" rel="noopener">CHANEL 护肤官网</a> 与 <a href="https://www.dior.cn/zh_cn/beauty" target="_blank" rel="noopener">Dior 美妆官网</a>；结合微信小程序胶囊导航与移动端操作方式。Maison Aurèle 为题设虚构品牌。</p><p>这是可交互 H5 原型，非已接入微信的原生小程序。跟进文案为预置示例，语音复盘支持浏览器录音及可用时的中文转写；整理预览为规则演示，未连接真实大模型、CRM、订单、库存或消息接口。</p><p>草稿、阅读状态和补充记录只保存在本浏览器。不会发送任何客户消息。</p></div><button class="btn btn-outline btn-wide" data-action="reset-demo">重置本机演示数据</button>`);}
function reviewState(){const check=document.getElementById('review-check');const draft=document.getElementById('draft-editor');const enabled=!!check?.checked&&!!draft?.value.trim();document.getElementById('save-draft').disabled=!enabled;document.getElementById('copy-draft').disabled=!enabled;}
async function copyDraft(){const r=record(),value=document.getElementById('draft-editor').value.trim();if(!document.getElementById('review-check')?.checked||!value)return;try{await navigator.clipboard.writeText(value);r.draft=value;r.reviewed=true;persist();render({keepScroll:true});toast('文案已复制 · 尚未发送');}catch{openSheet('复制已审阅文案','COPY DRAFT',`<p class="sheet-copy">浏览器未开放剪贴板，请长按或全选下方文案复制。</p><textarea id="manual-copy" readonly aria-label="可手动复制的文案">${escapeHTML(value)}</textarea><p class="sheet-note">复制不会发送客户消息。</p>`);document.getElementById('manual-copy').select();}}
document.addEventListener('click',event=>{const btn=event.target.closest('[data-action]');if(!btn||btn.disabled)return;const action=btn.dataset.action;
 if(action==='select'){activeId=btn.dataset.client;closeSheet();render();}
 else if(action==='tab'){activeTab=btn.dataset.tab;render();}
 else if(action==='switch')showSwitch();
 else if(action==='home'){activeTab='brief';render();}
 else if(action==='source')showSource();
 else if(action==='pending')showPending();
 else if(action==='note')showNote();
 else if(action==='about')showAbout();
 else if(action==='close')closeSheet();
 else if(action==='read'){record().read=!record().read;persist();render({keepScroll:true});toast(record().read?'已标记阅读 · 不改变待确认项':'已取消阅读标记');}
 else if(action==='reset-draft'){record().draft=client().draft;record().reviewed=false;persist();render({keepScroll:true});toast('已恢复案例草稿，请重新审阅');}
 else if(action==='save-draft'){if(!document.getElementById('review-check')?.checked)return;const value=document.getElementById('draft-editor').value.trim();if(!value)return;record().draft=value;record().reviewed=true;const ok=persist();render({keepScroll:true});if(ok)toast('审阅稿已保存 · 尚未发送');}
 else if(action==='copy-draft')copyDraft();
 else if(action==='reset-demo'){openSheet('重置演示记录','RESET DEMO','<p class="sheet-copy">将清除本浏览器中两位顾客的补充记录、草稿更改与阅读标记，恢复题目案例初始状态。</p><div class="action-row"><button class="btn btn-outline" data-action="close">保留记录</button><button class="btn btn-primary" data-action="confirm-reset">确认重置</button></div>');}
 else if(action==='confirm-reset'){saved={};persist();closeSheet();render();toast('已恢复演示初始状态');}
});
document.addEventListener('input',event=>{if(event.target.id==='draft-editor'){record().draft=event.target.value;record().reviewed=false;persist();document.getElementById('review-check').checked=false;document.getElementById('draft-count').textContent=event.target.value.length+' 字 · 待重新审阅';document.querySelector('.reviewed-badge')?.remove();reviewState();}});
document.addEventListener('change',event=>{if(event.target.id==='review-check'){if(!event.target.checked){record().reviewed=false;persist();document.querySelector('.reviewed-badge')?.remove();document.getElementById('draft-count').textContent=document.getElementById('draft-editor').value.length+' 字 · 待人工审阅';}reviewState();}});
document.addEventListener('submit',event=>{if(event.target.id!=='note-form')return;event.preventDefault();const data=new FormData(event.target);const feedback=String(data.get('feedback')||'').trim(),task=String(data.get('task')||'').trim(),date=String(data.get('date')||'');if(!feedback&&!task&&!date){document.getElementById('note-error').textContent='请至少填写一项反馈、事项或约定日期。';return;}const r=record();if(!Array.isArray(r.notes))r.notes=[];r.notes.unshift({feedback,task,date,createdLabel:new Intl.DateTimeFormat('zh-CN',{month:'2-digit',day:'2-digit',timeZone:'Asia/Shanghai'}).format(new Date())});const ok=persist();closeSheet();activeTab='memory';render();if(ok)toast('本次记录已保存 · 原始口述保持独立');});
document.getElementById('close-sheet').addEventListener('click',closeSheet);
sheet.addEventListener('click',e=>{if(e.target===sheet){const bounds=sheet.getBoundingClientRect();if(e.clientY<bounds.top||e.clientY>bounds.bottom||e.clientX<bounds.left||e.clientX>bounds.right)closeSheet();}});
render();
