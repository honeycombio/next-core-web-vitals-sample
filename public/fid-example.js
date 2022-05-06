// Do some JS operations a couple million times to block the main thread.
(function() {

  function useThread(cycles) {
    let count = cycles;
    while (count >= 0) {
      let setup = document.createElement('div');
      let math = Math.PI * Math.random();
      let val = window.innerWidth;
      setup = null;
      math = null;
      val = null;
      count -=1;
    }
    console.log('finished with thread');
  }

  
  useThread(2000000);
})();