import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
const webviewIdentifier = 'sketch-color-manager.webview'
var fiber = require('sketch/async').createFiber()

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
    isCanceled = false
    browserWindow.show()
  })
  
  var loadContent = function(){}
    
    
  

  const webContents = browserWindow.webContents
  
  var isCanceled = false;

  var totalPages = 0
  var reviewedPages = 0

  var totalLayers = 0
  var reviewedLayers = 0

  var totalartboards = 0
  var reviewedartboards = 0
  
  browserWindow.on("closed", () => {
    opened = false;
  });
  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('UI loaded 13!')
    loadContent =function(){
      
      var styleConsumers = [
        {
          name: "fills",
          type:"color",
          displayName: "Fills",
          consume: (consumer, type, id, name, style) => {
            var fills = style.fills ? style.fills : []
            fills.filter(fill => fill.fillType === "Color").forEach((fill, index) => {
              addItem(consumer.name, fill.color, consumer.displayName, type, name, id, index)
            })
          }
        },
        {
          name: "borderColors",
          type:"color",
          displayName: "Border Colors",
          consume: (consumer, type, id, name, style) => {
            var fills = style.borders ? style.borders : []
            fills.filter(fill => fill.fillType === "Color").forEach((fill, index) => {
              addItem(consumer.name, fill.color, consumer.displayName, type, name, id, index)
            })
          }
        },
        {
          name: "borderThickness",
          type:"text",
          displayName: "Border Thickness",
          consume: (consumer, type, id, name, style) => {
            var fills = style.borders ? style.borders : []
            fills.forEach((fill, index) => {
              addItem(consumer.name , fill.thickness, consumer.displayName, type, name, id, index)
            })
          }
        },
        {
          name: "fontSize",
          type:"text",
          displayName: "Font Size",
          consume: (consumer, type, id, name, style) => {
            if(style.fontSize){
              addItem(consumer.name, style.fontSize, consumer.displayName, type, name, id, null)
            }    
          }
        },
        {
          name: "textColor",
          type:"color",
          displayName: "Text Color",
          consume: (consumer, type, id, name, style) => {
            if(style.textColor){
              addItem(consumer.name, style.textColor, consumer.displayName, type, name, id, null)
            }    
          }
        }
      ]

      totalPages = 0
      reviewedPages = 0
      totalLayers = 0
      reviewedLayers = 0
      totalartboards = 0
      reviewedartboards = 0

      var sketch = require('sketch');
      var document = sketch.getSelectedDocument()
      var itemGroups = {}
      var displayItemGroups = {}

      // Add Consumers as item groups
      styleConsumers.forEach(consumer => {
        // Add new item group
        if(typeof itemGroups[consumer.name] == "undefined"){
          itemGroups[consumer.name] = {
            results:{},
            displayName: consumer.displayName,
            type:consumer.type
          }
          displayItemGroups[consumer.name]= {
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
          changed = true
          itemGroups[itemGroup].results[itemId] = {styles:[]};
          displayItemGroups[itemGroup].results[itemId] = {styleCount:0};
        }

        // Add new item detail
        itemGroups[itemGroup].results[itemId].styles.push({
          displayName: type +" | "+name+" | "+typeDisplayName,
          type:type,
          id:id,
          subId: subId
        })
        displayItemGroups[itemGroup].results[itemId].styleCount += 1
      }

      
      function consumeStyle(type, id, name, style){

        styleConsumers.forEach(consumer => {
          consumer.consume(consumer, type, id, name, style)
        })
        
      }

      


      var changed = false
      var isComplete = false
      setTimeout(function(){
        // var fiber = require('sketch/async').createFiber()
        try{
        isComplete = false
        // All pages
        var sketch=document 

        // Add all Shared Layer Styles
        sketch.sharedLayerStyles.forEach(function(style){
          consumeStyle("SharedLayerStyle", style.id, style.name, style.style)
        })

        // Add all Shared Text Styles
        sketch.sharedTextStyles.forEach(function(style){
          consumeStyle("SharedLayerStyle", style.id, style.name, style.style)
        })
        
        totalPages += sketch.pages.length
        // Process all layers in all pages
        document.pages.forEach(function(page) { 
          var layers = page.layers.filter(layer => layer.type != "Artboard" )
          var artboards = page.layers.filter(layer => layer.type == "Artboard" )
          totalLayers += layers.length
          totalartboards += artboards.length

          page.layers.forEach(function(item) { 
            processLayer(item)   
          }) 
          reviewedPages += 1
        });

        
        
        }
        catch(e){
          console.error(e)
          fiber.cleanup();
        }
      }, 1)

      // Show Results
      function showResults(){
        var pagesPercentDone = totalPages == 0 ? 1 : reviewedPages / totalPages
        var layersPercentDone = totalLayers == 0 ? 1 : reviewedLayers / totalLayers
        var artboardsPercentDone = totalartboards == 0 ? 1 : reviewedartboards / totalartboards
        var finalPercentDone = pagesPercentDone * layersPercentDone * artboardsPercentDone

        if(changed){
          var content = JSON.stringify({
            itemGroups:displayItemGroups,
            status:{
              pagesPercentDone: pagesPercentDone,
              layersPercentDone: layersPercentDone,
              artboardsPercentDone: artboardsPercentDone,
              finalPercentDone: finalPercentDone,
              isCanceled: isCanceled,
              isComplete:isComplete
            }
          })
          webContents
            .executeJavaScript(`setContent(${content})`)
            .catch(console.error)
          changed = false
        }
      }

      var stackCount = 0;
      function processLayer(layer){
        stackCount += 1
          // console.log("Processing Layer '"+layer+"'")
          // If Browser closed and we havent canceled, cancel
          if(!opened && !isCanceled){
            isCanceled = true;
          }

          // Handle cancelation
          if(isCanceled){
            return;
          }

          // Consume layer
          consumeStyle("LayerStyle", layer.id, layer.name, layer.style)

          if(layer.type == "Artboard"){
            reviewedartboards +=1
          }
          else{
            reviewedLayers += 1
          }

          showResults()

          // Consume child layers
          setTimeout(function() {
            //var fiber = require('sketch/async').createFiber()
            if(layer.layers && layer.type != "SymbolInstance"){
              var layers = layer.layers.filter(layer => layer.type != "Artboard" )
              var artboards = layer.layers.filter(layer => layer.type == "Artboard" )
              totalLayers += layers.length
              totalartboards += artboards.length

              layer.layers.forEach(processLayer);
            }

            stackCount -= 1
            if(stackCount == 0){
              if(isCanceled){
                UI.message("Canceled...")
              }
              else{
                UI.alert("Done","Done")
              }
              isComplete = true
              fiber.cleanup();  
            }
            //fiber.cleanup()
          }, 1)
          
        }
    } 
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s)
    setTimeout(() => {
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
