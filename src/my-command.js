import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import sketch from 'sketch'
const webviewIdentifier = 'sketch-color-manager.webview'

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 500,
    height: 300,
    show: false
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })
  
  var loadContent = function(){}
    
    
  

  const webContents = browserWindow.webContents

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('UI loaded 8!')
    loadContent =function(){
      var sketch = require('sketch');

      var colorStyles = [];
      var globalColors = {}
      var document = sketch.getSelectedDocument()

      function ConsumeStyle(type, id, name, style){
        if(style.fills){
          if(style.fills.length > 0){
            if(style.fills[0].fillType == "Color"){
              if(typeof globalColors[style.fills[0].color] == "undefined"){
                numberOfComponents += 1
                changed = true
                globalColors[style.fills[0].color] = {styles:[]};
              }
              globalColors[style.fills[0].color].styles.push({
                displayName: type +" | "+name+" | fill",
                type:type,
                id:id
              })
            }
          }
        }
      }

      document.sharedLayerStyles.forEach(function(style){
        ConsumeStyle("SharedLayerStyle", style.id, style.name, style.style)
      })
      document.sharedTextStyles.forEach(function(style){
        ConsumeStyle("SharedLayerStyle", style.id, style.name, style.style)
      })

      document.pages.forEach(function(page) { page.layers.forEach(function(item) { 
        processLayer(item) 
        }) });

      var stackCount = 0;
      var numberOfLayersReviewed = 0;
      var numberOfComponents = 0
      var changed = false
      function processLayer(layer){
          stackCount += 1
          numberOfLayersReviewed += 1
          ConsumeStyle("LayerStyle", layer.id, layer.name, layer.style)

          if(changed){
            var content = JSON.stringify(globalColors)
            webContents
              .executeJavaScript(`setContent(${content})`)
              .catch(console.error)
            UI.message("Anylizing... \r\nFound "+Object.keys(globalColors).length + " unique colors in "+numberOfComponents+" components from "+numberOfLayersReviewed+" layers")
            changed = false
          }
          
          setTimeout(function(){
            if(layer.layers && layer.type != "SymbolInstance"){
              layer.layers.forEach(processLayer);
            }
            stackCount -= 1

            if(stackCount == 0){
              UI.alert("Done","Done. \r\nFound "+Object.keys(globalColors).length + " unique colors in "+numberOfComponents+" components from "+numberOfLayersReviewed+" layers")
            }
          }, 1)
          
        }
        
        //if(layer.type == 'ShapePath'){
          
          // colorStyles.push({
          //   targetType: layer.type,
          //   displayName: layer.name,
          //   name: layer.name,
          //   id: layer.id,
          //   styleTypes:[
          //     {
          //       styleType:"fill",
          //       id:"fill",
          //       values:layer.fills ? layer.fills.map(function(fill, index){
          //         return {
          //           id: index,
          //           value: fill.color,
          //           type:fill.fillType
          //         }
          //       }).filter(function(fill){
          //         return fill.type == "Color"
          //       }) : []
          //     }

          //   ]
          // })
        //}
    } 
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s)
    setTimeout(function(){
      try{
        loadContent()
      }
      catch(e){
        console.error(e)
      }
    }, 1)
    
  })

  browserWindow.loadURL(require('../resources/webview.html'))
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}
