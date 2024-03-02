import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// db
let sections = [
    {
        id: "1",
        name: "Shopping",
    },
    {
        id: "2",
        name: "Events",
    },
];
let notes = [
    {
        id: "1",
        title: "Shopping list",
        rating: 5,
        content: "Apple, orange, bread",
        section_id: "1",
    },
    {
        id: "2",
        title: "Events on March",
        rating: 2,
        content: "Muse Concert",
        section_id: "2",
    },
    {
        id: "3",
        title: "Zalando shopping",
        rating: 1,
        content: "Jeans, t-shirt",
        section_id: "1",
    },
];
// types definitions
export const typeDefs = `#graphql
type Section {
    id: ID!
    name: String!
    notes: [Note!]
}
type Note {
    id: ID!
    title: String!
    rating: Int!
    content: String
}
type Query {
    sections: [Section]
    section(id: ID!): Section
    notes: [Note]
    note(id: ID!): Note
}
type Mutation {
    addNote(note: AddNoteInput): Note
    deleteNote(id: ID!): [Note]
    updateNote(id: ID!, edits: EditNoteInput!): Note 
}
input AddNoteInput {
    title: String!
    rating: Int!
    content: String
}
input EditNoteInput {
    title: String
    rating: Int
    content: String
}
`;
// resolvers
const resolvers = {
    // queries
    Query: {
        sections() {
            return sections;
        },
        section(_, args) {
            const singleSection = sections.find((section) => section.id === args.id);
            return singleSection;
        },
        notes() {
            return [...notes];
        },
        note(_, args) {
            const singleNote = notes.find((note) => note.id === args.id);
            return singleNote;
        },
    },
    // section related data
    Section: {
        notes(parent) {
            return notes.filter((note) => note.section_id === parent.id);
        },
    },
    // mutations
    Mutation: {
        addNote(_, args) {
            const newNote = {
                ...args.note,
                id: Math.floor(Math.random() * 1000).toString(),
            };
            notes.push(newNote);
            return newNote;
        },
        updateNote(_, args) {
            notes = notes.map((note) => {
                if (note.id === args.id) {
                    return { ...note, ...args.edits };
                }
                return note;
            });
            return notes.find((note) => note.id === args.id);
        },
        deleteNote(_, args) {
            return notes.filter((note) => note.id !== args.id);
        },
    },
};
// server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log("Server ready at the port:", url);
