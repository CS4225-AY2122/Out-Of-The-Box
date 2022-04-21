/**
 * Seach anything within JSON object
 *
 * @param {JSON} data Valid JSON data
 * @param {string} query value to search
 *
 * @returns {null|*}
 */
function searchEngine(data, query) {
  function search(obj, query) {
    let getValueFromSearch = '';
    const enrichquery = query.toLowerCase();
    const [, searchByKey] = enrichquery.match(new RegExp(`@(.+):`)) || [];

    if (searchByKey) {
      getValueFromSearch = enrichquery.replace(/@(.+):/, '');
    }

    if (typeof obj === 'string') {
      if (obj.toLowerCase().match(new RegExp(enrichquery))) {
        return true;
      }
    }

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        if (
          (
            getValueFromSearch &&
            searchByKey &&
            searchByKey === key &&
            (value.toLowerCase()).match(new RegExp(getValueFromSearch))
          ) || (
            (value.toLowerCase()).match(new RegExp(enrichquery))
          )
        ) {
          return true;
        }
      }

      if (Array.isArray(value)) {
        if (
          (
            getValueFromSearch &&
            searchByKey &&
            searchByKey === key &&
            value.filter(el => search(el, getValueFromSearch)).length > 0
          ) || (
            value.filter(el => search(el, enrichquery)).length > 0
          )
        ) {
          return true;
        }
      } else if (typeof value === 'object' && value !== null) {
        if (search(value, query)) {
          return true
        }
      }
    }
  }

  return data.filter(item => search(item, query));
}

module.exports = searchEngine;
