!function(e){var t={};function a(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=t,a.d=function(e,t,s){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(s,i,function(t){return e[t]}.bind(null,i));return s},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=1)}([function(e,t,a){},function(e,t,a){"use strict";a.r(t);a(0);function s(e,t){const a=[];return e<t&&a.push("top"),e>=t**2-t&&a.push("bottom"),e%t==0&&a.push("left"),e%t==t-1&&a.push("right"),2===a.length?`${a[0]}-${a[1]}`:1===a.length?a[0]:"center"}function i(e){return[e%8,Math.floor(e/8)]}function r(e,t){if(e){const a=i(e.position),s=i(t),r=Math.abs(a[0]-s[0]),n=Math.abs(a[1]-s[1]);if(0===n&&r<=e.speed)return!0;if(0===r&&n<=e.speed)return!0;if(r===n&&r<=e.speed)return!0}return!1}function n(e,t){if(e){const a=i(e.position),s=i(t),r=Math.abs(a[0]-s[0]),n=Math.abs(a[1]-s[1]);if(r<=e.attackRange&&n<=e.attackRange)return!0}return!1}class l{constructor(){this.boardSize=8,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[]}bindToDOM(e){if(!(e instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=e}drawUi(e){this.checkBinding(),this.container.innerHTML='\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      <div class="board-container">\n        <div data-id="board" class="board"></div>\n      </div>\n    ',this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),this.newGameEl.addEventListener("click",e=>this.onNewGameClick(e)),this.saveGameEl.addEventListener("click",e=>this.onSaveGameClick(e)),this.loadGameEl.addEventListener("click",e=>this.onLoadGameClick(e)),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl.classList.add(e);for(let e=0;e<this.boardSize**2;e+=1){const t=document.createElement("div");t.classList.add("cell","map-tile",`map-tile-${s(e,this.boardSize)}`),t.addEventListener("mouseenter",e=>this.onCellEnter(e)),t.addEventListener("mouseleave",e=>this.onCellLeave(e)),t.addEventListener("click",e=>this.onCellClick(e)),this.boardEl.appendChild(t)}this.cells=Array.from(this.boardEl.children)}redrawPositions(e){for(const e of this.cells)e.innerHTML="";for(const a of e){const e=this.boardEl.children[a.position],s=document.createElement("div");s.classList.add("character",a.character.type);const i=document.createElement("div");i.classList.add("health-level");const r=document.createElement("div");r.classList.add("health-level-indicator",`health-level-indicator-${t=a.character.health,t<15?"critical":t<50?"normal":"high"}`),r.style.width=`${a.character.health}%`,i.appendChild(r),s.appendChild(i),e.appendChild(s)}var t}addCellEnterListener(e){this.cellEnterListeners.push(e)}addCellLeaveListener(e){this.cellLeaveListeners.push(e)}addCellClickListener(e){this.cellClickListeners.push(e)}addNewGameListener(e){this.newGameListeners.push(e)}addSaveGameListener(e){this.saveGameListeners.push(e)}addLoadGameListener(e){this.loadGameListeners.push(e)}onCellEnter(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellEnterListeners.forEach(e=>e.call(null,t))}onCellLeave(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellLeaveListeners.forEach(e=>e.call(null,t))}onCellClick(e){const t=this.cells.indexOf(e.currentTarget);this.cellClickListeners.forEach(e=>e.call(null,t))}onNewGameClick(e){e.preventDefault(),this.newGameListeners.forEach(e=>e.call(null))}onSaveGameClick(e){e.preventDefault(),this.saveGameListeners.forEach(e=>e.call(null))}onLoadGameClick(e){e.preventDefault(),this.loadGameListeners.forEach(e=>e.call(null))}static showError(e){alert(e)}static showMessage(e){alert(e)}selectCell(e,t="yellow"){this.deselectCell(e),this.cells[e].classList.add("selected",`selected-${t}`)}deselectCell(e){const t=this.cells[e];t.classList.remove(...Array.from(t.classList).filter(e=>e.startsWith("selected")))}showCellTooltip(e,t){this.cells[t].title=e}hideCellTooltip(e){this.cells[e].title=""}showDamage(e,t){return new Promise(a=>{const s=this.cells[e],i=document.createElement("span");i.textContent=t,i.classList.add("damage"),s.appendChild(i),i.addEventListener("animationend",()=>{s.removeChild(i),a()})})}setCursor(e){this.boardEl.style.cursor=e}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}}var o={prairie:"prairie",desert:"desert",arctic:"arctic",mountain:"mountain"};class h{constructor(e){if(this.level=e,this.health=100,"Character"===new.target.name)throw new Error("Нельзя создать объект класса Character!")}}class c{constructor(e,t){if(!(e instanceof h))throw new Error("character must be instance of Character or its children");if("number"!=typeof t)throw new Error("position must be a number");this.character=e,this.position=t}}class d extends h{constructor(e){super(e),this.type="swordsman",this.attack=40,this.defence=10,this.attackRange=1,this.speed=4}}class m extends h{constructor(e){super(e),this.type="bowman",this.attack=25,this.defence=25,this.attackRange=2,this.speed=2}}class u extends h{constructor(e){super(e),this.type="magician",this.attack=10,this.defence=40,this.attackRange=4,this.speed=1}}class p extends h{constructor(e){super(e),this.type="daemon",this.attack=10,this.defence=40,this.attackRange=4,this.speed=1}}class f extends h{constructor(e){super(e),this.type="undead",this.attack=25,this.defence=25,this.attackRange=1,this.speed=4}}class v extends h{constructor(e){super(e),this.type="vampire",this.attack=40,this.defence=10,this.attackRange=2,this.speed=2}}function w(e,t){return Math.floor(Math.random()*(t-e))+e}function b(e,t){return 8*Math.floor(8*Math.random())+w(e,t)}function C(e,t,a){const s=[];for(let i=0;i<a;i+=1){let a=b(e,t);for(;-1!==s.indexOf(a);)a=b(e,t);s.push(a)}return s}function*g(e,t){const a=w(1,t+1),{type:s}=e[w(0,e.length)];switch(s){case"swordsman":yield new d(a);break;case"bowman":yield new m(a);break;case"magician":yield new u(a);break;case"daemon":yield new p(a);break;case"undead":yield new f(a);break;case"vampire":yield new v(a)}}function y(e,t,a){const s=[];for(let i=0;i<a;i+=1)s[i]=g(e,t).next().value;return s}function L(e,t){let a=[];return"user"===e&&(a=C(0,2,[...t].length)),"war"===e&&(a=C(6,8,[...t].length)),[...t].forEach((e,t)=>{e.position=a[t]}),t}class k{constructor(e,t,a){"user"===e&&(this.team=y([{type:"swordsman"},{type:"bowman"}],t,a)),"war"===e&&(this.team=y([{type:"daemon"},{type:"undead"},{type:"vampire"}],t,a))}*[Symbol.iterator](){this.team.sort((e,t)=>t.attack+t.attackRange-e.attack-e.attackRange);for(let e=0;e<this.team.length;e+=1)yield this.team[e]}filter(){this.team=this.team.filter(e=>e.health>0)}count(){return this.team.length}}class E{static from(e){if(e){const t=new k("user",1,e.userTeam.team.length);e.userTeam.team.forEach((e,a)=>{t.team[a]=g([e],1).next().value,t.team[a].attack=e.attack,t.team[a].defence=e.defence,t.team[a].health=e.health,t.team[a].level=e.level,t.team[a].position=e.position});const a=new k("war",1,e.userTeam.team.length);return e.warTeam.team.forEach((e,t)=>{a.team[t]=g([e],1).next().value,a.team[t].attack=e.attack,a.team[t].defence=e.defence,a.team[t].health=e.health,a.team[t].level=e.level,a.team[t].position=e.position}),{userTeam:t,warTeam:a,step:e.step,score:e.score,hiScore:e.hiScore,level:e.level}}return{userTeam:L("user",new k("user",1,2)),warTeam:L("war",new k("war",1,2)),step:0,score:0,hiScore:0,level:1}}}var M={auto:"auto",pointer:"pointer",crosshair:"crosshair",notallowed:"not-allowed"};const G=new l;G.bindToDOM(document.querySelector("#game-container")),new class{constructor(e,t){this.gamePlay=e,this.stateService=t}init(){this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)),this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this)),this.gamePlay.addCellClickListener(this.onCellClick.bind(this)),this.gamePlay.addNewGameListener(this.newGame.bind(this)),this.gamePlay.addSaveGameListener(this.saveGame.bind(this)),this.gamePlay.addLoadGameListener(this.loadGame.bind(this)),this.loadGame()}newGame(){const{hiScore:e}=this.state;this.state=E.from({}),this.state.hiScore=e,this.gamePlay.drawUi(o.prairie),this.redrawPositions()}saveGame(){this.stateService.save(this.state)}loadGame(){this.state=E.from(this.stateService.load()),this.gamePlay.drawUi(o.prairie),this.redrawPositions()}onCellClick(e){if(this.state.step%2==1)return;const t=this.targetChar(e);t?["bowman","swordsman","magician"].includes(t.type)?(this.selectCharacter&&this.gamePlay.deselectCell(this.selectCharacter.position),this.gamePlay.selectCell(e),this.selectCharacter=t):n(this.selectCharacter,e)?this.attacked(e):l.showError("Нельзя выбрать персонажа противника!"):r(this.selectCharacter,e)&&this.moved(e)}onCellEnter(e){if(this.state.step%2==1)return;const t=this.targetChar(e);var a;t&&this.gamePlay.showCellTooltip(`🎖${(a=t).level} ⚔${a.attack} 🛡${a.defence} ❤${a.health}`,e);const s=function(e,t,a){let s="auto";return a&&["undead","daemon","vampire"].includes(a.type)&&(s="notallowed"),e&&(e.position!==t&&(s="notallowed"),!a&&r(e,t)&&(s="pointer"),a&&["undead","daemon","vampire"].includes(a.type)&&n(e,t)&&(s="crosshair")),a&&["bowman","swordsman","magician"].includes(a.type)&&(s="pointer"),s}(this.selectCharacter,e,t);this.gamePlay.setCursor(M[s]);const i=function(e,t,a){let s=!1;return e&&(e.position!==t&&(s=!1),!a&&r(e,t)&&(s="green"),a&&["undead","daemon","vampire"].includes(a.type)&&n(e,t)&&(s="red")),e===a&&(s=!1),s}(this.selectCharacter,e,t);i&&this.gamePlay.selectCell(e,i)}onCellLeave(e){if(this.state.step%2==1)return;const t=this.targetChar(e);t&&this.gamePlay.hideCellTooltip(e),this.selectCharacter!==t&&this.gamePlay.deselectCell(e)}allCharacters(){return[...this.state.userTeam,...this.state.warTeam]}targetChar(e){return this.allCharacters().filter(t=>t.position===e)[0]}redrawPositions(){const e=[];this.allCharacters().forEach(t=>{e.push(new c(t,t.position))}),this.gamePlay.redrawPositions(e),this.state.step%2==1&&this.computerResponse()}endStep(e,t){this.state.step+=1,this.gamePlay.deselectCell(e),this.gamePlay.deselectCell(t),this.gamePlay.setCursor(M.auto),this.selectCharacter=void 0,this.state.userTeam.filter(),this.state.warTeam.filter(),0===this.state.warTeam.count()&&this.nextLevel(),0===this.state.userTeam.count()&&this.gameOver(),this.redrawPositions()}moved(e){const t=this.selectCharacter.position;this.selectCharacter.position=e,this.endStep(t,e)}async attacked(e){const t=this.targetChar(e),{attack:a,position:s}=this.selectCharacter,i=Math.max(a-t.defence,.1*a);await this.gamePlay.showDamage(e,i).then(),t.health-=i,this.endStep(s,e)}computerResponse(){this.selectCharacter=[...this.state.warTeam][0],this.gamePlay.selectCell(this.selectCharacter.position);const e=[...this.state.userTeam][0];if(n(this.selectCharacter,e.position))this.gamePlay.selectCell(e.position,"red"),this.attacked(e.position);else{const t=i(this.selectCharacter.position),a=i(e.position),s=t[0]-a[0],r=t[1]-a[1];if(Math.abs(s)<=1&&Math.abs(r)>1&&(t[1]-=Math.min(Math.abs(r),this.selectCharacter.speed)*r/Math.abs(r),t[1]===a[1]&&0===s&&(t[1]+=r/Math.abs(r))),Math.abs(r)<=1&&Math.abs(s)>1&&(t[0]-=Math.min(Math.abs(s),this.selectCharacter.speed)*s/Math.abs(s),t[0]===a[0]&&0===r&&(t[0]+=s/Math.abs(s))),Math.abs(s)>1&&Math.abs(r)>1){const e=Math.min(Math.abs(s),Math.abs(r),this.selectCharacter.speed);e===this.selectCharacter.speed?(t[0]-=e*s/Math.abs(s),t[1]-=e*r/Math.abs(r)):Math.abs(s)>Math.abs(r)?(t[0]-=r*s/Math.abs(s),t[1]-=r*r/Math.abs(r)):(t[0]-=s*s/Math.abs(s),t[1]-=s*r/Math.abs(r)),t[0]===a[0]&&t[1]===a[1]&&(t[0]+=s/Math.abs(s),t[1]+=r/Math.abs(r))}const n=t[0]+8*t[1];this.moved(n)}}nextLevel(){if(4===this.state.level)this.gameOver("win");else{[...this.state.userTeam].forEach(e=>{this.state.score+=e.health,e.level+=1,e.health=Math.min(e.health+80,100);const t=e.attack*(1.8-e.health/100);e.attack=Math.max(e.attack,t);const a=e.defence*(1.8-e.health/100);e.defence=Math.max(e.defence,a)});const e=[{type:"swordsman"},{type:"bowman"},{type:"magician"}],t=Math.min(this.state.level,2),a=y(e,this.state.level,t);this.state.userTeam.team=[...this.state.userTeam.team,...a],this.state.userTeam=L("user",this.state.userTeam),this.state.level+=1,this.state.warTeam=L("war",new k("war",this.state.level,this.state.userTeam.count()));const s=["","prairie","desert","arctic","mountain"];this.gamePlay.drawUi(o[s[this.state.level]]),this.state.step=0}}gameOver(e){this.state.step=1,this.state.score>this.state.hiScore&&(this.state.hiScore=this.state.score),"win"===e?l.showMessage(`You win! Your score: ${this.state.score}`):l.showMessage(`You loss! Your score: ${this.state.score}`)}}(G,new class{constructor(e){this.storage=e}save(e){this.storage.setItem("state",JSON.stringify(e))}load(){try{return JSON.parse(this.storage.getItem("state"))}catch(e){throw new Error("Invalid state")}}}(localStorage)).init()}]);