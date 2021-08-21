const app = {
  data() {
    return {
      url: null,
      videoLinks: null,
      show: false,
      notValidResponse: false,
    };
  },
  methods: {
    async postUrl() {
      const id = this.url.split('/')[this.url.split('/').length - 1];
      const response = await fetch(
        `https://twitter-downloader.herokuapp.com/${id}`
      );
      this.videoLinks = await response.json();
      this.videoLinks.forEach((videoLink) => {
        if ((videoLink.link === 'error') & (videoLink.size === 'error')) {
          this.show = false;
          document.getElementById('footer').className = 'high-margin';
          this.notValidResponse = true;
        } else {
          this.show = true;
          document.getElementById('footer').className = 'low-margin';
          this.notValidResponse = false;
        }
      });
    },
    onClick(videoLink) {
      window.open(videoLink, '_blank');
    },
  },
};
Vue.createApp(app).mount('#app');
