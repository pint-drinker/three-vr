// Scene configuration constants
export const SCENE_CONFIG = {
  // Forest layout
  FOREST_SIZE: 50,
  TREE_COUNT: 15,
  MUSHROOM_COUNT: 20,
  GRASS_DENSITY: 100,

  // Interaction distances
  GRAB_DISTANCE: 2.0, // Distance for direct grab (meters)
  RAY_GRAB_DISTANCE: 10.0, // Max distance for ray grab
  HOVER_DISTANCE: 3.0, // Distance for tree hover detection

  // Animation speeds
  PULL_SPEED: 0.1, // Speed for pulling mushrooms closer
  POP_OUT_SPEED: 0.05, // Speed for cylinder pop-out animation
  POP_OUT_DISTANCE: 2.0, // How far cylinders pop out

  // Visual settings
  MUSHROOM_SCALE: 0.3,
  TREE_SCALE: 1.5,
  CYLINDER_HEIGHT: 1.0,
  CYLINDER_RADIUS: 0.2,
} as const;

// Mushroom types with info
export const MUSHROOM_TYPES = [
  { name: 'Fly Agaric', description: 'A classic red mushroom with white spots. Poisonous but beautiful.' },
  { name: 'Porcini', description: 'A delicious edible mushroom, highly prized in cooking.' },
  { name: 'Chanterelle', description: 'Golden yellow mushroom with a fruity aroma.' },
  { name: 'Morel', description: 'Honeycomb-like cap, a spring delicacy.' },
  { name: 'Shiitake', description: 'Umami-rich mushroom popular in Asian cuisine.' },
] as const;

// Tree types with info
export const TREE_TYPES = [
  { name: 'Oak', description: 'A mighty oak tree, home to many forest creatures.' },
  { name: 'Pine', description: 'Evergreen conifer with needle-like leaves.' },
  { name: 'Birch', description: 'White-barked tree with distinctive markings.' },
  { name: 'Maple', description: 'Known for its beautiful autumn colors.' },
] as const;

