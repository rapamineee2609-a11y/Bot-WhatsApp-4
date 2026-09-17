module.exports = {
    // ===== BOT CONFIG =====
    botName: "BotGue",
    owner: ["6281234567890"], // ganti nomor lo (tanpa +)
    prefix: [".", "!", "/", "#"],
    pairing: true,
    phoneNumber: "6281234567890", // nomor bot lo

    // ===== BUTTON CONFIG =====
    useButton: true,
    buttonFooter: "Powered by BotGue",

    // ===== API KEYS =====
    apiKeys: {
        coingecko: "CG-FAX4SrUH1JLkL6KFmhznK9Ca",
        exchangerate: "1d05edefe79a4fe830b54c87",
        ninjas: "ISI_KEY_NINJAS_LO_NANTI"
    },

    // ===== API ENDPOINTS =====
    endpoints: {
        coingecko: "https://api.coingecko.com/api/v3",
        exchangerate: "https://v6.exchangerate-api.com/v6",
        ipapi: "http://ip-api.com/json",
        openmeteo: "https://api.open-meteo.com/v1/forecast",
        geocoding: "https://geocoding-api.open-meteo.com/v1/search",
        equran: "https://equran.id/api/v2",
        zenquotes: "https://zenquotes.io/api/random"
    }
}
