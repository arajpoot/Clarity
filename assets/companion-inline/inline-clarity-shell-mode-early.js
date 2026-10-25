(function(){
  try {
    var m = localStorage.getItem("clarity_shell_mode_v1");
    if (m !== "landing" && m !== "companion") m = "landing";
    document.documentElement.setAttribute("data-shell-mode", m);
  } catch (e) { document.documentElement.setAttribute("data-shell-mode", "landing"); }
})();
