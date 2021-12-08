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

const LevelTitles = [
    "Beginner",
    "Fledgling",
    "Novice",
    "Up-And-Coming",
    "Active",
    "Hard-Working",
    "Dilligent",
    "Notable",
    "Professional",
    "Expert",
    "Veteran",
    "Enlightened"
];

const Dialogues = [
    { 
        html:
        "\"Thunder is impressive, <br> but it is lightning that does the work.\" <br> - Mark Twain", 

        tag: "thunderstorm"
    },

    { 
        html:
        "\"Every storm runs out of rain, <br> just like every dark night turns into day.\" <br> - Gary Allan", 

        tag: "thunderstorm"
    },

    { 
        html:
        "\"Be the lightning bolt in the room: <br> the person with explosive energy which touches everyone. <br>\" - Elle Smith", 

        tag: "thunderstorm"
    },

    { 
        html:
        "\"If it rains, let it rain, <br> if the wind blows, let it blow. <br>\" - Ikkyu", 

        tag: "drizzle"
    },

    { 
        html:
        "\"Be like the earth. When the rain comes, <br> the earth simply opens up to the rain and soaks it all in.\" <br> - Thich Nhat Hanh", 

        tag: "drizzle"
    },

    { 
        html:
        "\"Remember that every drop of rain that falls <br> bears into the bosom of the earth a quality of beautiful fertility.\" <br> - George Henry Lewes", 

        tag: "drizzle"
    },

    { 
        html:
        "\"Zen is not some kind of excitement, <br> but concentration on our usual everyday routine.\" — Shunryu Suzuki", 

        tag: "clear"
    },

    { 
        html:
        "\"As rain falls equally on the just and the unjust, <br> do not burden your heart with judgments but rain your kindness equally on all. \" <br> - Gautam Buddha", 

        tag: "rain"
    },

    { 
        html:
        "\"In the same way that rain breaks into a house with a bad roof, <br> desire breaks into the mind that has not been practising meditation.\" <br> - Gautam Buddha", 

        tag: "rain"
    },

    { 
        html:
        "\"Advice is like snow. <br> The softer it falls, the longer it dwells upon and the deeper in sinks into the mind.\" <br> - Samuel Taylor ", 

        tag: "snow"
    },

    { 
        html:
        "\"Silently, like thoughts that come and go, <br> that snowflakes fall, each one a gem.\" <br> - William Hamilton Gibson", 

        tag: "snow"
    },

    { 
        html:
        "\"Kindness is like snow - <br> it beautifies everything it covers.\" <br> - Khalil Gibran", 

        tag: "snow"
    },

    { 
        html:
        "\"All are flowers in the sky. <br> Nameless and formless, I leave birth-and-death.\" <br> - P'ang Yun (Ho Un)", 

        tag: "clear"
    },

    { 
        html:
        "\"Wherever you go, no matter what the weather, <br> always bring your own sunshine.\" <br> - Anthony J. D'Angelo ", 

        tag: "thunderstorm"
    },

    { 
        html:
        "\"If you want to see the sunshine, <br> you have to weather the storm.\" <br> - Frank Lane ", 

        tag: "rain"
    },

    { 
        html:
        "\"Clouds are on top for a reason. <br> They float so high because they refuse to carry any burden.\" <br> - Jasleen Kaur Gumber", 

        tag: "clouds"
    },

    { 
        html:
        "\"What is eternal is the cloud drifting slowly out of sight.\" <br> - Marty Rubin", 

        tag: "clouds"
    },

    { 
        html:
        "\"Clouds come floating into my life. <br> No longer to carrry rain or usher storm. but to add color to my sunset sky.\" <br> - Rabindranath Tagore", 

        tag: "clouds"
    },

    { 
        html:
        "\"Every sunrise is an invitation for us to arise and brighten someone’s day.\" <br> - Jhiess Krieg", 

        tag: "dawn"
    },

    { 
        html:
        "\"The world is always young again for just a few moments at the dawn.\" <br> - Lucy Maud Montgomery", 

        tag: "dawn"
    },

    { 
        html:
        "\"When you arise in the morning, <br> think of what a precious privilege it is to be alive – <br> to breathe, to think, to enjoy, to love.\" <br> - Marcus Aurelius", 

        tag: "morning"
    },

    { 
        html:
        "\"When you contemplate the big, full sunrise, <br> the more mindful and concentrated you are, the more the beauty of the sunrise is revealed to you.\" <br> - Thich Nhat Hanh", 

        tag: "morning"
    },

    { 
        html:
        "\"Each morning we are born again. <br> What we do today is what matters most.\" <br> - Gautam Buddha", 

        tag: "morning"
    },

    { 
        html:
        "\"The True purpose of Zen is to see things as they are, <br> and to let everything go as it goes.\" <br> - Shunryu Suzuki", 

        tag: "day"
    },

    { 
        html:
        "\"Those who can sit perfectly physically usually take more time to obtain the tru way of Zen, <br> the actual feeling of Zen, the marrow of Zen.\" <br> - Shunryu Suzuki", 

        tag: "day"
    },

    { 
        html:
        "\"Mindfulness helps you go home to the present. <br> And every time you go there and recognize a condition of happiness that you have, happiness comes.\" <br> - Thich Nhat Hanh", 

        tag: "day"
    },

    { 
        html:
        "\"At the end of the day, I'm at peace, <br> because my intentions are good and my heart is pure.\" <br> - Unknown", 

        tag: "evening"
    },

    { 
        html:
        "\"Take a deep breath, relax and let go of your worries. <br> Let the soothing essence of the night permeate and cleanse your entire being, <br> slowly drawing you into deep, relaxing slumber.\" <br> - Unknown ", 

        tag: "night"
    },

    { 
        html:
        "\"Begin to see what is in front of you, <br> rather than what you learned is there.\" <br> - Stephen C. Paul", 

        tag: "evening"
    },

    { 
        html:
        "\"Night is always darker before the dawn and life is the same, <br> the hard times will pass, <br> everything will get better and sun will shine brighter than ever.\" <br>- Ernest Hemingway", 

        tag: "night"
    },

    { 
        html:
        "\"Day is over, night has come. Today is gone, what's done is done. <br> Embrace your dreams, through the night. Tomorrow comes with a whole new light.\" <br> - George Orwell", 

        tag: "night"
    },

    { 
        html:
        "\"Take a deep breath, relax and let go of your worries. <br> Let the soothing essence of the night permeate and cleanse your entire being, <br> slowly drawing you into deep, relaxing slumber.\" <br> - Unknown ", 

        tag: "night"
    }
];
