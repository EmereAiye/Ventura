document.documentElement.classList.add("js");
const $=id=>document.getElementById(id);
const QUOTE_TO=""; /* put your inbox here, e.g. "quotes@yoursite.com" */
const FSET=["US","LR","MM"]; /* countries that use Fahrenheit/mph */

const V=window.V={C:[],place:null,
s:{ci:0,type:0,size:80,f:new Set([0]),tier:1},ev:[],
d:{fx:null,fxTime:"",pl:{},plYear:{},wx:null,aq:null,err:""},
on(f){this.ev.push(f)},emit(){this.ev.forEach(f=>f())},
get c(){return this.C[this.s.ci]||{n:"",f:"🌍",cur:"USD",loc:"en-US",iso:"",u:"C"}},
rate(){return this.d.fx&&this.d.fx[this.c.cur]},
pl(){const v=this.d.pl[this.c.iso];return v&&v>0?Math.max(.2,v):1},
fmt(u){const c=this.c,r=this.rate(),cur=r?c.cur:"USD",loc=r?c.loc:"en-US",x=u*(r||1),m=10**Math.max(0,String(Math.round(x)).length-2);
 try{return new Intl.NumberFormat(loc,{style:"currency",currency:cur,maximumFractionDigits:0}).format(Math.round(x/m)*m)}catch(e){return"$"+Math.round(u)}},
/* Base rates are planning assumptions in USD. Replace with your own pricing data. */
est(){const s=this.s,b=[2500,4200,6000,1500][s.type],fa=[400,700,900,250];
 const mid=(b*(.4+s.size/120)+[...s.f].reduce((a,i)=>a+fa[i],0))*[.8,1,1.5][s.tier]*this.pl();
 return{lo:mid*.82,mid,hi:mid*1.22}}};
const S=V.s;
const where=()=>V.place?(V.place.st?V.place.n+", "+V.c.n:V.c.n):"";
V.suit=()=>{const w=V.d.wx;if(!w||w.rain==null)return"—";return w.rain<30?"Great":w.rain<55?"Fair":"Poor"};
const jget=u=>fetch(u).then(r=>{if(!r.ok)throw 0;return r.json()});

/* Location picker: country, then state */
const CL="AF|Afghanistan|AFG|AFN;AL|Albania|ALB|ALL;DZ|Algeria|DZA|DZD;AD|Andorra|AND|EUR;AO|Angola|AGO|AOA;AG|Antigua and Barbuda|ATG|XCD;AR|Argentina|ARG|ARS;AM|Armenia|ARM|AMD;AU|Australia|AUS|AUD;AT|Austria|AUT|EUR;AZ|Azerbaijan|AZE|AZN;BS|Bahamas|BHS|BSD;BH|Bahrain|BHR|BHD;BD|Bangladesh|BGD|BDT;BB|Barbados|BRB|BBD;BY|Belarus|BLR|BYN;BE|Belgium|BEL|EUR;BZ|Belize|BLZ|BZD;BJ|Benin|BEN|XOF;BT|Bhutan|BTN|BTN;BO|Bolivia|BOL|BOB;BA|Bosnia and Herzegovina|BIH|BAM;BW|Botswana|BWA|BWP;BR|Brazil|BRA|BRL;BN|Brunei|BRN|BND;BG|Bulgaria|BGR|EUR;BF|Burkina Faso|BFA|XOF;BI|Burundi|BDI|BIF;KH|Cambodia|KHM|KHR;CM|Cameroon|CMR|XAF;CA|Canada|CAN|CAD;CV|Cape Verde|CPV|CVE;CF|Central African Republic|CAF|XAF;TD|Chad|TCD|XAF;CL|Chile|CHL|CLP;CN|China|CHN|CNY;CO|Colombia|COL|COP;KM|Comoros|COM|KMF;CG|Republic of the Congo|COG|XAF;CD|Democratic Republic of the Congo|COD|CDF;CR|Costa Rica|CRI|CRC;CI|Cote d'Ivoire|CIV|XOF;HR|Croatia|HRV|EUR;CU|Cuba|CUB|CUP;CY|Cyprus|CYP|EUR;CZ|Czech Republic|CZE|CZK;DK|Denmark|DNK|DKK;DJ|Djibouti|DJI|DJF;DM|Dominica|DMA|XCD;DO|Dominican Republic|DOM|DOP;EC|Ecuador|ECU|USD;EG|Egypt|EGY|EGP;SV|El Salvador|SLV|USD;GQ|Equatorial Guinea|GNQ|XAF;ER|Eritrea|ERI|ERN;EE|Estonia|EST|EUR;SZ|Eswatini|SWZ|SZL;ET|Ethiopia|ETH|ETB;FJ|Fiji|FJI|FJD;FI|Finland|FIN|EUR;FR|France|FRA|EUR;GA|Gabon|GAB|XAF;GM|Gambia|GMB|GMD;GE|Georgia|GEO|GEL;DE|Germany|DEU|EUR;GH|Ghana|GHA|GHS;GR|Greece|GRC|EUR;GD|Grenada|GRD|XCD;GT|Guatemala|GTM|GTQ;GN|Guinea|GIN|GNF;GW|Guinea-Bissau|GNB|XOF;GY|Guyana|GUY|GYD;HT|Haiti|HTI|HTG;HN|Honduras|HND|HNL;HU|Hungary|HUN|HUF;IS|Iceland|ISL|ISK;IN|India|IND|INR;ID|Indonesia|IDN|IDR;IR|Iran|IRN|IRR;IQ|Iraq|IRQ|IQD;IE|Ireland|IRL|EUR;IL|Israel|ISR|ILS;IT|Italy|ITA|EUR;JM|Jamaica|JAM|JMD;JP|Japan|JPN|JPY;JO|Jordan|JOR|JOD;KZ|Kazakhstan|KAZ|KZT;KE|Kenya|KEN|KES;KI|Kiribati|KIR|AUD;KW|Kuwait|KWT|KWD;KG|Kyrgyzstan|KGZ|KGS;LA|Laos|LAO|LAK;LV|Latvia|LVA|EUR;LB|Lebanon|LBN|LBP;LS|Lesotho|LSO|LSL;LR|Liberia|LBR|LRD;LY|Libya|LBY|LYD;LI|Liechtenstein|LIE|CHF;LT|Lithuania|LTU|EUR;LU|Luxembourg|LUX|EUR;MG|Madagascar|MDG|MGA;MW|Malawi|MWI|MWK;MY|Malaysia|MYS|MYR;MV|Maldives|MDV|MVR;ML|Mali|MLI|XOF;MT|Malta|MLT|EUR;MH|Marshall Islands|MHL|USD;MR|Mauritania|MRT|MRU;MU|Mauritius|MUS|MUR;MX|Mexico|MEX|MXN;FM|Micronesia|FSM|USD;MD|Moldova|MDA|MDL;MC|Monaco|MCO|EUR;MN|Mongolia|MNG|MNT;ME|Montenegro|MNE|EUR;MA|Morocco|MAR|MAD;MZ|Mozambique|MOZ|MZN;MM|Myanmar|MMR|MMK;NA|Namibia|NAM|NAD;NR|Nauru|NRU|AUD;NP|Nepal|NPL|NPR;NL|Netherlands|NLD|EUR;NZ|New Zealand|NZL|NZD;NI|Nicaragua|NIC|NIO;NE|Niger|NER|XOF;NG|Nigeria|NGA|NGN;KP|North Korea|PRK|KPW;MK|North Macedonia|MKD|MKD;NO|Norway|NOR|NOK;OM|Oman|OMN|OMR;PK|Pakistan|PAK|PKR;PW|Palau|PLW|USD;PA|Panama|PAN|USD;PG|Papua New Guinea|PNG|PGK;PY|Paraguay|PRY|PYG;PE|Peru|PER|PEN;PH|Philippines|PHL|PHP;PL|Poland|POL|PLN;PT|Portugal|PRT|EUR;QA|Qatar|QAT|QAR;RO|Romania|ROU|RON;RU|Russia|RUS|RUB;RW|Rwanda|RWA|RWF;KN|Saint Kitts and Nevis|KNA|XCD;LC|Saint Lucia|LCA|XCD;VC|Saint Vincent and the Grenadines|VCT|XCD;WS|Samoa|WSM|WST;SM|San Marino|SMR|EUR;ST|Sao Tome and Principe|STP|STN;SA|Saudi Arabia|SAU|SAR;SN|Senegal|SEN|XOF;RS|Serbia|SRB|RSD;SC|Seychelles|SYC|SCR;SL|Sierra Leone|SLE|SLE;SG|Singapore|SGP|SGD;SK|Slovakia|SVK|EUR;SI|Slovenia|SVN|EUR;SB|Solomon Islands|SLB|SBD;SO|Somalia|SOM|SOS;ZA|South Africa|ZAF|ZAR;KR|South Korea|KOR|KRW;SS|South Sudan|SSD|SSP;ES|Spain|ESP|EUR;LK|Sri Lanka|LKA|LKR;SD|Sudan|SDN|SDG;SR|Suriname|SUR|SRD;SE|Sweden|SWE|SEK;CH|Switzerland|CHE|CHF;SY|Syria|SYR|SYP;TW|Taiwan|TWN|TWD;TJ|Tajikistan|TJK|TJS;TZ|Tanzania|TZA|TZS;TH|Thailand|THA|THB;TL|Timor-Leste|TLS|USD;TG|Togo|TGO|XOF;TO|Tonga|TON|TOP;TT|Trinidad and Tobago|TTO|TTD;TN|Tunisia|TUN|TND;TR|Turkey|TUR|TRY;TM|Turkmenistan|TKM|TMT;TV|Tuvalu|TUV|AUD;UG|Uganda|UGA|UGX;UA|Ukraine|UKR|UAH;AE|United Arab Emirates|ARE|AED;GB|United Kingdom|GBR|GBP;US|United States|USA|USD;UY|Uruguay|URY|UYU;UZ|Uzbekistan|UZB|UZS;VU|Vanuatu|VUT|VUV;VA|Vatican City|VAT|EUR;VE|Venezuela|VEN|VES;VN|Vietnam|VNM|VND;YE|Yemen|YEM|YER;ZM|Zambia|ZMB|ZMW;ZW|Zimbabwe|ZWE|ZWL".split(";");
V.C=CL.map(t=>{const[cc,n,iso,cur]=t.split("|");return{n,cc,iso,cur,loc:"en",f:String.fromCodePoint(...[...cc].map(ch=>127397+ch.charCodeAt(0))),u:FSET.includes(cc)?"F":"C",city:n}});
async function loadCountries(){listC("");restore();
 try{const j=await jget("https://restcountries.com/v3.1/all?fields=cca2,capital,capitalInfo,latlng");
  j.forEach(x=>{const c=V.C.find(k=>k.cc==x.cca2);if(!c)return;const ll=(x.capitalInfo&&x.capitalInfo.latlng)||x.latlng;if(ll&&ll.length){c.lat=ll[0];c.lon=ll[1]}if(x.capital&&x.capital[0])c.city=x.capital[0]})}catch(e){}}
function restore(){let s;try{s=JSON.parse(localStorage.getItem("vloc"))}catch(e){}
 const i=s?V.C.findIndex(c=>c.iso==s.iso):-1;
 if(i<0){$("ov").classList.add("on");return}
 S.ci=i;setPlace(s.st?{n:s.st,st:1,lat:s.lat,lon:s.lon}:null)}
async function setPlace(p){const c=V.c;
 if(!p&&c.lat==null){try{const r=(await jget(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(c.city)}&count=1&language=en&country_code=${c.cc}`)).results[0];c.lat=r.latitude;c.lon=r.longitude}catch(e){c.lat=0;c.lon=0}}
 V.place=p||{n:c.city,lat:c.lat,lon:c.lon};
 try{localStorage.setItem("vloc",JSON.stringify({iso:c.iso,...(p?{st:p.n,lat:p.lat,lon:p.lon}:{})}))}catch(e){}
 $("ov").classList.remove("on");loadWx();V.emit()}
function listC(q){$("cl").innerHTML="";$("ovt").textContent="Where are you going?";$("ovk").textContent="Pick a country, then a state or region.";$("q").style.display="";$("q").placeholder="Search countries";
 V.C.forEach((c,i)=>{if(!c.n.toLowerCase().includes(q))return;const b=document.createElement("button");b.className="ct";
 b.innerHTML=`<span style="font-size:26px">${c.f}</span><span style="flex:1">${c.n}</span><span class="mono" style="color:var(--mut)">${c.cur}</span>`;b.onclick=()=>pickC(i);$("cl").appendChild(b)})}
let stList=[];
async function pickC(i){S.ci=i;const c=V.c;$("q").value="";$("ovt").textContent=c.f+" "+c.n;$("ovk").textContent="Choose a state or region.";$("cl").innerHTML='<p class="k">Loading…</p>';
 try{const j=await fetch("https://countriesnow.space/api/v0.1/countries/states",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({country:c.n})}).then(r=>r.json());
  stList=((j.data&&j.data.states)||[]).map(x=>x.name.replace(/ (State|Province|Region|County)$/,"")).sort()}catch(e){stList=[]}
 listS("")}
function listS(q){$("q").style.display="";$("q").placeholder="Search states";const c=V.c;$("cl").innerHTML="";
 const add=(t,fn)=>{const b=document.createElement("button");b.className="ct";b.innerHTML=`<span style="flex:1">${t}</span>`;b.onclick=fn;$("cl").appendChild(b)};
 add("📍 Whole country ("+c.city+")",()=>setPlace(null));
 stList.forEach(n=>{if(n.toLowerCase().includes(q))add(n,()=>pickS(n))});
 add("← Back to countries",()=>{$("q").value="";listC("")})}
async function pickS(n){const c=V.c;$("cl").innerHTML='<p class="k">Finding '+n+'…</p>';
 try{const j=await jget(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(n)}&count=1&language=en&country_code=${c.cc}`);
  const r=j.results&&j.results[0];if(!r)throw 0;setPlace({n,st:1,lat:r.latitude,lon:r.longitude})}
 catch(e){$("cl").innerHTML='<p class="k">Could not find that place. Try another.</p>';setTimeout(()=>listS(""),1500)}}
$("q").oninput=e=>{const q=e.target.value.toLowerCase();$("ovt").textContent.startsWith("Where")?listC(q):listS(q)};
$("cb").onclick=()=>{$("q").value="";listC("");$("ov").classList.add("on")};

/* Estimator */
function chips(id,arr,get,set){const el=$(id);el.innerHTML="";arr.forEach((t,i)=>{const b=document.createElement("button");b.className="chip"+(get(i)?" on":"");b.textContent=t;
 b.onclick=()=>{set(i);chips(id,arr,get,set);V.emit()};el.appendChild(b)})}
chips("types",["🎪 Event","⚽ Sports match","🏗️ Build","📸 Outdoor shoot"],i=>S.type==i,i=>S.type=i);
chips("feats",["💡 Lighting","🧰 Equipment","👥 Staffing","🛡️ Insurance"],i=>S.f.has(i),i=>S.f.has(i)?S.f.delete(i):S.f.add(i));
chips("tiers",["Essential","Standard","Premium"],i=>S.tier==i,i=>S.tier=i);
$("size").oninput=e=>{S.size=+e.target.value;V.emit()};
let cur={lo:0,hi:0},raf;
function roll(t){cancelAnimationFrame(raf);const a={...cur},t0=performance.now();
 (function f(n){const k=Math.min(1,(n-t0)/650),e=1-Math.pow(1-k,3);cur.lo=a.lo+(t.lo-a.lo)*e;cur.hi=a.hi+(t.hi-a.hi)*e;
 const txt=V.fmt(cur.lo)+" – "+V.fmt(cur.hi);$("rng").textContent=txt;$("hp").textContent=txt;if(k<1)raf=requestAnimationFrame(f)})(t0)}
V.on(()=>{roll(V.est());$("szv").textContent=S.size;const w=where();
 $("cn").textContent=V.c.f+" "+w+" · "+V.c.cur;$("cn2").textContent=w;$("cb").textContent=V.c.f+" "+(V.place?V.place.n:"Location");
 const r=V.rate();
 $("basis").textContent="Planning estimate for "+w+", adjusted for local price levels"+(r?" and shown in "+V.c.cur+".":".");
 $("conf").style.width=(88-S.f.size*4-(S.tier==2?6:0))+"%";
 const pc=[40,25,20,15],col=["#ff5a3c","#7c4dff","#ffb020","#00c9a7"],nm=["Labor","Materials","Venue","Extras"];let a=0;
 $("dn").style.background="conic-gradient("+pc.map((v,i)=>{const s=a;a+=v;return col[i]+" "+s+"% "+a+"%"}).join(",")+")";
 $("lg").innerHTML=pc.map((v,i)=>`<span><i style="background:${col[i]}"></i>${nm[i]} ${v}%</span>`).join("")});
$("sv").onclick=()=>{$("sv").textContent="✓ Scope saved";setTimeout(()=>$("sv").textContent="Save my scope",1800)};

/* Live data loaders */
async function loadGlobal(){
 try{const j=await jget("https://open.er-api.com/v6/latest/USD");if(j&&j.rates){V.d.fx=j.rates;V.d.fxTime=(j.time_last_update_utc||"").slice(0,16)}}catch(e){}
 try{const j=await jget("https://api.worldbank.org/v2/country/all/indicator/PA.NUS.PPPC.RF?format=json&mrnev=1&per_page=400");
  (j[1]||[]).forEach(x=>{if(x.value!=null){V.d.pl[x.countryiso3code]=x.value;V.d.plYear[x.countryiso3code]=x.date}})}catch(e){}
 V.emit()}

let wxTok=0;
async function loadWx(){const c=V.c,p=V.place;if(!p)return;const tok=++wxTok,F=c.u=="F";V.d.wx=null;V.d.aq=null;V.d.err="";renderLive();
 try{
  const [w,a]=await Promise.all([
   jget(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,wind_speed_10m,precipitation_probability&forecast_days=2&timezone=auto&temperature_unit=${F?"fahrenheit":"celsius"}&wind_speed_unit=${F?"mph":"kmh"}`),
   jget(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${p.lat}&longitude=${p.lon}&current=us_aqi&timezone=auto`).catch(()=>null)]);
  if(tok!=wxTok)return;
  const i0=Math.max(0,w.hourly.time.indexOf(w.current.time.slice(0,13)+":00")),sl=k=>w.hourly[k].slice(i0,i0+24);
  V.d.wx={t:w.current.temperature_2m,w:w.current.wind_speed_10m,rain:w.hourly.precipitation_probability[i0],ht:sl("temperature_2m"),hw:sl("wind_speed_10m"),hr:sl("precipitation_probability"),at:new Date()};
  V.d.aq=a&&a.current?a.current.us_aqi:null;
 }catch(e){if(tok!=wxTok)return;V.d.err="Live weather could not be loaded right now."}
 renderLive()}

/* Live metrics cards */
function sp(a){a=a.filter(v=>v!=null);if(a.length<2)return"";const mn=Math.min(...a),d=(Math.max(...a)-mn)||1;
 return`<svg class="sp" viewBox="0 0 100 36" preserveAspectRatio="none"><polyline points="${a.map((v,i)=>(i/(a.length-1)*100)+","+(32-(v-mn)/d*28)).join(" ")}"/></svg>`}
function renderLive(){const c=V.c,w=V.d.wx,u=c.u,r=V.rate(),pn=V.place?V.place.n:"";
 const card=(t,v,sub,s)=>`<div class="card m"><h3><i class="dot"></i>${t}</h3><div class="v mono">${v}</div>${s||""}<small>${sub}</small></div>`;
 const fx=card("Exchange rate",r?"1 USD = "+r.toLocaleString("en",{maximumFractionDigits:2})+" "+c.cur:"—","Updated daily","");
 if(w){const upd="Updated "+w.at.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  $("mt").innerHTML=card("Weather · "+pn,w.t.toFixed(1)+"°"+u,"Next 24 hours · "+upd,sp(w.ht))+
  card("Air & wind",(V.d.aq!=null?V.d.aq+" AQI":"—"),Math.round(w.w)+(u=="F"?" mph":" km/h")+" wind",sp(w.hw))+
  card("Rain risk",w.rain==null?"—":w.rain+"%","Conditions: <b>"+V.suit()+"</b>",sp(w.hr))+fx}
 else if(V.d.err)$("mt").innerHTML='<div class="card" style="color:var(--mut)">'+V.d.err+"</div>"+fx;
 else $("mt").innerHTML=card("Weather · "+pn,"…","Loading","")+card("Air & wind","…","Loading","")+card("Rain risk","…","Loading","")+fx;
 $("hs").textContent=V.suit();if(V.draw)V.draw()}
V.on(renderLive);

/* Directory and quote drawer (placeholder listings: replace P with your real provider data) */
(function(){const P=[["Northline Productions","NP",.82,["Lighting","Indoor"],0],["Atlas Field Crew","AF",.95,["Outdoor","Equipment"],1],
["Brightwork Studio","BW",1.1,["Staffing","Premium"],0],["Summit & Co.","SC",1.2,["Outdoor","Insurance"],1],
["Lumen Collective","LC",.65,["Lighting","Budget"],0],["Apex Venues Group","AV",1.55,["Indoor","Premium"],0]];
V.draw=function(){const e=V.est(),only=$("fit").checked,ap=$("ap").checked,sv=V.suit();$("bchip").textContent="Budget "+V.fmt(e.lo)+" – "+V.fmt(e.hi);$("ls").innerHTML="";
 let n=0;
 P.forEach(p=>{const mid=e.mid*p[2],fit=mid>=e.lo&&mid<=e.hi;if(fit)n++;if(only&&!fit)return;
 const match=ap&&sv!="—"&&((p[4]&&sv!="Poor")||(!p[4]&&sv!="Great"));
 const d=document.createElement("div");d.className="card pv";
 d.innerHTML=`<div class="av">${p[1]}</div><div class="in"><b>${p[0]}</b><br><small style="color:var(--mut)">📍 ${where()}</small><br>${p[3].map(t=>`<span class="tag">${t}</span>`).join("")}</div>
 <div style="text-align:right"><small style="color:var(--mut)">Estimated price range</small><div class="mono" style="font-weight:700">${V.fmt(mid*.9)} – ${V.fmt(mid*1.1)}</div><span class="bd ${fit?"ok":"no"}">${fit?"Fits your budget":"Outside budget"}</span>${match?'<span class="bd ok">Conditions match</span>':""}<br><button class="btn" style="margin-top:10px;padding:9px 15px">Request quote</button></div>`;
 d.querySelector("button").onclick=()=>quote(p[0]);$("ls").appendChild(d)});
 $("pc").textContent=n;
 if(!$("ls").children.length)$("ls").innerHTML='<div class="card" style="color:var(--mut)">No providers fit this range. Try adjusting the scope.</div>'};
function quote(name){const s=V.s,e=V.est(),T=["Event","Sports match","Build","Outdoor shoot"],F=["Lighting","Equipment","Staffing","Insurance"],R=["Essential","Standard","Premium"];
 const feats=[...s.f].map(i=>F[i]).join(", ")||"None";
 $("drb").innerHTML=`<h2>Request a quote</h2><p class="k">${name}</p><div class="rc"><div><span>Project</span><b>${T[s.type]}</b></div><div><span>Scale</span><b>${s.size}</b></div><div><span>Features</span><b>${feats}</b></div><div><span>Tier</span><b>${R[s.tier]}</b></div><div><span>Location</span><b>${V.c.f} ${where()}</b></div><div><span>Budget</span><b class="mono">${V.fmt(e.lo)} – ${V.fmt(e.hi)}</b></div></div>
 <textarea rows="3" id="msg" placeholder="Add a message (optional)"></textarea><button class="btn" id="snd" style="width:100%">Open email with my scope</button><button class="btn g" id="cls" style="width:100%;margin-top:8px">Close</button>`;
 $("dr").classList.add("on");$("cls").onclick=()=>$("dr").classList.remove("on");
 $("snd").onclick=()=>{const body=`Hello ${name},\n\nI'd like a quote for:\nProject: ${T[s.type]}\nScale: ${s.size}\nFeatures: ${feats}\nTier: ${R[s.tier]}\nLocation: ${where()}\nBudget: ${V.fmt(e.lo)} – ${V.fmt(e.hi)}\n\n${$("msg").value}`;
  const a=document.createElement("a");a.href="mailto:"+QUOTE_TO+"?subject="+encodeURIComponent("Quote request: "+T[s.type])+"&body="+encodeURIComponent(body);a.target="_blank";document.body.appendChild(a);a.click();a.remove();
  $("drb").innerHTML=`<div style="text-align:center;padding-top:40px"><div style="font-size:64px">✉️</div><h2>Your email is ready</h2><p class="k">Your email app should have opened with the scope filled in. If nothing opened, copy the text below.</p><textarea rows="9" readonly>${body}</textarea><br><button class="btn" id="c2">Done</button></div>`;$("c2").onclick=()=>$("dr").classList.remove("on")}}
$("fit").onchange=V.draw;$("ap").onchange=V.draw;$("dr").onclick=e=>{if(e.target.id=="dr")$("dr").classList.remove("on")}})();

/* Effects */
try{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".rv").forEach(el=>io.observe(el))}catch(e){document.querySelectorAll(".rv").forEach(el=>el.classList.add("in"))}
document.addEventListener("pointermove",e=>{const c=e.target.closest&&e.target.closest(".card");if(c){const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")}});
document.querySelectorAll("[data-n]").forEach(el=>{const n=+el.dataset.n,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400);el.textContent=Math.round(n*(1-Math.pow(1-k,3))).toLocaleString()+"+";if(k<1)requestAnimationFrame(f)})(t0)});

/* Start */
V.emit();loadCountries();loadGlobal();setInterval(loadWx,600000);
