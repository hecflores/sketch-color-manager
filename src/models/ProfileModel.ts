/**
 * Model representing the saved profile state for the user
 *
 * @interface ProfileModel
 */
export class ProfileModel{


    /**
     *
     *
     * @type {ColorThemeModel}
     * @memberof ProfileModel
     */
    themes: ColorThemeCollectionModel = new ColorThemeCollectionModel()


    /**
     *
     *
     * @type {(ColorThemeModel | undefined)}
     * @memberof ProfileModel
     */
    selectedTheme: ColorThemeModel | undefined

}


export class ColorThemeCollectionModel extends Array<ColorThemeModel>
{

    /**
     *
     *
     * @param {String} name
     * @returns {(ColorThemeModel | undefined)}
     * @memberof ColorThemeCollectionModel
     */
    public getTheme(name: String) : ColorThemeModel | undefined{ 
        return this.filter(color => color.name == name)[0]
    }
}

/**
 *
 *
 * @interface ColorThemeModel
 */
export class ColorThemeModel{

    /**
     *
     *
     * @type {string}
     * @memberof ColorModel
     */
    name: string
    colors: ColorModel[]


    /**
     *Creates an instance of ColorThemeModel.
     * @param {string} name
     * @param {(ColorModel[] | undefined)} [initialColors=undefined]
     * @memberof ColorThemeModel
     */
    constructor(name: string, initialColors: ColorModel[] | undefined = undefined){
        this.name = name;
        this.colors = initialColors ?? []
    }


    /**
     * Adds a new color to the theme
     *
     * @param {ColorModel} color
     * @memberof ColorThemeModel
     */
    public addOrUpdateColor(color: ColorModel) : void{
        var found = this.getColor(color.name)
        if(found){
            found.color = color.color
            return
        }

        this.colors.push(color)    
    }

    
    /**
     * Removes color model from the theme
     *
     * @param {ColorModel} color
     * @memberof ColorThemeModel
     */
    public removeColor(color: ColorModel) : void{
        this.colors = this.colors.filter(remove => remove.name == color.name)
    }


    /**
     *
     *
     * @param {String} name
     * @returns {(ColorModel | undefined)}
     * @memberof ColorThemeModel
     */
    public getColor(name: String) : ColorModel | undefined{
        return this.colors.filter(find => find.name == name)[0]
        
    }
}


/**
 *
 *
 * @interface ColorModel
 */
export class ColorModel {
    /**
     *
     *
     * @type {String}
     * @memberof ColorModel
     */
    name: String
    color: String

    constructor(name: String, color: String){
        this.name = name
        this.color = color
    }
}