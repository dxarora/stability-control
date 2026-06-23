window.HiveMindModule = Object.freeze({
  schemaVersion: 1,
  id: 'stability-control',
  title: 'Stability & Control',
  description: 'A four-layer dependency map from trim through dynamic modes, derivatives, and aeroelastic coupling.',
  layers: [
    {
      id:'l1', num:'01', title:'Foundations', sub:'Equilibrium, the two flavors of stability, and where every later layer hangs off one number: static margin.',
      nodes:[
        {id:'trim', label:'TRIM', sub:'ΣF = 0, ΣM = 0', r:1,c:'2 / 4', detail:'The aircraft is in equilibrium: net force and net moment are zero. Every stability question is really "what happens when you are disturbed away from this state."'},
        {id:'statstab', label:'STATIC STABILITY', sub:'initial tendency', r:2,c:'1 / 3', detail:'Right after a disturbance, does the initial tendency point back toward equilibrium? Three axes: longitudinal, lateral, directional.'},
        {id:'eom', label:'EQUATIONS OF MOTION', sub:'6-DOF, linearized', r:2,c:'3 / 5', detail:'Small-disturbance theory linearizes the full 6-DOF equations around the trim state, decoupling them into a longitudinal set and a lateral-directional set.'},
        {id:'np', label:'NEUTRAL POINT', sub:'where Cmα = 0', r:3,c:'1 / 2', tag:'work', formula:'C_{m_\\alpha} = 0 \\;\\Rightarrow\\; x_{cg} = x_{NP}', detail:'The CG location at which Cmα = 0 — the boundary between stable and unstable. Every static-stability question reduces to: where is CG relative to this point?'},
        {id:'sd', label:'STABILITY DERIVATIVES', sub:'Cmα, Clβ, Cnβ…', r:3,c:'3 / 4', detail:'The math formalization of static stability — how a force or moment coefficient changes with a motion variable.'},
        {id:'cd', label:'CONTROL DERIVATIVES', sub:'Cmδe, Clδa, Cnδr', r:3,c:'4 / 5', detail:'Same idea as stability derivatives, but the independent variable is a control surface deflection, not a motion variable.'},
        {id:'sm', label:'STATIC MARGIN', sub:'(NP − CG), normalized', r:4,c:'1 / 2', tag:'work', formula:'\\text{SM} = \\dfrac{x_{NP} - x_{cg}}{\\bar{c}}', detail:'Distance between neutral point and CG, normalized by chord. The single most important number in longitudinal S&C — directly relates to the trim values computed in load/aeroelastic work.'},
        {id:'ds', label:'DYNAMIC STABILITY', sub:'does it converge?', r:4,c:'3 / 5', detail:'Static stability only checks initial tendency. Dynamic stability asks what actually happens over time — converge, oscillate, or diverge. This is Layer 2.'},
        {id:'tradeoff', label:'MANEUVERABILITY vs STABILITY', sub:'the core tradeoff', r:5,c:'2 / 4', detail:'More static margin = more stable but less maneuverable, since the controls have to fight a bigger restoring moment. Fighter aircraft are often flown close to neutral or relaxed-stable for this reason.'},
      ],
      edges:[['trim','statstab'],['trim','eom'],['statstab','np'],['np','sm'],['eom','sd'],['eom','cd'],['sd','ds'],['cd','ds'],['sm','tradeoff',1],['cd','tradeoff',1]]
    },
    {
      id:'l2', num:'02', title:'Dynamic Modes', sub:'The characteristic equations factor into well-separated timescales — that is why each mode can be treated as its own simple system.',
      nodes:[
        {id:'eomlin', label:'LINEARIZED EOM', sub:'decouples in two', r:1,c:'2 / 4', detail:'Decouples cleanly into a longitudinal set and a lateral-directional set because the cross-coupling terms are small for symmetric flight.'},
        {id:'long', label:'LONGITUDINAL SET', sub:'4th-order char. eq.', r:2,c:'1 / 3', detail:'Factors into two quadratic pairs because the two longitudinal modes live at very different timescales.'},
        {id:'lat', label:'LATERAL-DIRECTIONAL SET', sub:'5th-order char. eq.', r:2,c:'3 / 5', detail:'One real root (spiral) factors out first, leaving a 1st-order roll mode and a 2nd-order Dutch roll pair.'},
        {id:'sp', label:'SHORT PERIOD', sub:'fast, well-damped', r:3,c:'1 / 3', tag:'work', formula:'s^2 + 2\\zeta_{sp}\\,\\omega_{n,sp}\\,s + \\omega_{n,sp}^2 = 0', detail:'~1–2 second period. Constant speed, α and q vary. Driven by Cmα and Cmq. This is the mode pilots feel as pitch "crispness," and it feeds directly into maneuver-load computation for V-n diagrams.'},
        {id:'ph', label:'PHUGOID', sub:'slow, lightly damped', r:4,c:'1 / 3', formula:'s^2 + 2\\zeta_{ph}\\,\\omega_{n,ph}\\,s + \\omega_{n,ph}^2 = 0', detail:'~20–100 second period. Constant α, speed and altitude trade back and forth. Governed almost entirely by L/D.'},
        {id:'roll', label:'ROLL SUBSIDENCE', sub:'fast, heavily damped', r:3,c:'3 / 5', formula:'s + \\dfrac{1}{T_{roll}} = 0', detail:'Pure rolling decay, driven almost entirely by Clp. The simplest of the five modes — first order, always stable.'},
        {id:'dr', label:'DUTCH ROLL', sub:'coupled yaw–roll', r:4,c:'3 / 5', tag:'work', formula:'s^2 + 2\\zeta_{dr}\\,\\omega_{n,dr}\\,s + \\omega_{n,dr}^2 = 0', detail:'A closed feedback loop: roll → sideslip (Clβ) → yaw moment (Cnβ) → yaw creates roll again (Clr). Often needs a yaw damper. Ties directly into aeroelastic/flutter coupling on swept flexible wings.'},
        {id:'spiral', label:'SPIRAL MODE', sub:'very slow, often unstable', r:5,c:'3 / 5', formula:'s + \\dfrac{1}{T_{spiral}} = 0', detail:'A sign battle between Clβ (stabilizing here) and Cnβ (destabilizing here) — the opposite pairing from what stabilizes Dutch roll. Usually allowed to be mildly unstable since it is slow enough to correct.'},
        {id:'fq', label:'FLYING QUALITIES', sub:'MIL-F-8785 levels', r:6,c:'2 / 4', detail:'All five modes get graded against handling-quality specs — CAP for short period, damping ratio thresholds for Dutch roll, time-to-double for spiral.'},
      ],
      edges:[['eomlin','long'],['eomlin','lat'],['long','sp'],['long','ph'],['lat','roll'],['lat','dr'],['lat','spiral'],['sp','fq'],['dr','fq'],['spiral','fq']]
    },
    {
      id:'l3', num:'03', title:'Derivative Derivation', sub:'Every derivative traces to the same story: a motion variable changes local angle of attack or sideslip somewhere on the airframe.',
      nodes:[
        {id:'root', label:'STABILITY DERIVATIVE', sub:'∂(coeff) / ∂(motion var)', r:1,c:'2 / 4', detail:'The general definition. The derivation game is always the same: find where on the airframe the motion variable changes local AoA or sideslip, then translate that into a force and a moment.'},
        {id:'longd', label:'LONGITUDINAL', sub:'CLα, Cmα, Cmq…', r:2,c:'1 / 3', detail:'Almost every longitudinal derivative is proportional to the tail volume ratio, Vh = lt·St / (c̄·S) — learn that formula once.'},
        {id:'latd', label:'LATERAL-DIRECTIONAL', sub:'Clβ, Cnβ, Clp…', r:2,c:'3 / 5', detail:'Driven by dihedral, sweep, wing vertical position, and the vertical tail — the lateral counterpart of tail volume here is Vv.'},
        {id:'cla', label:'CLα', math:'C_{L_\\alpha}', sub:'lift curve slope', r:3,c:'1 / 2', formula:'C_{L_\\alpha} = C_{L_{\\alpha,w}} + C_{L_{\\alpha,t}}\\,\\eta\\,\\dfrac{S_t}{S}\\left(1-\\dfrac{d\\varepsilon}{d\\alpha}\\right)', detail:'Built from wing and tail contributions, discounted by how much downwash from the wing reaches the tail.'},
        {id:'cma', label:'Cmα', math:'C_{m_\\alpha}', sub:'pitch stiffness — must be negative', r:4,c:'1 / 2', tag:'work', formula:'C_{m_\\alpha} = C_{L_{\\alpha,w}}\\dfrac{x_{cg}-x_{ac}}{\\bar c} \\;-\\; C_{L_{\\alpha,t}}\\,V_h\\left(1-\\dfrac{d\\varepsilon}{d\\alpha}\\right)', detail:'Setting this to zero and solving for xcg gives the neutral point — the direct link back to Layer 1 static margin and the trim values computed in real load work.'},
        {id:'cmq', label:'Cmq', math:'C_{m_q}', sub:'pitch damping', r:5,c:'1 / 2', formula:'C_{m_q} \\approx -2\\,C_{L_{\\alpha,t}}\\,V_h\\,\\dfrac{l_t}{\\bar c}', detail:'Pitch rate q changes the local AoA seen at the tail (Δα_tail = q·lt/V); the resulting tail-lift change always opposes q.'},
        {id:'clb', label:'Clβ', math:'C_{l_\\beta}', sub:'dihedral effect', r:3,c:'3 / 4', detail:'Sideslip creates differential local AoA left vs right wing → rolling moment. Sources: dihedral angle, sweep, wing vertical position, vertical tail.'},
        {id:'cnb', label:'Cnβ', math:'C_{n_\\beta}', sub:'weathercock — must be positive', r:4,c:'3 / 4', formula:'C_{n_\\beta} \\approx C_{n_{\\beta,vt}} = C_{L_{\\alpha,vt}}\\,\\eta_v\\,V_v', detail:'Dominated by the vertical tail. The directional-stability twin of Cmα — same logic, opposite sign convention.'},
        {id:'clp', label:'Clp', math:'C_{l_p}', sub:'roll damping — always negative', r:5,c:'3 / 4', detail:'Roll rate creates differential AoA — down-going wing sees more α, up-going wing less — and the resulting differential lift always opposes the roll. No sign ambiguity, unlike most other derivatives.'},
      ],
      edges:[['root','longd'],['root','latd'],['longd','cla'],['cla','cma'],['cma','cmq'],['latd','clb'],['clb','cnb'],['cnb','clp']]
    },
    {
      id:'l4', num:'04', title:'Aeroelastic &amp; Control Coupling', sub:'The airframe is not rigid, and control surfaces are new degrees of freedom — both layer on top of Layer 3 directly.',
      nodes:[
        {id:'rigid', label:'RIGID-BODY DERIVATIVES', sub:'from Layer 3', r:1,c:'2 / 4', detail:'Everything in Layer 3 assumed a rigid airframe. That assumption breaks down at high dynamic pressure.'},
        {id:'ae', label:'AEROELASTIC COUPLING', sub:'load → deflection → load', r:2,c:'1 / 3', tag:'work', detail:'One mental model covers all of it: aero load causes structural deflection, which changes local AoA, which changes the load. Static, dynamic, or control-coupled depending on what oscillates.'},
        {id:'ctrl', label:'CONTROL DERIVATIVES', sub:'Cmδe, Clδa, Cnδr', r:2,c:'3 / 5', detail:'New degrees of freedom layered on top of the rigid-body derivatives — each is the control-surface twin of a Layer 3 stability derivative.'},
        {id:'div', label:'DIVERGENCE', sub:'static instability', r:3,c:'1 / 2', formula:'critical dynamic pressure q_D', detail:'Wing twists nose-up under load → more lift → more twist → runaway. A purely static aeroelastic instability.'},
        {id:'flutter', label:'FLUTTER', sub:'dynamic instability', r:4,c:'1 / 2', tag:'work', detail:'Bending-torsion coupling feeds energy from the airstream into structural oscillation until it grows unstable. Couples directly with Dutch roll on swept flexible wings.'},
        {id:'rev', label:'CONTROL REVERSAL', sub:'effectiveness can go negative', r:5,c:'1 / 2', detail:'A deflected surface twists the structure enough to oppose the intended force change — at high enough q, aileron or elevator effectiveness drops, then reverses sign.'},
        {id:'cmde', label:'Cmδe', math:'C_{m_{\\delta_e}}', sub:'elevator pitch power', r:3,c:'3 / 4', formula:'C_{m_{\\delta_e}} \\approx -\\,C_{L_{\\alpha,t}}\\,\\eta\\,V_h\\,\\tau_e', detail:'Elevator deflection changes tail AoA directly. Sizes the tail and sets the trim authority needed across the CG range.'},
        {id:'clda', label:'Clδa', math:'C_{l_{\\delta_a}}', sub:'aileron roll power', r:4,c:'3 / 4', detail:'Differential aileron deflection creates differential wing lift → rolling moment. Sets the time-to-bank handling-quality requirement.'},
        {id:'cndr', label:'Cnδr', math:'C_{n_{\\delta_r}}', sub:'rudder yaw power', r:5,c:'3 / 4', formula:'C_{n_{\\delta_r}} \\approx -\\,C_{L_{\\alpha,vt}}\\,\\eta_v\\,V_v\\,\\tau_r', detail:'Sets crosswind landing capability and engine-out trim authority on multi-engine aircraft. Adverse yaw from ailerons is why rudder coordination exists at all.'},
      ],
      edges:[['rigid','ae'],['rigid','ctrl'],['ae','div'],['ae','flutter'],['ae','rev'],['ctrl','cmde'],['ctrl','clda'],['ctrl','cndr']]
    },
  ]
});
