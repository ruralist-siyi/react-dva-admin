module.exports = {
  plugins: [
    require('autoprefixer')({
      "browsers": [
        ">1%", // 全球超过1%人使用的浏览器
        "last 4 versions", // 所有浏览器兼容到最后四个版本根据CanIUse.com追踪的版本
        "not ie < 9" // 排除IE9以下的浏览器
      ]
    })
  ]
};