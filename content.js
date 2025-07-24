console.log("Better 42 loaded");

window.addEventListener('load', function() {
  
  const btn = document.createElement('button');
  btn.id = 'theme-switcher';
  btn.innerHTML = 'Light';
  
  let isDark = true;
  
  function updateLogtime() {
      const elements = document.querySelectorAll('[style*="rgba(0, 186, 188,"]');
      
      elements.forEach(el => {
          const style = el.getAttribute('style');
          const match = style.match(/rgba\(0, 186, 188, ([\d.]+)\)/);
          if (match) {
              const opacity = match[1];
              const newStyle = style.replace(/rgba\(0, 186, 188, [\d.]+\)/, `rgba(92, 5, 143, ${opacity})`);
              el.setAttribute('style', newStyle);
          }
      });
  }
  
  function restoreLogtime() {
      const elements = document.querySelectorAll('[style*="rgba(92, 5, 143,"]');
      
      elements.forEach(el => {
          const style = el.getAttribute('style');
          const match = style.match(/rgba\(92, 5, 143, ([\d.]+)\)/);
          if (match) {
              const opacity = match[1];
              const newStyle = style.replace(/rgba\(92, 5, 143, [\d.]+\)/, `rgba(0, 186, 188, ${opacity})`);
              el.setAttribute('style', newStyle);
          }
      });
  }
  
  document.body.classList.add('dark-theme');
  updateLogtime();
  
  btn.addEventListener('click', function() {
      if (isDark) {
          document.body.classList.remove('dark-theme');
          btn.innerHTML = 'Dark';
          isDark = false;
          restoreLogtime();
      } else {
          document.body.classList.add('dark-theme');
          btn.innerHTML = 'Light';
          isDark = true;
          updateLogtime();
      }
  });
  document.body.appendChild(btn);
});