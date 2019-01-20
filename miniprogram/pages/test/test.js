Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    imgUrls: [
      "background-image:url('https://img.d2c.cn//2018/08/20/06052867884085f755abbdcb6f945b153f9e50.jpg')",
      "background-image:url('https://img.d2c.cn//2018/08/20/0605309d9328f4babbee3ad853591e7a83b411.jpg')",
      "background-image:url('https://img.d2c.cn//2018/08/20/060538ead6f64b655593d3c33b0322a1186e19.jpg')"
    ],
    sliderIdx: 0
  },
  // 面板指示点的变化
  swiperChange: function (e) {
    let sliderIdx = e.detail.current
    this.setData({
      sliderIdx: sliderIdx
    })
  }
})