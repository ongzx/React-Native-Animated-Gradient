import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import LinearGradient from 'react-native-linear-gradient';
var {height, width} = Dimensions.get('window');

function incrementColor(color, step) {
  const intColor = parseInt(color.substr(1), 16);
  const newIntColor = (intColor + step).toString(16);
  return `#${'0'.repeat(6 - newIntColor.length)}${newIntColor}`;
};

var colors = new Array(
  [62,35,255],
  [60,255,60],
  [255,35,98],
  [45,175,230],
  [255,0,255],
  [255,128,0]);

var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.002;

const AnimatedGradient = React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    return {
      count: 0,
      colorTop: '#000000',
      colorBottom: '#cccccc',
    }
  },

  RGBToHex(r,g,b) {
    console.log(r);
    console.log(g);
    console.log(b);
    let bin = r << 16 | g << 8 | b;
    return (function(h) {
      return new Array(7-h.length).join("0")+h
    })(bin.toString(16).toUpperCase())
  },

  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  },

  updateGradient() {
    var c0_0 = colors[colorIndices[0]];
    var c0_1 = colors[colorIndices[1]];
    var c1_0 = colors[colorIndices[2]];
    var c1_1 = colors[colorIndices[3]];

    var istep = 1 - step;
    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    var color1 = "rgb("+r1+","+g1+","+b1+")";

    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    var color2 = "rgb("+r2+","+g2+","+b2+")";


    this.setState({
      colorTop: '#' + this.componentToHex(r1) + this.componentToHex(g1) + this.componentToHex(b1),
      colorBottom: '#' + this.componentToHex(r2) + this.componentToHex(g2) + this.componentToHex(b2),
    });
      
    step += gradientSpeed;
    if ( step >= 1 )
    {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];
      
      //pick two new target color indices
      //do not pick the same as the current one
      colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      
    }
  },

  componentDidMount() {
    this.setInterval(() => {
      this.updateGradient();
    }, 10);
  },

  render() {
    return (
      <View style={styles.container}>

        <LinearGradient
          colors={[this.state.colorTop, this.state.colorBottom]}
          style={styles.gradient} />
          
        <Image 
          style={{position:'absolute', width: width, height: height, opacity:0.3, top:0, left:0}}
          source={require('../assets/bg.png')} />

          
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  gradient: {
    width: width,
    height: height,
  },
});

export default AnimatedGradient;
