const tcpClient = require("./tcpClient");

const isTextLegal = async (text) => {
    const urlPattern = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;
    const links = text.match(urlPattern);
    if (links == null) 
        return true;

    // Loop through each link and check its legality
    for (const link of links) {
        const legal = await isLinkLegal(link);
        if (!legal) return false; // If any link is illegal, return false immediately
    }

    return true; // If all links are legal, return true
}

const isLinkLegal = (link) => {
    return new Promise((resolve, reject) => {
        tcpClient.send(link, (err, response) => {
            if (err) {
                reject(err);
            } else {
                // Check if the response indicates a blacklisted link
                resolve(response === "The link is not blacklisted");
            }
        });
    });
}

module.exports = { isTextLegal };
