Page({
  data: {
    region: ["广东省", "广州市", "天河区"],
    nowTemp: "--",
    nowText: "N/A",
    humidity: "--",
    pressure: "--",
    vis: "--",
    windDir: "--",
    windSpeed: "--",
    windScale: "--",
    icon: "999" // 默认图标编号
  },

  onLoad() {
    // 页面加载时默认查广州天气
    this.getWeather("广州");
  },

  onRegionChange(e) {
    const regionArr = e.detail.value;
    this.setData({ region: regionArr });

    // region[1] 是市级名字
    const city = regionArr[1];
    this.getWeather(city);
  },

  getWeather(cityName) {
    const API_HOST = " ";  
    const API_KEY = " "; 

    wx.request({
      url: `${API_HOST}/geo/v2/city/lookup`,
      method: "GET",
      data: { location: cityName },
      header: { "X-QW-Api-Key": API_KEY },
      success: (res) => {
        if (res.data && res.data.location && res.data.location.length > 0) {
          const cityId = res.data.location[0].id;

          wx.request({
            url: `${API_HOST}/v7/weather/now`,
            method: "GET",
            data: { location: cityId },
            header: { "X-QW-Api-Key": API_KEY },
            success: (res2) => {
              if (res2.data && res2.data.now) {
                const now = res2.data.now;
                this.setData({
                  nowTemp: now.temp,
                  nowText: now.text,
                  humidity: now.humidity,
                  pressure: now.pressure,
                  vis: now.vis,
                  windDir: now.windDir,
                  windSpeed: now.windSpeed,
                  windScale: now.windScale,
                  icon: now.icon   
                });
              }
            }
          });
        }
      }
    });
  }
});
