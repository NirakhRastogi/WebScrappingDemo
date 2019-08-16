var cheerio = require('cheerio');

module.exports = {


    startScrapping: function (responseData) {
        let $ = cheerio.load(responseData);
        let metaInformation = this.extractOGTags($);
        let imageInformation = this.extraImages($);
        return {
            ...metaInformation,
            "ImageInformation": imageInformation
        }
    },

    extractOGTags: function ($) {

        let head = $('head')[0].children;

        let metaInformation = {};

        let title = "";

        if (head && head != null && head.length > 0) {
            for (let child of head) {
                if (child.name == 'meta') {

                    let key =
                        (child.attribs.property && child.attribs.property != null) ? child.attribs.property :
                            ((child.attribs.name && child.attribs.name != null) ? child.attribs.name : "");

                    if (metaInformation[key] && metaInformation[key] != null) {
                        if (typeof metaInformation[key] == 'array') {
                            metaInformation[key] = [...metaInformation[key], child.attribs.content];
                        } else {
                            metaInformation[key] = [metaInformation[key], child.attribs.content];
                        }
                    } else {
                        metaInformation[key] = child.attribs.content;
                    }
                }
                if (child.name == 'title') {
                    title = child.children[0].data;
                }
            }
        }

        return { "MetaInformation": metaInformation, "PageTitle": title };
    },

    extraImages: function ($) {
        let images = $('img');
        let imageInformation = [{}];
        if (images && images != null) {
            for (let i in images) {
                if (images[i] && images[i] != null && images[i].attribs && images[i].attribs != null) {
                    imageInformation.push({ "Alternate": images[i].attribs.alt, "Source": images[i].attribs.src });
                }
            }
        }
        return imageInformation;
    },

    parseScrappedData: function (data) {
        let metaScrapping = data.MetaInformation;
        let titleScrapping = data.PageTitle;
        let imageScrapping = data.ImageInformation;

        let result = {};

        result["description"] =
            (metaScrapping["og:description"] && metaScrapping["og:description"] != null) ? metaScrapping["og:description"] :
                (metaScrapping["description"] && metaScrapping["description"] != null) ? metaScrapping["description"] : "NA";

        result["title"] = (metaScrapping["og:title"] && metaScrapping["og:title"] != null) ? metaScrapping["og:title"] :
            (metaScrapping["title"] && metaScrapping["title"] != null) ? metaScrapping["title"] :
                (titleScrapping && titleScrapping != null) ? titleScrapping : "NA";

        result["image"] = (metaScrapping["og:image"] && metaScrapping["og:image"] != null) ? metaScrapping["og:image"] : "NA";

        return result;

    }

}
