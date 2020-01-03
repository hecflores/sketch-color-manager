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

  function generateColorHtml(items){
    var html = "";
    for(var color in items){
      html+= "<div class='color-found'>"+
             "    <div class='color-found-header'>"+
             "         <div class='color-icon' style='background:"+color+"'></div>"+
             "    </div>"+
             "    <div class='color-found-body' >" + 
             "         <div class='color-found-body-header'>Found "+items[color].styles.length+" items</div>"
             items[color].styles.forEach(function(style){
          html +="     <div class='color-found-body-item'>"+style.displayName+"</div>"
      });
      html+="</div> </div>"
    }
    return html
  }
  
  

  document.getElementById('fills').innerHTML = "<div>"+generateColorHtml(content.fills)+"</div>"
  document.getElementById('borders').innerHTML = "<div>"+generateColorHtml(content.borderColors)+"</div>"
  document.getElementById('fontSizes').innerHTML = "<div>"+generateColorHtml(content.fontSizes)+"</div>"
  document.getElementById('borderThicknesses').innerHTML = "<div>"+generateColorHtml(content.borderThickness)+"</div>"
}
