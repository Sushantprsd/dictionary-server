require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolver");
var cors = require("cors");

let PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGOODB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cors());
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
            next();
        });
        // app.get("/", (req, res, next) => {
        //     res.status(200).json({
        //         message: "working",
        //     });
        // });

        app.use(
            "/graphql",
            graphqlHTTP({
                schema: graphqlSchema,
                rootValue: graphqlResolver,
                graphiql: true,
                customFormatErrorFn(err) {
                    if (!err.originalError) {
                        return err;
                    }

                    const data = err.originalError.data;
                    const message = err.message || "An error occurred.";
                    const code = err.originalError.code || 500;
                    return { message: message, status: code, data: "somedata" };
                },
            }),
        );

        app.listen(PORT, () => {
            console.log("server started at http://localhost:5000");
        });
    })
    .catch((err) => {
        console.log(err);
    });