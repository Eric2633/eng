const modules = require(require('path').resolve(process.cwd(), 'modules.js'));
const App = modules.app;

function loader(Module) {
    var express = require('express');
    var router = express.Router();
    router.all('/:fn*', function (req, res, next) {
        if (process.env.NODE_ENV === 'development') {
            res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8081');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
        }
        next();
    });

    router.post('/:fn', function (req, res) {
        (async () => {
            try {
                let module = new Module(req.session);
                let fn = req.params.fn;
                if (module[fn]) res.json((await module[fn](Object.assign({}, req.body))));
                else if (Module[fn]) res.json((await Module[fn](Object.assign({}, req.body))));
                else throw (module.error.param);
            } catch (err) {
                return res.json(App.err(err));
            }
        })();
    });

    router.get('/:fn/:param', function (req, res) {
        (async () => {
            try {
                let module = new Module(req.session);
                let fn = req.params.fn;
                let param = req.params.param;
                let ret = null;
                if (module[fn]) ret = res.json((await module[fn](param)));
                else if (Module[fn]) ret = res.json((await Module[fn](param)));
                else throw (module.error.param);
                return ret;
            } catch (err) {
                return res.json(App.err(err));
            }
        })();
    });

    router.get('/:fn', function (req, res) {
        (async () => {
            try {
                let module = new Module(req.session);
                let fn = req.params.fn;
                let param = req.query;
                if (module[fn]) res.json((await module[fn](param)));
                else if (Module[fn]) res.json((await Module[fn](param)));
                else throw (module.error.param);
            } catch (err) {
                return res.json(App.err(err));
            }
        })();
    });
    
    return router;
}
module.exports = loader;