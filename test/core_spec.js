/* eslint-env mocha */

import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {
  setEntries,
  next,
  vote,
} from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const
        state = Map(),
        entries = List(['Trainspotting', '28 Days Later']),
        nextState = setEntries(state, entries);

      expect(nextState).to.equal(fromJS({
        entries: ['Trainspotting', '28 Days Later'],
      }));
    });

    it('converts to immutable', () => {
      const
        state = Map(),
        entries = ['Trainspotting', '28 Days Later'],
        nextState = setEntries(state, entries);

      expect(nextState).to.equal(fromJS({
        entries: ['Trainspotting', '28 Days Later'],
      }));
    });
  });

  describe('next', () => {
    it('takes the next two entries under vote', () => {
      const
        state = fromJS({
          entries: ['Trainspotting', '28 Days Later', 'Sunshine'],
        }),
        nextState = next(state);

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
        },
        entries: ['Sunshine'],
      }));
    });

    it('puts the winner of the current vote back into entries', () => {
      const
        state = fromJS({
          vote: {
            pair: ['Trainspotting', '28 Days Later'],
            tally: {
              'Trainspotting': 4,
              '28 Days Later': 2,
            },
          },
          entries: ['Sunshine', 'Millions', '127 Hours'],
        }),
        nextState = next(state);

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Sunshine', 'Millions'],
        },
        entries: ['127 Hours', 'Trainspotting'],
      }));
    });

    it('puts both from tied vote back into entries', () => {
      const
        state = fromJS({
          vote: {
            pair: ['Trainspotting', '28 Days Later'],
            tally: {
              'Trainspotting': 3,
              '28 Days Later': 3,
            },
          },
          entries: ['Sunshine', 'Millions', '127 Hours'],
        }),
        nextState = next(state);

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Sunshine', 'Millions'],
        },
        entries: ['127 Hours', 'Trainspotting', '28 Days Later'],
      }));
    });

    it('marks the winner when just one entry remains', () => {
      const
        state = fromJS({
          vote: {
            pair: ['Trainspotting', '28 Days Later'],
            tally: {
              'Trainspotting': 4,
              '28 Days Later': 3,
            },
          },
          entries: [],
        }),
        nextState = next(state);

      expect(nextState).to.equal(fromJS({
        winner: 'Trainspotting',
      }));
    });
  });

  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const
        state = fromJS({
          vote: {
            pair: ['Trainspotting', '28 Days Later'],
          },
          entries: [],
        }),
        nextState = vote(state, '28 Days Later');

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            '28 Days Later': 1,
          },
        },
        entries: [],
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const
        state = fromJS({
          vote: {
            pair: ['Trainspotting', '28 Days Later'],
            tally: {
              'Trainspotting': 3,
              '28 Days Later': 2,
            },
          },
          entries: [],
        }),
        nextState = vote(state, '28 Days Later');

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 3,
            '28 Days Later': 3,
          },
        },
        entries: [],
      }));
    });
  });
});
