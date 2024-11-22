import hydrogen from '../dist/hydrogen.js';

const hydro_init = hydrogen.cwrap('hydro_init');
const hydro_random_u32 = hydrogen.cwrap('hydro_random_u32');

var result = hydrogen.onRuntimeInitialized = () => {
  console.log(hydro_init());
  console.log(hydro_random_u32());
  console.log(hydro_random_u32());
  console.log(hydro_random_u32());
  console.log(hydro_random_u32());
  console.log(hydro_random_u32());
}
