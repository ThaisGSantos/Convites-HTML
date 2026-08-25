/* Trilha sonora contínua entre as páginas do convite */
(function () {
  var SRC = 'assets/musica.mp3', KEY = 'vitoria_music';

  function state() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function save(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  function painelLink() {
    if (document.querySelector('.parents-link')) return;
    if (/painel/i.test(location.pathname)) return;
    var a = document.createElement('a');
    a.className = 'parents-link';
    a.href = 'painel.dc.html';
    a.textContent = '\u25C6';
    a.title = 'Painel dos pais';
    a.setAttribute('aria-label', 'Painel dos pais (senha)');
    a.style.cssText = 'position:fixed;z-index:40;right:max(10px,env(safe-area-inset-right));bottom:max(10px,env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:center;width:44px;height:44px;color:rgba(243,198,90,.34);font:14px/1 Georgia,serif;text-decoration:none;transition:color .3s ease';
    a.addEventListener('mouseenter', function () { a.style.color = 'rgba(243,198,90,.9)'; });
    a.addEventListener('mouseleave', function () { a.style.color = 'rgba(243,198,90,.34)'; });
    document.body.appendChild(a);
  }

  function boot() {
    painelLink();
    if (document.getElementById('bgMusic')) return;

    var st = state();
    var audio = document.createElement('audio');
    audio.id = 'bgMusic';
    audio.src = SRC;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.55;
    document.body.appendChild(audio);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Ligar ou desligar a música');
    btn.title = 'Música';
    btn.textContent = '♪';
    btn.style.cssText = 'position:fixed;z-index:40;left:max(10px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:center;width:46px;height:46px;border:1px solid rgba(243,198,90,.45);border-radius:999px;background:rgba(23,9,33,.6);color:rgba(243,198,90,.8);font:16px/1 Georgia,serif;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:color .3s ease,border-color .3s ease';
    document.body.appendChild(btn);

    function mark() {
      btn.textContent = audio.paused ? '♪' : '♫';
      btn.style.color = audio.paused ? 'rgba(201,169,216,.5)' : 'rgba(243,198,90,.85)';
    }

    audio.addEventListener('loadedmetadata', function () {
      var t = parseFloat(st.time);
      if (t > 0 && t < audio.duration) { try { audio.currentTime = t; } catch (e) {} }
    });
    audio.addEventListener('timeupdate', function () {
      if (!audio.paused) save({ time: audio.currentTime, on: true });
    });
    audio.addEventListener('error', function () { btn.style.display = 'none'; });

    function play() { audio.play().then(mark).catch(mark); }

    btn.addEventListener('click', function () {
      if (audio.paused) { play(); } else { audio.pause(); save({ time: audio.currentTime, on: false }); mark(); }
    });

    if (st.on === false) { mark(); return; }

    audio.play().then(mark).catch(function () {
      mark();
      var kick = function () {
        play();
        ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (ev) {
          document.removeEventListener(ev, kick);
        });
      };
      ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (ev) {
        document.addEventListener(ev, kick, { passive: true });
      });
    });
  }

  if (document.body) { boot(); } else { document.addEventListener('DOMContentLoaded', boot); }
})();
