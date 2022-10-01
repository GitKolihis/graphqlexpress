const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLBoolean,
} = require("graphql");

const app = express();

const books = [
  {
    id: 1,
    name: "Amnis Tech Book 1",
    description: "Testing Express with GraphQL",
    authorId: 1,
  },
  {
    id: 2,
    name: "Amnis Tech Book 2",
    description: "Testing Express with GraphQL",
    authorId: 1,
  },
  {
    id: 3,
    name: "Amnis Tech Book 3",
    description: "Testing Express with GraphQL",
    authorId: 2,
  },
  {
    id: 4,
    name: "Amnis Tech Book 4",
    description: "Testing Express with GraphQL",
    authorId: 2,
  },
  {
    id: 5,
    name: "Amnis Tech Book 5",
    description: "Testing Express with GraphQL",
    authorId: 3,
  },
];

const authors = [
  { id: 1, name: "Adelani Olanrewaju" },
  { id: 2, name: "Adelani Israel" },
  { id: 3, name: "Adelani Kolihis" },
];

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "HelloEndpont",
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => "HelloEndpont",
      },
    }),
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (books) => {
        return authors.find((author) => author.id === books.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents a author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
    book: {
      type: BookType,
      description: "A Single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    author: {
        type: AuthorType,
        description: "A Single Author",
        args: {
          id: { type: GraphQLInt },
        },
        resolve: () => (parent, args) => authors.find((author) => author.id === args.id)
      },
  }),
});

const bookSchema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: bookSchema,
    graphiql: true,
  })
);
app.listen(5000, () => console.log("Server is Running..."));
