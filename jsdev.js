
performance.now = performance.now || performance.webkitNow || null;
function $$(n){ return document.getElementById(n);}
function $$$(n){ return document.createElement(n);}
function $js(e,t){var a=document.getElementsByTagName("head")[0],n=document.createElement("script");return n.type="text/javascript",n.src=e,n.onload=t,a.appendChild(n),n};
function x64(n,r){var f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";var n=n.substr(r,2);return 64*f.indexOf(n[0])+f.indexOf(n[1])}
function $s(q){q=q<=0?0.001:q>=1?1:q;return q*q*(3-2*q);}
function $sd(q){q=q<=0?0.001:q>=1?1:q;return q*q;}
function $sm(q){q=q<=0?0.001:q>=1?1:q;return q*q*q*(q*(6*q-15)+10);}
function $sb(q){q=(q<=0?0.001:q>=1?1:q)*5;return 1-(Math.sin(q)/q)*(Math.sin(q)/q);}
function $fs(a,s){for(var i=0;i<a.length;i++)a[i].upd(s);}
npot = THREE.Math.nextPowerOfTwo;

window.onload = function() {
  
  document.body.appendChild( JSDEV.ctx.domElement );
  
  JSDEV.cad.progress();

}


//// JSDEV
//
var JSDEV = new function() {
  
  this.tablet = false;
  
  this.dat = {};
  this.tmr = {};
  
  this.tex = {};
  this.mat = {};
  this.obj = {};
  this.mdl = {};

  this.hud = {};
  this.frm = {};  
  
  this.mp3 = {};
  this.ogg = {};
  
  this.vpWidth = 1;
  this.vpHeight = 1;
  this.DPR = window.devicePixelRatio;
  
  this.cad = new JSDEV_Cadencer();
  this.page = null;
    
  this.ctx = new THREE.WebGLRenderer();
  this.ctx.autoClear = false;
  this.ctx.sortObjects = false;
  this.ctx.setPixelRatio( this.DPR );
  this.ctx.gammaInput = true;
  this.ctx.gammaOutput = true;

  this.ani = this.ctx.getMaxAnisotropy();
  
  
  this.resize = function() {
  
    if(this.vpWidth==window.innerWidth && this.vpHeight==window.innerHeight)
      return;
    
    this.vpWidth = window.innerWidth;
    this.vpHeight = window.innerHeight;
    this.vpAspect = this.vpWidth / this.vpHeight;
    this.tablet = this.vpWidth >= 600;
    this.vpSize = Math.sqrt(this.DPR*(this.vpWidth + this.vpHeight)) / 45;
    this.ctx.setSize( this.vpWidth, this.vpHeight );
    
    if(this.page)
      this.page.resize();
    
  }
  
  this.render = function() {

    JSDEV.resize();
    if(JSDEV.page)
      JSDEV.page.render(); 

  }

  this.open = function(p) {

    $js( p + '.js' );
    
  }
  
  this.show = function() {
    
    this.page.resize();
    this.page.show();
    
  }
  
}

//
// Page
//
function JSDEV_Page() {

  this.pageScn = new THREE.Scene();
  this.pageCam = new THREE.PerspectiveCamera( 45, 1, 1, 50 );

  this.pageResize = function() {
    
    this.cam.aspect = JSDEV.vpAspect;
    this.cam.updateProjectionMatrix();
    
  }
   
  this.pageFree = function() {

    for(var i=this.scn.children.length-1;i>=0;i--)
      this.scn.remove(this.scn.children[i]);
  
  }
  
}
  
//// JSDEV_tHUDControl
//
function JSDEV_tHUDControl(ownpar,dat) {
  
  this.dat = dat || {};
  this.dat.a = dat.a || 'lt';
  this.dat.x = dat.x || 0;
  this.dat.y = dat.y || 0;
  this.dat.dx = dat.dx || 0;
  this.dat.dy = dat.dy || 0;
  this.dat.ss = dat.ss != void 0 ? dat.ss : 1;
  this.dat.dy = dat.dy || 0;
  this.dat.w = dat.w || 0;
  this.dat.h = dat.h || 0;
  
  this.own = ownpar && ownpar.hud ? ownpar : this.hud ? this : ownpar.own ? ownpar.own : null ;
  this.par = ownpar;
  
  if(dat.ondown||dat.onclick)
    JSDEV.input.list.push( this );
  
  this.getQCount = function() { return 0; }
  this.QIndex = 0;
  this.parse = function() {}
  
  this.getPAlignX = function() {
    
    this.palignX = this.par ? this.par.left + 'lcr'.indexOf(this.dat.a[0]) * this.par.width / 2 : 0;
    return this.palignX;
    
  }
  this.getPAlignY = function() {

    this.palignY = this.par ? this.par.top + 'tcb'.indexOf(this.dat.a[1]) * this.par.height / 2 : 0;
    return this.palignY;

  }
  
  this.getPivot = function() {
  
    this.x = ((this.dat.x + this.dat.dx) * .02 || 0) + this.getPAlignX();
    this.y = ((this.dat.y + this.dat.dy) * .02 || 0) + this.getPAlignY();

  }
  this.getBRect = function() {

    this.top = ( this.dat.dx - this.dat.h/2 ) * this.dat.ss * .02 + this.getPAlignY();
    this.left = ( this.dat.dx - this.dat.w/2 ) * this.dat.ss * .02 + this.getPAlignX();
    this.right = ( this.dat.dy + this.dat.w/2 ) * this.dat.ss * .02 + this.palignX;
    this.bottom = ( this.dat.dy + this.dat.h/2 ) * this.dat.ss * .02 + this.palignY;
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
    
  }
   
  this.parseFrm = function() {
    
    var q = {};
    for(var k in this.frm) {
      switch(k.substr(0,4)){
        case 'sprt': q[k.substr(5)] = new JSDEV_HUDSprite(this,this.frm[k]); break;
        case 'img_': q[k.substr(4)] = new JSDEV_HUDImage(this,this.frm[k]); break;
        case 'text': q[k.substr(5)] = new JSDEV_HUDText(this,this.frm[k]); break;
      }
    }
    return q;
    
  }
  
}

//
// HUDPanel
//
function JSDEV_HUDPanel() {
  
  JSDEV_tHUDControl.call(this,null,this.dat);
  
  this.frm = this.frm || {};
  this.buf = {};
  
  this.rescale = function() {
    
    var scl = this.dat.scale || 1;
    if(this.mesh) {
      this.mesh.scale.set( scl / JSDEV.vpAspect, scl, 1 );
      this.mesh.position.set(
        'lcr'.indexOf(this.dat.a[0]) - 1 + (this.dat.x *.02 || 0) / JSDEV.vpAspect,
        1 - 'tcb'.indexOf(this.dat.a[1]) - (this.dat.y *.02 || 0),
        -.999 );
    }        
    
  }  
  
  this.getQCount = function() {
    
    var sz = 1;
    for(var k in this.frm)
      sz += this.frm[k].getQCount();
    return sz;

  }
  
  this.parse = function() {
    
    this.getBRect();
    this.frm = this.parseFrm();
    
    var b = this.buf;
    
    b.QCount = this.getQCount();
    b.QIndex = 1;
    
    b.indices = new Uint16Array( b.QCount * 6 );
    for(var i=0,j=0,c=[0,2,1,2,3,1];i<b.indices.length;i+=6,j+=4)
      for(var k=0;k<6;k++)
        b.indices[i+k] = j+c[k];
    
    b.vert = new Int16Array( b.QCount * 12 );
    b.norm = new Uint8Array( b.QCount * 12 );
    b.tcrd = new Uint16Array( b.QCount * 8 );
    
    for(i=0;i<12;i++) {
      this.own.buf.vert[i] = 0;
      this.own.buf.norm[i] = 0;
    }
    for(i=0;i<8;i++)
      this.own.buf.tcrd[i] = 0;
    
    for(var k in this.frm)
      this.frm[k].parse();
    
    this.mesh = new THREE.Mesh( new THREE.BufferGeometry(), this.mat );
    this.rescale();
    
    var g = this.mesh.geometry;
    g.setIndex( new THREE.BufferAttribute( b.indices, 1 ));
    g.addAttribute( 'position', new THREE.BufferAttribute( b.vert, 3 ));
    g.addAttribute( 'normal', new THREE.BufferAttribute( b.norm, 3 ));
    g.addAttribute( 'uv', new THREE.BufferAttribute( b.tcrd, 2, true ));
   
  }
  
}
JSDEV_HUDPanel.prototype = Object.create(JSDEV_tHUDControl.prototype);

//
// HUDSprite
//
function JSDEV_HUDSprite(par,dat) {
  
  JSDEV_tHUDControl.call(this,par,dat);
  
  _upd(this);
  
  this.getQCount = function() { return 1; }
  
  this.parse = function() {

    this.getPivot();

    this.QIndex = this.own.buf.QIndex;
    this.own.buf.QIndex += 1;

    this.draw();

  }
  
  this.draw = function() {
    
    var p = this.QIndex * 12;
    var gp = this.own.buf.vert;
    
    gp[p+0] = gp[p+6] = (this.x - this.sprt[0] * this.scale) * 8191;
    gp[p+1] = gp[p+4] = (-this.y + this.sprt[1] * this.scale) * 8191;
    gp[p+2] = gp[p+5] = gp[p+8] = gp[p+11] = this.chnl;
    gp[p+3] = gp[p+9] = (this.x - (this.sprt[0] - this.sprt[4]) * this.scale) * 8191;
    gp[p+7] = gp[p+10] = (-this.y + (this.sprt[1] - this.sprt[5]) * this.scale) * 8191;

    if(this.dat.p) {
      var gn = this.own.buf.norm;
      var prm = this.dat.p.length > 0 ? this.dat.p[0] : 0;
      gn[p+0] = gn[p+3] = gn[p+6] = gn[p+9] = prm;
      prm = this.dat.p.length > 1 ? this.dat.p[1] : 0;
      gn[p+1] = gn[p+4] = gn[p+7] = gn[p+10] = prm;
      prm = this.dat.p.length > 2 ? this.dat.p[2] : 0;
      gn[p+2] = gn[p+5] = gn[p+8] = gn[p+11] = prm;
    }
    
    var t = this.QIndex * 8;
    var gt = this.own.buf.tcrd;
    gt[t+0] = gt[t+4] = (this.sprt[2] + (this.dat.flipx ? this.sprt[4] : 0)) * 65535;
    gt[t+1] = gt[t+3] = (1 - this.sprt[3]) * 65535;
    gt[t+2] = gt[t+6] = (this.sprt[2] + (this.dat.flipx ? 0 : this.sprt[4])) * 65535;
    gt[t+5] = gt[t+7] = (1 - this.sprt[3] - this.sprt[5]) * 65535;

  }

  this.upd = function(prm) {
 
    for(var k in prm)
      this.dat[k] = prm[k];
    
    this.getPivot();
    
    _upd(this);
    
    this.draw();
    
    var q = this.own.mesh.geometry.attributes;
    q.position.needsUpdate = true;
    q.normal.needsUpdate = true;
    q.uv.needsUpdate = true;
  
  }  
  
  function _upd(t) {
    
    t.scale = (t.dat.s !== void 0 ? t.dat.s : 1) * (t.dat.ss !== void 0 ? t.dat.ss : 1);
    t.dsz = 1 / t.own.hud.size;
    
    var q = t.own.hud[t.dat.src];
    t.sprt = [];
    for(var i=0;i<q.length-1;i++)
      t.sprt.push( q[i] * t.dsz );
    
    t.chnl = q[q.length-1];
    
  }
  
}
JSDEV_HUDSprite.prototype = Object.create(JSDEV_tHUDControl.prototype);

//
// HUDImage
//
function JSDEV_HUDImage(par,dat) {
  
  JSDEV_tHUDControl.call(this,par,dat);
  
  _upd(this);
  this.size = this.dat.size || (this.dat.sx * this.dat.sy);
  
  this.getQCount = function() {
    
    return this.size;
    
  }

  
  this.parse = function() {

    this.getBRect();
    
    this.QIndex = this.own.buf.QIndex;
    this.own.buf.QIndex += this.getQCount();

    this.draw();

  }
  
  this.draw = function() {
    
    var QIndex = this.QIndex;
    var gp = this.own.buf.vert;
    var gn = this.own.buf.norm;
    var gt = this.own.buf.tcrd;
    var dx0 = this.dat.x * .02;
    var dx = 0;
    var ddw = (this.width - dx * (this.dat.sx-1)) / this.dat.sx;
    var dw = ddw + dx;
    var dy0 = this.dat.y * .02;
    var dh = this.height / this.dat.sy;
    var ddh = (this.height) / this.dat.sy;
    
    for(var i=QIndex*12;i<(QIndex+this.size)*12;i++)
      gp[i] = 0;
    
    for(var j=0;j<this.dat.sy;j++)
      for(var i=0;i<this.dat.sx;i++) {
    
        var p = QIndex * 12;
        
        gp[p+0] = gp[p+6] = (dx0 + this.left + dw*i) * 8191;
        gp[p+1] = gp[p+4] = (this.bottom - dy0 - dh*j) * 8191;
        gp[p+2] = gp[p+5] = gp[p+8] = gp[p+11] = this.chnl;
        gp[p+3] = gp[p+9] = (dx0 + this.left + dw*i + ddw) * 8191;
        gp[p+7] = gp[p+10] = (this.bottom - dy0 - dh*j - ddh) * 8191;
        if(this.dat.p) {
          var prm = this.dat.p.length > 0 ? this.dat.p[0] : 0;
          gn[p+0] = gn[p+3] = gn[p+6] = gn[p+9] = prm;
          prm = this.dat.p.length > 1 ? this.dat.p[1] : 0;
          gn[p+1] = gn[p+4] = gn[p+7] = gn[p+10] = prm;
          prm = this.dat.p.length > 2 ? this.dat.p[2] : 0;
          gn[p+2] = gn[p+5] = gn[p+8] = gn[p+11] = prm;
        }
        
        var t = QIndex * 8;
        gt[t+0] = gt[t+4] = (this.sprt[2]) * 65535;
        gt[t+1] = gt[t+3] = (1 - this.sprt[3]) * 65535;
        gt[t+2] = gt[t+6] = (this.sprt[2] + this.sprt[4]) * 65535;
        gt[t+5] = gt[t+7] = (1 - this.sprt[3] - this.sprt[5]) * 65535;    
      
      QIndex++;
      
    }

  }

  this.upd = function(prm) {
 
    for(var k in prm)
      this.dat[k] = prm[k];
    
    this.getBRect();
    
    _upd(this);
    
    this.draw();
    
    var q = this.own.mesh.geometry.attributes;
    q.position.needsUpdate = true;
    q.normal.needsUpdate = true;
    q.uv.needsUpdate = true;
  
  }  
  
  function _upd(t) {
    
    t.dat.sx = t.dat.sx !== void 0 ? t.dat.sx : 1;
    t.dat.sy = t.dat.sy !== void 0 ? t.dat.sy : 1;
    t.dat.dx = t.dat.dx || 0;
    t.dat.dy = t.dat.dy || 0;
    t.dsz = 1 / t.own.hud.size;
    
    var q = t.own.hud[t.dat.src];
    t.sprt = [];
    for(var i=0;i<q.length-1;i++)
      t.sprt.push( q[i] * t.dsz );
    
    t.chnl = q[q.length-1];
    
  }
  
}
JSDEV_HUDImage.prototype = Object.create(JSDEV_tHUDControl.prototype);

//
// HUDText
//
function JSDEV_HUDText(par,dat) {

  JSDEV_tHUDControl.call(this,par,dat);

  this.size = dat.size || dat.src.length;
  
  _upd(this);
  

  this.getQCount = function() { return this.size;}
  
  this.parse = function() {
    
    this.getPivot();

    this.QIndex = this.own.buf.QIndex;
    this.own.buf.QIndex += this.size;
    
    this.draw();
    
  }
  
  this.draw = function() {

    this.w = this.align=='right' ? this.textWidth() : this.align=='center' ? this.textWidth()/2 : 0;
    
    var hud = this.own.hud;
    var QIndex = this.QIndex;
    var gp = this.own.buf.vert;
    var gn = this.own.buf.norm;
    var gt = this.own.buf.tcrd;
    
    for(var cw=0,i=0;i<this.size;i++) {

      var c = this.txt.charCodeAt(i);
      c = hud['c'+c] ? hud['c'+c] : hud['c126'];
            
      var p = QIndex * 12;
      
      gp[p+0] = gp[p+6] = (this.x + cw - this.w) * 8191;
      gp[p+1] = gp[p+4] = (-this.y - (c[1] - hud.fh) * this.fsz) * 8191;
      gp[p+2] = gp[p+5] = gp[p+8] = gp[p+11] = c[2];
      gp[p+3] = gp[p+9] = (this.x + cw + c[5] * this.fsz - this.w) * 8191;
      gp[p+7] = gp[p+10] = (-this.y - (c[6]+c[1]-hud.fh) * this.fsz) * 8191;
      
      if(this.dat.p) {
        var prm = this.dat.p.length > 0 ? this.dat.p[0] : 0;
        gn[p+0] = gn[p+3] = gn[p+6] = gn[p+9] = prm;
        prm = this.dat.p.length > 1 ? this.dat.p[1] : 0;
        gn[p+1] = gn[p+4] = gn[p+7] = gn[p+10] = prm;
        prm = this.dat.p.length > 2 ? this.dat.p[2] : 0;
        gn[p+2] = gn[p+5] = gn[p+8] = gn[p+11] = prm;
      }
      
      var t = QIndex * 8;
      gt[t+0] = gt[t+4] = c[3] * this.dsz * 65535;
      gt[t+1] = gt[t+3] = (1 - c[4] * this.dsz) * 65535;
      gt[t+2] = gt[t+6] = (c[3] + c[5]) * this.dsz * 65535;
      gt[t+5] = gt[t+7] = (1 - (c[4] + c[6]) * this.dsz) * 65535;
      
      QIndex++;
      cw += this.charWidth( i );
      
    }

  }
  
  this.textWidth = function() {
    
    for(var j=0,i=0;i<this.txt.length-1;i++)
      j += this.charWidth( i );
    
    return j;
    
  }
  
  this.charWidth = function(i) {
    
    var c1 = this.txt.charCodeAt(i);
    var q = this.own.hud;
    c1 = q['c'+c1] ? q['c'+c1] : q['c126'];
    
    if(i<this.txt.length-1) {
      var c2 = this.txt.charCodeAt(i+1);
      c2 = q['c'+c2] ? q['c'+c2] : q['c126'];
      var k = (this.dat.kern==false ? 0 : Math.min(Math.min( c2[7]+c1[11], c2[8]+c1[12] ), Math.min(c2[9]+c1[13], c2[10]+c1[14]))) / this.own.hud.fh;
      return !c1[0] ? 0 : this.fsz * ((this.dat.fix ? c1[0] : c1[5]) + this.charSpace - k * 30);
    } else
      return c1[5] * this.fsz;
    
  }
  
  this.upd = function(prm) {
 
    for(var k in prm)
      this.dat[k] = prm[k];
    
    this.getPivot();
    
    _upd(this);
    
    this.draw();
    
    var q = this.own.mesh.geometry.attributes;
    q.position.needsUpdate = true;
    q.normal.needsUpdate = true;
    q.uv.needsUpdate = true;
  
  }
  
  function _upd(t) {
    
    t.scale = (t.dat.s !== void 0 ? t.dat.s : 1) * (t.dat.ss !== void 0 ? t.dat.ss : 1);
    t.charSpace = t.dat.cs !== void 0 ? t.dat.cs : 0;
    t.align = t.dat.align !== void 0 ? t.dat.align : 'left';
    
    t.fsz = t.scale * .16 / t.own.hud.fh;
    t.dsz = 1 / t.own.hud.size;

    t.txt = t.dat.src || '';
    for(var i=t.txt.length-1;i<t.size;i++)
      t.txt += '~';
    
  }
  
}
JSDEV_HUDText.prototype = Object.create(JSDEV_tHUDControl.prototype);


//
// Cadencer
//
function JSDEV_Cadencer( r ) {
  
  this.fps = new JSDEV_FPS();
  _initTime(this);

  this.init = function() {
    _initTime(this);
    this.fps.init(this.fps);
  }
  this.time = function() {
    this.lastTime = _now();
    this.ct = this.lastTime - this.initTime;
    return this.ct;
  }
  
  this.timers = [];
  this.addTimer = function(dat,callback) {
    var q = new JSDEV_Timer(dat.name||'',dat.wait||0,dat.delta||-1,dat.time||-1,callback,dat.sender||window,dat.prm||{});
    this.timers.push( q );
    return q;
  }
  
  this.tick = function() {

    this.dt = _now() - this.lastTime;
    this.lastTime = _now();
    this.ct = this.lastTime - this.initTime;

    this.fps.DFPS = (1 / this.dt + this.fps.DFPS * 9) / 10;    

    for(var q=_now(),i=this.timers.length-1;i>=0;i--) {
      var t = this.timers[i];

      if(q>t.end) {
        if(t.time>0) {
          t.cbp.st = t.time;
          t.cbp.et = 0;
          t.cb.call( t.cbt, t.cbp );
          this.timers.splice(i,1);
          continue;
        }
        if(t.time<0&&t.delta<0) {
          t.cb.call( t.cbt, t.cbp );
          this.timers.splice(i,1);
          continue;
        }
      }
      if(q>t.cur) {
        t.cur += t.delta<0 ? this.dt : t.delta;
        t.cbp.st = t.cur - t.start;
        t.cbp.et = t.end - t.cur;
        t.cb.call( t.cbt, t.cbp );
      }

    }
    
  }
  
  this.removeTimer = function(n) {
    
    for(var i=0;i<this.timers.length;i++)
      if(this.timers[i].name == n) {
        this.timers.splice(i,1);
        return;
      }
  }
  
  this.progress = function() {
    
    requestAnimationFrame( JSDEV.cad.progress );
    JSDEV.cad.tick();

    if(JSDEV.render)
      JSDEV.render.call( JSDEV );
  }
  
  function _initTime(t){
    t.initTime = _now();
    t.lastTime = t.initTime;
    t.dt = 0;
    t.ct = 0;
  }
  function _now() {
    return performance.now()*.001;
  }
  
}

//
// Timer
//
function JSDEV_Timer(name,wait,delta,time,callback,t,p) {

  this.name = name;
  this.delta = delta;
  this.time = time;

  this.start = performance.now()*.001 + (delta > 0 || time > 0 ? wait : 0);
  this.end = time < 0 ? this.start + (delta < 0 ? wait : wait + delta ) : this.start + time;
  this.cur = this.start + (time < 0 && delta < 0 ? wait : 0) + (delta > 0 ? delta : 0);

  this.cb = callback;
  this.cbt = t;
  this.cbp = p;

}

//
// FPS
// 
function JSDEV_FPS() {
  
  _init(this);
  
  this.init = function() {
    _init(this);
  }
  this.tick = function() {
    this.t0 = _now();
  }
  this.tack = function() {
    var q = _now() - this.t0;
    this.time += q;
    if(JSDEV.ctx.info.render.faces > 0)
      this.save( q );
    this.frame++;
  }
  this.save = function( t ) {
    this.FPS = (1 / t + this.FPS * 9) / 10;
    this.tmin = this.tmin > t ? t : this.tmin;
    this.tmax = this.tmax < t ? t : this.tmax;
    if(this.frame<1e4)
      this.list[this.frame] = t;
  }
  this.get = function() {
    var q = {};
    q.avr = this.frame / this.time; 
    q.med = 1 / _getmed(this);
    q.res = Math.sqrt(( q.med * q.med + q.avr * q.avr )/2);
    q.min = 1 / this.tmax;
    q.max = 1 / this.tmin;
    return q;
  }
  
  function _init(t) {
    t.FPS = 60;
    t.DFPS = 60;
    t.frame = 0;
    t.time = 0;
    t.tmin = 99999;
    t.tmax = 0;    
    t.list = new Array(10000);
  }
  function _getmed(t) {
    var i = ~~(t.frame/2);
    var a = new Array(t.frame);
    for(var j=0;j<t.frame;j++)
      a[j] = t.list[j];
    while(i>0) {
      for(var j=0;j<t.frame;j++) {
        var k = j, T = a[j];
        while(k >= i && a[k-i] > T) {
          a[k] = a[k-i];
          k -= i;
        }
        a[k] = T;
      }
      i = (i==2) ? 1 : ~~(i*5/11);
    }
    i = ~~(t.frame/2);
    return t.frame%2 == 1 ? a[i+1] : (a[i]+a[i+1])/2;
  } 
  function _now() {
    return performance.now()*.001;
  }  
  
}
