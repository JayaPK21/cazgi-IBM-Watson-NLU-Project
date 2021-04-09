const express = require('express');
const dotenv = require('dotenv').config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    let nluInstance = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': {
                'targets': [
                    'apples',
                    'oranges'
                ]
            },
            'entities': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
            },
            'keywords': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
            }
        },
    };

    nluInstance.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            res.send(analysisResults);
        })
        .catch(err => {
            console.log('error:', err);
            res.send(err);
        });
});

app.get("/url/sentiment", (req,res) => {
    
    let nluInstance = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': {
                'targets': [
                    'stocks'
                ]
            },
            'entities': {
                'emotion': false,
                'sentiment': true,
                'limit': 2,
            },
            'keywords': {
                'emotion': false,
                'sentiment': true,
                'limit': 2,
            }
        },
    };

    nluInstance.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            res.send(analysisResults);
        })
        .catch(err => {
            console.log('error:', err);
        });
});

app.get("/text/emotion", (req,res) => {
    
    let nluInstance = getNLUInstance();
    
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': {
                'targets': [
                    'apples',
                    'oranges'
                ]
            },
            'entities': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
            },
            'keywords': {
                'emotion': true,
                'sentiment': false,
                'limit': 2,
            }
        },
    };

    nluInstance.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            res.send(analysisResults);
        })
        .catch(err => {
            console.log('error:', err);
        });
});

app.get("/text/sentiment", (req,res) => {
    let nluInstance = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': {
                'targets': [
                    'stocks'
                ]
            },
            'entities': {
                'emotion': false,
                'sentiment': true,
                'limit': 2,
            },
            'keywords': {
                'emotion': false,
                'sentiment': true,
                'limit': 2,
            }
        },
    };

    nluInstance.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            res.send(analysisResults);
        })
        .catch(err => {
            console.log('error:', err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

