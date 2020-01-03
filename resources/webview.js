// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', 'Called from the webview')
})

// call the wevbiew from the plugin
window.setContent = (content) => {

  var html = "";
  for(var color in content){
    html+= "<div class='color-found'>"+
           "    <div class='color-found-header'>"+
           "         <div class='color-icon' style='background:"+color+"'></div>"+
           "    </div>"+
           "    <div class='color-found-body'>"
    content[color].styles.forEach(function(style){
        htm+="     <div class='color-found-body-item'>"+style.displayName+"</div>"
    });
    html+="</div></div>"
  }
  

  document.getElementById('answer').innerHTML = html
}
