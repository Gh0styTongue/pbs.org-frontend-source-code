import { StationImage } from "../types/api/stations-data";

const getBestStationWhiteLogo = (stationImages: StationImage[]):string | undefined => {
    // The order here matters, they are listed preferentially 
    // first to last and help us get the best image logo 
    const logoProfiles = [
      'white-single-brand-logo',
      'white-cobranded-logo',
      'white-logo'
    ];

    for (let i = 0; i < logoProfiles.length; i++) {
      const currentProfile = logoProfiles[i];
      for (let j=0; j < stationImages.length; j++) {
        const currentImage = stationImages[j]
        if (currentImage.profile === currentProfile) {
          return currentImage.url;
        }
      }
    }
  }

  export { getBestStationWhiteLogo }