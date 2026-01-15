// Media Manager API & Content Service V3 *usually* supply an image asset
// with the image profile of "asset-mezzanine-16x9" ... but not always.
// There is no good way to normalize the data, because users are able to
// use any number of image profiles, so we need to handle our presentation of it.
// This function will first look for the "asset-mezzanine-16x9" profile and return that,
// which is what we want in a video list. If there are no images with that profile
// we then look for any profile that contains "16x9" (e.g. "asset-kids-mezzanine1-16x9").
// After that, we look for the profile "asset-original". If there is no image that meets any
// of those criteria, we return None and a fallback scenario is handled on the front end.
const getBestVideoImage = (images: { [key: string]: string } | null): string | null => {
    if (images !== null) {
        const profiles = Object.keys(images);

        // Return our preferred image profile
        if (profiles.includes("asset-mezzanine-16x9") && images["asset-mezzanine-16x9"].length > 0) {
            return images["asset-mezzanine-16x9"];
        }

        // Return any profile containing "16x9"
        for (const profile of profiles) {
            if (profile.includes("16x9") && images[profile].length > 0) {
                return images[profile];
            }
        }

        // Return the "asset-original" profile
        if (profiles.includes("asset-original")) {
            return images["asset-original"];
        }
    }

    // If no good options, return null
    // TODO: if we wanted to insert a generic fallback image, this would be the place to do it
    return null;
};

export { getBestVideoImage };
