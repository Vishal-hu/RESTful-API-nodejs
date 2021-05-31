const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyparser.urlencoded({ extended: true }));
const dbURL = "mongodb://127.0.0.1:27017/wikiDB";
mongoose
    .connect(dbURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection Successful");
    })
    .catch(() => {
        console.log("Not connected to the database");
    });
const articleSchema = mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model("article", articleSchema);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello");
});

/////////// Routes for  Everything /////////////
app
    .route("/articles")

.get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            res.send(err);
        } else {
            res.send(foundArticles);
        }
    });
})

.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
    });
    newArticle.save((err) => {
        if (!err) {
            res.send("Data successfully saved");
        } else {
            res.send("Problem in saving data", err);
        }
    });
})

.delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Data deleted successfully");
        } else {
            res.send(err);
        }
    });
});
/////////// Routes for  single thing /////////////

app
    .route("/articles/:articleTitle")

.get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("Not found");
        }
    });
})

.put((req, res) => {
        Article.update({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true },
            (err) => {
                if (!err) {
                    res.send("Successfully Updated data");
                } else {
                    res.send("Problem in updating data");
                }
            }
        );
    })
    .patch((req, res) => {
        Article.update({ title: req.params.articleTitle }, { $set: req.body },
            (err) => {
                if (!err) {
                    res.send("Successfully updated");
                } else {
                    res.send("Not updated");
                }
            }
        );
    })

.delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
        if (!err) {
            res.send("Successfully deleted");
        } else {
            res.send(err);
        }
    });
});

app.listen(port, () => {
    console.log("Listening to port", port);
});