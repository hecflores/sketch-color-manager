import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import sketch from 'sketch'
const webviewIdentifier = 'sketch-color-manager.webview'

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 240,
    height: 180,
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
    UI.message('UI loaded 6!')
    loadContent =function(){
      var sketch = require('sketch');

      var colorStyles = [];
      var colors = {}
      sketch.getSelectedDocument().pages.forEach(function(page) { page.layers.forEach(processLayer) });

      var numberOfComponents = 0
      function processLayer(layer){
        console.log(JSON.stringify(layer))
        if(layer.fills){
          if(layer.fills.length > 0){
            UI.alert("Found something",JSON.stringify(layer.fills))
            numberOfComponents = 1000
            return
            if(layer.fills[0].fillType == "Color"){
              if(typeof colors[layer.fills[0].color] == "undefined"){
                numberOfComponents += 1
                colors[layer.fills[0].color] = {styles:[]};
              }
            }
          }
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
        if(layer.layers && numberOfComponents < 2){
          layer.layers.forEach(processLayer);
        }
      }

      colorStyles.forEach(function(colorStyle){
        colorStyle.styleTypes.forEach(function(styleType){
          styleType.values.forEach(function(value, index){
            if(typeof colors[value.value] === "undefined"){
              colors[value.value] = {
                color: value.value,
                styles:[]
              }
            }
          })
        })
      })
      UI.message("Found "+Object.keys(colors).length + " unique colors in "+numberOfComponents+" components")
      return colors
    } 
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s)
    setTimeout(function(){
      try{
        var content = loadContent()
        content = JSON.stringify(content)
        webContents
          .executeJavaScript(`setContent(${content})`)
          .catch(console.error)
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
