const axios = require("axios");
const Word = require("../models/Word");

module.exports = {
    user: async () => {
        const URL =
            "https://od-api.oxforddictionaries.com/api/v2/entries/en/hello?fields=etymologies,examples,variantForms,definitions";

        let response = await axios.get(
            URL,

            {
                headers: { app_id: "2187aa5d", app_key: "770f8c05623bf95b3c6ea3693b5cf545" },
            },
        );
        if (response) {
            console.log(response.data.results[0].lexicalEntries);
            return {
                data: "hello",
            };
        } else {
            return {
                data: "hellp",
            };
        }
    },

    addWord: async ({ userInput }, req) => {
        const word = userInput.word;
        const existingWord = await Word.findOne({ key: word });
        if (existingWord) {
            const error = new Error("Word exists already!");
            throw error;
        }
        const URL = `https://od-api.oxforddictionaries.com/api/v2/entries/en/${word}?fields=etymologies,examples,variantForms,definitions`;

        let response = null;
        try {
            response = await axios.get(
                URL,

                {
                    headers: { app_id: "2187aa5d", app_key: "770f8c05623bf95b3c6ea3693b5cf545" },
                },
            );
        } catch (err) {
            console.log(err.response.statusText);
            const error = new Error(err.response.statusText);
            error.code = 404;
            throw error;
        }
        if (!response) {
            const error = new Error("Word not found.");
            error.code = 401;
            throw error;
        }
        let entries = response.data.results[0].lexicalEntries;

        let newEntries = entries.map((entry) => {
            let lexicalCategory = "NA";
            let definition = "NA";
            let example = "NA";
            let origin = "NA";
            if (entry.lexicalCategory.id) {
                lexicalCategory = entry.lexicalCategory.id;
            }
            if (entry.entries[0].senses[0].definitions) {
                definition = entry.entries[0].senses[0].definitions[0];
            }
            if (entry.entries[0].senses[0].examples) {
                example = entry.entries[0].senses[0].examples[0].text;
            }
            if (entry.entries[0].etymologies) {
                origin = entry.entries[0].etymologies[0];
            }

            return {
                lexicalCategory: lexicalCategory,
                definition: definition,
                example: example,
                origin: origin,
            };
        });

        const newWord = new Word({
            key: response.data.results[0].id,
            lexicalEntries: newEntries,
        });
        const createdWord = await newWord.save();
        return {
            ...createdWord._doc,
            _id: createdWord._id.toString(),
        };
    },
    getAllAddedWords: async () => {
        let allWords = await Word.find().sort("key");
        allWords = allWords.map((w) => {
            return {
                ...w._doc,
                _id: w._id.toString(),
            };
        });
        return {
            data: allWords,
        };
    },
    getOneWord: async ({ key }) => {
        let word = await Word.findOne({ key: key });
        return {
            ...word._doc,
            _id: word._id.toString(),
        };
    },
    getWords: async ({ key }) => {
        let allWords = await Word.find({
            key: {
                $regex: new RegExp(key),
            },
        }).sort("key");
        allWords = allWords.map((w) => {
            return {
                ...w._doc,
                _id: w._id.toString(),
            };
        });
        return {
            data: allWords,
        };
    },
};
