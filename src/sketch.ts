


export abstract class SketchContext {
    document: SketchMSDocument | undefined;
  }

  export abstract class SketchMSDocument {
      id:string | undefined;
      pages: SketchMSPage[] | undefined;
      selectedPage: SketchMSPage | undefined;
      selectedLayers:SketchMSSelection | undefined;
      path:string | undefined;
      sharedLayerStyles: SketchMSSharedStyle | undefined;
      sharedTextStyles: SketchMSSharedStyle | undefined;
  }
  export abstract class SketchMSLayer {
      id:string | undefined;
      name: string | undefined;
  }
  export abstract class SketchMSGroup extends  SketchMSLayer{
  }
  export abstract class SketchMSPage extends  SketchMSGroup{
  }
  export abstract class SketchMSSelection {
      layers:SketchMSLayer[] | undefined;
  }
  export abstract class SketchMSSharedStyle {
      
  }
  