/* Biomas de los 12 niveles: paletas inspiradas en los paisajes guajiros y la luz de cada lugar. */
window.W = window.W || {};

W.BIOMES = {
  riohacha: {
    name: 'Riohacha', time: 'Atardecer en el Malecón',
    g0: { style: 'sand', c: ['#d8b67c', '#e8cc94', '#f4e0b0'], speck: ['#c79b62', '#fff3d6', '#e7a7a0'] },
    g1: { style: 'grass', c: ['#4f8f45', '#6aa84f', '#8cc461'], speck: ['#f2c14e', '#ff7b9c'] },
    path: { style: 'brick', c: ['#b96b4b', '#d9845c', '#e9a37a'], speck: ['#8a4a36'] },
    plaza: { style: 'tiles', c: ['#e7d8bb', '#f6ead2', '#2fb3a8', '#c96f4a'] },
    water: { c: ['#0f4f78', '#16709a', '#2ba3bf', '#62d2cf'], foam: '#f2fff9', spark: '#fffbe6' },
    cliff: { style: 'seawall', top: ['#9a8f86', '#b8ada2', '#d1c7bb'], face: ['#5d5560', '#7a7079', '#958a90'] },
    tree: 'palm', shrub: 'bougainvillea', building: 'caribe', rock: ['#8d8590', '#b0a8ae'],
    ambient: '#fff1e2', grade: 'linear-gradient(200deg, rgba(255,170,90,.32) 0%, rgba(255,120,120,.08) 40%, rgba(40,20,90,.18) 100%)',
    particles: 'sea', sun: { x: 590, y: 20, color: '#ffb36b' }, transpose: 0
  },
  manaure: {
    name: 'Manaure', time: 'Mediodía en las charcas',
    g0: { style: 'salt', c: ['#e9d3dc', '#f6e8ee', '#fffafc'], speck: ['#d9a7bd', '#ffffff'] },
    g1: { style: 'sand', c: ['#d8bfae', '#e8d4c3', '#f3e6d8'], speck: ['#c7a08a', '#ffffff'] },
    path: { style: 'dirt', c: ['#b99a86', '#cdb19b', '#dcc4ae'], speck: ['#9a7a66'] },
    plaza: { style: 'planks', c: ['#8a5d3b', '#a87448', '#c48e5d'] },
    water: { c: ['#b8467a', '#d4618f', '#ea8fb0', '#f7c3d4'], foam: '#ffffff', spark: '#ffffff' },
    cliff: { style: 'saltpile', top: ['#e8e2e6', '#f7f3f5', '#ffffff'], face: ['#b9aab4', '#d1c4cc', '#e6dde2'] },
    tree: 'mangrove', shrub: 'saltbush', building: 'saltworks', rock: ['#d9cfd6', '#f3eef1'],
    ambient: '#ffffff', grade: 'linear-gradient(180deg, rgba(255,255,255,.12) 0%, rgba(255,150,200,.08) 100%)',
    particles: 'salt', sun: { x: 320, y: -30, color: '#fff6e0' }, transpose: 2
  },
  sanjuan: {
    name: 'San Juan del Cesar y Fonseca', time: 'Tarde de festival',
    g0: { style: 'grass', c: ['#5f8f3a', '#79a948', '#96c25a'], speck: ['#f2d34e', '#ffffff'] },
    g1: { style: 'grass', c: ['#4b7a32', '#5f8f3a', '#79a948'], speck: ['#f2d34e'] },
    path: { style: 'dirt', c: ['#a8784c', '#bf8d5c', '#d4a46f'], speck: ['#8a5e3a'] },
    plaza: { style: 'stone', c: ['#a39a8f', '#bdb3a6', '#d6cdbf'] },
    water: { c: ['#1f5a5a', '#2a7a72', '#3c9a8a', '#6cc2ad'], foam: '#e9fff5', spark: '#ffffe0' },
    cliff: { style: 'rock', top: ['#5f8f3a', '#79a948', '#96c25a'], face: ['#6b5a4a', '#857160', '#a08a76'] },
    tree: 'canahuate', shrub: 'bush', building: 'colonial', rock: ['#8a7f74', '#ada196'],
    ambient: '#fff3df', grade: 'linear-gradient(160deg, rgba(255,210,90,.22) 0%, rgba(255,160,60,.06) 50%, rgba(80,40,90,.12) 100%)',
    particles: 'petals', sun: { x: 80, y: 10, color: '#ffd27a' }, transpose: 5
  },
  uribia: {
    name: 'Uribia', time: 'Sol de la Alta Guajira',
    g0: { style: 'desert', c: ['#c98a4c', '#dba15f', '#e9b97a'], speck: ['#a8693a', '#f6d39c'] },
    g1: { style: 'desert', c: ['#b06a3e', '#c47a48', '#d68e58'], speck: ['#8f532f'] },
    path: { style: 'dirt', c: ['#c7a07a', '#d8b28a', '#e6c39c'], speck: ['#a8825e'] },
    plaza: { style: 'octagon', c: ['#d9c3a0', '#e9d6b6', '#c2457a', '#2fb3a8'] },
    water: { c: ['#3a4a2e', '#4f6638', '#6b8446', '#93a85a'], foam: '#d9e8b0', spark: '#fff6c0' },
    cliff: { style: 'mesa', top: ['#c47a48', '#d68e58', '#e6a56c'], face: ['#7a3a28', '#96492f', '#b25c3a'] },
    tree: 'cardon', shrub: 'trupillo', building: 'ranch', rock: ['#9a5c3a', '#c27a4c'],
    ambient: '#fff0dc', grade: 'linear-gradient(180deg, rgba(255,200,120,.2) 0%, rgba(255,120,40,.1) 100%)',
    particles: 'dust', sun: { x: 320, y: -40, color: '#fff0c0' }, transpose: -2
  },
  maicao: {
    name: 'Maicao', time: 'Anochecer en el bazar',
    g0: { style: 'pavement', c: ['#a8968a', '#bba99c', '#ccbcae'], speck: ['#8a7a70'] },
    g1: { style: 'sand', c: ['#c9a77e', '#d9b88e', '#e6c9a0'], speck: ['#a8865e'] },
    path: { style: 'brick', c: ['#8f5a46', '#a86a52', '#bf7e62'], speck: ['#6b4234'] },
    plaza: { style: 'arabesque', c: ['#e9dcc4', '#f5ecd9', '#2a7f9e', '#c2457a'] },
    water: { c: ['#145a6e', '#1d7a8c', '#2ea0a8', '#6fd0c8'], foam: '#e8fffb', spark: '#ffffff' },
    cliff: { style: 'wall', top: ['#d9c8b0', '#e9dac4', '#f5ead8'], face: ['#a68f74', '#bba288', '#cfb69c'] },
    tree: 'palm', shrub: 'pot', building: 'bazaar', rock: ['#8a7a70', '#ab9a8e'],
    ambient: '#a49ac4', grade: 'linear-gradient(180deg, rgba(60,50,140,.24) 0%, rgba(255,150,80,.12) 100%)',
    particles: 'lanterns', sun: null, night: true, transpose: 3
  },
  barrancas: {
    name: 'Barrancas y el Río Ranchería', time: 'Tarde en el cañón',
    g0: { style: 'dirt', c: ['#8f7a54', '#a68e63', '#bba274'], speck: ['#6f5c3e', '#c9b07c'] },
    g1: { style: 'coal', c: ['#2e2a2c', '#3d3739', '#4f4749'], speck: ['#1d1a1c', '#6a6264'] },
    path: { style: 'gravel', c: ['#8a8278', '#a1998e', '#b8afa3'], speck: ['#6a635a'] },
    plaza: { style: 'concrete', c: ['#9e9a94', '#b3afa8', '#c7c3bc'] },
    water: { c: ['#0e3f63', '#165a85', '#2479a8', '#4ea5c8'], foam: '#e6f6ff', spark: '#ffffff' },
    cliff: { style: 'strata', top: ['#6f8a3e', '#86a24c', '#9cb85e'], face: ['#7a4e34', '#94603f', '#ad7650'] },
    tree: 'ceiba', shrub: 'dry', building: 'mine', rock: ['#5a4a42', '#7a675c'],
    ambient: '#fff0e0', grade: 'linear-gradient(170deg, rgba(255,190,110,.18) 0%, rgba(60,40,60,.16) 100%)',
    particles: 'coal', sun: { x: 600, y: 30, color: '#ffc68a' }, transpose: -3
  },
  jepirachi: {
    name: 'Parque Eólico Jepírachi', time: 'Viento alisio',
    g0: { style: 'scrub', c: ['#b8704a', '#c9825a', '#d9966c'], speck: ['#7a9a4a', '#8f5236'] },
    g1: { style: 'sand', c: ['#d9b07c', '#e6c290', '#f0d4a6'], speck: ['#c4945e'] },
    path: { style: 'dirt', c: ['#a8805c', '#bb936c', '#cca67e'], speck: ['#8a643f'] },
    plaza: { style: 'concrete', c: ['#a9aaa8', '#bdbebc', '#d0d1cf'] },
    water: { c: ['#0d4a73', '#11679a', '#1d8fbf', '#4cc0d8'], foam: '#f2ffff', spark: '#ffffff' },
    cliff: { style: 'redcliff', top: ['#b8704a', '#c9825a', '#d9966c'], face: ['#8a3f2a', '#a34f33', '#bf6440'] },
    tree: 'scrub', shrub: 'scrub', building: 'station', rock: ['#9a5236', '#bf6c48'],
    ambient: '#ffffff', grade: 'linear-gradient(180deg, rgba(150,220,255,.14) 0%, rgba(255,200,140,.08) 100%)',
    particles: 'wind', sun: { x: 140, y: -20, color: '#ffffff' }, transpose: 2
  },
  cabo: {
    name: 'Cabo de la Vela · Jepirra', time: 'Crepúsculo violeta',
    g0: { style: 'sand', c: ['#d9a26c', '#e8b880', '#f2cc98'], speck: ['#c48a56', '#ffe2c0'] },
    g1: { style: 'dune', c: ['#c98f5e', '#d9a26c', '#e8b880'], speck: ['#b07a4c'] },
    path: { style: 'planks', c: ['#7a5236', '#946645', '#ad7c56'] },
    plaza: { style: 'planks', c: ['#7a5236', '#946645', '#ad7c56'] },
    water: { c: ['#2a2f78', '#3a4a9a', '#5a72b8', '#9aa6e0'], foam: '#ffe9f6', spark: '#ffd6f0' },
    cliff: { style: 'pilon', top: ['#a8724e', '#bf8660', '#d39a72'], face: ['#6a3a3a', '#844a46', '#9e5c54'] },
    tree: 'cardon', shrub: 'trupillo', building: 'ranch', rock: ['#8a5a4a', '#ad745e'],
    ambient: '#b49ad4', grade: 'linear-gradient(180deg, rgba(150,70,200,.3) 0%, rgba(255,110,140,.18) 55%, rgba(255,190,90,.12) 100%)',
    particles: 'stars', sun: { x: 40, y: 330, color: '#ff8fb0' }, night: true, transpose: -5
  },
  uniguajira: {
    name: 'Universidad de La Guajira', time: 'Noche en la Ciudadela',
    g0: { style: 'grass', c: ['#3f7a4a', '#4f9258', '#64a868'], speck: ['#a8d878'] },
    g1: { style: 'hedge', c: ['#2f5e38', '#3f7a4a', '#4f9258'], speck: ['#2a4a30'] },
    path: { style: 'concrete', c: ['#a6a8ab', '#babcbf', '#cfd1d4'] },
    plaza: { style: 'kanas', c: ['#e9dcc4', '#f6eddd', '#c2457a', '#2fb3a8', '#f2c14e'] },
    water: { c: ['#123a5a', '#1b5478', '#2a7499', '#56a8c8'], foam: '#e0f6ff', spark: '#ffffff' },
    cliff: { style: 'wall', top: ['#c9c2b8', '#dad4cb', '#ebe6de'], face: ['#7d7884', '#958f9b', '#aca6b2'] },
    tree: 'neem', shrub: 'hedge', building: 'campus', rock: ['#8a8790', '#aaa7b0'],
    ambient: '#8a90d0', grade: 'linear-gradient(180deg, rgba(40,60,160,.28) 0%, rgba(80,200,220,.1) 100%)',
    particles: 'data', sun: null, night: true, transpose: 0
  },
  villanueva: {
    name: 'Villanueva · Cerro Pintao', time: 'Mañana en la serranía',
    g0: { style: 'grass', c: ['#3f8a3e', '#55a64c', '#74c060'], speck: ['#ffd84e', '#ff9ec7', '#ffffff'] },
    g1: { style: 'coffee', c: ['#2f6a34', '#3f8a3e', '#55a64c'], speck: ['#c43a3a', '#2a4a24'] },
    path: { style: 'dirt', c: ['#9a6a42', '#b07e52', '#c49364'], speck: ['#7a5232'] },
    plaza: { style: 'stone', c: ['#a49a90', '#bcb2a6', '#d4cabd'] },
    water: { c: ['#1b5f78', '#25809a', '#3aa6b8', '#7fd6d8'], foam: '#f2ffff', spark: '#ffffff' },
    cliff: { style: 'mountain', top: ['#4f9a48', '#62b055', '#7cc668'], face: ['#6a5a74', '#84708c', '#9e88a4'] },
    tree: 'guamo', shrub: 'frailejon', building: 'colonial', rock: ['#7a6a80', '#9a88a0'],
    ambient: '#f4fbff', grade: 'linear-gradient(180deg, rgba(255,255,255,.2) 0%, rgba(140,220,180,.08) 60%, rgba(160,110,200,.12) 100%)',
    particles: 'mist', sun: { x: 100, y: -10, color: '#fffbe8' }, transpose: 7
  },
  macuira: {
    name: 'Serranía de la Macuira', time: 'Niebla perpetua',
    g0: { style: 'moss', c: ['#2f5a3a', '#3c7046', '#4f8a56'], speck: ['#8fd07a', '#e05a7a', '#2a4030'] },
    g1: { style: 'moss', c: ['#264a30', '#2f5a3a', '#3c7046'], speck: ['#6ab06a'] },
    path: { style: 'dirt', c: ['#6a5a42', '#7e6c50', '#927e60'], speck: ['#4f4230'] },
    plaza: { style: 'stone', c: ['#7a8478', '#8f998c', '#a4ae9f'] },
    water: { c: ['#1d4a50', '#276068', '#367c82', '#6aaab0'], foam: '#e6fff8', spark: '#ffffff' },
    cliff: { style: 'mossrock', top: ['#3c7046', '#4f8a56', '#66a46a'], face: ['#4a524e', '#5e6862', '#727e76'] },
    tree: 'cloud', shrub: 'fern', building: 'school', rock: ['#5a645e', '#7a867e'],
    ambient: '#dfe9ee', grade: 'linear-gradient(180deg, rgba(220,240,255,.28) 0%, rgba(160,210,190,.12) 100%)',
    particles: 'fog', sun: null, transpose: -1
  },
  puntagallinas: {
    name: 'Punta Gallinas · Dunas de Taroa', time: 'Tormenta de cinco colores',
    g0: { style: 'dune', c: ['#c9945a', '#dcab6c', '#ebc186'], speck: ['#b07c46'] },
    g1: { style: 'sand', c: ['#b8844e', '#c9945a', '#dcab6c'], speck: ['#9a6a3a'] },
    path: { style: 'marble', c: ['#d9d2c4', '#e9e3d6', '#f7f2e8'] },
    plaza: { style: 'marble', c: ['#d9d2c4', '#e9e3d6', '#f7f2e8'] },
    water: { c: ['#141a40', '#1f2a5a', '#2f4078', '#5a6aa8'], foam: '#e8e0ff', spark: '#b8fff0' },
    cliff: { style: 'dunecliff', top: ['#c9945a', '#dcab6c', '#ebc186'], face: ['#8a5a34', '#a46c40', '#bd8250'] },
    tree: 'none', shrub: 'dry', building: 'wax', rock: ['#8a6a54', '#a8846a'],
    ambient: '#7a6ab0', grade: 'linear-gradient(180deg, rgba(60,30,140,.32) 0%, rgba(40,200,180,.12) 50%, rgba(255,90,150,.14) 100%)',
    particles: 'storm', sun: null, night: true, transpose: -4
  }
};
