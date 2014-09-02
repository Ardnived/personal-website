var prismic = require('../prismic-helpers');

// -- Display all documents

exports.index = prismic.route(function(req, res, ctx) {
	ctx.api.form('game').ref(ctx.ref).submit(function(err, docs_game) {
		if (err) { prismic.onPrismicError(err, req, res); return; }

		ctx.api.form('roleplay').ref(ctx.ref).submit(function(err, docs_roleplay) {
			if (err) { prismic.onPrismicError(err, req, res); return; }
		
			ctx.api.form('code').ref(ctx.ref).submit(function(err, docs_code) {
				if (err) { prismic.onPrismicError(err, req, res); return; }

				res.render('index', {
					docs_game: docs_game,
					docs_roleplay: docs_roleplay,
					docs_code: docs_code
				});
			});
		});
	});
});

// -- Display a given document

exports.detail = prismic.route(function(req, res, ctx) {
	var id = req.params['id'],
		slug = req.params['slug'];

	prismic.getDocument(ctx, id, slug, 
		function(err, doc) {
			if (err) { prismic.onPrismicError(err, req, res); return; }
			res.render('detail', {
				doc: doc
			});
		},
		function(doc) {
			res.redirect(301, ctx.linkResolver(ctx, doc));
		},
		function(NOT_FOUND) {
			res.send(404, 'Sorry, we cannot find that!');
		}
	);
});

// -- Search in documents

exports.search = prismic.route(function(req, res, ctx) {
	var q = req.query['q'];

	if(q) {
		ctx.api.form('everything').set("page", req.param('page') || "1").ref(ctx.ref)
					 .query('[[:d = fulltext(document, "' + q + '")]]').submit(function(err, docs) {
			if (err) { prismic.onPrismicError(err, req, res); return; }
			res.render('search', {
				docs: docs,
				url: req.url
			});
		});
	} else {
		res.render('search', {
			docs: null,
			url: req.url
		});
	}
});
