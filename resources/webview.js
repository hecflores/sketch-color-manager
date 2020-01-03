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
  function generateTextHtml(items){
    var html = "";
    for(var item in items){
      html+= "<div class='item-found'>"+
             "    <div class='item-found-header'>"+
             "         <div class='item-details'>"+item+"</div>"+
             "    </div>"+
             "    <div class='item-found-body' >" + 
             "         <div class='item-found-body-header'>Found "+items[item].styles.length+" items</div>"
             items[item].styles.forEach(function(style){
          html +="     <div class='item-found-body-item'>"+style.displayName+"</div>"
      });
      html+="</div> </div>"
    }
    return html
  }

  var finalHtml = "";
  for(var contentKey in content){
    finalHtml += "<div class='style-find'>"+
                 "   <div class='style-header'>"+content[contentKey].displayName+"</div>"+
                 "   <div class='style-body'>";
    if(content[contentKey].type == "color"){
      finalHtml += generateColorHtml(content[contentKey].results)
    }
    else if(content[contentKey].type == "text"){
      finalHtml += generateTextHtml(content[contentKey].results)
    }
    else{
      throw "Unknown content type "+content[contentKey].type
    }
    finalHtml+="</div>"
    finalHtml+="</div>"
  }
  document.getElementById('findings').innerHTML = "<div>"+finalHtml+"</div>"
}
