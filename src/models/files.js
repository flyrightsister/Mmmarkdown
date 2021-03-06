const db = require('./db');

// bds: hooray for jsdoc :-D
/**
 * Get all files from db
 * @return {Promise} - Promise resolving to array of objects,
 *                     each representing a file
 */
const listAllFiles = () => {
  const query = `
    SELECT *
    FROM files
    ORDER BY modified_at DESC;
  `;
  return db.any(query);
};

// bds: see http://usejsdoc.org/tags-param.html (search for 
// bds: "Documenting a destructuring parameter") for how to do this properly with JSDoc: 
/**
 * Upsert specified file
 * @param  {object} - object with string properties 'name' and 'content'
 *                  - name: the name of the new file
 *                  - content: content of the new file
 * @return {Promise} - Promise resolving to an object representing the file
 */

// bds: very nice: destructuring the argument, and the upsert command. :-)
const saveFile = ({ name, newFile }) => {
  // bds: consider using named parameters instead of numbered parameters here, for clarity
  const upsertQuery = `
    INSERT INTO files (name, content)
    VALUES ($1, $2)
      ON CONFLICT (name)
      DO UPDATE
      SET name = $1
      RETURNING *
  `;
  return db.one(upsertQuery, [name, newFile]);
};

// bds: see http://usejsdoc.org/tags-param.html (search for "Multiple types 
// bds: and repeatable parameters") for how to do this in JSDoc
/**
 * Get content for specified file ID
 * @param  {string or number} fileID id of file to retrieve
 * @return {Promise} - Promise resolving to object with the key 'content'
 */
const getFileContent = fileID => {
  const query = `
    SELECT content
    FROM files
    WHERE id = $1
  `;
  return db.one(query, [fileID]);
};

// bds: JSDoc formatting: no brackets, and all descriptions start with a capital
// bds: letter and end with a period (e.g. New contents.)
/**
 * Update contents of file
 * @param  {string or number} fileID  [id of file to update]
 * @param  {string}  newContent [new contents]
 * @return {Promise} Promise resolving to object with file data
 */
const updateFileContent = (fileID, newContent) => {
  const query = `
    UPDATE files
    SET content = $2
    WHERE id = $1
    RETURNING *;
  `;
  return db.one(query, [fileID, newContent]);
};

/**
 * Delete a file
 * @param  {string or number} fileID  [id of file to delete]
 */
const deleteFile = fileID => {
  const query = `
    DELETE FROM files
    WHERE id = $1
  `;
  return db.none(query, [fileID]);
};

module.exports = {
  listAllFiles,
  saveFile,
  getFileContent,
  updateFileContent,
  deleteFile
};
