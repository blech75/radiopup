var mongoose = require('mongoose');

var GraphQL = require('graphql');
var GraphQLCompose = require('graphql-compose');
var GraphQLComposeMongoose = require('graphql-compose-mongoose');

var Song = require('./mongoose-models/song');
var SongTC = GraphQLComposeMongoose.composeWithMongoose(Song);

GraphQLCompose.GQC.rootQuery().addFields({
  songById: SongTC.getResolver('findById'),
  songByIds: SongTC.getResolver('findByIds'),
  songOne: SongTC.getResolver('findOne'),
  songMany: SongTC.getResolver('findMany'),
  songCount: SongTC.getResolver('count'),
  songConnection: SongTC.getResolver('connection'),
  songPagination: SongTC.getResolver('pagination'),
});

module.exports = GraphQLCompose.GQC.buildSchema();
