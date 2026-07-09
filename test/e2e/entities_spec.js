/*
   MIT License
 
   Copyright 2023-2024 Kazuhito Suda
 
   This file is part of node-red-contrib-NGSI-LD
 
   https://github.com/lets-fiware/node-red-contrib-NGSI-LD
 
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:
 
   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.
 
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
 */

/* eslint-env node, mocha */

'use strict';

const { assert } = require('chai');
const axios = require('axios');
const { CONTEXT } = require('./constants');

const PAGINATION_ENTITY_COUNT = 202;

function buildPaginationEntities() {
  return Array.from({ length: PAGINATION_ENTITY_COUNT }, (_, i) => {
    const id = `urn:ngsi-ld:PaginationSensor:${String(i + 1).padStart(3, '0')}`;

    return {
      id,
      type: 'PaginationSensor',
      category: {
        type: 'Property',
        value: 'pagination'
      },
      temperature: {
        type: 'Property',
        value: i + 1,
        unitCode: 'CEL'
      }
    };
  });
}

async function http(options) {
  return new Promise(function (resolve, reject) {
    options.baseURL = 'http://127.0.0.1:1880';
    axios(options)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        if (axios.isAxiosError(error)) {
          if (typeof error.response !== 'undefined') {
            resolve(error.response);
          } else {
            reject(error);
          }
        } else {
          reject(error);
        }
      });
  });
}

describe('batch-operations.js', () => {
  describe('batch-operations node', () => {
    it('batch create entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-create',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: [
          {
            id: 'urn:ngsi-ld:TemperatureSensor:101',
            type: 'TemperatureSensor',
            category: {
              type: 'Property',
              value: 'sensor'
            },
            temperature: {
              type: 'Property',
              value: 20,
              unitCode: 'CEL'
            }
          },
          {
            id: 'urn:ngsi-ld:TemperatureSensor:102',
            type: 'TemperatureSensor',
            category: {
              type: 'Property',
              value: 'sensor'
            },
            temperature: {
              type: 'Property',
              value: 2,
              unitCode: 'CEL'
            }
          },
          {
            id: 'urn:ngsi-ld:TemperatureSensor:103',
            type: 'TemperatureSensor',
            category: {
              type: 'Property',
              value: 'sensor'
            },
            temperature: {
              type: 'Property',
              value: 100,
              unitCode: 'CEL'
            }
          }
        ]
      });

      assert.equal(actual.status, 201);
      assert.deepEqual(
        actual.data.sort(),
        ['urn:ngsi-ld:TemperatureSensor:101', 'urn:ngsi-ld:TemperatureSensor:102', 'urn:ngsi-ld:TemperatureSensor:103'].sort()
      );
    });
    it('read entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entities',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          type: 'TemperatureSensor'
        }
      });

      assert.equal(actual.status, 200);
      const expected = [
        {
          '@context': CONTEXT,
          id: 'urn:ngsi-ld:TemperatureSensor:101',
          type: 'TemperatureSensor',
          category: {
            type: 'Property',
            value: 'sensor'
          },
          temperature: {
            type: 'Property',
            value: 20,
            unitCode: 'CEL'
          }
        },
        {
          '@context': CONTEXT,
          id: 'urn:ngsi-ld:TemperatureSensor:102',
          type: 'TemperatureSensor',
          category: {
            type: 'Property',
            value: 'sensor'
          },
          temperature: {
            type: 'Property',
            value: 2,
            unitCode: 'CEL'
          }
        },
        {
          '@context': CONTEXT,
          id: 'urn:ngsi-ld:TemperatureSensor:103',
          type: 'TemperatureSensor',
          category: {
            type: 'Property',
            value: 'sensor'
          },
          temperature: {
            type: 'Property',
            value: 100,
            unitCode: 'CEL'
          }
        }
      ];
      assert.deepEqual(
        actual.data.sort((a, b) => a.id.localeCompare(b.id)),
        expected.sort((a, b) => a.id.localeCompare(b.id))
      );
    });
    it('batch delete entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/batch-delete',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: ['urn:ngsi-ld:TemperatureSensor:101', 'urn:ngsi-ld:TemperatureSensor:102', 'urn:ngsi-ld:TemperatureSensor:103']
      });

      assert.equal(actual.status, 204);
      assert.equal(actual.data, '');
    });
    it('read entities', async () => {
      const actual = await http({
        method: 'post',
        url: '/read-entities',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          type: 'TemperatureSensor'
        }
      });

      assert.equal(actual.status, 200);
      assert.deepEqual(actual.data, []);
    });
    it('read more than 100 entities through pagination', async () => {
      const entities = buildPaginationEntities();
      const ids = entities.map((entity) => entity.id);

      const create = await http({
        method: 'post',
        url: '/batch-upsert',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: entities
      });

      assert.include([201, 204], create.status);

      const actual = await http({
        method: 'post',
        url: '/read-entities-length',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: {
          type: 'PaginationSensor'
        }
      });

      assert.equal(actual.status, 200);
      assert.equal(Number(actual.data), PAGINATION_ENTITY_COUNT);

      const deleted = await http({
        method: 'post',
        url: '/batch-delete',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        data: ids
      });

      assert.equal(deleted.status, 204);
      assert.equal(deleted.data, '');
    });
  });
});
