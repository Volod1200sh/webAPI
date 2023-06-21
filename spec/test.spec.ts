import fs from 'fs';
import assert from 'assert';
const dropboxV2Api = require('dropbox-v2-api');

const TOKEN ='sl.BgpKRKml7jxSPxlu4sO4YLzuglIiAk19OdAsBNe5-LeJ3UOmSP9v4mcLSVug6ZaPpZoO-Rwab3PwxxaOGD9wJg2EsI8JlTSYYN_kCHkVdB4gxMRB8tqFLUJUObExiJGteTjCSDmJ';

let dropbox = dropboxV2Api.authenticate({
    token: TOKEN,
});

describe("Dropbox web API requests:", () => {
    const testFileName = "testFile.txt";
    const filePath = 'files/testFile.txt';
    const dbxPath = '/testFile.txt';
    const expectedResult1 = 200;
    const expectedResult2 = 409;

    it("Uploading test file", (done) => {
    dropbox(
      {
        resource: 'files/upload',
        parameters: {
          path: dbxPath,
        },
            readStream: fs.createReadStream(filePath),
      },
        (err, result, response) => {
            if (err) { throw err; }
            assert.strictEqual(response.statusCode, expectedResult1);
            assert.strictEqual(response.body.name, testFileName);
            done();
      }
    );
  });

    it("Getting metadata", (done) => {
    dropbox(
      {
        resource: 'files/get_metadata',
        parameters: {
            path: dbxPath,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false
        },
      },
        (err, result, response) => {
            if (err) { throw err; }
            assert.strictEqual(response.statusCode, expectedResult1);
            assert.strictEqual(response.body.name, testFileName);
            done();
      }
    );
  });

    it("Getting missing metadata ", (done) => {
    dropbox(
      {
        resource: 'files/get_metadata',
        parameters: {
            path: '/incorrect-test.txt',
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false
        },
      },
      (err, result, response) => {
          assert.strictEqual(response.statusCode, expectedResult2);
          expect(response.body.error_summary).toContain('path/not_found/');
          done();
      }
    );
  });

    it("Deleting", (done) => {
    dropbox(
      {
        resource: 'files/delete_v2',
        parameters: {
          path: dbxPath,
        },
      },
        (err, result, response) => {
          if (err) { throw err; }
          assert.strictEqual(response.statusCode, expectedResult1);
          assert.strictEqual(response.body.metadata.name, testFileName);
          done();
      }
    );
  });
});
