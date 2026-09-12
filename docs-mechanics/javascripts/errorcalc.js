/* ============================================================================
   Maximum Permissible Error Calculator — Advanced Laser & Optics Learning Lab
   A reusable widget: the student enters the measured value and least count
   (instrument resolution) for each quantity in an experiment's governing
   formula, and the widget computes the propagated maximum permissible error
   live, using the same error-propagation rule printed above it.
   ============================================================================ */
(function () {
  "use strict";

  /* CONFIGS is generated from experiment_data.py and spliced in below. */
  var CONFIGS = {
    "bifilar-suspension": {
      resultSymbol: "I",
      formulaText: "\u0394I / I  =  \u0394M/M  +  2\u00b7\u0394b/b  +  2\u00b7\u0394T/T  +  \u0394l/l",
      note: "I = Mgb\u00b2T\u00b2/(4\u03c0\u00b2l) is a product/quotient of measured quantities, with b and T entering squared \u2014 their fractional errors are doubled before summing.",
      variables: [{"key": "M", "label": "M", "name": "Mass of bar", "unit": "g", "default": 300}, {"key": "b", "label": "b", "name": "Half-separation", "unit": "cm", "default": 15}, {"key": "T", "label": "T", "name": "Period", "unit": "s", "default": 2.5}, {"key": "l", "label": "l", "name": "Thread length", "unit": "cm", "default": 100}],
      compute: function(vars) {
        var M=vars['M'],b=vars['b'],T=vars['T'],l=vars['l']; var I=(M.v*981*b.v*b.v*T.v*T.v)/(4*Math.PI*Math.PI*l.v); var rel = M.lc/M.v + 2*b.lc/b.v + 2*T.lc/T.v + l.lc/l.v; return {Y:I, Yunit:'g·cm² (g=981 cm/s²)', dY:I*rel, pct:rel*100};
      }
    },
    "torsional-pendulum": {
      resultSymbol: "\u03b7",
      formulaText: "\u0394\u03b7 / \u03b7  =  \u0394l/l  +  \u0394I/I  +  4\u00b7\u0394r/r  +  2\u00b7\u0394T/T",
      note: "\u03b7 = 8\u03c0lI/(r\u2074T\u00b2) depends on r to the fourth power and T squared \u2014 even a small uncertainty in the wire radius (measured with a screw gauge) dominates the total error.",
      variables: [{"key": "l", "label": "l", "name": "Wire length", "unit": "cm", "default": 60}, {"key": "I", "label": "I", "name": "Moment of inertia of disc", "unit": "g\u00b7cm\u00b2", "default": 4000}, {"key": "r", "label": "r", "name": "Wire radius", "unit": "mm", "default": 0.4}, {"key": "T", "label": "T", "name": "Period (disc alone)", "unit": "s", "default": 2.0}],
      compute: function(vars) {
        var l=vars['l'],I=vars['I'],r=vars['r'],T=vars['T']; var rmm=r.v/10, rlc=r.lc/10; var eta=(8*Math.PI*l.v*I.v)/(Math.pow(rmm,4)*T.v*T.v); var rel = l.lc/l.v + I.lc/I.v + 4*rlc/rmm + 2*T.lc/T.v; return {Y:eta, Yunit:'dyne/cm² (approx, cgs)', dY:eta*rel, pct:rel*100};
      }
    },
    "flywheel": {
      resultSymbol: "I",
      formulaText: "\u0394I/I  \u2248  2\u00b7\u0394r/r  +  \u0394h/h  +  2\u00b7\u0394t/t  +  \u0394n\u2082/n\u2082",
      note: "The axle radius r and fall time t both enter squared in the governing formula, so their fractional errors are doubled before summing with the others.",
      variables: [{"key": "r", "label": "r", "name": "Axle radius", "unit": "cm", "default": 1.5}, {"key": "h", "label": "h", "name": "Height of fall", "unit": "cm", "default": 100}, {"key": "t", "label": "t", "name": "Fall time", "unit": "s", "default": 4.0}, {"key": "n2", "label": "n\u2082", "name": "Extra revolutions", "unit": "rev", "default": 15}],
      compute: function(vars) {
        var r=vars['r'],h=vars['h'],t=vars['t'],n2=vars['n2']; var rel = 2*r.lc/r.v + h.lc/h.v + 2*t.lc/t.v + n2.lc/n2.v; var Iref=5000; return {Y:Iref, Yunit:'g·cm² (representative)', dY:Iref*rel, pct:rel*100};
      }
    },
    "compound-pendulum": {
      resultSymbol: "g",
      formulaText: "\u0394g/g  =  \u0394L/L  +  2\u00b7\u0394T/T",
      note: "g = 4\u03c0\u00b2L/T\u00b2 depends on T squared, so timing precision (usually via timing many oscillations) dominates the error budget more than the length measurement L.",
      variables: [{"key": "L", "label": "L", "name": "Equivalent length (h\u2081+h\u2082)", "unit": "cm", "default": 70}, {"key": "T", "label": "T", "name": "Period", "unit": "s", "default": 1.68}],
      compute: function(vars) {
        var L=vars['L'],T=vars['T']; var g=(4*Math.PI*Math.PI*L.v)/(T.v*T.v); var rel = L.lc/L.v + 2*T.lc/T.v; return {Y:g, Yunit:'cm/s²', dY:g*rel, pct:rel*100};
      }
    },
    "non-uniform-bending": {
      resultSymbol: "Y",
      formulaText: "\u0394Y/Y  =  \u0394M/M  +  3\u00b7\u0394l/l  +  \u0394b/b  +  3\u00b7\u0394d/d  +  \u0394y/y",
      note: "Y = 4Wl\u00b3/(bd\u00b3y) depends on the cantilever length l cubed and on the thickness d cubed (inversely) \u2014 small errors in measuring l or, especially, the thin dimension d, are amplified threefold.",
      variables: [{"key": "M", "label": "M", "name": "Load", "unit": "g", "default": 200}, {"key": "l", "label": "l", "name": "Cantilever length", "unit": "cm", "default": 30}, {"key": "b", "label": "b", "name": "Breadth", "unit": "cm", "default": 2.0}, {"key": "d", "label": "d", "name": "Thickness", "unit": "cm", "default": 0.4}, {"key": "y", "label": "y", "name": "Depression", "unit": "cm", "default": 0.35}],
      compute: function(vars) {
        var M=vars['M'],l=vars['l'],b=vars['b'],d=vars['d'],y=vars['y']; var Y=(4*M.v*981*Math.pow(l.v,3))/(b.v*Math.pow(d.v,3)*y.v); var rel = M.lc/M.v + 3*l.lc/l.v + b.lc/b.v + 3*d.lc/d.v + y.lc/y.v; return {Y:Y, Yunit:'dyne/cm² (g=981 cm/s²)', dY:Y*rel, pct:rel*100};
      }
    },
    "uniform-bending": {
      resultSymbol: "Y",
      formulaText: "\u0394Y/Y  =  \u0394M/M  +  \u0394a/a  +  2\u00b7\u0394l/l  +  \u0394b/b  +  3\u00b7\u0394d/d  +  \u0394e/e",
      note: "As in the cantilever method, the beam thickness d enters cubed, so its measurement uncertainty (via a screw gauge) usually dominates the total error.",
      variables: [{"key": "M", "label": "M", "name": "Each end load", "unit": "g", "default": 250}, {"key": "a", "label": "a", "name": "Overhang", "unit": "cm", "default": 10}, {"key": "l", "label": "l", "name": "Knife-edge separation", "unit": "cm", "default": 40}, {"key": "b", "label": "b", "name": "Breadth", "unit": "cm", "default": 2.0}, {"key": "d", "label": "d", "name": "Thickness", "unit": "cm", "default": 0.4}, {"key": "e", "label": "e", "name": "Elevation", "unit": "cm", "default": 0.25}],
      compute: function(vars) {
        var M=vars['M'],a=vars['a'],l=vars['l'],b=vars['b'],d=vars['d'],e=vars['e']; var Y=(3*M.v*981*a.v*l.v*l.v)/(2*b.v*Math.pow(d.v,3)*e.v); var rel = M.lc/M.v + a.lc/a.v + 2*l.lc/l.v + b.lc/b.v + 3*d.lc/d.v + e.lc/e.v; return {Y:Y, Yunit:'dyne/cm² (g=981 cm/s²)', dY:Y*rel, pct:rel*100};
      }
    },
    "searle-apparatus": {
      resultSymbol: "Y",
      formulaText: "\u0394Y/Y  =  \u0394M/M  +  \u0394L/L  +  2\u00b7\u0394r/r  +  \u0394l_ext/l_ext",
      note: "The wire radius r, measured with a screw gauge, enters squared and is typically sub-millimetre \u2014 its fractional error usually dominates the overall uncertainty in Y.",
      variables: [{"key": "M", "label": "M", "name": "Load", "unit": "g", "default": 1000}, {"key": "L", "label": "L", "name": "Wire length", "unit": "cm", "default": 200}, {"key": "r", "label": "r", "name": "Wire radius", "unit": "mm", "default": 0.35}, {"key": "lext", "label": "l_ext", "name": "Elongation", "unit": "mm", "default": 0.42}],
      compute: function(vars) {
        var M=vars['M'],L=vars['L'],r=vars['r'],lext=vars['lext']; var rcm=r.v/10, rlc=r.lc/10, lcm=lext.v/10, lclc=lext.lc/10; var Y=(M.v*981*L.v)/(Math.PI*rcm*rcm*lcm); var rel = M.lc/M.v + L.lc/L.v + 2*rlc/rcm + lclc/lcm; return {Y:Y, Yunit:'dyne/cm² (g=981 cm/s²)', dY:Y*rel, pct:rel*100};
      }
    },
    "static-torsion": {
      resultSymbol: "\u03b7",
      formulaText: "\u0394\u03b7/\u03b7  =  \u0394C/C  +  \u0394l/l  +  4\u00b7\u0394r/r  +  \u0394\u03b8/\u03b8",
      note: "As in the torsional pendulum, the wire radius r enters raised to the fourth power, so its measurement error (from a screw gauge) dominates the total uncertainty in \u03b7 by far.",
      variables: [{"key": "C", "label": "C", "name": "Applied couple", "unit": "g\u00b7cm", "default": 1000}, {"key": "l", "label": "l", "name": "Wire length", "unit": "cm", "default": 60}, {"key": "r", "label": "r", "name": "Wire radius", "unit": "mm", "default": 0.4}, {"key": "theta", "label": "\u03b8", "name": "Twist angle", "unit": "rad", "default": 0.5}],
      compute: function(vars) {
        var C=vars['C'],l=vars['l'],r=vars['r'],theta=vars['theta']; var rcm=r.v/10, rlc=r.lc/10; var eta=(2*C.v*981*l.v)/(Math.PI*Math.pow(rcm,4)*theta.v); var rel = C.lc/C.v + l.lc/l.v + 4*rlc/rcm + theta.lc/theta.v; return {Y:eta, Yunit:'dyne/cm² (g=981 cm/s²)', dY:eta*rel, pct:rel*100};
      }
    },
    "poiseuille-viscosity": {
      resultSymbol: "\u03b7",
      formulaText: "\u0394\u03b7/\u03b7  =  \u0394h/h  +  4\u00b7\u0394r/r  +  \u0394l/l  +  \u0394V/V  +  \u0394t/t",
      note: "\u03b7 depends on the capillary radius to the fourth power \u2014 even a very small uncertainty in r, typically measured with a travelling microscope on a mercury thread, dominates the total error.",
      variables: [{"key": "h", "label": "h", "name": "Pressure head", "unit": "cm", "default": 20}, {"key": "r", "label": "r", "name": "Capillary radius", "unit": "mm", "default": 0.35}, {"key": "l", "label": "l", "name": "Capillary length", "unit": "cm", "default": 10}, {"key": "V", "label": "V", "name": "Volume collected", "unit": "cm\u00b3", "default": 10}, {"key": "t", "label": "t", "name": "Time", "unit": "s", "default": 120}],
      compute: function(vars) {
        var h=vars['h'],r=vars['r'],l=vars['l'],V=vars['V'],t=vars['t']; var rho=1000, P=rho*981*h.v/1000; var rcm=r.v/10, rlc=r.lc/10; var eta=(Math.PI*P*Math.pow(rcm,4)*t.v)/(8*V.v*l.v); var rel = h.lc/h.v + 4*rlc/rcm + l.lc/l.v + V.lc/V.v + t.lc/t.v; return {Y:eta, Yunit:'poise (approx, water-scale)', dY:eta*rel, pct:rel*100};
      }
    },
    "stokes-viscosity": {
      resultSymbol: "\u03b7",
      formulaText: "\u0394\u03b7/\u03b7  =  2\u00b7\u0394r/r  +  \u0394v/v  +  (\u0394\u03c1+\u0394\u03c3)/(\u03c1\u2212\u03c3)",
      note: "The sphere radius enters squared, and since \u03c1 and \u03c3 are usually close in value for typical sphere/liquid combinations, the small difference (\u03c1\u2212\u03c3) can itself carry a relatively large fractional uncertainty.",
      variables: [{"key": "r", "label": "r", "name": "Sphere radius", "unit": "mm", "default": 1.5}, {"key": "v", "label": "v", "name": "Terminal velocity", "unit": "cm/s", "default": 2.0}, {"key": "rho", "label": "\u03c1", "name": "Sphere density", "unit": "kg/m\u00b3", "default": 7800, "hasLC": false}, {"key": "sigma", "label": "\u03c3", "name": "Liquid density", "unit": "kg/m\u00b3", "default": 1260, "hasLC": false}, {"key": "drhosigma", "label": "\u0394(\u03c1\u2212\u03c3)", "name": "Uncertainty in (\u03c1\u2212\u03c3)", "unit": "kg/m\u00b3", "default": 20, "isLC": true}],
      compute: function(vars) {
        var r=vars['r'],v=vars['v'],rho=vars['rho'],sigma=vars['sigma'],drs=vars['drhosigma']; var rcm=r.v/10, rlc=r.lc/10; var diff=rho.v-sigma.v; var eta=(2*981*rcm*rcm*diff)/(9*v.v); var rel = 2*rlc/rcm + v.lc/v.v + drs.v/diff; return {Y:eta, Yunit:'poise (approx)', dY:eta*rel, pct:rel*100};
      }
    },
    "capillary-rise": {
      resultSymbol: "T",
      formulaText: "\u0394T/T  =  \u0394h/h  +  \u0394r/r",
      note: "Both h and r are lengths measured with a travelling microscope, so their combined fractional error is usually small \u2014 but the meniscus curvature must be read to the same point (bottom of meniscus) consistently to avoid a systematic bias.",
      variables: [{"key": "h", "label": "h", "name": "Rise height", "unit": "cm", "default": 3.0}, {"key": "r", "label": "r", "name": "Capillary radius", "unit": "mm", "default": 0.3}],
      compute: function(vars) {
        var h=vars['h'],r=vars['r']; var rho=1000; var rcm=r.v/10, rlc=r.lc/10; var T=(h.v*rcm*rho*981)/(2*1000); var rel = h.lc/h.v + rlc/rcm; return {Y:T, Yunit:'dyne/cm (approx, water-scale)', dY:T*rel, pct:rel*100};
      }
    },
    "coupled-pendulums": {
      resultSymbol: "T_beat",
      formulaText: "\u0394T_beat/T_beat  \u2248  (\u0394f_a + \u0394f_s)/(f_a \u2212 f_s)",
      note: "Because T_beat depends on the small difference (f_a \u2212 f_s), even modest uncertainties in either frequency are amplified when this difference is small (weak coupling).",
      variables: [{"key": "fa", "label": "f_a", "name": "Antisymmetric mode frequency", "unit": "Hz", "default": 1.12}, {"key": "fs", "label": "f_s", "name": "Symmetric mode frequency", "unit": "Hz", "default": 1.0}],
      compute: function(vars) {
        var fa=vars['fa'],fs=vars['fs']; var diff = fa.v-fs.v; var Tb = 1/diff; var rel = (fa.lc+fs.lc)/diff; return {Y:Tb, Yunit:'s', dY:Tb*rel, pct:rel*100};
      }
    },
    "damped-oscillations": {
      resultSymbol: "\u03b4",
      formulaText: "\u0394\u03b4  =  \u0394(ln A_n) + \u0394(ln A_{n+1})  \u2248  \u0394A_n/A_n + \u0394A_{n+1}/A_{n+1}",
      note: "Since \u03b4 is a logarithm of an amplitude ratio, its absolute error is approximately the sum of the fractional errors in the two amplitude readings \u2014 reading amplitudes several cycles apart and dividing by the cycle count reduces this error.",
      variables: [{"key": "An", "label": "A_n", "name": "n-th peak amplitude", "unit": "cm", "default": 10}, {"key": "An1", "label": "A_(n+1)", "name": "(n+1)-th peak amplitude", "unit": "cm", "default": 8}],
      compute: function(vars) {
        var An=vars['An'],An1=vars['An1']; var delta = Math.log(An.v/An1.v); var absErr = An.lc/An.v + An1.lc/An1.v; var Q = Math.PI/delta; return {Y:delta, Yunit:'(dimensionless)', dY:absErr, pct:(absErr/delta)*100};
      }
    },
    "forced-oscillations-resonance": {
      resultSymbol: "Q",
      formulaText: "\u0394Q/Q  =  \u0394f0/f0  +  \u0394(\u0394f)/\u0394f",
      note: "The half-power width \u0394f is usually the less precisely determined quantity, since it depends on locating two points on a curve that may be sparsely sampled near the half-power level.",
      variables: [{"key": "f0", "label": "f0", "name": "Resonant (peak) frequency", "unit": "Hz", "default": 1.0}, {"key": "df", "label": "\u0394f", "name": "Half-power width", "unit": "Hz", "default": 0.1}],
      compute: function(vars) {
        var f0=vars['f0'],df=vars['df']; var Q = f0.v/df.v; var rel = f0.lc/f0.v + df.lc/df.v; return {Y:Q, Yunit:'(dimensionless)', dY:Q*rel, pct:rel*100};
      }
    },
    "ultrasonic-interferometer": {
      resultSymbol: "v",
      formulaText: "\u0394v/v  =  \u0394f/f  +  \u0394(\u0394d)/\u0394d",
      note: "Averaging the maxima spacing over as many resonances as practical (large N) directly reduces the fractional error in \u0394d, and hence in v, \u03b2 and K, since micrometer positioning error is essentially fixed per reading but is divided by N when averaged this way.",
      variables: [{"key": "f", "label": "f", "name": "Driving frequency", "unit": "MHz", "default": 2.0, "hasLC": false}, {"key": "flc", "label": "\u0394f", "name": "Frequency uncertainty", "unit": "MHz", "default": 0.001, "isLC": true}, {"key": "dd", "label": "\u0394d", "name": "Mean maxima spacing", "unit": "mm", "default": 0.37}],
      compute: function(vars) {
        var f=vars['f'],flc=vars['flc'],dd=vars['dd']; var lam=2*dd.v; var v=(f.v*1e6)*(lam/1000); var rel = flc.v/f.v + dd.lc/dd.v; return {Y:v, Yunit:'m/s', dY:v*rel, pct:rel*100};
      }
    },
    "ballistic-pendulum": {
      resultSymbol: "v",
      formulaText: "\u0394v/v  =  \u0394m/m  +  \u0394M/M  +  \u0394L/L  +  \u00bd\u00b7\u0394h/h",
      note: "v = [(M+m)/m]\u00b7\u221a(2gh) depends on h only through a square root, so h contributes half its fractional error, while the mass ratio (M+m)/m contributes its own fractional errors directly.",
      variables: [{"key": "m", "label": "m", "name": "Ball (projectile) mass", "unit": "g", "default": 20}, {"key": "M", "label": "M", "name": "Pendulum block mass", "unit": "g", "default": 500}, {"key": "L", "label": "L", "name": "Pendulum length", "unit": "cm", "default": 40}, {"key": "h", "label": "h", "name": "Rise height", "unit": "cm", "default": 0.19}],
      compute: function(vars) {
        var m=vars['m'],M=vars['M'],L=vars['L'],h=vars['h']; var g=981; var v=((M.v+m.v)/m.v)*Math.sqrt(2*g*h.v); var rel = m.lc/m.v + M.lc/M.v + L.lc/L.v + 0.5*h.lc/h.v; return {Y:v/100, Yunit:'m/s', dY:(v/100)*rel, pct:rel*100};
      }
    },
    "rolling-race-incline": {
      resultSymbol: "k",
      formulaText: "\u0394a/a  =  \u0394L/L  +  2\u00b7\u0394t/t   (a=2L/t\u00b2, from which k is inferred)",
      note: "The moment-of-inertia factor k is inferred from the measured acceleration a = g sin\u03b8/(1+k); since a is obtained from the timed run (a = 2L/t\u00b2), the fall time t enters squared and usually dominates the error budget.",
      variables: [{"key": "L", "label": "L", "name": "Incline length (along slope)", "unit": "cm", "default": 100}, {"key": "theta", "label": "\u03b8", "name": "Incline angle", "unit": "\u00b0", "default": 20, "hasLC": false}, {"key": "t", "label": "t", "name": "Time to reach bottom", "unit": "s", "default": 0.95}],
      compute: function(vars) {
        var L=vars['L'],theta=vars['theta'],t=vars['t']; var g=981; var rad=theta.v*Math.PI/180; var a=2*L.v/(t.v*t.v); var k=(g*Math.sin(rad)/a)-1; var rel = L.lc/L.v + 2*t.lc/t.v; return {Y:k, Yunit:'(dimensionless)', dY:Math.abs(k)*rel, pct:rel*100};
      }
    },
    "gyroscopic-precession": {
      resultSymbol: "\u03a9",
      formulaText: "\u0394\u03a9/\u03a9  =  \u0394d/d  +  2\u00b7\u0394R/R  +  \u0394\u03c9/\u03c9",
      note: "Since \u03a9 = 2gd/(R\u00b2\u03c9), the wheel radius R enters squared \u2014 the least-count error of whatever instrument measures R (often a vernier caliper) usually dominates the overall uncertainty in \u03a9.",
      variables: [{"key": "Rw", "label": "R", "name": "Wheel radius", "unit": "cm", "default": 5}, {"key": "omega", "label": "\u03c9", "name": "Spin rate", "unit": "rad/s", "default": 25}, {"key": "d", "label": "d", "name": "C.G. offset from pivot", "unit": "cm", "default": 6}],
      compute: function(vars) {
        var Rw=vars['Rw'],omega=vars['omega'],d=vars['d']; var g=981; var Omega=(2*g*d.v)/(Rw.v*Rw.v*omega.v); var rel = d.lc/d.v + 2*Rw.lc/Rw.v + omega.lc/omega.v; return {Y:Omega, Yunit:'rad/s', dY:Omega*rel, pct:rel*100};
      }
    }
  };

  function fmt(x) {
    if (x === 0) return "0";
    var ax = Math.abs(x);
    if (ax >= 1000 || ax < 0.001) return x.toExponential(3);
    return parseFloat(x.toPrecision(4)).toString();
  }

  function renderVarRow(v) {
    var row = document.createElement("div");
    row.className = "ec-row";
    var nameLabel = document.createElement("div");
    nameLabel.className = "ec-varname";
    nameLabel.innerHTML = "<b>" + v.label + "</b> &mdash; " + v.name + (v.unit ? " (" + v.unit + ")" : "");
    row.appendChild(nameLabel);

    var inputs = document.createElement("div");
    inputs.className = "ec-inputs";

    var valInput = document.createElement("input");
    valInput.type = "number";
    valInput.step = "any";
    valInput.value = v.default;
    valInput.className = "ec-input ec-input-value";
    valInput.setAttribute("data-key", v.key);
    valInput.setAttribute("data-role", "v");
    valInput.title = v.isLC ? "Value" : "Measured value";
    inputs.appendChild(valInput);

    var hasLC = v.hasLC !== false && !v.isLC;
    var lcInput = null;
    if (hasLC) {
      var lcWrap = document.createElement("span");
      lcWrap.className = "ec-lc-wrap";
      lcWrap.innerHTML = "&nbsp;&plusmn;&nbsp;";
      lcInput = document.createElement("input");
      lcInput.type = "number";
      lcInput.step = "any";
      lcInput.value = Math.max(v.default * 0.002, 0.001).toPrecision(2);
      lcInput.className = "ec-input ec-input-lc";
      lcInput.setAttribute("data-key", v.key);
      lcInput.setAttribute("data-role", "lc");
      lcInput.title = "Least count (instrument resolution)";
      lcWrap.appendChild(lcInput);
      inputs.appendChild(lcWrap);
      var lcTag = document.createElement("span");
      lcTag.className = "ec-lc-tag";
      lcTag.textContent = "LC";
      inputs.appendChild(lcTag);
    }
    row.appendChild(inputs);
    return row;
  }

  function initOne(container) {
    var slug = container.getAttribute("data-exp");
    var cfg = CONFIGS[slug];
    if (!cfg) return;

    container.innerHTML = "";
    var formulaBox = document.createElement("div");
    formulaBox.className = "ec-formula";
    formulaBox.innerHTML = "<b>Error formula:</b> " + cfg.formulaText;
    container.appendChild(formulaBox);

    var noteBox = document.createElement("div");
    noteBox.className = "ec-note";
    noteBox.textContent = cfg.note;
    container.appendChild(noteBox);

    var form = document.createElement("div");
    form.className = "ec-form";
    cfg.variables.forEach(function (v) {
      form.appendChild(renderVarRow(v));
    });
    container.appendChild(form);

    var resultBox = document.createElement("div");
    resultBox.className = "ec-result";
    container.appendChild(resultBox);

    function recompute() {
      var vars = {};
      cfg.variables.forEach(function (v) {
        var valEl = form.querySelector('.ec-input-value[data-key="' + v.key + '"]');
        var lcEl = form.querySelector('.ec-input-lc[data-key="' + v.key + '"]');
        var val = parseFloat(valEl.value);
        var lc = lcEl ? parseFloat(lcEl.value) : 0;
        vars[v.key] = { v: val, lc: lc };
      });
      try {
        var out = cfg.compute(vars);
        resultBox.innerHTML =
          "<div class='ec-result-main'>" + cfg.resultSymbol + " = " + fmt(out.Y) +
          " &nbsp;&plusmn;&nbsp; " + fmt(out.dY) + " " + (out.Yunit || "") + "</div>" +
          "<div class='ec-result-pct'>Maximum permissible error &asymp; " + out.pct.toFixed(2) + " %</div>";
      } catch (e) {
        resultBox.innerHTML = "<div class='ec-result-error'>Check your inputs (" + e.message + ")</div>";
      }
    }

    form.addEventListener("input", recompute);
    recompute();
  }

  function initAll() {
    document.querySelectorAll(".error-calc[data-exp]").forEach(initOne);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initAll, 30);
  } else {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(initAll, 30); });
  }
  if (window.document$ && window.document$.subscribe) {
    window.document$.subscribe(function () { setTimeout(initAll, 30); });
  }
})();
