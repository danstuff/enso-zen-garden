const EntityNames = {
    "" : [],

    //plants
    "flower" : [ "flower_core", "flower_leaves" ],
    "cactus" : [ "cactus_body", "cactus_spikes" ],
    "tree" : [ "tree_branches", "tree_leaves" ],
    "bush" : [ "bush" ],

    //rocks
    "rock_sml_0" : [ "rock_sml_0" ],
    "rock_sml_1" : [ "rock_sml_1" ],
    "rock_sml_2" : [ "rock_sml_2" ],

    "rock_med_0" : [ "rock_med_0" ],
    "rock_med_1" : [ "rock_med_1" ],
    "rock_med_2" : [ "rock_med_2" ],

    "rock_big_0" : [ "rock_big_0" ],
    "rock_big_1" : [ "rock_big_1" ],
    "rock_big_2" : [ "rock_big_2" ],

    //rakes
    "rake_straight" : [ "rake_straight", "rake_straight_caps" ],
    "rake_flat" : [ "rake_flat", "rake_flat_caps" ],
    "rake_circle_big" : [ "rake_circle_big", "rake_circle_big_caps" ],
    "rake_circle_sml" : [ "rake_circle_sml", "rake_circle_sml_caps" ]
};

const PlantTypes = [
    {
        name: "succulents",
        entity: "succulent"
    },

    {
        name: "cacti",
        entity: "cactus"
    },

    {
        name: "trees",
        entity: "tree"
    },

    {
        name: "bushes",
        entity: "bush"
    }
];

const RockTypes = [
    {
        name: "pebbles",
        entities: ["rock_sml_0", "rock_sml_1", "rock_sml_2"]
    },
    {
        name: "stones",
        entities: ["rock_med_0", "rock_med_1", "rock_med_2"]
    },
    {
        name: "boulders",
        entities: ["rock_big_0", "rock_big_1", "rock_big_2"]
    },
    {
        name: "statues",
        entities: [ ]
    }
];

const RakeTypes = [
    {
        name: "straight rake",
        entity: "rake_straight",
        sand: "sand_straight"
    },

    {
        name: "flat rake",
        entity: "rake_flat",
        sand: "sand_flat"
    },

    {
        name: "circle rake",
        entity: "rake_circle_big",
        sand: "sand_big_curve"
    },

    {
        name: "small circle rake",
        entity: "rake_circle_sml",
        sand: "sand_sml_curve"
    }
];

const SoundEffects = [
    "one_pluck",
    "one_pluck_low",
    "one_pluck_high",
    "two_plucks",
    "riff",
    "strum",
    "ring",
    "ring_low",
    "ring_high",
    "sand_a",
    "sand_b",
    "sand_c"
];
