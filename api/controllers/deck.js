'use strict';

const _ = require('lodash');
const db = require('../../db');

module.exports = {
  createDeck,
  listDecks,
  retrieveDeck,
  patchDeck,
  deleteDeck
};

function createDeck(request, response) {
  (async function() {

    let insertResult = undefined;
    const attributes = request.body.data.attributes;
    const data = Object.assign({}, attributes, {
      owner_id: request.credentials.id
    });

    try {
      insertResult = await db.insert(data)
                             .into('deck')
                             .returning('*');
    } catch(err) {
      return response.status(400)
                     .json({
                       message: err
                     });
    }

    if (insertResult.length) {
      const row = insertResult[0];

      return response.json({
        data: {
          type: 'deck',
          id: row.id,
          attributes: _.omit(row, 'id')
        }
      });
    }

    response.status(400).end();
  }());
}

function listDecks(request, response) {
  (async function() {
    
    let selectResult = undefined;
    let owner_id = request.credentials.id;

    try {
      selectResult = await db.select('*')
                             .from('deck')
                             .where({
                               owner_id,
                             });
    } catch(err) {
      console.error(err);
      return response.status(400)
                     .json({
                       message: err
                     });
    }

    if (selectResult.length) {
      return response.json({
        data: selectResult.map(row => {
          return {
            type: 'deck',
            id: row.id,
            attributes: _.omit(row, 'id')
          };
        })
      });
    } else {
      return response.status(400).end();
    }

  }());
}

function retrieveDeck(request, response) {
  (async function() {
    const id = request.swagger.params.id.value;
    const owner_id = request.credentials.id;
    let selectResult = undefined;

    try {
      selectResult = await db.select('*')
                             .from('deck')
                             .where({
                               id,
                               owner_id
                             });
    } catch(err) {
      console.error(err);
      return response.status(400).json({ message: err });
    }

    if (selectResult.length) {
      const row = selectResult[0];

      return response.json({
        data: {
          type: 'deck',
          id: row.id,
          attributes: _.omit(row, 'id')
        }
      });
    } else {
      return response.status(400).end();
    }
  }());
}

function patchDeck(request, response) {
  (async function() {
    const id = request.swagger.params.id.value;
    const payload = request.body;
    const owner_id = request.credentials.id;
    let updateResult = undefined;

    try {
      updateResult = await db.update(payload.data.attributes)
                             .from('deck')
                             .where({
                               id,
                               owner_id
                             })
                             .returning('*');
    } catch(err) {
      console.error(err);
      return response.status(400).json({ message: err });
    }

    if (updateResult.length) {
      const row = updateResult[0];

      return response.json({
        data: {
          type: 'deck',
          id: row.id,
          attributes: _.omit(row, 'id')
        }
      });
    } else {
      return response.status(400).end();
    }
  }());
}

function deleteDeck(request, response) {
  (async function() {
    const id = request.swagger.params.id.value;
    const owner_id = request.credentials.id;

    try {
      let anything = await db.del()
                             .from('deck')
                             .where({
                               id,
                               owner_id
                             });
      return response.status(204).end();
    } catch(err) {
      return response.status(400).end();
    }
  }());
}
