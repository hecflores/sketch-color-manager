declare namespace Sketch {
    interface Context {
      document: MSDocument;
    }
  
    interface MSDocument {
        id:string;
        pages: MSPage[];
        selectedPage: MSPage;
        selectedLayers:MSSelection;
        path:string;
        sharedLayerStyles: MSSharedStyle;
        sharedTextStyles: MSSharedStyle;
    }
    interface MSLayer {
        id:string;
        name: string;
    }
    interface MSGroup extends  MSLayer{
    }
    interface MSPage extends  MSGroup{
    }
    interface MSSelection {
        layers:MSLayer[];
    }
    interface MSSharedStyle {
        
    }
  }