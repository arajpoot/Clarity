(function(){
  try {
    // Daily routine first: always prefer landing until user hides
    var m = localStorage.getItem("clarity_shell_mode_v1");
    if (m !== "landing" && m !== "companion") m = "landing";
    // First paint: if never chose companion explicitly this session, landing
    if (!sessionStorage.getItem("clarity_shell_user_choice")) {
      m = "landing";
      try { localStorage.setItem("clarity_shell_mode_v1", "landing"); } catch (e) {}
    }
    document.documentElement.setAttribute("data-shell-mode", m);
  } catch (e) {
    document.documentElement.setAttribute("data-shell-mode", "landing");
  }
})();
