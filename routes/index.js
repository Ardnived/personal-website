var prismic = require('../prismic-helpers');
var moment = require('moment');

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

// -- Generate an iTunes XML feed.

exports.itunes = prismic.route(function(req, res, ctx) {
	var slug = req.url.substring(req.url.lastIndexOf('/')+1);

	ctx.api.form('podcast').query('[[:d = at(my.podcast.slug, "' + slug + '")]]').ref(ctx.ref).submit(function(err, podcasts) {
		if (err) { prismic.onPrismicError(err, req, res); return; }
		var podcast = podcasts.results[0];
		var image = podcast.fragments['podcast.illustration'].value.main.url;
		image = image.split(":");
		image[0] = "http";
		image = image.join(":");

		podcast.fragments['podcast.illustration'].value.main.url = image;

		res.render('itunes', {
			podcast: podcast,
			moment: moment
		});
	});
});
