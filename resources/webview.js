// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

$(function(){
  window.postMessage('nativeLog', 'Called from the webview')
})


// call the wevbiew from the plugin
window.setContent = (content) => {

  function generateHtml(type, items){
    var html = "";
    for(var item in items){
      html+= "<div class='item-found' render-type='"+type+"'   >"+
             "    <div class='item-found-header'>"+
             "         <div class='item-details' itemValue='"+item+"' style='background:"+item+"'>"+item+"</div>"+
             "    </div>"+
             "    <div class='item-found-body' >" + 
             "         <div class='item-found-body-header'>Found "+items[item].styles.length+" items</div>"
             items[item].styles.forEach(function(style){
          html +="     <div class='item-found-body-item' item-type='"+style.type+"' item-id='"+style.id+"' item-subId='"+style.subId+"'>"+style.displayName+"</div>"
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
    finalHtml += generateHtml(content[contentKey].type, content[contentKey].results)
    finalHtml+="</div>"
    finalHtml+="</div>"
  }
  document.getElementById('findings').innerHTML = finalHtml
}
