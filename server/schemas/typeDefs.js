const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    type Book {
        _id: ID
        authors: String
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
    type Auth {
        token: ID!
        user: User
    }
    type Query {
        user: User
        users: [User]
        user(username: String!): User
        books(username: String): [Book]
        book(_id: ID!): Book
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        createUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookId: ID!): User
        deleteBook(bookId: ID!): Book
    }
`;

module.exports = typeDefs;