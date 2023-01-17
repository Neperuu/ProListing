
<template>
  <section class=" relative bg-gradient-to-b from-black to-purple-900 text-white flex flex-col items-center justify-center">
    <Navbar class="bg-transparent pt-10 ml-24 mr-24">
      <template #logo>
        <NavbarLogo image-url="https://flowbite.com/docs/images/logo.svg" link="#" alt="ProListing logo" > 
          <h2 class="text-3xl"> ProListing</h2>
        </NavbarLogo>
      </template>
      <template #right-side> 
        <button type="button" class="flex text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">Get started

      <svg class="w-5 h-5 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
      </svg>
    
        </button>
    </template>
    </Navbar>
    <div class="ml-24 mr-24 mt-10 flex items-center justify-center flex-col text-center pb-52">
      <p class="flex">Introducing ProListing.ai <img class="w-5 h-5 ml-2" src="./static/img/hand-waving-fill-svgrepo-com.svg" alt="Hand waving icon" srcset=""/>
      </p>
      <h1 class="text-5xl w-4/5 p-5">SuperCharge your Amazon Product Listing with the Power of AI!</h1>
      <p class="p-3 w-3/6">Selling online? Create, Optimize and Enhance all your Product Listings with Artifitial Intelligence to 
        <strong class="text-orange-700">SuperCharge Your Listings!</strong>
      </p>
      <div class=" w-3/5 flex text-center space-x-2 p-3">
        <button type="button" class="w-1/2  text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0">
          SuperCharge Your Listing NOW!
        </button>
        <button type="button" class="w-1/2  text-white bg-transparent border-2 border-orange-700 hover:border-white hover:text-orange-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0">
         Request a Demo
        </button>
      </div>    
        <div class="w-2/5 flex items-center justify-center text-center space-x-3 px-3 py-1 mt-10 bg-zinc-800 rounded-md">
        <Rating class="" :rating="5" />
        <p class="text-xs">527 satisfied customers</p>
        <div class="flex ">
          <Avatar class="left-6 z-40" size="xs"   rounded img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"/>
          <Avatar class="left-4 z-30"  size="xs"  rounded img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"/>
          <Avatar class="left-2 z-20" size="xs" rounded img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"/>
          <Avatar class="z-10" size="xs" rounded img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"/>
        </div>
       </div> 
       <div class="w-4/5 flex p-10  space-x-24">
         <div class="flex flex-col text-xs text-left">
            <p><strong>More than 2323 E-Commerce owners</strong></p>
            <p>have already improved their Ecommerce listings with AI!</p>
         </div>
         <div class="flex space-x-4">
           <img class="w-15 h-7" src="./static/img/Amazon_logo.svg" alt="Amazon logo" srcset="">
           <img class="w-15 h-7" src="./static/img/Amazon_logo.svg" alt="Amazon logo" srcset="">
           <img class="w-15 h-7" src="./static/img/Amazon_logo.svg" alt="Amazon logo" srcset="">
         </div>
       </div>  
    </div>
    <div class="absolute w-3/5 -bottom-1/4 overflow-visible border-8 border-black border-opacity-25 ">
        <video autoplay loop muted>
           <source src="./static/vid/Sample-MP4-Video-File-for-Testing.mp4" type="video/mp4" />
           Your browser does not support the video tag.
           </video>
       </div> 
  </section>
  <section class="bg-white h-50 text-black">
    <div class="ml-24 mr-24 pt-72 flex items-center justify-center flex-col text-center">
      <h2 class="text-xl"><strong>Super Charge Your E-Commerce Product Listings with AI:</strong></h2>
      <h2 class="text-xl">Create, Optimize and Enhance Copywriting for Better COnversions and Higher Sales</h2>
      <p class="mt-10">With our cutting-edge Ai software, generate product listings copies in no time to supercharge your sales. our advanced
        algorithms will analyze your listing, identify your target audirnce and optimize the content to appeal to your ideal 
        custumors. Whether you're selling online or on Amazon, our powerful tools will help you creqte listings that are compelling
        and captivating, driving higher conversions and boosting your sales.
      </p>
      <p class="mt-10">So why wait? Get started today and supercharge your product listings with AI!</p>
      <h2 class="text-xl mt-10"><strong>Already trusted by more than 500 Brands</strong></h2>
      <div class="w-2/5 flex items-center justify-center text-center space-x-3 px-3 py-1 mt-10 bg-zinc-200 rounded-md">
        <Rating class="" :rating="5" />
        <p class="text-xs">527 satisfied customers</p>
        <div class="flex ">
          <Avatar class="left-6 z-40" size="xs"   rounded img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"/>
          <Avatar class="left-4 z-30"  size="xs"  rounded img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"/>
          <Avatar class="left-2 z-20" size="xs" rounded img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"/>
          <Avatar class="z-10" size="xs" rounded img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"/>
        </div>
       </div> 
       <div class="w-4/5 flex p-10 items-center justify-center space-x-4">   
           <img class="w-15 h-7" src="./static/img/Amazon_logo.svg" alt="Amazon logo" srcset="">
           <img class="w-15 h-7" src="./static/img/Amazon_logo.svg" alt="Amazon logo" srcset="">
           <img class="w-15 h-7" src="./static/img/Amazon_logo.svg" alt="Amazon logo" srcset="">
           <img class="w-15 h-7" src="./static/img/Amazon_logo.svg" alt="Amazon logo" srcset="">
           <img class="w-15 h-7" src="./static/img/Amazon_logo.svg" alt="Amazon logo" srcset="">
       </div> 
       <button type="button" class="w-2/5 mb-10  text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0">
          SuperCharge Your Listing NOW!
        </button> 
   
    </div>
    <div class="bg-zinc-800 flex items-center justify-center text-center p-10">
      <div class="flex flex-col w-1/5">
        <h1 class="text-4xl text-orange-700">5400+</h1>
        <h2 class="text-xl text-white">Listings generated</h2>
      </div>
      <div class="flex flex-col w-1/5">
        <h1 class="text-4xl text-orange-700">500+</h1>
        <h2 class="text-xl text-white">Trusting Brands</h2>
      </div>
      <div class="flex flex-col w-1/5">
        <h1 class="text-4xl text-orange-700">5</h1>
        <h2 class="text-xl text-white">Languages available</h2>
      </div>
    </div>
    <div class="ml-24 mr-24 pt-20 flex items-center justify-center flex-col text-center">
      <h2 class="text-xl flex"><strong>Your product Listings Copywriting from Hours to Seconds!</strong> 
        <img class="relative w-5 h-5 ml-2 -bottom-1" src="./static/img/clock-stopwatch-svgrepo-com.svg" alt="Clock stopwatch icon" srcset=""/>
      </h2>
      <h2 class="text-xl">Generate a Full listing in less then 30 seconds!</h2>
      <Carousel class="w-4/5 h-full mt-20 mb-20" :slide="true" :slide-interval="4000" :pictures="pictures" :controls="false"></Carousel>
      <h2 class="text-xl flex mt-10"><strong>Our pricing</strong></h2>
      <p class="mt-10">Whether you're a small startup a global brand or an agency, we've got the right plan for you to supercharge your
        product listings with AI.
        Sign up today and choose from a range of monthly plans that include everything you need to optimize your listings and boost your sales.
      </p>
      <p class="mt-10"><strong>so what are you waiting for? Start supercharging NOW!</strong></p>
      <div class="flex space-x-2 mt-10">
        <p>Pay anually and save!</p>
        <div class="flex justify-between items-center" @click="toggleActive = !toggleActive">
            <div class="w-8 h-5 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out" :class="{ 'bg-orange-700': toggleActive}">
            <div class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out" :class="{ 'translate-x-3': toggleActive,}"></div>
                </div>
       </div>
      </div>
      <div class="flex space-x-5 w-4/5 mt-10">
        
        <div class="cursor-pointer flex items-center justify-center flex-col text-center w-1/3 border-2 border-white hover:border-orange-600 rounded-2xl"> 
          <h2 class="text-xl mt-6"><strong>Lite</strong></h2>
          <p>For Beginners</p>
          <p class="text-xl mt-6"><strong>10 Listings</strong></p>
          <ol class="text-sm leading-7">
            <li>SEO optimization</li>
            <li>Title Content</li>
            <li>Bullet Points Content</li>
            <li>Description content</li>
            <li>Export Listing</li>
            <li>Unlimited Revisions</li>
            <li>English Only</li>
          </ol>
          <p class="text-xs mt-16">$<strong class="text-5xl">49</strong>/month</p>
          <p class="text-xs">Billed Annually</p>
          <button type="button" class="w-3/5 mt-10 mb-10 text-orange-600 bg-white border-2 border-orange-600 hover:bg-orange-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0">
          Start Now
        </button> 
        </div>
        <div class=" cursor-pointer flex items-center justify-center flex-col text-center w-1/3 border-2 border-white hover:border-orange-600 rounded-2xl"> 
          <h2 class="text-xl mt-6"><strong>Lite</strong></h2>
          <p>For Beginners</p>
          <p class="text-xl mt-6"><strong>10 Listings</strong></p>
          <ol class="text-sm leading-7">
            <li>SEO optimization</li>
            <li>Title Content</li>
            <li>Bullet Points Content</li>
            <li>Description content</li>
            <li>Export Listing</li>
            <li>Unlimited Revisions</li>
            <li>English Only</li>
          </ol>
          <p class="text-xs mt-16">$<strong class="text-5xl">49</strong>/month</p>
          <p class="text-xs">Billed Annually</p>
          <button type="button" class="w-3/5 mt-10 mb-10 text-orange-600 bg-white border-2 border-orange-600 hover:bg-orange-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0">
          Start Now
        </button> 
        </div>
        <div class=" cursor-pointer flex items-center justify-center flex-col text-center w-1/3 border-2 border-white hover:border-orange-600 rounded-2xl"> 
          <h2 class="text-xl mt-6"><strong>Lite</strong></h2>
          <p>For Beginners</p>
          <p class="text-xl mt-6"><strong>10 Listings</strong></p>
          <ol class="text-sm leading-7">
            <li>SEO optimization</li>
            <li>Title Content</li>
            <li>Bullet Points Content</li>
            <li>Description content</li>
            <li>Export Listing</li>
            <li>Unlimited Revisions</li>
            <li>English Only</li>
          </ol>
          <p class="text-xs mt-16">$<strong class="text-5xl">49</strong>/month</p>
          <p class="text-xs">Billed Annually</p>
          <button type="button" class="w-3/5 mt-10 mb-10 text-orange-600 bg-white border-2 border-orange-600 hover:bg-orange-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-3 md:mr-0">
          Start Now
        </button> 
        </div>
      </div>
    </div>
    
    
     
  </section>
    
</template>
<script setup>
import { Navbar, NavbarLogo, Rating, Avatar, Carousel } from 'flowbite-vue';
const pictures = [
  {
    'src': 'https://i.picsum.photos/id/253/1920/1080.jpg?hmac=VS8GClQ4qjXQVAHOAhICufO17nxlzjDOObvN_BSIyt0',
    'alt': 'Picture 1',
  },
  {
    'src': 'https://i.picsum.photos/id/27/1920/1080.jpg?hmac=G_-bZTX0jNizgP6a00LunndV6A-BueaTryVN-ARrDxA',
    'alt': 'Picture 2',
  },
  {
    'src': 'https://i.picsum.photos/id/570/1920/1080.jpg?hmac=GrPj9g_cV2WHQPt582h1bKvbTSRzDejP6FOf7P20Q8Y',
    'alt': 'Picture 3',
  },
  ];
  let toggleActive = true;
 
</script>