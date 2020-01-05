declare namespace Services{
    export abstract class IProfileService {
        /**
         * Get profile data path
         *
         * @returns string
         * @memberof Profile
         */
        abstract getProfileFilePath(): string

        /**
         * Loads latest profile
         *
         * @param {(profile: ProfileModel) => void} callback
         * @memberof Profile
         */
        abstract loadProfile(callback: (profile:  import("../models/ProfileModel").ProfileModel) => void) : void

        /**
         * Saves current profile 
         *
         * @param {() => void} callback
         * @memberof Profile
         */
        abstract saveProfile(callback: () => void):void
    }

}