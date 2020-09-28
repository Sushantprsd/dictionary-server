const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Entry{
        lexicalCategory:String! 
        definition:String!
        example:String!
        origin:String!
          
    }
    type Word{
        _id:String!
        key:String!  
        lexicalEntries:[Entry!]
    }
    input UserInputData {
        word: String!
    }
    type AllWords{
        data: [Word!]!
    }
    type RootQuery {
        getAllAddedWords:AllWords
        getOneWord(key:String):Word!
        getWords(key:String):AllWords!
       
    }
    type RootMutation {
        addWord(userInput: UserInputData): Word!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
