import React, { Component } from 'react';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
 apiKey: '0a978c92dbd445efa8212c2e44a2cd30'
});

const particlesOptions={
  "particles": {
    "number": {
      "value": 35,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.2,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 3,
        "opacity_min":1,
        "sync": true
      }
    },
    "size": {
      "value": 7,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 80,
        "size_min": 0.1,
        "sync": true
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 250,
      "color": "#ffffff",
      "opacity": .5,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 7,
      "direction": "top-right",
      "random": false,
      "straight": false,
      "out_mode": "bounce",
      "bounce": false,
      "attract": {
        "enable": true,
        "rotateX": 1600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 800,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 800,
        "size": 80,
        "duration": 2,
        "opacity": 0.8,
        "speed": 3
      },
      "repulse": {
        "distance": 400,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}
class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:[],
      rank:0
    }
  }
  calculateFaceLocation=(data)=>{
    const faces=[];
    const facesNumber=data.outputs[0].data.regions.length;
    for(let i=0;i<facesNumber-1;i++){
      const clarifaiFace=data.outputs[0].data.regions[i].region_info.bounding_box;
      const image=document.getElementById('inputimage');
      const width=Number(image.width);
      const height=Number(image.height);
      faces.push({
        leftCol:clarifaiFace.left_col * width,
        topRow:clarifaiFace.top_row *height,
        rightCol:width-(clarifaiFace.right_col*width),
        bottomRow:height-(clarifaiFace.bottom_row *height)
      })
    }
    return faces;
    //console.log(height,width);
    // return{
    //   leftCol:clarifaiFace.left_col * width,
    //   topRow:clarifaiFace.top_row *height,
    //   rightCol:width-(clarifaiFace.right_col*width),
    //   bottomRow:height-(clarifaiFace.bottom_row *height)
    // }
  }
  displayFaceBox=box=>{
    console.log(box);
    this.setState({box});
    this.setState({rank:this.state.rank+box.length})
  }
  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }
  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=>{
        this.setState({box:{}})
        console.log(err)});
  }
  render(){
    return (
      <div className="App">
        <Particles className="particles"
            params={particlesOptions}
              />
        <Logo />
        <Rank rank={this.state.rank}/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
  
}

export default App;
