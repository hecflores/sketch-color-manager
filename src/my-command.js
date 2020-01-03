import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import sketch from 'sketch'
const webviewIdentifier = 'sketch-color-manager.webview'

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 800,
    height: 800,
    show: false,
    resizable:true,
    movable:true,
    alwaysOnTop:true
  }

  const browserWindow = new BrowserWindow(options)
  var opened = false
  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    opened = true
    browserWindow.show()
  })
  
  var loadContent = function(){}
    
    
  

  const webContents = browserWindow.webContents
  
  var isCanceled = false;
  browserWindow.on("closed", () => {
    opened = false;
  });
  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('UI loaded 8!')
    loadContent =function(){
      
      var styleConsumers = [
        {
          name: "fills",
          type:"color",
          displayName: "Fills",
          consume: (type, id, name, style) => {
            var fills = style.fills ? style.fills : []
            fills.filter(fill => fill.fillType === "Color").forEach((fill, index) => {
              addItem(this.displayName, fill.color, this.displayName, type, name, id, index)
            })
          }
        },
        {
          name: "borderColors",
          type:"color",
          displayName: "Border Colors",
          consume: (type, id, name, style) => {
            var fills = style.fills ? style.fills : []
            fills.filter(fill => fill.fillType === "Color").forEach((fill, index) => {
              addItem(this.displayName, fill.color, this.displayName, type, name, id, index)
            })
          }
        },
        {
          name: "borderThickness",
          type:"text",
          displayName: "Border Thickness",
          consume: (type, id, name, style) => {
            var fills = style.fills ? style.fills : []
            fills.filter(fill => fill.fillType === "Color").forEach((fill, index) => {
              addItem(this.displayName, fill.color, this.displayName, type, name, id, index)
            })
          }
        },
        {
          name: "fontSize",
          type:"text",
          displayName: "Font Size",
          consume: (type, id, name, style) => {
            if(style.fontSize){
              addItem(this.displayName, style.fontSize, this.displayName, type, name, id, null)
            }    
          }
        },
        {
          name: "textColor",
          type:"color",
          displayName: "Text Color",
          consume: (type, id, name, style) => {
            if(style.textColor){
              addItem(this.displayName, style.textColor, this.displayName, type, name, id, null)
            }    
          }
        }
      ]


      var sketch = require('sketch');
      var document = sketch.getSelectedDocument()
      var itemGroups = {}

      // Add Consumers as item groups
      styleConsumers.forEach(consumer => {
        // Add new item group
        if(typeof itemGroups[consumer.name] == "undefined"){
          itemGroups[name] = {
            results:{},
            displayName: consumer.displayName,
            type:consumer.type
          }
        }
      })

      function addItem(itemGroup, itemId, typeDisplayName, type, name, id, subId){

        // Add new item group
        if(typeof itemGroups[itemGroup] == "undefined"){
          throw "Unknown item group "+itemGroup
        }

        // Add new item
        if(typeof itemGroups[itemGroup].results[itemId] == "undefined"){
          numberOfComponents += 1
          changed = true
          itemGroups[itemGroup].results[itemId] = {styles:[]};
        }

        // Add new item detail
        itemGroups[itemGroup].results[itemId].styles.push({
          displayName: type +" | "+name+" | "+typeDisplayName,
          type:type,
          id:id,
          subId: subId
        })
      }

      
      function consumeStyle(type, id, name, style){

        styleConsumers.forEach(consumer => {
          consumer.consume(type, id, name, style)
        })
        
      }

      // Add all Shared Layer Styles
      document.sharedLayerStyles.forEach(function(style){
        consumeStyle("SharedLayerStyle", style.id, style.name, style.style)
      })

      // Add all Shared Text Styles
      document.sharedTextStyles.forEach(function(style){
        consumeStyle("SharedLayerStyle", style.id, style.name, style.style)
      })


      // Process all layers in all pages
      document.pages.forEach(function(page) { page.layers.forEach(function(item) { 
        processLayer(item) 
        }) });

      var stackCount = 0;
      var numberOfLayersReviewed = 0;
      var numberOfComponents = 0
      var changed = false
      function processLayer(layer){
          if(!opened && !isCanceled){
            isCanceled = true;
            UI.message("Canceled... \r\nFound "+Object.keys(itemGroups).length + " unique colors in "+numberOfComponents+" components from "+numberOfLayersReviewed+" layers")
            return;
          }
          stackCount += 1
          numberOfLayersReviewed += 1
          consumeStyle("LayerStyle", layer.id, layer.name, layer.style)

          if(changed){
            var content = JSON.stringify(itemGroups)
            webContents
              .executeJavaScript(`setContent(${content})`)
              .catch(console.error)
            UI.message("Anylizing... \r\nFound "+Object.keys(itemGroups).length + " unique colors in "+numberOfComponents+" components from "+numberOfLayersReviewed+" layers")
            changed = false
          }
          
          setTimeout(function(){
            if(layer.layers && layer.type != "SymbolInstance"){
              layer.layers.forEach(processLayer);
            }
            stackCount -= 1

            if(stackCount == 0){
              UI.alert("Done","Done. \r\nFound "+Object.keys(itemGroups).length + " unique colors in "+numberOfComponents+" components from "+numberOfLayersReviewed+" layers")
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
