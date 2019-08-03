var event_select;
var inputa1;
var inputa2;
var inputa3;
var playbutton;
var frequency_slider;
var real = new Float32Array(2048);
var imag = new Float32Array(2048);
let red_value;
let green_value;
let blue_value;
var max_amp = 1;
var min_amp = -1;


function setup() {
  red_value = color(255, 0, 0);
  green_value = color(0, 255, 0);
  blue_value = color(0, 0, 255);

  real[0] = 1;
  real[1] = 1;
  real[2] = 1;

  var cnv = createCanvas(1000, 600);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);

  frequency_slider = createSlider(0, 500, 440);
  frequency_slider.position(x, y + height - frequency_slider.height - 5);

  inputa1 = createInput();
  inputa1.value(1);
  inputa1.position(frequency_slider.x + frequency_slider.width + 2, frequency_slider.y);

  inputa2 = createInput();
  inputa2.value(1);
  inputa2.position(inputa1.x + inputa1.width + 2, frequency_slider.y);

  inputa3 = createInput();
  inputa3.value(1);
  inputa3.position(inputa2.x + inputa2.width + 2, frequency_slider.y);

  playbutton = createButton('Play');
  playbutton.position(inputa3.x + inputa3.width + 2, frequency_slider.y);
  playbutton.mousePressed(playFourierSynth);

  event_select = createSelect();
  event_select.position(playbutton.x + playbutton.width + 2, frequency_slider.y);
  event_select.option("Interactive");
  event_select.option("Piano");
  event_select.option("Trombone");
  event_select.option("Organ");
  event_select.option("Saw");
  event_select.option("Triangle");
  event_select.option("Bass");
  // event_select.option("Noise");
  event_select.option("Square");
  event_select.option("ChorusStrings");
  event_select.option("Brass");
  event_select.option("Wurlitzer");
  event_select.option("Pulse");


  event_select.changed(change_mode);
}

function draw() {
  background(250);
  line(0, height - 50, width, height - 50);
  textSize(32);
  fre = frequency_slider.value();
  frequency_text = "Frequency: " + str(fre) + "Hz";
  period_text = "Period " + str(((1/fre) * 1000).toFixed(2)) + "ms";
  text(frequency_text, width/2 - 100, 30);
  text(period_text, width/2 - 100, 65);
  textSize(14);
  text("Adjust Frequency ↴", 2, height - 30);
  text("Adjust a1(red) ↴", 150, height - 30);
  text("Adjust a2(green) ↴", 150 + inputa1.width, height - 30);
  text("Adjust a3(blue) ↴", 150 + inputa1.width * 2, height - 30);

  if (inputa1.value() && inputa2.value() && inputa3.value()) {
    draw_data(event_select.value());
  }

  draw_grid(event_select.value());
}

function playFourierSynth() {
  var ac = new AudioContext();
  var osc = ac.createOscillator();

  real[0] = inputa1.value();
  imag[0] = 0;
  real[1] = inputa2.value();
  imag[1] = 0;
  real[2] = inputa3.value();
  imag[2] = 0;

  var wave = ac.createPeriodicWave(real, imag, {disableNormalization: true});

  osc.setPeriodicWave(wave);
  osc.frequency.value = frequency_slider.value();
  osc.connect(ac.destination);
  osc.start();
  osc.stop(0.5);
}

function playFourierSynthInstrument(inst) {
  var ac = new AudioContext();
  var osc = ac.createOscillator();

  const Instrument = inst;
  real = Instrument.real;
  imag = Instrument.imag;

  inputa1.value(real[0]);
  inputa2.value(real[1]);
  inputa3.value(real[2]);


  var wave = ac.createPeriodicWave(real, imag, {disableNormalization: true});

  osc.setPeriodicWave(wave);
  osc.frequency.value = frequency_slider.value();
  osc.connect(ac.destination);
  osc.start();
  osc.stop(0.5);
}

function change_mode() {
  if (event_select.value() == "Interactive") {
    playbutton.mousePressed(playFourierSynth);
    inputa1.value(1);
    inputa2.value(1);
    inputa3.value(1);
  } else {
    if (event_select.value() == "Organ") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Organ);});
    } else if (event_select.value() == "Trombone") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Trombone);});
    } else if (event_select.value() == "Brass") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Brass);});
    } else if (event_select.value() == "Piano") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Piano);});
    } else if (event_select.value() == "Saw") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Saw);});
    } else if (event_select.value() == "Square") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Square);});
    } else if (event_select.value() == "Triangle") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Triangle);});
    } else if (event_select.value() == "ChorusStrings") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(ChorusStrings);});
    } else if (event_select.value() == "Bass") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Bass);});
    } else if (event_select.value() == "Noise") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Noise);});
    } else if (event_select.value() == "Pulse") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Pulse);});
    } else if (event_select.value() == "Wurlitzer") {
      playbutton.mousePressed(function() { playFourierSynthInstrument(Wurlitzer);});
    }
  }
}

function draw_grid(mode) {
  freq = frequency_slider.value();
  period = 1/freq;
  //x-axis
  line(0, height/2, width, height/2);
  //y-axis
  line(50, 50, 50, height - 50);
  push();
  translate(0, height/2);
  fill(0);
  triangle(0, 0, 8, 8, 8, -8);
  pop();

  push();
  translate(width, height/2);
  fill(0);
  triangle(-8, -8, -8, 8, 0, 0);
  pop();

  push();
  translate(50, 50);
  fill(0);
  triangle(0, 0, 8, 8, -8, 8);
  pop();

  push();
  translate(50, height - 50);
  fill(0);
  triangle(0, 0, 8, -8, -8, -8);
  pop();

  //draw axis labels and lines

  //x axis influenced by the frequency
  var xlabel = "Time in s"
  textSize(20);
  text(xlabel, width - 90, height/2 - 30);
  for (var i = 0; i < width; i += 50) {
    push();
    translate(i + 50, height/2);
    line(0, -5, 0, 5);
    textSize(10);
    text((((period/10) * i/50) * 1000).toFixed(2), 0, -7)
    pop();
  }

  //y axis influenced by amplitude
  //get highest coefficient
  if (mode == "Interactive") {
    var amp = highest();
    for (var i = 0; i < height - 150; i += 50) {
      push();
      translate(50, 100 + i);
      line(-5, 0, 5, 0);
      textSize(10);
      text(str(amp - ((i/50) * amp/4)), 7, 10);
      pop();
    }
  } else {
    var stepsize = ((abs(max_amp) - abs(min_amp))/8) * 1000
    for (var i = 0; i < height - 150; i += 50) {
      push();
      translate(50, 100 + i);
      line(-5, 0, 5, 0);
      textSize(10);
      text(str(max_amp * 1000 - stepsize * (i/50)), 7, 10);
      pop();
    }
  }
  //var y_label = ""
}

function draw_data(mode) {
  var omega = TWO_PI * frequency_slider.value();

  if (mode == "Interactive") {
    var a1 = inputa1.value();
    var a2 = inputa2.value();
    var a3 = inputa3.value();

    var amp = highest();

    //draw the first three cosine terms
    var cosine1 = draw_cosine(a1, 1 * omega, omega, amp, red_value);
    var cosine2 = draw_cosine(a2, 2 * omega, omega, amp, green_value);
    var cosine3 = draw_cosine(a3, 3 * omega, omega, amp, blue_value);

    draw_added_cosine3(cosine1, cosine2, cosine3);
  } else {
    draw_wave2048(omega);
  }
}

function highest() {
  var max = - Infinity;
  var maxes = new Float32Array(3);
  maxes[0] = inputa1.value();
  maxes[1] = inputa2.value();
  maxes[2] = inputa3.value();
  for(var i = 0; i < maxes.length; i++) {
    if(maxes[i] > max) {
      max = maxes[i];
    }
  }
  return max;
}

function draw_cosine(coeff, om, main_om, main_amp, color) {
  var old_x = 0;
  var old_y = map((coeff * cos(0)), -coeff, coeff, (height/2 - 100) * coeff/main_amp, (-height/2 + 100) * coeff/main_amp);
  var x_map;
  var y;
  var y_map;
  var point_list = [];
  push();
  stroke(color);
  translate(50, height/2);
  //noFill();
  for (var x = 0; x < width - 50; x++) {
    x_map = map(x, 0, width - 50, 0, TWO_PI/main_om);
    y = coeff * cos(om * x_map);
    y_map = map(y, -coeff, coeff, (height/2 - 100) * coeff/main_amp, (-height/2 + 100) * coeff/main_amp);
    line(old_x, old_y, x, y_map);
    old_x = x;
    old_y = y_map;
    point_list.push(y_map);
  }
  pop();
  return point_list;
}

function draw_added_cosine3(list1, list2, list3) {
  push();
  translate(50, height/2);
  var old_x = 0;
  var old_y = list1[0] + list2[0] + list3[0];
  var y;
  for (var x = 0; x < list1.length; x++) {
    y = list1[x] + list2[x] + list3[x];
    line(old_x, old_y, x, y);
    old_x = x;
    old_y = y;
  }
  pop();
}

function draw_wave2048(om) {
  var pointlist = [];
  push();
  translate(50, height/2);
  //get the instrument
  // why does this not work : var inst = window[event_select.value()]; make this global variable
  if (event_select.value() == "Organ") {
    var inst = Organ;
  } else if (event_select.value() == "Trombone") {
    var inst = Trombone;
  } else if (event_select.value() == "Brass") {
    var inst = Brass;
  } else if (event_select.value() == "Piano") {
    var inst = Piano;
  } else if (event_select.value() == "Saw") {
    var inst = Saw;
  } else if (event_select.value() == "Square") {
    var inst = Square;
  } else if (event_select.value() == "Triangle") {
    var inst = Triangle;
  } else if (event_select.value() == "ChorusStrings") {
    var inst = ChorusStrings;
  } else if (event_select.value() == "Bass") {
    var inst = Bass;
  } else if (event_select.value() == "Noise") {
    var inst = Noise;
  } else if (event_select.value() == "Pulse") {
    var inst = Pulse;
  } else if (event_select.value() == "Wurlitzer") {
    var inst = Wurlitzer;
  }
  //calculate the points
  for (var x = 0; x < width - 50; x++) {
    var y = 0;
    x_map = map(x, 0, width - 50, 0, TWO_PI/om);
    for (var i = 0; i < 300; i++) {
      y += inst.real[i] * cos(i * om * x_map) - inst.imag[i] * sin(i * om * x_map);
    }
    pointlist.push(y);
    //console.log(x, y);
  }
  //draw the line
  max_amp = Math.max.apply(Math, pointlist);
  min_amp = Math.min.apply(Math, pointlist);
  for (var i = 0; i < pointlist.length - 1; i++) {
    y1_map = map(pointlist[i], min_amp, max_amp, height/2 - 100, -height/2 + 100);
    y2_map = map(pointlist[i + 1], min_amp, max_amp, height/2 - 100, -height/2 + 100);
    line(i, y1_map, i + 1, y2_map);
    //point(i, y1_map);
  }
  pop();
  //noLoop();
}

function maximum(list) {
  var max = - Infinity;
  for(var i = 0; i < list.length; i++) {
    if(list[i] > max) {
      max = list[i];
    }
  }
  return max;
}

function minimum(list) {
  var max = Infinity;
  for(var i = 0; i < list.length; i++) {
    if(list[i] < min) {
      min = list[i];
    }
  }
  return min;
}
