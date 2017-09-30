'use strict';

module.exports = function(Ping) {
	Ping.random = function(callback) {
		const connector = Ping.app.dataSources.postgres.connector;
		const query = `SELECT * FROM public.ping
			WHERE verticalid = (SELECT * 
				FROM generate_series(
					(SELECT min(verticalid) FROM public.ping)::integer,
					(SELECT max(verticalid) FROM public.ping)::integer
				)
				ORDER BY random() LIMIT 1)::integer
			LIMIT 100`;

		connector.execute(query, (err, resultObjects) => {

			const pings = resultObjects.map(resultRaw => {

				const pingRaw = connector.fromRow('Ping', resultRaw);
				return new Ping(pingRaw);

			});
			callback(null, pings);
		})
	};

	Ping.partner_stats = function(id, callback) {
		const connector = Ping.app.dataSources.postgres.connector;
		const query = `SELECT partnerid, count(*) as cnt FROM public.ping
						WHERE partnerid = $1
						GROUP BY partnerid`;

		connector.execute(query, [id], (err, resultObjects) => {
			callback(null, resultObjects.pop());
		})
	};
	Ping.partners_stats = function(callback) {
		const connector = Ping.app.dataSources.postgres.connector;
		const query = `SELECT partnerid, count(*) as cnt FROM public.ping
						GROUP BY partnerid`;

		connector.execute(query, (err, resultObjects) => {
			callback(null, resultObjects);
		})
	};

	Ping.partner_stats_fast = function(id, callback) {
		const connector = Ping.app.dataSources.postgres.connector;
		const query = `SELECT partnerid, cnt FROM public.fasted_partner_stat WHERE partnerid = $1`;

		connector.execute(query, [id], (err, resultObjects) => {
			callback(null, resultObjects.pop());
		})
	};
	Ping.partners_stats_fast = function(callback) {
		const connector = Ping.app.dataSources.postgres.connector;
		const query = `SELECT partnerid, cnt FROM public.fasted_partner_stat`;

		connector.execute(query, (err, resultObjects) => {
			callback(null, resultObjects);
		})
	};
};
