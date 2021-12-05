const EntityNames = {
    "" : [],

    //plants
    "succulent" : [ "succulent" ],
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

const MeshColors = {
    //plants
    "succulent" : "#96E7A4",
    "cactus_body" : "#85E771", 
    "cactus_spikes" : "#FFFFFF",
    "tree_branches" : "#E7AB6E",
    "tree_leaves" : "#629E62" ,
    "bush" : "#7DB371",

    //rocks
    "rock_sml_0" : "#6F6C72",
    "rock_sml_1" : "#5E4C53",
    "rock_sml_2" : "#756A5A",

    "rock_med_0" : "#756A5A",
    "rock_med_1" : "#6F6C72",
    "rock_med_2" : "#5E4C53",

    "rock_big_0" : "#5E4C53",
    "rock_big_1" : "#756A5A",
    "rock_big_2" : "#6F6C72",

    //rakes
    "rake_straight" : "#D1B2A1", 
    "rake_straight_caps" : "#E7D4B5",
    "rake_flat" : "#D1B2A1",
    "rake_flat_caps" : "#E7D4B5",
    "rake_circle_big" : "#D1B2A1",
    "rake_circle_big_caps" : "#E7D4B5",
    "rake_circle_sml" : "#D1B2A1",
    "rake_circle_sml_caps" : "#E7D4B5",

    //sand
    "sand_flat" : "#FFFFFF",
    "sand_big_curve" : "#FFFFFF",
    "sand_sml_curve" : "#FFFFFF",
    "sand_straight" : "#FFFFFF",
    "sand_flat" : "#FFFFFF",

    //frames
    "frame_corner" : "#000000",
    "frame_inside" : "#000000",
    "frame_edge" : "#000000"
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
    "two_plucks",
    "riff",
    "strum",
    "ring",
    "sand_a",
    "sand_b",
    "sand_c",
    "snap_a",
    "snap_b"
];

const Dialogues = [
    { 
        //The HTML that will be displayed when the dialogue is used
        html: "<i>Hello World!</i>", 

        //Tags are the conditions for displaying the given HTML
        //Tags can use logical operators OR and AND, but parenthasis
        //are not supported. If no operators are specified, AND is assumed.
        tags: "clear or day"
    }
];
