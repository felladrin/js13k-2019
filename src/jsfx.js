const TAU = +Math.PI * 2;
const bitsPerSample = 16 | 0;
const numChannels = 1 | 0;
const sin = Math.sin;
const pow = Math.pow;
const abs = Math.abs;
const EPSILON = 0.000001;

function U8ToB64(data) {
  const CHUNK = 0x8000;
  let result = "";
  for (let start = 0; start < data.length; start += CHUNK) {
    const end = Math.min(start + CHUNK, data.length);
    result += String.fromCharCode.apply(null, data.subarray(start, end));
  }
  return btoa(result);
}

const AudioContext = window.AudioContext || window.webkitAudioContext;

// uses AudioContext sampleRate or 44100;
function getDefaultSampleRate() {
  if (typeof AudioContext !== "undefined") {
    return new AudioContext().sampleRate;
  }
  return 44100;
}

// for checking pre/post conditions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function clamp(v, min, max) {
  v = +v;
  min = +min;
  max = +max;
  if (v < min) {
    return +min;
  }
  if (v > max) {
    return +max;
  }
  return +v;
}

function clamp1(v) {
  v = +v;
  if (v < +0.0) {
    return +0.0;
  }
  if (v > +1.0) {
    return +1.0;
  }
  return +v;
}

function mapObject(obj, fn) {
  const r = {};
  for (const name in obj) {
    if (obj.hasOwnProperty(name)) {
      r[name] = fn(obj[name], name);
    }
  }
  return r;
}

// uniform random
function runif(scale, offset) {
  let a = Math.random();
  if (scale !== undefined) a *= scale;
  if (offset !== undefined) a += offset;
  return a;
}

function rchoose(gens) {
  return gens[(gens.length * Math.random()) | 0];
}

function getObjectKeys(obj) {
  const r = [];
  for (const name in obj) {
    r.push(name);
  }
  return r;
}

function createFloatArray(N) {
  if (typeof Float32Array === "undefined") {
    const r = new Array(N);
    for (let i = 0; i < r.length; i++) {
      r[i] = 0.0;
    }
  }
  return new Float32Array(N);
}

function createByteArray(N) {
  if (typeof Uint8Array === "undefined") {
    const r = new Array(N);
    for (let i = 0; i < r.length; i++) {
      r[i] = 0 | 0;
    }
  }
  return new Uint8Array(N);
}

function CopyFToU8(into, floats) {
  assert(
    into.length / 2 == floats.length,
    "the target buffer must be twice as large as the iinput"
  );

  let k = 0;
  for (let i = 0; i < floats.length; i++) {
    const v = +floats[i];
    let a = (v * 0x7fff) | 0;
    a = a < -0x8000 ? -0x8000 : 0x7fff < a ? 0x7fff : a;
    a += a < 0 ? 0x10000 : 0;
    into[k] = a & 0xff;
    k++;
    into[k] = a >> 8;
    k++;
  }
}

const jsfx = {};

function CreateWave(data) {
  if (typeof Float32Array !== "undefined") {
    assert(data instanceof Float32Array, "data must be an Float32Array");
  }

  const blockAlign = (numChannels * bitsPerSample) >> 3;
  const byteRate = jsfx.SampleRate * blockAlign;

  const output = createByteArray(8 + 36 + data.length * 2);
  let p = 0;

  // emits string to output
  function S(value) {
    for (let i = 0; i < value.length; i += 1) {
      output[p] = value.charCodeAt(i);
      p++;
    }
  }

  // emits integer value to output
  function V(value, nBytes) {
    if (nBytes <= 0) {
      return;
    }
    output[p] = value & 0xff;
    p++;
    V(value >> 8, nBytes - 1);
  }
  /* beautify preserve:start */
  S("RIFF");
  V(36 + data.length * 2, 4);

  S("WAVEfmt ");
  V(16, 4);
  V(1, 2);
  V(numChannels, 2);
  V(jsfx.SampleRate, 4);
  V(byteRate, 4);
  V(blockAlign, 2);
  V(bitsPerSample, 2);

  S("data");
  V(data.length * 2, 4);
  CopyFToU8(output.subarray(p), data);
  /* beautify preserve:end */

  return output;
}

function CreateAudio(data) {
  const wave = CreateWave(data);
  return new Audio("data:audio/wav;base64," + U8ToB64(wave));
}

// Generates samples using given frequency and generator
function newGenerator(line) {
  return new Function(
    "$",
    "block",
    "" +
      "var TAU = Math.PI * 2;\n" +
      "var sample;\n" +
      "var phase = +$.generatorPhase,\n" +
      "	A = +$.generatorA, ASlide = +$.generatorASlide,\n" +
      "	B = +$.generatorB, BSlide = +$.generatorBSlide;\n" +
      "\n" +
      "for(var i = 0; i < block.length; i++){\n" +
      "	var phaseSpeed = block[i];\n" +
      "	phase += phaseSpeed;\n" +
      "	if(phase > TAU){ phase -= TAU };\n" +
      "	A += ASlide; B += BSlide;\n" +
      "   A = A < 0 ? 0 : A > 1 ? 1 : A;\n" +
      "   B = B < 0 ? 0 : B > 1 ? 1 : B;\n" +
      line +
      "	block[i] = sample;\n" +
      "}\n" +
      "\n" +
      "$.generatorPhase = phase;\n" +
      "$.generatorA = A;\n" +
      "$.generatorB = B;\n" +
      "return block.length;\n" +
      ""
  );
}

function RemoveEmptyParams(params) {
  for (const name in params) {
    if (getObjectKeys(params[name]).length === 0) {
      delete params[name];
    }
  }
}

function EmptyParams() {
  return mapObject(jsfx.Module, function() {
    return {};
  });
}

function InitDefaultParams(params, modules) {
  // setup modules
  for (let i = 0; i < modules.length; i += 1) {
    const M = modules[i];
    const P = params[M.name] || {};

    // add missing parameters
    mapObject(M.params, function(def, name) {
      if (typeof P[name] === "undefined") {
        P[name] = def.D;
      }
    });

    params[M.name] = P;
  }
}

function byStage(a, b) {
  return a.stage - b.stage;
}

function Processor(params, modules) {
  params = params || {};
  modules = modules || jsfx.DefaultModules;

  if (typeof params === "function") {
    params = params();
  } else {
    params = JSON.parse(JSON.stringify(params));
  }
  this.finished = false;

  this.state = {
    SampleRate: params.SampleRate || jsfx.SampleRate
  };

  // sort modules
  modules = modules.slice();
  modules.sort(byStage);
  this.modules = modules;

  // init missing params
  InitDefaultParams(params, modules);

  // setup modules
  for (let i = 0; i < this.modules.length; i += 1) {
    const M = this.modules[i];
    this.modules[i].setup(this.state, params[M.name]);
  }
}
Processor.prototype = {
  //TODO: see whether this can be converted to a module
  generate: function(block) {
    let i;
    for (i = 0 | 0; i < block.length; i += 1) {
      block[i] = 0;
    }
    if (this.finished) {
      return;
    }

    const $ = this.state;
    let N = block.length | 0;
    for (i = 0; i < this.modules.length; i += 1) {
      const M = this.modules[i];
      const n = M.process($, block.subarray(0, N)) | 0;
      N = Math.min(N, n);
    }
    if (N < block.length) {
      this.finished = true;
    }
    for (i = N; i < block.length; i++) {
      block[i] = 0;
    }
  },
  getSamplesLeft: function() {
    let samples = 0;
    for (let i = 0; i < this.state.envelopes.length; i += 1) {
      samples += this.state.envelopes[i].N;
    }
    if (samples === 0) {
      samples = 3 * this.state.SampleRate;
    }
    return samples;
  }
};

jsfx.SampleRate = 0 | 0;
jsfx.Sec = 0 | 0;

jsfx.SetSampleRate = function(sampleRate) {
  jsfx.SampleRate = sampleRate | 0;
  jsfx.Sec = sampleRate | 0;
};
jsfx.SetSampleRate(getDefaultSampleRate());

// MAIN API

// Creates a new Audio object based on the params
// params can be a params generating function or the actual parameters
jsfx.Sound = function(params) {
  const processor = new Processor(params, jsfx.DefaultModules);
  const block = createFloatArray(processor.getSamplesLeft());
  processor.generate(block);
  return CreateAudio(block);
};

// Same as Sounds, but avoids locking the browser for too long
// in case you have a large amount of sounds to generate
jsfx.Sounds = function(library, ondone, onprogress) {
  const audio = {};
  const player = {};
  player._audio = audio;

  const toLoad = [];

  // create playing functions
  mapObject(library, function(_, name) {
    player[name] = function() {
      if (typeof audio[name] !== "undefined") {
        audio[name].currentTime = 0.0;
        audio[name].play();
      }
    };
    toLoad.push(name);
  });

  let loaded = 0;
  const total = toLoad.length;

  function next() {
    if (toLoad.length == 0) {
      ondone && ondone(sounds);
      return;
    }
    const name = toLoad.shift();
    audio[name] = jsfx.Sound(library[name]);
    loaded++;
    onprogress && onprogress(name, loaded, total);

    window.setTimeout(next, 30);
  }
  next();

  return player;
};

// SoundsImmediate takes a named set of params, and generates multiple
// sound objects at once.
jsfx.SoundsImmediate = function(library) {
  const audio = {};
  const player = {};
  player._audio = audio;
  mapObject(library, function(params, name) {
    audio[name] = jsfx.Sound(params);
    player[name] = function() {
      if (typeof audio[name] !== "undefined") {
        audio[name].currentTime = 0.0;
        audio[name].play();
      }
    };
  });
  return player;
};

// FloatBuffer creates a FloatArray filled with audio
jsfx.FloatBuffer = function(params, modules) {
  const processor = new Processor(params, jsfx.DefaultModules);
  const block = createFloatArray(processor.getSamplesLeft());
  processor.generate(block);
  return block;
};

if (typeof AudioContext !== "undefined") {
  // Node creates a new AudioContext ScriptProcessor that outputs the
  // sound. It will automatically disconnect, unless otherwise specified.
  jsfx.Node = function(
    audioContext,
    params,
    modules,
    bufferSize,
    stayConnected
  ) {
    const node = audioContext.createScriptProcessor(bufferSize, 0, 1);
    const gen = new Processor(params, modules || jsfx.DefaultModules);
    node.onaudioprocess = function(ev) {
      const block = ev.outputBuffer.getChannelData(0);
      gen.generate(block);
      if (!stayConnected && gen.finished) {
        // we need to do an async disconnect, otherwise Chrome may
        // glitch
        setTimeout(function() {
          node.disconnect();
        }, 30);
      }
    };
    return node;
  };

  // AudioBuffer creates a buffer filled with the proper audio
  // This is useful, when you want to use AudioContext.BufferSource
  jsfx.AudioBuffer = function(audioContext, params, modules) {
    const processor = new Processor(params, modules || jsfx.DefaultModules);
    const buffer = audioContext.createBuffer(
      numChannels,
      processor.getSamplesLeft(),
      jsfx.SampleRate
    );
    const block = buffer.getChannelData(0);
    processor.generate(block);
    return buffer;
  };

  // Live creates an managed AudioContext for playing.
  // This is useful, when you want to use procedurally generated sounds.
  jsfx.Live = function(library, modules, BufferSize) {
    //TODO: add limit for number of notes played at the same time
    BufferSize = BufferSize || 2048;
    const player = {};

    const context = new AudioContext();
    const volume = context.createGain();
    volume.connect(context.destination);

    player._context = context;
    player._volume = volume;

    mapObject(library, function(params, name) {
      player[name] = function() {
        const node = jsfx.Node(context, params, modules, BufferSize);
        node.connect(volume);
      };
    });

    player._close = function() {
      context.close();
    };

    player._play = function(params) {
      const node = jsfx.Node(context, params, modules, BufferSize);
      node.connect(volume);
    };

    return player;
  };
} else {
  jsfx.Live = jsfx.Sounds;
}

// SOUND GENERATION
jsfx.Module = {};

// generators
jsfx.G = {};

const stage = (jsfx.stage = {
  PhaseSpeed: 0,
  PhaseSpeedMod: 10,
  Generator: 20,
  SampleMod: 30,
  Volume: 40
});

jsfx.InitDefaultParams = InitDefaultParams;

// Generates a stateful sound effect processor
// params can be a function that creates a parameter set
jsfx.Processor = Processor;

// Frequency
jsfx.Module.Frequency = {
  name: "Frequency",
  params: {
    /* beautify preserve:start */
    Start: { L: 30, H: 1800, D: 440 },

    Min: { L: 30, H: 1800, D: 30 },
    Max: { L: 30, H: 1800, D: 1800 },

    Slide: { L: -1, H: 1, D: 0 },
    DeltaSlide: { L: -1, H: 1, D: 0 },

    RepeatSpeed: { L: 0, H: 3.0, D: 0 },

    ChangeAmount: { L: -12, H: 12, D: 0 },
    ChangeSpeed: { L: 0, H: 1, D: 0 }
    /* beautify preserve:end */
  },
  stage: stage.PhaseSpeed,
  setup: function($, P) {
    const SR = $.SampleRate;

    $.phaseParams = P;

    $.phaseSpeed = (P.Start * TAU) / SR;
    $.phaseSpeedMax = (P.Max * TAU) / SR;
    $.phaseSpeedMin = (P.Min * TAU) / SR;

    $.phaseSpeedMin = Math.min($.phaseSpeedMin, $.phaseSpeed);
    $.phaseSpeedMax = Math.max($.phaseSpeedMax, $.phaseSpeed);

    $.phaseSlide = 1.0 + (pow(P.Slide, 3.0) * 64.0) / SR;
    $.phaseDeltaSlide = pow(P.DeltaSlide, 3.0) / (SR * 1000);

    $.repeatTime = 0;
    $.repeatLimit = Infinity;
    if (P.RepeatSpeed > 0) {
      $.repeatLimit = P.RepeatSpeed * SR;
    }

    $.arpeggiatorTime = 0;
    $.arpeggiatorLimit = P.ChangeSpeed * SR;
    if (P.ChangeAmount == 0) {
      $.arpeggiatorLimit = Infinity;
    }
    $.arpeggiatorMod = 1 + P.ChangeAmount / 12.0;
  },
  process: function($, block) {
    let speed = +$.phaseSpeed;
    slide = +$.phaseSlide;
    const deltaSlide = +$.phaseDeltaSlide,
      min = +$.phaseSpeedMin,
      max = +$.phaseSpeedMax;

    let repeatTime = $.repeatTime;
    const repeatLimit = $.repeatLimit;

    let arpTime = $.arpeggiatorTime,
      arpLimit = $.arpeggiatorLimit;
    const arpMod = $.arpeggiatorMod;

    for (let i = 0; i < block.length; i++) {
      slide += deltaSlide;
      speed *= slide;
      speed = speed < min ? min : speed > max ? max : speed;

      if (repeatTime > repeatLimit) {
        this.setup($, $.phaseParams);
        return i + this.process($, block.subarray(i)) - 1;
      }
      repeatTime++;

      if (arpTime > arpLimit) {
        speed *= arpMod;
        arpTime = 0;
        arpLimit = Infinity;
      }
      arpTime++;

      block[i] += speed;
    }

    $.repeatTime = repeatTime;
    $.arpeggiatorTime = arpTime;
    $.arpeggiatorLimit = arpLimit;

    $.phaseSpeed = speed;
    $.phaseSlide = slide;

    return block.length;
  }
};

// Vibrato
jsfx.Module.Vibrato = {
  name: "Vibrato",
  params: {
    /* beautify preserve:start */
    Depth: { L: 0, H: 1, D: 0 },
    DepthSlide: { L: -1, H: 1, D: 0 },

    Frequency: { L: 0.01, H: 48, D: 0 },
    FrequencySlide: { L: -1.0, H: 1, D: 0 }
    /* beautify preserve:end */
  },
  stage: stage.PhaseSpeedMod,
  setup: function($, P) {
    const SR = $.SampleRate;
    $.vibratoPhase = 0;
    $.vibratoDepth = P.Depth;
    $.vibratoPhaseSpeed = (P.Frequency * TAU) / SR;

    $.vibratoPhaseSpeedSlide = 1.0 + (pow(P.FrequencySlide, 3.0) * 3.0) / SR;
    $.vibratoDepthSlide = P.DepthSlide / SR;
  },
  process: function($, block) {
    let phase = +$.vibratoPhase,
      depth = +$.vibratoDepth,
      speed = +$.vibratoPhaseSpeed;

    const slide = +$.vibratoPhaseSpeedSlide,
      depthSlide = +$.vibratoDepthSlide;

    if (depth == 0 && depthSlide <= 0) {
      return block.length;
    }

    for (let i = 0; i < block.length; i++) {
      phase += speed;
      if (phase > TAU) {
        phase -= TAU;
      }
      block[i] += block[i] * sin(phase) * depth;

      speed *= slide;
      depth += depthSlide;
      depth = clamp1(depth);
    }

    $.vibratoPhase = phase;
    $.vibratoDepth = depth;
    $.vibratoPhaseSpeed = speed;
    return block.length;
  }
};

// Generator
jsfx.Module.Generator = {
  name: "Generator",
  params: {
    /* beautify preserve:start */
    // C = choose
    Func: { C: jsfx.G, D: "square" },

    A: { L: 0, H: 1, D: 0 },
    B: { L: 0, H: 1, D: 0 },

    ASlide: { L: -1, H: 1, D: 0 },
    BSlide: { L: -1, H: 1, D: 0 }
    /* beautify preserve:end */
  },
  stage: stage.Generator,
  setup: function($, P) {
    $.generatorPhase = 0;

    if (typeof P.Func === "string") {
      $.generator = jsfx.G[P.Func];
    } else {
      $.generator = P.Func;
    }
    if (typeof $.generator === "object") {
      $.generator = $.generator.create();
    }
    assert(typeof $.generator === "function", "generator must be a function");

    $.generatorA = P.A;
    $.generatorASlide = P.ASlide;
    $.generatorB = P.B;
    $.generatorBSlide = P.BSlide;
  },
  process: function($, block) {
    return $.generator($, block);
  }
};

// Karplus Strong algorithm for string sound
const GuitarBufferSize = 1 << 16;
jsfx.Module.Guitar = {
  name: "Guitar",
  params: {
    /* beautify preserve:start */
    A: { L: 0.0, H: 1.0, D: 1 },
    B: { L: 0.0, H: 1.0, D: 1 },
    C: { L: 0.0, H: 1.0, D: 1 }
    /* beautify preserve:end */
  },
  stage: stage.Generator,
  setup: function($, P) {
    $.guitarA = P.A;
    $.guitarB = P.B;
    $.guitarC = P.C;

    $.guitarBuffer = createFloatArray(GuitarBufferSize);
    $.guitarHead = 0;
    const B = $.guitarBuffer;
    for (let i = 0; i < B.length; i++) {
      B[i] = Math.random() * 2 - 1;
    }
  },
  process: function($, block) {
    const BS = GuitarBufferSize,
      BM = BS - 1;

    const A = +$.guitarA,
      B = +$.guitarB,
      C = +$.guitarC;
    const T = A + B + C;
    let h = $.guitarHead;

    const buffer = $.guitarBuffer;
    for (let i = 0; i < block.length; i++) {
      // buffer size
      let n = (TAU / block[i]) | 0;
      n = n > BS ? BS : n;

      // tail
      const t = (h - n + BS) & BM;
      buffer[h] =
        (buffer[(t - 0 + BS) & BM] * A +
          buffer[(t - 1 + BS) & BM] * B +
          buffer[(t - 2 + BS) & BM] * C) /
        T;

      block[i] = buffer[h];
      h = (h + 1) & BM;
    }

    $.guitarHead = h;
    return block.length;
  }
};

// Low/High-Pass Filter
jsfx.Module.Filter = {
  name: "Filter",
  params: {
    /* beautify preserve:start */
    LP: { L: 0, H: 1, D: 1 },
    LPSlide: { L: -1, H: 1, D: 0 },
    LPResonance: { L: 0, H: 1, D: 0 },
    HP: { L: 0, H: 1, D: 0 },
    HPSlide: { L: -1, H: 1, D: 0 }
    /* beautify preserve:end */
  },
  stage: stage.SampleMod + 0,
  setup: function($, P) {
    $.FilterEnabled = P.HP > EPSILON || P.LP < 1 - EPSILON;

    $.LPEnabled = P.LP < 1 - EPSILON;
    $.LP = pow(P.LP, 3.0) / 10;
    $.LPSlide = 1.0 + (P.LPSlide * 100) / $.SampleRate;
    $.LPPos = 0;
    $.LPPosSlide = 0;

    $.LPDamping = (5.0 / (1.0 + pow(P.LPResonance, 2) * 20)) * (0.01 + P.LP);
    $.LPDamping = 1.0 - Math.min($.LPDamping, 0.8);

    $.HP = pow(P.HP, 2.0) / 10;
    $.HPPos = 0;
    $.HPSlide = 1.0 + (P.HPSlide * 100) / $.SampleRate;
  },
  enabled: function($) {
    return $.FilterEnabled;
  },
  process: function($, block) {
    if (!this.enabled($)) {
      return block.length;
    }

    let lp = +$.LP;
    let lpPos = +$.LPPos;
    let lpPosSlide = +$.LPPosSlide;
    const lpSlide = +$.LPSlide;
    const lpDamping = +$.LPDamping;
    const lpEnabled = +$.LPEnabled;

    let hp = +$.HP;
    let hpPos = +$.HPPos;
    const hpSlide = +$.HPSlide;

    for (let i = 0; i < block.length; i++) {
      if (hp > EPSILON || hp < -EPSILON) {
        hp *= hpSlide;
        hp = hp < EPSILON ? EPSILON : hp > 0.1 ? 0.1 : hp;
      }

      const lpPos_ = lpPos;

      lp *= lpSlide;
      lp = lp < 0 ? (lp = 0) : lp > 0.1 ? 0.1 : lp;

      const sample = block[i];
      if (lpEnabled) {
        lpPosSlide += (sample - lpPos) * lp;
        lpPosSlide *= lpDamping;
      } else {
        lpPos = sample;
        lpPosSlide = 0;
      }
      lpPos += lpPosSlide;

      hpPos += lpPos - lpPos_;
      hpPos *= 1.0 - hp;

      block[i] = hpPos;
    }

    $.LPPos = lpPos;
    $.LPPosSlide = lpPosSlide;
    $.LP = lp;
    $.HP = hp;
    $.HPPos = hpPos;

    return block.length;
  }
};

// Phaser Effect
const PhaserBufferSize = 1 << 10;
jsfx.Module.Phaser = {
  name: "Phaser",
  params: {
    /* beautify preserve:start */
    Offset: { L: -1, H: 1, D: 0 },
    Sweep: { L: -1, H: 1, D: 0 }
    /* beautify preserve:end */
  },
  stage: stage.SampleMod + 1,
  setup: function($, P) {
    $.phaserBuffer = createFloatArray(PhaserBufferSize);
    $.phaserPos = 0;
    $.phaserOffset = pow(P.Offset, 2.0) * (PhaserBufferSize - 4);
    $.phaserOffsetSlide = (pow(P.Sweep, 3.0) * 4000) / $.SampleRate;
  },
  enabled: function($) {
    return abs($.phaserOffsetSlide) > EPSILON || abs($.phaserOffset) > EPSILON;
  },
  process: function($, block) {
    if (!this.enabled($)) {
      return block.length;
    }

    const BS = PhaserBufferSize,
      BM = BS - 1;

    const buffer = $.phaserBuffer;
    let offset = +$.phaserOffset,
      offsetSlide = +$.phaserOffsetSlide,
      pos = $.phaserPos | 0;

    for (let i = 0; i < block.length; i++) {
      offset += offsetSlide;
      //TODO: check whether this is correct
      if (offset < 0) {
        offset = -offset;
        offsetSlide = -offsetSlide;
      }
      if (offset > BM) {
        offset = BM;
        offsetSlide = 0;
      }

      buffer[pos] = block[i];
      const p = (pos - (offset | 0) + BS) & BM;
      block[i] += buffer[p];

      pos = ((pos + 1) & BM) | 0;
    }

    $.phaserPos = pos;
    $.phaserOffset = offset;
    return block.length;
  }
};

// Volume dynamic control with Attack-Sustain-Decay
//   ATTACK  | 0              - Volume + Punch
//   SUSTAIN | Volume + Punch - Volume
//   DECAY   | Volume         - 0
jsfx.Module.Volume = {
  name: "Volume",
  params: {
    /* beautify preserve:start */
    Master: { L: 0, H: 1, D: 0.5 },
    Attack: { L: 0.001, H: 1, D: 0.01 },
    Sustain: { L: 0, H: 2, D: 0.3 },
    Punch: { L: 0, H: 3, D: 1.0 },
    Decay: { L: 0.001, H: 2, D: 1.0 }
    /* beautify preserve:end */
  },
  stage: stage.Volume,
  setup: function($, P) {
    const SR = $.SampleRate;
    const V = P.Master;
    const VP = V * (1 + P.Punch);
    $.envelopes = [
      // S = start volume, E = end volume, N = duration in samples
      {
        S: 0,
        E: V,
        N: (P.Attack * SR) | 0
      }, // Attack
      {
        S: VP,
        E: V,
        N: (P.Sustain * SR) | 0
      }, // Sustain
      {
        S: V,
        E: 0,
        N: (P.Decay * SR) | 0
      } // Decay
    ];
    // G = volume gradient
    for (let i = 0; i < $.envelopes.length; i += 1) {
      const e = $.envelopes[i];
      e.G = (e.E - e.S) / e.N;
    }
  },
  process: function($, block) {
    let i = 0;
    while ($.envelopes.length > 0 && i < block.length) {
      const E = $.envelopes[0];
      let vol = E.S;
      const grad = E.G;

      const N = Math.min(block.length - i, E.N) | 0;
      const end = (i + N) | 0;
      for (; i < end; i += 1) {
        block[i] *= vol;
        vol += grad;
        vol = clamp(vol, 0, 10);
      }
      E.S = vol;
      E.N -= N;
      if (E.N <= 0) {
        $.envelopes.shift();
      }
    }
    return i;
  }
};

// PRESETS

jsfx.DefaultModules = [
  jsfx.Module.Frequency,
  jsfx.Module.Vibrato,
  jsfx.Module.Generator,
  jsfx.Module.Filter,
  jsfx.Module.Phaser,
  jsfx.Module.Volume
];
jsfx.DefaultModules.sort(byStage);

jsfx.EmptyParams = EmptyParams;

jsfx._RemoveEmptyParams = RemoveEmptyParams;

jsfx.Preset = {
  Reset: function() {
    return EmptyParams();
  },
  Coin: function() {
    const p = EmptyParams();
    p.Frequency.Start = runif(880, 660);
    p.Volume.Sustain = runif(0.1);
    p.Volume.Decay = runif(0.4, 0.1);
    p.Volume.Punch = runif(0.3, 0.3);
    if (runif() < 0.5) {
      p.Frequency.ChangeSpeed = runif(0.15, 0.1);
      p.Frequency.ChangeAmount = runif(8, 4);
    }
    RemoveEmptyParams(p);
    return p;
  },
  Laser: function() {
    const p = EmptyParams();
    p.Generator.Func = rchoose(["square", "saw", "sine"]);

    if (runif() < 0.33) {
      p.Frequency.Start = runif(880, 440);
      p.Frequency.Min = runif(0.1);
      p.Frequency.Slide = runif(0.3, -0.8);
    } else {
      p.Frequency.Start = runif(1200, 440);
      p.Frequency.Min = p.Frequency.Start - runif(880, 440);
      if (p.Frequency.Min < 110) {
        p.Frequency.Min = 110;
      }
      p.Frequency.Slide = runif(0.3, -1);
    }

    if (runif() < 0.5) {
      p.Generator.A = runif(0.5);
      p.Generator.ASlide = runif(0.2);
    } else {
      p.Generator.A = runif(0.5, 0.4);
      p.Generator.ASlide = runif(0.7);
    }

    p.Volume.Sustain = runif(0.2, 0.1);
    p.Volume.Decay = runif(0.4);
    if (runif() < 0.5) {
      p.Volume.Punch = runif(0.3);
    }
    if (runif() < 0.33) {
      p.Phaser.Offset = runif(0.2);
      p.Phaser.Sweep = runif(0.2);
    }
    if (runif() < 0.5) {
      p.Filter.HP = runif(0.3);
    }
    RemoveEmptyParams(p);
    return p;
  },
  Explosion: function() {
    const p = EmptyParams();
    p.Generator.Func = "noise";
    if (runif() < 0.5) {
      p.Frequency.Start = runif(440, 40);
      p.Frequency.Slide = runif(0.4, -0.1);
    } else {
      p.Frequency.Start = runif(1600, 220);
      p.Frequency.Slide = runif(-0.2, -0.2);
    }

    if (runif() < 0.2) {
      p.Frequency.Slide = 0;
    }
    if (runif() < 0.3) {
      p.Frequency.RepeatSpeed = runif(0.5, 0.3);
    }

    p.Volume.Sustain = runif(0.3, 0.1);
    p.Volume.Decay = runif(0.5);
    p.Volume.Punch = runif(0.6, 0.2);

    if (runif() < 0.5) {
      p.Phaser.Offset = runif(0.9, -0.3);
      p.Phaser.Sweep = runif(-0.3);
    }

    if (runif() < 0.33) {
      p.Frequency.ChangeSpeed = runif(0.3, 0.6);
      p.Frequency.ChangeAmount = runif(24, -12);
    }
    RemoveEmptyParams(p);
    return p;
  },
  Powerup: function() {
    const p = EmptyParams();
    if (runif() < 0.5) {
      p.Generator.Func = "saw";
    } else {
      p.Generator.A = runif(0.6);
    }

    p.Frequency.Start = runif(220, 440);
    if (runif() < 0.5) {
      p.Frequency.Slide = runif(0.5, 0.2);
      p.Frequency.RepeatSpeed = runif(0.4, 0.4);
    } else {
      p.Frequency.Slide = runif(0.2, 0.05);
      if (runif() < 0.5) {
        p.Vibrato.Depth = runif(0.6, 0.1);
        p.Vibrato.Frequency = runif(30, 10);
      }
    }

    p.Volume.Sustain = runif(0.4);
    p.Volume.Decay = runif(0.4, 0.1);

    RemoveEmptyParams(p);
    return p;
  },
  Hit: function() {
    const p = EmptyParams();
    p.Generator.Func = rchoose(["square", "saw", "noise"]);
    p.Generator.A = runif(0.6);
    p.Generator.ASlide = runif(1, -0.5);

    p.Frequency.Start = runif(880, 220);
    p.Frequency.Slide = -runif(0.4, 0.3);

    p.Volume.Sustain = runif(0.1);
    p.Volume.Decay = runif(0.2, 0.1);

    if (runif() < 0.5) {
      p.Filter.HP = runif(0.3);
    }

    RemoveEmptyParams(p);
    return p;
  },
  Jump: function() {
    const p = EmptyParams();
    p.Generator.Func = "square";
    p.Generator.A = runif(0.6);

    p.Frequency.Start = runif(330, 330);
    p.Frequency.Slide = runif(0.4, 0.2);

    p.Volume.Sustain = runif(0.3, 0.1);
    p.Volume.Decay = runif(0.2, 0.1);

    if (runif() < 0.5) {
      p.Filter.HP = runif(0.3);
    }
    if (runif() < 0.3) {
      p.Filter.LP = runif(-0.6, 1);
    }

    RemoveEmptyParams(p);
    return p;
  },
  Select: function() {
    const p = EmptyParams();
    p.Generator.Func = rchoose(["square", "saw"]);
    p.Generator.A = runif(0.6);

    p.Frequency.Start = runif(660, 220);

    p.Volume.Sustain = runif(0.1, 0.1);
    p.Volume.Decay = runif(0.2);

    p.Filter.HP = 0.2;
    RemoveEmptyParams(p);
    return p;
  },
  Lucky: function() {
    const p = EmptyParams();
    mapObject(p, function(out, moduleName) {
      const defs = jsfx.Module[moduleName].params;
      mapObject(defs, function(def, name) {
        if (def.C) {
          const values = getObjectKeys(def.C);
          out[name] = values[(values.length * Math.random()) | 0];
        } else {
          out[name] = Math.random() * (def.H - def.L) + def.L;
        }
      });
    });
    p.Volume.Master = 0.4;
    p.Filter = {}; // disable filter, as it usually will clip everything
    RemoveEmptyParams(p);
    return p;
  }
};

// GENERATORS

// uniform noise
jsfx.G.unoise = newGenerator("sample = Math.random();");
// sine wave
jsfx.G.sine = newGenerator("sample = Math.sin(phase);");
// saw wave
jsfx.G.saw = newGenerator("sample = 2*(phase/TAU - ((phase/TAU + 0.5)|0));");
// triangle wave
jsfx.G.triangle = newGenerator(
  "sample = Math.abs(4 * ((phase/TAU - 0.25)%1) - 2) - 1;"
);
// square wave
jsfx.G.square = newGenerator(
  "var s = Math.sin(phase); sample = s > A ? 1.0 : s < A ? -1.0 : A;"
);
// simple synth
jsfx.G.synth = newGenerator(
  "sample = Math.sin(phase) + .5*Math.sin(phase/2) + .3*Math.sin(phase/4);"
);

// STATEFUL
const __noiseLast = 0;
jsfx.G.noise = newGenerator(
  "if(phase % TAU < 4){__noiseLast = Math.random() * 2 - 1;} sample = __noiseLast;"
);

// Karplus-Strong string
jsfx.G.string = {
  create: function() {
    const BS = 1 << 16;
    const BM = BS - 1;

    const buffer = createFloatArray(BS);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.random() * 2 - 1;
    }

    let head = 0;
    return function($, block) {
      const TAU = Math.PI * 2;
      let A = +$.generatorA,
        B = +$.generatorB;
      const ASlide = +$.generatorASlide,
        BSlide = +$.generatorBSlide;
      const buf = buffer;

      for (let i = 0; i < block.length; i++) {
        const phaseSpeed = block[i];
        const n = (TAU / phaseSpeed) | 0;
        A += ASlide;
        B += BSlide;
        A = A < 0 ? 0 : A > 1 ? 1 : A;
        B = B < 0 ? 0 : B > 1 ? 1 : B;

        const t = (head - n + BS) & BM;
        const sample =
          (buf[(t - 0 + BS) & BM] * 1 +
            buf[(t - 1 + BS) & BM] * A +
            buf[(t - 2 + BS) & BM] * B) /
          (1 + A + B);

        buf[head] = sample;
        block[i] = buf[head];
        head = (head + 1) & BM;
      }

      $.generatorA = A;
      $.generatorB = B;
      return block.length;
    };
  }
};

// WAVE SUPPORT

// Creates an Wave byte array from audio data [-1.0 .. 1.0]
jsfx.CreateWave = CreateWave;

// Creates an Audio element from audio data [-1.0 .. 1.0]
jsfx.CreateAudio = CreateAudio;

jsfx.DownloadAsFile = function(audio) {
  assert(audio instanceof Audio, "input must be an Audio object");
  document.location.href = audio.src;
};

// HELPERS
jsfx.Util = {};

// Copies array of Floats to a Uint8Array with 16bits per sample
jsfx.Util.CopyFToU8 = CopyFToU8;

// Encodes Uint8Array with base64
jsfx.Util.U8ToB64 = U8ToB64;

jsfx._createFloatArray = createFloatArray;

const library = {
  Laser: {
    Frequency: {
      Start: 1030.080421165578,
      Min: 491.31935013134876,
      Slide: -0.8310459038064972
    },
    Generator: {
      Func: "sine",
      A: 0.004493233472599667,
      ASlide: 0.08218362441270602
    },
    Filter: { HP: 0.18224999723870505 },
    Volume: { Sustain: 0.11415690122079614, Decay: 0.049870176011994886 }
  },
  Coin: {
    Frequency: {
      Start: 966.6212163295845,
      ChangeSpeed: 0.16968600502276632,
      ChangeAmount: 5.59020558093736
    },
    Volume: {
      Sustain: 0.041374360288547886,
      Decay: 0.4743156372265419,
      Punch: 0.4572319150403888
    }
  }
};

const sfx = jsfx.Sounds(library);

setTimeout(() => {
  sfx.Laser();
}, 1000);

setTimeout(() => {
  sfx.Coin();
}, 2000);
