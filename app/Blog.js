import BlogSlider from "./components/BlogSlider";

const slidersData = [{
  id:1,
  video: '/placeholder/placeholder.mp4',
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
}, 
{
  id:2,
  video: '/placeholder/placeholder.mp4',
  description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  mobileFormat: true,

},
{
  id:3,
  video: '/placeholder/placeholder.mp4',
  description: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
}, 
{
  id:4,
  video: '/placeholder/placeholder.mp4',
  description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  mobileFormat: true,

}, 
{
  id:5,
  video: '/placeholder/placeholder.mp4',
  description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae."
}, 
{
  id:6,
  video: '/placeholder/placeholder.mp4',
  description: "Vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
},
{
  id:7,
  video: '/placeholder/placeholder.mp4',
  description: "Vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
}
];

// TO DO : 
// [] handle the marquee;
// [] handle the videos (use mobile version when needed)
// [] 

class Blog {
  constructor() {
    // States
    this.animation = null;

    // DOM Elements
    this.blogLottieAnimation = document.querySelector('.blogHero__lottieAnimation');
    this.blogMarquees = document.querySelectorAll('.blogMarquee__app-marquee');

    this.initLottieAnim();
    this.initSliders();
    this.initMarquees();
  }

  initLottieAnim(){
    // this.animation = lottie.loadAnimation({
    //   container: this.blogLottieAnimation,
    //   renderer: 'svg',
    //   loop: true,
    //   autoplay: false,
    //   path: '../animations/asterism_to_asterisk_black.json'
    // });

    // this.animation.play();
  }

  initSliders() {
    const sliders = document.querySelectorAll('.blogSlider__container');
    sliders.forEach((slider, idx) => {
      new BlogSlider({sliderData: slidersData, container: slider})
    });
  }

  initMarquees(){
    console.log(this.blogMarquees)
  }
}

new Blog();