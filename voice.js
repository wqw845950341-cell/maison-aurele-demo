'use strict';
const voiceSessions = new Map();
const SpeechEngine = window.SpeechRecognition || window.webkitSpeechRecognition;
let capture = null;
let permissionRequest = 0;
const voiceFieldLabels = ['客户与使用者','本次沟通 / 使用反馈','承诺与后续事项','下次注意 / 待确认'];
function voiceSession(id=activeId){
  if(!voiceSessions.has(id))voiceSessions.set(id,{text:'',stage:'input',mode:'manual',seconds:0,url:'',error:'',fields:null,reviewed:false,requesting:false});
  return voiceSessions.get(id);
}
function voicePage(){
  const v=voiceSession();
  const recording=capture?.id===activeId;
  return `${heading('把倾听，留在记忆里','ONE MINUTE, AFTER THE VISIT')}${clientCard()}
  <div class="voice-steps" aria-label="复盘流程"><span class="${v.stage==='input'?'current':''}">01 语音复盘</span><i></i><span class="${v.stage==='review'?'current':''}">02 校对整理</span><i></i><span>03 确认入档</span></div>
  ${v.stage==='review'?voiceReview(v):`<section class="voice-recorder ${recording?'is-recording':''}" aria-label="导购离店复盘录音">
    <p class="voice-kicker">顾客离店后 · 只录导购复盘</p>
    <div class="voice-wave" aria-hidden="true">${Array.from({length:25},(_,i)=>`<b style="--bar:${i};height:${[5,8,12,20,28,17,35,24,40,29,18,33,45,33,18,29,40,24,35,17,28,20,12,8,5][i]}px"></b>`).join('')}</div>
    <div class="voice-timer"><span id="voice-timer">${String(Math.floor(v.seconds/60)).padStart(2,'0')}:${String(v.seconds%60).padStart(2,'0')}</span><small>/ 01:00</small></div>
    <button class="record-control ${recording?'recording':''}" data-voice="${recording?'stop':'start'}" ${v.requesting?'disabled':''} aria-label="${recording?'停止录音':'开始录音'}">${recording?'<span class="stop-square"></span>':icon('mic',27)}</button>
    <p class="voice-instruction" id="voice-instruction">${recording?'正在录音 · 点击结束':v.requesting?'等待麦克风授权…':v.url?'录音已结束 · 可回听并校对':'点击开始，说下这次接待的细节'}</p>
    <p class="voice-hint">聊了什么 · 使用反馈 · 答应了什么 · 何时跟进</p>
  </section>
  ${v.url?`<div class="audio-review"><label for="recap-audio">回听本次复盘 <span>仅本次页面内保留</span></label><audio id="recap-audio" controls src="${v.url}" preload="metadata"></audio></div>`:''}
  <p id="voice-error" class="voice-error" role="status">${escapeHTML(v.error)}</p>
  <div class="draft-label"><label for="voice-transcript">${v.mode==='sample'?'示例口述':v.mode==='recording'?'转写内容':'复盘文字'} <span>可校对</span></label><button class="source-button" data-voice="sample" ${recording||v.requesting?'disabled':''}>载入示例口述 ↗</button></div>
  <textarea id="voice-transcript" aria-label="复盘口述转写" maxlength="3000" placeholder="语音转写会显示在这里，也可手动补录。请核对产品名、数量、否定词和时间。" ${recording||v.requesting?'readonly':''}>${escapeHTML(v.text)}</textarea>
  <p class="interim-transcript" id="voice-interim" aria-live="polite"></p>
  <p class="voice-capability">${SpeechEngine?'支持中文自动转写；识别由浏览器语音服务处理，可能需要联网。':'当前浏览器未提供自动转写。可录音回听后手动补录，或载入示例体验流程。'}</p>
  <button class="btn btn-primary btn-wide" data-voice="organize" id="organize-voice" ${!v.text.trim()||recording||v.requesting?'disabled':''}>整理复盘，进入校对 ${icon('arrow',15)}</button>
  <p class="fineprint">录音最长 60 秒；离开此页即停止。<br>本 Demo 不上传或长期保存录音。</p>`}`;
}
function voiceReview(v){return `<div class="voice-review-summary"><span>${icon('source',16)}</span><div><strong>${v.mode==='sample'?'示例口述 · 整理预览':'口述摘录 · 整理预览'}</strong><p>演示按关键词归类，请逐项校对；未提及的信息保持“待确认”。</p></div></div>
  <form id="voice-review-form">${voiceFieldLabels.map((label,i)=>`<label class="form-field">${String(i+1).padStart(2,'0')} · ${label}<textarea name="memory-${i}" data-voice-field="${i}" maxlength="1500">${escapeHTML(v.fields?.[i]||'待确认：原话未明确提及')}</textarea></label>`).join('')}
  <details class="voice-source"><summary>核对本次口述原文</summary><p>${escapeHTML(v.text)}</p></details>
  <label class="check-label"><input type="checkbox" id="voice-reviewed" ${v.reviewed?'checked':''}><span>已核对使用者、产品、数量及承诺状态；确认将本次记录存入「${client().name}」。</span></label>
  <div class="action-row"><button type="button" class="btn btn-outline" data-voice="back">返回修改口述</button><button type="submit" class="btn btn-primary" id="confirm-voice" ${v.reviewed?'':'disabled'}>确认，保存记忆</button></div>
  <p class="fineprint">新增人工确认记录，不覆盖题目原始口述。<br>${v.mode==='sample'?'本条将明确标为示例演示。':'保存文本与整理内容，录音不写入档案。'}</p></form>`;}
function voiceUpdate(){if(activeTab==='voice')render({keepScroll:true});}
function setVoiceError(v,message){v.error=message;if(activeTab==='voice'&&voiceSession()===v){const el=document.getElementById('voice-error');if(el)el.textContent=message;}}
function releaseAudio(v){if(v.url){URL.revokeObjectURL(v.url);v.url='';}}
function stopCapture(reason=''){
  permissionRequest++;
  for(const v of voiceSessions.values())v.requesting=false;
  const current=capture;if(!current)return;
  capture=null;
  clearInterval(current.timer);
  if(current.recognition){try{current.recognition.stop();}catch{}}
  if(current.recorder?.state==='recording'){try{current.recorder.stop();}catch{}}
  current.stream.getTracks().forEach(track=>track.stop());
  if(reason)setVoiceError(current.session,reason);
  voiceUpdate();
}
async function startCapture(){
  if(capture||voiceSession().requesting)return;
  const id=activeId,v=voiceSession(id),token=++permissionRequest;
  v.error='';
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){setVoiceError(v,'当前环境无法录音。请在支持麦克风的 HTTPS 浏览器打开，或手动补录。');return;}
  v.requesting=true;voiceUpdate();
  let stream;
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
    if(token!==permissionRequest||id!==activeId||activeTab!=='voice'){stream.getTracks().forEach(t=>t.stop());return;}
    releaseAudio(v);v.text='';v.fields=null;v.reviewed=false;v.mode='recording';v.seconds=0;v.requesting=false;v.edited=false;v.recordingToken=token;
    const types=['audio/webm;codecs=opus','audio/mp4','audio/webm'];
    const mime=types.find(type=>MediaRecorder.isTypeSupported(type));
    const recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
    const current={id,session:v,stream,recorder,recognition:null,timer:null,chunks:[],began:performance.now(),transcript:'',stopping:false};
    capture=current;
    recorder.ondataavailable=e=>{if(e.data.size)current.chunks.push(e.data);};
    recorder.onstop=()=>{if(v.recordingToken!==token||voiceSessions.get(id)!==v)return;if(current.chunks.length){releaseAudio(v);v.url=URL.createObjectURL(new Blob(current.chunks,{type:recorder.mimeType||'audio/webm'}));}if(!v.text.trim()&&!v.error)v.error='未获得可用转写。请回听录音后补录文字，再进行整理。';if(activeId===id)voiceUpdate();};
    recorder.onerror=()=>stopCapture('录音遇到错误，已停止麦克风。请检查设备后重试。');
    recorder.start(250);
    stream.getAudioTracks().forEach(track=>track.addEventListener('ended',()=>{if(capture===current)stopCapture('麦克风已断开，录音已停止。');}));
    if(SpeechEngine){
      const recognition=new SpeechEngine();current.recognition=recognition;
      recognition.lang='zh-CN';recognition.continuous=true;recognition.interimResults=true;
      let finalText='';
      recognition.onresult=e=>{
        let interim='';for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)finalText+=e.results[i][0].transcript;else interim+=e.results[i][0].transcript;}
        if(v.mode!=='recording'||v.recordingToken!==token||v.edited||v.stage!=='input')return;
        v.text=finalText.slice(0,3000);
        if(activeId===id&&activeTab==='voice'&&v.stage==='input'){
          const editor=document.getElementById('voice-transcript');if(editor)editor.value=v.text;
          const preview=document.getElementById('voice-interim');if(preview)preview.textContent=interim;
          const organize=document.getElementById('organize-voice');if(organize)organize.disabled=!!capture||!v.text.trim();
        }
      };
      recognition.onerror=e=>{
        if(capture!==current)return;
        const messages={'not-allowed':'自动转写未获授权；录音可继续，结束后请手动校对。','service-not-allowed':'此浏览器暂不可用自动转写；请回听后补录。','network':'转写服务连接失败；录音仍在继续，请回听后补录。','no-speech':'暂未识别到语音，请靠近麦克风，或录完后手动补录。','audio-capture':'转写未获取到声音，请回听并核对。'};
        if(e.error!=='aborted')setVoiceError(v,messages[e.error]||'自动转写暂不可用，请回听后补录。');
      };
      recognition.onend=()=>{if(capture===current)setVoiceError(v,'自动转写已结束；录音仍在继续。结束后请回听并补齐后续内容。');};
      try{recognition.start();}catch{setVoiceError(v,'自动转写未能启动，录音仍可使用；请回听后补录。');}
    }else v.error='录音进行中；此浏览器不支持自动转写，结束后可回听并手动补录。';
    current.timer=setInterval(()=>{
      v.seconds=Math.min(60,Math.floor((performance.now()-current.began)/1000));
      const timer=document.getElementById('voice-timer');if(timer&&activeId===id)timer.textContent=`${String(Math.floor(v.seconds/60)).padStart(2,'0')}:${String(v.seconds%60).padStart(2,'0')}`;
      if(v.seconds>=60)stopCapture('已达到 60 秒，录音自动结束。请核对转写内容。');
    },250);
    voiceUpdate();
  }catch(error){
    stream?.getTracks().forEach(t=>t.stop());
    v.requesting=false;
    if(capture?.session===v)stopCapture();
    const errors={NotAllowedError:'麦克风未获授权。可在浏览器设置中允许后重试，或使用文字 / 示例口述。',NotFoundError:'没有找到可用麦克风，请连接设备或使用文字输入。',NotReadableError:'麦克风正被占用或无法读取，请关闭占用设备的应用后重试。'};
    setVoiceError(v,errors[error.name]||'录音未能开始，请检查浏览器和麦克风设置。');voiceUpdate();
  }
}
function organizeVoice(v){
  const text=v.text.trim();
  if(!text)return;
  if(v.mode==='sample'&&text===client().source){v.fields=client().brief.map(x=>x[1].replace(/<[^>]+>/g,''));}
  else{
    const sentences=text.split(/(?<=[。！？；\n])/).map(x=>x.trim()).filter(Boolean);
    const excerpt=pattern=>sentences.filter(x=>pattern.test(x)).join('\n')||'待确认：原话未明确提及，请人工补充。';
    v.fields=[excerpt(/女士|先生|男士|太太|丈夫|妻子|姓名|第.{0,3}次|使用者/),excerpt(/试用|用了一|用了|皮肤|肤质|不适|过敏|反馈|价格|防晒|买/),excerpt(/答应|承诺|回访|联系|告知|通知|预留|留.{0,4}支|周五|下个月/),'请核实产品名 / SKU、实际使用者、购买状态及具体跟进日期；口述未明确的信息保持未知。'];
  }
  v.reviewed=false;v.stage='review';render();
}
document.addEventListener('click',event=>{
  const btn=event.target.closest('[data-action]');
  if(!btn)return;
  if(['tab','select','home','confirm-reset'].includes(btn.dataset.action)){
    if(capture||voiceSession().requesting)stopCapture('已离开录音页，麦克风已停止。');
    if(btn.dataset.action==='confirm-reset'){for(const v of voiceSessions.values())releaseAudio(v);voiceSessions.clear();}
  }
},true);
document.addEventListener('click',event=>{
  const btn=event.target.closest('[data-voice]');if(!btn||btn.disabled)return;
  const v=voiceSession();
  if(btn.dataset.voice==='start'){
    if(v.text.trim()||v.url){openSheet('开始新的复盘','NEW VOICE RECAP','<p class="sheet-copy">当前尚未入档的口述与录音将被替换。已保存的客户记忆不受影响。</p><div class="action-row"><button class="btn btn-outline" data-action="close">保留当前内容</button><button class="btn btn-primary" data-voice="confirm-start">开始新录音</button></div>');}
    else startCapture();
  }
  else if(btn.dataset.voice==='confirm-start'){closeSheet();startCapture();}
  else if(btn.dataset.voice==='stop')stopCapture();
  else if(btn.dataset.voice==='sample'){
    if(v.text.trim()||v.url)openSheet('载入案例口述','SAMPLE TRANSCRIPT','<p class="sheet-copy">将替换尚未入档的口述内容，使用题目中的案例演示整理流程。此操作不会录音。</p><div class="action-row"><button class="btn btn-outline" data-action="close">保留当前内容</button><button class="btn btn-primary" data-voice="confirm-sample">载入示例</button></div>');
    else loadVoiceSample();
  }
  else if(btn.dataset.voice==='confirm-sample'){closeSheet();loadVoiceSample();}
  else if(btn.dataset.voice==='organize')organizeVoice(v);
  else if(btn.dataset.voice==='back'){v.stage='input';v.reviewed=false;render();}
});
function loadVoiceSample(){const v=voiceSession();releaseAudio(v);v.text=client().source;v.mode='sample';v.fields=null;v.reviewed=false;v.seconds=0;v.error='已载入题目示例文字，未使用麦克风。';voiceUpdate();}
document.addEventListener('input',event=>{
  if(event.target.id==='voice-transcript'){const v=voiceSession();v.text=event.target.value;v.fields=null;v.reviewed=false;v.edited=true;document.getElementById('organize-voice').disabled=!v.text.trim();}
  if(event.target.hasAttribute('data-voice-field')){const v=voiceSession();v.fields[Number(event.target.dataset.voiceField)]=event.target.value;v.reviewed=false;document.getElementById('voice-reviewed').checked=false;document.getElementById('confirm-voice').disabled=true;}
});
document.addEventListener('change',event=>{if(event.target.id==='voice-reviewed'){const v=voiceSession();v.reviewed=event.target.checked;document.getElementById('confirm-voice').disabled=!v.reviewed;}});
document.addEventListener('submit',event=>{
  if(event.target.id!=='voice-review-form')return;
  event.preventDefault();const v=voiceSession();if(!v.reviewed||!v.text.trim())return;
  const r=record();if(!Array.isArray(r.notes))r.notes=[];
  r.notes.unshift({kind:'voice',mode:v.mode,transcript:v.text,fields:[...v.fields],createdLabel:new Intl.DateTimeFormat('zh-CN',{month:'2-digit',day:'2-digit',timeZone:'Asia/Shanghai'}).format(new Date())});
  const ok=persist();releaseAudio(v);voiceSessions.delete(activeId);activeTab='memory';render();if(ok)toast('已确认入档 · 可在顾问补充中查看');
});
const originalMemoryPage=memoryPage;
memoryPage=function(){const content=originalMemoryPage();const notes=record().notes||[];let index=0;return content.replace(/<article class="saved-note">[\s\S]*?<\/article>/g,original=>{
  const note=notes[index++];if(note?.kind!=='voice')return original;
  return `<article class="saved-note voice-saved"><h4><span>${note.mode==='sample'?'示例复盘':'复盘记录'} · 人工已确认</span><span>${escapeHTML(note.createdLabel||'')}</span></h4>${(note.fields||[]).map((x,i)=>`<p><strong>${voiceFieldLabels[i]}</strong>${escapeHTML(x)}</p>`).join('')}<details><summary>查看${note.mode==='sample'?'示例':'本次'}口述</summary><p>${escapeHTML(note.transcript||'')}</p></details></article>`;
});};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(capture||voiceSession().requesting))stopCapture('页面已切到后台，录音已停止。');});
window.addEventListener('pagehide',()=>{stopCapture();for(const v of voiceSessions.values())releaseAudio(v);});
